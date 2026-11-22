// Offline end-to-end Astronomy study validation. Uses no paid AI services.
import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {ASTRONOMY_TOPICS,ASTRONOMY_SPECIALIZATIONS,ASTRONOMY_LESSONS} from './astronomy_curriculum.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {astronomySchoolTopicLessons,astronomyLabMaterial,ASTRONOMY_TOPIC_DIAGRAMS,ASTRONOMY_STUDY_CASES,ASTRONOMY_PRIMARY_ALLOWED} from './astronomy_study_course.mjs';
import {astronomyUniversityRoutes,astronomyUniversityRoute,astronomyUniversityYears,astronomyUniversityCourseChoices,astronomyUniversityStudyText,astronomyUniversityProjectText,ASTRONOMY_UNIVERSITY_ELECTIVES} from './astronomy_university_courses.mjs';
import {scienceSchoolLessonMaterial,scienceSchoolLessonAssessment} from './science_school_lesson_material.mjs';
assert.equal(Object.keys(ASTRONOMY_STUDY_CASES).length,9);
assert.ok(ASTRONOMY_LESSONS.length>=82);
assert.equal(ASTRONOMY_SPECIALIZATIONS.length,7);
let schoolYears=0,schoolCards=0,labs=0;
const idStore=new Set();
for(const country of EDUCATION_EUROPE_COUNTRIES){
 for(const [stage,level] of [['primary','beginner'],['lower','lower'],['upper','medium']]){
  const years=educationCountrySchoolYears(country,level).years;
  for(const y of years){
   const plan=scienceGradeTopicPlan({country,subject:'astronomy',stage,grade:y.id,years,topics:ASTRONOMY_TOPICS});
   assert.ok(plan.topics.length,country+'/'+stage+'/'+y.id+' has no Astronomy study chapter');
   for(const topic of plan.topics){
    const cards=astronomySchoolTopicLessons({country,grade:y.id,stage,topic:topic.id,years,lessons:ASTRONOMY_LESSONS});
    assert.ok(cards.length>0,country+'/'+stage+'/'+y.id+'/'+topic.id+' cannot open study cards');
    for(const item of cards){
     if(stage==='primary')assert.ok(ASTRONOMY_PRIMARY_ALLOWED[topic.id].includes(item.sourceId),'Primary inappropriate lesson: '+item.sourceId);
     assert.ok(item.title&&item.statement.length>125&&item.workedExample.length>115&&item.exercise&&item.answer,
      'Not a substantive lesson: '+item.id);
     assert.ok(!idStore.has(item.id),'Duplicate lesson ID '+item.id);
     idStore.add(item.id);
     const body=scienceSchoolLessonMaterial({entry:item,subject:'astronomy',grade:y.id,chapter:topic.ro,language:'ro'});
     assert.ok(body.includes(item.statement)&&body.includes(item.workedExample)&&body.includes(item.exercise),
      'Lesson does not open its own content: '+item.id);
     assert.ok(body.includes('Siguranță'),'Astronomy observational safety note missing');
     assert.ok(scienceSchoolLessonAssessment({entry:item,subject:'astronomy',topic:topic.id}));
     schoolCards++;
    }
    const practical=astronomyLabMaterial({topic:topic.id,stage,grade:y.id,language:'ro'});
    assert.ok(practical.includes('Obiectiv')&&practical.includes('Procedură')&&practical.includes('Concluzie'),
      'Missing topic-specific lab '+country+'/'+topic.id);
    assert.ok(practical.includes('Soare')&&practical.includes('simul'),'Safe simulation/solar-warning missing');
    assert.ok(ASTRONOMY_TOPIC_DIAGRAMS[topic.id]?.length>=1,'No relevant visual '+topic.id);
    labs++;
   }
   schoolYears++;
  }
 }
}
assert.ok(schoolYears>=300&&schoolCards>=800&&labs>=300,
 'Europe-wide school-year selection must be checked offline');
let universityPrograms=0,universityCourses=0;
for(const country of EDUCATION_EUROPE_COUNTRIES){
 const routes=astronomyUniversityRoutes(country);
 assert.deepEqual([...routes.map(x=>x.years)].sort(),[3,4]);
 assert.ok(astronomyUniversityRoute(country).years>=3);
 for(const route of routes){
  const years=astronomyUniversityYears(country,route.id);
  assert.equal(years.length,route.years);
  for(const spec of ASTRONOMY_SPECIALIZATIONS){
   const courses=years.flatMap(y=>astronomyUniversityCourseChoices({
    year:y.year,years:route.years,specialty:spec.id,
    topics:ASTRONOMY_TOPICS,specializations:ASTRONOMY_SPECIALIZATIONS
   }));
   assert.ok(courses.length>=6&&new Set(courses.map(x=>x.id)).size===courses.length,
    'Track has duplicated/missing courses '+spec.id);
   assert.equal(courses[courses.length-1].id,'astronomy-capstone','Capstone should finish the route');
   const accepted=new Set([...spec.core,...(ASTRONOMY_UNIVERSITY_ELECTIVES[spec.id]||[]),'special-'+spec.id,'astronomy-capstone']);
   assert.ok(courses.every(x=>accepted.has(x.id)),'Unrelated course in '+spec.id);
   for(const course of courses){
    const doc=course.id==='astronomy-capstone'?
     astronomyUniversityProjectText({specialty:spec.id,year:course.courseYear}):
     astronomyUniversityStudyText({topic:course.id,specialty:spec.id,grade:course.courseYear,lessons:ASTRONOMY_LESSONS});
    assert.ok(doc.length>600,'Short or empty university document '+course.id);
    universityCourses++;
   }
   universityPrograms++;
  }
 }
}
const html=await(await app.fetch(new Request('https://astronomy-curriculum-depth.test/'))).text();
const script=html.split('<script>')[1]?.split('</script>')[0]||'';
assert.ok(script,'Missing Android WebView script');
new vm.Script(script);
for(const fragment of [
 'const ASTRONOMY_STUDY_CASES=','const ASTRONOMY_TOPIC_DIAGRAMS=',
 'const astronomySchoolTopicLessons=','const astronomyLabMaterial=',
 'const astronomyUniversityCourseChoices=','const astronomyUniversityProjectText=',
 "if(subjectId==='astronomy'&&['primary','lower','upper'].includes(scienceJourney.schoolStage))",
 "if(subjectId==='astronomy'&&scienceJourney.schoolStage==='advanced')",
 "if(scienceJourney.subject==='astronomy'&&['primary','lower','upper','advanced'].includes(scienceJourney.schoolStage))",
 "astronomyDiagramPicker([item.diagram],item)"
])assert.ok(script.includes(fragment),'Missing WebView wiring: '+fragment);
const at=script.indexOf('function educationScienceTheoryReader(');
const until=script.indexOf(String.fromCharCode(10)+'function ',at+40);
assert.ok(at>=0&&until>at);
class FakeElement{
 constructor(tag){this.tag=tag;this.children=[];this.textContent='';this.className='';this.style={};this.onclick=null;this.hidden=false;}
 append(...kids){this.children.push(...kids);}
 replaceChildren(...kids){this.children=[...kids];}
 setAttribute(){}
}
const chapter={id:'solar',ro:'Sistemul solar',en:'Solar system'},opened=[];
const ctx={
 document:{createElement:t=>new FakeElement(t)},
 learningLabel:(ro,en)=>ro,scienceJourney:{schoolStage:'primary',grade:'1',level:'beginner'},
 educationCountrySelection:{code:'RO'},eduYearOptions:()=>['1','2','3','4'].map(id=>({id})),
 ASTRONOMY_LESSON_DATA:ASTRONOMY_LESSONS,astronomySchoolTopicLessons,
 scienceTopicInfo:()=>chapter,
 scienceSchoolLessonMaterial,scienceSchoolLessonAssessment,
 state:{language:'ro'},educationOpenPagedLesson:(name,body)=>opened.push({name,body}),
 sciencePendingAssessmentSpec:null,EDUCATION_THEORY_DATA:ASTRONOMY_LESSONS
};
const render=vm.runInNewContext(script.slice(at,until)+';educationScienceTheoryReader',ctx);
const panel=render('astronomy','solar','beginner');
const grid=panel.children.find(x=>x.className==='science-theory-topic-list');
assert.ok(grid&&grid.children.length===2,'Grade I reader list must match actual two accessible lessons');
for(const button of grid.children){
 assert.ok(typeof button.onclick==='function');
 button.onclick();const result=opened.pop();
 assert.ok(result?.body.includes('Exemplu explicat')&&result.body.includes('Exercițiu pentru elev'));
}
console.log('PASS astronomy year coverage:',EDUCATION_EUROPE_COUNTRIES.length,'jurisdictions,',
 schoolYears,'school years,',schoolCards,'study cards,',labs,'practicals,',
 universityPrograms,'university tracks,',universityCourses,'year-specific university courses and WebView reader');
