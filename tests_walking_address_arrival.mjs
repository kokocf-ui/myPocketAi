import assert from 'node:assert/strict';
import worker from './backend.js';
import {walkingAddressFromLabel,checkWalkingArrival,verifiedAddressGeocode} from './walking_address_arrival.mjs';

const label="Sunny's, 433 London Road, South Stifford, Grays, RM20 4AB";
const address=walkingAddressFromLabel(label);
assert.equal(address.number,'433');
assert.equal(address.street,'London Road');
assert.equal(address.postcode,'RM204AB');
assert.equal(walkingAddressFromLabel('Lakeside Shopping Centre, Grays'),null);
const pin={latitude:51.4802,longitude:.2802};
const fakeRoute=(street,end=[.2802,51.4802])=>({
 coordinates:[[.279,51.479],end],steps:[
  {streets:['Mill Lane'],distanceMeters:55},
  {streets:['London Road','A126'],distanceMeters:100},
  {streets:[street],distanceMeters:35},
  {streets:[],distanceMeters:12}]
});
assert.equal(checkWalkingArrival(fakeRoute('Palmerston Road'),pin,address).reason,'different_arrival_street');
assert.equal(checkWalkingArrival(fakeRoute('London Road'),pin,address).ok,true);
assert.equal(checkWalkingArrival(fakeRoute('London Road',[.282,51.4815]),pin,address).reason,'moved_arrival_waypoint');
assert.equal(checkWalkingArrival(fakeRoute('Palmerston Road'),pin,null).ok,true,
 'Unnamed-venue routes remain unaffected');
const found=[{properties:{housenumber:'433',street:'London Road',postcode:'RM20 4AB',lat:51.4802,lon:.2804}}];
assert.equal(verifiedAddressGeocode(found,address,pin).longitude,.2804);
assert.equal(verifiedAddressGeocode([{properties:{...found[0].properties,street:'Palmerston Road'}}],address,pin),null);
assert.equal(verifiedAddressGeocode([{properties:{...found[0].properties,housenumber:'435'}}],address,pin),null);
assert.equal(verifiedAddressGeocode([{properties:{...found[0].properties,postcode:'RM20 4AA'}}],address,pin),null);
assert.equal(verifiedAddressGeocode([{properties:{...found[0].properties,lon:.35}}],address,pin),null);

const oldFetch=globalThis.fetch;
let mode='repair',urls=[];
globalThis.fetch=async input=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));
 urls.push(u);
 if(u.pathname==='/v2/places')return Response.json({features:[]});
 if(u.pathname==='/v1/geocode/search')return Response.json({features:mode==='unverified'
  ?[{properties:{...found[0].properties,street:'Palmerston Road'}}]:found});
 if(u.pathname==='/v1/routing'){
  const points=u.searchParams.get('waypoints').split('|').map(s=>s.split(',').map(Number));
  const last=points.at(-1),repaired=Math.abs(last[1]-.2804)<.00001;
  const street=(repaired||mode==='correct')?'London Road':'Palmerston Road';
  return Response.json({features:[{geometry:{type:'MultiLineString',coordinates:[[
   [.279,51.479],[last[1],last[0]]
  ]]},properties:{distance:190,distance_units:'meters',time:180,legs:[{steps:[
   {distance:110,instruction:{text:'Mergi pe London Road.',streets:['London Road']}},
   {distance:35,instruction:{text:'Virează pe '+street+'.',streets:[street]}},
   {distance:0,instruction:{text:'Ai ajuns la destinație.'}}]}]}}]});
 }
 if(u.hostname==='photon.komoot.io')return Response.json({features:[]});
 throw Error('Unexpected provider '+u.href);
};
try{
 const ask=async(destination={...pin,label,country_code:'GB'},profile='walk',extra={})=>{
  urls=[];
  const response=await worker.fetch(new Request('https://test.local/api/chat',{
   method:'POST',headers:{'content-type':'application/json'},
   body:JSON.stringify({message:'Pe jos',language:'ro',module:'maps',history:[],
    location:{latitude:51.479,longitude:.279,accuracy:15},
    route_profile:profile,route_destination:destination,...extra})
  }),{GEOAPIFY_API_KEY:'test',AI:{run:async()=>({response:'Test fallback AI'})}});
  if(response.status!==200)console.error('ARRIVAL TEST FAILURE',response.status,(await response.clone().text()).slice(0,600),urls.map(u=>u.pathname));
  assert.equal(response.status,200);
  return response.json();
 };
 let answer=await ask();
 assert.equal(answer.route_available,true,answer.reply);
 assert.equal(answer.route.destination.label,label);
 assert.equal(answer.route.destination.longitude,.2804,
  'A verified address point, not a different business, is used when necessary');
 assert.equal(answer.route.steps.at(-2).streets[0],'London Road');
 assert.equal(urls.filter(u=>u.pathname==='/v1/geocode/search'&&String(u.searchParams.get('text')||'').startsWith('433 London Road')).length,1);
 mode='correct';answer=await ask();
 assert.equal(answer.route_available,true);
 assert.equal(answer.route.destination.longitude,.2802);
 assert.equal(urls.filter(u=>u.pathname==='/v1/geocode/search'&&String(u.searchParams.get('text')||'').startsWith('433 London Road')).length,0,
  'No extra geocoder call for an already-correct route');
 // Transit uses the identical explicit walking context, including a transfer
 // origin that can differ from the phone's GPS. Exercise the real dispatcher.
 const transferOrigin={latitude:51.479,longitude:.279,label:'Transfer station'};
 const transferDestination={...pin,label,country_code:'GB'};
 answer=await ask(transferDestination,'walk',{route_context:{profile:'walk',origin:transferOrigin,
  destination:transferDestination,destination_query:label,origin_query:'',pending:null}});
 assert.equal(answer.route_available,true,'Transit walking request reaches the same road router');
 assert.equal(answer.route.origin.label,'Transfer station');
 assert.equal(answer.route.destination.longitude,.2802);
 mode='unverified';answer=await ask();
 assert.equal(answer.route_available,false);
 assert.equal(answer.route_error_code,'route_arrival_street_unverified');
 assert.equal(answer.needs_destination_access_verification,true);
 assert.equal(answer.route,undefined,'No unverified detour is displayed');
 // Generic mapped places without a house number must retain the existing route flow.
 mode='correct';answer=await ask({...pin,label:'Grays riverside park',country_code:'GB'});
 assert.equal(answer.route_available,true,'Unnumbered POIs retain walking directions');
 // The dedicated safeguard must not interfere with driving mode.
 mode='unverified';answer=await ask({...pin,label,country_code:'GB'},'drive');
 assert.equal(answer.route_available,true,'Driving routes remain unaffected');

}finally{globalThis.fetch=oldFetch}
console.log('PASS walking storefront: street-mismatch detection, verified reroute, unchanged correct route, safe failure');
