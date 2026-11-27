import assert from 'node:assert/strict';
import {planFixedPointBoardingAccess,selectFixedPointConnection}
 from './mixed_fixed_point_access.mjs';
import {journeyAnchoredToPoints,compactJourney}
 from './mixed_flight_ground_connections.mjs';
const now=Date.parse('2026-11-18T09:00:00Z');
const origin={latitude:51.48,longitude:0.30,label:'Mill Lane, Grays'};
const airport={latitude:51.875,longitude:-0.368,label:'Luton Airport',iata:'LTN'};
const start='2026-11-20T00:00:00.000Z';
const cutoff='2026-11-20T04:35:00.000Z';
const good={startDateTime:'2026-11-20T02:10:00.000Z',
 arrivalDateTime:'2026-11-20T04:10:00.000Z',
 legs:[{mode:'walking',from:'Mill Lane',to:'Grays station',
  departurePoint:{lat:51.48,lon:0.30},arrivalPoint:{lat:51.47,lon:0.32},
  durationMinutes:12,distanceMeters:890},
 {mode:'train',from:'Grays station',to:'Luton Airport',
  departurePoint:{lat:51.47,lon:0.32},arrivalPoint:{lat:51.875,lon:-0.368},
  durationMinutes:108}]};
const tooLate={...good,arrivalDateTime:'2026-11-20T05:10:00.000Z'};
const tooEarly={...good,startDateTime:'2026-11-19T22:10:00.000Z'};
assert.equal(selectFixedPointConnection([tooLate,tooEarly,good],{
 earliestDeparture:start,latestArrival:cutoff}),good);
const searched=[];
const result=await planFixedPointBoardingAccess({},{
 origin,boardingPoint:airport,earliestDeparture:start,latestArrival:cutoff
},{now,planner:async(_env,from,to,limit,options)=>{
 searched.push(options.departureAt);
 assert.deepEqual(from,origin);
 assert.deepEqual(to,airport,'Original POI coordinate is used, not a guessed airport station');
 assert.equal(limit,4);
 return {status:'success',journeys:[good,tooLate]};
}});
assert.equal(result.status,'scheduled_connection_found');
assert.equal(result.journey,good);
assert.deepEqual(searched,[
 '2026-11-20T00:35:00.000Z',
 '2026-11-20T02:35:00.000Z'
],'Do not request the first four services 6 hours ahead of the flight');
assert.equal(journeyAnchoredToPoints(good,origin,airport,{toRadius:1200}),true);
const compact=compactJourney(good);
assert.equal(compact.legs[0].distanceMeters,890);
assert.equal(compact.legs[0].departurePoint.lat,51.48);
assert.equal(compact.legs[1].arrivalPoint.lon,-0.368);
assert.equal(journeyAnchoredToPoints({...good,legs:[{
 ...good.legs[0],departurePoint:{lat:52.1,lon:1.2}
 },good.legs[1]]},origin,airport,{toRadius:1200}),false,
 'A route starting elsewhere is not a confirmed door-to-door connection');
assert.equal(journeyAnchoredToPoints({...good,legs:[{
 ...good.legs[0],departurePoint:null
 },good.legs[1]]},origin,airport,{toRadius:1200}),false,
 'Missing coordinates must never be coerced to [0,0]');
const impossible=await planFixedPointBoardingAccess({},{
 origin,boardingPoint:airport,
 earliestDeparture:'2026-11-20T04:40:00Z',latestArrival:cutoff
},{now,planner:()=>{throw Error('Must not search impossible timeline')}});
assert.equal(impossible.status,'boarding_deadline_infeasible');
console.log('PASS fixed-point access: verified boarding coordinate, usable search windows, gaps and walking data');
// Provider failure or route-only evidence is not proof that the selected
// departure is too late. Preserve the real source diagnostic.
for(const status of ['quota_exceeded','route_only','local_query_budget_exhausted']){
 const missing=await planFixedPointBoardingAccess({},
  {origin,boardingPoint:airport,earliestDeparture:start,latestArrival:cutoff},
  {now,planner:async()=>({status,journeys:[]})});
 assert.equal(missing.status,status);
}
