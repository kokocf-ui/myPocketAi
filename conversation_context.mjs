// Enrich research for elliptical follow-ups using recent USER turns only.
// Never treat a previous assistant answer as a verified source.
const normal=s=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim();
const polite=/^(?:salut|buna|hello|hi|hey|multumesc|mersi|thanks|thank you|ok|okay|da|nu|yes|no)[!?. ]*$/;
const start=/^(?:(?:si|iar|dar|and|but|also|what about|how about)\s+(?:(?:in|din|la|pentru|despre|at|for|about|cat|cum|cand|when|de ce|how|much|where)\b)|(?:este|e|sunt|era|erau|is it|are they|was it|does it|cat ar fi|how much would)\b)/;
const back=/\b(?:acesta|aceasta|acestea|acel|acele|asta|aceea|mentionat|precedent|anterior|acolo|it|that|those|there|earlier|previously|brut|net|gross)\b/;
function dependent(s){
 const t=normal(s).replace(/[!?.,;:]+$/,"");
 if(!t||t.split(/\s+/).length>19||polite.test(t)||/^(?:nu[,! ]+|no[,! ]+)?(?:ma refeream|i meant|nu asta|not that)\b/.test(t))return false;
 if(/^(?:dar\s+|but\s+)?(?:cine a |who (?:invented|founded|created)|ce este |what is |poti sa |can you ).{15,}/.test(t))return false;
 if(/^(?:este|e|sunt|is|are)\s+[A-ZĂÂÎȘȚ][\p{L}\p{M}]{2,}/iu.test(String(s).trim())&&!back.test(t))return false;
 return start.test(t)||back.test(t)||/^(?:de ce|why|cum asa|how so)$/.test(t);
}
export function contextualResearchQuery(message,history){
 const current=String(message||"").trim(),unchanged={query:current,context_applied:false,reason:"standalone"};

 // T4 explicit reverification is a dependent request. Preserve the last
 // explicit subject; a previous assistant answer is NOT a source of evidence.
 // Never reuse a stale capital question after a different substantive topic.
 const recheck=normal(current).replace(/[!?.,;:]+/g," ").replace(/\s+/g," ").trim();
 const capitalRecheck=/^(?:(?:nu ai inteles|nu asta am cerut|you misunderstood)(?: intrebarea)? )?(?:verifica|reverifica|check|verify)(?: din nou| inca o data| again)? (?:capitala|raspunsul despre capitala|the capital|the capital answer)(?: tarii)?$/;
 if(capitalRecheck.test(recheck)){
  const prior=(Array.isArray(history)?history:[])
   .filter(x=>x?.role==="user"&&typeof x.content==="string")
   .map(x=>x.content.trim()).filter(Boolean);
  while(prior.length&&prior.at(-1)===current)prior.pop();
  const last=prior.slice(-6).reverse().find(q=>{
   const t=normal(q);
   return !polite.test(t)&&!/^(?:nu ai inteles|nu asta am cerut|verifica din nou|you misunderstood)/.test(t);
  });
  if(last&&/^(?:care (?:e|este) capitala|what(?:'s| is) the capital of)/.test(normal(last)))
   return {query:(last.replace(/[!?.,;:]+$/,"")+"; "+current+
     "; verifică afirmația în surse actuale independente și indică explicit dacă verificarea nu a fost posibilă").slice(0,500),
     context_applied:true,reason:"explicit_capital_recheck"};
  return {...unchanged,reason:"capital_recheck_subject_missing"};
 }

 if(!dependent(current))return unchanged;
 const prior=(Array.isArray(history)?history:[]).filter(x=>x?.role==="user"&&typeof x.content==="string").map(x=>x.content.trim()).filter(Boolean);
 while(prior.length&&prior.at(-1)===current)prior.pop();
 let topic="";
 for(const t of prior.slice(-5).reverse()){
  if(polite.test(normal(t)))break;
  if(!dependent(t)&&normal(t).split(/\s+/).length>=4&&t.length<340){topic=t;break;}
 }
 if(!topic)return {...unchanged,reason:"no_recent_topic"};
 if(/\b(?:brut|net|gross)\b/.test(normal(current))&&!/\b(?:salari\w*|salary|wage\w*|income|venit\w*|pay|tax\w*|impozit\w*|pension|pret\w*|cost\w*)\b/.test(normal(topic)))return {...unchanged,reason:"unrelated_topic"};
 const placeChange=/^(?:si|iar|dar|and|but|also|what about)\s+(?:in|din|la|pentru|despre|at|for|about)\s+/.test(normal(current));
 if(placeChange)topic=topic.replace(/\s+(?:în|in|din|la|at|for)\s+[A-ZĂÂÎȘȚ][\p{L}\p{M}'-]*(?:\s+[A-ZĂÂÎȘȚ][\p{L}\p{M}'-]*){0,2}\s*[?!.,]*$/u,"").trim();
 if(normal(topic).split(/\s+/).length<3)return {...unchanged,reason:"insufficient_topic"};
 return {query:(topic.replace(/[!?.,;:]+$/,"")+"; "+current).slice(0,500),context_applied:true,reason:placeChange?"place_change":"ellipsis"};
}

// User feedback and light social conversation should not trigger unrelated web research.
export function isConversationOnlyTurn(message){
 const text=normal(message);
 if(!text||text.length>240)return false;
 if(/\d/.test(text)||/\b(?:verifica\w*|cauta\w*|search|lookup|look up|sources?|surs\w*|stiri\w*|news|actualitat\w*|meteo|vrem\w*|weather|salari\w*|salary|tax\w*|impozit\w*|eveniment\w*|concert\w*|istor\w*|geograf\w*|politic\w*|medical|medicin\w*|pret\w*|price|cost\w*|lege\w*|law)\b/.test(text))return false;
 return /^(?:nu ai inteles\b|nu asta (?:am (?:cerut|intrebat|vrut)|voiam)\b|m-ai inteles\b|ai inteles (?:ce|la ce)\b|ai gresit\b|ai dat-o in bara\b|vorbesti prea mult\b|raspunde mai (?:pe scurt|concis)\b|te rog sa (?:fii mai concis|nu mai repeti|raspunzi mai scurt)\b|glumeam\b|glumesc\b|era o gluma\b|ma enervezi\b|sunt suparat\b|esti (?:tare |foarte |cam )?(?:amuzant\w*|dragut\w*|timid\w*|haioas\w*|prea serioas\w*)\b|imi place (?:de tine|personalitatea ta)\b|ce parere ai despre tine\b|you misunderstood\b|that's not what i asked\b|you got it wrong\b|you are (?:funny|cute|too serious)\b|you talk too much\b|please be (?:brief|concise)\b|i was joking\b|just kidding\b|i'm upset with you\b)/.test(text);
}
