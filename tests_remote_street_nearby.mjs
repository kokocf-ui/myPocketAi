import assert from 'node:assert/strict';
import worker from './backend.js';
import {parseNearbyStreetQuery,geocodeNearbyStreet} from './nearby_street_geocode.mjs';

const question='Ce magazine găsești în jurul străzii Morii din Oradea, România?';
const target=parseNearbyStreetQuery(question);
assert.deepEqual(target,{street:'Strada Morii',city:'Oradea',country:'Romania',
 query:'Strada Morii, Oradea, Romania'});
assert.deepEqual(parseNearbyStreetQuery('Strada Morii, Oradea, România')?.city,'Oradea');
assert.deepEqual(parseNearbyStreetQuery('Restaurante în Oradea pe strada Nufărului'),
 {street:'Strada Nufarului',city:'Oradea',country:'',query:'Strada Nufarului, Oradea'});
assert.deepEqual(parseNearbyStreetQuery('Restaurante pe strada Nufărului din Oradea'),
 {street:'Strada Nufarului',city:'Oradea',country:'',query:'Strada Nufarului, Oradea'});
assert.deepEqual(parseNearbyStreetQuery('Oradea pe strada Nufărului'),
 {street:'Strada Nufarului',city:'Oradea',country:'',query:'Strada Nufarului, Oradea'});
assert.equal(parseNearbyStreetQuery('Ce magazine găsești în jurul meu?'),null);
assert.equal(parseNearbyStreetQuery('Ce hoteluri găsești în Manchester?'),null);
assert.equal(parseNearbyStreetQuery('Ce magazine găsești pe Strada Morii?'),null,
 'Do not guess which city owns an unqualified street');

const anchorFeature={
 type:'Feature',
 geometry:{type:'Point',coordinates:[21.92,47.07]},
 properties:{street:'Strada Morii',city:'Oradea',country_code:'ro',
  formatted:'Strada Morii, Oradea, Bihor, România'}
};
const wrongCity={...anchorFeature,properties:{...anchorFeature.properties,city:'Satu Mare'}};
const wrongStreet={...anchorFeature,properties:{...anchorFeature.properties,street:'Strada Republicii'}};
const wrongCountry={...anchorFeature,properties:{...anchorFeature.properties,country_code:'hu'}};
const calls=[];
const fetcher=async url=>{
 const u=new URL(url);calls.push(u);
 if(u.pathname.includes('/v1/geocode/search'))
  return Response.json({features:[wrongCity,wrongStreet,wrongCountry,anchorFeature]});
 throw Error('Unexpected street provider '+url);
};
const found=await geocodeNearbyStreet(target,{apiKey:'test',countryCode:'RO',fetcher});
assert.equal(found.latitude,47.07);
assert.equal(found.longitude,21.92);
assert.equal(found.source,'geoapify');
assert.equal(found.street_verified,true);
assert.equal(calls[0].searchParams.get('filter'),'countrycode:ro');
assert.equal(calls[0].searchParams.get('text'),'Strada Morii, Oradea, Romania');
assert.equal(calls[0].searchParams.get('bias'),null,'Do not bias a remote address toward the device GPS');

const fallback=await geocodeNearbyStreet(target,{
 apiKey:'test',countryCode:'RO',
 fetcher:async url=>{
  const u=new URL(url);
  if(u.hostname==='api.geoapify.com')return Response.json({features:[wrongCity]});
  assert.equal(u.hostname,'nominatim.openstreetmap.org');
  assert.equal(u.searchParams.get('street'),'Strada Morii');
  assert.equal(u.searchParams.get('city'),'Oradea');
  return Response.json([{lat:'47.071',lon:'21.922',
   display_name:'Strada Morii, Oradea, Bihor, România',
   address:{road:'Strada Morii',city:'Oradea',country_code:'ro'}}]);
 }});
assert.equal(fallback.source,'nominatim');
assert.equal(fallback.longitude,21.922);
await assert.rejects(geocodeNearbyStreet(target,{
 apiKey:'test',countryCode:'RO',
 fetcher:async url=>new URL(url).hostname==='api.geoapify.com'
  ?Response.json({features:[wrongCity,wrongStreet,wrongCountry]})
  :Response.json([{lat:'47.07',lon:'21.92',display_name:'Oradea, România',
    address:{city:'Oradea',country_code:'ro'}}])
}),/street_not_verified/,'Never silently use a town centroid when the street is absent');

// Integration: UK device + explicit Romanian street -> Romanian shops, not UK shops.
const originalFetch=globalThis.fetch,urls=[];
globalThis.fetch=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||input.toString());
 urls.push(u);
 if(u.hostname==='api.geoapify.com'&&u.pathname==='/v1/geocode/search')
  return Response.json({features:[anchorFeature]});
 if(u.hostname==='api.geoapify.com'&&u.pathname==='/v2/places')
  return Response.json({features:[{
   type:'Feature',geometry:{type:'Point',coordinates:[21.9205,47.0704]},
   properties:{name:'Magazin de test verificat',street:'Strada Morii',city:'Oradea',
    country_code:'ro',categories:['commercial.supermarket'],datasource:{raw:{shop:'supermarket'}}}
  }]});
 if(u.hostname==='photon.komoot.io')return Response.json({features:[]});
 throw Error('Unexpected backend provider '+u.href);
};
try{
 const response=await worker.fetch(new Request('https://unit.test/api/chat',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({message:question,language:'ro',module:'assistant',
   location_requested:false,location:{latitude:51.5074,longitude:-0.1278,accuracy:20},
   history:[]})
 }),{GEOAPIFY_API_KEY:'test-key',AI:{run:async()=>{throw Error('No AI needed for verified POI lookup')}}});
 const result=await response.json();
 if(response.status!==200)console.warn('REMOTE_STREET_DIAG',response.status,JSON.stringify(result).slice(0,1200),urls.map(u=>u.href));
 assert.equal(response.status,200);
 assert.equal(result.status,'success');
 assert.equal(result.location_source,'explicit_street_query');
 assert.notEqual(result.search_ok,false,'Nearby shops should be searched around the Romanian street');
 const pois=urls.filter(u=>u.pathname==='/v2/places');
 assert.equal(pois.length,1,'POI discovery must be reached after resolving the named street');
 assert.equal(pois[0].searchParams.get('filter'),'circle:21.92,47.07,1500',
  'Street-centred POI radius must be 1.5 km in Romania, never the UK GPS');
 assert.match(result.reply,/Oradea|Magazin/i);
}finally{globalThis.fetch=originalFetch}
console.log('PASS remote street lookup, city and country validation, fallback and cross-country POI search');
