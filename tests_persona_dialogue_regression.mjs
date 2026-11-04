import assert from 'node:assert/strict';
import worker from './backend.js';
import {readFileSync} from 'node:fs';

const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
assert(backend.includes('PERSONALITATE POCKET AI'),'Romanian persona instruction exists');
assert(backend.includes('POCKET AI CHARACTER'),'other languages receive persona instruction');
assert(backend.includes('previousThanks%variants.length'),'social replies rotate based on real conversation');
assert(backend.includes("recentAnswers.includes(socialNorm(candidate))"),'avoid recent replies');
assert(backend.includes("temperature: eventResearchIntent || recipeInstruction ? 0.05 : 0.18"),'factual web and recipe generation preserve conservative temperature');

let aiCalls=0;
const ai={run:async()=>{aiCalls++;return {response:'Răspuns de test.'}}};
async function ask(message,language='ro',history=[]){
 const req=new Request('https://example.test/api/chat',{method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({message,language,history})});
 const response=await worker.fetch(req,{AI:ai});
 assert.equal(response.status,200, 'HTTP success '+message);
 return response.json();
}
const first=await ask('Mulțumesc');
const second=await ask('Mulțumesc','ro',[
 {role:'user',content:'Mulțumesc'},
 {role:'assistant',content:first.reply},
 {role:'user',content:'Cum merge?'},
 {role:'assistant',content:'Toate bune!'}]);
assert(first.reply&&second.reply&&first.reply!==second.reply,'second thanks uses different response');
assert.equal(first.conversational_reply,true);
assert.equal(second.conversational_reply,true);
const third=await ask('Mersi','ro',[
 {role:'user',content:'Mulțumesc'},
 {role:'assistant',content:first.reply},
 {role:'user',content:'Mulțumesc'},
 {role:'assistant',content:second.reply}]);
assert(![first.reply,second.reply].includes(third.reply),'three successive thanks all differ');
const english=await ask('Thank you','en',[{role:'assistant',content:'My pleasure!'}]);
assert(english.reply!=='My pleasure!','English repeats are avoided');
assert.equal(aiCalls,0,'social courtesy can be answered without a slow AI call');
const extended=await ask('Mulțumesc, dar explică-mi ce s-a întâmplat');
assert.notEqual(extended.conversational_reply,true,'follow-up question is not mistaken for isolated thanks');
console.log('Feminine personality instructions and contextual courtesy variation — PASS');
