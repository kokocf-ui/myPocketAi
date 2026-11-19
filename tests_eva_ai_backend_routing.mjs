import assert from 'node:assert/strict';
import fs from 'node:fs';
import backend from './backend.js';
import {EVA_AI_MODELS} from './eva_ai_orchestrator.mjs';

const chapter='Mara a găsit sub masa bibliotecii o busolă veche, ale cărei ace arătau către un perete gol. A încercat să deschidă ușa de alături, dar aceasta era încuiată. Când lumina s-a stins, bunica a aprins o lanternă. Fata a urmărit direcția busolei și a descoperit o cutie mică în spatele unei cărți. Înăuntru era cheia potrivită. A deschis ușa și a văzut o hartă desenată de bunicul ei, cu o invitație la o nouă aventură. Nu era o comoară de aur, ci un secret de familie.';
const book=Array.from({length:3},(_,i)=>'CAPITOL '+(i+1)+': Descoperirea '+(i+1)+'\n'+chapter).join('\n\n');
const storyData={
 module:'creative_storybook',story_type:'children',chapter_count:3,
 story_seed:'Creează o poveste originală despre o busolă veche, descoperită într-o bibliotecă.',
 title:'Busola misterioasă',message:'Creează o poveste originală despre o busolă veche, descoperită într-o bibliotecă.',language:'ro'
};
const post=async(data,env)=>{
 const response=await backend.fetch(new Request('https://unit.test/api/chat',{
  method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)
 }),env);
 return {status:response.status,body:await response.json()};
};
let seen=[];
const active={
 POCKET_EVA_SMART_ROUTER_ENABLED:'1',
 AI:{run:async(model,args)=>{
  seen.push({model,args});
  return {output:[{type:'reasoning',summary:[{text:'private'}]},
   {type:'message',content:[{type:'output_text',text:book}]}]};
 }}
};
let response=await post(storyData,active);
assert.equal(response.status,200,JSON.stringify(response.body).slice(0,400));
assert.equal(response.body.status,'success');
assert.equal(response.body.chapters.length,3);
assert.equal(seen[0].model,EVA_AI_MODELS.deep);
assert.equal(seen[0].args.reasoning_effort,'low');
assert.ok(!JSON.stringify(response.body).includes('private'));
seen=[];
const passive={POCKET_EVA_CREATIVE_QUALITY_ENABLED:'0',AI:{run:async(model)=>{
 seen.push(model);return {response:book};
}}};
response=await post(storyData,passive);
assert.equal(response.status,200);
assert.deepEqual(seen,[EVA_AI_MODELS.fast],'default OFF must preserve old model');

seen=[];
const literature={
 module:'education_study',education_subject:'language_literature',
 education_activity:'essay',language:'ro',
 message:'Scrie o analiză argumentată despre relația dintre imagini, simboluri și temele centrale ale poeziei.'
};
response=await post(literature,{
 POCKET_EVA_SMART_ROUTER_ENABLED:'1',AI:{run:async(model,args)=>{
  seen.push({model,args});return {response:'Analiza urmărește simbolurile, ideile și efectele imaginilor poetice, cu exemple concrete și o interpretare coerentă.'};
 }}
});
assert.equal(response.status,200,JSON.stringify(response.body).slice(0,400));
assert.equal(seen[0].model,EVA_AI_MODELS.deep);
seen=[];
const history={
 module:'education_study',education_subject:'history',
 education_activity:'lesson',language:'ro',
 message:'Explică pe înțelesul elevilor cauzele și efectele revoluției de la 1848, fără să inventezi surse.'
};
response=await post(history,{
 POCKET_EVA_SMART_ROUTER_ENABLED:'1',AI:{run:async(model,args)=>{
  seen.push(model);return {response:'Revoluțiile de la 1848 au avut cauze politice, sociale și naționale. Explicația trebuie adaptată țării și manualului.'};
 }}
});
assert.equal(response.status,200,JSON.stringify(response.body).slice(0,400));
assert.equal(seen[0],EVA_AI_MODELS.balanced);
const backendText=fs.readFileSync('backend.js','utf8');
assert.match(backendText,/const smartMainPlan=evaSmartRouterEnabled/);
assert.match(backendText,/executeEvaAI\(env\.AI,smartMainPlan,mainOptions\)/);
assert.match(backendText,/POCKET_EVA_SMART_ROUTER_ENABLED/);
console.log('PASS Eva backend AI routing: story deep, literature deep, history balanced, default OFF, no internal reasoning leakage');
