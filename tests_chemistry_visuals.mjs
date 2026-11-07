import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://chemistry-visuals.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
assert.ok(script,'served script');
new vm.Script(script);
const begin=script.indexOf('const CHEM_ELEMENTS='),end=script.indexOf('function scienceShowResult(title,body)',begin);
assert.ok(begin>0&&end>begin,'visual code embedded in served frontend');
class Element{
 constructor(tag){this.tag=tag;this.children=[];this.className='';this.style={};this.attributes={};this.textContent='';this.disabled=false;}
 append(...args){this.children.push(...args)}
 setAttribute(a,b){this.attributes[a]=b}
 querySelectorAll(q){return []}
 get classList(){return {add:()=>{},remove:()=>{}}}
}
const vmContext={
 document:{createElement:tag=>new Element(tag),createElementNS:(ns,tag)=>new Element(tag)},
 learningLabel:(ro,en)=>ro,
 educationTheoryClean:s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(),
 scienceChemMoleculeOpen:()=>{},
};
const api=vm.runInNewContext(script.slice(begin,end)+';({kind:chemistryVisualKind,build:chemistryVisualBuild,symbols:CHEM_ELEMENTS,rows:CHEM_ROWS,shells:chemistryAtomShells})',vmContext);
assert.equal(api.symbols.length,118,'118 known elements');
assert.equal(api.rows.reduce((sum,row)=>sum+row.filter(Boolean).length,0),118,'all elements appear exactly once');
assert.equal(new Set(api.rows.flat().filter(Boolean)).size,118,'unique symbols in table');
assert.equal(api.kind('Mendeleev'),'periodic');
assert.equal(api.kind('tabloul periodic'),'periodic');
assert.equal(api.kind('atom'),'atom');
assert.equal(api.kind('atomul'),'atom');
assert.equal(api.kind('Legături chimice'),'bond');
assert.equal(api.kind('Scara pH'),'ph');
assert.equal(api.kind('reacție chimică'),'reaction');
assert.deepEqual([...api.shells(6)],[2,4]);
assert.deepEqual([...api.shells(26)],[2,8,14,2]);
assert.equal(api.shells(79),null,'unknown advanced shell arrangement not invented');
const periodic=api.build('periodic','Mendeleev');
assert.ok(periodic.children.some(c=>c.className==='chem-periodic-scroll'));
const grid=periodic.children.find(c=>c.className==='chem-periodic-scroll').children[0];
assert.equal(grid.children.filter(c=>c.className.startsWith('chem-periodic-element')&&!c.disabled).length,118);
for(const kind of ['atom','bond','ph','reaction','molecule']){
 const visual=api.build(kind,'atom');
 assert.ok(visual?.children.length>=2,kind);
}
assert.match(html,/chem-periodic-scroll/);
assert.match(script,/chemistryVisualPicker/);
assert.match(script,/if\(scienceJourney.subject==='chemistry'\)\{\s*const query=\$\('scienceEducationText'\)/);
assert.match(script,/scienceDraftSave\(''\);scienceStatus\(''\);[\s\S]{0,300}scienceEditorGrow\(editor\)/);
console.log('PASS chemistry: 118 interactive elements, atom, bonds, pH, reaction, molecules, contextual results and workspace reset');
