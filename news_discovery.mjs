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
  // Complement established wire reporting with independent/local investigation.
  // Search terms do not establish publisher funding, truthfulness or independence.
  independentQuery:broad?"world current affairs independent journalists local reporting investigative eyewitness primary evidence"+dateSuffix:null,
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

// Discover source languages from the source clause, never from "translate to Romanian".
const SOURCE_LANGUAGE_ALIASES=[
 ["ar",/\b(?:araba|arabe|arabic)\b/g],
 ["fa",/\b(?:persana|persane|persian|farsi)\b/g],
 ["uk",/\b(?:ucraineana|ucrainene|ukrainian)\b/g],
 ["ru",/\b(?:rusa|ruse|russian)\b/g],
 ["fr",/\b(?:franceza|franceze|french)\b/g],
 ["de",/\b(?:germana|germane|german)\b/g],
 ["en",/\b(?:engleza|engleze|english)\b/g]
];
export function requestedNewsSourceLanguages(message){
 const original=normal(message);
 const sourceClause=original.split(/\b(?:tradu|traduc|translate|in romana|into romanian|compar\w*|compare\w*)\b/)[0];
 // Only a source-qualified clause is interpreted as a language constraint.
 const marker=sourceClause.match(/\b(?:surse|publicatii|publicate|relatari|articole|sources|reports|published)\b/);
 if(!marker)return [];
 const segment=sourceClause.slice(marker.index).slice(0,220);
 const found=[];
 for(const [lang,pattern] of SOURCE_LANGUAGE_ALIASES){
  if(pattern.test(segment))found.push({lang,position:segment.search(pattern)});
  pattern.lastIndex=0;
 }
 return found.sort((a,b)=>a.position-b.position).map(x=>x.lang);
}
export function requestedNewsSourceLanguage(message){return requestedNewsSourceLanguages(message)[0]||null;}

export function requestedNewsArticleLimit(message){
 const q=normal(message);
 const match=q.match(/\b(?:cauta|gaseste|prezinta|afiseaza|arata|find|search|show|list|latest|ultimele|cele mai recente)\s+(?:ultimele\s+|cele mai recente\s+)?(\d{1,2})\s+(?:stiri|articole|news|articles|relatari)\b/)||
   q.match(/\b(\d{1,2})\s+(?:stiri|articole|news|articles|relatari)\b/);
 return match?Math.max(1,Math.min(30,Number(match[1]))):30;
}
export function newsFreshnessHours(message){
 const q=normal(message);
 if(/\b(?:ultimele\s*24|last\s*24|past\s*24|24\s*(?:de\s*)?ore|24\s*hours)\b/.test(q))return 24;
 if(/\b(?:ultima luna|ultimele 30 de zile|last 30 days|past month|last month)\b/.test(q))return 720;
 if(/\b(?:ultimele|recent\w*|actual\w*|latest|current|breaking|today|astazi|azi|nou\w*)\b/.test(q)
  && !/\b(?:19\d{2}|20\d{2})\b/.test(q))return 168;
 return null;
}
export function isNewsComparisonRequest(message){
 const q=normal(message);
 return /\b(?:compar\w*|compare|comparison|difer\w*|differences?)\b/.test(q)
  && /\b(?:stiri|news|relatari|articole|articles|sources|surse|reports)\b/.test(q);
}
export function newsSearchTopic(message){
 const q=normal(message);
 if(/orientul mijlociu|middle east/.test(q))return "Middle East";
 if(/ucraina|ukraine/.test(q))return "Ukraine";
 if(/\biran\b/.test(q))return "Iran";
 if(/franta|france/.test(q)&&/germania|germany/.test(q))return "France Germany";
 if(/international|mondial|global|world/.test(q))return "world international";
 return q.split(/[.!?]/)[0].replace(/\b(?:cauta|gaseste|prezinta|afiseaza|arata|ultimele|cele mai recente|stiri|articole|news|relatari|recent\w*|surse|publicate|in limba|in limbile|din|despre)\b/g," ").replace(/\s+/g," ").trim().slice(0,90)||"world international";
}
export function newsSearchQuery(message,sourceLanguage){
 const subject=newsSearchTopic(message);
 const localized={ar:"أحدث أخبار",fa:"آخرین اخبار",uk:"останні новини",ru:"последние новости",fr:"actualités récentes",de:"aktuelle Nachrichten",en:"latest news"};
 return (localized[sourceLanguage]||"latest news")+" "+subject+" "+new Date().toISOString().slice(0,7);
}
// Do not turn search-engine descriptions into invented complete sentences.
export function cleanNewsExcerpt(value,max=280){
 const s=String(value||"").replace(/\s+/g," ").replace(/(?:^|\s)(?:#{1,3}|\|)(?=\s)/g," ").trim();
 if(!s)return "";
 if(s.length<=max)return s;
 const cut=s.slice(0,max+1),end=cut.search(/[.!?。؟][\s"')\]]*(?=[^.!?。؟]*$)/u);
 if(end>=10)return cut.slice(0,end+1).trim();
 const breakpoint=cut.lastIndexOf(" ");
 return cut.slice(0,Math.max(0,breakpoint)).trim()+"…";
}
export function looksLikeNewsArticle(title,url){
 const t=normal(title);
 const u=String(url||"").toLowerCase();
 if(!t||/\b(?:about us|who we are|our team|contact us|privacy policy|cookie policy|terms of service|c ine suntem|cine suntem|a propos|uber uns|aucune information disponible|nu exista nicio informatie disponibila|please provide the article)\b/.test(t))return false;
 if(/\/(?:about|about-us|who-we-are|contact|privacy|terms|author|authors|tag|tags|category|categories|search|home)(?:[/?#]|$)/.test(u))return false;
 return true;
}
