import assert from 'node:assert/strict';
import {foodVenueKind,foodCategoryAccepts,reconcileNearbyPlaces} from './food_location_quality.mjs';
import {nearbyOpenStreetMapFood} from './osm_food_places.mjs';
import worker from './backend.js';
const restaurant={name:'Bistro Local',amenity:'restaurant'};
const takeaway={name:'Super Chicken & Pizza',amenity:'restaurant',cuisine:'chicken'};
assert.equal(foodVenueKind(restaurant),'restaurant');
assert.equal(foodVenueKind(takeaway),'fast_food');
assert.equal(foodVenueKind({name:'Kebab Place',amenity:'fast_food'}),'fast_food');
assert.equal(foodCategoryAccepts('restaurant',takeaway),false);
assert.equal(foodCategoryAccepts('fast_food',takeaway),true);

const rows=[
 {name:'Super Chicken & Pizza',address:'535 London Road, South Stifford, Grays, Essex, RM20 4AD',
  lat:51.4775,lon:0.3003,distanceMeters:122,phone:'',website:'',city:'Grays',street:'London Road',houseNumber:'535',postcode:'RM20 4AD'},
 {name:'Super Chicken',address:'535, London Road, Grays, RM20 4AD',
  lat:51.4785,lon:0.301,distanceMeters:234,phone:'+44 1375 611378',website:'https://example.test',city:'Grays',street:'London Road',houseNumber:'535',postcode:'RM20 4AD'},
 {name:'Independent Sandwich Bar',address:'535 London Road, Grays, RM20 4AD',
  lat:51.4778,lon:0.3006,distanceMeters:155,phone:'',website:'',city:'Grays',street:'London Road',houseNumber:'535',postcode:'RM20 4AD'}
];
const clean=reconcileNearbyPlaces(rows);
assert.equal(clean.length,2,'Alias with same exact address must collapse, separate storefront must remain');
const chicken=clean.find(x=>x.name.includes('Super Chicken'));
assert.equal(chicken.name,'Super Chicken & Pizza');
assert.equal(chicken.distanceMeters,122);
assert.equal(chicken.phone,'+44 1375 611378');
assert.equal(chicken.website,'https://example.test');
assert.ok(clean.some(x=>x.name==='Independent Sandwich Bar'));

const samples=[
 {type:'node',id:1,lat:47.0302,lon:21.9602,tags:{name:'Oradea Doner',amenity:'fast_food','addr:street':'Strada Republicii','addr:housenumber':'11'}},
 {type:'way',id:2,center:{lat:47.0303,lon:21.9603},tags:{name:'Restaurant Clasic',amenity:'restaurant'}},
 {type:'way',id:3,center:{lat:47.0301,lon:21.9601},tags:{name:'Pizzeria Italia',amenity:'restaurant',cuisine:'pizza'}},
 {type:'node',id:4,lat:48.0303,lon:22.9603,tags:{name:'Outside',amenity:'fast_food'}},
 {type:'node',id:5,lat:47.0303,lon:21.9603,tags:{name:'A random shop',amenity:'shop'}}
];
const seen=[],records=new Map(),cache={
 async match(k){return records.get(k)?.clone()||null},
 async put(k,response){records.set(k,response.clone())}
};
const fetching=async(url,opt)=>{
 seen.push({url,opt});assert.equal(new URL(url).hostname,'overpass-api.de');
 assert.match(decodeURIComponent(opt.body),/amenity/);
 return Response.json({elements:samples});
};
const base={latitude:47.03,longitude:21.96,radius:1500,fetcher:fetching,cache};
const small=await nearbyOpenStreetMapFood({...base,category:'fast_food'});
assert.deepEqual(small.map(x=>x.tags.name),['Oradea Doner','Pizzeria Italia']);
const dine=await nearbyOpenStreetMapFood({...base,category:'restaurant'});
assert.deepEqual(dine.map(x=>x.tags.name),['Restaurant Clasic']);
assert.equal(seen.length,1,'One cached request serves both food categories');
assert.deepEqual(await nearbyOpenStreetMapFood({...base,latitude:180,category:'fast_food'}),[]);


const retailItems=[
 {type:'node',id:8,lat:47.031,lon:21.961,tags:{name:'Alimentara de Cartier',shop:'convenience'}},
 {type:'node',id:9,lat:47.0312,lon:21.9612,tags:{name:'Aldi',shop:'supermarket'}},
 {type:'node',id:10,lat:47.0313,lon:21.9613,tags:{name:'Brutăria Veche',shop:'bakery'}}
];
const retailCalls=[];
const retailFetcher=async (url,options)=>{
 retailCalls.push(decodeURIComponent(options.body));
 return Response.json({elements:retailItems});
};
const localShops=await nearbyOpenStreetMapFood({...base,fetcher:retailFetcher,category:'corner_shop'});
const supermarkets=await nearbyOpenStreetMapFood({...base,fetcher:retailFetcher,category:'supermarket'});
const bakeries=await nearbyOpenStreetMapFood({...base,fetcher:retailFetcher,category:'confectionery'});
assert.deepEqual(localShops.map(x=>x.tags.name),['Alimentara de Cartier']);
assert.deepEqual(supermarkets.map(x=>x.tags.name),['Aldi']);
assert.deepEqual(bakeries.map(x=>x.tags.name),['Brutăria Veche']);
assert.equal(retailCalls.length,1,'One area query reused for all retail categories');

const oldFetch=globalThis.fetch;
globalThis.fetch=async(input,opt)=>{
 const host=new URL(typeof input==='string'?input:input.url||String(input)).hostname;
 if(host==='api.geoapify.com')return Response.json({features:[]});
 if(host==='photon.komoot.io')return Response.json({features:[]});
 if(host==='overpass-api.de')return Response.json({elements:samples});
 if(host==='api.ratings.food.gov.uk')throw Error('UK-only FSA queried outside UK');
 throw Error('Unexpected provider '+host);
};
try{
 const run=async category=>{
  const response=await worker.fetch(new Request('https://unit.test/api/chat',{
   method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({message:category==='fast_food'?'Caută shaormerii în apropierea mea':'Caută restaurante în apropierea mea',
   language:'ro',module:'travel',quick_place_search:true,place_category:category,history:[],
   location:{latitude:47.03,longitude:21.96,accuracy:20}})
  }),{GEOAPIFY_API_KEY:'mock',OSM_WORLD_FOOD_ENABLED:'true',AI:{run:async()=>{throw Error('No LLM')}}});
  assert.equal(response.status,200);
  return response.json();
 };
 const fast=await run('fast_food'),regular=await run('restaurant');
 assert.equal(fast.search_ok,true,fast.reply);
 assert.equal(regular.search_ok,true,regular.reply);
 assert.ok(fast.places.some(x=>x.name==='Oradea Doner'));
 assert.ok(!fast.places.some(x=>x.name==='Restaurant Clasic'));
 assert.ok(regular.places.some(x=>x.name==='Restaurant Clasic'));
 assert.ok(!regular.places.some(x=>x.name==='Oradea Doner'));
 assert.match(fast.source,/OpenStreetMap Overpass/);
}finally{globalThis.fetch=oldFetch}
console.log('PASS category exclusivity, same-address aliases, OSM global fallback and scoped cache');
