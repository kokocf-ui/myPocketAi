import assert from 'node:assert/strict';
import {PORTUGAL_MATH_2026,PORTUGAL_MATH_2026_SOURCE,portugalMath2026Lessons}
 from './math_portugal_2026.mjs';
import {mathCountryCourseEntries,mathInDepthMaterial} from './math_depth_courses.mjs';
import {mathCountryStudyYears,mathCountryGradeAreas} from './math_country_grade_areas.mjs';
import {mathCountryPhasePlan} from './math_country_year_alignment_2026.mjs';
import {educationCountrySchoolYears,educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';

const years=(country,stage)=>mathCountryStudyYears({
 country,stage,years:educationCountrySchoolYears(country,stage).years
});
const phase=(country,stage,grade)=>mathCountryPhasePlan({
 country,stage,grade,years:years(country,stage)
});

const official='https://www.dge.mec.pt/sites/default/files/Curriculo/Aprendizagens_Essenciais/2_ciclo/';
for(const grade of ['5','6']){
 const source=PORTUGAL_MATH_2026_SOURCE[grade];
 assert.equal(source,official+grade+'_matematica_18julho_rev.pdf',
  'Link only the enacted DGE programme, not the March 2026 public consultation draft');
 const stage='lower',country='PT';
 const plan=educationSubjectSchoolPlan({country,stage,grade,subject:'mathematics'});
 const yearPlan=mathCountryGradeAreas({country,stage,grade,years:years(country,stage)});
 assert.equal(plan.status,'general-learning','Never certify a full textbook from original topic cards');
 assert.equal(yearPlan.source,source);
 assert.equal(plan.source,source);
 assert.match(plan.notes.join(' '),/iulie 2018/i);
 assert.match(plan.notes.join(' '),/necertificate/i);
 assert.deepEqual(yearPlan.units.map(unit=>unit.id),
  ['algebra','functions','statistics','geometry']);
 let total=0;
 for(const unit of yearPlan.units){
  const cards=portugalMath2026Lessons({grade,topic:unit.id});
  const routed=mathCountryCourseEntries({country,stage,grade,phase:grade==='5'?1:2,topic:unit.id});
  assert.equal(cards.length,routed.length,'Same graded cards reached by application path');
  assert.deepEqual(cards.map(x=>x.id),routed.map(x=>x.id));
  assert.equal(unit.lessonCount,cards.length);
  assert.ok(cards.length>=4,'At least four distinct lessons per branch');
  assert.ok(cards.every(x=>x.country==='PT'&&x.grade===grade&&x.source===source));
  assert.ok(cards.every(x=>x.statement.length>65&&x.worked.length>45&&x.practice&&x.answers));
  assert.ok(cards.every(x=>x.curriculumCompletion==='partial-source-review'));
  assert.ok(cards.every(x=>mathInDepthMaterial(x).includes('Exemplu rezolvat')));
  assert.equal(new Set(cards.map(x=>x.title)).size,cards.length,'No repeated lesson title');
  total+=cards.length;
 }
 assert.ok(total>=20,'Year '+grade+' has too few topics for a useful beginning');
 console.log('PT '+grade+': '+total+' original grade-specific cards across four branches');
}
assert.ok(PORTUGAL_MATH_2026['5'].functions.some(x=>x[0]==='Prioritatea operațiilor'));
assert.ok(PORTUGAL_MATH_2026['6'].functions.some(x=>x[0]==='Proporționalitate directă'));
assert.ok(PORTUGAL_MATH_2026['5'].statistics.some(x=>x[0]==='Moda și amplitudinea datelor'));
assert.ok(PORTUGAL_MATH_2026['6'].statistics.some(x=>x[0]==='Grafice circulare'));
assert.ok(!PORTUGAL_MATH_2026['5'].statistics.some(x=>x[0]==='Probabilitate estimată prin frecvență'));

for(const [country,stage,grade,expected] of [
 ['NL','beginner','G3',1],['NL','beginner','G8',6],
 ['IE','beginner','1C',1],['IE','beginner','6C',6],
 ['PL','lower','IV',1],['PL','lower','V',2],['PL','lower','VIII',4],
 ['PT','lower','5',1],['PT','lower','6',2],['PT','lower','9',4],
 ['RO','lower','8',4],['GB-ENG','beginner','Y6',6]
]){
 const p=phase(country,stage,grade);
 assert.equal(p.phase,expected,country+'/'+grade+' must have its own age-appropriate phase');
}
assert.equal(mathCountryCourseEntries({country:'RO',stage:'lower',grade:'5',topic:'algebra'}).length>0,true);
assert.equal(mathCountryCourseEntries({country:'GB-ENG',stage:'primary',grade:'Y6',topic:'algebra'}).length>0,true);
console.log('PASS Portuguese 5th/6th original lessons, official sources, course routing and European year alignment');
