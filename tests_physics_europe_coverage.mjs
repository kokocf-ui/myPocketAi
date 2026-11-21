import assert from 'node:assert/strict';
import frontend from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears,educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';
import {PHYSICS_TOPICS} from './physics_curriculum.mjs';
import {THEORY_ENTRIES} from './education_theory.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {physicsCountryGradePlan,PHYSICS_EUROPE_REFERENCES,PHYSICS_EUROPE_REFERENCE} from './physics_europe_frameworks.mjs';
import {scienceSchoolTopicLessons} from './science_ro_course_plan.mjs';
import {PHYSICS_LOWER_ENGLISH_LESSONS} from './physics_lower_english_lessons.mjs';
import {scienceSchoolLessonMaterial,scienceSchoolLessonAssessment} from './science_school_lesson_material.mjs';

let annual=0,nativeYears=0,advisoryYears=0,noStandalone=0,integrated=0,emptyChapters=0;
let englishLessonYears=0,englishCards=0;
const issues=[];
for(const code of EDUCATION_EUROPE_COUNTRIES){
 for(const [stage,matrixStage] of [['primary','beginner'],['lower','lower'],['upper','medium']]){
  const school=educationCountrySchoolYears(code,matrixStage);
  const years=school.years;
  assert.ok(years.length>=1,code+'/'+stage+' has no usable year selector');
  for(const year of years){
   const national=physicsCountryGradePlan({country:code,stage,grade:year.id,years});
   const course=scienceGradeTopicPlan({country:code,subject:'physics',stage,
    grade:year.id,years,topics:PHYSICS_TOPICS});
   const matrix=educationSubjectSchoolPlan({country:code,stage:matrixStage,grade:year.id,subject:'physics'});
   assert.deepEqual(matrix.units.map(x=>x.id),course.topics.map(x=>x.id),
    'Year selector, school matrix and Android Physics must agree: '+code+'/'+stage+'/'+year.id);
   assert.ok(national.source&&national.source.startsWith('https://'),
    'Every course has traceable framework or comparative source');
   assert.equal(national.verifiedAnnual,false,
    'Do not claim official year-by-year contents from general stage outcomes');
   if(PHYSICS_EUROPE_REFERENCES[code])nativeYears++;
   else{
    advisoryYears++;
    assert.equal(national.source,PHYSICS_EUROPE_REFERENCE,
     'Unknown Physics curriculum must use European comparative reference');
   }
   if(national.status==='not-offered'){
    assert.equal(course.topics.length,0,'Not-taught course must have zero fake chapters');
    noStandalone++;continue;
   }
   assert.ok(course.topics.length>0,code+'/'+stage+'/'+year.id+' must have study units');
   if(national.kind==='integrated'||national.kind==='mixed')integrated++;
   if(stage==='lower'){
    let lessons=0;
    for(const topic of course.topics){
     const real=scienceSchoolTopicLessons({country:code,subject:'physics',
      stage,grade:year.id,topic:topic.id,lessons:THEORY_ENTRIES,years});
     if(!real.length){emptyChapters++;issues.push(code+'/'+year.id+'/'+topic.id);}
     assert.equal(new Set(real.map(x=>x.id)).size,real.length,'Duplicate chapter ID');
     for(const item of real){
      assert.ok(item.title?.trim()&&item.statement?.length>=40,
       'Physics lesson missing real scientific content: '+code+'/'+year.id+'/'+item.id);
      assert.ok(item.source||item.level,
       'Advisory cards must declare their provenance');
     }
     lessons+=real.length;
     if(code!=='RO'){
      const english=scienceSchoolTopicLessons({country:code,subject:'physics',stage,
       grade:year.id,topic:topic.id,lessons:THEORY_ENTRIES,years,language:'en'});
      assert.equal(english.length,8,
       'Each non-Romanian advisory lower domain needs 8 genuine independent English lessons: '+
       code+'/'+year.id+'/'+topic.id);
      assert.equal(new Set(english.map(x=>x.title)).size,english.length,
       'English learning cards cannot be the same renamed filler');
      for(const card of english){
       assert.equal(card.language,'en','Original English reference, not Romanian school text');
       assert.ok(card.statement.length>=90&&card.workedExample.length>=35,
        'Substantive English explanation with an individual worked illustration required: '+code+'/'+year.id+'/'+card.title);
       assert.ok(card.exercise.length>=30,
        'Independent English exercise required: '+code+'/'+year.id+'/'+card.title);
       const rubric=scienceSchoolLessonAssessment({entry:card,subject:'physics',
        topic:topic.id,language:'en'});
       assert.ok(rubric?.guide?.length>=120&&rubric.prompt.includes(card.exercise),
        'Each exercise needs context-rich reference criteria and its own question');
       const body=scienceSchoolLessonMaterial({entry:card,subject:'physics',
        grade:year.id,chapter:topic.en,language:'en'});
       assert.ok(body.includes(card.statement)&&body.includes(card.workedExample),
        'Study material must contain the actual English lesson, not generic chapter reuse');
       assert.ok(!body.includes('Romanian reference lesson'),'Do not incorrectly label original English');
       englishCards++;
      }
     }
    }
    if(code!=='RO'){
     assert.ok(course.topics.length>=4,'A school-year overview cannot be one or two arbitrary topics');
     assert.ok(englishCards>0,'No empty English learning year');
     englishLessonYears++;
    }
    assert.ok(lessons>=10,code+'/'+year.id+' Physics has too few original study lessons: '+lessons);
   }
   annual++;
  }
 }
}
assert.equal(Object.keys(PHYSICS_LOWER_ENGLISH_LESSONS).length,13);
assert.ok(Object.values(PHYSICS_LOWER_ENGLISH_LESSONS).every(x=>x.length===8),
 'Each of 13 original English Physics strands must have eight lessons, not placeholders');
assert.ok(englishLessonYears>=100&&englishCards>=3000,
 'Independent English reference must be useful for foreign school years');
assert.equal(EDUCATION_EUROPE_COUNTRIES.length,50);
assert.ok(annual>=300,'Audit every European country and school-year route');
assert.equal(emptyChapters,0,'Listed chapter missing authored lessons: '+issues.slice(0,25).join(', '));
const html=await(await frontend.fetch(new Request('https://physics-all-europe.test/'))).text();
assert.ok(html.includes('const physicsCountryGradePlan='),
 'WebView must embed actual country/year rule');
assert.ok(html.includes('const physicsAdvisoryTopicLessons='),
 'WebView must embed real advisory lesson selection');
assert.ok(html.includes('const PHYSICS_EUROPE_REFERENCES='),
 'WebView must carry verifiable source classifications');
console.log('PASS Physics Europe: '+EDUCATION_EUROPE_COUNTRIES.length+
 ' systems; '+annual+' taught/integrated year paths, '+nativeYears+' sourced-framework years, '+
 advisoryYears+' explicitly advisory years, '+noStandalone+' not-offered and '+integrated+
 ' integrated/mixed learning routes, '+englishLessonYears+
 ' lower-year English routes and '+englishCards+' English lesson checks');
