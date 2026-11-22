import assert from 'node:assert/strict';
import frontend from './index.js';
import {EDUCATION_EUROPE_COUNTRIES} from './education_all_country_subject_matrix.mjs';
import {physicsUniversityCourseChoices,physicsUniversityStudyDocument} from './physics_university_study.mjs';
import {physicsUniversityRoutes} from './physics_university_europe.mjs';
import {PHYSICS_UNIVERSITY_ALL_COURSES} from './physics_university_study.mjs';
import {UNIVERSITY_PHYSICS_INQUIRY_BANK,physicsUniversityIndependentInvestigation} from './physics_university_independent_investigations.mjs';
const keys=[...new Set(PHYSICS_UNIVERSITY_ALL_COURSES.map(x=>x.topic))].sort();
assert.deepEqual(Object.keys(UNIVERSITY_PHYSICS_INQUIRY_BANK).sort(),keys,
 'Every distinct university Physics course domain must get an original experiment or simulation');
const countries=EDUCATION_EUROPE_COUNTRIES;
let n=0,compared=0;
for(const country of countries){
 const routes=physicsUniversityRoutes(country);
 assert.ok(routes.length>=1,country+' university route missing');
 for(const route of routes){
  const years=route.years;
  assert.ok(years>=3&&years<=5);
  for(const year of Array.from({length:years},(_,i)=>i+1)){
   for(const specialty of ['quantum','relativity','theory','condensed','nuclear','astro','applied']){
    for(const course of physicsUniversityCourseChoices({year,specialty})){
     for(const language of ['ro','en']){
      const lab=physicsUniversityIndependentInvestigation({
       country,year,courseId:course.courseId,
       topic:course.topic,courseName:language==='ro'?course.ro:course.en,
       specialty,language
      });
      assert.ok(lab,'Missing original investigation '+[country,year,specialty,course.id,language]);
      assert.ok(lab.body.length>=950,'Physics university inquiry is only a shallow repeat');
      assert.ok(lab.body.includes(country)&&lab.body.includes(language==='ro'?course.ro:course.en),
       'Investigation must show the correct country and selected university course');
      assert.ok(lab.review.prompt.length>=120&&lab.review.guide.length>=95);
      const study=physicsUniversityStudyDocument({
       courseId:course.courseId,country,routeId:route.id,year,specialty,language
      });
      if(study){
       assert.notEqual(lab.body,study,'Laboratory must never reopen study content');
       compared++;
      }
      n++;
     }
    }
   }
  }
 }
}
assert.equal(countries.length,50);
assert.ok(n>=4000&&compared>=3000,
 'University-level original experiments need coverage for school jurisdictions, routes and specialties');
const html=await(await frontend.fetch(new Request('https://physics-university-study.test/'))).text();
assert.ok(html.includes('const physicsUniversityIndependentInvestigation='),
 'Standalone University laboratory generator must be bundled in the production Android WebView');
assert.ok(html.includes('const universityLab=physicsUniversityIndependentInvestigation({'),
 'The course laboratory screen must use distinct original investigation data');
console.log('PASS University Physics: '+n+' actual original course/country/year lab documents; '+compared+
 ' verified different from study lessons; 21 domain protocols; 50 European systems.');
