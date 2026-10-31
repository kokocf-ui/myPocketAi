import assert from 'node:assert/strict';
import worker from './backend.js';
import {webcrypto} from 'node:crypto';globalThis.crypto??=webcrypto;
const origin={latitude:51.48,longitude:.28,updatedAt:Date.now()},destination={latitude:51.488,longitude:.283,label:'Mapped shopping centre'};
let mode='good',calls=[];
const point={latitude:51.484,longitude:.29};
const baseGeometry=[[.28,51.48],[.28,51.488],[.283,51.488]],bridgeGeometry=[[.2899,51.48396],[.29,51.484],[.2898,51.484114]];
const oldWarn=console.warn,oldInfo=console.info;console.warn=()=>{};console.info=()=>{};
globalThis.fetch=async input=>{
 const u=new URL(input);calls.push(u);
 if(u.pathname==='/v2/places'){
  if(mode==='unavailable')return new Response('',{status:503});
  const station=u.searchParams.get('categories').startsWith('public_transport');
  if(station)return Response.json({features:[]});
  const id=mode==='osmfail'?'123457':'123456';
  return Response.json({features:[{properties:{name:'Pedestrian bridge',lat:point.latitude,lon:point.longitude,categories:['highway.footway'],datasource:{raw:{bridge:'yes',highway:'footway',osm_type:'way',osm_id:id,...(mode==='private'?{access:'private'}:{})}}}},{properties:{name:'Neighbourhood centre is never a walking access',lat:51.489,lon:.281,categories:['populated_place.suburb']}}]});
 }
 if(u.hostname==='api.openstreetmap.org'){
  if(mode==='osmfail')return new Response('',{status:503});
  return Response.json({elements:[...bridgeGeometry.map((p,i)=>({type:'node',id:i,lon:p[0],lat:p[1]})),{type:'way',id:123456,tags:{highway:'footway',bridge:'yes'},nodes:[0,1,2]}]});
 }
 if(u.pathname==='/v1/routing'){
  const waypoints=u.searchParams.get('waypoints').split('|').map(s=>s.split(',').map(Number)),auto=waypoints.length>2;
  const geometry=auto&&mode!=='ignored'?[[.28,51.48],...bridgeGeometry,[.283,51.488]]:u.searchParams.get('type')==='short'?[[.28,51.48],[.28001,51.488],[.283,51.488]]:baseGeometry;
  return Response.json({features:[{geometry:{type:'LineString',coordinates:geometry},properties:{distance:auto?(mode==='detour'?4700:1800):2200,time:auto?1500:1920,distance_units:'meters',legs:[{steps:[{distance:auto?900:1300,instruction:{text:auto?'Mergi pe Mayflower Road.':'Mergi pe London Road.',streets:[auto?'Mayflower Road':'London Road']}},{distance:500,instruction:{text:'Ai ajuns.',streets:[]}}]}]}}]});
 }
 throw Error('Unexpected host '+u.hostname);
};
const env={GEOAPIFY_API_KEY:'fixture',AI:{run:()=>{throw Error('Walking alternatives must never be invented by AI')}}};
async function ask(extra={}){calls=[];const d=await(await worker.fetch(new Request('https://pocket.test/api/chat',{method:'POST',body:JSON.stringify({message:'Traseu pietonal până la centrul comercial',language:'ro',location:origin,route_destination:destination,route_profile:'walk',history:[],...extra})}),env)).json();return d;}
let d=await ask();assert.equal(d.route_available,true);assert.equal(d.routes.length,2,'near-identical balanced/short routes collapse');assert.equal(d.route.distanceMeters,1800,'shortest verified walking option is first');assert.equal(d.route.access_kind,'footbridge');assert.ok(d.route.label.startsWith('Prin pasarelă'));assert.ok(d.route.label.includes('Mayflower Road'));assert.deepEqual(d.route.destination,destination);assert.equal(d.route.via.length,1);assert.equal(d.walking_access_candidates,1);assert.equal(d.route_context.pending,null);assert.ok(!d.needs_via_clarification);assert.ok(d.reply.includes('OpenStreetMap'));
assert.ok(calls.filter(u=>u.pathname==='/v1/routing').every(u=>u.searchParams.get('mode')==='walk'));assert.equal(calls.filter(u=>u.pathname==='/v1/routing').length,3,'bounded calculation count');assert.ok(!calls.some(u=>u.pathname==='/v1/geocode/search'),'no invented neighbourhood or landmark geocode');assert.ok(calls.filter(u=>u.pathname==='/v2/places').every(u=>u.searchParams.get('filter')==='circle:0.283,51.488,1100'));
const rc=d.route_context;
mode='detour';d=await ask();assert.equal(d.routes.length,1);assert.equal(d.route.distanceMeters,2200);assert.ok(!d.routes.some(v=>v.distanceMeters===4700),'large automatic detour is never offered');
mode='ignored';d=await ask();assert.equal(d.routes.length,1);assert.ok(!d.routes.some(v=>v.automatic),'snapped route that misses the walking access is rejected');
mode='private';d=await ask();assert.equal(d.walking_access_candidates,0);assert.equal(d.routes.length,1);assert.equal(calls.filter(u=>u.pathname==='/v1/routing').length,2);
mode='unavailable';d=await ask();assert.equal(d.route_available,true);assert.equal(d.walking_alternatives_status,'unavailable');assert.equal(d.routes.length,1);
mode='osmfail';d=await ask();assert.equal(d.route_available,true);assert.ok(!d.routes.some(v=>v.label.includes('pasarelă')),'bridge label requires mapped bridge geometry validation');
mode='good';d=await ask({message:'Caută alte trasee pietonale',route_destination:undefined,route_profile:undefined,route_compare:true,route_context:{...rc,via_query:'Chafford Hundred neighbourhood centre',via:{latitude:51.499,longitude:.29,label:'Old area centroid'}}});assert.equal(d.route_available,true);assert.equal(d.route_context.via_query,'');assert.equal(d.route_context.via,null);assert.equal(d.route.distanceMeters,1800);
console.warn=oldWarn;console.info=oldInfo;console.log('PASS: automatic pedestrian discovery, same endpoints, meaningful corridor dedup, shortest verified first, excessive detour/private/area-centre/snapping rejection, footbridge geometry proof, discovery failure isolation and old waypoint clearing.');
