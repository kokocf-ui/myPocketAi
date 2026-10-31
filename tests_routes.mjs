import assert from 'node:assert/strict';
import worker from './backend.js';
import {webcrypto} from 'node:crypto';globalThis.crypto??=webcrypto;
const info=console.info,warn=console.warn;console.info=()=>{};console.warn=()=>{};
const gps={latitude:51.48,longitude:.28,updatedAt:Date.now()};
const local={properties:{name:'Lakeside Shopping Centre',formatted:'Lakeside Shopping Centre, West Thurrock, United Kingdom',lat:51.488,lon:.283,country_code:'gb',categories:['commercial.shopping_mall']}};
let calls=[],mode='local',aiCalls=0;
globalThis.fetch=async input=>{
 const u=new URL(input);calls.push(u);
 if(u.pathname==='/v2/places'){
  if(mode==='failed')throw Error('offline');
  if(mode==='overseas'||mode==='empty')return Response.json({features:[]});
  if(mode==='ambiguous')return Response.json({features:[local,{properties:{...local.properties,lat:51.5,lon:.3,formatted:'Lakeside Shopping Centre, other mapped entrance, United Kingdom'}}]});
  if(u.searchParams.get('categories')==='accommodation.hotel')return Response.json({features:[{properties:{name:'Hotel test',lat:51.481,lon:.282,accommodation:{stars:'4'},datasource:{raw:{tourism:'hotel'}}},geometry:{coordinates:[.282,51.481]}}]});
  return Response.json({features:[local]});
 }
 if(u.pathname==='/v1/geocode/search'){
  if(mode==='failed')return new Response('',{status:503});
  if(mode==='empty')return Response.json({features:[]});
  if(mode==='overseas')return Response.json({features:[{properties:{...local.properties,lat:29.9,lon:-90.1,country_code:'us',formatted:'Lakeside Shopping Center, Metairie, US'}}]});
  if(u.searchParams.get('text')==='Departure UK')return Response.json({features:[{properties:{lat:51.48,lon:.28,country_code:'gb',formatted:'Departure UK'}}]});
  return Response.json({features:[local]});
 }
 if(u.pathname==='/v1/routing'){
  if(mode==='failed')return new Response('',{status:503});
  const d=u.searchParams.get('waypoints').split('|')[1].split(',').map(Number);
  const props={distance:2200,distance_units:'Meters',time:1920,legs:[{steps:[
   {distance:300,instruction:{text:u.searchParams.get('lang')==='en'?'Head along London Road.':'Mergi pe London Road.',streets:['London Road']}},
   {distance:1900,instruction:{text:'Virează la dreapta spre West Thurrock Way.',streets:['West Thurrock Way']}},
   {distance:0,instruction:{text:'Ai ajuns la destinație.'}}
  ]}]};
  if(mode==='nosteps')delete props.legs;
  if(mode==='units')props.distance_units='Miles';
  if(mode==='null')props.distance=null;
  const f={properties:props,geometry:{type:'MultiLineString',coordinates:[[[.28,51.48],[.281,51.485],[d[1],d[0]]]]}};
  if(mode==='geometry')f.geometry.coordinates[0][1]=[null,51.485];
  return Response.json({features:[f]});
 }
 if(u.hostname==='photon.komoot.io')return Response.json({features:[]});
 if(u.hostname==='nominatim.openstreetmap.org')return Response.json([{name:'Grays',lat:'51.48',lon:'.28',display_name:'Grays, UK',address:{country_code:'gb'}}]);
 throw Error('Unexpected request '+u.hostname+u.pathname);
};
const env={GEOAPIFY_API_KEY:'mock',AI:{run:async()=>{aiCalls++;return {response:'General answer.'}}}};
async function ask(message,extra={}){calls=[];return (await worker.fetch(new Request('https://test/api/chat',{method:'POST',body:JSON.stringify({message,language:'ro',location:gps,history:[],...extra})}),env)).json()}
let d=await ask('Vreau un traseu exclusiv pietonal. Nu include autobuz, tren sau metrou.');assert.equal(d.route_context.pending,'destination');assert.equal(d.recommended_module,'maps');assert.equal(calls.length,0);let pending=d.route_context;
d=await ask('Lakeside shopping center',{route_context:pending});assert.equal(d.route_available,true);assert.equal(d.route.profile,'walk');assert.ok(d.route.destination.label.includes('West Thurrock'));assert.ok(!calls.some(u=>u.pathname==='/v1/geocode/search'));assert.equal(calls.find(u=>u.pathname==='/v2/places').searchParams.get('filter'),'circle:0.28,51.48,25000');assert.equal(calls.find(u=>u.pathname==='/v2/places').searchParams.get('name'),'lakeside');assert.equal(d.route.steps.length,3);assert.ok(d.reply.includes('London Road'));assert.ok(d.reply.includes('West Thurrock Way'));assert.equal(d.route.durationSeconds,1920);assert.equal(d.route.origin.location_source,'gps');const successful=d.route_context;
d=await ask('Folosește locația mea',{route_context:{...successful,pending:'origin',origin_query:''}});assert.equal(d.route_available,true);assert.ok(!d.reply.startsWith('Locația ta aproximativă'));assert.ok(d.route.destination.label.includes('Lakeside'));
d=await ask('Folosește locația mea',{location:null,route_context:successful});assert.equal(d.needs_origin_clarification,true);assert.equal(d.route_context.destination.label,successful.destination.label);
d=await ask('Walking route to Lakeside shopping centre',{language:'en'});assert.equal(d.route_available,true);assert.ok(d.reply.includes('Head along London Road'));assert.equal(calls.find(u=>u.pathname==='/v1/routing').searchParams.get('lang'),'en');
d=await ask('Folosește locația mea',{history:[{role:'user',content:'Arată-mi un traseu pietonal până la Lakeside shopping center'},{role:'assistant',content:'Where are you? In Romania?'},{role:'user',content:'Folosește locația mea'}]});assert.equal(d.route_available,true);assert.ok(d.route.destination.label.includes('Lakeside'));
mode='overseas';d=await ask('Traseu pietonal până la Lakeside shopping center');assert.equal(d.route_available,false);assert.equal(d.needs_destination_clarification,true);assert.ok(!calls.some(u=>u.pathname==='/v1/routing'));assert.ok(!d.reply.includes('Metairie'));assert.ok(calls.find(u=>u.pathname==='/v1/geocode/search').searchParams.get('filter').startsWith('circle:'));
// Explicit country overrides GPS and permits distant destinations.
d=await ask('Traseu pietonal până la Lakeside shopping center, SUA');assert.equal(d.route_available,true);assert.equal(d.route.destination.country_code,'US');assert.equal(calls.find(u=>u.pathname==='/v1/geocode/search').searchParams.get('filter'),'countrycode:us');assert.ok(!calls.some(u=>u.pathname==='/v2/places'));
mode='ambiguous';d=await ask('Traseu pietonal până la Lakeside shopping center');assert.equal(d.route_context.candidates.length,2);pending=d.route_context;d=await ask('2',{route_context:pending});assert.equal(d.route_available,true);assert.ok(d.route.destination.label.includes('other mapped entrance'));
mode='empty';d=await ask('Traseu pietonal până la Lakeside shopping center');pending=d.route_context;mode='local';d=await ask('Grays UK',{route_context:pending});assert.equal(d.route_available,true);assert.ok(calls.find(u=>u.pathname==='/v1/geocode/search').searchParams.get('text').endsWith('Grays UK'));
d=await ask('Traseu pietonal până la Lakeside shopping centre',{location:null});assert.equal(d.needs_origin_clarification,true);pending=d.route_context;d=await ask('Departure UK',{location:null,route_context:pending});assert.equal(d.route_available,true);assert.equal(d.route.origin.label,'Departure UK');
d=await ask('Cum ajung la Lakeside shopping centre?',{module:'maps'});assert.equal(d.route_context.pending,'profile');pending=d.route_context;d=await ask('pe jos',{route_context:pending});assert.equal(d.route_available,true);assert.equal(d.route.profile,'walk');
for(const m of ['nosteps','units','null','geometry','failed']){mode=m;d=await ask('Traseu pietonal până la Lakeside shopping centre');if(m==='nosteps'){assert.equal(d.route_available,true);assert.equal(d.route_instructions_available,false);assert.deepEqual(d.route.steps,[]);assert.ok(d.reply.includes('nu a furnizat'));}else{assert.equal(d.route_available,false,m);assert.ok(!d.route,m);assert.equal(d.recommended_module,'maps',m)}}
mode='local';const selected={latitude:51.49,longitude:.3,label:'Second hotel, exact mapped location'};
d=await ask('Du-mă la al doilea hotel',{route_destination:selected,route_profile:'walk',module:'travel'});assert.equal(d.route_available,true);assert.equal(d.route.destination.latitude,selected.latitude);assert.equal(d.route.destination.longitude,selected.longitude);assert.equal(d.recommended_module,'maps');assert.equal(calls.filter(u=>u.pathname==='/v1/geocode/search'||u.pathname==='/v2/places').length,0);
d=await ask('Caută hoteluri în apropierea mea',{module:'maps'});assert.equal(d.recommended_module,'travel');assert.ok(d.places.length);
d=await ask('Ce înseamnă clasificarea de patru stele?',{module:'travel',route_context:pending});assert.equal(d.recommended_module,'assistant');assert.ok(d.reply.startsWith('General answer.'));
d=await ask('Ce este un traseu pietonal?',{module:'maps',route_context:pending});assert.equal(d.recommended_module,'assistant');assert.equal(d.route_context,null);assert.ok(!calls.some(u=>u.pathname==='/v1/routing'));
for(const answer of ['walk','walking','drive','driving','cu mașina']){d=await ask('Cum ajung la Lakeside shopping centre?',{module:'maps'});d=await ask(answer,{route_context:d.route_context});assert.equal(d.route_available,true,answer);assert.equal(d.route.profile,/walk/.test(answer)?'walk':'drive');}
mode='failed';d=await ask('Walking route to Lakeside shopping centre');pending=d.route_context;mode='local';d=await ask('Încearcă din nou',{route_context:pending});assert.equal(d.route_available,true);assert.equal(d.route_context.destination_query,pending.destination_query);
d=await ask('Itinéraire à pied',{route_start:true,route_profile:'walk',language:'fr'});assert.equal(d.route_context.profile,'walk');assert.equal(d.route_context.pending,'destination');assert.equal(d.recommended_module,'maps');
console.info=info;console.warn=warn;console.log('PASS: pedestrian quick prompt, local Lakeside vs overseas names, GPS confirmation continues routing, history recovery, street instructions, explicit country, country/number choices, missing GPS, exact hotel selection, provider/geometry/units failures, maps/travel/assistant handoff.');
