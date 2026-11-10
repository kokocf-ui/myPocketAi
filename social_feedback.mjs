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


// Look up the user's ACTUAL prior cooking request. A question about how many
// recipes were requested is not itself a fresh recipe-search instruction.
export function resolveRecipeRequestRecall(text,history=[]){
 const normalized=String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
 const isRecall=/\b(?:cate|cati|cat|care|ce|how many|what)\b/.test(normalized)
  && (/(\b(?:am|mi|ti|i)\b.*\b(?:cerut|spus|zis|solicitat|rugat|requested|asked|said)\b)/.test(normalized)
   || /\b(?:solicitarea|cererea|request)\s+(?:mea|my)\b/.test(normalized)
   || /\b(?:did i ask|have i asked)\b/.test(normalized))
  && /\b(?:retet\w*|recipe\w*|solicitare\w*|cerere\w*|request\w*|sarmal\w*|guacamole)\b/.test(normalized);
 if(!isRecall)return null;
 // Specific dish names are extracted from the recall wording, not inferred
 // from whichever unrelated recipe happened to be discussed most recently.
 const named=normalized.match(/\b(?:retet\w*\s+(?:de|of|for)|despre|cu\s+privire\s+la|referitor\s+la|about)\s+(.+?)(?=\s+(?:am|mi|ti|sa|eu|i|you|did|was|erau|cate|care|ce)\b|$)/);
 const namedDish=named?named[1].trim():'';
 const askedDish=parseCulinaryRequest(namedDish).keywords;
 const userTurns=(Array.isArray(history)?history:[])
  .filter(x=>x&&x.role==='user'&&typeof x.content==='string');
 for(let i=userTurns.length-1;i>=0;i--){
  const prior=userTurns[i].content.trim();
  if(!prior||prior===String(text||'').trim())continue;
  // Never interpret an earlier "how many recipes did I ask for?" question
  // or a complaint as an explicit instruction to prepare new recipes.
  const historical=prior.normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  if((/\b(?:cate|cati|care|ce|how many|what)\b/.test(historical)
      &&/\b(?:am|mea|my|did i|requested|asked)\b/.test(historical)
      &&/\b(?:cerut|spus|zis|solicitarea|cererea|request|asked)\b/.test(historical))
    ||resolveRecipeFollowupComplaint(prior,[]))continue;
  const parsed=parseCulinaryRequest(prior);
  if(!parsed.isRecipe||!parsed.keywords.length)continue;
  if(askedDish.length&&!askedDish.every(word=>parsed.keywords.some(w=>w===word||w.startsWith(word.slice(0,5)))))continue;
  const explicitCount=/\b(?:\d{1,2}|doua|doi|trei|patru|cinci|sase|one|two|three|four|five|six)\s+(?:variante?\s+de\s+|tipuri\s+de\s+)?(?:retet\w*|recipes?)\b/i.test(
    prior.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase());
  return {kind:'found',count:parsed.count,dish:parsed.keywords.join(' '),original:prior,explicitCount};
 }
 return {kind:'not_found',dish:askedDish.join(' ')};
}
export function formatRecipeRequestRecall(found,language='ro'){
 if(!found)return '';
 const ro=language==='ro';
 if(found.kind==='not_found')return ro
  ?'Nu găsesc în istoricul disponibil al acestei conversații cererea anterioară'+(found.dish?' pentru '+found.dish:'')+'.'
  :'I cannot find the earlier recipe request'+(found.dish?' for '+found.dish:'')+' in the available conversation history.';
 if(!found.explicitCount)return ro
  ?'Ai cerut mai multe rețete de '+found.dish+'. Aplicația a interpretat această formulare ca '+found.count+' rețete.'
  :'You asked for several '+found.dish+' recipes. The app interpreted that as '+found.count+'.';
 return ro?'Mi-ai cerut '+found.count+' rețete de '+found.dish+'.'
  :'You asked me for '+found.count+' '+found.dish+' recipes.';
}
