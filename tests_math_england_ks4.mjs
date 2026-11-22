import assert from 'node:assert/strict';
import {ENGLAND_KS4_TOPICS,ENGLISH_KS4_REFERENCE,englandKS4CardRows,englandKS4ExcludedTitles}
 from './math_england_ks4_curriculum.mjs';
import {mathCountryCourseEntries,mathInDepthMaterial} from './math_depth_courses.mjs';
import {mathCountryGradeAreas,mathCountryStudyYears} from './math_country_grade_areas.mjs';
import {educationCountrySchoolYears,educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';
const rows=[];
for(const grade of ['Y10','Y11']){
 const years=mathCountryStudyYears({country:'GB-ENG',stage:'medium',years:educationCountrySchoolYears('GB-ENG','medium').years});
 const plan=educationSubjectSchoolPlan({country:'GB-ENG',stage:'medium',grade,subject:'mathematics'});
 const areas=mathCountryGradeAreas({country:'GB-ENG',stage:'medium',grade,years});
 assert.equal(plan.status,'general-learning','KS4 should never claim approved individual school-year coverage');
 assert.ok(areas.note.includes('Year 10–11')&&areas.note.includes('orientativă'));
 assert.ok(areas.units.length>=4);
 assert.ok(areas.units.every(x=>x.curriculumCompletion==='partial-source-review'));
 for(const unit of areas.units){
  const yearLessons=mathCountryCourseEntries({country:'GB-ENG',stage:'intermediate',grade,topic:unit.id,phase:grade==='Y10'?1:2});
  assert.equal(unit.lessonCount,yearLessons.length,grade+'/'+unit.id+' lesson count must match selectable contents');
  assert.ok(yearLessons.length>=3);
  const titles=yearLessons.map(l=>l.title);
  assert.equal(new Set(titles).size,titles.length,'No duplicates within a GCSE branch');
  assert.ok(titles.every(t=>!englandKS4ExcludedTitles(grade).has(t)),'No A-level titles in GCSE course');
  for(const x of englandKS4CardRows(grade,unit.id)){
   assert.ok(titles.includes(x.title),'Every source reviewed GCSE lesson should appear');
   assert.equal(x.grade,grade);
   assert.equal(x.sourceStatus,'official-topic-reviewed');
   assert.ok(x.statement.length>64&&x.worked.length>38&&x.practice.length>=12);
   const reader=mathInDepthMaterial(x);
   assert.ok(reader.includes(x.formula)&&reader.includes(x.worked)&&reader.includes(x.answers));
   assert.ok(reader.includes('Distribuirea între Year 10 și Year 11 este orientativă'));
   rows.push(x);
  }
 }
}
assert.ok(rows.length>=25,'Substantial original GCSE lesson content, not a four-card placeholder');
assert.ok(ENGLAND_KS4_TOPICS.Y10.includes('algebra'));
assert.ok(ENGLAND_KS4_TOPICS.Y11.includes('geometry'));
assert.ok(ENGLISH_KS4_REFERENCE.ks4.startsWith('https://www.gov.uk/'));
assert.ok(!mathCountryCourseEntries({country:'GB-ENG',stage:'intermediate',grade:'Y10',topic:'algebra',phase:1})
 .some(l=>/Inducția matematică|Propoziții logice/.test(l.title)));
assert.ok(!mathCountryCourseEntries({country:'GB-ENG',stage:'intermediate',grade:'Y11',topic:'functions',phase:2})
 .some(l=>/logaritm/i.test(l.title)));
assert.ok(mathCountryCourseEntries({country:'GB-ENG',stage:'intermediate',grade:'Y11',topic:'functions',phase:2})
 .some(l=>l.title==='Funcția inversă'),'AQA GCSE Higher inverse functions must not be globally removed');
assert.ok(mathCountryCourseEntries({country:'GB-ENG',stage:'intermediate',grade:'Y11',topic:'geometry',phase:2})
 .some(l=>l.title==='Tangenta la un cerc'),'AQA GCSE Higher A16 circle tangent must not be globally removed');
console.log('PASS',rows.length,'original GCSE supplementary cards across Years 10-11; exact national annual certification NOT claimed');
