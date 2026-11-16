#!/usr/bin/env node
// Nine-region combined real HTTP planning on a separate private candidate.
// This script does not contact the live England container or modify files.
import {spawnSync} from 'node:child_process';
import {randomBytes} from 'node:crypto';
import {existsSync,lstatSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {openGtfsFeedCatalog} from '../regional_gtfs_catalog.mjs';
import {createRegionalGtfsServer} from '../ro_urban_server.mjs';

export const REGIONS=Object.freeze([
 'en-ea','en-em','en-ne','en-nw','en-se','en-sw',
 'en-wm','en-yorkshire','en-london'
]);
const FEEDS='/data/feeds';
const SAMPLE=fileURLToPath(new URL('./probe-east-anglia-dated.py',import.meta.url));

function ukDay(){
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{
  timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'
 }).formatToParts(new Date()).map(x=>[x.type,x.value]));
 return parts.year+'-'+parts.month+'-'+parts.day;
}
function selectVerifiedSample(region,today){
 const py=[
 'import json,runpy,sys',
 'from datetime import date,timedelta',
 'from pathlib import Path',
 'ns=runpy.run_path(sys.argv[1])',
 'db=Path(sys.argv[2])',
 "with ns['connect_ro'](db) as con:",
 ' for n in range(7):',
 "  d=(date.fromisoformat(sys.argv[3])+timedelta(days=n)).isoformat()",
 "  active=ns['active_services'](con,d)",
 '  if not active:continue',
 "  sample=ns['find_sample'](con,active)",
 '  if sample:',
 "   print(json.dumps({'date':d,'from':sample['from'],'to':sample['to']}))",
 '   sys.exit(0)',
 'raise SystemExit(3)'
 ].join('\n');
 const file=FEEDS+'/'+region+'.sqlite3';
 const run=spawnSync('python3',['-c',py,SAMPLE,file,today],{
  encoding:'utf8',timeout:75000,maxBuffer:8192,
  env:{PATH:process.env.PATH||'/usr/bin:/bin',PYTHONDONTWRITEBYTECODE:'1'}
 });
 if(run.error||run.status!==0)throw Error('missing_current_dated_sample:'+region);
 return JSON.parse(run.stdout.trim());
}
export function verifyHttpResult(region,matched,response,body){
 if(!REGIONS.includes(region))throw Error('invalid_region');
 if(!matched.some(x=>x.region===region))throw Error('region_not_selected:'+region);
 if(response.status!==200||body.status!=='success'||!Array.isArray(body.journeys)||
    body.journeys.length<1)throw Error('region_has_no_verified_journeys:'+region);
 return {region,journeys:body.journeys.length,status:'success',http:200};
}
export async function checkAllCandidateFeeds(){
 if(process.getuid?.()!==10001)throw Error('unexpected_test_uid');
 for(const region of REGIONS){
  for(const ext of ['sqlite3','index.json']){
   const p=FEEDS+'/'+region+'.'+ext;
   if(!existsSync(p)||lstatSync(p).isSymbolicLink())throw Error('missing_or_symlink_candidate:'+region);
  }
 }
 const catalog=openGtfsFeedCatalog(FEEDS,{country:'GB'});
 if(catalog.count!==9)throw Error('not_all_nine_feeds_indexed');
 const token=randomBytes(32).toString('hex');
 const server=createRegionalGtfsServer({token,catalog,country:'GB'});
 await new Promise((ok,fail)=>{
  server.once('error',fail);
  server.listen(0,'127.0.0.1',ok);
 });
 const endpoint='http://127.0.0.1:'+server.address().port;
 const results=[];
 try{
  const health=await fetch(endpoint+'/healthz',{signal:AbortSignal.timeout(10000)});
  if(health.status!==200)throw Error('temporary_server_health_failed');
  const unauth=await fetch(endpoint+'/v1/plan',{method:'POST',headers:{
    'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(10000)});
  if(unauth.status!==401)throw Error('private_planner_authentication_failed');
  const today=ukDay();
  for(const region of REGIONS){
   const sample=selectVerifiedSample(region,today);
   const nearby=catalog.match(sample.from,sample.to,150,3);
   const payload={region:'england',from:sample.from,to:sample.to,
     date:sample.date,afterHHMM:'00:00',maxResults:4,
     maxStraightLineMeters:150};
   const start=performance.now();
   const response=await fetch(endpoint+'/v1/plan',{
    method:'POST',headers:{
     Authorization:'Bearer '+token,'Content-Type':'application/json'},
    body:JSON.stringify(payload),signal:AbortSignal.timeout(60000)
   });
   const data=await response.json();
   const checked=verifyHttpResult(region,nearby,response,data);
   results.push({...checked,date:sample.date,
      matched_regional_feeds:nearby.length,
      request_ms:Math.round((performance.now()-start)*10)/10});
  }
 } finally{
  await new Promise(ok=>server.close(ok));
 }
 return {status:'NINE_REGION_SINGLE_SERVER_SMOKE_PASSED',
    total_regions:catalog.count,dated_journeys:results.reduce((a,r)=>a+r.journeys,0),
    unauthenticated_requests_rejected:true,
    all_tests_localhost_only:true,live_container_unchanged:true,
    not_live:true,regions:results};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
 checkAllCandidateFeeds().then(report=>console.log(JSON.stringify(report,null,2)))
 .catch(error=>{console.error('CANDIDATE_SMOKE_FAILED:',
     String(error?.message||'unexpected_error').slice(0,160));process.exitCode=1;});
}
