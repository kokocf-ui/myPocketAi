import backend from '../backend.js';
import {literatureOutputIssue,literatureWordCount} from '../literature_output_quality.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
const account=process.env.CLOUDFLARE_ACCOUNT_ID;
const token=process.env.CLOUDFLARE_AI_TOKEN;
const nativeFetch=globalThis.fetch;
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
 const response=await nativeFetch('https://api.cloudflare.com/client/v4/accounts/'+encodeURIComponent(account)+'/ai/run/'+model,{
   method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},
   signal:AbortSignal.timeout(65000),
   body:JSON.stringify({...options,stream:false})
 });
 const body=await response.json().catch(()=>null);
 callStats.push({model,status:response.status,ms:Date.now()-start});
 if(!response.ok||body?.success===false)throw Error('cloudflare_ai_'+response.status+': '+JSON.stringify(body?.errors||[]).slice(0,170));
 return body?.result||body;
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
       education_activity:item.activity,language:'ro',message:item.message})}),{AI:{run:aiRun}});
  const body=await response.json();
  const answer=String(body.reply||'');
  const issue=answer?literatureOutputIssue(answer,item.activity,item.message):body.quality||body.error||null;
  results.push({id:item.id,http:response.status,status:body.status,error:body.error||null,
   issue,words:literatureWordCount(answer),ms:Date.now()-start,answer:answer.slice(0,14000)});
 }catch(error){results.push({id:item.id,error:String(error?.message||error).slice(0,180),ms:Date.now()-start,words:0});}
}
await mkdir('reports',{recursive:true});
await writeFile('reports/literature-live-smoke.json',JSON.stringify({calls,maxCalls,callStats,results},null,2));
console.log(JSON.stringify({calls,callStats,results:results.map(x=>({...x,answer:x.answer?.slice(0,900)}))},null,2));
if(results.length!==2||results.some(x=>x.http!==200||x.issue||x.words<280))
 process.exitCode=2;
