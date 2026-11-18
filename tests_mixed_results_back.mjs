import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const ui=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const start=ui.indexOf('function returnFromMixedJourneyResults(');
const end=ui.indexOf('function handleModuleLayerBack(',start);
assert.ok(start>0&&end>start,'Dedicated mixed journey back handler must exist');
const snippet=ui.slice(start,end);
const destination={label:'Strada Nufărului 1, Oradea, Romania',latitude:47.05,longitude:21.9};
const origin={label:'Mill Lane, Grays, United Kingdom',latitude:51.48,longitude:0.30};
const choice={kind:'transit',mixedJourney:true,mixedComposition:true,
 transitDestination:destination,journeyOrigin:origin,
 transitDepartureAt:'2026-11-20T00:00:00.000Z'};
let state={moduleSearchCategory:choice,lastTransitChoice:choice,selectedTransitJourney:null};
const root={style:{},children:[],querySelector(){return null;},replaceChildren(...children){this.children=children},scrollTop:10};
let destinationChoice=null, transitRendered=false;
const sheet={classList:{remove(){} }};
const body=new Function('state','$','document','createTransportDepartureStep',
 'dialogText','showOneFieldJourney','runModuleSearch','renderTransitChoices',
 'let oneFieldJourneyIncoming=null;\n'+snippet+
 '\nreturn {back:returnFromMixedJourneyResults,incoming:()=>oneFieldJourneyIncoming};')(
 state,id=>id==='moduleLayerBody'?root:{textContent:''},
 {querySelector:()=>sheet},
 config=>({type:'calendar',...config}),
 (ro,en)=>ro,
 choice=>{destinationChoice=choice},
 ()=>{},
 ()=>{transitRendered=true}
);
assert.equal(body.back(),true,'Results Back must be intercepted inside Deplasare spre');
assert.equal(root.children[0].type,'calendar');
assert.deepEqual(root.children[0].initialDepartureAt,choice.transitDepartureAt);
root.querySelector=selector=>selector==='.transport-departure-datetime'?{}:null;
assert.equal(body.back(),true,'Calendar Back returns to the confirmed A-B selection');
assert.deepEqual(body.incoming().selected_destination,destination);
assert.deepEqual(body.incoming().selected_origin,origin);
assert.ok(destinationChoice?.mixedJourney);
assert.equal(state.moduleSearchCategory,null);
assert.equal(transitRendered,false);
assert.ok(ui.slice(end,end+150).includes('if(returnFromMixedJourneyResults())return;'),
 'The top and physical Back button should share the mixed back hierarchy');
console.log('PASS mixed results Back: flight results → calendar → same confirmed origin and destination');
