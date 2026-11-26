// Offline timing/partial-provider regressions from the APK 501886 report.
import assert from 'node:assert/strict';
import {requestTfLJourneys} from './tfl_shared_journeys.mjs';
import {connectCandidateFlightToGround} from './mixed_flight_ground_connections.mjs';
import {prepareMixedFlightOptions} from './mixed_prefetched_details.mjs';

const never=()=>new Promise(()=>{});
let signals=[];
let started=Date.now();
const result=await requestTfLJourneys({from:'test-from',to:'test-to',appKey:'fixture',
 includeBusAlternative:true,budgetMs:100,supplementaryBudgetMs:20,
 fetcher:async (url,{signal})=>{
  signals.push(signal);
  if(new URL(url).searchParams.get('mode')==='bus')return never();
  return Response.json({journeys:[{id:'existing-route'}]});
 }
});
assert.ok(Date.now()-started<800,'A slow optional bus response cannot hold primary routes for 10+ seconds');
assert.equal(result.journeys.length,1);
assert.ok(signals.every(signal=>signal.aborted),'Abort supplementary network work on return');
let requests=0;
started=Date.now();
const failed=await requestTfLJourneys({from:'a',to:'b',appKey:'fixture',budgetMs:20,
 fetcher:async()=>{requests++;return never()}});
assert.ok(Date.now()-started<800);assert.equal(requests,1,'Do not start fallback preferences after total deadline');
assert.equal(failed.journeys.length,0);assert.equal(failed.status,'search_timeout');

const now=Date.parse('2026-11-26T00:00:00Z');
const origin={latitude:51.48,longitude:.3,label:'Fixture home'};
const destination={latitude:47.06,longitude:21.95,label:'Fixture destination'};
const from={iata:'LTN',latitude:51.875,longitude:-.368,name:'Fixture departure'};
const to={iata:'DEB',latitude:47.48,longitude:21.61,name:'Fixture arrival'};
const flight={legs:[{from:'LTN',to:'DEB',startLocal:'2026-12-04 06:05',endLocal:'2026-12-04 09:45'}]};
const access={startDateTime:'2026-12-04T03:00:00Z',arrivalDateTime:'2026-12-04T04:25:00Z',
 legs:[{mode:'train',from:'Fixture home',to:'Fixture departure',
 departurePoint:origin,arrivalPoint:from}]};
const egress={startDateTime:'2026-12-04T09:45:00Z',arrivalDateTime:'2026-12-04T12:25:00Z',
 legs:[{mode:'coach',from:'Fixture arrival',to:'Fixture destination',
 departurePoint:to,arrivalPoint:destination}]};
const args={origin,destination,flight,requestedAt:'2026-12-04T00:00:00Z'};
const deps={now,budgetMs:40,
 discover:async (_,p)=>({airports:p===origin?[from]:[to]}),
 resolveZone:async (_,a)=>a.iata==='LTN'?{name:'Europe/London',offsetSeconds:0}:
  {name:'Europe/Budapest',offsetSeconds:3600},
 planAccess:async()=>({status:'success',journeys:[access]}),
 planEgress:never};
const partial=await connectCandidateFlightToGround({},args,deps);
assert.ok(partial.accessJourney,'Keep received access when egress times out');
assert.equal(partial.egressJourney,null);assert.equal(partial.egressStatus,'search_timeout');
assert.equal(partial.completeDoorToDoor,false);assert.equal(partial.groundSearchIncomplete,true);
assert.equal(partial.boardingDeadline,'2026-12-04T04:35:00.000Z');
let accessCalls=0;
const partialSample=await connectCandidateFlightToGround({},args,{...deps,
 planAccess:async()=>++accessCalls===1?{status:'success',journeys:[access]}:never(),
 planEgress:async()=>({status:'success',journeys:[egress]})});
assert.equal(accessCalls,2);
assert.ok(partialSample.accessJourney,'A slow second access sample cannot discard the first');
assert.ok(partialSample.egressJourney,'Keep independent egress too');
// One leg can be available while its opposite provider fails immediately.
const reverse=await connectCandidateFlightToGround({},args,{...deps,
 planAccess:never,planEgress:async()=>({status:'success',journeys:[egress]})});
assert.ok(reverse.egressJourney);assert.equal(reverse.accessJourney,null);
assert.equal(reverse.accessStatus,'search_timeout');
let discoveryCalls=0;
const precomputed=await prepareMixedFlightOptions({},
 {...args,candidates:[flight],airportCandidates:{origin:[from],destination:[to]}},
 {...deps,discover:async()=>{discoveryCalls++;throw Error('Should reuse initial airport evidence')}});
assert.equal(discoveryCalls,0,'Do not repeat geographic lookup before checking ground links');
assert.ok(precomputed[0].itinerary.accessJourney);
assert.equal(precomputed[0].itinerary.completeDoorToDoor,false);
console.log('PASS offline latency: bounded TfL extras; preserve access, egress and first access sample independently; reuse airport evidence');

// Full Worker quick-search path: credentials alone must not trigger unrelated
// live-feed lookups after a usable TfL journey is already available.
const {default:worker}=await import('./backend.js');
const realFetch=globalThis.fetch,at=m=>new Date(Date.now()+m*60000).toISOString();
let unrelated=0;
globalThis.fetch=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));
 if(u.hostname==='api.tfl.gov.uk'&&u.pathname.includes('/StopPoint/Search/'))
  return Response.json({matches:[{id:'HUBVIC',name:'Victoria',lat:51.495812,lon:-.143826,modes:['bus','tube','national-rail']}]});
 if(u.hostname==='api.tfl.gov.uk'&&u.pathname.includes('/Journey/JourneyResults/'))
  return Response.json({journeys:[{startDateTime:at(10),arrivalDateTime:at(95),duration:85,legs:[
   {mode:{name:'walking'},duration:10,departureTime:at(10),arrivalTime:at(20),
    departurePoint:{commonName:'Start',lat:51.479,lon:.291},arrivalPoint:{commonName:'Fixture station',lat:51.485,lon:.286}},
   {mode:{name:'national-rail'},duration:75,departureTime:at(20),arrivalTime:at(95),
    departurePoint:{commonName:'Fixture station',lat:51.485,lon:.286},arrivalPoint:{commonName:'Victoria',lat:51.495812,lon:-.143826}}
  ]}]});
 unrelated++;throw Error('Unnecessary provider '+u.hostname);
};
try{
 const response=await worker.fetch(new Request('https://test.local/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},
  body:JSON.stringify({message:'Cum ajung la Victoria cu transportul public?',transit_query:'Victoria',module:'maps',language:'ro',history:[],
   location:{latitude:51.479,longitude:.291,accuracy:20}})}),
  {TFL_APP_KEY:'fixture',BODS_API_KEY:'fixture',RTT_API_TOKEN:'fixture',AI:{run:async()=>{throw Error('No AI needed')}}});
 const data=await response.json();
 assert.equal(data.transit_available,true,JSON.stringify(data.diagnostics));
 assert.equal(unrelated,0,'No BODS/RTT waits on the quick itinerary path');
 assert.equal(data.provider_status.bods,'not_requested_for_itinerary');
 assert.equal(data.provider_status.rtt,'not_requested_for_itinerary');
 assert.equal(data.source,'TfL Journey Planner');
}finally{globalThis.fetch=realFetch;}
console.log('PASS full Worker: usable quick TfL routes skip unrelated BODS/RTT feeds even when keys exist');
