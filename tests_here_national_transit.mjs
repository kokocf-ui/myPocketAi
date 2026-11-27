import assert from 'node:assert/strict';
import {test} from 'node:test';
import {hereNationalConfigured,normalizeHereRoute,planHereNationalJourney} from './here_national_transit.mjs';
import {nationalTransportResponse} from './national_transport_response.mjs';
import {nationalPublicTransportPolicy} from './national_public_transport_policy.mjs';
import {configuredNationalTransportProviders} from './national_transport_registry.mjs';
import {environment,route,payload,options,now,to} from './test_fixtures/here_national.mjs';
const opts={now,verifyCountry:async()=> 'DE'};
test('all gates are explicit and DE selection prefers HERE without removing MOTIS',()=>{
 const e=environment();assert.equal(hereNationalConfigured(e),true);
 for(const key of Object.keys(e))assert.equal(hereNationalConfigured({...e,[key]:undefined}),key==='HERE_TRANSIT_MONTHLY_LIMIT',key);
 assert.equal(hereNationalConfigured({...e,HERE_TRANSIT_MONTHLY_LIMIT:5000}),false);
 assert.equal(hereNationalConfigured({...e,HERE_TRANSIT_MONTHLY_LIMIT:0}),false);
 const enabledProviders=configuredNationalTransportProviders(e);assert.ok(enabledProviders.includes('here_national_transit'));
 assert.equal(nationalPublicTransportPolicy({originCountry:'DE',destinationCountry:'DE',enabledProviders}).provider,'here_national_transit');
 assert.equal(nationalPublicTransportPolicy({originCountry:'FI',destinationCountry:'FI',enabledProviders}).status,'national_provider_not_connected');
});
test('one fixed official request; server key, no redirect, intermediate stops, no paid/bus fallback',async()=>{
 let count=0,reserved=0;const e=environment(async()=>{reserved++;return Response.json({allowed:true});});
 const result=await planHereNationalJourney(e,options,{...opts,fetchImpl:async(url,init)=>{
  count++;const u=new URL(url);assert.equal(u.origin+u.pathname,'https://transit.router.hereapi.com/v8/routes');
  assert.equal(u.searchParams.get('return'),'intermediate');assert.equal(u.searchParams.get('alternatives'),'3');
  assert.equal(u.searchParams.get('routingMode'),null);assert.equal(u.searchParams.get('apiKey'),e.HERE_TRANSIT_API_KEY);
  assert.equal(init.redirect,'manual');return Response.json(payload());}});
 assert.equal(count,1);assert.equal(reserved,1);assert.equal(result.status,'ok');
 const j=result.journeys[0];assert.equal(j.stop_countries_verified,true);assert.equal(j.legs[0].stopCount,2);assert.equal(j.schedule_status,'scheduled');
 assert.ok(!JSON.stringify(result).includes(e.HERE_TRANSIT_API_KEY));assert.ok(j.attribution.text.endsWith('https://operator.example/license'));
});
test('route without timetable survives, estimates disclosed; unknown stops are not invented',()=>{
 const r=route();delete r.sections[0].departure.time;delete r.sections[0].arrival.time;delete r.sections[0].intermediateStops;
 const j=normalizeHereRoute(r,options);assert.ok(j);assert.equal(j.route_only,true);assert.equal(j.startDateTime,null);assert.equal(j.legs[0].stopCount,null);
 const d=nationalTransportResponse({status:'ok',journeys:[j]},{country:'DE',provider:'HERE',destination:{...to,label:'Synthetic'}});
 assert.match(d.reply,/orarul nu poate fi garantat/);assert.ok(!/1970|Invalid Date/.test(d.reply));assert.match(d.reply,/END/);
 const estimated=route();estimated.sections[0].notices=[{code:'noSchedule',severity:'info'}];
 assert.equal(normalizeHereRoute(estimated,options).schedule_status,'estimated');
 estimated.sections[0].notices=[{code:'noIntermediate'}];assert.equal(normalizeHereRoute(estimated,options).legs[0].stopCount,null);
});
test('malformed, critical, cancelled, impossible and missing line/stop rejected',()=>{
 for(const mutate of [r=>r.sections[0].transport.mode='flight',r=>r.sections[0].transport.mode='__proto__',r=>r.sections[0].departure.place.location.lat=null,
  r=>r.sections[0].transport.name='',r=>r.sections[0].arrival.place.name='',r=>r.sections[0].notices=[{code:'newCritical',severity:'critical'}],
  r=>r.notices=[{code:'nonviableRoute'}],r=>r.sections[0].departure.status='cancelled',r=>r.sections[0].arrival.time='2026-11-27T07:00:00Z',
  r=>r.sections[0].intermediateStops=[{departure:{place:{name:'missing coords'}}}]]){
  const r=route();mutate(r);assert.equal(normalizeHereRoute(r,options),null);
 }
});
test('quota refusal and storage outage stop before provider fetch; no retries for failures',async()=>{
 for(const [status,reason] of [[429,'free_quota_exhausted'],[503,'budget_unavailable']]){
  const e=environment(async()=>Response.json({allowed:false,reason},{status}));
  const d=await planHereNationalJourney(e,options,{...opts,fetchImpl:()=>assert.fail('must stop')});assert.equal(d.status,reason);
 }
 for(const status of [302,401,403,429,500]){
  let count=0;await planHereNationalJourney(environment(),options,{...opts,fetchImpl:async()=>{count++;return new Response(null,{status});}});assert.equal(count,1);
 }
});
test('domestic verification covers intermediate stops; foreign or unverified rejected',async()=>{
 for(const country of ['AT',null]){
  const d=await planHereNationalJourney(environment(),options,{...opts,fetchImpl:async()=>Response.json(payload()),verifyCountry:async p=>p.latitude===50.111?country:'DE'});
  assert.equal(d.status,'domestic_route_unverified');assert.equal(d.journeys.length,0);
 }
});
test('cross-border, disabled, absent country verifier and invalid departure cause no reservation/request',async()=>{
 const e=environment(()=>assert.fail('no reservation'));
 const fetchImpl=()=>assert.fail('no provider request');
 for(const patch of [{originCountry:'AT'},{destinationCountry:'AT'},{departureAt:'invalid'},{from:{latitude:NaN,longitude:0}}]){
  assert.equal((await planHereNationalJourney(e,{...options,...patch},{...opts,fetchImpl})).journeys.length,0);
 }
 assert.equal((await planHereNationalJourney({...e,HERE_TRANSIT_ENABLED:'false'},options,{...opts,fetchImpl})).status,'not_configured');
 assert.equal((await planHereNationalJourney(e,options,{now,fetchImpl})).status,'country_verification_unavailable');
});
