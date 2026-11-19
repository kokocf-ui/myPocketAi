// One bounded encyclopaedia lookup for factual, non-fiction mini-documentaries.
// No Brave/paid web search, no recursive discovery and no invented source material.
const historyCache=new Map();
const HISTORY_LANGUAGES=new Set(['ro','en','fr','de','it','es','pt','nl','pl','hu']);
const trimText=(value,max=4000)=>String(value||'').replace(/\s+/g,' ').trim().slice(0,max);
export async function fetchStorybookHistory(query,{language='ro',fetchImpl=fetch,timeoutMs=6500}={}){
 const topic=trimText(query,115);
 if(topic.length<2)return {status:'invalid_query',sources:[]};
 const lang=HISTORY_LANGUAGES.has(language)?language:'ro';
 const cacheKey=(lang+':'+topic).toLocaleLowerCase();
 const cached=historyCache.get(cacheKey);
 if(cached&&cached.until>Date.now())return cached.result;
 const controller=new AbortController();
 const timer=setTimeout(()=>controller.abort(),Math.max(1500,timeoutMs));
 try{
  const languages=[lang,...(lang==='en'?[]:['en'])];
  for(const locale of languages){
   const params=new URLSearchParams({
    action:'query',generator:'search',gsrsearch:topic,gsrnamespace:'0',
    gsrlimit:'5',prop:'extracts|info',exintro:'1',explaintext:'1',
    exlimit:'max',inprop:'url',format:'json',formatversion:'2'
   });
   try{
    const response=await fetchImpl('https://'+locale+'.wikipedia.org/w/api.php?'+params.toString(),{
     headers:{'Accept':'application/json','User-Agent':'myPocketAI/1.0 (historical documentary research)'},
     signal:controller.signal
    });
    if(!response.ok)continue;
    const data=await response.json();
    const pages=Array.isArray(data?.query?.pages)?data.query.pages:[];
    const term=topic.toLocaleLowerCase();
    const ranked=pages.map(page=>({
     title:trimText(page.title,140),
     excerpt:trimText(page.extract,3800),
     url:String(page.fullurl||''),
     rank:Number(page.index)||9999
    })).filter(page=>page.title.length>1&&page.excerpt.length>=180)
      .sort((a,b)=>{
       const score=p=>p.title.toLocaleLowerCase()===term?0:
        term.includes(p.title.toLocaleLowerCase())||p.title.toLocaleLowerCase().includes(term)?1:2;
       return score(a)-score(b)||a.rank-b.rank;
      });
    if(!ranked.length)continue;
    const best=ranked[0];
    const url=best.url.startsWith('https://'+locale+'.wikipedia.org/wiki/')?
     best.url:'https://'+locale+'.wikipedia.org/wiki/'+encodeURIComponent(best.title.replace(/ /g,'_'));
    const result={status:'success',title:best.title,excerpt:best.excerpt,
     sources:[{title:best.title,url,provider:'Wikipedia',language:locale}]};
    if(historyCache.size>90)historyCache.clear();
    historyCache.set(cacheKey,{result,until:Date.now()+6*60*60*1000});
    return result;
   }catch{/* The next, bounded language lookup may still provide the source. */}
  }
  return {status:'unavailable',sources:[]};
 }finally{clearTimeout(timer)}
}
