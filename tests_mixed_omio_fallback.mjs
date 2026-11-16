import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const first=frontend.indexOf('function showTransitRetrySelector(');
const last=frontend.indexOf('function showPreciseJourney(',first);
assert.ok(first>0&&last>first);
const source=frontend.slice(first,last);
assert.ok(source.includes("if(choice.mixedJourney===true)"));
assert.ok(source.includes("response?.international_journey===true"));
assert.ok(source.includes("response?.external_travel_search?.url==='https://www.omio.com'"));
assert.ok(source.includes("link.rel='noopener noreferrer'"));
assert.ok(source.includes("link.href='https://www.omio.com'"));
assert.ok(!source.includes("link.target='_blank'"));
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
const section=host.children.find(x=>x.className==='mixed-omio-external-search');
assert.ok(section,'International missing-provider response offers Omio all-mode search');
const anchor=section.children.find(x=>x.tagName==='a');
assert.equal(anchor.href,'https://www.omio.com');
assert.equal(anchor.rel,'noopener noreferrer');
assert.ok(!anchor.target,'Android opens external HTTPS without relying on popup windows');
assert.ok(section.children.some(x=>x.textContent.includes('Autocar')));
assert.ok(section.children.some(x=>x.textContent.includes('destinația')||x.textContent.includes('Destinație')));
assert.equal(draw({international_journey:false,external_travel_search:external.external_travel_search}).children.filter(x=>x.className==='mixed-omio-external-search').length,0);
assert.equal(draw({international_journey:true,external_travel_search:{provider:'Omio',url:'https://bad.example'}}).children.filter(x=>x.className==='mixed-omio-external-search').length,0);
console.log('PASS Omio mixed fallback: all modes, no invented route data, explicit external link, Android-safe recovery');
