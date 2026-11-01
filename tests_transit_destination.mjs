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
// Reproduce both screenshot turns, using public-provider fixtures rather than personal GPS.
const first='Vreau sa ajung din locația mea in lakeside shopping center, cum ajung la primul mijloc de transport?';
const follow='Pietonal până la prima stație de autobuz';
assert.equal(ctx.extractTransitDestination(first),'lakeside shopping center');
assert.equal(ctx.transitConversationDestination(follow,[{role:'user',content:first},{role:'assistant',content:'Vrei un traseu pietonal sau cu mașina?'},{role:'user',content:follow}]),'lakeside shopping center');
assert.equal(ctx.transitConversationDestination(follow,[{role:'user',content:first},{role:'user',content:'Ce vreme este mâine?'}]),'','unrelated topic blocks stale trip recovery');
const testOrigin={latitude:51.5,longitude:.1,updatedAt:Date.now()},testEnd={lat:51.51,lon:.12},time=m=>new Date(Date.now()+m*60000).toISOString();
globalThis.fetch=async input=>{const u=new URL(input);calls.push(u);
 if(u.pathname==='/v1/geocode/search'){assert.equal(u.searchParams.get('text'),'lakeside shopping center','never geocode a generic boarding stop');return Response.json({features:[{properties:{...testEnd,name:'Lakeside Shopping Center',formatted:'Lakeside Shopping Center, Grays, United Kingdom',country:'United Kingdom'}}]});}
 if(u.pathname.includes('/JourneyResults/'))return Response.json({journeys:[{duration:30,startDateTime:time(45),arrivalDateTime:time(75),legs:[{mode:{name:'walking'},duration:5,departureTime:time(45),arrivalTime:time(50),departurePoint:{lat:51.5,lon:.1,commonName:'Fixture origin'},arrivalPoint:{lat:51.501,lon:.101,commonName:'Boarding stop'}},{mode:{name:'bus'},duration:25,departureTime:time(50),arrivalTime:time(75),departurePoint:{lat:51.501,lon:.101,commonName:'Boarding stop',naptanId:'board-id'},arrivalPoint:{...testEnd,commonName:'Lakeside Shopping Center'},routeOptions:[{lineIdentifier:{name:'Fixture bus'}}]}]}]});
 throw Error('Unexpected provider '+u.pathname);
};
async function screenshotAsk(message,history=[],location=testOrigin){calls=[];return(await worker.fetch(new Request('https://fixture/api/chat',{method:'POST',body:JSON.stringify({message,history,location,language:'ro'})}),{GEOAPIFY_API_KEY:'fixture',TFL_APP_KEY:'fixture',AI:{run(){throw Error('Do not invent a bus stop')}}})).json()}
for(const [message,history] of [[first,[]],[follow,[{role:'user',content:first},{role:'assistant',content:'Vrei un traseu pietonal sau cu mașina?'}]]]){
 const response=await screenshotAsk(message,history);assert.equal(response.transit_available,true);assert.equal(response.transit[0].boarding_stop.stop_id,'board-id');assert.ok(!response.reply.includes('Vrei un traseu pietonal sau cu mașina'));
}
result=await screenshotAsk(follow);assert.equal(result.needs_destination_clarification,true);assert.equal(calls.length,0,'without a final destination, ask instead of geocoding first bus stop');
result=await screenshotAsk(follow,[{role:'user',content:first},{role:'user',content:'Ce vreme este mâine?'}]);assert.equal(result.needs_destination_clarification,true);assert.equal(calls.length,0);
result=await screenshotAsk(first,[],null);assert.equal(result.reason,'origin_location_missing');assert.ok(!calls.some(u=>u.pathname.includes('/JourneyResults/')));
console.info=logs.info;console.warn=logs.warn;console.error=logs.error;
console.log('PASS: full Romanian/English transit request, Londrei city qualifier preserves Victoria Station, official station id used, mode/instructions never geocoded, missing destination clarified; screenshot first-transport intent, preserved Lakeside follow-up, actual boarding stop, GPS and topic boundaries.');
