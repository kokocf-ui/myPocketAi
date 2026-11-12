import assert from 'node:assert/strict';
import vm from 'node:vm';
import {NAV_RETURN_ACCENT_CSS,NAV_RETURN_ACCENT_SCRIPT} from './navigation_return_accent.mjs';
import {COMMUNICATION_STYLE,COMMUNICATION_SCRIPT} from './communication_ui.mjs';

class Node {
 constructor(tag='div',label='',id=''){
  this.tagName=tag.toUpperCase();this.nodeType=1;this._label=label;this.id=id;
  this.children=[];this.parentElement=null;this.width=340;this.isConnected=true;
  this.attrs={};this.classes=new Set();
  this.classList={add:(...xs)=>xs.forEach(x=>this.classes.add(x)),
   remove:(...xs)=>xs.forEach(x=>this.classes.delete(x)),
   contains:x=>this.classes.has(x),
   toggle:(x,on)=>{if(on===undefined)on=!this.classes.has(x);if(on)this.classes.add(x);else this.classes.delete(x);return on}};
 }
 get textContent(){return this._label+this.children.map(x=>x.textContent).join('')}
 set textContent(x){this._label=String(x);this.children=[]}
 getAttribute(x){return this.attrs[x]||null}
 hasAttribute(x){return Object.hasOwn(this.attrs,x)}
 matches(selector){return selector==='[data-nav]'&&this.hasAttribute('data-nav')}
 closest(selectors){
  const names=selectors.split(',').map(s=>s.trim().replace(/^\./,''));
  for(let n=this;n;n=n.parentElement)if(names.some(x=>n.classList.contains(x)))return n;
  return null;
 }
 append(...children){for(const child of children){child.remove();child.parentElement=this;child.isConnected=true;this.children.push(child)}}
 remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(x=>x!==this);this.parentElement=null;this.isConnected=false}
 insertBefore(child,reference){child.remove();child.parentElement=this;child.isConnected=true;const at=reference?this.children.indexOf(reference):-1;this.children.splice(at<0?this.children.length:at,0,child)}
 get firstChild(){return this.children[0]||null}
 querySelectorAll(selector){
  const all=this.children.flatMap(x=>[x,...x.querySelectorAll('*')]);
  if(selector==='*')return all;
  if(selector==='button')return all.filter(x=>x.tagName==='BUTTON');
  return [];
 }
 querySelector(selector){
  if(selector==='.module-actions-row')return this.querySelectorAll('*').find(x=>x.classList.contains('module-actions-row'))||null;
  if(selector==='button.pocket-inline-back')return this.querySelectorAll('button').find(x=>x.classList.contains('pocket-inline-back'))||null;
  if(selector==='#moduleContent')return this.querySelectorAll('*').find(x=>x.id==='moduleContent')||null;
  if(selector==='#moduleContent .education-toolbar:not(.math-navigation)')return this.querySelectorAll('*').find(x=>x.classList.contains('education-toolbar')&&!x.classList.contains('math-navigation'))||null;
  if(selector==='button.module-result-card')return this.querySelectorAll('button').find(x=>x.classList.contains('module-result-card'))||null;
  return null;
 }
 contains(x){return this===x||this.children.some(c=>c.contains(x))}
 getBoundingClientRect(){return {width:this.width}}
}
const body=new Node('body');
const root=new Node('section','','view-module');root.classList.add('learning-active','learning-languages');
const actions=new Node('div');actions.classList.add('module-actions-row');actions.width=345;
const home=new Node('button','← Acasă');home.classList.add('module-home-btn');
const title=new Node('h2','Limbi străine');
actions.append(home);const content=new Node('div','','moduleContent');
const bar=new Node('div');bar.classList.add('education-toolbar');
const back=new Node('button','← Înapoi');back.classList.add('secondary-btn');
let clicks=0;back.onclick=()=>clicks++;
const prints=new Node('div');prints.classList.add('edu-pdf-actions');
const pdf=new Node('button','Salvează PDF');prints.append(pdf);
bar.append(back,prints);content.append(bar);root.append(actions,title,content);body.append(root);

const quick=new Node('div','','moduleQuickLayer');
const sheet=new Node('section');sheet.classList.add('module-quick-sheet');
const layerTitle=new Node('h2','Alege plecarea','moduleLayerTitle');
const layerBody=new Node('div','','moduleLayerBody');
const place=new Node('button','Locația mea (GPS)');place.classList.add('module-result-card');
const layerBack=new Node('button','← Anterior','moduleLayerBack');
const formBack=new Node('button','Înapoi');formBack.classList.add('module-result-card');
layerBody.append(place,formBack);sheet.append(layerTitle,layerBack,layerBody);quick.append(sheet);body.append(quick);
const bottom=new Node('nav');bottom.classList.add('bottom-nav');
bottom.append(new Node('button','Acasă'));body.append(bottom);
const search=new Node('button','Caută variante de transport');
const confirm=new Node('button','Confirmă localitatea / adresa');
const send=new Node('button','➤');send.classList.add('send-btn');
body.append(search,confirm,send);
const doc={body,querySelector:s=>s==='#moduleQuickLayer .module-quick-sheet'?sheet:null,
 getElementById:id=>({view_module:root,'view-module':root,moduleLayerTitle:layerTitle,moduleLayerBody:layerBody}[id]||null)};
let observer;
class MockObserver{constructor(cb){this.cb=cb;observer=this}observe(){}}
const window={addEventListener(){}};
vm.runInNewContext(NAV_RETURN_ACCENT_SCRIPT,{document:doc,window,MutationObserver:MockObserver});
assert.ok(home.classList.contains('pocket-nav-return'),'Home recognized');
assert.ok(back.classList.contains('pocket-nav-return'),'Education Back recognized');
assert.ok(back.classList.contains('pocket-nav-text'),'Text Back receives consistent textual dimensions');
assert.ok(home.classList.contains('pocket-nav-text'),'Text Home shares Back dimensions');
assert.ok(layerBack.classList.contains('pocket-nav-return'),'Anterior recognized as Back');
assert.ok(formBack.classList.contains('pocket-nav-return'),'Last destination form Back recognized');
assert.equal(back.parentElement,actions,'Education Back moves next to Home when space permits');
assert.ok(actions.classList.contains('pocket-inline-nav'),'Both navigation buttons share a row');
back.onclick();assert.equal(clicks,1,'Existing Back handler preserved');
assert.ok(sheet.classList.contains('pocket-route-entry'),'Departure cards tagged for petrol styling');
assert.ok(!place.classList.contains('pocket-nav-return'),'Departure remains an option, not navigation');
assert.ok(!pdf.classList.contains('pocket-nav-return'),'PDF keeps original color');
assert.ok(!search.classList.contains('pocket-nav-return'),'Transport search keeps original color');
assert.ok(!confirm.classList.contains('pocket-nav-return'),'Confirm is not navigation');
assert.ok(!send.classList.contains('pocket-nav-return'),'Assistant send keeps blue');
assert.match(NAV_RETURN_ACCENT_CSS,/min-height:50px!important/,'Text navigation has equal minimum height');
assert.ok(!bottom.children[0].classList.contains('pocket-nav-return'),'Bottom dock not recolored');

actions.width=235;
observer.cb([{type:'childList',target:actions,addedNodes:[]}]);
assert.equal(back.parentElement,bar,'Back restores to its own toolbar on narrow viewport');
assert.ok(!actions.classList.contains('pocket-inline-nav'));
assert.match(NAV_RETURN_ACCENT_CSS,/\.pocket-route-entry #moduleLayerBody button\.module-result-card:not\(\.pocket-nav-return\)/);
assert.match(NAV_RETURN_ACCENT_CSS,/#view-assistant \.chat-form > \.send-btn/);
assert.match(NAV_RETURN_ACCENT_CSS,/place-items:center!important/);
assert.match(NAV_RETURN_ACCENT_CSS,/\.pocket-inline-nav > \.module-home-btn/);
assert.match(COMMUNICATION_STYLE,/pocket-route-entry/,'Main stylesheet includes fix');
assert.match(COMMUNICATION_SCRIPT,/pocketReturnAccentInstalled/,'Main script includes fix');
new vm.Script(NAV_RETURN_ACCENT_SCRIPT);
console.log('PASS navigation accent scoped; journey petrol; Education Home/Back same row responsive; Assistant send centered');
