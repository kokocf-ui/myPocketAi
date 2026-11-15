import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {CREATOR_SITE_SCRIPT} from './creator_site_ui.mjs';
import {CREATOR_IMAGE_AI_SCRIPT} from './creator_image_ai.mjs';

const html=await(await frontend.fetch(new Request('https://image-picker.test/'))).text();
const source=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source,'Frontend script exists');
new vm.Script(source,{filename:'pocket-ai-frontend.js'});
assert.match(CREATOR_SITE_SCRIPT,/artStyle\.dataset\.pocketPickerMode='scroll'/,
 'Only the art-style control requests the full scrollable list');
assert.match(CREATOR_SITE_SCRIPT,/artStyle\.setAttribute\('aria-label',extraToolsLocale\('Stil artistic'/);
assert.match(html,/pocket-select-modal\.pocket-select-scroll-mode \.pocket-select-list/,
 'Four-row scroll mode has its own height and vertical overflow styles');

const styles=new Function(CREATOR_IMAGE_AI_SCRIPT+';return EVA_IMAGE_STYLES;')();
assert.equal(styles.length,26,'All art styles remain available without using the AI');
const first=source.indexOf('function openPocketSelect(select){');
const last=source.indexOf('// Capture click AND pointerdown',first);
assert.ok(first>0&&last>first,'Standalone generic picker can be tested');
const picker=source.slice(first,last);
const nodes=new Map();
const cls=()=>{const value=new Set();return {
 toggle(name,on){if(on)value.add(name);else value.delete(name)},
 remove(name){value.delete(name)},contains(name){return value.has(name)}
}};
const element=tag=>({
 tag,children:[],classList:cls(),style:{},textContent:'',value:'',
 setAttribute(){},append(...children){this.children.push(...children)},
 replaceChildren(...children){this.children=children},
 focus(){},scrollIntoView(){this.wasVisible=true},
 get firstElementChild(){return this.children[0]||null}
});
const dialog=element('dialog');
dialog.open=false;
dialog.showModal=()=>{dialog.open=true};
dialog.close=()=>{dialog.open=false};
nodes.set('pocketSelectDialog',dialog);
const list=element('div');
list.before=node=>nodes.set('pocketSelectSearch',node);
nodes.set('pocketSelectList',list);
nodes.set('pocketSelectTitle',element('strong'));
nodes.set('pocketSelectClose',element('button'));
const mockDocument={createElement:element};
const ctx={
 document:mockDocument,$:id=>nodes.get(id)||null,
 learningLabel:(ro)=>ro,
 progressiveMatchText:value=>String(value||'').normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().trim(),
 renderProgressiveChoiceList:(target,options,makeChoice)=>{
  target.replaceChildren(...options.slice(0,4).map(makeChoice));
 },
 Event:class{constructor(type){this.type=type}}
};
const pickerFn=vm.runInNewContext('let pocketSelectSource=null;\n'+picker+'\nopenPocketSelect;',ctx);
const label={textContent:'Stil artistic'+styles.map(s=>s[1]).join(''),
 childNodes:[{nodeType:3,textContent:'Stil artistic'}, {nodeType:1,textContent:'DO NOT INCLUDE OPTIONS'}]};
const art={
 disabled:false,multiple:false,size:0,dataset:{pocketPickerMode:'scroll'},
 options:styles.map(([id,name])=>({value:id,textContent:name,selected:id==='realistic',hidden:false,disabled:false})),
 value:'realistic',getAttribute:()=>null,closest:()=>label,
 isConnected:true,dispatchEvent(ev){this.changeEvent=ev.type}
};
assert.equal(pickerFn(art),true);
assert.equal(nodes.get('pocketSelectTitle').textContent,'Stil artistic','No concatenated option names in title');
assert.equal(list.children.length,26,'All 26 art-style rows rendered at once');
assert.equal(nodes.get('pocketSelectSearch').style.display,'none','No forced typing or keyboard');
assert.ok(dialog.classList.contains('pocket-select-scroll-mode'));
list.children[9].onclick();
assert.equal(art.value,styles[9][0],'Selecting a scrolled style preserves its real value');
assert.equal(art.changeEvent,'change','Selection triggers the existing downstream AI style handler');

const regular={...art,dataset:{},options:art.options.slice(0,8),value:'realistic',changeEvent:null};
assert.equal(pickerFn(regular),true);
assert.equal(list.children.length,4,'Other selection lists retain four-choice policy');
assert.equal(dialog.classList.contains('pocket-select-scroll-mode'),false,'Special mode is opt-in');
assert.equal(nodes.get('pocketSelectSearch').style.display,'block','Other large lists retain search');
assert.equal(nodes.get('pocketSelectTitle').textContent,'Stil artistic');
console.log('PASS: 26 art styles scroll inside a four-card viewport; stable title, no keyboard and default selectors unchanged');
