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
const api=vm.runInNewContext(source+'\n({levels:MATH_LEVELS,subjects:MATH_TOPICS,forLevel:mathSubjectsForLevel})',
 {learningLabel:(ro)=>ro});
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
assert.ok(script.includes("if(key==='math'&&mathJourney.stage!=='workspace')"),'math tile opens level step first');
assert.ok(script.includes("mathJourney.stage='subjects';mathJourneyShowChoices('subjects')"),'back from workspace opens subject list');
assert.ok(script.includes("mathJourney.stage='levels';"),'learning reset reopens levels');
assert.ok(script.includes("mathJourney.topic=entry.id;mathJourney.stage='workspace'"),'topic opens the existing math engine');
assert.ok(script.includes("const classroom=learningLabel('Nivel: '"),'fallback teaching adapts to chosen level and topic');
assert.match(html,/\.math-choice-list\{[^}]*overflow-y:auto/,'list scroll is bounded inside math stage');
assert.ok(script.includes("['solve',learningLabel('🧩 Rezolvă pas cu pas'"),'existing solve unchanged');
assert.ok(script.includes("['graph',learningLabel('📈 Reprezintă grafic'"),'existing graph unchanged');
console.log('PASS math journey: 3 levels, bounded topic list, back navigation and preserved math tools');
