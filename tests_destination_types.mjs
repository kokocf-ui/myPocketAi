import assert from 'node:assert/strict';import {webcrypto} from 'node:crypto';import worker from './backend.js';globalThis.crypto??=webcrypto;
const logs={info:console.info,warn:console.warn,error:console.error};console.info=console.warn=console.error=()=>{};
const gps={latitude:51.5,longitude:.1,updatedAt:Date.now()},point={lat:51.46,lon:.35};let calls=[],mode='mixed';
const foreign={properties:{name:'Magazin',formatted:'Magazin, Dortmund, Germany',city:'Dortmund',country_code:'de',lat:51.5,lon:7.5}},wrongRoad={properties:{name:'Europa Road',street:'Europa Road',formatted:'Europa Road, Grays, United Kingdom',city:'Grays',country_code:'gb',result_type:'street',...point}},shop={properties:{name:'Europa Supermarket',formatted:'Europa Supermarket, Grays, United Kingdom',city:'Grays',country_code:'gb',categories:['commercial.supermarket'],...point}};
globalThis.fetch=async input=>{const u=new URL(input);calls.push(u);
 if(u.pathname==='/v1/geocode/search'){
  const q=u.searchParams.get('text');if(mode==='address')return Response.json({features:[shop,{properties:{name:'Europa',formatted:'10 Europa Road, Grays, United Kingdom',city:'Grays',housenumber:'10',street:'Europa Road',result_type:'building',...point}}]});
  if(mode==='poi-fallback'){if(q.toLowerCase()==='grays')return Response.json({features:[{properties:{name:'Grays',formatted:'Grays, United Kingdom',result_type:'city',place_id:'grays-boundary',lat:51.47,lon:.34}}]});return Response.json({features:[foreign,wrongRoad]});}
  return Response.json({features:mode==='wrong'?[foreign,wrongRoad]:[foreign,wrongRoad,shop]});
 }
 if(u.pathname==='/v2/places'){if(mode==='poi-fallback'&&u.searchParams.get('name')==='Europa'){assert.equal(u.searchParams.get('filter'),'place:grays-boundary');assert.ok(u.searchParams.get('categories').includes('commercial'));return Response.json({features:[shop]});}return Response.json({features:[]});}
 if(u.pathname==='/v1/routing'){const coords=u.searchParams.get('waypoints').split('|').map(v=>{const [lat,lon]=v.split(',').map(Number);return [lon,lat]});return Response.json({features:[{geometry:{type:'LineString',coordinates:coords},properties:{distance:2000,time:1800,legs:[{steps:[{distance:2000,instruction:{text:'Verified route'}}]}]}}]});}
 if(u.pathname.includes('/JourneyResults/'))return Response.json({journeys:[]});throw Error(u.pathname);
};
async function ask(message,extra={}){calls=[];return(await worker.fetch(new Request('https://fixture/api/chat',{method:'POST',body:JSON.stringify({message,language:'ro',location:gps,history:[],...extra})}),{GEOAPIFY_API_KEY:'fixture',TFL_APP_KEY:'fixture',AI:{run(){throw Error('No guessed POI')}}})).json()}
for(const prompt of ['Vreau sa ajung la Europa din Grays','Vreau sa ajung la magazin Europa din Grays','Vreau sa ajung in Grays la Europa']){
 const first=await ask(prompt);assert.equal(first.needs_travel_mode,true);assert.match(first.route_context.destination_query,/Europa, Grays/i);
 const result=await ask('Pe jos',{route_context:first.route_context,history:[{role:'user',content:prompt}]});assert.equal(result.route_available,true);assert.ok(result.route.destination.label.includes('Europa Supermarket'));assert.ok(!result.destination_candidates?.length);
 mode='wrong';const rejected=await ask('Pe jos',{route_context:first.route_context});assert.equal(rejected.route_available,false);assert.equal(rejected.needs_destination_clarification,true);assert.ok(!rejected.destination_candidates?.length);assert.ok(!calls.some(u=>u.pathname==='/v1/routing'));mode='mixed';
}
mode='poi-fallback';let response=await ask('Traseu pietonal la magazin Europa din Grays');assert.equal(response.route_available,true);assert.ok(calls.some(u=>u.pathname==='/v2/places'&&u.searchParams.get('name')==='Europa'));
mode='address';response=await ask('Traseu pietonal la 10 Europa Rd, Grays');assert.equal(response.route_available,true);assert.ok(response.route.destination.label.startsWith('10 Europa Road'),'street address must not be replaced by similarly named shop');
mode='mixed';await ask('Vreau sa ajung in Grays la magazin Europa cu transport public');assert.ok(calls.some(u=>u.pathname.includes('/JourneyResults/')));assert.match(calls.find(u=>u.pathname==='/v1/geocode/search')?.searchParams.get('text'),/Europa, grays/i);
console.info=logs.info;console.warn=logs.warn;console.error=logs.error;console.log('PASS: named store with/without category and city-first wording, typed walking continuation, no foreign generic shops or same-name streets, town-bound POI fallback, street/house/alias verification and public transport.');
