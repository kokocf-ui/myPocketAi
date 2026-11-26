import assert from 'node:assert/strict';
import {test} from 'node:test';
import {planEnturNationalJourney as plan,normalizeEnturPattern as normalize,enturNationalConfigured,ENTUR_ENDPOINT,ENTUR_QUERY} from './entur_national_transit.mjs';
import {nationalTransportResponse} from './national_transport_response.mjs';
import {configuredNationalTransportProviders,nationalTransportCoverage,NATIONAL_TRANSPORT_COUNTRIES} from './national_transport_registry.mjs';
import {nationalPublicTransportPolicy as policy} from './national_public_transport_policy.mjs';
import {EUROPE_COUNTRIES} from './europe_country_sources.mjs';
import {from,to,at,now,env,options,leg,pattern,payload} from './test_fixtures/entur_national.mjs';
const testOpts={now,verifyCountry:async()=> 'NO',fetchImpl:async()=>Response.json(payload([pattern()]))};
const clone=v=>structuredClone(v);

test('Norway opt-in requires both explicit switches and an identifying client header',async()=>{
 assert.equal(enturNationalConfigured({}),false);assert.equal(enturNationalConfigured(env),true);
 for(const patch of [{ENTUR_NATIONAL_ENABLED:false},{ENTUR_TERMS_REVIEWED:'false'},{ENTUR_CLIENT_NAME:''},{ENTUR_CLIENT_NAME:'bad\r\nheader'}]){
  const e={...env,...patch};assert.equal(enturNationalConfigured(e),false);
  const result=await plan(e,options,{...testOpts,fetchImpl:()=>{throw Error('disabled must never call');}});
  assert.equal(result.status,'not_configured');assert.ok(!configuredNationalTransportProviders(e).includes('entur_national_transit'));
 }
 const enabled=configuredNationalTransportProviders(env),coverage=nationalTransportCoverage('NO',enabled);
 assert.equal(coverage.urban_configured,true);assert.equal(coverage.intercity_configured,true);
 assert.deepEqual(coverage.configured_adapters,['entur_national_transit']);
 assert.equal(coverage.countrywide_coverage_verified,false);assert.equal(coverage.validation_status,'contract_tests_only');
});
test('Country policy is domestic-only for all 49 countries; catalog is never a connection',()=>{
 for(const country of EUROPE_COUNTRIES){
  assert.equal(policy({originCountry:country,destinationCountry:country==='GB'?'RO':'GB',enabledProviders:['entur_national_transit']}).status,'international_destination');
  if(!['RO','GB','NO'].includes(country)){
   assert.equal(policy({originCountry:country,destinationCountry:country,enabledProviders:['entur_national_transit']}).status,'country_provider_not_connected');
   assert.deepEqual(nationalTransportCoverage(country,configuredNationalTransportProviders(env)).configured_adapters,[]);
  }
 }
 assert.equal(Object.keys(NATIONAL_TRANSPORT_COUNTRIES).length,49);
 assert.equal(policy({originCountry:'NO',destinationCountry:'NO',enabledProviders:['entur_national_transit']}).provider,'entur_national_transit');
 assert.equal(policy({originCountry:'NO',destinationCountry:'NO'}).status,'national_provider_not_connected');
});
test('Request uses pinned HTTPS endpoint, GraphQL variables, explicit walking access and no credentials in URLs',async()=>{
 const calls=[];
 const result=await plan(env,options,{...testOpts,fetchImpl:async(url,init)=>{
  calls.push({url,init});return Response.json(payload([pattern()]));
 }});
 assert.equal(result.status,'ok');assert.equal(calls.length,2,'local queries retain a bus-only alternative');
 for(const {url,init} of calls){
  assert.equal(url,ENTUR_ENDPOINT);assert.equal(init.method,'POST');assert.equal(init.redirect,'error');
  assert.equal(init.headers['ET-Client-Name'],env.ENTUR_CLIENT_NAME);
  const b=JSON.parse(init.body);assert.equal(b.query,ENTUR_QUERY);assert.deepEqual(b.variables.from,{coordinates:from});
  assert.equal(b.variables.at,new Date(at).toISOString());assert.equal(b.variables.modes.accessMode,'foot');assert.equal(b.variables.modes.egressMode,'foot');
 }
 assert.ok(!JSON.parse(calls[1].init.body).variables.modes.transportModes.some(m=>m.transportMode==='rail'));
 assert.equal(result.journeys.length,1,'identical general/bus query results deduplicate');
 assert.equal(result.journeys[0].legs[0].stopCount,2);assert.equal(result.journeys[0].fareLocal,null);
 assert.equal(result.journeys[0].real_time,false);assert.equal(result.journeys[0].stop_countries_verified,true);
 assert.ok(!('_countryCheckPoints' in result.journeys[0]));
 assert.equal(result.journeys[0].geometryAvailable,false);assert.equal(result.journeys[0].walkingAccessVerified,false);
});
test('Chronology, all legs, exact endpoints, modes and cancellation are validated without repairing connections',()=>{
 assert.ok(normalize(pattern(),options));
 const mutations=[
  p=>p.legs[0].expectedStartTime='bad',p=>p.legs[0].expectedEndTime='2026-11-27T08:00:00Z',
  p=>p.legs[0].mode='teleport',p=>p.legs[0].fromPlace.latitude=null,p=>p.legs[0].toPlace.longitude=30,
  p=>p.legs[0].fromEstimatedCall.cancellation=true,p=>p.legs[0].toEstimatedCall.cancellation=true,
  p=>delete p.legs[0].intermediateQuays,p=>p.legs[0].intermediateQuays[0].latitude=null,
  p=>p.legs[0].fromPlace.name='',p=>p.legs.push(leg('rail',from,to,'2026-11-27T09:00:00Z','2026-11-27T09:05:00Z'))
 ];
 for(const change of mutations){const p=pattern();change(p);assert.equal(normalize(p,options),null);}
 assert.equal(normalize(pattern('foot'),options),null,'a walking-only path is not a public transport itinerary');
 const unsupported=pattern();unsupported.legs[0].operator.url='javascript:alert(1)';
 assert.equal(normalize(unsupported,options).legs[0].operatorUrl,null);
 const duplicate=pattern();duplicate.legs[0].intermediateQuays.push(clone(duplicate.legs[0].intermediateQuays[0]));
 assert.equal(normalize(duplicate,options).legs[0].stopCount,null,'do not invent an exact count from duplicate stops');
});
test('A foreign or unverified intermediate quay rejects the itinerary even with Norwegian endpoints',async()=>{
 let verified=[];
 const foreign=await plan(env,options,{...testOpts,verifyCountry:async p=>{verified.push(p);return p.latitude===(from.latitude+to.latitude)/2?'SE':'NO';}});
 assert.equal(foreign.status,'domestic_route_unverified');assert.deepEqual(foreign.journeys,[]);assert.equal(verified.length,3,'shared stops are geocoded once per request');
 const failed=await plan(env,options,{...testOpts,verifyCountry:async()=>{throw Error('geocoder unavailable');}});
 assert.equal(failed.status,'domestic_route_unverified');assert.deepEqual(failed.journeys,[]);
 const missing=await plan(env,options,{...testOpts,verifyCountry:undefined});assert.equal(missing.status,'country_verification_unavailable');
});
test('Requests are bounded and foreign endpoints never reach Entur',async()=>{
 const opts={...testOpts,fetchImpl:()=>{throw Error('invalid request must not fetch');}};
 assert.equal((await plan(env,{...options,destinationCountry:'SE'},opts)).status,'country_not_authorized');
 assert.equal((await plan(env,{...options,originCountry:''},opts)).status,'country_not_authorized');
 assert.equal((await plan(env,{...options,from:{latitude:'59',longitude:10}},opts)).status,'invalid_coordinates');
 assert.equal((await plan(env,{...options,departureAt:'2025-01-01T00:00:00Z'},opts)).status,'invalid_departure');
 assert.equal((await plan(env,{...options,departureAt:'2028-01-01T00:00:00Z'},opts)).status,'invalid_departure');
 const p=pattern();p.legs[0].intermediateQuays=Array.from({length:40},(_,i)=>({id:'NSR:Quay:'+(100+i),latitude:59.915+i*.00001,longitude:10.75}));
 const bounded=await plan(env,options,{...testOpts,fetchImpl:async()=>Response.json(payload([p]))});
 assert.equal(bounded.status,'domestic_route_unverified');assert.equal(bounded.country_checks,0,'oversized validation does not fan out geocoder requests');
});
test('Provider failures remain explicit; partial GraphQL errors never become verified timetables',async()=>{
 for(const [response,status] of [[()=>Response.json({}, {status:429}),'quota_exceeded'],[()=>Response.json({}, {status:403}),'access_denied'],
  [()=>Response.json({}, {status:500}),'provider_http_error'],[()=>Response.json({...payload([pattern()]),errors:[{message:'partial'}]}),'provider_graphql_error'],
  [()=>Response.json({data:{trip:{routingErrors:[{code:'NO_TRANSIT_CONNECTION'}],tripPatterns:[]}}}),'provider_routing_error'],
  [()=>Response.json({unexpected:true}),'invalid_response'],[()=>new Response('bad JSON'),'invalid_response'],
  [()=>Response.json(payload([])),'no_results']]){
  const result=await plan(env,{...options,limit:1},{...testOpts,fetchImpl:async()=>response()});
  assert.equal(result.status,status);assert.deepEqual(result.journeys,[]);
 }
 const timeout=await plan(env,{...options,limit:1},{...testOpts,fetchImpl:async()=>{throw new DOMException('deadline','TimeoutError');}});
 assert.equal(timeout.status,'timeout');
});
test('Rail and bus coexist; bus-only request excludes rail even if a supplier ignores its filter',async()=>{
 let requests=0;
 const r=await plan(env,{...options,limit:2},{...testOpts,fetchImpl:async(_,init)=>{
  requests++;const vars=JSON.parse(init.body).variables;
  const rail=pattern('rail'),tram=pattern('tram'),bus=pattern();
  return Response.json(payload(vars.modes.transportModes.some(m=>m.transportMode==='rail')?[rail,tram]:[bus]));
 }});
 assert.equal(requests,2);assert.equal(r.journeys.length,2);assert.ok(r.journeys.some(j=>j.legs[0].mode==='bus'));
 const filtered=await plan(env,{...options,preference:'bus_only'},{...testOpts,fetchImpl:async()=>Response.json(payload([pattern('rail'),pattern()]))});
 assert.equal(filtered.journeys.length,1);assert.equal(filtered.journeys[0].legs[0].mode,'bus');
});
test('Multi-leg walk/rail/ferry itinerary keeps sourced transfer and realtime per leg; intercity does not query a local bus alternative',async()=>{
 const a={latitude:59.912,longitude:10.751},b={latitude:60,longitude:10.8},c={latitude:61.1,longitude:11.1};
 const p={legs:[leg('foot',from,a,'2026-11-27T09:00:00Z','2026-11-27T09:05:00Z'),
  leg('rail',a,b,'2026-11-27T09:10:00Z','2026-11-27T10:00:00Z'),leg('water',b,c,'2026-11-27T10:20:00Z','2026-11-27T11:00:00Z')]};
 p.legs[0].intermediateQuays=[];p.legs[1].realtime=true;
 let calls=0;
 const result=await plan(env,{...options,to:c},{...testOpts,fetchImpl:async()=>{calls++;return Response.json(payload([p]));}});
 assert.equal(calls,1);assert.equal(result.status,'ok');assert.deepEqual(result.journeys[0].legs.map(l=>l.mode),['walking','train','ferry']);
 assert.equal(result.journeys[0].real_time,true);assert.equal(result.journeys[0].legs[2].realtime,false);
 const response=nationalTransportResponse(result,{country:'NO',provider:'Entur',language:'ro',destination:{...c,label:'Test destination'},departureAt:at});
 assert.equal(response.national_public_transport,true);assert.equal(response.international_journey,false);assert.equal(response.mixed_journey,false);
 assert.match(response.reply,/Entur/);assert.match(response.reply,/Preț indisponibil/);
 assert.equal(response.transit[0].availability_disclosure.seat_status,'unverified');
});
