import assert from 'node:assert/strict';
import frontend from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears,educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';
import {PHYSICS_TOPICS} from './physics_curriculum.mjs';
import {PHYSICS_SPACE_LESSONS} from './physics_space_lessons.mjs';
import {physicsCountryGradePlan} from './physics_europe_frameworks.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {scienceSchoolTopicLessons} from './science_ro_course_plan.mjs';
import {scienceLowerTopicContent} from './science_lower_secondary_lessons.mjs';
import {scienceSchoolLessonMaterial,scienceSchoolLessonAssessment} from './science_school_lesson_material.mjs';

const yrs=educationCountrySchoolYears('PT','lower').years;
assert.deepEqual(yrs.map(y=>String(y.id)),['5','6','7','8','9']);
for(const id of ['5','6']){
 const plan=physicsCountryGradePlan({country:'PT',grade:id,stage:'lower',years:yrs});
 assert.equal(plan.status,'not-offered','No separate Physics/Físico-Química in Portuguese year '+id);
}
const grade7=physicsCountryGradePlan({country:'PT',grade:'7',stage:'lower',years:yrs});
assert.equal(grade7.kind,'mixed');
assert.equal(grade7.source,'https://www.dge.mec.pt/sites/default/files/7_fisico_quimica.pdf',
 'Link the correct March 2026 Portuguese school-year syllabus');
assert.ok(grade7.topics.includes('space'),
 'DGE March 2026 Grade 7 includes Espaço, Universo, Sistema Solar and gravitational forces');
assert.ok(!grade7.topics.includes('solar'),
 'Do not emit a chapter ID that Physics does not contain');
const physicalCourse=scienceGradeTopicPlan({
 country:'PT',subject:'physics',stage:'lower',grade:'7',years:yrs,topics:PHYSICS_TOPICS
});
assert.ok(physicalCourse.topics.some(topic=>topic.id==='space'),
 'Grade 7 Space must appear as an actual clickable chapter, not only in a note');
const matrix=educationSubjectSchoolPlan({country:'PT',stage:'lower',grade:'7',subject:'physics'});
assert.deepEqual(matrix.units.map(x=>x.id),physicalCourse.topics.map(x=>x.id));
assert.ok(matrix.units.some(x=>x.id==='space'&&x.lessonCount>=8));
assert.equal(PHYSICS_SPACE_LESSONS.ro.length,8);
assert.equal(PHYSICS_SPACE_LESSONS.en.length,8);
for(const language of ['ro','en']){
 const lessons=scienceSchoolTopicLessons({country:'PT',subject:'physics',grade:'7',
  stage:'lower',years:yrs,topic:'space',language});
 assert.equal(lessons.length,8,'Eight distinct authored learning tasks for '+language);
 assert.equal(new Set(lessons.map(x=>x.title)).size,8);
 assert.ok(lessons.every(item=>item.language===language&&item.statement.length>=170),
  'Real and correctly labelled '+language+' Space explanations');
 for(const item of lessons){
  const body=scienceSchoolLessonMaterial({entry:item,subject:'physics',grade:'7',
   chapter:language==='ro'?'Spațiul':'Space',language});
  assert.ok(body.includes(item.statement)&&body.includes(item.workedExample));
  assert.ok(body.includes(item.exercise));
  const check=scienceSchoolLessonAssessment({entry:item,subject:'physics',topic:'space',language});
  assert.ok(check.prompt.includes(item.exercise)&&check.guide.includes(item.answer));
 }
}
const guide=scienceLowerTopicContent('physics','space','en');
assert.ok(guide.explanation.length>=260&&guide.workedExample.length>=35);
assert.ok(guide.exercise!==guide.answer);
const otherCountry=educationCountrySchoolYears('GB-ENG','lower').years;
assert.ok(!scienceGradeTopicPlan({country:'GB-ENG',subject:'physics',stage:'lower',
 grade:'Y7',years:otherCountry,topics:PHYSICS_TOPICS}).topics.some(x=>x.id==='space'),
 'Do not misattribute a specifically Portuguese annual chapter to England Year 7');
assert.equal(EDUCATION_EUROPE_COUNTRIES.length,50);
const html=await(await frontend.fetch(new Request('https://portugal-physics-year-7.test/'))).text();
assert.ok(html.includes('const PHYSICS_SPACE_LESSONS='),'The eight real lessons must be bundled into the Android WebView');
console.log('PASS Portugal 7 Físico-Química: Space original physical-science syllabus, 8 bilingual lessons, exercises, answer checks, and country isolation');
