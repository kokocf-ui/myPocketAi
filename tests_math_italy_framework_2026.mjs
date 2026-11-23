import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {ITALY_MATH_YEARS,italyMathGradeProfile,italyMathFocalLessons}
 from './math_italy_framework_2026.mjs';
import {mathCountryStudyYears,mathCountryGradeAreas} from './math_country_grade_areas.mjs';
import {mathCountryCourseEntries} from './math_depth_courses.mjs';
import {mathCountryPhasePlan} from './math_country_year_alignment_2026.mjs';
import {educationCountrySchoolYears,educationSubjectSchoolPlan}
 from './education_all_country_subject_matrix.mjs';

const byStage=(stage,country='IT')=>mathCountryStudyYears({
 country,stage,years:educationCountrySchoolYears(country,stage).years
});
const Italy=['beginner','lower','medium'].flatMap(stage=>byStage(stage).map(y=>[stage,y]));
assert.deepEqual(byStage('beginner').map(y=>y.id),['P1','P2','P3','P4','P5']);
assert.deepEqual(byStage('lower').map(y=>y.id),['M1','M2','M3']);
assert.deepEqual(byStage('medium').map(y=>y.id),['S1','S2','S3','S4','S5']);
assert.equal(Italy.length,13,'Italian 5+3+5 structure, not RO 4+4+4 or GB 6+3+4');
assert.notDeepEqual(byStage('beginner').map(y=>y.id),byStage('beginner','GB-ENG').map(y=>y.id));
assert.ok(Italy.every(([,y])=>y.it&&y.nationalYearVerified===true&&!y.curriculumVerified));
assert.equal(byStage('medium')[0].it,'Primo biennio · 1º anno');
assert.equal(byStage('medium')[4].it,'Quinto anno · 5º anno');
assert.match(italyMathGradeProfile('P1').source,/gazzettaufficiale\.it/);
assert.match(italyMathGradeProfile('M1').source,/gazzettaufficiale\.it/);
for(const g of ['P2','P3','P4','P5','M2','M3']){
 const p=italyMathGradeProfile(g);
 assert.equal(p.cohort,'previous-first-cycle-cohort','Italian 2026 law is introduced gradually');
 assert.ok(!p.source.includes('2026/01/27'),'Other year groups are not on DM221 yet');
}
for(const g of ['S1','S2','S3','S4','S5']){
 const p=italyMathGradeProfile(g);
 assert.equal(p.cohort,'second-cycle-pathway-required');
 assert.ok(p.note.includes('Liceo scientifico'));
 assert.ok(p.note.includes('Istituti tecnici/professionali'));
}
let count=0;
for(const [stage,year] of Italy){
 const years=byStage(stage),g=year.id;
 const p=mathCountryGradeAreas({country:'IT',stage,grade:g,years});
 const plan=educationSubjectSchoolPlan({country:'IT',stage,grade:g,subject:'mathematics'});
 const {phase,phases}=mathCountryPhasePlan({country:'IT',stage,grade:g,years});
 const courseStage=stage==='beginner'?'primary':stage==='medium'?'intermediate':stage;
 assert.equal(p.status,'general-learning','Not a completed verified national textbook');
 assert.equal(plan.status,'general-learning','Do not advertise official lesson certification');
 assert.equal(p.source,italyMathGradeProfile(g).source);
 assert.equal(plan.source,p.source);
 assert.ok(p.units.length>=3,'Every Italian year has multiple national year areas '+g);
 assert.ok(p.units.every(x=>x.it&&x.ro&&x.en&&x.countryFrameworkSpecific&&!x.countrySpecific));
 assert.ok(p.units.every(x=>x.curriculumCompletion==='partial-source-review'));
 for(const u of p.units){
  const actual=mathCountryCourseEntries({
   country:'IT',stage:courseStage,grade:g,topic:u.id,phase,phases
  });
  assert.ok(actual.length>=3,'No empty maths branch for '+g+'/'+u.id);
  assert.equal(actual.length,u.lessonCount,'UI advertised count matches actual cards');
  assert.ok(actual.every(x=>x.statement&&x.worked&&x.practice&&x.answers));
  count+=actual.length;
 }
}
assert.ok(italyMathFocalLessons({grade:'P1',topic:'arithmetic'})[0].title.includes('Contiamo'));
assert.ok(italyMathFocalLessons({grade:'M1',topic:'geometry'})[0].title.includes('Segmenti'));
assert.ok(italyMathFocalLessons({grade:'S1',topic:'functions'})[0].title.includes('Relazioni'));
const html=await(await app.fetch(new Request('https://math-it-structure.test/'))).text();
const script=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Android HTML should contain its JavaScript');
new vm.Script(script);
assert.ok(script.includes('EDU_MATH_GRADE_AREAS'),'Android client has grade-specific Italian areas');
assert.ok(script.includes("state.language==='it'&&o.it"),'Native Italian labels are shown when Italian locale chosen');
assert.ok(script.includes('Classe prima · scuola primaria'),'Italian year names appear in rendered dataset');
assert.ok(script.includes('Geometria analitica'),'Grade topics contain native Italian names');
console.log('PASS Italy 5+3+5 maths per-country grades, 2026 cohort rules, '+count+' nonempty lesson cards, Android native grade labels');
