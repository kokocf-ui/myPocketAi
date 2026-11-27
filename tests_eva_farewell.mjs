import assert from 'node:assert/strict';
import {evaFarewellIntent,evaFarewellReply,evaFarewellFallback} from './eva_farewell.mjs';
import {classifyEvaTurn,evaConversationHistory} from './eva_dialogue.mjs';
import worker from './backend.js';
const actual='Bine, ne auzim mai târziu';
const bad='Sunt încântată să te ajut cu informația ta despre surse primare și secundare. Înțeleg că vrei să știi mai mult despre diferența dintre acestea și despre cum să le găsești.';
const positives=[actual,'Bine, ne auzim mai târziu.','Ok, Eva, ne auzim mai târziu','Ne auzim mâine!','Mulțumesc, pe curând!','Bine, vorbim mai târziu','La revedere, Eva!','Thanks, see you later!','Okay, talk to you later','Bis später!','Au revoir!'];
// Address can appear after an acknowledgment too.
for(const value of positives){
 assert.equal(evaFarewellIntent(value),true,value);
 assert.equal(classifyEvaTurn(value,{module:'assistant'})?.speech_act,'farewell',value);
}
for(const task of ['Bine, explică sursele primare și secundare','Explică expresia „ne auzim mai târziu”','Tradu în engleză: ne auzim mai târziu','Bine, ne auzim mai târziu, dar acum spune-mi vremea','Ne auzim mai târziu la gara din Grays?','See you later, but first explain RAM','Vreau să închid aplicația','Bine, cum e vremea în Oradea?'])assert.equal(evaFarewellIntent(task),false,task);
assert.equal(evaFarewellReply(bad,'ro'),evaFarewellFallback('ro'));
assert.equal(evaFarewellReply('Pe curând, Costi! Să ai o seară frumoasă.','ro'),'Pe curând, Costi! Să ai o seară frumoasă.');
assert.equal(evaFarewellReply('See you later! Take care.','en'),'See you later! Take care.');
assert.equal(evaFarewellReply('Ne auzim! Sursele primare sunt documente originale.','ro'),evaFarewellFallback('ro'));
const history=[{role:'user',content:'Cum este vremea în Oradea, România?'},{role:'assistant',content:'Vremea trebuie verificată pentru Oradea.'},{role:'user',content:'Explică sursele primare.'},{role:'assistant',content:bad}];
assert.deepEqual(evaConversationHistory(history,actual,'farewell'),[]);
assert.equal(classifyEvaTurn(actual,{module:'travel'}),null);
const original=globalThis.fetch;let external=0;globalThis.fetch=async()=>{external++;throw Error('No provider expected')};
try{
 for(const variant of ['off_topic','valid','unavailable']){
  let calls=0;
  const env={AI:{run:async(model,{messages})=>{
   calls++;assert.equal(messages.length,2,'Only system and CURRENT farewell, not old tasks');
   assert.equal(messages[1].content,actual);assert.doesNotMatch(messages[0].content,/Oradea/);
   if(variant==='unavailable')throw Error('simulated model unavailable');
   return {response:variant==='valid'?'Pe curând, Costi! Ai grijă de tine.':bad};
  }}};
  const response=await worker.fetch(new Request('https://test.example/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:actual,module:'assistant',language:'ro',history,location:{latitude:51.479,longitude:.291},route_context:{pending:'destination'},weather_context:{city:'Oradea'}})}),env);
  const data=await response.json();assert.equal(response.status,200,JSON.stringify(data));
  assert.equal(data.conversation_intent,'eva_farewell');assert.equal(data.conversational_reply,true);
  assert.equal(Object.hasOwn(data,'ai_generated'),false,'Internal generation metadata stays hidden');assert.equal(calls,1);
  assert.doesNotMatch(data.reply,/surse|primare|secundare|Oradea|first.hand/i);
  assert.equal(data.reply,variant==='valid'?'Pe curând, Costi! Ai grijă de tine.':evaFarewellFallback('ro'));
  assert.equal(data.requires_exit_confirmation,undefined,'Farewell is not an app-close command');
 }
 assert.equal(external,0,'No GPS/weather/search/transport providers for a farewell');
}finally{globalThis.fetch=original}
console.log('PASS exact screenshot farewell: classification, no stale history, invalid-model guard, natural replies, outage fallback, no providers and task negatives');
