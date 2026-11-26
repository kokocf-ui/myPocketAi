import {transportTicketUrl} from './transport_ticket_links.mjs';
// Conservative adapters for already-connected, licensed Romanian and GB public
// transport providers. Data is NOT automatically shareable between suppliers.
// No real timetable is added by this file: each service calls its existing
// authorized provider using the selected date, and rejects unverifiable stops.
import {planRomanianNationalJourney} from './ro_national_transit.mjs';
import {planTransCAPIJourney,transCAPISharedZone} from './uk_national_transit.mjs';
import {mixedGreatCircleKm,mixedPoint} from './mixed_route_quality.mjs';

const point=p=>mixedPoint(p);
const close=(a,b,metres=120)=>{
 const km=mixedGreatCircleKm(a,b);
 return km!==null&&km*1000<=metres;
};
const id=x=>typeof x==='string'&&x.length>0&&x.length<=120&&!/[\x00-\x1f]/.test(x);
const legMode=x=>{
 const raw=String(x||'').toLowerCase();
 if(['train','rail','national-rail','highspeed_rail'].includes(raw))return 'train';
 if(['tube','subway','underground','metro'].includes(raw))return 'metro';
 if(['walking','walk','foot','pedestrian'].includes(raw))return 'walking';
 if(['bus','coach','autocar','minibus','tram','ferry'].includes(raw))return raw==='autocar'?'coach':raw==='minibus'?'coach':raw;
 return null;
};
const utc=x=>typeof x==='string'&&/^(?:\d{4}-\d\d-\d\dT\d\d:\d\d)(?::\d\d(?:\.\d{1,3})?)?(?:Z|[+-]\d\d:\d\d)$/.test(x)&&
 Number.isFinite(Date.parse(x))?new Date(x).toISOString():null;
const localityDate=instant=>{
 const dt=new Date(instant);
 const parts=new Intl.DateTimeFormat('en-GB',{
  timeZone:'Europe/Bucharest',year:'numeric',month:'2-digit',day:'2-digit'
 }).formatToParts(dt);
 const v=type=>parts.find(x=>x.type===type)?.value;
 return [v('year'),v('month'),v('day')].join('-');
};
const short=x=>String(x??'').trim().slice(0,150);
const label=x=>String(x??'').trim();
/**
 * TransCAPI returns a complete within-zone provider itinerary (incl. walking).
 * Intermediate nodes are scoped to this source itinerary; a similarly named
 * bus stop in Bilo is NOT assumed to be the same physical stop.
 * Provider supplied consecutive waypoints must physically agree (<= 120m).
 */
export function convertTransCAPIToMixedLegs(journey,query,{journeyIndex=0,provider='TransCAPI',scopeId=null}={}){
 const raws=Array.isArray(journey?.legs)?journey.legs:[];
 if(!raws.length||raws.length>30||journey.departureFeasible===false)return [];
 const fromQuery=query?.from,toQuery=query?.to;
 if(!id(fromQuery?.id)||!id(toQuery?.id)||!point(fromQuery)||!point(toQuery))return [];
 const fromCoord=raws[0]?.departurePoint;
 const lastCoord=raws.at(-1)?.arrivalPoint??raws.at(-1)?.arrivalLatLon;
 if(!close(fromCoord,fromQuery)||!close(lastCoord,toQuery))return [];
 const normalized=[];
 const source=short(provider)||'TransCAPI';
 const prefix=scopeId?source+':'+scopeId+':'+journeyIndex:
  (source==='MOTIS'?'motis:':'tc:')+encodeURIComponent(fromQuery.id)+'>'+encodeURIComponent(toQuery.id)+':'+journeyIndex+':'+short(journey.startDateTime);
 let previousEnd=null,previousToPoint=null;
 for(let i=0;i<raws.length;i++){
  const raw=raws[i],mode=legMode(raw?.mode);
  const a=point(raw?.departurePoint),b=point(raw?.arrivalPoint??raw?.arrivalLatLon);
  const start=utc(raw?.departureTime),end=utc(raw?.arrivalTime);
  if(!mode||!a||!b||!start||!end||Date.parse(end)<=Date.parse(start)||
     (previousEnd&&Date.parse(start)<Date.parse(previousEnd))||
     (previousToPoint&&(!close(previousToPoint,a,75)||
       label(raw.from)!==label(raws[i-1].to))))return [];
  const fromId=i===0?fromQuery.id:prefix+':stop:'+i;
  const toId=i===raws.length-1?toQuery.id:prefix+':stop:'+(i+1);
  if(!id(fromId)||!id(toId))return [];
  const from={id:fromId,label:short(raw.from),...a};
  const to={id:toId,label:short(raw.to),...b};
  if(!from.label||!to.label)return [];
  normalized.push({
   mode,from,to,departureTime:start,arrivalTime:end,
   operator:short(raw.operator),bookingUrl:transportTicketUrl(raw.bookingUrl)||transportTicketUrl(raw.operatorUrl),lineNames:Array.isArray(raw.lineNames)?raw.lineNames:[],
   provider:source,verified:true,
   verificationSource:source+': dated authorized operator journey timetable',
   // A per-leg / booking-total fare is not confirmed by the route geometry.
   fareVerified:false,cancelled:raw.cancelled===true
  });
  previousEnd=end;previousToPoint=b;
 }
 if(normalized.some(l=>l.cancelled))return [];
 return normalized;
}
/**
 * Bilo's current public normalizer gives station NAMES and dates, but does
 * not provide unambiguous official IDs or positions for every leg.
 * An independently trusted station-evidence resolver must provide those.
 * If it cannot, Bilo remains useful as its own published itinerary card
 * but cannot be spliced into another provider's leg graph.
 *
 * resolveStop({journeyIndex,legIndex,side,rawName,locality,mode}) returns:
 * {providerStopId,latitude,longitude,evidenceSource,verified:true}
 */
export function convertBiloToMixedLegs(journey,{
 journeyIndex=0,resolveStop
}={}){
 if(typeof resolveStop!=='function')return {status:'station_identity_unavailable',legs:[]};
 const raws=Array.isArray(journey?.legs)?journey.legs:[];
 if(!raws.length||raws.length>15||journey.scheduled!==true)
  return {status:'unverified_schedule',legs:[]};
 const legs=[];
 let previousEnd=null;
 for(let i=0;i<raws.length;i++){
  const raw=raws[i],mode=legMode(raw.mode);
  if(!mode)return {status:'unrecognized_mode',legs:[]};
  const start=utc(raw.departureTime),end=utc(raw.arrivalTime);
  if(!start||!end||Date.parse(end)<=Date.parse(start)||
     (previousEnd&&Date.parse(start)<Date.parse(previousEnd)))
    return {status:'invalid_schedule',legs:[]};
  const get=(side)=>resolveStop({
   journeyIndex,legIndex:i,side,
   rawName:raw[side],locality:raw[side+'Locality'],mode
  });
  const origin=get('from'),destination=get('to');
  const proven=(p,rawName)=>p?.verified===true&&id(p.providerStopId)&&
   id(p.evidenceSource)&&point(p)&&
   // Proof must refer to the actual provider stop, not just the city.
   label(p.rawName)===label(rawName);
  if(!proven(origin,raw.from)||!proven(destination,raw.to))
   return {status:'station_identity_unavailable',legs:[]};
  const from={id:origin.providerStopId,label:raw.from,...point(origin)};
  const to={id:destination.providerStopId,label:raw.to,...point(destination)};
  if(i&&legs[i-1].to.id!==from.id)return {status:'transfer_leg_missing',legs:[]};
  legs.push({
   mode,from,to,departureTime:start,arrivalTime:end,
   operator:short(raw.operator),bookingUrl:transportTicketUrl(raw.bookingUrl)||transportTicketUrl(raw.operatorUrl),
   lineNames:Array.isArray(raw.lineNames)?raw.lineNames:[],
   provider:'Bilo',verified:true,verificationSource:'Bilo: published operator schedule',
   // Published timetable != real-time seat/availability/final fare quote.
   fareVerified:false
  });
  previousEnd=end;
 }
 return {status:'verified_station_records',legs};
}
// The existing MOTIS adapter also supplies provider stop coordinates and an
// internally checked dated itinerary; this only adapts its payload shape.
// Its network planner remains licensed/configured by the backend.
export function convertMOTISToMixedLegs(journey,query,options={}){
 return convertTransCAPIToMixedLegs(journey,query,{...options,provider:'MOTIS'});
}
export function makeMOTISMixedSource(env,{licensed=false,planner=null}={}){
 const scope=queryScopes();
 let endpoint;
 try{endpoint=new URL(String(env?.MOTIS_API_BASE_URL||''))}catch{}
 const validEndpoint=endpoint?.protocol==='https:'&&
  endpoint.hostname!=='api.transitous.org'&&Boolean(endpoint.hostname);
 const enabled=licensed&&validEndpoint&&typeof planner==='function';
 return {id:'MOTIS',licensed,enabled,
  canServe:(from,to)=>enabled&&Boolean(point(from)&&point(to)),
  async searchLegs(query){
   if(!enabled)return {status:'not_authorized',legs:[]};
   if(!point(query.from)||!point(query.to))return {status:'missing_coordinates',legs:[]};
   const result=await planner(env,point(query.from),point(query.to),query.departureAt,{signal:query.signal});
   if(result?.status!=='success')return {status:result?.status||'unavailable',legs:[]};
   const legs=(Array.isArray(result.journeys)?result.journeys:[])
    .flatMap((j,i)=>convertMOTISToMixedLegs(j,query,{journeyIndex:i,scopeId:scope(query)}));
   return {status:legs.length?'success':'stops_not_verified',legs};
  }};
}
export function makeTransCAPIMixedSource(env,{
 licensed=false,planner=planTransCAPIJourney
}={}){
 const scope=queryScopes();
 return {id:'TransCAPI',licensed,enabled:Boolean(env?.TRANSCAPI_API_KEY),
  canServe:(from,to)=>point(from)&&point(to)&&Boolean(transCAPISharedZone(from,to)),
  async searchLegs(query){
   if(!licensed||!env?.TRANSCAPI_API_KEY)return {status:'not_authorized',legs:[]};
   const from=point(query.from),to=point(query.to);
   if(!from||!to||!transCAPISharedZone(from,to))return {status:'outside_coverage',legs:[]};
   const result=await planner(env,from,to,4,{departureAt:query.departureAt,signal:query.signal});
   if(!['success'].includes(result.status))return {status:result.status||'provider_unavailable',legs:[]};
   const legs=(result.journeys||[]).flatMap((j,i)=>
    convertTransCAPIToMixedLegs(j,query,{journeyIndex:i,scopeId:scope(query)}));
   return {status:legs.length?'success':'stops_not_verified',legs};
  }};
}
export function makeBiloMixedSource(env,{
 licensed=false,resolveStop,planner=planRomanianNationalJourney
}={}){
 const ready=licensed&&Boolean(env?.BILO_API_KEY)&&typeof resolveStop==='function';
 return {id:'Bilo',licensed,enabled:ready,
  canServe:(from,to)=>ready&&from?.country_code==='RO'&&to?.country_code==='RO'&&
    from.cityVerified===true&&to.cityVerified===true&&
    Boolean(label(from.city))&&Boolean(label(to.city)),
  async searchLegs(query){
   if(!ready)return {status:'station_identity_unavailable',legs:[]};
   if(query.from?.country_code!=='RO'||query.to?.country_code!=='RO'||
      query.from?.cityVerified!==true||query.to?.cityVerified!==true)
    return {status:'outside_coverage',legs:[]};
   const start=utc(query.departureAt);
   if(!start)return {status:'invalid_departure_time',legs:[]};
   const response=await planner(env,{
    origin:query.from.city,destination:query.to.city},{
    date:localityDate(start),limit:8
   });
   if(response.status!=='ok')return {status:response.status||'unavailable',legs:[]};
   const legs=[],failures=[];
   for(const [i,j] of (response.journeys||[]).entries()){
    const item=convertBiloToMixedLegs(j,{journeyIndex:i,resolveStop});
    if(item.status==='verified_station_records')legs.push(...item.legs);
    else failures.push(item.status);
   }
   return {status:legs.length?'success':'station_identity_unavailable',
    legs,unresolvedJourneys:failures.length};
  }};
}

// The same local/urban pipeline used by ordinary A→B searches can provide
// graph access/egress for a railway station, coach terminal or any other point.
// Merely finding a nearby terminal does not create a timetable edge.
export function makeLocalMixedSource({planner,canServe=()=>false}={}){
 const scopes=new Map();
 return {id:'LocalTransit',licensed:true,enabled:typeof planner==='function',
  canServe:(a,b)=>Boolean(point(a)&&point(b)&&canServe(a,b)),
  async searchLegs(query){
   const result=await planner({},query.from,query.to,4,{departureAt:query.departureAt,signal:query.signal});
   if(!Array.isArray(result?.journeys)||!result.journeys.length)
    return {status:result?.status||'local_provider_unavailable',legs:[]};
   const key=query.from.id+'>'+query.to.id+'|'+query.departureAt;
   if(!scopes.has(key))scopes.set(key,'query-'+scopes.size);
   const legs=result.journeys.flatMap((j,i)=>convertTransCAPIToMixedLegs(j,query,{
    journeyIndex:i,provider:'LocalTransit',scopeId:scopes.get(key)
   }).map(l=>({...l,verificationSource:String(j.provider||result.provider||'Local transit')+': dated source itinerary'})));
   return {status:legs.length?'success':'stops_not_verified',legs};
  }};
}

// Query-local unique namespaces avoid overflowing the stop-ID wire limit when
// real geographic provider IDs are long. No hash collisions or name merging.
function queryScopes(){
 const ids=new Map();
 return query=>{
  const key=query.from.id+'>'+query.to.id+'|'+query.departureAt;
  if(!ids.has(key))ids.set(key,'query-'+ids.size);
  return ids.get(key);
 };
}
