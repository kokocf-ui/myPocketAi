import {pointDistanceMeters} from './regional_gtfs_registry.mjs';
import {verifyDomesticJourneys,selectNationalJourneys} from './national_transport_validation.mjs';
import {readTransportJson} from './transport_bounded_json.mjs';
export const IRAIL_ENDPOINT='https://api.irail.be/v1/';
const text=(v,n=180)=>typeof v==='string'?v.trim().slice(0,n):'';
const point=p=>p&&typeof p.latitude==='number'&&typeof p.longitude==='number'&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&Math.abs(p.latitude)<=90&&Math.abs(p.longitude)<=180;
const integer=v=>(typeof v==='string'&&/^-?\d+$/.test(v)||typeof v==='number'&&Number.isInteger(v))?Number(v):NaN;
const station=s=>{
 const latitude=typeof s?.locationY==='string'&&s.locationY.trim()?Number(s.locationY):NaN;
 const longitude=typeof s?.locationX==='string'&&s.locationX.trim()?Number(s.locationX):NaN;
 if(!/^BE\.NMBS\.\d{9}$/.test(s?.id||'')||!text(s.name||s.standardname)||!point({latitude,longitude}))return null;
 return {id:s.id,label:text(s.name||s.standardname),latitude,longitude};
};
const list=(container,name,max)=>{
 const n=integer(container?.number),items=container?.[name]??[];
 return Number.isSafeInteger(n)&&n>=0&&n<=max&&Array.isArray(items)&&items.length===n?items:null;
};
const callTime=raw=>{
 const t=integer(raw?.time),delay=integer(raw?.delay);
 return Number.isSafeInteger(t)&&t>0&&Number.isSafeInteger(delay)&&Math.abs(delay)<=86400&&
  Number.isFinite(new Date(t*1000).getTime())&&Number.isFinite(new Date((t+delay)*1000).getTime())?(t+delay)*1000:null;
};
export function irailNationalConfigured(env={}){
 // A shared limiter is mandatory: a module-local counter cannot enforce the
 // public service quota across Worker isolates. No automatic/paid fallback.
 return env.IRAIL_NATIONAL_ENABLED==='true'&&env.IRAIL_TERMS_REVIEWED==='true'&&
  typeof env.IRAIL_USER_AGENT==='string'&&env.IRAIL_USER_AGENT.trim().length>=8&&env.IRAIL_USER_AGENT.length<=200&&
  !/[\r\n]/.test(env.IRAIL_USER_AGENT)&&typeof env.IRAIL_RATE_LIMITER?.limit==='function';
}
export function irailLocalDeparture(at){
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Brussels',year:'2-digit',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(at)).map(p=>[p.type,p.value]));
 return {date:parts.day+parts.month+parts.year,time:parts.hour+parts.minute};
}
// Only actual API train legs and same-station transfers. Walking vias require
// separate navigation/geometry verification and are deliberately not invented.
export function normalizeIrailConnection(raw,{from,to,departureAt}={}){
 if(!point(from)||!point(to)||!Number.isFinite(Date.parse(departureAt)))return null;
 const vias=list(raw?.vias,'via',5);if(!vias)return null;
 const departures=[raw.departure,...vias.map(v=>v.departure)],arrivals=[...vias.map(v=>v.arrival),raw.arrival];
 const legs=[],checkPoints=[];
 for(let i=0;i<departures.length;i++){
  const d=departures[i],a=arrivals[i],s=station(d?.stationinfo),e=station(a?.stationinfo),start=callTime(d),end=callTime(a);
  if(!s||!e||s.id===e.id||start===null||end===null||end<=start||d.canceled!=='0'||a.canceled!=='0'||
   d.walking!=='0'||a.walking!=='0'||!/^BE\.NMBS\.(?!WALK)[A-Z0-9]+$/.test(d.vehicle||'')||d.vehicle!==a.vehicle)return null;
  const prev=legs.at(-1);
  if(prev&&(prev.toStopId!==s.id||pointDistanceMeters(prev.arrivalPoint,s)>100||start<Date.parse(prev.arrivalTime)+120000))return null;
  const stops=list(d.stops,'stop',100);if(!stops)return null;
  const intermediate=stops.map(x=>station(x.stationinfo));
  if(intermediate.some(x=>!x)||new Set([s.id,...intermediate.map(x=>x?.id),e.id]).size!==intermediate.length+2)return null;
  let previousTime=start;
  for(const stop of stops){
   const arrival=callTime({time:stop.scheduledArrivalTime,delay:stop.arrivalDelay});
   const departure=callTime({time:stop.scheduledDepartureTime,delay:stop.departureDelay});
   if(arrival===null||departure===null||arrival<previousTime||departure<arrival||departure>end||
    stop.arrivalCanceled!=='0'||stop.departureCanceled!=='0')return null;
   previousTime=departure;
  }
  checkPoints.push(s,...intermediate,e);
  legs.push({mode:'train',from:s.label,to:e.label,fromStopId:s.id,toStopId:e.id,
   departureTime:new Date(start).toISOString(),arrivalTime:new Date(end).toISOString(),
   scheduledDepartureTime:new Date(integer(d.time)*1000).toISOString(),scheduledArrivalTime:new Date(integer(a.time)*1000).toISOString(),
   departurePoint:s,arrivalPoint:e,lineNames:[text(d.vehicleinfo?.shortname||d.vehicle,80)],operator:'SNCB/NMBS',
   departurePlatform:text(d.platform,20),arrivalPlatform:text(a.platform,20),stopCount:intermediate.length+1,geometryAvailable:false});
 }
 if(!legs.length||pointDistanceMeters(from,legs[0].departurePoint)>150||pointDistanceMeters(to,legs.at(-1).arrivalPoint)>150||
  Date.parse(legs[0].departureTime)<Date.parse(departureAt)-30000||Date.parse(legs.at(-1).arrivalTime)-Date.parse(legs[0].departureTime)>72*3600000)return null;
 const first=legs[0],last=legs.at(-1);
 return {provider:'iRail',source:'iRail Belgian rail connections',source_url:'https://docs.irail.be/',country_code:'BE',time_zone:'Europe/Brussels',
  startDateTime:first.departureTime,arrivalDateTime:last.arrivalTime,durationMinutes:Math.ceil((Date.parse(last.arrivalTime)-Date.parse(first.departureTime))/60000),
  legs,scheduled:true,real_time:false,provider_delays_applied:true,fareLocal:null,fareComplete:false,seatAvailability:'unverified',
  routeSegments:[],geometryAvailable:false,walkingAccessVerified:false,walkingEgressVerified:false,completeDoorToDoor:false,
  attribution:{text:'Rail information via iRail / SNCB-NMBS',url:'https://irail.be/'},
  firstVehicleDepartureTime:first.departureTime,boarding_stop:{...first.departurePoint,departure_time:first.departureTime},
  alighting_stop:{...last.arrivalPoint,arrival_time:last.arrivalTime},_countryCheckPoints:checkPoints};
}
export async function planIrailNationalJourney(env,{from,to,originCountry,destinationCountry,departureAt,limit=4,preference='all'}={},opts={}){
 const empty=status=>({status,journeys:[]}),now=opts.now??Date.now();
 if(originCountry!=='BE'||destinationCountry!=='BE')return empty('country_not_authorized');
 if(!point(from)||!point(to))return empty('invalid_coordinates');
 const at=departureAt||new Date(now).toISOString(),ms=typeof at==='string'&&/(Z|[+-]\d\d:\d\d)$/.test(at)?Date.parse(at):NaN;
 if(!Number.isFinite(ms)||ms<now-120000||ms>now+60*86400000)return empty('invalid_departure');
 if(!irailNationalConfigured(env))return empty('not_configured');
 if(typeof opts.verifyCountry!=='function')return empty('country_verification_unavailable');
 if(preference==='bus_only')return empty('mode_not_supported');
 const max=Math.min(6,Math.max(1,Math.floor(Number(limit))||4));
 const request=async(path,params)=>{
  let admitted;try{admitted=await env.IRAIL_RATE_LIMITER.limit({key:'irail-public-service'});}catch{throw Error('budget_unavailable');}
  if(admitted?.success!==true)throw Error('quota_exceeded');
  const url=new URL(path,IRAIL_ENDPOINT);url.search=new URLSearchParams({format:'json',lang:'en',...params});
  const r=await (opts.fetchImpl||fetch)(url.href,{headers:{Accept:'application/json','User-Agent':env.IRAIL_USER_AGENT},redirect:'error',signal:AbortSignal.timeout(7500),
   cf:{cacheTtl:path==='stations'?86400:30,cacheEverything:true}});
  if(r.status===429)throw Error('quota_exceeded');if([401,403].includes(r.status))throw Error('access_denied');
  if(!r.ok)throw Error('provider_http_error');return readTransportJson(r);
 };
 try{
  const data=await request('stations',{}),stations=Array.isArray(data?.station)?data.station.slice(0,2000).map(station).filter(Boolean):[];
  if(!stations.length)return empty('invalid_response');
  const nearest=p=>stations.map(s=>({s,d:pointDistanceMeters(p,s)})).filter(x=>x.d<=150).sort((a,b)=>a.d-b.d)[0]?.s;
  const start=nearest(from),end=nearest(to);if(!start||!end||start.id===end.id)return empty('rail_station_access_required');
  const payload=await request('connections',{from:start.id,to:end.id,...irailLocalDeparture(at),timesel:'departure',typeOfTransport:'trains',results:String(max)});
  if(!Array.isArray(payload.connection))return empty('invalid_response');
  const candidates=payload.connection.slice(0,max).map(raw=>normalizeIrailConnection(raw,{from,to,departureAt:at})).filter(Boolean);
  const verified=await verifyDomesticJourneys(candidates,'BE',opts.verifyCountry),journeys=selectNationalJourneys(verified.journeys,max);
  return {status:journeys.length?'ok':verified.rejected?'domestic_route_unverified':payload.connection.length?'no_valid_itinerary':'no_results',journeys,country_checks:verified.checks,
   source_scope:'Belgian rail station-to-station only; walking vias, urban networks and last-mile navigation are not covered.'};
 }catch(e){return empty(['TimeoutError','AbortError'].includes(e?.name)?'timeout':
  ['quota_exceeded','budget_unavailable','access_denied','provider_http_error','response_too_large','invalid_response'].includes(e?.message)?e.message:'network_error');}
}
