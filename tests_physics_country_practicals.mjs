import assert from 'node:assert/strict';
import frontend from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {PHYSICS_TOPICS} from './physics_curriculum.mjs';
import {THEORY_ENTRIES} from './education_theory.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {scienceSchoolTopicLessons} from './science_ro_course_plan.mjs';
import {PHYSICS_PRACTICAL_PROTOCOLS,physicsLaboratoryYearInvestigations} from './physics_europe_practicals.mjs';

const supported=new Set(Object.keys(PHYSICS_PRACTICAL_PROTOCOLS));
const expected=new Set(PHYSICS_TOPICS.map(x=>x.id));
assert.deepEqual([...supported].sort(),[...expected].sort(),'No school Physics subject may use a generic lab fallback');
let yearChecks=0,labChecks=0,courseChecks=0;
for(const code of EDUCATION_EUROPE_COUNTRIES){
 for(const [stage,schoolStage] of [['primary','beginner'],['lower','lower'],['upper','medium']]){
  const years=educationCountrySchoolYears(code,schoolStage).years;
  for(const [index,year] of years.entries()){
   const chapters=scienceGradeTopicPlan({
    country:code,stage,grade:year.id,years,subject:'physics',topics:PHYSICS_TOPICS
   }).topics;
   if(!chapters.length)continue;
   yearChecks++;
   for(const chapter of chapters){
    for(const language of ['ro','en']){
     const entries=scienceSchoolTopicLessons({
      country:code,subject:'physics',stage,grade:year.id,topic:chapter.id,
      years,language,lessons:THEORY_ENTRIES
     });
     assert.ok(entries.length>=1,code+'/'+stage+'/'+year.id+'/'+chapter.id+' no authored study concepts');
     const labs=physicsLaboratoryYearInvestigations({
      country:code,grade:year.id,stage,topic:chapter.id,yearPosition:index,
      language,lessons:entries
     });
     assert.equal(labs.length,2,'Every topic needs two distinct inquiry protocols');
     assert.equal(new Set(labs.map(x=>x.title)).size,2);
     assert.equal(new Set(labs.map(x=>x.review.prompt)).size,2);
     assert.ok(labs.every(x=>x.body.includes(x.lesson)&&x.body.includes(String(year.id))));
     assert.ok(labs.every(x=>x.body.length>=500&&x.body.includes(entries[0].topic?chapter.id:'')===false||x.body.length>=500));
     assert.ok(labs.every(x=>x.review.prompt.length>=65&&x.review.guide.length>=50));
     assert.ok(labs.every(x=>x.source==='original-physics-year-lab'));
     if(stage==='primary')assert.ok(labs.every(x=>!x.body.includes('Q=mcΔT')),'No advanced equation leaked into primary practical');
     labChecks+=2;
    }
    courseChecks++;
   }
  }
 }
}
assert.equal(EDUCATION_EUROPE_COUNTRIES.length,50);
assert.ok(yearChecks>=500&&courseChecks>=1500&&labChecks>=6000,
 'Insufficient cross-country original practical coverage');
const html=await(await frontend.fetch(new Request('https://physics-school-practicals.test/'))).text();
assert.ok(html.includes('const PHYSICS_PRACTICAL_PROTOCOLS=')&&
 html.includes('const physicsLaboratoryYearInvestigations=')&&
 html.includes('const investigations=physicsLaboratoryYearInvestigations({'),
 'Year-sensitive lab protocols are not connected to the actual Android WebView');
console.log('PASS Physics lab coverage: '+yearChecks+' country-year routes, '+courseChecks+
 ' topic-year combinations, '+labChecks+' bilingual original practicals, Android hookup present');
