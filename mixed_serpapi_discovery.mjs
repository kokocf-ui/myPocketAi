// Optional SerpApi discovery for an international mixed A-to-B request.
// Results are flight candidates, NOT verified door-to-door journeys.
import {discoverAirportCandidates} from './mixed_airport_discovery.mjs';
import {searchSerpApiFreeFlights} from './serpapi_flight_pilot.mjs';

const day = ms => new Date(ms).toISOString().slice(0,10);
const signature = item => (item.legs||[]).map(l=>[
  l.from,l.to,l.startLocal,l.flightNumber||l.airline
].join('|')).join('>');
export async function discoverMixedFlightCandidates(env,{origin,destination,departureAt=null,
  now=Date.now(),maxDays=3,discover=discoverAirportCandidates,search=searchSerpApiFreeFlights}={}){
  if(env?.SERPAPI_FLIGHTS_PILOT_ENABLED!=='true'||
     env?.SERPAPI_FLIGHTS_TERMS_REVIEWED!=='true')
    return {status:'disabled',candidates:[],datesChecked:[]};
  if(!origin||!destination)return {status:'missing_endpoints',candidates:[],datesChecked:[]};
  const [from,to]=await Promise.all([
    discover(env,origin,{radiusKm:240,limit:12}),
    discover(env,destination,{radiusKm:240,limit:12})
  ]);
  const departureAirports=[...new Set((from.airports||[]).map(a=>a.iata).filter(Boolean))].slice(0,6);
  const arrivalAirports=[...new Set((to.airports||[]).map(a=>a.iata).filter(Boolean))]
    .filter(x=>!departureAirports.includes(x)).slice(0,6);
  if(!departureAirports.length||!arrivalAirports.length)
    return {status:'no_airport_pair',candidates:[],datesChecked:[],
      airportDiscovery:{origin:from.status,destination:to.status}};
  const start=departureAt?Date.parse(departureAt):now;
  if(!Number.isFinite(start))return {status:'invalid_date',candidates:[],datesChecked:[]};
  const days=departureAt?1:Math.max(1,Math.min(7,maxDays));
  const datesChecked=[],all=[],seen=new Set();
  let lastStatus='no_candidates';
  // Without a selected date, progressively search now and following days.
  for(let offset=0;offset<days;offset++){
    const outboundDate=day(start+offset*86400000);
    const result=await search(env,{departureAirports,arrivalAirports,outboundDate,
      currency:'GBP',userInitiated:true});
    datesChecked.push({date:outboundDate,status:result.status});
    lastStatus=result.status;
    for(const candidate of result.candidates||[]){
      if(!departureAt&&candidate.legs?.[0]?.startLocal){
        // Only compare local-day candidate dates, never invent a UTC timezone.
        if(candidate.legs[0].startLocal.slice(0,10)<day(now))continue;
      }
      const key=signature(candidate);
      if(!key||seen.has(key))continue;
      seen.add(key);all.push(candidate);
    }
    if(all.length)break; // earliest day with results, no needless credit use.
    if(!['candidate_results_only'].includes(result.status))break;
  }
  return {status:all.length?'candidate_results_only':lastStatus,
    candidates:all.slice(0,12),datesChecked,departureAirports,arrivalAirports,
    completeDoorToDoor:false,timezoneAndTransfersUnverified:true};
}
