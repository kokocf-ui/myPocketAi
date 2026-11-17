import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import frontend from './index.js';
import worker from './backend.js';
import {assistantBareDestinationQuery as bare,assistantJourneyHandoff as handoff,
 parseJourneyExpression as parse} from './assistant_bare_destination.mjs';

// Plain place requests are kept, but assistant navigation is redirected.
for(const value of [
 'Nufărului 12, Oradea','Strada Libertății 12, Oradea',
 'Strada Libertății, nr. 12, Oradea','12 Oxford Street, London',
 '25 Oxford Street, London','Hauptstraße 10, Berlin',
 '12 Rue de Rivoli, Paris','12 улица Ленина, Москва',
 'Hotel Marriott, București','Muzeul Țării Crișurilor din Oradea'
])assert.equal(bare(value),value,'bare address or venue: '+value);
for(const value of [
 'Ce este un traseu pietonal?','Explain what a route is',
 'Unde găsesc hoteluri în Londra?','Hoteluri ieftine în Londra',
 'Nufărului 12','Salut, ce faci?','Muzee în Oradea',
 '2 sticle, Oradea','12 cartușe, Oradea',
 "Vorbesc despre magazinul Sunny's Premiere din London road, Grays",
 "Te rog să-mi spui despre Sunny's de pe London Road, Grays",
 "Tell me about Premier Stores on London Road, Grays",
 "Unde găsesc magazine pe London Road, Grays?"
])assert.equal(handoff(value),null,'non-routing question should stay in assistant: '+value);
for(const value of [
 'Nufărului 12, Oradea','Du-mă la Nufărului 12, Oradea',
 'Cum ajung la muzeul din Oradea?','Traseu către Oradea',
 'Take me to 25 Oxford Street, London',
 'Directions to the British Museum, London',
 'De la Grays până la Oradea','From Grays to London',
 'Grays → London',
 'Grays to London',
 'Arată-mi traseul cu mașina din Oradea la Cluj-Napoca'
])assert.ok(handoff(value),'route should transfer: '+value);
assert.equal(parse('From Grays to London').origin_query,'Grays');
assert.equal(parse('From Grays to London').destination_query,'London');
assert.equal(bare("Vorbesc despre magazinul Sunny's Premiere din London road, Grays"),null,'A business description must not be a route');
assert.equal(bare('Oxford Street, London'),'Oxford Street, London','Valid short street still triggers route search');
assert.equal(parse('De la Grays până la Oradea').destination_query,'Oradea');
assert.equal(parse('Grays to London').origin_query,'Grays');
assert.equal(parse('Cum ajung la Victoria cu transportul public?').destination_query,'Victoria');
assert.equal(parse('Cum ajung la Victoria cu transportul public?').preferred_mode,'transit');
assert.equal(parse('Arată-mi traseul cu mașina din Oradea la Cluj-Napoca').origin_query,'Oradea');
assert.equal(parse('Arată-mi traseul cu mașina din Oradea la Cluj-Napoca').destination_query,'Cluj-Napoca');
assert.equal(parse('Arată-mi traseul cu mașina din Oradea la Cluj-Napoca').preferred_mode,'drive');

const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
assert.match(backend,/journey_suggest/);
assert.match(backend,/assistantJourneyHandoff\(data\.message\)/);
assert.match(backend,/exact_number_required/);
const frontSource=readFileSync(new URL('./index.js',import.meta.url),'utf8');
assert.match(frontSource,/ONE_FIELD_JOURNEY_SCRIPT/);
assert.match(frontSource,/function showJourneyMode\(choice\)\{\n if\(choice\?\.mixedJourney\)\{showOneFieldJourney/);
assert.match(frontSource,/if\(state\.currentView==='assistant'\)\{const route=assistantJourneyHandoff\(message\)/);
assert.match(frontSource,/if\(state\.currentView==='assistant'\)\{\n  const point=data\.route_context\.destination;/,'Verified Assistant POI handoff must redirect to Deplasare');
const oneField=readFileSync(new URL('./one_field_journey_ui.mjs',import.meta.url),'utf8');
assert.match(oneField,/input\.addEventListener\('input',schedule\)/,'Android uses the same native input trigger as national search');
assert.match(oneField,/if\(raw===observedRaw\)return/,'Duplicate IME input events must not repeatedly abort the HTTP request');
assert.match(oneField,/Promise\.race\(\[work,new Promise/,'Whole gateway exchange has bounded completion');
assert.match(oneField,/12000/,'Gateway does not spin indefinitely on a stalled network');
assert.doesNotMatch(oneField,/watchAndroidJourneyInput/,'Old extra Android polling was removed to prevent repeated cancellation');
assert.match(oneField,/controller\?\.abort\(\)/,'old suggestions are cancelled when text changes');

assert.match(oneField,/journey_suggest/,'suggestions use backend service');
assert.match(oneField,/transitDirect:true/,'mixed transit uses existing route engine');
assert.match(oneField,/state\.pendingTravelMode=mode/,'road modes use existing route engine');
assert.match(oneField,/const direct=incoming\?\.selected_destination/,'Direct Assistant POI selection reuses verified coordinates');
assert.doesNotMatch(oneField,/renderStructuredAddressPicker/,'old address wizard must be absent');
for(const language of ['ro','en','fr','de','it','es','pt','nl','ru','pl'])
 assert.ok(oneField.includes('\n '+language+':{title:'),'Missing journey interface localization: '+language);
const page=await(await frontend.fetch(new Request('https://quick-route.test/'))).text();
const inline=page.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline,'frontend generates script');
new vm.Script(inline);
assert.match(inline,/function showOneFieldJourney\(/);
assert.match(inline,/function assistantJourneyHandoff\(/);
assert.match(inline,/function parseJourneyExpression\(/);
assert.match(inline,/function handoffJourneyFromAssistant\(/);

// Existing shopping plural display remains unaffected.
const start=inline.indexOf('function shopQuantityUnitLabel('),
 end=inline.indexOf('function shopButton(',start);
assert.ok(start>0&&end>start);
const unit=vm.runInNewContext(inline.slice(start,end)+';shopQuantityUnitLabel',{state:{language:'ro'}});
for(const [q,u,result] of [
 ['1','sticlă','sticlă'],['2','sticlă','sticle'],['3','cartuș','cartușe'],
 ['2','bax','baxuri'],['2','cutie','cutii'],['1','kg','kg']
])assert.equal(unit(q,u),result);

// No route may be calculated inside the Personal Assistant.
const used=[];
const original=globalThis.fetch;
const pStreet={name:'Strada Nufărului',street:'Strada Nufărului',city:'Oradea',
 country:'Romania',country_code:'ro',housenumber:'12',result_type:'building',
 formatted:'Strada Nufărului 12, Oradea, Romania',lat:47.0605,lon:21.935};
const pOther={...pStreet,housenumber:'14',formatted:'Strada Nufărului 14, Oradea, Romania',lat:47.062,lon:21.936};
const pLondon={name:'Oxford Street',street:'Oxford Street',city:'London',
 country:'United Kingdom',country_code:'gb',housenumber:'25',result_type:'building',
 formatted:'25 Oxford Street, London, UK',lat:51.5154,lon:-.1418};
const pMuseum={name:'Muzeul Țării Crișurilor',city:'Oradea',
 country:'Romania',country_code:'ro',result_type:'amenity',categories:['entertainment.museum'],
 formatted:'Muzeul Țării Crișurilor, Oradea, Romania',lat:47.0611,lon:21.934};
const feature=p=>({type:'Feature',properties:p,geometry:{coordinates:[p.lon,p.lat]}});
globalThis.fetch=async(input)=>{
 const u=new URL(typeof input==='string'?input:input.url);used.push(u);
 if(u.hostname!=='api.geoapify.com')throw Error('Unexpected provider '+u.hostname);
 const q=u.searchParams.get('text')||'';
 if(/oxford/i.test(q))return Response.json({results:[pLondon]});
 if(/crisurilor|crișurilor/i.test(q))return Response.json({results:[pMuseum]});
 if(/nufarului|nufărului|^nu$/i.test(q))return Response.json({
  results:[pOther,pStreet],features:[feature(pOther),feature(pStreet)]});
 return Response.json({results:[]});
};
const env={GEOAPIFY_API_KEY:'test',AI:{run:async()=>{throw Error('AI must not calculate directions in assistant')}}};
const ask=async payload=>{
 const response=await worker.fetch(new Request('https://test.local/api/chat',{method:'POST',
  headers:{'content-type':'application/json'},
  body:JSON.stringify(payload)}),env);
 return {status:response.status,data:await response.json()};
};
try{
 for(const message of ['Nufărului 12, Oradea','Du-mă la Nufărului 12, Oradea',
  '25 Oxford Street, London','From Grays to London']){
  const r=await ask({message,module:'assistant',language:'ro',history:[]});
  assert.equal(r.status,200);
  assert.ok(r.data.journey_handoff,'Assistant must hand off route: '+message);
  assert.ok(!r.data.route&&!r.data.transit,'Assistant must not calculate routes');
 }
 assert.equal(used.length,0,'Assistant route must not call map provider or AI');
 for(const [query,expected] of [
  ['Nufărului 12, Oradea',47.0605],
  ['25 Oxford Street, London',51.5154],
  ['Muzeul Țării Crișurilor din Oradea',47.0611]
 ]){
  const r=await ask({journey_suggest:{query}});
  assert.equal(r.status,200,'Suggest response '+query);
  assert.equal(r.data.candidates.length,1,'Verified suggestion '+query+': '+JSON.stringify(r.data).slice(0,600));
  assert.equal(r.data.candidates[0].latitude,expected,'Exact result '+query);
 }
 const missed=await ask({journey_suggest:{query:'Nufărului 99, Oradea'}});
 assert.equal(missed.status,200);
 assert.equal(missed.data.candidates.length,0,'Wrong house must not be substituted');
 const prefix=await ask({journey_suggest:{query:'Nu'}});
 assert.equal(prefix.status,200);
 assert.ok(prefix.data.candidates.length>0,'Progressive lookup starts from first typed word');
 assert.ok(used.every(u=>u.hostname==='api.geoapify.com'),'No new routing providers or AI');
}finally{globalThis.fetch=original}
console.log('PASS one-field journey, progressive location suggestions, assistant handoff, exact houses, shopping plurals');
