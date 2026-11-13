import assert from 'node:assert/strict';
import worker from './backend.js';
import frontend from './index.js';
import vm from 'node:vm';

// End-to-end country-independent ambiguous city selection, preserving job.
const original=globalThis.fetch;
const parisFrance={name:'Paris',lat:'48.8566',lon:'2.3522',class:'place',type:'city',addresstype:'city',
 display_name:'Paris, Île-de-France, France',address:{city:'Paris',country:'France',country_code:'fr'}};
const parisTexas={name:'Paris',lat:'33.6609',lon:'-95.5555',class:'place',type:'city',addresstype:'city',
 display_name:'Paris, Texas, United States',address:{city:'Paris',state:'Texas',country:'United States',country_code:'us'}};
const calls=[];
globalThis.fetch=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));calls.push(u);
 if(u.hostname==='nominatim.openstreetmap.org')return Response.json([parisFrance,parisTexas]);
 if(u.hostname==='api.geoapify.com'&&u.pathname==='/v2/places'){
  const center=u.searchParams.get('filter');
  const texas=center.includes('-95.5555');
  return Response.json({features:[{
   type:'Feature',geometry:{type:'Point',coordinates:texas?[-95.5555,33.6609]:[2.3522,48.8566]},
   properties:{name:texas?'Test Restaurant Texas':'Test Restaurant France',
    categories:['catering.restaurant'],datasource:{raw:{amenity:'restaurant'}}}
  }]});
 }
 if(u.hostname==='photon.komoot.io')return Response.json({features:[]});
 throw Error('Unexpected '+u.href);
};
const ask=async(message,extras={})=>{
 const resp=await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',
  headers:{'content-type':'application/json'},
  body:JSON.stringify({message,module:'travel',language:'ro',history:[],...extras})}),
  {GEOAPIFY_API_KEY:'mock',SMART_COUNTRY_REGISTRY_ENABLED:'true',
   AI:{run:async()=>{throw Error('No model needed')}}});
 assert.equal(resp.status,200);return resp.json();
};
try{
 const request='Caută restaurante în Paris';
 let first=await ask(request);
 assert.equal(first.needs_location_clarification,true);
 assert.equal(first.destination_candidates.length,2);
 assert.equal(first.place_context.category,'restaurant');
 assert.equal(first.place_context.destination,'Paris');
 assert.equal(first.places.length,0);
 assert.equal(calls.filter(u=>u.pathname==='/v2/places').length,0);
 // The existing frontend location chooser accepts destination_candidates and
 // has native-table click handling, forwarding the chosen query to /api/chat.
 const html=await (await frontend.fetch(new Request('https://test.invalid/'))).text();
 const browserScript=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
 assert.ok(browserScript.includes('function appendConversationChoices(data,host)'));
 assert.ok(browserScript.includes("option.value||option.query||option.label"));
 assert.ok(browserScript.includes('place_context:state.placeSearchContext||null'));
 new vm.Script(browserScript);
 const candidate=first.destination_candidates.find(x=>x.country_code==='FR');
 assert.ok(candidate);
 calls.length=0;
 const resumed=await ask(candidate.query,{
  place_context:first.place_context,
  history:[{role:'user',content:request},{role:'assistant',content:first.reply}]
 });
 assert.equal(resumed.search_ok,true,resumed.reply);
 assert.equal(resumed.place_context.category,'restaurant');
 assert.ok(resumed.places.some(x=>x.name==='Test Restaurant France'));
 assert.equal(resumed.search_center.latitude,48.8566);
 assert.equal(calls.filter(u=>u.pathname==='/search').length,0,'Do not repeat geocoding once user chooses verified result');
 // Repeated name in a different country must not be silently replaced by phone GPS.
 const chosenTexas=first.destination_candidates.find(x=>x.country_code==='US');
 assert.ok(chosenTexas);
 const resumedTexas=await ask(chosenTexas.query,{
  place_context:first.place_context,
  history:[{role:'user',content:request},{role:'assistant',content:first.reply}]
 });
 assert.ok(resumedTexas.places.some(x=>x.name==='Test Restaurant Texas'));
}finally{globalThis.fetch=original;}
console.log('PASS preserved restaurant intent, ambiguous Paris table and explicit country selection');
