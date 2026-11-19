import assert from 'node:assert/strict';
import backend from './backend.js';
import {EVA_AI_MODELS} from './eva_ai_orchestrator.mjs';
const post=async(data,env)=>{
 const response=await backend.fetch(new Request('https://example.local/api/chat',{
  method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)
 }),env);
 return {status:response.status,data:await response.json()};
};
const chapter='Mara se aplecă asupra unei cutii ascunse printre rafturile bibliotecii. Sub capac era o busolă cu acul blocat înspre o ușă pe care nimeni nu o folosise de ani de zile. Când curentul stinse lumina, prietenul ei îi întinse o lanternă și împreună căutară o cheie printre cărți. Nu voiau să trezească pisica adormită în fața ușii, așa că se mișcară încet. În sertarul unui birou găsiră cheia alături de un bilet semnat de bibliotecar. Ușa se deschise spre o încăpere cu hărți vechi și jurnale. Ei descoperiră că bunicul Marei lăsase un mesaj pentru cititorii curioși.';
const book=Array.from({length:3},(_,i)=>'CAPITOL '+(i+1)+': Descoperirea '+(i+1)+'\n'+chapter).join('\n\n');
const storyRequest={module:'creative_storybook',story_type:'children',
 title:'Busola',chapter_count:3,language:'ro',
 story_seed:'Creează o poveste originală despre o busolă din biblioteca orașului și o descoperire surprinzătoare.',
 message:'Creează o poveste originală despre o busolă din biblioteca orașului și o descoperire surprinzătoare.'};
let calls=[];
let r=await post(storyRequest,{AI:{run:async(model,options)=>{
 calls.push({model,options});
 return {output:[{type:'reasoning',summary:[{text:'internal only'}]},{type:'message',content:[{type:'output_text',text:book}]}]};
}}});
assert.equal(r.status,200,JSON.stringify(r.data).slice(0,260));
assert.equal(r.data.chapter_count,3);
assert.equal(calls[0].model,EVA_AI_MODELS.deep,'Explicit book creation chooses capable model');
assert.equal(calls[0].options.reasoning_effort,'low');
assert.doesNotMatch(JSON.stringify(r.data),/internal only/);
calls=[];
r=await post(storyRequest,{POCKET_EVA_CREATIVE_QUALITY_ENABLED:'0',AI:{run:async model=>{
 calls.push(model);return {response:book};
}}});
assert.equal(r.status,200);
assert.deepEqual(calls,[EVA_AI_MODELS.fast],'Kill switch restores legacy story model');
calls=[];
r=await post(storyRequest,{AI:{run:async(model,options)=>{
 calls.push(model);
 return {response:calls.length===1?'Povestea a fost creată incomplet, fără capitole.':book};
}}});
assert.equal(r.status,200,'One bounded book repair must recover invalid chapter layout');
assert.deepEqual(calls,[EVA_AI_MODELS.deep,EVA_AI_MODELS.balanced]);
calls=[];
r=await post(storyRequest,{AI:{run:async model=>{
 calls.push(model);return {response:'Text incomplet.'};
}}});
assert.equal(r.status,502,'No fabricated successful book when both models fail');
assert.equal(calls.length,2,'Exactly one retry when structurally invalid');
calls=[];
const writing={module:'education_study',education_subject:'language_literature',
 education_activity:'essay',language:'ro',
 message:'Redactează un eseu argumentativ despre simbolurile și perspectivele narative ale unui roman, fără citate inventate.'};
r=await post(writing,{AI:{run:async(model,options)=>{
 calls.push({model,options});
 return {response:'Eseul urmărește contrastul dintre perspectiva narativă și simboluri. Introducerea fixează teza, argumentele sunt sprijinite prin interpretare, iar concluzia clarifică miza expresivă.'};
}}});
assert.equal(r.status,200,JSON.stringify(r.data).slice(0,260));
assert.equal(calls[0].model,EVA_AI_MODELS.deep);
assert.match(calls[0].options.messages[0].content,/defensible thesis/);
calls=[];
r=await post({module:'assistant',language:'ro',
 message:'Compune o poezie originală despre un oraș vechi, cu imagini surprinzătoare și un ton matur.'},
 {AI:{run:async(model,options)=>{
  calls.push({model,options});
  return {response:'Ferestrele se aprind târziu, iar pașii trec prin umbrele pietrei. Din piața veche crește un ecou al timpului, dar fiecare ușă ascunde o altă poveste.'};
 }}});
assert.equal(r.status,200,JSON.stringify(r.data).slice(0,300));
assert.equal(calls[0].model,EVA_AI_MODELS.balanced,'Short creative writing is upgraded without switching all assistant requests');
assert.ok(calls[0].options.max_tokens>=1400,'Creative budget is not the old ~768 limit');
assert.match(calls[0].options.messages[0].content,/original images/);
assert.equal(calls.length,1);
calls=[];
r=await post({module:'assistant',language:'ro',
 message:'Compune o poezie originală despre un oraș vechi, cu imagini surprinzătoare și un ton matur.'},
 {POCKET_EVA_CREATIVE_QUALITY_ENABLED:'0',AI:{run:async model=>{
  calls.push(model);return {response:'Un oraș cu case și oameni.'};
 }}});
assert.equal(r.status,200);
assert.equal(calls[0],EVA_AI_MODELS.fast);
calls=[];
const matureRequest={module:'assistant',language:'ro',
 message:'Creează o poveste pentru adulți, de aproximativ 450 de cuvinte, despre o arhivistă care găsește un mesaj ascuns într-un ceas defect dintr-o gară. Vreau o scenă puternică, o decizie dificilă, dialog natural, un detaliu neașteptat și un final coerent. Nu scrie o morală și nu introduce un copil aventurier.'};
r=await post(matureRequest,{AI:{run:async(model,options)=>{
 calls.push({model,options});
 return {response:'Arhivista intră în gara aproape pustie, cu o scrisoare în mână. Întinse degetele spre mecanismul ceasului, în timp ce mecanicul o avertiză că trenul nu mai poate aștepta. Își aminti de omul care îi ceruse să păstreze tăcerea, dar înțelese că adevărul trebuia transmis înainte de plecare. Împinse ușa și porni spre peron. Decizia era făcută, iar mesajul ajunsese la destinatar.'};
}}});
assert.equal(r.status,200,JSON.stringify(r.data).slice(0,300));
assert.equal(r.data.status,'success');
assert.notEqual(r.data.conversation_intent,'history_recall','A fictional hidden message cannot become a chat-history query');
assert.equal(calls[0]?.model,EVA_AI_MODELS.balanced,'Adult creative story should reach the intended AI generator');
assert.match(calls[0].options.messages[0].content,/Build scenes/);

console.log('PASS: cross-module creative quality – adult writing, education, story repair, model selection and rollback');
