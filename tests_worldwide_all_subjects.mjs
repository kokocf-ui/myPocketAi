import assert from 'node:assert/strict';
import {worldwideSchoolYears,worldwideStudyChapters,WORLDWIDE_GENERIC_SUBJECTS} from './education_worldwide_paths.mjs';
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
