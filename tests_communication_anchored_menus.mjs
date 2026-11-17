import assert from 'node:assert/strict';
import vm from 'node:vm';
import {ORACLE_COMMUNICATION_SCRIPT as js,ORACLE_COMMUNICATION_STYLE as css}
 from './oracle_communication_ui.mjs';

new vm.Script(js,{filename:'chat-anchored-menus.js'});
const excerpt=(begin,end)=>{
 const a=js.indexOf(begin),b=js.indexOf(end,a+begin.length);
 assert(a>=0&&b>a,'Missing '+begin);
 return js.slice(a,b);
};
const widget=excerpt('function placeCommunicationChoices(','function showVoiceDeleteOptions(');
const render=excerpt('async function refreshMessages(){','function resizeChatViewport(){');
const voice=excerpt('function buildInlineVoice(','\nconst voiceBtn=makeBtn(');
const options=excerpt('function showMessageActions(','\n// Receipt acknowledgement');
assert.match(js,/function showVoiceDeleteOptions\(message,peer,anchor\)/);
assert.match(js,/function showVoiceSaveOptions\(message,peer,anchor\)/);
assert.match(options,/return showVoiceChoiceMenu\(options,\{anchor,placement:'below',side:mine\?'right':'left'\}\)/);
assert.match(voice,/showVoiceDeleteOptions\(message,peer,trash\)/);
assert.match(voice,/showVoiceSaveOptions\(message,peer,more\)/);
assert.match(render,/showMessageActions\(message,peer,visibleText,menu\)/);
assert.match(js,/\],\{anchor:attachButton,placement:'above',side:'left'\}\)/);
assert.match(js,/\],\{anchor:chatMore,placement:'below',side:'right'\}\)/);
assert.match(js,/anchor\.closest\('\.comm-message'\)/,'Place menu by the bubble, not ellipsis');
assert.match(js,/dialog\.style\.setProperty\(property,value,'important'\)/,
 'Menu overrides legacy centred modal positioning');
assert.match(css,/dialog\.comm-voice-choice-menu\[open\]\{[\s\S]*?position:fixed!important;inset:auto!important/,
 'Modal anchored as a top-layer fixed popup');
assert.match(css,/#view-communication \.comm-transcript>\.comm-message,[\s\S]*?flex:0 0 auto!important;flex-shrink:0!important/,
 'Message rows cannot vertically shrink when conversation grows');
assert.match(css,/height:auto!important;max-height:none!important;min-height:max-content!important/,
 'Full height of wrapped message is preserved');
assert.match(css,/\.comm-message--text \.comm-message-body,[\s\S]*?overflow:visible!important;overflow-wrap:anywhere!important/,
 'Long text wraps fully without drawing outside the bubble');
assert.match(css,/\.comm-message--text\.mine \.comm-message-menu,[\s\S]*?left:calc\(100% \+ 5px\)!important;right:auto!important/,
 'Ellipsis stays after sent message, not before it');

const viewport={clientWidth:700,clientHeight:850};
const document={documentElement:viewport};
const window={innerWidth:700,innerHeight:850,getComputedStyle:()=>({paddingBottom:'6px'})};
const transcript={scrollTop:0,style:{paddingBottom:''},contains:()=>false};
const fn=new Function('document','window','transcript',
 excerpt('function placeCommunicationChoices(','function showVoiceChoiceMenu(')+
 ';return placeCommunicationChoices;')(document,window,transcript);
const createMenu=(width,height)=>{
 const props={},listeners={};
 const dialog={
  offsetWidth:width,offsetHeight:height,
  getBoundingClientRect:()=>({width,height}),
  style:{setProperty(name,value){props[name]=value}},
  addEventListener(name,handler){(listeners[name]??=[]).push(handler)}
 };
 return {dialog,props,listeners};
};
const makeAnchor=(rect)=>({
 getBoundingClientRect:()=>({...rect}),
 closest:()=>null
});
let {dialog,props}=createMenu(185,110);
fn(dialog,{anchor:makeAnchor({left:420,right:640,top:220,bottom:335}),placement:'below',side:'right'});
assert.equal(props.left,'455px','Outgoing popup aligns with message right edge');
assert.equal(props.top,'341px','Outgoing popup appears BELOW the message');
assert.equal(props.margin,'0');
({dialog,props}=createMenu(170,85));
fn(dialog,{anchor:makeAnchor({left:28,right:255,top:260,bottom:318}),placement:'below',side:'left'});
assert.equal(props.left,'28px','Incoming popup aligns with message left edge');
assert.equal(props.top,'324px','Incoming popup appears BELOW the message');
({dialog,props}=createMenu(195,135));
fn(dialog,{anchor:makeAnchor({left:17,right:170,top:735,bottom:785}),placement:'above',side:'left'});
assert.equal(props.left,'17px','Attachment popup aligns with left paperclip');
assert.equal(props.top,'594px','Attachment options appear ABOVE the paperclip');

// When a recent message is at the bottom, create temporary scroll room so the
// menu can stay below it, and release that room after closing the popup.
transcript.contains=()=>true;
transcript.scrollTop=0;transcript.style.paddingBottom='';
const scrollingAnchor={
 getBoundingClientRect:()=>({left:25,right:620,top:750-transcript.scrollTop,bottom:815-transcript.scrollTop}),
 closest:()=>null
};
let x=createMenu(200,130);({dialog,props}=x);
fn(dialog,{anchor:scrollingAnchor,placement:'below',side:'right'});
assert.ok(transcript.scrollTop>0,'Chat scrolls to expose a below-message popup');
const bottom=scrollingAnchor.getBoundingClientRect().bottom;
assert.equal(parseInt(props.top),Math.round(bottom+6),'Popup stays immediately under its scrolled source');
assert.ok(parseInt(props.top)+130<=850,'Popup remains inside the viewport');
assert.ok(transcript.style.paddingBottom.endsWith('px'));
for(const cb of x.listeners.close||[])cb();
assert.equal(transcript.style.paddingBottom,'','Temporary scroll space removed on close');

// Extremely short received messages have natural width; long messages are
// allowed to grow vertically rather than being squeezed to one fixed height.
assert.match(css,/width:max-content!important;max-width:calc\(100% - 45px\)!important/,
 'Text width is natural up to the available room');
assert.match(css,/display:block!important;flex:0 0 auto!important;[\s\S]*?min-height:max-content!important/,
 'Content keeps its intrinsic height');
console.log('PASS anchored chat actions: sender-right, recipient-left, paperclip-above, bottom scrolling, no flex text overlap');
