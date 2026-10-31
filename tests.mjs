import assert from 'node:assert/strict';
import worker from './backend.js';
import {webcrypto} from 'node:crypto';globalThis.crypto??=webcrypto;
const originalLog=console.info, originalWarn=console.warn;console.info=()=>{};console.warn=()=>{};
let calls=[], mode='normal', starData=true;
const features=[
 {name:'Berlin Five',lat:52.518,lon:13.399,stars:'5'},
 {name:'Berlin Four',lat:52.518,lon:13.4,stars:'4'},
 {name:'Berlin Unknown',lat:52.519,lon:13.4},
 {name:'Berlin Superior',lat:52.519,lon:13.401,stars:'5S'},
 {name:'London Five',lat:51.484,lon:.28,stars:'5'}];
globalThis.fetch=async input=>{const u=new URL(input);calls.push(u);
 if(u.hostname==='nominatim.openstreetmap.org'){
  if(mode==='failure')throw Error('offline');
  if(mode==='missing')return Response.json([]);
  if(mode==='ambiguous')return Response.json([{lat:'52.517',lon:'13.395',importance:.5,address:{country_code:'de'}},{lat:'44',lon:'-71',importance:.49,address:{country_code:'us'}}]);
  return Response.json([{lat:'52.517',lon:'13.395',display_name:'Berlin, Germany',importance:.8,address:{city:'Berlin',country_code:'de'}}]);
 }
 if(u.hostname==='api.geoapify.com')return Response.json({features:features.map(f=>({geometry:{coordinates:[f.lon,f.lat]},properties:{name:f.name,categories:['accommodation.hotel'],accommodation:starData?{stars:f.stars}:{},datasource:{raw:{tourism:'hotel'}}}}))});
 if(u.hostname==='photon.komoot.io')return Response.json({features:[]});
 throw Error('Unexpected '+u.hostname);
};
const env={GEOAPIFY_API_KEY:'mock',AI:{run:async()=>({response:'translated'})}};
async function ask(message,location={latitude:51.484,longitude:.28},extra={}){calls=[];return(await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,language:'ro',location,history:[],...extra})}),env)).json()}
let d=await ask('Caută hoteluri de 5 stele în Berlin, zona centrală');assert.equal(d.version,'v104');assert.equal(d.location_source,'explicit_place_query');assert.equal(d.search_query,'Berlin');assert.equal(d.search_radius_meters,2000);assert.ok(d.reply.startsWith('Am găsit 2 hoteluri de 5 stele în Berlin, conform datelor de hartă disponibile.'));assert.ok(!d.reply.includes('hotel / hostel'));assert.equal(d.places[0].type,'hotel');assert.equal(d.requested_stars,5);assert.deepEqual(d.places.map(p=>p.name),['Berlin Five','Berlin Superior']);assert.ok(d.reply.includes('Berlin'));assert.ok(!d.reply.includes('față de poziția GPS'));assert.ok(calls.find(u=>u.hostname==='api.geoapify.com').searchParams.get('filter').startsWith('circle:13.395,52.517,2000'));
d=await ask('Find 5-star hotels in Berlin city centre',null,{language:'en'});assert.equal(d.requested_stars,5);assert.equal(d.search_query,'Berlin');assert.equal(d.places.length,2);
d=await ask('Hoteluri în Berlin');assert.equal(d.location_source,'explicit_place_query');assert.equal(d.search_radius_meters,5000);
for(const m of ['Caută hoteluri în apropierea mea','Caută hoteluri în apropiere','Find hotels near me']){d=await ask(m);assert.equal(d.location_source,'browser_gps',m);assert.ok(!calls.some(u=>u.hostname==='nominatim.openstreetmap.org'));assert.deepEqual(d.places.map(p=>p.name),['London Five'])}
for(const failMode of ['missing','failure','ambiguous']){mode=failMode;d=await ask('Caută hoteluri în Berlin');assert.equal(d.needs_location_clarification,true);assert.deepEqual(d.places,[]);assert.ok(!calls.some(u=>u.hostname==='api.geoapify.com'||u.hostname==='photon.komoot.io'));}mode='normal';
starData=false;d=await ask('Caută hoteluri de 5 stele în Berlin');assert.deepEqual(d.places,[]);assert.equal(d.requested_stars,5);assert.ok(d.reply.includes('Nu am putut confirma'));starData=true;
d=await ask('Caută hoteluri de cinci stele în Berlin');assert.equal(d.places.length,2);
d=await ask('Caută hoteluri în centru');assert.equal(d.needs_location_clarification,true);
d=await ask('Caută hoteluri în apropiere de Berlin');assert.equal(d.search_query,'Berlin');
d=await ask('Find 4.5-star hotels in Berlin');assert.equal(d.needs_star_clarification,true);
d=await ask('Bună, ce poți face?');assert.equal(d.status,'success');assert.ok(d.reply);
// v104: use only user turns for follow-up destinations, never assistant guesses.
const previousFetch=globalThis.fetch;let aiInputs=[];
const ny={latitude:40.7128,longitude:-74.006,label:'New York, United States'};
const paris={latitude:48.8566,longitude:2.3522,label:'Paris, France'};
const london={latitude:51.5074,longitude:-.1278,label:'London, United Kingdom'};
globalThis.fetch=async input=>{
 const u=new URL(input);calls.push(u);
 if(u.hostname==='nominatim.openstreetmap.org'){
  const q=u.searchParams.get('q').toLowerCase();const p=q.includes('new york')?ny:q.includes('paris')?paris:q.includes('londra')||q.includes('london')?london:null;
  if(!p)return Response.json([]);
  return Response.json([{lat:String(p.latitude),lon:String(p.longitude),display_name:p.label,importance:.9,address:{country_code:p===ny?'us':p===paris?'fr':'gb'}}]);
 }
 if(u.hostname==='api.geoapify.com'&&u.pathname==='/v2/places'){
  const center=u.searchParams.get('filter').split(':')[1].split(',').map(Number);const [lon,lat]=center;
  return Response.json({features:[{geometry:{coordinates:[lon+.001,lat+.001]},properties:{name:'Mapped Five-Star Hotel',categories:['accommodation.hotel'],accommodation:{stars:'5'},datasource:{raw:{tourism:'hotel'}}}}]});
 }
 if(u.hostname==='api.geoapify.com'&&u.pathname==='/v1/routing')return Response.json({features:[{properties:{distance:450000,time:18000}}]});
 if(u.hostname==='photon.komoot.io')return Response.json({features:[]});
 if(u.hostname==='api.search.brave.com')return Response.json({web:{results:[]}});
 throw Error('Unexpected '+u.hostname);
};
const first='Caută hotel de 3 stele în New York';const follow='Dar hotel de 5 stele găsești?';
d=await ask(first);assert.equal(d.results_count,0);assert.equal(d.search_query,'New York');
const badAssistant={role:'assistant',content:'Am găsit hoteluri de 5 stele în România.'};
let history=[{role:'user',content:first},{role:'assistant',content:'Nu am putut confirma hoteluri de 3 stele în New York.'},{role:'user',content:follow}];
d=await ask(follow,undefined,{history});assert.equal(d.search_query,'New York');assert.equal(d.requested_stars,5);assert.equal(d.context_inherited,true);assert.equal(d.places.length,1);assert.ok(!d.reply.includes('România'));
history=[{role:'user',content:first},badAssistant,{role:'user',content:follow},badAssistant];
d=await ask('Dar de 4 stele?',undefined,{history});assert.equal(d.search_query,'New York');assert.equal(d.requested_stars,4);assert.equal(d.places.length,0);
d=await ask('Dar în Paris?',undefined,{history});assert.equal(d.search_query,'Paris');assert.equal(d.requested_stars,5);assert.equal(d.search_center.latitude,paris.latitude);
d=await ask('Caută hoteluri în Paris',undefined,{history});assert.equal(d.requested_stars,null);assert.equal(d.context_inherited,false);
d=await ask('Dar hoteluri de 5 stele găsești?',undefined,{history:[{role:'user',content:first},{role:'user',content:'Cât face 2 plus 2?'}]});assert.equal(d.needs_location_clarification,true);assert.ok(!calls.some(u=>u.pathname==='/v2/places'));
d=await ask('Dar de 5 stele?',undefined,{history:[]});assert.equal(d.needs_location_clarification,true);
d=await ask('Câți kilometri sunt până în Paris?',{latitude:london.latitude,longitude:london.longitude},{history});assert.equal(d.distance_type,'straight_line');assert.equal(d.origin_source,'browser_gps');assert.ok(d.distance_meters>330000&&d.distance_meters<360000);assert.equal(d.destination.latitude,paris.latitude);assert.ok(!d.reply.includes('România'));assert.ok(d.reply.includes('linie dreaptă'));
d=await ask('Câți kilometri sunt până în Paris?',null,{history});assert.equal(d.needs_origin_clarification,true);assert.equal(d.distance_available,false);assert.equal(calls.length,0);
d=await ask('Câți kilometri sunt din Londra până în Paris?',{latitude:44.4,longitude:26.1});assert.equal(d.origin_source,'explicit_place_query');assert.equal(d.origin.latitude,london.latitude);assert.ok(d.distance_meters>330000&&d.distance_meters<360000);
d=await ask('Distanța rutieră până în Paris cu mașina',{latitude:london.latitude,longitude:london.longitude});assert.equal(d.distance_type,'road');assert.equal(d.distance_meters,450000);assert.ok(calls.find(u=>u.pathname==='/v1/routing').searchParams.get('waypoints').startsWith('51.5074,-0.1278|48.8566,2.3522'));
// General research must not turn a selected response language into a country.
const researchEnv={...env,BRAVE_API_KEY:'mock-brave',AI:{run:async(model,payload)=>{aiInputs.push(payload);return {response:'Răspuns de test.'}}}};
calls=[];await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Care sunt ultimele noutăți despre baterii?',language:'ro',history:[]})}),researchEnv);
assert.equal(calls.find(u=>u.hostname==='api.search.brave.com').searchParams.get('country'),'ALL');assert.ok(aiInputs.some(p=>p.messages?.some(m=>m.role==='system'&&m.content.includes('LANGUAGE IS NOT LOCATION'))));
calls=[];await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Latest battery news in Romania?',language:'en',history:[]})}),researchEnv);assert.equal(calls.find(u=>u.hostname==='api.search.brave.com').searchParams.get('country'),'RO');
d=await ask('Dar de 5 stele?',undefined,{history:[{role:'user',content:'Dar de 4 stele?'}],place_context:{category:'hotel',destination:'New York',stars:4,central:false}});assert.equal(d.search_query,'New York');assert.equal(d.requested_stars,5);assert.equal(d.place_context.destination,'New York');
d=await ask('Câți kilometri sunt până în Paris?',null,{place_context:{category:'hotel',destination:'New York',stars:5,central:false}});assert.equal(d.needs_origin_clarification,true);assert.equal(d.place_context,null);
d=await ask('Câte stele are hotelul Ritz în Paris?');assert.ok(!calls.some(u=>u.pathname==='/v2/places'));assert.equal(d.place_context,null);
const routeFetch=globalThis.fetch;globalThis.fetch=async input=>{if(new URL(input).pathname==='/v1/routing')return new Response('unavailable',{status:503});return routeFetch(input)};
d=await ask('Distanța rutieră până în Paris cu mașina',{latitude:london.latitude,longitude:london.longitude});assert.equal(d.distance_available,false);assert.ok(!d.distance_meters);globalThis.fetch=routeFetch;
globalThis.fetch=previousFetch;
console.log('PASS: New York follow-ups survive wrong assistant geography; star/city changes; new request and topic boundaries; Paris GPS/explicit/missing origins; road vs straight-line distance; language-neutral search with explicit country preserved.');
console.info=originalLog;console.warn=originalWarn;console.log('PASS: Berlin overrides UK GPS, no-GPS named city, central 2km scope, 5-star and 5S filtering, missing stars excluded, near-me GPS retained, failed/empty/ambiguous destination never falls back to GPS, city clarification.');
