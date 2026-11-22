import assert from 'node:assert/strict';
import {RO678_MATH_LESSONS,ro678TopicLessons,ro678GradeSummary,RO678_MATH_SOURCES}
 from './math_ro678_curriculum.mjs';
import {mathCountryCourseEntries,mathInDepthMaterial} from './math_depth_courses.mjs';
import {educationCountrySchoolYears,educationSubjectSchoolPlan}
 from './education_all_country_subject_matrix.mjs';
import {mathCountryGradeAreas} from './math_country_grade_areas.mjs';

const MIN={'6':36,'7':32,'8':43},expectedUnits={'6':8,'7':7,'8':9};
const forbidden={
 '6':/Teorema lui Thales|sinus|derivat|sferă.*volum/i,
 '7':/Teorema celor trei perpendiculare|matrice|trunchiul de con/i,
 '8':/Teorema lui Thales|Congruența triunghiurilor: LUL/i
};
for(const [grade,min] of Object.entries(MIN)){
 const arr=RO678_MATH_LESSONS[grade]||[];
 assert.ok(arr.length>=min,'Romanian grade '+grade+' must not be a small generic list: '+arr.length);
 assert.equal(new Set(arr.map(x=>x.id)).size,arr.length,'Duplicate lesson identifiers');
 assert.equal(new Set(arr.map(x=>x.title)).size,arr.length,'Duplicate lesson titles in year '+grade);
 assert.equal(new Set(arr.map(x=>x.statement)).size,arr.length,'Repeated theoretical explanation in year '+grade);
 assert.ok(ro678GradeSummary(grade).length>=expectedUnits[grade],'Insufficient independent curricular units');
 assert.ok(arr.every(x=>!forbidden[grade].test(x.title)),'Topics mixed into the wrong year '+grade);
 const topics=new Set(arr.map(x=>x.topic));
 for(const topic of topics){
  const selected=mathCountryCourseEntries({country:'RO',stage:'lower',grade,phase:Number(grade)-4,topic});
  assert.equal(selected.length,ro678TopicLessons(grade,topic).length);
  assert.ok(selected.length>=3,'Unfinished branch '+grade+' '+topic);
 }
 for(const entry of arr){
  assert.equal(entry.country,'RO');assert.equal(entry.grade,grade);
  assert.equal(entry.stage,'lower');assert.ok(entry.sourceStatus==='programme-reviewed');
  assert.ok(entry.title.length>=12,'No descriptive title: '+entry.id);
  assert.ok(entry.statement.length>=65,'Too brief theory: '+entry.id);
  assert.ok(entry.worked.length>=65,'Missing worked explanation: '+entry.id);
  assert.ok(entry.practice.length>=12,'Missing practice: '+entry.id);
  assert.ok(entry.answers.length>=1,'Missing verified answer: '+entry.id);
  assert.ok(entry.formula.length>=4,'No mathematics representation: '+entry.id);
  assert.ok(mathInDepthMaterial(entry).includes(entry.statement));
  assert.ok(mathInDepthMaterial(entry).includes(entry.worked));
 }
 const years=educationCountrySchoolYears('RO','lower').years;
 const plan=mathCountryGradeAreas({country:'RO',stage:'lower',grade,years});
 assert.equal(plan.status,'general-learning','Do not falsely claim officially approved annual contents');
 assert.ok(plan.units.every(x=>x.countrySpecific));
 assert.equal(plan.units.reduce((n,x)=>n+x.lessonCount,0),arr.length,'The actual Android picker must show every lesson');
 const edu=educationSubjectSchoolPlan({country:'RO',stage:'lower',grade,subject:'mathematics'});
 assert.equal(edu.units.reduce((n,x)=>n+x.lessonCount,0),arr.length,'Education inventory must mirror Android');
}
for(const concept of [
 ['6','algebra','Șiruri de rapoarte egale'],
 ['6','geometry','Congruența triunghiurilor: LUL, ULU, LLL'],
 ['7','geometry','Teorema lui Thales în triunghi'],
 ['7','geometry','Teorema lui Pitagora și reciproca'],
 ['8','algebra','Fracții algebrice: domeniu și simplificare'],
 ['8','geometry','Teorema celor trei perpendiculare'],
 ['8','functions','Graficul unei funcții liniare']
])assert.ok(ro678TopicLessons(concept[0],concept[1]).some(x=>x.title===concept[2]),
  'Missing source-reviewed concept '+concept.join('/'));
assert.ok(RO678_MATH_SOURCES.programme.startsWith('https://www.edu.ro/'));
console.log('PASS Romania source-aligned Mathematics VI–VIII:',
 Object.entries(RO678_MATH_LESSONS).map(([grade,rows])=>grade+': '+rows.length+' lessons').join(', '),
 '— 0 years falsely certified');
