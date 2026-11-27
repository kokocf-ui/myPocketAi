// HERE Public Transit v8; DE-only preparation, disabled without all gates.
// Official schema: https://transit.router.hereapi.com/v8/openapi (2026-11-26).
import {pointDistanceMeters} from './regional_gtfs_registry.mjs';
import {verifyDomesticJourneys,selectNationalJourneys,nationalBusOnly} from './national_transport_validation.mjs';
import {hereTransitMonthlyLimit,reserveHereTransitRequest} from './here_transit_budget.mjs';
import {transportTicketUrl} from './transport_ticket_links.mjs';
const text=v=>typeof v==='string'?v.trim():'';
const point=p=>p&&typeof p.latitude==='number'&&typeof p.longitude==='number'&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&Math.abs(p.latitude)<=90&&Math.abs(p.longitude)<=180?{latitude:p.latitude,longitude:p.longitude}:null;
const place=p=>point({latitude:p?.location?.lat,longitude:p?.location?.lng});
const iso=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(v)&&Number.isFinite(Date.parse(v))?new Date(v).toISOString():null;
export const HERE_TRANSIT_MODES=Object.freeze({highSpeedTrain:'train',intercityTrain:'train',interRegionalTrain:'train',regionalTrain:'train',cityTrain:'train',bus:'bus',privateBus:'coach',busRapid:'bus',ferry:'ferry',subway:'metro',lightRail:'tram',inclined:'funicular',aerial:'gondola',monorail:'train'});
export function hereNationalConfigured(env={}){
 return env.HERE_TRANSIT_ENABLED==='true'&&env.HERE_TRANSIT_TERMS_REVIEWED==='true'&&
  env.HERE_TRANSIT_FREE_TIER_REVIEWED==='true'&&env.HERE_TRANSIT_EXCLUSIVE_ACCOUNT==='true'&&
  env.HERE_TRANSIT_UTC_MONTH_REVIEWED==='true'&&Boolean(hereTransitMonthlyLimit(env))&&
  typeof env.HERE_TRANSIT_API_KEY==='string'&&/^[A-Za-z0-9_-]{16,512}$/.test(env.HERE_TRANSIT_API_KEY)&&
  typeof env.HERE_TRANSIT_BUDGET?.idFromName==='function'&&typeof env.HERE_TRANSIT_BUDGET?.get==='function';
}
const notices=r=>Array.isArray(r?.notices)?r.notices:[];
const unsafe=r=>notices(r).some(n=>n?.severity==='critical'||['nonviableRoute','unwantedMode'].includes(n?.code));
export function normalizeHereRoute(raw,{from,to,departureAt}={}){
 if(!point(from)||!point(to)||!Array.isArray(raw?.sections)||!raw.sections.length||raw.sections.length>20||unsafe(raw))return null;
 const legs=[],points=[from,to],attributions=[];
 let knownTimes=true,estimated=false;
 for(const s of raw.sections){
  const walking=s?.type==='pedestrian',mode=walking?'walking':s?.type==='transit'&&Object.hasOwn(HERE_TRANSIT_MODES,s.transport?.mode)?HERE_TRANSIT_MODES[s.transport.mode]:null;
  const a=place(s?.departure?.place),b=place(s?.arrival?.place),start=iso(s?.departure?.time),end=iso(s?.arrival?.time);
  if(!mode||!a||!b||s.notices!==undefined&&!Array.isArray(s.notices)||unsafe(s)||[s.departure?.status,s.arrival?.status].includes('cancelled')||
   (s.incidents||[]).some(i=>i.effect==='cancelledService')||start&&end&&Date.parse(end)<Date.parse(start))return null;
  if(!walking&&(!text(s.departure.place.name)||!text(s.arrival.place.name)||!text(s.transport?.name||s.transport?.shortName)))return null;
  if(legs.length&&pointDistanceMeters(legs.at(-1).arrivalPoint,a)>150)return null;
  const noIntermediate=notices(s).some(n=>n.code==='noIntermediate');
  const intermediate=s.intermediateStops;
  if(intermediate!==undefined&&(!Array.isArray(intermediate)||intermediate.length>500))return null;
  const stops=(intermediate||[]).map(v=>({label:text(v?.departure?.place?.name),...place(v?.departure?.place)}));
  if(stops.some(p=>!p.label||!point(p)))return null;
  points.push(a,b,...stops);
  if(!walking){knownTimes&&=Boolean(start&&end);estimated||=notices(s).some(n=>n.code==='noSchedule');}
  if(s.attributions!==undefined&&!Array.isArray(s.attributions))return null;
  for(const attr of s.attributions||[]){
   if(!text(attr?.text))return null;
   // Preserve complete text AND original URL. Unsafe schemes are text, never HTML.
   attributions.push({text:attr.text,href:typeof attr.href==='string'?attr.href:null});
  }
  const ids=[s.departure.place.id,...(intermediate||[]).map(v=>v.departure.place.id),s.arrival.place.id];
  legs.push({mode,from:text(s.departure.place.name)||(walking?'GPS':''),to:text(s.arrival.place.name)||(walking?'GPS':''),
   departureTime:start,arrivalTime:end,lineNames:walking?[]:[text(s.transport.name||s.transport.shortName)],
   operator:text(s.agency?.name),operatorUrl:transportTicketUrl(s.agency?.website),
   departurePoint:{...a,label:text(s.departure.place.name)},arrivalPoint:{...b,label:text(s.arrival.place.name)},
   fromStopId:text(s.departure.place.id),toStopId:text(s.arrival.place.id),intermediateStops:stops,
   stopCount:!walking&&!noIntermediate&&Array.isArray(intermediate)&&ids.every(Boolean)&&new Set(ids).size===ids.length?intermediate.length+1:null,
   geometryAvailable:false});
 }
 const first=legs.find(l=>l.mode!=='walking'),last=[...legs].reverse().find(l=>l.mode!=='walking');
 if(!first||pointDistanceMeters(from,legs[0].departurePoint)>150||pointDistanceMeters(to,legs.at(-1).arrivalPoint)>150)return null;
 const start=legs[0].departureTime,end=legs.at(-1).arrivalTime;
 // noSchedule explicitly permits estimated timestamps; never use them for catchability.
 const indicative=estimated||!knownTimes||!start||!end;
 if(start&&end&&(Date.parse(end)<Date.parse(start)||Date.parse(end)-Date.parse(start)>72*3600000))return null;
 for(let i=1;i<legs.length;i++)if(legs[i-1].arrivalTime&&legs[i].departureTime&&Date.parse(legs[i].departureTime)<Date.parse(legs[i-1].arrivalTime))return null;
 if(!indicative){
  if(!iso(departureAt)||Date.parse(start)<Date.parse(departureAt)-30000||Date.parse(end)-Date.parse(start)>72*3600000)return null;
 }
 const unique=[...new Map(attributions.map(a=>[JSON.stringify(a),a])).values()];
 return {provider:'HERE Public Transit',source:'HERE Public Transit API v8',country_code:'DE',time_zone:'Europe/Berlin',
  startDateTime:start,arrivalDateTime:end,durationMinutes:start&&end?Math.ceil((Date.parse(end)-Date.parse(start))/60000):null,
  schedule_status:indicative?estimated?'estimated':'unavailable':'scheduled',route_only:indicative,scheduled:!indicative,real_time:false,
  legs,transferCount:legs.filter(l=>l.mode!=='walking').length-1,
  firstVehicleDepartureTime:first.departureTime,boarding_stop:{...first.departurePoint,id:first.fromStopId,departure_time:first.departureTime},
  alighting_stop:{...last.arrivalPoint,id:last.toStopId,arrival_time:last.arrivalTime},
  fareLocal:null,fareComplete:false,seatAvailability:'unverified',geometryAvailable:false,routeSegments:[],walkingAccessVerified:false,walkingEgressVerified:false,
  attribution:{text:['HERE Public Transit',...unique.map(a=>a.text+(a.href?' · '+a.href:''))].join('\n'),links:unique},_countryCheckPoints:points};
}
export async function planHereNationalJourney(env,{from,to,originCountry,destinationCountry,departureAt,limit=4,preference='all'}={},opts={}){
 const empty=status=>({status,journeys:[]});
 if(originCountry!=='DE'||destinationCountry!=='DE')return empty('country_not_authorized');
 if(!point(from)||!point(to))return empty('invalid_coordinates');
 const now=opts.now??Date.now(),at=iso(departureAt||new Date(now).toISOString());
 if(!at||Date.parse(at)<now-120000||Date.parse(at)>now+60*86400000)return empty('invalid_departure');
 if(!hereNationalConfigured(env))return empty('not_configured');
 if(typeof opts.verifyCountry!=='function')return empty('country_verification_unavailable');
 const max=Math.min(6,Math.max(1,Math.floor(Number(limit))||4));
 const reservation=await reserveHereTransitRequest(env);
 if(!reservation.allowed)return empty(reservation.reason);
 try{
  // Exactly ONE provider request per search. No retries, pagination or bus fallback.
  const u=new URL('https://transit.router.hereapi.com/v8/routes');
  const params={origin:from.latitude+','+from.longitude,destination:to.latitude+','+to.longitude,departureTime:at,
   alternatives:String(max-1),return:'intermediate',modes:(preference==='bus_only'?['bus','privateBus','busRapid']:Object.keys(HERE_TRANSIT_MODES)).join(','),apiKey:env.HERE_TRANSIT_API_KEY};
  for(const [k,v] of Object.entries(params))u.searchParams.set(k,v);
  const r=await (opts.fetchImpl||fetch)(u.href,{method:'GET',headers:{Accept:'application/json'},redirect:'manual',signal:AbortSignal.timeout(7500)});
  if(r.status===429)return empty('quota_exceeded');
  if([401,403].includes(r.status))return empty('access_denied');
  if(!r.ok||r.status>=300)return empty('provider_http_error');
  if(Number(r.headers.get('content-length'))>2097152)return empty('response_too_large');
  const raw=await r.text();if(raw.length>2097152)return empty('response_too_large');
  let data;try{data=JSON.parse(raw);}catch{return empty('invalid_response');}
  if(!Array.isArray(data.routes)||unsafe(data))return empty('invalid_response');
  const candidates=data.routes.slice(0,max+1).map(route=>normalizeHereRoute(route,{from,to,departureAt:at})).filter(j=>j&&(preference!=='bus_only'||nationalBusOnly(j)));
  const v=await verifyDomesticJourneys(candidates,'DE',opts.verifyCountry),selected=selectNationalJourneys(v.journeys,max);
  return {status:selected.length?'ok':v.rejected?'domestic_route_unverified':data.routes.length?'no_valid_itinerary':'no_results',journeys:selected,country_checks:v.checks};
 }catch(e){return empty(['AbortError','TimeoutError'].includes(e?.name)?'timeout':'provider_unavailable');}
}
