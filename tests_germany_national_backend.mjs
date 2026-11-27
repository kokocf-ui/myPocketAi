import assert from 'node:assert/strict';
import {test} from 'node:test';
import worker from './backend.js';
import frontend from './index.js';
import {env,from,to,at,now,payload} from './test_fixtures/germany_national.mjs';
const call=async(body,e=env)=>(await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}),{...e,GEOAPIFY_API_KEY:'synthetic-only',AI:{run:async()=>assert.fail('No AI planning')}})).json();
const query=()=>({message:'Transport public către destinație',language:'ro',module:'maps',national_public_transport:true,mixed_journey:true,
 location:{...from,updatedAt:now},transit_destination:{...to,label:'Synthetic Frankfurt',country_code:'AT'},
 journey_origin:{latitude:60.171,longitude:24.94,country_code:'FI'},transit_departure_at:at});
test('Worker routes independently verified German GPS to the configured operator, ignoring claimed country/origin',async()=>{
 const original=globalThis.fetch,clock=Date.now;Date.now=()=>now;let requests=0;
 globalThis.fetch=async(input,init)=>{
  const u=new URL(input);
  if(u.hostname==='api.geoapify.com')return Response.json({features:[{properties:{country_code:'de'}}]});
  assert.equal(u.hostname,'routing.unit-provider.com');requests++;assert.equal(init.headers.Authorization,'Bearer '+env.GERMANY_MOTIS_API_TOKEN);
  return Response.json(payload());
 };
 try{
  const c=await call({national_transit_country:{location:from}});assert.equal(c.supported,true);assert.equal(c.country_code,'DE');assert.equal(c.provider_coverage.countrywide_coverage_verified,false);
  const d=await call(query());assert.equal(requests,2);assert.equal(d.country_code,'DE');assert.equal(d.transit_provider,'MOTIS Germany');
  assert.equal(d.transit_available,true);assert.equal(d.mixed_journey,false);assert.equal(d.international_journey,false);
  assert.equal(d.transit[0].stop_countries_verified,true);assert.match(d.reply,/Synthetic fixture/);
  assert.ok(!JSON.stringify(d).includes(env.GERMANY_MOTIS_API_TOKEN));
 }finally{globalThis.fetch=original;Date.now=clock;}
});
test('Unconfigured German service is honestly unavailable, no anonymous Transitous fallback',async()=>{
 const original=globalThis.fetch,clock=Date.now;Date.now=()=>now;
 globalThis.fetch=async input=>{assert.equal(new URL(input).hostname,'api.geoapify.com');return Response.json({features:[{properties:{country_code:'de'}}]});};
 try{
  for(const patch of [{GERMANY_NATIONAL_ENABLED:'false'},{GERMANY_MOTIS_TERMS_REVIEWED:'false'},{GERMANY_MOTIS_DATA_REVIEWED:'false'},{GERMANY_MOTIS_BASE_URL:'https://api.transitous.org/'}]){
   const e={...env,...patch};assert.equal((await call({national_transit_country:{location:from}},e)).supported,false);
   const d=await call(query(),e);assert.equal(d.reason,'national_provider_not_connected');assert.equal(d.transit_available,false);
  }
 }finally{globalThis.fetch=original;Date.now=clock;}
});
test('German GPS with independently Austrian destination is rejected before MOTIS is called',async()=>{
 const original=globalThis.fetch,clock=Date.now;Date.now=()=>now;
 globalThis.fetch=async input=>{const u=new URL(input);assert.equal(u.hostname,'api.geoapify.com');return Response.json({features:[{properties:{country_code:Number(u.searchParams.get('lat'))===to.latitude?'at':'de'}}]});};
 try{const d=await call(query());assert.equal(d.reason,'international_destination');assert.equal(d.transit_available,false);}
 finally{globalThis.fetch=original;Date.now=clock;}
});
test('Optional private routing token is never embedded into frontend HTML',async()=>{
 const html=await(await frontend.fetch(new Request('https://unit.test/'),env)).text();
 assert.ok(!html.includes(env.GERMANY_MOTIS_API_TOKEN));assert.ok(!html.includes(env.GERMANY_MOTIS_BASE_URL));
});
