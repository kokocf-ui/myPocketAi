import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {HUNGARY_MATH_GRADES,HUNGARY_MATH_SOURCES,HUNGARY_MATH_UNIVERSITY_YEARS,
 hungaryMathOriginalLessons} from './math_hungary_full_track_2026.mjs';
import {hungaryGrade5Lessons} from './math_hungary_grade5_2026.mjs';
import {educationCountrySchoolYears,educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';
import {mathCountryStudyYears,mathCountryGradeAreas} from './math_country_grade_areas.mjs';
import {mathCountryCourseEntries,mathInDepthMaterial} from './math_depth_courses.mjs';
import {mathCountryPhasePlan} from './math_country_year_alignment_2026.mjs';

const table=[
 ['beginner',['1','2','3','4'],'primary'],
 ['lower',['5','6','7','8'],'lower'],
 ['medium',['9','10','11','12','13'],'intermediate'],
 ['advanced',['BSC1','BSC2','BSC3','MSC1','MSC2'],'advanced']
];
let total=0,authored=0;
for(const [stage,gradeIds,clientStage] of table){
 const years=mathCountryStudyYears({country:'HU',stage,
  years:educationCountrySchoolYears('HU',stage).years});
 assert.deepEqual(years.map(y=>String(y.id)),gradeIds,'Missing or extra HU year in '+stage);
 for(const grade of gradeIds){
  const row=HUNGARY_MATH_GRADES[grade];
  const plan=mathCountryGradeAreas({country:'HU',stage,grade,years});
  const publicPlan=educationSubjectSchoolPlan({country:'HU',stage,grade,subject:'mathematics'});
  assert.equal(plan.status,'general-learning');
  assert.equal(publicPlan.status,'general-learning');
  assert.equal(plan.source,stage==='advanced'?HUNGARY_MATH_SOURCES.university:
   HUNGARY_MATH_SOURCES[stage==='beginner'?'primary':stage==='lower'?'lower':'upper']);
  assert.ok(plan.note.includes('Nu certificăm'),'Must not claim complete textbooks');
  assert.deepEqual(plan.units.map(x=>x.id),row.units.map(x=>x[0]));
  assert.deepEqual(publicPlan.units.map(x=>x.id),plan.units.map(x=>x.id));
  const phase=mathCountryPhasePlan({country:'HU',stage,grade,years});
  assert.equal(phase.phase,row.phase,'Wrong Hungarian source year phase');
  assert.ok(plan.units.length>=3,'Empty year curriculum branches');
  const ids=[];
  for(const unit of plan.units){
   const cards=mathCountryCourseEntries({country:'HU',stage:clientStage,
    grade,phase:row.phase,topic:unit.id});
   assert.ok(cards.length>0,'Empty '+stage+'/'+grade+'/'+unit.id);
   assert.equal(cards.length,unit.lessonCount,'Wrong chapter count in UI');
   assert.equal(cards.length,publicPlan.units.find(x=>x.id===unit.id).lessonCount);
   for(const item of cards){
    assert.ok(item.title&&item.statement&&item.worked&&item.practice&&item.answers);
    assert.match(mathInDepthMaterial(item),/Exemplu rezolvat/);
    ids.push(item.id);
   }
   const specific=grade==='5'?hungaryGrade5Lessons(unit.id):hungaryMathOriginalLessons({grade,topic:unit.id});
   for(const original of specific){
    authored++;
    assert.ok(cards.some(x=>x.id===original.id),'A new Hungarian lesson is invisible');
    assert.equal(original.country,'HU');
    assert.equal(original.grade,grade);
   }
   total+=cards.length;
  }
  assert.equal(ids.length,new Set(ids).size,'Repeated cards within year '+grade);
 }
}
assert.ok(total>100,'Existing course bank has not reached school-year paths');
assert.equal(HUNGARY_MATH_UNIVERSITY_YEARS.length,5);
assert.equal(authored,30,'17 grade-specific + 13 existing grade-5 cards');
const techYears=mathCountryStudyYears({country:'HU',stage:'medium',
 years:educationCountrySchoolYears('HU','medium').years});
assert.match(techYears.find(x=>String(x.id)==='13').ro,/numai technikum/);
assert.ok(!techYears.find(x=>String(x.id)==='12').ro.includes('technikum'));
const oldRomanian=mathCountryCourseEntries({country:'RO',stage:'lower',grade:'5',topic:'algebra'});
assert.ok(oldRomanian.length>0,'Romania must not regress');
const renderedHtml=await(await app.fetch(new Request('https://test.local/'))).text();
const clientScript=renderedHtml.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(clientScript,'Frontend HTML must include inline script');
new vm.Script(clientScript);
for(const requiredClientBinding of [
 'const HUNGARY_MATH_GRADES=',
 'function hungaryGrade5Lessons(',
 'function hungaryMathOriginalLessons(',
 'function spainMathOriginalEntries(',
 'function italyMathFocalLessons(',
 'function portugalMath2026Lessons('
]){
 assert.ok(clientScript.includes(requiredClientBinding),
  'Android/browser bundle missing '+requiredClientBinding);
}
console.log('PASS Hungary: 18 real study selections, 30 dedicated original lessons, '+total+
 ' displayed lesson cards including existing advisory bank. No full-year certification.');
