#!/usr/bin/env node
// Repeated original-vs-compact real HTTP parity; 5 independent calls.
// No live ports or services are used. Only digests, not user locations, are printed.
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {ALLOWED_REGIONS,runActualHttpParity} from './probe-east-anglia-http.mjs';

export function checkStableResults(results) {
 if(!Array.isArray(results)||results.length<2)throw Error('not_enough_repeats');
 const base=results[0];
 if(base.status!=='REAL_HTTP_JOURNEYS_IDENTICAL'||base.http!==200||
  !base.journey_digest||base.journeys<1)throw Error('first_run_not_verified');
 for(let i=1;i<results.length;i++){
  const r=results[i];
  if(r.status!=='REAL_HTTP_JOURNEYS_IDENTICAL'||r.http!==200||
   r.journeys!==base.journeys||r.date!==base.date||
   r.journey_digest!==base.journey_digest||r.same_journeys!==true)
    throw Error('different_http_journeys_on_repeat_'+(i+1));
 }
 return {status:'REPEATED_REAL_HTTP_JOURNEYS_IDENTICAL',region:base.region,
  date:base.date,http:200,journeys:base.journeys,
  repeats:results.length,same_journeys_all_runs:true,
  journey_digest:base.journey_digest,
  original_http_ms:results.map(x=>x.original_http_ms),
  compact_http_ms:results.map(x=>x.compact_http_ms),
  not_live:true};
}
async function main(){
 const args=process.argv.slice(2);
 if(args.length!==4||args[0]!=='--region'||!ALLOWED_REGIONS.includes(args[1])||
  args[2]!=='--repeats')throw Error('invalid_repeated_test_arguments');
 const repeats=Number(args[3]);
 if(!Number.isInteger(repeats)||repeats<2||repeats>5)
  throw Error('repeats_out_of_bounds');
 const results=[];
 for(let i=0;i<repeats;i++){
  const out=await runActualHttpParity(args[1]);
  if(out.status!=='REAL_HTTP_JOURNEYS_IDENTICAL')
   throw Error('http_parity_failed_on_repeat_'+(i+1));
  results.push(out);
 }
 console.log(JSON.stringify(checkStableResults(results),null,2));
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
 main().catch(error=>{
  console.error('REPEAT_CHECK_FAILED: '+String(error?.message||'unexpected').slice(0,140));
  process.exitCode=1;
 });
}
