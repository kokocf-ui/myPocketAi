import {beforeTransitAbort} from './transit_deadline.mjs';
import {transportTicketUrl} from './transport_ticket_links.mjs';
// Initial-search air+ground connector for a provider-observed flight option.
// It re-discovers airports from real geography, resolves IANA time zones,
// then asks already-authorized ground timetable planners on BOTH sides.
// No fixed airport/city routes, invented ground legs, or booking claims.
import {discoverAirportCandidates} from './mixed_airport_discovery.mjs';
import {planTransCAPIJourney} from './uk_national_transit.mjs';
import {planFixedPointBoardingAccess} from './mixed_fixed_point_access.mjs';

const validPoint=p=>p&&p.latitude!=null&&p.longitude!=null&&
 Number.isFinite(Number(p.latitude))&&Number.isFinite(Number(p.longitude))&&
 Math.abs(Number(p.latitude))<=90&&Math.abs(Number(p.longitude))<=180;
const iata=s=>/^[A-Z]{3}$/.test(String(s||''));
const localTime=s=>/^\d{4}-\d{2}-\d{2} [012]\d:[0-5]\d$/.test(String(s||''))&&
 Number(String(s).slice(11,13))<24;
const validIso=s=>typeof s==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)&&
 /(Z|[+-]\d{2}:\d{2})$/.test(s)&&Number.isFinite(Date.parse(s));
const pointCoords=p=>{
 const lat=p?.lat??p?.latitude,lon=p?.lon??p?.longitude;
 if(lat===null||lat===undefined||lon===null||lon===undefined||
  lat===''||lon===''||!Number.isFinite(Number(lat))||!Number.isFinite(Number(lon))||
  Math.abs(Number(lat))>90||Math.abs(Number(lon))>180)return null;
 return {lat:Number(lat),lon:Number(lon)};
};
const metresBetween=(a,b)=>{
 const x=pointCoords(a),y=pointCoords(b);
 if(!x||!y)return null;
 const rad=Math.PI/180,lat=(y.lat-x.lat)*rad,lon=(y.lon-x.lon)*rad;
 const h=Math.sin(lat/2)**2+Math.cos(x.lat*rad)*Math.cos(y.lat*rad)*
  Math.sin(lon/2)**2;
 return 12742000*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));
};
// Only provider geospatial evidence can establish whether a supplied journey
// begins and ends at the two points the user actually selected.
export const journeyAnchoredToPoints=(journey,from,to,{fromRadius=350,toRadius=350}={})=>{
 const legs=Array.isArray(journey?.legs)?journey.legs:[];
 if(!legs.length)return false;
 const start=metresBetween(legs[0].departurePoint,from);
 const finish=metresBetween(legs.at(-1).arrivalPoint??legs.at(-1).arrivalLatLon,to);
 // Airport POIs can represent an entire mapped facility, not a terminal.
// Allow the station to fall within its grounds but never assert a specific
// terminal/platform as verified from this test alone.
 return start!==null&&finish!==null&&start<=fromRadius&&finish<=toRadius;
};
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
   durationMinutes:metric(l.durationMinutes,10080),timingEstimated:l.timingEstimated===true,
   distanceMeters:metric(l.distanceMeters,2000000),
   departurePoint:pointCoords(l.departurePoint),
   arrivalPoint:pointCoords(l.arrivalPoint??l.arrivalLatLon),
   departureZone:String(l.departureZone||timeZone||'').slice(0,80)||null,
   arrivalZone:String(l.arrivalZone||timeZone||'').slice(0,80)||null,
   operator:l.operator||'',bookingUrl:transportTicketUrl(l.bookingUrl),operatorUrl:transportTicketUrl(l.operatorUrl),lineNames:Array.isArray(l.lineNames)?l.lineNames.slice(0,5):[],
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
 fetcher=fetch,signal=null
}={}){
 const key=String(env?.GEOAPIFY_API_KEY||'');
 if(!key||!validPoint(airport)||!validIso(at))return null;
 const url=new URL('https://api.geoapify.com/v1/timezone');
 url.searchParams.set('lat',String(airport.latitude));
 url.searchParams.set('lon',String(airport.longitude));
 url.searchParams.set('at',at);
 try{
  const r=await fetcher(url,{headers:{'x-api-key':key,'Accept':'application/json'},
   signal:signal?AbortSignal.any([signal,AbortSignal.timeout(6500)]):AbortSignal.timeout(6500)});
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
 now=Date.now(),budgetMs=20000,signal:parentSignal=null
}={}){
 if(!validPoint(origin)||!validPoint(destination)||
    !Array.isArray(flight?.legs)||!flight.legs.length||flight.legs.length>6||
    flight.legs.some(l=>!iata(l?.from)||!iata(l?.to)||
      !localTime(l?.startLocal)||!localTime(l?.endLocal)))
  return {status:'invalid_or_unconnected_flight',completeDoorToDoor:false};
 const leg=flight.legs[0],lastLeg=flight.legs.at(-1),start=requestedAt&&validIso(requestedAt)?Date.parse(requestedAt):now;
 if(start<now-2*60000||start>now+60*86400000)
  return {status:'invalid_departure_date',completeDoorToDoor:false};
 const controller=new AbortController(),signal=controller.signal;
 const cancel=()=>controller.abort();parentSignal?.addEventListener('abort',cancel,{once:true});
 if(parentSignal?.aborted)cancel();
 const timer=setTimeout(()=>controller.abort(),Math.max(1,Math.min(20000,Number(budgetMs)||20000)));
 const bounded=(work,fallback)=>beforeTransitAbort(work,signal,fallback,
  fallback?.status?{...fallback,status:'provider_unavailable'}:fallback);
 try{
 const [a,b]=await Promise.all([
  bounded(()=>discover(env,origin,{radiusKm:240,limit:40,signal}),{airports:[]}),
  bounded(()=>discover(env,destination,{radiusKm:240,limit:40,signal}),{airports:[]})
 ]);
 const from=(a.airports||[]).find(x=>x.iata===leg.from&&validPoint(x));
 const to=(b.airports||[]).find(x=>x.iata===lastLeg.to&&validPoint(x));
 if(!from||!to)return {status:signal.aborted?'search_timeout':'airport_not_verified',completeDoorToDoor:false};
 const noon=s=>s.slice(0,10)+'T12:00:00Z';
 const [fromZone,toZone]=await Promise.all([
  bounded(()=>resolveZone(env,from,noon(leg.startLocal),{signal}),null),
  bounded(()=>resolveZone(env,to,noon(lastLeg.endLocal),{signal}),null)
 ]);
 if(!fromZone||!toZone)return {
  status:signal.aborted?'search_timeout':'airport_time_zone_unavailable',completeDoorToDoor:false,
  airportFrom:{iata:from.iata,name:from.name},airportTo:{iata:to.iata,name:to.name}
 };
 const flightDeparture=localAirportInstant(leg.startLocal,fromZone.name,fromZone.offsetSeconds);
 const flightArrival=localAirportInstant(lastLeg.endLocal,toZone.name,toZone.offsetSeconds);
 if(!flightDeparture||!flightArrival||Date.parse(flightArrival)<=Date.parse(flightDeparture)||
    Date.parse(flightArrival)-Date.parse(flightDeparture)>72*3600000||
    Date.parse(flightDeparture)<start-120000){
  return {status:'flight_time_incompatible',completeDoorToDoor:false};
 }
 // Boarding 90 minutes before an international flight; after landing allow
 // 45 minutes for luggage/passport control before ground departure.
 const departureMs=Date.parse(flightDeparture);
 const boardingCutoff=departureMs-90*60000;
 const egressAfter=Date.parse(flightArrival)+45*60000;
 // The airport is an ordinary, geographically identified point. Use the
 // same domestic public-transport planner as a street-address search, at
 // departure times that can actually reach the pre-boarding deadline.
 const [entryResult,exitResult]=await Promise.allSettled([
  planFixedPointBoardingAccess(env,{
   origin,boardingPoint:from,
   earliestDeparture:new Date(start).toISOString(),
   latestArrival:new Date(boardingCutoff).toISOString()
  },{planner:planAccess,now,signal}),
  typeof planEgress==='function'?
    bounded(()=>planEgress(env,to,destination,language,new Date(egressAfter).toISOString(),{signal}),{status:'search_timeout',journeys:[]}):
    Promise.resolve({status:'not_configured',journeys:[]})
 ]);
 const entry=entryResult.status==='fulfilled'?entryResult.value:
   {status:'local_transport_unavailable',journey:null};
 const egress=exitResult.status==='fulfilled'&&exitResult.value?
   exitResult.value:{status:'unavailable',journeys:[]};
 const inbound=entry.journey||null;
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
   onward=await bounded(()=>planRegional(env,{airport:to,destination,
    after:new Date(egressAfter).toISOString(),signal}),{status:'search_timeout',journey:null})||onward;
  }catch{onward={status:'regional_provider_unavailable',journey:null}}
 }
 const accessAnchored=Boolean(inbound&&journeyAnchoredToPoints(inbound,origin,from,{toRadius:1200}));
 const egressAnchored=Boolean(outbound&&journeyAnchoredToPoints(outbound,to,destination,{fromRadius:1200}));
 // First/last-mile routing is useful even for an unverified air transfer.
 // Never promote a multi-flight chain to complete without terminal/connection
 // evidence for ALL its intermediate transfers (same IATA is not that proof).
 const airTransfersVerified=flight.legs.length===1;
 const full=Boolean(inbound&&outbound&&accessAnchored&&egressAnchored&&airTransfersVerified);
 const fare=flight.fareObserved&&Number.isFinite(Number(flight.fareObserved.amount))&&
  Number(flight.fareObserved.amount)>0?{
   amount:Number(flight.fareObserved.amount),currency:String(flight.fareObserved.currency||'')
  }:null;
 return {status:full?'provisional_air_ground_itinerary':'ground_transfer_incomplete',
  completeDoorToDoor:full,bookingVerified:false,
  groundConnectionsVerified:Boolean(inbound&&outbound&&accessAnchored&&egressAnchored),
  airTransfersVerified,airTransferStatus:airTransfersVerified?'not_required':'intermediate_air_transfer_unverified',
  fareComplete:false,flightFareOnly:fare,
  originLabel:String(origin.label||'').slice(0,140),
  destinationLabel:String(destination.label||'').slice(0,140),
  flight:{from:leg.from,to:lastLeg.to,airline:String(leg.airline||'').slice(0,120),
   flightNumber:String(leg.flightNumber||'').slice(0,30),
   departureTime:flightDeparture,arrivalTime:flightArrival,
   departureLocal:leg.startLocal,arrivalLocal:lastLeg.endLocal,
   status:'third_party_observed_not_booked'},
  // The coordinates, not the airport's city name, anchor access routing.
  // They identify the mapped airport feature; the specific airline terminal
  // must still come from the operator where it differs from this feature.
  airportFrom:{iata:from.iata,name:from.name,latitude:Number(from.latitude),
   longitude:Number(from.longitude),country_code:from.country_code||null,
   locationSource:from.identitySource||'Geoapify airport feature'},
  airportTo:{iata:to.iata,name:to.name,latitude:Number(to.latitude),
   longitude:Number(to.longitude),country_code:to.country_code||null,
   locationSource:to.identitySource||'Geoapify airport feature'},
  accessJourney:inbound?compactJourney(inbound):null,
  egressJourney:outbound?compactJourney(outbound):null,
  accessAnchoredToSelectedPoints:accessAnchored,
  egressAnchoredToSelectedPoints:egressAnchored,
  // A Bilo national train/coach is an independently sourced intermediate
  // leg. City-to-city evidence is NOT enough for complete door-to-door.
  regionalOnwardJourney:onward?.journey?compactJourney(onward.journey):null,
  regionalOnwardStatus:onward?.status||'not_checked',
  regionalOnwardFromCity:onward?.fromCity||null,
  regionalOnwardToCity:onward?.toCity||null,
  boardingDeadline:new Date(boardingCutoff).toISOString(),boardingBufferMinutes:90,
  groundSearchIncomplete:signal.aborted,
  accessStatus:entry.status||'local_transport_unavailable',
  accessSearch:{attemptedAt:entry.attemptedAt||[],providerStatuses:entry.providerStatuses||[]},
  egressSearch:{status:egress.status||'unavailable',provider:egress.provider||null},
  egressStatus:outbound?'scheduled_connection_found':egress.status||'unavailable'};
 }finally{clearTimeout(timer);parentSignal?.removeEventListener('abort',cancel);controller.abort();}
}
