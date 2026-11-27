// Offline re-validation of previously recorded PUBLIC SYNTHETIC responses.
// Never a new provider request and never a claim these times were re-fetched.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {composeOpenSurfaceOption} from '../mixed_open_surface.mjs';
const [input,output]=process.argv.slice(2),report=JSON.parse(readFileSync(input,'utf8'));
const origin={latitude:51.475,longitude:.325,label:'Public synthetic origin near Grays',country_code:'GB'};
const destination={latitude:47.0612,longitude:21.9473,label:'Public synthetic final point in Oradea',country_code:'RO'};
const departureAt=report.planned.requestedAt;
globalThis.fetch=async()=>{throw Error('Offline replay must not call a provider')};
const options=report.result?.scheduled_surface_options||[];
assert.ok(options.length,'Recorded source/local responses required');
const results=options.map(option=>{
 const result=composeOpenSurfaceOption(option,{origin,destination,departureAt});
 const record={status:result.status,complete:!!result.journey,sourceSha256:report.sourceSha256,
  accessVerified:option.accessVerified,egressVerified:option.egressVerified,journey:result.journey,
  previousLiveComplete:option.completeDoorToDoor};
 if(result.journey){
  // Boundary margins must remain intact. This fix only reuses a provider's
  // own validated intra-itinerary connections, not separate-ticket transfers.
  const a=Date.parse(option.accessJourney.arrivalDateTime),b=Date.parse(option.legs[0].departureTime);
  assert.ok(b-a>=15*60000);
  for(let i=1;i<option.legs.length;i++){
   assert.equal(option.legs[i-1].toStopId,option.legs[i].fromStopId);
   assert.ok(Date.parse(option.legs[i].departureTime)-Date.parse(option.legs[i-1].arrivalTime)>=45*60000);
  }
  assert.equal(result.journey.fareComplete,false);
  assert.equal(result.journey.transferProtectionVerified,false);
  const wrong=structuredClone(option);wrong.egressJourney.startDateTime='2026-11-27T12:00:00Z';
  assert.equal(composeOpenSurfaceOption(wrong,{origin,destination,departureAt}).journey,null,'Wrong-day egress must still be refused');
 }
 return record;
});
writeFileSync(output,JSON.stringify({offlineReplay:true,newProviderRequests:0,recordedSourceSha256:report.sourceSha256,results},null,2));
const summary=results.map(r=>({...r,journey:r.journey?{start:r.journey.startDateTime,arrival:r.journey.arrivalDateTime,legCount:r.journey.legs.length,
 modes:r.journey.modeSignature,fareComplete:r.journey.fareComplete,transferProtectionVerified:r.journey.transferProtectionVerified,
 walkingEstimated:r.journey.legs.filter(l=>l.timingEstimated).length}:null}));
console.log('::notice title=open-surface-offline-replay::'+JSON.stringify({offlineReplay:true,newProviderRequests:0,results:summary}).replace(/%/g,'%25'));
assert.ok(results.some(r=>r.complete),'Recorded provider responses still do not compose; do not claim full journey');
