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
  if(/Chafford|Waypoint/i.test(u.searchParams.get('text')||'')){const point={properties:{lat:51.489,lon:.29,country_code:'gb',formatted:'Chafford Hundred railway station, United Kingdom'}};return Response.json({features:mode==='viamissing'?[]:mode==='viachoice'?[point,{properties:{...point.properties,lat:51.491,formatted:'Chafford Hundred neighbourhood, United Kingdom'}}]:[point]});}
  if(mode==='empty')return Response.json({features:[]});
  if(mode==='overseas')return Response.json({features:[{properties:{...local.properties,lat:29.9,lon:-90.1,country_code:'us',formatted:'Lakeside Shopping Center, Metairie, US'}}]});
  if(u.searchParams.get('text')==='Departure UK')return Response.json({features:[{properties:{lat:51.48,lon:.28,country_code:'gb',formatted:'Departure UK'}}]});
  return Response.json({features:[local]});
 }
 if(u.pathname==='/v1/routing'){
  if(mode==='failed')return new Response('',{status:503});
  const points=u.searchParams.get('waypoints').split('|').map(p=>p.split(',').map(Number)),d=points.at(-1),isVia=points.length===3,isShort=u.searchParams.get('type')==='short';
  if((mode==='partial'&&isShort)||(mode==='viafail'&&isVia))return new Response('',{status:503});
  const props={distance:2200,distance_units:'meters',time:1920,legs:[{steps:[
   {distance:300,instruction:{text:u.searchParams.get('lang')==='en'?'Head along London Road.':'Mergi pe London Road.',streets:['London Road']}},
   {distance:1900,instruction:{text:'Virează la dreapta spre West Thurrock Way.',streets:['West Thurrock Way']}},
   {distance:0,instruction:{text:'Ai ajuns la destinație.'}}
  ]}]};
  if(mode==='nosteps')delete props.legs;
  if(mode==='units')props.distance_units='Miles';
  if(mode==='titlecase')props.distance_units='Meters';
  if(mode==='upper')props.distance_units='METERS';
  if(mode==='null')props.distance=null;
  const f={properties:props,geometry:{type:'MultiLineString',coordinates:[[[.28,51.48],[.281,51.485],[d[1],d[0]]]]}};
  if(['alternatives','partial','viafail','viachoice','viamissing'].includes(mode)){if(isVia){f.geometry.coordinates=[points.map(p=>[p[1],p[0]])];props.distance=2600;props.time=2100;props.legs=[{steps:[{distance:100,instruction:{text:'Mergi prin Chafford Hundred.'}},{distance:20,instruction:{text:'Take the stairs to Level 1.'}}]}];}else if(isShort){f.geometry.coordinates[0][1]=[.29,51.485];props.distance=2000;props.time=1800;}}
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
d=await ask('Traseu pietonal până la Lakeside shopping center, SUA');assert.equal(d.route_available,true);assert.equal(d.route.destination.country_code,'US');assert.equal(calls.find(u=>u.pathname==='/v1/geocode/search').searchParams.get('filter'),'countrycode:us');assert.ok(!calls.some(u=>u.pathname==='/v2/places'&&u.searchParams.get('categories')==='commercial.shopping_mall'));
mode='ambiguous';d=await ask('Traseu pietonal până la Lakeside shopping center');assert.equal(d.route_context.candidates.length,2);pending=d.route_context;d=await ask('2',{route_context:pending});assert.equal(d.route_available,true);assert.ok(d.route.destination.label.includes('other mapped entrance'));
mode='empty';d=await ask('Traseu pietonal până la Lakeside shopping center');pending=d.route_context;mode='local';d=await ask('Grays UK',{route_context:pending});assert.equal(d.route_available,true);assert.ok(calls.find(u=>u.pathname==='/v1/geocode/search').searchParams.get('text').endsWith('Grays UK'));
d=await ask('Traseu pietonal până la Lakeside shopping centre',{location:null});assert.equal(d.needs_origin_clarification,true);pending=d.route_context;d=await ask('Departure UK',{location:null,route_context:pending});assert.equal(d.route_available,true);assert.equal(d.route.origin.label,'Departure UK');
d=await ask('Cum ajung la Lakeside shopping centre?',{module:'maps'});assert.equal(d.route_context.pending,'profile');pending=d.route_context;d=await ask('pe jos',{route_context:pending});assert.equal(d.route_available,true);assert.equal(d.route.profile,'walk');
for(const m of ['nosteps','units','null','geometry','failed']){mode=m;d=await ask('Traseu pietonal până la Lakeside shopping centre');if(m==='nosteps'){assert.equal(d.route_available,true);assert.equal(d.route_instructions_available,false);assert.deepEqual(d.route.steps,[]);assert.ok(d.reply.includes('nu a furnizat'));}else{assert.equal(d.route_available,false,m);assert.ok(!d.route,m);assert.equal(d.recommended_module,'maps',m)}}
mode='local';const selected={latitude:51.49,longitude:.3,label:'Second hotel, exact mapped location'};
d=await ask('Du-mă la al doilea hotel',{route_destination:selected,route_profile:'walk',module:'travel'});assert.equal(d.route_available,true);assert.equal(d.route.destination.latitude,selected.latitude);assert.equal(d.route.destination.longitude,selected.longitude);assert.equal(d.recommended_module,'maps');assert.equal(calls.filter(u=>u.pathname==='/v1/geocode/search'||(u.pathname==='/v2/places'&&u.searchParams.get('categories')==='commercial.shopping_mall')).length,0);
d=await ask('Caută hoteluri în apropierea mea',{module:'maps'});assert.equal(d.recommended_module,'travel');assert.ok(d.places.length);
d=await ask('Ce înseamnă clasificarea de patru stele?',{module:'travel',route_context:pending});assert.equal(d.recommended_module,'assistant');assert.ok(d.reply.startsWith('General answer.'));
d=await ask('Ce este un traseu pietonal?',{module:'maps',route_context:pending});assert.equal(d.recommended_module,'assistant');assert.equal(d.route_context,null);assert.ok(!calls.some(u=>u.pathname==='/v1/routing'));
for(const answer of ['walk','walking','drive','driving','cu mașina']){d=await ask('Cum ajung la Lakeside shopping centre?',{module:'maps'});d=await ask(answer,{route_context:d.route_context});assert.equal(d.route_available,true,answer);assert.equal(d.route.profile,/walk/.test(answer)?'walk':'drive');}
mode='failed';d=await ask('Walking route to Lakeside shopping centre');pending=d.route_context;mode='local';d=await ask('Încearcă din nou',{route_context:pending});assert.equal(d.route_available,true);assert.equal(d.route_context.destination_query,pending.destination_query);
d=await ask('Itinéraire à pied',{route_start:true,route_profile:'walk',language:'fr'});assert.equal(d.route_context.profile,'walk');assert.equal(d.route_context.pending,'destination');assert.equal(d.recommended_module,'maps');
// Provider-style lowercase units must succeed; presentation case must not change metric semantics.
for(const units of ['local','titlecase','upper']){mode=units;d=await ask('Traseu pietonal până la Lakeside shopping centre');assert.equal(d.route_available,true,units);assert.equal(d.route.distanceMeters,2200);assert.equal(d.route.steps.length,3);}
// Reproduce the exact failure -> full destination clarification from the phone screenshots.
mode='units';d=await ask('Traseu pietonal până la Lakeside shopping center');assert.equal(d.route_available,false);assert.equal(d.route_error_code,'route_units_invalid');assert.equal(d.route_context.pending,'retry');pending=d.route_context;
const beforeRouteFollowupAI=aiCalls;mode='local';d=await ask('Lakeside shopping center Grays',{route_context:pending});assert.equal(d.route_available,true);assert.equal(d.route_context.destination_query,'Lakeside shopping center Grays');assert.equal(aiCalls,beforeRouteFollowupAI,'failed route clarification never reaches the LLM');
mode='failed';d=await ask('Traseu pietonal până la Lakeside shopping center');assert.equal(d.route_available,false);assert.equal(d.route_context.pending,'retry');pending=d.route_context;
d=await ask('Lakeside shopping center Grays',{route_context:pending});assert.equal(d.route_available,false);assert.equal(d.recommended_module,'maps');assert.equal(d.route_context.destination_query,'Lakeside shopping center Grays');assert.equal(aiCalls,beforeRouteFollowupAI);assert.ok(!d.reply.includes('Western Gateway'));assert.ok(!d.reply.includes('10–15'));
mode='local';d=await ask('Încearcă din nou',{route_context:pending});assert.equal(d.route_available,true);
// A v109 client may still carry pending:null after the old route validation failure.
mode='local';d=await ask('Lakeside shopping center Grays',{route_context:{profile:'walk',origin_query:'',destination_query:'Lakeside shopping center',destination:{latitude:51.488,longitude:.283,label:'Lakeside Shopping Centre'},pending:null,candidates:[]}});assert.equal(d.route_available,true);assert.equal(d.route_context.destination_query,'Lakeside shopping center Grays');assert.equal(aiCalls,beforeRouteFollowupAI);
// Supported balanced/short calculations, exact duplicate suppression, independent failures and via continuation.
mode='local';d=await ask('Traseu pietonal până la Lakeside shopping centre');assert.equal(d.routes.length,1);assert.ok(d.reply.includes('un singur traseu distinct'));assert.deepEqual(calls.filter(u=>u.pathname==='/v1/routing').map(u=>u.searchParams.get('type')),['balanced','short']);
mode='alternatives';d=await ask('Traseu pietonal până la Lakeside shopping centre');assert.equal(d.routes.length,2);assert.equal(d.routes.find(r=>r.id==='short').distanceMeters,2000);assert.notDeepEqual(d.routes[0].coordinates,d.routes[1].coordinates);pending=d.route_context;
const alternativeAI=aiCalls;d=await ask('Prin Chafford Hundred',{route_context:pending});assert.equal(d.route_available,true);assert.equal(d.routes.length,3);assert.equal(d.route.id,'via');assert.equal(d.route.destination.label,pending.destination.label);assert.equal(d.route.via[0].label,'Chafford Hundred railway station, United Kingdom');assert.equal(d.route.steps[1].text,'Folosește scările către nivelul 1.');assert.equal(d.route.distanceMeters,2600);assert.equal(aiCalls,alternativeAI);assert.equal(d.route_context.via_query,'Chafford Hundred');
let viaRequest=calls.find(u=>u.pathname==='/v1/routing'&&u.searchParams.get('waypoints').split('|').length===3);assert.equal(viaRequest.searchParams.get('waypoints'),'51.48,0.28|51.489,0.29|51.488,0.283');assert.equal(viaRequest.searchParams.get('intermediate_waypoint_mode'),'pass_through');assert.equal(viaRequest.searchParams.get('mode'),'walk');assert.equal(viaRequest.searchParams.has('avoid'),false);assert.equal(viaRequest.searchParams.has('alternatives'),false);assert.equal(viaRequest.searchParams.has('traffic'),false);
d=await ask('Traseu pietonal până la Lakeside shopping centre prin Chafford Hundred');assert.equal(d.route.id,'via');assert.equal(d.route_context.destination_query,'Lakeside shopping centre');
d=await ask('Przez Chafford Hundred',{language:'pl',route_context:pending,route_via_query:'Chafford Hundred'});assert.equal(d.route.id,'via');assert.ok(d.route.label.startsWith('Przez'));
mode='viachoice';d=await ask('Prin Chafford Hundred',{route_context:pending});assert.equal(d.needs_via_clarification,true);assert.equal(d.route_context.pending,'via_choice');const viaPending=d.route_context;assert.equal(viaPending.destination.label,pending.destination.label);d=await ask('2',{route_context:viaPending});assert.equal(d.route.id,'via');assert.equal(d.route.via[0].label,'Chafford Hundred neighbourhood, United Kingdom');assert.equal(d.route.destination.label,pending.destination.label);
mode='viamissing';d=await ask('Prin Chafford Hundred',{route_context:pending});assert.equal(d.route_context.pending,'via_detail');mode='alternatives';d=await ask('Chafford Hundred station UK',{route_context:d.route_context});assert.equal(d.route.id,'via');assert.equal(d.route.destination.label,pending.destination.label);
mode='viafail';d=await ask('Prin Chafford Hundred',{route_context:pending});assert.equal(d.route_available,true);assert.equal(d.route_via_available,false);assert.equal(d.route.id,'short');assert.ok(d.reply.includes('nu a putut fi verificată'));assert.equal(d.routes.length,2);
mode='partial';d=await ask('Alte trasee',{route_context:pending});assert.equal(d.route_available,true);assert.equal(d.routes.length,1);assert.equal(d.route.id,'balanced');
mode='local';d=await ask('Prin Chafford Hundred',{route_context:pending});assert.equal(d.routes.length,1);assert.equal(d.route.id,'via');assert.equal(d.route.via.length,1,'duplicate route preserves requested waypoint for navigation');
console.log('PASS: balanced/short alternatives, geometry deduplication, failed alternative isolation, via query/full request/structured multilingual continuation, waypoint ambiguity/number/detail, exact destination retention, metric/street/geometry association, Romanian stairs, no invented pedestrian traffic parameters.');
console.info=info;console.warn=warn;console.log('PASS: pedestrian quick prompt, local Lakeside vs overseas names, GPS confirmation continues routing, history recovery, street instructions, explicit country, country/number choices, missing GPS, exact hotel selection, provider/geometry/units failures, maps/travel/assistant handoff.');
