import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {SCIENCE_YEAR_REFERENCE,scienceYearReferenceEntries,scienceYearReferenceMaterial} from './science_year_reference.mjs';
const seen=new Set();
for(const [subject,minimum] of [['physics',10],['chemistry',12]]){
 const rows=scienceYearReferenceEntries(subject,'ro');
 assert.equal(rows.length,minimum);
 for(const lang of ['ro','en']){
  const items=scienceYearReferenceEntries(subject,lang);
  assert.equal(items.length,minimum);
  for(const law of items){
   assert.ok(law.title.length>=8&&law.explanation.length>65,'Reference explanation missing: '+law.title);
   assert.ok(law.formula.length>=5&&law.symbols.length>=35&&law.limits.length>=55,'Relation, symbols and limits: '+law.title);
   assert.ok(law.example.length>=65,'Need complete example: '+law.title);
   const page=scienceYearReferenceMaterial(law,lang);
   const formula=page.indexOf(lang==='ro'?'# Relația de pornire':'# Starting relation');
   const notation=page.indexOf(lang==='ro'?'# Simboluri și unități':'# Symbols and units');
   const worked=page.indexOf(lang==='ro'?'# Exemplu explicat':'# Worked illustration');
   assert.ok(formula>=0&&notation>formula&&worked>notation,'Formula before worked example: '+law.title);
   assert.ok(!seen.has(subject+lang+law.title));seen.add(subject+lang+law.title);
  }
 }
}
assert.ok(SCIENCE_YEAR_REFERENCE.chemistry.some(x=>/Lavoisier/.test(x.ro.title)));
assert.ok(SCIENCE_YEAR_REFERENCE.physics.some(x=>/Newton II/.test(x.ro.title)));
const html=await(await frontend.fetch(new Request('https://science-quick-year-reference.test/'))).text();
const code=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(code);
for(const fragment of [
 'const SCIENCE_YEAR_REFERENCE=','const scienceYearReferenceEntries=',
 'const scienceYearReferenceMaterial=',
 'function scienceYearReferenceOpen(subject)',
 "shortcut(learningLabel('⚛ Tabelul periodic'",
 "()=>chemistryVisualOpen('periodic','')",
 "shortcut(learningLabel('📖 Legi și principii'",
 "shortcut(learningLabel('📖 Legi și teoreme'",
 "main.page:has(#view-module.learning-science.science-year-stage.active)",
 'touch-action:pan-y!important',
 '#view-module.learning-science.science-year-stage.active .science-choice-list.science-year-list'
])assert.ok(html.includes(fragment),'Missing year-only shortcut or scroll-owner rule: '+fragment);
const a=code.indexOf('function scienceYearReferenceOpen(subject){'),b=code.indexOf('\nfunction ',a+20);
assert.ok(a>0&&b>a);
class Element{
 constructor(tag){this.tag=tag;this.children=[];this.style={};this.textContent='';this.className='';this.listeners={};this.attrs={};this.value='';}
 append(...children){this.children.push(...children)}
 replaceChildren(...children){this.children=children}
 addEventListener(event,fn){this.listeners[event]=fn}
 setAttribute(k,v){this.attrs[k]=v}
 remove(){}
 close(){this.closed=true}
 showModal(){this.open=true}
}
const opened=[],dialogs=[];
const ctx={
 document:{createElement:tag=>new Element(tag),getElementById:()=>null,
  body:{append:d=>dialogs.push(d)}},
 state:{language:'ro'},scienceYearReferenceEntries,scienceYearReferenceMaterial,
 educationTheoryClean:s=>String(s||'').toLowerCase(),
 educationOpenPagedLesson:(title,body)=>opened.push({title,body}),
 learningLabel:(ro,en)=>ro
};
const make=vm.runInNewContext(code.slice(a,b)+';scienceYearReferenceOpen',ctx);
make('chemistry');
assert.equal(dialogs.length,1);
const d=dialogs[0];
const list=d.children.at(-1),input=d.children.at(-2);
assert.equal(list.children.length,12,'All Chemistry laws show without a school-year selection');
list.children[0].onclick();
assert.ok(opened[0].body.includes('# Exemplu explicat'));
input.value='hess';input.listeners.input();
assert.equal(list.children.length,1,'Search filters directly');
make('physics');
assert.equal(dialogs.length,2);
assert.equal(dialogs.at(-1).children.at(-1).children.length,10);
console.log('PASS Sciences year-level quick references: Chemistry 12, Physics 10, offline bilingual formulas and examples, direct periodic-table action and single scroll owner');
