import assert from 'node:assert/strict';
import {searchMixedRouteProviders} from './mixed_route_provider_search.mjs';

// All entries below are synthetic providers, dates and stops, not live tickets.
// The test proves that the production composer joins independent UK access,
// international surface transport and Romanian local transit without a flight.
const zero=Date.parse('2026-12-08T06:00:00Z');
const at=min=>new Date(zero+min*60000).toISOString();
const a={id:'mock:mill-lane',label:'Mill Lane, Grays',latitude:51.475,longitude:0.325};
const b={id:'mock:london-rail',label:'London railway interchange',latitude:51.532,longitude:-0.122};
const c={id:'mock:oradea-coach',label:'Oradea coach terminal',latitude:47.065,longitude:21.900};
const d={id:'mock:nufarului',label:'Strada Nufărului 1, Oradea',latitude:47.056,longitude:21.956};
const leg=(from,to,mode,departure,arrival,operator)=>({
 from,to,mode,departureTime:at(departure),arrivalTime:at(arrival),
 operator,verified:true,verificationSource:'synthetic integration fixture'
});
const checks=[];
const supplier=(name,from,to,part)=>({
 id:name,licensed:true,enabled:true,
 canServe:(a,b)=>a.id===from.id&&b.id===to.id,
 async searchLegs(query){
  checks.push({provider:name,from:query.from.id,to:query.to.id});
  return {status:'success',legs:[part]};
 }
});
const legs=[
 supplier('TransCAPI',a,b,leg(a,b,'train',10,70,'Mock UK railway')),
 supplier('MOTIS',b,c,leg(b,c,'coach',130,1710,'Mock international coach')),
 supplier('Bilo',c,d,leg(c,d,'bus',1740,1765,'Mock local bus'))
];
const result=await searchMixedRouteProviders({
 origin:a,destination:d,departureAt:at(0),now:zero,
 candidateNodes:[{...b,mixedHubRole:'origin_access'},
  {...c,mixedHubRole:'destination_egress'}],
 sources:legs,maxProviderCalls:8,maxHubs:2,parallelDirect:true
});
assert.equal(result.status,'verified');
assert.equal(result.completeJourneyVerified,true);
assert.equal(result.searchCalls,3);
assert.equal(result.journeys.length,1);
const itinerary=result.journeys[0];
assert.equal(itinerary.modeSignature,'train → coach → bus');
assert.equal(itinerary.legs[0].from,'Mill Lane, Grays');
assert.equal(itinerary.legs.at(-1).to,'Strada Nufărului 1, Oradea');
assert.equal(itinerary.fareComplete,false,'No imaginary total fare without provider figures');
assert.ok(itinerary.legs.every(l=>l.verified===true));
assert.ok(checks.every(c=>c.from!==c.to));
assert.ok(!itinerary.modes.includes('flight'));
console.log('PASS synthetic 3-provider UK train → international coach → RO bus handoff; no flight prerequisite');
