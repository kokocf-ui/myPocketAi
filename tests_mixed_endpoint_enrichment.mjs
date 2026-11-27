// Offline regressions: real connectors, controlled geography/timetables.
import assert from 'node:assert/strict';
import {ONE_FIELD_JOURNEY_SCRIPT} from './one_field_journey_ui.mjs';
import {prepareMixedFlightOptions} from './mixed_prefetched_details.mjs';
import {searchMixedIndicativeOptions} from './mixed_indicative_search.mjs';
const now=Date.parse('2026-11-26T00:00:00Z');
const at=m=>new Date(now+m*60000).toISOString();
const origin={latitude:51.48,longitude:.30,label:'Fixture origin'};
const destination={latitude:47.06,longitude:21.95,label:'Fixture destination'};
const airports=[{iata:'AAA',name:'First airport',latitude:51.875,longitude:-.368},
 {iata:'CCC',name:'Last airport',latitude:47.48,longitude:21.61}];
const flight={legs:[{from:'AAA',to:'BBB',startLocal:'2026-11-27 06:05',endLocal:'2026-11-27 07:00'},
 {from:'BBB',to:'CCC',startLocal:'2026-11-27 07:40',endLocal:'2026-11-27 09:45'}]};
const journey=(a,b,begin,end)=>({startDateTime:at(begin),arrivalDateTime:at(end),legs:[{
 mode:'train',from:a.label||a.name,to:b.label||b.name,departurePoint:a,arrivalPoint:b,
 departureTime:at(begin),arrivalTime:at(end)}]});
let observed=[];
const prepared=await prepareMixedFlightOptions({}, {origin,destination,candidates:[flight],requestedAt:at(1400),
 airportCandidates:{origin:[airports[0]],destination:[airports[1]]}}, {
 now,resolveZone:async()=>({name:'Etc/UTC',offsetSeconds:0}),
 discover:()=>{throw Error('Reuse already resolved airport coordinates')},
 // 8.1 seconds is intentionally beyond the OLD 7.5-second cutoff. The old
 // prefetch also skipped ALL connecting-flight access/egress searches.
 planAccess:async(e,from,to)=>{await new Promise(ok=>setTimeout(ok,8100));return {
  status:'success',journeys:[journey(from,to,1560,1680)]}},
 planEgress:async(e,from,to)=>({status:'success',journeys:[journey(from,to,2080,2200)]}),
 onPrepared:(option,index)=>observed.push([option,index])
});
assert.equal(prepared[0].itinerary.accessJourney?.legs[0].mode,'train','Do not erase slower ordinary ground routing');
assert.equal(prepared[0].itinerary.egressJourney?.legs[0].mode,'train');
assert.equal(prepared[0].itinerary.airportTo.iata,'CCC');
assert.equal(prepared[0].itinerary.completeDoorToDoor,false,'Outer ground legs do not prove the air connection');
assert.equal(observed.length,1,'Publish each completed enrichment before other flight candidates finish');

const stalled={...flight,id:'slow'},events=[];
let cancelled=false;
const partial=await searchMixedIndicativeOptions({}, {origin,destination,international:true,onProgress:e=>events.push(e)}, {
 enrichmentBudgetMs:25,
 discoverAir:async()=>({status:'candidate_results_only',candidates:[flight,stalled]}),
 discoverGround:async()=>({operators:[{operator:'Fixture train'}],sourceErrors:['exa_http_402']}),
 prepare:async(e,args,{onPrepared,signal})=>{
  onPrepared(prepared[0],0);
  signal.addEventListener('abort',()=>{cancelled=true;onPrepared({...stalled,itinerary:{late:true}},1)},{once:true});
  return new Promise(()=>{});
 }
});
assert.equal(cancelled,true,'Deadline aborts actual work, not just a wrapper timer');
assert.equal(partial.flight_candidates[0].itinerary.accessJourney.legs[0].mode,'train','Keep already completed enrichment when another supplier stalls');
assert.equal(partial.flight_candidates[1].itinerary,undefined,'Ignore late preparation after deadline');
assert.equal(partial.flight_details_prepared,false);
assert.equal(partial.operator_options.length,1,'Ground-only alternatives remain independent');
assert.deepEqual(partial.operator_source_errors,['exa_http_402'],'Preserve exact surface source failure rather than false no-routes');
assert.ok(events.some(e=>e.flight_candidates?.[0]?.itinerary?.accessJourney));
console.log('PASS real prefetch: connecting-flight outer ground links, >7.5s local provider, per-option progress, abort retains completed legs, independent surface alternatives/errors');

assert.match(ONE_FIELD_JOURNEY_SCRIPT,/country_code:selected.country_code\|\|''[,]city:String\(selected.city\|\|''\)/,'Preserve structured destination locality for surface discovery');
assert.match(ONE_FIELD_JOURNEY_SCRIPT,/country_code:origin.country_code\|\|''[,]city:String\(origin.city\|\|''\)/,'Preserve origin locality too');
