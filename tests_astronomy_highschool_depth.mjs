import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {ASTRONOMY_TOPICS,ASTRONOMY_LESSONS} from './astronomy_curriculum.mjs';
import {ASTRONOMY_UPPER_YEAR_METHODS,ASTRONOMY_UPPER_CHAPTERS,
 astronomyUpperSupplement} from './astronomy_upper_secondary.mjs';
import {astronomySchoolTopicLessons} from './astronomy_study_course.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {scienceSchoolLessonMaterial} from './science_school_lesson_material.mjs';
assert.equal(ASTRONOMY_UPPER_YEAR_METHODS.length,4);
assert.deepEqual([...Object.keys(ASTRONOMY_UPPER_CHAPTERS)].sort(),
 ASTRONOMY_TOPICS.filter(x=>!x.specialty).map(x=>x.id).sort());
for(const [id,chapter] of Object.entries(ASTRONOMY_UPPER_CHAPTERS)){
 assert.ok(chapter.title?.length>15);
 for(const field of ['theory','formulas','worked','questions','answers']){
  assert.equal(chapter[field]?.length,4,id+'/'+field);
  assert.equal(new Set(chapter[field]).size,4,id+'/'+field+' must progress over 4 years');
  assert.ok(chapter[field].every(x=>x.length>(field==='theory'||field==='worked'?90:field==='answers'||field==='formulas'?4:12)),
   id+'/'+field+' has shallow content');
 }
}
const html=await(await app.fetch(new Request('https://astronomy-lycee.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(script);
for(const marker of ['const astronomyUpperSupplement=','const ASTRONOMY_UPPER_CHAPTERS=',
 'const ASTRONOMY_UPPER_YEAR_METHODS='])assert.ok(script.includes(marker),marker);
let cards=0,chapters=0,schoolYears=0;
const yearsRO=educationCountrySchoolYears('RO','medium').years;
const counts=[];
for(const country of EDUCATION_EUROPE_COUNTRIES){
 const years=educationCountrySchoolYears(country,'medium').years;
 for(const [yearIndex,y] of years.entries()){
  const topics=scienceGradeTopicPlan({country,subject:'astronomy',stage:'upper',grade:y.id,
   years,topics:ASTRONOMY_TOPICS}).topics;
  assert.ok(topics.length>=5,country+' '+y.id+' needs complete topics');
  for(const topic of topics){
   const entries=astronomySchoolTopicLessons({country,stage:'upper',grade:y.id,years,
    topic:topic.id,lessons:ASTRONOMY_LESSONS});
   assert.ok(entries.length>=5,'Missing deeply researched course '+country+'/'+y.id+'/'+topic.id);
   const extra=entries.filter(x=>x.sourceId?.startsWith('astro-upper-'));
   assert.equal(extra.length,1,'Missing unique grade-specific in-depth course '+country+'/'+y.id+'/'+topic.id);
   const work=extra[0];
   assert.ok(work.statement.length>155&&work.workedExample.length>90&&work.exercise.length>20&&work.answer.length>3);
   assert.ok(work.formula&&work.method&&work.symbols);
   const body=scienceSchoolLessonMaterial({entry:work,subject:'astronomy',grade:y.id,
    chapter:topic.ro,language:'ro'});
   assert.ok(body.length>1000&&body.includes('Exemplu')&&body.includes(work.answer)===false,
    'School course must contain detailed worked example without automatically giving pupil answer');
   chapters++;cards+=entries.length;
  }
  if(country==='RO')counts.push([y.id,topics.length]);
  schoolYears++;
 }
}
assert.deepEqual(counts, [['9',5],['10',6],['11',6],['12',8]]);
assert.ok(schoolYears>160&&cards>4000&&chapters>900);
console.log('PASS upper-secondary Astronomy: '+schoolYears+' European school years, '+chapters+
 ' distinct chapters, '+cards+' linked study cards; RO classes 9–12: '+JSON.stringify(counts));
