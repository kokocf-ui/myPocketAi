import assert from 'node:assert/strict';
import worker from './backend.js';
import {webcrypto} from 'node:crypto';
globalThis.crypto ??= webcrypto;
const gps={latitude:51.49,longitude:0.28};
const entries=[['Park Green','leisure.park','park'],['County Museum','entertainment.museum','museum'],['Local Zoo','entertainment.zoo','zoo'],['Home Stadium','leisure.stadium','stadium'],['Tea Cottage','catering.cafe','cafe'],['Old Pub','catering.pub','pub']];
const features=entries.map(([name,category,value],i)=>({type:'Feature',geometry:{coordinates:[.28+i*.001,51.49+i*.001]},properties:{name,categories:[category],datasource:{raw:{amenity:value,tourism:value,leisure:value}}}}));
globalThis.fetch=async input=>{const u=new URL(input);if(u.pathname==='/v2/places')return Response.json({features});if(u.hostname==='photon.komoot.io')return Response.json({features:[]});if(u.pathname==='/v1/geocode/reverse')return Response.json({features:[]});throw Error(u.href)};
const env={GEOAPIFY_API_KEY:'fixture',AI:{run:async()=>({response:'ok'})}};
const keep={info:console.info,warn:console.warn};console.info=console.warn=()=>{};
async function find(message){const response=await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',body:JSON.stringify({message,module:'maps',quick_place_search:true,location:gps,language:'ro',history:[]})}),env);return response.json()}
try{
for(const [phrase,expected] of [['Găsește muzee în apropierea mea','County Museum'],['Găsește parcuri în apropierea mea','Park Green'],['Găsește grădini zoologice sau zoo în apropierea mea','Local Zoo'],['Găsește stadioane în apropierea mea','Home Stadium'],['Caută baruri, puburi, ceainării și cafenele în apropierea mea','Old Pub']]){const v=await find(phrase);assert.equal(v.status,'success',phrase);assert.ok(v.places?.some(p=>p.name===expected),phrase+' missing '+expected)}
}finally{console.info=keep.info;console.warn=keep.warn}
console.log('PASS new map categories: museums, parks, zoos, stadiums and pubs');
