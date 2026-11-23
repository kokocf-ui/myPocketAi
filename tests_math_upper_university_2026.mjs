import assert from 'node:assert/strict';
import {MATH_UPPER_2026_ADDITIONS} from './math_depth_upper_2026_additions.mjs';
import {MATH_UNIVERSITY_2026_ADDITIONS} from './math_depth_university_2026_additions.mjs';
import {MATH_DEPTH_STAGES,mathInDepthEntries,mathInDepthMaterial,mathCountryCourseEntries}
 from './math_depth_courses.mjs';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears,educationSubjectSchoolPlan}
 from './education_all_country_subject_matrix.mjs';
import {mathCountryStudyYears} from './math_country_grade_areas.mjs';

const banks=[['intermediate',MATH_UPPER_2026_ADDITIONS,[7,8,8,8]],
 ['advanced',MATH_UNIVERSITY_2026_ADDITIONS,[6,6,6,6]]];
let newChapters=0;
for(const [stage,source,perYear] of banks){
 assert.equal(source.length,4,'Four advisory stages expected for '+stage);
 const allTitles=new Set(),allExamples=new Set();
 for(const [i,phase] of source.entries()){
  const rows=Object.entries(phase).flatMap(([topic,items])=>{
   const live=mathInDepthEntries({stage,phase:i+1,topic});
   assert.ok(live.length>=items.length+2,'New authored lessons must join existing '+stage+' '+topic);
   for(const raw of items){
    assert.equal(raw.length,7,'Seven independently authored lesson fields are required');
    const [en,ro,statement,formula,worked,practice,answers]=raw;
    assert.ok(en.length>9&&ro.length>9&&statement.length>64&&formula.length>4,
     'Missing definition or formula: '+ro);
    assert.ok(worked.length>38&&practice.length>12&&answers.length>1,
     'Missing worked solution or independent exercise: '+ro);
    assert.ok(!allTitles.has(ro),'Same annual lesson title repeated: '+ro);
    assert.ok(!allExamples.has(worked),'Repeated worked solution: '+ro);
    allTitles.add(ro);allExamples.add(worked);
    const selected=live.find(x=>x.title===ro);
    assert.ok(selected,'New lesson is not reachable through app chapter list: '+ro);
    assert.equal(selected.sourceStatus,'general-learning');
    const formatted=mathInDepthMaterial(selected);
    assert.ok(formatted.includes('Exemplu rezolvat, pas cu pas')&&
      formatted.includes(worked)&&formatted.includes('Exersează singur')&&
      formatted.includes('Material orientativ'),
      'The selected chapter should show full offline educational theory, not a generic prompt: '+ro);
   }
   return items;
  });
  assert.equal(rows.length,perYear[i],'Upper levels require distinct authored material each year: '+stage+' '+(i+1));
  assert.ok(Object.keys(MATH_DEPTH_STAGES[stage][i]).length>=3,'University or high-school year has too few domains');
  newChapters+=rows.length;
 }
}
let actualCountryYears=0;
for(const country of EDUCATION_EUROPE_COUNTRIES){
 for(const stage of ['medium','advanced']){
  const years=mathCountryStudyYears({country,stage,years:educationCountrySchoolYears(country,stage).years});
  for(const year of years){
   const plan=educationSubjectSchoolPlan({country,stage,grade:year.id,subject:'mathematics'});
   assert.equal(plan.status,'general-learning','Do not claim official national approval from advisory lessons');
   assert.ok(plan.units.length>=3,'Every selected year needs several mathematical branches');
   assert.ok(plan.units.every(x=>x.lessonCount>=3),'No empty chapter branch');
   if(country==='RO'&&stage==='medium'&&String(year.id)==='9-SCI'){
    assert.ok(plan.units.every(x=>x.countrySpecific===true),
     'Romanian IX 2026 science-track must route its 35 original, source-unit-mapped chapters');
    assert.equal(plan.units.reduce((n,x)=>n+x.lessonCount,0),35);
   }else assert.ok(plan.units.every(x=>x.countrySpecific!==true),
    'The shared multi-country bank must not pretend to be a country-specific textbook');
   actualCountryYears++;
  }
 }
}
const romaniaUni=mathCountryStudyYears({country:'RO',stage:'advanced',
 years:educationCountrySchoolYears('RO','advanced').years});
assert.equal(romaniaUni.length,3,'Do not invent a fourth mandatory Romanian bachelor year');
assert.ok(actualCountryYears>=300);
console.log('PASS',newChapters,'new upper/university worked chapters across',actualCountryYears,
 'European high-school/university advisory years. Not official full-year approvals.');
