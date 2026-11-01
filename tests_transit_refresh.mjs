import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';

const html=await(await frontend.fetch(new Request('https://fixture'))).text();
const source=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(source,'browser script present');
new vm.Script(source);

const start=source.indexOf('function feasibleTransitChoices(options){');
const end=source.indexOf('function renderTransitChoices(options,selectedIndex=null){',start);
assert.ok(start>=0&&end>start,'direct transit refresh implementation present');
const current=Date.now();
const stop=(minutes,walk=10)=>({
 firstVehicleDepartureTime:new Date(current+minutes*60000).toISOString(),
 boarding_stop:{label:'Chafford Hundred Rail Station',departure_time:new Date(current+minutes*60000).toISOString()},
 walkToFirstStopMinutes:walk,safetyMarginMinutes:5
});
const destination={label:'Victoria Rail Station',latitude:51.496,longitude:-0.144};
const gps={latitude:51.482,longitude:0.292,updatedAt:Date.now()};
const layer={classList:{contains:v=>v==='open'}};
const statuses=[];
const body={querySelector:()=>null,prepend(node){statuses.push(node)}};
const document={createElement(){return {setAttribute(){},textContent:''}}};
const state={
 language:'ro',busy:false,currentView:'assistant',currentModule:'maps',
 conversationGeneration:1,lastTransitResponse:{transit_destination_point:destination},
 lastTransitChoice:{kind:'transit',prompt:'Victoria station',transitDirect:true},
 transitRefreshBusy:false,transitRefreshGeneration:0
};
const calls=[],rendered=[];
const ctx={state,document,CLIENT_CONFIG:{apiUrl:'https://example.test/api/chat'},
 $:id=>id==='moduleQuickLayer'?layer:id==='moduleLayerBody'?body:null,
 getCurrentCoordinates:async()=>gps,fetch:async (_url,options)=>{
  calls.push(JSON.parse(options.body));
  return {ok:true,json:async()=>({
    status:'success',message_received:'Transport public',
    transit_destination_point:destination,
    transit:[stop(40),stop(55)]
  })};
 },
 cancelTransitAccess:(clear)=>{state.cancelled=clear},
 renderTransitChoices:opts=>{rendered.push(opts)},
 transitAccessText:()=>Array.from({length:29},()=> 'Refresh departures'),
 transitDistance:(a,b)=>a.latitude===b.latitude&&a.longitude===b.longitude?0:10000,
 AbortController,setTimeout,clearTimeout,console};
vm.createContext(ctx);
vm.runInContext(source.slice(start,end),ctx);
assert.equal(ctx.feasibleTransitChoices([stop(-2),stop(7),stop(20),stop(30,26)]).length,1,
 'expired and unreachable departures must be filtered before display');
const button={textContent:'Actualizează plecările',disabled:false,isConnected:true};
await ctx.refreshTransitDepartures(button);
assert.equal(calls.length,1,'one refresh request');
assert.equal(calls[0].message,'Transport public');
assert.equal(calls[0].travel_mode,'transit');
assert.equal(calls[0].transit_destination.label,destination.label,'retain station');
assert.equal(calls[0].transit_destination.latitude,destination.latitude);
assert.equal(calls[0].transit_destination.longitude,destination.longitude);
assert.equal(calls[0].route_context.pending,'profile');
assert.equal(calls[0].route_context.destination.label,destination.label);
assert.deepEqual(calls[0].location,gps,'fresh GPS origin retained');
assert.equal(calls[0].location_requested,true);
assert.equal(rendered.length,1,'result replaces old journeys');
assert.equal(rendered[0].length,2);
assert.equal(state.lastTransitResponse.transit.length,2);
assert.equal(state.transitRefreshBusy,false);
assert.equal(button.disabled,false);
assert.equal(button.textContent,'Actualizează plecările');

const second={...destination,label:'Other Station',latitude:54.3};
ctx.fetch=async (_url,options)=>{calls.push(JSON.parse(options.body));return {ok:true,json:async()=>({status:'success',transit_destination_point:second,transit:[stop(60)]})}};
const oldCount=rendered.length;
await ctx.refreshTransitDepartures(button);
assert.equal(rendered.length,oldCount,'never switch silently to a different destination');
assert.ok(statuses.length>=1,'error stays in the current transport list');

const targetBefore=state.lastTransitResponse.transit_destination_point;
assert.equal(targetBefore.label,'Victoria Rail Station');
assert.ok(!source.slice(source.indexOf('function renderTransitChoices('),source.indexOf('async function selectTransitJourney')).includes('runModuleSearch(state.lastTransitChoice)'),'old generic refresh removed');
assert.ok(source.includes('if(selected?.accessRoute&&!selected.error)'),'walking action only for verified map');
console.log('PASS: retained-GPS departure refresh, early-departure filtering, destination safety, and no erroneous walk retry.');
