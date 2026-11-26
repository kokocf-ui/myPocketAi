// Finland/Estonia opt-in integration of Digitransit Routing v2 / planConnection.
// Both countries are documented for this endpoint; verify each domestic route independently.
import {pointDistanceMeters} from './regional_gtfs_registry.mjs';
import {transportTicketUrl} from './transport_ticket_links.mjs';
import {verifyDomesticJourneys,selectNationalJourneys,nationalBusOnly} from './national_transport_validation.mjs';
export const DIGITRANSIT_ENDPOINT='https://api.digitransit.fi/routing/v2/finland/gtfs/v1';
export const DIGITRANSIT_QUERY=`query PocketDigitransitTrip($origin: PlanLabeledLocationInput!, $destination: PlanLabeledLocationInput!, $at: PlanDateTimeInput!, $limit: Int!, $modes: PlanModesInput!) {
 planConnection(origin: $origin, destination: $destination, dateTime: $at, first: $limit, modes: $modes) {
  routingErrors { code }
  edges { node { legs {
   mode start { scheduledTime estimated { time } } end { scheduledTime estimated { time } }
   from { name lat lon stop { gtfsId } } to { name lat lon stop { gtfsId } }
   stopCalls { stopLocation { __typename ... on Stop { gtfsId lat lon } } }
   route { shortName longName agency { name url } }
   tripOnServiceDate { realTimeTripState { canceled updated } }
   pickupType dropoffType
  } } }
 }
}`;
const types={WALK:'walking',BUS:'bus',COACH:'coach',TROLLEYBUS:'trolleybus',RAIL:'train',SUBWAY:'metro',TRAM:'tram',FERRY:'ferry',CABLE_CAR:'cable-car',GONDOLA:'gondola',FUNICULAR:'funicular',MONORAIL:'monorail'};
const point=p=>p&&typeof p.latitude==='number'&&typeof p.longitude==='number'&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&Math.abs(p.latitude)<=90&&Math.abs(p.longitude)<=180?{latitude:p.latitude,longitude:p.longitude}:null;
const location=p=>point({latitude:p?.lat,longitude:p?.lon});
const text=(s,n=180)=>typeof s==='string'?s.trim().slice(0,n):'';
const iso=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(v)&&Number.isFinite(Date.parse(v))?new Date(v).toISOString():null;
const keyValid=key=>typeof key==='string'&&/^[\x21-\x7e]{8,512}$/.test(key);
export function digitransitNationalConfigured(env={}){
 return env.DIGITRANSIT_NATIONAL_ENABLED==='true'&&env.DIGITRANSIT_TERMS_REVIEWED==='true'&&keyValid(env.DIGITRANSIT_API_KEY);
}
export function normalizeDigitransitPattern(raw,{from,to,departureAt,receivedAt,country='FI'}={}){
 if(!['FI','EE'].includes(country)||!point(from)||!point(to)||!iso(departureAt)||!iso(receivedAt)||!Array.isArray(raw?.legs)||!raw.legs.length||raw.legs.length>20)return null;
 const legs=[],checkPoints=[];
 for(const r of raw.legs){
  const mode=types[r?.mode],a=location(r?.from),b=location(r?.to);
  const scheduledStart=iso(r?.start?.scheduledTime),scheduledEnd=iso(r?.end?.scheduledTime);
  if(!mode||!a||!b||!scheduledStart||!scheduledEnd||!text(r.from.name)||!text(r.to.name)||
     r.tripOnServiceDate?.realTimeTripState?.canceled===true||
     [r.pickupType,r.dropoffType].some(v=>v!=null&&v!=='SCHEDULED'))return null;
  // Estimates are used only when explicitly present; never label all legs
  // realtime because one vehicle has an update.
  const estimatedStart=r.start.estimated?.time,estimatedEnd=r.end.estimated?.time;
  if(estimatedStart!=null&&!iso(estimatedStart)||estimatedEnd!=null&&!iso(estimatedEnd))return null;
  const departure=estimatedStart?iso(estimatedStart):scheduledStart,arrival=estimatedEnd?iso(estimatedEnd):scheduledEnd;
  if(Date.parse(arrival)<Date.parse(departure)||mode!=='walking'&&arrival===departure)return null;
  const previous=legs.at(-1);
  if(previous&&(Date.parse(departure)<Date.parse(previous.arrivalTime)||pointDistanceMeters(previous.arrivalPoint,a)>100))return null;
  const calls=r.stopCalls;
  if(!Array.isArray(calls)||calls.length>500)return null;
  const stops=calls.map(c=>c?.stopLocation);
  if(stops.some(s=>s?.__typename!=='Stop'||!text(s.gtfsId)||!location(s)))return null;
  const firstId=text(r.from.stop?.gtfsId),lastId=text(r.to.stop?.gtfsId);
  if(mode!=='walking'&&(stops.length<2||!firstId||!lastId||stops[0].gtfsId!==firstId||stops.at(-1).gtfsId!==lastId))return null;
  checkPoints.push(a,b,...stops.map(location));
  const count=mode!=='walking'&&firstId!==lastId&&new Set(stops.map(s=>s.gtfsId)).size===stops.length?stops.length-1:null;
  const line=text(r.route?.shortName||r.route?.longName,100);
  legs.push({mode,from:text(r.from.name),to:text(r.to.name),departureTime:departure,arrivalTime:arrival,
   scheduledDepartureTime:scheduledStart,scheduledArrivalTime:scheduledEnd,
   realtime:r.tripOnServiceDate?.realTimeTripState?.updated===true||Boolean(estimatedStart||estimatedEnd),
   lineNames:line?[line]:[],operator:text(r.route?.agency?.name,100),operatorUrl:transportTicketUrl(r.route?.agency?.url),
   fromStopId:firstId,toStopId:lastId,departurePoint:{...a,label:text(r.from.name)},arrivalPoint:{...b,label:text(r.to.name)},
   stopCount:count,geometryAvailable:false});
 }
 if(!legs.some(l=>l.mode!=='walking')||pointDistanceMeters(from,legs[0].departurePoint)>150||pointDistanceMeters(to,legs.at(-1).arrivalPoint)>150||
    Date.parse(legs[0].departureTime)<Date.parse(departureAt)-30000||Date.parse(legs.at(-1).arrivalTime)-Date.parse(legs[0].departureTime)>72*3600000)return null;
 const first=legs.find(l=>l.mode!=='walking'),last=[...legs].reverse().find(l=>l.mode!=='walking');
 const start=legs[0].departureTime,end=legs.at(-1).arrivalTime;
 return {provider:'Digitransit',source:'Digitransit Routing API v2 ('+(country==='EE'?'Estonia':'Finland')+')',country_code:country,time_zone:country==='EE'?'Europe/Tallinn':'Europe/Helsinki',
  startDateTime:start,arrivalDateTime:end,durationMinutes:Math.ceil((Date.parse(end)-Date.parse(start))/60000),legs,
  scheduled:true,real_time:legs.some(l=>l.realtime),fareLocal:null,fareComplete:false,seatAvailability:'unverified',
  geometryAvailable:false,routeSegments:[],walkingAccessVerified:false,walkingEgressVerified:false,
  firstVehicleDepartureTime:first.departureTime,boarding_stop:{...first.departurePoint,id:first.fromStopId,departure_time:first.departureTime},
  alighting_stop:{...last.arrivalPoint,id:last.toStopId,arrival_time:last.arrivalTime},
  attribution:{text:'© Digitransit '+new Date(receivedAt).getUTCFullYear()+' · '+receivedAt+' · CC BY 4.0 https://creativecommons.org/licenses/by/4.0/ · © OpenStreetMap contributors, ODbL https://www.openstreetmap.org/copyright',received_at:receivedAt},
  _countryCheckPoints:checkPoints};
}
export async function planDigitransitNationalJourney(env,{from,to,originCountry,destinationCountry,departureAt,limit=4,preference='all'}={},opts={}){
 const empty=status=>({status,journeys:[]});
 if(!['FI','EE'].includes(originCountry)||destinationCountry!==originCountry)return empty('country_not_authorized');
 const country=originCountry;
 if(!point(from)||!point(to))return empty('invalid_coordinates');
 const now=opts.now??Date.now(),at=iso(departureAt||new Date(now).toISOString());
 if(!at||Date.parse(at)<now-120000||Date.parse(at)>now+60*86400000)return empty('invalid_departure');
 if(!digitransitNationalConfigured(env))return empty('not_configured');
 if(typeof opts.verifyCountry!=='function')return empty('country_verification_unavailable');
 const max=Math.min(6,Math.max(1,Math.floor(Number(limit))||4));
 const query=async onlyBus=>{
  try{
   const response=await (opts.fetchImpl||fetch)(DIGITRANSIT_ENDPOINT,{method:'POST',redirect:'manual',
    headers:{'Content-Type':'application/json','Accept':'application/json','digitransit-subscription-key':env.DIGITRANSIT_API_KEY},
    body:JSON.stringify({query:DIGITRANSIT_QUERY,variables:{origin:{location:{coordinate:point(from)}},destination:{location:{coordinate:point(to)}},
     at:{earliestDeparture:at},limit:max,modes:{transitOnly:true,transit:{access:['WALK'],egress:['WALK'],transfer:['WALK'],
      transit:(onlyBus?['BUS','COACH','TROLLEYBUS']:Object.keys(types).filter(m=>m!=='WALK')).map(mode=>({mode}))}}}}),signal:AbortSignal.timeout(7500)});
   if(response.status===429)return {status:'quota_exceeded',patterns:[]};
   if([401,403].includes(response.status))return {status:'access_denied',patterns:[]};
   if(!response.ok)return {status:'provider_http_error',patterns:[]};
   if(Number(response.headers.get('content-length'))>2*1024*1024)return {status:'response_too_large',patterns:[]};
   const raw=await response.text();if(raw.length>2*1024*1024)return {status:'response_too_large',patterns:[]};
   let payload;try{payload=JSON.parse(raw);}catch{return {status:'invalid_response',patterns:[]};}
   if(payload.errors?.length)return {status:'provider_graphql_error',patterns:[]};
   const connection=payload.data?.planConnection;
   if(connection?.routingErrors?.length)return {status:'provider_routing_error',patterns:[]};
   if(!Array.isArray(connection?.edges))return {status:'invalid_response',patterns:[]};
   return {status:connection.edges.length?'ok':'no_results',patterns:connection.edges.slice(0,max).map(e=>e?.node),receivedAt:new Date().toISOString()};
  }catch(e){
   // Only bounded categories leave the adapter; exception messages may contain secrets.
   const message=String(e?.message||'');
   const diagnostic=/redirect/i.test(message)?'redirect_mode':/illegal invocation/i.test(message)?'fetch_binding':/AbortSignal|not a function/i.test(message)?'runtime_api':/TLS|SSL|certificate/i.test(message)?'tls':/DNS|resolve/i.test(message)?'dns':'request_failed';
   return {status:['AbortError','TimeoutError'].includes(e?.name)?'timeout':'network_error',diagnostic,patterns:[]};
  }
 };
 const wantBus=preference==='bus_only',localAlternative=!wantBus&&max>1&&pointDistanceMeters(from,to)<=80000;
 const [main,bus]=await Promise.all([query(wantBus),localAlternative?query(true):null]);
 const sources=[main,...(bus?[bus]:[])],candidates=[];
 for(const [i,source] of sources.entries())for(const raw of source.patterns){
  const j=normalizeDigitransitPattern(raw,{from,to,departureAt:at,receivedAt:source.receivedAt,country});
  if(j&&(!(wantBus||i===1)||nationalBusOnly(j)))candidates.push(j);
 }
 const verified=await verifyDomesticJourneys(candidates,country,opts.verifyCountry),selected=selectNationalJourneys(verified.journeys,max);
 return {status:selected.length?'ok':candidates.length&&verified.rejected?'domestic_route_unverified':sources.some(s=>s.status==='ok')?'no_valid_itinerary':main.status,
  journeys:selected,source_status:{main:main.status,bus:bus?.status||'not_requested',...(main.diagnostic?{main_diagnostic:main.diagnostic}:{}),...(bus?.diagnostic?{bus_diagnostic:bus.diagnostic}:{})},country_checks:verified.checks};
}
