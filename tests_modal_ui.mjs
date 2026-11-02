import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';

const html=await(await frontend.fetch(new Request('https://fixture/'))).text();
const source=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(source,'frontend browser script exists');
new vm.Script(source);

class FakeNode{
 constructor(tag,doc){
  this.tag=tag;this.ownerDocument=doc;this.children=[];this.childNodes=this.children;
  this.parentNode=null;this.dataset={};this.listeners={};this.textContent='';this.isConnected=false;
  const classes=new Set();this.classList={add:c=>classes.add(c),remove:c=>classes.delete(c),contains:c=>classes.has(c)};
 }
 append(...nodes){for(const node of nodes){if(node.parentNode){const siblings=node.parentNode.children;const i=siblings.indexOf(node);if(i>=0)siblings.splice(i,1)}node.parentNode=this;node.isConnected=true;this.children.push(node)}}
 replaceChildren(...nodes){for(const node of this.children){node.parentNode=null;node.isConnected=false}this.children.length=0;this.append(...nodes)}
 addEventListener(type,fn){(this.listeners[type]??=[]).push(fn)}
 dispatch(type,event={}){for(const fn of this.listeners[type]||[])fn({preventDefault(){},target:this,...event})}
 focus(){this.focused=true}
 setAttribute(name,value){(this.attributes??={})[name]=value}
 querySelector(selector){if(selector.includes('caption'))return this.children.find(x=>x.tag==='caption')||null;return null}
 querySelectorAll(){return []}
 click(){this.dispatch('click')}
 replaceWith(...nodes){if(!this.parentNode)return;const parent=this.parentNode;const i=parent.children.indexOf(this);parent.children.splice(i,1,...nodes);this.parentNode=null;this.isConnected=false;for(const n of nodes){n.parentNode=parent;n.isConnected=true}}
}
const document={createElement(tag){return new FakeNode(tag,document)},body:new FakeNode('body',null),addEventListener(){}};
const dialog=new FakeNode('dialog',document);dialog.open=false;dialog.shows=0;
dialog.showModal=()=>{dialog.open=true;dialog.shows++};
dialog.close=()=>{dialog.open=false;dialog.dispatch('close')};
const content=new FakeNode('div',document),title=new FakeNode('strong',document),close=new FakeNode('button',document);
const elements={longChoiceDialog:dialog,longChoiceContent:content,longChoiceTitle:title,longChoiceClose:close};
const state={language:'ro',conversationGeneration:0,routeSearchContext:{pending:'profile',destination_query:'Victoria station'},busy:false};
const ctx={document,state,messagesEl:{isConnected:true,querySelectorAll(){return []}},$:id=>elements[id],console,MutationObserver:class{observe(){}}};
vm.createContext(ctx);
const from=source.indexOf('let longChoiceOpener=null;'),to=source.indexOf(' const sharedChatShell=',from);
assert.ok(from>=0&&to>from,'native dialog setup present');
vm.runInContext(source.slice(from,to),ctx);
const modes=source.indexOf('const TRAVEL_MODE_TEXT='),modesEnd=source.indexOf('const TRANSIT_LAYOUT_TEXT=',modes);
assert.ok(modes>=0&&modesEnd>modes,'travel mode rendering present');
vm.runInContext(source.slice(modes,modesEnd),ctx);

const host=new FakeNode('div',document);
const data={needs_travel_mode:true,route_context:{...state.routeSearchContext},straight_line_distance_km:25,reply:'Cum vrei să ajungi?'};
assert.equal(ctx.appendTravelModeChoices(data,host),true);
assert.equal(host.children.length,1,'table must be outside the chat bubble');
assert.equal(host.children[0].tag,'button','chat shows only a modal opener');
const trigger=host.children[0];assert.match(trigger.textContent,/Cum vrei să ajungi/);
trigger.click();
assert.equal(dialog.open,true,'first tap must show dialog');
assert.equal(dialog.shows,1);
const table=content.children[0],rows=table.children.find(x=>x.tag==='tbody').children;
assert.equal(table.tag,'table');
assert.equal(rows.length,2,'walking over five kilometres is omitted but transit and car remain');
ctx.closeLongChoice();
assert.equal(dialog.open,false);
trigger.click();
assert.equal(dialog.open,true,'reopen works on first tap');
assert.equal(dialog.shows,2);
ctx.closeLongChoice();

const locations=Array.from({length:8},(_,i)=>({label:'Location '+(i+1),latitude:51+i/1000,longitude:.2+i/1000,distance_km:i+1}));
const choicesHost=new FakeNode('div',document);
assert.equal(ctx.appendConversationChoices({named_venue:true,choice_options:locations},choicesHost),true);
assert.equal(choicesHost.children.length,1,'location results must be in one modal');
choicesHost.children[0].click();
assert.equal(dialog.open,true);
const locationTable=content.children[0];
assert.equal(locationTable.children.find(x=>x.tag==='tbody').children.length,8,'all eight options available');
assert.ok(locationTable.children.find(x=>x.tag==='tbody').children.every(row=>!row.hidden),'no hidden rows in modal');
ctx.closeLongChoice();
console.log('PASS native modal: first tap, reopen, transport options, and all eight location choices.');
