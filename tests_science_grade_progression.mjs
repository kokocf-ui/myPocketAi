import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears,
 educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';
import {PHYSICS_TOPICS} from './physics_curriculum.mjs';
import {CHEMISTRY_TOPICS} from './chemistry_curriculum.mjs';
import {BIOLOGY_TOPICS} from './biology_curriculum.mjs';
import {ASTRONOMY_TOPICS} from './astronomy_curriculum.mjs';
import {SCIENCE_PROGRESSION_SOURCES,SCIENCE_PRIMARY_DEPTH,scienceGradeTopicPlan,scienceGradeLessonFrame} from './science_grade_progression.mjs';
import {SCIENCE_LOWER_TOPIC_LESSONS,scienceLowerTopicContent} from './science_lower_secondary_lessons.mjs';
import {EDUCATION_COUNTRY_UI_SCRIPT} from './education_country_ui.mjs';
import {EDUCATION_SCHOOL_YEARS} from './education_school_paths.mjs';

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
    if(schoolStage==='lower')for(const topic of plan.topics){
     const facts=scienceLowerTopicContent(subject,topic.id,'ro');
     const english=scienceLowerTopicContent(subject,topic.id,'en');
     assert.ok(facts&&english,
      country+'/'+year.id+'/'+subject+'/'+topic.id+' needs a complete lower-secondary lesson');
     assert.ok(facts.explanation.length>=70&&facts.workedExample.length>=35&&
      facts.exercise.length>=15&&facts.answer.length>=14&&
      facts.exercise!==facts.answer,
      'Not just a lesson title: '+country+'/'+year.id+'/'+subject+'/'+topic.id+' lengths '+[facts.explanation.length,facts.workedExample.length,facts.exercise.length,facts.answer.length].join('/'));
     assert.ok(english.explanation.length>=75&&english.workedExample.length>=35,
      'English version must contain independently authored substantive content');
     const p=years.findIndex(x=>x.id===year.id);
     const output=scienceGradeLessonFrame({subject,stage:'lower',grade:year.id,
      topic:topic.id,chapter:topic.ro,language:'ro',gradePosition:p});
     const translated=scienceGradeLessonFrame({subject,stage:'lower',grade:year.id,
      topic:topic.id,chapter:topic.en,language:'en',gradePosition:p});
     assert.ok(output.includes('Exemplu rezolvat')&&output.includes('Cum verifici'),
      'Reader must show full worked lesson and pupil feedback');
     assert.ok(output.includes(facts.workedExample)&&output.includes(facts.answer),
      'Reader must expose the selected lesson content, not generic boilerplate');
     assert.ok(translated.includes(english.workedExample)&&translated.includes(english.answer));
     assert.doesNotMatch(output,/programă obligatorie a țării|calificare oficială/);
     assert.notEqual(facts.explanation,english.explanation,'English must not be raw Romanian');
    }
    if(schoolStage==='upper')for(const topic of plan.topics){
     const output=scienceGradeLessonFrame({subject,stage:'upper',grade:year.id,
      topic:topic.id,chapter:topic.ro,language:'ro'});
     assert.ok(output.includes(topic.ro)&&output.includes('Investigație:'),
      'Upper-secondary learning must refer to the selected chapter and its question');
     assert.ok(output.length>180);
    }
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
// Exercise the actual WebView reader with a minimal DOM. One authored lower
// secondary lesson must remain accessible even when no legacy theory entries exist.
const readerStart=script.indexOf('function educationScienceTheoryReader(');
const readerEnd=script.indexOf('function scienceOpenChemistrySection(',readerStart);
assert.ok(readerStart>0&&readerEnd>readerStart,'Science reader was not emitted');
const readerSource=script.slice(readerStart,readerEnd);
const opened=[];
const journey={schoolStage:'lower',grade:'7',gradePosition:0};
const runtimeState={language:'ro'};
const lessonArgs=[];
function fakeElement(tag){return {tag,children:[],style:{},
 append(...children){this.children.push(...children)}};}
const readerContext={
 document:{createElement:fakeElement},
 scienceJourney:journey,state:runtimeState,
 EDUCATION_THEORY_DATA:[
  {subject:'chemistry',topic:'atomic',level:'beginner',title:'Atom'}, 
  {subject:'chemistry',topic:'atomic',level:'beginner',title:'Ioni'}
 ],
 scienceTopicInfo:()=>({ro:'Structura atomului',en:'Atomic structure'}),
 learningLabel:(ro,en)=>runtimeState.language==='ro'?ro:en,
 SCIENCE_GRADE_LESSON_FRAME:args=>{
  lessonArgs.push(args);
  return 'Original '+args.subject+' '+args.topic+' '+args.grade+' / '+args.gradePosition;
 },
 educationOpenPagedLesson:(title,body)=>opened.push({title,body})
};
const renderScienceReader=vm.runInNewContext(readerSource+';educationScienceTheoryReader',readerContext);
let rendered=renderScienceReader('chemistry','atomic','beginner');
assert.equal(rendered.children.length,2,'Only one lesson card follows the heading');
assert.match(rendered.children[0].textContent,/\\(1\\)/,'Do not promise duplicated lower-secondary lessons');
rendered.children[1].onclick();
assert.deepEqual(opened[0],{title:'Structura atomului',body:'Original chemistry atomic 7 / 0'});
assert.equal(lessonArgs.length,1,'Render only the selected chapter lesson');
readerContext.EDUCATION_THEORY_DATA=[];
journey.grade='8';journey.gradePosition=3;
rendered=renderScienceReader('chemistry','atomic','beginner');
assert.equal(rendered.children.length,2,'Missing legacy sublessons must not hide the authored chapter');
rendered.children[1].onclick();
assert.equal(opened.at(-1).body,'Original chemistry atomic 8 / 3',
 'Selecting a new grade must not reuse the previous lesson');
runtimeState.language='en';
rendered=renderScienceReader('chemistry','atomic','beginner');
rendered.children[1].onclick();
assert.equal(opened.at(-1).title,'Atomic structure','Localised chapter title must be used');

console.log('PASS 50 European jurisdictions: '+checked+' science grade routes; '+
 gradeVariations+' grade-varied plans, '+frontendRoutes+' visible Android year routes, '+advisoryStages+' fallback school stages, school-stage lessons and frontend syntax');
