// Classify ordinary dialogue before opportunistic POI geocoding or research.
const n=x=>String(x||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim().replace(/[!?.,;:]+$/,"");
const trip=/^(?:vreau sa (?:ajung|merg)|cum (?:pot )?ajung|du-ma|merg pana|traseu|ruta|route to|take me to|directions to|how (?:do|can) i get to|i want to go to|i need to get to)\b/;
const explicitPlace=/^(?:unde (?:este|e|gasesc)|cauta(?:-mi)?|gaseste(?:-mi)?|find|locate|search for|show me (?:nearby|a )|arata-mi (?:un|o|cele mai apropiate))\b/;
const social=/^(?:(?:parca|mi se pare ca|se pare ca|azi|astazi|today|you seem)(?:\s+\w+){0,3}\s+(?:esti|e|sunt|are|seem)\s+(?:(?:cam|prea|foarte|tare|a bit|too|very)\s+)?(?:serioas\w*|timid\w*|amuzant\w*|haioas\w*|serious|quiet|funny)\b|(?:esti|sunt|you are|you're)\s+(?:(?:cam|prea|foarte|tare|a bit|too|very)\s+)?(?:serioas\w*|timid\w*|amuzant\w*|haioas\w*|serious|quiet|funny)\b|(?:glumeam|glumesc|era o gluma|just kidding|i was joking|i'm joking|i was only joking)\b|(?:voiam|am vrut)\s+doar\s+sa\s+vad\s+daca\s+ai\s+simtul\s+umorului\b)/;
// Whole-turn conversational replies take priority over short-name geocoding.
// This does not classify substantive requests such as "Sunt bine, caută un hotel"
// as small talk. The text must match the entire utterance.
const plainSocial=x=>x.replace(/[!?.,;:]+/g," ").replace(/\s+/g," ").trim();
const checkinPositive=/^(?:(?:eu )?(?:sunt|ma simt) (?:(?:foarte|destul de|chiar) )?(?:bine|ok|okay|excelent|grozav|in regula)(?: (?:multumesc|mersi))?|(?:(?:foarte|destul de) )?bine(?: (?:multumesc|mersi))?|(?:ok|okay|in regula|excelent)(?: (?:multumesc|mersi))?|(?:multumesc|mersi)(?: sunt bine)?|(?:i am|i'm) (?:fine|good|okay|ok|great)(?: thanks)?|(?:fine|good|great) thanks|i'm doing well(?: thanks)?|(?:je vais bien|ca va bien)(?: merci)?|bien merci|estoy bien(?: gracias)?|sto bene(?: grazie)?|mir geht es gut(?: danke)?)(?: (?:si tu|and you))?$/u;
const checkinConcern=/^(?:(?:nu|not) (?:prea )?(?:sunt|ma simt) bine|(?:nu|not) (?:sunt|ma simt) (?:bine|ok)|(?:sunt|ma simt) (?:rau|trist|trista|obosit|obosita|ingrijorat|ingrijorata)|(?:i am|i'm) (?:not well|not okay|sad|tired|worried)|not (?:so )?(?:good|great)|je ne vais pas bien)$/u;
const reformat=/^(?:(?:te rog|please)\s+)?(?:raspunde|reformuleaza|rescrie|spune|rezuma|respond|rephrase|rewrite|summarize|answer)\b[\s\S]{0,100}\b(?:propozit\w*|sentence\w*|pe scurt|briefly|concis|concise)\b/;
const explanatory=/^(?:explica(?:-mi)?|explain(?: to me)?|descrie(?:-mi)?|define(?:ste)?|defineste|spune-mi (?:ce inseamna|care e diferenta)|tell me (?:what|the difference)|what does|ce inseamna|care este diferenta)\b/;
const sentenceCount=t=>{
 const m=t.match(/\b(?:(?:in|intr-o|inexact|in exactly|using|cu)\s+)?(o|una|unu|singura|singur|one|doua|doi|two|trei|three|patru|four|[1-4])\s+(?:singura\s+)?(?:propozit\w*|sentenc\w*)\b/);
 return m?({o:1,una:1,unu:1,singura:1,singur:1,one:1,doua:2,doi:2,two:2,trei:3,three:3,patru:4,four:4}[m[1]]||Number(m[1])):null;
};
export function classifyDialogueIntent(message){
 const text=n(message);
 if(!text||text.length>350||trip.test(text)||explicitPlace.test(text))return {kind:"none",sentence_count:null};
 const socialText=plainSocial(text);
 if(checkinPositive.test(socialText))return {kind:"social_checkin",sentence_count:null,sentiment:"positive"};
 if(checkinConcern.test(socialText))return {kind:"social_checkin",sentence_count:null,sentiment:"concern"};
 if(social.test(text))return {kind:"social_feedback",sentence_count:null};
 if(reformat.test(text))return {kind:"reformat_previous",sentence_count:sentenceCount(text)};
 if(explanatory.test(text))return {kind:"explanation",sentence_count:sentenceCount(text)};
 return {kind:"none",sentence_count:null};
}
export function blocksImplicitPlaceLookup(message){
 return classifyDialogueIntent(message).kind!=="none";
}
export function isStableCapitalQuestion(message){
 const text=n(message);
 if(/\b(?:azi|astazi|latest|recent|current|verifica|sursa|source|confirm|20\d\d)\b/.test(text))return false;
 return /^(?:care (?:e|este) capitala(?: tarii)?|what(?:'s| is) the capital of)\s+[\p{L}\p{M} '-]{4,60}[?!.]?$/u.test(text);
}
