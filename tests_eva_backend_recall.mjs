import assert from 'node:assert/strict';
import worker from './backend.js';
import {webcrypto} from 'node:crypto';
globalThis.crypto??=webcrypto;
let aiCalls=0;
const env={AI:{run:async(_model,{messages})=>{
 aiCalls++;
 assert.match(messages[0].content,/EXCLUSIV|ONLY/);
 return {response:'Am discutat despre transportul Oradea–Cluj și faptul că tarifele trebuie reverificate. [1] [2]'};
}}};
const history=[
 {role:'user',content:'Am discutat despre transportul dintre Oradea și Cluj, inclusiv autocare.'},
 {role:'assistant',content:'Prețurile și locurile disponibile trebuie reverificate.'}
];
async function ask(message,additional={}){
 const response=await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',
 headers:{'content-type':'application/json'},
 body:JSON.stringify({message,language:'ro',module:'assistant',history,...additional})}),env);
 assert.equal(response.status,200);
 return response.json();
}
let result=await ask('Eva, caută în conversațiile noastre ce am discutat despre Oradea și Cluj');
assert.equal(result.conversation_intent,'history_recall');
assert.equal(result.history_scope,'supplied_turns_only');
assert.equal(result.history_matches.length>0,true);
assert.match(result.reply,/Oradea/);
assert.match(result.reply,/nu întreaga arhivă/);
assert.equal(result.web_search_status,'not_needed');
assert.equal(result.ai_generated,true);
assert.equal(aiCalls,1);
result=await ask('Ce am discutat despre Bratislava?');
assert.equal(result.conversation_intent,'history_recall');
assert.equal(result.ai_generated,false);
assert.match(result.reply,/Nu am găsit/);
assert.match(result.reply,/Istoricul ChatGPT este separat/);
assert.equal(aiCalls,1,'No AI generation without matching evidence');
result=await ask('Uită-te în istoricul conversațiilor',{history:[]});
assert.equal(result.conversation_intent,'history_recall','Never classify history lookup as an address');
assert.match(result.reply,/Despre ce subiect/);
assert.equal(result.web_search_status,'not_needed');
assert.equal(aiCalls,1,'No AI or geocoding on topic-free history requests');
result=await ask('Ce recomandări mi-ai dat anterior despre Manchester?',{history:[
 {role:'user',content:'Pentru Manchester prefer trenul și un hotel în centru.'},
 {role:'assistant',content:'Am recomandat un hotel din centrul orașului.'}
]});
assert.equal(result.conversation_intent,'history_recall');
assert.ok(result.history_matches.some(x=>x.content.includes('Manchester')),
 'Past recommendation search must use actual history evidence');
result=await ask('Și acolo?',{history:[]});
assert.equal(result.conversation_intent,'clarification_needed');
assert.equal(result.clarification_required,true);
assert.match(result.reply,/La ce/);
assert.equal(aiCalls,1);
const manchester=[
 {role:'user',content:'Eva, pentru excursia mea la Manchester prefer să călătoresc cu trenul și să caut un hotel aproape de centru.'},
 {role:'assistant',content:'Sunt încântată să te ajut cu planificarea excursiei tale la Manchester!'}
];
const saved=await ask('Eva, caută în conversațiile noastre cum prefer să călătoresc la Manchester și în ce zonă vreau hotelul.',{history:manchester});
assert.equal(saved.conversation_intent,'history_recall');
assert.ok(saved.history_matches.some(x=>x.content.includes('trenul')&&x.content.includes('aproape de centru')),
 'Backend must receive exact archived preference evidence');
console.log('PASS Eva backend history summarization, no-match handling and clarification');
