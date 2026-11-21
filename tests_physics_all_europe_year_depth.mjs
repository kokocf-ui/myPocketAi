import assert from 'node:assert/strict';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {PHYSICS_TOPICS} from './physics_curriculum.mjs';
import {THEORY_ENTRIES} from './education_theory.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {scienceSchoolTopicLessons,SCIENCE_RO_LOWER_TOPICS} from './science_ro_course_plan.mjs';
import {physicsCountryGradePlan} from './physics_europe_frameworks.mjs';

const counts={},coverage=[],errors=[],integrated=[],generic=[];
for(const country of EDUCATION_EUROPE_COUNTRIES)for(const [stage,mapped] of [
 ['primary','beginner'],['lower','lower'],['upper','medium']
]){
 const years=educationCountrySchoolYears(country,mapped).years;
 for(const year of years){
  const grade=year.id;
  const plan=physicsCountryGradePlan({country,stage,grade,years});
  const chapters=scienceGradeTopicPlan({country,subject:'physics',stage,grade,years,topics:PHYSICS_TOPICS}).topics;
  const entries=chapters.flatMap(topic=>scienceSchoolTopicLessons({
   country,subject:'physics',stage,grade,years,topic:topic.id,language:'ro',lessons:THEORY_ENTRIES
  }));
  if(plan.status==='not-offered'){
   assert.equal(country,'RO','Only confirmed Romania Grade V has no Physics course');
   assert.equal(grade,'5');
   assert.equal(entries.length,0,'No falsely listed Romanian Grade V Physics');
   continue;
  }
  if(plan.kind==='integrated')integrated.push(country+'/'+grade);
  if(!plan.verifiedAnnual)generic.push(country+'/'+grade);
  if(!chapters.length)errors.push(country+'/'+stage+'/'+grade+': no chapter');
  if(!entries.length)errors.push(country+'/'+stage+'/'+grade+': no original study lessons');
  const ids=entries.map(x=>x.id);
  if(new Set(ids).size!==ids.length)errors.push(country+'/'+stage+'/'+grade+': duplicate lesson ids');
  if(entries.some(x=>!x.title||!x.statement))errors.push(country+'/'+stage+'/'+grade+': title-only study card');
  coverage.push({country,stage,grade,chapters:chapters.length,lessons:entries.length,
   titles:new Set(entries.map(x=>String(x.title).toLowerCase())).size,kind:plan.kind});
  const key=stage;
  (counts[key]||=[]).push(entries.length);
 }
}
assert.equal(EDUCATION_EUROPE_COUNTRIES.length,50);
const minByStage=Object.fromEntries(Object.entries(counts).map(([stage,all])=>[stage,Math.min(...all)]));
const maxByStage=Object.fromEntries(Object.entries(counts).map(([stage,all])=>[stage,Math.max(...all)]));
const weakest=coverage.sort((a,b)=>a.lessons-b.lessons).slice(0,24);
console.log('Physics country-year audit',JSON.stringify({
 systems:EDUCATION_EUROPE_COUNTRIES.length,years:coverage.length,
 integrated:integrated.length,unverifiedYearAssignments:generic.length,
 minByStage,maxByStage,weakest,errors:errors.slice(0,24)
}));
assert.deepEqual(errors,[],'Every offered Physics year must show real original and unique lesson cards');
