import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {THEORY_ENTRIES} from './education_theory.mjs';
import {ASTRONOMY_TOPICS,ASTRONOMY_SPECIALIZATIONS,ASTRONOMY_LESSONS} from './astronomy_curriculum.mjs';
import {astronomySchoolTopicLessons} from './astronomy_study_course.mjs';
import {astronomyNationalAlignment} from './astronomy_country_alignment.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {scienceSchoolLessonMaterial,scienceSchoolLessonAssessment} from './science_school_lesson_material.mjs';
import {astronomyUniversityYears,astronomyUniversityRoute,astronomyUniversityRoutes,
 astronomyUniversityCourseChoices,astronomyUniversityStudyText,astronomyUniversityProjectText} from './astronomy_university_courses.mjs';
import {scienceSchoolTopicLessons,scienceRoAnnualCoverage} from './science_ro_course_plan.mjs';
import {PHYSICS_TOPICS,PHYSICS_SPECIALIZATIONS} from './physics_curriculum.mjs';
import {CHEMISTRY_TOPICS} from './chemistry_curriculum.mjs';
import {CHEMISTRY_SPECIALIZATIONS,CHEMISTRY_SPECIALTY_TOPICS} from './chemistry_advanced.mjs';
import {BIOLOGY_TOPICS,BIOLOGY_SPECIALIZATIONS,BIOLOGY_SPECIALTY_TOPICS} from './biology_curriculum.mjs';
import {physicsUniversityYears,physicsUniversityRoute,physicsUniversityRoutes} from './physics_university_europe.mjs';

const html=await(await app.fetch(new Request('https://astronomy-ro-grades.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(script);
class El{
 constructor(tag){this.tag=tag;this.children=[];this.style={};this.textContent='';this.className='';
  this.classList={add:()=>{},remove:()=>{},contains:()=>false,toggle:()=>{}};
  this.onclick=null;this.hidden=false;this.attributes={};
 }
 append(...args){this.children.push(...args)}
 replaceChildren(...args){this.children=[...args]}
 setAttribute(name,value){this.attributes[name]=String(value)}
}
const root={classList:{add(){},remove(){},toggle(){},contains(){return false}}};
const host=new El('div'),title=new El('h2'),lead=new El('div');
const elements={'view-module':root,moduleContent:host,moduleTitle:title,moduleLead:lead};
const grades={
 primary:['1','2','3','4'],lower:['5','6','7','8'],
 intermediate:['9','10','11','12'],advanced:['university']
};
const names=g=>({id:g,ro:'Clasa '+g,en:'Grade '+g});
const opened=[];
const sandbox={
 document:{createElement:tag=>new El(tag),querySelector:()=>null},
 window:{addEventListener:()=>{},visualViewport:null,innerHeight:900},
 requestAnimationFrame:()=>0,
 state:{language:'ro'},
 $:key=>elements[key]||null,learningLabel:(ro,en)=>ro,
 educationCountrySelection:{code:'RO',label:'România'},
 eduYearOptions:(country,stage)=>((grades[stage]||grades.intermediate).map(names)),
 ASTRONOMY_TOPIC_DATA:ASTRONOMY_TOPICS,ASTRONOMY_SPECIALTY_DATA:ASTRONOMY_SPECIALIZATIONS,
 ASTRONOMY_LESSON_DATA:ASTRONOMY_LESSONS,astronomySchoolTopicLessons,
 SCIENCE_GRADE_TOPIC_PLAN:scienceGradeTopicPlan,astronomyNationalAlignment,
 astronomyUniversityYears,astronomyUniversityRoute,astronomyUniversityRoutes,
 astronomyUniversityCourseChoices,astronomyUniversityStudyText,astronomyUniversityProjectText,
 SCIENCE_GRADE_TOPIC_PLAN:scienceGradeTopicPlan,
 PHYSICS_TOPIC_DATA:PHYSICS_TOPICS,PHYSICS_SPECIALTY_DATA:PHYSICS_SPECIALIZATIONS,
 physicsUniversityYears,physicsUniversityRoute,physicsUniversityRoutes,
 CHEMISTRY_TOPIC_DATA:[...CHEMISTRY_TOPICS,...CHEMISTRY_SPECIALTY_TOPICS],
 CHEMISTRY_SPECIALTY_DATA:CHEMISTRY_SPECIALIZATIONS,
 BIOLOGY_TOPIC_DATA:[...BIOLOGY_TOPICS,...BIOLOGY_SPECIALTY_TOPICS],
 BIOLOGY_SPECIALTY_DATA:BIOLOGY_SPECIALIZATIONS,
 EDUCATION_THEORY_DATA:THEORY_ENTRIES,
 scienceSchoolTopicLessons,scienceRoAnnualCoverage,
 scienceSchoolLessonMaterial,scienceSchoolLessonAssessment,
 LEARNING_SUBJECTS:[['science','⚛️','Științe','Sciences']],
 educationOpenPagedLesson:(name,body)=>opened.push({name,body}),
 scienceVoiceStop:()=>{},scienceStopRequest:()=>{},
 scienceOpenWorkspace:()=>{},scienceFitViewport:()=>{},
 pocketNativeVoiceAvailable:()=>false,
 eduAttachPrintAction:()=>{},renderLearningSubjects:()=>{},
};
const start=script.indexOf('const SCIENCE_SUBJECTS=');
const end=script.indexOf('const MATH_LEVELS=[',start);
const lessonStart=script.indexOf('function educationScienceTheoryReader(');
const lessonEnd=script.indexOf('function scienceOpenChemistrySection(',lessonStart);
const chemStart=lessonEnd,chemEnd=script.indexOf('function scienceOpenWorkspace(){',chemStart);
assert.ok(start>0&&end>start&&lessonStart>0&&chemEnd>chemStart);
const injected='let activeLearningSubject=null;let sciencePendingAssessmentSpec=null;';
const api=vm.runInNewContext(injected+
 script.slice(lessonStart,lessonEnd)+script.slice(start,end)+script.slice(chemStart,chemEnd)+
 '\n({open:scienceJourneyShowChoices,back:scienceBack,state:scienceJourney})',sandbox);
const find=(root,predicate)=>{const result=[];const walk=n=>{
 if(!n||typeof n!=='object')return;
 if(predicate(n))result.push(n);
 for(const child of n.children||[])walk(child);
};walk(root);return result;};
const buttons=()=>find(host,x=>x.tag==='button'&&typeof x.onclick==='function');
const textOf=x=>String(x?.textContent||'')+(x?.children||[]).map(textOf).join('');
const byText=(text)=>buttons().find(x=>textOf(x).includes(text));
const selectSubject=()=>{api.open('subjects');const b=byText('Astronomie');assert.ok(b);b.onclick();assert.equal(api.state.stage,'years')};
let yearsChecked=0,chaptersChecked=0,lessonsChecked=0;
selectSubject();
for(const [stage,years] of [['primary',grades.primary],['lower',grades.lower],['upper',grades.intermediate]]){
 for(const g of years){
  const b=byText('Clasa '+g);assert.ok(b,'Year tile absent: '+g);b.onclick();
  assert.equal(api.state.grade,g);assert.equal(api.state.stage,'topics');
  const topicButtons=buttons().filter(x=>x.className.includes('science-choice-row'));
  assert.ok(topicButtons.length>=2,'No selectable Astronomy chapters for RO grade '+g);
  const selected=topicButtons.map(x=>x.children?.[0]?.textContent).filter(Boolean);
  assert.equal(new Set(selected).size,selected.length,'Duplicated chapter for grade '+g);
  for(const chapter of selected){
   const chapterBtn=buttons().find(x=>x.children?.[0]?.textContent===chapter);
   assert.ok(chapterBtn,'Chapter disappeared on UI: '+chapter+' in '+g);
   chapterBtn.onclick();
   assert.equal(api.state.stage,'chemistry-menu');
   const courseButton=byText('Teme de studiu');
   assert.ok(courseButton,'Lesson action missing: '+g+'/'+chapter);
   courseButton.onclick();
   assert.equal(api.state.stage,'chemistry-lessons');
   const lessonButtons=buttons().filter(x=>x.className.includes('science-inline-theory-item'));
   assert.ok(lessonButtons.length>=1,'No lesson buttons in '+g+'/'+chapter);
   for(const lesson of lessonButtons){
    assert.equal(typeof lesson.onclick,'function');
    lesson.onclick();
    const page=opened.pop();
    assert.ok(page?.body?.length>400&&page.body.includes('Exemplu')&&page.body.includes('Exercițiu'),
     'Empty or superficial lesson '+g+'/'+chapter+'/'+lesson.textContent);
    lessonsChecked++;
   }
   chaptersChecked++;
   api.back();assert.equal(api.state.stage,'chemistry-menu');
   api.back();assert.equal(api.state.stage,'topics');
  }
  api.back();assert.equal(api.state.stage,'years');
  yearsChecked++;
 }
}
assert.equal(yearsChecked,12);
const uni=buttons().find(x=>x.textContent.includes('Anul universitar 1'));
assert.ok(uni,'University year 1 missing');uni.onclick();
assert.equal(api.state.stage,'specialties');
const specialtyButton=byText('Astrofizică stelară');
assert.ok(specialtyButton);specialtyButton.onclick();
assert.equal(api.state.stage,'topics');
const firstCourse=buttons().find(x=>x.className.includes('science-choice-row'));
assert.ok(firstCourse,'University specialist course missing');
firstCourse.onclick();assert.equal(api.state.stage,'chemistry-menu');
byText('Teme de studiu').onclick();
const uniLessons=buttons().filter(x=>x.className.includes('science-inline-theory-item'));
assert.ok(uniLessons.length>=3,'University course still collapses to one generic button');
for(const btn of uniLessons){
 btn.onclick();const page=opened.pop();
 assert.ok(page?.body.length>550&&page.body.includes('Definiţie'),
  'University sublesson empty: '+btn.textContent);
}
console.log('PASS Android Astronomy UI: all 12 Romanian grades, '+chaptersChecked+
 ' chapters, '+lessonsChecked+' nonempty clickable lessons, and '+uniLessons.length+
 ' independent university study cards');
