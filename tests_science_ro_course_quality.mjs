import assert from 'node:assert/strict';
import frontend from './index.js';
import {SCIENCE_RO_LOWER_TOPICS,scienceSchoolTopicLessons,
 scienceRoAnnualCoverage} from './science_ro_course_plan.mjs';
import {SCIENCE_GUIDES} from './science_extended_theory.mjs';
import {SCIENCE_GUIDES_EN} from './science_english_reference_guides.mjs';
import {scienceLowerTopicContent} from './science_lower_secondary_lessons.mjs';
import {SCIENCE_LOWER_DEPTH} from './science_lower_secondary_depth.mjs';
import {THEORY_ENTRIES} from './education_theory.mjs';
import {scienceSchoolLessonMaterial,scienceSchoolLessonAssessment} from './science_school_lesson_material.mjs';

const reports=[];
for(const [subject,classes] of Object.entries(SCIENCE_RO_LOWER_TOPICS)){
 for(const [grade,topics] of Object.entries(classes)){
  const audit=scienceRoAnnualCoverage({subject,grade,lessons:THEORY_ENTRIES});
  assert.ok(audit.studyDepthReady,'School year has to offer an actual substantial set of lessons: '+subject+'/'+grade);
  assert.ok(audit.lessonCount>=32,subject+'/'+grade+' must not be a single chapter');
  const unique=new Set();let detailed=0,assessable=0;
  for(const topic of topics){
   const items=scienceSchoolTopicLessons({country:'RO',subject,grade,topic,lessons:THEORY_ENTRIES});
   assert.ok(items.length,'Each named Romanian curriculum area must contain an individual study lesson '+subject+'/'+grade+'/'+topic);
   for(const entry of items){
    assert.ok(!unique.has(entry.id),'No duplicate sublesson in year '+subject+'/'+grade+'/'+entry.id);
    unique.add(entry.id);
    assert.ok(entry.title?.length>=3&&entry.statement?.length>=38,
      'No title-only or false lesson '+subject+'/'+grade+'/'+entry.id);
    const reference=scienceLowerTopicContent(subject,topic,'ro');
    const guide=SCIENCE_GUIDES[subject]?.[topic];
    const body=scienceSchoolLessonMaterial({entry,subject,grade,chapter:topic,language:'ro',chapterLesson:reference,guide});
    assert.ok(body?.includes(entry.statement),'Lesson opens its unique scientific definition');
    assert.ok(body.includes('# Exercițiu pentru elev'),'Every lesson has practice');
    assert.ok(body.includes('Material didactic original'),'Lesson provenance visible');
    assert.ok(body.includes('Siguranță:')||subject==='astronomy',
      'Subject safety note included');
    if(entry.workedExample){
     detailed++;
     assert.ok(body.includes(entry.workedExample),'Original worked explanation is present');
    }else{
     assert.ok(body.includes('Exemplu explicat'),
      'Native short cards need substantive worked example from trusted lesson context');
    }
    const review=scienceSchoolLessonAssessment({entry,subject,topic,language:'ro',chapterGuide:guide});
    assert.ok(review?.prompt?.length>=12&&review.guide?.length>=12,'No dead response-check button');
    assert.equal(review.localVerification,false,'A different exercise cannot inherit unrelated numeric key');
    assessable++;
   }
  }
  assert.equal(unique.size,audit.lessonCount,'Count displayed on Android agrees with unique lesson ids');
  if(subject==='biology'||subject==='physics')
   assert.equal(detailed,unique.size,
    'Grade-scoped original Physics/Biology must not import unrelated generic textbook concepts');
  assert.equal(assessable,unique.size);
  reports.push(subject+' '+grade+': '+unique.size+' lessons ('+topics.length+' areas)');
 }
}
// Grade VI physics must not include advanced circuitry or later-year mechanics
const grade6=SCIENCE_RO_LOWER_TOPICS.physics['6'].flatMap(topic=>
 scienceSchoolTopicLessons({country:'RO',subject:'physics',grade:'6',topic,lessons:THEORY_ENTRIES}));
for(const unsupported of ['Rezistoare în paralel','Forța Lorentz','Cădere liberă','Legea lui Joule'])
 assert.ok(!grade6.some(x=>x.title===unsupported),'Grade VI cannot inherit later-year course '+unsupported);
const grade5=SCIENCE_RO_LOWER_TOPICS.biology['5'].flatMap(topic=>
 scienceSchoolTopicLessons({country:'RO',subject:'biology',grade:'5',topic,lessons:THEORY_ENTRIES}));
assert.ok(!grade5.some(x=>/meioz|cromozom|hom(eo|eo)staz/i.test(x.title)),
 'Biology V focuses on habitats, classification and environment, not Grade VIII genetics');
const other=scienceSchoolTopicLessons({country:'GB-ENG',subject:'physics',grade:'Y7',topic:'units',lessons:THEORY_ENTRIES});
assert.ok(other.every(x=>!x.id.startsWith('ro-')),'Romanian original grade sequences must not masquerade as verified English curricula');
const html=await(await frontend.fetch(new Request('https://science-national-depth.test/'))).text();
assert.ok(html.includes("scienceJourney.schoolStage==='primary'&&scienceJourney.subject!=='physics'")&&
 html.includes("const chapterLessons=scienceSchoolTopicLessons({"),
 'Lower-secondary Study must show all sublessons; primary Physics also has a full list');
assert.ok(html.includes('const scienceSchoolLessonMaterial='),'Android receives authored sublesson materials');
assert.ok(html.includes('const SCIENCE_RO_LESSON_EXTRAS='),'Android receives the actual Romanian original syllabus bank');
console.log('PASS Romanian Sciences grade-specific original lesson quality: '+reports.join(' | '));
