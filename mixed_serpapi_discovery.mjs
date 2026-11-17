// Optional provider-backed flight discovery for an international A-to-B request.
// Airport locations are discovered geographically; flight candidates are NOT
// complete door-to-door journeys and must never be promoted into verified legs.
import {discoverAirportCandidates} from './mixed_airport_discovery.mjs';
import {searchSerpApiFreeFlights} from './serpapi_flight_pilot.mjs';

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
 search=searchSerpApiFreeFlights}={}){
 if(env?.SERPAPI_FLIGHTS_PILOT_ENABLED!=='true'||
    env?.SERPAPI_FLIGHTS_TERMS_REVIEWED!=='true')
   return {status:'disabled',candidates:[],datesChecked:[]};
 if(!origin||!destination)return {status:'missing_endpoints',candidates:[],datesChecked:[]};
 const [from,to]=await Promise.all([
  discover(env,origin,{radiusKm:240,limit:40}),
  discover(env,destination,{radiusKm:240,limit:40})
 ]);
 // Search beyond the first six geographic results; regional and international
 // airports can coexist around the user's actual departure and destination.
 const departureAirports=uniqueCodes(from.airports,12);
 const arrivalAirports=uniqueCodes(to.airports,12)
  .filter(x=>!departureAirports.includes(x));
 if(!departureAirports.length||!arrivalAirports.length)
  return {status:'no_airport_pair',candidates:[],datesChecked:[],
   airportDiscovery:{origin:from.status,destination:to.status}};
 const start=departureAt?Date.parse(departureAt):now;
 if(!Number.isFinite(start))return {status:'invalid_date',candidates:[],datesChecked:[]};
 const days=departureAt?1:Math.max(1,Math.min(7,maxDays));
 const maxQueries=Math.max(1,Math.min(12,Number(maxProviderQueries)||9));
 const datesChecked=[],all=[],seen=new Set();
 let lastStatus='no_candidates',queries=0;
 for(let offset=0;offset<days&&queries<maxQueries;offset++){
  const outboundDate=day(start+offset*86400000);
  // One pooled query, then independently scan airports which the pooled
  // results may have suppressed. Direct flights from farther London airports
  // must have a fair chance without assuming an airport name in the source.
  const requests=[],keys=new Set();
  const add=(origins,destinations)=>{
   const a=origins.slice(0,6),b=destinations.slice(0,6);
   if(!a.length||!b.length)return;
   const key=a.join(',')+'>'+b.join(',');
   if(keys.has(key))return;
   keys.add(key);requests.push({departureAirports:a,arrivalAirports:b});
  };
  add(departureAirports.slice(0,6),arrivalAirports.slice(0,6));
  if(departureAirports.length>1)
   for(const departure of departureAirports.slice(0,Math.min(8,maxQueries-1)))
    add([departure],arrivalAirports.slice(0,6));
  // If nearby destination airports exceed one supplier request, include the
  // farther group instead of silently dropping all those alternatives.
  if(arrivalAirports.length>6)
   add(departureAirports.slice(0,6),arrivalAirports.slice(6,12));
  let attempted=0,foundThisDay=0;
  for(const request of requests){
   if(queries>=maxQueries)break;
   queries++;attempted++;
   let result;
   try{
    result=await search(env,{...request,outboundDate,currency:'GBP',userInitiated:true});
   }catch{result={status:'provider_unavailable',candidates:[]};}
   lastStatus=result?.status||'provider_unavailable';
   for(const candidate of result?.candidates||[]){
    if(!departureAt&&candidate.legs?.[0]?.startLocal &&
       candidate.legs[0].startLocal.slice(0,10)<day(now))continue;
    const key=signature(candidate);
    if(!key||seen.has(key))continue;
    seen.add(key);all.push(candidate);foundThisDay++;
   }
   // Do not continue to burn quota or report false 'no flights' when access
   // is disabled, exhausted, or credentials/provider requests fail.
   if(!['candidate_results_only','provider_error'].includes(lastStatus))break;
  }
  datesChecked.push({date:outboundDate,status:foundThisDay?'candidate_results_only':lastStatus,
   queries:attempted,candidates:foundThisDay});
  // The selected date is fixed; an undated request shows the first day with
  // results, but compares all checked airport sources for that day.
  if(foundThisDay||!['candidate_results_only','provider_error'].includes(lastStatus))break;
 }
 return {status:all.length?'candidate_results_only':lastStatus,
  candidates:rankMixedFlightCandidates(all,{max:20}),datesChecked,
  departureAirports,arrivalAirports,providerSearchCount:queries,
  completeDoorToDoor:false,timezoneAndTransfersUnverified:true};
}
