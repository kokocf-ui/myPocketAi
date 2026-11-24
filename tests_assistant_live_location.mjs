import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import worker from './backend.js';

// Regression for the South Stifford / Mill Lane screenshots.
// Provider data is simulated: no user coordinates, external calls or AI generation are needed.
const originalFetch=globalThis.fetch;
const calls=[];
globalThis.fetch=async input=>{
 const url=new URL(typeof input==='string'?input:input.url||String(input));
 calls.push(url);
 assert.equal(url.hostname,'nominatim.openstreetmap.org','Position answers must never search the web or invoke the LLM');
 assert.equal(url.pathname,'/reverse');
 assert.equal(url.searchParams.get('zoom'),'18');
 return Response.json({
  address:{house_number:'10',road:'Mill Lane',suburb:'South Stifford',
   town:'Grays',postcode:'RM20 4YE',country:'United Kingdom'}
 });
};
async function ask(message,{accuracy=20,ageMs=0,language='ro'}={}){
 const response=await worker.fetch(new Request('https://test.invalid/api/chat',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({message,language,module:'assistant',history:[],location_requested:true,
   location:{latitude:51.479,longitude:0.29,accuracy,updatedAt:Date.now()-ageMs}})
 }),{AI:{run:async()=>{throw Error('Self-location must not invoke AI')}}});
 assert.equal(response.status,200);
 return response.json();
}
try{
 let result=await ask('Unde mă aflu?');
 assert.equal(result.location_received,true,JSON.stringify(result).slice(0,500));
 assert.match(result.reply,/10 Mill Lane/);
 assert.doesNotMatch(result.reply,/South Stifford/);
 assert.match(result.reply,/Grays/);
 assert.match(result.reply,/RM20 4YE/);
 assert.equal(result.house_number,'10');
 assert.equal(result.postcode,'RM20 4YE');
 assert.equal(result.gps_accuracy_m,20);

 result=await ask('Pe ce stradă mă aflu?');
 assert.match(result.reply,/10 Mill Lane/);
 result=await ask('Eva, unde mă aflu?');
 assert.match(result.reply,/10 Mill Lane/);
 result=await ask('Where am I?',{language:'en'});
 assert.match(result.reply,/10 Mill Lane/);

 result=await ask('Unde mă aflu?',{accuracy:1200});
 assert.equal(result.house_number,null,'Coarse Android location must not assert a precise building number');
 assert.equal(result.street,null,'Coarse location must not assert a street');
 assert.equal(result.postcode,null,'Coarse location must not assert a postcode');
 assert.doesNotMatch(result.reply,/Mill Lane|RM20 4YE/);
 assert.match(result.reply,/Locație aproximativă: Grays, United Kingdom/);
 assert.match(result.reply,/Nu pot confirma numărul clădirii/);

 const callsBeforeStale=calls.length;
 result=await ask('Unde mă aflu?',{ageMs:120000});
 assert.equal(result.location_received,false,'An old fix must not be presented as current');
 assert.equal(calls.length,callsBeforeStale,'Stale location must not be reverse geocoded');
}finally{globalThis.fetch=originalFetch}

const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
assert.match(frontend,/function needsLocation\(text\).*unde ma aflu/);
assert.ok(frontend.includes('maximumAge:forceRefresh?0:30000'),'Force-refresh may not use a cached geolocation fix');
assert.ok(frontend.includes('updatedAt:pos.timestamp'),'Preserve provider GPS acquisition time');
assert.ok(frontend.includes('selfQuery&&(!fallback||fallback.age_ms>30000)'),'Old position must not be reused for where-am-I');
console.log('PASS: self-location intent, accurate street/postcode, coarse fix, stale rejection, frontend refresh contract');
