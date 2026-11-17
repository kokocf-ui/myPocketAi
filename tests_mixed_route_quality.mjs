import assert from 'node:assert/strict';
import {mixedGreatCircleKm,evaluateMixedJourneyGeography,isPlausibleMixedLegSpeed}
 from './mixed_route_quality.mjs';
import {composeVerifiedMixedItineraries} from './verified_multimodal_itineraries.mjs';
const start=Date.parse('2026-12-05T06:00:00Z');
const at=min=>new Date(start+min*60000).toISOString();
const node=(id,latitude,longitude)=>({id,label:id,...(latitude==null?{}:{latitude,longitude})});
const origin=node('origin',0,0),destination=node('destination',0,15);
const near=node('intermediate-near',2,8),far=node('intermediate-very-far',0,160);
const leg=(from,to,mode,a,b,extra={})=>({
 id:[from.id,to.id,mode,a,b].join(':'),
 from,to,mode,departureTime:at(a),arrivalTime:at(b),
 provider:'licensed-example',verified:true,...extra
});
const alternative=[
 leg(origin,destination,'coach',20,1040),
 leg(origin,destination,'train',30,340),
 leg(origin,near,'train',40,260),
 leg(near,destination,'coach',280,900),
 // Geographic detour on long-haul flights looks chronologically possible,
 // but is many times the necessary geographic corridor.
 leg(origin,far,'flight',120,1250),
 leg(far,destination,'flight',1370,2480)
];
const coarse=evaluateMixedJourneyGeography([alternative[4],alternative[5]],{origin,destination});
assert.equal(coarse.status,'excessive_geographic_detour');
assert.equal(coarse.screened,true);
const good=evaluateMixedJourneyGeography([alternative[2],alternative[3]],{origin,destination});
assert.equal(good.status,'plausible_geography','Moderate, genuine intermediate transfer is allowed');
assert.ok(good.detourFactor>1);
const missing=evaluateMixedJourneyGeography([leg(node('u'),node('v'),'train',20,100)],{
 origin:node('u'),destination:node('v')});
assert.equal(missing.status,'coordinates_incomplete');
assert.equal(missing.screened,false,'Never make up an absent geographic position');
const result=composeVerifiedMixedItineraries({
 origin,destination,departureAt:at(0),legs:alternative,maxResults:8
});
assert.equal(result.status,'verified');
assert.deepEqual(result.journeys.map(x=>x.modeSignature),['train','train → coach','coach']);
assert.ok(result.journeys.every(x=>x.geography.status==='plausible_geography'));
assert.equal(result.rejectedGeographicDetours,1);
assert.ok(result.journeys.every(x=>x.finalTransferVerified));
assert.equal(result.journeys[0].arrivalDateTime,at(340));
assert.ok(mixedGreatCircleKm(origin,destination)>1600);
assert.equal(isPlausibleMixedLegSpeed(leg(node('p',0,0),node('q',0,5),'walking',0,10)),false,
 'A provider mapping walking 550km in 10 minutes must be discarded');
assert.equal(isPlausibleMixedLegSpeed(leg(node('p',0,0),node('q',0,.005),'walking',0,10)),true);
const impossible=composeVerifiedMixedItineraries({origin,destination,departureAt:at(0),
 legs:[leg(origin,destination,'coach',5,35)]});
assert.equal(impossible.status,'no_complete_verified_itinerary',
 'A 1600km coach journey in 30 minutes is not feasible');

// Inbound flight -> verified walking connection -> coach, but walking must NOT
// reset the airport exit buffer, otherwise a short fake transfer slips in.
const flightStart=node('flight-source',0,0),hub=node('airport-hub',0,5);
const terminal=node('coach-terminal',0,5.005),home=node('home',0,5.1);
const air=leg(flightStart,hub,'flight',120,220);
const walk=leg(hub,terminal,'walking',240,251);
const early=leg(terminal,home,'coach',255,300);
const later=leg(terminal,home,'coach',270,325);
const tooFast=composeVerifiedMixedItineraries({
 origin:flightStart,destination:home,departureAt:at(0),legs:[air,walk,early]
});
assert.equal(tooFast.journeys.length,0,'Coach before airline exit buffer must be rejected');
const possible=composeVerifiedMixedItineraries({
 origin:flightStart,destination:home,departureAt:at(0),legs:[air,walk,later]
});
assert.equal(possible.journeys.length,1,'Later connection is physically feasible');
assert.equal(possible.journeys[0].modeSignature,'flight → coach');

// Earliest-arrival exploration must not hit its cap while enumerating slower
// alternatives of the first mode and miss a later-indexed fast flight.
const huge=[];
const o=node('O'),d=node('D');
for(let n=0;n<2100;n++){
 const waypoint=node('w'+n);
 huge.push(leg(o,waypoint,'coach',0,12));
 huge.push(leg(waypoint,d,'coach',25,530+n%8));
}
huge.push(leg(o,d,'flight',140,310));
const ranked=composeVerifiedMixedItineraries({
 origin:o,destination:d,departureAt:at(0),legs:huge,maxResults:3
});
assert.equal(ranked.journeys[0].modeSignature,'flight');
assert.equal(ranked.journeys[0].arrivalDateTime,at(310));
assert.ok(ranked.journeys.some(x=>x.modeSignature==='coach → coach'));
assert.equal(ranked.status,'verified');

const conflicting=evaluateMixedJourneyGeography([
 leg(origin,near,'train',15,250),
 leg(node(near.id,20,8),destination,'train',280,640)
],{origin,destination});
assert.equal(conflicting.status,'conflicting_stop_locations');
console.log('PASS geography: no globe-spanning detours, buffer through walking, physics, fastest search and no invented coordinates');
