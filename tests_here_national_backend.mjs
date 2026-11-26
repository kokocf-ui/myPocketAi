import assert from 'node:assert/strict';
import {test} from 'node:test';
import worker from './backend.js';
import frontend from './index.js';
import {environment,from,to,at,now,payload} from './test_fixtures/here_national.mjs';
const query={message:'Transport public către destinație',language:'ro',module:'maps',national_public_transport:true,mixed_journey:true,
 location:{...from,updatedAt:now},transit_destination:{...to,label:'Synthetic HERE',country_code:'AT'},transit_departure_at:at};
const call=async(body,env)=>(await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}),{...env,GEOAPIFY_API_KEY:'synthetic-only',AI:{run:()=>assert.fail('no AI')}})).json();
test('Worker dispatch HERE from verified DE GPS, returns route-only, keeps secret server-side',async()=>{
 const original=fetch,clock=Date.now;Date.now=()=>now;let calls=0;
 globalThis.fetch=async input=>{const u=new URL(input);if(u.hostname==='api.geoapify.com')return Response.json({features:[{properties:{country_code:'de'}}]});
  assert.equal(u.hostname,'transit.router.hereapi.com');calls++;const p=payload();delete p.routes[0].sections[0].departure.time;return Response.json(p);};
 try{
  const env=environment();const coverage=await call({national_transit_country:{location:from}},env);assert.equal(coverage.supported,true);
  const d=await call(query,env);assert.equal(calls,1);assert.equal(d.transit_available,true);assert.equal(d.transit_provider,'HERE Public Transit');
  assert.equal(d.country_code,'DE');assert.equal(d.mixed_journey,false);assert.equal(d.transit[0].route_only,true);
  assert.match(d.reply,/orarul nu poate fi garantat/);assert.match(d.reply,/END/);assert.ok(!JSON.stringify(d).includes(env.HERE_TRANSIT_API_KEY));
  const html=await(await frontend.fetch(new Request('https://unit.test/'),env)).text();assert.ok(!html.includes(env.HERE_TRANSIT_API_KEY));
 }finally{globalThis.fetch=original;Date.now=clock;}
});
test('Worker quota refusal is explicit; no upstream call and no fallback',async()=>{
 const original=fetch,clock=Date.now;Date.now=()=>now;
 globalThis.fetch=async input=>{assert.equal(new URL(input).hostname,'api.geoapify.com');return Response.json({features:[{properties:{country_code:'de'}}]});};
 try{
  const d=await call(query,environment(async()=>Response.json({allowed:false,reason:'free_quota_exhausted'},{status:429})));
  assert.equal(d.reason,'free_quota_exhausted');assert.equal(d.transit_available,false);assert.match(d.reply,/Cota lunară gratuită/);
  const off=await call(query,{...environment(),HERE_TRANSIT_ENABLED:'false'});assert.equal(off.reason,'national_provider_not_connected');
 }finally{globalThis.fetch=original;Date.now=clock;}
});
