import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {CHEMISTRY_LAWS,CHEMISTRY_LAWS_GROUPS} from './chemistry_laws_reference.mjs';
import {PHYSICS_LAWS,PHYSICS_LAWS_GROUPS} from './physics_laws_reference.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {scienceSchoolTopicLessons,scienceRoAnnualCoverage} from './science_ro_course_plan.mjs';
import {physicsUniversityYears,physicsUniversityRoute,physicsUniversityRoutes} from './physics_university_europe.mjs';

assert.equal(CHEMISTRY_LAWS.length,16,'A meaningful Chemistry reference is present');
assert.equal(new Set(CHEMISTRY_LAWS.map(x=>x.id)).size,CHEMISTRY_LAWS.length,'No duplicate laws');
for(const item of CHEMISTRY_LAWS){
 assert.ok(CHEMISTRY_LAWS_GROUPS.some(group=>group.id===item.group),item.id+' category');
 assert.equal(item.subject,'chemistry');
 for(const key of ['ro','en','formula','explainRo','explainEn','exampleRo','exampleEn','scopeRo','scopeEn'])
  assert.ok(typeof item[key]==='string'&&item[key].length>=10,item.id+' missing '+key);
}
const html=await(await app.fetch(new Request('https://chemistry-laws-grade.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Frontend script exists');new vm.Script(script);
assert.match(html,/Scroll the page normally on long science year\/law menus/);
assert.match(script,/chemistryLawsButton\.onclick=\(\)=>scienceJourneyShowChoices\('chemistry-laws'\)/);
assert.match(script,/band\.schoolStage==='primary'&&\['physics','chemistry'\]/);
const begin=script.indexOf('const SCIENCE_SUBJECTS=');
const end=script.indexOf('const MATH_LEVELS=[',begin);
assert.ok(begin>=0&&end>begin,'Scoped science routines exist');
class El{
 constructor(tag){this.tag=tag;this.children=[];this.className='';this.style={};
  this.textContent='';this.hidden=false;this.onclick=null;this.oninput=null;this.value='';
  this.classList={add(){},remove(){},toggle(){},contains(){return false}};}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this.children=nodes}
 setAttribute(){}
}
const host=new El('div'),root=new El('section'),title=new El('h2'),lead=new El('p');
const els={'view-module':root,moduleContent:host,moduleTitle:title,moduleLead:lead};
const opened=[];
const env={
 document:{createElement:tag=>new El(tag),querySelector:()=>null,activeElement:null},
 window:{addEventListener(){},visualViewport:null,innerHeight:850},requestAnimationFrame:()=>0,
 LEARNING_SUBJECTS:[['science','⚛️','Științe','Sciences']],
 PHYSICS_LAWS_DATA:PHYSICS_LAWS,PHYSICS_LAW_GROUPS:PHYSICS_LAWS_GROUPS,
 CHEMISTRY_LAWS_DATA:CHEMISTRY_LAWS,CHEMISTRY_LAW_GROUPS:CHEMISTRY_LAWS_GROUPS,
 physicsUniversityYears,physicsUniversityRoute,physicsUniversityRoutes,
 SCIENCE_GRADE_TOPIC_PLAN:scienceGradeTopicPlan,scienceSchoolTopicLessons,scienceRoAnnualCoverage,
 educationCountrySelection:{code:'RO',label:'România'},
 eduYearOptions:()=>[{id:'7',ro:'Clasa 7',en:'Grade 7'},{id:'8',ro:'Clasa 8',en:'Grade 8'}],
 learningLabel:(ro,en)=>ro,
 educationTheoryClean:value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(),
 educationOpenPagedLesson:(name,body)=>opened.push({name,body}),
 SCIENCE_GRADE_TOPIC_PLAN:()=>[],SCIENCE_PRIMARY_LESSON_BANK:{},EDUCATION_THEORY_DATA:[],
 $:key=>els[key]||null,scienceVoiceStop:()=>{},scienceStopRequest:()=>{},
 scienceOpenWorkspace:()=>{},renderLearningSubjects:()=>{},pocketNativeVoiceAvailable:()=>false,
};
const api=vm.runInNewContext('let activeLearningSubject=null;'+script.slice(begin,end)+';({show:scienceJourneyShowChoices,back:scienceBack,journey:scienceJourney})',env);
api.journey.subject='chemistry';
api.show('years');
assert.equal(host.children[0].children.length,3,'Back, periodic table, Chemistry laws in grade toolbar');
assert.match(host.children[0].children[1].textContent,/Tabloul periodic/);
assert.match(host.children[0].children[2].textContent,/Legi și principii/);
host.children[0].children[2].onclick();
assert.equal(api.journey.stage,'chemistry-laws');
assert.equal(api.journey.grade,null,'Chemistry laws work without a selected grade');
const panel=host.children[1],filter=panel.children[2],groups=panel.children[3].children;
assert.equal(groups.length,CHEMISTRY_LAWS_GROUPS.length,'Chemistry laws grouped');
groups[0].children[1].children[0].onclick();
assert.equal(opened.length,1);
for(const word of ['Enunț și explicație','Legea sau relația matematică','Exemplu explicat','Condiții și limite de aplicare'])
 assert.ok(opened[0].body.includes(word),word);
assert.match(opened[0].body,/Referință generală de chimie/);
filter.value='Lavoisier';filter.oninput();
const visible=groups.flatMap(g=>g.children[1].children).filter(x=>!x.hidden);
assert.equal(visible.length,1,'Filter finds the relevant Chemistry law only');
api.back();assert.equal(api.journey.stage,'years','Back returns to grade selection');
console.log('PASS Chemistry: 16 laws and principles, direct menu access, detailed reader, search, Back, and scroll policy');
