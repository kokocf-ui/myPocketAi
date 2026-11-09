import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {educationBibliographyFor,EDUCATION_BIBLIOGRAPHY_DATA} from './education_bibliography_catalog.mjs';
import {EUROPE_EDUCATION_COUNTRIES,EUROPE_EDUCATION_SOURCES,isEuropeanEducationCountry,EUROPE_ADVISORY_SCHOOL_SCHEMES} from './education_europe_catalog.mjs';
import {EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT} from './education_international_course_ui.mjs';
import {nationalSubjectUnits,NATIONAL_SUBJECT_UNITS} from './education_national_subject_units.mjs';
import {worldwideStudyChapters,WORLDWIDE_GENERIC_SUBJECTS} from './education_worldwide_paths.mjs';
import {HG_GENERAL_GRADE_LESSONS} from './education_general_paths.mjs';

new vm.Script(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,{filename:'education-international-ui.js'});
// European scope and explicit classification, with world records preserved.
assert.ok(EUROPE_EDUCATION_COUNTRIES.length>=53);
assert.equal(new Set(EUROPE_EDUCATION_COUNTRIES).size,EUROPE_EDUCATION_COUNTRIES.length);
for(const code of EUROPE_EDUCATION_COUNTRIES){
 assert.ok(isEuropeanEducationCountry(code),'Missing Europe code: '+code);
 assert.ok(EUROPE_EDUCATION_SOURCES[code]);
 assert.ok(EDUCATION_BIBLIOGRAPHY_DATA[code]?.some(r=>r.kind==='education-system-comparison'),
  'Missing Europe school-system reference: '+code);
}
for(const code of ['JP','BR','AU','CA']){
 assert.equal(isEuropeanEducationCountry(code),false);
 assert.ok(EDUCATION_BIBLIOGRAPHY_DATA[code]?.length>0,
  'Do not delete existing world-country sources: '+code);
}
for(const code of ['BG','HR','EE','FI','MD','MK','RS','SI']){
 assert.ok(EUROPE_ADVISORY_SCHOOL_SCHEMES[code],code+' requires an advisory grade path');
 assert.ok(educationBibliographyFor(code,'history','8').length>=2,code+' requires source references');
}
assert.match(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,/EDUCATION_EUROPE_CODES\.has\(code\)/);
assert.match(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,/Am consultat fișa/);
// Exercise the actual browser bibliography resolver, not only its source text.
const embeddedSources=JSON.parse(vm.runInNewContext(
 EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT+'\nJSON.stringify({'+
 "ro:educationBibliographyForRuntime('RO','history','8'),"+
 "en:educationBibliographyForRuntime('GB-ENG','mathematics','Y8'),"+
 "fr:educationBibliographyForRuntime('FR','literature','CP'),"+
 "md:educationBibliographyForRuntime('MD','history','7'),"+
 "jp:educationBibliographyForRuntime('JP','history','J2')"+
 '})'
));
assert.ok(embeddedSources.ro.some(r=>r.id==='ro-gymnasium-programmes'));
assert.ok(embeddedSources.en.some(r=>r.id==='eng-stat-mathematics'));
assert.ok(embeddedSources.fr.some(r=>r.kind==='subject-curriculum-reference'));
assert.ok(embeddedSources.md.some(r=>r.id==='europe-official-source-MD'));
assert.ok(!embeddedSources.jp.some(r=>r.id.startsWith('europe-')));

// Bibliographies are local and tied to the selected country/year/subject.
assert.ok(EDUCATION_BIBLIOGRAPHY_DATA.RO?.length>=4);
const ro8=educationBibliographyFor('RO','history','8');
assert.ok(ro8.some(r=>r.id==='ro-gymnasium-programmes'));
assert.ok(ro8.some(r=>r.id==='ro-approved-textbooks'));
assert.ok(!ro8.some(r=>r.id==='ro-2026-grade9'));
const ro9=educationBibliographyFor('RO','literature','9');
assert.ok(ro9.some(r=>r.id==='ro-2026-grade9'));
assert.ok(!educationBibliographyFor('RO','literature','10').some(r=>r.id==='ro-2026-grade9'));
const engMath=educationBibliographyFor('GB-ENG','mathematics','Y8');
assert.ok(engMath.some(r=>r.url.includes('mathematics-programmes')));
assert.ok(engMath.some(r=>r.id==='eng-oak-lessons'));
const engHistoryGCSE=educationBibliographyFor('GB-ENG','history','Y11');
assert.ok(!engHistoryGCSE.some(r=>r.kind==='curriculum-framework'),
 'Do not claim the KS1–3 history framework is a compulsory Y11 history specification');
assert.ok(educationBibliographyFor('JP','history','J2').some(r=>r.kind==='country-education-reference'));
assert.ok(educationBibliographyFor('FR','geography','CP').some(r=>r.kind==='country-education-reference'));
assert.ok(educationBibliographyFor('DE','mathematics','7').some(r=>r.kind==='country-education-reference'));
assert.deepEqual(educationBibliographyFor('ZZ','history','J2'),[]);
assert.deepEqual(educationBibliographyFor('RO','history','university'),[]);
assert.match(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,/educationBibliographyForRuntime/);
assert.match(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,/Biblioteca și sursele materiei/);
assert.match(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,/code!=='RO'&&code!=='GB-ENG'/);
assert.match(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,/Optional AI explanation/);
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
