import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ORACLE_COMMUNICATION_SCRIPT,ORACLE_COMMUNICATION_STYLE} from './oracle_communication_ui.mjs';

// Hoteluri is the source of a route that temporarily uses the shared Maps engine.
// Repeated Back must return to Hoteluri, not strand the user in Maps.
const source=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const begin=source.indexOf('function returnToModuleLanding(){');
const end=source.indexOf('function handleModuleLayerBack(){',begin);
assert.ok(begin>=0&&end>begin,'Module Back implementation must exist');
const block=source.slice(begin,end);
const makeReturn=new Function('state','returnToNavigationSource','$','document','renderModuleLandingChoices',
 block+';return returnToModuleLanding;');
const state={currentView:'module',currentModule:'maps',navigationReturnContext:{view:'module',module:'travel'}};
let restored=0,rendered=0;
const fakeLayer={classList:{remove(){}},setAttribute(){}};
const fakeBody={style:{cssText:''},replaceChildren(){}};
const fakeSheet={classList:{remove(){}}};
const go=makeReturn(state,()=>{
 restored++;
 state.currentModule='travel';
},id=>id==='moduleQuickLayer'?fakeLayer:fakeBody,
 {querySelector:()=>fakeSheet},()=>{rendered++});
go();
assert.equal(restored,1,'Back from route handoff must restore Hoteluri');
assert.equal(state.currentModule,'travel','Hotels module is restored');
assert.equal(rendered,0,'Do not render Maps landing');
state.navigationReturnContext=null;
go();
assert.equal(rendered,1,'Normal Hoteluri landing still works');
assert.equal(restored,1,'No phantom handoff when context was cleared');

const nativeStart=source.indexOf('window.pocketAndroidBack=function(){');
const nativeEnd=source.indexOf('const LEARNING_SUBJECTS=',nativeStart);
assert.ok(nativeStart>0&&nativeEnd>nativeStart);
const native=source.slice(nativeStart,nativeEnd);
assert.match(native,/state\.currentView==='module'&&state\.currentModule==='maps'&&state\.navigationReturnContext\?\.module==='travel'/,
 'Android Back restores Hoteluri when a hotel route has handed off to Hărți');
assert.match(native,/state\.currentView==='communication'&&window\.pocketCommunicationCloseChat\?\.\(\)/,
 'Android Back exits fullscreen private chat before navigating elsewhere');
assert.match(ORACLE_COMMUNICATION_SCRIPT,/window\.pocketCommunicationCloseChat=/,
 'Private chat provides its own return action');
assert.match(ORACLE_COMMUNICATION_STYLE,/#view-communication\.view\.comm-chat-expanded\.active/,
 'Fullscreen only when private chat is selected');
assert.match(ORACLE_COMMUNICATION_STYLE,/font-size:14px!important;line-height:1\.36!important/,
 'Messages are compact but readable');
assert.match(ORACLE_COMMUNICATION_STYLE,/height:var\(--comm-chat-screen-height,100dvh\)!important/,
 'Fullscreen follows visible keyboard-safe viewport');
assert.match(ORACLE_COMMUNICATION_STYLE,/grid-column:1\/-1!important;grid-row:1!important/,
 'Message composer has full available width');
console.log('PASS: Hoteluri route Back restores Hoteluri; private chat fullscreen and Android Back remain scoped');
