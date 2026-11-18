import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {compareMixedTransportOptions} from './mixed_transport_comparison.mjs';

const source=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const begin=source.indexOf('function mixedCompactTransportModes(');
const end=source.indexOf('function appendTransitCards(',begin);
assert.ok(begin>=0&&end>begin,'Compact mixed cards are present in the actual Android frontend');
const view=source.slice(begin,end);
const fareBegin=source.indexOf('function mixedFarePresentation(');
const fareEnd=source.indexOf('function showTransitRetrySelector(',fareBegin);
assert.ok(fareBegin>0&&fareEnd>fareBegin,'Source-backed price rendering exists');
const fare=source.slice(fareBegin,fareEnd);

class Element {
 constructor(tag){this.tag=tag;this.children=[];this.attrs={};this.style={};
  this.className='';this.textContent='';this.onclick=null;this.classList={add(){},remove(){}};
 }
 setAttribute(key,value){this.attrs[key]=String(value)}
 append(...items){this.children.push(...items)}
}
const document={createElement:tag=>new Element(tag)};
const root=new Element('main'),layer=new Element('section'),heading=new Element('h3');
const $=id=>({moduleQuickLayer:layer,moduleLayerTitle:heading})[id];
const state={language:'ro',lastTransitChoice:{
 mixedJourney:true,journeyOrigin:{label:'Mill Lane, Grays'},
 transitDestination:{label:'Strada Nufărului 1, Oradea'}}};
const selection=[];
const makeView=new Function('document','state','mixedFarePresentation',
 'formatTravelDurationMinutes','dialogText','closeAnswerReader','$',
 'selectTransitJourney','transitAccessText','compareMixedTransportOptions',
 view+'\nreturn {appendCompactMixedTransitCards,mixedCompactTransportModes};');
const makeFare=new Function('dialogText',fare+'\nreturn mixedFarePresentation;');
const locale=(ro,en)=>ro;
const formatFare=makeFare(locale);
const ui=makeView(document,state,formatFare,m=>Math.round(m)+' min',locale,()=>{},
 $,(_items,index)=>selection.push(index),()=>['Trasee'],compareMixedTransportOptions);
const at='2026-12-08T06:00:00Z';
const choices=[
 {startDateTime:at,arrivalDateTime:'2026-12-08T16:00:00Z',durationMinutes:600,
  legs:[{mode:'walking',from:'Mill Lane'},{mode:'train'},
   {mode:'flight'},{mode:'coach',to:'Nufărului'}],
  fareRange:{min:80,max:160,currency:'GBP',source:'demo source'}},
 {startDateTime:at,arrivalDateTime:'2026-12-09T12:00:00Z',durationMinutes:1800,
  legs:[{mode:'train',from:'Mill Lane'},{mode:'coach',to:'Nufărului'}]},
 {route_only:true,schedule_status:'estimated',durationMinutes:null,
  legs:[{mode:'coach',from:'Mill Lane'},{mode:'bus',to:'Nufărului'}],
  fareEstimateRange:{min:60,max:240,currency:'RON',source:'demo source'}}
];
ui.appendCompactMixedTransitCards(root,choices);
assert.equal(root.children.length,3,'Each route renders exactly one card');
assert.equal(selection.length,0,'No details are opened until a card is selected');
for(const card of root.children){
 assert.equal(card.tag,'button');
 assert.match(card.children[0].textContent,/Mill Lane, Grays → Strada Nufărului 1, Oradea/);
 assert.equal(card.children.some(c=>c.className==='transit-steps'),false,
  'Leg-by-leg table must not clutter the overview');
}
const icons=root.children.map(card=>card.children[1].children.map(e=>e.textContent).join(''));
assert.ok(icons[0].includes('🚶')&&icons[0].includes('🚆')&&
 icons[0].includes('✈️')&&icons[0].includes('🚌'));
assert.ok(icons[1].includes('🚆')&&icons[1].includes('🚌')&&
 !icons[1].includes('✈️'),'Ground-only alternatives are visible without flight');
assert.ok(icons[2].includes('🚌')&&!icons[2].includes('✈️'));
assert.match(root.children[0].children[2].textContent,/80–160 GBP/);
assert.match(root.children[1].children[2].textContent,/Preț de verificat/);
assert.match(root.children[2].children[2].textContent,/60–240 RON/);
assert.match(root.children[2].children[3].textContent,/Orar orientativ/);
assert.match(root.children[1].attrs['aria-label'],/Tren, Autocar/);
root.children[1].onclick();
assert.deepEqual(selection,[1],'Selecting ground-only route opens only its details');
assert.match(heading.textContent,/Trasee/);
assert.match(root.children[0].children[3].textContent,/Cea mai rapidă/);
console.log('PASS compact mixed options: icons, door-to-door, source estimate, indicative and tap-for-legs only');
