import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {transitStopCount,tflLegStopCount} from './transit_stop_counts.mjs';
import {requestTfLJourneys} from './tfl_shared_journeys.mjs';
import worker from './backend.js';
const stop=(id,lat=51.49,lon=.31)=>({naptanId:id,name:id,commonName:id,lat,lon});
const a=stop('A',51.479,.291),b=stop('B'),c=stop('C',51.490,.315);
const now=Date.now(),at=m=>new Date(now+m*60000).toISOString();
const leg=(mode,start,end,from=a,to=c,stops=[a,b,c])=>({mode:{name:mode},departureTime:at(start),arrivalTime:at(end),duration:end-start,departurePoint:from,arrivalPoint:to,path:{stopPoints:stops},routeOptions:[{lineIdentifier:{name:mode+start}}]});
assert.equal(tflLegStopCount(leg('bus',10,20)),2);
assert.equal(tflLegStopCount(leg('bus',10,20,a,c,[b])),null,'Partial list is not a verified count');
assert.equal(tflLegStopCount(leg('walking',10,20)),null);
for(const value of [null,'2',-1,0,NaN,1.5])assert.equal(transitStopCount({mode:'bus',stopCount:value}),null);
assert.equal(transitStopCount({mode:'bus',stopCount:2}),2);
assert.equal(transitStopCount({mode:'walking',stopCount:2}),null);
const trip=(legs,start,end)=>({duration:end-start,startDateTime:at(start),arrivalDateTime:at(end),legs});
const trains=[trip([leg('tube',10,20)],10,20),trip([leg('national-rail',12,23)],12,23),trip([leg('tube',15,26)],15,26)];
const bus=trip([leg('bus',20,30,a,b,[a,b]),leg('walking',30,34,b,b,[]),leg('bus',39,47,b,c,[b,c])],20,47);
let urls=[];
const fixture=async input=>{const u=new URL(typeof input==='string'?input:input.url);urls.push(u);return Response.json({journeys:u.searchParams.get('mode')==='bus'?[bus,...trains]:trains});};
const r=await requestTfLJourneys({from:'51.479,.291',to:'51.49,.315',departureAt:at(5),includeBusAlternative:true,fetcher:fixture});
assert.equal(urls.length,2,'One good general query plus one bounded bus query');
assert.equal(r.journeys.length,4,'Ignore rail itineraries incorrectly returned for bus-only query');
for(const u of urls){assert.ok(u.searchParams.has('date'));assert.ok(u.searchParams.has('time'));}
const original=globalThis.fetch;globalThis.fetch=fixture;
try{
 for(const module of ['maps','travel']){
  urls=[];
  const response=await worker.fetch(new Request('https://test.example/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({module,language:'ro',transit_count:3,message:'Transport public la farmacia din Grays',location:{latitude:a.lat,longitude:a.lon,accuracy:10,updatedAt:now},transit_destination:{latitude:c.lat,longitude:c.lon,label:'Pharmacy Grays',country_code:'GB'},transit_query:'Pharmacy Grays',history:[]})}),{TFL_APP_KEY:'test',AI:{run:async()=>{throw Error('No AI needed')}}});
  const data=await response.json();assert.equal(data.transit_available,true,JSON.stringify(data).slice(0,700));
  assert.equal(data.transit.length,3);
  const found=data.transit.find(j=>j.legs.filter(l=>l.mode!=='walking').every(l=>l.mode==='bus'));
  assert.ok(found,module+' keeps a verified bus-only option even when three rail routes arrive earlier');
  assert.deepEqual(found.legs.map(l=>l.stopCount),[1,null,1]);
  assert.ok(found.legs.some(l=>l.mode==='walking'),'Transfer walk survives normalisation');
  assert.ok(urls.some(u=>u.searchParams.get('mode')==='bus'));
 }
 // Outside the London corridor, the national adapter must also request a
 // verified local bus-only alternative instead of assuming rail is enough.
 const northernOrigin={latitude:53.48,longitude:-2.24},northernTo={latitude:53.49,longitude:-2.30,label:'Local destination',country_code:'GB'};
 const nationalCalls=[];
 globalThis.fetch=async input=>{
  const u=new URL(input);nationalCalls.push(u);assert.equal(u.hostname,'api.transcapi.com');
  const isBus=u.searchParams.get('transit_modes')==='';
  const itinerary=offset=>({start_time:at(20+offset),end_time:at(40+offset),legs:[{
   mode:isBus?'BUS':'RAIL',from:{name:'Origin stop',...northernOrigin},to:{name:'Destination stop',...northernTo},
   start_time:{scheduled:at(20+offset)},end_time:{scheduled:at(40+offset)},route:{line:isBus?'22':'R1'}
  }]});
  return Response.json({timezone:'Europe/London',itineraries:isBus?[itinerary(15)]:[itinerary(0),itinerary(3),itinerary(6)]});
 };
 const nr=await worker.fetch(new Request('https://test.example/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({module:'maps',language:'ro',transit_count:3,message:'Transport public către destinație',location:northernOrigin,transit_destination:northernTo,transit_query:northernTo.label,history:[]})}),{TRANSCAPI_API_KEY:'test',AI:{run:async()=>{throw Error('No AI needed')}}});
 const nd=await nr.json();assert.equal(nd.transit_available,true,JSON.stringify(nd).slice(0,500));
 assert.equal(nationalCalls.length,2);assert.ok(nd.transit.some(j=>j.legs.every(l=>l.mode==='bus')));
}finally{globalThis.fetch=original}
const ui=readFileSync('index.js','utf8'),menu=ui.slice(ui.indexOf('const MODULE_QUICK_CHOICES='),ui.indexOf('function renderModuleLandingChoices'));
assert.ok(menu.indexOf('nationalPublicTransport:true')<menu.indexOf('mixedJourney:true'));
assert.match(menu,/transport mixt sau cu mașina/);
assert.match(ui,/appendTransitStopCount\(action,leg\)/);
assert.match(ui,/appendTransitStopCount\(item,leg\)/);
console.log('PASS Maps/Hotels shared TfL bus alternatives, per-vehicle stop counts, walking transfers and Maps card order');
