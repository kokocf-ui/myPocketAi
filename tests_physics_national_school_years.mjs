import assert from 'node:assert/strict';
import {educationCountrySchoolYears,educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';
import {PHYSICS_TOPICS} from './physics_curriculum.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {physicsCountryGradePlan} from './physics_europe_frameworks.mjs';
import {physicsPrimaryYearLessons} from './physics_primary_lessons.mjs';
import {scienceSchoolTopicLessons} from './science_ro_course_plan.mjs';
import {THEORY_ENTRIES} from './education_theory.mjs';
const curriculum=[
 ['IE',['JI','SI','1C','2C','3C','4C','5C','6C'],['J1','J2','J3'],['S1','S2','S3']],
 ['BG',['1','2','3','4'],['5','6','7'],['8','9','10','11','12']],
 ['EE',['1','2','3','4','5','6'],['7','8','9'],['10','11','12']],
 ['SK',['1','2','3','4'],['5','6','7','8','9'],['G1','G2','G3','G4']]
];
let checked=0;
for(const [country,primary,lower,upper] of curriculum){
 for(const [stage,schoolStage,expected] of [
  ['beginner','primary',primary],['lower','lower',lower],['medium','upper',upper]]){
  const years=educationCountrySchoolYears(country,stage);
  assert.deepEqual(years.years.map(x=>x.id),expected,
   country+'/'+schoolStage+' should preserve native documented school year identifiers');
  assert.equal(years.status,'mapped-years-advisory','Country years do not imply verified chapter content');
  for(const year of years.years){
   const path=scienceGradeTopicPlan({
    country,subject:'physics',stage:schoolStage,grade:year.id,years:years.years,topics:PHYSICS_TOPICS
   });
   const catalogue=educationSubjectSchoolPlan({
    country,subject:'physics',stage,grade:year.id
   });
   assert.equal(catalogue.verifiedManual,false);
   assert.equal(catalogue.status,'general-learning',
    'Physics stage sources alone cannot certify annual national grade content');
   assert.deepEqual(catalogue.units.map(x=>x.id),path.topics.map(x=>x.id));
   const route=physicsCountryGradePlan({
    country,stage:schoolStage,grade:year.id,years:years.years
   });
   if(route.status!=='not-offered'){
    assert.ok(path.topics.length>=2,country+'/'+year.id+' has active Physics-in-Science themes');
    const first=path.topics[0];
    if(schoolStage==='primary'){
     const cards=physicsPrimaryYearLessons({
      country,grade:year.id,topic:first.id,years:years.years,language:'en'
     });
     assert.ok(cards.length>=5,'Primary integrated course must be navigable');
    }else if(schoolStage==='lower'){
     const cards=scienceSchoolTopicLessons({country,stage:'lower',subject:'physics',
      grade:year.id,topic:first.id,years:years.years,lessons:THEORY_ENTRIES,language:'en'});
     assert.ok(cards.length>=5,'Lower school course must contain individual original lessons');
    }
   }
   checked++;
  }
 }
}
console.log('PASS documented national Physics year identifiers and sourced advisory pathways for Ireland, Bulgaria, Estonia, Slovakia: '+checked+' country/year routes');
