import assert from 'node:assert/strict';
import frontend from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {PHYSICS_UPPER_CASES} from './physics_upper_cases.mjs';
import {PHYSICS_UPPER_CASES_EN} from './physics_upper_cases_en.mjs';
import {PHYSICS_TOPICS} from './physics_curriculum.mjs';
import {THEORY_ENTRIES} from './education_theory.mjs';
import {scienceSchoolTopicLessons} from './science_ro_course_plan.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {scienceSchoolLessonMaterial,scienceSchoolLessonAssessment} from './science_school_lesson_material.mjs';

assert.equal(Object.keys(PHYSICS_UPPER_CASES).length,14);
assert.equal(Object.keys(PHYSICS_UPPER_CASES_EN).length,14);
let audited=0,examples=0;
for(const topic of Object.keys(PHYSICS_UPPER_CASES)){
 const ro=PHYSICS_UPPER_CASES[topic],en=PHYSICS_UPPER_CASES_EN[topic];
 assert.equal(ro.length,3,'Each chapter has three original high-school cases in Romanian');
 assert.equal(en.length,3,'Each chapter has three original high-school cases in English');
 for(let i=0;i<3;i++){
  assert.ok(ro[i].statement.length>=95&&ro[i].workedExample.length>=65);
  assert.ok(en[i].statement.length>=95&&en[i].workedExample.length>=65);
  assert.ok(en[i].exercise.length>=18&&en[i].answer.length>=4);
  assert.ok(!en[i].title.includes(ro[i].title),'Author a real English concept, not copied Romanian body');
 }
}
for(const country of EDUCATION_EUROPE_COUNTRIES){
 const years=educationCountrySchoolYears(country,'medium').years;
 for(const grade of years){
  const plan=scienceGradeTopicPlan({country,subject:'physics',stage:'upper',grade:grade.id,
   years,topics:PHYSICS_TOPICS});
  const all=plan.topics.flatMap(t=>scienceSchoolTopicLessons({
   country,subject:'physics',stage:'upper',grade:grade.id,
   topic:t.id,years,lessons:THEORY_ENTRIES,language:'en'
  }));
  assert.ok(all.length>=32,'A high-school year cannot be four loose definitions: '+country+'/'+grade.id+' '+all.length);
  assert.equal(all.length,new Set(all.map(x=>x.id)).size,'No duplicate high-school sublesson ID');
  const original=all.filter(x=>x.source==='original-upper-physics-advisory'&&x.language==='en');
  const prerequisite=all.filter(x=>x.reviewOnly);
  assert.ok(original.length>=12,'High-school year needs actual independently authored English subject lessons');
  assert.ok(prerequisite.every(x=>x.title.startsWith('Prerequisite review:')),
   'Earlier-grade topics must be clearly labelled review instead of falsely presented as new upper-year requirements');
  assert.ok(all.every(x=>x.language==='en'),'Never insert untranslated Romanian cards in English high-school lessons');
  for(const item of original){
   const body=scienceSchoolLessonMaterial({entry:item,subject:'physics',grade:grade.id,
    chapter:item.topic,language:'en'});
   assert.ok(body.includes(item.statement)&&body.includes(item.workedExample)&&body.includes(item.exercise),
    'Keep the real English scientific explanation, case and practice');
   assert.ok(!body.includes('Romanian reference lesson'),'English original must not be labelled as untranslated Romanian');
   const check=scienceSchoolLessonAssessment({entry:item,subject:'physics',topic:item.topic,language:'en'});
   assert.ok(check.guide.includes(item.answer)&&check.prompt.includes(item.exercise));
   examples++;
  }
  audited++;
 }
}
const html=await(await frontend.fetch(new Request('https://physics-upper-bilingual.test/'))).text();
assert.ok(html.includes('const PHYSICS_UPPER_CASES=')&&html.includes('const PHYSICS_UPPER_CASES_EN='),
 'Embed original detailed upper-grade reference cases in the Android WebView');
assert.ok(html.includes('const physicsUpperYearLessons='),
 'Keep original per-grade course selection in the WebView');
console.log('PASS upper Physics: 50 systems; '+audited+' years; '+examples+
 ' authored English topic cases with worked problems and assessment, all lesson lists substantive and clearly labelled');
