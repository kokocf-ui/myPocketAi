import assert from 'node:assert/strict';
import {planUKNationalJourney} from './uk_national_transit.mjs';

const originalFetch=globalThis.fetch;
const from={latitude:51.478,longitude:0.283},to={latitude:53.478,longitude:-2.233};
const now=Date.now(),at=m=>new Date(now+m*60000).toISOString();
const build=(offset=0,opts={})=>({
 start_time:at(12+offset),end_time:at(237+offset),
 fare:{amount_gbp:65.40,complete:false},
 legs:[
  {mode:'WALK',from:{name:'Start',latitude:from.latitude,longitude:from.longitude},to:{name:'Grays station',latitude:51.476,longitude:0.321},duration_s:600},
  {mode:'RAIL',from:{name:'Grays station'},to:{name:'Manchester Piccadilly'},
   route:{line:'R1',operator:'Test railway'},start_time:{scheduled:at(27+offset),estimated:at(27+offset)},
   end_time:opts.missingArrival?undefined:{scheduled:at(222+offset)},status:opts.cancelled?'cancelled':'on_time',real_time:true},
  {mode:'WALK',from:{name:'Manchester Piccadilly'},to:{name:'Vale Lane'},duration_s:900}
 ]
});
const calls=[];
globalThis.fetch=async (input,init)=>{
 const url=new URL(input);calls.push({url,init});
 return Response.json({itineraries:[build(0),build(30),build(35,{missingArrival:true}),build(40,{cancelled:true})],next_available:false});
};
try{
 const unconfigured=await planUKNationalJourney({},from,to);
 assert.equal(unconfigured.status,'not_configured');
 assert.equal(calls.length,0,'No external call without an API key');
 const valid=await planUKNationalJourney({TRANSCAPI_API_KEY:'test-key'},from,to,4);
 assert.equal(valid.status,'success');
 assert.equal(valid.journeys.length,2,'Keep two distinct departures and reject unverified/cancelled trips');
 assert.equal(valid.journeys[0].legs.length,3);
 assert.equal(valid.journeys[0].legs[0].mode,'walking');
 assert.equal(valid.journeys[0].legs[1].mode,'national-rail');
 assert.equal(valid.journeys[0].legs[2].to,'Vale Lane');
 assert.equal(valid.journeys[0].fareComplete,false);
 assert.equal(valid.journeys[0].geometryAvailable,false,'Never manufacture map geometry');
 assert.equal(valid.journeys[0].walkToFirstStopMinutes,10);
 assert.ok(calls[0].url.pathname.endsWith('/v1/journey.json'));
 assert.equal(calls[0].url.searchParams.get('limit'),'4');
 assert.equal(calls[0].init.headers['X-Api-Key'],'test-key');
 assert.equal(await planUKNationalJourney({TRANSCAPI_API_KEY:'test-key'},from,{latitude:44,longitude:12}).then(r=>r.status),'outside_coverage');
 globalThis.fetch=async()=>new Response('{}',{status:429});
 assert.equal((await planUKNationalJourney({TRANSCAPI_API_KEY:'test-key'},from,to)).status,'quota_exceeded');
 console.log('PASS: UK national door-to-door routing, no-key behavior, timetable checks, cancellations, and quota limit');
}finally{globalThis.fetch=originalFetch}
