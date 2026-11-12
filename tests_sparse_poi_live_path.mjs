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
  return ['parking','photon'].includes(category)?new Response('unavailable',{status:503}):
   Response.json({features:[]});
 }
 if(u.hostname==='photon.komoot.io'){
  photonCalls++;
  if(category==='photon')return Response.json({features:[{
   type:'Feature',geometry:{type:'Point',coordinates:[0.302,51.478]},
   properties:{name:'Short Stay Car Park',osm_key:'amenity',osm_value:'parking'}
  }]});
  return Response.json({features:[]});
 }
 if(u.hostname==='overpass.private.coffee'){
  overpassCalls++;
  const body=String(input&&typeof input!=='string'?'': '');
  if(category==='parking')return Response.json({elements:[
   osmFeature('','amenity','parking',51.478,0.302)
  ]});
  if(category==='zoo')return Response.json({elements:[
   osmFeature('Wildlife Centre','tourism','zoo',51.478,0.305),
   osmFeature('Wrong park','leisure','park',51.479,0.306),
   osmFeature('M25','tourism','zoo',51.479,0.307)
  ]});
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
 category='photon';
 const alreadyCalled=overpassCalls;
 const recovered=await request('parking');
 assert.equal(recovered.search_ok,true,recovered.reply);
 assert.ok(recovered.places.some(x=>x.name==='Short Stay Car Park'));
 assert.match(recovered.source,/Photon/);
 assert.equal(overpassCalls,alreadyCalled,'Photon success must bypass slow Overpass fallback');
 category='zoo';
 const zoo=await request('zoo');
 assert.equal(zoo.search_ok,true,zoo.reply);
 assert.equal(zoo.places.length,1,'M25 must be excluded despite a mislabeled OSM zoo tag');
 assert.equal(zoo.places[0].name,'Wildlife Centre');
 assert.equal(zoo.search_radius_meters,5000);
 category='empty';
 const empty=await request('parking');
 assert.equal(empty.search_ok,false);
 assert.equal(empty.results_count,0);
 assert.notEqual(empty.search_error_code,'LOCAL_SEARCH_FAILED',
   'One successfully queried provider returning no results is not a total outage');
 assert.equal(overpassCalls,3);
 assert.equal(photonCalls,3,'Both parking searches and empty-case use Photon; zoo skips Photon');
 assert.equal(geoapifyCalls,4);
}finally{globalThis.fetch=original}
console.log('PASS sparse POI: parking via existing Photon, nearby 5km Zoo and M25 rejection');
