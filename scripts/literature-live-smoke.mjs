import backend from '../backend.js';
import {evaVisibleAnswer} from '../eva_ai_orchestrator.mjs';
import {literatureOutputIssue,literatureWordCount} from '../literature_output_quality.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
const account=process.env.CLOUDFLARE_ACCOUNT_ID;
const token=process.env.CLOUDFLARE_AI_TOKEN;
const nativeFetch=globalThis.fetch;
const experimentModel=process.env.LITERATURE_CANARY_DEEP==='1'?'@cf/openai/gpt-oss-120b':null;
const editorialCheck=process.env.LITERATURE_CANARY_EDIT==='1';
let calls=0;
const maxCalls=4;
const callStats=[];
const fixtures=[
 {id:'class10_essay',activity:'write',message:'You are a skilled literary author and editor. Write in Romanian. Country of education: România. Class/year: 10. Activity: write. The task is a FINISHED essay, not a lesson. Task: Eseu argumentativ sau literar. Textul utilizatorului: Redactează un eseu argumentativ de aproximativ 500 de cuvinte despre rolul memoriei în construirea identității personale. Formulează o teză clară, dezvoltă două argumente distincte, discută o posibilă obiecție și construiește o concluzie logică. Folosește un limbaj matur și natural, fără repetiții, citate inventate sau formulări șablon.'},
 {id:'class10_theory',activity:'lesson',message:'Country of education: România. Class/year: 10. Activity: lesson. Teach in Romanian: Figurile de stil în poezia lirică: epitet, comparație, metaforă, personificare, antiteză. Explică diferențele, cum recunoaștem procedeele, ce efect expresiv au, oferă exemple originale distincte și o analiză aplicată. Teorie completă, nu rezumat sau set de exerciții.'}
];
async function aiRun(model,options){
 if(calls>=maxCalls)throw Error('canary_call_cap');
 calls++;
 const start=Date.now();
 const chosen=experimentModel||model;
 const tuned=experimentModel?{...options,reasoning_effort:'low',max_tokens:Math.max(2800,Number(options.max_tokens)||2800)}:options;
 const response=await nativeFetch('https://api.cloudflare.com/client/v4/accounts/'+encodeURIComponent(account)+'/ai/run/'+chosen,{
   method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},
   signal:AbortSignal.timeout(85000),
   body:JSON.stringify({...tuned,stream:false})
 });
 const body=await response.json().catch(()=>null);
 callStats.push({model:chosen,status:response.status,ms:Date.now()-start});
 if(!response.ok||body?.success===false)throw Error('cloudflare_ai_'+response.status+': '+JSON.stringify(body?.errors||[]).slice(0,170));
 const raw=body?.result||body;
 return experimentModel?{response:evaVisibleAnswer(raw)}:raw;
}
globalThis.fetch=async()=>{throw Error('Unexpected network request during literature canary')};
const results=[];
if(!account||!token)throw Error('Cloudflare AI canary credentials missing');
for(const item of fixtures){
 const start=Date.now();
 try{
  const response=await backend.fetch(new Request('https://literature-test.invalid/api/chat',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({module:'education_study',education_subject:'language_literature',
       education_activity:item.activity,language:'ro',message:item.message})}),{AI:{run:aiRun},
       POCKET_AI_TEXT_MODEL:process.env.LITERATURE_CANARY_MODEL||''});
  const body=await response.json();
  const draft=String(body.reply||'');
  let answer=draft;
  if(editorialCheck&&response.status===200&&draft){
   const essay=item.activity==='write';
   const requirements=essay
    ?'A finished mature argumentative essay of approximately 460–550 words, 5–7 natural coherent paragraphs with thesis, two different arguments, a genuine objection and an earned conclusion. No section labels and no moralising.'
    :'A complete class-10 literature chapter of 450–650 substantial words: accurate figures of speech, original labelled examples, precise distinctions between EPITET/comparison/metaphor/personification/ANTITHESIS vs OXYMORON, and an applied explanation of each expressive effect. No invented citations or attribution to real authors.';
   const editor='You are an experienced native Romanian literary editor AND literature teacher. Revise the following draft into a publishable mature Romanian text. Thoroughly correct diacritics, cases, gender/number agreement, awkward calques, repetition and vague content. '
    +'Preserve the original assignment and factual accuracy, remove unsupported author/poem examples, and prefer original concrete examples for explanations. '
    +'Deliver the full revised FINAL text only, not editing notes, apology or a checklist. '+requirements;
   const revise=await aiRun('@cf/meta/llama-3.3-70b-instruct-fp8-fast',{
    messages:[{role:'system',content:editor},{role:'user',content:'CERINȚĂ ORIGINALĂ:\n'+item.message+
     '\n\nTEXT DE REVIZUIT:\n'+draft}],temperature:0.12,max_tokens:3200});
   answer=evaVisibleAnswer(revise);
  }
  const issue=answer?literatureOutputIssue(answer,item.activity,item.message):body.quality||body.error||null;
  results.push({id:item.id,http:response.status,status:body.status,error:body.error||null,
   issue,draft_words:literatureWordCount(draft),words:literatureWordCount(answer),
   ms:Date.now()-start,draft:draft.slice(0,14000),answer:answer.slice(0,14000)});
 }catch(error){results.push({id:item.id,error:String(error?.message||error).slice(0,180),ms:Date.now()-start,words:0});}
}
await mkdir('reports',{recursive:true});
await writeFile('reports/literature-live-smoke.json',JSON.stringify({calls,maxCalls,callStats,results},null,2));
console.log(JSON.stringify({calls,callStats,results:results.map(x=>({...x,answer:x.answer?.slice(0,900)}))},null,2));
if(results.length!==2||results.some(x=>x.http!==200||x.issue||x.words<280))
 process.exitCode=2;
