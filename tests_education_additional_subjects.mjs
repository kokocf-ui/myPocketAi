import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {WORLDWIDE_GENERIC_SUBJECTS,worldwideStudyChapters,worldwideSchoolYears} from './education_worldwide_paths.mjs';
import {HG_GENERAL_GRADE_LESSONS} from './education_general_paths.mjs';

for(const subject of ['economics','civics']){
 const template=WORLDWIDE_GENERIC_SUBJECTS[subject];
 assert.ok(template.length>=10,subject+' must contain substantive study topics');
 for(const country of ['RO','GB-ENG','FR','JP','AU','BR','IN','DE','CA']){
  const grades=worldwideSchoolYears(country,'lower');
  assert.ok(grades.length,subject+'/'+country+' missing school years');
  const units=worldwideStudyChapters(country,subject,'lower',grades[0].id,country,country,HG_GENERAL_GRADE_LESSONS);
  assert.ok(units.length>=15,subject+'/'+country+' missing study content');
  assert.equal(new Set(units.map(x=>x[0])).size,units.length,'Distinct IDs needed across units');
 }
}
const response=await frontend.fetch(new Request('https://example.invalid/'));
assert.ok(response.ok);
const html=await response.text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Browser app must contain a script');
new vm.Script(script,{filename:'education-economics-civics.js'});
for(const token of [
 "['economics','📊','Economie','Economics'",
 "['civics','🏛️','Educație civică','Civics'",
 "function educationInternationalExtraLevels(key)",
 "if(key==='economics'||key==='civics')",
 "educationGradeGate(key,item.id,grade=>",
 "educationInternationalOpen(key,item.id,grade,selectYear)"
])assert.ok(script.includes(token),'Missing subject flow: '+token);
assert.ok(script.indexOf('function educationInternationalExtraLevels(key)')<script.indexOf('function openLearningSubjectAfterCountry(key)'));
console.log('PASS Economics and Civics country/year paths, navigable lessons and browser syntax');
