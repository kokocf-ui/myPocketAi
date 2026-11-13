import assert from 'node:assert/strict';
import {ASSISTANT_PLACE_RESULTS_SCRIPT} from './assistant_place_results_ui.mjs';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync('index.js','utf8');
assert.ok(source.includes("import {ASSISTANT_PLACE_RESULTS_SCRIPT} from './assistant_place_results_ui.mjs'"));
assert.ok(source.includes('${ASSISTANT_PLACE_RESULTS_SCRIPT}'));
assert.ok(!source.includes("chat.addEventListener('click',openHotelEvaDialogue)"),"Hotels must not expose Eva chat");
assert.ok(source.includes("openAssistantPlaceResults(data.places)"));
assert.ok(source.includes("data.location_source==='ambiguous_place_name'?dialogText('La care Alba te referi?'"),
 'Ambiguous Alba must display an explicit choice heading');
assert.ok(ASSISTANT_PLACE_RESULTS_SCRIPT.includes("dialogText('Telefon','Phone')"));
assert.ok(ASSISTANT_PLACE_RESULTS_SCRIPT.includes("dialogText('Navighează către locație','Navigate to location')"));
assert.ok(ASSISTANT_PLACE_RESULTS_SCRIPT.includes('perPage=6'));
assert.ok(ASSISTANT_PLACE_RESULTS_SCRIPT.includes('openStandaloneChoicePanel(host,title,{keepOpen:true})'));
assert.ok(ASSISTANT_PLACE_RESULTS_SCRIPT.includes("if(!Array.isArray(places)||!places.length)return false"));
assert.ok(ASSISTANT_PLACE_RESULTS_SCRIPT.includes("place.latitude!=null&&place.longitude!=null"));
new vm.Script(ASSISTANT_PLACE_RESULTS_SCRIPT);
assert.ok(ASSISTANT_PLACE_RESULTS_SCRIPT.includes('state.assistantStructuredDestination=true'),
 'Navigating from an assistant result must stay in assistant mode');
assert.ok(source.includes("if(state.currentView==='assistant'&&state.assistantStructuredDestination===true)"),
 'Shared router must honor the assistant destination flag');

// Simulate opening a hotel, then pressing Navigate. Do not switch to Maps;
// the existing assistant travel-mode picker must receive the verified point.
class FakeElement {
 constructor(tag){this.tag=tag;this.children=[];this.dataset={};this.style={};this.events={};this.textContent='';}
 append(...items){this.children.push(...items)}
 replaceChildren(...items){this.children=items}
 addEventListener(name,handler){this.events[name]=handler}
}
const ctx={
 document:{createElement:tag=>new FakeElement(tag),createTextNode:value=>({textContent:value}),
  getElementById:()=>({remove(){}})},
 dialogText:(ro,en)=>ro,
 state:{busy:false,currentView:'assistant',assistantStructuredDestination:false},
 openStandaloneChoicePanel(host,title){ctx.panel=host;ctx.panelTitle=title},
 openTransportModeFromAssistant(data){
  ctx.routeHandoff={data,assistantFlag:ctx.state.assistantStructuredDestination};return true;
 }
};
vm.runInNewContext(ASSISTANT_PLACE_RESULTS_SCRIPT,ctx);
assert.equal(ctx.openAssistantPlaceResults([{name:'American Grill',address:'Strada Vasile Alecsandri, Oradea',
 latitude:47.07,longitude:21.92}]),true);
const item=ctx.panel.children[1].children[0].children[0].children[0].children[0];
item.events.click();
const navigate=ctx.panel.children.find(el=>el.events?.click &&
 el.textContent==='Navighează către locație');
assert.ok(navigate,'Destination with verified coordinates must offer navigation');
navigate.events.click();
assert.equal(ctx.routeHandoff.assistantFlag,true);
assert.equal(ctx.routeHandoff.data.route_context.destination.latitude,47.07);
assert.equal(ctx.routeHandoff.data.route_context.destination.longitude,21.92);
assert.equal(ctx.state.currentView,'assistant');
console.log('PASS: assistant results, pagination, and hotel-to-route handoff keep conversation active');
