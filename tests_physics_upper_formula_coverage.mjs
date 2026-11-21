import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {PHYSICS_UPPER_CASES} from './physics_upper_cases.mjs';
import {PHYSICS_UPPER_CASES_EN} from './physics_upper_cases_en.mjs';
import {PHYSICS_UPPER_TEACHING_GUIDES} from './physics_upper_teaching_guides.mjs';
import {scienceSchoolLessonMaterial} from './science_school_lesson_material.mjs';
const models=[['ro',PHYSICS_UPPER_CASES],['en',PHYSICS_UPPER_CASES_EN]];
const topics=Object.keys(PHYSICS_UPPER_CASES),allCount=topics.reduce((n,topic)=>n+PHYSICS_UPPER_CASES[topic].length,0);
assert.equal(topics.length,14);
assert.equal(allCount,42);
for(const [lang,catalogue] of models){
 let count=0,withFormula=0;
 for(const topic of topics){
  const rows=catalogue[topic],guides=PHYSICS_UPPER_TEACHING_GUIDES[topic];
  assert.equal(rows.length,3);
  assert.equal(guides.length,3);
  for(let i=0;i<rows.length;i++){
   const entry=rows[i];
   assert.ok(entry.method?.length>=65,'Missing per-concept instructional method '+lang+' '+entry.title);
   const body=scienceSchoolLessonMaterial({entry,subject:'physics',grade:'9',chapter:topic,language:lang});
   assert.ok(body.includes(entry.statement)&&body.includes(entry.workedExample));
   assert.ok(body.includes(entry.method),'Method text missing from reader '+entry.title);
   assert.ok(body.length>=440,'Upper-secondary explanatory text is too brief '+lang+' '+entry.title);
   if(entry.formula){
    withFormula++;
    assert.ok(entry.symbols?.length>=15);
    const fo=body.indexOf(lang==='ro'?'# Formula de pornire':'# Starting formula');
    const sy=body.indexOf(lang==='ro'?'# Ce înseamnă simbolurile și unitățile':'# Symbols and units');
    const ex=body.indexOf(lang==='ro'?'# Exemplu explicat':'# Worked illustration');
    assert.ok(fo>=0&&sy>fo&&ex>sy,'Formula+symbols must precede numerical example '+entry.title);
   }else assert.ok(['units','heat','measurement'].includes(topic),
    'Qualitative lesson without formula should be in an explanatory topic '+entry.title);
   count++;
  }
 }
 assert.equal(count,42);
 assert.ok(withFormula>=35,'Most high-school physical calculation cases must have an explicit equation');
}
const html=await(await app.fetch(new Request('https://physics-upper-audit.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(script);
assert.ok(script.includes('const PHYSICS_UPPER_CASES=')&&script.includes('const PHYSICS_UPPER_CASES_EN='),
 'Both bilingual cases are embedded in actual Android WebView');
console.log('PASS upper Physics formula-before-example: 42 Romanian + 42 English original cases across 14 chapters, individual methods and symbols');
