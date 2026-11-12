import assert from 'node:assert/strict';
import worker from './backend.js';
import {photonNearbyUrl,photonCategoryFilters} from './photon_category_discovery.mjs';
const places=[
 ['RO',47.03,21.96],['IT',45.464,9.19],['ES',40.4168,-3.7038],
 ['FR',48.8566,2.3522],['DE',52.52,13.405],['GR',37.9838,23.7275],
 ['PL',52.2297,21.0122],['TR',41.0082,28.9784]
];
for(const [code,lat,lon] of places)for(const cat of ['restaurant','fast_food','corner_shop','supermarket']){
 const u=photonNearbyUrl({latitude:lat,longitude:lon,radius:5000,category:cat});
 assert.equal(u.hostname,'photon.komoot.io');
 assert.ok(u.searchParams.get('include')?.startsWith('osm.'),code+' '+cat);
 assert.equal(u.searchParams.has('q'),false,code+' must not rely on English business names');
 const bbox=u.searchParams.get('bbox').split(',').map(Number);
 assert.ok(bbox[0]<lon&&bbox[2]>lon&&bbox[1]<lat&&bbox[3]>lat,code);
}
assert.ok(photonCategoryFilters('fast_food').includes('osm.amenity.restaurant'));
assert.ok(photonCategoryFilters('restaurant').includes('osm.amenity.fast_food'));
const legacy=photonNearbyUrl({latitude:47.03,longitude:21.96,radius:1000,
 category:'fast_food',useCategories:false});
assert.ok(legacy.searchParams.has('q')&&!legacy.searchParams.has('include'));
const sourceFetch=globalThis.fetch,calls=[];
globalThis.fetch=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));calls.push(u);
 if(u.hostname==='api.geoapify.com')return Response.json({features:[]});
 if(u.hostname==='photon.komoot.io')return Response.json({features:[
  {type:'Feature',geometry:{type:'Point',coordinates:[9.1904,45.4643]},
   properties:{name:'Pizzeria Roma',osm_key:'amenity',osm_value:'restaurant'}},
  {type:'Feature',geometry:{type:'Point',coordinates:[9.1905,45.4645]},
   properties:{name:'Ristorante Centrale',osm_key:'amenity',osm_value:'restaurant'}},
  {type:'Feature',geometry:{type:'Point',coordinates:[9.1906,45.4646]},
   properties:{name:'Alimentari',osm_key:'shop',osm_value:'convenience'}}
 ]});
 if(u.hostname==='api.ratings.food.gov.uk')throw Error('UK-only provider outside UK');
 throw Error('Unknown provider '+u.hostname);
};
try{
 const run=async cat=>{
  const res=await worker.fetch(new Request('https://unit.test/api/chat',{
   method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
    message:'Găsește locuri în apropierea mea',module:'travel',
    language:'ro',place_category:cat,quick_place_search:true,history:[],
    location:{latitude:45.464,longitude:9.19,accuracy:20}
   })
  }),{GEOAPIFY_API_KEY:'mock',AI:{run:async()=>{throw Error('Not needed')}}});
  assert.equal(res.status,200);
  const body=await res.json();assert.equal(body.search_ok,true,body.reply);
  return body.places.map(p=>p.name);
 };
 const fast=await run('fast_food'),restaurant=await run('restaurant'),shop=await run('corner_shop');
 assert.ok(fast.includes('Pizzeria Roma'));
 assert.ok(!fast.includes('Ristorante Centrale'));
 assert.ok(restaurant.includes('Ristorante Centrale'));
 assert.ok(!restaurant.includes('Pizzeria Roma'));
 assert.ok(shop.includes('Alimentari'));
 assert.ok(calls.some(u=>u.hostname==='photon.komoot.io'&&u.searchParams.has('include')));
}finally{globalThis.fetch=sourceFetch}
console.log('PASS worldwide category-driven Photon lookup RO/IT/ES/FR/DE/GR/PL/TR');
