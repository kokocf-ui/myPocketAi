import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears,educationSubjectSchoolPlan}
 from './education_all_country_subject_matrix.mjs';
import {mathCountryGradeAreas,mathCountryStudyYears} from './math_country_grade_areas.mjs';
import {mathCountryCourseEntries} from './math_depth_courses.mjs';
const html=await(await frontend.fetch(new Request('https://math-all-countries.test/'))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script,'Android frontend must contain inline JavaScript');
assert.doesNotThrow(()=>new vm.Script(script),'Android inline JavaScript must parse');
const bankText=script.split('const MATH_CHAPTER_BANK=')[1]?.split(';\n')[0];
assert.ok(bankText,'The existing mathematics lesson bank must be available');
const bank=JSON.parse(bankText);
assert.ok(script.includes('const EDU_MATH_COUNTRY_YEARS='));
assert.ok(script.includes('const EDU_MATH_GRADE_AREAS='));
let examined=0;
for(const country of EDUCATION_EUROPE_COUNTRIES){
 for(const stage of ['beginner','lower','medium','advanced']){
  const nativeYears=educationCountrySchoolYears(country,stage).years;
  const years=mathCountryStudyYears({country,stage,years:nativeYears});
  if(stage==='advanced'){
   const university=mathCountryStudyYears({country,stage,years});
   assert.ok(university.length>=3,'University maths must offer differentiated advisory years: '+country);
   assert.equal(new Set(university.map(x=>x.id)).size,university.length);
   assert.ok(university.every(x=>x.nationalYearVerified!==true),'Advisory university years must not masquerade as official');
   for(const grade of university){
    const course=educationSubjectSchoolPlan({country,stage,grade:grade.id,subject:'mathematics'});
    assert.ok(course.units.length>=3,'University year must have maths branches: '+country+' '+grade.id);
    assert.ok(course.units.every(x=>(bank[x.id]?.advanced||[]).length>0),'University branch has no chapters');
   }
  }
  for(const grade of years){
   const plan=educationSubjectSchoolPlan({country,stage,grade:grade.id,subject:'mathematics'});
   assert.equal(plan.status,'general-learning');
   assert.ok(plan.units.length>=3,country+' '+stage+' '+grade.id+' has usable named branches');
   assert.ok(plan.units.every(x=>x.ro&&x.en));
   assert.ok(plan.units.every(x=>x.lessonCount>=3),'No empty advertised mathematics lessons for '+country+' '+stage+' '+grade.id);
   const lessonStage=stage==='beginner'?'primary':stage==='medium'?'intermediate':stage;
   assert.ok(plan.units.every(x=>
    (bank[x.id]?.[lessonStage]||[]).length>0||
    mathCountryCourseEntries({country,stage:lessonStage,grade:grade.id,
      phase:0,topic:x.id}).length>0),
    country+' '+stage+' '+grade.id+' cannot contain a branch with no lessons');
   if(stage==='beginner')assert.ok(plan.units.some(x=>x.id==='arithmetic'),'Primary arithmetic');
   if(stage==='lower'){
    assert.ok(plan.units.some(x=>x.id==='algebra'),'Secondary algebra');
    assert.ok(!plan.units.some(x=>x.id==='arithmetic'),'No separate secondary arithmetic');
   }
   examined++;
  }
 }
}
assert.equal(mathCountryGradeAreas({country:'RO',stage:'lower',grade:'invalid',years:[]}).status,'invalid-selection');
console.log('PASS',examined,'math country/year paths');
