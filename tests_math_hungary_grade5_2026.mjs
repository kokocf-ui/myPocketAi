import assert from 'node:assert/strict';
import {hungaryGrade5Lessons,HUNGARY_GRADE5_SOURCES} from './math_hungary_grade5_2026.mjs';
import {mathCountryCourseEntries,mathInDepthMaterial} from './math_depth_courses.mjs';
import {mathCountryStudyYears,mathCountryGradeAreas} from './math_country_grade_areas.mjs';
import {educationCountrySchoolYears,educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';

const years=mathCountryStudyYears({country:'HU',stage:'lower',
 years:educationCountrySchoolYears('HU','lower').years});
assert.ok(years.some(y=>String(y.id)==='5'));
const plan=mathCountryGradeAreas({country:'HU',stage:'lower',grade:'5',years});
const school=educationSubjectSchoolPlan({country:'HU',stage:'lower',grade:'5',subject:'mathematics'});
assert.equal(school.status,'general-learning');
assert.equal(plan.source,HUNGARY_GRADE5_SOURCES.curriculum);
assert.equal(plan.manualExample,HUNGARY_GRADE5_SOURCES.manual);
assert.deepEqual(plan.units.map(x=>x.id),['algebra','geometry','statistics']);
const expected={algebra:6,geometry:4,statistics:3};
const ids=[];
for(const unit of plan.units){
 const lessons=hungaryGrade5Lessons(unit.id);
 const app=mathCountryCourseEntries({country:'HU',stage:'lower',grade:'5',topic:unit.id});
 assert.equal(lessons.length,expected[unit.id]);
 assert.equal(unit.lessonCount,app.length);
 assert.deepEqual(app.slice(0,lessons.length).map(x=>x.id),lessons.map(x=>x.id));
 assert.ok(app.length>=lessons.length,'The existing 13 local lessons must not disappear when the full country route is added');
 for(const lesson of lessons){
  ids.push(lesson.id);
  assert.equal(lesson.grade,'5');
  assert.equal(lesson.country,'HU');
  assert.equal(lesson.topic,unit.id);
  assert.equal(lesson.sourceStatus,'nat2020-topic-reviewed');
  assert.equal(lesson.curriculumCompletion,'partial-source-review');
  assert.ok(lesson.statement.length>65&&lesson.worked.length>50);
  assert.ok(lesson.practice&&lesson.answers);
  assert.match(mathInDepthMaterial(lesson),/Exemplu rezolvat/);
 }
}
assert.equal(new Set(ids).size,13);
// Regression guard: another country or year still uses the existing course bank.
assert.ok(mathCountryCourseEntries({country:'HU',stage:'lower',grade:'6',phase:2,topic:'algebra'}).length>0);
assert.ok(mathCountryCourseEntries({country:'RO',stage:'lower',grade:'5',phase:1,topic:'algebra'}).length>0);
console.log('PASS Hungary grade 5: 13 new topic-specific lessons, routed and correctly marked partial');
