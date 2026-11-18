// Wikimedia Commons only: photographic illustrations with explicit reusable licence metadata.
const memo=new Map();
const ACCEPTED_LICENSE=/^(?:Public domain|PD|CC0(?:\s+1\.0)?|CC BY(?:[- ](?:2\.0|2\.5|3\.0|4\.0))?|CC BY-SA(?:[- ](?:2\.0|2\.5|3\.0|4\.0))?)$/i;
function str(value,max=180){return String(value||'').trim().slice(0,max)}
function plain(value,max=160){
 return str(value,2200).replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/gi,' ')
  .replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;/g,"'")
  .replace(/\s+/g,' ').trim().slice(0,max);
}
function safeHttps(raw,host){
 try{const url=new URL(String(raw));if(url.protocol!=='https:'||url.username||url.password||url.hostname!==host)return null;return url.toString()}catch{return null}
}
export function normaliseCommonsPhoto(page){
 const info=page?.imageinfo?.[0];const meta=info?.extmetadata||{};
 const name=str(page?.title,200);
 if(!/^File:/i.test(name)||/\.(?:svg|gif|pdf|webm|mp4)$/i.test(name))return null;
 if(!['image/jpeg','image/png','image/webp'].includes(info?.mime))return null;
 if(!Number.isFinite(Number(info.width))||Number(info.width)<500)return null;
 const licence=plain(meta.LicenseShortName?.value||meta.License?.value,90);
 if(!ACCEPTED_LICENSE.test(licence))return null;
 const image=safeHttps(info.thumburl||info.url,'upload.wikimedia.org');
 const source=safeHttps(info.descriptionurl,'commons.wikimedia.org');
 if(!image||!source)return null;
 const author=plain(meta.Artist?.value||info.user||'Wikimedia Commons',150);
 const licenseUrl=safeHttps(meta.LicenseUrl?.value,'creativecommons.org')||
  safeHttps(meta.LicenseUrl?.value,'www.creativecommons.org')||
  safeHttps(meta.LicenseUrl?.value,'commons.wikimedia.org')||source;
 return {
  title:plain(name.replace(/^File:/i,'').replace(/\.[^.]*$/,''),150),
  url:image,source,author,license:licence,license_url:licenseUrl,
  attribution:plain(meta.Attribution?.value||'',200),provider:'Wikimedia Commons',
  is_ai_generated:false
 };
}
export async function searchStorybookCommonsPhotos(query,{limit=5,fetchImpl=fetch,timeoutMs=9000}={}){
 const input=str(query,110).replace(/[\r\n\t]/g,' ').replace(/\s+/g,' ').trim();
 if(input.length<3||input.length>110)return {status:'invalid_query',photos:[]};
 const max=Math.max(1,Math.min(6,Math.floor(Number(limit)||5)));
 const key=input.toLocaleLowerCase()+':'+max;
 const cached=memo.get(key);if(cached&&cached.exp>Date.now())return cached.value;
 const params=new URLSearchParams({
  action:'query',generator:'search',gsrsearch:input,gsrnamespace:'6',gsrlimit:'24',
  prop:'imageinfo',iiprop:'url|mime|size|extmetadata',iiurlwidth:'960',
  format:'json',formatversion:'2'
 });
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),timeoutMs);
 try{
  const response=await fetchImpl('https://commons.wikimedia.org/w/api.php?'+params.toString(),{
   method:'GET',
   headers:{'Accept':'application/json','User-Agent':'myPocketAI/1.0 (https://github.com/kokocf-ui/myPocketAi; educational book reader)'},
   signal:controller.signal
  });
  if(!response.ok)return {status:response.status===429?'rate_limited':'upstream_unavailable',photos:[]};
  const data=await response.json();
  const pages=Array.isArray(data?.query?.pages)?data.query.pages:[];
  const photos=pages.map(normaliseCommonsPhoto).filter(Boolean);
  const dedup=new Set();
  const distinct=photos.filter(p=>{if(dedup.has(p.url))return false;dedup.add(p.url);return true;}).slice(0,max);
  const result={status:distinct.length?'success':'no_reusable_photos',photos:distinct,query:input,
   source:'Wikimedia Commons',credit_required:true};
  if(memo.size>100)memo.clear();
  memo.set(key,{exp:Date.now()+20*60*1000,value:result});
  return result;
 }catch{return {status:'upstream_unavailable',photos:[]}}
 finally{clearTimeout(timer)}
}
