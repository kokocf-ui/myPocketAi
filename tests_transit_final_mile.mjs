import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const extract=(from,to)=>{
 const start=frontend.indexOf(from),end=frontend.indexOf(to,start);
 assert.ok(start>=0&&end>start,from+' must be present');
 return frontend.slice(start,end);
};
const pointsSource=extract('function finalTransitWalkPoints(journey){','\nasync function showFinalTransitWalk(');
const state={lastTransitResponse:{transit_destination_point:{
 latitude:53.474,longitude:-2.184,label:'Vale Lane, Manchester'
}}};
const finalWalk=new Function('state',pointsSource+'\nreturn finalTransitWalkPoints;')(state);
const journey={legs:[
 {mode:'national-rail',to:'Ashburys',arrivalLatLon:{lat:53.47,lon:-2.18}},
 {mode:'walking',from:'Ashburys',to:'Destination',durationMinutes:10}
]};
const result=finalWalk(journey);
assert.ok(result,'Last-mile coordinate pair should be usable');
assert.equal(result.origin.label,'Ashburys');
assert.equal(result.destination.label,'Vale Lane, Manchester');
assert.ok(result.meters>30&&result.meters<2500);
assert.equal(finalWalk({legs:[{mode:'national-rail',to:'Ashburys'},{mode:'walking',to:'Destination'}]}),null,
 'Never guess the last station location');
assert.equal(finalWalk({legs:[{mode:'national-rail',to:'Ashburys',arrivalLatLon:{lat:53.20,lon:-2.50}}]}),null,
 'Never turn distant points into an unverified last-mile walk');

const finalAction=extract('function appendFinalTransitWalkAction(host,journey){','\n// Transit results can outlive');
assert.ok(finalAction.includes("lastLeg=journey?.legs?.at(-1)"),
 'Only a last walking leg should trigger final-mile directions');
assert.ok(finalAction.includes('note.setAttribute('),
 'A missing coordinate pair must show an explanatory notice, not a missing button');
assert.ok(finalAction.includes("showFinalTransitWalk(journey,button)"),
 'Button must launch actual walking directions');

const selected=extract('function renderTransitChoices(options,selectedIndex=null){','\nasync function selectTransitJourney(');
const actionPos=selected.indexOf('appendFinalTransitWalkAction(body,journey)');
const legsPos=selected.indexOf('appendTransitLegs(body,journey)');
assert.ok(actionPos>=0&&legsPos>actionPos,'Final-mile navigation must appear BEFORE the long steps table');

const walk=extract('async function showFinalTransitWalk(journey,button){','\nfunction appendFinalTransitWalkAction(');
assert.ok(walk.includes('route_context:{profile:\'walk\''),
 'Last-mile routing needs a walking request');
assert.ok(walk.includes('origin:pair.origin,pending:null'),
 'Use verified alighting stop coordinates rather than current GPS');
assert.ok(walk.includes('destination:pair.destination'),
 'Send the selected destination address to the route planner');
assert.ok(walk.includes('state.selectedTransitJourney.finalWalkRoute=data.route'),
 'Retain navigation context for the Back button');

const returnAction=extract('function transitOptionsForRoute(route){','\nfunction appendTransitReturnAction(');
assert.ok(returnAction.includes('selected?.finalWalkRoute===route'),
 'Back from final-mile map should return to transit alternatives');

console.log('PASS final-mile navigation: validated station/address points, visible CTA, safe missing-coordinates message, and return to choices');
