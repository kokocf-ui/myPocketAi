import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {EXAM_SPECS,EXAM_SUBJECTS,EXAM_SESSION_YEARS,EXAM_COUNTRY_CODES,examByCountry,examByGrade,examSubjects,examProfile,examSourceStatus} from './exam_curriculum_europe.mjs';
import {EXAM_ORDERED_PATHWAYS,EXAM_GENERAL_PATHWAYS,examOrderedTopics} from './exam_ordered_pathways.mjs';
import {EXAM_LOCAL_BANK,examTrainingItems,examTrainingScore} from './exam_practice_bank.mjs';
import {EXAM_UI_SCRIPT} from './exam_ui.mjs';
import {UNIVERSITY_DOMAINS,universityDomain,universityDomainSubjects} from './university_domains.mjs';

assert.ok(EXAM_SPECS.length>=26,'Exam records should be populated');
assert.ok(Object.keys(EXAM_ORDERED_PATHWAYS).length>=12);
assert.ok(Object.keys(EXAM_GENERAL_PATHWAYS).length>=9);
assert.equal(examOrderedTopics('RO','en8',EXAM_SUBJECTS.find(s=>s.id==='math')).status,'exam-framework-order');
assert.ok(examOrderedTopics('RO','en8',EXAM_SUBJECTS.find(s=>s.id==='math')).sections.length>=5);
assert.equal(examOrderedTopics('GB-ENG','ks2',EXAM_SUBJECTS.find(s=>s.id==='english')).status,'exam-framework-order');
assert.equal(examOrderedTopics('DE','abitur',EXAM_SUBJECTS.find(s=>s.id==='math')).status,'advisory-order');
assert.equal(examOrderedTopics('FR','dnb',EXAM_SUBJECTS.find(s=>s.id==='french')).sections[0].order,1);

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
const countries=EXAM_COUNTRY_CODES.filter(code=>examByCountry(code).length);
assert.equal(countries.length,13);
for(const code of countries){const admission=examByCountry(code).find(x=>x.id==='university');assert.ok(admission&&admission.universityAdmission&&admission.advisory&&!admission.requiresInstitution&&!admission.requiresProgramme,'University field flow must not require institution and faculty: '+code);assert.ok(admission.grades.includes('Universitate'))}
assert.ok(examByCountry('RO').find(x=>x.id==='university').source.includes('edu.ro'));
assert.ok(UNIVERSITY_DOMAINS.length>=10);
assert.equal(universityDomain('medicine').ro,'Medicină');
assert.deepEqual(universityDomainSubjects('medicine',['biology','chemistry','physics','math']),['biology','chemistry','physics']);
assert.ok(universityDomain('medicine').sourcesRO.some(([title,url])=>url.includes('umfiasi.ro')));
for(const domain of UNIVERSITY_DOMAINS){assert.ok(domain.id&&domain.ro&&domain.en&&domain.focus&&domain.caution);assert.ok(domain.subjects.length>=2)}
assert.ok(!EXAM_UI_SCRIPT.includes('Alege facultatea și universitatea în pasul următor'));
assert.ok(!EXAM_UI_SCRIPT.includes("examJourney.grade='După liceu'"));
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
const biologyBank=EXAM_LOCAL_BANK.biology;
assert.ok(biologyBank.length>=34,'Biology should have a useful multi-set question pool');
for(const section of ['concepts','methods','applications']){
 const eligible=biologyBank.filter(q=>q.topics?.includes(section));
 assert.ok(eligible.length>=10,'Need two distinct five-question simulations in biology: '+section);
 assert.equal(new Set(eligible.map(q=>q.id)).size,eligible.length);
 assert.notDeepEqual(eligible.slice(0,5).map(q=>q.id),eligible.slice(5,10).map(q=>q.id));
}
const bioDiagrams=new Set(['cell','mitochondrion','dna','foodchain','plant','stomata','punnett','microscope','experiment','circulation']);
for(const q of biologyBank.filter(q=>q.diagram)){assert.ok(bioDiagrams.has(q.diagram),'Unknown biology diagram '+q.diagram)}
assert.ok(biologyBank.filter(q=>q.diagram).length>=20,'Biology practice must show relevant diagrams');
assert.equal(examTrainingItems('unknown').length,0,'No invented local quiz');
assert.deepEqual(examTrainingScore([],[]),{correct:0,total:0,percent:null,kind:'practice-only'});
const reading=EXAM_LOCAL_BANK.romanian.filter(x=>x.id.startsWith('romanian-reading-'));
const writing=EXAM_LOCAL_BANK.romanian.filter(x=>x.id.startsWith('romanian-writing-'));
const vocabulary=EXAM_LOCAL_BANK.romanian.filter(x=>x.id.startsWith('romanian-vocabulary-'));
assert.equal(reading.length,5);assert.ok(reading[0].passage.length>200);assert.equal(writing.length,5);assert.equal(vocabulary.length,5);
const onceWrong=reading.map((q,i)=>i===2?(q.correct+1)%q.choices.length:q.correct);
assert.deepEqual(examTrainingScore(reading,onceWrong),{correct:4,total:5,percent:80,kind:'practice-only'},'One wrong answer out of five MUST be 80%, not 60%');

const result=await app.fetch(new Request('https://boot-check.test/'));assert.equal(result.status,200);
const html=await result.text(),boot=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(boot&&boot.length>100000);
new vm.Script(boot,{filename:'mypocketai-exam-boot.js'});
for(const fragment of [
 "if(key==='exams'){examOpen('grades');return}",
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
assert.match(EXAM_UI_SCRIPT,/EXAM_ORDERED_DATA\[specialKey\]/,'Official exam-specific revision topic lookup');
assert.match(EXAM_UI_SCRIPT,/Capitole de recapitulare/,'Ordered topic selector');
assert.match(EXAM_UI_SCRIPT,/Capitol de recapitulare/,'AI prompt scoped to selected chapter');
assert.match(EXAM_UI_SCRIPT,/controller\.signal/,'Abort support');
assert.match(EXAM_UI_SCRIPT,/function examDictate/,'Dictation');
assert.match(EXAM_UI_SCRIPT,/const read=examBtn/,'Reading toggle');
assert.match(EXAM_UI_SCRIPT,/🎓 Universitate/,'Direct university entrance');
assert.match(EXAM_UI_SCRIPT,/function examOpen\(stage\)/,'University navigation');
assert.match(EXAM_UI_SCRIPT,/if\(stage==='universityDomains'\)/,'Field chooser before subject');
assert.doesNotMatch(EXAM_UI_SCRIPT,/addField\('institution'/,'No mandatory institution field');
assert.doesNotMatch(EXAM_UI_SCRIPT,/addField\('programme'/,'No mandatory faculty field');
assert.match(EXAM_UI_SCRIPT,/Materii recomandate pentru pregătire/,'Advisory subject selection');
assert.match(EXAM_UI_SCRIPT,/function examRomanianResources/,'Offline Romanian study notes');
assert.match(EXAM_UI_SCRIPT,/Moromeții/,'Romanian literature summaries');
assert.match(EXAM_UI_SCRIPT,/📖 Rezumat după cerință/,'Custom Romanian summary');
assert.match(EXAM_UI_SCRIPT,/🔎 Analiză pe text/,'Custom text analysis');
assert.match(EXAM_UI_SCRIPT,/Ai ales: /,'Per-question chosen answer');
assert.match(EXAM_UI_SCRIPT,/Greșite: /,'Wrong answer count');
assert.match(EXAM_UI_SCRIPT,/bank\.slice\(15,20\)/,'Chapter-dependent vocabulary quiz');
assert.match(EXAM_UI_SCRIPT,/function examBioDiagram/,'Draw original biology diagrams');
assert.match(EXAM_UI_SCRIPT,/function examBiologyResources/,'Render substantial offline biology lessons');
assert.match(EXAM_UI_SCRIPT,/Materie pentru recapitulare|Materia pentru recapitulare/,'Explicitly show the learning material');
assert.match(EXAM_UI_SCRIPT,/examTopicTap/,'Use tap-friendly chapter selector');
assert.match(EXAM_UI_SCRIPT,/examTopicMenu/,'In-page chapter menu');
assert.match(EXAM_UI_SCRIPT,/practiceVersion=/,'Rotate practice variants, not just reopen the same five questions');
assert.match(EXAM_UI_SCRIPT,/q\.diagram/,'Attach relevant figures to the question they explain');
assert.match(EXAM_UI_SCRIPT,/examPracticeAnchor/,'Scroll to the new simulation');
assert.match(EXAM_UI_SCRIPT,/printableGuide\.querySelectorAll/,'Include all study notes in printable PDF');
assert.match(EXAM_UI_SCRIPT,/printPart\.hidden=true/,'Romanian print-only notes must not duplicate the visible study window');
assert.match(EXAM_UI_SCRIPT,/printableGuide\.hidden=true/,'Biology print-only duplicate is hidden from user');
assert.match(EXAM_UI_SCRIPT,/clone\.hidden=true/,'Universal print-only duplicate is hidden from user');
assert.match(EXAM_UI_SCRIPT,/field\.scrollIntoView/,'Using a Romanian work takes user to the editable task');
assert.doesNotMatch(EXAM_UI_SCRIPT,/field\.focus\(/,'Using a work must not pop up the Android keyboard');

assert.match(EXAM_UI_SCRIPT,/function examUniversalResources/,'Real study notes for non-Romanian and non-biology subjects');
assert.match(EXAM_UI_SCRIPT,/EXAM_THEORY_DATA\[subject\.id\]/,'Reuse verified theory source');
assert.match(EXAM_UI_SCRIPT,/function examFreshPractice/,'Create new exam quizzes for small local pools');
assert.match(EXAM_UI_SCRIPT,/new Set\(normalized\.map/,'Reject duplicate AI questions');
assert.match(EXAM_UI_SCRIPT,/examJourney\.aiQuestions=generated/,'Connect fresh questions to interactive grading');
assert.match(EXAM_UI_SCRIPT,/Nu s-a putut crea un set diferit/,'Do not pretend repeated local questions are new');
assert.ok(boot.includes('EXAM_THEORY_DATA'),'Curriculum-backed theory must be embedded into frontend');

// Verify each supported speech locale and AI response language without Android services.
assert.match(EXAM_UI_SCRIPT,/function examSpeechLocale\(\)/,'10-language speech helper');
assert.match(EXAM_UI_SCRIPT,/language:examSpeechLocale\(\)/,'Selected speech locale passed to Android');
const examVoiceLocale=new Function('state',EXAM_UI_SCRIPT+';return examSpeechLocale();');
const examReplyLanguage=new Function('state',EXAM_UI_SCRIPT+';return examResponseLanguage();');
for(const [lang,locale,label] of [
 ['ro','ro-RO','română'],['en','en-GB','engleză'],['fr','fr-FR','franceză'],['de','de-DE','germană'],['it','it-IT','italiană'],
 ['es','es-ES','spaniolă'],['pt','pt-PT','portugheză'],['nl','nl-NL','neerlandeză'],['ru','ru-RU','rusă'],['pl','pl-PL','poloneză']
]){
 assert.equal(examVoiceLocale({language:lang}),locale,'Recognition locale: '+lang);
 assert.equal(examReplyLanguage({language:lang}),label,'Response language: '+lang);
}
assert.doesNotMatch(EXAM_UI_SCRIPT,/language:state\.language==='ro'\?'ro-RO':'en-GB'/,'No English-only fallback for configured languages');


// Local practice may be translated without changing original grading metadata.
assert.match(EXAM_UI_SCRIPT,/eduTranslateMaterial\(originals,'examQuiz:'\+subject\.id/,'Exam local quiz translation is connected');
assert.match(EXAM_UI_SCRIPT,/displayedChoices\[i\]\[q\.correct\]/,'Exam grading explanation uses translated choice labels');
assert.match(EXAM_UI_SCRIPT,/selections\[i\]===q\.correct/,'Exam scoring still uses original answer indices');
assert.match(EXAM_UI_SCRIPT,/form\.querySelectorAll\('input'\)\.forEach\(input=>input\.disabled=true\)/,'Exam answers are held while translation loads');
assert.match(EXAM_UI_SCRIPT,/if\(!aiBank&&state\.language!=='ro'/,'AI-generated questions are not incorrectly retranslated');

console.log('PASS European exam pathways, 26 exam records, original local questions, session warnings, PDF, camera, Android voice and script boot');
