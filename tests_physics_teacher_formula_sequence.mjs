import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {SCIENCE_RO_LESSON_EXTRAS} from './science_ro_course_plan.mjs';
import {scienceSchoolLessonMaterial,scienceSchoolLessonAssessment} from './science_school_lesson_material.mjs';
import {PHYSICS_GRADE7_GUIDE_TITLES,physicsGrade7TeacherGuide} from './physics_grade7_teacher_guides.mjs';
import {PHYSICS_GRADE8_GUIDE_TITLES,physicsGrade8TeacherGuide} from './physics_grade8_teacher_guides.mjs';
import {PHYSICS_GRADE6_FORMULAS,physicsGrade6Formula} from './physics_grade6_formula_notes.mjs';
import {physicsGrade6TeacherNotes} from './physics_grade6_pedagogy.mjs';
const expected={'6':38,'7':33,'8':36},ids=new Set();
let checked=0,withFormula=0;
for(const grade of ['6','7','8']){
 const lessons=SCIENCE_RO_LESSON_EXTRAS.physics[grade];
 assert.equal(lessons.length,expected[grade],grade+' must keep original distinct Romanian Physics lessons');
 for(const entry of lessons){
  assert.ok(!ids.has(entry.id),'Duplicate '+entry.id);ids.add(entry.id);
  const g=grade==='7'?physicsGrade7TeacherGuide(entry.title):
   grade==='8'?physicsGrade8TeacherGuide(entry.title):null;
  if(grade!=='6')assert.ok(g,'Missing authored pedagogy for '+grade+' / '+entry.title);
  else assert.ok(physicsGrade6TeacherNotes(entry.title,'ro').length>210,
   'Grade VI teacher explanation missing '+entry.title);
  const body=scienceSchoolLessonMaterial({entry,subject:'physics',grade,chapter:entry.topic,language:'ro'});
  assert.ok(body.includes(entry.statement)&&body.includes('# Exercițiu pentru elev'));
  assert.ok(body.length>(grade==='6'?640:640),'Incomplete Physics teacher lesson '+grade+' / '+entry.title);
  if(g){
   assert.ok(body.includes(g.method)&&body.includes(g.worked)&&body.includes(g.check),
    'Each individual lesson must teach reasoning, a complete example and a check: '+entry.title);
   if(g.formula){
    withFormula++;
    const f=body.indexOf('# Formula de pornire');
    const s=body.indexOf('# Ce înseamnă simbolurile și unitățile');
    const worked=body.indexOf('# Exemplu rezolvat pas cu pas');
    assert.ok(f>=0&&s>f&&worked>s,'No numeric example before formula, units and assumptions: '+entry.title);
    assert.ok(body.includes(g.formula),'Show actual formula for '+entry.title);
   }else assert.ok(!body.includes('# Formula de pornire')||Boolean(entry.formula),
    'Do not invent formula in qualitative topics '+entry.title);
  }
  const assessment=scienceSchoolLessonAssessment({entry,subject:'physics',topic:entry.topic,language:'ro'});
  if(g?.formula)assert.ok(assessment.guide.includes(g.formula),
   'AI answer check must use same formula as lesson '+entry.title);
  checked++;
 }
}
assert.deepEqual(new Set(PHYSICS_GRADE7_GUIDE_TITLES),new Set(SCIENCE_RO_LESSON_EXTRAS.physics['7'].map(e=>e.title)));
assert.deepEqual(new Set(PHYSICS_GRADE8_GUIDE_TITLES),new Set(SCIENCE_RO_LESSON_EXTRAS.physics['8'].map(e=>e.title)));
assert.ok(withFormula>=39,'Expected formulas in the quantitative lessons, no artificial formula in descriptive lessons');
const inclined=SCIENCE_RO_LESSON_EXTRAS.physics['7'].find(x=>x.title==='Mișcarea pe plan înclinat');
const plane=scienceSchoolLessonMaterial({entry:inclined,subject:'physics',grade:'7',chapter:'Dinamica și forțe',language:'ro'});
assert.ok(plane.includes('F_∥ = G·h/l')&&plane.includes('Fricarea nu'), 'Grade VII must distinguish ideal plane from friction');
const gravity=SCIENCE_RO_LESSON_EXTRAS.physics['7'].find(x=>x.title==='Greutatea și câmpul gravitațional');
const weight=scienceSchoolLessonMaterial({entry:gravity,subject:'physics',grade:'7',chapter:'Dinamica și forțe',language:'ro'});
assert.ok(weight.includes('G = m · g')&&weight.includes('19,6 N')&&weight.indexOf('# Formula de pornire')<weight.indexOf('19,6 N'));
const grade6=Object.keys(PHYSICS_GRADE6_FORMULAS);
assert.ok(grade6.length>=10&&physicsGrade6Formula('Determinarea volumului').formula.includes('V ='));
const response=await frontend.fetch(new Request('https://pedagogy-f7.test/'));
const html=await response.text(),js=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(js);
assert.ok(js.includes('const PHYSICS_GRADE7_GUIDES=')&&js.includes('const PHYSICS_GRADE8_GUIDES='));
assert.ok(js.includes('const physicsGrade7TeacherGuide=')&&js.includes('const physicsGrade8TeacherGuide='));
console.log('PASS Physics pedagogy: '+checked+' Romanian lessons grades VI–VIII, '+withFormula+' quantitative guided formulas, formula-before-example, AI assessment aligned, WebView compiled');
