import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {PHYSICS_UNIVERSITY_STUDIES} from './physics_university_studies.mjs';
import {PHYSICS_UNIVERSITY_CASE_GUIDES} from './physics_university_case_guides.mjs';
import {scienceUniversityChapter} from './science_university_chapters.mjs';
import {THEORY_ENTRIES} from './education_theory.mjs';
const topics=Object.keys(PHYSICS_UNIVERSITY_STUDIES);
assert.equal(topics.length,7);
let total=0;
for(const topic of topics){
 assert.equal(PHYSICS_UNIVERSITY_CASE_GUIDES[topic].length,4);
 for(const language of ['ro','en']){
  const rows=PHYSICS_UNIVERSITY_STUDIES[topic][language];
  assert.equal(rows.length,4);
  const body=scienceUniversityChapter({subject:'physics',specialty:'theoretical',
   topic,chapter:topic,language,grade:'university',lessons:THEORY_ENTRIES});
  assert.ok(body,'Missing university chapter: '+topic);
  for(const [i,row] of rows.entries()){
   assert.ok(row.formula?.length>=5&&row.symbols?.length>=40&&row.method?.length>=75,
    'No university formula, physical symbols and model conditions: '+row.title);
   const marker='## '+(i+1)+'. '+row.title;
   const a=body.indexOf(marker),b=body.indexOf('## '+(i+2)+'. ',a+marker.length);
   assert.ok(a>=0,'Distinct specialist study missing: '+row.title);
   const section=body.slice(a,b<0?undefined:b);
   const f=section.indexOf(language==='ro'?'# Formula de pornire':'# Starting formula');
   const s=section.indexOf(language==='ro'?'# Simboluri și unități':'# Symbols and units');
   const m=section.indexOf(language==='ro'?'# Metoda de aplicare':'# How to apply the model');
   const w=section.indexOf(language==='ro'?'# Exemplu rezolvat':'# Worked example');
   assert.ok(f>=0&&s>f&&m>s&&w>m,'Wrong teacher order: '+row.title);
   assert.ok(section.includes(row.formula)&&section.includes(row.symbols)&&section.includes(row.workedExample));
   total++;
  }
 }
}
assert.equal(total,56);
const html=await(await frontend.fetch(new Request('https://test-university-formula.test/'))).text();
const inline=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(inline);
assert.ok(inline.includes('const PHYSICS_UNIVERSITY_STUDIES=')&&inline.includes('const SCIENCE_UNIVERSITY_CHAPTER='));
console.log('PASS original university Physics: 28 specialist cases in RO and EN (56), formula, symbols and method before example');
