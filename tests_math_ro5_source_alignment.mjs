import assert from 'node:assert/strict';
import {RO5_MATH_LESSONS,RO5_MATH_UNITS,RO5_MATH_SOURCES} from './math_ro5_curriculum.mjs';
import {mathCountryCourseEntries,mathInDepthEntries,mathInDepthMaterial} from './math_depth_courses.mjs';
import {mathCountryGradeAreas} from './math_country_grade_areas.mjs';
import {educationCountrySchoolYears,educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';
const courses=RO5_MATH_LESSONS;
const units=RO5_MATH_UNITS;
const subset=topic=>mathCountryCourseEntries({country:'RO',grade:'5',stage:'lower',phase:1,topic});
assert.ok(courses.length>=71,'Class V requires the sourced main lessons and seven validated curricular gap lessons');
assert.ok(units.length>=7,'The six official learning units plus data section must be identifiable');
assert.ok(subset('algebra').length>=42,'Numbers, fractions and arithmetic methods cannot be reduced to five chapters');
assert.ok(subset('geometry').length>=14,'Grade V needs distinct geometry, angles, area and volume lessons');
assert.ok(subset('statistics').length>=2,'Data handling must be taught');
assert.equal(courses.length,subset('algebra').length+subset('geometry').length+subset('statistics').length);
assert.ok(courses.some(x=>x.title==='Metoda falsei ipoteze'),'Missing a statutory arithmetic method');
assert.ok(courses.some(x=>x.title==='Reguli de calcul cu puteri'),'Missing natural-power rules');
assert.ok(courses.some(x=>x.title==='Scrierea numerelor în bazele 10 și 2'),'Missing base conversion');
assert.ok(courses.some(x=>x.title==='Măsurarea și construirea unghiurilor cu raportorul'),'Missing angle measurement');
for(const title of [
 'Aproximarea și estimarea numerelor naturale',
 'Criteriul de divizibilitate cu puterile lui 10',
 'Transformarea unei fracții zecimale periodice în fracție ordinară',
 'Probleme cu fracții și unități de măsură',
 'Planul și semiplanul determinate de o dreaptă',
 'Unghiuri congruente și construcția lor',
 'Capacitate, masă, timp și conversii în probleme'
])assert.ok(courses.some(x=>x.title===title),'Required statutory concept lacks a theory lesson: '+title);

assert.ok(!courses.some(x=>/^Ecuați/i.test(x.title)),'Equations begin in grade VI, not grade V (MEN 3393/2017, methodology p.32)');
assert.ok(!courses.some(x=>/sinus|derivat|matrice|trigonometrie|pătratică|inecuații/i.test(x.title)),'Do not mix upper-grade mathematics into class V');
assert.equal(new Set(courses.map(x=>x.id)).size,courses.length,'No repeated lesson ID');
assert.equal(new Set(courses.map(x=>x.title)).size,courses.length,'No repeated lesson title');
assert.equal(new Set(courses.map(x=>x.statement)).size,courses.length,'No repeated theoretical explanations');
assert.equal(new Set(courses.map(x=>x.worked)).size,courses.length,'No repeated worked examples');
assert.ok(Object.values(RO5_MATH_SOURCES).every(x=>x.startsWith('https://')),'Every source has a public verifiable address');
for(const [i,lesson] of courses.entries()){
 assert.ok(lesson.statement.length>75,lesson.title+' lacks explained concepts');
 assert.ok(lesson.formula.length>=6,lesson.title+' lacks mathematical representation');
 assert.ok(lesson.worked.length>70,lesson.title+' lacks a worked example');
 assert.ok(lesson.practice.length>12,lesson.title+' needs independent practice');
 assert.ok(lesson.answers.length>0,lesson.title+' needs verifiable answer');
 assert.ok(lesson.mistake.length>15,lesson.title+' needs a distinct common-error warning');
 assert.equal(lesson.sourceStatus,'curriculum-crosschecked');
 const material=mathInDepthMaterial(lesson);
 assert.ok(material.includes(lesson.statement));
 assert.ok(material.includes('Greșeală frecventă'));
 assert.ok(material.length>=500,'Theory page too shallow: '+lesson.title);
}
const years=educationCountrySchoolYears('RO','lower').years;
const plan=mathCountryGradeAreas({country:'RO',stage:'lower',grade:'5',years});
assert.equal(plan.status,'general-learning','Crosswalk must not claim national syllabus certification');
assert.equal(plan.units.reduce((n,u)=>n+u.lessonCount,0),courses.length,'Branch counters must match reader');
const school=educationSubjectSchoolPlan({country:'RO',stage:'lower',grade:'5',subject:'mathematics'});
assert.equal(school.units.reduce((n,u)=>n+u.lessonCount,0),courses.length,'Education integration should display actual content');
assert.ok(mathInDepthEntries({stage:'lower',phase:1,topic:'algebra'}).some(x=>x.title==='Ecuații cu o necunoscută'),
 'The generic lower-level advisory content must remain untouched for other countries');
assert.ok(!subset('algebra').some(x=>x.title==='Ecuații cu o necunoscută'),
 'Romanian year V must bypass generic sixth-year equations');
console.log('PASS Romania class V source-aligned mathematics:',courses.length,'distinct richly explained lessons in',units.length,'units');
