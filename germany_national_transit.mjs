// DE-only preparation for an operator-managed/contracted MOTIS 2 instance.
// NOT the public Transitous service; no default host, dataset or access grant.
// Contract: motis-project/motis v2.11.4, REST GET /api/v6/plan.
import {pointDistanceMeters} from './regional_gtfs_registry.mjs';
import {transportTicketUrl} from './transport_ticket_links.mjs';
import {verifyDomesticJourneys,selectNationalJourneys,nationalBusOnly} from './national_transport_validation.mjs';
const text=(s,n=180)=>typeof s==='string'?s.trim().slice(0,n):'';
const point=p=>p&&typeof p.latitude==='number'&&typeof p.longitude==='number'&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&Math.abs(p.latitude)<=90&&Math.abs(p.longitude)<=180?{latitude:p.latitude,longitude:p.longitude}:null;
const location=p=>point({latitude:p?.lat,longitude:p?.lon});
const iso=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(v)&&Number.isFinite(Date.parse(v))?new Date(v).toISOString():null;
export const GERMANY_MOTIS_MODES=Object.freeze({WALK:'walking',BUS:'bus',COACH:'coach',TRAM:'tram',SUBWAY:'metro',SUBURBAN:'train',REGIONAL_RAIL:'train',HIGHSPEED_RAIL:'train',LONG_DISTANCE:'train',NIGHT_RAIL:'train',FERRY:'ferry',FUNICULAR:'funicular',AERIAL_LIFT:'gondola'});
export function germanyMotisEndpoint(env={}){
 try{
  const u=new URL(env.GERMANY_MOTIS_BASE_URL),h=u.hostname.toLowerCase();
  // Public Transitous forbids commercial use; aliases/internal endpoints are
  // not a workaround. Credentials never belong in the URL or client request.
  if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash||u.pathname!=='/'||u.port||
     !h.includes('.')||/^\d[\d.]*$/.test(h)||h.includes(':')||h.endsWith('.')||
     ['transitous.org','motis-project.org','motis-project.de','spline.de','localhost','local','internal','test','invalid','example'].some(d=>h===d||h.endsWith('.'+d)))return null;
  return new URL('/api/v6/plan',u).href;
 }catch{return null;}
}
export function germanyNationalConfigured(env={}){
 const token=env.GERMANY_MOTIS_API_TOKEN;
 return env.GERMANY_NATIONAL_ENABLED==='true'&&env.GERMANY_MOTIS_TERMS_REVIEWED==='true'&&env.GERMANY_MOTIS_DATA_REVIEWED==='true'&&
  Boolean(germanyMotisEndpoint(env))&&Boolean(text(env.GERMANY_MOTIS_ATTRIBUTION,500))&&env.GERMANY_MOTIS_ATTRIBUTION.trim().length<=500&&
  (token===undefined||token===''||typeof token==='string'&&/^[\x21-\x7e]{16,512}$/.test(token));
}
export function normalizeGermanyItinerary(raw,{from,to,departureAt,receivedAt,attribution}={}){
 if(!point(from)||!point(to)||!iso(departureAt)||!iso(receivedAt)||!text(attribution,500)||attribution.trim().length>500||!Array.isArray(raw?.legs)||!raw.legs.length||raw.legs.length>20)return null;
 const legs=[],points=[];
 for(const r of raw.legs){
  const mode=GERMANY_MOTIS_MODES[r?.mode],a=location(r?.from),b=location(r?.to),start=iso(r?.startTime),end=iso(r?.endTime),scheduledStart=iso(r?.scheduledStartTime),scheduledEnd=iso(r?.scheduledEndTime);
  if(!mode||!a||!b||!text(r.from.name)||!text(r.to.name)||!start||!end||!scheduledStart||!scheduledEnd||typeof r.realTime!=='boolean'||typeof r.scheduled!=='boolean'||
     Date.parse(end)<Date.parse(start)||Date.parse(scheduledEnd)<Date.parse(scheduledStart)||mode!=='walking'&&start===end||
     r.cancelled===true||r.from.cancelled===true||r.to.cancelled===true||r.loopedCalendarSince!=null||r.interlineWithPreviousLeg===true||r.reservation==='COMPULSORY')return null;
  const prev=legs.at(-1);
  if(prev&&(Date.parse(start)<Date.parse(prev.arrivalTime)||pointDistanceMeters(prev.arrivalPoint,a)>100))return null;
  let stops=[];
  if(mode!=='walking'){
   if(!text(r.from.stopId)||!text(r.to.stopId)||r.from.vertexType!=='TRANSIT'||r.to.vertexType!=='TRANSIT'||
      [r.from.pickupType,r.to.dropoffType].some(v=>v!=null&&v!=='NORMAL')||!Array.isArray(r.intermediateStops)||r.intermediateStops.length>500)return null;
   stops=r.intermediateStops;
   if(stops.some(s=>!location(s)||!text(s.stopId)||s.vertexType!=='TRANSIT'||s.cancelled===true))return null;
  }
  points.push(a,b,...stops.map(location));
  const ids=mode==='walking'?[]:[r.from.stopId,...stops.map(s=>s.stopId),r.to.stopId];
  legs.push({mode,from:text(r.from.name),to:text(r.to.name),departureTime:start,arrivalTime:end,
   scheduledDepartureTime:scheduledStart,scheduledArrivalTime:scheduledEnd,realtime:r.realTime,
   lineNames:text(r.routeShortName||r.displayName||r.routeLongName,100)?[text(r.routeShortName||r.displayName||r.routeLongName,100)]:[],
   operator:text(r.agencyName,100),operatorUrl:transportTicketUrl(r.agencyUrl),
   departurePoint:{...a,label:text(r.from.name)},arrivalPoint:{...b,label:text(r.to.name)},
   fromStopId:text(r.from.stopId),toStopId:text(r.to.stopId),stopCount:ids.length&&new Set(ids).size===ids.length?ids.length-1:null,geometryAvailable:false});
 }
 const first=legs.find(l=>l.mode!=='walking'),last=[...legs].reverse().find(l=>l.mode!=='walking'),start=legs[0].departureTime,end=legs.at(-1).arrivalTime;
 if(!first||pointDistanceMeters(from,legs[0].departurePoint)>150||pointDistanceMeters(to,legs.at(-1).arrivalPoint)>150||
    Date.parse(start)<Date.parse(departureAt)-30000||Date.parse(end)-Date.parse(start)>72*3600000||iso(raw.startTime)!==start||iso(raw.endTime)!==end)return null;
 return {provider:'MOTIS Germany',source:'Operator-managed MOTIS 2 / Germany',country_code:'DE',time_zone:'Europe/Berlin',
  startDateTime:start,arrivalDateTime:end,durationMinutes:Math.ceil((Date.parse(end)-Date.parse(start))/60000),legs,
  scheduled:raw.legs.filter(l=>l.mode!=='WALK').every(l=>l.scheduled),real_time:legs.some(l=>l.realtime),
  fareLocal:null,fareComplete:false,seatAvailability:'unverified',geometryAvailable:false,routeSegments:[],walkingAccessVerified:false,walkingEgressVerified:false,
  firstVehicleDepartureTime:first.departureTime,boarding_stop:{...first.departurePoint,id:first.fromStopId,departure_time:first.departureTime},
  alighting_stop:{...last.arrivalPoint,id:last.toStopId,arrival_time:last.arrivalTime},
  attribution:{text:text(attribution,500)+' · '+receivedAt+' · © OpenStreetMap contributors, ODbL https://www.openstreetmap.org/copyright',received_at:receivedAt},_countryCheckPoints:points};
}
export async function planGermanyNationalJourney(env,{from,to,originCountry,destinationCountry,departureAt,limit=4,preference='all'}={},opts={}){
 const empty=status=>({status,journeys:[]});
 if(originCountry!=='DE'||destinationCountry!=='DE')return empty('country_not_authorized');
 if(!point(from)||!point(to))return empty('invalid_coordinates');
 const now=opts.now??Date.now(),at=iso(departureAt||new Date(now).toISOString());
 if(!at||Date.parse(at)<now-120000||Date.parse(at)>now+60*86400000)return empty('invalid_departure');
 if(!germanyNationalConfigured(env))return empty('not_configured');
 if(typeof opts.verifyCountry!=='function')return empty('country_verification_unavailable');
 const max=Math.min(6,Math.max(1,Math.floor(Number(limit))||4)),wantBus=preference==='bus_only';
 const query=async bus=>{
  try{
   const u=new URL(germanyMotisEndpoint(env));
   const params={fromPlace:from.latitude+','+from.longitude,toPlace:to.latitude+','+to.longitude,time:at,numItineraries:String(max),arriveBy:'false',
    transitModes:(bus?['BUS','COACH']:Object.keys(GERMANY_MOTIS_MODES).filter(x=>x!=='WALK')).join(','),directModes:'',preTransitModes:'WALK',postTransitModes:'WALK',detailedLegs:'true',detailedTransfers:'true',joinInterlinedLegs:'true'};
   for(const [k,v] of Object.entries(params))u.searchParams.set(k,v);
   const headers={Accept:'application/json'};if(env.GERMANY_MOTIS_API_TOKEN)headers.Authorization='Bearer '+env.GERMANY_MOTIS_API_TOKEN;
   const response=await (opts.fetchImpl||fetch)(u.href,{method:'GET',headers,redirect:'manual',signal:AbortSignal.timeout(7500)});
   if(response.status===429)return {status:'quota_exceeded',items:[]};
   if([401,403].includes(response.status))return {status:'access_denied',items:[]};
   if(!response.ok)return {status:'provider_http_error',items:[]};
   if(Number(response.headers.get('content-length'))>2097152)return {status:'response_too_large',items:[]};
   const raw=await response.text();if(raw.length>2097152)return {status:'response_too_large',items:[]};
   let data;try{data=JSON.parse(raw);}catch{return {status:'invalid_response',items:[]};}
   if(!Array.isArray(data.itineraries))return {status:'invalid_response',items:[]};
   return {status:data.itineraries.length?'ok':'no_results',items:data.itineraries.slice(0,max),receivedAt:new Date().toISOString()};
  }catch(e){return {status:['AbortError','TimeoutError'].includes(e?.name)?'timeout':'network_error',items:[]};}
 };
 const [main,bus]=await Promise.all([query(wantBus),!wantBus&&max>1&&pointDistanceMeters(from,to)<=80000?query(true):null]);
 const candidates=[];
 for(const [i,s] of [main,...(bus?[bus]:[])].entries())for(const raw of s.items){
  const j=normalizeGermanyItinerary(raw,{from,to,departureAt:at,receivedAt:s.receivedAt,attribution:env.GERMANY_MOTIS_ATTRIBUTION});
  if(j&&(!(wantBus||i===1)||nationalBusOnly(j)))candidates.push(j);
 }
 const v=await verifyDomesticJourneys(candidates,'DE',opts.verifyCountry),selected=selectNationalJourneys(v.journeys,max);
 return {status:selected.length?'ok':candidates.length&&v.rejected?'domestic_route_unverified':main.status==='ok'||bus?.status==='ok'?'no_valid_itinerary':main.status,
  journeys:selected,country_checks:v.checks,source_status:{main:main.status,bus:bus?.status||'not_requested'}};
}
