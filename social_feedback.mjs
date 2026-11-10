// Short direct feedback addressed to Pocket AI, not a destination or a
// school topic. Keep it separate from historical conversation context.
export function classifyAssistantFeedback(value){
 const text=String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
 if(!text||text.length>115)return null;
 const criticism=/^(?:(?:tu )?esti|sunteti|you are|you re)\s+(?:varza|prost|proasta|slab|slaba|pe langa|neatent|neatenta|confuz|confuza|inutil|inutila|ridicol|ridicola)(?:\s+(?:azi|astazi|la asta|la retete|la matematica))?$/
   .test(text)
  ||/^(?:nu\s+(?:te pricepi|intelegi|stii)|ai\s+(?:gresit|inteles gresit)|gresesti|raspunsul\s+(?:tau|este)\s+(?:gresit|pe langa|prost|slab)|ce prostii spui|you got it wrong|your answer is wrong|that is incorrect|you re not listening)(?:\s+(?:deloc|iar|din nou))?$/.test(text);
 return criticism?'negative':null;
}


import {parseCulinaryRequest} from './culinary_intent.mjs';

// Interpret a complaint about an incomplete cooking answer as a correction,
// not as a new dish search for the words "cerut" and "oferit".
export function resolveRecipeFollowupComplaint(text,history=[]){
 const msg=String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
   .toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
 const complaint=/\b(?:am cerut|ti am cerut|iti cerusem|i asked|i requested|you only gave|mi ai (?:oferit|dat)|mi (?:ai|ati) dat|doar o reteta|doar una|numai una)\b/.test(msg)
   &&/\b(?:retet\w*|recipe\w*)\b/.test(msg)
   &&/\b(?:doar|numai|una|one|one instead|in loc|nu mi ai dat|not all|only|oferit|dat|gave)\b/.test(msg);
 if(!complaint)return null;
 const messages=Array.isArray(history)?history:[];
 for(const item of [...messages].reverse()){
   if(!item||item.role!=='user'||typeof item.content!=='string')continue;
   if(item.content.trim()===String(text||'').trim())continue;
   const last=parseCulinaryRequest(item.content);
   if(!last.isRecipe||!last.keywords.length)continue;
   const dish=last.keywords.slice(0,5).join(' ');
   const count=Math.min(6,Math.max(2,last.count));
   return {kind:'retry',dish,count,request:'Dă-mi '+count+' rețete de '+dish};
 }
 return {kind:'clarify'};
}
