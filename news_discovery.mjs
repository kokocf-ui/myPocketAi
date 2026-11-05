// Search planning uses broad discovery plus topic- and publisher-specific
// discovery. This identifies PUBLIC links, never licenses or copies full articles.
const normal=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim();
const newsWords=/\b(?:stir\w*|noutat\w*|news|eveniment\w*|event\w*|happened|intampl\w*|briefing\w*|actualitat\w*)\b/;
const worldwide=/\b(?:lume|mondial\w*|global\w*|international\w*|world|worldwide|geopolitic\w*|foreign affairs)\b/;
export function buildWorldNewsDiscoveryPlan(message,options={}){
 const phrase=normal(message),broad=newsWords.test(phrase)&&worldwide.test(phrase);
 const previousDay=/^\d{4}-\d{2}-\d{2}$/.test(String(options.publicationDay||""))?options.publicationDay:null;
 const dateSuffix=previousDay?" published "+previousDay:"";
 const gdeltQueries=broad?[
  "(diplomacy OR government OR election OR summit OR sanctions OR military OR conflict)",
  "(economy OR markets OR climate OR earthquake OR disaster OR science OR technology)"
 ]:null;
 return {
  broadWorld:broad,
  gdeltQueries,
  exaQuery:broad?"world news international affairs diplomacy economy science climate"+dateSuffix:null,
  wireQuery:broad?"Reuters world news politics diplomacy economy"+dateSuffix:null,
  generalQuery:broad?"world news international events government economy disasters science"+dateSuffix:null,
  publicationDay:previousDay,
  requestedDomain:"reuters.com"
 };
}
export function selectNewsPublisherDiverseSources(sources,options={}){
 const max=Math.min(50,Math.max(1,Number(options.max)||30));
 const firstMax=Math.min(10,Math.max(1,Number(options.firstPassPerPublisher)||3));
 const domain=s=>{try{return new URL(s.url).hostname.toLowerCase().replace(/^www\./,"")}catch{return "invalid"}};
 const seen=new Set(),counts=new Map(),selected=[];
 const unique=(Array.isArray(sources)?sources:[]).filter(s=>s?.url&&s?.title).filter(s=>{
  if(seen.has(s.url))return false;seen.add(s.url);return true;
 });
 for(const s of unique){
  if(selected.length>=max)break;
  const host=domain(s),n=counts.get(host)||0;
  if(n>=firstMax)continue;
  selected.push(s);counts.set(host,n+1);
 }
 if(selected.length<max){
  for(const s of unique){if(selected.length>=max)break;if(!selected.includes(s))selected.push(s);}
 }
 return selected;
}
export function describeNewsPublishers(rows){
 const hosts=[...new Set((Array.isArray(rows)?rows:[]).map(v=>{try{return new URL(v.url).hostname.toLowerCase().replace(/^www\./,"")}catch{return null}}).filter(Boolean))];
 return {unique_publisher_count:hosts.length,reuters_article_found:hosts.some(h=>h==="reuters.com"||h.endsWith(".reuters.com")),publisher_domains:hosts.slice(0,25)};
}
