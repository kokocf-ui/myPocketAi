import assert from 'node:assert/strict';
import worker from './backend.js';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
assert(source.includes('REGULI DE CONCIZIE ȘI RELEVANȚĂ'),'concision rule must exist');
assert(/temperature\s*:\s*eventResearchIntent\s*\|\|\s*recipeInstruction\s*\?\s*0\.05\s*:\s*0\.18/.test(source),'factual creativity reduced');
let aiCalls=0;
const ai={run:async()=>{aiCalls++;return {response:'irrelevant history lesson'}}};
async function ask(message,history=[],language='ro'){
 const resp=await worker.fetch(new Request('https://example.test/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,language,history})}),{AI:ai});
 assert.equal(resp.status,200);
 return resp.json();
}
const oldHistory=[{role:'user',content:'Cum evaluez sursele în cercetarea istorică?'},{role:'assistant',content:'Pași despre cercetare istorică.'}];
const greeting=await ask('Salut ce faci',oldHistory);
assert.equal(greeting.conversational_reply,true,'greeting bypasses historical research history');
assert.match(greeting.reply,/salut|buna|hei/i);
assert(!/cercet|istoric|surselor/.test(greeting.reply),'greeting stays on topic');
const greetingTwo=await ask('Salut ce faci',[...oldHistory,{role:'user',content:'Salut ce faci'},{role:'assistant',content:greeting.reply}]);
assert.notEqual(greeting.reply,greetingTwo.reply,'varied greeting phrasing');
const question=await ask('Ce țări au steag identic sau foarte asemănător cu steagul României?',oldHistory);
assert.equal(question.fact_check_status,'curated_comparison');
assert.match(question.reply,/Ciad/);
assert.match(question.reply,/Moldova/);
assert.match(question.reply,/Andorra/);
assert.match(question.reply,/Indoneziei și statului Monaco sunt roșu-alb/);
assert.equal(aiCalls,0,'common social and verified flag comparison handled without hallucinating AI');
console.log('Greeting intent and verified Romanian flag comparisons — PASS');
