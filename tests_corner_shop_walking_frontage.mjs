import assert from 'node:assert/strict';
import worker from './backend.js';
import {cornerShopFrontageRoute} from './corner_shop_walking_frontage.mjs';
import {walkingAddressFromLabel} from './walking_address_arrival.mjs';
import {readFileSync} from 'node:fs';

const label="Sunny's, Sunny's, 433 London Road, South Stifford, Grays, RM20 4AB";
const address=walkingAddressFromLabel(label);
assert.equal(address.street,'London Road');
const pin={latitude:51.4802,longitude:0.2802};
const coords=[
 [0.2790,51.4790],[0.2800,51.4798],[0.28018,51.4802],
 [0.2812,51.4804],[0.2814,51.4807]
];
const base={
 id:'balanced',label:'Standard',profile:'walk',origin:{latitude:51.479,longitude:.279},
 destination:{...pin,label},coordinates:coords,distanceMeters:280,durationSeconds:240,
 via:[],steps:[
  {number:1,text:'Mergi pe Mill Lane',streets:['Mill Lane'],distanceMeters:70,fromIndex:0,toIndex:1},
  {number:2,text:'Virează la stânga pe London Road',streets:['London Road'],distanceMeters:105,fromIndex:1,toIndex:2},
  {number:3,text:'Virează la stânga pe Palmerston Road',streets:['Palmerston Road'],distanceMeters:40,fromIndex:2,toIndex:3},
  {number:4,text:'Virează la dreapta',streets:[],distanceMeters:36,fromIndex:3,toIndex:4}
 ]
};
const repaired=cornerShopFrontageRoute(base,address,pin);
assert.ok(repaired,'Geoapify-street-indexed approach can be recovered');
assert.deepEqual(repaired.coordinates,coords.slice(0,3));
assert.equal(repaired.destination.longitude,.28018);
assert.equal(repaired.frontage_street,'London Road');
assert.ok(repaired.frontage_distance_m<10);
assert.ok(repaired.steps.some(s=>s.text.includes('London Road')));
assert.ok(repaired.steps.every(s=>!s.text.includes('Palmerston Road')),'Wrong turn is never displayed');
assert.ok(repaired.steps.at(-1).text.includes('estimată'),'Never claim a mapped road vertex is the confirmed door');
assert.equal(cornerShopFrontageRoute({...base,steps:base.steps.map(({fromIndex,toIndex,...s})=>s)},address,pin),null,
 'No geometry indices means no manufactured shortcut');
assert.equal(cornerShopFrontageRoute({...base,profile:'drive'},address,pin),null);
assert.equal(cornerShopFrontageRoute({...base,via:[{latitude:1,longitude:1}]},address,pin),null);
assert.equal(cornerShopFrontageRoute({...base,steps:base.steps.map(s=>({...s,streets:['Palmerston Road']}))},address,pin),null);
assert.equal(cornerShopFrontageRoute(base,address,{latitude:51.490,longitude:.290}),null,
 'Far-away address cannot borrow a similarly named road');

const frontend=readFileSync('index.js','utf8');
assert.match(frontend,/const cornerShopWalk=travelMode==='walk'&&state\.navigationReturnContext\?\.choice\?\.placeCategory==='corner_shop'/,
 'Only the Băcănii walking click enables frontage repair');
assert.match(frontend,/corner_shop_walk:cornerShopWalk/);
const backend=readFileSync('backend.js','utf8');
assert.match(backend,/!arrivalCandidates\.length&&data\.corner_shop_walk===true/);
assert.match(backend,/cornerShopFrontageRoute\(/);

const oldFetch=globalThis.fetch;
let indexed=true,externalCalls=[];
globalThis.fetch=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));
 externalCalls.push(u);
 if(u.pathname==='/v2/places')return Response.json({features:[]});
 if(u.pathname==='/v1/geocode/search')return Response.json({
  features:[{properties:{housenumber:'433',street:'Palmerston Road',postcode:'RM20 4AB',lat:51.4803,lon:.2812}}]
 });
 if(u.pathname==='/v1/routing'){
  const routeSteps=base.steps.map(s=>({distance:s.distanceMeters,
   ...(indexed?{from_index:s.fromIndex,to_index:s.toIndex}:{}),
   instruction:{text:s.text,streets:s.streets}}));
  return Response.json({features:[{geometry:{type:'MultiLineString',coordinates:[coords]},
   properties:{distance:280,time:240,distance_units:'meters',legs:[{steps:routeSteps}]}}]});
 }
 if(u.hostname==='photon.komoot.io')return Response.json({features:[]});
 throw Error('Unexpected URL: '+u.href);
};
const send=async(walkGrocery,profile='walk')=>{
 externalCalls=[];
 const response=await worker.fetch(new Request('https://unit.test/api/chat',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({message:'Pe jos',language:'ro',module:'maps',
   history:[],location:{latitude:51.479,longitude:.279,accuracy:15},
   route_profile:profile,route_destination:{...pin,label},
   corner_shop_walk:walkGrocery})
 }),{GEOAPIFY_API_KEY:'test',AI:{run:async()=>({response:'fixture'})}});
 assert.equal(response.status,200);
 return response.json();
};
try{
 const grocery=await send(true);
 assert.equal(grocery.route_available,true,grocery.reply);
 assert.equal(grocery.route.access_kind,'shop_street_frontage');
 assert.equal(grocery.route.destination.longitude,.28018);
 assert.equal(grocery.route.coordinates.length,3);
 assert.equal(grocery.route.steps.some(s=>s.text.includes('Palmerston Road')),false);
 const ordinary=await send(false);
 assert.equal(ordinary.route_available,false,'Other POIs retain previously approved arrival validation');
 assert.equal(ordinary.route_error_code,'route_arrival_street_unverified');
 indexed=false;
 const missingIndices=await send(true);
 assert.equal(missingIndices.route_available,false,'Without provider geometry indices, show no misleading map');
 indexed=true;
 const driving=await send(false,'drive');
 assert.equal(driving.route_available,true,'Existing driving pathway is unaffected');
}finally{globalThis.fetch=oldFetch}
console.log('PASS Băcănii walking geometry reaches London Road without an invented segment; auto and others unchanged');
