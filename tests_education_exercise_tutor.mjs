import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import backend from './backend.js';
import {educationDepthInstruction} from './education_lesson_depth.mjs';
import {educationExerciseInstruction,educationExerciseNeedsExpansion,educationTutorResponse} from './education_exercise_tutor.mjs';

// Explicit teacher-written fixtures: test the contract and transport, not the
// quality of a live model. The computations below are independently checkable.
const solved=[
 'Datele: rezolvăm 3x + 5 = 20. Vrem valoarea lui x.',
 '1. Scădem 5 din ambele membre pentru a elimina termenul adunat lângă 3x. Egalitatea se păstrează: 3x + 5 − 5 = 20 − 5, deci 3x = 15.',
 '2. Împărțim ambele membre la 3, coeficientul nenul al lui x. Obținem 3x/3 = 15/3, deci x = 5.',
 '3. Verificăm în ecuația inițială: 3 × 5 + 5 = 15 + 5 = 20. Membrul stâng este egal cu cel drept. Soluția este x = 5. Nu scădem 5 numai dintr-un membru.'
].join('\n');
assert.equal(3*5+5,20);
for(const subject of ['math','physics','chemistry','biology','astronomy','history','geography','computing','language_literature','general'])for(const mode of ['solve','method','correction','review']){
 const contract=educationDepthInstruction(subject,mode);
 assert.match(contract,/EXERCISE-ANCHORED TEACHING/);
 assert.match(contract,/WHY it is valid here/);
 assert.match(contract,/one or two useful sentences/);
 assert.match(contract,/each its own method/);
 assert.doesNotMatch(contract,/Create a COMPLETE study lesson/);
}
assert.match(educationDepthInstruction('math','lesson'),/COMPLETE study lesson/,'Full theory lessons are not turned into exercise answers');
assert.match(educationDepthInstruction('math','test'),/Do NOT reveal answers/,'Do not reveal a practice key before an attempt');
assert.match(educationExerciseInstruction('method'),/supplied numbers, symbols, passage or code/);
assert.match(educationExerciseInstruction('correction'),/if only a final answer was supplied/);
assert.equal(educationExerciseNeedsExpansion('x = 5.','solve'),true);
assert.equal(educationExerciseNeedsExpansion(solved,'solve'),false);
assert.equal(educationExerciseNeedsExpansion('Nu avem suficiente date: lipsește lungimea celeilalte laturi.','solve'),false);
assert.equal(educationExerciseNeedsExpansion('Missing diagram: please supply the figure.','method'),false);
assert.equal(educationExerciseNeedsExpansion('O ecuație este o egalitate. '.repeat(60),'method'),true);
assert.equal(educationExerciseNeedsExpansion('x=5.','lesson'),false);
let calls=[];
const opts={messages:[{role:'system',content:educationExerciseInstruction('solve')},{role:'user',content:'3x+5=20. Determină x.'}],max_tokens:3200};
let result=await educationTutorResponse(async o=>{calls.push(o);return {response:calls.length===1?'x=5.':solved}},{...opts},{activity:'solve'});
assert.equal(result.response,solved);assert.equal(calls.length,2);
assert.equal(calls[1].messages[1].content,opts.messages[1].content,'Original question retained in expansion');
assert.match(calls[1].messages.at(-1).content,/ORIGINAL exercise/);assert.equal(opts.messages.length,2,'No mutation of the caller conversation');
calls=[];
result=await educationTutorResponse(async o=>{calls.push(o);return {response:solved}},opts,{activity:'method'});assert.equal(calls.length,1);
calls=[];
result=await educationTutorResponse(async o=>{calls.push(o);return {response:'x=5.'}},opts,{activity:'solve'});assert.equal(calls.length,2,'Never recursively expand a second inadequate response');assert.equal(result.response,'x=5.');
calls=[];
result=await educationTutorResponse(async o=>{calls.push(o);if(calls.length===2)throw Error('quota');return {response:'x=5.'}},opts,{activity:'solve'});assert.equal(calls.length,2);assert.equal(result.response,'x=5.','Preserve a usable first reply if expansion fails');
let attempts=0;await assert.rejects(()=>educationTutorResponse(async()=>{attempts++;throw Error('4006 quota exceeded')},opts,{activity:'solve'}));assert.equal(attempts,1,'No expansion after first-call failure');

const request=data=>new Request('https://tutor.test/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({language:'ro',history:[],...data})});
for(const [module,subject,activity,question] of [
 ['learning','math','method','3x + 5 = 20. Explică metoda pe această ecuație.'],
 ['learning','math','solve','3x + 5 = 20. Determină x.'],
 ['education_study','physics','solve','Un mobil parcurge 150 m în 30 s. Calculează viteza medie.'],
 ['education_study','chemistry','method','Ce volum de soluție 0,5 mol/L diluăm la 250 mL pentru 0,1 mol/L?'],
 ['education_study','biology','correction','Aa × Aa. Elevul spune că aa are probabilitate 50%. Verifică.'],
 ['education_study','astronomy','method','Paralaxa unei stele este 0,05 secunde de arc. Care este distanța în pc?'],
 ['education_study','computing','solve','În Python: s=0; apoi pentru x în [2,4,6], s=s+x. Explică valorile lui s.'],
 ['education_study','history','correction','Textul spune că documentul datează din 1848. Elevul a scris 1849. Corectează pe sursă.'],
 ['education_study','geography','method','Scara este 1:100000, distanța pe hartă 3 cm. Află distanța reală.'],
 ['education_study','language_literature','method','În propoziția „Copilul citește.” identifică predicatul și justifică.'],
 ['education_study','school_admission','method','Află x din 3x+5=20, pentru pregătirea admiterii în Ungaria.'],
 ['education_study','exam_preparation','correction','Dacă P implică Q și P este adevărat, rezultă Q? Elevul spune nu.']
]){
 const seen=[];
 const response=await backend.fetch(request({module,education_subject:subject,education_activity:activity,message:question}),{AI:{run:async(_m,o)=>{seen.push(o);return {response:solved}}}});
 assert.equal(response.status,200,subject+' '+activity+' '+await response.clone().text());
 const json=await response.json();assert.equal(json.reply,solved);assert.equal(seen.length,1);
 assert.match(seen[0].messages[0].content,/EXERCISE-ANCHORED TEACHING/);
 assert.equal(seen[0].messages.find(m=>m.role==='user').content,question);
 if(activity==='method')assert.match(seen[0].messages[0].content,/METHOD ON THIS EXERCISE/);
 assert.ok(seen[0].max_tokens>=2800);
}
// Exercise inputs must fit both the question and an actual student attempt.
let seen=[];
const env={AI:{run:async(_m,o)=>{seen.push(o);return {response:solved}}}};
const long='Problema: 3x+5=20. Rezolvarea elevului: '+'3x=15; x=5. '.repeat(700);
assert.ok(long.length>4000&&long.length<32000);
let response=await backend.fetch(request({module:'education_study',education_subject:'math',education_activity:'correction',message:long}),env);
assert.equal(response.status,200);assert.ok(seen[0].messages.some(m=>m.content===long.trim()),'No silent input truncation');
response=await backend.fetch(request({module:'assistant',message:long}),env);assert.equal(response.status,400,'Ordinary chat limit unchanged');
response=await backend.fetch(request({module:'education_study',education_subject:'math',message:'x'.repeat(32001)}),env);assert.equal(response.status,400,'Educational requests remain bounded');
seen=[];
response=await backend.fetch(request({module:'education_study',education_subject:'math',education_activity:'solve',message:'3x+5=20.'}),{AI:{run:async(_m,o)=>{seen.push(o);return {response:seen.length===1?'x=5.':solved}}}});
assert.equal(response.status,200);assert.equal((await response.json()).reply,solved);assert.equal(seen.length,2,'Actual API route uses the one-expansion guard');
const index=await readFile('index.js','utf8');
assert.doesNotMatch(index,/Predă numai METODA GENERALĂ|Teach only the GENERAL METHOD/);
assert.match(index,/education_activity:session.mode==='explain'\?'method':'solve'/);
const literature=await readFile('literature_task_ui.mjs','utf8');
assert.match(literature,/prompt.slice\(0,exerciseMode\?31000:3900\)/,'Do not cut off the task after the teaching instruction');
const workspace=await readFile('education_lesson_workspace.mjs','utf8');
assert.doesNotMatch(workspace,/theory:row.theory|workedExample:row.worked/);
assert.match(workspace,/run\('method'\)/);assert.match(workspace,/run\('solve'\)/);
console.log('PASS exercise-focused tutoring: shared solve/method/correction contract, 12 API paths, full question+working, bounded expansion and unchanged full-lesson behavior (AI replies mocked)');
