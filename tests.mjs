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
let d=await ask('Caută hoteluri de 5 stele în Berlin, zona centrală');assert.equal(d.version,'v102');assert.equal(d.location_source,'explicit_place_query');assert.equal(d.search_query,'Berlin');assert.equal(d.search_radius_meters,2000);assert.equal(d.requested_stars,5);assert.deepEqual(d.places.map(p=>p.name),['Berlin Five','Berlin Superior']);assert.ok(d.reply.includes('Berlin'));assert.ok(!d.reply.includes('față de poziția GPS'));assert.ok(calls.find(u=>u.hostname==='api.geoapify.com').searchParams.get('filter').startsWith('circle:13.395,52.517,2000'));
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
console.info=originalLog;console.warn=originalWarn;console.log('PASS: Berlin overrides UK GPS, no-GPS named city, central 2km scope, 5-star and 5S filtering, missing stars excluded, near-me GPS retained, failed/empty/ambiguous destination never falls back to GPS, city clarification.');
