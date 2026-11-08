import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {PRACTICAL_LEVELS,PRACTICAL_COUNTRIES,PRACTICAL_COURSES,PRACTICAL_STATEMENT,practicalCourse,practicalChapters,practicalQuiz,practicalScore} from './practical_curriculum.mjs';
import {PRACTICAL_UI_SCRIPT} from './practical_ui.mjs';
import {EDUCATION_SELECTS_UI_SCRIPT} from './education_selects_ui.mjs';
import {EXAM_COUNTRY_CODES} from './exam_curriculum_europe.mjs';

const ids=PRACTICAL_COURSES.map(x=>x.id);
assert.equal(ids.length,6,'Six useful practical learning disciplines');
assert.equal(new Set(ids).size,6);
assert.deepEqual(PRACTICAL_LEVELS.map(x=>x.id),['beginner','intermediate','advanced']);
assert.equal(PRACTICAL_COUNTRIES.length,13,'Country-dependent official references');
assert.deepEqual(new Set(PRACTICAL_COUNTRIES.map(x=>x[0])),new Set(EXAM_COUNTRY_CODES));
assert.ok(PRACTICAL_STATEMENT.includes('certificare')&&PRACTICAL_STATEMENT.includes('juridică'));
assert.ok(PRACTICAL_COUNTRIES.every(x=>x[3].startsWith('https://')));
const allChapters=PRACTICAL_COURSES.flatMap(c=>c.chapters);
assert.equal(allChapters.length,36,'Six sequenced lessons per practical subject');
assert.equal(new Set(allChapters.map(x=>x.id)).size,36);
for(const course of PRACTICAL_COURSES){
 assert.ok(course.ro&&course.en&&course.icon&&course.summary);
 assert.equal(practicalCourse(course.id)?.id,course.id);
 assert.equal(course.chapters.length,6);
 assert.deepEqual(course.chapters.map(x=>x.order),[1,2,3,4,5,6]);
 assert.deepEqual(course.chapters.map(x=>x.level),['beginner','beginner','intermediate','intermediate','advanced','advanced']);
 for(const level of PRACTICAL_LEVELS)assert.equal(practicalChapters(course.id,level.id).length,2);
 for(const chapter of course.chapters){
  assert.ok(chapter.title.length>9&&chapter.theory.length>120&&chapter.method.length>55&&chapter.caseStudy.length>40,'Insufficient offline explanation '+chapter.id);
  assert.equal(chapter.practice.length,3);
  const q=chapter.question;
  assert.ok(q.prompt.length>19&&q.choices.length===4&&new Set(q.choices).size===4);
  assert.ok(Number.isInteger(q.correct)&&q.correct>=0&&q.correct<4);
  assert.ok(q.explanation.length>40);
  const first=practicalQuiz(course.id,chapter.id,0,5),second=practicalQuiz(course.id,chapter.id,1,5);
  assert.equal(first.length,5);assert.equal(second.length,5);
  assert.equal(first[0].chapterId,chapter.id);
  assert.equal(second[0].chapterId,chapter.id);
  assert.notDeepEqual(first.map(x=>x.id),second.map(x=>x.id),'New quiz must rotate question content');
  const allCorrect=first.map(x=>x.correct),oneWrong=allCorrect.map((v,i)=>i===2?(v+1)%4:v);
  assert.deepEqual(practicalScore(first,allCorrect),{correct:5,total:5,percent:100});
  assert.deepEqual(practicalScore(first,oneWrong),{correct:4,total:5,percent:80});
 }
}
assert.equal(practicalCourse('not-real'),null);
assert.equal(practicalQuiz('not-real','none').length,0);

assert.match(PRACTICAL_UI_SCRIPT,/function practicalOpen\(stage\)/,'Functional navigation');
assert.match(PRACTICAL_UI_SCRIPT,/function practicalLesson\(panel\)/,'Lesson panel');
assert.match(PRACTICAL_UI_SCRIPT,/function practicalBack\(\)/,'Back navigation');
assert.match(PRACTICAL_UI_SCRIPT,/function practicalVoiceHandleAndroid\(data\)/,'Android voice');
assert.match(PRACTICAL_UI_SCRIPT,/practical-printable/,'PDF materials');
assert.match(PRACTICAL_UI_SCRIPT,/lastVariant/,'Persist rotating practice variants');
assert.match(PRACTICAL_UI_SCRIPT,/rotation=\(index\+variant\+1\)%4/,'Rotate answer options');
assert.match(PRACTICAL_UI_SCRIPT,/selected\.some\(x=>x===null\)/,'Require all test answers');
assert.match(PRACTICAL_UI_SCRIPT,/practicalSave\(\{completed:/,'Lesson progress');
assert.match(PRACTICAL_UI_SCRIPT,/\.slice\(page,page\+4\)/,'Four visible list entries');
assert.match(PRACTICAL_UI_SCRIPT,/controller\.signal/,'Request can be cancelled');
assert.match(EDUCATION_SELECTS_UI_SCRIPT,/MutationObserver/,'Auto-enhance dynamic selectors');
assert.match(EDUCATION_SELECTS_UI_SCRIPT,/dispatchEvent\(new Event\('change'/,'Preserve native onchange integration');
assert.match(EDUCATION_SELECTS_UI_SCRIPT,/\.slice\(offset,offset\+4\)/,'Four option results');
assert.match(EDUCATION_SELECTS_UI_SCRIPT,/touch-action:manipulation/,'One-tap controls');

const response=await app.fetch(new Request('https://boot-check.test/'));
assert.equal(response.status,200);
const html=await response.text(),boot=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(boot&&boot.length>100000,'App script exists');
new vm.Script(boot,{filename:'practical-education-boot.js'});
for(const fragment of [
 "if(key==='practical'){practicalJourney.country=",
 "if(root.classList.contains('learning-active')&&root.classList.contains('learning-practical'))",
 "if(practicalVoiceHandleAndroid(data))return;",
 "PRACTICAL_COURSES_DATA","PRACTICAL_COUNTRIES_DATA","PRACTICAL_LEVELS_DATA",
 "function practicalOpen(stage)","function practicalLesson(panel)",
 "educationInstallTapSelects()",
 "'.practical-printable'"
])assert.ok(boot.includes(fragment),'Practical module missing in boot: '+fragment);
assert.match(html,/#view-module\.learning-practical #moduleChatHost\{display:none!important\}/,'Do not duplicate conversation host');
console.log('PASS practical courses: 6 domains, 36 lessons, 13 country references, two quiz variants per chapter, scoring, PDF, Android navigation and one-tap selectors');
