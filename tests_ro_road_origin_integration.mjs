import assert from 'node:assert/strict';
import {test} from 'node:test';
import worker from './backend.js';
import {webcrypto} from 'node:crypto';
globalThis.crypto??=webcrypto;

test('explicit road Oradea-Cluj never starts from UK GPS',async()=>{
 const savedFetch=globalThis.fetch;
 const points=[];
 const geo=(name,lat,lon)=>({type:'Feature',properties:{
  name,city:name,formatted:name+', România',lat,lon,result_type:'city',country_code:'ro'
 },geometry:{type:'Point',coordinates:[lon,lat]}});
 globalThis.fetch=async input=>{
  const u=new URL(input);
  if(u.hostname!=='api.geoapify.com')throw Error('unexpected '+u.hostname);
  if(u.pathname.includes('/geocode/search')){
   const q=u.searchParams.get('text')||'';
   if(/oradea/i.test(q))return Response.json({features:[geo('Oradea',47.0465,21.9189)]});
   if(/cluj/i.test(q))return Response.json({features:[geo('Cluj-Napoca',46.7712,23.6236)]});
   return Response.json({features:[]});
  }
  if(u.pathname==='/v1/routing'){
   const waypoints=u.searchParams.get('waypoints')?.split('|');
   if(waypoints)points.push(waypoints.map(x=>x.split(',').map(Number)));
   assert.equal(u.searchParams.get('mode'),'drive');
   return Response.json({features:[{
    type:'Feature',properties:{distance:161000,time:8400,distance_units:'meters',legs:[]},
    geometry:{type:'LineString',coordinates:[[21.9189,47.0465],[23.6236,46.7712]]}
   }]});
  }
  throw Error('Unexpected Geoapify path: '+u.pathname);
 };
 try{
  const res=await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',
   headers:{'content-type':'application/json'},
   body:JSON.stringify({
    message:'Arată-mi traseul cu mașina din Oradea la Cluj-Napoca.',
    language:'ro',module:'assistant',history:[],
    location:{latitude:51.48,longitude:0.33,updatedAt:Date.now()},
    coordinates:{latitude:51.48,longitude:0.33}
   })
  }),{GEOAPIFY_API_KEY:'test',AI:{run:async()=>({response:'mock'})}});
  const data=await res.json();
  assert.equal(data.status,'success');
  assert.equal(data.route_available,true,JSON.stringify(data).slice(0,500));
  assert.ok(points.length);
  for(const pair of points){
   assert.ok(Math.abs(pair[0][0]-47.0465)<0.1,'origin must be in Oradea, not UK GPS');
   assert.ok(Math.abs(pair[0][1]-21.9189)<0.1);
   assert.ok(Math.abs(pair.at(-1)[0]-46.7712)<0.1);
  }
 }finally{globalThis.fetch=savedFetch;}
});