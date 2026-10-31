import assert from 'node:assert/strict';
import worker from './backend.js';
import {webcrypto} from 'node:crypto';globalThis.crypto??=webcrypto;
const originalLog=console.info, originalWarn=console.warn;console.info=()=>{};console.warn=()=>{};
let calls=[], mode='normal', starData=true;
const features=[
 {name:'Berlin Five',lat:52.518,lon:13.399,stars:'5'},
 {name:'Berlin Four',lat:52.518,lon:13.4,stars:'4'},
 {name:'Berlin Unknown',lat:52.519,lon:13.4},
 {name:'Berlin Superior',lat:52.519,lon:13.401,stars:'5S'},
 {name:'London Five',lat:51.484,lon:.28,stars:'5'}];
globalThis.fetch=async input=>{const u=new URL(input);calls.push(u);
 if(u.hostname==='nominatim.openstreetmap.org'){
  if(mode==='failure')throw Error('offline');
  if(mode==='missing')return Response.json([]);
  if(mode==='ambiguous')return Response.json([{lat:'52.517',lon:'13.395',importance:.5,address:{country_code:'de'}},{lat:'44',lon:'-71',importance:.49,address:{country_code:'us'}}]);
  return Response.json([{lat:'52.517',lon:'13.395',display_name:'Berlin, Germany',importance:.8,address:{city:'Berlin',country_code:'de'}}]);
 }
 if(u.hostname==='api.geoapify.com')return Response.json({features:features.map(f=>({geometry:{coordinates:[f.lon,f.lat]},properties:{name:f.name,categories:['accommodation.hotel'],accommodation:starData?{stars:f.stars}:{},datasource:{raw:{tourism:'hotel'}}}}))});
 if(u.hostname==='photon.komoot.io')return Response.json({features:[]});
 throw Error('Unexpected '+u.hostname);
};
const env={GEOAPIFY_API_KEY:'mock',AI:{run:async()=>({response:'translated'})}};
async function ask(message,location={latitude:51.484,longitude:.28},extra={}){calls=[];return(await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,language:'ro',location,history:[],...extra})}),env)).json()}
let d=await ask('Caută hoteluri de 5 stele în Berlin, zona centrală');assert.equal(d.version,'v107');assert.equal(d.location_source,'explicit_place_query');assert.equal(d.search_query,'Berlin');assert.equal(d.search_radius_meters,2000);assert.ok(d.reply.startsWith('Am găsit 2 hoteluri de 5 stele în Berlin, conform datelor de hartă disponibile.'));assert.ok(!d.reply.includes('hotel / hostel'));assert.equal(d.places[0].type,'hotel');assert.equal(d.requested_stars,5);assert.deepEqual(d.places.map(p=>p.name),['Berlin Five','Berlin Superior']);assert.ok(d.reply.includes('Berlin'));assert.ok(!d.reply.includes('față de poziția GPS'));assert.ok(calls.find(u=>u.hostname==='api.geoapify.com').searchParams.get('filter').startsWith('circle:13.395,52.517,2000'));
d=await ask('Find 5-star hotels in Berlin city centre',null,{language:'en'});assert.equal(d.requested_stars,5);assert.equal(d.search_query,'Berlin');assert.equal(d.places.length,2);
d=await ask('Hoteluri în Berlin');assert.equal(d.location_source,'explicit_place_query');assert.equal(d.search_radius_meters,5000);
for(const m of ['Caută hoteluri în apropierea mea','Caută hoteluri în apropiere','Find hotels near me']){d=await ask(m);assert.equal(d.location_source,'browser_gps',m);assert.ok(!calls.some(u=>u.hostname==='nominatim.openstreetmap.org'));assert.deepEqual(d.places.map(p=>p.name),['London Five'])}
for(const failMode of ['missing','failure','ambiguous']){mode=failMode;d=await ask('Caută hoteluri în Berlin');assert.equal(d.needs_location_clarification,true);assert.deepEqual(d.places,[]);assert.ok(!calls.some(u=>u.hostname==='api.geoapify.com'||u.hostname==='photon.komoot.io'));}mode='normal';
starData=false;d=await ask('Caută hoteluri de 5 stele în Berlin');assert.deepEqual(d.places,[]);assert.equal(d.requested_stars,5);assert.ok(d.reply.includes('Nu am putut confirma'));starData=true;
d=await ask('Caută hoteluri de cinci stele în Berlin');assert.equal(d.places.length,2);
d=await ask('Caută hoteluri în centru');assert.equal(d.needs_location_clarification,true);
d=await ask('Caută hoteluri în apropiere de Berlin');assert.equal(d.search_query,'Berlin');
d=await ask('Find 4.5-star hotels in Berlin');assert.equal(d.needs_star_clarification,true);
d=await ask('Bună, ce poți face?');assert.equal(d.status,'success');assert.ok(d.reply);
// v104: use only user turns for follow-up destinations, never assistant guesses.
const previousFetch=globalThis.fetch;let aiInputs=[];
const ny={latitude:40.7128,longitude:-74.006,label:'New York, United States'};
const paris={latitude:48.8566,longitude:2.3522,label:'Paris, France'};
const london={latitude:51.5074,longitude:-.1278,label:'London, United Kingdom'};
globalThis.fetch=async input=>{
 const u=new URL(input);calls.push(u);
 if(u.hostname==='nominatim.openstreetmap.org'){
  const q=u.searchParams.get('q').toLowerCase();const p=q.includes('new york')?ny:q.includes('paris')?paris:q.includes('londra')||q.includes('london')?london:null;
  if(!p)return Response.json([]);
  return Response.json([{lat:String(p.latitude),lon:String(p.longitude),display_name:p.label,namedetails:p===london?{'name:ro':'Londra'}:{},importance:.9,address:{country_code:p===ny?'us':p===paris?'fr':'gb'}}]);
 }
 if(u.hostname==='api.geoapify.com'&&u.pathname==='/v2/places'){
  const center=u.searchParams.get('filter').split(':')[1].split(',').map(Number);const [lon,lat]=center;
  return Response.json({features:[{geometry:{coordinates:[lon+.001,lat+.001]},properties:{name:'Mapped Five-Star Hotel',categories:['accommodation.hotel'],accommodation:{stars:'5'},datasource:{raw:{tourism:'hotel'}}}}]});
 }
 if(u.hostname==='api.geoapify.com'&&u.pathname==='/v1/routing')return Response.json({features:[{properties:{distance:450000,time:18000}}]});
 if(u.hostname==='photon.komoot.io')return Response.json({features:[]});
 if(u.hostname==='api.search.brave.com')return Response.json({web:{results:[]}});
 throw Error('Unexpected '+u.hostname);
};
const first='Caută hotel de 3 stele în New York';const follow='Dar hotel de 5 stele găsești?';
d=await ask(first);assert.equal(d.results_count,0);assert.equal(d.search_query,'New York');
const badAssistant={role:'assistant',content:'Am găsit hoteluri de 5 stele în România.'};
let history=[{role:'user',content:first},{role:'assistant',content:'Nu am putut confirma hoteluri de 3 stele în New York.'},{role:'user',content:follow}];
d=await ask(follow,undefined,{history});assert.equal(d.search_query,'New York');assert.equal(d.requested_stars,5);assert.equal(d.context_inherited,true);assert.equal(d.places.length,1);assert.ok(!d.reply.includes('România'));
history=[{role:'user',content:first},badAssistant,{role:'user',content:follow},badAssistant];
d=await ask('Dar de 4 stele?',undefined,{history});assert.equal(d.search_query,'New York');assert.equal(d.requested_stars,4);assert.equal(d.places.length,0);
d=await ask('Dar în Paris?',undefined,{history});assert.equal(d.search_query,'Paris');assert.equal(d.requested_stars,5);assert.equal(d.search_center.latitude,paris.latitude);
d=await ask('Caută hoteluri în Paris',undefined,{history});assert.equal(d.requested_stars,null);assert.equal(d.context_inherited,false);
d=await ask('Dar hoteluri de 5 stele găsești?',undefined,{history:[{role:'user',content:first},{role:'user',content:'Cât face 2 plus 2?'}]});assert.equal(d.needs_location_clarification,true);assert.ok(!calls.some(u=>u.pathname==='/v2/places'));
d=await ask('Dar de 5 stele?',undefined,{history:[]});assert.equal(d.needs_location_clarification,true);
d=await ask('Câți kilometri sunt până în Paris?',{latitude:london.latitude,longitude:london.longitude},{history});assert.equal(d.distance_type,'straight_line');assert.equal(d.origin_source,'browser_gps');assert.ok(d.distance_meters>330000&&d.distance_meters<360000);assert.equal(d.destination.latitude,paris.latitude);assert.ok(!d.reply.includes('România'));assert.ok(d.reply.includes('linie dreaptă'));
d=await ask('Câți kilometri sunt până în Paris?',null,{history});assert.equal(d.needs_origin_clarification,true);assert.equal(d.distance_available,false);assert.equal(calls.length,0);
d=await ask('Câți kilometri sunt din Londra până în Paris?',{latitude:44.4,longitude:26.1});assert.equal(d.origin_source,'explicit_place_query');assert.equal(d.origin.latitude,london.latitude);assert.ok(d.distance_meters>330000&&d.distance_meters<360000);
d=await ask('Distanța rutieră până în Paris cu mașina',{latitude:london.latitude,longitude:london.longitude});assert.equal(d.distance_type,'road');assert.equal(d.distance_meters,450000);assert.ok(calls.find(u=>u.pathname==='/v1/routing').searchParams.get('waypoints').startsWith('51.5074,-0.1278|48.8566,2.3522'));
// General research must not turn a selected response language into a country.
const researchEnv={...env,BRAVE_API_KEY:'mock-brave',AI:{run:async(model,payload)=>{aiInputs.push(payload);return {response:'Răspuns de test.'}}}};
calls=[];await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Care sunt ultimele noutăți despre baterii?',language:'ro',history:[]})}),researchEnv);
assert.equal(calls.find(u=>u.hostname==='api.search.brave.com').searchParams.get('country'),'ALL');assert.ok(aiInputs.some(p=>p.messages?.some(m=>m.role==='system'&&m.content.includes('LANGUAGE IS NOT LOCATION'))));
calls=[];await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Latest battery news in Romania?',language:'en',history:[]})}),researchEnv);assert.equal(calls.find(u=>u.hostname==='api.search.brave.com').searchParams.get('country'),'RO');
d=await ask('Dar de 5 stele?',undefined,{history:[{role:'user',content:'Dar de 4 stele?'}],place_context:{category:'hotel',destination:'New York',stars:4,central:false}});assert.equal(d.search_query,'New York');assert.equal(d.requested_stars,5);assert.equal(d.place_context.destination,'New York');
d=await ask('Câți kilometri sunt până în Paris?',null,{place_context:{category:'hotel',destination:'New York',stars:5,central:false}});assert.equal(d.needs_origin_clarification,true);assert.equal(d.place_context,null);
d=await ask('Câte stele are hotelul Ritz în Paris?');assert.ok(!calls.some(u=>u.pathname==='/v2/places'));assert.equal(d.place_context,null);
const routeFetch=globalThis.fetch;globalThis.fetch=async input=>{if(new URL(input).pathname==='/v1/routing')return new Response('unavailable',{status:503});return routeFetch(input)};
d=await ask('Distanța rutieră până în Paris cu mașina',{latitude:london.latitude,longitude:london.longitude});assert.equal(d.distance_available,false);assert.ok(!d.distance_meters);globalThis.fetch=routeFetch;
globalThis.fetch=previousFetch;
console.log('PASS: New York follow-ups survive wrong assistant geography; star/city changes; new request and topic boundaries; Paris GPS/explicit/missing origins; road vs straight-line distance; language-neutral search with explicit country preserved.');
// v105: reproduce the exact comma/central-area request; reject streets and ask for cities.
const baseFetch=globalThis.fetch;
const fr={name:'Paris',lat:'48.8566',lon:'2.3522',class:'boundary',type:'administrative',addresstype:'city',importance:.99,display_name:'Paris, Île-de-France, France',address:{city:'Paris',state:'Île-de-France',country:'France',country_code:'fr'}};
const us={name:'Paris',lat:'33.66',lon:'-95.55',class:'place',type:'city',importance:.2,display_name:'Paris, Texas, United States',address:{city:'Paris',state:'Texas',country:'United States',country_code:'us'}};
const indiana={name:'Paris',lat:'38.7',lon:'-85.6',class:'place',type:'hamlet',importance:.1,display_name:'Paris, Indiana, United States',address:{hamlet:'Paris',state:'Indiana',country:'United States',country_code:'us'}};
const road={name:'Avenue de Paris',lat:'46.78',lon:'4.85',class:'highway',type:'residential',display_name:'Avenue de Paris, Chalon-sur-Saône, France',address:{city:'Chalon-sur-Saône',country_code:'fr'}};
let variant='normal',detailsCalls=0;
globalThis.fetch=async input=>{const u=new URL(input);calls.push(u);
 if(u.hostname==='nominatim.openstreetmap.org'){
  assert.equal(u.searchParams.get('featureType'),'settlement');assert.equal(u.searchParams.get('limit'),'10');
  if(variant==='roadOnly')return Response.json([road]);
  if(variant==='sameCountry')return Response.json([us,indiana]);
  return Response.json([fr,{...fr,lon:'2.3523'},us,road]);
 }
 if(u.hostname==='api.geoapify.com'&&u.pathname==='/v2/places')return Response.json({features:[
  {geometry:{coordinates:[2.353,48.857]},properties:{name:'Known Four',categories:['accommodation.hotel'],accommodation:{stars:'4'},datasource:{raw:{tourism:'hotel'}}}},
  ...['a','b'].map((id,i)=>({geometry:{coordinates:[2.354+i*.001,48.858]},properties:{name:'Recovered '+id,place_id:id,categories:['accommodation.hotel'],datasource:{raw:{tourism:'hotel'}}}})),
  {geometry:{coordinates:[2.355,48.858]},properties:{name:'Unknown',categories:['accommodation.hotel'],datasource:{raw:{tourism:'hotel'}}}}
 ]});
 if(u.hostname==='api.geoapify.com'&&u.pathname==='/v2/place-details'){detailsCalls++;return Response.json({features:[{properties:{accommodation:{stars:'4'}}}]})}
 if(u.hostname==='photon.komoot.io')return Response.json({features:[]});throw Error('Unexpected '+u.hostname);
};
const exact='Caută hoteluri de 4 stele, în Paris, în zona centrală';
d=await ask(exact);assert.equal(d.needs_location_clarification,true);assert.equal(d.search_query,'Paris');assert.equal(calls[0].searchParams.get('q'),'Paris');assert.equal(d.destination_candidates.length,2);assert.ok(d.reply.includes('1. Paris'));assert.ok(d.reply.includes('Texas'));assert.equal(detailsCalls,0);assert.ok(!calls.some(u=>u.pathname==='/v2/places'));
let pending=d.place_context;assert.equal(pending.stars,4);assert.equal(pending.central,true);
d=await ask('Franța',undefined,{history:[{role:'user',content:exact},{role:'user',content:'Franța'}],place_context:pending});assert.equal(d.results_count,3);assert.equal(detailsCalls,2);assert.equal(d.search_center.latitude,48.8566);assert.equal(d.unclassified_count,1);assert.equal(d.search_radius_meters,2000);assert.ok(d.reply.includes('O altă locație'));assert.ok(!d.places.some(p=>p.name==='Unknown'));assert.ok(!calls.some(u=>u.hostname==='nominatim.openstreetmap.org'));
const resolved=d.place_context;
d=await ask('Dar de 5 stele?',undefined,{history:[{role:'user',content:exact},{role:'user',content:'Franța'}],place_context:resolved});assert.equal(d.requested_stars,5);assert.equal(d.search_center.latitude,48.8566);
d=await ask('2',undefined,{history:[{role:'user',content:exact}],place_context:pending});assert.equal(d.search_center.latitude,33.66);
d=await ask('Caută hoteluri de 4 stele, în Paris, Franța, în zona centrală');assert.equal(d.results_count,3);assert.equal(calls[0].searchParams.get('countrycodes'),'fr');assert.equal(calls[0].searchParams.get('q'),'Paris');
variant='sameCountry';d=await ask('Caută hoteluri în Paris');assert.equal(d.needs_location_clarification,true);assert.equal(d.destination_candidates.length,2);
variant='roadOnly';d=await ask('Caută hoteluri în Paris, Franța');assert.equal(d.needs_location_clarification,true);assert.ok(!calls.some(u=>u.pathname==='/v2/places'));
variant='normal';d=await ask('7',undefined,{history:[{role:'user',content:exact}],place_context:pending});assert.equal(d.needs_location_clarification,true);assert.equal(d.destination_candidates.length,2);
globalThis.fetch=baseFetch;
console.log('PASS: exact Paris central wording, cross/same-country choices, duplicate settlement merge, road rejection, French/number selection, retained selected context, strict explicit France, multiple recovered hotel classifications.');
// v106: the user's exact GPS-origin formulation must never geocode "locatia mea".
const fetchBefore106=globalThis.fetch;let geoRequests=[],routingPoints='';
const ams={name:'Amsterdam',lat:'52.3676',lon:'4.9041',class:'boundary',type:'administrative',addresstype:'city',display_name:'Amsterdam, Netherlands',address:{city:'Amsterdam',country:'Netherlands',country_code:'nl'}};
const amsUS={name:'Amsterdam',lat:'42.9387',lon:'-74.1882',class:'place',type:'city',display_name:'Amsterdam, New York, United States',address:{city:'Amsterdam',state:'New York',country:'United States',country_code:'us'}};
let ambiguousAmsterdam=false;
globalThis.fetch=async input=>{const u=new URL(input);
 if(u.hostname==='nominatim.openstreetmap.org'){
  const q=u.searchParams.get('q');geoRequests.push(q);assert.ok(!/locati|poziti|my location|my current position/i.test(q));
  if(q.toLowerCase().includes('amsterdam'))return Response.json(ambiguousAmsterdam?[ams,amsUS]:[ams]);
  if(q.toLowerCase()==='londra'||q.toLowerCase()==='london')return Response.json([{name:'London',namedetails:{'name:ro':'Londra'},lat:'51.5074',lon:'-.1278',addresstype:'city',display_name:'London, United Kingdom',address:{city:'London',country_code:'gb'}}]);
  throw Error('Unexpected geocode '+q);
 }
 if(u.pathname==='/v1/routing'){routingPoints=u.searchParams.get('waypoints');return Response.json({features:[{properties:{distance:560000,time:22000}}]})}
 throw Error('Unexpected '+u.hostname);
};
for(const phrase of ['Calculează distanța rutieră din locația mea până în Amsterdam','Calculează distanța rutieră de la poziția mea GPS până la Amsterdam','Calculate the driving distance from my current position to Amsterdam']){
 geoRequests=[];d=await ask(phrase,{latitude:51.48,longitude:.28});assert.equal(d.distance_type,'road');assert.equal(d.origin_source,'browser_gps');assert.equal(d.distance_meters,560000);assert.deepEqual(geoRequests,['Amsterdam']);assert.equal(routingPoints,'51.48,0.28|52.3676,4.9041');
}
const exactDistance='Calculează distanța rutieră din locația mea până în Amsterdam';
geoRequests=[];d=await ask(exactDistance,null);assert.equal(d.needs_origin_clarification,true);assert.equal(geoRequests.length,0);let routeContext=d.distance_context;assert.equal(routeContext.road_requested,true);
d=await ask('Londra',null,{distance_context:routeContext});assert.equal(d.distance_type,'road');assert.equal(d.origin_source,'explicit_place_query');assert.ok(routingPoints.startsWith('51.5074,-0.1278|'));
ambiguousAmsterdam=true;d=await ask(exactDistance,{latitude:51.48,longitude:.28});assert.equal(d.needs_location_clarification,true);assert.equal(d.destination_candidates.length,2);routeContext=d.distance_context;assert.equal(routeContext.pending_role,'destination');assert.equal(routeContext.origin_query,'');assert.equal(routeContext.road_requested,true);
d=await ask('Olanda',{latitude:51.48,longitude:.28},{distance_context:routeContext});assert.equal(d.distance_type,'road');assert.equal(d.origin_source,'browser_gps');assert.equal(d.destination.country_code,'NL');assert.equal(d.distance_context,null);
d=await ask('2',{latitude:51.48,longitude:.28},{distance_context:routeContext});assert.equal(d.destination.country_code,'US');assert.equal(d.distance_type,'road');
d=await ask('7',{latitude:51.48,longitude:.28},{distance_context:routeContext});assert.equal(d.needs_location_clarification,true);assert.equal(d.destination_candidates.length,2);
globalThis.fetch=fetchBefore106;
console.log('PASS: exact GPS-origin Amsterdam query; de-la and English variants; missing GPS then typed origin; ambiguous Amsterdam selection by country/number; driving mode retained; no guessed route.');
// v107: POI walking routes and follow-up map requests share context across modules.
const old107Fetch=globalThis.fetch;let geocodeTexts=[],routeModes=[],emptyFirst=true,missingGeometry=false;
const shopping={latitude:51.478,longitude:.323,label:'Grays Shopping Centre, Grays, United Kingdom',country_code:'GB'};
globalThis.fetch=async input=>{const u=new URL(input);
 if(u.pathname==='/v1/geocode/search'){
  const text=u.searchParams.get('text');geocodeTexts.push(text);assert.ok(u.searchParams.get('bias').startsWith('proximity:'));
  if(emptyFirst&&!text.toLowerCase().includes('uk'))return Response.json({features:[]});
  assert.equal(u.searchParams.get('filter'),'countrycode:gb');return Response.json({features:[{properties:{lat:shopping.latitude,lon:shopping.longitude,name:'Grays Shopping Centre',formatted:shopping.label,country_code:'gb',categories:['commercial.shopping_mall']}}]});
 }
 if(u.pathname==='/v1/routing'){routeModes.push(u.searchParams.get('mode'));return Response.json({features:[{properties:{distance:1250,time:950},...(missingGeometry?{}:{geometry:{type:'MultiLineString',coordinates:[[[.28,51.48],[.3,51.479],[.323,51.478]]]}})}]})}
 throw Error('Unexpected '+u.hostname+u.pathname);
};
const routeQuestion='Arată-mi un traseu pietonal până la grays shopping center';
d=await ask(routeQuestion,{latitude:51.48,longitude:.28},{module:'maps'});assert.equal(d.route_available,false);assert.equal(d.location_received,true);assert.equal(d.needs_destination_clarification,true);assert.ok(d.reply.includes('Am punctul de plecare'));let routePending=d.route_context;assert.equal(routePending.profile,'walk');
d=await ask('Grays UK',{latitude:51.48,longitude:.28},{module:'maps',route_context:routePending});assert.equal(d.route_available,true);assert.equal(d.route.profile,'walk');assert.equal(d.route.coordinates.length,3);assert.ok(geocodeTexts.at(-1).includes('shopping center, Grays UK'));assert.equal(routeModes.at(-1),'walk');
let lastRouteContext=d.route_context;
d=await ask('Afișează pe hartă traseul sau traseele pe care trebuie să le urmez',{latitude:51.48,longitude:.28},{route_context:lastRouteContext});assert.equal(d.route_available,true);assert.equal(d.auto_open_map,true);assert.equal(d.route.destination.label,shopping.label);assert.equal(d.route.profile,'walk');
d=await ask('Afișează pe hartă traseul',{latitude:51.48,longitude:.28},{route_context:{profile:'drive',origin_query:'',destination_query:'Oradea, Romania',destination:{latitude:47.05,longitude:21.94,label:'Oradea, Romania'}}});assert.equal(d.route.profile,'drive');assert.equal(routeModes.at(-1),'drive');
d=await ask(routeQuestion,null,{coordinates:{latitude:51.48,longitude:.28}});assert.equal(d.location_received,true);
d=await ask(routeQuestion,{latitude:51.48,longitude:.28,updatedAt:Date.now()-700000});assert.equal(d.needs_origin_clarification,true);
d=await ask(routeQuestion,{latitude:51.48,longitude:.28,updatedAt:Date.now()+5000});assert.equal(d.location_received,true,'small phone/server clock skew is not lost GPS');
missingGeometry=true;d=await ask('Afișează pe hartă traseul',{latitude:51.48,longitude:.28},{route_context:lastRouteContext});assert.equal(d.route_available,false);assert.ok(d.route_context.destination);missingGeometry=false;
d=await ask('Afișează traseul pe hartă',{latitude:51.48,longitude:.28},{history:[{role:'user',content:'Calculează distanța rutieră până în Oradea, Romania'}]});assert.equal(d.needs_destination_clarification,true);assert.equal(d.route_context.profile,'drive');assert.equal(d.route_context.destination_query,'Oradea, Romania');
globalThis.fetch=old107Fetch;
console.log('PASS: Grays POI route, town/country clarification, GPS retained across destination failures, map follow-up context, drive/walk preserved, coordinate alias, expired GPS, no geometry invented.');
console.info=originalLog;console.warn=originalWarn;console.log('PASS: Berlin overrides UK GPS, no-GPS named city, central 2km scope, 5-star and 5S filtering, missing stars excluded, near-me GPS retained, failed/empty/ambiguous destination never falls back to GPS, city clarification.');
