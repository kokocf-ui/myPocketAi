import assert from 'node:assert/strict';
import worker from './backend.js';

// Integration regression: real Worker /api/chat, simulated remote providers.
// No public API keys, no external calls and no inference from account country.
const originalFetch=globalThis.fetch;
const calls=[];
let gpsCountry='RO';
globalThis.fetch=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));
 calls.push({host:u.hostname,path:u.pathname,lat:u.searchParams.get('lat'),lon:u.searchParams.get('lon')});
 if(u.hostname==='api.geoapify.com'&&u.pathname==='/v1/geocode/reverse')
  return Response.json({features:[{properties:{country_code:gpsCountry.toLowerCase()}}]});
 if(u.hostname==='api.geoapify.com'&&u.pathname==='/v2/places')
  return Response.json({features:[{type:'Feature',geometry:{type:'Point',coordinates:currentPoint.slice().reverse()},properties:{
   name:'Local shop for '+gpsCountry,categories:['commercial.convenience'],datasource:{raw:{shop:'convenience'}}
  }}]});
 if(u.hostname==='photon.komoot.io')return Response.json({features:[]});
 if(u.hostname==='api.ratings.food.gov.uk')
  return Response.json({establishments:[]});
 throw Error('Unexpected provider: '+u.hostname+u.pathname);
};
let currentPoint=[47.0594,21.9349];
async function requestAt(country,latitude,longitude){
 gpsCountry=country;currentPoint=[latitude,longitude];calls.length=0;
 const payload={message:'Găsește băcănii în apropierea mea',
  quick_place_search:true,place_category:'corner_shop',
  module:'travel',language:'ro',history:[],
  location:{latitude,longitude,accuracy:20}};
 const response=await worker.fetch(new Request('https://test.invalid/api/chat',{
  method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)
 }),{GEOAPIFY_API_KEY:'mock',SMART_COUNTRY_REGISTRY_ENABLED:'true',
  AI:{run:async()=>{throw Error('LLM must not be called for POI search')}}});
 assert.equal(response.status,200);
 const json=await response.json();
 assert.equal(json.search_ok,true,JSON.stringify(json).slice(0,600));
 assert.equal(json.place_context?.country_routing?.country,country);
 assert.equal(json.place_context?.country_routing?.mode,'country_scoped');
 assert.ok(json.places.some(p=>p.name==='Local shop for '+country));
 assert.equal(calls.filter(x=>x.path==='/v1/geocode/reverse').length,1);
 const reverse=calls.find(x=>x.path==='/v1/geocode/reverse');
 assert.equal(reverse.lat,String(latitude));
 assert.equal(reverse.lon,String(longitude));
 assert.ok(calls.some(x=>x.path==='/v2/places'));
 assert.ok(calls.some(x=>x.host==='photon.komoot.io'));
 return calls.filter(x=>x.host==='api.ratings.food.gov.uk').length;
}
try{
 assert.equal(await requestAt('RO',47.0594,21.9349),0,
  'Romania must not call UK-specific food registry');
 assert.equal(await requestAt('GB',51.4775,0.3007),1,
  'Grays still uses its UK-specific food registry');
}finally{globalThis.fetch=originalFetch;}
console.log('PASS Worker /api/chat GPS anchoring + RO/GB provider selection');
