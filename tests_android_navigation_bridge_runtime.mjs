import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const code=readFileSync('android/app/src/main/assets/navigation-background.js','utf8');
let events=[],alerts=[],navigationRestored=0;
const elements=[];
const host={children:[],append(node){node.parentNode=this;this.children.push(node)},};
const body={children:[],append(node){node.parentNode=this;this.children.push(node)}};
const document={
 body,documentElement:{},
 getElementById(id){
  if(id==='moduleLayerBody')return host;
  if(id==='moduleContent')return null;
  return [...host.children,...body.children].find(n=>n.id===id)||null;
 },
 createElement(tag){
  const node={tag,style:{},parentNode:null,textContent:'',id:'',
   setAttribute(){},append(...parts){this.children.push(...parts);parts.forEach(p=>p.parentNode=this)},
   children:[],remove(){if(this.parentNode)this.parentNode.children=
    this.parentNode.children.filter(n=>n!==this);this.parentNode=null}};
  elements.push(node);return node;
 },
 addEventListener(){}
};
const cache=new Map();
const localStorage={getItem:k=>cache.get(k)||null,setItem:(k,v)=>cache.set(k,v),
 removeItem:k=>cache.delete(k)};
const state={currentModule:'maps',language:'ro',
 selectedTransitJourney:{legs:[{mode:'bus',lineNames:['141'],from:'Zetarilor',
  to:'Cimitirul Serban Voda',departureTime:'2026-11-17T06:11:00Z',
  arrivalTime:'2026-11-17T06:23:00Z'}]},
 lastTransitResponse:{transit_destination_point:{label:'Sura Mare'}}};
const window={
 crypto:{randomUUID:()=> '01234567-89ab-cdef-0123-456789abcdef'},
 PocketAndroidNavigation:{postMessage:s=>events.push(JSON.parse(s))},
 addEventListener(){},alert:s=>alerts.push(s)
};
const globals={window,document,state,localStorage,MutationObserver:class{observe(){}},
 requestAnimationFrame:f=>f(),switchConversationModule:kind=>{state.currentModule=kind},
 renderTransitChoices:()=>{navigationRestored++}};
vm.runInNewContext(code,globals);
const action=()=>document.getElementById('pocket-navigation-background-action');
assert.match(action().textContent,/Pornește navigația/);
assert.equal(events.length,0,'Selection alone must not start background GPS');
action().onclick();
assert.equal(events.length,1);
assert.equal(events[0].action,'start');
assert.equal(events[0].destination,'Sura Mare');
assert.equal(events[0].mode,'mixed');
const id=events[0].sessionId;
assert.ok(cache.has('pocket_navigation_session_v1'));
window.pocketNativeNavigationAck(true,id);
assert.match(action().textContent,/Oprește navigația/);
const record=JSON.parse(cache.get('pocket_navigation_session_v1'));
state.selectedTransitJourney=null;
assert.equal(window.pocketNativeNavigationResume(id),true);
assert.ok(document.getElementById('pocket-navigation-restore'),
 'Notification must open the route-only resume panel');
assert.equal(state.currentModule,'maps');
assert.equal(state.selectedTransitJourney.legs[0].lineNames[0],'141');
assert.equal(window.pocketNativeNavigationResume('different-session'),false,
 'Never open unrelated route snapshot');
window.pocketNativeNavigationStopped();
assert.equal(cache.has('pocket_navigation_session_v1'),false);
assert.equal(document.getElementById('pocket-navigation-restore'),null);
state.currentModule='education';
window.dispatchEvent?.('pocket-navigation-changed');
console.log('PASS: Native WebView route opt-in, session restore, notification stop and stale-route cleanup');
