import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {SPAIN_MATH_YEARS,SPAIN_MATH_SOURCES,spainMathGradeProfile,spainMathOriginalEntries}
 from './math_spain_lomloe_2026.mjs';
import {mathCountryStudyYears,mathCountryGradeAreas} from './math_country_grade_areas.mjs';
import {mathCountryPhasePlan} from './math_country_year_alignment_2026.mjs';
import {mathCountryCourseEntries,mathInDepthMaterial} from './math_depth_courses.mjs';
import {educationCountrySchoolYears,educationSubjectSchoolPlan}
 from './education_all_country_subject_matrix.mjs';

const yrs=stage=>mathCountryStudyYears({country:'ES',stage,
 years:educationCountrySchoolYears('ES',stage).years});
const ids=stage=>yrs(stage).map(y=>y.id);
assert.deepEqual(ids('beginner'),['P1','P2','P3','P4','P5','P6'],
 'Spanish Primary is six years in three two-year cycles');
assert.deepEqual(ids('lower'),['ESO1','ESO2','ESO3','ESO4-A','ESO4-B'],
 'Fourth ESO has distinct Mathematics A and Mathematics B, not a common syllabus');
assert.deepEqual(ids('medium'),['B1-CYT','B1-HCS','B1-GEN','B2-CYT','B2-HCS'],
 'Bachillerato mathematics must match its 1º/2º modality');
assert.deepEqual(ids('advanced').length>=3,true);
assert.equal(new Set(SPAIN_MATH_YEARS.lower.map(x=>x.id)).size,5);
assert.equal(yrs('beginner')[0].cycle,'primer ciclo');
assert.equal(yrs('beginner')[5].cycle,'tercer ciclo');
assert.equal(yrs('lower')[4].es,'4º ESO · Matemáticas B');
assert.equal(yrs('medium')[0].es,'1º Bachillerato · Matemáticas I');
assert.equal(yrs('medium')[2].es,'1º Bachillerato · Matemáticas Generales');

for(const [stage,pairs] of [
 ['beginner',[['P1',[1]],['P6',[6]]]],
 ['lower',[['ESO1',[1]],['ESO4-A',[4]],['ESO4-B',[4]]]],
 ['medium',[['B1-CYT',[1,2]],['B1-HCS',[1,2]],['B1-GEN',[1,2]],
           ['B2-CYT',[3,4]],['B2-HCS',[3,4]]]]
]){
 for(const [grade,expected] of pairs){
  assert.deepEqual(mathCountryPhasePlan({country:'ES',stage,grade,years:yrs(stage)}).phases,
   expected,'Spanish national phase transition '+grade);
 }
}
assert.notDeepEqual(
 spainMathGradeProfile('ESO4-A').units.map(x=>x.es),
 spainMathGradeProfile('ESO4-B').units.map(x=>x.es),
 'Fourth ESO options must have distinct national subject branches');
assert.notDeepEqual(
 spainMathGradeProfile('B1-CYT').units.map(x=>x.es),
 spainMathGradeProfile('B1-HCS').units.map(x=>x.es),
 'Maths I is not the same course as Applied Social Sciences I');
assert.equal(spainMathGradeProfile('B1-GEN').cycle,'General');
assert.equal(spainMathGradeProfile('B2-GEN'),null,
 'Do not invent a national second-year compulsory Matemáticas Generales course');
assert.equal(educationSubjectSchoolPlan({
 country:'ES',stage:'lower',grade:'ESO4',subject:'mathematics'
}).status,'invalid-selection','Old undifferentiated 4 ESO must not remain selectable as maths');
assert.equal(educationSubjectSchoolPlan({
 country:'ES',stage:'medium',grade:'B1',subject:'mathematics'
}).status,'invalid-selection','Old generic first-year Bach maths must not remain selectable');
assert.ok(SPAIN_MATH_SOURCES.primary.includes('3296'));
assert.ok(SPAIN_MATH_SOURCES.lower.includes('4975'));
assert.ok(SPAIN_MATH_SOURCES.medium.includes('5521'));
assert.ok(SPAIN_MATH_SOURCES.regions.includes('curriculos-ccaa'));

let counted=0;
for(const stage of ['beginner','lower','medium']){
 const years=yrs(stage);
 for(const year of years){
  const grade=year.id,profile=spainMathGradeProfile(grade);
  const plan=mathCountryGradeAreas({country:'ES',stage,grade,years});
  const integrated=educationSubjectSchoolPlan({country:'ES',stage,grade,
    subject:'mathematics'});
  const {phase,phases}=mathCountryPhasePlan({country:'ES',stage,grade,years});
  const lessonStage=stage==='beginner'?'primary':stage==='medium'?'intermediate':stage;
  assert.equal(plan.status,'general-learning');
  assert.equal(integrated.status,'general-learning',
    'Reference to BOE does not mean certification of complete regional syllabus');
  assert.equal(plan.source,profile.source);
  assert.equal(integrated.source,profile.source);
  assert.ok(plan.note.includes('comunitatea autonomă'),
    'Community-specific syllabi must not be claimed as national');
  assert.ok(plan.units.length>=3,grade+' needs multiple real mathematics areas');
  assert.ok(plan.units.every(x=>x.es&&x.countryFrameworkSpecific&&!x.countrySpecific),
    'Spanish native area names with no false textbook certification');
  for(const unit of plan.units){
   const lessons=mathCountryCourseEntries({country:'ES',stage:lessonStage,
    grade,phase,phases,topic:unit.id});
   assert.equal(unit.lessonCount,lessons.length,'Displayed count mismatch '+grade+'/'+unit.id);
   assert.ok(lessons.length>=3,'No empty subject branch '+grade+'/'+unit.id);
   assert.ok(lessons.every(x=>x.statement&&x.worked&&x.practice&&x.answers));
   assert.ok(lessons.every(x=>mathInDepthMaterial(x).includes('Exemplu rezolvat')),
    'All card material is actually reachable');
   counted+=lessons.length;
  }
 }
}
for(const [grade,topic,word] of [
 ['P1','arithmetic','Contamos'],['P2','measurement','Medimos'],
 ['ESO4-A','algebra','Presupuesto'],['ESO4-B','algebra','Factorización'],
 ['B1-CYT','functions','Funciones'],['B1-HCS','statistics','Media'],
 ['B1-GEN','statistics','encuesta'],['B2-CYT','analysis','Derivada'],
 ['B2-HCS','algebra','Sistemas']
]){
 const cards=spainMathOriginalEntries({grade,topic});
 assert.equal(cards.length,1);
 assert.ok(cards[0].title.includes(word));
 assert.equal(cards[0].country,'ES');
 assert.equal(cards[0].curriculumCompletion,'partial-source-review');
 assert.ok(cards[0].source.includes('boe.es'));
}
const html=await(await frontend.fetch(new Request('https://spain-math.test/'))).text();
const script=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script);
new vm.Script(script);
assert.ok(script.includes("state.language==='es'&&o.es"),
 'Spanish UI uses native school-year names');
assert.ok(script.includes('4º ESO · Matemáticas A'));
assert.ok(script.includes('4º ESO · Matemáticas B'));
assert.ok(script.includes('1º Bachillerato · Matemáticas Generales'));
assert.ok(script.includes('EDU_MATH_GRADE_PHASES'));
console.log('PASS Spain 6+4+2 national maths, ESO A/B and Bach pathways, '+counted+' routed lesson cards, native year labels');
