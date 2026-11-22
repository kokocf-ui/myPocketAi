import assert from 'node:assert/strict';
import {MATH_DEPTH_STAGES, mathInDepthEntries, mathInDepthMaterial} from './math_depth_courses.mjs';
import {EDUCATION_EUROPE_COUNTRIES, educationCountrySchoolYears, educationSubjectSchoolPlan}
 from './education_all_country_subject_matrix.mjs';
import {mathCountryStudyYears} from './math_country_grade_areas.mjs';

const topicIds=new Set(['arithmetic','geometry','measurement','algebra','statistics','functions',
 'trigonometry','analysis','linear-algebra','discrete','differential']);
const ids=new Set();
let lessonCount=0, countryChecks=0, academicYearChecks=0;
for(const [stage,phases] of Object.entries(MATH_DEPTH_STAGES)){
 assert.equal(phases.length,4,stage+' must have four progressively distinct learning phases');
 for(const [phaseIndex,domains] of phases.entries()){
  assert.ok(Object.keys(domains).length>=3,stage+'/'+(phaseIndex+1)+' needs at least three branches');
  for(const topic of Object.keys(domains)){
   assert.ok(topicIds.has(topic),'Unknown topic '+topic);
   const lessons=mathInDepthEntries({stage,phase:phaseIndex+1,topic});
   assert.ok(lessons.length>=3,stage+'/'+topic+'/'+(phaseIndex+1)+' too few lessons');
   assert.equal(new Set(lessons.map(x=>x.title)).size,lessons.length,stage+'/'+topic+' duplicate titles');
   for(const entry of lessons){
    assert.ok(!ids.has(entry.id),'Duplicate mathematics lesson ID '+entry.id);ids.add(entry.id);
    assert.equal(entry.stage,stage);assert.equal(entry.phase,phaseIndex+1);assert.equal(entry.topic,topic);
    assert.ok(entry.title.length>=14,entry.id+' short title');
    assert.ok(entry.statement.length>=64,entry.id+' short explanation');
    assert.ok(entry.formula.length>=4,entry.id+' formula missing');
    assert.ok(entry.worked.length>=60,entry.id+' superficial worked example');
    assert.ok(entry.practice.length>=35,entry.id+' no practical exercise');
    assert.ok(entry.answers.length>=4,entry.id+' answer missing');
    assert.equal(entry.sourceStatus,'general-learning','Must not pretend national verification');
    const text=mathInDepthMaterial(entry);
    assert.ok(text.length>=420,entry.id+' insufficient readable lesson detail '+text.length);
    for(const h of ['Definiție și explicație','Formula și notațiile','Exemplu rezolvat, pas cu pas',
     'Exersează singur','Verifică răspunsurile']){
     assert.ok(text.includes(h),entry.id+' missing '+h);
    }
    lessonCount++;
   }
  }
 }
}
for(const country of EDUCATION_EUROPE_COUNTRIES){
 for(const [stage,schoolStage] of [['beginner','primary'],['lower','lower'],['medium','intermediate'],['advanced','advanced']]){
  const base=educationCountrySchoolYears(country,stage).years;
  const years=mathCountryStudyYears({country,stage,years:base});
  assert.ok(years.length>0,country+' has no maths years in '+stage);
  for(const [i,year] of years.entries()){
   const phase=Math.floor(i*4/Math.max(4,years.length))+1;
   const plan=educationSubjectSchoolPlan({country,stage,grade:year.id,subject:'mathematics'});
   assert.equal(plan.status,'general-learning',country+'/'+year.id+' claims unverified maths is official');
   assert.ok(plan.units.length>=3,country+'/'+year.id+' no mathematical branches');
   for(const branch of plan.units){
    const lessons=mathInDepthEntries({stage:schoolStage,phase,topic:branch.id});
    assert.ok(lessons.length>=3,
     country+'/'+stage+'/'+year.id+'/'+branch.id+' lacks year-appropriate detailed maths lessons');
   }
   countryChecks++;
  }
  academicYearChecks++;
 }
}
for(const [stage,phase,topic,term] of [
 ['primary',1,'arithmetic','Adunare'],['lower',1,'algebra','Ecuații'],
 ['lower',3,'geometry','Pitagora'],['intermediate',1,'algebra','Ecuația'],
 ['intermediate',3,'analysis','Derivata'],['advanced',3,'differential','diferențiale']
]){
 assert.ok(mathInDepthEntries({stage,phase,topic}).some(x=>x.title.includes(term)),
  stage+'/'+topic+'/'+phase+' is missing its distinct key concept');
}
assert.equal(mathInDepthEntries({stage:'lower',phase:0,topic:'algebra'}).length,0);
assert.equal(mathInDepthEntries({stage:'primary',phase:1,topic:'analysis'}).length,0);
console.log('PASS',lessonCount,'nonempty authored mathematics lessons across',
 academicYearChecks,'country/stage plans and',countryChecks,'country/academic-year selections');
