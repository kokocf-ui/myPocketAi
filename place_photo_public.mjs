// Independent verified location photo resolver (v2).
// Deliberately does not use place-media, favicons, company logos or Exa.
// Only Creative Commons / public-domain photo files tied to the specific
// location by nearby photo geotags, or an entity's own Wikidata P18.
const API='https://commons.wikimedia.org/w/api.php';
const WD='https://www.wikidata.org/wiki/Special:EntityData/';
const qid=x=>/^Q[1-9]\d{0,11}$/.test(String(x||''))?String(x):'';
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
 .toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const generic=new Set(['the','and','shop','store','restaurant','cafe','hotel','inn',
 'pharmacy','limited','ltd','road','street','strada','of','at','de','la','le','el',
 'visitor','centre','center','building','station','underground','metro']);
const meaningful=s=>normalize(s).split(' ').filter(x=>x.length>=3&&!generic.has(x));
const tokenMatch=(title,name)=>{
 const t=normalize(title),parts=meaningful(name);
 // Require two informative words, or one unusual complete name token.
 if(!parts.length)return false;
 const hits=parts.filter(w=>t.split(' ').includes(w));
 return parts.length===1?parts[0].length>=6&&hits.length===1
  :hits.length>=Math.min(2,parts.length)&&hits.length/parts.length>=0.65;
};
const unsuitable=/\b(logo|icon|insignia|emblem|symbol|svg|coat.of.arms|map|drawing|diagram|poster|advert|menu|plan|flag|signage|badge|wordmark)\b/i;
const allowed=/^(?:CC\s*BY(?:-SA)?(?:\s+\d(?:\.\d)?)?|CC0(?:\s*1\.0)?|Public domain|PD(?:-|$))/i;
const cleaned=x=>String(x||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim().slice(0,160);
const latlon=(lat,lon)=>Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180;
const mediaUrl=x=>{
 try{const u=new URL(x);return u.protocol==='https:'&&
  ['upload.wikimedia.org','commons.wikimedia.org'].includes(u.hostname)?u.href:''}catch{return ''}
};
const req=async (u,fetcher)=>{
 const r=await fetcher(u.href,{headers:{Accept:'application/json',
  'User-Agent':'myPocketAI/1.0 (public location photograph attribution; github.com/kokocf-ui/myPocketAi)'},
  signal:AbortSignal.timeout(3800)});
 if(!r.ok)return null;
 return r.json();
};
const commonsImage=async(title,fetcher)=>{
 if(!/^File:/i.test(title)||unsuitable.test(title))return null;
 const u=new URL(API);
 for(const [k,v] of Object.entries({
  action:'query',format:'json',formatversion:'2',prop:'imageinfo',
  iiprop:'url|extmetadata|size|mime',iiurlwidth:'720',
  titles:title
 }))u.searchParams.set(k,v);
 const response=await req(u,fetcher);
 const row=response?.query?.pages?.[0];
 const info=row?.imageinfo?.[0];
 if(!info||info.width<480||info.height<240||!/^image\/(?:jpeg|png|webp)$/i.test(info.mime||''))return null;
 const image=mediaUrl(info.thumburl||info.url);
 const metadata=info.extmetadata||{};
 const license=cleaned(metadata.LicenseShortName?.value);
 if(!image||!allowed.test(license)||!metadata.LicenseUrl?.value&&!/CC0|Public domain|^PD/i.test(license))return null;
 const source='https://commons.wikimedia.org/wiki/'+encodeURIComponent(row.title||title).replace(/%3A/i,':');
 const author=cleaned(metadata.Artist?.value);
 const licenseUrl=String(metadata.LicenseUrl?.value||'').slice(0,350);
 const result={image_url:image,source_url:source,credit:author||'Wikimedia Commons',
  license,license_url:/^https:\/\/creativecommons\.org\/licenses?\//.test(licenseUrl)?licenseUrl:'',
  source:'Wikimedia Commons',verified_location:true};
 return result;
};
// Direct photo references attached to the *specific* OpenStreetMap feature
// are a stronger identity signal than searching for pictures merely nearby.
const fileReference=value=>{
 const raw=String(value||'').trim();
 if(/^File:[^?&#]{5,220}\.(?:jpe?g|png|webp)$/i.test(raw))return raw;
 try{
  const u=new URL(raw);
  if(u.protocol!=='https:'||u.hostname!=='commons.wikimedia.org')return '';
  const path=decodeURIComponent(u.pathname);
  const file=path.match(/\/(?:wiki\/|wiki\/Special:FilePath\/)(File:[^?&#]+\.(?:jpe?g|png|webp)|[^?&#]+\.(?:jpe?g|png|webp))$/i)?.[1];
  return file?'File:'+file.replace(/^File:/i,''):'';
 }catch{return ''}
};
const sameBusiness=(a,b)=>{
 const left=normalize(a),right=normalize(b);
 return left&&right&&(left===right||
  (left.length>=12&&right.length>=12&&(left.startsWith(right+' ')||right.startsWith(left+' '))));
};
const osmLinkedFile=async(name,latitude,longitude,fetcher)=>{
 const query='[out:json][timeout:5];(nwr(around:55,'+latitude+','+longitude+')['+
  '"wikimedia_commons"];nwr(around:55,'+latitude+','+longitude+')"image"];);out tags center 40;';
 const response=await fetcher('https://overpass-api.de/api/interpreter',{
  method:'POST',body:'data='+encodeURIComponent(query),
  headers:{'Content-Type':'application/x-www-form-urlencoded'},
  signal:AbortSignal.timeout(4200)
 });
 if(!response.ok)return '';
 const elements=(await response.json())?.elements;
 if(!Array.isArray(elements))return '';
 for(const item of elements.slice(0,40)){
  const tags=item?.tags||{};
  if(!sameBusiness(tags.name||tags['name:en']||tags['name:ro'],name))continue;
  const coords={lat:Number(item.lat??item.center?.lat),lon:Number(item.lon??item.center?.lon)};
  if(!latlon(coords.lat,coords.lon))continue;
  const rad=Math.PI/180;
  const dy=(latitude-coords.lat)*rad,dx=(longitude-coords.lon)*rad;
  const distance=12742000*Math.atan2(Math.sqrt(
   Math.sin(dy/2)**2+Math.cos(latitude*rad)*Math.cos(coords.lat*rad)*Math.sin(dx/2)**2),
   Math.sqrt(Math.max(0,1-(Math.sin(dy/2)**2+Math.cos(latitude*rad)*Math.cos(coords.lat*rad)*Math.sin(dx/2)**2))));
  if(distance>60)continue;
  const file=fileReference(tags.wikimedia_commons)||fileReference(tags.image);
  if(file)return file;
 }
 return '';
};
const placeFile=async(name,latitude,longitude,fetcher)=>{
 const u=new URL(API);
 for(const [k,v] of Object.entries({action:'query',format:'json',list:'geosearch',
  gscoord:latitude+'|'+longitude,gsradius:'85',gsnamespace:'6',
  gsprimary:'all',gslimit:'35',gsprop:'type|name|dim',gsmaxdim:'120'}))u.searchParams.set(k,v);
 const data=await req(u,fetcher);
 const photos=(Array.isArray(data?.query?.geosearch)?data.query.geosearch:[])
  .filter(x=>x?.ns===6&&x.title&&(!Number.isFinite(x.dist)||x.dist<=85))
  .filter(x=>!unsuitable.test(x.title)&&tokenMatch(x.title.replace(/^File:/i,'').replace(/\.[^.]+$/,''),name))
  .sort((a,b)=>Number(a.dist||0)-Number(b.dist||0));
 return photos.slice(0,3).map(x=>x.title);
};
const wikidataFile=async(name,id,latitude,longitude,fetcher)=>{
 const u=new URL(WD+id+'.json');
 const entity=(await req(u,fetcher))?.entities?.[id];
 if(!entity)return '';
 const labels=Object.values(entity.labels||{}).map(x=>x?.value||'');
 const aliases=Object.values(entity.aliases||{}).flatMap(x=>x.map(i=>i?.value||'')).slice(0,60);
 if(![...labels,...aliases].some(label=>normalize(label)===normalize(name)||tokenMatch(label,name)))return '';
 // An organisation can have a brand image or a picture of another branch.
 // Wikidata P18 is accepted only for a place entity with P625 coordinates
 // near the actual business, never a company/brand entity without coordinates.
 const points=entity.claims?.P625||[];
 const close=points.some(point=>{
  const geo=point?.mainsnak?.datavalue?.value;
  if(!geo||!latlon(Number(geo.latitude),Number(geo.longitude)))return false;
  const radians=Math.PI/180;
  const dy=(latitude-Number(geo.latitude))*radians,dx=(longitude-Number(geo.longitude))*radians;
  const t=Math.sin(dy/2)**2+
    Math.cos(latitude*radians)*Math.cos(Number(geo.latitude)*radians)*Math.sin(dx/2)**2;
  return 12742000*Math.atan2(Math.sqrt(t),Math.sqrt(Math.max(0,1-t)))<=180;
 });
 if(!close)return '';
 const p18=entity.claims?.P18||[];
 for(const c of p18.slice(0,2)){
  const v=c?.mainsnak?.datavalue?.value;
  if(typeof v==='string'&&/\.(?:jpe?g|png|webp)$/i.test(v)&&!unsuitable.test(v)&&v.length<220)
   return 'File:'+v;
 }
 return '';
};
export async function verifiedLocationPhoto({name='',latitude,longitude,wikidata='',commonsTag='',
 fetcher=fetch,cache=null}={}){
 name=String(name||'').trim().slice(0,120);
 latitude=Number(latitude);longitude=Number(longitude);
 const valid=latlon(latitude,longitude);
 if(!name||name.length<4||!valid)return {status:'unavailable',photo:null};
 const id=qid(wikidata);
 // For high-volume use, Cloudflare edge caching is essential; 2-day TTL.
 const key=new URL('https://pocket-photo-cache.invalid/photo/'+
  encodeURIComponent(normalize(name).slice(0,90))+'/'+
  latitude.toFixed(5)+'/'+longitude.toFixed(5)+'/'+id+'/'+
  encodeURIComponent(String(commonsTag||'').slice(0,140)));
 const c=cache||(typeof caches!=='undefined'?caches.default:null);
 if(c){try{const hit=await c.match(key.href);if(hit)return await hit.json()}catch{}}
 let result={status:'unavailable',photo:null};
 try{
  let titles=[];
  // Strongest signal: a picture linked directly from the exact mapped POI.
  const tagged=fileReference(commonsTag);
  if(tagged)titles.push(tagged);
  if(!titles.length){
   try{const fromOsm=await osmLinkedFile(name,latitude,longitude,fetcher);if(fromOsm)titles.push(fromOsm)}catch{}
  }
  if(!titles.length&&id){
   const entityFile=await wikidataFile(name,id,latitude,longitude,fetcher);
   if(entityFile)titles.push(entityFile);
  }
  if(!titles.length)titles=await placeFile(name,latitude,longitude,fetcher);
  for(const title of titles.slice(0,3)){
   const photo=await commonsImage(title,fetcher);
   if(photo){result={status:'verified',photo};break}
  }
 }catch{}
 if(c)try{await c.put(key.href,Response.json(result,{
  headers:{'Cache-Control':'public, max-age=172800'}}))}catch{}
 return result;
}
