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
export async function discoverTelegramPublicLinks(env={},query="",limit=8){
 const q=String(query||"").trim().replace(/\s+/g," ").slice(0,160);
 const count=Math.min(10,Math.max(1,Number(limit)||8));
 if(q.length<3)return {status:"invalid_query",links:[],reply:"Introdu un subiect de cel puțin 3 caractere."};
 if(!env.EXA_API_KEY)return {status:"not_configured",links:[],reply:"Indexul web Exa nu este configurat."};
 try{
  const res=await fetch("https://api.exa.ai/search",{
   method:"POST",headers:{"Content-Type":"application/json","x-api-key":env.EXA_API_KEY},
   body:JSON.stringify({query:q+" site:t.me",type:"auto",numResults:Math.min(20,count*3),includeDomains:["t.me"]}),
   signal:AbortSignal.timeout(7000)
  });
  if(!res.ok)throw new Error("web index unavailable");
  const data=await res.json();
  const seen=new Set(),links=[];
  for(const item of Array.isArray(data.results)?data.results:[]){
   const link=publicTelegramPostUrl(item.url);
   if(!link||seen.has(link))continue;
   seen.add(link);links.push({url:link,platform:"Telegram",source:"Public web search index",
    verification:"not_verified",content_retrieved:false});
   if(links.length>=count)break;
  }
  return {status:"success",links,source:"Exa public web index",
   limitations:"Only public links indexed by Exa, not Telegram global search. No Telegram content was accessed or sent to AI.",
   reply:links.length?"Linkuri către postări publice Telegram, descoperite prin indexul web. Conținutul și afirmațiile nu au fost verificate.":"Nu am găsit linkuri publice Telegram indexate pentru această căutare."};
 }catch{return {status:"unavailable",links:[],reply:"Indexul web nu este disponibil momentan."};}
}

export function telegramPublicLinkSearchIntent(message){
 const raw=String(message||"").trim();
 const normalized=raw.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 if(!/\btelegram\b/.test(normalized)||!/\b(?:caut\w*|gas\w*|find|search|link\w*|postar\w*|stir\w*|news|noutat\w*)\b/.test(normalized))return null;
 const topic=raw.replace(/\btelegram\b/gi," ").replace(/\b(?:cauta|cautare|cauta-mi|gaseste|gaseste-mi|find|search|pe|in|din|on|for|despre|about|postari|postarile|stiri|stirile|news|noutati|linkuri|linkurile|publice|public)\b/gi," ").replace(/\s+/g," ").trim();
 return topic.length>=3?topic:null;
}
