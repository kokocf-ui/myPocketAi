import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import worker from './backend.js';
globalThis.crypto??=webcrypto;
const old={info:console.info,warn:console.warn,error:console.error};
console.info=console.warn=console.error=()=>{};
const gps={latitude:51.49,longitude:0.28,updatedAt:Date.now()};
const fixtures=[
 ['Dinner Restaurant','catering.restaurant','restaurant',null],
 ['Local Tea Room','catering.cafe','cafe',null],
 ['Local Pub','catering.pub','pub',null],
 ['Corner Shop','commercial.convenience',null,'convenience'],
 ['Big Supermarket','commercial.supermarket',null,'supermarket'],
 ['Neighbourhood Bakery','commercial.food_and_drink.bakery',null,'bakery']
].map(([name,category,amenity,shop],i)=>({
 type:'Feature',geometry:{coordinates:[0.28+i*.001,51.49+i*.001]},
 properties:{name,lat:51.49+i*.001,lon:0.28+i*.001,
  categories:[category],datasource:{raw:{amenity,shop}},street:'Market Road'}
}));
const calls=[];
globalThis.fetch=async input=>{
 const url=new URL(input);calls.push(url);
 if(url.pathname==='/v2/places')return Response.json({features:fixtures});
 if(url.hostname==='photon.komoot.io')return Response.json({features:[]});
 if(url.pathname==='/v1/geocode/reverse')return Response.json({features:[]});
 throw Error('Unexpected provider '+url.hostname+url.pathname);
};
const env={GEOAPIFY_API_KEY:'fixture'};
async function search(message){
 calls.length=0;
 const res=await worker.fetch(new Request('https://fixture/api/chat',{method:'POST',body:JSON.stringify({
  message,module:'travel',quick_place_search:true,language:'ro',history:[],location:gps
 })}),env);
 return res.json();
}
try{
 const restaurants=await search('Găsește restaurante în apropierea mea');
 assert.equal(restaurants.status,'success');
 assert.ok(restaurants.places.some(p=>p.name==='Dinner Restaurant'));
 assert.ok(!restaurants.places.some(p=>/Tea Room|Local Pub/.test(p.name)),
  'cafes and pubs must not appear under restaurant');
 const cafes=await search('Găsește cafenele în apropierea mea');
 assert.equal(cafes.status,'success');
 assert.ok(cafes.places.some(p=>p.name==='Local Tea Room'));
 assert.ok(!cafes.places.some(p=>/Dinner Restaurant|Local Pub/.test(p.name)),
  'restaurants and pubs must not appear under cafe/tea room');
 const markets=await search('Găsește supermarketuri și magazine alimentare în apropierea mea');
 assert.equal(markets.status,'success');
 assert.ok(markets.places.some(p=>p.name==='Corner Shop'),
  'convenience shops must not be hidden by supermarket-only category');
 assert.ok(markets.places.some(p=>p.name==='Big Supermarket'));
 assert.ok(!markets.places.some(p=>p.name==='Dinner Restaurant'));
}finally{console.info=old.info;console.warn=old.warn;console.error=old.error}
console.log('PASS: restaurant excludes cafes/pubs; cafe excludes restaurants; market includes local convenience and supermarkets.');
