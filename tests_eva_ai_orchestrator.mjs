import assert from 'node:assert/strict';
import {EVA_AI_MODELS,planEvaAI,evaVisibleAnswer,evaModelOptions,executeEvaAI,evaLikelyTruncated} from './eva_ai_orchestrator.mjs';

const legacy=planEvaAI({module:'creative_storybook',genre:'documentary'},{enabled:false});
assert.equal(legacy.model,EVA_AI_MODELS.fast);
assert.equal(legacy.tier,'legacy');
assert.equal(legacy.fallback,null);
const doc=planEvaAI({module:'creative_storybook',genre:'documentary',query:'Decebal'},{enabled:true});
assert.equal(doc.model,EVA_AI_MODELS.deep);
assert.equal(doc.fallback,EVA_AI_MODELS.balanced);
assert.equal(doc.evidenceRequired,true);
assert.equal(planEvaAI({module:'creative_storybook',genre:'children'},{enabled:true}).tier,'deep');
assert.equal(planEvaAI({module:'education_study',subject:'math',query:'Rezolvă această ecuație pas cu pas'},{enabled:true}).tier,'deep');
assert.equal(planEvaAI({module:'education_study',education_subject:'physics',education_activity:'correction',message:'Verifică soluția elevului.'},{enabled:true}).tier,'deep');
assert.equal(planEvaAI({module:'education_study',education_subject:'biology',education_activity:'correction',message:'Evaluează explicația despre ADN'},{enabled:true}).model,EVA_AI_MODELS.deep);
assert.equal(planEvaAI({module:'education_study',education_subject:'biology',education_activity:'correction'},{enabled:false}).tier,'legacy',
 'Disabled flag must preserve existing production model');
assert.equal(planEvaAI({module:'education_study',subject:'history',query:'Lecția despre antichitate'},{enabled:true}).tier,'balanced');
assert.equal(planEvaAI({module:'education_study',subject:'history',activity:'essay'},{enabled:true}).tier,'deep');
assert.equal(planEvaAI({module:'assistant',query:'Bună ziua'},{enabled:true}).tier,'fast');
assert.equal(planEvaAI({module:'assistant',query:'Analizează detaliat un algoritm Python'},{enabled:true}).tier,'deep');
assert.equal(planEvaAI({module:'assistant',query:'Compară două soluții'},{enabled:true}).tier,'balanced');
assert.equal(planEvaAI({module:'news_translation'},{enabled:true}).tier,'fast');
assert.equal(planEvaAI({module:'maps',query:'Cum ajung în Oradea?'},{enabled:true}).tier,'fast');

const textOnly={response:'Text complet.'};
assert.equal(evaVisibleAnswer(textOnly),'Text complet.');
assert.equal(evaVisibleAnswer({result:{choices:[{message:{content:'Din choices.'}}]}}),'Din choices.');
assert.equal(evaVisibleAnswer({result:{output:[{type:'reasoning',summary:[{text:'not visible'}]},
 {type:'message',content:[{type:'output_text',text:'Răspuns normal.'}]}]}}),'Răspuns normal.');
assert.equal(evaVisibleAnswer({result:{output:[{type:'reasoning',summary:[{text:'do not surface'}]}]}}),'');
assert.equal(evaModelOptions(doc,{messages:[{role:'user',content:'Test'}],max_tokens:120}).max_tokens,900);
assert.equal(evaModelOptions(doc,{max_tokens:7000}).max_tokens,3600);
assert.equal(evaModelOptions(doc,{max_tokens:1200}).reasoning_effort,'low');
assert.equal(evaModelOptions({tier:'balanced'},{max_tokens:180}).max_tokens,180);

let calls=[];
const ai={run:async(model,options)=>{
 calls.push({model,options});
 return {response:'Am înțeles cerința și explic clar.',usage:{output_tokens:22}};
}};
let output=await executeEvaAI(ai,doc,{max_tokens:3200,messages:[]});
assert.equal(output.eva_model_used,EVA_AI_MODELS.deep);
assert.equal(output.eva_model_fallback,false);
assert.equal(output.response,'Am înțeles cerința și explic clar.');
assert.equal(calls[0].options.reasoning_effort,'low');
assert.equal(calls.length,1);
calls=[];
const emptyPrimary={run:async(model,options)=>{
 calls.push(model);
 if(model===EVA_AI_MODELS.deep)return {response:'',output:[{type:'reasoning'}]};
 return {response:'Răspuns complet din modelul alternativ.'};
}};
output=await executeEvaAI(emptyPrimary,doc,{messages:[],max_tokens:1200});
assert.equal(output.eva_model_fallback,true);
assert.deepEqual(calls,[EVA_AI_MODELS.deep,EVA_AI_MODELS.balanced]);
calls=[];
const quota={run:async(model)=>{calls.push(model);throw Error('4006 Daily free neuron allocation exceeded')}};
await assert.rejects(()=>executeEvaAI(quota,doc,{messages:[],max_tokens:1000}),/4006/);
assert.equal(calls.length,1,'No fallback when shared account quota is exceeded');
calls=[];
const networkFail={run:async model=>{calls.push(model);throw Error('Provider temporarily unavailable')}};
await assert.rejects(()=>executeEvaAI(networkFail,doc,{messages:[],max_tokens:1000}),/temporarily unavailable/);
assert.equal(calls.length,2,'At most two calls: primary then fallback');
calls=[];
const noRetry={run:async model=>{calls.push(model);throw Error('Temporary outage')}};
await assert.rejects(()=>executeEvaAI(noRetry,doc,{messages:[]},{allowFallback:false}),/Temporary/);
assert.equal(calls.length,1);
const cutFixture={response:'Acesta este un exemplu de răspuns informativ. '.repeat(14)+'În concluzie, trebuie să',usage:{output_tokens:2100}};
assert.equal(evaLikelyTruncated(cutFixture,2100),true);
assert.equal(evaLikelyTruncated({...cutFixture,response:cutFixture.response+' verificăm.'},2100),false);
assert.equal(evaLikelyTruncated({...cutFixture,usage:{output_tokens:1100}},2100),false);
console.log('PASS: Eva AI orchestrator model routing, visibility, one fallback, quota protection and default-off');
