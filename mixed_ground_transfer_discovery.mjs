// Independent geographic discovery of surface-transport hubs.
// Geoapify Places supplies LOCATION candidates, never schedules, fares or
// proof that two independently named stops are the same interchange.
// Train, bus and ferry candidates are found without preset cities/routes.
const geoPoint=p=>p&&p.latitude!=null&&p.longitude!=null&&
 Number.isFinite(Number(p.latitude))&&Math.abs(Number(p.latitude))<=90&&
 Number.isFinite(Number(p.longitude))&&Math.abs(Number(p.longitude))<=180?
 {latitude:Number(p.latitude),longitude:Number(p.longitude)}:null;
const HUB_TYPES=['public_transport.train','public_transport.bus','public_transport.ferry'];
const metres=(a,b)=>{
 const rad=Math.PI/180,dLat=(b.latitude-a.latitude)*rad,
  dLon=(b.longitude-a.longitude)*rad;
 const h=Math.sin(dLat/2)**2+Math.cos(a.latitude*rad)*Math.cos(b.latitude*rad)*
  Math.sin(dLon/2)**2;
 return 12742000*Math.asin(Math.min(1,Math.sqrt(Math.max(0,h))));
};
export function normalizeGroundTransferCandidates(data,origin,category){
 const p=geoPoint(origin);
 if(!p||!HUB_TYPES.includes(category))return [];
 const seen=new Set(),items=[];
 for(const feature of Array.isArray(data?.features)?data.features:[]){
  const prop=feature?.properties||{},raw=prop.datasource?.raw||{};
  const categories=Array.isArray(prop.categories)?prop.categories:[];
  const point=geoPoint({latitude:prop.lat??feature?.geometry?.coordinates?.[1],
   longitude:prop.lon??feature?.geometry?.coordinates?.[0]});
  const placeId=String(prop.place_id||'').trim();
  const name=String(prop.name||raw.name||'').trim();
  if(!point||!name||!placeId||placeId.length>110||seen.has(placeId)||
   !categories.includes(category))continue;
  seen.add(placeId);
  items.push({
   id:'geoapify:'+placeId,label:name.slice(0,140),
   latitude:point.latitude,longitude:point.longitude,
   country_code:String(prop.country_code||'').toUpperCase(),
   hubType:category.split('.').at(-1),
   distanceMeters:metres(p,point),
   // A mapped stop is a *search node*, NOT a verified timetable.
   identitySource:'Geoapify Places (OSM)',
   serviceScheduleVerified:false,transferVerified:false,
   majorBusTerminal:category==='public_transport.bus'&&
    (raw.amenity==='bus_station'||raw.bus_station==='yes')
  });
 }
 items.sort((a,b)=>category==='public_transport.bus'&&a.majorBusTerminal!==b.majorBusTerminal?
  Number(b.majorBusTerminal)-Number(a.majorBusTerminal):
  a.distanceMeters-b.distanceMeters);
 return items;
}
export async function discoverGroundTransferCandidates(env,location,{
 radiusKm=110,limit=3,fetcher=fetch,signal=null
}={}){
 if(signal?.aborted)return {status:'search_timeout',candidates:[]};
 const p=geoPoint(location);
 if(!p)return {status:'location_unverified',candidates:[]};
 const key=String(env?.GEOAPIFY_API_KEY||'').trim();
 if(!key)return {status:'geoapify_not_configured',candidates:[]};
 const radius=Math.max(15000,Math.min(200000,Math.round(Number(radiusKm||110)*1000)));
 const perTypeLimit=24;
 const groups=await Promise.all(HUB_TYPES.map(async category=>{
  const url=new URL('https://api.geoapify.com/v2/places');
  url.searchParams.set('categories',category);
  url.searchParams.set('filter','circle:'+p.longitude+','+p.latitude+','+radius);
  url.searchParams.set('bias','proximity:'+p.longitude+','+p.latitude);
  url.searchParams.set('limit',String(perTypeLimit));
  url.searchParams.set('apiKey',key);
  try{
   const response=await fetcher(url,{headers:{Accept:'application/json'},
    signal:signal?AbortSignal.any([signal,AbortSignal.timeout(6500)]):AbortSignal.timeout(6500)});
   if(!response.ok)return {status:'provider_http_'+response.status,items:[]};
   return {status:'candidates_only',items:normalizeGroundTransferCandidates(
    await response.json(),p,category)};
  }catch{return {status:'provider_unavailable',items:[]};}
 }));
 // Each transport family gets a fair chance; thousands of neighbourhood bus
 // stops must not crowd out nearby rail terminals or ferry ports.
 const candidates=[],seen=new Set(),cap=Math.max(1,Math.min(9,Math.trunc(limit)||3));
 for(let rank=0;candidates.length<cap&&rank<perTypeLimit;rank++){
  let added=false;
  for(const group of groups){
   const item=group.items[rank];
   if(!item||seen.has(item.id))continue;
   seen.add(item.id);candidates.push(item);added=true;
   if(candidates.length>=cap)break;
  }
  if(!added&&groups.every(g=>g.items.length<=rank))break;
 }
 return {status:candidates.length?'candidates_only':
  groups.every(g=>g.status==='candidates_only')?'no_candidates':'provider_unavailable',
  candidates,searchStatuses:groups.map((g,i)=>({category:HUB_TYPES[i],status:g.status})),
  schedulesVerified:false};
}
