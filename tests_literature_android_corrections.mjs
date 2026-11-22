import assert from 'node:assert/strict';
import vm from 'node:vm';
import {LIT_RO_GRADE_LESSONS} from './literature_ro_grade_progression.mjs';
import {ROMANIAN_EXPANDED_COUNTS,romanianExpandedRows,romanianExpandedMaterial} from './literature_ro_expanded_years.mjs';
import {LIT_UNIVERSITY_YEARS,literatureUniversityPlan,literatureUniversityMaterial} from './literature_university_years.mjs';
import {LIT_EU_PROGRAMS,litEuropeanPlan} from './literature_curriculum_europe.mjs';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';
import {literatureQuickSuggestions,literatureQuickDefinition} from './literature_quick_reference.mjs';

const expected=[9,10,11,12,12,13,14,15,14,15,16,17];
assert.deepEqual(Object.values(ROMANIAN_EXPANDED_COUNTS),expected,'Grade lesson counts must follow age, not a repeated 12-topic template');
for(let grade=1;grade<=12;grade++){
 const g=String(grade);
 const rows=romanianExpandedRows(g);
 assert.equal(rows.length,expected[grade-1]);
 assert.equal(new Set(rows.map(x=>x[0])).size,rows.length,'Duplicate IDs in grade '+g);
 assert.equal(new Set(rows.map(x=>x[1])).size,rows.length,'Duplicate titles in grade '+g);
 assert.equal(litEuropeanPlan('RO',grade<=4?'beginner':grade<=8?'lower':'medium',g).units.length,rows.length,
  'Server validation must match the learner-facing grade '+g);
 for(const row of rows.filter(x=>x[0].startsWith('ro-deep-'))){
  const material=romanianExpandedMaterial({topicKey:row[0],grade:g,title:row[1],focus:row[2],mode:'lesson'});
  assert.ok(material?.text.includes('## Exemplu')&&material.text.includes('## Ce învățăm'),'Must have real lesson');
  assert.ok(material?.text.length>270,'Not just a chapter title: '+row[0]);
  assert.ok(romanianExpandedMaterial({topicKey:row[0],grade:g,title:row[1],mode:'test'})?.text.includes('1.'));
 }
}
for(let year=1;year<=4;year++){
 const grade=String(year),rows=romanianExpandedRows(grade);
 for(const row of rows.filter(x=>x[0].startsWith('ro-elev-')||x[0].startsWith('ro-deep-'))){
  const mat=romanianExpandedMaterial({topicKey:row[0],grade,title:row[1],focus:row[2],mode:'lesson'});
  assert.ok(mat?.text,'No child lesson: '+row[0]);
  for(const token of ['hermeneutică','inferență','naratologie','metodologia cercetării','intertextualitate']){
   assert.ok(!mat.text.toLowerCase().includes(token),'Inappropriate vocabulary in primary: '+token);
  }
  assert.ok(mat.text.includes('Exemplu')&&mat.text.includes('Încerc'),'Primary content must teach by example');
 }
}
assert.equal(LIT_UNIVERSITY_YEARS.length,7);
assert.ok(LIT_UNIVERSITY_YEARS.some(y=>y.id==='uni-ba-4'));
assert.ok(LIT_UNIVERSITY_YEARS.some(y=>y.id==='uni-ma-2'));
for(const year of LIT_UNIVERSITY_YEARS){
 const plan=literatureUniversityPlan(year.id,'ro');
 assert.equal(plan.verified,false);
 assert.equal(plan.source,null);
 assert.equal(plan.sourceTitle,'');
 assert.ok(plan.units.length>=8,'Thin university coursework: '+year.id);
 assert.equal(new Set(plan.units.map(x=>x.id)).size,plan.units.length);
 assert.ok(plan.note.toLowerCase().includes('universit'));
 assert.ok(!plan.units.some(x=>/clasa a ix|clasa a 9|9-a/.test(x.ro.toLowerCase())));
 for(const unit of plan.units){
  const mat=literatureUniversityMaterial({topicKey:unit.id,grade:year.id,title:unit.ro,mode:'lesson'});
  assert.ok(mat?.text.length>450,'University course must include explanation, case and method: '+unit.id);
  assert.ok(mat.text.includes('## Metodă de lucru'));
 }
}
assert.ok(literatureQuickSuggestions('bu','ro').includes('buruiană'));
assert.match(literatureQuickDefinition('buruiană','ro').definition,/Plantă/);

class Element {
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.style={cssText:''};this.className='';this.attrs={};this.listeners={};this.value='';this.parentNode=null;this.textContent='';}
 append(...children){for(const child of children){this.children.push(child);child.parentNode=this}}
 prepend(...children){this.children.unshift(...children);for(const child of children)child.parentNode=this}
 replaceChildren(...children){this.children=[];this.append(...children)}
 insertBefore(child,before){const i=this.children.indexOf(before);if(i<0)this.append(child);else{this.children.splice(i,0,child);child.parentNode=this}}
 setAttribute(name,value){this.attrs[name]=value}
 getAttribute(name){return this.attrs[name]}
 addEventListener(type,fn){this.listeners[type]=fn}
 querySelector(sel){
  if(sel==='.lit-panel'||sel==='.lit-options')return walk(this).find(x=>x.className.split(' ').includes(sel.slice(1)))||null;
  if(sel==='button')return walk(this).find(x=>x.tagName==='BUTTON')||null;
  if(sel==='[data-lit-quick-entry]')return walk(this).find(x=>x.attrs['data-lit-quick-entry']!==undefined)||null;
  return null;
 }
 focus(){this.focused=true}
 remove(){if(this.parentNode){this.parentNode.children=this.parentNode.children.filter(x=>x!==this);this.parentNode=null}}
}
const walk=x=>[x,...(x.children||[]).flatMap(walk)];
const host=new Element('main'),body=new Element('body');
const journey={stage:'levels',country:'RO',language:'ro',level:'beginner',grade:'1',region:'',branch:'program',topic:'',track:'TC'};
const branchList=['program','literature','writing','grammar'].map(id=>({id,ro:id,en:id}));
const document={
 body,createElement:tag=>new Element(tag),
 querySelector:sel=>sel==='[data-lit-quick-overlay]'?
  walk(body).find(x=>x.attrs['data-lit-quick-overlay']!==undefined)||null:null
};
const ctx={
 document,
 litJourney:journey,
 LIT_EUROPE_PROGRAMS:JSON.parse(JSON.stringify(LIT_EU_PROGRAMS)),
 LIT_BRANCHES:branchList,
 LIT_TOPICS:{grammar:[],program:[],literature:[],writing:[]},
 litCurrentTopic:()=>['narrative','Old generic topic','Old generic topic','generic'],
 litProgram:()=>({source:'https://www.edu.ro/press_rel_11_2026',sourceTitle:'Grade IX 2026',verified:false,regions:false,units:[]}),
 litBack:()=>{},
 litOpen:stage=>{
  const panel=new Element('section');panel.className='lit-panel';
  const list=new Element('div');list.className='lit-options';panel.append(list);host.replaceChildren(panel);journey.stage=stage;return stage;
 },
 $:id=>id==='moduleContent'?host:null,
 state:{language:'ro'},
 LIT_LANGUAGES:[['ro','Română','Romanian']],
 LIT_OFFLINE_THEORY_DATA:{},
 setTimeout:()=>19,clearTimeout:()=>{},
 AbortController,URLSearchParams,fetch:async()=>{throw Error('network not available')},
};
vm.runInNewContext(LITERATURE_TASK_UI_SCRIPT,ctx,{filename:'literature-android-acceptance'});
journey.level='beginner';journey.grade='1';journey.branch='program';
ctx.litOpen('levels');
assert.ok(host.querySelector('[data-lit-quick-entry]'),'Dictionary and grammar controls must appear BEFORE school cycle selection');
ctx.litOpen('grades');
assert.equal(host.querySelector('[data-lit-quick-entry]'),null,'No redundant dictionary buttons on grade picker');
for(const grade of ['1','2','3','4','5','6','7','8','9','10','11','12']){
 journey.grade=grade;journey.level=Number(grade)<=4?'beginner':Number(grade)<=8?'lower':'medium';
 const plan=ctx.litProgram();
 assert.equal(plan.units.length,ROMANIAN_EXPANDED_COUNTS[grade],'Real Android bundle uses correct grade '+grade);
 assert.ok(plan.units.every(x=>!x.id.startsWith('eu-year-')),'Generic same-ten chapter sequence leaked '+grade);
 journey.topic=plan.units[0].id;
 const chosen=ctx.litCurrentTopic();
 assert.ok(chosen[0].startsWith('ro-'),'Lesson identity lost for year '+grade);
 assert.equal(chosen[0],plan.units[0].id.replace(/-\d+$/,''));
}
journey.level='advanced';journey.grade='';journey.branch='program';
ctx.litOpen('grades');
const buttons=host.querySelector('.lit-options').children;
assert.equal(buttons.length,7,'University year selector must offer real study cycles');
assert.ok(buttons[0].textContent.includes('Licență'));
assert.ok(buttons[4].textContent.includes('Master'));
buttons[0].onclick();
assert.equal(journey.grade,'uni-ba-1','University selection must update study year');
const plan=ctx.litProgram();
assert.equal(plan.source,null,'University must not point to grade IX source');
assert.equal(plan.sourceTitle,'','University must not display grade IX curriculum title');
assert.equal(plan.units.length,8);
journey.branch='program';journey.topic=plan.units[0].id;
const topic=ctx.litCurrentTopic();
assert.equal(topic[0],'uni-lit-uni-ba-1-introducere','Native topic bridge must retain university course ID');
const lesson=literatureUniversityMaterial({topicKey:topic[0],title:topic[1],grade:journey.grade});
assert.ok(lesson.text.includes('Metodă de lucru'));
console.log('PASS: 12 differentiated school-grade plans, child-friendly theory, fully separated bachelor/master years, native selected-topic identity and pre-cycle quick tools');
