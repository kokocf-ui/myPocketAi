import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {EDUCATION_COUNTRY_UI_SCRIPT} from './education_country_ui.mjs';
import {EDUCATION_SCHOOL_YEARS} from './education_school_paths.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {PHYSICS_TOPICS} from './physics_curriculum.mjs';

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
 scienceJourney:{subject:'physics'},
 educationCountrySelection:{code:'RO'},
 SCIENCE_GRADE_TOPIC_PLAN:scienceGradeTopicPlan,PHYSICS_TOPIC_DATA:PHYSICS_TOPICS
};
const fn=vm.runInNewContext(EDUCATION_COUNTRY_UI_SCRIPT.slice(first,last)+
 '\n'+script.slice(start,end)+'\n({years:scienceYearGroups,journey:scienceJourney,country:educationCountrySelection})',
 environment);
const groups=()=>Array.from(fn.years(),x=>({level:x.level,schoolStage:x.schoolStage,ids:Array.from(x.years,y=>String(y.id))}));
assert.deepEqual(groups().map(x=>x.schoolStage),['lower','upper','advanced'],
 'Physics is a separate Romanian subject starting at Grade VI, never primary');
assert.deepEqual(groups()[0].ids,['6','7','8'],'Romania lower Physics begins at grade 6');
assert.deepEqual(groups()[1].ids,['9','10','11','12'],'Romania Physics upper secondary years');
fn.journey.subject='chemistry';
assert.deepEqual(groups().map(x=>x.schoolStage),['primary','lower','upper','advanced'],
 'Other integrated primary science experiences remain available');
assert.deepEqual(groups()[0].ids,['1','2','3','4'],'Integrated primary science keeps Romanian class names');
assert.deepEqual(groups()[1].ids,['7','8'],'Romania Chemistry lower stage begins at grade 7');
fn.journey.subject='biology';
assert.deepEqual(groups()[1].ids,['5','6','7','8'],'Romania Biology lower stage begins at grade 5');
fn.journey.subject='astronomy';
assert.deepEqual(groups()[1].ids,['5','6','7','8'],'Astronomy advisory lower years explicitly labeled');
fn.country.code='GB-ENG';fn.journey.subject='physics';
const uk=groups();
assert.deepEqual(uk.map(x=>x.schoolStage),['lower','upper','advanced'],
 'England integrated primary science should not look like a standalone Physics course');
assert.ok(uk[0].ids.includes('Y7'),'England lower secondary uses country-specific Year numbering');
assert.ok(uk[1].ids.includes('Y10'),'England upper-secondary years are not Romanian grade numbers');
assert.ok(uk[2].ids.length===1,'university opens existing specialisations');
assert.equal(new Set(uk.flatMap(x=>x.ids)).size,uk.flatMap(x=>x.ids).length,'no duplicate years');
fn.country.code='AD';fn.journey.subject='physics';
const advisory=groups();
assert.deepEqual(advisory.map(x=>x.schoolStage),['lower','upper','advanced']);
assert.ok(advisory[0].ids.length>=1&&advisory[0].ids.every(id=>id.startsWith('general-lower-')),
 'With the test-only national catalogue unavailable, grade labels must be explicitly generic');
assert.ok(advisory[1].ids.length>=1&&advisory[1].ids.every(id=>id.startsWith('general-medium-')),
 'The test stub cannot certify Andorran national upper-secondary years');
assert.match(script,/scienceJourneyShowChoices\('years'\)/,'subject routes to school year selection');
assert.match(script,/stage==='years'\?learningLabel\('Alege clasa/,'year screen has clear title');
assert.match(html,/#view-module\.learning-science\.science-subject-stage\.active \.science-choice-list\{/,
 'Sciences subject cards use a dedicated grid');
assert.match(html,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)!important/,
 'science subject cards form two columns');
assert.match(html,/#view-module\.learning-choose\.active>#moduleContent>.education-grid\{/,
 'Education main cards are vertically centered in the viewport');
console.log('PASS science school years: Physics from lower secondary, other primary science unchanged, Romanian/English/Andorran stages');
