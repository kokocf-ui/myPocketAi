import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import worker from './backend.js';
import {ASSISTANT_CURRENT_LOCATION_UI_SCRIPT} from './assistant_current_location_ui.mjs';

const originalFetch=globalThis.fetch;
let geoCalls=0,reverseCalls=0;
globalThis.fetch=async(input,options={})=>{
 const url=new URL(typeof input==='string'?input:input.url||String(input));
 if(url.hostname==='nominatim.openstreetmap.org'){
  reverseCalls++;
  return Response.json({address:{house_number:'10',road:'Mill Lane',suburb:'South Stifford',
   town:'Grays',postcode:'RM20 4YE',country:'United Kingdom'}});
 }
 if(url.hostname==='api.geoapify.com'){
  geoCalls++;
  assert.equal(url.pathname,'/v2/places');
  assert.ok(url.searchParams.get('categories').includes('commercial'));
  assert.ok(url.searchParams.get('categories').includes('tourism'));
  assert.ok(url.searchParams.get('categories').includes('healthcare'));
  assert.ok(url.searchParams.get('categories').includes('public_transport'));
  assert.ok(url.searchParams.get('categories').includes('education'));
  assert.equal(url.searchParams.get('filter'),'circle:0.29,51.479,750');
  return Response.json({features:[
   {geometry:{coordinates:[0.2902,51.4791]},properties:{name:'Local convenience',categories:['commercial.convenience'],formatted:'Mill Lane, Grays'}},
   {geometry:{coordinates:[0.2898,51.4792]},properties:{name:'Local bus stop',categories:['public_transport.bus'],formatted:'Grays, UK'}},
   {geometry:{coordinates:[0.2897,51.4793]},properties:{name:'Local café',categories:['catering.cafe'],formatted:'Grays, UK'}},
   {geometry:{coordinates:[0.31,51.5]},properties:{name:'Far away',categories:['commercial'],formatted:'Outside radius'}},
   {geometry:{coordinates:[0.2902,51.4791]},properties:{name:'Local convenience',categories:['commercial.convenience'],formatted:'Duplicate'}}
  ]});
 }
 throw Error('Unexpected provider '+url.hostname);
};
try{
 const addressResponse=await worker.fetch(new Request('https://example.test/api/chat',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({message:'Unde mă aflu?',module:'assistant',language:'ro',history:[],
   location:{latitude:51.479,longitude:0.29,accuracy:12,updatedAt:Date.now()},location_requested:true})
 }),{AI:{run:async()=>{throw Error('Location must never reach AI')}}});
 const address=await addressResponse.json();
 assert.equal(addressResponse.status,200);
 assert.equal(address.current_location,true);
 assert.equal(address.postcode,'RM20 4YE');
 assert.match(address.reply,/RM20 4YE/);
 assert.match(address.reply,/10 Mill Lane/);
 assert.equal(reverseCalls,1);
 const poisResponse=await worker.fetch(new Request('https://example.test/api/location-pois',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({location:{latitude:51.479,longitude:0.29},radius:750})
 }),{GEOAPIFY_API_KEY:'test-secret'});
 const data=await poisResponse.json();
 assert.equal(poisResponse.status,200);
 assert.equal(data.status,'success');
 assert.equal(data.pois.length,3,'Dedupe and radius must be applied');
 assert.equal(geoCalls,1);
 assert.deepEqual(data.pois.map(x=>x.name).sort(),['Local bus stop','Local café','Local convenience'].sort());
 assert.ok(data.pois.every(x=>Number.isFinite(x.distance_m)));
 assert.ok(!JSON.stringify(data).includes('test-secret'),'Never reveal provider API key');
 const invalid=await worker.fetch(new Request('https://example.test/api/location-pois',{
  method:'POST',headers:{'content-type':'application/json'},body:'{"location":{"latitude":999,"longitude":0}}'
 }),{});
 assert.equal(invalid.status,400);
}finally{globalThis.fetch=originalFetch}

const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
assert.ok(frontend.includes('ASSISTANT_CURRENT_LOCATION_UI_SCRIPT'));
assert.ok(frontend.includes('appendCurrentLocationMap(body,geoRecord)'));
assert.ok(frontend.includes('data.current_location===true'));
assert.ok(frontend.includes('autoOpen||currentLocationReply'));
assert.ok(ASSISTANT_CURRENT_LOCATION_UI_SCRIPT.includes("fetch('/api/location-pois'"));
assert.ok(ASSISTANT_CURRENT_LOCATION_UI_SCRIPT.includes('loadRouteMapLibrary()'));
assert.ok(ASSISTANT_CURRENT_LOCATION_UI_SCRIPT.includes('offerAssistantLocalityTravelMode'));
assert.ok(ASSISTANT_CURRENT_LOCATION_UI_SCRIPT.includes('controller?.abort()'));
console.log('PASS GPS current location mapped postcode, all-category POI request, map reader wiring and route handoff');
