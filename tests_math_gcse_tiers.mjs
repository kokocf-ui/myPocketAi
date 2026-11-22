import assert from 'node:assert/strict';
import vm from 'node:vm';
import {MATH_GCSE_HIGHER_ONLY,mathGcseSelectTier,mathGcseLessonTier,MATH_GCSE_REFERENCE}
 from './math_gcse_tier_policy.mjs';
import {mathCountryCourseEntries} from './math_depth_courses.mjs';
import frontend from './index.js';
const script=[...(await(await frontend.fetch(new Request('https://math-gcse-tier.test/'))).text()).matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script);
new vm.Script(script);
assert.ok(script.includes("let mathGcseTier='foundation'"),'Foundation must be the safe default');
assert.ok(script.includes("select.id='math-gcse-tier'"),'GCSE tier selector should be visible in Android UI');
assert.ok(script.includes("mathGcseSelectTier(lessons,mathGcseTier)"));
const all=new Set(),higher=new Set();
for(const grade of ['Y10','Y11'])for(const topic of ['algebra','functions','geometry','statistics','trigonometry']){
 const rows=mathCountryCourseEntries({country:'GB-ENG',stage:'intermediate',grade,phase:grade==='Y10'?1:2,topic});
 const base=mathGcseSelectTier(rows,'foundation'),full=mathGcseSelectTier(rows,'higher');
 assert.equal(full.length,rows.length,'Higher includes all Foundation topics');
 assert.ok(base.length<=full.length);
 const excluded=full.filter(x=>mathGcseLessonTier(x)==='higher-only');
 assert.ok(!base.some(x=>excluded.some(y=>x.id===y.id)),'Higher-only material leaks into Foundation');
 assert.ok(base.every(x=>mathGcseLessonTier(x)==='both'));
 for(const x of rows){
  all.add(x.title);
  if(mathGcseLessonTier(x)==='higher-only')higher.add(x.title);
 }
}
// AQA 8300 A7 covers inverse/composite functions on Higher only; they must
// be accessible for Higher learners, not excluded from BOTH GCSE tiers.
const year11= ['algebra','functions','geometry','statistics','trigonometry']
 .flatMap(topic=>mathCountryCourseEntries({country:'GB-ENG',stage:'intermediate',
   grade:'Y11',phase:2,topic}));
const year11Higher=mathGcseSelectTier(year11,'higher');
const year11Foundation=mathGcseSelectTier(year11,'foundation');
for(const title of ['Funcția inversă','Inversa funcției afine','Funcții inverse și restricții de domeniu']){
 assert.ok(year11Higher.some(entry=>entry.title===title),
   'GCSE Higher must include inverse-function lesson: '+title);
 assert.ok(!year11Foundation.some(entry=>entry.title===title),
   'GCSE Foundation must exclude A7 inverse-functions lesson: '+title);
 assert.equal(MATH_GCSE_HIGHER_ONLY[title],'A7');
}
for(const title of ['Tangenta la un cerc']){
 assert.ok(year11Higher.some(entry=>entry.title===title),
   'GCSE Higher must include the A16 circle-tangent lesson');
 assert.ok(!year11Foundation.some(entry=>entry.title===title),
   'GCSE Foundation must exclude the A16 circle-tangent lesson');
 assert.equal(MATH_GCSE_HIGHER_ONLY[title],'A16');
}
for(const [title,reference] of Object.entries(MATH_GCSE_HIGHER_ONLY)){
 assert.ok(all.has(title),'Unknown title in crosswalk: '+title);
 assert.match(reference,/^[A-Z]+[0-9]+$/);
 assert.ok(higher.has(title),'Higher-only item not filtered: '+title);
}
assert.ok(higher.size>=9);
assert.match(MATH_GCSE_REFERENCE.topicIndex,/aqa\.org\.uk/);
console.log('PASS GCSE Foundation/Higher grouping:',higher.size,'source-linked Higher-only course items; Foundation is the initial Android setting.');
