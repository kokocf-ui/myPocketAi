import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {COMPUTING_TOPICS,COMPUTING_PATHS} from './computing_curriculum.mjs';
import {COMPUTING_EXTENDED_THEORY} from './computing_extended_theory.mjs';
import {COMPUTING_UI_SCRIPT} from './computing_ui.mjs';

assert.equal(COMPUTING_TOPICS.length,74,'All 74 computing topics remain available');
assert.equal(Object.keys(COMPUTING_EXTENDED_THEORY).length,53,'53 short topics gain detailed theory');
const ids=new Set(COMPUTING_TOPICS.map(x=>x.id));
for(const [id,material] of Object.entries(COMPUTING_EXTENDED_THEORY)){
 assert.ok(ids.has(id),'Extended theory references known topic: '+id);
 assert.ok(material.length>=350,'Extended lesson has substantial content: '+id);
 assert.ok(material.includes('Exemplu')||material.includes('exemplu')||material.includes('Pentru')||material.includes('Compară'),'Extended lesson includes explanation or use case: '+id);
}
for(const topic of COMPUTING_TOPICS){
 assert.ok(topic.theory.length>=550,topic.id+' has more than a one-sentence definition');
 assert.ok(topic.question&&Array.isArray(topic.choices)&&topic.choices.length===4,topic.id+' quiz unchanged');
}
assert.match(COMPUTING_UI_SCRIPT,/\['devices','logic','digital','safety'\]/,'KS1 Year 1–2 includes digital creation and data');
assert.equal(COMPUTING_PATHS.filter(x=>x.level==='beginner').length,4,'All four beginner branches remain distinct');
const html=await(await frontend.fetch(new Request('https://computing-lessons.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Inline client script');
new vm.Script(script);
assert.match(script,/function computingGradePathAllowed\(path\)/);
console.log('PASS: 74 Computing lessons have developed theory, 53 expanded, KS1 digital content available');
