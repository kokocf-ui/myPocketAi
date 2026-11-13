import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://math.test/'))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script);new vm.Script(script);
const start=script.indexOf('const MATH_LEVELS=');
const end=script.indexOf('let activeLearningSubject=',start);
assert.ok(start>0&&end>start,'level/subject navigation is isolated');
const source=script.slice(start,end);
const api=vm.runInNewContext(source+'\n({levels:MATH_LEVELS,subjects:MATH_TOPICS,forLevel:mathSubjectsForLevel,stages:mathStudyStagesForTopic})',
 {learningLabel:(ro)=>ro,educationCountrySelection:{code:'RO'}});
assert.deepEqual(Array.from(api.levels,x=>x.id),['beginner','intermediate','advanced']);
assert.equal(api.levels[0].scopeRo.includes('I–VIII'),true);
assert.ok(api.levels[2].scopeRo.includes('Universitate'));
for(const level of api.levels){
 const options=Array.from(api.forLevel(level.id));
 assert.ok(options.length>=5,'every level has meaningful topic options');
 assert.ok(options.some(x=>x.id==='geometry'),'geometry always available');
 assert.ok(options.some(x=>x.id==='algebra'),'algebra always available');
}
assert.ok(!Array.from(api.forLevel('beginner')).some(x=>x.id==='differential'),'advanced-only calculus not shown in beginner');
assert.ok(Array.from(api.forLevel('advanced')).some(x=>x.id==='differential'));
assert.ok(api.subjects.find(x=>x.id==='trigonometry').figures);
assert.deepEqual(Array.from(api.stages(api.subjects.find(x=>x.id==='arithmetic')),x=>x.id),['primary'],
 'Arithmetic must not offer gymnasium, lyceum or university');
const arithmetic1=vm.runInNewContext(source+
 "\n(mathJourney.topic='arithmetic',mathJourney.schoolStage='primary',mathJourney.grade='1',educationMathTheoryList())",
 {learningLabel:ro=>ro,educationCountrySelection:{code:'RO'},educationTheoryClean:value=>String(value||'').toLowerCase()});
assert.ok(arithmetic1.length>=5,'Primary grade 1 starts with an interactive lesson library');
assert.ok(arithmetic1.some(x=>x.title==='Adunarea')&&arithmetic1.some(x=>x.title==='Scăderea'));
assert.ok(!arithmetic1.some(x=>/Pitagora|fracții|înmulțire/i.test(x.title)),'Do not show upper-grade theory in class I');
assert.match(html,/#view-module\.learning-math\.math-choice-stage \.math-choice-list\{/,'Maths shows a two-column picture tile grid');
assert.match(html,/\.math-choice-row \.math-tile-icon\{/,'Each maths tile has a drawing');
assert.ok(script.includes("button.append(art,heading,subtitle)"),'All maths branch/stage/chapter buttons include an icon');
assert.ok(script.includes("if(key==='math'&&mathJourney.stage!=='workspace')"),'math tile opens level step first');
assert.ok(script.includes("mathJourneyShowChoices('chapters')"),'workspace back opens the chapter list');
assert.ok(script.includes("mathJourney.stage='branches';mathJourney.level=null"),'learning reset reopens branch choices');
assert.ok(script.includes("mathJourney.topic=entry.id;mathJourney.level=null"),'branch is selected before the study stage');
assert.ok(script.includes("mathJourney.chapter=entry.id;mathJourney.stage='workspace'"),'chapter opens the existing maths engine');
const stages=vm.runInNewContext(source+'\nMATH_SCHOOL_STAGES');
assert.deepEqual(Array.from(stages,x=>x.id),['primary','lower','intermediate','advanced']);
const bank=vm.runInNewContext(source+'\nMATH_CHAPTER_BANK');
assert.ok(bank.geometry.primary.some(x=>x.ro.includes('Figuri')||x.ro.includes('Forme')));
assert.ok(bank.geometry.lower.some(x=>x.ro.includes('teoreme')),'proofs are a secondary-school concept');
assert.ok(bank.algebra.primary.some(x=>x.ro.includes('necunoscute')),'primary algebra means preparatory unknowns');
assert.ok(script.includes("if(stage==='branches')"),'branch screen follows country selection');
assert.ok(script.includes("stage==='levels'?MATH_SCHOOL_STAGES.filter"),'only appropriate school stages appear for each branch');
assert.ok(script.includes("const classroom=learningLabel('Nivel: '"),'fallback teaching adapts to chosen level and topic');
assert.match(html,/\.math-choice-list\{[^}]*overflow-y:auto/,'list scroll is bounded inside math stage');
assert.ok(script.includes("['solve',learningLabel('🧩 Rezolvă pas cu pas'"),'existing solve unchanged');
assert.ok(script.includes("['graph',learningLabel('📈 Reprezintă grafic'"),'existing graph unchanged');
console.log('PASS math journey: country -> branch -> stage -> grade -> chapter, preserving maths tools');
