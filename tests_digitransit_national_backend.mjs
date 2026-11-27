import assert from 'node:assert/strict';
import {test} from 'node:test';
import worker from './backend.js';
import frontend from './index.js';
import {from,to,at,now,env,pattern,payload} from './test_fixtures/digitransit_national.mjs';
const call=async(body,extra={})=>(await worker.fetch(new Request('https://unit.test/api/chat',{
 method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}),{
 ...env,GEOAPIFY_API_KEY:'synthetic-geo-key',AI:{run:async()=>{throw Error('No AI planning');}},...extra})).json();
const query=()=>({message:'Transport public către destinație',language:'ro',module:'maps',national_public_transport:true,mixed_journey:true,
 location:{...from,updatedAt:now},transit_destination:{...to,label:'Synthetic arrival',country_code:'EE'},
 journey_origin:{latitude:59.911,longitude:10.75,country_code:'NO'},transit_departure_at:at});
test('Worker routes verified Finland GPS to the Finnish API; only the secret header carries the key',async()=>{
 const original=globalThis.fetch,originalNow=Date.now;Date.now=()=>now;let apiCalls=0;
 globalThis.fetch=async(input,init)=>{
  const u=new URL(input);
  if(u.hostname==='api.geoapify.com')return Response.json({features:[{properties:{country_code:'fi'}}]});
  assert.equal(u.href,'https://api.digitransit.fi/routing/v2/finland/gtfs/v1');apiCalls++;
  assert.equal(init.headers['digitransit-subscription-key'],env.DIGITRANSIT_API_KEY);
  assert.deepEqual(JSON.parse(init.body).variables.origin.location.coordinate,from);
  return Response.json(payload([pattern()]));
 };
 try{
  const coverage=await call({national_transit_country:{location:from}});assert.equal(coverage.supported,true);
  assert.equal(coverage.country_code,'FI');assert.equal(coverage.provider_coverage.countrywide_coverage_verified,false);
  const result=await call(query());assert.equal(apiCalls,2);assert.equal(result.transit_provider,'Digitransit');
  assert.equal(result.transit_available,true);assert.equal(result.international_journey,false);assert.equal(result.mixed_journey,false);
  assert.equal(result.transit[0].stop_countries_verified,true);assert.match(result.reply,/© Digitransit/);
  assert.ok(!JSON.stringify(result).includes(env.DIGITRANSIT_API_KEY));
 }finally{globalThis.fetch=original;Date.now=originalNow;}
});
test('Missing key, activation or review stays disabled and an Estonia destination is blocked before supplier access',async()=>{
 const original=globalThis.fetch,originalNow=Date.now;Date.now=()=>now;let destinationCountry='fi';
 globalThis.fetch=async input=>{const u=new URL(input);assert.equal(u.hostname,'api.geoapify.com');
  return Response.json({features:[{properties:{country_code:u.searchParams.get('lat')===String(to.latitude)?destinationCountry:'fi'}}]});};
 try{
  for(const patch of [{DIGITRANSIT_API_KEY:''},{DIGITRANSIT_NATIONAL_ENABLED:'false'},{DIGITRANSIT_TERMS_REVIEWED:'false'}]){
   const coverage=await call({national_transit_country:{location:from}},patch);assert.equal(coverage.supported,false);
   const result=await call(query(),patch);assert.equal(result.reason,'national_provider_not_connected');
  }
  destinationCountry='ee';const result=await call(query());assert.equal(result.reason,'international_destination');
 }finally{globalThis.fetch=original;Date.now=originalNow;}
});
test('Foreign intermediate data from a Finland+Estonia endpoint is never accepted as domestic Finland',async()=>{
 const original=globalThis.fetch,originalNow=Date.now;Date.now=()=>now;
 globalThis.fetch=async input=>{const u=new URL(input);
  if(u.hostname==='api.digitransit.fi')return Response.json(payload([pattern()]));
  assert.equal(u.hostname,'api.geoapify.com');
  return Response.json({features:[{properties:{country_code:Number(u.searchParams.get('lat'))===(from.latitude+to.latitude)/2?'ee':'fi'}}]});};
 try{const result=await call(query());assert.equal(result.reason,'domestic_route_unverified');assert.equal(result.transit_available,false);assert.deepEqual(result.transit,[]);}
 finally{globalThis.fetch=original;Date.now=originalNow;}
});
test('Server key is not included in frontend HTML even when supplied to the frontend environment',async()=>{
 const html=await(await frontend.fetch(new Request('https://unit.test/'),{DIGITRANSIT_API_KEY:env.DIGITRANSIT_API_KEY})).text();
 assert.ok(!html.includes(env.DIGITRANSIT_API_KEY));assert.ok(html.includes('transit-source-attribution'));
});
test('Worker selects the Estonian country profile with the shared API key, not a Finnish GPS assumption',async()=>{
 const original=globalThis.fetch,originalNow=Date.now;Date.now=()=>now;
 const a={latitude:59.439,longitude:24.737},b={latitude:59.437,longitude:24.755};
 const base=pattern();base.legs[0].from.lat=a.latitude;base.legs[0].from.lon=a.longitude;
 base.legs[0].to.lat=b.latitude;base.legs[0].to.lon=b.longitude;
 const points=[a,{latitude:(a.latitude+b.latitude)/2,longitude:(a.longitude+b.longitude)/2},b];
 base.legs[0].stopCalls.forEach((c,i)=>{c.stopLocation.lat=points[i].latitude;c.stopLocation.lon=points[i].longitude;});
 globalThis.fetch=async input=>{const u=new URL(input);
  if(u.hostname==='api.digitransit.fi')return Response.json(payload([base]));
  assert.equal(u.hostname,'api.geoapify.com');return Response.json({features:[{properties:{country_code:'ee'}}]});};
 try{
  const result=await call({...query(),location:{...a,updatedAt:now},transit_destination:{...b,label:'Synthetic Tallinn',country_code:'FI'}});
  assert.equal(result.transit_available,true);assert.equal(result.country_code,'EE');assert.equal(result.transit[0].time_zone,'Europe/Tallinn');
  assert.equal(result.transit[0].stop_countries_verified,true);
 }finally{globalThis.fetch=original;Date.now=originalNow;}
});
