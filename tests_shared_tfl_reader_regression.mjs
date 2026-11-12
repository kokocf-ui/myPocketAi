import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {requestTfLJourneys} from './tfl_shared_journeys.mjs';

const from='51.493,-0.3',to='51.496,-0.14';
const journeys=Array.from({length:3},(_,id)=>({id,duration:40+id,legs:[{mode:{name:'tube'}}]}));
let seen=[];
let result=await requestTfLJourneys({from,to,appKey:'dummy',requestedCount:3,
 fetcher:async url=>{seen.push(new URL(url));return Response.json({journeys});}});
assert.equal(result.status,'ok');
assert.equal(result.journeys.length,3);
assert.equal(seen.length,1,'One good search must not spawn three TfL calls');
assert.equal(seen[0].searchParams.get('maxWalkingMinutes'),'35');
assert.equal(seen[0].searchParams.get('journeyPreference'),'leasttime');

seen=[];
result=await requestTfLJourneys({from,to,appKey:'dummy',requestedCount:2,
 fetcher:async url=>{
  const u=new URL(url);seen.push(u);
  return Response.json({journeys:u.searchParams.get('journeyPreference')==='leastinterchange'?[journeys[0]]:[]});
 }});
assert.equal(result.journeys.length,1,'Alternative preference salvages empty primary result');
assert.equal(seen.length,3,'Alternative paths only used on insufficient primary result');
assert.ok(seen.some(u=>u.searchParams.get('journeyPreference')==='leastwalking'));

seen=[];
result=await requestTfLJourneys({from,to,appKey:'dummy',auxiliary:true,modes:'bus,tube',
 fetcher:async url=>{seen.push(new URL(url));return Response.json({journeys});}});
assert.equal(seen.length,1,'Auxiliary TfL query uses the same adapter once');
assert.equal(seen[0].searchParams.get('mode'),'bus,tube');
assert.equal(result.journeys.length,3);

seen=[];
result=await requestTfLJourneys({from,to,appKey:'',fetcher:async url=>{
 seen.push(new URL(url));return Response.json({journeys});
}});
assert.equal(result.status,'ok_public');
assert.equal(result.journeys.length,3);
assert.equal(seen.length,1,'Unauthenticated TfL mode uses one request');
assert.equal(seen[0].searchParams.has('app_key'),false);

seen=[];
result=await requestTfLJourneys({from,to,appKey:'expired',
 fetcher:async url=>{
  const u=new URL(url);seen.push(u);
  return u.searchParams.has('app_key')?
   new Response('forbidden',{status:403}):Response.json({journeys});
 }});
assert.equal(result.status,'ok_public');
assert.equal(result.journeys.length,3);
assert.equal(seen.length,2,'Invalid key gets at most one public retry');
assert.equal(seen[1].searchParams.has('app_key'),false);


const backend=readFileSync('backend.js','utf8');
assert.equal((backend.match(/requestTfLJourneys\(\{/g)||[]).length,2,
 'Primary transport and supplementary walking-route lookup share one TfL adapter');
assert.doesNotMatch(backend,/const tflUrl=.{0,60}https:\/\/api\.tfl\.gov\.uk\/Journey/,
 'No duplicate inline TfL journey URL in the backend');

const literature=readFileSync('literature_task_ui.mjs','utf8');
assert.match(literature,/function litReaderSafeText\(value\)/);
assert.match(literature,/content\.textContent=litReaderSafeText\(raw\)/);
assert.match(literature,/content\.textContent=litReaderSafeText\(pages\[active\]\|\|raw\)/);
console.log('PASS: shared TfL provider and Android-safe reader fallback');
