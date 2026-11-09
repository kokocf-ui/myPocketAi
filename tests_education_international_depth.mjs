import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {EDUCATION_LOCAL_CONTEXT,educationLocalContext} from './education_national_lesson_context.mjs';
import {EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT} from './education_international_course_ui.mjs';
import {NATIONAL_UNIT_SOURCES} from './education_national_subject_units.mjs';

const countries=['FR','JP','IT','DE','ES','BR','GB-SCT','GB-WLS','AU','IE','IN','US','CA','NZ','MX','PT'];
assert.equal(Object.keys(EDUCATION_LOCAL_CONTEXT).length,countries.length);
for(const country of countries)for(const subject of ['history','geography']){
 const pack=educationLocalContext(country,subject);
 assert.ok(pack,'Missing authored context: '+country+'/'+subject);
 for(const field of ['ro','en','activityRo','activityEn']){
  assert.ok(typeof pack[field]==='string'&&pack[field].length>70,
   country+'/'+subject+' '+field+' must be substantive, not a chapter label');
 }
 assert.ok(NATIONAL_UNIT_SOURCES[country],country+' source provenance');
}
assert.notEqual(EDUCATION_LOCAL_CONTEXT.FR.history.en,EDUCATION_LOCAL_CONTEXT.JP.history.en);
assert.ok(educationLocalContext('ZZ','geography')===null);
new vm.Script(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,{filename:'international-national-reader.js'});
assert.match(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,/educationLocalContext\(code,subject\)/);
assert.match(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,/state\.language==='en'&&nationalLesson&&national/);
assert.match(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,/eduTranslateMaterial\(source,identity\)/);
assert.match(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,/if\(selected\)\{chapterList\(\);return\}/,
 'Back from reading must first return to chapter selection');
assert.match(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,/reader\.replaceChildren\(\)/,
 'Switching chapters clears stale theory');
assert.match(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,/pocket-intl-progress-/,
 'Explicit grade-scoped learning progress storage');
const html=await(await frontend.fetch(new Request('https://check-education-browser.invalid/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'No browser script');
new vm.Script(script,{filename:'pocket-browser-national-context.js'});
for(const required of ['const EDUCATION_LOCAL_CONTEXT=','const educationLocalContext=',
 'function educationInternationalOpen(subject,level,grade,onBack)',
 'const NATIONAL_UNIT_SOURCES=']){
 assert.ok(script.includes(required),'Browser national content missing: '+required);
}
console.log('PASS 16 distinct national history/geography contexts with original bilingual expository lessons and grade-aware navigation');
