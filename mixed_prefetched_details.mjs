// Prepare details during the INITIAL mixed search. Selecting a card must
// never launch a second search or depend on a refresh button.
import {discoverAirportCandidates} from './mixed_airport_discovery.mjs';
import {connectCandidateFlightToGround,resolveAirportZone}
 from './mixed_flight_ground_connections.mjs';

const point=p=>p&&p.latitude!=null&&p.longitude!=null&&
 Number.isFinite(Number(p.latitude))&&Number.isFinite(Number(p.longitude))&&
 Math.abs(Number(p.latitude))<=90&&Math.abs(Number(p.longitude))<=180;
const flightSnapshot=flight=>({
 from:String(flight?.legs?.[0]?.from||'').slice(0,3),
 to:String(flight?.legs?.at(-1)?.to||'').slice(0,3),
 airline:String(flight?.legs?.[0]?.airline||'').slice(0,120),
 flightNumber:String(flight?.legs?.[0]?.flightNumber||'').slice(0,30),
 departureLocal:String(flight?.legs?.[0]?.startLocal||'').slice(0,40),
 arrivalLocal:String(flight?.legs?.at(-1)?.endLocal||'').slice(0,40)
});
const incomplete=(flight,origin,destination,status)=>({
 status,completeDoorToDoor:false,groundConnectionsVerified:false,
 bookingVerified:false,accessJourney:null,egressJourney:null,
 originLabel:String(origin?.label||'').slice(0,160),
 destinationLabel:String(destination?.label||'').slice(0,160),
 flight:flightSnapshot(flight),
 airportFrom:{iata:String(flight?.legs?.[0]?.from||'').slice(0,3)},
 airportTo:{iata:String(flight?.legs?.at(-1)?.to||'').slice(0,3)}
});

/**
 * Enrich ALL the displayed flights before sending the initial search response.
 * Shared airport and timezone discovery is memoized per search, not hardcoded
 * by city/country. A missing provider yields an explicitly incomplete itinerary.
 */
export async function prepareMixedFlightOptions(env,{
 candidates=[],origin,destination,requestedAt=null,language='ro',limit=6,airportCandidates=null
}={},{
 connect=connectCandidateFlightToGround,
 discover=discoverAirportCandidates,resolveZone=resolveAirportZone,
 planAccess,planEgress=null,planRegional=null,now=Date.now(),budgetMs=7500
}={}){
 const selected=Array.isArray(candidates)?candidates.slice(0,Math.max(0,Math.min(6,limit))):[];
 if(!point(origin)||!point(destination))return selected.map(flight=>({
  ...flight,itinerary:incomplete(flight,origin,destination,'missing_endpoints')
 }));
 const locationCache=new Map(),zoneCache=new Map();
 const cachedDiscover=(e,place,options)=>{
  const key=Number(place.latitude)+','+Number(place.longitude)+'|'+
   (options?.radiusKm||'')+'|'+(options?.limit||'');
  const known=place===origin?airportCandidates?.origin:place===destination?airportCandidates?.destination:null;
  if(!locationCache.has(key))locationCache.set(key,Array.isArray(known)&&known.length?
   Promise.resolve({status:'ok',airports:known}):Promise.resolve().then(()=>discover(e,place,options)));
  return locationCache.get(key);
 };
 const cachedZone=(e,airport,at,options)=>{
  const key=String(airport?.iata||'')+'|'+at;
  if(!zoneCache.has(key))zoneCache.set(key,Promise.resolve().then(()=>resolveZone(e,airport,at,options)));
  return zoneCache.get(key);
 };
 return Promise.all(selected.map(async flight=>{
  if(!Array.isArray(flight?.legs)||flight.legs.length!==1)return {
   ...flight,itinerary:incomplete(flight,origin,destination,'air_transfer_unverified')
  };
  try{
   const details=await connect(env,{
    origin,destination,flight,requestedAt,language
   },{discover:cachedDiscover,resolveZone:cachedZone,
    ...(typeof planAccess==='function'?{planAccess}:{}),
    planEgress,planRegional,now,budgetMs});
   return {...flight,itinerary:{
    ...incomplete(flight,origin,destination,details?.status||'provider_unavailable'),
    ...(details&&typeof details==='object'?details:{})
   }};
  }catch{return {...flight,itinerary:incomplete(flight,origin,destination,
    'ground_provider_unavailable')}}
 }));
}
