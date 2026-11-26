import assert from 'node:assert/strict';
import {test} from 'node:test';
import {tflLegStopCount} from './transit_stop_counts.mjs';
import {discoverMixedFlightCandidates} from './mixed_serpapi_discovery.mjs';
import {searchSerpApiFreeFlights} from './serpapi_flight_pilot.mjs';
import {searchMixedIndicativeOptions} from './mixed_indicative_search.mjs';
const env={SERPAPI_FLIGHTS_PILOT_ENABLED:'true',SERPAPI_FLIGHTS_TERMS_REVIEWED:'true',SERPAPI_API_KEY:'synthetic-key'};
const origin={latitude:51.48,longitude:0.3},destination={latitude:47.05,longitude:21.93};
const candidate={legs:[{mode:'flight',from:'AAA',to:'HHH',startLocal:'2026-11-28 06:00',endLocal:'2026-11-28 08:00'}]};
const airports=(codes,country)=>({status:'candidates_only',airports:codes.map((iata,i)=>({iata,name:'Synthetic '+iata,latitude:47+i/100,longitude:21,country_code:country}))});
const options={origin,destination,departureAt:'2026-11-28T03:59:00Z'};

test('TfL counts across different ID fields without assuming stop list semantics',()=>{
 const raw={mode:{name:'tube'},departurePoint:{naptanId:'N-A',icsId:'A'},arrivalPoint:{naptanId:'N-C',icsId:'C'},
  path:{stopPoints:[{id:'A'},{id:'B'},{id:'C'}]}};
 assert.equal(tflLegStopCount(raw),2);
 raw.path.stopPoints=[{id:'B'},{id:'C'}];assert.equal(tflLegStopCount(raw),null,'No guessed missing boarding stop');
 raw.path.stopPoints=[{id:'A'},{id:'B'},{id:'C'},{id:'C'}];assert.equal(tflLegStopCount(raw),null,'Ambiguous repeated alighting stop');
});

test('an empty Google Flights response is not an authentication/provider failure',async()=>{
 let calls=0;
 const result=await searchSerpApiFreeFlights(env,{departureAirports:['AAA'],arrivalAirports:['BBB'],outboundDate:'2026-11-28',userInitiated:true},{fetcher:async url=>{
  calls++;return Response.json(new URL(url).pathname==='/account.json'?{plan_monthly_price:0,plan_searches_left:10}:{error:"Google Flights hasn't returned any results for this query."});
 }});
 assert.equal(calls,2);assert.equal(result.status,'candidate_results_only');assert.deepEqual(result.candidates,[]);
});

test('nearby destination airports beyond first six are checked even with a border gateway',async()=>{
 const checked=[];
 const result=await discoverMixedFlightCandidates(env,{...options,maxProviderQueries:2,
  discover:async(e,p)=>p===origin?airports(['AAA','BBB'],'GB'):{...airports(['CCC','DDD','EEE','FFF','GGG','III','HHH'],'RO'),airports:airports(['CCC','DDD','EEE','FFF','GGG','III','HHH'],'RO').airports.map((a,i)=>({...a,country_code:i===1?'HU':'RO'}))},
  search:async(e,q)=>{checked.push(q);return {status:'candidate_results_only',candidates:q.arrivalAirports.includes('HHH')?[candidate]:[]};}
 });
 assert.equal(checked.length,2);assert.deepEqual(checked[1].arrivalAirports,['HHH']);assert.equal(result.candidates.length,1);
 assert.equal(result.airportCandidates.destination.length,7);assert.equal(result.providerSearchCount,2);
});

test('deadline preserves early flights, aborts pending search and prevents later queries',async()=>{
 let calls=0,aborted=false;
 const result=await discoverMixedFlightCandidates(env,{...options,budgetMs:60,maxProviderQueries:9,
  discover:async(e,p)=>p===origin?airports(['AAA','BBB'],'GB'):airports(['CCC','HHH'],'RO'),
  search:async(e,q)=>{
   calls++;if(calls===1)return {status:'candidate_results_only',candidates:[candidate]};
   return new Promise(resolve=>q.signal.addEventListener('abort',()=>{aborted=true;resolve({status:'search_timeout',candidates:[]});},{once:true}));
  }
 });
 assert.equal(result.candidates.length,1);assert.equal(result.searchIncomplete,true);assert.equal(result.terminationStatus,'search_timeout');
 assert.equal(calls,2);assert.equal(aborted,true);
 await new Promise(r=>setTimeout(r,25));assert.equal(calls,2,'No detached provider searches after response');
});

test('quota refusal never triggers nearby-airport paid fallback',async()=>{
 let calls=0;
 const r=await discoverMixedFlightCandidates(env,{...options,discover:async(e,p)=>p===origin?airports(['AAA','BBB'],'GB'):airports(['CCC','DDD'],'RO'),
  search:async()=>{calls++;return {status:'free_quota_not_confirmed',candidates:[]};}});
 assert.equal(calls,1);assert.equal(r.status,'free_quota_not_confirmed');assert.equal(r.searchIncomplete,true);
});

test('aborted free-flight operation never issues quota or search requests',async()=>{
 const controller=new AbortController();controller.abort();
 const r=await searchSerpApiFreeFlights(env,{departureAirports:['AAA'],arrivalAirports:['BBB'],outboundDate:'2026-11-28',userInitiated:true,signal:controller.signal},{fetcher:()=>assert.fail('No network after cancellation')});
 assert.equal(r.status,'search_timeout');
});

test('mixed response keeps nearby airports and partial flights when ground enrichment fails',async()=>{
 const r=await searchMixedIndicativeOptions({}, {...options,international:true},{
  discoverAir:async()=>({status:'candidate_results_only',candidates:[candidate],airportCandidates:{origin:[{iata:'AAA'}],destination:[{iata:'HHH'}]},searchIncomplete:true,terminationStatus:'search_timeout'}),
  discoverGround:async()=>({status:'provider_unavailable',operators:[]}),prepare:async()=>{throw Error('ground failed');}
 });
 assert.equal(r.flight_candidates.length,1);assert.equal(r.flight_airport_candidates.destination[0].iata,'HHH');
 assert.equal(r.flight_search_incomplete,true);assert.equal(r.flight_search_termination,'search_timeout');
});
