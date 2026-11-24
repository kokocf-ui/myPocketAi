import assert from 'node:assert/strict';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {LIT_EU_PROGRAMS,litEuropeanPlan} from './literature_curriculum_europe.mjs';
import {literatureClientGradeExpand} from './literature_europe_client_lazy.mjs';
import {literatureEuropeanAuthoredMaterial} from './literature_europe_authored_material.mjs';

// Match the serialized payload used in the actual Android/browser application.
const client=JSON.parse(JSON.stringify(LIT_EU_PROGRAMS));
let years=0,generated=0;
for(const country of EDUCATION_EUROPE_COUNTRIES){
 for(const stage of ['beginner','lower','medium']){
  for(const year of educationCountrySchoolYears(country,stage).years){
   const grade=String(year.id);
   const rows=literatureClientGradeExpand(client,{country,level:stage,grade});
   assert.ok(rows?.length,`${country}/${stage}/${grade} has no browser chapters`);
   const prefix=`eu-year-${country.toLowerCase()}-${stage}-`;
   for(const [id,title,focus] of rows.filter(row=>row[0].startsWith('eu-year-'))){
    assert.ok(id.startsWith(prefix),`wrong browser stage: ${country}/${stage}/${grade}: ${id}`);
    for(const language of ['ro','en']) for(const mode of ['lesson','examples','exercises','test']){
     const material=literatureEuropeanAuthoredMaterial({topicKey:id,title,focus,grade,language,mode});
     assert.ok(material?.text,`missing ${language}/${mode}: ${id}`);
    }
    generated++;
   }
   const server=litEuropeanPlan(country,stage,grade);
   for(const unit of server.units.filter(item=>item.id.startsWith('eu-year-'))){
    assert.ok(unit.id.startsWith(prefix),`wrong server stage: ${country}/${stage}/${grade}: ${unit.id}`);
   }
   years++;
  }
 }
}
// The older French metadata contradicts the current year picker. Switching
// stages must also replace previously generated rows, not leave stale ones.
for(const grade of ['6e','5e','4e','3e']){
 const rows=literatureClientGradeExpand(client,{country:'FR',grade,level:'lower'});
 assert.ok(rows.some(r=>r[0].startsWith('eu-year-fr-lower-')),grade);
 assert.ok(litEuropeanPlan('FR','lower',grade).units.some(r=>r.id.startsWith('eu-year-fr-lower-')),grade);
}
const profile={source:null,grades:{beginner:['same'],lower:['same']},byGrade:{same:[['national','Existing national row','Focus','genres']]}};
const selection={XX:profile};
for(const stage of ['beginner','lower','beginner']){
 const rows=literatureClientGradeExpand(selection,{country:'XX',grade:'same',level:stage});
 assert.ok(rows.some(r=>r[0]==='national'),'Existing national row must survive switching');
 assert.ok(rows.filter(r=>r[0].startsWith('eu-year-')).every(r=>r[0].startsWith(`eu-year-xx-${stage}-`)));
 assert.ok(rows.some(r=>r[0].startsWith(`eu-year-xx-${stage}-`)));
}
console.log(`PASS: ${years} school routes; ${generated} generated browser chapters keep the selected stage and provide RO/EN offline activities`);
