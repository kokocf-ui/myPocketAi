// Sparse-result supplement from public OpenStreetMap Overpass; no paid key.
// Bounded to named food POIs, with a coarse geographic Cloudflare cache.
// Avoid bulk/country-wide queries or repeatedly hitting donated API servers.
import {foodCategoryAccepts} from './food_location_quality.mjs';
import {retailCategoryAccepts} from './retail_category.mjs';
const rad=Math.PI/180;
const distance=(a,b,c,d)=>{
 const x=Math.sin((c-a)*rad/2)**2+Math.cos(a*rad)*Math.cos(c*rad)*Math.sin((d-b)*rad/2)**2;
 return 12742000*Math.atan2(Math.sqrt(x),Math.sqrt(Math.max(0,1-x)));
};
const number=x=>Number.isFinite(x)&&Math.abs(x)<=180;
export async function nearbyOpenStreetMapFood({latitude,longitude,radius=5000,category='',fetcher=fetch,cache=null}={}){
 const retail=['corner_shop','supermarket','shop','market_bakery','confectionery'].includes(category);
 const food=['restaurant','fast_food'].includes(category);
 if(!(retail||food)||!number(latitude)||!number(longitude)||
  Math.abs(latitude)>90||radius<100||radius>10000)return [];
 const centerLat=Math.round(latitude*100)/100,centerLon=Math.round(longitude*100)/100;
 const searchRadius=Math.min(10000,Math.ceil(radius+900));
 const group=retail?'retail':'food';
 const key='https://pocketai-cache.invalid/osm-poi/'+group+'/'+centerLat+'/'+centerLon+'/'+searchRadius;
 const sharedCache=cache||(typeof caches!=='undefined'?caches.default:null);
 let data=null;
 if(sharedCache){try{const hit=await sharedCache.match(key);if(hit)data=await hit.json()}catch{}}
 if(!data){
  const selector=retail?'["shop"~"^(supermarket|convenience|grocery|general|greengrocer|newsagent|kiosk|deli|bakery|pastry|confectionery)$"]':'["amenity"~"^(fast_food|restaurant)$"]';
  const q='[out:json][timeout:8];(nwr'+selector+'(around:'+searchRadius+','+centerLat+','+centerLon+'););out center 350;';
  try{
   const response=await fetcher('https://overpass-api.de/api/interpreter',{
    method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded',
     'Accept':'application/json','User-Agent':'myPocketAI local food discovery (github.com/kokocf-ui/myPocketAi)'},
    body:'data='+encodeURIComponent(q),signal:AbortSignal.timeout(4600)
   });
   if(!response.ok)return [];
   data=await response.json();
   if(!Array.isArray(data?.elements))return [];
   data={elements:data.elements.slice(0,350)};
   if(sharedCache){
    try{await sharedCache.put(key,Response.json(data,{headers:{'Cache-Control':'public, max-age=21600'}}))}catch{}
   }
  }catch{return []}
 }
 return data.elements.flatMap(item=>{
  const tags=item.tags||{},name=String(tags.name||'').trim();
  const lat=Number(item.lat??item.center?.lat),lon=Number(item.lon??item.center?.lon);
  const matches=retail
   ?category==='confectionery'?/^(bakery|pastry|confectionery)$/.test(String(tags.shop||'')):
    retailCategoryAccepts(category,{name,shop:tags.shop})
   :foodCategoryAccepts(category,{name,amenity:tags.amenity,cuisine:tags.cuisine});
  if(!name||name.length>140||!number(lat)||!number(lon)||Math.abs(lat)>90||
    distance(latitude,longitude,lat,lon)>radius||!matches)return [];
  return [{lat,lon,tags:{
   name,amenity:tags.amenity||'',shop:tags.shop||'',cuisine:tags.cuisine||'',
   street:tags['addr:street']||'',housenumber:tags['addr:housenumber']||'',
   city:tags['addr:city']||'',postcode:tags['addr:postcode']||'',
   website:tags.website||tags['contact:website']||'',
   phone:tags.phone||tags['contact:phone']||'',
   osm_id:String(item.type||'')+'/'+String(item.id||''),poi_source:'OpenStreetMap Overpass'
  }}];
 });
}
