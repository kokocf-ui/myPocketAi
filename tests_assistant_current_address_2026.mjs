import assert from 'node:assert/strict';
import vm from 'node:vm';
import worker from './backend.js';
import frontend from './index.js';
import {assistantSelfLocationQuery} from './assistant_self_location.mjs';
import {assistantJourneyHandoff} from './assistant_bare_destination.mjs';

const questions=['La ce adresă sunt?','Eva, la ce adresă mă aflu?',
 'Care este adresa la care mă aflu?','Care e adresa mea?',
 'Adresa locației mele','Unde mă aflu?', 'Unde sunt exact?', 'Pe ce stradă sunt?',
 'Ce adresă am acum?', 'Care este codul poștal al locației mele?',
 'Care este numărul casei unde mă aflu?', 'What is my current address?',
 'What address am I at?','Where am I?'];
for(const q of questions){
 assert.equal(assistantSelfLocationQuery(q),true,q);
 assert.equal(assistantJourneyHandoff(q),null,'Not a journey: '+q);
}
for(const q of ['Care este adresa muzeului din Londra?', 'Ce înseamnă adresa IP?',
 'Unde sunt restaurante în apropiere?', 'La ce adresă este spitalul?',
 'Unde este localizat ficatul în corp?', 'Cum se schimbă adresa de email?'])
 assert.equal(assistantSelfLocationQuery(q),false,q);

let calls=[],farPrimary=false;
const savedFetch=globalThis.fetch;
globalThis.fetch=async input=>{
 const url=new URL(typeof input==='string'?input:input.url||String(input));
 calls.push(url);
 if(url.hostname==='nominatim.openstreetmap.org')return Response.json(farPrimary?{
   category:'place',addresstype:'house',lat:'51.48',lon:'0.29',
   address:{house_number:'99',road:'Mill Lane',town:'Grays',postcode:'RM20 4YE',country:'United Kingdom',country_code:'gb'}
 }:{
   category:'highway',addresstype:'road',lat:'51.479',lon:'0.29',
   address:{road:'Mill Lane',town:'Grays',postcode:'RM20 4YE',country:'United Kingdom',country_code:'gb'}
 });
 if(url.hostname==='api.postcodes.io')return Response.json({status:200,result:[
  {postcode:'RM20 4YD',distance:8},{postcode:'RM20 4YE',distance:13}
 ]});
 if(url.hostname==='overpass.kumi.systems')return Response.json({elements:[
  {type:'node',lat:51.47902,lon:0.29001,tags:{'addr:housenumber':'12','addr:street':'Mill Lane','addr:postcode':'RM20 4YE'}},
  {type:'node',lat:51.47905,lon:0.29001,tags:{'addr:housenumber':'14','addr:street':'Mill Lane'}},
  {type:'node',lat:51.49,lon:0.29,tags:{'addr:housenumber':'99','addr:street':'Mill Lane'}}
 ]});
 throw Error('Unexpected provider '+url.href);
};
try{
 for(const message of questions){
  calls=[];
  const response=await worker.fetch(new Request('https://test.invalid/api/chat',{
   method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
    message,language:'ro',module:'assistant',history:[],location_requested:true,
    weather_context:{query:'Oradea',period:'daily',offset:0,pending:true},
    place_context:{category:'restaurant',destination:'Oradea'},
    route_context:{destination_query:'București',pending:'destination_detail'},
    location:{latitude:51.479,longitude:0.29,accuracy:5,updatedAt:Date.now()}
   })
  }),{AI:{run:async()=>{throw Error('Address question must not call AI')}}});
  const result=await response.json();
  assert.equal(response.status,200,message);
  assert.equal(result.current_location,true,JSON.stringify({message,result}));
  assert.equal(result.address_is_estimate,true);
  assert.equal(result.house_number,null);
  assert.match(result.reply,/Locație aproximativă: Mill Lane, Grays/);
  assert.doesNotMatch(result.reply,/Coduri poștale din apropiere|RM20 4YD/);
  assert.equal(result.postcode,null);assert.deepEqual(result.nearby_postcodes,[]);
  assert.match(result.reply,/Nu pot confirma numărul clădirii/);
  assert.match(result.reply,/12 Mill Lane/);
  assert.match(result.reply,/14 Mill Lane/);
  assert.doesNotMatch(result.reply,/99 Mill Lane/);
  assert.equal(result.nearby_addresses.length,2);
  assert.ok(calls.some(u=>u.hostname==='overpass.kumi.systems'));
 }
 farPrimary=true;
 const farResponse=await worker.fetch(new Request('https://test.invalid/api/chat',{
  method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:'La ce adresă sunt?',language:'ro',module:'assistant',history:[],location_requested:true,
   location:{latitude:51.479,longitude:0.29,accuracy:5,updatedAt:Date.now()}})
 }),{AI:{run:async()=>{throw Error('Address must not invoke AI')}}});
 const far=await farResponse.json();
 assert.equal(far.house_number,null,'Do not claim a distant reverse-geocoded building');
 assert.doesNotMatch(far.reply,/99 Mill Lane/);
 farPrimary=false;
 const response=await worker.fetch(new Request('https://test.invalid/api/chat',{
  method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message:'La ce adresă sunt?',language:'ro',module:'assistant',history:[],location_requested:true})
 }),{AI:{run:async()=>{throw Error('No GPS should not invoke AI')}}});
 const missing=await response.json();
 assert.equal(missing.location_received,false);
 assert.match(missing.reply,/Nu am primit coordonate GPS/);
}finally{globalThis.fetch=savedFetch}

const html=await (await frontend.fetch(new Request('https://test.invalid/'))).text();
assert.ok(html.length<8_000_000);
const script=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1]||'';
const start=script.indexOf('function isRecipeQuestion(text){');
const end=script.indexOf('function requestedTransitCountInMessage(value){',start);
assert.ok(start>0&&end>start);
const ctx=vm.createContext({state:{currentView:'assistant',pendingTravelMode:null},assistantSelfLocationQuery,
 assistantBareDestinationQuery:()=>null,cachedCoordinates:()=>null,getCurrentCoordinates:async()=>null,setTimeout,clearTimeout});
vm.runInContext(script.slice(start,end),ctx);
for(const q of questions)assert.equal(ctx.requestUsesLocation(q),true,'Frontend must request fresh GPS: '+q);
for(const q of ['Ce înseamnă adresa IP?', 'Cum funcționează GPS?', 'La ce temperatură fierbe apa?'])
 assert.equal(ctx.requestUsesLocation(q),false,'Non-location question: '+q);
console.log('PASS self-address variants, GPS requirement, nearby candidate addresses, unconfirmed postcode and honest precision');
