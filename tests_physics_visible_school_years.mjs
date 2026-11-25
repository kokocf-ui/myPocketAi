import assert from 'node:assert/strict';
import vm from 'node:vm';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {EDUCATION_SCHOOL_YEARS} from './education_school_paths.mjs';
import {worldwideSchoolYears} from './education_worldwide_paths.mjs';
import {EDUCATION_COUNTRY_UI_SCRIPT} from './education_country_ui.mjs';
import {PHYSICS_NOT_OFFERED_LOWER_YEARS,physicsCountryGradePlan} from './physics_europe_frameworks.mjs';

// Check the PRODUCTION country picker itself, not only the lesson-year matrix:
// each supported European education jurisdiction must remain selectable even
// when the global History/Geography country database is incomplete.
const s=EDUCATION_COUNTRY_UI_SCRIPT.indexOf('const EDU_EUROPE_COUNTRY_CODES=');
const e=EDUCATION_COUNTRY_UI_SCRIPT.indexOf('function eduCountryLabel(',s);
assert.ok(s>=0&&e>s,'Missing production Education country picker');
const options=vm.runInNewContext(EDUCATION_COUNTRY_UI_SCRIPT.slice(s,e)+
 '\neduCountryOptions()',{
 EDU_EUROPE_COUNTRY_LIST:EDUCATION_EUROPE_COUNTRIES,
 HG_COUNTRY_PICKER_DATA:[{id:'RO',ro:'România',en:'Romania'}],
 Intl
});
// Vatican City is deliberately removed from Education by user decision
// (no school system of its own); all other 49 jurisdictions stay selectable.
assert.equal(options.length,EDUCATION_EUROPE_COUNTRIES.length-1,'Education must not inherit missing jurisdictions from other modules');
assert.ok(!options.some(o=>o.id==='VA'),'Vatican City must not be offered in Education');
assert.equal(new Set(options.map(x=>x.id)).size,options.length);
assert.equal(options.find(x=>x.id==='XK')?.ro,'Kosovo',
 'Kosovo must be selectable as a school system even if absent from world-countries metadata');

const first=EDUCATION_COUNTRY_UI_SCRIPT.indexOf('function eduYearOptions(');
const last=EDUCATION_COUNTRY_UI_SCRIPT.indexOf('function educationGradeGate(',first);
assert.ok(first>=0&&last>first,'Android Physics picker source is present');
assert.ok(EDUCATION_COUNTRY_UI_SCRIPT.includes('const EDU_PHYSICS_ABSENT_YEAR_KEYS=new Set('),
 'Android must embed the same Physics gate as the curriculum registry');
const excluded=new Set(Object.entries(PHYSICS_NOT_OFFERED_LOWER_YEARS).flatMap(
 ([country,grades])=>grades.map(grade=>country+'|lower|'+grade)));
const unmapped=new Set(EDUCATION_EUROPE_COUNTRIES.flatMap(country=>
 ['beginner','lower','medium'].filter(stage=>
  educationCountrySchoolYears(country,stage).status==='grade-unmapped')
  .map(stage=>country+'|'+stage)));
const scope={EDU_PHYSICS_ABSENT_YEAR_KEYS:excluded,EDU_UNMAPPED_STAGE_KEYS:unmapped,
 EDUCATION_SCHOOL_YEARS_DATA:EDUCATION_SCHOOL_YEARS,worldwideSchoolYears,
 scienceJourney:{subject:'physics'}};
const select=vm.runInNewContext(EDUCATION_COUNTRY_UI_SCRIPT.slice(first,last)+
 '\n({years:eduYearOptions,journey:scienceJourney})',scope);
let countries=0,removed=0,retained=0;
for(const country of EDUCATION_EUROPE_COUNTRIES){
 for(const [stage,uiStage] of [['lower','lower'],['medium','intermediate']]){
  const catalogue=educationCountrySchoolYears(country,stage).years;
  const visible=Array.from(select.years(country,uiStage,'science'),x=>String(x.id));
  const ids=new Set(visible);
  assert.equal(ids.size,visible.length,'Duplicate year '+country+'/'+stage);
  for(const year of catalogue){
   const plan=physicsCountryGradePlan({country,stage:stage==='medium'?'upper':'lower',
    grade:year.id,years:catalogue});
   if(plan.status==='not-offered'){
    assert.ok(!ids.has(year.id),'Year with no Physics course is visible: '+country+'/'+year.id);
    removed++;
   }else{
    assert.ok(ids.has(year.id),'Existing Physics/integrated study must remain: '+country+'/'+year.id);
    retained++;
   }
  }
  select.journey.subject='biology';
  const biology=Array.from(select.years(country,uiStage,'science'),x=>String(x.id));
  assert.ok(biology.length>=visible.length,'Do not change other subjects: '+country+'/'+stage);
  select.journey.subject='physics';
 }
 countries++;
}
for(const [country,grade] of [['RO','5'],['MD','5'],['HU','5'],['HU','6'],
 ['PL','V'],['PL','VI'],['LV','7']]){
 const years=educationCountrySchoolYears(country,'lower').years;
 assert.ok(years.some(x=>x.id===grade),'Expected real year missing: '+country+'/'+grade);
 assert.equal(physicsCountryGradePlan({country,stage:'lower',grade,years}).status,'not-offered');
}
for(const [country,grade] of [['FR','6e'],['FR','5e'],['MD','6'],['HU','7'],['PL','VII'],['LV','8'],
 ['DK','7'],['FI','7'],['GB-ENG','Y7']]){
 const years=educationCountrySchoolYears(country,'lower').years;
 assert.notEqual(physicsCountryGradePlan({country,stage:'lower',grade,years}).status,'not-offered',
  'Do not hide real Physics/integrated studies: '+country+'/'+grade);
}
console.log('PASS Physics picker: '+countries+' systems, '+removed+' excluded years, '+retained+
 ' existing physics/integrated/advisory years retained; other sciences intact');
