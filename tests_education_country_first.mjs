import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {EDUCATION_SCHOOL_YEARS,HG_SCHOOL_PLANS,HG_SCHOOL_GENERAL,educationYears,hgSchoolChapters} from './education_school_paths.mjs';
import {EDUCATION_COUNTRY_UI_SCRIPT} from './education_country_ui.mjs';
import {PRACTICAL_UI_SCRIPT} from './practical_ui.mjs';
assert.ok(EDUCATION_SCHOOL_YEARS.RO.beginner.some(x=>x.id==='4'));
assert.ok(EDUCATION_SCHOOL_YEARS.RO.medium.some(x=>x.id==='8'));
assert.ok(EDUCATION_SCHOOL_YEARS.RO.medium.some(x=>x.id==='12'));
assert.ok(EDUCATION_SCHOOL_YEARS['GB-ENG'].beginner.some(x=>x.id==='Y1'));
assert.ok(EDUCATION_SCHOOL_YEARS['GB-ENG'].medium.some(x=>x.id==='Y11'));
assert.equal(educationYears('FR','beginner')[0].id,'general-beginner');
const ro4=hgSchoolChapters('RO','history','beginner','4');
const ro5=hgSchoolChapters('RO','history','medium','5');
const ro7=hgSchoolChapters('RO','history','medium','7');
const ro8=hgSchoolChapters('RO','history','medium','8');
assert.ok(ro4.chapters.length>=4&&ro5.chapters.length>=4&&ro7.chapters.length>=4&&ro8.chapters.length>=4);
assert.equal(ro5.status,'official-framework');
assert.equal(ro7.status,'official-framework');
assert.equal(ro8.status,'official-framework');
assert.equal(ro4.status,'general-learning');
const groups=[ro4,ro5,ro7,ro8].flatMap(x=>x.chapters);
assert.equal(new Set(groups.map(x=>x.id)).size,groups.length,'Each Romanian grade needs its own chapter IDs');
const en1=hgSchoolChapters('GB-ENG','history','beginner','Y1'),en8=hgSchoolChapters('GB-ENG','history','medium','Y8');
assert.equal(en1.status,'official-framework');assert.equal(en8.status,'official-framework');
assert.ok(en1.chapters.every(x=>!en8.chapters.some(y=>y.id===x.id)));
assert.equal(hgSchoolChapters('FR','history','medium','general-medium').status,'general-learning');
for(const [country,subjects] of Object.entries(HG_SCHOOL_PLANS))for(const [subject,grades] of Object.entries(subjects))for(const [grade,chapters] of Object.entries(grades)){
 assert.ok(chapters.length>=1,country+'/'+subject+'/'+grade+': no chapters');
 assert.ok(chapters.every(x=>x.length>=4&&x[3].length>45),country+'/'+subject+'/'+grade+': missing detail');
}
assert.ok(HG_SCHOOL_GENERAL.history.medium.length>=1);
assert.match(EDUCATION_COUNTRY_UI_SCRIPT,/function educationCountryGate\(moduleKey,proceed\)/);
assert.match(EDUCATION_COUNTRY_UI_SCRIPT,/if\(moduleKey==='languages'\)\{proceed\(\);return\}/);
assert.match(EDUCATION_COUNTRY_UI_SCRIPT,/function eduCountryApply\(moduleKey,code\)/);
assert.match(EDUCATION_COUNTRY_UI_SCRIPT,/function educationGradeGate\(moduleKey,level,proceed,back\)/);

// A level label must not silently expose unrelated grades from the shared catalogue.
const start=EDUCATION_COUNTRY_UI_SCRIPT.indexOf('function eduYearOptions(');
const end=EDUCATION_COUNTRY_UI_SCRIPT.indexOf('function educationGradeGate(',start);
assert.ok(start>=0&&end>start,'School-year routing must be available for isolated testing');
const yearsFunction=new Function('EDUCATION_SCHOOL_YEARS_DATA',
 'let scienceJourney={subject:"physics"};\n'+EDUCATION_COUNTRY_UI_SCRIPT.slice(start,end)+'\nreturn eduYearOptions;')(EDUCATION_SCHOOL_YEARS);
assert.deepEqual(yearsFunction('RO','intermediate','math').map(x=>x.id),['9','10','11','12'],
 'Romanian Maths intermediate must contain only high-school classes');
assert.deepEqual(yearsFunction('RO','beginner','math').map(x=>x.id),['1','2','3','4','5','6','7','8']);
assert.deepEqual(yearsFunction('GB-ENG','intermediate','math').map(x=>x.id),['Y10','Y11','Y12','Y13']);
assert.deepEqual(yearsFunction('RO','lower','history').map(x=>x.id),['5','6','7','8']);
assert.deepEqual(yearsFunction('RO','medium','computing').map(x=>x.id),['9','10','11','12']);

assert.match(EDUCATION_COUNTRY_UI_SCRIPT,/input\.addEventListener\('focus',\(\)=>\{input\.select\(\)\}\)/);
assert.match(EDUCATION_COUNTRY_UI_SCRIPT,/\.slice\(0,4\)/,'Only four visible country suggestions');
assert.match(EDUCATION_COUNTRY_UI_SCRIPT,/fetch\(url\.toString/,'Location-based suggestion');
assert.match(EDUCATION_COUNTRY_UI_SCRIPT,/touched\|\|educationCountrySelection\.requestId/,'Manual edits win over GPS');
assert.match(EDUCATION_COUNTRY_UI_SCRIPT,/pocket-edu-country-confirmed-v1/);
assert.doesNotMatch(PRACTICAL_UI_SCRIPT,/result\.cloneNode\(true\)/,'No duplicate visible quiz report');
assert.match(PRACTICAL_UI_SCRIPT,/practical-result/);
const response=await app.fetch(new Request('https://education-country-regression.test/'));
assert.equal(response.status,200);const html=await response.text(),boot=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(boot);new vm.Script(boot);
for(const token of [
"function openLearningSubject(key){",
"return educationCountryGate(key,()=>openLearningSubjectAfterCountry(key))",
"if(key==='languages')return openLearningSubjectAfterCountry(key)",
"if(key==='history'){hgOpen('subjects');return}",
"if(key==='literature'){litOpen('languages');return}",
"if(key==='exams'){examOpen('grades');return}",
"if(key==='practical'){practicalOpen('courses');return}",
"const HG_SCHOOL_PLANS_DATA=","const EDUCATION_SCHOOL_YEARS_DATA=",
"function scienceTopicAllowedGrade(topic)","function educationMathAllowed(topic)",
"function educationGradeGate(moduleKey,level,proceed,back)"
])assert.ok(boot.includes(token),'Missing new flow: '+token);
assert.ok(!boot.includes("if(key==='history'){hgRestore();hgOpen('subjects');return}"));
assert.ok(!boot.includes("if(key==='practical'){practicalJourney.country=state.language"));
assert.ok(!boot.includes("if(key==='exams'){examOpen('countries');return}"));
for(const route of ["educationGradeGate('math',entry.id","educationGradeGate('science',item.id","educationGradeGate('computing',c.id","educationGradeGate('history',opt.id"])assert.ok(boot.includes(route),route);
console.log('PASS country-first Education: country field, location suggestion, school-year isolation and non-duplicated quiz report');
