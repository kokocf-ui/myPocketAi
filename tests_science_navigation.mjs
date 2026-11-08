import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {CHEMISTRY_TOPICS,CHEMISTRY_LEVELS} from './chemistry_curriculum.mjs';
import {CHEMISTRY_SPECIALIZATIONS,CHEMISTRY_SPECIALTY_TOPICS} from './chemistry_advanced.mjs';
import {BIOLOGY_TOPICS,BIOLOGY_SPECIALIZATIONS,BIOLOGY_SPECIALTY_TOPICS} from './biology_curriculum.mjs';
import {THEORY_ENTRIES} from './education_theory.mjs';
import {PHYSICS_TOPICS,PHYSICS_SPECIALIZATIONS} from './physics_curriculum.mjs';
import {ASTRONOMY_TOPICS,ASTRONOMY_SPECIALIZATIONS} from './astronomy_curriculum.mjs';

const html=await(await frontend.fetch(new Request('https://science-navigation-test.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script);
new vm.Script(script);
assert.match(script,/if\(key==='science'\)\{scienceJourneyShowChoices\('subjects'\);return\}/);
assert.match(script,/function scienceJourneyShowChoices\(stage\)/);
assert.match(script,/function scienceOpenWorkspace\(\)/);
assert.match(script,/function scienceVoiceHandleAndroid\(data\)/);
assert.match(script,/if\(scienceVoiceHandleAndroid\(data\)\)return/);
assert.match(script,/function sciencePhotoReview\(text\)/);
assert.match(script,/function scienceWorkspaceRun\(mode\)/);
assert.match(script,/chemistryCurriculumPreset=\{level:scienceJourney\.level,topic:scienceJourney\.topic\}/);
assert.match(script,/className='education-math-workspace science-education-workspace'/);
assert.match(script,/id='scienceEducationText'/);
assert.match(html,/#view-module\.learning-science #moduleChatHost\{[^}]*display:none!important/s,
 'generic empty chat is hidden in Sciences');
assert.match(html,/#view-module\.learning-science #scienceEducationText\{[^}]*min-height:125px!important/s);
assert.match(html,/grid-template-columns:minmax\(72px,.85fr\) minmax\(0,2fr\) minmax\(78px,.85fr\)/,
 'Mathematics Theory action is on the same row');
assert.match(html,/height:clamp\(125px,23dvh,235px\)!important;max-height:30dvh!important/,
 'long Mathematics prompt has expanded visible area');

const start=script.indexOf('const SCIENCE_SUBJECTS=');
const end=script.indexOf('const MATH_LEVELS=[',start);
assert.ok(start>0&&end>start);
class FakeEl{
 constructor(tag){this.tag=tag;this.textContent='';this.children=[];this.style={};this.className='';this.onclick=null;}
 append(...elements){this.children.push(...elements)}
 replaceChildren(...elements){this.children=[...elements]}
 setAttribute(){}
}
const classes=new Set(['active','learning-choose']);
const root={classList:{
 add:(...args)=>args.forEach(x=>classes.add(x)),
 remove:(...args)=>args.forEach(x=>classes.delete(x)),
 toggle:(key,on)=>on?classes.add(key):classes.delete(key),
 contains:key=>classes.has(key)
}};
const host=new FakeEl('div'),title=new FakeEl('h2'),lead=new FakeEl('div');
const elements={'view-module':root,moduleContent:host,moduleTitle:title,moduleLead:lead};
let workspaces=0,home=0;
const sandbox={
 document:{createElement:tag=>new FakeEl(tag),querySelector:()=>null},
 window:{addEventListener:()=>{},visualViewport:null,innerHeight:900},
 requestAnimationFrame:()=>0,
 CHEMISTRY_TOPIC_DATA:[...CHEMISTRY_TOPICS,...CHEMISTRY_SPECIALTY_TOPICS],CHEMISTRY_LEVEL_DATA:CHEMISTRY_LEVELS,
 CHEMISTRY_SPECIALTY_DATA:CHEMISTRY_SPECIALIZATIONS,
 PHYSICS_TOPIC_DATA:PHYSICS_TOPICS,PHYSICS_SPECIALTY_DATA:PHYSICS_SPECIALIZATIONS,
 ASTRONOMY_TOPIC_DATA:ASTRONOMY_TOPICS,ASTRONOMY_SPECIALTY_DATA:ASTRONOMY_SPECIALIZATIONS,
 BIOLOGY_TOPIC_DATA:[...BIOLOGY_TOPICS,...BIOLOGY_SPECIALTY_TOPICS],BIOLOGY_SPECIALTY_DATA:BIOLOGY_SPECIALIZATIONS,
 EDUCATION_THEORY_DATA:THEORY_ENTRIES,
 LEARNING_SUBJECTS:[['science','⚛️','Științe','Sciences']],
 learningLabel:(ro,en)=>ro,
 $:key=>elements[key]||null,
 pocketNativeVoiceAvailable:()=>false,
 scienceOpenWorkspace:()=>{workspaces++},
 renderLearningSubjects:()=>{home++},
 Math
};
const api=vm.runInNewContext('let activeLearningSubject=null;'+script.slice(start,end)+
 '\n({open:scienceJourneyShowChoices,back:scienceBack,state:scienceJourney,subjects:SCIENCE_SUBJECTS})',sandbox);
api.open('subjects');
let rows=()=>host.children[1]?.children[2]?.children||[];
assert.equal(rows().length,4,'four subjects appear before difficulty levels');
assert.deepEqual([...api.subjects.map(s=>s.ro)],['Fizică','Chimie','Biologie','Astronomie']);
rows()[1].onclick();
assert.equal(api.state.subject,'chemistry');
assert.equal(api.state.stage,'levels','subject selection precedes level');
assert.equal(rows().length,3,'three difficulty levels');
rows()[1].onclick();
assert.equal(api.state.level,'intermediate');
assert.equal(api.state.stage,'topics');
assert.ok(rows().some(x=>x.children[0].textContent==='Chimie organică'));
assert.ok(!rows().some(x=>x.children[0].textContent==='Chimie universitară avansată'),
 'no university chapter in intermediate level');
const chemistryOrganic=rows().find(x=>x.children[0].textContent==='Chimie organică');
chemistryOrganic.onclick();
assert.equal(api.state.topic,'organic');
assert.equal(api.state.stage,'workspace');
assert.equal(workspaces,1,'science workspace is mounted only after chapter selection');
api.back();assert.equal(api.state.stage,'topics');
api.back();assert.equal(api.state.stage,'levels');
api.back();assert.equal(api.state.stage,'subjects');
api.back();assert.equal(home,1,'back from four-subject chooser returns to Education');
for(const [index,id] of [[0,'physics'],[2,'biology'],[3,'astronomy']]){
 api.open('subjects');
 rows()[index].onclick();
 assert.equal(api.state.subject,id);
 rows()[0].onclick();
 assert.equal(api.state.stage,'topics');
 assert.ok(rows().length>=4,'real chapter choices for '+id);
 rows()[0].onclick();
 assert.equal(api.state.stage,'workspace');
 api.back();api.back();api.back();
}
console.log('PASS Sciences: four subjects first, then difficulty, chapter, dedicated workspace; Back, responsive UI and Mathematics text visibility');
