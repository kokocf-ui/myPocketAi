import assert from 'node:assert/strict';
import {composeVerifiedMixedItineraries,minimumMixedTransferMinutes,normalizeVerifiedMixedLeg}
  from './verified_multimodal_itineraries.mjs';

const t=(minutes)=>new Date(Date.parse('2026-12-04T06:00:00Z')+minutes*60000).toISOString();
const place=id=>({id,label:id});
const leg=(from,to,mode,start,end,extra={})=>({
  from:place(from),to:place(to),mode,departureTime:t(start),arrivalTime:t(end),
  provider:'verified-supplier',verified:true, ...extra
});
const search={origin:place('actual-door-A'),destination:place('actual-door-B'),
 departureAt:t(0),maxResults:8};
const itinerary=(
 // Generic names, not a hardcoded destination, airport or timetable.
 [
  leg('actual-door-A','station-A','walking',0,20),
  leg('station-A','station-B','coach',40,500,{fareLocal:{amount:30,currency:'GBP'},fareVerified:true}),
  leg('station-B','actual-door-B','walking',520,530),
  leg('actual-door-A','rail-A','walking',0,10),
  leg('rail-A','rail-B','train',30,300,{fareLocal:{amount:60,currency:'GBP'},fareVerified:true}),
  leg('rail-B','actual-door-B','walking',310,340),
  leg('station-A','airport-A','bus',40,75,{fareLocal:{amount:4,currency:'GBP'},fareVerified:true}),
  leg('airport-A','airport-near-destination','flight',190,250,{fareLocal:{amount:45,currency:'GBP'},fareVerified:true}),
  leg('airport-near-destination','station-near-B','coach',305,355,{fareLocal:{amount:12,currency:'GBP'},fareVerified:true}),
  leg('station-near-B','actual-door-B','walking',360,375)
 ]);
const result=composeVerifiedMixedItineraries({...search,legs:itinerary});
assert.equal(result.status,'verified');
assert.equal(result.journeys.length,3);
assert.deepEqual(result.journeys.map(j=>j.modeSignature),[
 'bus → flight → coach','train','coach'
].sort((a,b)=>{
  const times={'bus → flight → coach':375,train:340,coach:530};
  return times[a]-times[b];
}));
assert.deepEqual(result.journeys.map(x=>x.arrivalDateTime),[t(340),t(375),t(530)]);
assert.ok(result.journeys.every(x=>x.finalTransferVerified&&x.legs.at(-1).to==='actual-door-B'));
assert.equal(result.journeys.find(x=>x.modes.includes('flight')).fareLocal.amount,61);
assert.equal(result.journeys.find(x=>x.modeSignature==='train').fareLocal.amount,60);
assert.equal(result.journeys.find(x=>x.modeSignature==='coach').fareLocal.amount,30);
const onlyTrain=composeVerifiedMixedItineraries({...search,legs:itinerary,modes:['train']});
assert.equal(onlyTrain.journeys.length,1);
assert.equal(onlyTrain.journeys[0].modeSignature,'train');
const onlyCoach=composeVerifiedMixedItineraries({...search,legs:itinerary,modes:['coach']});
assert.equal(onlyCoach.journeys.length,1);
assert.equal(onlyCoach.journeys[0].modeSignature,'coach');
const onlyFlight=composeVerifiedMixedItineraries({...search,legs:itinerary,modes:['flight']});
assert.equal(onlyFlight.status,'no_complete_verified_itinerary',
  'flight-only is not a door-to-door route when no final-mile ground connection exists');

// Missing verified final-mile transfer is never replaced by an imaginary bus,
// a straight-line distance, or arrival at a nearby airport.
const withoutFinalMile=itinerary.filter(l=>l.from.id!=='station-near-B'&&
  l.from.id!=='rail-B'&&l.from.id!=='station-B');
assert.equal(composeVerifiedMixedItineraries({...search,legs:withoutFinalMile}).journeys.length,0);

// Tight flight change must be rejected; same-day airport-to-coach transfer
// requires time for arrival procedures; later coach is acceptable.
const land=leg('landing-airport','door','coach',290,340);
const inbound=leg('start','landing-airport','flight',180,260);
assert.equal(composeVerifiedMixedItineraries({
 origin:place('start'),destination:place('door'),departureAt:t(0),
 legs:[inbound,land]
}).journeys.length,0);
assert.equal(composeVerifiedMixedItineraries({
 origin:place('start'),destination:place('door'),departureAt:t(0),
 legs:[inbound,{...land,departureTime:t(320),arrivalTime:t(370)}]
}).journeys.length,1);

assert.ok(minimumMixedTransferMinutes({mode:'walking'},{mode:'flight'})>=90);
assert.ok(minimumMixedTransferMinutes({mode:'flight'},{mode:'coach'})>=30);
assert.equal(normalizeVerifiedMixedLeg({...inbound,verified:false}),null);
assert.equal(normalizeVerifiedMixedLeg({...inbound,cancelled:true}),null);
assert.equal(normalizeVerifiedMixedLeg({...inbound,arrivalTime:t(30)}),null);
assert.equal(normalizeVerifiedMixedLeg({...inbound,departureTime:'2026-12-04T06:00:00'}),null);
assert.equal(normalizeVerifiedMixedLeg({...inbound,from:place('missing'),to:place('missing')}),null);
assert.equal(normalizeVerifiedMixedLeg({...inbound,fareLocal:{amount:55,currency:'EUR'}}).fareLocal,null);
assert.equal(normalizeVerifiedMixedLeg({...inbound,fareLocal:{amount:55,currency:'EUR'},fareVerified:true}).fareLocal.amount,55);

// Fully quoted fares can be combined ONLY when each purchased leg is priced;
// never compare a partially known train+flight cost as a cheap whole route.
const unpriced=itinerary.map(l=>l.mode==='flight'?{...l,fareVerified:false}:l);
const partial=composeVerifiedMixedItineraries({...search,legs:unpriced}).journeys.find(j=>j.modes.includes('flight'));
assert.equal(partial.fareComplete,false);
assert.equal(partial.fareLocal,null);

// No fake cross-station transfer: a departure from a different terminal ID
// is not reachable, even when the display names look similar.
assert.equal(composeVerifiedMixedItineraries({
 origin:place('start'),destination:place('door'),departureAt:t(0),
 legs:[leg('start','airport-hub-1','coach',10,50),
  leg('airport-hub-2','door','flight',200,260)]
}).journeys.length,0);

// No pre-set geography: arbitrary new stop IDs create a valid chain.
const dynamic=composeVerifiedMixedItineraries({
 origin:place('X'),destination:place('Y'),departureAt:t(0),
 legs:[leg('X','some-stop-found-today','rail',10,50),
       leg('some-stop-found-today','Y','bus',70,100)]
});
assert.equal(dynamic.journeys[0].modeSignature,'train → bus');
assert.equal(composeVerifiedMixedItineraries({...search,legs:itinerary,departureAt:'not-a-date'}).status,'invalid_request');
console.log('PASS verified multimodal discovery: alternatives, chronology, prices, no invented transfers, no hardcoded geography');
