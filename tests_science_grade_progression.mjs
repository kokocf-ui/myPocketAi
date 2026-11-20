import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears,
 educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';
import {PHYSICS_TOPICS} from './physics_curriculum.mjs';
import {CHEMISTRY_TOPICS} from './chemistry_curriculum.mjs';
import {BIOLOGY_TOPICS} from './biology_curriculum.mjs';
import {ASTRONOMY_TOPICS} from './astronomy_curriculum.mjs';
import {SCIENCE_PROGRESSION_SOURCES,SCIENCE_PRIMARY_DEPTH,scienceGradeTopicPlan,scienceGradeLessonFrame}
import {EDUCATION_COUNTRY_UI_SCRIPT} from './education_country_ui.mjs';
import {EDUCATION_SCHOOL_YEARS} from './education_school_paths.mjs';
 from './science_grade_progression.mjs';

const tables={physics:PHYSICS_TOPICS,chemistry:CHEMISTRY_TOPICS,
 biology:BIOLOGY_TOPICS,astronomy:ASTRONOMY_TOPICS};
let checked=0,gradeVariations=0;
for(const country of EDUCATION_EUROPE_COUNTRIES){
 for(const [schoolStage,matrixStage] of [['primary','beginner'],['lower','lower'],['upper','medium']]){
  const years=educationCountrySchoolYears(country,matrixStage).years;
  assert.ok(years.length>0,country+' has no grade/fallback');
  for(const [subject,topics] of Object.entries(tables)){
   const signatures=new Set();
   for(const year of years){
    const plan=scienceGradeTopicPlan({country,subject,stage:schoolStage,grade:year.id,years,topics});
    const registry=educationSubjectSchoolPlan({
     country,subject,stage:matrixStage,grade:year.id
    });
    assert.equal(plan.status,'general-learning');
    assert.ok(plan.topics.length>0,country+'/'+schoolStage+'/'+year.id+'/'+subject);
    assert.equal(plan.source.length,SCIENCE_PROGRESSION_SOURCES.length);
    assert.deepEqual(registry.units.map(x=>x.id),plan.topics.map(x=>x.id),
     'The 50-country registry and Android must follow one science path');
    assert.ok(plan.topics.every(x=>!x.specialty),'Do not show university modules to a pupil');
    for(const topic of plan.topics){
     const limit=schoolStage==='upper'?1:0;
     const topicLevel={beginner:0,intermediate:1,advanced:2}[topic.minLevel]??0;
     assert.ok(topicLevel<=limit,'No higher-level lesson '+subject+'/'+topic.id);
     if(schoolStage==='primary'){
      const lesson= scienceGradeLessonFrame({subject,stage:'primary',grade:year.id,
       topic:topic.id,chapter:topic.ro,language:'ro'});
      const en= scienceGradeLessonFrame({subject,stage:'primary',grade:year.id,
       topic:topic.id,chapter:topic.en,language:'en'});
      assert.ok(lesson?.includes('Explicație:')&&lesson?.includes('Verificare:'),
       'Primary science needs a complete original lesson, not just a chapter title');
      assert.ok(en?.includes('Explore:')&&en?.includes('Review:'));
      assert.ok(lesson.includes('Explicație detaliată:')&&lesson.includes('Exemplu explicat:'),
       'An original primary lesson must have substantive content and an actual worked example');
      assert.ok(en.includes('Worked example:')&&en.includes('misconception:'),
       'English course must be complete, not a Romanian literal fallback');
      const depth=SCIENCE_PRIMARY_DEPTH[subject]?.[topic.id];
      assert.equal(depth?.ro?.length,3,'Every primary topic has theory, example and misconception in Romanian');
      assert.equal(depth?.en?.length,3,'Every primary topic has theory, example and misconception in English');
      const higher=scienceGradeLessonFrame({subject,stage:'primary',grade:year.id,
       topic:topic.id,chapter:topic.ro,language:'ro',gradePosition:3});
      assert.notEqual(
       higher.includes('Formulează o explicație bazată pe dovezi'),
       lesson.includes('Formulează o explicație bazată pe dovezi'),
       'Different primary years require different enquiry challenges');
      assert.ok(!en.includes('Parcurs generic')&&!en.includes('Lecție:'));
     }
    }
    signatures.add(plan.topics.map(x=>x.id).join('/'));
    checked++;
   }
   if(years.length>=3&&signatures.size>=2)gradeVariations++;
  }
 }
}
const first=EDUCATION_COUNTRY_UI_SCRIPT.indexOf('function eduYearOptions(');
const last=EDUCATION_COUNTRY_UI_SCRIPT.indexOf('function eduActiveSubjectCode(',first);
assert.ok(first>=0&&last>first);
const appYears=vm.runInNewContext(EDUCATION_COUNTRY_UI_SCRIPT.slice(first,last)+';eduYearOptions',{
 EDUCATION_SCHOOL_YEARS_DATA:EDUCATION_SCHOOL_YEARS,
 worldwideSchoolYears:()=>[],
 scienceJourney:{subject:'physics'}
});
let frontendRoutes=0,advisoryStages=0;
for(const country of EDUCATION_EUROPE_COUNTRIES){
 for(const [stage,uiStage] of [['primary','primary'],['lower','lower'],['upper','intermediate']]){
  const yrs=appYears(country,uiStage,'science');
  assert.ok(yrs.length>0,country+'/'+stage+' has no visible Science school years');
  assert.equal(new Set(yrs.map(y=>String(y.id))).size,yrs.length,'Duplicate Science year '+country+'/'+stage);
  const isAdvisory=yrs.some(y=>String(y.id).startsWith('general-'));
  if(isAdvisory){
   advisoryStages++;
   assert.equal(yrs.length,4,'Unmapped school stage must still offer FOUR distinct original learning years');
   assert.ok(yrs.every(y=>String(y.id).startsWith('general-')),
    'Never mix unverifiable national grades with generic years');
  }
  for(const [subject,topics] of Object.entries(tables)){
   const distinct=new Set();
   for(const year of yrs){
    const plan=scienceGradeTopicPlan({country,stage,grade:year.id,subject,years:yrs,topics});
    assert.equal(plan.status,'general-learning','UI Science plan must resolve');
    assert.ok(plan.topics.length>=1,country+'/'+stage+'/'+subject+'/'+year.id+' must have a chapter');
    distinct.add(plan.topics.map(x=>x.id).join('|'));
    frontendRoutes++;
   }
   if(isAdvisory)assert.ok(distinct.size>=2,
    country+'/'+stage+'/'+subject+' must progress between advisory school years');
  }
 }
}
assert.equal(EDUCATION_EUROPE_COUNTRIES.length,50);
assert.ok(frontendRoutes>=600);
assert.ok(checked>=600,'Audit every country and every stage even when national grades are unmapped');
assert.ok(gradeVariations>50,'Different grades must not share one unchanging list');
assert.equal(scienceGradeTopicPlan({country:'RO',subject:'biology',stage:'lower',
 grade:'unknown',years:[{id:'5'}],topics:BIOLOGY_TOPICS}).status,'invalid-selection');
assert.equal(scienceGradeLessonFrame({subject:'chemistry',stage:'lower',
 grade:'7',topic:'atomic',chapter:'Atomul',language:'ro'}).includes('Investigație:'),true);
const html=await(await frontend.fetch(new Request('https://sciences-grade-e2e.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Frontend emitted');
new vm.Script(script);
for(const hook of ['SCIENCE_GRADE_TOPIC_PLAN','SCIENCE_GRADE_LESSON_FRAME',
 "schoolStage:'primary'", 'scienceJourney.schoolStage=group.schoolStage',
 'SCIENCE_PRIMARY_ENGLISH','scienceGradeTopicPlan'])
 assert.ok(html.includes(hook),'Missing Android science integration: '+hook);
console.log('PASS 50 European jurisdictions: '+checked+' science grade routes; '+
 gradeVariations+' grade-varied plans, '+frontendRoutes+' visible Android year routes, '+advisoryStages+' fallback school stages, school-stage lessons and frontend syntax');
