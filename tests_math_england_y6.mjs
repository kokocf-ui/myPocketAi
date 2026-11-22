import assert from 'node:assert/strict';
import {ENGLAND_Y6_MATH_LESSONS,ENGLAND_Y6_MATH_SOURCE} from './math_england_y6_curriculum.mjs';
import {mathCountryCourseEntries,mathInDepthEntries,mathInDepthMaterial} from './math_depth_courses.mjs';
import {mathCountryGradeAreas} from './math_country_grade_areas.mjs';
import {educationCountrySchoolYears,educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';
const source=ENGLAND_Y6_MATH_LESSONS;
assert.equal(source.length,21,'Year 6 source-mapped supplementary lessons must exist');
assert.ok(ENGLAND_Y6_MATH_SOURCE.includes('gov.uk'),'Only official DfE year-six source can claim alignment');
assert.equal(new Set(source.map(l=>l.id)).size,source.length,'Unique stable lesson identifiers');
assert.equal(new Set(source.map(l=>l.title)).size,source.length,'No duplicate conceptual lesson names');
assert.equal(new Set(source.map(l=>l.statement)).size,source.length,'No repeated theoretical explanation');
assert.ok(source.every(l=>l.country==='GB-ENG'&&l.grade==='Y6'&&l.stage==='primary'),'English six-year grade context');
assert.ok(source.every(l=>l.sourceStatus==='official-topic-reviewed'),'Source review only, not national full-course completion');
assert.equal(new Set(source.map(l=>l.topic)).size,5,'Numbers, algebra, geometry, measurement and statistics must be available');
for(const entry of source){
 assert.ok(entry.enTitle.trim().length>=8,'English translation heading missing '+entry.id);
 assert.ok(entry.statement.length>=75,'Lesson explanation too brief '+entry.id);
 assert.ok(entry.worked.length>=75,'Worked example too brief '+entry.id);
 assert.ok(entry.practice.length>=15,'Independent task missing '+entry.id);
 assert.ok(entry.answers.length>0,'Verification answer missing '+entry.id);
 assert.ok(mathInDepthMaterial(entry).includes(entry.statement),'Theory reader must display authored text');
}
const topics=['arithmetic','algebra','geometry','measurement','statistics'];
for(const topic of topics){
 const sourceSubset=source.filter(l=>l.topic===topic);
 assert.ok(sourceSubset.length>=3,'Source incomplete for '+topic);
 const generics=mathInDepthEntries({stage:'primary',phase:6,topic});
 const actual=mathCountryCourseEntries({country:'GB-ENG',grade:'Y6',stage:'primary',phase:6,topic});
 assert.equal(actual.length,sourceSubset.length+generics.length,'Both source-reviewed and general lessons must be visible for '+topic);
}
for(const heading of [
 'Place value to ten million',
 'Letters and unknown numbers',
 'Unequal sharing using a ratio',
 'Nets of three-dimensional shapes',
 'Convert between miles and kilometres',
 'Interpret pie charts with fractions'
])assert.ok(source.some(l=>l.enTitle===heading),'DfE Year 6 gap: '+heading);
const years=educationCountrySchoolYears('GB-ENG','beginner').years;
assert.equal(years.length,6);
const plan=mathCountryGradeAreas({country:'GB-ENG',stage:'beginner',grade:'Y6',years});
assert.equal(plan.status,'general-learning','Source-matched extras are not curriculum-certified');
assert.equal(plan.units.length,5,'Year 6 algebra and measurement must not disappear behind three old cards');
assert.equal(plan.units.reduce((n,x)=>n+x.lessonCount,0),53,'Visible counts must match actual editor');
assert.ok(plan.units.some(u=>u.id==='algebra'&&u.lessonCount===6));
assert.ok(plan.units.some(u=>u.id==='measurement'&&u.lessonCount===3));
assert.ok(plan.units.some(u=>u.id==='arithmetic'&&u.lessonCount>=8),
 'Upper-primary review adds age-appropriate arithmetic chapters without dropping official Year 6 material');
assert.ok(plan.units.every(u=>u.curriculumCompletion==='partial-source-review'));
const education=educationSubjectSchoolPlan({country:'GB-ENG',stage:'beginner',grade:'Y6',subject:'mathematics'});
assert.equal(education.units.length,5);
assert.equal(education.units.reduce((n,x)=>n+x.lessonCount,0),53);
const ro=mathCountryCourseEntries({country:'RO',grade:'4',stage:'primary',phase:4,topic:'arithmetic'});
assert.ok(ro.every(l=>l.country!=='GB-ENG'),'English year-six source must not leak into Romanian curriculum');
console.log('PASS England Year 6 national-source supplementary mathematics:',source.length,
 'original lessons and',53,'visible lessons across five branches');
