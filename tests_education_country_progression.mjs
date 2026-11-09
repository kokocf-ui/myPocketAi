import assert from 'node:assert/strict';
import {NATIONAL_PRIMARY_UNITS,NATIONAL_UNIT_SOURCES,nationalSubjectUnits} from './education_national_subject_units.mjs';
import {worldwideStudyChapters,worldwideSchoolYears} from './education_worldwide_paths.mjs';
import {HG_GENERAL_GRADE_LESSONS} from './education_general_paths.mjs';
import {EDUCATION_COUNTRY_UI_SCRIPT} from './education_country_ui.mjs';

const locallyGrounded=['FR','IT','JP','DE','ES','BR','GB-SCT','GB-WLS','AU','IE','IN','US','CA','NZ','MX','PT'];
for(const country of locallyGrounded){
 assert.ok(NATIONAL_UNIT_SOURCES[country],country+' needs provenance link');
 for(const subject of ['history','geography']){
  const primary=nationalSubjectUnits(country,subject,'beginner','P1');
  assert.ok(primary.length>=1,country+' '+subject+' primary-specific study');
  assert.ok(primary.every(x=>Array.isArray(x)&&x.length>=3&&x[0]&&x[1]&&x[2]),'Bilingual primary data must be complete');
  const years=worldwideSchoolYears(country,'beginner');
  const rows=worldwideStudyChapters(country,subject,'beginner',years[0].id,country,country,HG_GENERAL_GRADE_LESSONS);
  assert.ok(rows.length>=15,country+' '+subject+' age-appropriate topic coverage');
  assert.ok(rows[0][0].startsWith('national-'+country),country+' must start from local primary topics');
 }
}
for(const key of ['JP','FR','IN','AU','GB-SCT']){
 assert.ok(NATIONAL_PRIMARY_UNITS[key]?.mathematics?.length>0,key+' primary mathematics context');
}
assert.ok(!nationalSubjectUnits('JP','history','beginner','P1').some(x=>x[0].includes('Meiji')),
 'Do not show secondary Meiji topics to a primary beginner');
const jp1=nationalSubjectUnits('JP','history','lower','J1').map(x=>x[0]);
const jp2=nationalSubjectUnits('JP','history','lower','J2').map(x=>x[0]);
assert.notDeepEqual(jp1,jp2,'Different years should not use identical national topic sequence');
assert.equal(nationalSubjectUnits('ZZ','history','beginner','P1').length,0,
 'Unresearched countries must not invent locally verified facts');
const start=EDUCATION_COUNTRY_UI_SCRIPT.indexOf('function eduYearOptions(');
const stop=EDUCATION_COUNTRY_UI_SCRIPT.indexOf('function educationGradeGate(',start);
assert.ok(start>=0&&stop>start,'Year selector extract available');
const select=new Function('EDUCATION_SCHOOL_YEARS_DATA','worldwideSchoolYears','scienceJourney',
 EDUCATION_COUNTRY_UI_SCRIPT.slice(start,stop)+';return eduYearOptions;')({},worldwideSchoolYears,{subject:'physics'});
for(const country of ['JP','FR','ES','IT','IN','GB-SCT','AU']){
 const beginner=new Set(worldwideSchoolYears(country,'beginner').map(x=>x.id));
 const lower=new Set(worldwideSchoolYears(country,'lower').map(x=>x.id));
 for(const subject of ['math','science']){
  const combined=new Set(select(country,'beginner',subject).map(x=>x.id));
  assert.ok([...beginner].every(x=>combined.has(x)),country+' '+subject+' missing primary year');
  assert.ok([...lower].every(x=>combined.has(x)),country+' '+subject+' missing lower-secondary year');
 }
}
console.log('PASS national primary and secondary content: '+locallyGrounded.length+' country profiles, school-stage progressions');
