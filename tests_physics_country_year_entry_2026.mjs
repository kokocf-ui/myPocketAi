import assert from 'node:assert/strict';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {PHYSICS_TOPICS} from './physics_curriculum.mjs';
import {physicsCountryGradePlan,PHYSICS_NOT_OFFERED_LOWER_YEARS,PHYSICS_EUROPE_REFERENCES} from './physics_europe_frameworks.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';

// Cross-country school-entry evidence is not the same as a national textbook.
// Only dates/grades with a documented absent standalone subject are hidden.
const evidence={
 RO:{hidden:['5'],first:'6'},
 MD:{hidden:['5'],first:'6'},
 HU:{hidden:['5','6'],first:'7'},
 PL:{hidden:['V','VI'],first:'VII'},
 PT:{hidden:['5','6'],first:'7'},
 LV:{hidden:['7'],first:'8'},
 BG:{hidden:['5','6'],first:'7'},
 HR:{hidden:['5','6'],first:'7'},
 SI:{hidden:['7'],first:'8'},
 SK:{hidden:['5'],first:'6'},
 LT:{hidden:['5','6'],first:'7'},
 RS:{hidden:['5'],first:'6'},
 ME:{hidden:['6'],first:'7'},
 MK:{hidden:['6'],first:'7'},
 UA:{hidden:['5','6'],first:'7'},
 RU:{hidden:['5','6'],first:'7'},
 AL:{hidden:[],first:'6'}
};
let covered=0,excluded=0,eligible=0,sourceChecks=0;
for(const code of EDUCATION_EUROPE_COUNTRIES){
 const years=educationCountrySchoolYears(code,'lower').years;
 assert.ok(years.length>0,'No lower-secondary school-year selector: '+code);
 const actualHidden=PHYSICS_NOT_OFFERED_LOWER_YEARS[code]||[];
 assert.equal(new Set(actualHidden).size,actualHidden.length);
 for(const hiddenGrade of actualHidden){
  assert.ok(years.some(y=>String(y.id)===hiddenGrade),
   'Hidden grade not present in national picker: '+code+'/'+hiddenGrade);
 }
 const visible=years.filter(y=>!actualHidden.includes(String(y.id)));
 assert.ok(visible.length>0,'No physical-science study grade remaining in '+code);
 for(const year of years){
  const grade=String(year.id);
  const plan=physicsCountryGradePlan({country:code,stage:'lower',grade,years});
  const isAbsent=actualHidden.includes(grade);
  assert.equal(plan.status==='not-offered',isAbsent,code+'/'+grade+' subject gate mismatch');
  assert.equal(plan.subjectYearCount,visible.length,code+'/'+grade+' subject-year count mismatch');
  const expectedIndex=visible.findIndex(y=>String(y.id)===grade);
  assert.equal(plan.subjectYearIndex,expectedIndex,
   code+'/'+grade+' must progress from first offered Physics year');
  const contents=scienceGradeTopicPlan({
   country:code,subject:'physics',stage:'lower',grade,years,topics:PHYSICS_TOPICS
  });
  if(isAbsent){
   excluded++;
   assert.equal(plan.topics.length,0);
   assert.equal(contents.topics.length,0);
  }else{
   eligible++;
   assert.ok(plan.topics.length>=3,'Physics grade is empty or too shallow: '+code+'/'+grade);
   assert.deepEqual(contents.topics.map(t=>t.id),plan.topics,
    'Lesson topics must follow actual Physics year: '+code+'/'+grade);
  }
  covered++;
 }
 if(evidence[code]){
  assert.deepEqual([...actualHidden],evidence[code].hidden,code+' subject entry evidence changed');
  const first=physicsCountryGradePlan({
   country:code,stage:'lower',grade:evidence[code].first,years
  });
  assert.equal(first.subjectYearIndex,0,code+' introductory course must be first Physics year');
  assert.ok(first.topics.includes('units'),
   code+' first standalone Physics year must teach quantities and measurement');
  const source=PHYSICS_EUROPE_REFERENCES[code];
  assert.ok(source?.source?.startsWith('https://'));
  assert.notEqual(source?.scope,'education-structure');
  sourceChecks++;
 }
}
assert.equal(EDUCATION_EUROPE_COUNTRIES.length,50);
assert.equal(sourceChecks,Object.keys(evidence).length);
assert.ok(covered>=100&&excluded>=24&&eligible>=100);
for(const [code,grade] of [['FR','6e'],['GR','G1'],['DK','7'],['NO','8']]){
 const years=educationCountrySchoolYears(code,'lower').years;
 assert.notEqual(physicsCountryGradePlan({country:code,stage:'lower',grade,years}).status,'not-offered',
  'Do not erase nationally integrated or school-level physics: '+code+'/'+grade);
}
console.log('PASS Physics 50 systems: '+covered+' mapped lower years, '+excluded+
 ' documented no-standalone years, '+eligible+' course years, '+sourceChecks+' independently sourced entry frameworks');
