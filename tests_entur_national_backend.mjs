import assert from 'node:assert/strict';
import {test} from 'node:test';
import worker from './backend.js';
import {from,to,at,now,env,pattern,payload} from './test_fixtures/entur_national.mjs';
const call=async(body,extra={})=>{
 const response=await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}),{
  ...env,GEOAPIFY_API_KEY:'test',AI:{run:async()=>{throw Error('No AI routing');}},...extra});
 return response.json();
};
const query=()=>({message:'Transport public către Test end',module:'maps',language:'ro',national_public_transport:true,
 mixed_journey:true,location:{...from,updatedAt:Date.now()},transit_destination:{...to,label:'Test end',country_code:'RO'},
 journey_origin:{latitude:47.05,longitude:21.92,city:'Oradea',country_code:'RO'},transit_departure_at:at});

test('Worker dispatches Norway to Entur only after reverse verification, without UK/RO/mixed leakage',async()=>{
 const original=globalThis.fetch,originalNow=Date.now,calls=[];let enturRequests=0;Date.now=()=>now;
 globalThis.fetch=async(input,init)=>{
  const u=new URL(input);calls.push(u.hostname);
  if(u.hostname==='api.geoapify.com')return Response.json({features:[{properties:{country_code:'no'}}]});
  assert.equal(u.href,'https://api.entur.io/journey-planner/v3/graphql');
  enturRequests++;const b=JSON.parse(init.body);
  assert.deepEqual(b.variables.from.coordinates,from,'Stale mixed origin cannot override GPS');
  assert.deepEqual(b.variables.to.coordinates,to);assert.equal(init.headers['ET-Client-Name'],env.ENTUR_CLIENT_NAME);
  return Response.json(payload([pattern()]));
 };
 try{
  const coverage=await call({national_transit_country:{location:from}});
  assert.equal(coverage.country_code,'NO');assert.equal(coverage.supported,true);
  assert.equal(coverage.provider_coverage.validation_status,'contract_tests_only');
  const result=await call(query());
  assert.equal(result.transit_provider,'Entur');assert.equal(result.transit_available,true);
  assert.equal(result.national_public_transport,true);assert.equal(result.international_journey,false);assert.equal(result.mixed_journey,false);
  assert.equal(result.transit[0].country_code,'NO');assert.equal(result.transit[0].legs[0].stopCount,2);
  assert.equal(result.transit[0].stop_countries_verified,true);
  assert.equal(enturRequests,2);assert.deepEqual([...new Set(calls)].sort(),['api.entur.io','api.geoapify.com']);
  assert.match(result.reply,/Sursa: Entur/);assert.match(result.reply,/Preț indisponibil/);
 }finally{globalThis.fetch=original;Date.now=originalNow;}
});
test('Worker refuses missing activation and cross-border destination before calling Entur',async()=>{
 const original=globalThis.fetch,originalNow=Date.now;Date.now=()=>now;let destinationCountry='no',calls=0;
 globalThis.fetch=async input=>{
  const u=new URL(input);assert.equal(u.hostname,'api.geoapify.com');calls++;
  return Response.json({features:[{properties:{country_code:u.searchParams.get('lat')===String(to.latitude)?destinationCountry:'no'}}]});
 };
 try{
  const coverage=await call({national_transit_country:{location:from}},{ENTUR_NATIONAL_ENABLED:'false'});
  assert.equal(coverage.supported,false);assert.equal(coverage.provider_coverage.coverage_status,'not_connected');
  const disabled=await call(query(),{ENTUR_TERMS_REVIEWED:'false'});
  assert.equal(disabled.reason,'national_provider_not_connected');
  destinationCountry='se';const blocked=await call(query());
  assert.equal(blocked.reason,'international_destination');assert.equal(blocked.transit_available,false);
  assert.equal(calls,5);
 }finally{globalThis.fetch=original;Date.now=originalNow;}
});
test('A Norway-to-Norway provider route with a Swedish intermediate stop is not returned as national',async()=>{
 const original=globalThis.fetch,originalNow=Date.now;Date.now=()=>now;
 globalThis.fetch=async input=>{
  const u=new URL(input);
  if(u.hostname==='api.entur.io')return Response.json(payload([pattern()]));
  assert.equal(u.hostname,'api.geoapify.com');
  const latitude=Number(u.searchParams.get('lat'));
  return Response.json({features:[{properties:{country_code:latitude===(from.latitude+to.latitude)/2?'se':'no'}}]});
 };
 try{
  const result=await call(query());assert.equal(result.reason,'domestic_route_unverified');
  assert.equal(result.transit_available,false);assert.deepEqual(result.transit,[]);assert.match(result.reply,/stații din afara țării/);
 }finally{globalThis.fetch=original;Date.now=originalNow;}
});
