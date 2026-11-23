import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import worker from './backend.js';
import {ASSISTANT_CURRENT_LOCATION_UI_SCRIPT} from './assistant_current_location_ui.mjs';

const originalFetch=globalThis.fetch;
let geoCalls=0,reverseCalls=0,reverseFails=false,geoFails=false,overpassCalls=0;
globalThis.fetch=async(input,options={})=>{
 const url=new URL(typeof input==='string'?input:input.url||String(input));
 if(url.hostname==='nominatim.openstreetmap.org'){
  reverseCalls++;
  if(reverseFails)throw Error('Temporary Nominatim outage');
  return Response.json({address:{house_number:'10',road:'Mill Lane',suburb:'South Stifford',
   town:'Grays',postcode:'RM20 4YE',country:'United Kingdom'}});
 }
 if(url.hostname==='api.geoapify.com'){
  geoCalls++;
  if(geoFails)throw Error('Temporary Geoapify outage');
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
 if(url.hostname.includes('overpass')){
  overpassCalls++;
  return Response.json({elements:[{type:'node',lat:51.4791,lon:0.2901,tags:{name:'Nearby pharmacy',amenity:'pharmacy'}},{type:'node',lat:51.4792,lon:0.2902,tags:{amenity:'fuel'}},{type:'node',lat:51.4793,lon:0.2903,tags:{shop:'convenience'}}]});
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
 assert.equal(address.reply,'10 Mill Lane, Grays, RM20 4YE, United Kingdom');
 assert.ok(!address.reply.includes('South Stifford'));
 assert.equal(reverseCalls,1);
 const coarseResponse=await worker.fetch(new Request('https://example.test/api/chat',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({message:'Unde mă aflu?',module:'assistant',language:'ro',history:[],
   location:{latitude:51.479,longitude:0.29,accuracy:250,updatedAt:Date.now()},location_requested:true})
 }),{AI:{run:async()=>{throw Error('Location must never reach AI')}}});
 const coarse=await coarseResponse.json();
 assert.equal(coarse.reply,'Grays, United Kingdom');
 assert.equal(coarse.house_number,null);
 assert.equal(coarse.postcode,null);
 reverseFails=true;
 const noAddressResponse=await worker.fetch(new Request('https://example.test/api/chat',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({message:'Unde mă aflu?',module:'assistant',language:'ro',history:[],
   location:{latitude:51.479,longitude:0.29,accuracy:12,updatedAt:Date.now()},location_requested:true})
 }),{AI:{run:async()=>{throw Error('GPS fallback must never call AI')}}});
 const noAddress=await noAddressResponse.json();
 assert.equal(noAddressResponse.status,200);
 assert.equal(noAddress.current_location,true);
 assert.equal(noAddress.location_received,true);
 assert.equal(noAddress.reverse_geocode_ok,false);
 reverseFails=false;
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
 geoFails=true;
 const fallbackResponse=await worker.fetch(new Request('https://example.test/api/location-pois',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({location:{latitude:51.479,longitude:0.29},radius:750})
 }),{GEOAPIFY_API_KEY:'test-secret'});
 const fallback=await fallbackResponse.json();
 assert.equal(fallbackResponse.status,200);
 assert.equal(fallback.status,'success');
 assert.deepEqual(fallback.pois.map(x=>x.name).sort(),['Nearby pharmacy','Fuel station','Shop'].sort());
 assert.equal(overpassCalls,1);
 const invalid=await worker.fetch(new Request('https://example.test/api/location-pois',{
  method:'POST',headers:{'content-type':'application/json'},body:'{"location":{"latitude":999,"longitude":0}}'
 }),{});
 assert.equal(invalid.status,400);
}finally{globalThis.fetch=originalFetch}

const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
assert.ok(frontend.includes('ASSISTANT_CURRENT_LOCATION_UI_SCRIPT'));
assert.ok(frontend.includes("'/api/location-pois':'POST'"),'Android first-party frontend must proxy POIs');
assert.ok(frontend.includes('appendCurrentLocationMap(body,geoRecord)'));
assert.ok(frontend.includes('data.current_location===true'));
assert.ok(!frontend.includes('data.current_location===true&&data.location_received===true&&data.reverse_geocode_ok===true'));

assert.ok(frontend.includes('autoOpen||currentLocationReply'));
assert.ok(ASSISTANT_CURRENT_LOCATION_UI_SCRIPT.includes("fetch('/api/location-pois'"));
assert.ok(ASSISTANT_CURRENT_LOCATION_UI_SCRIPT.includes('loadRouteMapLibrary()'));
assert.ok(!ASSISTANT_CURRENT_LOCATION_UI_SCRIPT.includes('offerAssistantLocalityTravelMode'),'Orientation markers must not start navigation');
assert.ok(ASSISTANT_CURRENT_LOCATION_UI_SCRIPT.includes('controller?.abort()'));
assert.ok(ASSISTANT_CURRENT_LOCATION_UI_SCRIPT.includes('flex:1 1 0'),'Map must occupy available reader space');
assert.ok(!ASSISTANT_CURRENT_LOCATION_UI_SCRIPT.includes('radiusSelect'),'No POI radius selector');
assert.ok(!ASSISTANT_CURRENT_LOCATION_UI_SCRIPT.includes('refresh.disabled'),'No separate refresh control');
assert.ok(!ASSISTANT_CURRENT_LOCATION_UI_SCRIPT.includes('summary.textContent'),'No extra POI list or counter');
assert.ok(ASSISTANT_CURRENT_LOCATION_UI_SCRIPT.includes('tile.openstreetmap.org'),'Use readable standard OSM tiles');
assert.ok(!ASSISTANT_CURRENT_LOCATION_UI_SCRIPT.includes('cartocdn.com'),'CARTO requires an API key');
assert.ok(ASSISTANT_CURRENT_LOCATION_UI_SCRIPT.includes("L.circleMarker([latitude,longitude]"),'Native GPS marker must not depend on a missing image');
assert.ok(ASSISTANT_CURRENT_LOCATION_UI_SCRIPT.includes('bindPopup(popup'),'POI taps must show place details');
assert.ok(ASSISTANT_CURRENT_LOCATION_UI_SCRIPT.includes("map.on('moveend',updatePois)"),'Panning should retrieve nearby POIs');
assert.ok(frontend.includes("layer.classList.add('answer-reader-location')"));
assert.ok(frontend.includes("controls.style.display='none'"));
assert.ok(frontend.includes("address.textContent=geoRecord.reply"));
assert.ok(!ASSISTANT_CURRENT_LOCATION_UI_SCRIPT.includes('L.circle([latitude,longitude]'),'Do not draw confusing accuracy circles');
console.log('PASS GPS address, clean OSM basemap, informative tap-only POI markers, same-origin POI API and map reader');
