import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://chem-atom-context.test/'))).text();
const code=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(code);
const start=code.indexOf('const CHEM_ELEMENTS=');
const end=code.indexOf('function scienceShowResult(title,body)',start);
assert.ok(start>0&&end>start);
class El{
 constructor(tag){this.tag=tag;this.children=[];this.attributes={};this.listeners={};this.style={};this.textContent='';this.value='';this.className='';}
 append(...nodes){this.children.push(...nodes);}
 replaceChildren(...nodes){this.children=[...nodes];}
 setAttribute(key,val){this.attributes[key]=val;}
 addEventListener(event,cb){this.listeners[event]=cb;}
}
const api=vm.runInNewContext(code.slice(start,end)+';({build:chemistryVisualBuild,number:chemistryElementNumberOrNull,kind:chemistryVisualKind})',{
 document:{createElement:tag=>new El(tag),createElementNS:(_ns,tag)=>new El(tag)},
 learningLabel:(ro,en)=>ro,
 educationTheoryClean:s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()
});
assert.equal(api.number('Atomul'),null);
assert.equal(api.number('Numărul atomic'),null);
assert.equal(api.number('Atomul de carbon'),6);
assert.equal(api.number('Oxigen'),8);
assert.equal(api.kind('Numărul atomic'),'atom');
function getAtom(q){
 const root=api.build('atom',q);
 const selector=root.children.find(n=>n.className==='chem-atom-picker').children[0].children[0];
 const svg=root.children.find(n=>n.tag==='svg');
 const paragraphs=root.children.filter(n=>n.tag==='p');
 return {root,selector,svg,paragraphs};
}
const generic=getAtom('Atomul');
assert.equal(generic.selector.value,'general','generic lesson must not silently show carbon');
assert.ok(generic.svg.children.some(n=>n.tag==='text'&&n.textContent==='p⁺'));
assert.ok(generic.svg.children.some(n=>n.tag==='text'&&n.textContent==='n⁰'));
assert.ok(generic.svg.children.some(n=>n.tag==='text'&&n.textContent==='e⁻'));
assert.ok(generic.paragraphs.some(n=>/neutroni/.test(n.textContent)));
const atomic=getAtom('Numărul atomic');
assert.equal(atomic.selector.value,'general');
assert.ok(atomic.paragraphs.some(n=>/Z este numărul protonilor/.test(n.textContent)));
const carbon=getAtom('Atomul de carbon');
assert.equal(carbon.selector.value,'6');
assert.ok(carbon.svg.children.some(n=>n.tag==='text'&&n.textContent==='Z=6'));
assert.ok(carbon.paragraphs.some(n=>/2 – 4/.test(n.textContent)));
generic.selector.value='8';
generic.selector.listeners.change();
assert.ok(generic.svg.children.some(n=>n.tag==='text'&&n.textContent==='Z=8'));
assert.ok(generic.paragraphs.some(n=>/8 protoni și 8 electroni/.test(n.textContent)));
assert.match(html,/\.chemistry-curriculum-dialog\[open\]\{[\s\S]*?height:fit-content!important/);
assert.match(html,/\.chem-atom-picker select/);
console.log('PASS contextual chemistry atoms: generic vs atomic number vs element, accurate particles and interactive selection');
