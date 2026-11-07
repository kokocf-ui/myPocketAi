// News source integrity checks. Search-engine language preferences are NOT evidence
// that the returned article actually uses that language.
const ascii=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const letters=s=>String(s||"").toLowerCase().match(/\p{L}+/gu)||[];
const containsAny=(s,items)=>items.some(w=>s.includes(w));
const STOP={
 fr:["le","la","les","des","une","un","dans","avec","pour","sur","entre","est","sont","que","aux","chez","apres","selon","france"],
 de:["die","der","das","und","ein","eine","einer","einen","nach","bei","aus","sich","wird","werden","ist","über","fur","deutschland"],
 en:["the","and","with","from","about","after","over","amid","says","said","is","are","will","has","have","their","while","world"],
 ro:["si","sunt","este","pentru","despre","care","dupa","dintre","ale","unui","asupra","aceasta","romania"]
};
export function detectActualNewsLanguage(title,excerpt=""){
 const raw=String(title||"").trim();
 const cyr=(raw.match(/[\u0400-\u052f]/gu)||[]).length;
 const arab=(raw.match(/[\u0600-\u06ff\u0750-\u077f]/gu)||[]).length;
 if(arab>=6){
   // Persian/Farsi and Arabic share script; only return a language on
   // positive linguistic evidence, not the source's search_lang option.
   if(/[پچژگکی]/u.test(raw)||/(?:^|[\s،])(?:برای|است|شد|خواهد|خبرگزاری|گزارش|تهران)(?:[\s،]|$)/u.test(raw))return "fa";
   if(/(?:^|[\s،])(?:في|على|من|الى|إلى|أن|عن|التي|قال|أعلن|أعلنت|هذا|هذه)(?:[\s،]|$)/u.test(raw)||/[\u0623\u0625\u0624\u0626]/u.test(raw))return "ar";
   return null;
 }
 if(cyr>=6){
  if(/[іїєґ]/iu.test(raw))return "uk";
  if(/[ыэёъ]/iu.test(raw))return "ru";
  const t=raw.toLowerCase();
  if(/(?:^|[\s,.:;!])(?:що|україни|україні|світу|новини|сьогодні|заявив|повідомив)(?:[\s,.:;!]|$)/u.test(t))return "uk";
  if(/(?:^|[\s,.:;!])(?:что|россии|москве|сегодня|новости|сообщил|заявил)(?:[\s,.:;!]|$)/u.test(t))return "ru";
  return null;
 }
 if(!/[a-zA-ZÀ-ÿ]/.test(raw))return null;
 const words=letters(ascii(raw)),scores={};
 for(const [lang,stop] of Object.entries(STOP))scores[lang]=words.filter(w=>stop.includes(w)).length;
 const ranked=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
 // Never label an ambiguous short headline with an inferred language.
 if(ranked[0][1]>=2&&ranked[0][1]>ranked[1][1])return ranked[0][0];
 // A headline can be short: use the excerpt only when it is linguistically
 // compatible with the headline and offers stronger evidence.
 const combined=letters(ascii(raw+" "+String(excerpt||"").slice(0,200)));
 const second=Object.entries(STOP).map(([lang,stop])=>[lang,combined.filter(w=>stop.includes(w)).length]).sort((a,b)=>b[1]-a[1]);
 if(second[0][1]>=4&&second[0][1]>=second[1][1]+2)return second[0][0];
 return null;
}
const landingHeadline=/(?:^|\b)(?:news and current affairs from|all the latest news|latest news from|news and current affairs|live world map|real.time conflicts|around the world|who we are|about us|our mission|the observers|observatorii|cele mai importante stiri din lume de astazi|cele mai importante stiri din lume de azi|toate stirile|actualitati din germania|nu am primit niciun text|vrei sa il introduci|nu exista nicio informatie disponibila|saachi baat|global economic weekly update|actualizare economica globala saptamanala|weekly global economic update|welcome to|front page|home page|sitemap|service news|nachrichten und aktuelles|aktuelle nachrichten aus|strichka novin|all news|all headlines|all updates|news in brief|live news feed|stream of news)\b/i;
const landingPath=/(?:^|\/)(?:about(?:-us)?|who-we-are|our-team|privacy|terms|contact|world-map|global-map|live-world-map|live-map|topics|categories|search|feed|archive|archives|latest|all-news|all-stories|news-home|sitemap)(?:\/|$)/i;
const promptAsHeadline=/(?:nu am primit|vrei sa il introduci|please provide|i did not receive any|no text supplied|nicio informatie disponibila|do you want to enter it|input your text)/i;
export function validateNewsArticleLead({title,url,summary}={}){
 const name=ascii(title).replace(/\s+/g," ").trim(),link=String(url||"");
 if(!name||name.length<16||promptAsHeadline.test(name)||landingHeadline.test(name))return {valid:false,reason:"landing_or_error_title"};
 let path="";
 try{path=new URL(link).pathname.replace(/\/+$/,"");}catch{return {valid:false,reason:"invalid_url"}}
 if(!path||path==="/"||landingPath.test(path))return {valid:false,reason:"landing_url"};
 if(/^\/*(?:news|world|politics|home|index|video|videos|live|about|latest)$/i.test(path))return {valid:false,reason:"section_url"};
 const text=ascii(summary);
 if(/(?:advertisement|skip next section|enable javascript|to view this video|cookie policy|subscribe to|newsletter signup|social sharing links|login to view)/i.test(text))
   return {valid:false,reason:"navigation_excerpt"};
 return {valid:true,reason:"article_candidate_not_verified"};
}
export function languageCoverage(articles,requested){
 const desired=Array.isArray(requested)?requested:[];
 const observed=new Set((articles||[]).map(x=>x.source_language).filter(Boolean));
 return {requested:desired,found:desired.filter(x=>observed.has(x)),missing:desired.filter(x=>!observed.has(x))};
}
