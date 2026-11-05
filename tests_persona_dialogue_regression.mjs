import assert from 'node:assert/strict';
import worker from './backend.js';
import {readFileSync} from 'node:fs';

const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
assert(backend.includes('PERSONALITATE POCKET AI'),'Romanian persona instruction exists');
assert(backend.includes('POCKET AI CHARACTER'),'other languages receive persona instruction');
assert(backend.includes('previousThanks%variants.length'),'social replies rotate based on real conversation');
assert(backend.includes("recentAnswers.includes(socialNorm(candidate))"),'avoid recent replies');
assert(/temperature\s*:\s*eventResearchIntent\s*\|\|\s*recipeInstruction\s*\?\s*0\.05\s*:\s*0\.18/.test(backend),'factual web and recipe generation preserve conservative temperature');

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
// Cloudflare 4006 is an account-wide free-neuron quota limit, not an outage
// that can be resolved by retrying another Workers AI model on the same account.
let quotaCalls=0;
const quotaResponse=await worker.fetch(new Request('https://example.test/api/chat',{
 method:'POST',headers:{'content-type':'application/json'},
 body:JSON.stringify({message:'Explică-mi ce este un număr prim.',language:'ro',history:[]})
}),{AI:{run:async()=>{quotaCalls++;throw new Error("4006: you have used up your daily free allocation of 10,000 neurons");}}});
const quotaData=await quotaResponse.json();
assert.equal(quotaResponse.status,429,'daily quota should not be presented as generic AI 502');
assert.equal(quotaData.error_code,'AI_QUOTA_EXCEEDED');
assert.equal(quotaCalls,1,'do not retry another Workers AI model with the same exhausted quota');
assert.match(quotaData.error,/limita zilnică/i);
assert.ok(!quotaData.error_detail,'user facing quota response must not expose provider internals');
console.log('Cloudflare Workers AI daily quota 4006 handled without futile model fallback — PASS');
console.log('Feminine personality instructions and contextual courtesy variation — PASS');
