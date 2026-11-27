import {beforeTransitAbort} from './transit_deadline.mjs';
// Independent exploratory sources: a scheduled ground journey must not hide
// flight/coach/rail route evidence. No ticket-stock prerequisite, guessed times
// or invented first/last mile. Failed enrichment preserves the source option.
import {discoverMixedFlightCandidates} from './mixed_serpapi_discovery.mjs';
import {discoverMixedGroundOperators} from './mixed_ground_operator_discovery.mjs';
import {prepareMixedFlightOptions} from './mixed_prefetched_details.mjs';
const point=p=>p&&p.latitude!=null&&p.longitude!=null&&Number.isFinite(+p.latitude)&&Number.isFinite(+p.longitude)&&Math.abs(+p.latitude)<=90&&Math.abs(+p.longitude)<=180;
export async function searchMixedIndicativeOptions(env,{
 origin,destination,departureAt=null,language='ro',international=false,cache=null,cacheBaseUrl=null,
 signal=null,onProgress=null,includeFlights=true
}={},dependencies={}){
 if(!point(origin)||!point(destination))return {};
 const rad=Math.PI/180,lat=(destination.latitude-origin.latitude)*rad,lon=(destination.longitude-origin.longitude)*rad;
 const h=Math.sin(lat/2)**2+Math.cos(origin.latitude*rad)*Math.cos(destination.latitude*rad)*Math.sin(lon/2)**2;
 const km=12742*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));
 const discoverAir=dependencies.discoverAir||discoverMixedFlightCandidates;
 const discoverGround=dependencies.discoverGround||discoverMixedGroundOperators;
 const prepare=dependencies.prepare||prepareMixedFlightOptions;
 const bounded=async(work,ms,fallback)=>{
  let timer;
  try{return await Promise.race([Promise.resolve().then(work),
   new Promise(resolve=>{timer=setTimeout(()=>resolve(typeof fallback==='function'?fallback():fallback),ms)})]);}
  catch{return typeof fallback==='function'?fallback():fallback;}finally{clearTimeout(timer)}
 };
 let partialGround=null;
 const groundAbort=new AbortController();
 const cancel=()=>groundAbort.abort();signal?.addEventListener('abort',cancel,{once:true});
 if(signal?.aborted)cancel();
 const groundFields=ground=>({operator_options:Array.isArray(ground?.operators)?ground.operators:[],
  ground_connections:Array.isArray(ground?.connections)?ground.connections:[],
  ground_corridor_status:ground?.corridorDiscoveryStatus||null,
  ground_search_incomplete:ground?.searchIncomplete===true,
  operator_discovery_status:ground?.status||'provider_unavailable',operator_search_summary:ground?.summary||null,
  operator_source_errors:Array.isArray(ground?.sourceErrors)?ground.sourceErrors:[]});
 const groundTimer=setTimeout(()=>groundAbort.abort(),19500);
 const groundWork=()=>beforeTransitAbort(()=>discoverGround(env,{origin,destination,signal:groundAbort.signal,
  onProgress:partial=>{partialGround={...partialGround,...partial};onProgress?.(groundFields(partialGround));}}),groundAbort.signal,null);
 const groundFallback=()=>({...partialGround,status:partialGround?.status||'search_timeout',searchIncomplete:true});
 // Enrich the air branch as soon as its own candidates arrive. Ground
 // discovery must neither wait for this nor delay it by up to twenty seconds.
 const airWork=(async()=>{
  const air=includeFlights&&(international||km>=150)?await bounded(
   ()=>discoverAir(env,{origin,destination,departureAt,maxDays:3,cache,cacheBaseUrl,budgetMs:22000,signal}),
   25000,{status:'provider_unavailable',candidates:[]}):{status:'disabled',candidates:[]};
  let flights=Array.isArray(air?.candidates)?air.candidates.slice(0,6):[],ready=false;
  if(flights.length){
   const enrichAbort=new AbortController();
   const cancelEnrichment=()=>enrichAbort.abort();
   signal?.addEventListener('abort',cancelEnrichment,{once:true});
   if(signal?.aborted)cancelEnrichment();
   const timeout=setTimeout(cancelEnrichment,Math.max(1,Math.min(21000,dependencies.enrichmentBudgetMs||21000)));
   const publishPrepared=(prepared,index)=>{
    if(enrichAbort.signal.aborted)return;
    flights[index]=prepared;
    onProgress?.({flight_candidates:[...flights],flight_details_prepared:false,
     flight_search_status:air?.status||'provider_unavailable',flight_search_incomplete:air?.searchIncomplete===true});
   };
   try{
    const enriched=await beforeTransitAbort(()=>prepare(env,{candidates:flights,origin,destination,requestedAt:departureAt||new Date().toISOString(),language,limit:6,airportCandidates:air?.airportCandidates},
      {planAccess:dependencies.planAccess,planEgress:dependencies.planEgress,planRegional:dependencies.planRegional,
       budgetMs:20000,signal:enrichAbort.signal,onPrepared:publishPrepared}),enrichAbort.signal,null);
    if(Array.isArray(enriched)&&enriched.length){flights=enriched;ready=true;}
   }catch{}finally{clearTimeout(timeout);enrichAbort.abort();signal?.removeEventListener('abort',cancelEnrichment)}
  }
  if(!signal?.aborted)onProgress?.({flight_candidates:flights,flight_details_prepared:ready,
   flight_search_status:air?.status||'provider_unavailable',flight_search_incomplete:air?.searchIncomplete===true});
  return {air,flights,ready};
 })();
 const [{air,flights,ready},groundResult]=await Promise.all([
  airWork,
  km>=30?bounded(groundWork,20000,groundFallback):Promise.resolve({status:'disabled',operators:[]})
 ]);
 clearTimeout(groundTimer);groundAbort.abort();
 signal?.removeEventListener('abort',cancel);
 const ground=groundResult||groundFallback();
 return {
  planning_scope:'indicative_multimodal',seat_confirmation_required:false,
  flight_search_status:air?.status||'provider_unavailable',
  flight_dates_checked:Array.isArray(air?.datesChecked)?air.datesChecked:[],
  flight_airport_candidates:air?.airportCandidates||null,
  flight_search_incomplete:air?.searchIncomplete===true,
  flight_search_termination:air?.terminationStatus||null,
  flight_source_cache_used:air?.fromCachedProviderResults===true,
  flight_provider_queries:Number(air?.providerSearchCount)||0,
  flight_candidates_received:Array.isArray(air?.candidates)?air.candidates.length:0,
  ...(flights.length?{flight_candidates:flights,flight_details_prepared:ready}:{}),
  ...groundFields(ground)
 };
}
