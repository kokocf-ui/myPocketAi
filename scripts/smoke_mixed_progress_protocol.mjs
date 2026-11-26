// Owner-authorized release protocol check. Invalid empty message deliberately
// returns before any AI, geography, search or transport provider is invoked.
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
if(!process.argv.includes('--allow-network')){
 console.log('Not run: --allow-network is required.');
}else{
 const endpoint='https://lifewise-ai-v2.kokocf.workers.dev/api/chat';
 const started=Date.now();
 const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},
  body:JSON.stringify({message:'',module:'maps',language:'ro',mixed_journey:true,mixed_progressive:true}),
  signal:AbortSignal.timeout(20000)});
 assert.equal(response.status,200);assert.match(response.headers.get('content-type')||'',/application\/x-ndjson/);
 const events=(await response.text()).trim().split('\n').map(line=>JSON.parse(line));
 assert.equal(events[0].type,'started');
 const final=events.find(e=>e.type==='result');assert.ok(final);assert.equal(final.status,400);
 assert.equal(final.data.version,'v187');assert.match(final.data.error,/Mesaj invalid/);
 assert.equal(events.filter(e=>e.type==='progress').length,0,'Invalid input must not start provider discovery');
 const report={status:'pass',endpoint,version:final.data.version,event_types:events.map(e=>e.type),
  validation_status:final.status,elapsed_ms:Date.now()-started,provider_search_requested:false};
 writeFileSync('mixed-progress-live-smoke.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}
