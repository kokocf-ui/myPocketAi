import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compactJourney} from './mixed_flight_ground_connections.mjs';

const walk=compactJourney({time_zone:'Europe/London',durationMinutes:90,
 legs:[{mode:'walking',from:'Mill Lane',to:'Grays station',
  departurePoint:{lat:51.48,lon:0.30},arrivalPoint:{lat:51.48,lon:0.31},
  departureTime:'2026-11-20T03:00:00Z',arrivalTime:'2026-11-20T03:08:00Z',
  durationMinutes:8,distanceMeters:620},
 {mode:'train',from:'Grays station',to:'London Luton Airport',
  departurePoint:{lat:51.48,lon:0.31},
  arrivalPoint:{lat:51.875,lon:-0.368},
  durationMinutes:45,distanceMeters:null,lineNames:['c2c'],
  operator:'c2c',towards:'London'}]});
assert.equal(walk.timeZone,'Europe/London');
assert.equal(walk.legs[0].durationMinutes,8);
assert.equal(walk.legs[0].distanceMeters,620);
assert.equal(walk.legs[0].departureZone,'Europe/London');
assert.equal(walk.legs[1].distanceMeters,null);
assert.equal(walk.legs[1].lineNames[0],'c2c');
assert.equal(walk.legs[1].towards,'London');
assert.equal(compactJourney({legs:[{mode:'walking',distanceMeters:-10}]}).legs[0].distanceMeters,null);

const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const start=frontend.indexOf('function resolveMixedFlightGroundOptions(');
const end=frontend.indexOf('function mixedOperatorWebsite(',start);
assert.ok(start>0&&end>start,'Selected-flight resolver is present');
const snippet=frontend.slice(start,end);
assert.ok(snippet.includes('mixed-door-to-door-stage'),'One ordered timeline replaces a flight-only view');
assert.ok(snippet.includes('distanceMeters'),'Walking distances must reach the user');
assert.ok(snippet.includes('leg.departureZone||journey.timeZone'),'Use the leg local timezone');
assert.ok(!snippet.includes('openRouteMap('),'A journey explanation must not activate navigation');

class Element {
 constructor(tag){this.tag=tag;this.children=[];this.className='';this.textContent='';
  this.style={};this.isConnected=true;
  this.classList={add:(name)=>{this.className+=' '+name}};
 }
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=[...nodes]}
 setAttribute(){}
}
const document={createElement:tag=>new Element(tag)};
const state={language:'ro',lastTransitChoice:{}};
let requests=0;
const forbiddenFetch=async()=>{requests++;throw Error('Selection must not make a request')};
const mkName=name=>{const a=new Element('a');a.textContent=name;return a};
const resolve=new Function('document','state','fetch','dialogText',
 'mixedOperatorName','transitModeName','appendTransportTicketAction',snippet+';return resolveMixedFlightGroundOptions;')(
 document,state,forbiddenFetch,(ro,en)=>ro,mkName,x=>x,()=>{});
const source={label:'Mill Lane, Grays',latitude:51.48,longitude:0.30};
const target={label:'Strada Nufărului 1, Oradea',latitude:47.06,longitude:21.95};
const choice={journeyOrigin:source,transitDestination:target,
 transitDepartureAt:'2026-11-20T02:00:00.000Z'};
const flight={legs:[{from:'LTN',to:'DEB',startLocal:'2026-11-20 06:05',
 endLocal:'2026-11-20 09:45'}]};
const host=new Element('div');
const responsePayload={
 completeDoorToDoor:true,
 airportFrom:{name:'London Luton Airport',latitude:51.875,longitude:-0.368},
 airportTo:{name:'Debrecen Airport',latitude:47.48,longitude:21.61},
 originLabel:source.label,destinationLabel:target.label,
 flight:{from:'LTN',to:'DEB',airline:'Wizz Air',flightNumber:'W6 001',
  departureLocal:'2026-11-20 06:05',arrivalLocal:'2026-11-20 09:45'},
 accessJourney:walk,
 egressJourney:{timeZone:'Europe/Budapest',legs:[
  {mode:'bus',from:'Debrecen Airport',to:'Debrecen station',
   departurePoint:{lat:47.48,lon:21.61},arrivalPoint:{lat:47.50,lon:21.64},
   departureTime:'2026-11-20T10:15:00Z',arrivalTime:'2026-11-20T10:45:00Z',
   durationMinutes:30,lineNames:['Airport bus']},
  {mode:'walking',from:'Oradea station',to:target.label,
   departurePoint:{lat:47.06,lon:21.94},arrivalPoint:{lat:47.06,lon:21.95},
   durationMinutes:7,distanceMeters:500}
 ]}
};
flight.itinerary=responsePayload;
resolve(choice,flight,host);
const stages=host.children.filter(e=>e.className.includes('mixed-door-to-door-stage'));
assert.equal(stages.length,6,'Access walk, rail, flight, onward bus, transfer warning, final walk');
assert.ok(stages.some(e=>e.className.includes('mixed-stage-walk')&&
 e.children.some(c=>String(c.textContent).includes('620 m'))),
 'First walking distance must appear on the next screen');
assert.ok(stages.some(e=>e.className.includes('mixed-stage-walk')&&
 e.children.some(c=>String(c.textContent).includes('500 m'))),
 'Last walking distance must appear on the next screen');
assert.ok(stages.some(e=>e.className.includes('mixed-stage-flight')),
 'Flight must appear between ground legs');
assert.ok(!stages.some(e=>e.children.some(c=>String(c.textContent).includes('UTC'))),
 'Known local time zones should not be displayed as UTC');
assert.equal(requests,0,'Selection does not request itinerary or refresh provider');
const lostOrigin={...responsePayload,completeDoorToDoor:false,
 accessJourney:{...walk,legs:[{...walk.legs[0],
  departurePoint:{lat:52.1,lon:1.2}},walk.legs[1]]}};
flight.itinerary=lostOrigin;
resolve(choice,flight,host);
assert.ok(host.children.some(e=>e.className.includes('mixed-stage-gap')&&
 e.children.some(c=>String(c.textContent).includes('Mill Lane'))),
 'A public-transport route starting away from home MUST show an access gap');
assert.equal(requests,0,'Missing local access must not start a second search');

flight.itinerary={...responsePayload,completeDoorToDoor:false,
 accessJourney:null,egressJourney:null};
resolve(choice,flight,host);
const gaps=host.children.filter(e=>e.className.includes('mixed-stage-gap'));
assert.equal(gaps.length,2,'Unverified first and last mile must be shown, never hidden');
console.log('PASS selected mixed journey: walk metres/minutes, timezone, flight, gaps, no navigation');
