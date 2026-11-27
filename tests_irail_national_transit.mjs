import assert from 'node:assert/strict';
import {test} from 'node:test';
import {irailNationalConfigured,planIrailNationalJourney as plan,normalizeIrailConnection as normalize,irailLocalDeparture} from './irail_national_transit.mjs';
import {configuredNationalTransportProviders,nationalTransportCoverage} from './national_transport_registry.mjs';
import {nationalPublicTransportPolicy as policy} from './national_public_transport_policy.mjs';
import {selectCountryProviders} from './smart_country_registry.mjs';
import {readTransportJson} from './transport_bounded_json.mjs';
import {env,now,at,from,to,middle,stations,options,connection,transfer} from './test_fixtures/irail_national.mjs';
const opts={now,verifyCountry:async()=> 'BE',fetchImpl:async url=>Response.json(new URL(url).pathname.endsWith('/stations')?{station:stations}:{connection:[connection()]})};

test('Belgium needs explicit reviewed identity and shared limiter; metadata does not activate it',async()=>{
 assert.equal(irailNationalConfigured({}),false);assert.equal(irailNationalConfigured(env()),true);
 for(const patch of [{IRAIL_NATIONAL_ENABLED:true},{IRAIL_TERMS_REVIEWED:'false'},{IRAIL_USER_AGENT:'bad\r\nheader'},{IRAIL_RATE_LIMITER:null}]){
  const config={...env(),...patch};assert.equal(irailNationalConfigured(config),false);
  assert.equal((await plan(config,options,{...opts,fetchImpl:()=>assert.fail('no network')})).status,'not_configured');
 }
 const enabled=configuredNationalTransportProviders(env());assert.ok(enabled.includes('irail_national_transit'));
 const coverage=nationalTransportCoverage('BE',enabled);
 assert.equal(coverage.urban_configured,false);assert.equal(coverage.intercity_configured,true);assert.equal(coverage.countrywide_coverage_verified,false);
 assert.equal(policy({originCountry:'BE',destinationCountry:'BE',enabledProviders:enabled}).provider,'irail_national_transit');
 for(const country of ['FR','NL','NO','RO'])assert.notEqual(policy({originCountry:country,destinationCountry:country,enabledProviders:enabled}).provider,'irail_national_transit');
 for(const mode of ['bus','coach','flight','metro'])assert.deepEqual(selectCountryProviders({country:'BE',category:'public_transport',mode,enabledProviders:enabled}).providers,[]);
 assert.deepEqual(selectCountryProviders({originCountry:'BE',destinationCountry:'FR',category:'public_transport',enabledProviders:enabled}).providers,[]);
});
test('requests are keyless, pinned v1, identified, rate-admitted, dated in Belgian local time',async()=>{
 const calls=[],admissions=[],config=env();config.IRAIL_RATE_LIMITER.limit=async p=>{admissions.push(p);return {success:true};};
 const result=await plan(config,options,{...opts,fetchImpl:async(url,init)=>{
  const u=new URL(url);calls.push(u);assert.equal(u.origin,'https://api.irail.be');assert.equal(init.redirect,'error');
  assert.equal(init.headers['User-Agent'],config.IRAIL_USER_AGENT);assert.equal(u.searchParams.has('key'),false);
  if(u.pathname.endsWith('/connections')){
   assert.equal(u.searchParams.get('date'),'271126');assert.equal(u.searchParams.get('time'),'1000');
   assert.equal(u.searchParams.get('from'),stations[0].id);assert.equal(u.searchParams.get('typeOfTransport'),'trains');
  }
  return opts.fetchImpl(url);
 }});
 assert.equal(result.status,'ok');assert.equal(calls.length,2);assert.equal(admissions.length,2);
 assert.equal(result.journeys[0].stop_countries_verified,true);assert.equal(result.journeys[0].fareComplete,false);
 assert.equal(result.journeys[0].walkingAccessVerified,false);assert.equal(result.journeys[0].real_time,false);
 assert.deepEqual(irailLocalDeparture('2026-07-01T22:30:00Z'),{date:'020726',time:'0030'});
 assert.deepEqual(irailLocalDeparture('2026-10-25T01:30:00Z'),{date:'251026',time:'0230'});
});
test('normalizer accepts direct and sourced transfers but refuses corrupt, walking, cancelled or discontinuous legs',()=>{
 assert.equal(normalize(connection(),options).legs.length,1);assert.equal(normalize(transfer(),options).legs.length,2);
 const mutate=[c=>c.departure.canceled='1',c=>c.arrival.walking='1',c=>c.departure.time='NaN',c=>c.departure.delay='',
  c=>c.departure.stationinfo.locationX='',c=>c.arrival.vehicle='BE.NMBS.IC999',c=>c.vias.number='1',
  c=>c.departure.stops={number:'1',stop:[]},c=>c.arrival.time=c.departure.time,c=>c.departure.stationinfo.id='unknown'];
 for(const change of mutate){const c=connection();change(c);assert.equal(normalize(c,options),null);}
 const c=transfer();c.vias.via[0].departure.time=c.vias.via[0].arrival.time;assert.equal(normalize(c,options),null);
 assert.equal(normalize(connection(),{...options,from:{latitude:50,longitude:4}}),null);
 assert.equal(normalize(connection(),{...options,departureAt:'2026-11-28T09:00:00Z'}),null);
});
test('intermediate foreign/unknown stops fail domestic checks, not just endpoints',async()=>{
 for(const country of ['FR',null]){
  const c=connection();c.departure.stops={number:'1',stop:[{stationinfo:stations[1],scheduledArrivalTime:String(Date.parse('2026-11-27T09:25:00Z')/1000),scheduledDepartureTime:String(Date.parse('2026-11-27T09:26:00Z')/1000),arrivalDelay:'0',departureDelay:'0',arrivalCanceled:'0',departureCanceled:'0'}]};
  const result=await plan(env(),options,{...opts,fetchImpl:async url=>Response.json(url.includes('/stations?')?{station:stations}:{connection:[c]}),verifyCountry:async p=>p.latitude===middle.latitude?country:'BE'});
  assert.equal(result.status,'domestic_route_unverified');assert.equal(result.journeys.length,0);
 }
});
test('foreign country, bus-only, past/undated timezone and disabled requests make no provider calls',async()=>{
 for(const [patch,status] of [[{originCountry:'FR'},'country_not_authorized'],[{destinationCountry:'NL'},'country_not_authorized'],
  [{departureAt:'2026-11-25T09:00:00Z'},'invalid_departure'],[{departureAt:'2026-11-27T09:00:00'},'invalid_departure'],[{preference:'bus_only'},'mode_not_supported']]){
  const result=await plan(env(),{...options,...patch},{...opts,fetchImpl:()=>assert.fail('must not fetch')});assert.equal(result.status,status);
 }
 let requests=0;const r=await plan(env(),{...options,from:{latitude:50,longitude:4}},{...opts,fetchImpl:async url=>{requests++;return opts.fetchImpl(url);}});
 assert.equal(r.status,'rail_station_access_required');assert.equal(requests,1);
});
test('quota/access/network/oversize failures never retry or fall back',async()=>{
 for(const [response,status] of [[new Response('',{status:429}),'quota_exceeded'],[new Response('',{status:403}),'access_denied'],
  [new Response('',{status:500}),'provider_http_error'],[new Response('bad'),'invalid_response'],[new Response('{}',{headers:{'content-length':String(3*1024*1024)}}),'response_too_large']]){
  let calls=0;const r=await plan(env(),options,{...opts,fetchImpl:async()=>{calls++;return response;}});assert.equal(r.status,status);assert.equal(calls,1);
 }
 const config=env();config.IRAIL_RATE_LIMITER.limit=async()=>({success:false});assert.equal((await plan(config,options,{...opts,fetchImpl:()=>assert.fail('quota stops HTTP')})).status,'quota_exceeded');
 config.IRAIL_RATE_LIMITER.limit=async()=>{throw Error('down');};assert.equal((await plan(config,options,opts)).status,'budget_unavailable');
 await assert.rejects(readTransportJson(new Response(new Uint8Array(100)),50),/response_too_large/);
});
