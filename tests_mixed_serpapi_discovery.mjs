import assert from 'node:assert/strict';
import {discoverMixedFlightCandidates} from './mixed_serpapi_discovery.mjs';

const env={SERPAPI_FLIGHTS_PILOT_ENABLED:'true',SERPAPI_FLIGHTS_TERMS_REVIEWED:'true'};
const origin={latitude:51.5,longitude:0},destination={latitude:47.1,longitude:21.9};
let calls=[];
const discover=async (_env,loc)=>({status:'candidates_only',airports:[
  {iata:loc===origin?'AAA':'BBB'}]});
const flight={legs:[{from:'AAA',to:'BBB',startLocal:'2026-11-18 11:00',
  endLocal:'2026-11-18 14:00',flightNumber:'XY123'}]};
const search=async (_env,params)=>{
  calls.push(params.outboundDate);
  return {status:'candidate_results_only',candidates:params.outboundDate==='2026-11-18'?
    [flight,flight]:[]};
};
let r=await discoverMixedFlightCandidates(env,{origin,destination,
  now:Date.parse('2026-11-17T22:29:00Z'),discover,search});
assert.deepEqual(calls,['2026-11-17','2026-11-18']);
assert.equal(r.candidates.length,1,'duplicated flight only shown once');
assert.equal(r.status,'candidate_results_only');
assert.equal(r.completeDoorToDoor,false);
assert.equal(r.datesChecked.length,2);
calls=[];
r=await discoverMixedFlightCandidates(env,{origin,destination,
  departureAt:'2026-11-19T12:00:00Z',discover,search});
assert.deepEqual(calls,['2026-11-19'],'explicit date is not expanded');
calls=[];
r=await discoverMixedFlightCandidates({}, {origin,destination,discover,search});
assert.equal(r.status,'disabled');assert.equal(calls.length,0);

calls=[];
const broadOrigin={latitude:51.48,longitude:0.31},broadDestination={latitude:47.05,longitude:21.96};
const searchRequests=[];
const airports=async (_env,loc)=>({
 status:'candidates_only',
 airports:(loc===broadOrigin?
  ['LCY','LHR','STN','SEN','LGW','LTN','BHX','EMA']:
  ['OMR','DEB','CLJ','TSR','BUD','SAT']).map(iata=>({iata}))
});
const pooled={legs:[
 {from:'LCY',to:'FRA',startLocal:'2026-11-20 09:50',endLocal:'2026-11-20 12:00'},
 {from:'FRA',to:'MUC',startLocal:'2026-11-20 13:00',endLocal:'2026-11-20 14:00'},
 {from:'MUC',to:'DEB',startLocal:'2026-11-20 15:00',endLocal:'2026-11-20 17:20'}
],fareObserved:{amount:294,currency:'GBP'},totalFlightDurationMinutes:510};
const direct={legs:[
 {from:'LTN',to:'DEB',startLocal:'2026-11-20 06:05',endLocal:'2026-11-20 09:45',airline:'Example direct airline'}
],fareObserved:{amount:85,currency:'GBP'},totalFlightDurationMinutes:160};
const scan=async (_env,params)=>{
 searchRequests.push(params);
 return {status:'candidate_results_only',candidates:
  params.departureAirports.length===1&&params.departureAirports[0]==='LTN'
   ?[direct]:[pooled]};
};
r=await discoverMixedFlightCandidates(env,{origin:broadOrigin,destination:broadDestination,
 departureAt:'2026-11-20T00:00:00Z',discover:airports,search:scan,maxProviderQueries:9});
assert.equal(r.candidates[0].legs.length,1,
 'A direct flight returned by one airport-specific query must outrank 3 connecting flights');
assert.equal(r.candidates[0].legs[0].from,'LTN');
assert.ok(searchRequests.some(x=>x.departureAirports.length===1&&x.departureAirports[0]==='LTN'&&x.stops===1),
 'Do not allow pooled LCY search to hide a London airport later in the geographical shortlist');
assert.ok(searchRequests.length<=9,'Respect the configured free-query budget');
assert.equal(r.completeDoorToDoor,false,'No claim of a complete journey without airport access/egress');

console.log('PASS: progressive earliest-day flight discovery, deduplication, optional date and opt-in');
