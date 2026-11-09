import assert from 'node:assert/strict';
import {planUKNationalJourney,planTransCAPIJourney,transCAPIPlanningZone,transCAPISharedZone} from './uk_national_transit.mjs';

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
 assert.equal(valid.journeys[0].boarding_stop?.label,'Grays station');
 assert.equal(valid.journeys[0].boarding_stop?.latitude,51.476);
 assert.equal(valid.journeys[0].boarding_stop?.longitude,0.321);
 assert.equal(valid.journeys[0].safetyMarginMinutes,5);
 assert.ok(calls[0].url.pathname.endsWith('/v1/journey.json'));
 assert.equal(calls[0].url.searchParams.get('limit'),'4');
 assert.equal(calls[0].init.headers['X-Api-Key'],'test-key');
 assert.equal(await planUKNationalJourney({TRANSCAPI_API_KEY:'test-key'},from,{latitude:44,longitude:12}).then(r=>r.status),'outside_coverage');
 // Independent planning areas: the same key works in Ireland and NL+BE,
 // but there is no claimed UK→Dublin or London→Brussels through service.
 const dublin={latitude:53.3498,longitude:-6.2603};
 const belfast={latitude:54.5973,longitude:-5.9301};
 const amsterdam={latitude:52.3676,longitude:4.9041};
 const brussels={latitude:50.8503,longitude:4.3517};
 assert.equal(transCAPIPlanningZone(from),'gb');
 assert.equal(transCAPIPlanningZone(dublin),'ireland');
 assert.equal(transCAPIPlanningZone(belfast),'ireland');
 assert.equal(transCAPIPlanningZone(amsterdam),'benelux');
 assert.equal(transCAPIPlanningZone(brussels),'benelux');
 assert.equal(transCAPISharedZone(belfast,dublin),'ireland');
 assert.equal(transCAPISharedZone(amsterdam,brussels),'benelux');
 assert.equal(transCAPISharedZone(from,dublin),null);
 assert.equal(transCAPISharedZone(from,brussels),null);
 calls.length=0;
 assert.equal((await planTransCAPIJourney({TRANSCAPI_API_KEY:'test-key'},from,dublin)).status,'outside_coverage');
 assert.equal(calls.length,0,'Cross-area journeys must not consume a quota request');
 // Regional mocked responses: local-time labels and no invented GBP fare.
 globalThis.fetch=async (input,init)=>{
  const url=new URL(input);calls.push({url,init});
  const irish=url.searchParams.get('from_lon')==='-5.9301';
  const origin=irish?'Belfast':'Amsterdam',dest=irish?'Dublin':'Brussels';
  return Response.json({
   timezone:irish?'Europe/Dublin':'Europe/Amsterdam',
   itineraries:[{start_time:at(12),end_time:at(237),fare:null,
    legs:[
     {mode:'WALK',duration_s:600,from:{name:origin},to:{name:origin+' station'}},
     {mode:irish?'TRAM':'RAIL',route:{line:'R2',operator:'Mock regional operator'},
      from:{name:origin+' station'},to:{name:dest+' station'},
      start_time:{scheduled:at(27)},end_time:{scheduled:at(222)},
      fare_local:irish?{currency:'EUR',amount:2}:null},
     {mode:'WALK',duration_s:900,from:{name:dest+' station'},to:{name:dest}}
    ]
   }]
  });
 };
 const ireland=await planTransCAPIJourney({TRANSCAPI_API_KEY:'test-key'},belfast,dublin);
 assert.equal(ireland.status,'success');
 assert.equal(ireland.journeys[0].region,'ireland');
 assert.equal(ireland.journeys[0].time_zone,'Europe/Dublin');
 assert.equal(ireland.journeys[0].fareGBP,null);
 assert.deepEqual(ireland.journeys[0].legs[1].fareLocal,{currency:'EUR',amount:2});
 const benelux=await planTransCAPIJourney({TRANSCAPI_API_KEY:'test-key'},amsterdam,brussels);
 assert.equal(benelux.status,'success');
 assert.equal(benelux.journeys[0].region,'benelux');
 assert.equal(benelux.journeys[0].time_zone,'Europe/Amsterdam');
 assert.equal(benelux.journeys[0].fareGBP,null);
 assert.equal(benelux.journeys[0].legs.at(-1).to,'Brussels');
 globalThis.fetch=async()=>new Response('{}',{status:429});
 assert.equal((await planUKNationalJourney({TRANSCAPI_API_KEY:'test-key'},from,to)).status,'quota_exceeded');
 console.log('PASS: GB/Ireland/Benelux regional transit, no-key, times, fares, cancellations, quota and cross-zone safety');
}finally{globalThis.fetch=originalFetch}
