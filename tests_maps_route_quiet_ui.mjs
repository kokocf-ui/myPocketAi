import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const src=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const section=(from,to)=>{
 const start=src.indexOf(from),end=src.indexOf(to,start+from.length);
 assert.ok(start>=0&&end>start,'Expected section: '+from);
 return src.slice(start,end);
};
const mode=section('function offerPlaceTravelModes(place){','\nfunction selectedPlaceForRoute(');
const routeList=section('function openWalkingRouteChoices(route,options=state.lastRouteOptions){','\nfunction retainRouteResult(');
const submission=section('async function submitMessage({fromVoice=false}={}){',"$('chatForm').addEventListener('submit'");
const landing=section('function renderModuleLandingChoices(){','\nfunction updateQuickLayerGeometry(){');
const navigation=section('function returnToNavigationSource(){','function showNavigationReturn(){');

assert.match(mode,/classList\.add\('mode-choice-screen'\)/,'Mode panel gets its own styling scope');
assert.match(mode,/mode-route-option/,'Mode choices are not generic cards');
assert.match(mode,/mode-back-results/,'Back to results is a different action style');
assert.match(mode,/switchConversationModule\('maps'\);enterModuleRouteConversation\(\)/,'Route handoff preserved');
assert.match(routeList,/setAttribute\('aria-pressed'/,'Selected route has accessible state');
assert.match(routeList,/openRouteMap\(v,null,usable\)/,'Route choice still opens selected navigation');
assert.match(landing,/finishRouteSearchLoading\(\)/,'Landing cleans transient loader');
assert.match(navigation,/finishRouteSearchLoading\(\)/,'Returning to previous results cleans transient loader');
assert.match(submission,/const routeLoadingRequested=state\.currentView==='module'/,'Only Maps/Hotel route requests trigger loader');
assert.match(submission,/\(Boolean\(state\.pendingTravelMode\)\|\|state\.pendingRouteStart===true\|\|state\.pendingRouteCompare===true\)/,'Walking, driving, transit, and alternative searches supported');
assert.match(submission,/if\(routeLoadingRequested\)beginRouteSearchLoading\(routeLoadingProfile\)/,'Loader starts before API request');
assert.match(submission,/if\(routeLoadingRequested\)requestAnimationFrame\(finishRouteSearchLoading\)/,'Loader disappears after response/exception');

assert.match(src,/\.module-quick-sheet\.mode-choice-screen \.mode-route-option/,'Scoped petrol mode styles present');
assert.match(src,/\.route-choice-screen \.route-options>\.transit-choice-action/,'Route list has petrol cards');
assert.match(src,/\.route-choice-screen \.route-options>\.route-map-open/,'Find-more-routes has separate plum color');
assert.match(src,/#view-module\.route-searching\.active #moduleChatHost/,'Chat hidden during route search');
assert.match(src,/@media\(prefers-reduced-motion:reduce\)/,'Route loader respects reduced-motion setting');

const code=section('function beginRouteSearchLoading(profile){','\nfunction showNavigationReturnInPanel(');
const shown=new Set(),elements={};
const makeEl=tag=>({
 tag,children:[],attributes:{},removed:false,
 setAttribute(k,v){this.attributes[k]=v},
 append(...kids){this.children.push(...kids)},
 replaceChildren(...kids){this.children=kids},
 remove(){this.removed=true}
});
const view={classList:{add:v=>shown.add(v),remove:v=>shown.delete(v)}};
const host={children:[],replaceChildren(...items){this.children=items}};
const fakeDoc={
 createElement:makeEl,
 getElementById:id=>id==='routeSearchLoading'?host.children[0]||null:null
};
const $=id=>({ 'view-module':view, moduleContent:host })[id];
const {beginRouteSearchLoading,finishRouteSearchLoading}=new Function('state','$','document','dialogText',
 code+'\nreturn {beginRouteSearchLoading,finishRouteSearchLoading};')(
 {currentView:'module',currentModule:'maps'},$,fakeDoc,(ro,en)=>ro);
beginRouteSearchLoading('walk');
assert.ok(shown.has('route-searching'),'Route search enters dedicated screen');
assert.equal(host.children[0].attributes.role,'status');
assert.equal(host.children[0].children[0].textContent,'Căutăm traseul pietonal');
assert.equal(host.children[0].children[3].children.length,3,'Three search placeholders');
finishRouteSearchLoading();
assert.ok(!shown.has('route-searching'),'Loader gets removed');
assert.ok(host.children[0].removed,'Transient loader DOM is removed');

let touched=false;
const off=new Function('state','$','document','dialogText',code+'\nreturn beginRouteSearchLoading;')(
 {currentView:'assistant',currentModule:null},()=>{touched=true;throw Error('not called')},fakeDoc,(ro,en)=>en);
off('drive');assert.equal(touched,false,'Assistant view never gets route loader');
console.log('PASS: Petrol/plum route styling and chat-free loading keep working navigation');
