import assert from 'node:assert/strict';
import {test} from 'node:test';
import {germanyNationalConfigured as configured,germanyMotisEndpoint,normalizeGermanyItinerary as normalize,planGermanyNationalJourney as plan} from './germany_national_transit.mjs';
import {configuredNationalTransportProviders,nationalTransportCoverage} from './national_transport_registry.mjs';
import {from,to,at,now,receivedAt,env,options,itinerary,payload} from './test_fixtures/germany_national.mjs';
const opts={now,verifyCountry:async()=> 'DE',fetchImpl:async()=>Response.json(payload())};
const norm={...options,receivedAt,attribution:env.GERMANY_MOTIS_ATTRIBUTION};
test('DE has no default endpoint or implicit commercial/data approval, even with FI enabled',async()=>{
 assert.equal(configured({}),false);assert.equal(configured(env),true);
 for(const k of ['GERMANY_NATIONAL_ENABLED','GERMANY_MOTIS_TERMS_REVIEWED','GERMANY_MOTIS_DATA_REVIEWED','GERMANY_MOTIS_BASE_URL','GERMANY_MOTIS_ATTRIBUTION']){
  const e={...env,[k]:''};assert.equal(configured(e),false);assert.equal((await plan(e,options,opts)).status,'not_configured');
 }
 assert.equal(configured({...env,GERMANY_MOTIS_API_TOKEN:'bad\r\nkey'}),false);
 assert.equal(configured({...env,GERMANY_MOTIS_ATTRIBUTION:'x'.repeat(501)}),false,'Required source credits must not be silently truncated');
 assert.equal(configured({...env,GERMANY_MOTIS_API_TOKEN:undefined}),true,'MOTIS itself does not issue API keys; contracted gateways may require one');
 assert.equal(nationalTransportCoverage('DE',configuredNationalTransportProviders({DIGITRANSIT_NATIONAL_ENABLED:'true',DIGITRANSIT_TERMS_REVIEWED:'true',DIGITRANSIT_API_KEY:'synthetic-only'})).urban_configured,false);
 const c=nationalTransportCoverage('DE',configuredNationalTransportProviders(env));
 assert.equal(c.urban_configured,true);assert.equal(c.intercity_configured,true);assert.equal(c.countrywide_coverage_verified,false);assert.equal(c.validation_status,'contract_tests_only');
});
test('Public noncommercial/alias/internal/demo hosts and URL credentials are rejected before fetch',async()=>{
 for(const url of ['https://api.transitous.org/','https://staging.api.transitous.org/','https://api.transitous.org./','https://a.motis-project.de/','https://b.spline.de/','http://routing.unit-provider.com/','https://user:pass@routing.unit-provider.com/','https://routing.unit-provider.com/?key=x','https://routing.unit-provider.com/base','https://127.0.0.1/','https://[::1]/','https://localhost/']){
  const e={...env,GERMANY_MOTIS_BASE_URL:url};assert.equal(germanyMotisEndpoint(e),null,url);
  assert.equal((await plan(e,options,{...opts,fetchImpl:async()=>{assert.fail('Must not fetch forbidden provider');}})).status,'not_configured');
 }
});
test('GET v6 contract requests explicit safe modes, dated departure and header-only optional gateway token',async()=>{
 const calls=[];const result=await plan(env,options,{...opts,fetchImpl:async(url,init)=>{calls.push({u:new URL(url),init});return Response.json(payload());}});
 assert.equal(result.status,'ok');assert.equal(calls.length,2);assert.equal(result.journeys.length,1);
 for(const {u,init} of calls){
  assert.equal(u.pathname,'/api/v6/plan');assert.equal(init.method,'GET');assert.equal(init.redirect,'manual');
  assert.equal(u.searchParams.get('fromPlace'),from.latitude+','+from.longitude);assert.equal(u.searchParams.get('time'),new Date(at).toISOString());
  assert.equal(u.searchParams.get('directModes'),'');assert.equal(u.searchParams.get('joinInterlinedLegs'),'true');
  assert.equal(init.headers.Authorization,'Bearer '+env.GERMANY_MOTIS_API_TOKEN);assert.ok(!u.href.includes(env.GERMANY_MOTIS_API_TOKEN));
  assert.ok(!u.searchParams.get('transitModes').includes('AIRPLANE'));assert.ok(!u.searchParams.get('transitModes').includes('TRANSIT'));
 }
 const j=result.journeys[0];assert.equal(j.legs[0].stopCount,2);assert.equal(j.country_code,'DE');assert.equal(j.time_zone,'Europe/Berlin');
 assert.equal(j.stop_countries_verified,true);assert.ok(!('_countryCheckPoints' in j));assert.match(j.attribution.text,/Synthetic fixture.*OpenStreetMap/);
 assert.equal(j.fareLocal,null);assert.equal(j.seatAvailability,'unverified');assert.equal(j.walkingAccessVerified,false);
 assert.ok(!JSON.stringify(result).includes(env.GERMANY_MOTIS_API_TOKEN));
});
test('Missing/skipped/invented/looped/cancelled/nontransit legs never become scheduled verified itineraries',()=>{
 assert.ok(normalize(itinerary(),norm));
 for(const mutate of [j=>delete j.legs[0].intermediateStops,j=>j.legs[0].cancelled=true,j=>j.legs[0].from.cancelled=true,
  j=>j.legs[0].from.pickupType='NOT_ALLOWED',j=>j.legs[0].to.dropoffType='NOT_ALLOWED',j=>j.legs[0].mode='AIRPLANE',
  j=>j.legs[0].intermediateStops[0].lat=null,j=>j.legs[0].from.stopId='',j=>j.legs[0].loopedCalendarSince=at,
  j=>j.legs[0].reservation='COMPULSORY',j=>j.legs[0].interlineWithPreviousLeg=true,j=>j.legs[0].scheduledEndTime=at,
  j=>j.legs[0].startTime='invalid',j=>j.legs[0].realTime=undefined,j=>j.startTime=at,
  j=>j.legs.push({...j.legs[0]}),j=>j.legs[0].from.lon=9]){
  const j=itinerary();mutate(j);assert.equal(normalize(j,norm),null);
 }
 assert.equal(normalize(itinerary('WALK'),norm),null);
});
test('Independent DE stop verification refuses a foreign or unknown intermediate stop and limits geocoder work',async()=>{
 for(const country of ['AT',null]){
  const out=await plan(env,options,{...opts,verifyCountry:async p=>p.latitude===(from.latitude+to.latitude)/2?country:'DE'});
  assert.equal(out.status,'domestic_route_unverified');assert.deepEqual(out.journeys,[]);assert.equal(out.country_checks,3);
 }
 const j=itinerary();j.legs[0].intermediateStops=Array.from({length:37},(_,i)=>({...j.legs[0].intermediateStops[0],stopId:'stop'+i,lat:50.11+i/100000}));
 let checks=0;const out=await plan(env,options,{...opts,verifyCountry:async()=>{checks++;return 'DE';},fetchImpl:async()=>Response.json(payload([j]))});
 assert.equal(checks,0);assert.equal(out.status,'domestic_route_unverified');
});
test('Cross-country, invalid points/dates and absent verifier do not contact the routing service',async()=>{
 const noFetch={...opts,fetchImpl:async()=>assert.fail('No provider call')};
 assert.equal((await plan(env,{...options,destinationCountry:'AT'},noFetch)).status,'country_not_authorized');
 assert.equal((await plan(env,{...options,from:{latitude:null,longitude:8}},noFetch)).status,'invalid_coordinates');
 assert.equal((await plan(env,{...options,departureAt:'yesterday'},noFetch)).status,'invalid_departure');
 assert.equal((await plan(env,options,{...noFetch,verifyCountry:undefined})).status,'country_verification_unavailable');
});
test('Local road alternatives retained and bus-only filters a non-road response; intercity query is separate',async()=>{
 const p=itinerary('SUBWAY'),b=itinerary('BUS');p.endTime=p.legs[0].endTime=p.legs[0].scheduledEndTime='2026-11-27T08:25:00Z';
 const o=await plan(env,{...options,limit:2},{...opts,fetchImpl:async url=>Response.json(payload(new URL(url).searchParams.get('transitModes')==='BUS,COACH'?[b]:[p]))});
 assert.equal(o.journeys.length,2);assert.deepEqual(o.journeys.map(j=>j.legs[0].mode),['metro','bus']);
 assert.equal((await plan(env,{...options,preference:'bus_only'},{...opts,fetchImpl:async()=>Response.json(payload([p]))})).status,'no_valid_itinerary');
 const far={latitude:52.525,longitude:13.369};let calls=0;
 const out=await plan(env,{...options,to:far},{...opts,fetchImpl:async()=>{calls++;return Response.json(payload([itinerary('LONG_DISTANCE',from,far)]));}});
 assert.equal(calls,1);assert.equal(out.status,'ok');
});
test('HTTP errors, redirects, oversized bodies, malformed JSON and exceptions are bounded without leaking credentials',async()=>{
 for(const [response,status] of [[()=>new Response(null,{status:302,headers:{location:'https://other.example/'}}),'provider_http_error'],
  [()=>new Response(null,{status:403}),'access_denied'],[()=>new Response(null,{status:429}),'quota_exceeded'],
  [()=>new Response('{}',{headers:{'content-length':'3000000'}}),'response_too_large'],[()=>new Response('not json'),'invalid_response'],
  [()=>Response.json({direct:[itinerary()]}),'invalid_response']]){
  const out=await plan(env,options,{...opts,fetchImpl:async()=>response()});assert.equal(out.status,status);assert.deepEqual(out.journeys,[]);
 }
 const out=await plan(env,options,{...opts,fetchImpl:async()=>{throw Error(env.GERMANY_MOTIS_API_TOKEN);}});
 assert.equal(out.status,'network_error');assert.ok(!JSON.stringify(out).includes(env.GERMANY_MOTIS_API_TOKEN));
});
