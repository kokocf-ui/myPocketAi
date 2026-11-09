import assert from 'node:assert/strict';
import vm from 'node:vm';
import backend from './backend.js';
import {researchEducationCountryLesson,researchEducationCountryCourse,validateEducationLessonRequest,validateEducationCourseRequest} from './education_curriculum_research.mjs';
import {EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT} from './education_international_course_ui.mjs';
import frontend from './index.js';

const context={country:'JP',subject:'history',level:'lower',grade:'J2',topic:'Tokugawa shogunate and Edo period',language:'en'};
const courseContext={country:'JP',subject:'history',level:'lower',grade:'J2',language:'en'};
assert.equal(validateEducationLessonRequest(context).countryName,'Japan');
assert.equal(validateEducationCourseRequest(courseContext).grade,'J2');
assert.equal(validateEducationLessonRequest({...context,grade:'<script>'}),null);
assert.equal(validateEducationCourseRequest({...courseContext,country:'XX<'}),null);
assert.equal(validateEducationLessonRequest({...context,topic:'! unsafe'}),null);
assert.equal(validateEducationCourseRequest({...courseContext,subject:'unlisted subject'}),null);
const sourceData={results:[
 {title:'Japan Edo period school history Tokugawa curriculum',url:'https://www.mext.go.jp/en/education/example',
  highlights:['Tokugawa shogunate and Edo period 1603 to 1868. Japanese school history examines social and cultural transitions, political domains and everyday life.']},
 {title:'Japan history education Edo era source',url:'https://www.nichibun.ac.jp/en/education',
  highlights:['Japan Edo period history includes the Tokugawa shogunate, urban life and social organisations.']},
 {title:'Fake unrelated hit',url:'http://127.0.0.1/data',highlights:['Edo period']}]
};
let searches=0,models=0;
const fakeFetch=async(url,opts)=>{
 searches++;assert.equal(url,'https://api.exa.ai/search');
 assert.equal(opts.headers['x-api-key'],'test-key');
 const query=JSON.parse(opts.body).query;
 assert.match(query,/Japan/);assert.match(query,/J2/);
 return {ok:true,json:async()=>sourceData};
};
const chapterList=Array.from({length:10},(_,i)=>({title:'Japan history lesson '+(i+1),focus:'Japan historical source investigation and chronological interpretation for school-year J2, topic '+(i+1)+'.'}));
const model={AI:{run:async(_model,prompt)=>{
 models++;
 const p=prompt.messages.at(-1).content;
 assert.match(p,/Japan/);assert.match(p,/Evidence/);
 return {response:p.includes('{"chapters"')?JSON.stringify({chapters:chapterList}):JSON.stringify({
  introduction:'Japan Edo-period history includes the Tokugawa shogunate and a complex relationship of domains, towns, social relations and cultural traditions. A classroom study compares several kinds of evidence and looks at both continuity and change over time.',
  concepts:[
   'The Tokugawa shogunate governed Japan through a political structure combining the shogun and local domain authorities.',
   'Everyday urban life in Edo-period Japan changed with merchant activity, social institutions and cultural development.',
   'Historians compare documentary, visual and archaeological evidence rather than assuming that a single account tells the whole story.'
  ],
  workedExample:'Example: compare two dated Edo-period accounts describing a market. List each author, date and perspective, then explain which aspects of trade can be supported by both records.',
  questions:['How did the shogunate and domains share political authority?','What evidence helps historians understand Edo-period everyday life?'],
  answers:['The shogunate provided central authority while domains exercised local responsibilities.','Dated records, images and physical objects can be compared for corroboration and limitations.']
 })};
 }}};
const env={EXA_API_KEY:'test-key',...model};
const unconfigured=await researchEducationCountryCourse(courseContext,{}, {fetch:fakeFetch});
assert.equal(unconfigured.status,'unavailable');
assert.equal(unconfigured.chapters.length,0);
const course=await researchEducationCountryCourse(courseContext,env,{fetch:fakeFetch,now:1000});
assert.equal(course.status,'success');assert.equal(course.curriculumStatus,'advisory_evidence_based');
assert.equal(course.chapters.length,10);
assert.equal(course.sources.length,2);
assert.ok(course.sources.every(s=>s.url.startsWith('https://')));
const cached=await researchEducationCountryCourse(courseContext,env,{fetch:fakeFetch,now:1001});
assert.equal(cached.cache,'hit');
const researched=await researchEducationCountryLesson(context,env,{fetch:fakeFetch,now:1000});
assert.equal(researched.status,'success');assert.equal(researched.lesson.concepts.length,3);
assert.equal(researched.lesson.questions.length,2);
assert.deepEqual(researched.lesson.answers.length,researched.lesson.questions.length);
assert.equal(searches,2);assert.equal(models,2);
assert.equal((await researchEducationCountryLesson({...context,topic:'This is not in provided evidence'},env,{fetch:fakeFetch})).status,'unavailable');
// Test real API route wiring with the same fake source and AI; no network calls.
const previousFetch=globalThis.fetch;
try{
 globalThis.fetch=fakeFetch;
 const req=new Request('https://pocket-edu.test/api/education-country-curriculum',{method:'POST',
  headers:{'Content-Type':'application/json'},body:JSON.stringify({...courseContext,grade:'J3'})});
 const result=await backend.fetch(req,env);assert.equal(result.status,200);
 const json=await result.json();assert.equal(json.status,'success');
 assert.equal(json.chapters.length,10);
 const bad=await backend.fetch(new Request('https://pocket-edu.test/api/education-country-lesson',{method:'POST',body:'not json'}),env);
 assert.equal(bad.status,400);
}finally{globalThis.fetch=previousFetch}
new vm.Script(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,{filename:'worldwide-course-browser.js'});
assert.match(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,/api\/education-country-curriculum/);
assert.match(EDUCATION_INTERNATIONAL_COURSE_UI_SCRIPT,/api\/education-country-lesson/);
const browser=(await(await frontend.fetch(new Request('https://pocket-edu-ui.test/'))).text()).match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(browser);new vm.Script(browser,{filename:'international-apk-ui.js'});
console.log('PASS international online curriculum: source matching, model safety, cache, 2 APIs, Android UI');
