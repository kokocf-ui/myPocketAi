// Contextual representative illustrations from Commons/Wikipedia and Openverse, no Brave search.
const memo=new Map();
// Commons can describe permitted reuse through several metadata formats, not just a short list.
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
 const licence=plain(meta.LicenseShortName?.value||meta.License?.value,90)||'Detalii pe Wikimedia Commons';
 // Search is not a grant of redistribution rights. Preserve restrictive results
 // for a source-linked preview, and mark them for a separate rights review.
 const rightsReviewRequired=/all rights reserved|fair use|non.free|copyrighted|no.deriv|CC BY-ND/i.test(licence)||
  licence==='Detalii pe Wikimedia Commons';
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
  rights_review_required:rightsReviewRequired,is_ai_generated:false
 };
}

function safeExternalHttps(raw){
 try{
  const url=new URL(String(raw||''));
  if(url.protocol!=='https:'||url.username||url.password||url.href.length>2100)return null;
  return url.toString();
 }catch{return null}
}
export function normaliseOpenversePhoto(entry){
 if(!entry||entry.mature===true)return null;
 if(entry.category&&!['photograph','illustration','painting'].includes(entry.category))return null;
 const kind=str(entry.license,25).toLowerCase();
 // A search result may be previewed with source attribution even if reuse
 // conditions are not yet cleared. Never claim this authorises copying.
 const image=safeExternalHttps(entry.thumbnail)||safeExternalHttps(entry.url);
 const source=safeExternalHttps(entry.foreign_landing_url)||safeExternalHttps(entry.detail_url);
 if(!image||!source)return null;
 const version=plain(entry.license_version,12);
 const licence=(kind==='pdm'?'Public domain':kind==='cc0'?'CC0':kind?'CC '+kind.toUpperCase():'Drepturi de verificat')+
  (version&&kind!=='pdm'?' '+version:'');
 const rightsReviewRequired=!['cc0','pdm','by','by-sa'].includes(kind);
 return {
  title:plain(entry.title||'Fotografie',150),url:image,source,
  author:plain(entry.creator||'Autor indicat la sursă',150),license:licence,
  license_url:safeExternalHttps(entry.license_url)||source,
  provider:'Openverse',attribution:plain(entry.attribution||'',200),
  rights_review_required:rightsReviewRequired,is_ai_generated:false
 };
}

export async function searchStorybookCommonsPhotos(query,{limit=5,fetchImpl=fetch,timeoutMs=12000,language='ro',documentary=false,context=''}={}){
 const input=str(query,110).replace(/[\r\n\t]/g,' ').replace(/\s+/g,' ').trim();
 if(input.length<3||input.length>110)return {status:'invalid_query',photos:[]};
 const max=Math.max(1,Math.min(6,Math.floor(Number(limit)||5)));
 const contextText=str(context,650);
 const foldWords=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
   .toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().split(/\s+/).filter(Boolean);
 const titleWords=new Set(foldWords(input));
 const stops=new Set(['creeaza','creaza','scrie','documentar','istoric','despre','cel','cea',
  'unui','unei','pentru','cateva','capitole','reprezentative','vreau','prezinta','printre',
  'aceste','aceasta','care','sunt','fapte','implicarea','the','about','create','write',
  'story','historical','documentary','with','from','into','that']);
 const contextWords=[...new Set(foldWords(contextText)
  .filter(w=>w.length>=4&&!titleWords.has(w)&&!stops.has(w)))].slice(0,36);
 // Different plot context must not reuse images from a namesake cached by title alone.
 const key=input.toLocaleLowerCase()+':'+max+':'+language+':'+(documentary?'documentary':'story')+
  ':'+contextWords.join(',').slice(0,160);
 // Injected fetches (tests/previews) must not share cached results from other providers.
 const useCache=fetchImpl===fetch;
 const cached=useCache?memo.get(key):null;if(cached&&cached.exp>Date.now())return cached.value;
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),timeoutMs);
 try{
  const getCommons=async term=>{
   const params=new URLSearchParams({
    action:'query',generator:'search',gsrsearch:term,gsrnamespace:'6',gsrlimit:'24',
    prop:'imageinfo',iiprop:'url|mime|size|extmetadata',iiurlwidth:'960',
    format:'json',formatversion:'2'
   });
   const response=await fetchImpl('https://commons.wikimedia.org/w/api.php?'+params.toString(),{
    method:'GET',
    headers:{'Accept':'application/json','User-Agent':'myPocketAI/1.0 (https://github.com/kokocf-ui/myPocketAi; educational book reader)'},
    signal:controller.signal
   });
   if(!response.ok)return {error:response.status===429?'rate_limited':'upstream_unavailable',photos:[]};
   const data=await response.json();
   const pages=Array.isArray(data?.query?.pages)?data.query.pages:[];
   return {photos:pages.map(normaliseCommonsPhoto).filter(Boolean)};
  };
  let resultSearch=await getCommons(input),effectiveQuery=input;
  const firstError=resultSearch.error||null;
  if(firstError)resultSearch={photos:[]};
  let articleImages=[],exactArticleMatched=false;
  // The encyclopaedia media lookup must match the *subject*, not a namesake.
  const foldTitle=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[_\s]+/g,' ').trim();
  const lang=['ro','en','fr','de','es','it','pt','nl','pl','hu'].includes(language)?language:'ro';
  if(resultSearch.photos.length<max&&(documentary||lang!=='en')){
   try{
    const params=new URLSearchParams({action:'query',titles:input,redirects:'1',
      prop:'images|langlinks',lllang:'en',lllimit:'1',imlimit:'35',
      format:'json',formatversion:'2'});
    const wiki=await fetchImpl('https://'+lang+'.wikipedia.org/w/api.php?'+params,{
      method:'GET',headers:{'Accept':'application/json',
       'User-Agent':'myPocketAI/1.0 (subject-matched illustration lookup)'},signal:controller.signal});
    if(wiki.ok){
     const data=await wiki.json();
     const pages=Array.isArray(data?.query?.pages)?data.query.pages:[];
     const exact=pages.find(page=>!page?.missing&&foldTitle(page.title)===foldTitle(input));
     if(exact){
      exactArticleMatched=true;
      articleImages=(exact.images||[]).map(image=>image?.title)
       .filter(title=>typeof title==='string'&&/^File:/i.test(title)).slice(0,24);
      const translated=String(exact.langlinks?.[0]?.title||'').trim();
      if(translated&&translated.length<110&&foldTitle(translated)!==foldTitle(input)){
       const english=await getCommons(translated);
       if(english.photos.length){resultSearch.photos.push(...english.photos.map(p=>({...p,source_subject_verified:true})));effectiveQuery=translated;}
      }
     }
    }
   }catch{/* The existing Commons search and Openverse fallback remain available. */}
  }
  // Language links from Wikipedia are editorial data, not AI translations.
  // When the original search has too few photos, use a genuinely returned English article title;
  // never guess or hardcode topics. This is a bounded fallback, not repeated web searching.
  if(resultSearch.photos.length<max&&lang!=='en'&&!exactArticleMatched){
   const pageParams=new URLSearchParams({
    action:'query',generator:'search',gsrsearch:input,gsrnamespace:'0',gsrlimit:'3',
    prop:'langlinks|images',lllang:'en',lllimit:'1',imlimit:'20',format:'json',formatversion:'2'
   });
   try{
    const wiki=await fetchImpl('https://'+lang+'.wikipedia.org/w/api.php?'+pageParams,{
     method:'GET',
     headers:{'Accept':'application/json','User-Agent':'myPocketAI/1.0 (https://github.com/kokocf-ui/myPocketAi; educational book reader)'},
     signal:controller.signal
    });
    if(wiki.ok){
     const data=await wiki.json();
     const candidates=Array.isArray(data?.query?.pages)?data.query.pages:[];
     const pages=candidates.filter(page=>foldTitle(page.title)===foldTitle(input)||
      (foldTitle(input).split(' ').length>1&&foldTitle(input).split(' ').filter(Boolean)
       .every(term=>foldTitle(page.title).split(' ').includes(term))));
     articleImages=pages.flatMap(page=>Array.isArray(page?.images)?page.images:[])
      .map(entry=>entry?.title).filter(title=>typeof title==='string'&&/^File:/i.test(title)).slice(0,18);
     const translated=pages.map(page=>page?.langlinks?.[0]?.title||'')
      .find(x=>typeof x==='string'&&x.length>=3&&x.length<=100);
     if(translated&&translated.toLowerCase()!==input.toLowerCase()){
      const english=await getCommons(translated);
      if(english.photos.length){resultSearch={photos:[...resultSearch.photos,...english.photos]};effectiveQuery=translated;}
     }
    }
   }catch{/* Original Commons result remains authoritative. */}
  }
  // If Commons search titles fail, try photographs linked from the relevant Wikipedia
  // article. Obtain the real image author, URL and licence from Commons, not Wikipedia.
  if(resultSearch.photos.length<max&&articleImages.length){
   try{
    const params=new URLSearchParams({
     action:'query',titles:articleImages.join('|'),prop:'imageinfo',
     iiprop:'url|mime|size|extmetadata',iiurlwidth:'960',format:'json',formatversion:'2'
    });
    const res=await fetchImpl('https://commons.wikimedia.org/w/api.php?'+params.toString(),{
     headers:{'Accept':'application/json','User-Agent':'myPocketAI/1.0 storybook'},
     signal:controller.signal
    });
    if(res.ok){
     const data=await res.json();
     const pages=Array.isArray(data?.query?.pages)?data.query.pages:[];
     resultSearch.photos.push(...pages.map(normaliseCommonsPhoto).filter(Boolean)
      .map(p=>({...p,source_subject_verified:exactArticleMatched})));
    }
   }catch{/* Optional fallback, no extra query needed on failure. */}
  }
  // History calls for photographs OF representations (statues, reliefs, monuments),
  // illustrations and archaeological objects, not a photograph of the ancient person.
  // Generic terms are derived from the selected subject; no subject-specific hardcoding.
  if(documentary&&resultSearch.photos.length<max){
   const topic=effectiveQuery||input;
   for(const variant of [topic+' statue',topic+' historical illustration']){
    if(resultSearch.photos.length>=max)break;
    try{
     const more=await getCommons(variant);
     if(more.photos?.length)resultSearch.photos.push(...more.photos);
    }catch{/* Single bounded variant failed; preserve results already found. */}
   }
  }
  // One independent, free-index source fallback. Does not call Brave Search.
  if(!resultSearch.photos.length){
   try{
    const params=new URLSearchParams({
     q:effectiveQuery,page_size:String(Math.max(8,max*3)),...(documentary?{}:{category:'photograph'})
    });
    const res=await fetchImpl('https://api.openverse.org/v1/images/?'+params.toString(),{
     headers:{'Accept':'application/json'},signal:controller.signal
    });
    if(res.ok){
     const data=await res.json();
     const entries=Array.isArray(data?.results)?data.results:[];
     resultSearch.photos.push(...entries.map(normaliseOpenversePhoto).filter(Boolean));
    }
   }catch{/* Text and narration remain available even when image providers fail. */}
  }
  const dedup=new Set();
  const imageRelevant=photo=>{
   if(!documentary||!contextWords.length||photo.source_subject_verified)return true;
   const imageWords=foldWords(photo.title);
   // A bare-name match is not sufficient for historical documentaries.
   // Require an independent topic cue from the user's narrative brief.
   return contextWords.some(term=>imageWords.some(word=>
     word.length>=4&&term.slice(0,4)===word.slice(0,4)));
  };
  const distinct=resultSearch.photos.filter(p=>{
   if(!imageRelevant(p)||dedup.has(p.url))return false;
   dedup.add(p.url);return true;
  }).slice(0,max);
  const result={status:distinct.length?'success':firstError||'no_images_found',photos:distinct,query:effectiveQuery,
   source:'Wikimedia Commons / Openverse',credit_required:true};
  if(memo.size>100)memo.clear();
  if(useCache)memo.set(key,{exp:Date.now()+20*60*1000,value:result});
  return result;
 }catch{return {status:'upstream_unavailable',photos:[]}}
 finally{clearTimeout(timer)}
}
