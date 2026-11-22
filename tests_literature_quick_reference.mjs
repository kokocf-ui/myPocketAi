import assert from 'node:assert/strict';
import vm from 'node:vm';
import {LIT_QUICK_DICTIONARY,LIT_QUICK_GRAMMAR,literatureQuickSuggestions,
 literatureQuickDefinition,literatureQuickGrammarSearch} from './literature_quick_reference.mjs';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';

assert.ok(LIT_QUICK_DICTIONARY.ro.length>=90,'Romanian dictionary must not be a tiny sample');
assert.ok(LIT_QUICK_DICTIONARY.en.length>=50,'English offline coverage');
assert.ok(LIT_QUICK_GRAMMAR.ro.length>=50,'Romanian predicate/adjective/tenses and advanced grammar');
assert.ok(LIT_QUICK_GRAMMAR.en.length>=30,'English grammar reference');
for(const [letter,language] of [['a','ro'],['p','ro'],['b','ro'],['a','en'],['s','en']]){
 const candidates=literatureQuickSuggestions(letter,language);
 assert.ok(candidates.length>=3,'Autocomplete MUST work from first letter: '+letter+'/'+language);
 assert.ok(candidates.every(w=>w.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().startsWith(letter)),
  'Prefix suggestion mismatched '+letter+'/'+language);
}
assert.ok(literatureQuickSuggestions('pă','ro').some(w=>w==='pădure'),'Accent-sensitive display and accent-insensitive matching');
assert.equal(literatureQuickDefinition('PREDICAT','ro')?.word,'Predicat');
assert.match(literatureQuickDefinition('predicat','ro')?.definition||'',/subiect/);
assert.match(literatureQuickDefinition('adjectiv','ro')?.definition||'',/însușire/);
assert.match(literatureQuickDefinition('adverb','ro')?.definition||'',/acțiuni|stări/);
for(const part of ['Timpul prezent','Timpul trecut','Timpul viitor','Perfectul compus','Imperfectul']){
 const term=literatureQuickGrammarSearch(part,'ro').find(x=>x[1]===part);
 assert.ok(term&&term[2].length>48&&term[3].length>8,'Missing meaningful verb tense '+part);
}
assert.equal(literatureQuickDefinition('carte','ro')?.source,'local');
assert.equal(literatureQuickDefinition('nonexistentword','ro'),null);

class Element {
 constructor(tag='div'){
  this.tagName=tag.toUpperCase();this.children=[];this.listeners={};this.className='';this.style={cssText:''};
  this.value='';this.type='';this.hidden=false;this.attrs={};this.focused=false;this.parentNode=null;
  this._text='';
 }
 get textContent(){return this._text}
 set textContent(v){this._text=String(v||'');this.children=[]}
 append(...kids){for(const k of kids){this.children.push(k);k.parentNode=this}}
 prepend(...kids){this.children.unshift(...kids);for(const k of kids)k.parentNode=this}
 replaceChildren(...kids){this.children=[];this._text='';this.append(...kids)}
 addEventListener(type,callback){this.listeners[type]=callback}
 setAttribute(key,val){this.attrs[key]=val}
 getAttribute(key){return this.attrs[key]}
 querySelector(selector){
  if(selector==='button')return walk(this).find(x=>x.tagName==='BUTTON')||null;
  const attr=selector.match(/^\[([a-z0-9-]+)\]$/i);
  return attr?walk(this).find(x=>x.attrs?.[attr[1]]!==undefined)||null:null;
 }
 remove(){if(this.parentNode){this.parentNode.children=this.parentNode.children.filter(x=>x!==this);this.parentNode=null}}
 focus(){this.focused=true}
}
const walk=x=>[x,...(x.children||[]).flatMap(walk)];
const text=x=>walk(x).map(y=>y.textContent).filter(Boolean).join(' ');
const body=new Element('body'),host=new Element('div'),panel=new Element('section');
panel.className='lit-panel';host.append(panel);
const doc={
 body,
 createElement:tag=>new Element(tag),
 querySelector:selector=>selector==='[data-lit-quick-overlay]'?
  walk(body).find(x=>x.attrs?.['data-lit-quick-overlay']!==undefined)||null:null
};
const journey={country:'RO',grade:'5',level:'lower',language:'ro',branch:'program',stage:'grades'};
let originalBackCount=0;
const ctx={
 document:doc,
 litJourney:journey,litProgram:()=>({units:[]}),litOpen:stage=>stage,
 litBack:()=>{originalBackCount++},
 LIT_BRANCHES:[],LIT_TOPICS:{grammar:[]},
 LIT_LANGUAGES:[['ro','Română','Romanian']],
 $:id=>id==='moduleContent'?host:null,
 state:{language:'ro'},
 setTimeout:()=>99,clearTimeout:()=>{},AbortController,
 URLSearchParams,
 fetch:async()=>{throw Error('simulated network outage')}
};
vm.runInNewContext(LITERATURE_TASK_UI_SCRIPT,ctx,{filename:'lit-quick-reference-browser'});
ctx.litOpen('levels');
let toolbar=walk(panel).find(x=>x.attrs['data-lit-quick-entry']==='true');
assert.ok(toolbar,'Quick buttons must appear in the first window AFTER language selection, BEFORE cycles');
const actions=walk(toolbar).filter(x=>x.tagName==='BUTTON');
assert.equal(actions.length,2,'Separate dictionary and grammar buttons');
assert.match(text(actions[0]),/Dicționar/);
assert.match(text(actions[1]),/Gramatică rapidă/);
actions[0].onclick();
let overlay=doc.querySelector('[data-lit-quick-overlay]');
assert.ok(overlay,'Dictionary button must open working one-screen panel');
let input=walk(overlay).find(x=>x.tagName==='INPUT');
assert.ok(input?.focused,'Keyboard focus only after dictionary is opened');
input.value='p';input.listeners.input();
let candidates=walk(overlay).filter(x=>x.tagName==='BUTTON'&&x.getAttribute('role')==='option');
assert.ok(candidates.length>2,'First letter MUST show clickable word suggestions immediately');
assert.ok(walk(overlay).some(x=>x.className==='lit-quick-pinned'&&x.children.length>=2),
 'Mobile keyboard must never hide every suggestion: pin them directly under input');
const predicate=candidates.find(x=>/^Predicat/.test(x.textContent));
assert.ok(predicate,'Autocomplete must suggest grammatical terms as well as words');
predicate.onclick();
assert.match(text(overlay),/Parte principală de propoziție|predicat verbal/,'Tapping a suggestion must display its meaning');
ctx.litBack();
assert.equal(doc.querySelector('[data-lit-quick-overlay]'),null,'Back should close only quick reference overlay');
assert.equal(originalBackCount,0,'Back must not navigate away from study years when dictionary is open');
actions[1].onclick();
overlay=doc.querySelector('[data-lit-quick-overlay]');
assert.ok(overlay,'Grammar quick reference must open');
input=walk(overlay).find(x=>x.tagName==='INPUT');
assert.equal(input.focused,false,'Do not open keyboard automatically for grammar chips');
assert.ok(text(overlay).includes('Predicat'),'Grammar terms visible without typing');
assert.ok(walk(overlay).some(x=>x.className==='lit-quick-pinned'&&x.children.some(y=>y.textContent==='Predicat')),
 'Predicate/Adjective/Adverb quick chips must be visible without keyboard');
input.value='adve';input.listeners.input();
let matches=walk(overlay).filter(x=>x.tagName==='BUTTON'&&x.getAttribute('role')==='option');
assert.ok(matches.some(x=>x.textContent.includes('Adverb')),'Quick grammar filter must work live');
matches.find(x=>x.textContent.includes('Adverb')).onclick();
assert.match(text(overlay),/Parte de vorbire/,'Grammar term opens definition immediately');
ctx.litBack();
assert.equal(doc.querySelector('[data-lit-quick-overlay]'),null);
ctx.litBack();assert.equal(originalBackCount,1,'Normal literature Back works after closing reference');
console.log('PASS: first-character autocomplete, selected definitions, grammar quick reference, pre-cycle buttons, Android-style Back and offline fallback');
