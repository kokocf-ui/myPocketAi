// Opt-in live benchmark: node tests_live_latency.mjs
// Does not run on push/CI because API calls have cost and may be slow.
import assert from 'node:assert/strict';
const url=process.env.POCKET_AI_API_URL||'https://lifewise-ai-api.kokocf.workers.dev/api/chat';
const timeoutMs=Number(process.env.POCKET_AI_TEST_TIMEOUT_MS||45000);
const prompts=[
 ['evenimente-scurt','Ce evenimente sunt organizate în Oradea în decembrie 2026?'],
 ['evenimente-format','Ce evenimente sunt organizate în Oradea în decembrie 2026? Prezintă-le cronologic, cu date și locații.'],
 ['reteta','Cum se prepară sarmalele românești tradiționale? Precizează ingredientele și timpul de preparare.'],
 ['ciorba','Rețetă tradițională de ciorbă de burtă românească, cu ingrediente și pași de preparare.']
];
const repeats=Math.max(1,Math.min(5,Number(process.env.POCKET_AI_TEST_REPEATS||2)));
const metrics=[];
for(let i=0;i<repeats;i++)for(const [name,message] of prompts){
 const start=performance.now();let entry={case:name,round:i+1};
 try{
  const response=await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message,language:'ro',history:[],module:'assistant'}),signal:AbortSignal.timeout(timeoutMs)});
  const data=await response.json();
  entry={...entry,http:response.status,wall_ms:Math.round(performance.now()-start),research_ms:data.research_elapsed_ms??null,ai_ms:data.ai_execution_ms??null,backend_version:data.version??null,server_total_ms:data.server_total_ms??null,latency_breakdown:data.latency_breakdown??null,provider_timings:data.web_search_diagnostics?.providers??null,search_pending:data.web_search_diagnostics?.pendingProviderCount??null,event_count:data.structured_list?.type==='events'?(data.structured_list.rows?.length??0):null,web_status:data.web_search_status??null,success:response.ok&&data.status==='success'&&!!data.reply};
  if(name==='ciorba')entry.invalid_pork_belly=/burt[aă]\s+de\s+porc/i.test(String(data.reply||''));
  if(entry.event_count!==null){
   const names=(data.structured_list.rows||[]).map(r=>String(r.description||'').toLowerCase().replace(/\\s+/g,' ').trim());
   entry.event_names=names;
  }
 }catch(error){entry={...entry,wall_ms:Math.round(performance.now()-start),success:false,error:String(error?.message||error)}}
 metrics.push(entry);console.log(JSON.stringify(entry));
}
const valid=metrics.filter(x=>x.success);
const values=valid.map(x=>x.wall_ms).sort((a,b)=>a-b);
const percentile=p=>values.length?values[Math.ceil(values.length*p)-1]:null;
console.log(JSON.stringify({summary:{total:metrics.length,successful:valid.length,p50_ms:percentile(.5),p95_ms:percentile(.95),above_10000_ms:valid.filter(x=>x.wall_ms>10000).length,above_25000_ms:valid.filter(x=>x.wall_ms>25000).length}},null,2));
assert.ok(valid.length===metrics.length,'Some live requests failed');
if(process.env.POCKET_AI_MAX_P95_MS)assert.ok(percentile(.95)<=Number(process.env.POCKET_AI_MAX_P95_MS),'p95 exceeded configured budget');
