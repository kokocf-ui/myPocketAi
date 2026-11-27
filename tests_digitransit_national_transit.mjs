import assert from 'node:assert/strict';
import {test} from 'node:test';
import {planDigitransitNationalJourney as plan,normalizeDigitransitPattern as normalize,digitransitNationalConfigured,DIGITRANSIT_QUERY,DIGITRANSIT_ENDPOINT} from './digitransit_national_transit.mjs';
import {nationalTransportResponse} from './national_transport_response.mjs';
import {configuredNationalTransportProviders,nationalTransportCoverage} from './national_transport_registry.mjs';
import {nationalPublicTransportPolicy} from './national_public_transport_policy.mjs';
import {from,to,at,receivedAt,now,env,options,pattern,leg,payload} from './test_fixtures/digitransit_national.mjs';
const opts={now,verifyCountry:async()=> 'FI',fetchImpl:async()=>Response.json(payload([pattern()]))};
const normalizeOptions={...options,receivedAt};

test('Finland requires its own reviewed activation AND a server secret; key alone never activates it',async()=>{
 assert.equal(digitransitNationalConfigured(env),true);assert.equal(digitransitNationalConfigured({DIGITRANSIT_API_KEY:env.DIGITRANSIT_API_KEY}),false);
 for(const patch of [{DIGITRANSIT_NATIONAL_ENABLED:'false'},{DIGITRANSIT_TERMS_REVIEWED:'false'},{DIGITRANSIT_API_KEY:''},{DIGITRANSIT_API_KEY:'bad\r\nkey'}]){
  const e={...env,...patch};assert.equal(digitransitNationalConfigured(e),false);
  assert.equal((await plan(e,options,opts)).status,'not_configured');
  assert.ok(!configuredNationalTransportProviders(e).includes('digitransit_national_transit'));
 }
 const configured=configuredNationalTransportProviders(env),coverage=nationalTransportCoverage('FI',configured);
 assert.equal(coverage.urban_configured,true);assert.equal(coverage.intercity_configured,true);
 assert.equal(coverage.validation_status,'contract_tests_only');assert.equal(coverage.countrywide_coverage_verified,false);
 assert.deepEqual(coverage.configured_adapters,['digitransit_national_transit']);
 assert.equal(nationalPublicTransportPolicy({originCountry:'FI',destinationCountry:'FI',enabledProviders:configured}).provider,'digitransit_national_transit');
});
test('Request uses Routing v2 planConnection, Finland endpoint, variables and header-only secret',async()=>{
 const calls=[];
 const result=await plan(env,options,{...opts,fetchImpl:async(url,init)=>{calls.push({url,init});return Response.json(payload([pattern()]));}});
 assert.equal(result.status,'ok');assert.equal(calls.length,2);assert.equal(result.journeys.length,1);
 for(const {url,init} of calls){
  assert.equal(url,DIGITRANSIT_ENDPOINT);assert.ok(url.includes('/v2/finland/'));assert.equal(init.redirect,'manual');
  assert.equal(init.headers['digitransit-subscription-key'],env.DIGITRANSIT_API_KEY);
  assert.ok(!url.includes(env.DIGITRANSIT_API_KEY));assert.ok(!init.body.includes(env.DIGITRANSIT_API_KEY));
  const b=JSON.parse(init.body);assert.equal(b.query,DIGITRANSIT_QUERY);
  assert.deepEqual(b.variables.origin,{location:{coordinate:from}});assert.deepEqual(b.variables.destination,{location:{coordinate:to}});
  assert.equal(b.variables.at.earliestDeparture,new Date(at).toISOString());assert.equal(b.variables.modes.transitOnly,true);
  assert.deepEqual(b.variables.modes.transit.access,['WALK']);
 }
 const j=result.journeys[0];assert.equal(j.country_code,'FI');assert.equal(j.time_zone,'Europe/Helsinki');
 assert.equal(j.legs[0].stopCount,2);assert.equal(j.real_time,false);assert.equal(j.fareLocal,null);assert.equal(j.geometryAvailable,false);
 assert.ok(!('_countryCheckPoints' in j));assert.ok(!JSON.stringify(result).includes(env.DIGITRANSIT_API_KEY));
});
test('Complete leg calls include both endpoints: malformed, omitted, non-Stop or canceled data is not patched',()=>{
 assert.ok(normalize(pattern(),normalizeOptions));
 const mutations=[p=>delete p.legs[0].stopCalls,p=>p.legs[0].stopCalls.pop(),p=>p.legs[0].stopCalls[1].stopLocation.__typename='LocationGroup',
  p=>p.legs[0].stopCalls[1].stopLocation.lat=null,p=>p.legs[0].from.lat=null,p=>p.legs[0].mode='TAXI',
  p=>p.legs[0].tripOnServiceDate.realTimeTripState.canceled=true,p=>p.legs[0].pickupType='CALL_AGENCY',
  p=>p.legs[0].dropoffType='NONE',p=>p.legs[0].start.scheduledTime='bad',
  p=>p.legs[0].start.estimated={time:'invalid'},p=>p.legs[0].end.scheduledTime='2026-11-27T08:00:00Z',
  p=>p.legs.push(leg('RAIL',from,to,'2026-11-27T09:00:00Z','2026-11-27T09:05:00Z'))];
 for(const mutate of mutations){const p=pattern();mutate(p);assert.equal(normalize(p,normalizeOptions),null);}
 assert.equal(normalize(pattern('WALK'),normalizeOptions),null);
});
test('Finland endpoint data containing an Estonian stop is refused, even though both countries are served by that API',async()=>{
 const result=await plan(env,options,{...opts,verifyCountry:async p=>p.latitude===(from.latitude+to.latitude)/2?'EE':'FI'});
 assert.equal(result.status,'domestic_route_unverified');assert.deepEqual(result.journeys,[]);assert.equal(result.country_checks,3);
 const unknown=await plan(env,options,{...opts,verifyCountry:async()=>null});assert.equal(unknown.status,'domestic_route_unverified');
 let calls=0;const guarded={...opts,fetchImpl:async()=>{calls++;throw Error('not allowed');}};
 assert.equal((await plan(env,{...options,destinationCountry:'EE'},guarded)).status,'country_not_authorized');
 assert.equal((await plan(env,{...options,originCountry:'NO'},guarded)).status,'country_not_authorized');assert.equal(calls,0);
});
test('Real-time updates are per leg and keep scheduled times; attribution includes reception timestamp and licenses',async()=>{
 const p=pattern();p.legs[0].start.estimated={time:'2026-11-27T09:12:00Z'};p.legs[0].end.estimated={time:'2026-11-27T09:22:00Z'};
 p.legs[0].tripOnServiceDate.realTimeTripState.updated=true;
 const j=normalize(p,normalizeOptions);assert.equal(j.legs[0].departureTime,'2026-11-27T09:12:00.000Z');
 assert.equal(j.legs[0].scheduledDepartureTime,'2026-11-27T09:10:00.000Z');assert.equal(j.real_time,true);
 assert.equal(j.attribution.received_at,receivedAt);assert.match(j.attribution.text,/Digitransit 2026/);
 assert.match(j.attribution.text,/CC BY 4\.0/);assert.match(j.attribution.text,/OpenStreetMap.*ODbL/);
 const output=nationalTransportResponse({status:'ok',journeys:[j]},{country:'FI',provider:'Digitransit',language:'ro',destination:{...to,label:'Synthetic arrival'},departureAt:at});
 assert.match(output.reply,/© Digitransit/);assert.match(output.reply,/Preț indisponibil/);assert.equal(output.mixed_journey,false);
});
test('API HTTP, GraphQL, JSON, routing and size errors do not expose the supplied key or provider error body',async()=>{
 for(const [fn,status] of [[()=>Response.json({error:env.DIGITRANSIT_API_KEY},{status:401}),'access_denied'],
  [()=>Response.json({}, {status:429}),'quota_exceeded'],[()=>Response.json({}, {status:503}),'provider_http_error'],
  [()=>Response.json({...payload([pattern()]),errors:[{message:env.DIGITRANSIT_API_KEY}]}),'provider_graphql_error'],
  [()=>Response.json({data:{planConnection:{routingErrors:[{code:'NO_TRANSIT_CONNECTION'}],edges:[]}}}),'provider_routing_error'],
  [()=>new Response('invalid json'),'invalid_response'],[()=>Response.json({wrong:true}),'invalid_response'],
  [()=>Response.json(payload([pattern()]),{headers:{'content-length':String(3*1024*1024)}}),'response_too_large'],
  [()=>Response.json(payload([])),'no_results']]){
  const r=await plan(env,{...options,limit:1},{...opts,fetchImpl:async()=>fn()});
  assert.equal(r.status,status);assert.deepEqual(r.journeys,[]);assert.ok(!JSON.stringify(r).includes(env.DIGITRANSIT_API_KEY));
 }
 const timeout=await plan(env,{...options,limit:1},{...opts,fetchImpl:async()=>{throw new DOMException('timeout','TimeoutError');}});assert.equal(timeout.status,'timeout');
});
test('Local bus alternatives coexist with rail; provider-ignored bus filters do not admit rail-only cards',async()=>{
 const result=await plan(env,{...options,limit:2},{...opts,fetchImpl:async(_,init)=>{
  const b=JSON.parse(init.body);return Response.json(payload(b.variables.modes.transit.transit.some(m=>m.mode==='RAIL')?[pattern('RAIL'),pattern('TRAM')]:[pattern()]));
 }});
 assert.equal(result.journeys.length,2);assert.ok(result.journeys.some(j=>j.legs[0].mode==='bus'));
 const bus=await plan(env,{...options,preference:'bus_only'},{...opts,fetchImpl:async()=>Response.json(payload([pattern('RAIL'),pattern()]))});
 assert.equal(bus.journeys.length,1);assert.equal(bus.journeys[0].legs[0].mode,'bus');
});
test('Intercity and walking transfer legs use the Finnish provider, with bounded validation and no local bus query',async()=>{
 const a={latitude:60.172,longitude:24.942},b={latitude:61.498,longitude:23.773};
 const p={legs:[leg('WALK',from,a,'2026-11-27T09:00:00Z','2026-11-27T09:05:00Z'),leg('RAIL',a,b,'2026-11-27T09:10:00Z','2026-11-27T11:00:00Z')]};
 let calls=0;const r=await plan(env,{...options,to:b},{...opts,fetchImpl:async()=>{calls++;return Response.json(payload([p]));}});
 assert.equal(calls,1);assert.equal(r.status,'ok');assert.deepEqual(r.journeys[0].legs.map(l=>l.mode),['walking','train']);
 const noVerifier=await plan(env,options,{...opts,verifyCountry:undefined});assert.equal(noVerifier.status,'country_verification_unavailable');
 assert.equal((await plan(env,{...options,departureAt:'2020-01-01T00:00:00Z'},opts)).status,'invalid_departure');
 const gap=pattern();gap.legs.push(leg('RAIL',from,to,'2026-11-27T10:00:00Z','2026-11-27T10:10:00Z'));
 assert.equal(normalize(gap,normalizeOptions),null);
});
test('Estonia uses its documented shared endpoint but retains independent country and timezone checks',async()=>{
 const a={latitude:59.439,longitude:24.737},b={latitude:59.437,longitude:24.755};
 const p={legs:[leg('BUS',a,b)]},request={...options,from:a,to:b,originCountry:'EE',destinationCountry:'EE'};
 const result=await plan(env,request,{...opts,verifyCountry:async()=> 'EE',fetchImpl:async()=>Response.json(payload([p]))});
 assert.equal(result.status,'ok');assert.equal(result.journeys[0].country_code,'EE');assert.equal(result.journeys[0].time_zone,'Europe/Tallinn');
 assert.equal(nationalTransportCoverage('EE',configuredNationalTransportProviders(env)).urban_configured,true);
 const foreign=await plan(env,request,{...opts,verifyCountry:async pt=>pt.latitude===(a.latitude+b.latitude)/2?'FI':'EE',fetchImpl:async()=>Response.json(payload([p]))});
 assert.equal(foreign.status,'domestic_route_unverified');assert.deepEqual(foreign.journeys,[]);
});

test('Cloudflare-compatible manual redirect never forwards the subscription key to a new origin',async()=>{
 let calls=0;
 const result=await plan(env,options,{...opts,fetchImpl:async(url,init)=>{
  calls++;assert.equal(url,DIGITRANSIT_ENDPOINT);assert.equal(init.redirect,'manual');
  return new Response(null,{status:302,headers:{location:'https://untrusted.example/'}});
 }});
 assert.equal(calls,2);assert.equal(result.status,'provider_http_error');assert.deepEqual(result.journeys,[]);
 const error=await plan(env,options,{...opts,fetchImpl:async()=>{throw new TypeError('Unsupported redirect mode '+env.DIGITRANSIT_API_KEY);}});
 assert.equal(error.source_status.main_diagnostic,'redirect_mode');assert.ok(!JSON.stringify(error).includes(env.DIGITRANSIT_API_KEY));
});
