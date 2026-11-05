// User-initiated discovery of PUBLIC Telegram post LINKS through an external web index.
// No Telegram MTProto or bot session, no Telegram page fetching, no Telegram content
// ingestion into LLMs, no channel harvesting, no persistence, no paid search.
export function publicTelegramPostUrl(value){
 try{
  const u=new URL(String(value||""));
  if(!["t.me","www.t.me","telegram.me","www.telegram.me"].includes(u.hostname.toLowerCase()))return null;
  const parts=u.pathname.split("/").filter(Boolean);
  if(parts[0]==="s")parts.shift();
  if(parts.length!==2||!/^[a-z][a-z0-9_]{4,31}$/i.test(parts[0])||!/^[1-9][0-9]{0,11}$/.test(parts[1]))return null;
  return "https://t.me/"+parts[0]+"/"+parts[1];
 }catch{return null;}
}
function cleanIndexedExcerpt(value){
 const raw=String(value||"");
 // A web index may return Telegram embed boilerplate, script elements,
 // markdown navigation and code instead of the public post excerpt.
 if(/<script\b|telegram\.org\/js\/|tg:\/\/resolve|\[embed\]|\[context\]|<iframe\b/i.test(raw))return "";
 const cleaned=raw.replace(/<[^>]*>/g," ").replace(/\[[^\]]{1,80}\]\([^)]{1,220}\)/g," ")
  .replace(/&(?:nbsp|amp|quot|lt|gt);/gi," ").replace(/\s+/g," ").trim();
 if(cleaned.length<25)return "";
 if(cleaned.length<=300)return cleaned;
 const cut=cleaned.slice(0,300);
 const punctuation=Math.max(cut.lastIndexOf(". "),cut.lastIndexOf("! "),cut.lastIndexOf("? "));
 if(punctuation>=120)return cut.slice(0,punctuation+1);
 const lastSpace=cut.lastIndexOf(" ");
 return cut.slice(0,lastSpace>200?lastSpace:300).trim()+"…";
}
export async function discoverTelegramPublicLinks(env={},query="",limit=8,options={}){
 const q=String(query||"").trim().replace(/\s+/g," ").slice(0,160);
 const count=Math.min(10,Math.max(1,Number(limit)||8));
 const since=Number.isFinite(options.sinceMs)?options.sinceMs:null;
 const now=Number.isFinite(options.nowMs)?options.nowMs:Date.now();
 if(q.length<3)return {status:"invalid_query",links:[],reply:"Introdu un subiect de cel puțin 3 caractere."};
 if(!env.EXA_API_KEY)return {status:"not_configured",links:[],reply:"Indexul web Exa nu este configurat."};
 try{
  const res=await fetch("https://api.exa.ai/search",{
   method:"POST",headers:{"Content-Type":"application/json","x-api-key":env.EXA_API_KEY},
   body:JSON.stringify({query:q+" site:t.me",type:"auto",numResults:Math.min(20,count*3),includeDomains:["t.me"],contents:{highlights:{maxCharacters:420}}}),
   signal:AbortSignal.timeout(7000)
  });
  if(!res.ok)throw new Error("web index unavailable");
  const data=await res.json();
  const seen=new Set(),signatures=new Set(),links=[];
  let undatedCount=0,staleCount=0;
  for(const item of Array.isArray(data.results)?data.results:[]){
   const link=publicTelegramPostUrl(item.url);
   if(!link||seen.has(link))continue;
   const path=new URL(link).pathname.split("/").filter(Boolean);
   const rawTitle=String(item.title||"").replace(/\s+/g," ").trim().slice(0,180);
   const title=rawTitle&&rawTitle.toLowerCase()!=="telegram"&&rawTitle.toLowerCase()!=="telegram: contact @telegram"?rawTitle:"Telegram @"+path[0]+" · postarea #"+path[1];
   const excerpt=cleanIndexedExcerpt(Array.isArray(item.highlights)?item.highlights.filter(x=>typeof x==="string").join(" "):"");
   const publishedAt=typeof item.publishedDate==="string"&&/^\d{4}-\d{2}-\d{2}/.test(item.publishedDate)?item.publishedDate:null;
   const publishedMs=publishedAt?Date.parse(publishedAt):NaN;
   if(since!==null&&(!Number.isFinite(publishedMs)||publishedMs<since||publishedMs>now+300000)){
    if(!Number.isFinite(publishedMs))undatedCount++;else staleCount++;
    continue;
   }
   const signature=excerpt.toLocaleLowerCase().replace(/[^\p{L}\p{N}]/gu,"").slice(0,110);
   if(signature.length>30&&signatures.has(signature))continue;
   if(signature.length>30)signatures.add(signature);
   seen.add(link);links.push({url:link,title,excerpt,published_at:publishedAt,platform:"Telegram",source:"Public web search index",
    verification:"not_verified",content_retrieved:false});
   if(links.length>=count)break;
  }
  return {status:"success",links,source:"Exa public web index",
   publication_filter:since!==null?"indexed_date_after_requested_cutoff":"none",undated_excluded:undatedCount,stale_excluded:staleCount,
   limitations:"Only public links indexed by Exa, not Telegram global search. No Telegram content was accessed or sent to AI.",
   reply:links.length?"Referințe către postări publice Telegram indexate. Datele indexului și afirmațiile nu au fost verificate independent.":since!==null?"Nu am identificat postări publice Telegram cu dată indexată în intervalul cerut. Postările fără dată confirmabilă au fost excluse.":"Nu am găsit linkuri publice Telegram indexate pentru această căutare."};
 }catch{return {status:"unavailable",links:[],reply:"Indexul web nu este disponibil momentan."};}
}

export function telegramPublicLinkSearchIntent(message){
 const raw=String(message||"").trim();
 const normalized=raw.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 if(!/\btelegram\b/.test(normalized)||!/\b(?:caut\w*|gas\w*|find|search)\b/.test(normalized))return null;
 const topic=normalized.replace(/\btelegram\b/gi," ")
  .replace(/\b(?:din|in|pe)\s+ultim(?:ele|a|ii)?\s+24\s*(?:de\s*)?(?:ore|h)\b/gi," ")
  .replace(/\b(?:last|past)\s+24\s+hours?\b/gi," ")
  .replace(/\b(?:cauta|cautare|cauta-mi|gaseste|gaseste-mi|find|search|pe|in|din|on|for|despre|about|postari|postarile|stiri|stirile|news|noutati|linkuri|linkurile|publice|public|situatia|situation|current|recente)\b/gi," ")
  .replace(/\s+/g," ").replace(/[.!?,;:]+$/g,"").trim();
 return topic.length>=3?topic:null;
}
