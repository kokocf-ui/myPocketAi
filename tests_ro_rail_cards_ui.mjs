import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync('index.js','utf8');
const from=source.indexOf('function isRomanianRailJourney(');
const to=source.indexOf('function appendTransitCards(',from);
assert.ok(from>0&&to>from,'Bilo-specific rail UI helpers are present');
const fragment=source.slice(from,to);
assert.ok(fragment.includes('appendRomanianRailCards('));
assert.ok(fragment.includes('appendRomanianRailDetails('));
assert.match(source,/if\(options\.length&&options\.every\(isRomanianRailJourney\)\)/,
 'Only Bilo journeys are handed to the new compact card UI');
assert.match(source,/if\(isRomanianRailJourney\(journey\)\)\{appendRomanianRailDetails\(body,journey\);return;\}/,
 'Selected Bilo route uses dedicated detail layout');
assert.match(source,/if\(isRomanianRailJourney\(journey\)&&!validTransitBoardingStop\(stop\)\)/,
 'Unverified stop coordinates do not trigger duplicate errors');
const nodes=[];
const createElement=tag=>{
 const n={tagName:tag,style:{cssText:''},children:[],className:'',textContent:'',
  append(...children){this.children.push(...children)},setAttribute(){},onclick:null};
 nodes.push(n);return n;
};
const context={
 document:{createElement},
 state:{language:'ro'},
 transitClock:iso=>iso?.slice(11,16)||'—',
 transitDateLabel:()=> '12.11.2026',
 formatTravelDurationMinutes:min=>min+' min',
 transitModeName:mode=>mode==='train'?'Tren':mode,
 transitLineLabel:leg=>(leg.lineNames||[]).join(', '),
 validTransitBoardingStop:stop=>Boolean(stop?.latitude&&stop?.longitude),
 dialogText:(ro,en)=>ro,closeAnswerReader(){},selectTransitJourney(){},
 $:()=>({classList:{add(){}},setAttribute(){}}),transitAccessText:()=>['Variante']
};
vm.createContext(context);
vm.runInContext(fragment+';globalThis.rail={isRomanianRailJourney,appendRomanianRailCards,appendRomanianRailDetails};',context);
const leg={mode:'train',from:'București Nord Gr.A',to:'Brașov',
 departureTime:'2026-11-12T04:41:00.000Z',arrivalTime:'2026-11-12T07:15:00.000Z',
 lineNames:['IR 1535'],operator:'CFR Călători'};
const journey={source:'Bilo: operator schedule',time_zone:'Europe/Bucharest',
 startDateTime:leg.departureTime,arrivalDateTime:leg.arrivalTime,durationMinutes:154,
 legs:[leg],fareLocal:{amount:48.5,currency:'RON'}};
assert.equal(context.rail.isRomanianRailJourney(journey),true);
assert.equal(context.rail.isRomanianRailJourney({...journey,source:'TfL'}),false,
 'Never redesign unrelated transport services');
const cards={children:[],append(x){this.children.push(x)}};
context.rail.appendRomanianRailCards(cards,[journey]);
assert.equal(cards.children.length,1);
const texts=node=>[node.textContent,...(node.children||[]).flatMap(texts)].join(' | ');
const cardText=texts(cards.children[0]);
for(const expected of ['București Nord Gr.A','Brașov','IR 1535','CFR Călători','48,5 RON']){
 assert.ok(cardText.includes(expected),'Missing rail card detail: '+expected);
}
assert.ok(!/coordonate|mers p[aâ]n[aă] la stație/i.test(cardText),
 'Do not repeat geolocation warning on every search result');
const details={children:[],append(x){this.children.push(x)}};
context.rail.appendRomanianRailDetails(details,journey);
const detailsText=texts(details);
assert.ok(detailsText.includes('Etapa 1'),'Selected route shows structured leg');
assert.ok(detailsText.includes('IR 1535'),'Train number is visible in detail');
assert.ok(detailsText.includes('48,5 RON'),'Provided fare is visible');
assert.equal((detailsText.match(/coordonatele verificate/g)||[]).length,1,
 'One discreet access note rather than repeated geolocation warnings');
const noPrice={...journey,fareLocal:null,legs:[{...leg,operator:''}]};
const noPricePanel={children:[],append(x){this.children.push(x)}};
context.rail.appendRomanianRailDetails(noPricePanel,noPrice);
assert.ok(!texts(noPricePanel).includes('Tarif afișat'),'Do not invent missing price');
console.log('PASS compact Romanian rail card and selected detail layout, source isolation and single access note');
