import {photonNearbyUrl} from './photon_category_discovery.mjs';

// Photon is already used elsewhere in this app. It is a *last resort* for
// parking only when the existing bounded Overpass request fails; no extra
// provider or paid service is introduced.
async function recoverParkingFromPhoton({latitude,longitude,radius,fetcher}){
 let url=photonNearbyUrl({latitude,longitude,radius,category:'parking'});
 try{
  let response=await fetcher(url.toString(),{
   headers:{Accept:'application/json'},signal:AbortSignal.timeout(2800)
  });
  if([400,422].includes(response.status)){
   url=photonNearbyUrl({latitude,longitude,radius,category:'parking',
    query:'parking',useCategories:false});
   response=await fetcher(url.toString(),{
    headers:{Accept:'application/json'},signal:AbortSignal.timeout(2200)
   });
  }
  if(!response.ok)return {status:'http_'+response.status,elements:[]};
  const payload=await response.json();
  if(!Array.isArray(payload?.features))return {status:'invalid_response',elements:[]};
  const elements=payload.features.flatMap(feature=>{
   const p=feature?.properties||{},coords=feature?.geometry?.coordinates||[];
   const lon=Number(coords[0]),lat=Number(coords[1]);
   // A name containing "parking" is insufficient: require an OSM tag.
   if(String(p.osm_key||'').toLowerCase()!=='amenity'||
      String(p.osm_value||p.type||'').toLowerCase()!=='parking'||
      !good(lat,lon)||distance(latitude,longitude,lat,lon)>radius)return [];
   return [{type:'node',id:String(p.osm_id||p.osm_id_str||''),
    lat,lon,tags:{
     amenity:'parking',name:String(p.name||'').slice(0,180),
     'addr:street':String(p.street||p.street_name||''),
     'addr:housenumber':String(p.housenumber||''),
     'addr:city':String(p.city||p.town||''),
     'addr:postcode':String(p.postcode||''),
     poi_source:'OpenStreetMap Photon'
    }}];
  });
  return {status:'ok',elements};
 }catch(error){return {status:String(error?.name||'network_error'),elements:[]}}
}

// Sparse category fallback to bounded OSM Overpass; runs ONLY after the
// normal maps providers have returned no usable parking/zoo results.
// Public community service: low-volume only; cache coarse cells for 6h.
const rad=Math.PI/180;
// OSM's listed public instance accepts modest use and avoids overpass-api.de's
// repeated 406/429 failures; do not rotate through many public mirrors.
const OVERPASS_SPARSE_URL='https://overpass.private.coffee/api/interpreter';
function distance(a,b,c,d){
 const h=Math.sin((c-a)*rad/2)**2+
  Math.cos(a*rad)*Math.cos(c*rad)*Math.sin((d-b)*rad/2)**2;
 return 12742000*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));
}
const good=(lat,lon)=>Number.isFinite(lat)&&Number.isFinite(lon)&&
 Math.abs(lat)<=90&&Math.abs(lon)<=180;
export async function nearbySparseMapPlaces({
 latitude,longitude,category='',radius=5000,fetcher=fetch,cache=null,diagnostics=null
}={}){
 if(!['parking','zoo'].includes(category)||!good(latitude,longitude)||
  !Number.isFinite(radius)||radius<100||radius>40000)return [];
 const lat=Math.round(latitude*100)/100,lon=Math.round(longitude*100)/100;
 const searchRadius=Math.min(40000,Math.ceil(radius+900));
 const key='https://pocketai-cache.invalid/osm-sparse-v1/'+category+
  '/'+lat+'/'+lon+'/'+searchRadius;
 const started=Date.now();
 const trace=(status,extra={})=>{if(diagnostics&&typeof diagnostics==='object'){
  Object.assign(diagnostics,{provider:'Overpass private.coffee',status,elapsedMs:Date.now()-started,...extra});
 }};
 const sharedCache=cache||(typeof caches!=='undefined'?caches.default:null);
 let data=null;
 if(sharedCache)try{const hit=await sharedCache.match(key);if(hit){data=await hit.json();trace('cache_hit')}}catch{}
 if(!data){
  const selector=category==='parking'?'["amenity"="parking"]':'["tourism"="zoo"]';
  const q='[out:json][timeout:6];(nwr'+selector+
   '(around:'+searchRadius+','+lat+','+lon+'););out center 160;';
  try{
   const r=await fetcher(OVERPASS_SPARSE_URL,{
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded',
     Accept:'application/json',
     'User-Agent':'myPocketAI/1.0 POI discovery (https://github.com/kokocf-ui/myPocketAi)'},
    body:'data='+encodeURIComponent(q),signal:AbortSignal.timeout(4500)
   });
   if(r.ok){
    const payload=await r.json();
    if(Array.isArray(payload?.elements)){
     data={elements:payload.elements.slice(0,160)};
     trace('ok',{sourceCount:data.elements.length});
    }else trace('invalid_response');
   }else trace('http_'+r.status);
  }catch(error){
   trace(String(error?.name||'network_error').slice(0,64),
    {detail:String(error?.message||'').slice(0,110)});
  }
  if(!data&&category==='parking'){
   const recovered=await recoverParkingFromPhoton({
    latitude,longitude,radius,fetcher
   });
   if(recovered.elements.length){
    data={elements:recovered.elements.slice(0,100)};
    trace('photon_fallback_ok',{sourceCount:data.elements.length});
   }else trace('photon_fallback_'+recovered.status);
  }
  if(!data)return [];
  if(sharedCache)try{await sharedCache.put(key,Response.json(data,
   {headers:{'Cache-Control':'public, max-age=21600'}}))}catch{}
 }
 return data.elements.flatMap(item=>{
  const t=item.tags||{},pLat=Number(item.lat??item.center?.lat),
   pLon=Number(item.lon??item.center?.lon);
  if(!good(pLat,pLon)||distance(latitude,longitude,pLat,pLon)>radius)return [];
  if(category==='parking'&&t.amenity!=='parking')return [];
  if(category==='zoo'&&t.tourism!=='zoo')return [];
  const proper=String(t.name||t['name:en']||t['name:ro']||'').trim();
  // Unnamed car parks are valid mapped facilities, but an unnamed zoo
  // is not a useful verified destination and should not be invented.
  if(category==='zoo'&&!proper)return [];
  const street=String(t['addr:street']||'').trim();
  const name=proper||(street?'Parcare — '+street:'Parcare (OpenStreetMap)');
  if(name.length>180)return [];
  return [{lat:pLat,lon:pLon,tags:{
   name,amenity:category==='parking'?'parking':'',tourism:category==='zoo'?'zoo':'',
   street,housenumber:String(t['addr:housenumber']||''),
   postcode:String(t['addr:postcode']||''),city:String(t['addr:city']||''),
   website:String(t.website||t['contact:website']||''),
   phone:String(t.phone||t['contact:phone']||''),
   osm_id:String(item.type||'')+'/'+String(item.id||''),
   poi_source:t.poi_source==='OpenStreetMap Photon'?'OpenStreetMap Photon':'OpenStreetMap Overpass'
  }}];
 });
}
