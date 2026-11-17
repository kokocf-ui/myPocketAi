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
console.log('PASS: progressive earliest-day flight discovery, deduplication, optional date and opt-in');
