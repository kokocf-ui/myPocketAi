import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {RO9_SCIENCE_2026_UNITS,RO9_SCIENCE_2026_LESSONS,
 RO9_SCIENCE_2026_PATHS,RO9_SCIENCE_2026_SOURCES,
 ro9Science2026Lessons} from './math_ro9_science_2026.mjs';
import {mathCountryStudyYears,mathCountryGradeAreas} from './math_country_grade_areas.mjs';
import {mathCountryCourseEntries,mathInDepthMaterial} from './math_depth_courses.mjs';
import {educationCountrySchoolYears,educationSubjectSchoolPlan}
 from './education_all_country_subject_matrix.mjs';
import {mathCurriculumReadiness} from './math_curriculum_readiness.mjs';

assert.equal(RO9_SCIENCE_2026_UNITS.length,7,'2026 science-track textbook has seven published units');
assert.deepEqual(RO9_SCIENCE_2026_UNITS.map(x=>x.title),[
 'Mulțimea numerelor reale',
 'Elemente de logică matematică',
 'Polinoame cu coeficienți reali',
 'Progresii aritmetice și geometrice',
 'Geometrie analitică',
 'Funcții și citirea graficelor',
 'Elemente de trigonometrie și aplicații în geometrie'
]);
assert.equal(RO9_SCIENCE_2026_LESSONS.length,35);
assert.equal(new Set(RO9_SCIENCE_2026_LESSONS.map(x=>x.id)).size,35);
for(const unit of RO9_SCIENCE_2026_UNITS){
 assert.equal(RO9_SCIENCE_2026_LESSONS.filter(x=>x.unitId===unit.id).length,5,
  'Each source-reviewed unit must have original worked lessons, not an empty shell');
}
for(const row of RO9_SCIENCE_2026_LESSONS){
 assert.ok(row.title.length>=12,row.id+' missing lesson title');
 for(const key of ['statement','formula','worked','practice','answers']){
  assert.ok(String(row[key]).trim().length>=1,row.id+' missing '+key);
 }
 assert.ok(row.statement.length>=75,'Too-short authored explanation: '+row.id);
 assert.equal(row.country,'RO');
 assert.equal(row.grade,'9');
 assert.equal(row.sourceStatus,'official-unit-and-publisher-toc-reviewed');
 assert.ok(row.source.includes('edu.ro'));
 assert.ok(mathInDepthMaterial(row).includes(row.worked));
 assert.ok(mathInDepthMaterial(row).includes('Exersează singur'));
}
const years=mathCountryStudyYears({country:'RO',stage:'medium',
 years:educationCountrySchoolYears('RO','medium').years});
const plan=mathCountryGradeAreas({country:'RO',stage:'medium',grade:'9',years});
assert.equal(plan.status,'general-learning','Individual approved textbooks cannot certify every track');
assert.equal(plan.schoolTrack,'științe-ale-naturii-TC-CS');
assert.equal(plan.source,RO9_SCIENCE_2026_SOURCES.syllabus);
assert.equal(plan.manualExample,RO9_SCIENCE_2026_SOURCES.manual);
assert.deepEqual(plan.textbookUnits.map(x=>x.id),RO9_SCIENCE_2026_UNITS.map(x=>x.id));
assert.equal(plan.units.length,4);
assert.deepEqual(new Set(plan.units.map(x=>x.id)),
 new Set(['algebra','geometry','functions','trigonometry']));
assert.equal(plan.units.reduce((n,x)=>n+x.lessonCount,0),35,
 'Do not report generic mathematics cards as all original 2026 units');
for(const unit of plan.units){
 assert.equal(unit.countrySpecific,true);
 assert.equal(unit.curriculumCompletion,'source-unit-reviewed-not-full-year-certified');
 const entries=mathCountryCourseEntries({country:'RO',stage:'intermediate',grade:'9',
  topic:unit.id,phase:1,phases:[1]});
 assert.equal(entries.length,unit.lessonCount);
 assert.deepEqual(entries,ro9Science2026Lessons(unit.id));
}
const school=educationSubjectSchoolPlan({
 country:'RO',stage:'medium',grade:'9',subject:'mathematics'});
assert.equal(school.units.reduce((n,x)=>n+x.lessonCount,0),35);
assert.equal(school.verifiedManual,false);
assert.ok(school.notes.some(x=>x.includes('științe')||x.includes('Științe')));
for(const other of ['10','11','12']){
 const p=mathCountryGradeAreas({country:'RO',stage:'medium',grade:other,years});
 assert.ok(!p.textbookUnits,'No 2026 science-track curriculum retroactively assigned to grade '+other);
 assert.ok(p.units.some(x=>x.countrySpecific===false));
}
const audit=mathCurriculumReadiness().rows.find(x=>x.country==='RO'&&x.stage==='medium'&&x.grade==='9');
assert.ok(audit);
assert.equal(audit.scope,'source-unit-reviewed-track-specific');
assert.equal(audit.lessonCount,35);
assert.equal(audit.complete,false,'No fiction of a certified full-year accepted curriculum');
const html=await (await frontend.fetch(new Request('https://math-ro9-grade.test/'))).text();
const inline=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline);
new vm.Script(inline);
const raw=inline.split('const EDU_MATH_GRADE_AREAS=')[1]?.split(';\n')[0];
assert.ok(raw);
const android=JSON.parse(raw);
assert.deepEqual(android['RO|medium|9'].map(x=>x.id),
 ['algebra','geometry','functions','trigonometry']);
assert.ok(inline.includes('Polinoame cu coeficienți reali'));
assert.ok(inline.includes('Teorema cosinusului și latura necunoscută'));
console.log('PASS Romania IX 2026/27 Science TC+CS: 35 original, seven textbook-unit mapped lessons with complete steps, exercises, sourced scope; Android embedding and preserved X–XII');
