import assert from 'node:assert/strict';
import worker from './backend.js';
import {nearbySparseMapPlaces} from './osm_sparse_places.mjs';

const original=globalThis.fetch;
let category='parking',overpassCalls=0,photonCalls=0,geoapifyCalls=0;
const origin={latitude:51.4775,longitude:0.3007,accuracy:20};
const osmFeature=(name,key,value,lat,lon)=>({
 type:'way',id:123,center:{lat,lon},
 tags:{name,...{[key]:value},'addr:street':'Dock Road'}
});
globalThis.fetch=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));
 if(u.hostname==='api.geoapify.com'){
  geoapifyCalls++;
  assert.equal(u.searchParams.get('limit'),'80');
  const circle=u.searchParams.get('filter')||'';
  assert.match(circle,/,5000$/);
  // A provider failure must NOT be described as "no locations exist".
  return ['parking','parking-photon','empty-failed'].includes(category)?new Response('unavailable',{status:503}):
   Response.json({features:[]});
 }
 if(u.hostname==='photon.komoot.io'){
  photonCalls++;
  if(category!=='parking-photon')throw Error('Do not query Photon when Overpass is healthy');
  return Response.json({features:[
   {type:'Feature',geometry:{type:'Point',coordinates:[0.302,51.478]},
    properties:{name:'',osm_key:'amenity',osm_value:'parking',street:'Dock Road'}},
   {type:'Feature',geometry:{type:'Point',coordinates:[0.302,51.478]},
    properties:{name:'False park',osm_key:'leisure',osm_value:'park'}}
  ]});
 }
 if(u.hostname==='overpass.private.coffee'){
  overpassCalls++;
  const body=String(input&&typeof input!=='string'?'': '');
  if(category==='parking')return Response.json({elements:[
   osmFeature('','amenity','parking',51.478,0.302)
  ]});
  if(category==='zoo')return Response.json({elements:[
   osmFeature('Wildlife Centre','tourism','zoo',51.478,0.305),
   osmFeature('Wrong park','leisure','park',51.479,0.306)
  ]});
  if(category==='parking-photon')return new Response('unavailable',{status:503});
  return Response.json({elements:[]});
 }
 throw Error('unexpected host '+u.hostname);
};
const request=async cat=>{
 const r=await worker.fetch(new Request('https://unit.test/api/chat',{
  method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
   message:cat==='zoo'?'Găsește grădini zoologice în apropierea mea':'Găsește parcări în apropierea mea',
   place_category:cat,quick_place_search:true,module:'maps',
   language:'ro',location:origin,history:[]
  })
 }),{GEOAPIFY_API_KEY:'mock',AI:{run:async()=>{throw Error('POI must never use LLM')}}});
 assert.equal(r.status,200);
 return r.json();
};
try{
 const parking=await request('parking');
 assert.equal(parking.search_ok,true,parking.reply);
 assert.equal(parking.places.length,1);
 assert.match(parking.places[0].name,/Parcare/);
 assert.equal(parking.search_radius_meters,5000);
 assert.match(parking.source,/OpenStreetMap Overpass/);
 category='zoo';
 const zoo=await request('zoo');
 assert.equal(zoo.search_ok,true,zoo.reply);
 assert.equal(zoo.places.length,1,'Nearby zoo is included without an unrequested radius expansion');
 assert.equal(zoo.places[0].name,'Wildlife Centre');
 assert.equal(zoo.search_radius_meters,5000);
 category='parking-photon';
 const fallback=await request('parking');
 assert.equal(fallback.search_ok,true,fallback.reply);
 assert.equal(fallback.places.length,1,'Only exact OSM amenity=parking is accepted');
 assert.match(fallback.source,/Photon/);
 category='empty-failed';
 const empty=await request('parking');
 assert.equal(empty.search_ok,false);
 assert.equal(empty.results_count,0);
 assert.notEqual(empty.search_error_code,'LOCAL_SEARCH_FAILED',
   'One successfully queried provider returning no results is not a total outage');
 assert.equal(overpassCalls,4);
 assert.equal(photonCalls,1,'Photon is used only after an Overpass outage');
 assert.equal(geoapifyCalls,4);
}finally{globalThis.fetch=original}
console.log('PASS sparse POI: 5km zoo, precise parking recovery with Photon on outage and honest empty results');
