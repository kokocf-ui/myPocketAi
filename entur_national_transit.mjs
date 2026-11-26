import {verifyDomesticJourneys,selectNationalJourneys} from './national_transport_validation.mjs';
// Norway-only opt-in adapter. API contract checked against Entur's published
// GraphQL schema; this is NOT proof of live availability or reuse approval.
import {pointDistanceMeters} from './regional_gtfs_registry.mjs';
import {transportTicketUrl} from './transport_ticket_links.mjs';
export const ENTUR_ENDPOINT='https://api.entur.io/journey-planner/v3/graphql';
export const ENTUR_QUERY=`query PocketNationalTrip($from: Location!, $to: Location!, $at: DateTime!, $limit: Int!, $modes: Modes!) {
 trip(from: $from, to: $to, dateTime: $at, numTripPatterns: $limit, modes: $modes,
      includePlannedCancellations: false, includeRealtimeCancellations: false) {
  routingErrors { code }
  tripPatterns {
   legs {
    mode realtime aimedStartTime aimedEndTime expectedStartTime expectedEndTime
    fromPlace { name latitude longitude quay { id } }
    toPlace { name latitude longitude quay { id } }
    fromEstimatedCall { cancellation }
    toEstimatedCall { cancellation }
    intermediateQuays { id latitude longitude }
    line { publicCode name }
    operator { name url }
   }
  }
 }
}`;
const supportedModes={foot:'walking',bus:'bus',coach:'coach',trolleybus:'trolleybus',rail:'train',metro:'metro',tram:'tram',water:'ferry',funicular:'funicular',cableway:'cable-car',lift:'lift',monorail:'monorail'};
const str=(v,n=180)=>typeof v==='string'?v.trim().slice(0,n):'';
const point=p=>p&&typeof p.latitude==='number'&&typeof p.longitude==='number'&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&Math.abs(p.latitude)<=90&&Math.abs(p.longitude)<=180?{latitude:p.latitude,longitude:p.longitude}:null;
const iso=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(v)&&Number.isFinite(Date.parse(v))?new Date(v).toISOString():null;
const busOnly=j=>j.legs.some(l=>['bus','coach','trolleybus'].includes(l.mode))&&j.legs.every(l=>['walking','bus','coach','trolleybus'].includes(l.mode));
export function enturNationalConfigured(env={}){
 return env.ENTUR_NATIONAL_ENABLED==='true'&&env.ENTUR_TERMS_REVIEWED==='true'&&
  /^[a-z0-9][a-z0-9._-]{2,79}$/i.test(String(env.ENTUR_CLIENT_NAME||''));
}
// Complete provider legs only. Do not repair missing transfers, endpoint gaps,
// unknown modes, cancelled journeys or malformed times with invented walks.
export function normalizeEnturPattern(raw,{from,to,departureAt}={}){
 if(!point(from)||!point(to)||!iso(departureAt)||!Array.isArray(raw?.legs)||!raw.legs.length||raw.legs.length>20)return null;
 const legs=[],checkPoints=[];
 for(const r of raw.legs){
  const mode=supportedModes[r?.mode],a=point(r?.fromPlace),b=point(r?.toPlace);
  const departure=iso(r?.expectedStartTime),arrival=iso(r?.expectedEndTime);
  if(!mode||!a||!b||!departure||!arrival||Date.parse(arrival)<Date.parse(departure)||
     (!['walking'].includes(mode)&&Date.parse(arrival)===Date.parse(departure))||
     r.fromEstimatedCall?.cancellation===true||r.toEstimatedCall?.cancellation===true||
     !str(r.fromPlace.name)||!str(r.toPlace.name))return null;
  const previous=legs.at(-1);
  if(previous&&(Date.parse(departure)<Date.parse(previous.arrivalTime)||pointDistanceMeters(previous.arrivalPoint,a)>100))return null;
  const intermediate=r.intermediateQuays;
  if(!Array.isArray(intermediate)||intermediate.length>500)return null;
  if(intermediate.some(p=>!point(p)||!str(p.id)))return null;
  checkPoints.push(a,b,...intermediate.map(point));
  const line=str(r.line?.publicCode||r.line?.name,100);
  const stopCount=mode!=='walking'&&str(r.fromPlace.quay?.id)&&str(r.toPlace.quay?.id)&&
   r.fromPlace.quay.id!==r.toPlace.quay.id&&new Set(intermediate.map(p=>p.id)).size===intermediate.length&&
   !intermediate.some(p=>[r.fromPlace.quay.id,r.toPlace.quay.id].includes(p.id))?intermediate.length+1:null;
  legs.push({mode,from:str(r.fromPlace.name),to:str(r.toPlace.name),departureTime:departure,arrivalTime:arrival,
   scheduledDepartureTime:iso(r.aimedStartTime),scheduledArrivalTime:iso(r.aimedEndTime),
   realtime:r.realtime===true,lineNames:line?[line]:[],operator:str(r.operator?.name,100),
   operatorUrl:transportTicketUrl(r.operator?.url),departurePoint:{...a,label:str(r.fromPlace.name)},
   arrivalPoint:{...b,label:str(r.toPlace.name)},fromStopId:str(r.fromPlace.quay?.id),toStopId:str(r.toPlace.quay?.id),
   geometryAvailable:false,stopCount});
 }
 if(!legs.some(l=>l.mode!=='walking')||pointDistanceMeters(from,legs[0].departurePoint)>150||
    pointDistanceMeters(to,legs.at(-1).arrivalPoint)>150||Date.parse(legs[0].departureTime)<Date.parse(departureAt)-30000)return null;
 const first=legs.find(l=>l.mode!=='walking'),last=[...legs].reverse().find(l=>l.mode!=='walking');
 const start=legs[0].departureTime,end=legs.at(-1).arrivalTime;
 if(Date.parse(end)-Date.parse(start)>72*3600000)return null;
 return {provider:'Entur',source:'Entur Journey Planner v3',source_url:'https://developer.entur.no/docs/open-services/journey-planner',
  time_zone:'Europe/Oslo',country_code:'NO',startDateTime:start,arrivalDateTime:end,
  durationMinutes:Math.ceil((Date.parse(end)-Date.parse(start))/60000),legs,scheduled:true,
  real_time:legs.some(l=>l.realtime),fareLocal:null,fareComplete:false,seatAvailability:'unverified',
  routeSegments:[],geometryAvailable:false,walkingAccessVerified:false,walkingEgressVerified:false,
  firstVehicleDepartureTime:first.departureTime,
  boarding_stop:{...first.departurePoint,id:first.fromStopId,departure_time:first.departureTime},
  alighting_stop:{...last.arrivalPoint,id:last.toStopId,arrival_time:last.arrivalTime},
  _countryCheckPoints:checkPoints};
}
export async function planEnturNationalJourney(env,{from,to,originCountry,destinationCountry,departureAt,limit=4,preference='all'}={},opts={}){
 const empty=(status,extra={})=>({status,journeys:[],...extra});
 if(originCountry!=='NO'||destinationCountry!=='NO')return empty('country_not_authorized');
 if(!point(from)||!point(to))return empty('invalid_coordinates');
 const now=opts.now??Date.now(),at=iso(departureAt||new Date(now).toISOString());
 if(!at||Date.parse(at)<now-120000||Date.parse(at)>now+60*86400000)return empty('invalid_departure');
 if(!enturNationalConfigured(env))return empty('not_configured');
 if(typeof opts.verifyCountry!=='function')return empty('country_verification_unavailable');
 const max=Math.min(6,Math.max(1,Math.floor(Number(limit))||4));
 const query=async(onlyBus)=>{
  try{
   const response=await (opts.fetchImpl||fetch)(ENTUR_ENDPOINT,{method:'POST',redirect:'error',
    headers:{'Content-Type':'application/json','Accept':'application/json','ET-Client-Name':env.ENTUR_CLIENT_NAME},
    body:JSON.stringify({query:ENTUR_QUERY,variables:{from:{coordinates:point(from)},to:{coordinates:point(to)},at,limit:max,
     modes:{accessMode:'foot',egressMode:'foot',directMode:'foot',
      transportModes:(onlyBus?['bus','coach','trolleybus']:Object.keys(supportedModes).filter(m=>m!=='foot')).map(transportMode=>({transportMode}))}}}),
    signal:AbortSignal.timeout(7500)});
   if(response.status===429)return {status:'quota_exceeded',patterns:[]};
   if([401,403].includes(response.status))return {status:'access_denied',patterns:[]};
   if(!response.ok)return {status:'provider_http_error',patterns:[]};
   if(Number(response.headers.get('content-length'))>2*1024*1024)return {status:'response_too_large',patterns:[]};
   const text=await response.text();if(text.length>2*1024*1024)return {status:'response_too_large',patterns:[]};
   let payload;try{payload=JSON.parse(text);}catch{return {status:'invalid_response',patterns:[]};}
   if(payload.errors?.length)return {status:'provider_graphql_error',patterns:[]};
   if(payload.data?.trip?.routingErrors?.length)return {status:'provider_routing_error',patterns:[]};
   const patterns=payload.data?.trip?.tripPatterns;
   if(!Array.isArray(patterns))return {status:'invalid_response',patterns:[]};
   return {status:patterns.length?'ok':'no_results',patterns:patterns.slice(0,max)};
  }catch(e){return {status:['TimeoutError','AbortError'].includes(e?.name)?'timeout':'network_error',patterns:[]};}
 };
 const wantBus=preference==='bus_only',localAlternative=!wantBus&&max>1&&pointDistanceMeters(from,to)<=80000;
 const [main,bus]=await Promise.all([query(wantBus),localAlternative?query(true):null]);
 const sources=[main,...(bus?[bus]:[])],candidates=[];
 for(const [i,source] of sources.entries())for(const raw of source.patterns){
  const j=normalizeEnturPattern(raw,{from,to,departureAt:at});
  if(j&&(!(wantBus||i===1)||busOnly(j)))candidates.push(j);
 }
 // Country-check every returned leg endpoint AND intermediate quay. A same-
 // country GPS pair is not enough: a provider may return an international train.
 // Bound total geocoder subrequests and latency, deduplicate within this request
 // only; never persist precise passenger coordinates or geocoder payloads.
 const verified=await verifyDomesticJourneys(candidates,'NO',opts.verifyCountry);
 const selected=selectNationalJourneys(verified.journeys,max);
 const rejected=verified.rejected,checks=verified.checks;
 return {status:selected.length?'ok':candidates.length&&rejected?'domestic_route_unverified':sources.some(s=>s.status==='ok')?'no_valid_itinerary':main.status,
  journeys:selected,source_status:{main:main.status,bus:bus?.status||'not_requested'},country_checks:checks};
}
