import assert from 'node:assert/strict';
import {educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {scienceSchoolTopicLessons} from './science_ro_course_plan.mjs';
import {THEORY_ENTRIES} from './education_theory.mjs';

// Spiral revision may revisit physical laws, but a pupil must never be served
// exactly the same question and investigation under another grade label.
let checks=0;
for(const [country,gradeA,gradeB,topic] of [
 ['PT','7','8','energy'],
 ['MD','6','7','energy'],
 ['SK','6','7','heat'],
 ['FR','6e','5e','energy']
]){
 const years=educationCountrySchoolYears(country,'lower').years;
 for(const language of ['ro','en']){
  const retrieve=grade=>scienceSchoolTopicLessons({
   country,subject:'physics',stage:'lower',grade,years,topic,
   language,lessons:THEORY_ENTRIES
  });
  const a=retrieve(gradeA),b=retrieve(gradeB);
  assert.equal(a.length,8);
  assert.equal(b.length,8);
  assert.ok(a.every(x=>x.exercise.length>=65&&x.answer.length>=40));
  assert.ok(b.every(x=>x.exercise.length>=65&&x.answer.length>=40));
  assert.equal(new Set(a.map(x=>x.exercise)).size,8);
  assert.equal(new Set(b.map(x=>x.exercise)).size,8);
  assert.ok(a.every((entry,i)=>entry.exercise!==b[i].exercise),
   country+'/'+topic+'/'+language+' must give different year-specific practice');
  const expected=language==='ro'?'Extensie pentru «':'Year extension for “';
  assert.ok(a.every(x=>x.exercise.includes(expected)&&x.exercise.includes(x.title)),
   'Every extension must be explicitly tied to its own lesson, not a shared filler prompt');
  checks++;
 }
}
assert.equal(checks,8);
console.log('PASS Physics: adjacent country-years revisit concepts with distinct original-lesson inquiry and assessment prompts');
