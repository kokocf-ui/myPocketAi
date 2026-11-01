import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import worker from './backend.js';
globalThis.crypto??=webcrypto;
const old={info:console.info,warn:console.warn,error:console.error};
console.info=console.warn=console.error=()=>{};
const stop={latitude:51.49,longitude:.28,label:'Verified last TfL bus stop'};
const poi={latitude:51.491,longitude:.283,label:'Example hotel, London Road'};
const calls=[];
globalThis.fetch=async input=>{
 const url=new URL(input);calls.push(url);
 if(url.pathname==='/v1/routing'){
  assert.equal(url.searchParams.get('mode'),'walk');
  const pts=url.searchParams.get('waypoints').split('|');
  assert.equal(pts[0],stop.latitude+','+stop.longitude,'must start at actual last vehicle stop, not GPS');
  assert.equal(pts.at(-1),poi.latitude+','+poi.longitude,'must end at original POI');
  const coords=pts.map(p=>{const [lat,lon]=p.split(',').map(Number);return [lon,lat]});
  return Response.json({features:[{
    geometry:{type:'LineString',coordinates:coords},
    properties:{distance:620,time:470,distance_units:'meters',
      legs:[{steps:[{distance:620,instruction:{text:'Continue to the final destination'}}]}]}
  }]});
 }
 if(url.pathname==='/v2/places')return Response.json({features:[]});
 if(url.pathname==='/v1/geocode/search')return Response.json({features:[]});
 throw Error('Unexpected provider '+url.hostname+url.pathname);
};
try{
 const result=await(await worker.fetch(new Request('https://fixture/api/chat',{method:'POST',body:JSON.stringify({
  message:'Pe jos',language:'ro',module:'assistant',history:[],
  route_profile:'walk',route_destination:poi,
  route_context:{profile:'walk',destination_query:poi.label,origin:stop,destination:poi,pending:null}
 })}),{GEOAPIFY_API_KEY:'fixture',AI:{run:async()=>({response:'fixture'})}})).json();
 assert.equal(result.status,'success');
 assert.equal(result.route_available,true);
 assert.equal(result.route.origin.latitude,stop.latitude);
 assert.equal(result.route.origin.longitude,stop.longitude);
 assert.equal(result.route.destination.latitude,poi.latitude);
 assert.equal(result.route.destination.longitude,poi.longitude);
 assert.equal(result.route.profile,'walk');
 assert.ok(calls.some(u=>u.pathname==='/v1/routing'));
}finally{console.info=old.info;console.warn=old.warn;console.error=old.error}
console.log('PASS: planned last-mile walk from verified TfL alighting stop to original POI with no current GPS.');
