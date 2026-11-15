import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import frontend from './index.js';
import worker from './backend.js';
import {assistantBareDestinationQuery as quick} from './assistant_bare_destination.mjs';

// Bare destinations are accepted only when a real town is present.
for(const value of [
 'Strada Mihai Eminescu, Oradea',
 'Strada Libertății din Alba Iulia',
 'Oxford Street, London',
 'Hotel Hilton, London',
 'Muzeul Țării Crișurilor din Oradea',
 'Hotel Marriott, București'
])assert.equal(quick(value),value,'one-line destination: '+value);
for(const value of [
 'Strada Libertății',
 'Hoteluri ieftine în Londra',
 'Ce este Muzeul Țării Crișurilor din Oradea?',
 'Unde găsesc hoteluri în Londra?',
 'Salut, ce faci?',
 'Muzee în Oradea'
])assert.equal(quick(value),null,'ordinary request must not start route: '+value);

// Main source delegates geocoding and routing to the existing shared backend.
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
assert.match(backend,/assistantBareDestinationQuery\(message\)/);
assert.match(backend,/data\.module==="assistant"\?assistantBareDestinationQuery/);
assert.match(backend,/const routeSpecOriginal=/);
assert.match(backend,/du\[- \]\?ma/,'hyphenated spoken navigation intent');

const html=await(await frontend.fetch(new Request('https://quick-route.test/'))).text();
const inline=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline,'frontend script generated');
new vm.Script(inline);
const from=inline.indexOf('function shopQuantityUnitLabel('),to=inline.indexOf('function shopButton(',from);
assert.ok(from>0&&to>from,'unit display helper is present');
const unit=vm.runInNewContext(inline.slice(from,to)+';shopQuantityUnitLabel',{state:{language:'ro'}});
for(const [q,u,result] of [
 ['1','sticlă','sticlă'],['2','sticlă','sticle'],['1','cartuș','cartuș'],
 ['3','cartuș','cartușe'],['2','bax','baxuri'],['2','cutie','cutii'],
 ['2','pachet','pachete'],['2','legătură','legături'],['1','kg','kg'],
 ['1,5','sticlă','sticle']
])assert.equal(unit(q,u),result,`${q} ${u}`);
assert.match(inline,/shopQuantityUnitLabel\(item\.quantity,item\.unit\)/,'active shopping list inflects');
assert.match(inline,/shopQuantityUnitLabel\(i\.quantity,i\.unit\)/,'shopping history inflects');
assert.match(inline,/assistantStructuredDestination=true;state\.pendingTravelConfirmationData/,'assistant chooses mode without leaving assistant');

// Exercise the actual Worker route handoff with deterministic geocoder responses.
// This checks that a bare destination becomes an existing route-context prompt.
const originalFetch=globalThis.fetch;
const realPlaces={
 street:{name:'Strada Libertății',street:'Strada Libertății',city:'Oradea',
  formatted:'Strada Libertății, Oradea, Romania',result_type:'street',
  lat:47.061,lon:21.930,country_code:'ro'},
 hotel:{name:'Hotel Aurora',city:'Oradea',
  formatted:'Hotel Aurora, Oradea, Romania',result_type:'amenity',
  categories:['accommodation.hotel'],lat:47.062,lon:21.931,country_code:'ro'}
};
try {
 globalThis.fetch=async(input)=>{
  const url=new URL(typeof input==='string'?input:input.url);
  if(url.hostname==='api.geoapify.com'&&url.pathname==='/v1/geocode/search'){
   const query=(url.searchParams.get('text')||'').toLowerCase();
   const p=query.includes('aurora')?realPlaces.hotel:realPlaces.street;
   return Response.json({features:[{type:'Feature',properties:p,
    geometry:{type:'Point',coordinates:[p.lon,p.lat]}}]});
  }
  if(url.hostname==='api.geoapify.com'&&url.pathname==='/v2/places')
   return Response.json({features:[]});
  if(url.hostname==='photon.komoot.io')
   return Response.json({features:[]});
  throw new Error('Unexpected provider '+url.hostname+url.pathname);
 };
 const env={GEOAPIFY_API_KEY:'test',AI:{run:async()=>{throw Error('Route should not need an AI generation')}}};
 for(const message of ['Strada Libertății, Oradea','Hotel Aurora, Oradea']){
  const response=await worker.fetch(new Request('https://quick-route.test/api/chat',{method:'POST',
   headers:{'content-type':'application/json'},
   body:JSON.stringify({message,language:'ro',module:'assistant',history:[],
    location:{latitude:47.055,longitude:21.92,accuracy:20,updatedAt:Date.now()}})}),env);
  assert.equal(response.status,200,'Worker returned error for '+message);
  const body=await response.json();
  assert.equal(body.needs_travel_mode,true,message+' should request existing mode chooser: '+JSON.stringify(body).slice(0,550));
  assert.ok(body.route_context?.destination,'No verified destination: '+message);
 }
}finally{globalThis.fetch=originalFetch}

console.log('Quick assistant routes and Romanian shopping plurals: OK');
