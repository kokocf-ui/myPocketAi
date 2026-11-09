import assert from 'node:assert/strict';
import {worldwideSchoolYears,worldwideStudyChapters,WORLDWIDE_GENERIC_SUBJECTS} from './education_worldwide_paths.mjs';
import {nationalSubjectUnits,NATIONAL_UNIT_SOURCES} from './education_national_subject_units.mjs';
import {HG_GENERAL_GRADE_LESSONS} from './education_general_paths.mjs';

const countries=['FR','DE','IT','ES','JP','IN','BR','NG','GB-SCT','UNMAPPED'];
const subjects=['history','geography',...Object.keys(WORLDWIDE_GENERIC_SUBJECTS)];
for(const country of countries)for(const level of ['beginner','lower','medium','advanced']){
 const grades=worldwideSchoolYears(country,level);
 assert.ok(grades.length>0,country+' '+level+' should select a year');
 for(const grade of [grades[0],grades.at(-1)]){
  for(const subject of subjects){
   const entries=worldwideStudyChapters(country,subject,level,grade.id,country,country,HG_GENERAL_GRADE_LESSONS);
   assert.ok(entries.length>=15,country+' '+level+' '+grade.id+' '+subject+' has an advisory course');
   assert.equal(new Set(entries.map(row=>row[0])).size,entries.length,'Unique chapter IDs');
   assert.ok(entries.every(row=>row.length===4&&row.every(value=>typeof value==='string'&&value.length>0)),'Full bilingual topic rows');
   assert.ok(entries.every(row=>!row[3].includes('official mandated')),'No false official curriculum claims');
  }
 }
}
for(const alias of ['math','informatica','fizica','chimie','biologie','literatura','romanian']){
 assert.ok(worldwideStudyChapters('JP',alias,'lower','L2','Japonia','Japan',HG_GENERAL_GRADE_LESSONS).length>=15,alias+' resolved');
}
assert.equal(worldwideStudyChapters('JP','not-a-subject','lower','L2','Japonia','Japan',HG_GENERAL_GRADE_LESSONS).length,0,'Unknown subjects should not masquerade as verified lessons');
console.log('PASS: worldwide 12-subject advisory curriculum by country and school stage');

for(const country of ['FR','IT','JP','DE','ES','BR']){
 assert.ok(NATIONAL_UNIT_SOURCES[country],country+' requires provenance reference');
 for(const subject of ['history','geography','literature']){
  const own=nationalSubjectUnits(country,subject);
  assert.ok(own.length>0,country+'/'+subject+' should include nationally distinctive units');
  const result=worldwideStudyChapters(country,subject,'lower',worldwideSchoolYears(country,'lower')[0].id,country,country,HG_GENERAL_GRADE_LESSONS);
  assert.ok(result.some(x=>x[0].startsWith('national-'+country+'-'+subject)),country+'/'+subject+' local units must lead');
 }
}
assert.notDeepEqual(nationalSubjectUnits('FR','history').map(x=>x[0]),nationalSubjectUnits('JP','history').map(x=>x[0]),'No copy/paste curricula across countries');
