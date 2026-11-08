import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {EXAM_SPECS,EXAM_SUBJECTS,EXAM_SESSION_YEARS,examByCountry,examByGrade,examSubjects,examProfile,examSourceStatus} from './exam_curriculum_europe.mjs';
import {EXAM_LOCAL_BANK,examTrainingItems,examTrainingScore} from './exam_practice_bank.mjs';
import {EXAM_UI_SCRIPT} from './exam_ui.mjs';

assert.ok(EXAM_SPECS.length>=26,'Exam records should be populated');
assert.ok(new Set(EXAM_SPECS.map(x=>x.country)).size>=13,'European systems');
assert.ok(EXAM_SESSION_YEARS.includes(2027),'2027 session available');
const names=new Set(EXAM_SUBJECTS.map(x=>x.id));assert.equal(names.size,EXAM_SUBJECTS.length);
const records=new Set();
for(const e of EXAM_SPECS){
 assert.ok(e.country&&e.id&&e.ro&&e.en&&e.source?.startsWith('https://'),'Exam reference missing: '+e.id);
 assert.ok(e.notice.length>35,'Unclear caveat: '+e.id);
 assert.ok(e.grades.length>=1&&e.subjects.length>=1);
 for(const sub of e.subjects)assert.ok(names.has(sub),'Unknown subject '+sub+' for '+e.id);
 const key=e.country+'|'+e.id;assert.ok(!records.has(key),'Duplicate exam '+key);records.add(key);
 assert.ok(examSubjects(e).length===e.subjects.length);
 for(const g of e.grades)assert.ok(examByGrade(e.country,g).some(x=>x.id===e.id),'Missing grade '+g+' for '+e.id);
}
assert.ok(examByCountry('RO').some(x=>x.id==='en8'&&x.grades.includes('8')));
assert.ok(examByCountry('RO').some(x=>x.id==='bac'));
assert.deepEqual(examByGrade('RO','8').map(x=>x.id),['en8','admitere']);
assert.ok(examByCountry('GB-ENG').some(x=>x.id==='gcse'));
assert.ok(examByCountry('GB-SCT').some(x=>x.id==='national5'));
assert.ok(examByCountry('FR').some(x=>x.id==='dnb'));
assert.ok(examByCountry('PL').some(x=>x.id==='osmoklasisty'));
assert.ok(examByCountry('DE').some(x=>x.id==='abitur'&&x.requiresRegion));
assert.ok(examByCountry('ES').some(x=>x.id==='pau'&&x.requiresRegion));
assert.ok(examByCountry('GB-WLS').some(x=>x.id==='wales-gcse'));
assert.ok(examByCountry('PT').some(x=>x.id==='portugal-9'));
assert.ok(examByCountry('NL').some(x=>x.id==='eindexamen'));
assert.equal(examSourceStatus(examByCountry('RO').find(x=>x.id==='admitere'),2027),'orientative');
assert.equal(examSourceStatus(examByCountry('RO')[0],2028),'session-unverified');
assert.equal(examProfile('RO','en8','math').subject.id,'math');
assert.equal(examProfile('RO','en8','physics'),null);
assert.equal(examProfile('RO','invalid','math'),null);
assert.equal(examByCountry('CH').length,0,'Unavailable systems are advisory instead of invented');

const banks=Object.entries(EXAM_LOCAL_BANK),items=banks.flatMap(([key,list])=>list);
assert.ok(items.length>=50,'Local question bank insufficient');
const qids=new Set();
for(const [subject,questions] of banks){
 assert.ok(questions.length>=3,'Insufficient original practice items: '+subject);
 assert.ok(EXAM_SUBJECTS.some(x=>x.id===subject));
 for(const item of questions){
  assert.ok(!qids.has(item.id));qids.add(item.id);
  assert.ok(item.prompt.length>18&&item.explanation.length>14);
  assert.equal(item.choices.length,4);
  assert.ok(item.choices.every(x=>x.length));
  assert.ok(Number.isInteger(item.correct)&&item.correct>=0&&item.correct<4);
 }
 const correct=questions.slice(0,3).map(x=>x.correct);
 assert.deepEqual(examTrainingScore(questions.slice(0,3),correct),{correct:3,total:3,percent:100,kind:'practice-only'});
}
assert.equal(examTrainingItems('unknown').length,0,'No invented local quiz');
assert.deepEqual(examTrainingScore([],[]),{correct:0,total:0,percent:null,kind:'practice-only'});

const result=await app.fetch(new Request('https://boot-check.test/'));assert.equal(result.status,200);
const html=await result.text(),boot=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(boot&&boot.length>100000);
new vm.Script(boot,{filename:'mypocketai-exam-boot.js'});
for(const fragment of [
 "if(key==='exams'){examOpen('countries');return}",
 "if(root.classList.contains('learning-active')&&root.classList.contains('learning-exams'))",
 "if(activeLearningSubject[0]==='exams'&&examJourney.stage==='workspace')",
 "if(examVoiceHandleAndroid(data))return;",
 "function examOpen(stage)","function examWorkspace(panel)","function examBack()",
 "function examReviewPhoto(text)","function examVoiceHandleAndroid(data)",
 "EXAM_PRACTICE_DATA","EXAM_SESSION_YEARS_DATA","'exam-printable'","'exam-output'",
 "function eduOpenPrint(mode='save')"
])assert.ok(boot.includes(fragment),'Exam UI missing: '+fragment);
assert.match(html,/#view-module\.learning-exams #moduleChatHost\{display:none!important\}/,'Hide duplicate chat');
assert.match(EXAM_UI_SCRIPT,/\.slice\(offset,offset\+4\)/,'At most four list results');
assert.match(EXAM_UI_SCRIPT,/Punctaj neoficial/,'No official-scoring claim');
assert.match(EXAM_UI_SCRIPT,/examJourney\.session/,'Sitting year selector');
assert.match(EXAM_UI_SCRIPT,/examJourney\.region/,'Regional selection');
assert.match(EXAM_UI_SCRIPT,/examJourney\.board/,'Exam board selection');
assert.match(EXAM_UI_SCRIPT,/controller\.signal/,'Abort support');
assert.match(EXAM_UI_SCRIPT,/function examDictate/,'Dictation');
assert.match(EXAM_UI_SCRIPT,/const read=examBtn/,'Reading toggle');
console.log('PASS European exam pathways, 26 exam records, original local questions, session warnings, PDF, camera, Android voice and script boot');
