import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseJourneyExpression} from './assistant_bare_destination.mjs';

const source=readFileSync(new URL('./one_field_journey_ui.mjs',import.meta.url),'utf8');
const begin=source.indexOf('function watchAndroidJourneyInput(');
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
 set textContent(x){this._text=String(x)}
 get textContent(){return this._text}
 addEventListener(type,fn){this.events.set(type,[...(this.events.get(type)||[]),fn])}
 removeEventListener(type,fn){this.events.set(type,(this.events.get(type)||[]).filter(x=>x!==fn))}
 setAttribute(k,v){this.attrs[k]=v}
 append(...items){for(const el of items){this.children.push(el);el.parentElement=this}}
 replaceChildren(...items){for(const el of this.children)el.parentElement=null;this.children=[];this.append(...items)}
 emit(type){for(const fn of this.events.get(type)||[])fn({key:type,preventDefault(){}})}
}

function openJourney(currentModule){
 const doc={};doc.body=new Element(doc);doc.createElement=()=>new Element(doc);
 const layer=new Element(doc),host=new Element(doc),header=new Element(doc);
 doc.body.append(layer);layer.append(header,host);layer.classList.add('open');
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
   return {ok:true,json:async()=>({candidates:[
    {label:'Strada Nufărului 1, Oradea, România',latitude:47.07,longitude:21.94,country_code:'RO'}
   ]})};
  },()=>1,()=>{},cb=>{const id=++timerId;timers.set(id,cb);return id},
  id=>timers.delete(id),AbortController,(ro,en)=>ro);
 render({mixedJourney:true});
 const root=host.children[0];assert.ok(root?.isConnected);
 return {input:root.children[1],status:root.children[3],results:root.children[4],
  actions:root.children[6],requests,
  async flush(){for(const [id,cb] of [...timers]){timers.delete(id);cb()}
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
const press=openJourney('travel');
press.input.value='Nufărului 1, Oradea';
press.actions.children[1].onclick(); // No keyboard input event
assert.equal(press.status.textContent,'Caut locații pe hartă…');
await press.flush();
assert.equal(press.requests.length,1,'Verify button silently discarded typed address');
assert.equal(press.requests[0].journey_suggest.query,'Nufărului 1, Oradea');
assert.equal(press.results.children.length,1);
console.log('PASS: visible destination field reaches gateway and renders suggestions via input and Verify');
