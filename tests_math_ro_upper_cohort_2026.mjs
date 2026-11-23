import assert from 'node:assert/strict';
import {RO_MATH_UPPER_COHORT_SOURCES,mathUpperCohortGuidance} from './math_ro_upper_cohort_policy.mjs';
import {mathCountryGradeAreas,mathCountryStudyYears} from './math_country_grade_areas.mjs';
import {educationCountrySchoolYears,educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';
const years=mathCountryStudyYears({country:'RO',stage:'medium',
 years:educationCountrySchoolYears('RO','medium').years});
assert.equal(years.length,5,'Four ordinary Romanian lycée years plus science-track specialization of Year IX');
const expected={9:'new-2026-cohort',10:'legacy-cohort',11:'legacy-cohort',12:'legacy-cohort'};
for(const [grade,status] of Object.entries(expected)){
 const guidance=mathUpperCohortGuidance({country:'RO',grade});
 const areas=mathCountryGradeAreas({country:'RO',stage:'medium',grade,years});
 const plan=educationSubjectSchoolPlan({country:'RO',stage:'medium',grade,subject:'mathematics'});
 assert.equal(guidance.status,status);
 assert.ok(guidance.note.includes('2026/27'));
 if(grade==='9'){
  assert.ok(areas.note.includes('noul curriculum'));
  assert.ok(areas.units.every(x=>x.countrySpecific===false&&
    x.curriculumCompletion==='unverified-advisory'));
 }else{
  assert.ok(areas.note.includes('curriculumul liceal anterior'));
  assert.ok(areas.units.length>=4&&areas.units.every(x=>x.schoolCohort===status));
  assert.ok(areas.units.every(x=>x.lessonCount>=3));
  assert.ok(areas.units.every(x=>x.countrySpecific===false&&x.curriculumCompletion==='unverified-advisory'));
 }
 assert.equal(plan.status,'general-learning','Policy warning is not a claim that the course follows the statutory syllabus');
}
const science=mathCountryGradeAreas({country:'RO',stage:'medium',grade:'9-SCI',years});
assert.ok(science.note.includes('Științe ale naturii'));
assert.equal(science.units.reduce((sum,u)=>sum+u.lessonCount,0),35);
assert.ok(science.units.every(x=>x.countrySpecific===true));
assert.equal(mathUpperCohortGuidance({country:'RO',grade:'9',schoolYear:'2027/28'}).status,'needs-cohort-review',
 'Do not carry 2026-specific transition assumptions into following academic years');
assert.equal(mathUpperCohortGuidance({country:'GB-ENG',grade:'9'}),null);
assert.ok(RO_MATH_UPPER_COHORT_SOURCES.transition.includes('edu.ro'));
console.log('PASS Romania 2026/27 maths high-school cohort selection and truthful advisory status');
