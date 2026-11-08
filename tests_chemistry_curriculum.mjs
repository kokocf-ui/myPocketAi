import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {THEORY_ENTRIES,searchTheory,theorySubjects} from './education_theory.mjs';
import {CHEMISTRY_TOPICS,CHEMISTRY_LEVELS,CHEMISTRY_LESSONS} from './chemistry_curriculum.mjs';
const chemistry=THEORY_ENTRIES.filter(x=>x.subject==='chemistry');
const order={beginner:0,medium:1,intermediate:1,advanced:2};
assert.equal(CHEMISTRY_LEVELS.length,3);
assert.equal(CHEMISTRY_TOPICS.length,14);
assert.equal(CHEMISTRY_LESSONS.length,165);
assert.equal(chemistry.length,268,'184 shared lessons + 84 university specialization entries');
assert.deepEqual(theorySubjects().map(x=>x.count),[211,102,268,168,82]);
assert.equal(new Set(CHEMISTRY_TOPICS.map(t=>t.id)).size,CHEMISTRY_TOPICS.length);
assert.equal(new Set(chemistry.map(e=>e.title)).size,chemistry.length,'no repeated lesson titles');
assert.equal(new Set(chemistry.map(e=>e.id)).size,chemistry.length,'unique lesson IDs');
assert.ok(chemistry.every(e=>e.title&&e.statement&&e.formula&&e.topic&&e.level&&Array.isArray(e.aliases)));
for(const topic of CHEMISTRY_TOPICS){
 const lessons=chemistry.filter(e=>e.topic===topic.id);
 assert.ok(lessons.length>=7,topic.id+' is populated');
 assert.ok(lessons.every(l=>order[l.level]>=order[topic.minLevel]),topic.id+' has correct entry level');
}
assert.equal(searchTheory('lavoisier',{subject:'chemistry',level:'beginner'})[0]?.title,'Legea conservării masei');
assert.equal(searchTheory('molaritate',{subject:'chemistry',level:'intermediate'})[0]?.title,'Concentrația molară');
assert.equal(searchTheory('schrodinger',{subject:'chemistry',level:'beginner'}).length,0);
assert.ok(searchTheory('schrodinger',{subject:'chemistry',level:'advanced'}).length>0);
assert.deepEqual(searchTheory('',{subject:'chemistry'}),[],'old theory search has no default suggestions');

const html=await(await frontend.fetch(new Request('https://chemistry-preview.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'inline frontend present');
new vm.Script(script);
assert.match(script,/function chemistryCurriculumOpen\(\)/);
assert.match(script,/if\(key==='science'\)\{scienceJourneyShowChoices\('subjects'\);return\}/,'Science enters subject chooser first');
assert.match(script,/if\(chemistry\?\.open\)\{chemistry\.pocketBack\?\.\(\);return\}/);
assert.match(script,/dialog\.addEventListener\('cancel',event=>\{event\.preventDefault\(\);back\(\)\}\)/);
assert.match(script,/\.slice\(0,4\)\.map\(x=>x\.e\)/,'typed matches capped at four');
assert.match(html,/\.chemistry-curriculum-dialog\[open\]/,'responsive bounded dialog');
assert.match(html,/\.chemistry-curriculum-list\{/,'independent lesson scrolling');
const catStart=script.indexOf('const EDUCATION_THEORY_DATA=');
const begin=script.indexOf('function chemistryCurriculumOpen(');
const end=script.indexOf('function mathJourneyShowChoices(',begin);
assert.ok(catStart>0&&begin>catStart&&end>begin);

class FakeElement{
 constructor(tag){
  this.tag=tag;this.children=[];this.attributes={};this.listeners={};this.className='';
  this.value='';this.textContent='';this.style={};this.open=false;this.removed=false;
 }
 append(...els){this.children.push(...els)}
 replaceChildren(...els){this.children=[...els]}
 setAttribute(k,v){this.attributes[k]=v}
 addEventListener(k,fn){this.listeners[k]=fn}
 showModal(){this.open=true}
 close(){this.open=false;this.listeners.close?.()}
 remove(){this.removed=true}
}
const created=[],doc={
 createElement:tag=>{const el=new FakeElement(tag);created.push(el);return el},
 createElementNS:(_namespace,tag)=>{const el=new FakeElement(tag);created.push(el);return el},
 getElementById:id=>created.find(e=>e.id===id&&!e.removed)||null,
 body:{append:()=>{}}
};
const subscripts=script.slice(catStart,script.indexOf('let educationTheoryVoiceInput=',catStart))+
 '\n'+script.slice(script.indexOf('function educationTheoryClean('),script.indexOf('function educationTheoryStopVoice('))+
 '\n'+script.slice(begin,end)+'\nchemistryCurriculumOpen';
const preview=vm.runInNewContext(subscripts,{
 document:doc,learningLabel:(ro,en)=>ro,educationTheoryStopVoice:()=>{},
 chemistryCurriculumPreset:null,CHEMISTRY_LEVELS, CHEMISTRY_TOPICS
});
preview();
const dialog=doc.getElementById('chemistryCurriculumDialog');
assert.ok(dialog?.open);
const findRows=()=>created.filter(e=>e.className==='chemistry-curriculum-row'&&e.onclick);
assert.equal(dialog.children[1].textContent.startsWith('Alege nivelul'),true);
const levels=dialog.children[2].children[0].children;
assert.equal(levels.length,3);
levels[0].onclick();
const chapters=dialog.children[2].children[0].children;
assert.ok(chapters.length>=7,'beginner gets populated chapters');
assert.ok(chapters.some(x=>x.children[0]?.textContent==='Atomul și structura materiei'));
assert.ok(!chapters.some(x=>x.children[0]?.textContent==='Chimie organică'),'organic chemistry is not an entry-level chapter');
const fundamentals=chapters.find(x=>x.children[0]?.textContent==='Materie și laborator');
fundamentals.onclick();
const lessonList=dialog.children[2].children.find(x=>x.className==='chemistry-curriculum-list');
assert.ok(lessonList.children.length>=10,'chapter explicitly browses lessons even before typing');
const search=dialog.children[2].children.find(x=>x.className==='education-theory-search').children[0];
search.value='am';search.listeners.input();
assert.ok(lessonList.children.length<=4,'typeahead returns at most four results');
assert.ok(lessonList.children.some(x=>x.children[0].textContent==='Amestec'),'first two letters locate Amestec');
lessonList.children[0].onclick();
assert.ok(dialog.children[2].children[0].className==='chemistry-curriculum-detail');
dialog.pocketBack();
assert.ok(dialog.children[2].children.some(x=>x.className==='education-theory-search'),'Back to lesson search');
dialog.pocketBack();dialog.pocketBack();dialog.pocketBack();
assert.equal(dialog.open,false,'Back closes only after returning through previous stages');
console.log('PASS chemistry curriculum preview: 14 chapters, 184 entries, level gating, browsing, typeahead, detail and Back');
