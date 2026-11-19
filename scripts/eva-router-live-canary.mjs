// Live, isolated integration probe of the actual backend AI routing.
// Three synthetic tasks, <=6 Workers AI requests including one fallback per task.
// Does NOT deploy, contact Brave, access user conversations, or change environment flags.
import backend from '../backend.js';
import {EVA_AI_MODELS} from '../eva_ai_orchestrator.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const ACCOUNT_ID=process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN=process.env.CLOUDFLARE_AI_TOKEN;
const MAX_CALLS=6;
const USER_INPUTS=[
 {id:'assistant_reasoning',expected_tier:'deep',
  label:'Asistent – strategie tehnică și decizie motivată',
  request:{module:'assistant',language:'ro',
   message:'Analizează detaliat două strategii de programare pentru sincronizarea unei liste de cumpărături între două telefoane, inclusiv cazul când ambele sunt offline și editează același element. Compară avantajele și compromisurile și recomandă o soluție practică pentru o aplicație mică. Nu pretinde că ai făcut teste sau că ai verificat vreun serviciu.'}},
 {id:'education_history',expected_tier:'balanced',
  label:'Educație – explicație istorică',
  request:{module:'education_study',education_subject:'history',education_activity:'lesson',
   language:'ro',message:'Explică unui elev de liceu cauzele și consecințele revoluțiilor române de la 1848, distingând Țara Românească, Moldova și Transilvania. Prezintă faptele cu precauție, fără citate sau surse inventate.'}},
 {id:'documentary',expected_tier:'deep',
  label:'Documentar – poveste factuală despre Decebal',
  request:{module:'creative_storybook',story_type:'documentary',chapter_count:3,
   title:'Decebal',language:'ro',
   story_seed:'Realizează un documentar despre Decebal, regele dacilor, domnia sa, războaiele cu Roma și consecințele istorice, fără personaje fictive.',
   message:'Realizează un documentar despre Decebal, regele dacilor, domnia sa, războaiele cu Roma și consecințele istorice, fără personaje fictive.'}}
];
const ENCYCLopedia_FIXTURE={
 query:{pages:[{title:'Decebal',fullurl:'https://ro.wikipedia.org/wiki/Decebal',index:1,
 extract:'Decebal a fost ultimul rege al Daciei independente, asociat cu domnia dintre anii 87 și 106. A condus regatul dac în perioada conflictelor cu Imperiul Roman. Înainte de Traian, împăratul Domițian a încheiat o pace cu dacii după confruntările militare de la sfârșitul secolului I. Sub împăratul Traian au avut loc două războaie dacice, în anii 101–102 și 105–106. După primul război, pacea din 102 a impus Daciei condiții restrictive. După al doilea război, capitala Sarmizegetusa Regia a căzut, iar Decebal a murit încercând să evite capturarea. În anul 106, o parte a Daciei a devenit provincie romană. Aceste evenimente au influențat istoria politică și culturală a spațiului carpato-dunărean. Monumentele contemporane care îl înfățișează pe Decebal sunt reprezentări moderne, nu portrete realizate în timpul vieții sale. Multe detalii privind viața sa rămân cunoscute doar din relatări antice și din interpretări istorice ulterioare.'
 }]}}
;
const genuineFetch=globalThis.fetch;
const counts={total:0,quotaExceeded:false,byModel:{},requests:[]};
function summarizeUsage(j){
 const obj=j?.result?.usage||j?.usage||{};
 return {
  input:typeof (obj.prompt_tokens??obj.input_tokens)==='number'?(obj.prompt_tokens??obj.input_tokens):null,
  output:typeof (obj.completion_tokens??obj.output_tokens)==='number'?(obj.completion_tokens??obj.output_tokens):null
 };
}
function shouldBlockUntrustedNet(input){
 const x=String(input?.url||input||'');
 return !x.startsWith('https://ro.wikipedia.org/w/api.php?');
}
globalThis.fetch=async(input,opts)=>{
 if(shouldBlockUntrustedNet(input))
  throw Error('Synthetic canary: unexpected external request blocked');
 const u=new URL(String(input));
 if(u.searchParams.get('gsrsearch')!=='Decebal')
  throw Error('Synthetic canary: unexpected encyclopaedia subject');
 return Response.json(ENCYCLopedia_FIXTURE);
};
const ai={
 async run(model,options){
  if(!Object.values(EVA_AI_MODELS).includes(model))throw Error('Disallowed AI model');
  if(counts.total>=MAX_CALLS||counts.quotaExceeded)throw Error('4006 simulated quota stop');
  counts.total++;
  counts.byModel[model]=(counts.byModel[model]||0)+1;
  const started=Date.now();
  try{
   const timeout=AbortSignal.timeout(85000);
   const response=await genuineFetch(
    'https://api.cloudflare.com/client/v4/accounts/'+encodeURIComponent(ACCOUNT_ID)+'/ai/run/'+model,{
     method:'POST',signal:timeout,
     headers:{'Authorization':'Bearer '+API_TOKEN,'Content-Type':'application/json'},
     body:JSON.stringify({...options,stream:false})
    }
   );
   const payload=await response.json().catch(()=>null);
   const elapsed=Date.now()-started;
   const usage=summarizeUsage(payload);
   counts.requests.push({model,http_status:response.status,latency_ms:elapsed,usage});
   if(!response.ok||payload?.success===false){
    if(response.status===429||JSON.stringify(payload).includes('4006'))counts.quotaExceeded=true;
    throw Error('Workers AI '+(counts.quotaExceeded?'4006 quota_exceeded':'HTTP_'+response.status));
   }
   return payload?.result||payload;
  }catch(e){
   if(counts.requests.length<counts.total)counts.requests.push({model,latency_ms:Date.now()-started,error:String(e?.name||'network_error')});
   throw e;
  }
 }
};
const results=[];
const outputDir=resolve('reports');
await mkdir(outputDir,{recursive:true});
if(!ACCOUNT_ID||!API_TOKEN){
 console.log('SKIPPED: no configured model test credentials.');
 await writeFile(resolve(outputDir,'eva-router-live.json'),JSON.stringify({status:'skipped_credentials_missing'},null,2));
 await writeFile(resolve(outputDir,'eva-router-live.md'),'No credentials configured.');
 process.exit(0);
}
for(const item of USER_INPUTS){
 if(counts.quotaExceeded)break;
 const started=Date.now();
 const initialCallCount=counts.requests.length;
 try{
  const response=await backend.fetch(new Request('https://canary.invalid/api/chat',{
   method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify(item.request)
  }),{AI:ai,POCKET_EVA_SMART_ROUTER_ENABLED:'1'});
  const body=await response.json();
  const reply=String(body.reply||'');
  const chapters=Array.isArray(body.chapters)?body.chapters:[];
  const displayed=chapters.length?chapters.map((p,i)=>'Capitol '+(i+1)+': '+p.text).join('\n\n'):reply;
  const evidenceType=item.id==='documentary'?'synthetic_encyclopedia_fixture':'none_provided';
  results.push({
   id:item.id,label:item.label,expected_tier:item.expected_tier,
   http_status:response.status,status:body.status,error:body.error||null,
   quality_issue:body.quality||null,reply_words:displayed.split(/\s+/).filter(Boolean).length,
   chapter_count:chapters.length,source_mode:evidenceType,
   actual_model:counts.requests.slice(initialCallCount).at(-1)?.model||body.latency_breakdown?.eva_model_used||null,
   model_calls:counts.requests.slice(initialCallCount).map(call=>({model:call.model,http_status:call.http_status,latency_ms:call.latency_ms})),
   actual_tier:body.latency_breakdown?.eva_tier||null,
   ai_fallback:Boolean(body.latency_breakdown?.eva_fallback_used),
   duration_ms:Date.now()-started,reply:displayed.slice(0,8500)
  });
 }catch(error){
  results.push({id:item.id,label:item.label,expected_tier:item.expected_tier,
   status:'exception',error:String(error?.message||'error').slice(0,120),
   duration_ms:Date.now()-started});
 }
}
const report={
 status:'canary_not_deployed',
 date:new Date().toISOString(),
 note:'Encyclopaedia content in documentary test is synthetic; NOT a real verification of historical sources.',
 request_limit:MAX_CALLS,call_count:counts.total,
 by_model:counts.byModel,quota_exceeded:counts.quotaExceeded,
 actual_requests:counts.requests,results
};
await writeFile(resolve(outputDir,'eva-router-live.json'),JSON.stringify(report,null,2));
let md='# Eva – test de integrare live al routerului AI\n\n';
md+='**Canary izolat, fără activare în producție.**\n\n';
md+='Data: '+report.date+'. Apeluri: '+report.call_count+'/'+MAX_CALLS+'.\n\n';
md+='**Documentarul folosește un extras enciclopedic sintetic pentru a izola integrarea, NU o cercetare online verificată.**\n\n';
md+='| Caz | HTTP | Rezultat | Model | Fallback | Durată |\n|---|---:|---|---|---|---:|\n';
for(const row of results){
 md+='| '+row.id+' | '+(row.http_status??'–')+' | '+(row.error||row.status)+' | '+(row.actual_model||'not reported')+' | '+(row.ai_fallback?'yes':'no')+' | '+row.duration_ms+' ms |\n';
 md+='\n## '+row.label+'\n\n';
 md+='HTTP: '+(row.http_status??'–')+', status: '+row.status+', eroare: '+(row.error||'none')+'\n\n';
 md+=(row.reply||'[No visible reply]')+'\n\n';
}
await writeFile(resolve(outputDir,'eva-router-live.md'),md);
console.log(JSON.stringify({status:report.status,total_calls:report.call_count,quotaExceeded:report.quota_exceeded,results:results.map(x=>({id:x.id,http:x.http_status,status:x.status,error:x.error,words:x.reply_words,chapters:x.chapter_count,model:x.actual_model,duration:x.duration_ms}))}));
