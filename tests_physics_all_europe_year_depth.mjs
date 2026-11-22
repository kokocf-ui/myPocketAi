import assert from 'node:assert/strict';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {PHYSICS_TOPICS} from './physics_curriculum.mjs';
import {THEORY_ENTRIES} from './education_theory.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {scienceSchoolTopicLessons,SCIENCE_RO_LOWER_TOPICS} from './science_ro_course_plan.mjs';
import {physicsCountryGradePlan,PHYSICS_NOT_OFFERED_LOWER_YEARS} from './physics_europe_frameworks.mjs';
import {EDUCATION_WORLDWIDE_SCHEMES} from './education_worldwide_paths.mjs';

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
   assert.equal(stage,'lower','Do not remove integrated primary Science or upper years');
   assert.ok(PHYSICS_NOT_OFFERED_LOWER_YEARS[country]?.includes(String(grade)),
    'Only evidence-backed grades may be hidden: '+country+'/'+grade);
   assert.equal(entries.length,0,'No standalone Physics chapters before the subject starts');
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
// A real European national year name must not be invented from generic
// ISCED position. Exactly one historical exception has no comparable
// conventional national school-grade scheme in our school picker.
for(const code of EDUCATION_EUROPE_COUNTRIES){
 for(const stage of ['beginner','lower','medium']){
  const years=educationCountrySchoolYears(code,stage);
  if(code==='VA'){
   assert.equal(years.status,'grade-unmapped','Vatican cannot be misrepresented by a fictional national Physics syllabus');
   assert.ok(years.years.every(x=>x.id.startsWith('general-')));
  }else{
   assert.ok(['mapped-years','mapped-years-advisory'].includes(years.status),
    code+'/'+stage+' must use actual or structurally grounded school years');
   assert.ok(years.years.every(x=>!x.id.startsWith('general-')),
    code+'/'+stage+' cannot relabel the generic P1/L1/U1 placeholders as a national class');
  }
 }
}
const ireland=educationCountrySchoolYears('IE','beginner').years.map(x=>x.id);
assert.deepEqual(ireland,['JI','SI','1C','2C','3C','4C','5C','6C'],
 'Ireland has Junior/Senior Infants followed by six classes');
assert.deepEqual(educationCountrySchoolYears('IE','medium').years.map(x=>x.id),
 ['TY','5Y','6Y'],'Transition Year must not be a fabricated compulsory third Leaving Certificate year');
assert.equal(educationCountrySchoolYears('DK','beginner').years[0].id,'1',
 'Optional Danish preschool class 0 must not become a first Physics school year');
for(const [country,grade,expected] of [
 ['RO','5','not-offered'],['FR','6e','integrated-science'],['MD','5','not-offered'],
 ['HU','5','not-offered'],['PL','V','not-offered'],
 ['LV','7','not-offered'],['DK','7','mixed-physics-chemistry'],
 ['FI','7','framework-advisory'],['NO','8','integrated-science']
]){
 const years=educationCountrySchoolYears(country,'lower').years;
 const status=physicsCountryGradePlan({country,stage:'lower',grade,years}).status;
 assert.equal(status,expected,country+'/'+grade+' subject status must match school structure');
}

const minByStage=Object.fromEntries(Object.entries(counts).map(([stage,all])=>[stage,Math.min(...all)]));
const maxByStage=Object.fromEntries(Object.entries(counts).map(([stage,all])=>[stage,Math.max(...all)]));
const weakest=coverage.sort((a,b)=>a.lessons-b.lessons).slice(0,24);
console.log('Physics country-year audit',JSON.stringify({
 systems:EDUCATION_EUROPE_COUNTRIES.length,years:coverage.length,
 integrated:integrated.length,unverifiedYearAssignments:generic.length,
 minByStage,maxByStage,weakest,errors:errors.slice(0,24)
}));
assert.deepEqual(errors,[],'Every offered Physics year must show real original and unique lesson cards');
for(const stage of ['primary','lower','upper'])assert.ok(minByStage[stage]>=18,
 'No offered school grade may consist of just one or two Physics lessons');
assert.ok(minByStage.lower>=32,'Lower-school Physics must have a meaningful year of practice opportunities');
assert.ok(minByStage.upper>=32,'Upper-school Physics must include worked study cases rather than a few definitions');
