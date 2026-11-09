import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT} from './education_international_course_ui.mjs';
import {nationalSubjectUnits,NATIONAL_SUBJECT_UNITS} from './education_national_subject_units.mjs';
import {worldwideStudyChapters,WORLDWIDE_GENERIC_SUBJECTS} from './education_worldwide_paths.mjs';
import {HG_GENERAL_GRADE_LESSONS} from './education_general_paths.mjs';

new vm.Script(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,{filename:'education-international-ui.js'});
assert.match(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,/function educationInternationalOpen\(subject,level,grade,onBack\)/);
assert.match(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,/slice\(page,page\+4\)/);
assert.match(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,/root\.classList\.remove\('learning-intl-curriculum'\)/);
assert.match(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,/advisory|Advisory/i);
for(const country of ['FR','JP','DE','IT','ES','BR']){
 const own=nationalSubjectUnits(country,'history');
 assert.ok(own.length>=3,country+' requires own documented history');
 assert.ok(own.every(x=>x.length>=3),'Country lesson tuples must be populated');
 const chapters=worldwideStudyChapters(country,'history','lower','Y7',country,country,HG_GENERAL_GRADE_LESSONS);
 assert.ok(chapters[0][0].startsWith('national-'+country+'-history'),country+' history must begin with national units');
}
assert.notDeepEqual(NATIONAL_SUBJECT_UNITS.JP.history,NATIONAL_SUBJECT_UNITS.FR.history);
assert.ok(WORLDWIDE_GENERIC_SUBJECTS.mathematics.length>=10);

const response=await frontend.fetch(new Request('https://test-edu-world-runtime.invalid/'));
assert.equal(response.status,200);
const html=await response.text();
const browser=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(browser,'Generated browser bundle missing');
new vm.Script(browser,{filename:'pocket-international-browser.js'});
for(const mark of [
 'const WORLDWIDE_GENERIC_SUBJECTS=',
 'const WORLDWIDE_SUBJECT_ALIASES=',
 'const NATIONAL_SUBJECT_UNITS=',
 'const nationalSubjectUnits=',
 'function educationInternationalOpen(subject,level,grade,onBack)',
 "educationInternationalOpen('mathematics',mathJourney.level,mathJourney.grade",
 "educationInternationalOpen(scienceJourney.subject,scienceJourney.level,scienceJourney.grade",
 "educationInternationalOpen('computing',computingJourney.level,computingJourney.grade",
 'national-literature-'
])assert.ok(browser.includes(mark),'International bundle missing: '+mark);
console.log('PASS: national topic paths, browser serialization, international UI and Back navigation');
