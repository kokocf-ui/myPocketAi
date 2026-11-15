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
 const ask=async()=>{
  urls=[];
  const response=await worker.fetch(new Request('https://test.local/api/chat',{
   method:'POST',headers:{'content-type':'application/json'},
   body:JSON.stringify({message:'Pe jos',language:'ro',module:'maps',history:[],
    location:{latitude:51.479,longitude:.279,accuracy:15},
    route_profile:'walk',route_destination:{...pin,label,country_code:'GB'}})
  }),{GEOAPIFY_API_KEY:'test'});
  assert.equal(response.status,200);
  return response.json();
 };
 let answer=await ask();
 assert.equal(answer.route_available,true,answer.reply);
 assert.equal(answer.route.destination.label,label);
 assert.equal(answer.route.destination.longitude,.2804,
  'A verified address point, not a different business, is used when necessary');
 assert.equal(answer.route.steps.at(-2).streets[0],'London Road');
 assert.equal(urls.filter(u=>u.pathname==='/v1/geocode/search').length,1);
 mode='correct';answer=await ask();
 assert.equal(answer.route_available,true);
 assert.equal(answer.route.destination.longitude,.2802);
 assert.equal(urls.filter(u=>u.pathname==='/v1/geocode/search').length,0,
  'No extra geocoder call for an already-correct route');
 mode='unverified';answer=await ask();
 assert.equal(answer.route_available,false);
 assert.equal(answer.route_error_code,'route_arrival_street_unverified');
 assert.equal(answer.needs_destination_access_verification,true);
 assert.equal(answer.route,undefined,'No unverified detour is displayed');
}finally{globalThis.fetch=oldFetch}
console.log('PASS walking storefront: street-mismatch detection, verified reroute, unchanged correct route, safe failure');
