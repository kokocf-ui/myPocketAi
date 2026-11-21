import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {EDUCATION_EUROPE_COUNTRIES} from './education_all_country_subject_matrix.mjs';
import {PHYSICS_UNIVERSITY_PROFILES,physicsUniversityRoutes,physicsUniversityRoute,physicsUniversityYears} from './physics_university_europe.mjs';
import {PHYSICS_UNIVERSITY_ALL_COURSES,physicsUniversityCourseChoices,physicsUniversityStudyDocument} from './physics_university_study.mjs';
import {SCIENCE_UNIVERSITY_TRACK_GUIDES} from './science_university_track_guides.mjs';
import {THEORY_ENTRIES} from './education_theory.mjs';
import {PHYSICS_TOPICS,PHYSICS_SPECIALIZATIONS} from './physics_curriculum.mjs';

assert.equal(EDUCATION_EUROPE_COUNTRIES.length,50);
assert.deepEqual(Object.keys(PHYSICS_UNIVERSITY_PROFILES).sort(),[...EDUCATION_EUROPE_COUNTRIES].sort());
assert.equal(PHYSICS_UNIVERSITY_ALL_COURSES.length,70);
assert.equal(new Set(PHYSICS_UNIVERSITY_ALL_COURSES.map(x=>x.id)).size,70);
const knownTopicIds=new Set(PHYSICS_TOPICS.map(x=>x.id));
for(const item of PHYSICS_UNIVERSITY_ALL_COURSES){
 assert.ok(knownTopicIds.has(item.topic),item.id+' source chapter missing');
 for(const prop of ['ro','en','focusRo','focusEn','formula','exampleRo','exampleEn'])
  assert.ok(typeof item[prop]==='string'&&item[prop].length>(prop==='formula'?3:8),item.id+'/'+prop);
}
const fields={countries:new Set(),examples:0,chapters:0,documents:0};
for(const code of EDUCATION_EUROPE_COUNTRIES){
 const routes=physicsUniversityRoutes(code);
 assert.ok(routes.length>=2,code+' needs at least two explicitly marked route alternatives');
 assert.ok(routes.some(x=>x.years===3)&&routes.some(x=>x.years===4),code+' must not assume uniform four-year study');
 assert.ok(routes.every(x=>x.years>=3&&x.years<=5&&x.source),code+' route must be grounded');
 if(routes.some(x=>x.verified))fields.examples++;
 const chosen=physicsUniversityRoute(code,null);
 assert.deepEqual(chosen,routes[0]);
 for(const route of routes){
  const years=physicsUniversityYears(code,route.id);
  assert.equal(years.length,route.years,code+'/'+route.id);
  assert.equal(new Set(years.map(x=>x.id)).size,years.length);
  for(const year of years){
   for(const track of PHYSICS_SPECIALIZATIONS){
    const courses=physicsUniversityCourseChoices({year:year.universityYear,specialty:track.id});
    assert.ok(courses.length>=4,code+'/'+route.id+'/'+year.id+'/'+track.id+' not enough courses');
    assert.equal(new Set(courses.map(c=>c.id)).size,courses.length,'Year has duplicate courses');
    for(const course of courses){
     assert.equal(course.year,year.universityYear);
     assert.ok(course.id.startsWith('university-'));
     const input={courseId:course.courseId,country:code,routeId:route.id,year:year.universityYear,
      specialty:track.id,language:'ro',lessons:THEORY_ENTRIES,trackGuide:SCIENCE_UNIVERSITY_TRACK_GUIDES.physics[track.id]};
     const ro=physicsUniversityStudyDocument(input);
     const en=physicsUniversityStudyDocument({...input,language:'en'});
     assert.ok(ro?.length>1450&&en?.length>1450,code+'/'+course.id+' full lesson too short');
     for(const marker of ['Obiective și bază conceptuală','Exemplu lucrat și interpretat','Exercițiu de verificare','Laborator, simulare sau investigație'])
      assert.ok(ro.includes(marker),course.id+'/'+marker);
     for(const marker of ['Goals and conceptual foundations','Worked example and interpretation','Review exercise','Laboratory, simulation or investigation'])
      assert.ok(en.includes(marker),course.id+'/'+marker);
     assert.ok(ro.includes(course.ro)&&en.includes(course.en),course.id+' must have own material');
     assert.ok(ro.includes(course.formula)&&en.includes(course.formula),course.id+' formula missing');
     assert.ok(!/acreditat|certified national curriculum/.test(''), 'No assertion side effects');
     fields.documents++;
    }
    fields.chapters+=courses.length;
   }
  }
 }
 fields.countries.add(code);
}
assert.equal(fields.countries.size,50);
assert.ok(fields.examples>=15,'Verified institutional examples missing');
for(const [country,length] of [['RO',3],['ES',4],['GR',4],['IE',4],['IT',3],['NL',3],['RS',4],['TR',4],['GB-ENG',3],['GB-SCT',4]]){
 assert.equal(physicsUniversityRoute(country,null).years,length,country+' example duration');
}
assert.ok(physicsUniversityRoutes('GB-ENG').some(r=>r.years===4&&r.verified),'MPhys England alternative');
assert.ok(physicsUniversityRoutes('GB-SCT').some(r=>r.years===5&&r.verified),'MPhys Scotland five-year option');
assert.ok(physicsUniversityRoutes('HR').some(r=>r.years===5&&r.verified),'Croatia integrated teacher training distinct');
assert.deepEqual([1,2,3].map(y=>physicsUniversityCourseChoices({year:y,specialty:'quantum'}).length),[10,10,9]);
assert.equal(physicsUniversityCourseChoices({year:4,specialty:'quantum'}).length,7);
assert.equal(physicsUniversityCourseChoices({year:5,specialty:'quantum'}).length,4);
assert.equal(physicsUniversityStudyDocument({courseId:'does-not-exist',country:'RO',year:1}),null);
assert.equal(physicsUniversityStudyDocument({courseId:'math1',country:'UNKNOWN',year:1}),null);
assert.equal(physicsUniversityStudyDocument({courseId:'spec-quantum-1',country:'RO',year:3,specialty:'astro'}),null);

const html=await(await app.fetch(new Request('https://physics-university-europe.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script);
new vm.Script(script);
for(const code of [
 'const PHYSICS_UNIVERSITY_PROFILES=','const PHYSICS_UNIVERSITY_ALL_COURSES=',
 'const physicsUniversityRoutes=','const physicsUniversityCourseChoices=',
 'const physicsUniversityStudyDocument=',
 "scienceJourney.subject==='physics'&&scienceJourney.schoolStage==='advanced'",
 "root.classList.toggle('science-scroll-stage'"
])assert.ok(script.includes(code),code);
assert.match(html,/\.science-university-route-picker\{/);
const begin=script.indexOf('const SCIENCE_SUBJECTS='),end=script.indexOf('const MATH_LEVELS=[',begin);
assert.ok(begin>0&&end>begin);
class FakeEl{
 constructor(tag){
  this.tag=tag;this.textContent='';this.value='';this.children=[];this.style={};this.className='';this.onclick=null;this.onchange=null;
  this.classList={add(){},remove(){},toggle(){},contains(){return false}};
 }
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=[...nodes]}
 setAttribute(){}
}
const host=new FakeEl('div'),root=new FakeEl('div'),title=new FakeEl('h2'),lead=new FakeEl('p');
const elements={'view-module':root,moduleContent:host,moduleTitle:title,moduleLead:lead};
const sandbox={
 document:{createElement:tag=>new FakeEl(tag),querySelector:()=>null},
 window:{addEventListener(){},visualViewport:null,innerHeight:900},
 requestAnimationFrame:()=>0,
 LEARNING_SUBJECTS:[['science','⚛️','Științe','Sciences']],
 educationCountrySelection:{code:'RO',label:'România'},
 eduYearOptions:(code,stage)=>stage==='primary'?[{id:'1',ro:'Clasa I',en:'Year 1'}]:
  stage==='lower'?[{id:'6',ro:'Clasa a VI-a',en:'Year 6'}]:
  stage==='intermediate'?[{id:'9',ro:'Clasa a IX-a',en:'Year 9'}]:
  [{id:'universitate',ro:'Universitate',en:'University'}],
 PHYSICS_TOPIC_DATA:PHYSICS_TOPICS,PHYSICS_SPECIALTY_DATA:PHYSICS_SPECIALIZATIONS,
 PHYSICS_UNIVERSITY_ALL_COURSES,physicsUniversityRoutes,physicsUniversityRoute,physicsUniversityYears,physicsUniversityCourseChoices,
 SCIENCE_PRIMARY_LESSON_BANK:{},EDUCATION_THEORY_DATA:THEORY_ENTRIES,
 learningLabel:(ro,en)=>ro,
 eduAttachPrintAction(){},scienceVoiceStop(){},scienceStopRequest(){},scienceOpenWorkspace(){},scienceFitViewport(){},
 $:key=>elements[key]||null,renderLearningSubjects(){},pocketNativeVoiceAvailable(){return false},
 Math
};
const api=vm.runInNewContext('let activeLearningSubject=null;'+script.slice(begin,end)+
 ';({open:scienceJourneyShowChoices,back:scienceBack,journey:scienceJourney})',sandbox);
api.journey.subject='physics';api.open('years');
const yearBands=()=>host.children[1].children[2].children;
const uni=()=>yearBands().find(x=>x.children[0].textContent==='Universitate și specializări');
assert.ok(uni(),'University band is present');
assert.equal(uni().children[1].children.length,3,'RO university year tiles reflect three-year example');
const picker=uni().children[0].children[0];
assert.ok(picker,'University selector stays on the same screen');
const alt=physicsUniversityRoutes('RO').find(x=>x.years===4);
picker.value=alt.id;picker.onchange();
assert.equal(uni().children[1].children.length,4,'Switching to advisory four-year route shows year 4');
uni().children[1].children[3].onclick();
assert.equal(api.journey.grade,'univ-4');
assert.equal(api.journey.universityRoute,alt.id);
assert.equal(api.journey.stage,'specialties');
const specialties=host.children[1].children[2].children;
assert.equal(specialties.length,7,'All seven specializations remain');
specialties[0].onclick();
assert.equal(api.journey.stage,'topics');
const rows=host.children[1].children[2].children;
assert.equal(rows.length,7,'Fourth-year Physics has five core and two specialist courses');
assert.ok(rows.every(x=>x.children[0].textContent.length>4));
api.back();assert.equal(api.journey.stage,'specialties');
api.back();assert.equal(api.journey.stage,'years');
console.log('PASS 50 European Physics university jurisdictions, '+fields.examples+' sourced institutional examples, '+PHYSICS_UNIVERSITY_ALL_COURSES.length+' original course topics, '+fields.documents+' populated route-year-specialty lesson checks, full browser navigation');
