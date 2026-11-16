#!/usr/bin/env node
// Read-only end-to-end Node/HTTP planner parity on a real East Anglia GTFS date.
// Launches two temporary loopback-only HTTP servers, never the live port 8768.
// The only write is a tiny index JSON in the isolated compact-pilot directory.
import {spawnSync} from 'node:child_process';
import {randomBytes} from 'node:crypto';
import {existsSync,lstatSync} from 'node:fs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {openGtfsFeedCatalog} from '../regional_gtfs_catalog.mjs';
import {createRegionalGtfsServer} from '../ro_urban_server.mjs';

const ROOT=fileURLToPath(new URL('../',import.meta.url));
const PROBE=fileURLToPath(new URL('./probe-east-anglia-dated.py',import.meta.url));
const IMPORTER=fileURLToPath(new URL('../gtfs_sqlite_store.py',import.meta.url));
const AUDIT='/home/ubuntu/pocketai-england-audit';
const PILOT='/home/ubuntu/pocketai-england-compact-pilot';
const SNAPSHOT='en-ea.sqlite3';
const MAX_JOURNEYS=4;

function python(argv,timeout=45000) {
 const run=spawnSync('python3',argv,{encoding:'utf8',timeout,maxBuffer:16384,
  env:{PATH:process.env.PATH||'/usr/bin:/bin',PYTHONDONTWRITEBYTECODE:'1'}});
 if(run.error||run.status!==0)throw Error('Python source probe failed: '+(run.error?.code||run.status));
 return run.stdout.trim();
}
function ensurePilotIndex(){
 const snapshot=PILOT+'/'+SNAPSHOT,idx=PILOT+'/en-ea.index.json';
 if(!existsSync(snapshot)||lstatSync(snapshot).isSymbolicLink())throw Error('compact_pilot_snapshot_missing');
 if(!existsSync(idx))python([IMPORTER,'index',snapshot,'en-ea','GB']);
 if(!existsSync(idx)||lstatSync(idx).isSymbolicLink())throw Error('unsafe_compact_pilot_index');
}
function getActualSample(){
 const code=`
import json,sys,runpy
from datetime import date,timedelta
from pathlib import Path
ns=runpy.run_path(sys.argv[1])
with ns['connect_ro'](Path(sys.argv[2])) as con:
 for n in range(7):
  day=(date.fromisoformat(sys.argv[3])+timedelta(days=n)).isoformat()
  active=ns['active_services'](con,day)
  if not active:continue
  sample=ns['find_sample'](con,active)
  if sample:
   print(json.dumps({'date':day,'from':sample['from'],'to':sample['to']}))
   sys.exit(0)
raise SystemExit(3)
`;
 // Alpine's minimal Python image may lack IANA timezone files; Node provides
 // the authoritative Europe/London calendar day without depending on tzdata.
 const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{
  timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'
 }).formatToParts(new Date()).map(x=>[x.type,x.value]));
 const localDate=parts.year+'-'+parts.month+'-'+parts.day;
 const output=python(['-c',code,PROBE,AUDIT+'/'+SNAPSHOT,localDate],60000);
 return JSON.parse(output);
}
function oneRegionCatalog(directory){
 const c=openGtfsFeedCatalog(directory,{country:'GB'});
 if(c.count<1)throw Error('catalog_no_indexed_feeds:'+directory);
 return {count:1,match:(from,to,radius)=>c.match(from,to,radius,3)
   .filter(entry=>entry.region==='en-ea').slice(0,1)};
}
function canonicalJourneys(data){
 const journeys=Array.isArray(data.journeys)?data.journeys:[];
 return JSON.stringify({status:data.status,time_zone:data.time_zone||null,
  schedule_only:data.schedule_only||false,real_time:data.real_time??null,
  journeys:journeys.map(x=>JSON.stringify(x)).sort()});
}
export function sameHttpJourneys(first,second){
 if(first.http!==second.http)throw Error('HTTP_STATUS_DIFFERENCE');
 if(canonicalJourneys(first.data)!==canonicalJourneys(second.data))
  throw Error('PLANNED_JOURNEYS_DIFFER');
 return {equal:true,http:first.http,status:first.data.status,
  journeyCount:Array.isArray(first.data.journeys)?first.data.journeys.length:0};
}
async function ask(catalog,body,token){
 const server=createRegionalGtfsServer({token,catalog,country:'GB'});
 await new Promise((resolve,reject)=>{
  server.once('error',reject);
  server.listen(0,'127.0.0.1',resolve);
 });
 try{
  const url='http://127.0.0.1:'+server.address().port+'/v1/plan';
  const start=performance.now();
  const response=await fetch(url,{method:'POST',headers:{
    'Content-Type':'application/json',Authorization:'Bearer '+token},
    body:JSON.stringify(body),signal:AbortSignal.timeout(30000)});
  return {http:response.status,data:await response.json(),ms:Math.round((performance.now()-start)*10)/10};
 } finally {
  await new Promise(resolve=>server.close(resolve));
 }
}
export async function runActualHttpParity(){
 if(process.getuid?.()===0)throw Error('must_run_unprivileged');
 if(!existsSync(AUDIT+'/'+SNAPSHOT)||lstatSync(AUDIT+'/'+SNAPSHOT).isSymbolicLink())
  throw Error('audit_original_missing');
 ensurePilotIndex();
 const sample=getActualSample();
 const original=oneRegionCatalog(AUDIT),compact=oneRegionCatalog(PILOT);
 const body={region:'england',from:sample.from,to:sample.to,
   date:sample.date,afterHHMM:'00:00',maxResults:MAX_JOURNEYS,
   maxStraightLineMeters:150};
 if(original.match(sample.from,sample.to,150).length!==1||
    compact.match(sample.from,sample.to,150).length!==1)
  throw Error('sample_not_matched_to_both_region_indexes');
 const token=randomBytes(32).toString('hex');
 const a=await ask(original,body,token);
 const b=await ask(compact,body,token);
 const comparison=sameHttpJourneys(a,b);
 return {status:comparison.status==='success'&&comparison.journeyCount>0?
    'REAL_HTTP_JOURNEYS_IDENTICAL':'HTTP_PARITY_ONLY_NO_SCHEDULED_JOURNEY',
    date:sample.date,http:comparison.http,planner_status:comparison.status,
    journeys:comparison.journeyCount,
    original_http_ms:a.ms,compact_http_ms:b.ms,
    same_journeys:comparison.equal,
    sample_count:1,not_live:true,
    note:'One real dated sample only; no production deployment or VPC change.'};
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===resolve(process.argv[1])){
 runActualHttpParity().then(x=>{
  console.log(JSON.stringify(x,null,2));
  if(x.status!=='REAL_HTTP_JOURNEYS_IDENTICAL')process.exitCode=2;
 }).catch(err=>{
  console.error('TEST_FAILED:',String(err?.message||'unexpected').slice(0,120));
  process.exitCode=1;
 });
}
