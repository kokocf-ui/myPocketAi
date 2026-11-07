import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://education.test/'))).text();
const script=[...html.matchAll(/<script[^>]*>([\\s\\S]*?)<\\/script>/g)][0]?.[1];
assert.ok(script,'inline application script exists');
new vm.Script(script);
const start=script.indexOf('const EDUCATION_PATHS=');
const end=script.indexOf('let activeLearningSubject=',start);
assert.ok(start>0&&end>start,'non-math educational pathways registered');
const scope=script.slice(start,end);
const catalogue=vm.runInNewContext(scope+'\nEDUCATION_PATHS',{learningLabel:(ro)=>ro});
for(const key of ['languages','science','history','literature','computing','exams','practical']){
 assert.ok(catalogue[key]?.length>=4,key+' has selectable disciplines');
 const ids=Array.from(catalogue[key],entry=>entry[0]);
 assert.equal(new Set(ids).size,ids.length,key+' has no duplicated IDs');
}
assert.match(script,/educationPath\.stage='levels';educationPath\.key=null;educationPath\.topic=null/,'category chooser resets pathway');
assert.match(script,/educationShowChoices\(educationPath\.stage==='subjects'\?'subjects':'levels'\)/,'non-math card opens navigation');
assert.match(script,/educationPath\.stage='workspace';root\.classList\.remove\('math-choice-stage'\);openLearningSubject\(educationPath\.key\)/,'discipline opens workspace');
assert.match(script,/educationPath\.stage='subjects';educationShowChoices\('subjects'\)/,'Back opens disciplines without losing level');
assert.match(script,/if\(key==='math'&&mathJourney\.stage!=='workspace'\)/,'existing mathematics route retained');
console.log('PASS education pathways: levels, discipline menus and existing math isolation');
