import assert from 'node:assert/strict';
import worker from './backend.js';

// One real backend transport dispatch for three UI entry points: Deplasare
// spre…, Transport public and Eva. Do not add or invoke a third planner.
// Provider selection must be geographic, not dependent on module name.
const original=globalThis.fetch;
let calls=[];
const origin={latitude:51.479,longitude:0.291,accuracy:20,updatedAt:Date.now()};
const destination={latitude:51.495812,longitude:-0.143826,label:'Victoria Underground Station',country_code:'GB'};
const after=m=>new Date(Date.now()+m*60000).toISOString();
globalThis.fetch=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));
 calls.push({host:u.hostname,path:u.pathname});
 if(u.hostname==='api.tfl.gov.uk'&&u.pathname.includes('/Journey/JourneyResults/')){
  assert.match(u.pathname,/\/to\/51\.495812,-0\.143826/);
  return Response.json({journeys:[{
   duration:70,startDateTime:after(30),arrivalDateTime:after(100),
   legs:[
    {mode:{name:'walking'},duration:6,departureTime:after(30),arrivalTime:after(36),
     departurePoint:{commonName:'Start',lat:origin.latitude,lon:origin.longitude},
     arrivalPoint:{commonName:'Chafford Hundred',lat:51.485,lon:0.285}},
    {mode:{name:'national-rail'},duration:57,departureTime:after(41),arrivalTime:after(98),
     departurePoint:{commonName:'Chafford Hundred',lat:51.485,lon:0.285},
     arrivalPoint:{commonName:'Victoria',lat:destination.latitude,lon:destination.longitude}},
    {mode:{name:'walking'},duration:2,departureTime:after(98),arrivalTime:after(100),
     departurePoint:{commonName:'Victoria',lat:destination.latitude,lon:destination.longitude},
     arrivalPoint:{commonName:'Victoria Underground Station',lat:destination.latitude,lon:destination.longitude}}
   ]
  }]});
 }
 throw Error('Unexpected route provider '+u.hostname+u.pathname);
};
const run=async(module,mixed_journey)=>{
 const response=await worker.fetch(new Request('https://test.example/api/chat',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({
   message:'Cum ajung la Victoria cu transportul public?',
   module,language:'ro',location:origin,history:[],
   transit_destination:destination,transit_query:'Victoria',
   ...(mixed_journey?{mixed_journey:true}: {})
  })
 }),{TFL_APP_KEY:'mock-key',AI:{run:async()=>{throw Error('Transport must not call AI')}}});
 assert.equal(response.status,200);
 const result=await response.json();
 assert.equal(result.transit_available,true,JSON.stringify(result).slice(0,850));
 assert.equal(result.transit_provider,'TfL');
 assert.equal(result.transit.length,1);
 assert.equal(result.diagnostics.tflChecks.finalAccepted,1);
 return {provider:result.transit_provider,firstStop:result.transit[0].legs[0].from,
  lastStop:result.transit[0].legs.at(-1).to};
};
try{
 const results=[
  await run('maps',false),await run('assistant',false),
  await run('travel',true)
 ];
 assert.deepEqual(results[0],results[1]);
 assert.deepEqual(results[1],results[2]);
 assert.ok(calls.every(c=>c.host==='api.tfl.gov.uk'));
 console.log('PASS: all three UI modules use the same backend transit provider and result policy');
}finally{globalThis.fetch=original}
