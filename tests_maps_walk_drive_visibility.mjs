import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const section=(begin,end)=>{
 const start=source.indexOf(begin);
 const finish=source.indexOf(end,start+begin.length);
 assert.ok(start>=0&&finish>start,'Missing route handler: '+begin);
 return source.slice(start,finish);
};

const landing=section('function openModuleLandingAction(choice){','\nfunction quickUiText()');
const poi=section('function offerPlaceTravelModes(place){','\nfunction selectedPlaceForRoute(');
const assistantMode=section('function openTransportModeFromAssistant(data){','\nfunction appendTravelConfirmation(');
const modalModes=section('function appendTravelModeChoices(data,host){','\n// v1.0.101');
const journey=section('function showJourneyMode(choice){','\nfunction showTransitDestination(');
const transit=section('function showTransitDestination(choice){','\nconst TRANSIT_ACCESS_TEXT=');
const dispatcher=section('async function runModuleSearch(choice){','\nfunction returnToModuleLanding()');

assert.match(source,/#view-module\.module-landing #moduleChatHost/,'Landing deliberately hides chat; transitions must remove that class');
assert.match(landing,/rememberNavigationSource\(\);enterModuleRouteConversation\(\)/,'Walking card opens visible chat');
assert.match(poi,/switchConversationModule\('maps'\);enterModuleRouteConversation\(\)/,'POI walk and drive show chat');
assert.match(assistantMode,/enterModuleRouteConversation\(\);\s*inputEl\.value=t\[i\+1\]/,'Assistant mode choice shows chat');
assert.match(modalModes,/switchConversationModule\('maps'\);enterModuleRouteConversation\(\)/,'Inline mode choice shows chat');
assert.match(journey,/rememberNavigationSource\(\);enterModuleRouteConversation\(\)/,'A-to-B driving shows chat');
assert.match(transit,/rememberNavigationSource\(\);enterModuleRouteConversation\(\)/,'Typed driving shows chat');
assert.match(dispatcher,/if\(choice\.kind==='walking'\)\{rememberNavigationSource\(\);enterModuleRouteConversation\(\)/,'Legacy walking entry also shows chat');

const routeFn=section('function enterModuleRouteConversation(){','\nfunction showNavigationReturnInPanel(');
let viewRemoved=[],layerRemoved=[],hidden=null,returned=0;
const fakeNodes={
 'view-module':{classList:{remove:c=>viewRemoved.push(c)}},
 moduleQuickLayer:{classList:{remove:c=>layerRemoved.push(c)},setAttribute:(k,v)=>{if(k==='aria-hidden')hidden=v}}
};
const startRoute=new Function('state','$','showNavigationReturn',routeFn+'\nreturn enterModuleRouteConversation;')(
 {currentView:'module',currentModule:'maps'},id=>fakeNodes[id],()=>returned++);
startRoute();
assert.deepEqual(viewRemoved,['module-landing'],'Routing must reveal chat');
assert.deepEqual(layerRemoved,['open']);
assert.equal(hidden,'true');
assert.equal(returned,1);
const noAction=new Function('state','$','showNavigationReturn',routeFn+'\nreturn enterModuleRouteConversation;')(
 {currentView:'assistant',currentModule:null},()=>{throw Error('Should not touch UI')},()=>{throw Error('Should not show return')});
noAction();

const backFn=section('function showNavigationReturn(){','\nfunction enterModuleRouteConversation()');
const controls=[],backHost={append:b=>controls.push(b)};
const fakeDocument={getElementById:()=>null,createElement:()=>({style:{},onclick:null}),};
const back=new Function('state','$','document','dialogText','returnToNavigationSource',backFn+'\nreturn showNavigationReturn;')(
 {navigationReturnContext:{view:'module',module:'travel'}},
 id=>{assert.equal(id,'view-module');return {querySelector:selector=>{assert.equal(selector,'.module-heading-row');return backHost}};},
 fakeDocument,(ro)=>ro,()=>returned++);
back();
assert.equal(controls.length,1,'Return control stays in visible header, not hidden moduleContent');
assert.equal(controls[0].id,'returnToSearchSource');
controls[0].onclick();
assert.equal(returned,2);
console.log('PASS: Maps walking/driving entries reveal chat; navigation return stays visible');
