import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {physicsGrade6Laboratories} from './physics_grade6_labs.mjs';

const topics=['units','kinematics','dynamics','energy','heat','electric','electromagnetism','optics'];
const all=topics.flatMap(topic=>physicsGrade6Laboratories(topic).map(lab=>({...lab,topic})));
assert.equal(all.length,13,'Grade VI has 13 chapter-specific experiments');
assert.equal(new Set(all.map(lab=>lab.title)).size,all.length);
for(const lang of ['ro','en']){
 const prompts=all.map(lab=>lab.review?.[lang]?.prompt);
 assert.ok(prompts.every(q=>typeof q==='string'&&q.length>40),
  'Each laboratory needs its own substantive question in '+lang);
 assert.equal(new Set(prompts).size,all.length,
  'Do not recycle one question across all laboratory activities in '+lang);
 assert.ok(all.every(lab=>lab.review[lang].guide.length>55),
  'Each laboratory question needs separate answer criteria '+lang);
}
const area=all.find(lab=>lab.title==='Află aria unei suprafețe');
const time=all.find(lab=>lab.title==='Repetă măsurarea timpului');
const volume=all.find(lab=>lab.title==='Determină volumul unei cutii');
assert.match(area.review.ro.prompt,/arie|foaie|suprafa/i);
assert.match(time.review.ro.prompt,/timp|durat/i);
assert.match(volume.review.ro.prompt,/volum|cutie/i);
assert.ok(!all.some(lab=>lab.review.ro.prompt.includes('750 mm')),
 'Reported chapter-level conversion must not leak into lab questions');
const html=await(await frontend.fetch(new Request('https://physics-lab-context.test/'))).text();
const js=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(js);
assert.ok(js.includes('const review=lab.review?.[lang]'),
 'When opening a lab, use its own review, never the generic chapter exercise');
assert.ok(js.includes('sciencePendingAssessmentSpec=review?')&&
 js.includes('finally{sciencePendingAssessmentSpec=null}'),
 'Set and clear the specific review around reader opening');
assert.ok(js.includes('if(spec?.disabled||!spec?.prompt||!spec.guide)return'),
 'Missing lab reviews must not show the irrelevant chapter-level question');
assert.ok(js.includes('prev.style.cssText=lessonPageNavStyle')&&
 js.includes('next.style.cssText=lessonPageNavStyle'),
 'Previous/Next must have one identical burgundy style');
const a=js.indexOf('function scienceOpenChemistrySection(stage){');
const b=js.indexOf('\nfunction ',a+12);
assert.ok(a>0&&b>a,'Extract real science activities screen for click test');
class FakeElement {
 constructor(tag){this.tag=tag;this.children=[];this.style={};this.className='';this.textContent='';this.onclick=null;
 this.classList={add() {},remove() {},toggle() {}};}
 append(...nodes){this.children.push(...nodes)}
 setAttribute(){}
}
const host=new FakeElement('div'),calls=[];
const journey={subject:'physics',schoolStage:'lower',grade:'6',level:'beginner',topic:'units'};
const env={
 document:{createElement:tag=>new FakeElement(tag)},
 $:name=>name==='moduleContent'?host:null,
 scienceTopicInfo:()=>({id:journey.topic,ro:journey.topic,en:journey.topic}),
 scienceJourney:journey,educationCountrySelection:{code:'RO'},state:{language:'ro'},
 learningLabel:(ro,en)=>ro,scienceBack:()=>{},
 physicsGrade6Laboratories
};
const api=vm.runInNewContext(
 'let sciencePendingAssessmentSpec=null;\n'+js.slice(a,b)+
 '\n({open:scienceOpenChemistrySection,pending:()=>sciencePendingAssessmentSpec})',env);
env.educationOpenPagedLesson=(title,body)=>calls.push({title,body,pending:api.pending()});
for(const topic of topics){
 journey.topic=topic;host.children=[];
 api.open('chemistry-lab');
 const list=host.children[1]?.children[2];
 assert.ok(list?.children?.length,topic+' has visible chapter laboratory choices');
 const expected=physicsGrade6Laboratories(topic);
 assert.equal(list.children.length,expected.length);
 for(let i=0;i<expected.length;i++){
  const before=calls.length;
  list.children[i].onclick();
  assert.equal(calls.length,before+1,'Laboratory card must launch the reader');
  assert.equal(calls.at(-1).pending.prompt,expected[i].review.ro.prompt,
   'The exact opened laboratory must own its exercise');
  assert.equal(calls.at(-1).pending.guide,expected[i].review.ro.guide);
  assert.equal(calls.at(-1).pending.localVerification,false,
   'Do not use unrelated numeric chapter checker for lab question');
  assert.equal(api.pending(),null,'No previous question can leak into next laboratory');
 }
}
assert.equal(calls.length,13);
console.log('PASS video 100392: 13 unique laboratory questions and criteria, real click-to-reader review context, no 750 mm reuse, matching Previous/Next colors');
