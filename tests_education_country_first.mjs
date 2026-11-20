import assert from 'node:assert/strict';
import './tests_education_all_country_subject_matrix.mjs';
import vm from 'node:vm';
import app from './index.js';
import {EDUCATION_SCHOOL_YEARS,HG_SCHOOL_PLANS,HG_SCHOOL_GENERAL,educationYears,hgSchoolChapters} from './education_school_paths.mjs';
import {EDUCATION_COUNTRY_UI_SCRIPT} from './education_country_ui.mjs';
import {PRACTICAL_UI_SCRIPT} from './practical_ui.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {PHYSICS_TOPICS} from './physics_curriculum.mjs';
import {CHEMISTRY_TOPICS} from './chemistry_curriculum.mjs';
import {BIOLOGY_TOPICS} from './biology_curriculum.mjs';
import {ASTRONOMY_TOPICS} from './astronomy_curriculum.mjs';
assert.ok(EDUCATION_SCHOOL_YEARS.RO.beginner.some(x=>x.id==='4'));
assert.ok(EDUCATION_SCHOOL_YEARS.RO.lower.some(x=>x.id==='8'));
assert.deepEqual(EDUCATION_SCHOOL_YEARS.RO.medium.map(x=>x.id),['9','10','11','12']);
assert.ok(EDUCATION_SCHOOL_YEARS['GB-ENG'].beginner.some(x=>x.id==='Y1'));
assert.deepEqual(EDUCATION_SCHOOL_YEARS['GB-ENG'].lower.map(x=>x.id),['Y7','Y8','Y9']);
assert.deepEqual(EDUCATION_SCHOOL_YEARS['GB-ENG'].medium.map(x=>x.id),['Y10','Y11','Y12','Y13']);
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
assert.deepEqual(yearsFunction('RO','primary','math').map(x=>x.id),['1','2','3','4'],'Primary maths ends at class IV');
assert.ok(EDUCATION_COUNTRY_UI_SCRIPT.includes("!arithmeticGradesOnly&&search.value.trim().length<=40"),'Arithmetic must not accept manually typed higher grades');
assert.deepEqual(yearsFunction('RO','lower','math').map(x=>x.id),['5','6','7','8'],'Lower-secondary maths begins at class V');
assert.deepEqual(yearsFunction('GB-ENG','primary','math').map(x=>x.id),['Y1','Y2','Y3','Y4','Y5','Y6']);
assert.deepEqual(yearsFunction('GB-ENG','lower','math').map(x=>x.id),['Y7','Y8','Y9']);
assert.deepEqual(yearsFunction('GB-ENG','intermediate','math').map(x=>x.id),['Y10','Y11','Y12','Y13']);
assert.deepEqual(yearsFunction('RO','lower','history').map(x=>x.id),['5','6','7','8']);
assert.deepEqual(yearsFunction('RO','medium','computing').map(x=>x.id),['9','10','11','12']);

assert.match(EDUCATION_COUNTRY_UI_SCRIPT,/input\.addEventListener\('focus',\(\)=>\{input\.select\(\)\}\)/);
assert.match(EDUCATION_COUNTRY_UI_SCRIPT,/\.slice\(0,4\)/,'Only four visible country suggestions');
assert.match(EDUCATION_COUNTRY_UI_SCRIPT,/fetch\(url\.toString/,'Location-based suggestion');
assert.match(EDUCATION_COUNTRY_UI_SCRIPT,/touched\|\|automaticChosen\|\|educationCountrySelection\.requestId/,'Manual edits and first country suggestion win over late GPS');
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
"hgOpen('subjects');return;",
"if(key==='literature'){","litJourney.country=incoming",
"if(key==='exams'){examOpen('grades');return}",
"if(key==='practical'){practicalOpen('courses');return}",
"const HG_SCHOOL_PLANS_DATA=","const EDUCATION_SCHOOL_YEARS_DATA=",
"function scienceTopicAllowedGrade(topic)","function educationMathAllowed(topic)",
"function educationGradeGate(moduleKey,level,proceed,back)"
])assert.ok(boot.includes(token),'Missing new flow: '+token);
assert.ok(!boot.includes("if(key==='history'){hgRestore();hgOpen('subjects');return}"));
assert.ok(!boot.includes("if(key==='practical'){practicalJourney.country=state.language"));
assert.ok(!boot.includes("if(key==='exams'){examOpen('countries');return}"));
for(const route of ["educationGradeGate('math',entry.id","function scienceYearGroups()","scienceJourneyShowChoices('years')","function hgYearGroups()", "hgOpen('years')","educationGradeGate('computing',c.id","educationGradeGate('history',opt.id"])assert.ok(boot.includes(route),route);

// Science fallback cannot expose university and high-school-only subjects at beginner level.
const beginScience=boot.indexOf('function scienceTopicAllowedGrade(topic)');
const endScience=boot.indexOf('function scienceTopicChoices()',beginScience);
assert.ok(beginScience>=0&&endScience>beginScience,'Science grade router in web app');
const scienceFunction=boot.slice(beginScience,endScience);
const topics={physics:PHYSICS_TOPICS,chemistry:CHEMISTRY_TOPICS,
 biology:BIOLOGY_TOPICS,astronomy:ASTRONOMY_TOPICS};
const years=(country,level)=>{
 if(level==='intermediate')return country==='GB-ENG'
  ?['Y10','Y11','Y12','Y13'].map(id=>({id}))
  :country==='RO'?['9','10','11','12'].map(id=>({id}))
  :[{id:'general-medium'}];
 if(level==='primary')return country==='RO'
  ?['1','2','3','4'].map(id=>({id})): [{id:'general-primary'}];
 return country==='RO'?['5','6','7','8'].map(id=>({id})):
  country==='GB-ENG'?['Y7','Y8','Y9'].map(id=>({id})):
  [{id:'general-lower'}];
};
const probe=(country,level,grade,subject,topic,stage)=>
 new Function('educationCountrySelection','scienceJourney','topic',
 'eduYearOptions','SCIENCE_GRADE_TOPIC_PLAN',
 'PHYSICS_TOPIC_DATA','CHEMISTRY_TOPIC_DATA','BIOLOGY_TOPIC_DATA','ASTRONOMY_TOPIC_DATA',
 scienceFunction+';return scienceTopicAllowedGrade(topic);')(
 {code:country},{level,grade,subject,schoolStage:stage|| (level==='intermediate'?'upper':'lower')},
 topic,years,scienceGradeTopicPlan,PHYSICS_TOPICS,CHEMISTRY_TOPICS,BIOLOGY_TOPICS,ASTRONOMY_TOPICS);
assert.equal(probe('FR','beginner','general-lower','physics',{id:'modern',minLevel:'intermediate'}),false);
assert.equal(probe('FR','beginner','general-lower','astronomy',{id:'cosmology',minLevel:'intermediate'}),false);
assert.equal(probe('FR','intermediate','general-medium','chemistry',{id:'organic',minLevel:'intermediate'}),false,
 'Early upper-secondary science must not dump all intermediate topics at once');
assert.equal(probe('GB-ENG','intermediate','Y12','chemistry',{id:'organic',minLevel:'intermediate'}),true,
 'Later upper-secondary chemistry introduces organic concepts');
assert.equal(probe('RO','beginner','8','physics',{id:'electric',minLevel:'beginner'}),true,
 'Romanian grade VIII retains circuits and electricity in the age-appropriate track');
assert.equal(probe('RO','beginner','7','chemistry',{id:'organic',minLevel:'intermediate'}),false);
assert.equal(probe('RO','intermediate','9','physics',{id:'special-quantum',minLevel:'advanced'}),false);
console.log('PASS country-first Education: country field, location suggestion, school-year isolation and non-duplicated quiz report');
