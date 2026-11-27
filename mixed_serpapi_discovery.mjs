// Optional provider-backed flight discovery for an international A-to-B request.
// Airport locations are discovered geographically; flight candidates are NOT
// complete door-to-door journeys and must never be promoted into verified legs.
import {discoverAirportCandidates} from './mixed_airport_discovery.mjs';
import {searchSerpApiFreeFlights} from './serpapi_flight_pilot.mjs';

// Cache only provider-observed flight candidates for the same airport sets
// and travel date. No home address, GPS coordinate, API key, or passenger data
// is stored in the cache key or response. An indicative flight is NOT a booking.
const mixedFlightCacheKey=(base,request)=>{
 const u=new URL('/_pocketai/air-candidates-v1',base);
 u.searchParams.set('d',request.outboundDate);
 u.searchParams.set('a',(request.departureAirports||[]).join(','));
 u.searchParams.set('b',(request.arrivalAirports||[]).join(','));
 u.searchParams.set('s',String(request.stops||0));
 return new Request(u.toString(),{method:'GET'});
};
export async function cachedMixedFlightSearch(env,request,{
 search=searchSerpApiFreeFlights,cache=null,cacheBaseUrl=null
}={}){
 let key=null;
 if(cache&&cacheBaseUrl){
  try{
   key=mixedFlightCacheKey(cacheBaseUrl,request);
   const hit=await cache.match(key);
   if(hit?.ok){
    const value=await hit.json();
    if(value?.status==='candidate_results_only'&&Array.isArray(value.candidates)&&
       value.candidates.length)return {...value,cacheReused:true};
   }
  }catch{key=null}
 }
 const result=await search(env,request);
 if(key&&result?.status==='candidate_results_only'&&
    Array.isArray(result.candidates)&&result.candidates.length){
  try{
   const response=new Response(JSON.stringify({
    status:'candidate_results_only',
    candidates:result.candidates,
    searchedAirports:result.searchedAirports,
    observedAt:new Date().toISOString()
   }),{status:200,headers:{'Content-Type':'application/json',
     'Cache-Control':'public,max-age=14400'}});
   await cache.put(key,response);
  }catch{} // Cache unavailable must never suppress live flight results.
 }
 return result;
}


// Deadline races also bound injected providers. Real network requests receive
// the same abort signal, so a timed-out screen does not keep spending queries.
async function untilAborted(work,signal,fallback){
 if(signal.aborted)return fallback;
 let stop;
 const aborted=new Promise(resolve=>{stop=()=>resolve(fallback);signal.addEventListener('abort',stop,{once:true});});
 try{return await Promise.race([Promise.resolve().then(()=>signal.aborted?fallback:work()),aborted]);}
 catch{return fallback;}finally{signal.removeEventListener('abort',stop);}
}

const day = ms => new Date(ms).toISOString().slice(0,10);
const code = v => /^[A-Z]{3}$/.test(String(v||'').toUpperCase());
const uniqueCodes = (airports,max) => [...new Set(
  (Array.isArray(airports)?airports:[]).map(a=>String(a?.iata||'').toUpperCase()).filter(code)
)].slice(0,max);
const signature = item => (item.legs||[]).map(l=>[
  l.from,l.to,l.startLocal,l.flightNumber||l.airline
].join('|')).join('>');
const priced = item => {
 const amount=Number(item?.fareObserved?.amount);
 return item?.fareObserved?.amount!=null&&Number.isFinite(amount)&&amount>0?amount:Infinity;
};
// Rank unverified flight suggestions for exploration, NOT confirmed travel.
// A direct flight is preferable to an unnecessary 2-3 connection detour.
// Provider duration is preferred to subtraction of two different local clocks.
export function rankMixedFlightCandidates(candidates,{max=12}={}){
 const seen=new Set(),distinct=[];
 for(const item of Array.isArray(candidates)?candidates:[]){
  if(!Array.isArray(item?.legs)||!item.legs.length)continue;
  const key=signature(item);if(!key||seen.has(key))continue;
  seen.add(key);distinct.push(item);
 }
 distinct.sort((a,b)=>{
  const aStops=a.legs.length-1,bStops=b.legs.length-1;
  if(aStops!==bStops)return aStops-bStops;
  const aDuration=Number(a.totalFlightDurationMinutes),bDuration=Number(b.totalFlightDurationMinutes);
  const da=Number.isFinite(aDuration)&&aDuration>0?aDuration:Infinity;
  const db=Number.isFinite(bDuration)&&bDuration>0?bDuration:Infinity;
  if(da!==db)return da-db;
  if(priced(a)!==priced(b))return priced(a)-priced(b);
  return String(a.legs[0].startLocal||'').localeCompare(String(b.legs[0].startLocal||''));
 });
 return distinct.slice(0,Math.max(1,Math.min(40,Number(max)||12)));
}
/**
 * SerpApi may return a narrow set of popular/nearby departures from a
 * multi-airport query. Querying each candidate departure airport separately
 * prevents e.g. LCY connections from crowding out a direct flight from LTN.
 * No particular city, airport, route or airline receives hard-coded priority.
 *
 * Every call is still protected by the provider's free-plan/quota guard.
 * Search is bounded to avoid wasting free provider searches.
 */
export async function discoverMixedFlightCandidates(env,{origin,destination,departureAt=null,
 now=Date.now(),maxDays=3,maxProviderQueries=9,discover=discoverAirportCandidates,
 search=searchSerpApiFreeFlights,cache=null,cacheBaseUrl=null,signal=null,budgetMs=22000}={}){
 if(env?.SERPAPI_FLIGHTS_PILOT_ENABLED!=='true'||
    env?.SERPAPI_FLIGHTS_TERMS_REVIEWED!=='true')
   return {status:'disabled',candidates:[],datesChecked:[]};
 if(!origin||!destination)return {status:'missing_endpoints',candidates:[],datesChecked:[]};
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),Math.max(1,Math.min(22000,Number(budgetMs)||22000)));
 const cancel=()=>controller.abort();signal?.addEventListener('abort',cancel,{once:true});
 if(signal?.aborted)controller.abort();
 try{
 const [from,to]=await Promise.all([
  untilAborted(()=>discover(env,origin,{radiusKm:240,limit:40,signal:controller.signal}),controller.signal,{status:'search_timeout',airports:[]}),
  untilAborted(()=>discover(env,destination,{radiusKm:240,limit:40,signal:controller.signal}),controller.signal,{status:'search_timeout',airports:[]})
 ]);
 const airportCandidates={origin:from.airports||[],destination:to.airports||[]};
 // Search beyond the first six geographic results; regional and international
 // airports can coexist around the user's actual departure and destination.
 const departureAirports=uniqueCodes(from.airports,12);
 const arrivalAirports=uniqueCodes(to.airports,12)
  .filter(x=>!departureAirports.includes(x));
 // Near international borders, the airport closest to the destination may
 // belong to a different country from the first geocoded airport. A pooled
 // multi-destination Google Flights query can suppress a direct regional
 // flight; probe the first independently geocoded cross-border gateway.
 const airportCountry=new Map((to.airports||[]).map(a=>[
  String(a.iata||'').toUpperCase(),String(a.country_code||'').toUpperCase()
 ]));
 const referenceCountry=airportCountry.get(arrivalAirports[0])||'';
 const borderAirport=referenceCountry?arrivalAirports.find(iata=>
  airportCountry.get(iata)&&airportCountry.get(iata)!==referenceCountry)||null:null;
 if(!departureAirports.length||!arrivalAirports.length)
  return {status:controller.signal.aborted?'search_timeout':'no_airport_pair',candidates:[],datesChecked:[],
   searchIncomplete:controller.signal.aborted,terminationStatus:controller.signal.aborted?'search_timeout':'no_airport_pair',
   airportDiscovery:{origin:from.status,destination:to.status},airportCandidates};
 const start=departureAt?Date.parse(departureAt):now;
 if(!Number.isFinite(start))return {status:'invalid_date',candidates:[],datesChecked:[]};
 const days=departureAt?1:Math.max(1,Math.min(7,maxDays));
 const maxQueries=Math.max(1,Math.min(12,Number(maxProviderQueries)||9));
 const datesChecked=[],all=[],seen=new Set();
 let lastStatus='no_candidates',queries=0,cachedProviderResponses=0,queryBudgetExhausted=false,airportQueryRejected=false;
 for(let offset=0;offset<days&&queries<maxQueries;offset++){
  const outboundDate=day(start+offset*86400000);
  // One pooled query, then independently scan airports which the pooled
  // results may have suppressed. Direct flights from farther London airports
  // must have a fair chance without assuming an airport name in the source.
  const requests=[],keys=new Set();
  const add=(origins,destinations,stops=0)=>{
   const a=origins.slice(0,6),b=destinations.slice(0,6);
   if(!a.length||!b.length)return;
   const key=a.join(',')+'>'+b.join(',')+'|'+stops;
   if(keys.has(key))return;
   keys.add(key);requests.push({departureAirports:a,arrivalAirports:b,stops});
  };
  // Probe direct routes from all nearby airports first. One shared no-stop
  // search can find a useful nonstop without spending the entire query budget.
  if(departureAirports.length===1&&arrivalAirports.length===1){
   add(departureAirports,arrivalAirports);
  }else{
   // Broad availability remains independent of which departure terminal the
   // passenger uses. This is a discovery query, NOT a transfer assumption.
   add(departureAirports.slice(0,6),arrivalAirports.slice(0,6),1);
   if(arrivalAirports.length>6)
    add(departureAirports.slice(0,6),arrivalAirports.slice(6,12),1);
   if(borderAirport){
    // A regional airport over the border can be the practical gateway:
    // reserve quota for exact departure-airport searches against that
    // specific geographic target, rather than letting the pooled results
    // repeatedly favor only long-haul/major-city destinations.
    if(departureAirports.length>6)
     add(departureAirports.slice(6,12),[borderAirport],1);
    for(const departure of departureAirports.slice(0,Math.min(9,maxQueries)))
     add([departure],[borderAirport],1);
   }else{
    add(departureAirports.slice(0,6),arrivalAirports.slice(0,6));
    if(departureAirports.length>1)
     for(const departure of departureAirports.slice(0,Math.min(8,maxQueries-1)))
      add([departure],arrivalAirports.slice(0,6),1);
    if(arrivalAirports.length>6)
     add(departureAirports.slice(0,6),arrivalAirports.slice(6,12));
   }
  }
  let attempted=0,foundThisDay=0,providerDiagnostic=null;
  for(const request of requests){
   if(queries>=maxQueries||controller.signal.aborted){queryBudgetExhausted=queries>=maxQueries;lastStatus=controller.signal.aborted?'search_timeout':lastStatus;break;}
   queries++;attempted++;
   let result;
   try{
    result=await untilAborted(()=>cachedMixedFlightSearch(env,{
      ...request,outboundDate,currency:'GBP',userInitiated:true,signal:controller.signal
     },{search,cache,cacheBaseUrl}),controller.signal,{status:'search_timeout',candidates:[]});
   }catch{result={status:'provider_unavailable',candidates:[]};}
   lastStatus=result?.status||'provider_unavailable';
   if(result?.cacheReused)cachedProviderResponses++;
   if(['provider_error','invalid_airport_query'].includes(lastStatus))providerDiagnostic=String(result?.diagnostic||'provider_error').slice(0,120);
   for(const candidate of result?.candidates||[]){
    if(!departureAt&&candidate.legs?.[0]?.startLocal &&
       candidate.legs[0].startLocal.slice(0,10)<day(now))continue;
    const key=signature(candidate);
    if(!key||seen.has(key))continue;
    seen.add(key);all.push(candidate);foundThisDay++;
   }
   // Do not continue to burn quota or report false 'no flights' when access
   // is disabled, exhausted, or credentials/provider requests fail.
   // One unsupported airport in a pooled query must not suppress every
   // later independently planned gateway. Never repeat that same request or
   // expand the existing total query budget. Credential/quota/unknown errors
   // still stop immediately; each later call keeps its own FREE-plan guard.
   if(lastStatus==='invalid_airport_query'){
    airportQueryRejected=true;continue;
   }
   if(lastStatus!=='candidate_results_only')break;
   // A direct flight from one airport does NOT prove there are no other direct
   // flights from nearby airports. Keep checking the independent airport scans.
  }
  datesChecked.push({date:outboundDate,status:foundThisDay?'candidate_results_only':lastStatus,
   queries:attempted,candidates:foundThisDay,
   // The provider may return no flight even for an existing scheduled
   // service. Record the actual airport pairs queried, not a blanket
   // assertion that every nearby airport was searched.
   airportQueries:requests.slice(0,attempted).map(q=>({
    departure:q.departureAirports,arrival:q.arrivalAirports,
    nonstop:q.stops===1
   })),
   ...(providerDiagnostic?{diagnostic:providerDiagnostic}:{})});
  // The selected date is fixed; an undated request shows the first day with
  // results, but compares all checked airport sources for that day.
  if(!foundThisDay&&offset+1<days&&queries>=maxQueries)queryBudgetExhausted=true;
  if(foundThisDay||!['candidate_results_only','provider_error'].includes(lastStatus))break;
 }
 return {status:all.length?'candidate_results_only':lastStatus,
  candidates:rankMixedFlightCandidates(all,{max:20}),datesChecked,
  departureAirports,arrivalAirports,borderAirport,airportCandidates,providerSearchCount:queries,
  searchIncomplete:controller.signal.aborted||queryBudgetExhausted||airportQueryRejected||lastStatus!=='candidate_results_only',
  airportQueryRejected,
  terminationStatus:controller.signal.aborted?'search_timeout':queryBudgetExhausted?'query_budget_exhausted':lastStatus,
  fromCachedProviderResults:cachedProviderResponses>0,
  completeDoorToDoor:false,timezoneAndTransfersUnverified:true};
 }finally{clearTimeout(timer);signal?.removeEventListener('abort',cancel);controller.abort();}
}
