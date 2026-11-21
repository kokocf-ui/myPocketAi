import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {EDUCATION_COUNTRY_UI_SCRIPT} from './education_country_ui.mjs';
import {EDUCATION_SCHOOL_YEARS} from './education_school_paths.mjs';
import {physicsUniversityYears} from './physics_university_europe.mjs';

const html=await(await app.fetch(new Request('https://science-year-layout.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'frontend script exists');new vm.Script(script);
const start=script.indexOf('function scienceYearGroups(');
const end=script.indexOf('function scienceJourneyShowChoices(',start);
assert.ok(start>=0&&end>start,'science groups extracted for deterministic checks');
const first=EDUCATION_COUNTRY_UI_SCRIPT.indexOf('function eduYearOptions(');
const last=EDUCATION_COUNTRY_UI_SCRIPT.indexOf('function educationGradeGate(',first);
assert.ok(first>=0&&last>first,'country-aware school years available');
const environment={
 EDUCATION_SCHOOL_YEARS_DATA:EDUCATION_SCHOOL_YEARS,
 worldwideSchoolYears:()=>[],
 scienceJourney:{subject:'physics',universityRoute:null},
 physicsUniversityYears,
 educationCountrySelection:{code:'RO'}
};
const fn=vm.runInNewContext(EDUCATION_COUNTRY_UI_SCRIPT.slice(first,last)+
 '\n'+script.slice(start,end)+'\n({years:scienceYearGroups,journey:scienceJourney,country:educationCountrySelection})',
 environment);
const groups=()=>Array.from(fn.years(),x=>({level:x.level,schoolStage:x.schoolStage,ids:Array.from(x.years,y=>String(y.id))}));
assert.deepEqual(groups().map(x=>x.schoolStage),['lower','upper','advanced'],'Standalone Physics has no primary classes');
assert.deepEqual(groups()[0].ids,['6','7','8'],'Romania lower Physics begins at grade 6');
assert.deepEqual(groups()[1].ids,['9','10','11','12'],'Romania Physics upper secondary years');
assert.deepEqual(groups()[2].ids,['univ-1','univ-2','univ-3'],'Romanian Physics example BSc has three years');
fn.journey.subject='chemistry';
assert.deepEqual(groups()[0].ids,['7','8'],'Romania Chemistry lower stage begins at grade 7');
assert.ok(groups().every(x=>x.schoolStage!=='primary'),'Chemistry cannot show grades 1–6 in Romania');
fn.journey.subject='biology';
assert.deepEqual(groups()[1].ids,['5','6','7','8'],'Romania Biology lower stage begins at grade 5');
fn.journey.subject='astronomy';
assert.deepEqual(groups()[1].ids,['5','6','7','8'],'Astronomy advisory lower years explicitly labeled');
fn.country.code='GB-ENG';fn.journey.subject='physics';
const uk=groups();
assert.ok(uk.every(x=>x.schoolStage!=='primary'),'England primary integrated science is not a standalone Physics year');
assert.ok(uk[0].ids.includes('Y7'),'England lower secondary uses country-specific Year numbering');
assert.ok(uk[1].ids.includes('Y10'),'England upper-secondary years are not Romanian grade numbers');
assert.deepEqual(uk[2].ids,['univ-1','univ-2','univ-3'],'England example BSc has three actual academic years');
assert.equal(new Set(uk.flatMap(x=>x.ids)).size,uk.flatMap(x=>x.ids).length,'no duplicate years');
fn.country.code='AD';fn.journey.subject='physics';
const advisory=groups();
assert.deepEqual(advisory.slice(0,2).map(x=>x.ids.length),[4,4],
 'Unmapped country has advisory secondary progression, not primary standalone Physics');
assert.ok(advisory[0].ids.every(id=>id.startsWith('general-lower-')));
assert.ok(advisory[1].ids.every(id=>id.startsWith('general-medium-')));
assert.match(script,/scienceJourneyShowChoices\('years'\)/,'subject routes to school year selection');
assert.match(script,/stage==='years'\?learningLabel\('Alege clasa/,'year screen has clear title');
assert.match(html,/#view-module\.learning-science\.science-subject-stage\.active \.science-choice-list\{/,
 'Sciences subject cards use a dedicated grid');
assert.match(html,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)!important/,
 'science subject cards form two columns');
assert.match(html,/#view-module\.learning-choose\.active>#moduleContent>.education-grid\{/,
 'Education main cards are vertically centered in the viewport');
console.log('PASS science school years: subject-specific bands, no standalone primary Physics/Chemistry, correct Romanian and England years');
