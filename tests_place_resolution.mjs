import assert from 'node:assert/strict';import {webcrypto} from 'node:crypto';globalThis.crypto??=webcrypto;
const logs={info:console.info,warn:console.warn,error:console.error};console.info=console.warn=console.error=()=>{};
const gps={latitude:51.5,longitude:.1,updatedAt:Date.now()},target={lat:51.46,lon:.35},poi={properties:{...target,name:'Example Restaurant',formatted:'Example Restaurant, Tilbury, United Kingdom',city:'Tilbury',country_code:'gb'}};
let calls=[],scenario='';
globalThis.fetch=async(input,init)=>{const u=new URL(input);calls.push({u,init});
 if(u.pathname==='/v1/geocode/search'){
  const text=u.searchParams.get('text');
  if(text==='Example, Tilbury'&&scenario==='simplified')return Response.json({features:[poi]});
  if(text==='Tilbury')return Response.json({features:[{properties:{lat:51.461,lon:.351,name:'Tilbury',formatted:'Tilbury, United Kingdom',result_type:'city',place_id:'town-verified'}}]});
  if(/^166 Dock Road,? Tilbury$/i.test(text))return Response.json({features:[{properties:scenario==='address-city-only'?{...target,city:'Tilbury',formatted:'Tilbury, United Kingdom'}:{...target,housenumber:'166',street:'Dock Road',city:'Tilbury',formatted:'166 Dock Road, Tilbury, United Kingdom',country_code:'gb'}}]});
  return Response.json({features:[]});
 }
 if(u.pathname==='/v2/places'){
  if(scenario==='places'&&u.searchParams.get('name')==='Example'){assert.equal(u.searchParams.get('filter'),'place:town-verified');return Response.json({features:[{properties:{...poi.properties,city:undefined,formatted:undefined}}]});}
  return Response.json({features:[]});
 }
 if(u.hostname==='api.exa.ai'){
  assert.ok(!init.body.includes(String(gps.latitude)),'web query must not include GPS origin');
  const results=[{url:'https://merchant.example/restaurant',title:'Example Restaurant in Tilbury',highlights:['Example Restaurant, 166 Dock Road, Tilbury']}];
  if(scenario!=='one-source')results.push({url:scenario==='same-domain'?'https://merchant.example/other':'https://directory.example/venue',title:'Example Restaurant Tilbury',highlights:[scenario==='disagree'?'Example Restaurant, 168 Dock Road, Tilbury':'Example Restaurant, 166 Dock Road, Tilbury']});
  return Response.json({results});
 }
 if(u.pathname==='/v1/routing'){const coords=u.searchParams.get('waypoints').split('|').map(v=>{const [lat,lon]=v.split(',').map(Number);return [lon,lat]});return Response.json({features:[{geometry:{type:'LineString',coordinates:coords},properties:{distance:2000,time:1800,legs:[{steps:[{distance:2000,instruction:{text:'Verified provider walk'}}]}]}}]});}
 if(u.pathname.includes('/JourneyResults/'))return Response.json({journeys:[]});
 throw Error('Unexpected provider '+u.pathname);
};
for(const [i,testCase] of ['simplified','places','web','one-source','same-domain','disagree','address-city-only'].entries()){
 scenario=testCase;calls=[];const {default:worker}=await import('./backend.js?resolution='+i);
 const response=await(await worker.fetch(new Request('https://fixture/api/chat',{method:'POST',body:JSON.stringify({message:'Traseu pietonal la restaurant Example din Tilbury',language:'ro',history:[],location:gps})}),{GEOAPIFY_API_KEY:'fixture',EXA_API_KEY:'fixture',TFL_APP_KEY:'fixture',AI:{run(){throw Error('No invented coordinates')}}})).json();
 if(['simplified','places','web','one-source','same-domain','disagree'].includes(scenario)){assert.equal(response.route_available,true,scenario);assert.equal(response.route.destination.latitude,target.lat);if(scenario==='web'){assert.equal(response.route.destination.resolution_source,'verified_web_address');assert.equal(response.route.destination.resolution_sources.length,2);}}
 else{assert.equal(response.route_available,false,scenario);assert.equal(response.needs_destination_clarification,true);assert.ok(!calls.some(v=>v.u.pathname==='/v1/routing'));}
}
// The same name resolver also feeds the transit planner, using verified coordinates.
scenario='web';calls=[];const {default:worker}=await import('./backend.js?transit-fallback');await worker.fetch(new Request('https://fixture/api/chat',{method:'POST',body:JSON.stringify({message:'Transport public la restaurant Example din Tilbury',language:'ro',history:[],location:gps})}),{GEOAPIFY_API_KEY:'fixture',EXA_API_KEY:'fixture',TFL_APP_KEY:'fixture',AI:{run(){throw Error('No invented route')}}});assert.ok(calls.some(v=>v.u.pathname.endsWith('/to/51.46,0.35')));
console.info=logs.info;console.warn=logs.warn;console.error=logs.error;console.log('PASS: simplified name, town-bound named POI lookup, ranked address plus house/street geocode proof without a source-count gate, inadequate-address rejection, no GPS in web query, walking and transit resolver sharing.');
