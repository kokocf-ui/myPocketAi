// Only process links and claim text that the user directly supplies in chat.
// No scraping Telegram, no global channel search, no access to private chats.
// A link is a reference, not verification of the claims made in a post.
const normalize=value=>String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim();
const urls=/https?:\/\/(?:www\.)?(?:t\.me|telegram\.me)\/[^\s<>"')\]]+/gi;
const publicName=/^[a-z][a-z0-9_]{4,31}$/i;
const checkRequest=/\b(?:verific\w*|confirma\w*|confirm\w*|check\w*|fact[\s-]?check\w*|verify|verified|verifica|este adevarat|este real|is it true|is this true|corobor\w*|surse independente)\b/;

export function classifyVoluntaryTelegramLink(message) {
 const raw=String(message||"").slice(0,4500);
 const candidates=raw.match(urls)||[];
 if(!candidates.length)return null;
 let reference=null;
 for(const original of candidates){
  try{
   const u=new URL(original.replace(/[.,;!?]+$/,""));
   if(!["t.me","www.t.me","telegram.me","www.telegram.me"].includes(u.hostname.toLowerCase()))continue;
   const parts=u.pathname.split("/").filter(Boolean);
   if(parts[0]==="s")parts.shift();
   const name=parts[0]||"",id=parts[1]||"";
   const publicPost=publicName.test(name)&&/^[1-9]\d{0,11}$/.test(id)&&parts.length===2;
   reference=publicPost?{type:"public",url:"https://t.me/"+name+"/"+id,channel:"@"+name}:{type:"unsupported",url:null,channel:null};
   break;
  }catch{}
 }
 if(!reference)return null;
 const outside=normalize(raw.replace(urls," ").replace(/https?:\/\/\S+/g," "));
 const request=checkRequest.test(outside);
 // Remove instructions and labels, leaving the author's own assertion.
 const claim=outside.replace(/^(?:te rog\s+)?(?:verifica|verificati|verificare|verifica-mi|confirm|confirma|verify|check|fact.check)\b[\s,:-]*/,"")
  .replace(/^(?:(?:aceasta|acest|the|this|urmatoarea)\s+)?(?:postare|stire|informatie|mesaj|afirmatie|news|message|post|claim|telegram(?:\s+post)?)\s*(?:de\s+pe\s+telegram)?[\s,:-]*/,"")
  .replace(/^(?:daca\s+este\s+adevarat|este\s+adevarat|is\s+this\s+true|este\s+real)[\s,:-]*/,"").trim();
 const enough=claim.length>=35&&claim.split(/\s+/).length>=6;
 return {...reference,mode:!request?"reference_only":enough?"verify_user_claim":"needs_claim",claim:enough?claim:"",user_submitted:true};
}
export function telegramVerificationPrompt(language="ro",linkType="public"){
 const en=language==="en",publicLink=linkType==="public";
 if(en)return publicLink
  ?"I can use the Telegram post link as a reference, but I can't retrieve its contents automatically. Paste the exact claim from the post and explicitly ask me to check it against independent sources. Only submit text you are authorized to share."
  :"This is not an accessible public Telegram post link. I won't access private chats or groups. If you want independent fact-checking, paste a claim you are authorized to share and explicitly ask me to verify it.";
 return publicLink
  ?"Pot folosi linkul Telegram ca referință, dar nu pot prelua automat conținutul postării. Copiază afirmația exactă din mesaj și cere explicit verificarea ei în surse independente. Trimite doar text pe care ai dreptul să îl distribui."
  :"Linkul nu indică o postare publică Telegram accesibilă. Nu voi accesa conversații sau grupuri private. Pentru verificare, copiază o afirmație pe care ai dreptul să o distribui și cere explicit compararea ei cu surse independente.";
}
export function telegramExternalResearchQuery(ref){
 if(!ref||ref.mode!=="verify_user_claim")return null;
 // Never send the Telegram URL as a search term. Search external open-web
 // evidence for the user's own text; never treat the shared claim as a fact.
 return ref.claim.slice(0,360)+" independent corroboration primary source fact check";
}
