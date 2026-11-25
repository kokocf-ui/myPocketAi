import assert from 'node:assert/strict';
import vm from 'node:vm';
import {literatureEuropeanAuthoredMaterial} from './literature_europe_authored_material.mjs';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';
import {litEuropeanPlan} from './literature_curriculum_europe.mjs';

const sample=litEuropeanPlan('FR','medium','4e').units.find(x=>x.id.startsWith('eu-year-'));
assert.ok(sample,'French year-specific study chapter missing');
for(const [country,stage,grade] of [
 ['RO','beginner','2'],['GB-ENG','beginner','Y3'],['PL','medium','L2'],
 ['FR','medium','4e'],['IT','medium','2 Superiore'],['CH','lower','8'],
 ['AD','beginner','1'],['XK','medium','general-medium-3']
]){
 const year=litEuropeanPlan(country,stage,grade);
 const chapter=year.units.find(x=>x.id.startsWith('eu-year-'));
 if(!chapter)continue;
 for(const lang of ['ro','en']){
  for(const mode of ['lesson','examples','exercises','test']){
   const result=literatureEuropeanAuthoredMaterial({
    topicKey:chapter.id,title:chapter.label,focus:chapter.focus,grade,language:lang,mode});
   assert.equal(result?.origin,'authored_european_grade',country+' '+grade+' '+mode);
   assert.ok(result.text.length>500,'A bare outline is not enough: '+country+' '+grade+' '+mode);
   assert.ok(result.text.includes(chapter.label),'Chosen topic must remain visible: '+country);
   if(['exercises','test'].includes(mode)){
    assert.equal((result.text.match(/^\d+\./gm)||[]).length,6,'Six real practice tasks');
    assert.ok(!/soluț[ii]+:|answer key:/i.test(result.text),'Avoid revealing answers early');
   }
   if(mode==='lesson'){
    assert.ok(result.text.includes(grade),'Grade must be visible');
    assert.ok(result.text.includes(lang==='ro'?'Greșeli de evitat':'Common mistakes'),
      'Theory should address misconceptions');
   }
  }
 }
}
assert.equal(literatureEuropeanAuthoredMaterial({topicKey:'not-grade-unit',grade:'2'}),null);
assert.equal(literatureEuropeanAuthoredMaterial({topicKey:sample.id,mode:'summary'}),null);
assert.equal(literatureEuropeanAuthoredMaterial({topicKey:sample.id,language:'fr'}),null,
 'The offline content must not falsely claim French translation');
assert.match(LITERATURE_TASK_UI_SCRIPT,/function literatureEuropeanAuthoredMaterial\(/,
 'Actual client must embed authored content, not merely the metadata');
assert.match(LITERATURE_TASK_UI_SCRIPT,/\['authored_european_grade','authored_ro_year_specific','authored_university_year','authored_hungary_grade1','authored_hungary_primary_batch','authored_france_cp','authored_national_year'\]\.includes\(localMaterial\.origin\)/,
 'UI must use all authored grade, university and European local materials instead of falling through to AI');
const ctx={
 litJourney:{country:'FR',grade:'4e',branch:'program',topic:'',stage:'branches'},
 LIT_BRANCHES:[],LIT_TOPICS:{grammar:[]},
 litOpen:s=>s,litProgram:()=>({source:null,units:[]})
};
vm.runInNewContext(LITERATURE_TASK_UI_SCRIPT,ctx,{filename:'literature_task_ui-browser'});
const browser=ctx.literatureEuropeanAuthoredMaterial({
 topicKey:sample.id,title:sample.label,focus:sample.focus,grade:'4e',mode:'lesson',language:'ro'});
assert.ok(browser?.text.includes(sample.label),'Serialized browser function must run');
console.log('PASS: authored school-year literature theory, worked examples, exercises and test are wired to the browser');
