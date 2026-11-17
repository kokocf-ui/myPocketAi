import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseJourneyExpression} from './assistant_bare_destination.mjs';

const source=readFileSync(new URL('./one_field_journey_ui.mjs',import.meta.url),'utf8');
const begin=source.indexOf('function showOneFieldJourney(');
const end=source.lastIndexOf(String.fromCharCode(96,59));
assert.ok(begin>0&&end>begin,'Complete Android destination UI exists');
const script=source.slice(begin,end);

class Element {
 constructor(doc){this.doc=doc;this.parentElement=null;this.children=[];this.style={};
  this.value='';this.events=new Map();this._text='';this.attrs={};const classes=new Set();
  this.classList={add:x=>classes.add(x),remove:x=>classes.delete(x),contains:x=>classes.has(x)};
 }
 get isConnected(){return this===this.doc.body||Boolean(this.parentElement?.isConnected)}
 contains(el){for(let p=el;p;p=p.parentElement)if(p===this)return true;return false}
 blur(){this.blurred=true}
 focus(){this.focused=true}
 set textContent(x){this._text=String(x)}
 get textContent(){return this._text}
 addEventListener(type,fn){this.events.set(type,[...(this.events.get(type)||[]),fn])}
 removeEventListener(type,fn){this.events.set(type,(this.events.get(type)||[]).filter(x=>x!==fn))}
 setAttribute(k,v){this.attrs[k]=v}
 append(...items){for(const el of items){this.children.push(el);el.parentElement=this}}
 replaceChildren(...items){for(const el of this.children)el.parentElement=null;this.children=[];this.append(...items)}
 emit(type,key=type){for(const fn of this.events.get(type)||[])fn({key,preventDefault(){}})}
}

function openJourney(currentModule,{hang=false}={}){
 const doc={};doc.body=new Element(doc);doc.createElement=()=>new Element(doc);
 doc.querySelector=()=>({classList:{remove(){}}});
 const layer=new Element(doc),host=new Element(doc),header=new Element(doc);
 doc.body.append(layer);layer.append(header,host);layer.classList.add('open');
 host.append(new Element(doc)); // stale prior screen: must be replaced, never overlaid
 const $=id=>({moduleQuickLayer:layer,moduleLayerBody:host,moduleLayerTitle:header})[id];
 const state={currentView:'module',currentModule,language:'ro'};
 const words={title:'Deplasare spre…',label:'Unde dorești să ajungi?',hint:'Sugestii',
  placeholder:'Nufărului 1, Oradea',short:'Începe să scrii o locație.',
  checking:'Caut locații pe hartă…',pick:'Selectează o locație dintre rezultate',
  noResults:'Nu am găsit',retry:'Indisponibil',search:'Verifică destinația',back:'Înapoi'};
 let timerId=0;const timers=new Map(),requests=[];
 const start=new Function('document','state','$','setModuleLayerMode',
  'oneFieldJourneyCopy','parseJourneyExpression','CLIENT_CONFIG','fetch',
  'setInterval','clearInterval','setTimeout','clearTimeout','AbortController','dialogText',
  'let oneFieldJourneySession=null,oneFieldJourneyIncoming=null;'+script+';return showOneFieldJourney;');
 const render=start(doc,state,$,value=>{header.textContent=value;host.replaceChildren()},
  ()=>words,parseJourneyExpression,{apiUrl:'https://backend.invalid/api/chat'},
  async(url,opts)=>{
   assert.equal(url,'https://backend.invalid/api/chat');
   requests.push(JSON.parse(opts.body));
   if(hang)return new Promise(()=>{}); // Simulates a stalled Android HTTP request.
   return {ok:true,json:async()=>({candidates:[
    {label:'Strada Nufărului 1, Oradea, România',latitude:47.07,longitude:21.94,country_code:'RO'}
   ]})};
  },()=>1,()=>{},(cb,ms)=>{const id=++timerId;timers.set(id,{cb,ms});return id},
  id=>timers.delete(id),AbortController,(ro,en)=>ro);
 render({mixedJourney:true});
 assert.equal(host.children.length,1,'No overlapping previous search windows');
 const root=host.children[0];assert.ok(root?.isConnected);
 assert.equal(root.children.length,6,'Only label, input, hint, status, suggestions and mode section');
 return {root,input:root.children[1],status:root.children[3],results:root.children[4],
  requests,
  async flush(){for(const [id,{cb,ms}] of [...timers]){if(ms>300)continue;timers.delete(id);cb()}
   await new Promise(resolve=>setImmediate(resolve));},
  async expire(){for(const [id,{cb,ms}] of [...timers]){if(ms<12000)continue;timers.delete(id);cb()}
   await new Promise(resolve=>setImmediate(resolve));}};
}

for(const module of ['maps','travel']){
 const page=openJourney(module);
 page.input.value='Nufărului 1, Oradea';page.input.emit('input');
 assert.equal(page.status.textContent,'Caut locații pe hartă…');
 await page.flush();
 assert.equal(page.requests.length,1,'Typed destination did not reach backend for '+module);
 assert.equal(page.requests[0].journey_suggest.query,'Nufărului 1, Oradea');
 assert.equal(page.results.children[0].textContent,'Strada Nufărului 1, Oradea, România');
}
const pick=openJourney('maps');
pick.input.value='Nufărului 1, Oradea';pick.input.emit('input');
await pick.flush();
pick.results.children[0].onclick();
await new Promise(resolve=>setImmediate(resolve));
assert.equal(pick.results.children.length,0,'Selecting a candidate clears the suggestion list');
assert.equal(pick.root.children.length,2,'Only destination field and illustrated cards remain');
assert.equal(pick.root.children[0],pick.input,'The confirmed destination stays in the input');
assert.equal(pick.input.value,'Strada Nufărului 1, Oradea, România');
assert.equal(pick.root.children[1].children.length,2,'Exactly two mode cards');
assert.equal(pick.root.children[1].children[0].textContent,'','Illustration card caption is a separate element');
assert.ok(pick.root.children[1].children[0].children[0].innerHTML.includes('<svg'),'Multimodal train, coach and plane are drawn');
assert.ok(pick.root.children[1].children[1].children[0].innerHTML.includes('<svg'),'Unbranded frontal car is drawn');
pick.input.emit('click');
assert.equal(pick.root.children.length,6,'Tapping destination reopens address editing without a new window');

const enter=openJourney('travel');
enter.input.value='Nufărului 1, Oradea';
enter.input.emit('keydown','Enter'); // Manual search without a separate button
await enter.flush();
assert.equal(enter.requests.length,1,'Keyboard Enter must send a typed address');
assert.equal(enter.requests[0].journey_suggest.query,'Nufărului 1, Oradea');
assert.equal(enter.results.children.length,1);

const duplicate=openJourney('maps');
duplicate.input.value='Nufărului 1, Oradea';
duplicate.input.emit('input');
duplicate.input.emit('input'); // Android delivered the same value twice
await duplicate.flush();
assert.equal(duplicate.requests.length,1,'Identical Android input events must not resubmit or abort the request');
assert.equal(duplicate.results.children.length,1,'Repeated identical events must not lose a valid result');

const stalled=openJourney('maps',{hang:true});
stalled.input.value='Nufărului 1, Oradea';
stalled.input.emit('input');
await stalled.flush(); // Debounce fires; HTTP remains unresolved
assert.equal(stalled.status.textContent,'Caut locații pe hartă…');
await stalled.expire(); // Enforced gateway deadline fires
assert.equal(stalled.status.textContent,'Indisponibil',
 'A stalled request must stop loading and visibly report an error');

console.log('PASS: live search input, result rendering, no duplicate aborts, and bounded stalled requests');
