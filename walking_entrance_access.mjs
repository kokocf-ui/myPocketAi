// Pedestrian-only arrival discovery. OSM mapped entrances are suggestions,
// never straight-line connectors or a claim that an entrance is open now.
const pi=Math.PI/180;
const distance=(a,b)=>{const dy=(b.latitude-a.latitude)*pi,dx=(b.longitude-a.longitude)*pi;
 const h=Math.sin(dy/2)**2+Math.cos(a.latitude*pi)*Math.cos(b.latitude*pi)*Math.sin(dx/2)**2;
 return 12742000*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));};
const valid=p=>p&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&
 Math.abs(p.latitude)<=90&&Math.abs(p.longitude)<=180;
const allowed=new Set(['yes','main','public','shop','entrance','designated']);
const blocked=new Set(['no','private','customers_only','permit','delivery','service','emergency','exit','exit_only','garage']);
export function mappedWalkingEntranceCandidates(elements,destination,origin){
 if(!valid(destination)||!valid(origin))return [];
 const label=String(destination.label||'').toLowerCase();
 const radius=/\b(?:shopping|mall|centre|center)\b/.test(label)?180:85;
 const results=[];
 for(const e of Array.isArray(elements)?elements:[]){
  if(e?.type!=='node'||!Number.isFinite(e.lat)||!Number.isFinite(e.lon))continue;
  const t=e.tags||{},kind=String(t.entrance||'').toLowerCase();
  if(!allowed.has(kind)||blocked.has(String(t.access||'').toLowerCase())||
    blocked.has(String(t.foot||'').toLowerCase())||
    blocked.has(String(t['access:conditional']||'').toLowerCase()))continue;
  const point={latitude:e.lat,longitude:e.lon};
  const proximity=distance(destination,point);
  if(proximity>radius)continue;
  results.push({...point,access_kind:'mapped_entrance',
   entrance_osm_id:String(e.id||''),entrance_distance_m:Math.round(proximity),
   label:String(t.name||'Public entrance').slice(0,90),
   rank:distance(origin,point)+proximity*.65});
 }
 results.sort((a,b)=>a.rank-b.rank);
 const chosen=[];
 for(const p of results){
  if(!chosen.some(q=>distance(p,q)<26))chosen.push(p);
  if(chosen.length===4)break;
 }
 return chosen.map(({rank,...p})=>p);
}
export async function discoverMappedWalkingEntrances({destination,origin,fetcher=fetch,cache=null}={}){
 if(!valid(destination)||!valid(origin))return [];
 const label=String(destination.label||'');
 // Never divert a city/street centre or an exact numbered address to a nearby building.
 const venue=/\b(?:shopping|mall|centre|center|hospital|clinic|hotel|restaurant|museum|school|university|supermarket|market|store|shop|cinema|theatre|theater|pharmacy|library|station|bank|church|mosque|office|retail|magazin|spital|hoteluri|farmacie|centru comercial)\b/i.test(label)||
  /^(?:named_place|geoapify_name_search|photon_named_poi|openstreetmap_named_poi|verified_landmark_alias)$/.test(String(destination.resolution_source||''));
 if(!venue||/^\s*\d+[a-z]?\s+\S+\s+(?:street|road|lane|avenue|way)\b/i.test(label))return [];
 // Reuse the project's shared Cloudflare cache; public Overpass is a bounded fallback.
 const lat=Math.round(destination.latitude*1000)/1000,lon=Math.round(destination.longitude*1000)/1000;
 const key='https://pocketai-cache.invalid/walking-entrances-v1/'+lat+'/'+lon;
 const shared=cache||(typeof caches!=='undefined'?caches.default:null);
 let data=null;
 if(shared)try{const found=await shared.match(key);if(found)data=await found.json()}catch{}
 if(!data){
  const q='[out:json][timeout:6];node["entrance"](around:265,'+lat+','+lon+');out body 120;';
  try{
   const response=await fetcher('https://overpass.private.coffee/api/interpreter',{
    method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded',Accept:'application/json',
    'User-Agent':'myPocketAI walking navigation (github.com/kokocf-ui/myPocketAi)'},
    body:'data='+encodeURIComponent(q),signal:AbortSignal.timeout(4500)});
   if(!response.ok)return [];
   const raw=await response.json();
   if(!Array.isArray(raw?.elements))return [];
   data={elements:raw.elements.slice(0,120)};
   if(shared)try{await shared.put(key,Response.json(data,{headers:{'Cache-Control':'public, max-age=21600'}}))}catch{}
  }catch{return []}
 }
 return mappedWalkingEntranceCandidates(data.elements,destination,origin);
}
