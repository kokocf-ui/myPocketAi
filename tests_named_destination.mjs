import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import worker from './backend.js';
globalThis.crypto??=webcrypto;
const logs={info:console.info,warn:console.warn,error:console.error};console.info=console.warn=console.error=()=>{};
let calls=[],mode='mixed';
const gps={latitude:51.5,longitude:.1,updatedAt:Date.now()};
const right={properties:{name:'Zani Restaurant',formatted:'Zani Restaurant, Tilbury, United Kingdom',city:'Tilbury',lat:51.46,lon:.35,country_code:'gb'}};
const wrong={properties:{name:'Chinar Restaurant',formatted:'Chinar Restaurant, Yerevan, Armenia',city:'Yerevan',lat:40.18,lon:44.51,country_code:'am'}};
const wrongSameName={properties:{...wrong.properties,name:'Zani Restaurant',formatted:'Zani Restaurant, Yerevan, Armenia'}};
globalThis.fetch=async input=>{const u=new URL(input);calls.push(u);
 if(u.pathname==='/v1/geocode/search')return Response.json({features:mode==='wrong'?[wrong,wrongSameName]:[wrong,wrongSameName,right]});
 if(u.pathname==='/v2/places')return Response.json({features:[]});
 if(u.pathname==='/v1/routing'){const pts=u.searchParams.get('waypoints').split('|').map(v=>v.split(',').map(Number));return Response.json({features:[{geometry:{type:'LineString',coordinates:pts.map(p=>[p[1],p[0]])},properties:{distance:3000,time:2400,distance_units:'meters',legs:[{steps:[{distance:3000,instruction:{text:'Provider directions to requested restaurant'}}]}]}}]});}
 if(u.pathname.includes('/JourneyResults/'))return Response.json({journeys:[]});
 throw Error('Unexpected '+u.pathname);
};
async function ask(message,extra={}){calls=[];return(await worker.fetch(new Request('https://fixture/api/chat',{method:'POST',body:JSON.stringify({message,language:'ro',location:gps,history:[],...extra})}),{GEOAPIFY_API_KEY:'fixture',TFL_APP_KEY:'fixture',AI:{run(){throw Error('No guessed places')}}})).json()}
for(const prompt of ['Vreau sa ajung in Tilbury la restaurant zani, ce opțiuni am?','Vreau sa ajung la restaurantul zani din Tilbury, ce opțiuni am?','Cum ajung la restaurantul Zani din Tilbury?']){
 let first=await ask(prompt);assert.equal(first.route_context.pending,'profile');assert.ok(first.reply.includes('transportul public'));assert.match(first.route_context.destination_query,/zani, Tilbury/i);assert.ok(!first.route_context.destination_query.includes('optiuni'));assert.equal(calls.length,0);
 let walk=await ask('Pietonal',{route_context:first.route_context,history:[{role:'user',content:prompt},{role:'assistant',content:first.reply}]});assert.equal(walk.route_available,true);assert.match(calls.find(u=>u.pathname==='/v1/geocode/search').searchParams.get('text'),/zani, Tilbury/i);assert.equal(walk.route.destination.latitude,right.properties.lat);assert.ok(!JSON.stringify(walk.destination_candidates||[]).includes('Armenia'));
 // Current conversation context must override a previous journey/boarding stop.
 let recovery=await ask('Pietonal',{history:[{role:'user',content:'Vreau transport public la Victoria Station London'},{role:'user',content:prompt},{role:'assistant',content:first.reply}]});assert.equal(recovery.route_available,true);assert.equal(recovery.route.destination.latitude,right.properties.lat);
 let historyTransit=await ask('Cu transportul public',{history:[{role:'user',content:prompt},{role:'assistant',content:first.reply}]});assert.ok(calls.some(u=>u.pathname.includes('/JourneyResults/')),'mode-only transit recovers destination from user history too');
 let transit=await ask('Cu transportul public',{route_context:first.route_context,history:[{role:'user',content:prompt},{role:'assistant',content:first.reply}]});assert.ok(calls.some(u=>u.pathname.includes('/JourneyResults/')));assert.equal(transit.needs_destination_clarification,undefined);assert.ok(!JSON.stringify(transit).includes('Yerevan'));
 mode='wrong';let missing=await ask('Pietonal',{route_context:first.route_context});assert.equal(missing.needs_destination_clarification,true);assert.equal(missing.route_available,false);assert.match(missing.route_context.destination_query,/zani, Tilbury/i);assert.ok(!missing.destination_candidates?.length);assert.ok(!calls.some(u=>u.pathname==='/v1/routing'));
 let missingTransit=await ask('Transport public la restaurantul Zani din Tilbury');assert.equal(missingTransit.needs_destination_clarification,true);assert.ok(!calls.some(u=>u.pathname.includes('/JourneyResults/')));mode='mixed';
}
// A named restaurant can be in another country; local GPS must not override its explicit city.
const oldFetch=globalThis.fetch;globalThis.fetch=async input=>{const u=new URL(input);if(u.pathname==='/v1/geocode/search')return Response.json({features:[{properties:{...right.properties,name:'Zani Restaurant',formatted:'Zani Restaurant, Paris, France',city:'Paris',lat:48.86,lon:2.35,country_code:'fr'}}]});return oldFetch(input)};
const abroad=await ask('Traseu pietonal la restaurantul Zani din Paris');assert.equal(abroad.route_available,true);assert.equal(abroad.route.destination.latitude,48.86);
console.info=logs.info;console.warn=logs.warn;console.error=logs.error;
console.log('PASS: venue/city retained in both word orders, question clauses removed, walking/public-transport mode follow-ups, history recovery, unrelated/same-name foreign matches rejected, explicit foreign city retained.');
