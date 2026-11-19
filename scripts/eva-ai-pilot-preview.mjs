// Start a temporary Wrangler preview with an AI binding, compare synthetic
// prompts via localhost, then shut it down. Does not deploy a production Worker.
import {spawn} from 'node:child_process';
import {randomBytes} from 'node:crypto';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {runPilot,markdownReport,MAX_LIVE_CALLS} from '../eva_ai_model_pilot.mjs';
const outputDir=resolve('reports');
await mkdir(outputDir,{recursive:true});
async function save(obj){
 await writeFile(resolve(outputDir,'eva-ai-model-pilot.json'),JSON.stringify(obj,null,2));
 await writeFile(resolve(outputDir,'eva-ai-model-pilot.md'),
  obj.status==='pilot_only_not_deployed'?markdownReport(obj):
  '# Eva AI remote preview\n\nStatus: '+obj.status+'\n\n'+(obj.reason||'No model responses.')+'\n');
}
if(!process.env.CLOUDFLARE_API_TOKEN||!process.env.CLOUDFLARE_ACCOUNT_ID){
 await save({status:'skipped_credentials_missing',reason:'Cloudflare deployment credentials unavailable'});
 console.log('SKIPPED: no Cloudflare deploy credentials');
 process.exit(0);
}
const port=18789;
const secret=randomBytes(24).toString('hex');
const executable=resolve('node_modules/.bin/wrangler');
const args=['dev','--remote','--config','wrangler-eva-ai-pilot.toml',
 '--ip','127.0.0.1','--port',String(port),'--var','PILOT_SECRET:'+secret];
const worker=spawn(executable,args,{
 stdio:['ignore','pipe','pipe'],
 env:{...process.env,CI:'true',WRANGLER_SEND_METRICS:'false'}
});
let stopped=false,exitCode=null,lines=0;
worker.on('exit',code=>{stopped=true;exitCode=code});
for(const stream of [worker.stdout,worker.stderr]){
 stream.on('data',d=>{lines+=String(d).split('\n').length;});
}
let ready=false,hasAiBinding=false;
const healthUrl='http://127.0.0.1:'+port+'/health';
try{
 const deadline=Date.now()+85000;
 while(Date.now()<deadline&&!stopped){
  try{
   const response=await fetch(healthUrl,{signal:AbortSignal.timeout(2000)});
   const data=await response.json().catch(()=>({}));
   if(response.ok&&data.ok){ready=true;hasAiBinding=data.ai_binding===true;break;}
  }catch{}
  await new Promise(r=>setTimeout(r,1200));
 }
 if(!ready||!hasAiBinding){
  await save({status:'preview_unavailable',
   reason:stopped?'Wrangler preview terminated (exit '+exitCode+')':
    !ready?'Wrangler preview did not start':'AI binding unavailable',
   diagnostic_lines_observed:lines});
  console.log('PREVIEW UNAVAILABLE; no model inference calls executed.');
 }else{
  const fetchRelay=async (url,options)=>{
   const original=new URL(url);
   const model=decodeURIComponent(original.pathname.split('/ai/run/')[1]||'');
   const request=JSON.parse(options.body);
   const payload={
    model,
    system:request.messages?.find(x=>x.role==='system')?.content||'',
    user:request.messages?.find(x=>x.role==='user')?.content||'',
    max_tokens:request.max_tokens,temperature:request.temperature
   };
   return fetch('http://127.0.0.1:'+port+'/infer',{
    method:'POST',headers:{'Content-Type':'application/json','X-Eva-Pilot':secret},
    body:JSON.stringify(payload),signal:options.signal
   });
  };
  const result=await runPilot({
   accountId:'relay',apiToken:'ephemeral-not-sent-to-cloudflare',
   fetchImpl:fetchRelay,timeoutMs:70000,maxCalls:MAX_LIVE_CALLS
  });
  result.transport='isolated_wranger_remote_preview_ai_binding';
  await save(result);
  console.log(JSON.stringify({status:result.status,calls:result.actual_calls,
   successes:result.results.filter(x=>x.status==='success').length,
   errors:result.results.filter(x=>x.status==='error').map(x=>x.reason)}));
 }
}catch(error){
 await save({status:'preview_error',reason:error?.name||'unknown_error'});
 console.log('PREVIEW ERROR: '+String(error?.name||'unknown_error'));
}finally{
 worker.kill('SIGTERM');
 setTimeout(()=>{if(!stopped)worker.kill('SIGKILL')},1000).unref();
}
