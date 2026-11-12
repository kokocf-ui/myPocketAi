import assert from 'node:assert/strict';
import worker from './backend.js';
import {retailKind,retailCategoryAccepts} from './retail_category.mjs';

assert.equal(retailKind({name:'Tesco Express',shop:'convenience'}),'corner_shop');
assert.equal(retailKind({name:'Aldi',shop:'supermarket'}),'supermarket');
assert.equal(retailKind({name:'Tesco Express',shop:'supermarket'}),'corner_shop');
assert.equal(retailKind({name:'Costco - Hot Deli, Cold Deli, Butchery & Customer Restaurant',shop:'supermarket'}),'not_retail');
assert.equal(retailKind({name:'Kiosk',categories:['commercial.convenience']}),'corner_shop');
assert.equal(retailKind({name:'Big Shop',categories:['commercial.supermarket']}),'supermarket');
assert.equal(retailKind({name:'Coffee counter',osmKey:'amenity',shop:'supermarket'}),'not_retail');
assert.equal(retailCategoryAccepts('supermarket',{name:'Corner shop',shop:'convenience'}),false);
assert.equal(retailCategoryAccepts('corner_shop',{name:'Aldi',shop:'supermarket'}),false);

const original=globalThis.fetch;
const seen=[];
function feature(name,shop,lat,lon){
 const classification=shop==='supermarket'?'commercial.supermarket':'commercial.convenience';
 return {type:'Feature',geometry:{type:'Point',coordinates:[lon,lat]},
  properties:{name,street:'London Road',city:'Grays',categories:[classification],
   datasource:{raw:{shop}}}};
}
const entries=[
 feature('Aldi', 'supermarket',51.478,0.301),
 feature("Sunny's Premier", 'convenience',51.4781,0.3011),
 feature('Tesco Express', 'convenience',51.4778,0.3012),
 feature('Costco - Hot Deli, Cold Deli, Butchery & Customer Restaurant','supermarket',51.4783,0.3013)
];
globalThis.fetch=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||input.toString());
 seen.push(u);
 if(u.hostname==='api.geoapify.com'&&u.pathname==='/v2/places')return Response.json({features:entries});
 if(u.hostname==='photon.komoot.io')return Response.json({features:[
  {type:'Feature',geometry:{type:'Point',coordinates:[0.3008,51.4784]},
   properties:{name:'Independent Grocery',osm_key:'shop',osm_value:'convenience'}},
  {type:'Feature',geometry:{type:'Point',coordinates:[0.3014,51.4785]},
   properties:{name:'Morrisons',osm_key:'shop',osm_value:'supermarket'}},
  {type:'Feature',geometry:{type:'Point',coordinates:[0.3015,51.4786]},
   properties:{name:'Coffee Shop',osm_key:'amenity',osm_value:'cafe'}}
 ]});
 if(u.hostname==='api.ratings.food.gov.uk')return Response.json({establishments:[
  {BusinessName:'Independent Food Store',BusinessType:'Retailers - other',
   FHRSID:1234567,AddressLine2:'433 London Road',AddressLine4:'Grays',
   geocode:{latitude:51.4787,longitude:0.3011}}
 ]});
 throw Error('unexpected fetch '+u.href);
};
const env={GEOAPIFY_API_KEY:'test',AI:{run:async()=>{throw Error('LLM not needed for local POIs')}}};
async function search(place_category,message){
 const response=await worker.fetch(new Request('https://local.test/api/chat',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({message,module:'travel',language:'ro',
   quick_place_search:true,place_category,history:[],
   location:{latitude:51.4775,longitude:0.3007,accuracy:20}})}),env);
 assert.equal(response.status,200,place_category);
 const result=await response.json();
 assert.equal(result.search_ok,true,place_category+' '+result.reply);
 return result;
}
try{
 const small=await search('corner_shop','Găsește băcănii și magazine mici de proximitate în apropierea mea.');
 const superstores=await search('supermarket','Caută supermarketuri, magazine alimentare și brutării în apropierea mea.');
 const s=new Set(small.places.map(x=>x.name)),t=new Set(superstores.places.map(x=>x.name));
 assert.ok(s.has("Sunny's Premier"),'Sunny should be classified as a local small shop');
 assert.ok(s.has('Tesco Express'),'Tesco Express is a small-format shop');
 assert.ok(s.has('Independent Food Store'),'Official FSA shops belong in small retail');
 assert.ok(s.has('Independent Grocery'),'Photon local grocery belongs in small retail');
 assert.ok(!s.has('Aldi')&&!s.has('Morrisons'),'Supermarkets must not fill local small shop list');
 assert.ok(t.has('Aldi')&&t.has('Morrisons'),'Supermarket list must include mapped supermarkets');
 assert.ok(!t.has("Sunny's Premier")&&!t.has('Tesco Express')&&!t.has('Independent Food Store'),
  'Local stores and FSA Retailers-other must not pollute supermarkets');
 assert.ok(!s.has('Costco - Hot Deli, Cold Deli, Butchery & Customer Restaurant'));
 assert.ok(!t.has('Costco - Hot Deli, Cold Deli, Butchery & Customer Restaurant'));
 assert.ok(!s.has('Coffee Shop')&&!t.has('Coffee Shop'));
 assert.ok(![...s].some(name=>t.has(name)),'The two quick selections must not return the same records');
 const fsaCalls=seen.filter(u=>u.hostname==='api.ratings.food.gov.uk');
 assert.equal(fsaCalls.length,1,'FSA is queried only for small shops, not supermarkets');
 assert.ok(seen.some(u=>u.hostname==='api.geoapify.com'));
 assert.ok(seen.some(u=>u.hostname==='photon.komoot.io'));
}finally{globalThis.fetch=original}
console.log('PASS distinct nearby convenience shops and supermarkets, Exa not needed');
