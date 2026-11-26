// Owner-authorized read-only public Worker probes. No provider keys are read,
// exported or logged. Coordinates are test inputs, not a claim of device presence.
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const endpoint='https://lifewise-ai-api.kokocf.workers.dev/api/chat';
export function validateJourneyResponse(data,country){
 assert.equal(data.version,'v186');assert.equal(data.country_code,country);
 assert.equal(data.transit_provider,'Digitransit');assert.equal(data.transit_available,true);
 assert.equal(data.international_journey,false);assert.equal(data.mixed_journey,false);
 assert.ok(data.transit?.length>0);
 for(const j of data.transit){
  assert.equal(j.country_code,country);assert.equal(j.stop_countries_verified,true);
  assert.equal(j.time_zone,country==='FI'?'Europe/Helsinki':'Europe/Tallinn');
  assert.ok(j.legs?.some(l=>l.mode!=='walking'));
  assert.ok(Date.parse(j.arrivalDateTime)>=Date.parse(j.startDateTime));
  assert.match(j.attribution?.text||'',/Digitransit.*CC BY 4\.0/);
  assert.ok(Number.isFinite(Date.parse(j.attribution.received_at)));
 }
}
export async function runSmoke(fetcher=fetch){
 const fi={latitude:60.171,longitude:24.941},ee={latitude:59.439,longitude:24.737};
 const cases=[
  {id:'helsinki-local',country:'FI',from:fi,to:{latitude:60.178,longitude:24.95}},
  {id:'helsinki-tampere-intercity',country:'FI',from:fi,to:{latitude:61.498,longitude:23.773}},
  {id:'tallinn-local',country:'EE',from:ee,to:{latitude:59.437,longitude:24.755}},
  {id:'tallinn-tartu-intercity',country:'EE',from:ee,to:{latitude:58.373,longitude:26.707}},
  {id:'finland-estonia-rejected',country:'FI',from:fi,to:ee,rejected:true}
 ];
 const report={checked_at:new Date().toISOString(),endpoint,live_requests:true,status:'running',countrywide_coverage_verified:false,physical_navigation_verified:false,results:[]};
 const save=()=>writeFileSync('digitransit-worker-live-smoke.json',JSON.stringify(report,null,2)+'\n');
 const at=new Date();at.setUTCDate(at.getUTCDate()+1);at.setUTCHours(8,0,0,0);
 const ask=async body=>{
  const response=await fetcher(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(60000)});
  assert.equal(response.status,200);return response.json();
 };
 for(const c of cases){
  const row={id:c.id,country:c.country,status:'failed'};report.results.push(row);
  try{
   const d=await ask({message:'Transport public către destinație',language:'ro',module:'maps',national_public_transport:true,
    location:{...c.from,accuracy:20,updatedAt:Date.now()},transit_destination:{...c.to,label:c.id},
    transit_departure_at:at.toISOString(),transit_count:3});
   // Whitelist diagnostic metadata only; never dump arbitrary response bodies.
   Object.assign(row,{version:d.version,reason:d.reason,provider_status:d.provider_status,itineraries:d.transit?.length||0});
   if(c.rejected){assert.equal(d.reason,'international_destination');assert.equal(d.transit_available,false);}
   else {validateJourneyResponse(d,c.country);row.modes=[...new Set(d.transit.flatMap(j=>j.legs.map(l=>l.mode)))];}
   row.status='pass';
  }catch(e){row.error=e?.code==='ERR_ASSERTION'?'response_contract_assertion_failed':'request_failed';}
  if(process.env.GITHUB_ACTIONS==='true')console.log('::notice title=Digitransit live probe::'+JSON.stringify(row));
  save();
 }
 report.status=report.results.every(r=>r.status==='pass')?'live_smoke_pass':'live_smoke_incomplete';save();
 console.log(JSON.stringify(report,null,2));return report;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 if(!process.argv.includes('--allow-network'))console.log('Not run: explicit --allow-network is required.');
 else {const report=await runSmoke();if(report.status!=='live_smoke_pass')process.exitCode=1;}
}
