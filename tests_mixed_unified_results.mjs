import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const start=frontend.indexOf('function renderMixedUnifiedResults(');
const end=frontend.indexOf('function renderTransitChoices(',start);
assert.ok(start>0&&end>start,'One unified result view exists');
const snippet=frontend.slice(start,end);
const dispatch=frontend.indexOf("}else if(choice.kind==='transit'&&choice.mixedJourney===true){renderMixedUnifiedResults(data,choice)}");
assert.ok(dispatch>0,'Mixed requests must enter the same screen before legacy transit branches');
assert.ok(snippet.includes('appendMixedGroundOperatorCards(host,providers,choice)'));
assert.ok(snippet.includes('appendMixedAirCandidateCards(host,flights,choice)'));
assert.ok(!snippet.includes('moduleStatus('),'No old flight-only status window');
class Element {
 constructor(tag){this.tag=tag;this.children=[];this.style={};this.textContent='';this.className='';
  this.classList={add(){},remove(){}};this.attrs={};
 }
 append(...els){this.children.push(...els)}
 replaceChildren(...els){this.children=[...els]}
 setAttribute(k,v){this.attrs[k]=v}
 addEventListener(k,listener){this.events??={};this.events[k]=listener}
}
const document={createElement:tag=>new Element(tag)};
const body=new Element('main'),layer=new Element('div');
const $=id=>({moduleLayerBody:body,moduleQuickLayer:layer})[id];
const state={language:'ro',lastTransitChoice:{mixedJourney:true},lastTransitResponse:null};
let shown=0,groundRequested=0;
const run=new Function('document','state','$','renderTransitChoices','showTransitRetrySelector',
 'dialogText','mixedFarePresentation','mixedOperatorName','resolveMixedFlightGroundOptions',
 snippet+'\nreturn {renderMixedUnifiedResults};');
const api=run(document,state,$,()=>{
 shown++;body.replaceChildren();
},()=>{},(ro,en)=>ro,item=>item.fareFrom?
 'De la '+item.fareFrom.amount+' '+item.fareFrom.currency:
 item.fareObserved?'Tarif orientativ: '+item.fareObserved.amount+' '+item.fareObserved.currency:'',
 name=>{const el=new Element('a');el.textContent=name;return el;},()=>{groundRequested++});
const data={
 transit:[],
 operator_options:[{operator:'FlixBus',mode:'coach',from:'London',to:'Oradea',
  url:'https://www.flixbus.co.uk/bus-routes/london-oradea',
  fareFrom:{amount:92.97,currency:'GBP'},schedule_status:'unavailable'}],
 flight_candidates:[{legs:[{from:'STN',to:'CLJ',startLocal:'10:00',endLocal:'13:00',
  airline:'Mock Air'}],fareObserved:{amount:75,currency:'GBP'}}]
};
const choice={kind:'transit',mixedJourney:true};
api.renderMixedUnifiedResults(data,choice);
assert.equal(shown,1);
assert.equal(body.children.filter(e=>e.className.includes('mixed-unified-section-title')).length,2);
const cards=body.children.filter(e=>e.className.includes('mixed-unverified-candidate'));
assert.equal(cards.length,2,'Ground option and flight must coexist in one view');
assert.match(cards[0].children[0].textContent,/London → Oradea/);
assert.equal(cards[0].children[1].textContent,'🚌');
assert.equal(cards[1].children[1].textContent,'✈️');
assert.equal(body.children.some(e=>e.textContent.includes('Alternative aeriene de explorat')),false);
cards[0].onclick();
assert.equal(body.children[0].tag,'button','Back stays in the same results flow');
assert.equal(body.children[1].tag,'h3');
const link=body.children.find(e=>e.tag==='a');
assert.ok(link);
assert.equal(link.href,'https://www.flixbus.co.uk/bus-routes/london-oradea');
assert.equal(link.textContent,'FlixBus');
body.children[0].onclick();
assert.equal(shown,2,'Back restores unified compact results');
assert.equal(body.children.filter(e=>e.className.includes('mixed-unverified-candidate')).length,2);
const flight=body.children.filter(e=>e.className.includes('mixed-unverified-candidate'))[1];
flight.onclick();
const ground=body.children.find(e=>e.textContent==='Actualizează legăturile terestre');
assert.ok(ground?.events?.click,'Flight details must offer a refresh action for ground transfers');
assert.equal(groundRequested,1,'Opening a direct flight automatically checks both ground transfers');
let suppressed=0;
ground.events.click({preventDefault(){suppressed++},stopPropagation(){suppressed++}});
assert.equal(groundRequested,2,'Refresh explicitly repeats the ground connection check');
assert.equal(suppressed,2,'Ground button interaction does not bubble to unrelated route navigation');

const combined={...data,ground_connections:[{
 id:'ground-connection:0',from:'London',to:'Oradea',transferCity:'Brussels',
 segments:[
  {mode:'train',from:'London',to:'Brussels',operator:'Eurostar',
   url:'https://www.eurostar.com/uk-en/train/london-to-brussels'},
  {mode:'coach',from:'Brussels',to:'Oradea',operator:'FlixBus',
   url:'https://www.flixbus.com/bus-routes/brussels-oradea'}
 ],timetable_verified:false,door_to_door_complete:false
}]};
api.renderMixedUnifiedResults(combined,choice);
let multiCards=body.children.filter(e=>e.className.includes('mixed-unverified-candidate'));
assert.equal(multiCards.length,3,'A train+coach choice is a separate option alongside coach and flight');
assert.equal(multiCards[0].children[1].textContent,'🚆 → 🚌');
assert.match(multiCards[0].children[0].textContent,/Brussels/);
multiCards[0].onclick();
const evidence=body.children.filter(e=>e.tag==='section');
assert.equal(evidence.length,2,'A connected option opens both operator legs independently');
assert.equal(evidence[0].children[1].href,'https://www.eurostar.com/uk-en/train/london-to-brussels');
assert.equal(evidence[1].children[1].href,'https://www.flixbus.com/bus-routes/brussels-oradea');
assert.ok(body.children.some(e=>e.className==='mixed-unverified-access-leg'),
 'A supplier page is insufficient to prove transport from the selected origin');
assert.ok(body.children.some(e=>e.className==='mixed-unverified-egress-leg'),
 'The final address must be shown as a separate unsolved stage');
assert.ok(body.children.some(e=>String(e.textContent).includes('nu sunt confirmate')),
 'The option must disclose that changeover and schedules are unverified');
body.children[0].onclick();
multiCards=body.children.filter(e=>e.className.includes('mixed-unverified-candidate'));
assert.equal(multiCards.length,3,'Back retains all ground and flight options');

console.log('PASS unified mixed transport: flight+coach cards, functional transfer action and preserved Back');
