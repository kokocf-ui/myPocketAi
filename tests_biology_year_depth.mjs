// Acceptance checks for the existing Sciences UI with Biology's real-year
// lecture inventory, exact badge counts and direct reference navigation.
// All content tests run OFFLINE. No Workers, transport APIs or AI credits.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {BIOLOGY_TOPICS,BIOLOGY_SPECIALIZATIONS,BIOLOGY_SPECIALTY_TOPICS} from './biology_curriculum.mjs';
import {scienceUniversityChapter} from './science_university_chapters.mjs';
import {biologyUniversityRoutes,biologyUniversityRoute,biologyUniversityYears,biologyUniversityCourseChoices,biologyUniversityCapstoneText} from './biology_university_years.mjs';
import {THEORY_ENTRIES} from './education_theory.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {scienceSchoolTopicLessons} from './science_ro_course_plan.mjs';
import {scienceSchoolLessonMaterial,scienceSchoolLessonAssessment} from './science_school_lesson_material.mjs';
import {BIOLOGY_UPPER_YEAR_TOPICS,BIOLOGY_UPPER_YEAR_BANK,biologyUpperYearLessons} from './biology_upper_course.mjs';
import {BIOLOGY_REFERENCE_GROUPS,BIOLOGY_REFERENCE,biologyReferenceText} from './biology_reference.mjs';

assert.equal(BIOLOGY_UPPER_YEAR_TOPICS.length,4);
assert.deepEqual(BIOLOGY_UPPER_YEAR_TOPICS.map(x=>x.length),[4,3,4,4]);
assert.equal(BIOLOGY_UPPER_YEAR_BANK.length,15,'Each selected annual chapter has authored study lessons');
const flat=BIOLOGY_UPPER_YEAR_BANK.flatMap(ch=>ch.lessons);
assert.equal(flat.length,45,'Four distinct Biology years have 45 original year-specific study lessons');
assert.equal(new Set(flat.map(x=>x.id)).size,45,'All year-specific lesson IDs must differ');
assert.equal(new Set(flat.map(x=>x.title)).size,45,'Do not repeat generic lesson titles');
const knownTopics=new Set(BIOLOGY_TOPICS.map(x=>x.id));
for(const chapter of BIOLOGY_UPPER_YEAR_BANK){
 assert.ok(knownTopics.has(chapter.topic),'Unknown chapter '+chapter.topic);
 assert.ok(BIOLOGY_UPPER_YEAR_TOPICS[chapter.year].includes(chapter.topic));
 assert.equal(chapter.lessons.length,3,'Chapter needs three individually selectable lessons');
 for(const entry of chapter.lessons){
  for(const key of ['id','title','statement','workedExample','exercise','answer','formula'])
   assert.ok(String(entry[key]||'').length>=5,entry.id+' missing '+key);
  assert.ok(entry.statement.length>=115,entry.id+' must explain biological concepts, not a one-line definition');
  assert.ok(entry.workedExample.length>=110,entry.id+' must have specific worked illustration');
  const body=scienceSchoolLessonMaterial({entry,subject:'biology',grade:'9',chapter:chapter.topic,language:'ro'});
  assert.ok(body?.includes(entry.statement)&&body.includes(entry.workedExample)&&body.includes(entry.exercise));
  assert.match(body,/Exemplu explicat/);
  assert.match(body,/Exercițiu pentru elev/);
  assert.match(body,/Siguranță/);
 }
}
const roYears=['9','10','11','12'].map(id=>({id}));
const allRo=[];
for(const [pos,year] of roYears.entries()){
 const plan=scienceGradeTopicPlan({country:'RO',subject:'biology',stage:'upper',grade:year.id,years:roYears,topics:BIOLOGY_TOPICS});
 assert.deepEqual(plan.topics.map(x=>x.id),[...BIOLOGY_UPPER_YEAR_TOPICS[pos]],
  'Year-specific chapter plan must match the actual authored Biology lessons');
 const all=[];
 for(const topic of plan.topics){
  const entries=scienceSchoolTopicLessons({country:'RO',subject:'biology',grade:year.id,
   stage:'upper',topic:topic.id,years:roYears,lessons:THEORY_ENTRIES,language:'ro'});
  const fromBank=biologyUpperYearLessons({country:'RO',grade:year.id,topic:topic.id,years:roYears});
  assert.equal(entries.length,3,'Chapter badge must match its real accessible cards');
  assert.deepEqual(entries.map(x=>x.id),fromBank.map(x=>x.id));
  all.push(...entries);
 }
 assert.equal(all.length,plan.topics.length*3);
 allRo.push(...all.map(x=>x.id));
}
assert.equal(new Set(allRo).size,45,'Romanian high-school grades must not repeat the same annual lesson');
let countriesChecked=0,gradesChecked=0;
for(const country of EDUCATION_EUROPE_COUNTRIES){
 const yearList=educationCountrySchoolYears(country,'medium').years;
 if(!yearList.length)continue;
 countriesChecked++;
 for(const y of yearList){
  const plan=scienceGradeTopicPlan({country,subject:'biology',stage:'upper',grade:y.id,
   years:yearList,topics:BIOLOGY_TOPICS});
  assert.ok(plan.topics.length>=3,country+'/'+y.id+' upper-secondary Biology chapters missing');
  for(const topic of plan.topics){
   const entries=scienceSchoolTopicLessons({country,subject:'biology',grade:y.id,topic:topic.id,
    stage:'upper',years:yearList,lessons:THEORY_ENTRIES});
   assert.equal(entries.length,3,country+'/'+y.id+'/'+topic.id+' unexpected badge/reader mismatch');
   assert.ok(entries.every(x=>x.grade===String(y.id)),'Never replace local school-year label');
  }
  gradesChecked++;
 }
}
assert.ok(countriesChecked>=40,'Broad European upper-secondary year coverage');
assert.ok(gradesChecked>=80,'Country-specific year labels must be exercised');
// University route is selected per country and programme rather than
// silently offering one generic university year for all countries.
let degreesChecked=0;
for(const country of EDUCATION_EUROPE_COUNTRIES){
 const routes=biologyUniversityRoutes(country);
 assert.equal(routes.length,2);
 assert.deepEqual([...routes.map(x=>x.years)].sort(),[3,4]);
 assert.ok(biologyUniversityRoute(country,undefined).years>=3);
 for(const route of routes){
  const yearRows=biologyUniversityYears(country,route.id);
  assert.equal(yearRows.length,route.years);
  for(const specialty of BIOLOGY_SPECIALIZATIONS){
   const courses=yearRows.flatMap(y=>biologyUniversityCourseChoices({
    year:y.year,years:route.years,specialty:specialty.id,
    topics:[...BIOLOGY_TOPICS,...BIOLOGY_SPECIALTY_TOPICS],
    specializations:BIOLOGY_SPECIALIZATIONS
   }));
   assert.equal(courses.length,8,country+'/'+specialty.id+' courses');
   assert.equal(new Set(courses.map(x=>x.id)).size,8,'No duplicated university courses across years');
   for(const course of courses){
    assert.ok(course.university&&course.courseYear>=1&&course.courseYear<=route.years);
    if(course.id==='biology-capstone'){
     const document=biologyUniversityCapstoneText({specialty:specialty.id,year:course.courseYear,language:'ro'});
     assert.ok(document.length>=1700,'Final-year research project is substantive');
    }else{
     const doc=scienceUniversityChapter({
      subject:'biology',topic:course.id,specialty:specialty.id,
      chapter:course.ro,grade:'univ-'+course.courseYear,lessons:THEORY_ENTRIES,language:'ro'
     });
     assert.ok(doc?.length>900,'Actual specialist content missing: '+course.id);
    }
   }
   degreesChecked++;
  }
 }
}
assert.equal(biologyUniversityRoute('GB-SCT',null).years,4,'Scottish honours example is four years');
assert.equal(biologyUniversityRoute('RO',null).years,3,'Romanian advisory route defaults to 180 ECTS model');

assert.equal(BIOLOGY_REFERENCE_GROUPS.length,5);
assert.equal(BIOLOGY_REFERENCE.length,20,'Definitions plus actual applicable scientific principles');
assert.equal(new Set(BIOLOGY_REFERENCE.map(x=>x.id)).size,20);
for(const item of BIOLOGY_REFERENCE){
 assert.ok(BIOLOGY_REFERENCE_GROUPS.some(x=>x.id===item.group),'Ungrouped Biology concept');
 for(const field of ['ro','en','formula','explainRo','explainEn','exampleRo','exampleEn','scopeRo','scopeEn'])
  assert.ok(item[field]?.length>=4,item.id+'/'+field+' empty');
 const textRo=biologyReferenceText(item,'ro'),textEn=biologyReferenceText(item,'en');
 assert.ok(textRo.includes(item.explainRo)&&textRo.includes(item.exampleRo)&&textRo.includes(item.scopeRo));
 assert.ok(textEn.includes(item.explainEn)&&textEn.includes(item.exampleEn));
}
const html=await(await app.fetch(new Request('https://biology-annual-year-reference.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Actual Android WebView script');
new vm.Script(script);
for(const fragment of [
 'const BIOLOGY_UPPER_YEAR_BANK=',
 'const BIOLOGY_UPPER_YEAR_TOPICS=',
 'const biologyUpperYearLessons=',
 'const BIOLOGY_REFERENCE=',
 'const BIOLOGY_REFERENCE_GROUPS=',
 'const biologyUniversityYears=',
 'const biologyUniversityCourseChoices=',
 'const biologyUniversityCapstoneText=',
 'const biologyReferenceText=',
 "scienceJourney.subject==='biology'&&typeof biologyUniversityYears==='function'",
 "year:Number(String(scienceJourney.grade).slice(-1))",
 "subjectId==='biology'&&topicId==='biology-capstone'",
 "reference.onclick=()=>scienceJourneyShowChoices('biology-reference')",
 "else if(current==='biology-reference')scienceJourney.stage='years';",
 "subject:'biology',stage:'upper'",
 "subjectId==='biology'",
 "biologyReference?biologyReferenceText(law,state.language)",
])
 assert.ok(script.includes(fragment),'Missing Biology integration in Android: '+fragment);
assert.ok(script.includes("scienceSchoolTopicLessons({")&&script.includes("country:educationCountrySelection.code,subject:'biology',grade:scienceJourney.grade"),
 'Biology chapter count and reader both use year-selected lesson function');
// Execute the same WebView lesson renderer used by the Android application.
// The displayed total and clickable lesson cards must match for every RO
// high-school grade and each corresponding curriculum chapter.
const renderStart=script.indexOf('function educationScienceTheoryReader(');
const renderEnd=script.indexOf('\nfunction ',renderStart+30);
assert.ok(renderStart>0&&renderEnd>renderStart,'WebView lesson renderer extractable');
class FakeElement{
 constructor(tag){this.tag=tag;this.children=[];this.className='';this.style={};
  this.textContent='';this.onclick=null;this.hidden=false;}
 append(...children){this.children.push(...children);}
 replaceChildren(...children){this.children=[...children];}
 setAttribute(){}
}
const selectedChapter={id:'',ro:'',en:''},opened=[];
const lessonContext={
 document:{createElement:tag=>new FakeElement(tag)},
 state:{language:'ro'},scienceJourney:{schoolStage:'upper',level:'intermediate',grade:'9',gradePosition:0},
 educationCountrySelection:{code:'RO',label:'România'},
 EDUCATION_THEORY_DATA:THEORY_ENTRIES,
 eduYearOptions:()=>roYears,
 learningLabel:(ro,en)=>ro,
 scienceTopicInfo:()=>selectedChapter,
 scienceSchoolTopicLessons,scienceSchoolLessonMaterial,scienceSchoolLessonAssessment,
 SCIENCE_GUIDES:{biology:{}},SCIENCE_GUIDES_EN:{biology:{}},
 sciencePendingAssessmentSpec:null,
 educationOpenPagedLesson:(name,body)=>opened.push({name,body})
};
const render=vm.runInNewContext(script.slice(renderStart,renderEnd)+';educationScienceTheoryReader',lessonContext);
let clickableLessons=0;
for(const year of roYears){
 lessonContext.scienceJourney.grade=year.id;
 const plan=scienceGradeTopicPlan({country:'RO',subject:'biology',stage:'upper',grade:year.id,years:roYears,topics:BIOLOGY_TOPICS});
 for(const chapter of plan.topics){
  selectedChapter.id=chapter.id;selectedChapter.ro=chapter.ro;selectedChapter.en=chapter.en;
  const panel=render('biology',chapter.id,'intermediate');
  const grid=panel.children.find(x=>x.className==='science-theory-topic-list');
  assert.ok(grid,year.id+'/'+chapter.id+' no clickable lecture list');
  const expected=scienceSchoolTopicLessons({country:'RO',subject:'biology',stage:'upper',
   grade:year.id,topic:chapter.id,years:roYears,lessons:THEORY_ENTRIES});
  assert.equal(grid.children.length,expected.length,'App shows a different number of cards than advertised');
  assert.ok(panel.children[0].textContent.includes('('+expected.length+')'),'Reader header count mismatch');
  for(const [index,button] of grid.children.entries()){
   assert.ok(button.textContent.includes(expected[index].title));
   button.onclick();
   const openedLesson=opened.pop();
   assert.ok(openedLesson?.body.includes(expected[index].statement),
    'Button '+index+' in '+year.id+'/'+chapter.id+' opens no relevant theory');
   assert.ok(openedLesson.body.includes(expected[index].workedExample),
    'Button '+index+' must open a relevant worked example');
   clickableLessons++;
  }
 }
}
assert.equal(clickableLessons,45,'Every high-school Biology lesson must open from the real reader');
console.log('PASS Biology: 45 distinct authored upper lessons, '+countriesChecked+
 ' European country paths and '+gradesChecked+' grades, 20 references, WebView syntax and matching lesson counts');
