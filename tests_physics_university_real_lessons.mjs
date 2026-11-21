import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {PHYSICS_UNIVERSITY_CORE_UNITS,physicsUniversityTopicUnits,physicsUniversityUnitMaterial} from './physics_university_learning_units.mjs';
import {PHYSICS_UNIVERSITY_GRAPH_SPECS,physicsUniversityDiagramSpec,physicsUniversityVisualBuild} from './physics_university_visuals.mjs';
import {PHYSICS_UNIVERSITY_STUDIES} from './physics_university_studies.mjs';

const topics=Object.keys(PHYSICS_UNIVERSITY_GRAPH_SPECS);
assert.equal(topics.length,21);
assert.equal(Object.keys(PHYSICS_UNIVERSITY_CORE_UNITS).length,14);
let checks=0;
for(const topic of topics){
 for(const lang of ['ro','en']){
  const units=physicsUniversityTopicUnits(topic,lang);
  const expected=topic.startsWith('special-')?4:2;
  assert.equal(units.length,expected,'Separate studies required for '+topic+'/'+lang);
  assert.equal(new Set(units.map(x=>x.title)).size,expected);
  assert.equal(new Set(units.map(x=>x.formula)).size,expected);
  const bodies=units.map(unit=>physicsUniversityUnitMaterial({unit,language:lang,specialty:'any'}));
  assert.equal(new Set(bodies).size,expected);
  for(const [i,unit] of units.entries()){
   const body=bodies[i];
   assert.ok(body.length>=550,'Study text too short '+topic+'/'+unit.title+' '+body.length);
   assert.ok(unit.concept.length>=65&&unit.method.length>=60&&unit.worked.length>=50);
   assert.ok(unit.exercise.length>=12&&unit.answer.length>=3);
   assert.ok(unit.formula.length>4&&unit.symbols.length>=30);
   const formula=body.indexOf(lang==='ro'?'# Formula de pornire':'# Starting formula');
   const explain=body.indexOf(lang==='ro'?'# Simboluri și unități':'# Symbols and units');
   const worked=body.indexOf(lang==='ro'?'# Exemplu calculat și explicat':'# Worked example with explanation');
   assert.ok(formula>=0&&explain>formula&&worked>explain,
    'Formula and symbols before worked example '+unit.title);
   assert.ok(!body.includes('# Controlul rezultatului')&&!body.includes('# Check your conclusion'),
    'Do not reveal an answer key before the pupil tries the exercise');
   assert.ok(physicsUniversityDiagramSpec(topic,i),'Every study needs matching individual visualization');
   checks++;
  }
 }
}
assert.equal(checks,112,'28 core + 28 specialist lessons, each in two languages');
assert.equal(new Set(Object.entries(PHYSICS_UNIVERSITY_GRAPH_SPECS).flatMap(([topic,rows])=>
 rows.map((row,i)=>topic+':'+i+':'+row[0]+':'+row[1]+':'+row[2]))).size,56);
assert.equal(PHYSICS_UNIVERSITY_STUDIES['special-quantum'].ro.length,4);
const html=await(await frontend.fetch(new Request('https://physics-university-real-lesson.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(script);
for(const marker of [
 'const PHYSICS_UNIVERSITY_CORE_UNITS=','const physicsUniversityTopicUnits=',
 'const physicsUniversityUnitMaterial=','const PHYSICS_UNIVERSITY_GRAPH_SPECS=',
 'const physicsUniversityVisualBuild=',
 'if(scienceJourney.level===\'advanced\'&&subjectId===\'physics\')',
 'sciencePendingAssessmentSpec={subject:\'physics\',topic:topicId,stage:\'advanced\'',
 'if(scienceJourney.level===\'advanced\'){\n  const studies=physicsUniversityTopicUnits',
 'physicsUniversityVisualOpen(index)'])
 assert.ok(script.includes(marker),'University browser wiring missing: '+marker);
// Exercise the exact Android UI function (not only its import list).
const a=script.indexOf('function educationScienceTheoryReader(subjectId,topicId,level){');
const b=script.indexOf('\nfunction ',a+15);
assert.ok(a>=0&&b>a);
class E {
 constructor(tag){this.tag=tag;this.children=[];this.style={};this.textContent='';this.className='';
 this.classList={add(){},remove(){}};this.onclick=null;this.attrs={}}
 append(...items){this.children.push(...items)}
 setAttribute(k,v){this.attrs[k]=v}
}
const calls=[];
const journey={level:'advanced',schoolStage:'advanced',specialty:'quantum',topic:'special-quantum',grade:'university'};
const context={
 document:{createElement:tag=>new E(tag)},scienceJourney:journey,state:{language:'ro'},
 EDUCATION_THEORY_DATA:[],learningLabel:(ro,en)=>ro,
 physicsUniversityTopicUnits,physicsUniversityUnitMaterial,
 educationOpenPagedLesson:(title,body)=>calls.push({title,body,review:api.pending()})
};
const api=vm.runInNewContext(
 'let sciencePendingAssessmentSpec=null;\n'+script.slice(a,b)+
 '\n({reader:educationScienceTheoryReader,pending:()=>sciencePendingAssessmentSpec})',context);
for(const topic of topics){
 journey.topic=topic;
 const sections=api.reader('physics',topic,'advanced');
 const expected=physicsUniversityTopicUnits(topic,'ro');
 const cards=sections.children[1].children;
 assert.equal(cards.length,expected.length,'Number of visible university lesson cards '+topic);
 for(const [i,card] of cards.entries()){
  const before=calls.length;card.onclick();
  assert.equal(calls.length,before+1);
  assert.equal(calls.at(-1).title,expected[i].title,'Correct lesson opens on click');
  assert.ok(calls.at(-1).body.includes(expected[i].formula));
  assert.equal(calls.at(-1).review.prompt,expected[i].exercise,'Exercise is lesson-specific');
  assert.ok(calls.at(-1).review.guide.includes(expected[i].answer));
  assert.equal(api.pending(),null,'No stale answer checking context');
 }
}
assert.equal(calls.length,56);
// Test SVG builder with fake DOM and per-study distinction.
const vCtx={document:{createElement:tag=>new E(tag),createElementNS:(ns,tag)=>new E(tag)},
 physicsUniversityDiagramSpec};
const create=vm.runInNewContext('('+physicsUniversityVisualBuild.toString()+')',vCtx);
for(const topic of topics){
 const entries=physicsUniversityTopicUnits(topic,'ro');
 const renders=entries.map((entry,i)=>create(topic,i,'ro',entry.title));
 for(const [i,render] of renders.entries()){
  assert.ok(render&&render.children[0].textContent===entries[i].title);
  const svg=render.children.find(x=>x.tag==='svg');
  assert.ok(svg&&svg.children.length>3);
  assert.ok(render.children.at(-1).textContent.includes('Diagramă didactică'));
 }
 assert.equal(new Set(renders.map(x=>x.children[0].textContent)).size,renders.length);
}
console.log('PASS university Physics video 100396: 21 topics, 56 distinct real university studies, 112 bilingual materials, 56 matching SVG models; click-to-read and per-lesson answer-check exercised');
