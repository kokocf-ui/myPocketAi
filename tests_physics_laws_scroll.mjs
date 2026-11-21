import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {PHYSICS_LAWS,PHYSICS_LAWS_GROUPS} from './physics_laws_reference.mjs';
import {PHYSICS_TOPICS,PHYSICS_SPECIALIZATIONS} from './physics_curriculum.mjs';

assert.equal(PHYSICS_LAWS.length,32,'All physics reference items present');
assert.equal(new Set(PHYSICS_LAWS.map(x=>x.id)).size,PHYSICS_LAWS.length,'No duplicate laws');
for(const law of PHYSICS_LAWS){
 assert.ok(PHYSICS_LAWS_GROUPS.some(g=>g.id===law.group),law.id+' group');
 for(const key of ['ro','en','formula','explainRo','explainEn','exampleRo','exampleEn','scopeRo','scopeEn'])
  assert.ok(typeof law[key]==='string'&&law[key].length>=4,law.id+'/'+key);
}
assert.ok(PHYSICS_LAWS.some(x=>x.type==='theorem'),'Theorems are present');
const html=await(await app.fetch(new Request('https://physics-laws-scroll.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Browser script served');
new vm.Script(script);
for(const fragment of [
 "root.classList.toggle('science-scroll-stage',stage==='years'||stage==='physics-laws');",
 "lawsButton.onclick=()=>scienceJourneyShowChoices('physics-laws')",
 "if(current==='physics-laws')scienceJourney.stage='years';",
 "page.style.setProperty('--science-selector-height'",
 "function sciencePhysicsLawText(law)",
 "science-laws-filter"
])assert.ok(script.includes(fragment),fragment);
assert.match(html,/main\.page:has\(#view-module\.learning-science\.science-scroll-stage\.active\)\{/, 'Scroll container scoped to Sciences year/laws');
assert.match(html,/#view-module\.learning-science\.science-scroll-stage\.active \.science-choice-list\{[\s\S]*?overflow-y:auto!important/, 'Year/laws list is scrollable');
assert.match(html,/-webkit-overflow-scrolling:touch!important;touch-action:pan-y!important/, 'Native touch scrolling enabled');
const begin=script.indexOf('const SCIENCE_SUBJECTS=');
const end=script.indexOf('const MATH_LEVELS=[',begin);
assert.ok(begin>=0&&end>begin);
class El {
 constructor(tag){
  this.tag=tag;this.children=[];this.className='';this.style={};this.textContent='';
  this.hidden=false;this.onclick=null;this.oninput=null;this.value='';
  this.classList={add(){},remove(){},toggle(){},contains(){return false}};
 }
 append(...children){this.children.push(...children)}
 replaceChildren(...children){this.children=children}
 setAttribute(){}
}
const host=new El('div'),root=new El('section'),title=new El('h2'),lead=new El('p');
const els={'view-module':root,moduleContent:host,moduleTitle:title,moduleLead:lead};
let opened=[];
const sandbox={
 document:{createElement:t=>new El(t),querySelector:()=>null,activeElement:null},
 window:{addEventListener(){},visualViewport:null,innerHeight:850},
 requestAnimationFrame:()=>0,
 LEARNING_SUBJECTS:[['science','⚛️','Științe','Sciences']],
 PHYSICS_LAWS_DATA:PHYSICS_LAWS,PHYSICS_LAW_GROUPS:PHYSICS_LAWS_GROUPS,
 PHYSICS_TOPIC_DATA:PHYSICS_TOPICS,PHYSICS_SPECIALTY_DATA:PHYSICS_SPECIALIZATIONS,
 learningLabel:(ro,en)=>ro,
 educationTheoryClean:value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(),
 educationOpenPagedLesson:(name,body)=>opened.push({name,body}),
 educationCountrySelection:{code:'RO',label:'România'},
 eduYearOptions:()=>[{id:'6',ro:'Clasa 6',en:'Year 6'}],
 SCIENCE_GRADE_TOPIC_PLAN:()=>[], SCIENCE_PRIMARY_LESSON_BANK:{}, EDUCATION_THEORY_DATA:[],
 chemistryCurriculumPreset:null,
 $:key=>els[key]||null,scienceVoiceStop:()=>{},scienceStopRequest:()=>{},
 scienceOpenWorkspace:()=>{},renderLearningSubjects:()=>{},
 pocketNativeVoiceAvailable:()=>false
};
const api=vm.runInNewContext('let activeLearningSubject=null;'+script.slice(begin,end)+';({show:scienceJourneyShowChoices,back:scienceBack,journey:scienceJourney})',sandbox);
api.journey.subject='physics';api.show('years');
assert.equal(host.children.length,2,'Toolbar and years panel');
assert.equal(host.children[0].children.length,2,'Laws directly in year toolbar without grade selection');
host.children[0].children[1].onclick();
assert.equal(api.journey.stage,'physics-laws');
assert.equal(api.journey.grade,null,'No grade required to browse laws');
const panel=host.children[1],filter=panel.children[2],groups=panel.children[3].children;
assert.equal(groups.length,PHYSICS_LAWS_GROUPS.length,'Laws grouped by topic');
const first=groups[0].children[1].children[0];
first.onclick();
assert.equal(opened.length,1);
for(const marker of ['Enunț și explicație','Legea sau relația matematică','Exemplu explicat','Condiții și limite de aplicare'])
 assert.ok(opened[0].body.includes(marker),marker);
filter.value='Newton';filter.oninput();
const visible=groups.flatMap(group=>group.children[1].children).filter(button=>!button.hidden);
assert.equal(visible.length,3,'Search reduces the 32 entries to three Newton laws');
api.back();assert.equal(api.journey.stage,'years','Back from laws returns to years');
console.log('PASS Physics: 32 referenced laws/theorems, direct access without grade, search, reader, Back, touch-scroll CSS');
