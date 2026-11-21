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
 ['SK',['1','2','3','4'],['5','6','7','8','9'],['G1','G2','G3','G4']],
 ['AL',['1','2','3','4','5'],['6','7','8','9'],['10','11','12']],
 ['BY',['1','2','3','4'],['5','6','7','8','9'],['10','11']],
 ['CY',['1','2','3','4','5','6'],['G1','G2','G3'],['L1','L2','L3']],
 ['LT',['1','2','3','4'],['5','6','7','8','9','10'],['11','12']],
 ['MK',['1','2','3','4','5','6'],['7','8','9'],['G1','G2','G3','G4']],
 ['ME',['1','2','3','4','5','6'],['7','8','9'],['G1','G2','G3','G4']],
 ['MT',['Y1','Y2','Y3','Y4','Y5','Y6'],['Y7','Y8'],['Y9','Y10','Y11']],
 ['RU',['1','2','3','4'],['5','6','7','8','9'],['10','11']],
 ['SI',['1','2','3','4','5','6'],['7','8','9'],['G1','G2','G3','G4']],
 ['BA',['1','2','3','4','5'],['6','7','8','9'],['G1','G2','G3','G4']],
 ['IS',['1','2','3','4','5','6','7'],['8','9','10'],['U1','U2','U3']],
 ['LU',['C2.1','C2.2','C3.1','C3.2','C4.1','C4.2'],['7e','6e','5e'],['4e','3e','2e','1re']],
 ['MC',['CP','CE1','CE2','CM1','CM2'],['6e','5e','4e','3e'],['2nde','1re','terminale']],
 ['SM',['E1','E2','E3','E4','E5'],['M1','M2','M3'],['S1','S2','S3','S4','S5']],
 ['XK',['1','2','3','4','5'],['6','7','8','9'],['10','11','12']]
];
let checked=0;
for(const [country,primary,lower,upper] of curriculum){
 for(const [stage,schoolStage,expected] of [
  ['beginner','primary',primary],['lower','lower',lower],['medium','upper',upper]]){
  const years=educationCountrySchoolYears(country,stage);
  const ids=years.years.map(x=>x.id);
  const normalized=x=>country==='CY'&&schoolStage==='primary'?
   String(x).replace(/^P(?=\d+$)/,''):String(x);
  assert.deepEqual(ids.map(normalized),expected.map(normalized),
   country+'/'+schoolStage+' should preserve native documented school years; Cyprus P1 and 1 both denote first primary year');
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
const mt=educationCountrySchoolYears('MT','lower').years;
assert.equal(physicsCountryGradePlan({country:'MT',stage:'lower',grade:'Y7',years:mt}).kind,'integrated',
 'Malta Middle School Year 7 Physics is integrated, not separate upper Physics');
const mtUpper=educationCountrySchoolYears('MT','medium').years;
assert.notEqual(physicsCountryGradePlan({country:'MT',stage:'upper',grade:'Y9',years:mtUpper}).kind,'integrated',
 'Malta Secondary Years 9–11 explicitly teach Physics');
console.log('PASS documented native Physics school years for '+curriculum.length+
 ' jurisdictions with full year/stage coverage: '+checked+' country/year routes');
