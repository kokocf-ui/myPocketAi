import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import worker from './backend.js';
globalThis.crypto??=webcrypto;
const source=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const ctx={};vm.createContext(ctx);vm.runInContext(source.slice(source.indexOf('function extractTransitDestination('),source.indexOf('// Coordinate-backed boarding places')),ctx);
const exact='Vreau să ajung de la locația mea actuală la Victoria Station din centrul Londrei, folosind transportul în comun. Arată-mi mai multe variante.';
for(const [message,want] of [
 [exact,'victoria station london'],
 ['Vreau să ajung la Victoria Station în London cu transportul în comun.','victoria station london'],
 ['Take me from my current location to Victoria Station in central London using public transport. Show me several options.','victoria station london'],
 ['Transport public până la Test Destination','test destination'],
 ['Vreau transport în comun până în Paris','paris'],
 ['Cu transportul în comun la Gara de Nord București','gara de nord bucuresti'],
 ['Vreau transport în comun de la locația mea actuală',''],
 ['Transport în comun',''],
 ['Vreau transport public la London Road','london road']
])assert.equal(ctx.extractTransitDestination(message),want,message);
const logs={info:console.info,warn:console.warn,error:console.error};console.info=console.warn=console.error=()=>{};
let calls=[];
globalThis.fetch=async input=>{const u=new URL(input);calls.push(u);
 if(u.pathname.startsWith('/StopPoint/Search/'))return Response.json({matches:[{id:'public-victoria-id',commonName:'London Victoria Rail Station',lat:51.4952,lon:-.1439}]});
 if(u.pathname.includes('/JourneyResults/'))return Response.json({journeys:[]});
 if(u.pathname==='/v1/geocode/search')return Response.json({features:[]});
 throw Error('Unexpected provider '+u.pathname);
};
async function ask(message){calls=[];return(await worker.fetch(new Request('https://fixture/api/chat',{method:'POST',body:JSON.stringify({message,language:'ro',history:[],location:{latitude:51.5,longitude:-.14,updatedAt:Date.now()}})}),{GEOAPIFY_API_KEY:'fixture',TFL_APP_KEY:'fixture',AI:{run(){throw Error('Do not invent journey')}}})).json()}
let result=await ask(exact);
assert.ok(calls.some(u=>u.pathname==='/StopPoint/Search/victoria'),'exact chat request searches the requested station, not comun or London');
assert.ok(calls.some(u=>u.pathname.includes('/to/public-victoria-id')),'operator-selected station id reaches journey planner');
assert.ok(!calls.some(u=>u.hostname==='api.geoapify.com'),'a verified operator station must not be re-geocoded');
assert.notEqual(result.pending_destination,'comun');
result=await ask('Vreau transport în comun de la locația mea actuală');assert.equal(result.needs_destination_clarification,true);assert.equal(calls.length,0,'origin and transport mode cannot become a destination');
result=await ask('Vreau să ajung în Paris folosind transportul în comun. Arată-mi variante.');
assert.equal(calls.find(u=>u.pathname==='/v1/geocode/search')?.searchParams.get('text'),'paris');assert.equal(result.pending_destination,'paris');
console.info=logs.info;console.warn=logs.warn;console.error=logs.error;
console.log('PASS: full Romanian/English transit request, Londrei city qualifier preserves Victoria Station, official station id used, mode/instructions never geocoded, missing destination clarified.');
