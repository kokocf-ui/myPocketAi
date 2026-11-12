import assert from 'node:assert/strict';
import worker from './backend.js';
import {nearbyUkRegisteredTakeaways} from './uk_food_retailers.mjs';

const seen=[];
const fsa=async url=>{
 const u=new URL(url);seen.push(u);
 assert.equal(u.searchParams.get('businessTypeId'),'7844');
 return Response.json({establishments:[{
   FHRSID:123456,BusinessName:'Operator Ltd',BusinessType:'Takeaway/sandwich shop',
   AddressLine1:'Grays Kebab House',AddressLine2:'15 London Road',AddressLine4:'Grays',
   PostCode:'RM20 4AB',geocode:{latitude:51.4777,longitude:0.301}
 }],meta:{totalPages:1}});
};
const shops=await nearbyUkRegisteredTakeaways(51.4775,0.3007,1500,{fetcher:fsa});
assert.equal(shops.length,1);
assert.equal(shops[0].tags.name,'Grays Kebab House');
assert.equal(shops[0].tags.fsa_registered_name,'Operator Ltd');
assert.equal(shops[0].tags.amenity,'fast_food');
assert.deepEqual(await nearbyUkRegisteredTakeaways(47.03,21.96,1500,{fetcher:async()=>{throw Error('Unexpected UK API in Romania')}}),[]);

const original=globalThis.fetch,hosts=[];
globalThis.fetch=async (input,opts)=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));
 hosts.push(u.hostname);
 if(u.hostname==='api.ratings.food.gov.uk')return fsa(u.href);
 if(u.hostname==='api.geoapify.com')return Response.json({features:[
  {type:'Feature',geometry:{type:'Point',coordinates:[0.3008,51.4776]},
   properties:{name:'Super Chicken',categories:['catering.restaurant'],
   datasource:{raw:{amenity:'restaurant',cuisine:'fried_chicken'}}}},
  {type:'Feature',geometry:{type:'Point',coordinates:[0.3009,51.47765]},
   properties:{name:'Fine Dining Restaurant',categories:['catering.restaurant'],
   datasource:{raw:{amenity:'restaurant',cuisine:'fine_dining'}}}}
 ]});
 if(u.hostname==='photon.komoot.io')return Response.json({features:[
  {type:'Feature',geometry:{type:'Point',coordinates:[0.3009,51.478]},
   properties:{name:'Pizza Corner',osm_key:'amenity',osm_value:'fast_food'}},
  {type:'Feature',geometry:{type:'Point',coordinates:[0.301,51.4781]},
   properties:{name:'Road Place',osm_key:'highway',osm_value:'residential'}}
 ]});
 throw Error('Unexpected host '+u.hostname);
};
try{
 const response=await worker.fetch(new Request('https://unit.test/api/chat',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({message:'Găsește pizzerii și shaormerii în apropierea mea.',
   place_category:'fast_food',quick_place_search:true,module:'travel',language:'ro',
   location:{latitude:51.4775,longitude:0.3007,accuracy:20},history:[]})
 }),{GEOAPIFY_API_KEY:'test',AI:{run:async()=>{throw Error('No model needed')}}});
 assert.equal(response.status,200);
 const out=await response.json();
 assert.equal(out.search_ok,true,out.reply);
 const names=out.places.map(x=>x.name);
 for(const name of ['Grays Kebab House','Super Chicken','Pizza Corner'])
  assert.ok(names.includes(name),name+' missing: '+names.join(','));
 assert.ok(!names.includes('Fine Dining Restaurant'));
 assert.ok(!names.includes('Road Place'));
 assert.match(out.source,/UK Food Standards Agency takeaways/);
 for(const host of ['api.geoapify.com','photon.komoot.io','api.ratings.food.gov.uk'])
  assert.ok(hosts.includes(host),host);
}finally{globalThis.fetch=original}
console.log('PASS multi-source fast-food search, FSA trading names and country restriction');
