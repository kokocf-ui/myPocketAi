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
 'pharmacy','limited','ltd','road','street','strada','of','at','de','la','le','el']);
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
const wikidataFile=async(name,id,fetcher)=>{
 const u=new URL(WD+id+'.json');
 const entity=(await req(u,fetcher))?.entities?.[id];
 if(!entity)return '';
 const labels=Object.values(entity.labels||{}).map(x=>x?.value||'');
 const aliases=Object.values(entity.aliases||{}).flatMap(x=>x.map(i=>i?.value||'')).slice(0,60);
 if(![...labels,...aliases].some(label=>normalize(label)===normalize(name)||tokenMatch(label,name)))return '';
 const p18=entity.claims?.P18||[];
 for(const c of p18.slice(0,2)){
  const v=c?.mainsnak?.datavalue?.value;
  if(typeof v==='string'&&/\.(?:jpe?g|png|webp)$/i.test(v)&&!unsuitable.test(v)&&v.length<220)
   return 'File:'+v;
 }
 return '';
};
export async function verifiedLocationPhoto({name='',latitude,longitude,wikidata='',
 fetcher=fetch,cache=null}={}){
 name=String(name||'').trim().slice(0,120);
 latitude=Number(latitude);longitude=Number(longitude);
 const valid=latlon(latitude,longitude);
 if(!name||name.length<4||!valid)return {status:'unavailable',photo:null};
 const id=qid(wikidata);
 // For high-volume use, Cloudflare edge caching is essential; 2-day TTL.
 const key=new URL('https://pocket-photo-cache.invalid/photo/'+
  encodeURIComponent(normalize(name).slice(0,90))+'/'+
  latitude.toFixed(5)+'/'+longitude.toFixed(5)+'/'+id);
 const c=cache||(typeof caches!=='undefined'?caches.default:null);
 if(c){try{const hit=await c.match(key.href);if(hit)return await hit.json()}catch{}}
 let result={status:'unavailable',photo:null};
 try{
  let titles=[];
  if(id){const entityFile=await wikidataFile(name,id,fetcher);if(entityFile)titles.push(entityFile)}
  // Query nearby photos only when an exact entity picture was not available.
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
