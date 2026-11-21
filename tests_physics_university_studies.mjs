import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {PHYSICS_UNIVERSITY_STUDIES} from './physics_university_studies.mjs';
import {scienceUniversityChapter} from './science_university_chapters.mjs';
import {SCIENCE_UNIVERSITY_TRACK_GUIDES} from './science_university_track_guides.mjs';

const specialties={
 'special-quantum':'quantum','special-relativity':'relativity',
 'special-theory':'theory','special-condensed':'condensed',
 'special-nuclear':'nuclear','special-astro':'astro',
 'special-applied':'applied'
};
assert.deepEqual(Object.keys(PHYSICS_UNIVERSITY_STUDIES).sort(),Object.keys(specialties).sort());
let meaningful=0;
for(const [topic,specialty] of Object.entries(specialties)){
 const obj=PHYSICS_UNIVERSITY_STUDIES[topic];
 assert.equal(obj.ro.length,4,'Four independent Romanian university examples per specialty');
 assert.equal(obj.en.length,4,'Four independent English university examples per specialty');
 for(const language of ['ro','en']){
  const cases=obj[language];
  assert.equal(new Set(cases.map(x=>x.title)).size,4,'Distinct advanced study cases');
  for(const item of cases){
   assert.ok(item.explanation.length>=110&&item.workedExample.length>=70&&
    item.exercise.length>=15&&item.answer.length>=4,
    'Real advanced explanation, worked example and verifiable exercise required');
   assert.ok(item.title.length>=9);
   meaningful++;
  }
  const lessons=Array.from({length:3},(_,i)=>({subject:'physics',topic,
   level:'advanced',title:'Univ '+topic+' '+i,statement:'Independent specialist prerequisite concept '+(i+1)+
    ' which explains the relevant model and shows how to state a physical assumption.',
   formula:'E = h f'}));
  const page=scienceUniversityChapter({
   subject:'physics',topic,specialty,grade:'university',chapter:topic,
   language,lessons
  });
  assert.ok(page.length>2100,'University chapter must contain multiple developed study units, not a single definition');
  assert.ok(page.includes(SCIENCE_UNIVERSITY_TRACK_GUIDES.physics[specialty][language][1]),
   'Preserve the existing university specialisation case');
  for(const item of cases){
   assert.ok(page.includes(item.explanation)&&page.includes(item.workedExample)&&page.includes(item.exercise),
    'Every advanced case must be readable and have a task');
   assert.ok(!page.includes('## '+item.answer),
    'Never print a standalone answer key in the displayed lesson');
  }
  assert.ok(/not an accredited|NU un an universitar complet|nu program acreditat/.test(page),
   'Do not claim a four-exercise mini-course is a national university degree syllabus');
 }
}
const html=await(await frontend.fetch(new Request('https://physics-university-review.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(script);
for(const item of ['const PHYSICS_UNIVERSITY_STUDIES=',
 'science-review-exercise-choice','currentExercise().prompt','selectedExercise.guide',
 'if(subject===\'physics\'&&PHYSICS_UNIVERSITY_STUDIES[topic])'])
 assert.ok(script.includes(item),'University review UI must use chosen exercise-specific question and rubric: '+item);
console.log('PASS University Physics: 7 specialties, 28 original cases in both languages, 56 complete exercise/review pairs, selected prompt wired into existing Android modal');
