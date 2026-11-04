import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {readFileSync} from 'node:fs';

const page=await (await frontend.fetch(new Request('https://pocket.test/'))).text();
const inline=page.match(/<script[^>]*>([\s\S]*?)<\/script>/i)?.[1];
assert(inline,'frontend script generated');
new vm.Script(inline);

const source=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
const start=inline.indexOf('function assistantGeographicType(');
const end=inline.indexOf('function appendConversationChoices(',start);
assert(start>=0&&end>start,'scope logic exists');
const snippet=inline.slice(start,end);

function element(tag){
 return {tag,children:[],style:{},dataset:{},textContent:'',append(...nodes){this.children.push(...nodes)},replaceChildren(...nodes){this.children=nodes}};
}
const actions={};
let lastPanel=null;
const state={language:'ro',currentView:'assistant'};
const ctx=vm.createContext({
 state,document:{createElement:element,getElementById:()=>null,querySelector:()=>element('div')},
 openStandaloneChoicePanel:(host,title)=>{lastPanel={host,title}},
 offerDestinationAccommodationBeforeRoute:(destination,options)=>{actions.accommodation={destination,options}},
 openTransportModeFromAssistant:args=>{actions.route=args},
 renderStructuredAddressPicker:args=>{actions.picker=args},
 closeAnswerReader:()=>{},
 console,
});
vm.runInContext(snippet,ctx);
const city={entity_kind:'place',entity_type:'city',entity_title:'Alba',entity_country_code:'IT',entity_region:'Piemonte',latitude:44.7,longitude:8.03};
const county={entity_kind:'region_article',entity_type:'region',entity_title:'Alba',entity_country_code:'RO'};
const country={entity_kind:'place',entity_type:'country',entity_title:'România',entity_country_code:'RO'};
assert.equal(ctx.assistantGeographicType(city),'city');
assert.equal(ctx.assistantGeographicType(county),'region');
assert.equal(ctx.assistantGeographicType(country),'country');

function buttons(){return lastPanel.host.children.filter(x=>x.tag==='button')}
ctx.offerAssistantScopeAccommodation(city);
assert.equal(buttons().length,2);
buttons()[0].onclick();
assert.equal(actions.accommodation.destination.latitude,44.7,'city lodging uses verified city centre');
assert.equal(actions.accommodation.options.autoSearch,true,'yes triggers search without address form');
assert.equal(actions.accommodation.options.scopeOption,city);

delete actions.accommodation;delete actions.picker;
ctx.offerAssistantScopeAccommodation(county);
buttons()[0].onclick();
assert.equal(actions.picker?.cityOnly,true,'county lodging asks only for town');
assert.equal(actions.picker?.region,'Alba');
assert.equal(actions.picker?.countryCode,'RO');
assert.equal(actions.accommodation,undefined);
actions.picker.onSelect({latitude:46.07,longitude:23.58,city:'Alba Iulia',label:'Alba Iulia'});
assert.equal(actions.accommodation.options.autoSearch,true,'after verified town, hotels are searched directly');

delete actions.picker;delete actions.route;
ctx.offerAssistantScopeAccommodation(country);
buttons()[1].onclick();
assert.equal(actions.picker?.cityOnly,false,'no lodging opens full address picker');
assert.equal(actions.picker?.countryCode,'RO');
assert.equal(actions.picker?.region,'','country search has no county constraint');
actions.picker.onSelect({latitude:46.07,longitude:23.58,city:'Alba Iulia',label:'Alba Iulia'});
assert.equal(state.tripAccommodationDecision,'no');
assert.equal(state.assistantStructuredDestination,true);
assert.equal(actions.route.route_context.destination.label,'Alba Iulia');
assert.equal(actions.accommodation.options.autoSearch,true,'address selection does not re-prompt lodging');

assert(source.includes("if(input.value.trim().length>=1){")&&source.includes("stage==='street'?80:200"),'search suggestions begin with first character using scoped cache and fast network fallback');
assert(source.includes("(i+1)+'. '+point.label"),'numbered candidate lists');
assert(source.includes('fields.city.row.hidden=true'),'known city not requested again');
assert(source.includes('fields.country.row.hidden=true'),'fixed country not requested again');
assert(source.includes('if(cityOnly){fields.street.row.hidden=true'),'lodging requires no street or number');
assert(backend.includes("article.country_code=countryCode"),'country metadata supplied for country-scoped destination lookup');

// Executed hotel selection must fix the destination at the verified hotel coordinates.
const hotelsStart=inline.indexOf('function openAccommodationResults(');
const hotelsEnd=inline.indexOf('function openStandaloneChoicePanel(',hotelsStart);
assert(hotelsStart>=0&&hotelsEnd>hotelsStart,'existing hotel choice panel present');
const hotelActions={};
const hotelCtx=vm.createContext({
 state:{currentView:'assistant',tripAccommodationDecision:'pending'},
 document:{createElement:element,getElementById:()=>null,querySelector:()=>element('div')},
 cleanAccommodationPlaces:x=>x,
 openTransportModeFromAssistant:x=>{hotelActions.route=x},
 openStandaloneChoicePanel:(host,title)=>{hotelActions.panel={host,title}},
 addBubble:()=>{},
});
vm.runInContext(inline.slice(hotelsStart,hotelsEnd),hotelCtx);
hotelCtx.openAccommodationResults([{name:'Hotel Central',address:'Strada Unirii 10, Alba Iulia',latitude:46.068,longitude:23.575}],{latitude:46.07,longitude:23.58,label:'Alba Iulia'},country);
const table=hotelActions.panel.host.children.find(x=>x.tag==='table');
assert(table,'lodging table displayed');
const select=table.children[0].children[0].children[0].children[0];
select.onclick();
assert.equal(hotelActions.route.route_context.destination.latitude,46.068);
assert.equal(hotelActions.route.route_context.destination.longitude,23.575);
assert.match(hotelActions.route.route_context.destination.label,/Strada Unirii 10/);
assert.equal(hotelCtx.state.tripAccommodationDecision,'yes');
assert.equal(hotelCtx.state.assistantStructuredDestination,true);

 // Administrative village names are already selected by the user: resolving their
 // geographic point must be silent and must not create a second city-choice list.
for(const regionName of ['Tulcea','Botoșani']){
 let pickerArgs=null,requests=0;
 const villageCtx=vm.createContext({
  state:{language:'ro',currentView:'assistant'},
  document:{createElement:element,getElementById:()=>null,querySelector:()=>element('div')},
  openStandaloneChoicePanel:()=>{},
  renderStructuredAddressPicker:args=>{pickerArgs=args},
  CLIENT_CONFIG:{apiUrl:'https://unit.test/api/chat'},
  fetch:async (url,options)=>{
   requests++;
   const request=JSON.parse(options.body).address_lookup;
   assert.equal(request.stage,'city');
   assert.equal(request.query,'Alba');
   assert.equal(request.region,regionName);
   assert.equal(request.country,'ro');
   return {ok:true,json:async()=>({candidates:[{city:'Alba',label:'Alba, '+regionName,latitude:45.3,longitude:28.1}]})};
  },
 });
 vm.runInContext(snippet,villageCtx);
 const ref={entity_kind:'locality_reference',entity_type:'city',entity_title:'Alba',
  entity_region:regionName,entity_country_code:'RO'};
 villageCtx.openAssistantStructuredAddress(ref);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(requests,1,'only one silent county-scoped lookup');
 assert.equal(pickerArgs?.prefillCity,'Alba','already selected village retained');
 assert.equal(pickerArgs?.region,regionName);
 assert.equal(pickerArgs?.prefillCityPoint?.city,'Alba','verified village passed to common picker');
}

console.log('Accommodation-first scope decisions and precise hotel destination regression passed.');
