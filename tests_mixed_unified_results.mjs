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
}
const document={createElement:tag=>new Element(tag)};
const body=new Element('main'),layer=new Element('div');
const $=id=>({moduleLayerBody:body,moduleQuickLayer:layer})[id];
const state={language:'ro',lastTransitChoice:{mixedJourney:true},lastTransitResponse:null};
let shown=0;
const run=new Function('document','state','$','renderTransitChoices','showTransitRetrySelector',
 'dialogText','mixedFarePresentation','mixedOperatorName','resolveMixedFlightGroundOptions',
 snippet+'\nreturn {renderMixedUnifiedResults};');
const api=run(document,state,$,()=>{
 shown++;body.replaceChildren();
},()=>{},(ro,en)=>ro,item=>item.fareFrom?
 'De la '+item.fareFrom.amount+' '+item.fareFrom.currency:
 item.fareObserved?'Tarif orientativ: '+item.fareObserved.amount+' '+item.fareObserved.currency:'',
 name=>{const el=new Element('a');el.textContent=name;return el;},()=>{});
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
console.log('PASS unified mixed transport: official coach and air cards together, operator link, no old fallback, Back restores list');
