import assert from 'node:assert/strict';
import {test} from 'node:test';
import {execFileSync} from 'node:child_process';
import {KEYLESS_GTFS_SOURCES,configuredKeylessGtfsSources} from './keyless_transport_sources.mjs';
import {planKeylessGtfsJourney as plan,validateKeylessGtfsIndex as validate,loadKeylessGtfsIndex} from './keyless_gtfs_transit.mjs';
import {nationalPublicTransportPolicy as policy} from './national_public_transport_policy.mjs';
import {configuredNationalTransportProviders,nationalTransportCoverage} from './national_transport_registry.mjs';
import {selectCountryProviders} from './smart_country_registry.mjs';
import {validateOpenSurfaceIndex} from './open_surface_timetable.mjs';
const now=Date.parse('2026-11-26T10:00:00Z'),at='2026-11-27T09:00:00Z';
export const fixture=id=>JSON.parse(execFileSync('python3',['test_fixtures/keyless_gtfs.py',id],{encoding:'utf8'}));
const indexes=new Map(KEYLESS_GTFS_SOURCES.map(s=>[s.id,fixture(s.id)]));
const source=KEYLESS_GTFS_SOURCES.find(s=>s.country==='LU');
const from={latitude:49.6,longitude:6.1},to={latitude:49.7,longitude:6.2};
const query={from,to,originCountry:'LU',destinationCountry:'LU',departureAt:at};
const config=(index=indexes.get(source.id))=>({PUBLIC_GTFS_ENABLED:'true',PUBLIC_GTFS_REVIEWED_SOURCES:source.id,
 PUBLIC_GTFS_ASSETS:{fetch:async()=>Response.json(index)}});
const opts={now,verifyCountry:async()=> 'LU'};

test('six sources import with their own identity/modes/scope, all disabled by default and separated from urban/international',async()=>{
 for(const s of KEYLESS_GTFS_SOURCES){
  const index=indexes.get(s.id);assert.equal(validate(index,s,{now}),'valid');
  assert.equal(validateOpenSurfaceIndex(index,{now}),'invalid_index','Does not relax Flix identity contract');
  const env={...config(index),PUBLIC_GTFS_REVIEWED_SOURCES:s.id};
  const enabled=configuredNationalTransportProviders(env);
  assert.equal(policy({originCountry:s.country,destinationCountry:s.country,enabledProviders:enabled}).provider,s.id);
  assert.equal(nationalTransportCoverage(s.country,enabled).countrywide_coverage_verified,false);
  assert.equal(nationalTransportCoverage(s.country,enabled).prepared_static_sources[0].activation_status,'configured_pending_feed_validation');
  assert.deepEqual(selectCountryProviders({country:s.country,category:'urban_transport',enabledProviders:[s.id]}).providers,[]);
  assert.deepEqual(selectCountryProviders({originCountry:s.country,destinationCountry:'RO',category:'public_transport',enabledProviders:[s.id]}).providers,[]);
  const result=await plan(env,{...query,sourceId:s.id,originCountry:s.country,destinationCountry:s.country},{now,verifyCountry:async()=>s.country});
  assert.equal(result.status,'ok',s.id);assert.equal(result.journeys[0].real_time,false);assert.equal(result.direct_rides_only,true);
 }
 assert.deepEqual(configuredKeylessGtfsSources({}),[]);
 for(const patch of [{PUBLIC_GTFS_ENABLED:true},{PUBLIC_GTFS_REVIEWED_SOURCES:'unknown'},{PUBLIC_GTFS_ASSETS:{}}]){
  const env={...config(),...patch};assert.deepEqual(configuredKeylessGtfsSources(env),[]);
  assert.equal((await plan(env,query,opts)).status,'not_configured');
 }
 const de=configuredNationalTransportProviders({...config(),PUBLIC_GTFS_REVIEWED_SOURCES:'public_gtfs_de',MOTIS_GERMANY_ENABLED:'false'});
 assert.equal(policy({originCountry:'DE',destinationCountry:'DE',enabledProviders:de}).provider,'public_gtfs_de');
});
test('offline compiler -> validated asset -> direct dated journey, no external requests, attribution and endpoint checks',async()=>{
 const env=config();let loads=0;env.PUBLIC_GTFS_ASSETS.fetch=async r=>{loads++;assert.equal(new URL(r.url).pathname,'/public_gtfs_lu.json');return Response.json(indexes.get(source.id));};
 const before=globalThis.fetch;globalThis.fetch=()=>assert.fail('must not fetch any external provider or ZIP');
 try{
  const r=await plan(env,query,opts);assert.equal(r.status,'ok');assert.equal(r.journeys.length,1);
  const j=r.journeys[0];assert.equal(j.startDateTime,'2026-11-27T09:10:00.000Z');assert.equal(j.legs[0].stopCount,1);
  assert.equal(j.stop_countries_verified,true);assert.equal(j.walkingAccessVerified,false);assert.equal(j.completeDoorToDoor,false);
  assert.match(j.attribution.text,/Synthetic|ATP/);assert.equal(j.legs[0].mode,'bus');
  assert.equal((await plan(env,query,opts)).status,'ok');assert.equal(loads,1);
  assert.equal((await plan(env,{...query,from:{latitude:49.61,longitude:6.1}},opts)).journeys.length,0);
  assert.equal((await plan(env,{...query,departureAt:'2026-11-28T09:00:00Z'},opts)).journeys.length,0,'No calendar service on the following day');
  assert.equal((await plan(env,{...query,departureAt:'2026-12-03T09:00:00Z'},opts)).status,'outside_feed_validity');
 }finally{globalThis.fetch=before;}
});
test('stale, wrong origin/identity/licence, unknown timezone and malformed data fail closed',async()=>{
 for(const mutate of [i=>i.sourceId='public_gtfs_fr',i=>i.source='https://evil.test',i=>i.downloadUrl='https://evil.test/a.zip',
  i=>i.licenseUrl='',i=>i.originalTimezone='Mars/Unknown',i=>i.trips[0][3][0][2]=-1,i=>i.directRidesOnly=false,i=>i.scope='all Europe',
  i=>i.coverageEndUtc='bad',i=>i.generatedAt='2026-11-01T00:00:00Z']){
  const index=structuredClone(indexes.get(source.id));mutate(index);
  assert.notEqual(validate(index,source,{now}),'valid');assert.notEqual((await plan(config(index),query,opts)).status,'ok');
 }
 assert.equal((await plan(config(),{...query,destinationCountry:'FR'},opts)).status,'country_not_authorized');
 assert.equal((await plan(config(),{...query,from:{latitude:null,longitude:6}},opts)).status,'invalid_coordinates');
 assert.equal((await plan(config(),{...query,departureAt:'2026-11-27T09:00:00'},opts)).status,'invalid_departure');
 assert.equal((await plan(config(),query,{now})).status,'country_verification_unavailable');
 const foreign=await plan(config(),query,{now,verifyCountry:async()=> 'BE'});assert.equal(foreign.status,'domestic_route_unverified');
});
test('bus-only filter and pickup/dropoff restrictions survive compilation and runtime',async()=>{
 const index=structuredClone(indexes.get(source.id));index.routes[0][3]='train';
 assert.equal((await plan(config(index),{...query,preference:'bus_only'},opts)).journeys.length,0);
 index.routes[0][3]='bus';index.trips[0][3][0][3]=0;
 assert.equal((await plan(config(index),query,opts)).journeys.length,0);
 index.trips[0][3][0][3]=1;index.trips[0][3][1][4]=0;
 assert.equal((await plan(config(index),query,opts)).journeys.length,0);
});
test('failed assets expire, oversized streams rejected, source cache not multiplied sixfold',async()=>{
 const env=config();let calls=0;env.PUBLIC_GTFS_ASSETS.fetch=async()=>{calls++;return calls===1?new Response('',{status:404}):Response.json(indexes.get(source.id));};
 assert.equal((await loadKeylessGtfsIndex(env,source.id,{now})).status,'index_unavailable');
 assert.equal((await loadKeylessGtfsIndex(env,source.id,{now:now+61000})).status,'ready');assert.equal(calls,2);
 const big=config();big.PUBLIC_GTFS_ASSETS.fetch=async()=>new Response('{}',{headers:{'content-length':String(6*1024*1024)}});
 assert.equal((await loadKeylessGtfsIndex(big,source.id,{now})).status,'index_too_large');
 const all=config();all.PUBLIC_GTFS_REVIEWED_SOURCES=KEYLESS_GTFS_SOURCES.map(s=>s.id).join(',');let finish;
 all.PUBLIC_GTFS_ASSETS.fetch=()=>new Promise(resolve=>{finish=resolve;});
 const pending=loadKeylessGtfsIndex(all,source.id,{now});
 assert.equal((await loadKeylessGtfsIndex(all,'public_gtfs_fr',{now})).status,'index_busy');
 finish(Response.json(indexes.get(source.id)));assert.equal((await pending).status,'ready');
});
