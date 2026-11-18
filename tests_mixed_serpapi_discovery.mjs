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

const alsoDirect={legs:[{from:'STN',to:'CLJ',
 startLocal:'2026-11-20 05:55',endLocal:'2026-11-20 10:45',
 airline:'Example competing direct'}],fareObserved:{amount:72,currency:'GBP'},
 totalFlightDurationMinutes:170};
const returned=[];
const twoFlights=async (_env,query)=>{
 returned.push(query);
 if(query.departureAirports.length>1&&query.stops===1)
  return {status:'candidate_results_only',candidates:[alsoDirect]};
 if(query.departureAirports.length===1&&query.departureAirports[0]==='LTN')
  return {status:'candidate_results_only',candidates:[direct]};
 return {status:'candidate_results_only',candidates:[]};
};
const afterStansted=await discoverMixedFlightCandidates(env,{
 origin:broadOrigin,destination:broadDestination,departureAt:'2026-11-20T00:00:00Z',
 discover:airports,search:twoFlights,maxProviderQueries:9});
assert.ok(returned.some(q=>q.departureAirports[0]==='LTN'&&q.stops===1),
 'A Stansted direct flight must not cancel the later Luton direct scan');
assert.deepEqual(afterStansted.candidates.map(f=>f.legs[0].from),['LTN','STN']);



const nearBorderOrigin={latitude:51.475,longitude:0.325};
const nearBorderDestination={latitude:47.0612,longitude:21.9473};
const airportList=async (_env,location)=>({
 status:'candidates_only',airports:location===nearBorderOrigin?
  ['LCY','STN','LHR','LGW','SEN','LTN','BHX','EMA'].map((iata,index)=>({
   iata,country_code:'GB',distanceMeters:index*10000
  })):
  [{iata:'OMR',country_code:'RO',distanceMeters:6000},
   {iata:'DEB',country_code:'HU',distanceMeters:65000},
   {iata:'CLJ',country_code:'RO',distanceMeters:147000}]
});
const borderRequests=[];
const wizzDirect={legs:[{from:'LTN',to:'DEB',
 startLocal:'2026-11-20 09:15',endLocal:'2026-11-20 12:35',
 airline:'Wizz Air UK',flightNumber:'TEST'}],
 totalFlightDurationMinutes:140,fareObserved:{amount:78,currency:'GBP'}};
const borderSearch=async (_env,query)=>{
 borderRequests.push(query);
 return {status:'candidate_results_only',candidates:
  query.outboundDate==='2026-11-20'&&
  query.departureAirports.length===1&&query.departureAirports[0]==='LTN'&&
  query.arrivalAirports.length===1&&query.arrivalAirports[0]==='DEB'?
  [wizzDirect]:[]};
};
const borderResult=await discoverMixedFlightCandidates(env,{
 origin:nearBorderOrigin,destination:nearBorderDestination,
 departureAt:'2026-11-20T02:00:00.000Z',now:Date.parse('2026-11-18T10:00:00Z'),
 discover:airportList,search:borderSearch,maxProviderQueries:9
});
assert.equal(borderResult.borderAirport,'DEB','Geography discovers neighboring-country airport');
assert.ok(borderRequests.some(q=>
 q.departureAirports.length===1&&q.departureAirports[0]==='LTN'&&
 q.arrivalAirports.length===1&&q.arrivalAirports[0]==='DEB'),
 'A pooled flight search must not suppress independently requested direct regional services');
assert.equal(borderResult.candidates.length,1);
assert.equal(borderResult.candidates[0].legs[0].airline,'Wizz Air UK');
assert.ok(borderRequests.every(q=>q.outboundDate==='2026-11-20'),
 'Selected calendar day is never silently replaced');
assert.ok(borderRequests.length<=9,'Flight coverage must respect the free search budget');
assert.equal(borderResult.datesChecked[0].airportQueries.length,borderRequests.length,
 'Diagnostics show exactly which pairs were checked rather than claiming full coverage');

console.log('PASS: progressive earliest-day flight discovery, deduplication, optional date and opt-in');
