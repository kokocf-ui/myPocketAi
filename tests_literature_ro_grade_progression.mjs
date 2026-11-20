import assert from 'node:assert/strict';
import vm from 'node:vm';
import {LIT_RO_GRADE_LESSONS,litRomanianGradeMaterial} from './literature_ro_grade_progression.mjs';
import {LIT_EU_PROGRAMS,litEuropeanPlan} from './literature_curriculum_europe.mjs';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';

const ids=new Set(),heads=new Set();
for(let grade=1;grade<=8;grade++){
 const entries=LIT_RO_GRADE_LESSONS[String(grade)];
 assert.equal(entries?.length,3,'Three differentiated chapters for Romanian grade '+grade);
 const plan=LIT_EU_PROGRAMS.RO.byGrade[String(grade)];
 assert.ok(plan.length>=6,'Complete grade '+grade+' path includes reading, speaking, writing, grammar');
 const matched=plan.filter(row=>String(row[3]).startsWith('ro-g'+grade+'-'));
 assert.equal(matched.length,3,'Grade plan links to exactly three authored grammar units');
 assert.equal(litEuropeanPlan('RO',grade<=4?'beginner':'lower',String(grade)).units.length>=6,true);
 for(const entry of entries){
  assert.ok(!ids.has(entry.id),'Unit keys may never be duplicated');
  ids.add(entry.id);
  assert.ok(!heads.has(entry.ro),'Every grammar unit needs an independent chapter title');
  heads.add(entry.ro);
  assert.ok(entry.intro.length>100,'Theory must not be just a definition');
  assert.ok(entry.example.length>75,'Worked example must be specific');
  assert.equal(entry.tasks.length,5,'Five concrete practice questions per topic');
  for(const mode of ['lesson','examples','exercises','test']){
   const material=litRomanianGradeMaterial({topicKey:entry.id,grade:String(grade),language:'ro',mode});
   assert.equal(material?.origin,'authored_grade_specific');
   assert.ok(material.text.includes(entry.ro),'Selected grade displays the selected subject');
   assert.ok(material.text.length>(mode==='lesson'||mode==='examples'?280:190),'Material must have content, not just a headline');
   if(mode==='test'||mode==='exercises'){
    assert.equal((material.text.match(/^\d+\./gm)||[]).length,5);
    assert.doesNotMatch(material.text,/Răspuns corect:/);
   }
  }
  assert.equal(litRomanianGradeMaterial({topicKey:entry.id,grade:String(grade+1),language:'ro',mode:'lesson'}),null,
   'Never show a chapter from the wrong year');
 }
}
assert.equal(ids.size,24);
// The pupil route may not inherit the same academic appendix at every grade.
const classNames=[];
for(let grade=1;grade<=12;grade++){
 const level=grade<=4?'beginner':grade<=8?'lower':'medium';
 const route=litEuropeanPlan('RO',level,String(grade));
 const labels=route.units.map(x=>x.label);
 assert.ok(labels.length>=7,'Class '+grade+' has age-specific subject chapters');
 assert.equal(labels.length,new Set(labels).size,'No duplicate chapter at grade '+grade);
 assert.ok(!route.units.some(x=>x.id.startsWith('study-')),
  'No common advanced study units may be appended to class '+grade);
 classNames.push(labels[0]);
 if(grade<=4)assert.ok(labels.every(x=>!/hermeneutică|retorică|comentariu critic|curente literare/i.test(x)),
  'Primary curriculum must be understandable to a child');
}
assert.equal(new Set(classNames).size,12,'All twelve grades have different first lesson menus');
const ninth=litEuropeanPlan('RO','medium','9','TC');
const tenth=litEuropeanPlan('RO','medium','10','TC');
assert.ok(ninth.units.some(x=>/liceu/i.test(x.label)),'New grade 9 curriculum has its own introduction');
assert.ok(!tenth.units.some(x=>/noua clasă a IX-a/i.test(x.label)),
 'Grade 10 must not inherit the 2026 grade 9 chapters');
assert.equal(new Set(Array.from({length:8},(_,i)=>LIT_RO_GRADE_LESSONS[String(i+1)][0].ro)).size,8,
 'The first chapter cannot repeat in all eight grades');
for(const grade of ['1','2','3','4']){
 const material=litRomanianGradeMaterial({topicKey:LIT_RO_GRADE_LESSONS[grade][0].id,grade,language:'ro'});
 assert.doesNotMatch(material.text,/Morfologie și sintaxă|Sintaxa studiază/i,
  'Primary first chapters must not start with secondary-school morphology');
}
// Execute the actual browser adapter. Verify the chapter list changes when
// the user chooses grade I, then IV, then VIII, and restores other countries.
const journey={country:'RO',grade:'1',branch:'grammar',topic:''};
const ctx={litJourney:journey,LIT_TOPICS:{grammar:[['grammar','Morfologie și sintaxă','Morphology and syntax']]},
 litOpen:stage=>stage,litProgram:()=>({source:null,sourceTitle:'',units:[]})};
vm.runInNewContext(LITERATURE_TASK_UI_SCRIPT,ctx,{filename:'literature_task_ui-browser'});
for(const grade of ['1','4','8']){
 journey.grade=grade;
 ctx.litOpen('topics');
 const actual=Array.from(ctx.LIT_TOPICS.grammar,x=>x[1]);
 const expected=LIT_RO_GRADE_LESSONS[grade].map(x=>x.ro);
 assert.deepEqual(actual,expected,'Rendered cards must change with grade '+grade);
}
// The class selection menu is different for an eight-year-old and a high-schooler.
const branchNames=['program','grammar','vocabulary','analysis','literature','writing','assessment'];
const cards=branchNames.map(id=>({id,ro:id,en:id,desc:'Generic teacher category'}));
const navigationCtx={litJourney:journey,LIT_BRANCHES:cards,LIT_TOPICS:{grammar:[]},
 litOpen:stage=>stage,litProgram:()=>({source:null,units:[]})};
vm.runInNewContext(LITERATURE_TASK_UI_SCRIPT,navigationCtx);
journey.country='RO';journey.grade='2';navigationCtx.litOpen('branches');
assert.ok(!navigationCtx.LIT_BRANCHES.some(x=>x.id==='analysis'||x.id==='literature'),
 'Early primary does not expose expert text analysis or bibliographic search');
assert.ok(navigationCtx.LIT_BRANCHES.some(x=>x.ro.includes('Lecțiile clasei 2')),
 'Primary route is shown in pupil language');
journey.grade='11';navigationCtx.litOpen('branches');
assert.ok(navigationCtx.LIT_BRANCHES.some(x=>x.id==='analysis'),
 'High-school learners can analyse source passages');
journey.country='GB-ENG';navigationCtx.litOpen('branches');
assert.equal(navigationCtx.LIT_BRANCHES.length,7,'Other countries retain their own options');
journey.country='RO';journey.grade='1';
journey.country='GB-ENG';journey.grade='Y3';ctx.litOpen('topics');
assert.equal(ctx.LIT_TOPICS.grammar[0][1],'Morfologie și sintaxă','Other countries unchanged');
journey.country='RO';journey.grade='2';
assert.match(ctx.litProgram().sourceTitle,/3418\/2013/,'Primary classes link to the proper curriculum reference');
journey.grade='4';
assert.match(ctx.litProgram().sourceTitle,/5003\/2014/);
journey.grade='7';
assert.match(ctx.litProgram().sourceTitle,/3393\/2017/);
console.log('PASS: 24 original Romanian chapters, 1–8 distinct scope, 4 activity types, proper curriculum links and in-app year change');
