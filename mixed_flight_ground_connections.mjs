// On-demand air+ground connector for a flight the passenger selected.
// It re-discovers airports from real geography, resolves IANA time zones,
// then asks already-authorized ground timetable planners on BOTH sides.
// No fixed airport/city routes, invented ground legs, or booking claims.
import {discoverAirportCandidates} from './mixed_airport_discovery.mjs';
import {planTransCAPIJourney} from './uk_national_transit.mjs';

const validPoint=p=>p&&p.latitude!=null&&p.longitude!=null&&
 Number.isFinite(Number(p.latitude))&&Number.isFinite(Number(p.longitude))&&
 Math.abs(Number(p.latitude))<=90&&Math.abs(Number(p.longitude))<=180;
const iata=s=>/^[A-Z]{3}$/.test(String(s||''));
const localTime=s=>/^\d{4}-\d{2}-\d{2} [012]\d:[0-5]\d$/.test(String(s||''))&&
 Number(String(s).slice(11,13))<24;
const validIso=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)&&
 /(Z|[+-]\d{2}:\d{2})$/.test(s)&&Number.isFinite(Date.parse(s));
// Keep the source's walking duration and distance on the wire. Previously
// these were discarded, leaving the selected journey with only station names.
export const compactJourney=j=>{
 const legs=Array.isArray(j?.legs)?j.legs:[];
 const metric=(n,max)=>n!==null&&n!==undefined&&n!==''&&
  Number.isFinite(Number(n))&&Number(n)>=0&&Number(n)<=max?Number(n):null;
 const timeZone=String(j?.time_zone||'').slice(0,80)||null;
 return {startDateTime:j?.startDateTime,arrivalDateTime:j?.arrivalDateTime,
  durationMinutes:metric(j?.durationMinutes,10080),provider:j?.provider||null,
  timeZone,fareLocal:j?.fareLocal||null,fareGBP:j?.fareGBP??null,
  fareComplete:j?.fareComplete===true,
  legs:legs.slice(0,30).map(l=>({mode:l.mode,from:l.from,to:l.to,
   departureTime:l.departureTime,arrivalTime:l.arrivalTime,
   durationMinutes:metric(l.durationMinutes,10080),
   distanceMeters:metric(l.distanceMeters,2000000),
   departureZone:String(l.departureZone||timeZone||'').slice(0,80)||null,
   arrivalZone:String(l.arrivalZone||timeZone||'').slice(0,80)||null,
   operator:l.operator||'',lineNames:Array.isArray(l.lineNames)?l.lineNames.slice(0,5):[],
   towards:String(l.towards||'').slice(0,110),
   platform:String(l.platform||'').slice(0,30),
   fareLocal:l.fareLocal||null}))};
};
export function localAirportInstant(local,zoneName,offsetSeconds){
 if(!localTime(local)||typeof zoneName!=='string'||!Number.isInteger(offsetSeconds)||
    Math.abs(offsetSeconds)>14*3600)return null;
 const utc=Date.parse(local.replace(' ','T')+':00Z')-offsetSeconds*1000;
 if(!Number.isFinite(utc))return null;
 let actual;
 try{
  const parts=new Intl.DateTimeFormat('en-GB',{
   timeZone:zoneName,year:'numeric',month:'2-digit',day:'2-digit',
   hour:'2-digit',minute:'2-digit',hourCycle:'h23'
  }).formatToParts(new Date(utc));
  const p=k=>parts.find(x=>x.type===k)?.value;
  actual=p('year')+'-'+p('month')+'-'+p('day')+' '+p('hour')+':'+p('minute');
 }catch{return null}
 // Prevent false matches when the offset comes from the other side of DST.
 return actual===local?new Date(utc).toISOString():null;
}
export async function resolveAirportZone(env,airport,at,{
 fetcher=fetch
}={}){
 const key=String(env?.GEOAPIFY_API_KEY||'');
 if(!key||!validPoint(airport)||!validIso(at))return null;
 const url=new URL('https://api.geoapify.com/v1/timezone');
 url.searchParams.set('lat',String(airport.latitude));
 url.searchParams.set('lon',String(airport.longitude));
 url.searchParams.set('at',at);
 try{
  const r=await fetcher(url,{headers:{'x-api-key':key,'Accept':'application/json'},
   signal:AbortSignal.timeout(6500)});
  if(!r.ok)return null;
  const zones=(await r.json())?.timezones;
  if(!Array.isArray(zones)||zones.length!==1)return null;
  const z=zones[0];if(typeof z.name!=='string'||!Number.isInteger(z.offset_seconds))return null;
  return {name:z.name,offsetSeconds:z.offset_seconds};
 }catch{return null}
}
export async function connectCandidateFlightToGround(env,{
 origin,destination,flight,requestedAt=null,language='ro'
}={},{
 discover=discoverAirportCandidates,
 resolveZone=resolveAirportZone,
 planAccess=planTransCAPIJourney,
 planEgress=null,
 planRegional=null,
 now=Date.now()
}={}){
 if(!validPoint(origin)||!validPoint(destination)||
    !Array.isArray(flight?.legs)||flight.legs.length!==1||
    !iata(flight.legs[0].from)||!iata(flight.legs[0].to)||
    !localTime(flight.legs[0].startLocal)||!localTime(flight.legs[0].endLocal))
  return {status:'invalid_or_unconnected_flight',completeDoorToDoor:false};
 const leg=flight.legs[0],start=requestedAt&&validIso(requestedAt)?Date.parse(requestedAt):now;
 if(start<now-2*60000||start>now+60*86400000)
  return {status:'invalid_departure_date',completeDoorToDoor:false};
 const [a,b]=await Promise.all([
  discover(env,origin,{radiusKm:240,limit:40}),
  discover(env,destination,{radiusKm:240,limit:40})
 ]);
 const from=(a.airports||[]).find(x=>x.iata===leg.from&&validPoint(x));
 const to=(b.airports||[]).find(x=>x.iata===leg.to&&validPoint(x));
 if(!from||!to)return {status:'airport_not_verified',completeDoorToDoor:false};
 const noon=s=>s.slice(0,10)+'T12:00:00Z';
 const [fromZone,toZone]=await Promise.all([
  resolveZone(env,from,noon(leg.startLocal)),resolveZone(env,to,noon(leg.endLocal))
 ]);
 if(!fromZone||!toZone)return {
  status:'airport_time_zone_unavailable',completeDoorToDoor:false,
  airportFrom:{iata:from.iata,name:from.name},airportTo:{iata:to.iata,name:to.name}
 };
 const flightDeparture=localAirportInstant(leg.startLocal,fromZone.name,fromZone.offsetSeconds);
 const flightArrival=localAirportInstant(leg.endLocal,toZone.name,toZone.offsetSeconds);
 if(!flightDeparture||!flightArrival||Date.parse(flightArrival)<=Date.parse(flightDeparture)||
    Date.parse(flightArrival)-Date.parse(flightDeparture)>24*3600000||
    Date.parse(flightDeparture)<start-120000){
  return {status:'flight_time_incompatible',completeDoorToDoor:false};
 }
 // Boarding 90 minutes before an international flight; after landing allow
 // 45 minutes for luggage/passport control before ground departure.
 const departureMs=Date.parse(flightDeparture);
 const boardingCutoff=departureMs-90*60000;
 const roadSearchAt=Math.max(start,departureMs-6*3600000);
 const egressAfter=Date.parse(flightArrival)+45*60000;
 let access={status:'unavailable',journeys:[]},egress={status:'not_configured',journeys:[]};
 // Run independent already-authorized ground searches. There is no external
 // reservation and no implied cross-border coverage from a GB-only planner.
 const searches=await Promise.allSettled([
  planAccess(env,origin,from,4,{departureAt:new Date(roadSearchAt).toISOString()}),
  typeof planEgress==='function'?
    planEgress(env,to,destination,language,new Date(egressAfter).toISOString()):
    Promise.resolve(egress)
 ]);
 if(searches[0].status==='fulfilled'&&searches[0].value)access=searches[0].value;
 if(searches[1].status==='fulfilled'&&searches[1].value)egress=searches[1].value;
 const inbound=(access.journeys||[]).filter(j=>validIso(j?.startDateTime)&&
  validIso(j?.arrivalDateTime)&&Date.parse(j.startDateTime)>=start-120000&&
  Date.parse(j.arrivalDateTime)<=boardingCutoff&&
  Date.parse(j.arrivalDateTime)>=Date.parse(j.startDateTime))
 .sort((j,k)=>Date.parse(k.arrivalDateTime)-Date.parse(j.arrivalDateTime))[0]||null;
 const outbound=(egress.journeys||[]).filter(j=>validIso(j?.startDateTime)&&
  validIso(j?.arrivalDateTime)&&Date.parse(j.startDateTime)>=egressAfter&&
  Date.parse(j.arrivalDateTime)>=Date.parse(j.startDateTime)&&
  Date.parse(j.startDateTime)<egressAfter+36*3600000)
 .sort((j,k)=>Date.parse(j.arrivalDateTime)-Date.parse(k.arrivalDateTime))[0]||null;
 // A geographically resolved Romanian domestic provider can sometimes
 // confirm the intercity portion after an airport landing, even if the
 // international door-to-door MOTIS planner is not connected. Never splice
 // it into the completed path: the airport->station and last city station->
 // exact house are not evidenced by a city-to-city Bilo timetable.
 let onward={status:'not_checked',journey:null};
 if(!outbound&&typeof planRegional==='function'&&to.country_code==='RO'&&
    String(destination.country_code||'').toUpperCase()==='RO'){
  try{
   onward=await planRegional(env,{airport:to,destination,
    after:new Date(egressAfter).toISOString()})||onward;
  }catch{onward={status:'regional_provider_unavailable',journey:null}}
 }
 const full=Boolean(inbound&&outbound);
 const fare=flight.fareObserved&&Number.isFinite(Number(flight.fareObserved.amount))&&
  Number(flight.fareObserved.amount)>0?{
   amount:Number(flight.fareObserved.amount),currency:String(flight.fareObserved.currency||'')
  }:null;
 return {status:full?'provisional_air_ground_itinerary':'ground_transfer_incomplete',
  completeDoorToDoor:full,bookingVerified:false,groundConnectionsVerified:full,
  fareComplete:false,flightFareOnly:fare,
  originLabel:String(origin.label||'').slice(0,140),
  destinationLabel:String(destination.label||'').slice(0,140),
  flight:{from:leg.from,to:leg.to,airline:String(leg.airline||'').slice(0,120),
   flightNumber:String(leg.flightNumber||'').slice(0,30),
   departureTime:flightDeparture,arrivalTime:flightArrival,
   departureLocal:leg.startLocal,arrivalLocal:leg.endLocal,
   status:'third_party_observed_not_booked'},
  airportFrom:{iata:from.iata,name:from.name},
  airportTo:{iata:to.iata,name:to.name},
  accessJourney:inbound?compactJourney(inbound):null,
  egressJourney:outbound?compactJourney(outbound):null,
  // A Bilo national train/coach is an independently sourced intermediate
  // leg. City-to-city evidence is NOT enough for complete door-to-door.
  regionalOnwardJourney:onward?.journey?compactJourney(onward.journey):null,
  regionalOnwardStatus:onward?.status||'not_checked',
  regionalOnwardFromCity:onward?.fromCity||null,
  regionalOnwardToCity:onward?.toCity||null,
  accessStatus:inbound?'scheduled_connection_found':access.status||'unavailable',
  egressStatus:outbound?'scheduled_connection_found':egress.status||'unavailable'};
}
