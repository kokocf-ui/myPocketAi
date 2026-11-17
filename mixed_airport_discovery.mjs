// Airport candidate discovery is geographic, not a predetermined list.
// This module returns LOCATIONS ONLY; it never asserts a scheduled flight,
// ticket availability, or a verified road/rail connection to an airport.
// A separate licensed flight supplier must confirm actual dated services.
const point=value=>value&&Number.isFinite(Number(value.latitude))&&Math.abs(Number(value.latitude))<=90&&
  Number.isFinite(Number(value.longitude))&&Math.abs(Number(value.longitude))<=180?
  {latitude:Number(value.latitude),longitude:Number(value.longitude)}:null;
const airportCode=props=>{
  const raw=props?.datasource?.raw||{};
  const values=[raw.iata,raw['iata:code'],props.iata,props.iata_code];
  for(const value of values){
    const code=String(value||'').trim().toUpperCase();
    if(/^[A-Z]{3}$/.test(code))return code;
  }
  return null;
};
export function normalizeAirportCandidates(data,origin,{limit=20}={}){
 const found=[],seen=new Set();
 for(const feature of Array.isArray(data?.features)?data.features:[]){
   const props=feature?.properties||{},loc=point({latitude:props.lat??feature?.geometry?.coordinates?.[1],
     longitude:props.lon??feature?.geometry?.coordinates?.[0]});
   const categories=Array.isArray(props.categories)?props.categories:[];
   if(!loc||!categories.some(c=>String(c).startsWith('airport'))||
      categories.some(c=>/airport\.(?:gliding|airfield)$/.test(String(c))))continue;
   const iata=airportCode(props),name=String(props.name||'').trim();
   // Without a verifiable airport code a flight supplier cannot be queried
   // reliably; keep such records out of the usable shortlist.
   if(!iata||!name||seen.has(iata))continue;
   seen.add(iata);
   found.push({id:'iata:'+iata,iata,name:name.slice(0,140),latitude:loc.latitude,
     longitude:loc.longitude,country_code:String(props.country_code||'').toUpperCase(),
     distanceMeters:Number.isFinite(Number(props.distance))?Number(props.distance):null,
     identitySource:'Geoapify Places (OSM)',flightScheduleVerified:false,
     onwardTransferVerified:false});
 }
 found.sort((a,b)=>(a.distanceMeters??Infinity)-(b.distanceMeters??Infinity));
 return found.slice(0,Math.max(1,Math.min(limit,40)));
}
/**
 * Geoapify searches a geographic circle that naturally crosses borders.
 * Returning Debrecen near Oradea is possible because of distance,
 * not because any city or airport is hardcoded.
 */
export async function discoverAirportCandidates(env,location,{
  radiusKm=250,limit=40,fetcher=fetch
}={}){
 const p=point(location);
 if(!p)return {status:'location_unverified',airports:[]};
 const apiKey=String(env?.GEOAPIFY_API_KEY||'').trim();
 if(!apiKey)return {status:'geoapify_not_configured',airports:[]};
 const radius=Math.max(25000,Math.min(350000,Math.round(Number(radiusKm||250)*1000)));
 const url=new URL('https://api.geoapify.com/v2/places');
 url.searchParams.set('categories','airport');
 url.searchParams.set('filter','circle:'+p.longitude+','+p.latitude+','+radius);
 url.searchParams.set('bias','proximity:'+p.longitude+','+p.latitude);
 url.searchParams.set('limit',String(Math.min(100,Math.max(10,limit))));
 url.searchParams.set('apiKey',apiKey);
 try{
   const r=await fetcher(url,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(7000)});
   if(!r.ok)return {status:'provider_http_'+r.status,airports:[]};
   const json=await r.json();
   return {status:'candidates_only',airports:normalizeAirportCandidates(json,p,{limit}),
     noFlightAvailabilityVerified:true};
 }catch{return {status:'provider_unavailable',airports:[]};}
}
