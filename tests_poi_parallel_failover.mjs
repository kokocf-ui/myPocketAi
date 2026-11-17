import assert from 'node:assert/strict';
import backend from './backend.js';
// Photon may reject before the concurrent Geoapify query resolves.
const originalFetch=globalThis.fetch;
let unhandled=0;
const handler=()=>{unhandled++};
process.on('unhandledRejection',handler);
globalThis.fetch=async url=>{
 const u=new URL(typeof url==='string'?url:url.url);
 if(u.hostname==='photon.komoot.io')throw new TypeError('Photon temporarily unavailable');
 if(u.hostname==='api.geoapify.com'&&u.pathname==='/v2/places'){
  await new Promise(resolve=>setTimeout(resolve,65));
  return Response.json({features:[{type:'Feature',geometry:{type:'Point',coordinates:[0.301,51.477]},properties:{
   name:'Cafe Anchor',categories:['catering.cafe'],datasource:{raw:{amenity:'cafe'}},street:'London Road',city:'Grays'
  }}]});
 }
 if(u.hostname==='api.geoapify.com')return Response.json({features:[]});
 throw Error('Unexpected provider '+u.hostname);
};
try{
 const req=new Request('https://unit.test/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
  message:'Găsește cafenele în apropierea mea.',module:'travel',language:'ro',quick_place_search:true,
  place_category:'lounge',history:[],location:{latitude:51.4775,longitude:0.3007,accuracy:20}
 })});
 const response=await backend.fetch(req,{GEOAPIFY_API_KEY:'test',TOMTOM_PLACES_ENABLED:'false',SMART_COUNTRY_REGISTRY_ENABLED:'false'});
 assert.equal(response.status,200);
 const data=await response.json();
 assert.equal(data.status,'success');
 assert.equal(data.search_ok,true,data.reply);
 assert.ok(data.places.some(p=>p.name==='Cafe Anchor'),'Preserve verified Geoapify results if Photon rejects');
 await new Promise(resolve=>setTimeout(resolve,15));
 assert.equal(unhandled,0,'Providers must settle their rejections immediately');
 console.log('PASS early Photon rejection does not crash parallel Geoapify search');
}finally{globalThis.fetch=originalFetch;process.off('unhandledRejection',handler)}
