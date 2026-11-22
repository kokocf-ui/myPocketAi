import assert from 'node:assert/strict';
import frontend from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {PHYSICS_TOPICS} from './physics_curriculum.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {physicsPrimaryYearLessons} from './physics_primary_lessons.mjs';
import {scienceSchoolTopicLessons} from './science_ro_course_plan.mjs';
import {scienceSchoolLessonMaterial,scienceSchoolLessonAssessment} from './science_school_lesson_material.mjs';
let yearsAudited=0,independentLessons=0;
for(const country of EDUCATION_EUROPE_COUNTRIES){
 const years=educationCountrySchoolYears(country,'beginner').years;
 let priorPrompt=null;
 for(const year of years){
  const outline=scienceGradeTopicPlan({country,subject:'physics',stage:'primary',
   grade:year.id,years,topics:PHYSICS_TOPICS});
  assert.ok(outline.topics.length>=2,country+'/'+year.id+' needs integrated physical science strands');
  let total=0;
  for(const topic of outline.topics){
   const ro=physicsPrimaryYearLessons({country,grade:year.id,topic:topic.id,years,language:'ro'});
   const en=scienceSchoolTopicLessons({country,grade:year.id,topic:topic.id,
    subject:'physics',stage:'primary',years,language:'en'});
   assert.equal(ro.length,6,'each primary Physics strand has 6 distinct concepts');
   assert.equal(en.length,ro.length,'English original must match the Romanian course structure');
   assert.equal(new Set(ro.map(x=>x.title)).size,6,'No repeated fake titles');
   assert.equal(new Set(en.map(x=>x.title)).size,6,'No repeated English fake titles');
   for(let i=0;i<ro.length;i++){
    const item=ro[i],english=en[i];
    assert.ok(item.statement.length>=60&&item.workedExample.length>=45,
     'Concept needs explanation and its own illustrative example');
    assert.notEqual(item.statement,english.statement,'English must be independent original text');
    assert.ok(english.statement.length>=45&&english.workedExample.length>=38);
    assert.ok(item.exercise.length>50&&item.answer.length>45);
    assert.ok(!english.id.startsWith('ro-'),'Cross-country primary lesson IDs are not Romanian textbooks');
    const body=scienceSchoolLessonMaterial({entry:english,subject:'physics',
     grade:year.id,chapter:topic.en,language:'en'});
    assert.ok(body.includes(english.statement)&&body.includes(english.workedExample));
    assert.ok(!body.includes('A verified translation into the selected language is not available'),
     'Do not falsely label original English source as untranslated');
    const rubric=scienceSchoolLessonAssessment({entry:english,subject:'physics',topic:topic.id,language:'en'});
    assert.ok(rubric.prompt===english.exercise&&rubric.guide.includes(english.answer),
     'Every original exercise gets a lesson-specific rubric');
    independentLessons++;
   }
   total+=ro.length;
  }
  assert.ok(total>=12,'Avoid a single primary chapter disguised as a course');
  const thisPrompt=physicsPrimaryYearLessons({country,grade:year.id,
   topic:outline.topics[0].id,years,language:'ro'})[0].exercise;
  if(priorPrompt!==null)assert.notEqual(priorPrompt,thisPrompt,
   'Two years cannot have the same primary enquiry exercise');
  priorPrompt=thisPrompt;
  yearsAudited++;
 }
}
const html=await(await frontend.fetch(new Request('https://physics-primary-year.test/'))).text();
assert.ok(html.includes("if(subject==='physics'&&stage==='primary'")&&
 html.includes('const scienceSchoolTopicLessons='),
 'Primary Physics must route through subject-specific original study lessons');
assert.ok(html.includes('const physicsPrimaryYearLessons='),
 'Primary grade/year scaffolds must exist in WebView');
console.log('PASS primary Physics strands: '+yearsAudited+' country-year routes, '+
 independentLessons+' original bilingual lesson/review pairs');
