import assert from 'node:assert/strict';
import {mixedProgressResponse,readMixedProgressResponse} from './mixed_progress_stream.mjs';
import worker from './backend.js';
import app from './index.js';
const encoder=new TextEncoder();
const option={operator:'FlixBus',mode:'coach',from:'Manchester',to:'Lancaster',url:'https://www.flixbus.co.uk/bus-routes/manchester-lancaster'};
let release,seen=false;
const gate=new Promise(resolve=>{release=resolve});
const response=mixedProgressResponse(new Request('https://test/api/chat'),async emit=>{
 emit({operator_options:[option],status:'success'});await gate;
 return Response.json({status:'success',reply:'Complete',operator_options:[option]});
});
const parsed=await readMixedProgressResponse(response,partial=>{seen=partial.operator_options.length===1;release()});
assert.equal(seen,true);assert.equal(parsed.reply,'Complete');

const broken=new Response(new ReadableStream({start(c){
 c.enqueue(encoder.encode(JSON.stringify({type:'progress',data:{operator_options:[option]}})+'\n'));c.close();
}}),{headers:{'Content-Type':'application/x-ndjson'}});
const partial=await readMixedProgressResponse(broken);
assert.equal(partial.mixed_search_incomplete,true);assert.equal(partial.operator_options.length,1);
const invalid=new Response('{"type":"result","status":400,"data":{"error":"bad_date"}}\n',{
 headers:{'Content-Type':'application/x-ndjson'}});
await assert.rejects(()=>readMixedProgressResponse(invalid),/bad_date/);

// Arbitrary UTF-8 and line fragmentation, including multibyte Romanian text.
const bytes=encoder.encode(JSON.stringify({type:'result',status:200,data:{status:'success',reply:'Legături până la stație'}})+'\n');
const fragmented=new Response(new ReadableStream({start(c){for(const byte of bytes)c.enqueue(Uint8Array.of(byte));c.close()}}),{
 headers:{'Content-Type':'application/x-ndjson'}});
assert.equal((await readMixedProgressResponse(fragmented)).reply,'Legături până la stație');
let serverSignal;
const cancelled=mixedProgressResponse(new Request('https://test/api/chat'),async(_emit,signal)=>{
 serverSignal=signal;await new Promise(resolve=>signal.addEventListener('abort',resolve,{once:true}));return Response.json({});
});
const reader=cancelled.body.getReader();await reader.read();await reader.cancel();assert.equal(serverSignal.aborted,true);
const aborter=new AbortController();aborter.abort();
await assert.rejects(()=>readMixedProgressResponse(new Response('x',{headers:{'Content-Type':'application/x-ndjson'}}),null,aborter.signal),/cancelled/);

// Actual frontend proxy -> actual Worker -> NDJSON -> actual client reader.
// No extra request/poll/replay, and no request to AI/flight/HERE or real network.
let unblockTransit,timer,proxies=0,searchCalls=0,early=false;
const transitGate=new Promise(resolve=>{unblockTransit=resolve});
const origin={latitude:53.48,longitude:-2.24,city:'Manchester',label:'Manchester',country_code:'GB'};
const destination={latitude:54.04,longitude:-2.80,city:'Lancaster',label:'Lancaster',country_code:'GB'};
const originalFetch=globalThis.fetch;
const at=m=>new Date(Date.now()+m*60000).toISOString();
globalThis.fetch=async(input)=>{
 const u=new URL(typeof input==='string'?input:input.url||String(input));
 if(u.hostname==='api.exa.ai'){
  searchCalls++;return Response.json({results:[{url:option.url,title:'Manchester to Lancaster Coach Travel'}]});
 }
 if(u.hostname==='api.transcapi.com'){
  await transitGate;
  return Response.json({timezone:'Europe/London',itineraries:[{start_time:at(30),end_time:at(105),legs:[{
   mode:'RAIL',from:{name:'Manchester',...origin},to:{name:'Lancaster',...destination},
   route:{line:'Fixture Rail',operator:'Fixture Rail'},start_time:{scheduled:at(30)},end_time:{scheduled:at(105)}
  }]}]});
 }
 throw Error('Unexpected provider: '+u.hostname);
};
try{
 const request=new Request('https://test.example/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
  message:'Transport mixt spre Lancaster',module:'maps',language:'ro',history:[],location:origin,journey_origin:origin,
  transit_query:'Lancaster',transit_destination:destination,mixed_journey:true,mixed_progressive:true,mixed_ground_only:true
 })});
 const streamed=await app.fetch(request,{POCKET_API:{fetch:r=>{
  proxies++;return worker.fetch(r,{TRANSCAPI_API_KEY:'fixture',EXA_API_KEY:'fixture',AI:{run:async()=>{throw Error('No AI')}}});
 }}});
 assert.match(streamed.headers.get('content-type'),/application\/x-ndjson/);
 const work=readMixedProgressResponse(streamed,data=>{
  if(data.operator_options?.length){early=true;unblockTransit()}
 });
 const result=await Promise.race([work,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('No progress before scheduled provider completed')),2500)})]);
 assert.equal(early,true);assert.equal(proxies,1,'Streaming must not replay a search in the frontend proxy');
 assert.equal(searchCalls,2,'Exactly the existing two mode-specific queries');
 assert.equal(result.status,'success');assert.equal(result.transit_available,true);
 assert.equal(result.operator_options.length,1);assert.equal(result.flight_search_status,'disabled');
}finally{clearTimeout(timer);unblockTransit();globalThis.fetch=originalFetch}
console.log('PASS progressive protocol, cancellation, interrupted partials, fragmented UTF-8, actual proxy/Worker early delivery without duplicate provider calls; fixtures only');
