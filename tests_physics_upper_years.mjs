import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears,
 educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';
import {PHYSICS_TOPICS,PHYSICS_LESSONS} from './physics_curriculum.mjs';
import {THEORY_ENTRIES} from './education_theory.mjs';
import {PHYSICS_UPPER_ENGLISH_BANK} from './physics_upper_english_bank.mjs';
import {physicsCountryGradePlan} from './physics_europe_frameworks.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {scienceSchoolTopicLessons} from './science_ro_course_plan.mjs';
import {scienceSchoolLessonMaterial,scienceSchoolLessonAssessment} from './science_school_lesson_material.mjs';

const topics=Object.keys(PHYSICS_UPPER_ENGLISH_BANK);
assert.equal(topics.length,14,'Every common upper-school Physics area needs authored lessons');
assert.ok(Object.values(PHYSICS_UPPER_ENGLISH_BANK).every(rows=>rows.length===6),
 'Each of the 14 areas needs 6 distinct advanced lessons, not one repeated heading');
const allEnglish=Object.values(PHYSICS_UPPER_ENGLISH_BANK).flat();
assert.equal(new Set(allEnglish.map(x=>x.id)).size,84);
for(const entry of allEnglish){
 assert.ok(entry.title.length>=9&&entry.statement.length>=130,'Substantive Physics concept required: '+entry.id);
 assert.ok(entry.workedExample.length>=35&&entry.exercise.length>=18&&entry.answer.length>=10,
  'Real worked example and rubric are required for '+entry.id);
 assert.equal(entry.language,'en');
 assert.ok(entry.nationallyVerified===false);
 assert.doesNotMatch(entry.statement,/sorry|placeholder|coming soon|as an ai/i);
}
for(const [country,lower,upper,primary] of [
 ['FI',['7','8','9'],['L1','L2','L3'],['1','2','3','4','5','6']],
 ['SE',['7','8','9'],['Gy1','Gy2','Gy3'],['1','2','3','4','5','6']],
 ['NO',['8','9','10'],['Vg1','Vg2','Vg3'],['1','2','3','4','5','6','7']],
 ['DK',['7','8','9'],['G1','G2','G3'],['0','1','2','3','4','5','6']]
 ]){
 for(const [stage,expected] of [['lower',lower],['medium',upper],['beginner',primary]]){
  assert.deepEqual(educationCountrySchoolYears(country,stage).years.map(y=>y.id),expected,
   country+' should have correct national year identifiers and duration');
 }
}
const frYears=educationCountrySchoolYears('FR','lower').years;
assert.equal(physicsCountryGradePlan({country:'FR',grade:'6e',stage:'lower',years:frYears}).kind,'integrated',
 'France 6e uses integrated science, not a mandatory separate Physique-Chimie subject');
const dkYears=educationCountrySchoolYears('DK','lower').years;
assert.equal(physicsCountryGradePlan({country:'DK',grade:'7',stage:'lower',years:dkYears}).kind,'mixed',
 'Danish classes 7-9 use combined Physics/Chemistry');
const noYears=educationCountrySchoolYears('NO','lower').years;
assert.equal(physicsCountryGradePlan({country:'NO',grade:'8',stage:'lower',years:noYears}).kind,'integrated',
 'Norwegian lower school is Naturfag, not a fake standalone Physics programme');

let annualYears=0,originalCourseCards=0,advisorySourceMissing=[];
for(const country of EDUCATION_EUROPE_COUNTRIES){
 const years=educationCountrySchoolYears(country,'medium').years;
 const signatures=new Set();
 for(const year of years){
  const plan=scienceGradeTopicPlan({country,subject:'physics',stage:'upper',
   grade:year.id,years,topics:PHYSICS_TOPICS});
  const catalogue=educationSubjectSchoolPlan({country,stage:'medium',subject:'physics',grade:year.id});
  assert.deepEqual(catalogue.units.map(x=>x.id),plan.topics.map(x=>x.id),
   'Upper year/topics differ between Android and curriculum matrix: '+country+'/'+year.id);
  assert.ok(plan.topics.length>=4,'Do not deliver an upper year as a single Physics chapter');
  signatures.add(plan.topics.map(x=>x.id).join('|'));
  let total=0;
  for(const topic of plan.topics){
   const cards=scienceSchoolTopicLessons({country,subject:'physics',
    stage:'upper',grade:year.id,topic:topic.id,years,
    lessons:THEORY_ENTRIES,language:'en'});
   assert.ok(cards.length>=6,country+'/'+year.id+'/'+topic.id+' requires individual upper lessons');
   assert.equal(new Set(cards.map(x=>x.id)).size,cards.length,'No duplicate lesson id');
   assert.equal(catalogue.units.find(x=>x.id===topic.id)?.lessonCount,cards.length,
    'Catalogue must count ACTUAL annual learning cards');
   for(const card of cards){
    assert.ok(card.statement&&card.workedExample&&card.exercise&&card.answer,
     'No dead lesson or answer check in '+country+'/'+year.id+'/'+card.id);
    assert.equal(card.nationallyVerified,false,'Advisory material must never appear as national textbook');
    const rubric=scienceSchoolLessonAssessment({entry:card,subject:'physics',
     topic:topic.id,language:'en'});
    assert.ok(rubric.guide.includes(card.answer),'Assessment references the selected exercise');
    const body=scienceSchoolLessonMaterial({entry:card,subject:'physics',
     grade:year.id,chapter:topic.en,language:'en'});
    assert.ok(body.includes(card.statement)&&body.includes(card.workedExample),
     'Actual theory and worked example must open, not a generic topic frame');
    originalCourseCards++;
   }
   total+=cards.length;
  }
  assert.ok(total>=32,'Every upper-year advisory course needs meaningful breadth: '+country+'/'+year.id+' '+total);
  if(!catalogue.source?.startsWith('https://'))advisorySourceMissing.push(country+'/'+year.id);
  annualYears++;
 }
 if(years.length>=4)assert.ok(signatures.size>=3,
  country+' must not present one identical topic selection for every upper year');
}
assert.deepEqual(advisorySourceMissing,[],'Source scope must be transparent for every Physics course');
assert.equal(EDUCATION_EUROPE_COUNTRIES.length,50);
assert.ok(annualYears>=130,'Audit every country and its actual upper-year picker');
const html=await(await frontend.fetch(new Request('https://physics-all-upper-grades.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
assert.ok(script);
new vm.Script(script);
assert.ok(script.includes('const PHYSICS_UPPER_ENGLISH_BANK='),
 'WebView has to embed source data, not only a function with missing closure');
assert.ok(script.includes('const physicsUpperYearLessons='),
 'Android upper Physics must render from the authored year-level bank');
assert.ok(script.includes("scienceJourney.schoolStage==='upper'&&subjectId==='physics'"),
 'Upper Physics shows actual lesson list, not one false chapter');
console.log('PASS Physics upper 50 countries: '+annualYears+' school-year routes; '+
 originalCourseCards+' lesson+assessment checks; 84 distinct original advanced English concepts, national year labels and source truthfulness');
