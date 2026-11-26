// Real Worker orchestration with mocked model/providers. Never a live quality claim.
import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import app from './backend.js';
globalThis.crypto??=webcrypto;
const originalFetch=globalThis.fetch,info=console.info,warn=console.warn;
let network=[],prompts=[],drafts=[];
const env={GEOAPIFY_API_KEY:'mock-geo',TOMTOM_API_KEY:'mock-tomtom',AI:{run:async(model,options)=>{
 prompts.push(options);return {response:drafts.shift()||'Putem privi ideea din două unghiuri: ce vrei să obții și ce te împiedică acum. Alege un exemplu concret, apoi separăm împreună pașii care depind de tine de lucrurile care cer informații în plus.'};
}}};
globalThis.fetch=async input=>{const u=new URL(typeof input==='string'?input:input.url||input);network.push(u.href);return Response.json({results:[],features:[],web:{results:[]}})};
console.info=()=>{};console.warn=()=>{};
async function ask(message,history=[]){network=[];prompts=[];const response=await app.fetch(new Request('https://unit.test/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message,language:'ro',module:'assistant',history,location:{latitude:51.5,longitude:-.1},coordinates:{latitude:51.5,longitude:-.1},location_requested:true,route_context:{destination:{label:'Victoria Station',latitude:51.49,longitude:-.14}},place_context:{category:'restaurant',query:'Londra'}})}),env);const data=await response.json();assert.equal(response.status,200,JSON.stringify(data));return data}
try{
 for(const message of ['Haz de necaz','Neuroplasticitate','Răbdare și curaj','Am o idee','Caută idei pentru un cadou','Explică-mi cum aleg un restaurant bun','Nu caut un restaurant lângă mine, vorbeam despre o glumă','Traseu profesional','De la teorie la practică','Ce înseamnă adresa IP?']){
  const data=await ask(message);assert.equal(data.journey_handoff,undefined,message);assert.ok(data.reply);assert.ok(!data.places?.length,message);
  assert.deepEqual(network.filter(u=>/geoapify|nominatim|photon|tomtom|transportapi|tfl\.gov/.test(u)),[],message+' must not invoke a geographic provider');
 }
 const same='Sunt aici să te ascult și să te ajut să găsești o variantă potrivită pentru tine, pas cu pas, fără să ne grăbim.';
 drafts=[same,'Hai s-o luăm concret: ce ți-a rămas în minte din ziua de azi? Pornim de acolo, nu dintr-un răspuns de manual.'];
 const result=await ask('Fii mai naturală, nu te repeta.',[{role:'user',content:'Am avut o zi grea și vreau să povestim.'},{role:'assistant',content:same}]);
 assert.equal(prompts.length,2,'One bounded retry when model repeats the last answer');assert.match(result.reply,/ce ți-a rămas/);assert.ok(prompts[1].messages.some(x=>x.content.includes('zi grea')),'Keep the relevant conversational subject when varying a reply');
 assert.deepEqual(network,[],'Conversational variation never searches providers');
 info('PASS Worker: no geocoding for 10 non-spatial/unclear requests despite cached GPS and stale route/place context; new social answer retries once and keeps subject (AI/providers mocked).');
}finally{globalThis.fetch=originalFetch;console.info=info;console.warn=warn}
