import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {readFileSync} from 'node:fs';
import worker from './backend.js';
globalThis.crypto??=webcrypto;
const src=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const section=(a,b)=>{const i=src.indexOf(a),j=src.indexOf(b,i+a.length);assert.ok(i>=0&&j>i,'Missing '+a);return src.slice(i,j)};
const travel=section('function showJourneyMode(choice){','// Shared UI dialog translations.');
assert.match(travel,/button\.className='module-result-card journey-mode-choice'/,'Mixed transport uses the same petrol card style');
const transit=section('function renderTransitChoices(options,selectedIndex=null){','async function selectTransitJourney(options,index){');
assert.equal((transit.match(/refresh\.className='transit-choice-action transit-refresh-action'/g)||[]).length,2,'Refresh button on both transit screens is specifically styled');
assert.match(transit,/refresh\.onclick=\(\)=>refreshTransitDepartures\(refresh\)/,'Refresh still calls its original handler');
assert.match(src,/#moduleQuickLayer\.open \.module-quick-sheet #moduleLayerBody > \.journey-mode-choice/,'Mixed journey has scoped petrol CSS');
assert.match(src,/#moduleQuickLayer\.open \.module-quick-sheet #moduleLayerBody \.transit-refresh-action/,'Refresh gets separate plum CSS');
assert.match(src,/#723846,#4a293c 60%,#291f36/,'Same burgundy palette as Maps');
const selection=section('function appendConversationChoices(data,host){','function appendTravelModeOverview(host,text){');
assert.match(selection,/const options=\[\],maxOptions=/,'Duplicate candidate labels are filtered');
assert.match(selection,/duplicateIndex=options\.findIndex/,'Dedupe happens before rendering');
assert.match(selection,/data\.route_context\?\.pending==='destination_choice'/,'Verified route selection keeps coordinate handoff');
assert.match(selection,/destination_query:String\(option\.label\)/,'Selection replaces ambiguous text with verified point label');
assert.match(selection,/destination:\{latitude:lat,longitude:lon,label:option\.label\}/,'Selected route point retains verified coordinates');

const originalFetch=globalThis.fetch;
let tflSearch=0,journeyLookups=[];
const tube={name:'Victoria Station',lat:51.495,lon:-0.144,id:'940GZZLUVIC',modes:['tube'],stopType:'NaptanMetroStation'};
const nearbyTube={name:'Victoria Station',lat:51.4957,lon:-0.1447,id:'940GZZLUVICENT',modes:['tube'],stopType:'NaptanMetroStation'};
const rail={name:'Victoria Station',lat:51.4952,lon:-0.1443,id:'910GVIC',modes:['national-rail'],stopType:'NaptanRailStation'};
globalThis.fetch=async input=>{
 const url=new URL(typeof input==='string'?input:input.url||input.toString());
 if(url.hostname==='api.tfl.gov.uk'){
  if(url.pathname.includes('/Journey/JourneyResults/')){
   journeyLookups.push(url);
   return Response.json({journeys:[]});
  }
  tflSearch++;
  assert.match(url.pathname,/StopPoint\/Search\/victoria/i,'Victoria must be looked up at the official operator');
  return Response.json({matches:[nearbyTube,rail,tube,{...nearbyTube,id:'940GZZLUVICOTHER',lat:51.4959,lon:-0.1442}]});
 }
 if(url.hostname==='api.geoapify.com'&&url.pathname==='/v1/geocode/search')return Response.json({features:[]});
 throw Error('Unexpected provider '+url.hostname+url.pathname);
};
const env={GEOAPIFY_API_KEY:'test',TFL_APP_KEY:'test',AI:{run:async()=>({response:'No speculation; use verified station data.'})}};
const ask=async(message,extra={})=>{
 const response=await worker.fetch(new Request('https://test.local/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
  message,language:'ro',module:'assistant',location:{latitude:51.49,longitude:-0.13,updatedAt:Date.now()},history:[],...extra
 })}),env);
 assert.equal(response.status,200);
 return response.json();
};
try {
 const result=await ask('Vreau sa ajung la victoria underground');
 console.log('TfL Victoria Tube result',JSON.stringify({reply:result.reply,reason:result.reason,needs_destination_clarification:result.needs_destination_clarification,destination_candidates:result.destination_candidates,transit_provider:result.transit_provider,journeys:journeyLookups.map(x=>x.pathname)}));
 assert.equal(result.status,'success');
 assert.notEqual(result.needs_destination_clarification,true,'A unique TfL Victoria Underground stop must not offer duplicate options');
 assert.equal(result.destination_candidates?.length||0,0,'No duplicate Victoria Station entries');
 assert.ok(tflSearch>0,'TfL station lookup performed');
 assert.ok(journeyLookups.length>0,'TfL itinerary request must be issued after confirming station');
 assert.ok(journeyLookups.every(x=>x.pathname.includes('940GZZLUVIC')),'Itineraries must use TfL Victoria Underground Tube ID, not Rail platforms');

 const ambiguous=await ask('Vreau sa ajung la Victoria Station');
 assert.equal(ambiguous.needs_destination_clarification,true,'Unqualified Victoria Station still asks rail or tube');
 assert.equal(ambiguous.destination_candidates?.length,2,'Four TfL entrances collapse into two distinct types');
 assert.deepEqual(new Set(ambiguous.destination_candidates.map(x=>x.label)),new Set(['Victoria Rail Station','Victoria Underground Station']));
 assert.ok(ambiguous.destination_candidates.every(x=>Number.isFinite(x.latitude)&&Number.isFinite(x.longitude)),'Selectable destinations include their actual coordinates');

 console.log('PASS: Victoria Underground resolves once to verified TfL stop; mixed and refresh colors are consistent');
} finally {globalThis.fetch=originalFetch;}
