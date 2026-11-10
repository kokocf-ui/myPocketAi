import {parseCulinaryRequest} from './culinary_intent.mjs';
import {classifyConversationTurn} from './conversation_intent.mjs';
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
export function isRecipeHistoryQuestion(value){
 const t=normalize(value);
 return /\b(?:ce|care|what|which)\b.{0,100}\b(?:retet\w*|recipe\w*|preparate)\b.{0,100}\b(?:am\s+(?:cerut|solicitat)|i\s+(?:asked|requested))\b/.test(t)
  || /\b(?:ce|care|what|which)\b.{0,85}\b(?:am\s+(?:cerut|solicitat)|i\s+(?:asked|requested))\b.{0,85}\b(?:retet\w*|recipe\w*)\b/.test(t);
}
export function summarizePriorRecipeRequests(history,currentMessage,language='ro'){
 if(!isRecipeHistoryQuestion(currentMessage))return null;
 const turns=Array.isArray(history)?history:[];
 const recipes=[];
 for(const item of turns){
  if(!item||item.role!=='user'||typeof item.content!=='string')continue;
  const msg=item.content.trim();
  if(!msg||msg===String(currentMessage).trim())continue;
  if(classifyConversationTurn(msg))continue;
  const intent=parseCulinaryRequest(msg);
  if(!intent.isRecipe||!intent.keywords.length)continue;
  // A fact-based summary uses actual request messages, not what the model
  // claims to remember or the text of previous replies.
  const normalized=normalize(msg);
  if(!/^(?:da(?:mi| mi)?|arata(?:mi| mi)?|cauta(?:mi| mi)?|gaseste(?:mi| mi)?|vreau|as dori|te rog|ofera(?:mi| mi)?|show|find|give|i want)\b/.test(normalized))continue;
  const dish=intent.keywords.join(' ');
  recipes.push({dish,count:intent.explicitCount?intent.count:null,openEnded:intent.openEnded,request:msg});
 }
 const unique=[...new Map(recipes.map((x,i)=>[i+':'+x.dish,x])).values()];
 if(!unique.length)return language==='ro'
   ?'În istoricul disponibil al acestei conversații nu găsesc o cerere culinară anterioară.'
   :'I cannot find an earlier recipe request in the available conversation history.';
 return language==='ro'
  ?'În istoricul disponibil al acestei conversații ai cerut: '+unique.map(x=>'rețete de '+x.dish+(x.count?' ('+x.count+' cerute)':' (fără număr exact)')).join('; ')+'.'
  :'In the available history of this conversation, you requested: '+unique.map(x=>x.dish+' recipes'+(x.count?' ('+x.count+' requested)':' (no exact number)')).join('; ')+'.';
}
