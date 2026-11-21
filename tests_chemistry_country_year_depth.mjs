import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {CHEMISTRY_TOPICS} from './chemistry_curriculum.mjs';
import {CHEMISTRY_STUDY_CONCEPTS,chemistrySchoolCourseDocuments} from './chemistry_school_depth.mjs';
import {CHEMISTRY_GRADE_FRAMEWORKS,CHEMISTRY_UPPER_STUDY_SEQUENCE,chemistryGradeTopicPlan,chemistryVisualizationFor} from './chemistry_school_years.mjs';
import {CHEMISTRY_UNIVERSITY_PROFILES,chemistryUniversityRoutes,chemistryUniversityYears,chemistryUniversityRoute} from './chemistry_university_europe.mjs';
import {CHEMISTRY_UNIVERSITY_CORE} from './chemistry_university_core.mjs';
import {CHEMISTRY_UNIVERSITY_SPECIALTY_YEARS,CHEMISTRY_UNIVERSITY_COURSE_COUNT,
 chemistryUniversityCourseChoices,chemistryUniversityStudyDocument} from './chemistry_university_study.mjs';
import {CHEMISTRY_SPECIALTY_TOPICS,CHEMISTRY_SPECIALIZATIONS,CHEMISTRY_SPECIALTY_LESSONS} from './chemistry_advanced.mjs';
import {THEORY_ENTRIES} from './education_theory.mjs';
const topics=new Set(CHEMISTRY_TOPICS.map(x=>x.id));
assert.equal(EDUCATION_EUROPE_COUNTRIES.length,50);
assert.deepEqual([...Object.keys(CHEMISTRY_STUDY_CONCEPTS)].sort(),[...topics].sort());
assert.equal(CHEMISTRY_UNIVERSITY_CORE.length,28);
assert.equal(CHEMISTRY_UNIVERSITY_COURSE_COUNT,56);
assert.equal(CHEMISTRY_SPECIALTY_TOPICS.length,28);
assert.equal(CHEMISTRY_SPECIALTY_LESSONS.length,84);
assert.deepEqual(CHEMISTRY_UNIVERSITY_SPECIALTY_YEARS,[3,4,4,5]);
const ro7=chemistryGradeTopicPlan({country:'RO',stage:'lower',grade:'7',topics:CHEMISTRY_TOPICS}).topics.map(t=>t.id);
const ro8=chemistryGradeTopicPlan({country:'RO',stage:'lower',grade:'8',topics:CHEMISTRY_TOPICS}).topics.map(t=>t.id);
assert.deepEqual(ro7,['fundamentals','solutions','atomic','periodic','bonding','inorganic','acids']);
assert.deepEqual(ro8,['reactions','inorganic','acids','solutions']);
assert.equal(CHEMISTRY_GRADE_FRAMEWORKS.RO.source,'https://www.edu.ro/Ordin_ministru_3393_2017');
assert.ok(!ro8.includes('periodic')&&!ro7.includes('reactions'),'RO grade-specific chapters differ');
const uk7=chemistryGradeTopicPlan({country:'GB-ENG',stage:'lower',grade:'Y7',topics:CHEMISTRY_TOPICS});
const uk8=chemistryGradeTopicPlan({country:'GB-ENG',stage:'lower',grade:'Y8',topics:CHEMISTRY_TOPICS});
assert.notDeepEqual(uk7.topics.map(t=>t.id),uk8.topics.map(t=>t.id));
assert.ok(uk7.note.includes('NOT statutory'));
assert.equal(CHEMISTRY_UPPER_STUDY_SEQUENCE.length,4);
for(const [i,grade] of ['9','10','11','12'].entries()){
 const plan=chemistryGradeTopicPlan({country:'RO',stage:'upper',grade,
  years:['9','10','11','12'].map(id=>({id})),topics:CHEMISTRY_TOPICS});
 const ids=plan.topics.map(t=>t.id);
 assert.deepEqual(ids,[...CHEMISTRY_UPPER_STUDY_SEQUENCE[i]],'RO high-school year '+grade+' must not collapse to 4 generic chapters');
 assert.ok(ids.length>=8,'Each RO high-school grade has several distinct substantive chapters');
 assert.equal(new Set(ids).size,ids.length,'No repeated high-school chapter');
 assert.equal(plan.status,'general-learning','Different school profiles/cohorts cannot be misrepresented as certified');
 for(const topic of ids){
  assert.ok(CHEMISTRY_STUDY_CONCEPTS[topic],grade+'/'+topic+' has no detailed lesson bank');
  const docs=chemistrySchoolCourseDocuments({topic,country:'RO',grade,stage:'upper',language:'ro'});
  assert.equal(docs.length,4,grade+'/'+topic+' needs full study, formula, applications and investigation documents');
  assert.ok(docs.every(x=>x.text.length>650),grade+'/'+topic+' shallow high-school content');
 }
}
const foreignUpper=educationCountrySchoolYears('GB-ENG','medium').years;
for(const y of foreignUpper){
 const plan=chemistryGradeTopicPlan({country:'GB-ENG',stage:'upper',grade:y.id,
  years:foreignUpper,topics:CHEMISTRY_TOPICS});
 assert.ok(plan.topics.length>=8,'England upper secondary does not show just a few generic chapters');
 assert.equal(plan.status,'general-learning','England programme is advisory without qualification profile');
}
for(const key of ['RO','GB-ENG','GB-SCT','FR','DE','ES','IT','HU','SE','PL','AL']){
 for(const stage of ['primary','lower','upper']){
  const years=educationCountrySchoolYears(key,stage==='upper'?'medium':stage==='primary'?'beginner':stage).years;
  const options=years.map(y=>chemistryGradeTopicPlan({country:key,stage,grade:y.id,years,topics:CHEMISTRY_TOPICS}));
  if(years.length&&key!=='RO'&&key!=='GB-ENG'){
   assert.ok(options.every(p=>p.status==='general-learning'||p.status==='invalid-selection'),
    key+'/'+stage+' must remain advisory');
  }
 }
}
let lessonTests=0;
for(const topic of topics){
 const info=CHEMISTRY_STUDY_CONCEPTS[topic];
 for(const k of ['ro','en','conceptRo','conceptEn','formula','symbolsRo','symbolsEn',
   'exampleRo','exampleEn','questionRo','questionEn','answerRo','answerEn','investigationRo','investigationEn'])
  assert.ok(typeof info[k]==='string'&&info[k].length>3,topic+'/'+k);
 for(const [stage,grade] of [['lower','7'],['lower','8'],['upper','9'],['upper','10'],['upper','11'],['upper','12']]){
  const ro=chemistrySchoolCourseDocuments({topic,country:'RO',grade,stage,language:'ro'});
  const en=chemistrySchoolCourseDocuments({topic,country:'GB-ENG',grade,stage,language:'en'});
  assert.equal(ro.length,4);assert.equal(en.length,4);
  assert.equal(new Set(ro.map(x=>x.text)).size,4,'All four thematic lesson documents must be different');
  for(let i=0;i<4;i++){
   assert.ok(ro[i].text.length>650&&en[i].text.length>650,topic+'/'+grade+'/'+i+' too shallow');
   assert.ok(ro[i].text.includes(info.ro)&&en[i].text.includes(info.en),topic+'/'+grade+' wrong lesson title');
  }
  assert.ok(ro[1].text.includes(info.formula),'Formula missing from worked example');
  lessonTests+=4;
 }
}
assert.equal(chemistrySchoolCourseDocuments({topic:'unknown'}).length,0);
assert.equal(chemistrySchoolCourseDocuments({topic:'fundamentals',stage:'primary'}).length,2);
assert.equal(chemistryVisualizationFor({topic:'solutions',stage:'lower',grade:'7'}),'solubility');
assert.equal(chemistryVisualizationFor({topic:'solutions',stage:'lower',grade:'8'}),'stoichiometry');
assert.equal(chemistryVisualizationFor({topic:'solutions',stage:'upper',grade:'10'}),'concentration');
assert.equal(chemistryVisualizationFor({topic:'inorganic',stage:'lower',grade:'8'}),null);
assert.equal(chemistryVisualizationFor({topic:'atomic',stage:'lower',grade:'7'}),'atom');
assert.equal(chemistryVisualizationFor({topic:'physical',stage:'upper',grade:'10'}),'energy-profile');
assert.equal(chemistryVisualizationFor({topic:'periodic',stage:'primary',grade:'3'}),null);
assert.equal(chemistryVisualizationFor({topic:'no-topic',stage:'upper',grade:'12'}),null);
const visuals=['separation','solubility','stoichiometry','concentration','energy-profile','cell','calibration','enzyme','equilibrium'];
const fakeDom={
 createElement:(tag)=>({tag,children:[],append(...els){this.children.push(...els)},set textContent(t){this.text=t}}),
 createElementNS:(ns,tag)=>({ns,tag,attrs:{},children:[],append(...els){this.children.push(...els)},setAttribute(k,v){this.attrs[k]=v},set textContent(v){this.text=v}})
};
const {chemistryContextVisualBuild}=await import('./chemistry_context_visuals.mjs');
globalThis.document=fakeDom;globalThis.learningLabel=(ro)=>ro;
for(const kind of visuals){
 const graphic=chemistryContextVisualBuild(kind);
 assert.ok(graphic?.children.some(x=>x.tag==='svg'),kind+' needs SVG');
 const svg=graphic.children.find(x=>x.tag==='svg');
 assert.ok(svg.children.length>7,kind+' needs a real diagram not an empty placeholder');
 assert.ok(graphic.children.some(x=>x.tag==='p'&&x.text.length>65),kind+' provenance/limitations missing');
}
delete globalThis.document;delete globalThis.learningLabel;
assert.deepEqual(Object.keys(CHEMISTRY_UNIVERSITY_PROFILES).sort(),[...EDUCATION_EUROPE_COUNTRIES].sort());
let universityChecks=0,verified=0;
for(const country of EDUCATION_EUROPE_COUNTRIES){
 const routes=chemistryUniversityRoutes(country);
 assert.ok(routes.length>=2&&routes.some(x=>x.years===3)&&routes.some(x=>x.years===4),country+' missing advisory alternatives');
 if(routes.some(x=>x.verified))verified++;
 for(const route of routes){
  assert.ok(route.source&&route.noticeRo&&route.noticeEn);
  const years=chemistryUniversityYears(country,route.id);
  assert.equal(years.length,route.years);
  for(const year of years)for(const special of CHEMISTRY_SPECIALIZATIONS){
   const entries=chemistryUniversityCourseChoices({year:year.year,specialty:special.id});
   assert.ok(entries.length>=3,country+'/'+route.id+'/'+year.year+'/'+special.id+' low coverage');
   assert.equal(new Set(entries.map(x=>x.id)).size,entries.length);
   for(const course of entries){
    assert.equal(course.year,year.year);
    const props={courseId:course.courseId,country,routeId:route.id,year:year.year,specialty:special.id,lessons:THEORY_ENTRIES};
    const ro=chemistryUniversityStudyDocument({...props,language:'ro'});
    const en=chemistryUniversityStudyDocument({...props,language:'en'});
    assert.ok(ro?.length>1400&&en?.length>1400,country+'/'+course.id+' too short');
    for(const tag of ['Obiective ale cursului','Formula și unitățile','Exemplu lucrat','Problemă și rezolvare','Investigație și reprezentare relevantă'])
     assert.ok(ro.includes(tag),course.id+'/'+tag);
    assert.ok(ro.includes(course.ro)&&en.includes(course.en),course.id+' title in wrong course');
    universityChecks++;
   }
  }
 }
}
assert.equal(verified,14);
for(const [code,years] of [['RO',3],['ES',4],['IT',3],['IE',4],['NL',3],['DE',3],['FR',3],['PL',3],['DK',3],['SE',3],['GR',4],['CY',4],['GB-ENG',3],['GB-SCT',4]]){
 assert.equal(chemistryUniversityRoute(code,null).years,years,code+' degree length');
}
assert.ok(chemistryUniversityRoutes('GB-ENG').some(x=>x.years===4&&x.verified));
assert.ok(chemistryUniversityRoutes('GB-SCT').some(x=>x.years===5&&x.verified));
assert.ok(chemistryUniversityStudyDocument({country:'RO',year:5,courseId:'mchem-dissertation',specialty:'general'})===null);
const html=await(await app.fetch(new Request('https://chemistry-year-complete.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script);
new vm.Script(script);
for(const marker of ['const CHEMISTRY_STUDY_CONCEPTS=','const CHEMISTRY_UNIVERSITY_PROFILES=',
 'const chemistryUniversityCourseChoices=','const chemistryContextVisualBuild=',
 "chemistryUniversityStudyDocument({","chemistrySchoolCourseDocuments({",
 "tableButton.onclick=()=>chemistryVisualOpen('periodic','')",
 "chemistryVisualizationFor({"])
 assert.ok(script.includes(marker),'Missing in actual WebView: '+marker);
assert.match(html,/\.science-university-route-picker\{/);
console.log('PASS Chemistry: 50 countries, RO VII/VIII+England KS3 routing, '+lessonTests+
 ' substantive school lesson instances, '+universityChecks+' university course docs, 9 contextual SVG models and WebView syntax');
