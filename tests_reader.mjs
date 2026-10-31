import vm from 'node:vm';
import assert from 'node:assert/strict';
import front from './index.js';
const html=await(await front.fetch(new Request('https://pocket.test/'))).text();
const source=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0][1];
new vm.Script(source);
let frameId=0,frames=new Map(),now=0,navTop=700,blurred=0;
class El{
 constructor(tag){this.tag=tag;this.children=[];this.listeners={};this.style={};this.attributes={};this.isConnected=true;this.height=100;this.scrollTop=0;this.scrollHeight=1100;this.clientHeight=300;this.value=''}
 append(...els){this.children.push(...els)}setAttribute(k,v){this.attributes[k]=v}focus(){doc.activeElement=this}blur(){blurred++}remove(){this.isConnected=false}
 getBoundingClientRect(){return {height:this.height,top:navTop}}addEventListener(k,f){this.listeners[k]=f}removeEventListener(k){delete this.listeners[k]}
 querySelectorAll(tag){const out=[];const walk=e=>{for(const n of e.children||[]){if(n.tag===tag)out.push(n);walk(n)}};walk(this);return out}
}
const doc={body:new El('body'),listeners:{},hidden:false,activeElement:null,createElement:t=>new El(t),createTextNode:t=>({textContent:t}),querySelector:()=>new El('nav'),addEventListener(k,f){this.listeners[k]=f},removeEventListener(k){delete this.listeners[k]}};
const win={innerHeight:800,listeners:{},matchMedia:()=>({matches:false}),addEventListener(k,f){this.listeners[k]=f},removeEventListener(k){delete this.listeners[k]}};
const ctx={closeRouteMap:()=>{},document:doc,window:win,state:{language:'ro',currentView:'assistant'},inputEl:new El('input'),performance:{now:()=>now},getComputedStyle:()=>({lineHeight:'20px',fontSize:'16px'}),requestAnimationFrame:f=>{frames.set(++frameId,f);return frameId},cancelAnimationFrame:id=>frames.delete(id),Number,URL,console};vm.createContext(ctx);
const a=source.indexOf('const READER_LABELS='),b=source.indexOf('function addBubble(',a);vm.runInContext(source.slice(a,b),ctx);
const runFrame=time=>{now=time;const batch=[...frames.values()];frames.clear();for(const f of batch)f(time)};
const content=new El('span'),bubble=new El('div');content.height=80;ctx.prepareAnswerReader(content,bubble,'short',true);assert.equal(bubble.children.length,0);assert.equal(doc.body.children.length,0);
content.height=100;ctx.prepareAnswerReader(content,bubble,'Long answer https://hotel.test/path. <script>alert(1)</script>',false);assert.equal(bubble.children.length,1);assert.ok(content.className.includes('answer-preview'));assert.equal(doc.body.children.length,0,'history does not auto-open');bubble.children[0].onclick();
let layer=doc.body.children.at(-1);assert.equal(layer.attributes.role,'dialog');assert.equal(layer.style.bottom,'110px');assert.equal(layer.children[0].children[0].textContent,'Răspuns complet');
let body=layer.children[2],pause=layer.children[1].children[0];assert.ok(blurred>0);assert.equal(body.querySelectorAll('a')[0].href,'https://hotel.test/path');assert.equal(body.querySelectorAll('script').length,0);assert.equal(pause.textContent,'Pauză');
runFrame(1900);runFrame(2000);assert.ok(body.scrollTop>0,'automatic scrolling advances');body.listeners.touchstart();assert.equal(pause.textContent,'Continuă');const stopped=body.scrollTop;runFrame(2100);assert.equal(body.scrollTop,stopped);body.scrollTop=120;pause.onclick();runFrame(3100);runFrame(3200);assert.ok(body.scrollTop>120,'resume starts from manual position');
let origin=bubble.children[0];ctx.closeAnswerReader();assert.equal(layer.isConnected,false);assert.equal(frames.size,0);assert.equal(Object.keys(doc.listeners).length,0);assert.equal(doc.activeElement,origin);
for(const lang of ['ro','en','fr','de','it','es','pt','nl','ru','pl']){ctx.state.language=lang;const t=ctx.readerLabels();for(const label of ['title','open','pause','play','restart','close','speed'])assert.ok(t[label]);}
ctx.state.language='en';ctx.prepareAnswerReader(content,new El('div'),'long text',true);layer=doc.body.children.at(-1);assert.equal(layer.children[0].children[0].textContent,'Full answer');doc.listeners.keydown({key:'Escape',preventDefault(){}});assert.equal(layer.isConnected,false);
win.matchMedia=()=>({matches:true});ctx.openAnswerReader('long text',origin);layer=doc.body.children.at(-1);assert.equal(layer.children[1].children[0].textContent,'Resume');ctx.closeAnswerReader();
console.log('PASS: four-line threshold, automatic/new vs manual/history opening, safe clickable links, timed scroll, pause-on-touch, resume after manual scroll, Escape/cleanup/focus, 10 languages, reduced motion.');

// Notification placement and duration must not obstruct the composer.
const notice={classList:{shown:false,add(){this.shown=true},remove(){this.shown=false}},textContent:''};
const noticeState={};let noticeHandler=null,noticeTimer=null,noticeDelay=null;
const noticeContext={state:noticeState,$:()=>notice,inputEl:{addEventListener(event,fn){assert.equal(event,'focus');noticeHandler=fn}},clearTimeout:()=>{noticeTimer=null},setTimeout:(fn,delay)=>{noticeTimer=fn;noticeDelay=delay;return 1}};
vm.createContext(noticeContext);
const noticeStart=source.indexOf('function dismissNotice()'),noticeEnd=source.indexOf("inputEl.addEventListener('focus',dismissNotice);",noticeStart)+"inputEl.addEventListener('focus',dismissNotice);".length;
vm.runInContext(source.slice(noticeStart,noticeEnd),noticeContext);noticeContext.notify('Error');assert.equal(noticeDelay,1800);assert.equal(notice.classList.shown,true);noticeHandler();assert.equal(notice.classList.shown,false);assert.equal(noticeTimer,null);
assert.ok(html.includes('bottom:auto!important;pointer-events:none'));assert.ok(!source.includes("notify('Ai început o conversație nouă.')"));assert.ok(!source.includes("notify(state.language==='en'?'Conversation language:"));
console.log('PASS: no routine new-chat/language toast, top placement, no input interception, shorter duration, focus dismissal.');

// Exercise the actual chat submit handler across the browser/API boundary.
let sentChat=null,nextDistanceContext={pending_role:'destination',destination_query:'Amsterdam',origin_query:'',road_requested:true,candidates:[]};
const chatState={busy:false,conversationGeneration:1,currentView:'assistant',language:'ro',messages:[],location:{latitude:51.48,longitude:.28},distanceSearchContext:nextDistanceContext};
const chatInput={value:'Olanda',disabled:false,blur(){},focus(){}},chatSend={disabled:false};
const chatContext={selectedPlaceForRoute:()=>null,switchConversationModule:()=>{},isMapRouteFollowup:()=>false,validMapRoute:()=>false,coordinatesForRequest:async()=>({coordinates:chatState.location,locationIntent:false,error:null}),retainRouteResult:()=>{},state:chatState,inputEl:chatInput,sendBtn:chatSend,CLIENT_CONFIG:{maxMessageLength:4000,historyLimit:12},navigator:{},needsLocation:()=>false,setStatus:()=>{},addBubble:()=>({remove(){}}),notify:()=>{},console,fetch:async(url,init)=>{sentChat=JSON.parse(init.body);return {ok:true,json:async()=>({status:'success',reply:'Rută de test.',place_context:null,distance_context:nextDistanceContext})}}};
vm.createContext(chatContext);const submitStart=source.indexOf('async function submitMessage('),submitEnd=source.indexOf("$('chatForm').addEventListener('submit'",submitStart);vm.runInContext(source.slice(submitStart,submitEnd),chatContext);
await chatContext.submitMessage();assert.equal(sentChat.distance_context.destination_query,'Amsterdam');assert.equal(chatState.distanceSearchContext.pending_role,'destination');
nextDistanceContext=null;chatInput.value='1';await chatContext.submitMessage();assert.equal(chatState.distanceSearchContext,null);assert.equal(chatState.busy,false);
console.log('PASS: actual chat handler sends, retains and clears distance clarification context.');
// v107: execute the actual GPS helper with controlled browser callbacks.
let gpsSuccess=null,gpsError=null,gpsCalls=0,storageRemovals=0,timerCallbacks=new Map(),timerCounter=0;
const gpsState={location:null},gpsNav={geolocation:{getCurrentPosition(ok,fail){gpsCalls++;gpsSuccess=ok;gpsError=fail}}};
const gpsContext={state:gpsState,navigator:gpsNav,Date,Number,Promise,Error,sessionStorage:{removeItem(){storageRemovals++}},saveLocation(v){gpsState.location={...v,updatedAt:Date.now()}},locationErrorMessage:e=>Object.assign(new Error('GPS '+e.code),{code:e.code}),needsLocation:()=>false,setTimeout:(fn,ms)=>{assert.equal(ms,4000);timerCallbacks.set(++timerCounter,fn);return timerCounter},clearTimeout:id=>timerCallbacks.delete(id),console};
vm.createContext(gpsContext);const gpsStart=source.indexOf('function forgetSharedLocation()'),gpsEnd=source.indexOf('function needsLocation(',gpsStart);vm.runInContext(source.slice(gpsStart,gpsEnd),gpsContext);
let gpsRequest=gpsContext.coordinatesForRequest('Calculează distanța rutieră din locația mea');assert.equal(gpsCalls,1);gpsSuccess({coords:{latitude:51.48,longitude:.28,accuracy:12}});let gpsResult=await gpsRequest;assert.equal(gpsResult.coordinates.latitude,51.48);assert.equal(gpsResult.locationIntent,true);
let refresh=gpsContext.getCurrentCoordinates(true);gpsError({code:3});await assert.rejects(refresh);assert.equal(gpsContext.cachedCoordinates().latitude,51.48,'timeout does not erase GPS');
refresh=gpsContext.getCurrentCoordinates(true);gpsError({code:1});await assert.rejects(refresh);assert.equal(gpsState.location,null);assert.equal(storageRemovals,1,'revoked permission clears GPS');
let firstRefresh=gpsContext.getCurrentCoordinates(true),secondRefresh=gpsContext.getCurrentCoordinates(true),callsDuringRefresh=gpsCalls;gpsSuccess({coords:{latitude:51.49,longitude:.29,accuracy:10}});await Promise.all([firstRefresh,secondRefresh]);assert.equal(gpsCalls,callsDuringRefresh,'concurrent refreshes share one provider call');
gpsState.location=null;gpsRequest=gpsContext.coordinatesForRequest('Arată-mi un traseu pietonal');assert.ok(timerCallbacks.size);[...timerCallbacks.values()].at(-1)();gpsResult=await gpsRequest;assert.equal(gpsResult.coordinates,null);gpsSuccess({coords:{latitude:51.5,longitude:.3,accuracy:10}});await Promise.resolve();await Promise.resolve();gpsResult=await gpsContext.coordinatesForRequest('Arată-mi un traseu pietonal');assert.equal(gpsResult.coordinates.latitude,51.5,'late startup fix survives for next request');
gpsState.location.updatedAt=Date.now()-700000;assert.equal(gpsContext.cachedCoordinates(),null);
console.log('PASS: GPS initial wait, transient timeout retention, permission revocation, shared refresh, late fix reuse and cache expiry.');
// Draw only the provider geometry, using a mocked Leaflet surface rather than invented routes.
let drawnPoints=null,mapRemoved=false;
const mapInstance={invalidateSize(){},fitBounds(){},remove(){mapRemoved=true}};
win.L={map:()=>mapInstance,tileLayer:()=>({addTo(){}}),polyline(points){drawnPoints=points;return {addTo(){return this},getBounds(){return points}}},circleMarker:()=>({addTo(){}})};
const mapState={language:'ro'},mapContext={state:mapState,window:win,document:doc,URL,Number,Promise,Error,inputEl:new El('input'),closeAnswerReader(){},requestAnimationFrame:f=>{frames.set(++frameId,f);return frameId},setTimeout,clearTimeout,console};vm.createContext(mapContext);
const mapStart=source.indexOf('const ROUTE_MAP_TEXT='),mapEnd=source.indexOf('const READER_LABELS=',mapStart);vm.runInContext(source.slice(mapStart,mapEnd),mapContext);
const verifiedRoute={profile:'walk',coordinates:[[.28,51.48],[.3,51.479],[.323,51.478]],distanceMeters:1250};
assert.equal(mapContext.isMapRouteFollowup('Afișează pe hartă traseul sau traseele pe care trebuie să le urmez'),true);assert.equal(mapContext.isMapRouteFollowup('Afișează pe hartă traseul până la Paris'),false);
await mapContext.openRouteMap(verifiedRoute);assert.equal(drawnPoints.length,3);assert.equal(drawnPoints[0][0],51.48);assert.equal(drawnPoints[0][1],.28);assert.equal(doc.body.children.at(-1).attributes.role,'dialog');mapContext.closeRouteMap(false);assert.equal(mapRemoved,true);assert.equal(doc.body.children.at(-1).isConnected,false);
const invalidBodyCount=doc.body.children.length;await mapContext.openRouteMap({profile:'walk',coordinates:[]});assert.equal(doc.body.children.length,invalidBodyCount,'missing geometry never becomes a drawn straight line');
chatState.currentView='module';chatState.currentModule='maps';chatState.routeSearchContext={profile:'walk',destination_query:'grays shopping center',pending:'destination_detail'};chatInput.value='Grays UK';await chatContext.submitMessage();assert.equal(sentChat.module,'maps');assert.equal(sentChat.route_context.destination_query,'grays shopping center');
let mapOpened=0;
const mapInput={...chatInput,value:'Afișează pe hartă traseul sau traseele pe care trebuie să le urmez'};
const fastChat={...chatContext,state:{...chatState,busy:false,lastRoute:verifiedRoute,messages:[]},inputEl:mapInput,isMapRouteFollowup:mapContext.isMapRouteFollowup,validMapRoute:mapContext.validMapRoute,routeMapText:()=>({shown:'Traseu afișat.'}),openRouteMap:()=>{mapOpened++},fetch:async()=>{throw Error('Map follow-up must reuse the cached verified route')}};vm.createContext(fastChat);vm.runInContext(source.slice(submitStart,submitEnd),fastChat);await fastChat.submitMessage();assert.equal(mapOpened,1);
console.log('PASS: provider route map, coordinate order, missing-geometry rejection, module/context payload and map follow-up without another GPS/API round trip.');

// v108: weather context crosses the real submit boundary and clears on unrelated replies.
chatState.weatherSearchContext={query:'Oradea',period:'daily',offset:1,date:'',pending:false};
chatInput.value='Dar în Grays?';
chatContext.fetch=async(url,init)=>{sentChat=JSON.parse(init.body);return {ok:true,json:async()=>({status:'success',reply:'Forecast test',weather_context:{query:'Grays',period:'daily',offset:1,date:'',pending:false}})}};
await chatContext.submitMessage();assert.equal(sentChat.weather_context.query,'Oradea');assert.equal(chatState.weatherSearchContext.query,'Grays');
chatContext.fetch=async()=>({ok:true,json:async()=>({status:'success',reply:'General reply',weather_context:null})});
chatInput.value='Explică fotosinteza';await chatContext.submitMessage();assert.equal(chatState.weatherSearchContext,null);
assert.ok(source.includes('weatherContext:state.weatherSearchContext||null'));
assert.ok(source.includes('state.weatherSearchContext=item.weatherContext||null'));
assert.ok(source.includes('state.routeSearchContext=null;state.weatherSearchContext=null;'));
console.log('PASS: weather context sent, replaced, cleared, archived/restored and reset in actual client source.');

// v109: exercise actual module switching and actual showView with the same chat, GPS and context objects.
const moduleNodes=new Map();
function moduleNode(id){if(!moduleNodes.has(id)){const e=new El('div');e.id=id;e.classList={remove(){},toggle(){},add(){}};e.after=()=>{};e.before=()=>{};moduleNodes.set(id,e)}return moduleNodes.get(id)}
const moduleState={currentView:'assistant',currentModule:null,language:'ro',messages:[{role:'user',text:'Traseu către Lakeside'}],location:{latitude:51.48,longitude:.28},routeSearchContext:{profile:'walk',destination_query:'Lakeside'},conversationGeneration:9,moduleSearchGeneration:0,busy:true};
const sameMessages=moduleState.messages,sameLocation=moduleState.location,sameRoute=moduleState.routeSearchContext;
let destructiveCalls=0;
const handoffContext={state:moduleState,$:moduleNode,MODULES:{maps:{title:'Maps'},travel:{title:'Travel'}},UI_TEXT:{ro:{moduleTitle:{maps:'Hărți și trasee',travel:'Turism'}}},localizedModuleLead:k=>'lead '+k,closeRouteMap(){},closeAnswerReader(){},archiveCurrentConversation(){destructiveCalls++},resetChat(){destructiveCalls++},document:{querySelector:()=>null,querySelectorAll:()=>[]},window:{scrollTo(){}},views:[],chatControlsHome:moduleNode('controls'),moduleChatControls:moduleNode('moduleControls'),chatHomePlaceholder:moduleNode('placeholder'),sharedChatShell:moduleNode('shell'),newChatBtn:moduleNode('new'),messagesEl:moduleNode('messages'),requestAnimationFrame:fn=>fn(),renderHistory(){},Number};
vm.createContext(handoffContext);const viewStart=source.indexOf('function showView('),viewEnd=source.indexOf('function openModule(',viewStart);vm.runInContext(source.slice(viewStart,viewEnd),handoffContext);
handoffContext.switchConversationModule('maps');assert.equal(moduleState.currentModule,'maps');assert.equal(moduleState.currentView,'module');assert.equal(moduleNode('moduleTitle').textContent,'Hărți și trasee');
handoffContext.switchConversationModule('travel');assert.equal(moduleState.currentModule,'travel');assert.equal(moduleNode('moduleTitle').textContent,'Turism');
handoffContext.switchConversationModule('assistant');assert.equal(moduleState.currentView,'assistant');assert.equal(destructiveCalls,0);assert.equal(moduleState.messages,sameMessages);assert.equal(moduleState.location,sameLocation);assert.equal(moduleState.routeSearchContext,sameRoute);assert.equal(moduleState.conversationGeneration,9);
moduleState.lastPlaceResults=[{name:'First Hotel',latitude:1,longitude:2},{name:'Second Hotel',latitude:3,longitude:4,address:'Address'}];
assert.equal(handoffContext.selectedPlaceForRoute('Du-mă la al doilea hotel').latitude,3);assert.equal(handoffContext.selectedPlaceForRoute('Walking route to hotel 1').latitude,1);assert.equal(handoffContext.selectedPlaceForRoute('Ce este hotelul 2?'),null);assert.equal(handoffContext.selectedPlaceForRoute('Du-mă pe prima stradă'),null);
moduleState.pendingRouteDestination={latitude:6,longitude:7,label:'Selected detail'};assert.equal(handoffContext.selectedPlaceForRoute('Localized route action').latitude,6);assert.equal(moduleState.pendingRouteDestination,null);
// Real submitted payload selects exact hotel coordinates and consumes the localized quick-start flag.
chatContext.selectedPlaceForRoute=handoffContext.selectedPlaceForRoute;let switchedTo=null;chatContext.switchConversationModule=k=>{switchedTo=k};
chatInput.value='Du-mă la al doilea hotel';chatContext.fetch=async(url,init)=>{sentChat=JSON.parse(init.body);return {ok:true,json:async()=>({status:'success',reply:'Route result',recommended_module:'maps'})}};
await chatContext.submitMessage();assert.equal(sentChat.route_destination.latitude,3);assert.equal(sentChat.route_profile,'walk');assert.equal(switchedTo,'maps');
chatState.pendingRouteStart=true;chatInput.value='Itinéraire à pied';await chatContext.submitMessage();assert.equal(sentChat.route_start,true);assert.equal(sentChat.route_profile,'walk');assert.equal(chatState.pendingRouteStart,false);
// Navigation uses the selected endpoint, explicit travel mode, and navigate action.
const navigateRoute={...verifiedRoute,origin:{location_source:'gps'},destination:{latitude:51.488,longitude:.283},steps:[{text:'Mergi pe London Road.',distanceMeters:300},{text:'Ai ajuns.',distanceMeters:0}]};
let navUrl=new URL(mapContext.routeNavigationUrl(navigateRoute,true));assert.equal(navUrl.searchParams.get('dir_action'),'navigate');assert.equal(navUrl.searchParams.get('travelmode'),'walking');assert.equal(navUrl.searchParams.get('destination'),'51.488,0.283');assert.equal(navUrl.searchParams.has('origin'),false);
navUrl=new URL(mapContext.routeNavigationUrl({...navigateRoute,profile:'drive',origin:{label:'Explicit departure'}},true));assert.equal(navUrl.searchParams.get('travelmode'),'driving');assert.equal(navUrl.searchParams.get('origin'),'51.48,0.28');
await mapContext.openRouteMap(navigateRoute);const routeLayer=doc.body.children.at(-1),directions=routeLayer.children.at(-1);assert.equal(directions.className,'route-directions');assert.equal(directions.children[1].children.length,2);assert.ok(directions.children[1].children[0].textContent.includes('London Road'));assert.equal(directions.children[1].children.at(-1).textContent,'Ai ajuns.');assert.ok(routeLayer.children.some(e=>e.href?.includes('dir_action=navigate')));mapContext.closeRouteMap(false);
for(const language of ['ro','en','fr','de','it','es','pt','nl','ru','pl']){mapState.language=language;for(const key of ['navigate','steps','noSteps','walking','prompt','note'])assert.ok(mapContext.routeActionsText()[key]);}
// Execute the place-details action: a label must not replace the selected coordinates with another POI.
let detailSubmit=0;const detailBody=new El('body'),detailContext={state:{busy:false,moduleSearchResults:[]},document:{...doc,querySelector:()=>null},$:id=>id==='moduleLayerBody'?detailBody:moduleNode(id),quickUiText:()=>({location:'Location',category:'Category',unspecified:'Unknown',distance:'Distance',coordinates:'Coordinates',openMap:'Map',backResults:'Back',placeDetails:'Details'}),detailLabels:()=>({address:'Address'}),mountPlaceLogo(){},enrichPlaceWebsite(){},appendPlaceWebsite(){},localizedPlaceCategory:v=>v,formatDistance:v=>String(v),routeActionsText:()=>({walking:'Walking route',prompt:'Walking route to '}),inputEl:{value:''},submitMessage(){detailSubmit++},renderModulePlaces(){},Number};
vm.createContext(detailContext);const detailStart=source.indexOf('function renderModulePlaceDetails('),detailEnd=source.indexOf('const QUICK_SEARCH_ENGLISH=',detailStart);vm.runInContext(source.slice(detailStart,detailEnd),detailContext);
detailContext.renderModulePlaceDetails({name:'Chosen Hotel',address:'Address',latitude:51.49,longitude:.3});detailBody.children[1].onclick();assert.equal(detailSubmit,1);assert.equal(detailContext.state.pendingRouteDestination.latitude,51.49);assert.equal(detailContext.inputEl.value,'Walking route to Chosen Hotel');
console.log('PASS: actual module transfer preserves chat/GPS/generation; exact hotel ordinal/detail selection; localized walking start payload; street list/map coexist; Google Maps navigation links and 10-language controls.');

const quickContext={state:{moduleSearchBusy:false},$:moduleNode,inputEl:{value:''},routeActionsText:()=>({walking:'Itinéraire à pied'}),submitMessage:async()=>{quickContext.submitted=true}};
vm.createContext(quickContext);const quickStart=source.indexOf('async function runModuleSearch('),quickEnd=source.indexOf('function handleModuleLayerBack(',quickStart);vm.runInContext(source.slice(quickStart,quickEnd),quickContext);await quickContext.runModuleSearch({kind:'walking'});assert.equal(quickContext.inputEl.value,'Itinéraire à pied');assert.equal(quickContext.state.pendingRouteStart,true);assert.equal(quickContext.submitted,true);
console.log('PASS: actual pedestrian quick action enters the shared chat with localized text and explicit walking intent.');

// Choosing a variant redraws its geometry, street steps and external navigation together.
mapState.language='ro';
const altA={...navigateRoute,id:'balanced',label:'Standard',durationSeconds:1800},altB={...navigateRoute,id:'via',label:'Prin Chafford Hundred',distanceMeters:2600,durationSeconds:2100,coordinates:[[.28,51.48],[.29,51.489],[.283,51.488]],via:[{latitude:51.489,longitude:.29,label:'Chafford Hundred'}],steps:[{text:'Mergi prin Chafford Hundred.',distanceMeters:100}]};
mapState.lastRouteOptions=[altA,altB];mapState.lastRoute=altA;
await mapContext.openRouteMap(altA);let optionsLayer=doc.body.children.at(-1),select=optionsLayer.querySelectorAll('select')[0];assert.equal(select.children.length,2);assert.ok(select.children[1].textContent.includes('2,6 km'));select.value='1';select.onchange();await new Promise(resolve=>setImmediate(resolve));optionsLayer=doc.body.children.at(-1);assert.equal(mapState.lastRoute.id,'via');assert.equal(drawnPoints[1][0],51.489);assert.equal(drawnPoints[1][1],.29);assert.equal(optionsLayer.children.at(-1).children[1].children[0].textContent,'Mergi prin Chafford Hundred. · 100 m');let selectedNav=optionsLayer.children.find(e=>e.href?.includes('dir_action=navigate'));assert.equal(new URL(selectedNav.href).searchParams.get('waypoints'),'51.489,0.29');mapContext.closeRouteMap(false);
let compared=0;mapContext.submitMessage=()=>{compared++};const controls=mapContext.routeOptionsControl(altB,[altA,altB]),compareButton=controls.querySelectorAll('button')[0];assert.equal(controls.querySelectorAll('input').length,0,'a visitor never needs an intermediate point');compareButton.onclick();assert.equal(compared,1);assert.equal(mapState.pendingRouteCompare,true);assert.equal(mapState.routeSearchContext.destination.label,altB.destination.label);assert.equal(mapState.routeSearchContext.via_query,undefined);assert.equal(mapContext.inputEl.value,'Caută alte trasee pietonale');
chatState.pendingRouteCompare=true;chatInput.value='Caută alte trasee pietonale';await chatContext.submitMessage();assert.equal(sentChat.route_compare,true);assert.equal(chatState.pendingRouteCompare,false);
for(const language of ['ro','en','fr','de','it','es','pt','nl','ru','pl']){mapState.language=language;assert.equal(mapContext.routeOptionsText().length,3);assert.ok(mapContext.routeOptionsText().every(v=>v.length>0));}
console.log('PASS: alternative selector synchronizes geometry/directions/navigation, waypoint remains in Google Maps URL, automatic search retains destination without a waypoint form, actual submit sends route_compare, 10-language alternative controls.');
