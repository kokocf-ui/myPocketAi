import backend from '../backend.js';
import {EVA_AI_MODELS} from '../eva_ai_orchestrator.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const account=process.env.CLOUDFLARE_ACCOUNT_ID;
const secret=process.env.CLOUDFLARE_AI_TOKEN;
const nativeFetch=globalThis.fetch;
const quota={calls:0,limited:false};
const maxCalls=6;
const outputs=[];
const cases=[
 {id:'adult_story',label:'Poveste pentru adulți în Asistent',
 input:{module:'assistant',language:'ro',
 message:'Creează o poveste pentru adulți, de aproximativ 450 de cuvinte, despre o arhivistă care găsește un mesaj ascuns într-un ceas defect dintr-o gară. Vreau o scenă puternică, o decizie dificilă, dialog natural, un detaliu neașteptat și un final coerent. Nu scrie o morală și nu introduce un copil aventurier.'}},
 {id:'education_essay',label:'Eseu literar în Educație',
 input:{module:'education_study',education_subject:'language_literature',education_activity:'essay',
 language:'ro',message:'Scrie un eseu argumentativ de aproximativ 400 de cuvinte despre felul în care memoria și timpul schimbă perspectiva naratorului într-un roman fictiv. Formulează o teză, dezvoltă două argumente și o obiecție, apoi o concluzie. Nu pretinde că citezi un roman real și nu inventa fragmente din autori existenți.'}},
 {id:'children_book',label:'Mini-carte narată pentru copii',
 input:{module:'creative_storybook',story_type:'children',chapter_count:3,
 title:'Moara care asculta vântul',language:'ro',
 story_seed:'Scrie o poveste originală pentru copii de 10 ani despre o moară veche care se oprește înaintea unui festival și doi prieteni care trebuie să descopere ce blochează mecanismul. Trei capitole, cu tensiune, acțiune, imagini concrete și un final satisfăcător. Fără introduceri banale, morală sau personaje caricaturale.',
 message:'Scrie o poveste originală pentru copii de 10 ani despre o moară veche care se oprește înaintea unui festival și doi prieteni care trebuie să descopere ce blochează mecanismul. Trei capitole, cu tensiune, acțiune, imagini concrete și un final satisfăcător. Fără introduceri banale, morală sau personaje caricaturale.'}}
];
async function aiRun(model,options){
 if(quota.calls>=maxCalls||quota.limited)throw Error('Eva AI canary call limit');
 if(!Object.values(EVA_AI_MODELS).includes(model))throw Error('Unexpected model');
 quota.calls++;
 const started=Date.now();
 const r=await nativeFetch('https://api.cloudflare.com/client/v4/accounts/'+encodeURIComponent(account)+'/ai/run/'+model,{
  method:'POST',headers:{Authorization:'Bearer '+secret,'Content-Type':'application/json'},
  signal:AbortSignal.timeout(85000),body:JSON.stringify({...options,stream:false})
 });
 const j=await r.json().catch(()=>null);
 const ms=Date.now()-started;
 if(!r.ok||j?.success===false){
  const body=JSON.stringify(j||{}).slice(0,350);
  if(r.status===429||/4006|quota|rate.?limit/i.test(body))quota.limited=true;
  const reason=quota.limited?'429 quota_exceeded':'provider_http_'+r.status;
  outputs.push({type:'model_call',model,status:'error',latency_ms:ms,reason});
  throw Error(reason);
 }
 const output=j?.result||j;
 const tokenUsage=output?.usage||j?.usage||{};
 outputs.push({type:'model_call',model,status:'success',latency_ms:ms,
  tokens_input:tokenUsage.input_tokens??tokenUsage.prompt_tokens??null,
  tokens_output:tokenUsage.output_tokens??tokenUsage.completion_tokens??null});
 return output;
}
// No external data are needed for creative fiction and an imaginary essay.
// If an unrelated network request is attempted, log the failure rather than
// consuming Brave/EXA or treating user-generated fiction as live news.
globalThis.fetch=async()=>{throw Error('Pilot blocked unrelated external network request')};
const env={AI:{run:aiRun},POCKET_EVA_SMART_ROUTER_ENABLED:'0',
 POCKET_EVA_CREATIVE_QUALITY_ENABLED:'1'};
const results=[];
if(account&&secret){
 for(const item of cases){
  if(quota.limited||quota.calls>=maxCalls)break;
  const callsBefore=outputs.length,start=Date.now();
  try{
   const r=await backend.fetch(new Request('https://eva-canary.invalid/api/chat',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify(item.input)
   }),env);
   const body=await r.json();
   const text=Array.isArray(body.chapters)
    ?body.chapters.map((c,i)=>'CAPITOL '+(i+1)+'\n'+c.text).join('\n\n')
    :String(body.reply||'');
   results.push({id:item.id,label:item.label,http_status:r.status,
    status:body.status||null,error:body.error||null,chapter_count:body.chapters?.length||0,
    source_count:body.references?.length||0,word_count:text.trim()?text.trim().split(/\s+/).length:0,
    duration_ms:Date.now()-start,
    model_calls:outputs.slice(callsBefore).filter(o=>o.type==='model_call'),answer:text.slice(0,14000)});
  }catch(error){
   results.push({id:item.id,label:item.label,status:'exception',
    error:String(error?.message||'error').slice(0,120),duration_ms:Date.now()-start,
    model_calls:outputs.slice(callsBefore).filter(o=>o.type==='model_call')});
  }
 }
}
await mkdir(resolve('reports'),{recursive:true});
const report={status:account&&secret?'canary_not_deployed':'skipped_credentials_missing',
 date:new Date().toISOString(),model_call_cap:maxCalls,actual_model_calls:quota.calls,
 quota_limited:quota.limited,results};
await writeFile(resolve('reports/eva-creative-canary.json'),JSON.stringify(report,null,2));
let md='# Eva – evaluare reală a creației în trei module\n\n';
md+='**Pilot izolat, fără activare generală a routerului AI.**\n\n';
md+='Data: '+report.date+'; apeluri AI: '+quota.calls+'/'+maxCalls+'.\n\n';
md+='| Caz | Rezultat | Model | Cuvinte | Durată |\n|---|---|---|---:|---:|\n';
for(const r of results){
 md+='| '+r.id+' | '+r.http_status+' / '+r.status+(r.error?' ('+r.error+')':'')+
  ' | '+(r.model_calls?.[0]?.model||'—')+' | '+r.word_count+' | '+r.duration_ms+'ms |\n';
 md+='\n## '+r.label+'\n\n'+(r.answer||'[Niciun text vizibil.]')+'\n\n';
}
await writeFile(resolve('reports/eva-creative-canary.md'),md);
console.log(JSON.stringify({status:report.status,calls:quota.calls,
 results:results.map(r=>({id:r.id,status:r.status,http:r.http_status,error:r.error,words:r.word_count,chapters:r.chapter_count,
 models:r.model_calls?.map(x=>x.model),duration:r.duration_ms}))}));
