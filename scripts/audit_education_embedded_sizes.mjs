#!/usr/bin/env node
// Conservative size inventory of named inline data expressions, not a complete
// dependency graph or a measure of reviewed curriculum coverage.
import app from '../index.js';
import {gzipSync} from 'node:zlib';
const selected={
 'Matematică':['EDU_MATH_GRADE_AREAS','MATH_DEPTH_STAGES','RO678_MATH_LESSONS','RO5_MATH_LESSONS','ENGLAND_Y34_COURSES','PL_IV_2026_LESSONS','RO9_SCIENCE_2026_LESSONS','ENGLAND_KS4_LESSONS'],
 'Științe':['SCIENCE_RO_LESSON_EXTRAS','PHYSICS_LOWER_ENGLISH_LESSONS','BIOLOGY_UPPER_YEAR_BANK','PHYSICS_UNIVERSITY_STUDIES','PHYSICS_UPPER_CASES','PHYSICS_UPPER_CASES_EN','CHEMISTRY_SPECIALTY_LESSONS','ASTRONOMY_LESSON_DATA'],
 'Istorie și geografie':['HG_SCHOOL_PLANS_DATA','HG_THEME_DATA','HG_LOCAL_GUIDES_DATA','HG_SCHOOL_GENERAL_DATA'],
 'Literatură':['LIT_REFERENCE_CATALOG','LIT_QUICK_DICTIONARY','LIT_VERIFIED_AUTHORS','LIT_OFFLINE_THEORY_DATA','LIT_RO_GRADE_LESSONS','LIT_QUICK_GRAMMAR','LIT_UNIVERSITY_UNITS'],
 'Informatică':['COMPUTING_TOPICS_DATA'],
 'Limbi străine':['FOREIGN_TOPIC_EXAMPLE_DATA','FOREIGN_PHRASE_DATA'],
 'Examene':['EXAM_PRACTICE_DATA','EXAM_SPECS_DATA','EXAM_BIOLOGY_GUIDE','EXAM_GENERAL_STUDY_NOTES'],
 'Cursuri practice':['PRACTICAL_COURSES_DATA','PRACTICAL_GUIDES_DATA','PRACTICAL_DEPTH_DATA'],
 'Conținut comun și metadate':['EDUCATION_THEORY_DATA','EDU_MATH_COUNTRY_YEARS','EDUCATION_WORLDWIDE_SCHEMES']
};
const html=await(await app.fetch(new Request('https://inventory.local/'))).text();
console.log(`HTML: ${html.length} characters; ${Buffer.byteLength(html)} UTF-8 bytes; ${gzipSync(html).length} gzip bytes`);
console.log('Bytes below are individual serialized expressions; not total coverage and not additive across shared data.');
for(const [category,names] of Object.entries(selected)){
 console.log('\n'+category+':');
 for(const name of names){
  const token='const '+name+'=',start=html.indexOf(token);
  if(start<0){console.log('  '+name+' NOT FOUND');continue}
  const end=html.indexOf(';\n',start+token.length);
  if(end<0)throw Error('Cannot find end of '+name);
  console.log('  '+name+' '+Buffer.byteLength(html.slice(start+token.length,end))+' bytes');
 }
}
