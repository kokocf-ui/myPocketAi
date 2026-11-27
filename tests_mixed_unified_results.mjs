import {transportTicketUrl} from './transport_ticket_links.mjs';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const start=frontend.indexOf('function renderMixedUnifiedResults(');
const end=frontend.indexOf('function renderTransitChoices(',start);
assert.ok(start>0&&end>start,'One unified result view exists');
const snippet=frontend.slice(start,end);
assert.ok(snippet.includes('appendMixedGroundOperatorCards(host,providers,choice)'));
assert.ok(snippet.includes('appendMixedAirCandidateCards(host,flights,choice)'));
assert.ok(!snippet.includes('moduleStatus('),'No separate flight-only window');
assert.ok(!snippet.includes('Actualizează legăturile terestre'),
 'Selecting a flight must not offer a search trigger');
assert.ok(!snippet.includes('/api/mixed-flight-connections'),
 'No network lookup in the selected-card handler');

class Element{
 constructor(tag){this.tag=tag;this.children=[];this.style={};this.textContent='';this.className='';
  this.classList={add(){},remove(){}};this.attrs={};
 }
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=[...nodes]}
 setAttribute(name,value){this.attrs[name]=value}
 addEventListener(type,handler){this.events??={};this.events[type]=handler}
}
const document={createElement:tag=>new Element(tag)};
const body=new Element('main'),layer=new Element('div');
const $=id=>({moduleLayerBody:body,moduleQuickLayer:layer})[id];
const state={language:'ro',lastTransitChoice:{mixedJourney:true},lastTransitResponse:null};
let shown=0,selectedFlights=0;
const resolver=(choice,flight,host)=>{
 selectedFlights++;
 assert.equal(flight.itinerary?.flight?.from,'STN');
 assert.equal(choice.mixedJourney,true);
 host.textContent='Itinerariu pregătit în căutarea inițială';
};
const run=new Function('document','state','$','renderTransitChoices','showTransitRetrySelector',
 'clearTransitOptionsViewport','dialogText','mixedFarePresentation','mixedOperatorName','resolveMixedFlightGroundOptions','transportTicketUrl',
 snippet+'\nreturn {renderMixedUnifiedResults};');
const api=run(document,state,$,()=>{shown++;body.replaceChildren();},()=>{},()=>{},
 (ro,en)=>ro,item=>item.fareFrom?'De la '+item.fareFrom.amount+' '+item.fareFrom.currency:
 item.fareObserved?'Tarif orientativ: '+item.fareObserved.amount+' '+item.fareObserved.currency:'',
 name=>{const el=new Element('a');el.textContent=name;return el},resolver,transportTicketUrl);
const data={
 transit:[],
 operator_options:[{operator:'FlixBus',mode:'coach',from:'London',to:'Oradea',
  url:'https://www.flixbus.co.uk/bus-routes/london-oradea',
  fareFrom:{amount:92.97,currency:'GBP'},schedule_status:'unavailable'}],
 flight_candidates:[{legs:[{from:'STN',to:'CLJ',startLocal:'2026-11-20 06:15',
  endLocal:'2026-11-20 10:55',airline:'Test airline'}],
  fareObserved:{amount:75,currency:'GBP'},
  itinerary:{flight:{from:'STN',to:'CLJ'},accessJourney:null,egressJourney:null,
   completeDoorToDoor:false}}]
};
const choice={kind:'transit',mixedJourney:true,journeyOrigin:{label:'My home'},
 transitDestination:{label:'Final address'}};
api.renderMixedUnifiedResults(data,choice);
assert.equal(shown,1);
assert.equal(body.children.filter(e=>e.className.includes('mixed-unified-section-title')).length,2);
let cards=body.children.filter(e=>e.className.includes('mixed-unverified-candidate'));
assert.equal(cards.length,2);
assert.equal(cards[0].children[1].textContent,'🚌');
assert.equal(cards[1].children[1].textContent,'✈️');

cards[0].onclick();
assert.equal(body.children[0].className,'quick-navigation-toolbar transit-detail-toolbar','Back stays pinned inside results and supports native Back');
assert.equal(body.children[0].children[0].tag,'button');
const link=body.children.find(e=>e.tag==='a');
assert.equal(link?.href,'https://www.flixbus.co.uk/bus-routes/london-oradea');
assert.equal(link?.textContent,'Bilete și rezervare · FlixBus');
assert.ok(body.children.some(e=>e.className==='mixed-unverified-access-leg'));
assert.ok(body.children.some(e=>e.className==='mixed-unverified-egress-leg'));
body.children[0].children[0].onclick();
assert.equal(shown,2);
cards=body.children.filter(e=>e.className.includes('mixed-unverified-candidate'));
cards[1].onclick();
assert.equal(selectedFlights,1,'Tap opens PRECOMPUTED itinerary directly');
assert.ok(body.children.some(e=>e.className==='mixed-selected-itinerary'));
assert.ok(!body.children.some(e=>e.textContent==='Actualizează legăturile terestre'));

const combined={...data,ground_connections:[{
 id:'ground-connection:0',from:'London',to:'Oradea',transferCity:'Brussels',
 segments:[{mode:'train',from:'London',to:'Brussels',operator:'Eurostar',
  url:'https://www.eurostar.com/uk-en/train/london-to-brussels'},
  {mode:'coach',from:'Brussels',to:'Oradea',operator:'FlixBus',
  url:'https://www.flixbus.com/bus-routes/brussels-oradea'}],
 timetable_verified:false,door_to_door_complete:false
}]};
api.renderMixedUnifiedResults(combined,choice);
cards=body.children.filter(e=>e.className.includes('mixed-unverified-candidate'));
assert.equal(cards.length,3);
assert.equal(cards[0].children[1].textContent,'🚆 → 🚌');
cards[0].onclick();
const sources=body.children.filter(e=>e.tag==='section'&&e.children.some(c=>c.tag==='a'));
assert.equal(sources.length,2,'Both operator links remain available');
assert.equal(sources[0].children[1].href,'https://www.eurostar.com/uk-en/train/london-to-brussels');
assert.equal(sources[1].children[1].href,'https://www.flixbus.com/bus-routes/brussels-oradea');
assert.ok(body.children.some(e=>e.className==='mixed-unverified-access-leg'));
assert.ok(body.children.some(e=>e.className==='mixed-unverified-egress-leg'));
console.log('PASS mixed results: direct flight details, FlixBus evidence, no search trigger');

const scheduled={id:'open-surface:0',completeDoorToDoor:false,accessStatus:'scheduled_connection_found',egressStatus:'no_local_journey_returned',
 source:{attribution:'Fixture Flix GTFS ODbL'},
 legs:[{from:'Victoria',to:'Oradea Intrans',mode:'coach',operator:'Fixture',line:'1926',departureTime:'2026-12-03T08:30:00Z',arrivalTime:'2026-12-04T23:55:00Z',stopCount:1,stops:[{name:'Victoria',arrivalTime:'2026-12-03T08:30:00Z',departureTime:'2026-12-03T08:30:00Z'}]}]};
api.renderMixedUnifiedResults({transit:[],scheduled_surface_options:[scheduled]},choice);
cards=body.children.filter(e=>e.className.includes('mixed-unverified-candidate'));
assert.equal(cards.length,1,'Actual dated surface source survives missing flights and local egress');
assert.ok(!body.children.some(e=>e.className==='mixed-no-routes-note'));
cards[0].onclick();
assert.ok(body.children.some(e=>e.className==='mixed-surface-dated-leg'));
assert.match(body.children.find(e=>e.className==='mixed-surface-local-egress').textContent,/Neconfirmat/);
assert.equal(selectedFlights,1,'Surface selection never starts air enrichment');
console.log('PASS dated surface details: source times/stops retained, missing egress explicit, no airport dependency');
