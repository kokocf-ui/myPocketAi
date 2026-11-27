import assert from 'node:assert/strict';
import {test} from 'node:test';
import {execFileSync} from 'node:child_process';
import worker from './backend.js';
import {env,now,at,from,to,stations,connection} from './test_fixtures/irail_national.mjs';
const request=async(body,config)=>{
 const r=await worker.fetch(new Request('https://fixture.test/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}),{GEOAPIFY_API_KEY:'fixture',AI:{run:async()=>assert.fail('no AI routing')},...config});
 assert.equal(r.status,200);return r.json();
};
const body=(a=from,b=to)=>({message:'Transport public',module:'maps',language:'ro',national_public_transport:true,mixed_journey:true,
 location:{...a,updatedAt:now},transit_destination:{...b,label:'Synthetic end'},transit_departure_at:at});

test('actual Worker Belgium dispatch and metadata: no urban/mixed/foreign/paid provider leakage',async t=>{
 t.mock.method(Date,'now',()=>now);const calls=[];
 t.mock.method(globalThis,'fetch',async(input)=>{
  const u=new URL(input);calls.push(u.hostname);
  if(u.hostname==='api.geoapify.com')return Response.json({features:[{properties:{country_code:'be'}}]});
  assert.equal(u.hostname,'api.irail.be');return Response.json(u.pathname.endsWith('/stations')?{station:stations}:{connection:[connection()]});
 });
 const config=env();const metadata=await request({national_transit_country:{location:from}},config);
 assert.equal(metadata.country_code,'BE');assert.equal(metadata.supported,true);assert.equal(metadata.provider_coverage.urban_configured,false);
 assert.equal(metadata.provider_coverage.countrywide_coverage_verified,false);
 assert.equal(calls.includes('api.irail.be'),false,'metadata must not call the service');
 const r=await request(body(),config);assert.equal(r.transit_available,true);assert.equal(r.transit_provider,'iRail');
 assert.equal(r.mixed_journey,false);assert.equal(r.international_journey,false);assert.equal(r.route_available,false);
 assert.equal(r.transit[0].stop_countries_verified,true);assert.match(r.reply,/station-to-station/);assert.match(r.reply,/Preț indisponibil/);
 assert.deepEqual([...new Set(calls)].sort(),['api.geoapify.com','api.irail.be']);
 const count=calls.length;
 const off=await request(body(),{...config,IRAIL_TERMS_REVIEWED:'false'});assert.equal(off.transit_available,false);
 assert.equal(calls.slice(count).some(c=>c!=='api.geoapify.com'),false);
 const mode=await request({...body(),transit_preference:'bus_only'},config);assert.equal(mode.reason,'mode_not_supported');
});
test('actual Worker static importer output -> country registry -> source-specific scheduled response; no external transit requests',async t=>{
 t.mock.method(Date,'now',()=>now);
 const index=JSON.parse(execFileSync('python3',['test_fixtures/keyless_gtfs.py','public_gtfs_lu'],{encoding:'utf8'}));
 let loads=0;const config={PUBLIC_GTFS_ENABLED:'true',PUBLIC_GTFS_REVIEWED_SOURCES:'public_gtfs_lu',PUBLIC_GTFS_ASSETS:{fetch:async()=>{loads++;return Response.json(index);}}};
 t.mock.method(globalThis,'fetch',async input=>{const u=new URL(input);assert.equal(u.hostname,'api.geoapify.com');return Response.json({features:[{properties:{country_code:'lu'}}]});});
 const a={latitude:49.6,longitude:6.1},b={latitude:49.7,longitude:6.2};
 const meta=await request({national_transit_country:{location:a}},config);
 assert.equal(meta.supported,true);assert.equal(meta.provider_coverage.prepared_static_sources[0].activation_status,'configured_pending_feed_validation');assert.equal(loads,0);
 const r=await request(body(a,b),config);
 assert.equal(r.transit_available,true);assert.equal(r.transit_provider,'ATP Luxembourg static schedules');assert.equal(r.transit[0].real_time,false);
 assert.equal(r.transit[0].legs[0].departureTime,'2026-11-27T09:10:00.000Z');assert.equal(loads,1);assert.match(r.reply,/Numai curse directe/);
 const outside=await request({...body(a,b),transit_departure_at:'2026-12-03T09:00:00Z'},config);
 assert.equal(outside.reason,'outside_feed_validity');assert.match(outside.reply,/Nu am înlocuit data/);
});
test('actual Worker verifies GPS countries before loading keyless indexes or making rail requests',async t=>{
 t.mock.method(Date,'now',()=>now);
 t.mock.method(globalThis,'fetch',async input=>{
  const u=new URL(input);assert.equal(u.hostname,'api.geoapify.com');
  return Response.json({features:[{properties:{country_code:Number(u.searchParams.get('lat'))===to.latitude?'nl':'be'}}]});
 });
 const r=await request(body(),env());assert.equal(r.reason,'international_destination');assert.equal(r.transit_available,false);
});
