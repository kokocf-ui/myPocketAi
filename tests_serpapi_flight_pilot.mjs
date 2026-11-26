import assert from 'node:assert/strict';
import {prepareSerpApiFlightSearch,normalizeFlightSearchResults,searchSerpApiFreeFlights}
 from './serpapi_flight_pilot.mjs';
const params={departureAirports:['abc','def','ABC','not-an-iata'],arrivalAirports:['xyz','uvw'],
 outboundDate:'2026-12-06',currency:'GBP',userInitiated:true};
const u=prepareSerpApiFlightSearch(params);
assert.equal(u.searchParams.get('departure_id'),'ABC,DEF');
assert.equal(u.searchParams.get('arrival_id'),'XYZ,UVW');
assert.equal(u.searchParams.get('outbound_date'),'2026-12-06');
assert.equal(u.searchParams.get('type'),'2');
assert.equal(u.searchParams.get('engine'),'google_flights');
assert.equal(prepareSerpApiFlightSearch({...params,stops:1}).searchParams.get('stops'),'1');
assert.equal(prepareSerpApiFlightSearch(params).searchParams.has('stops'),false);
assert.equal(u.hostname,'serpapi.com');
assert.equal(u.searchParams.has('api_key'),false);
assert.equal(prepareSerpApiFlightSearch({...params,departureAirports:[]}),null);
assert.equal(prepareSerpApiFlightSearch({...params,outboundDate:'12/06/2026'}),null);
const payload={best_flights:[{price:57,total_duration:80,flights:[{
 departure_airport:{id:'ABC',time:'2026-12-06 09:15'},
 arrival_airport:{id:'XYZ',time:'2026-12-06 10:35'},airline:'Example',flight_number:'EX 123'}]}],other_flights:[]};
const normalized=normalizeFlightSearchResults(payload,{currency:'GBP',date:params.outboundDate});
assert.equal(normalized.length,1);
assert.equal(normalized[0].legs[0].timezoneVerified,false);
assert.equal(normalized[0].verified,false);
assert.equal(normalized[0].completeDoorToDoor,false);
assert.equal(normalized[0].fareObserved.bookable,false);
assert.equal(normalized[0].fareObserved.amount,57);
assert.equal(normalizeFlightSearchResults(payload,{date:'2026-12-07'}).length,0);
assert.equal(normalizeFlightSearchResults({best_flights:[{
  ...payload.best_flights[0],flights:[{...payload.best_flights[0].flights[0],
  departure_airport:{id:'ABC',time:'2026-12-06T09:15:00Z'}}]}]},
  {date:params.outboundDate}).length,0,'No invented timezone interpretations');
const env={SERPAPI_API_KEY:'free-test-key',SERPAPI_FLIGHTS_PILOT_ENABLED:'true',
 SERPAPI_FLIGHTS_TERMS_REVIEWED:'true'};
let requests=[];
const fetcher=async url=>{
 const u=new URL(url);requests.push(u);
 if(u.pathname==='/account.json')return {ok:true,json:async()=>({plan_monthly_price:0,plan_searches_left:60})};
 if(u.pathname==='/search.json')return {ok:true,json:async()=>payload};
 throw Error('Unexpected network call');
};
assert.equal((await searchSerpApiFreeFlights({},params,{fetcher})).status,'disabled');
assert.equal(requests.length,0);
const queried=await searchSerpApiFreeFlights(env,params,{fetcher});
assert.equal(queried.status,'candidate_results_only');
assert.equal(queried.candidates.length,1);
assert.equal(queried.requiresTimezoneAndTransferVerification,true);
assert.deepEqual(requests.map(x=>x.pathname),['/account.json','/search.json']);
assert.equal(requests[1].searchParams.get('api_key'),'free-test-key');
requests=[];
const quotaFail=async url=>({ok:true,json:async()=>({plan_monthly_price:25,plan_searches_left:100})});
assert.equal((await searchSerpApiFreeFlights(env,params,{fetcher:quotaFail})).status,'free_quota_not_confirmed');
assert.equal(requests.length,0);
const quotaZero=async url=>({ok:true,json:async()=>({plan_monthly_price:0,plan_searches_left:0})});
assert.equal((await searchSerpApiFreeFlights(env,params,{fetcher:quotaZero})).status,'free_quota_not_confirmed');
assert.equal((await searchSerpApiFreeFlights({...env,SERPAPI_FLIGHTS_TERMS_REVIEWED:'false'},params,{fetcher})).status,'disabled');
assert.equal((await searchSerpApiFreeFlights(env,{...params,userInitiated:false},{fetcher})).status,'disabled');
console.log('PASS optional free-flight pilot: multi-airport one-search, quotas, no paid plans, no fabricated UTC/booking');

for(const httpStatus of [200,400]){
 const unsupported=await searchSerpApiFreeFlights(env,params,{fetcher:async input=>{
  const u=new URL(input);
  if(u.pathname==='/account.json')return Response.json({plan_monthly_price:0,plan_searches_left:60});
  return Response.json({error:'Invalid departure_id airport. api_key=free-test-key https://provider.example/path'}, {status:httpStatus});
 }});
 assert.equal(unsupported.status,'invalid_airport_query');
 assert.ok(!unsupported.diagnostic.includes('free-test-key'));
 assert.ok(!unsupported.diagnostic.includes('https://'));
}
