// Actual ordinary Worker delegation, not only shared-adapter URL checks.
import assert from 'node:assert/strict';
import worker from './backend.js';
import {createMixedLocalPlanner} from './mixed_local_planner.mjs';
import {normalizeTfLInstant} from './tfl_shared_journeys.mjs';
import {tflJourneyCoordinates} from './tfl_journey_geometry.mjs';
import {compactJourney,journeyAnchoredToPoints} from './mixed_flight_ground_connections.mjs';
assert.equal(normalizeTfLInstant('2026-12-03T06:00:00'),'2026-12-03T06:00:00.000Z');
assert.equal(normalizeTfLInstant('2026-07-01T06:00:00'),'2026-07-01T05:00:00.000Z');
assert.equal(normalizeTfLInstant('2026-03-29T01:30:00'),null,'No invented time in the spring DST gap');
assert.equal(normalizeTfLInstant('2026-10-25T01:30:00'),null,'Repeated autumn wall time needs explicit offset');
assert.equal(normalizeTfLInstant('2026-10-25T01:30:00+01:00'),'2026-10-25T00:30:00.000Z');
assert.equal(normalizeTfLInstant('2026-02-30T06:00:00'),null);
const origin={latitude:51.475,longitude:.325,label:'Public synthetic origin',country_code:'GB'};
const stop={latitude:51.492186,longitude:-.149079,label:'Public synthetic boarding point',country_code:'GB'};
const requestMs=Date.now()+2*86400000;
const when=new Date(requestMs).toISOString();
const wall=stamp=>{
 const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(stamp).map(v=>[v.type,v.value]));
 return p.year+'-'+p.month+'-'+p.day+'T'+p.hour+':'+p.minute+':'+p.second;
};
const expected=wall(requestMs),urls=[];
let stale=false;
const original=globalThis.fetch;
globalThis.fetch=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));
 assert.equal(u.hostname,'api.tfl.gov.uk','No flight, HERE, Exa/Brave or other external source');
 urls.push(u);
 assert.equal(u.searchParams.get('date'),expected.slice(0,10).replaceAll('-',''),'Ordinary local path must not lose the requested future date');
 assert.equal(u.searchParams.get('time'),expected.slice(11,16).replace(':',''));
 const at=mins=>wall((stale?Date.now():requestMs)+mins*60000);
 return Response.json({journeys:[{startDateTime:at(10),arrivalDateTime:at(85),duration:75,
  legs:[{mode:{name:'bus'},duration:75,departureTime:at(10),arrivalTime:at(85),routeOptions:[{name:'Fixture bus'}],
   departurePoint:{commonName:origin.label,lat:origin.latitude,lon:origin.longitude},
   arrivalPoint:{commonName:stop.label,lat:stop.latitude,lon:stop.longitude},path:{lineString:JSON.stringify([[origin.latitude,origin.longitude],[stop.latitude,stop.longitude]])}}]}]});
};
try{
 const planner=createMixedLocalPlanner({env:{TFL_APP_KEY:'fixture',AI:{run:async()=>{throw Error('No LLM allowed')}}},dispatch:worker.fetch});
 const result=await planner({},origin,stop,4,{departureAt:when});
 assert.ok(urls.length>0);
 assert.equal(result.status,'success',JSON.stringify(result));
 const journey=result.journeys[0];
 assert.match(journey.startDateTime,/Z$/,'Canonical instants for strict mixed connector');
 assert.ok(Date.parse(journey.startDateTime)>=requestMs);
 assert.equal(journeyAnchoredToPoints(journey,origin,stop),true,'Actual TfL arrival coordinates reach connector');
 assert.equal(compactJourney(journey).legs[0].arrivalPoint.lat,stop.latitude);
 assert.deepEqual(journey.legs[0].coordinates,[[origin.longitude,origin.latitude],[stop.longitude,stop.latitude]],'TfL JSON lat/lon is converted, never decoded as polyline near zero');
 assert.equal(tflJourneyCoordinates({path:{lineString:'[[51.4,0.3],oops]'},departurePoint:origin,arrivalPoint:stop}).length,0);
 assert.equal(tflJourneyCoordinates({path:{lineString:'[[0,0],[0.001,0.001]]'},departurePoint:origin,arrivalPoint:stop}).length,0);
 assert.deepEqual(tflJourneyCoordinates({path:{lineStringEncoded:'_p~iF~ps|U_ulLnnqC_mqNvxq`@'},departurePoint:{latitude:38.5,longitude:-120.2},arrivalPoint:{latitude:43.252,longitude:-126.453}}),[[-120.2,38.5],[-120.95,40.7],[-126.453,43.252]]);

 assert.equal(compactJourney({...journey,legs:[{...journey.legs[0],arrivalPoint:undefined,arrivalLatLon:{lat:stop.latitude,lon:stop.longitude}}]}).legs[0].arrivalPoint.lon,stop.longitude,'Legacy snapshot arrivalLatLon remains readable');
 stale=true;
 const stalePlanner=createMixedLocalPlanner({env:{TFL_APP_KEY:'fixture',AI:{run:async()=>{throw Error('No LLM')}}},dispatch:worker.fetch});
 const rejected=await stalePlanner({},origin,stop,4,{departureAt:when});
 assert.equal(rejected.journeys.length,0,'A provider returning today instead of the requested future date cannot complete the mixed link');
 console.log('PASS actual mixed-local → ordinary Worker → TfL future date/time, canonical London instants/DST, endpoint coordinate contract, no other provider');
}finally{globalThis.fetch=original}
