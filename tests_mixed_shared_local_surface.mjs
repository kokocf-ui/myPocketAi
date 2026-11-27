// Offline regression: mixed is not synonymous with flights + airport gaps.
import assert from 'node:assert/strict';
import worker from './backend.js';
import {createMixedLocalPlanner} from './mixed_local_planner.mjs';
import {makeLocalMixedSource,makeTransCAPIMixedSource,convertMOTISToMixedLegs} from './mixed_existing_provider_adapters.mjs';
import {searchMixedRouteProviders} from './mixed_route_provider_search.mjs';
import {searchMixedIndicativeOptions} from './mixed_indicative_search.mjs';
import {discoverMixedGroundOperators} from './mixed_ground_operator_discovery.mjs';

const now=Date.now(),at=m=>new Date(now+m*60000).toISOString();
const home={id:'home',latitude:51.479,longitude:.291,label:'Fixture home'};
const terminal={id:'terminal',latitude:51.495812,longitude:-.143826,label:'Fixture coach terminal'};
const final={id:'final',latitude:47.06,longitude:21.95,label:'Fixture destination'};
const realFetch=globalThis.fetch;
let tfl=0,ai=0,other=0;
globalThis.fetch=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));
 if(u.hostname==='api.tfl.gov.uk'&&u.pathname.includes('/Journey/JourneyResults/')){
  tfl++;
  const reverse=u.pathname.includes('/JourneyResults/'+terminal.latitude+','+terminal.longitude+'/to/');
  const a=reverse?terminal:home,b=reverse?home:terminal;
  return Response.json({journeys:[{startDateTime:at(10),arrivalDateTime:at(55),duration:45,legs:[
   {mode:{name:'bus'},duration:45,departureTime:at(10),arrivalTime:at(55),routeOptions:[{name:'Fixture bus'}],
    departurePoint:{commonName:a.label,lat:a.latitude,lon:a.longitude},
    arrivalPoint:{commonName:b.label,lat:b.latitude,lon:b.longitude}}
  ]}]});
 }
 if(u.hostname==='api.transcapi.com')return Response.json({timezone:'Europe/London',itineraries:[{
  start_time:at(10),end_time:at(55),legs:[{mode:'RAIL',
   from:{name:home.label,...home},to:{name:'Fixture Luton',latitude:51.875,longitude:-.368},
   start_time:{scheduled:at(10)},end_time:{scheduled:at(55)},route:{line:'Fixture rail'}}]
 }]});
 other++;throw Error('Unexpected provider '+u.hostname+u.pathname);
};
try{
 const plan=createMixedLocalPlanner({dispatch:worker.fetch,
  env:{TFL_APP_KEY:'fixture',AI:{run:async()=>{ai++;throw Error('No LLM')}}}});
 const first=await plan({},home,terminal,4,{departureAt:at(0)});
 assert.equal(first.status,'success',JSON.stringify(first));
 assert.equal(first.provider,'TfL','Actual ordinary local planner is reused, not a TransCAPI-only substitute');
 assert.equal(first.journeys.length,1);assert.equal(first.journeys[0].legs[0].mode,'bus');
 const before=tfl;
 await plan({},home,terminal,4,{departureAt:at(0)});
 assert.equal(tfl,before,'Same points/date reuse per-request local results');
 const reverse=await plan({},terminal,home,4,{departureAt:at(0)});
 assert.equal(reverse.status,'success','Reuse the normal planner for onward travel too');
 assert.equal(reverse.journeys[0].legs[0].to,home.label);
 const toLuton=createMixedLocalPlanner({dispatch:worker.fetch,env:{TRANSCAPI_API_KEY:'fixture',AI:{run:async()=>{ai++;throw Error('No LLM')}}}});
 const luton=await toLuton({},home,{latitude:51.875,longitude:-.368,label:'Fixture Luton',country_code:'GB'},4,{departureAt:at(0)});
 assert.equal(luton.status,'success',JSON.stringify(luton));
 assert.equal(luton.journeys[0].legs[0].to,'Fixture Luton','Regional point uses the same UK provider as normal local/national routing');
 assert.equal(other,0);assert.equal(ai,0,'No recursive flight discovery, geocoding or AI in local connector');

 // Surface-only chain: normal local bus to a terminal + independently sourced
 // intercity coach. No airport, flight key or flight result is necessary.
 const local=makeLocalMixedSource({planner:plan,
  canServe:(a,b)=>a.id==='home'&&b.id==='terminal'});
 const coach={id:'FixtureCoach',enabled:true,licensed:true,
  canServe:(a,b)=>a.id==='terminal'&&b.id==='final',
  async searchLegs(){return {status:'success',legs:[{mode:'coach',from:terminal,to:final,
   departureTime:at(90),arrivalTime:at(1000),verified:true,
   verificationSource:'Fixture licensed coach timetable'}]}}};
 const composed=await searchMixedRouteProviders({origin:home,destination:final,departureAt:at(0),now,
  candidateNodes:[{...terminal,mixedHubRole:'origin_access'}],sources:[local,coach],maxProviderCalls:6});
 assert.equal(composed.status,'verified',JSON.stringify(composed));
 assert.equal(composed.journeys.length,1);assert.equal(composed.journeys[0].modeSignature,'bus → coach');
 assert.equal(composed.journeys[0].legs.at(-1).to,final.label);
}finally{globalThis.fetch=realFetch;}

// MOTIS/normal local results may use arrivalPoint, not arrivalLatLon. Previously
// those perfectly valid legs were silently discarded by the graph adapter.
const supplied={startDateTime:at(10),arrivalDateTime:at(45),legs:[{
 mode:'train',from:home.label,to:terminal.label,departurePoint:home,arrivalPoint:terminal,
 departureTime:at(10),arrivalTime:at(45)}]};
assert.equal(convertMOTISToMixedLegs(supplied,{from:home,to:terminal}).length,1);

// No Brave key: the already configured Exa source must still search rail/coach
// corridors. Actual sourced geography and route pages, not fixed interchange names.
let queries=[],progress=[];
const pages={
 direct:{url:'https://www.flixbus.com/bus-routes/london-oradea',title:'London to Oradea Coach Travel'},
 train:{url:'https://www.eurostar.com/uk-en/train/london-to-brussels',title:'London to Brussels Train Travel'},
 coach:{url:'https://www.flixbus.com/bus-routes/brussels-oradea',title:'Brussels to Oradea Coach Travel'}
};
const evidence=await discoverMixedGroundOperators({EXA_API_KEY:'fixture',GEOAPIFY_API_KEY:'fixture'},
 {origin:{...home,city:'Grays',country_code:'GB'},destination:{...final,city:'Oradea',country_code:'RO'},
  onProgress:part=>progress.push(part),fetcher:async(input,init)=>{
   const u=new URL(String(input));
   if(u.hostname==='api.geoapify.com'){
    if(u.pathname==='/v2/places'){
     const nearHome=u.searchParams.get('filter').includes('.291,51.479');
     return Response.json({features:[{properties:nearHome?
      {name:'London',country_code:'gb',population:9000000,lat:51.51,lon:-.13}:
      {name:'Brussels',country_code:'be',population:1200000,lat:50.85,lon:4.35}}]});
    }
    return Response.json({features:[{properties:{city:'London',country_code:'gb'}}]});
   }
   if(u.hostname==='api.exa.ai'){
    const q=JSON.parse(init.body).query;queries.push(q);
    return Response.json({results:/London to Brussels/i.test(q)?[pages.train]:
     /Brussels to Oradea/i.test(q)?[pages.coach]:[pages.direct]});
   }
   throw Error('No other search provider configured');
  }});
assert.ok(queries.some(q=>/London to Brussels/.test(q)),'Search surface interchange even without Brave or flights');
assert.ok(evidence.connections.some(c=>c.modes.join('>')==='train>coach'));
assert.ok(progress.some(p=>p.operators?.length),'Expose received ground evidence before corridor completion');
assert.ok(queries.length<=8,'Initial two searches + maximum six corridor queries');
assert.ok(queries.every(q=>!q.includes('Fixture home')&&!q.includes('Fixture destination')),'No private street/GPS in search terms');
assert.ok(evidence.connections.every(c=>!c.door_to_door_complete&&!c.timetable_verified),'Page evidence is not a dated connection');
console.log('PASS shared local TfL reuse/cache, surface-only bus+coach graph, arrivalPoint interoperability, Exa-only rail+coach corridors');

const longSource=makeTransCAPIMixedSource({TRANSCAPI_API_KEY:'fixture'},{licensed:true,
 planner:async()=>({status:'success',journeys:[supplied]})});
const longResult=await longSource.searchLegs({from:{...home,id:'geoapify:'+'a'.repeat(90)},
 to:{...terminal,id:'geoapify:'+'b'.repeat(90)},departureAt:at(0)});
assert.equal(longResult.status,'success','Real long hub IDs must not invalidate the whole adapter');

const retained=await searchMixedIndicativeOptions({}, {origin:home,destination:final,international:true},{
 discoverAir:async()=>({status:'disabled',candidates:[]}),
 discoverGround:async(_,{onProgress})=>{onProgress({operators:[pages.direct],connections:[],status:'official_operator_options'});throw Error('Later corridor lookup failed')}
});
assert.equal(retained.operator_options.length,1,'A later ground failure cannot discard already returned surface options');
assert.equal(retained.ground_search_incomplete,true);
let started=0;
const bounded=await searchMixedRouteProviders({origin:home,destination:terminal,departureAt:at(0),now,budgetMs:20,
 parallelDirect:true,sources:[{id:'Fast',enabled:true,licensed:true,searchLegs:async()=>{
 started++;return {status:'success',legs:[{mode:'train',from:home,to:terminal,departureTime:at(10),arrivalTime:at(45),verified:true}]};
 }},{id:'Slow',enabled:true,licensed:true,searchLegs:async()=>{started++;return new Promise(()=>{})}}]});
assert.equal(bounded.status,'verified','Keep a direct surface route if an independent source times out');
assert.equal(bounded.searchIncomplete,true);assert.equal(bounded.searchCalls,2);assert.equal(started,2);
console.log('PASS regional Luton and onward local reuse; long hub IDs; preserved partial surface evidence and bounded graph');

let invalidCalls=0;
const invalid=createMixedLocalPlanner({dispatch:async()=>{invalidCalls++;throw Error('Invalid points must not dispatch')}});
assert.equal((await invalid({}, {...home,latitude:''},terminal)).status,'missing_coordinates');
assert.equal(invalidCalls,0);

let domesticPayload;
const registry=createMixedLocalPlanner({dispatch:async req=>{
 domesticPayload=await req.json();return Response.json({transit:[],reason:'country_provider_not_connected'});
}});
await registry({}, {...home,country_code:'FI'},{...terminal,country_code:'FI'});
assert.equal(domesticPayload.national_public_transport,true,'Known foreign domestic endpoints reuse the country-registry gates');
assert.equal(domesticPayload.mixed_journey,false,'Local delegation cannot recursively search flights');
assert.equal(domesticPayload.mixed_composition,false);
