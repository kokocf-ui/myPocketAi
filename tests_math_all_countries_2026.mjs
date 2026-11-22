import assert from 'node:assert/strict';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears,educationSubjectSchoolPlan}
 from './education_all_country_subject_matrix.mjs';
import {mathCountryGradeAreas} from './math_country_grade_areas.mjs';
let examined=0;
for(const country of EDUCATION_EUROPE_COUNTRIES){
 for(const stage of ['beginner','lower','medium','advanced']){
  const {years}=educationCountrySchoolYears(country,stage);
  for(const grade of years){
   const plan=educationSubjectSchoolPlan({country,stage,grade:grade.id,subject:'mathematics'});
   assert.equal(plan.status,'general-learning');
   assert.ok(plan.units.length>=3,country+' '+stage+' '+grade.id+' has usable named branches');
   assert.ok(plan.units.every(x=>x.ro&&x.en));
   if(stage==='beginner')assert.ok(plan.units.some(x=>x.id==='arithmetic'),'Primary arithmetic');
   if(stage==='lower'){
    assert.ok(plan.units.some(x=>x.id==='algebra'),'Secondary algebra');
    assert.ok(!plan.units.some(x=>x.id==='arithmetic'),'No separate secondary arithmetic');
   }
   examined++;
  }
 }
}
assert.equal(mathCountryGradeAreas({country:'RO',stage:'lower',grade:'invalid',years:[]}).status,'invalid-selection');
console.log('PASS',examined,'math country/year paths');
