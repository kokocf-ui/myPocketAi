import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const first=frontend.indexOf('function showTransitRetrySelector(');
const last=frontend.indexOf('function showPreciseJourney(',first);
assert.ok(first>0&&last>first);
const source=frontend.slice(first,last);
assert.ok(source.includes("if(choice.mixedJourney===true)"));
assert.ok(!source.includes('mixed-omio-external-search'),'No legacy Omio card in live journey results');
assert.ok(!source.includes('https://www.omio.com'),'No external website passed off as route search');
assert.ok(frontend.includes('serviciul internațional de itinerarii nu este conectat'),'Missing international planner is reported accurately');
assert.ok(source.includes("action(dialogText('Schimbă data și ora'"));
assert.ok(source.includes("action(dialogText('← Înapoi la destinație'"));
assert.ok(frontend.includes("showTransitRetrySelector(choice,data)"));

assert.ok(backend.includes("external_travel_search:{provider:'Omio',url:'https://www.omio.com'"));
assert.ok(backend.includes("travel_modes:['train','bus','flight','ferry']"));
assert.ok(backend.includes("requires_manual_search:true"));
assert.ok(backend.includes("service_scope:'city_or_station'"));
assert.ok(!backend.includes("IMPACT_API_TOKEN")||!source.includes('IMPACT_API_TOKEN'));
assert.ok(backend.includes("route_available:false,transit_available:false"));
assert.ok(backend.includes('international_journey:true,mixed_journey:true'));
assert.ok(backend.includes('No airline requirement'));

class FakeElement {
 constructor(tag){this.tagName=tag;this.children=[];this.style={cssText:''};this.attributes={};this.className='';this.textContent='';this.classList={add(){},remove(){}}}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=nodes}
 setAttribute(k,v){this.attributes[k]=v}
}
const draw=(response)=>{
 const host=new FakeElement('section');
 const document={createElement:tag=>new FakeElement(tag),querySelector:()=>({classList:{remove(){}}})};
 const state={language:'ro',lastTransitChoice:{transitDestination:{label:'Strada Nufărului 12, Oradea',latitude:47.06,longitude:21.94}}};
 const obtain=id=>id==='moduleLayerBody'?host:null;
 const fn=new Function('document','state','$','dialogText',
   source+';return showTransitRetrySelector')(document,state,obtain,(ro,en)=>ro);
 fn({mixedJourney:true,transitDestination:{label:'Strada Nufărului 12, Oradea'},transitDepartureAt:'2026-11-17T10:04:00Z'},response);
 return host;
};
const external={international_journey:true,external_travel_search:{provider:'Omio',url:'https://www.omio.com'}};
const host=draw(external);
assert.equal(host.children.filter(x=>x.className==='mixed-omio-external-search').length,0,
 'Unavailable provider never creates an external Omio promotional result');
const actionGroup=host.children.find(x=>x.className==='mixed-journey-retry-actions');
assert.ok(actionGroup,'Time-change and destination-return controls remain available');
assert.equal(actionGroup.children.length,2,'Only two retry actions remain');
console.log('PASS mixed mode: no stale Omio card, no fake timetable, calendar and destination recovery');
