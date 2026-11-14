import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {PRACTICAL_LEVELS,PRACTICAL_COUNTRIES,PRACTICAL_COURSES,PRACTICAL_STATEMENT,practicalCourse,practicalChapters,practicalQuiz,practicalScore} from './practical_curriculum.mjs';
import {PRACTICAL_UI_SCRIPT} from './practical_ui.mjs';
import {PRACTICAL_GUIDES,practicalGuide} from './practical_guides.mjs';
import {PRACTICAL_SYLLABI,practicalSyllabus} from './practical_syllabi.mjs';
import {PRACTICAL_DEPTH} from './practical_depth.mjs';
import {PRACTICAL_DEPTH_EXTRA} from './practical_depth_extra.mjs';
import {PRACTICAL_REFERENCES,practicalReferences} from './practical_sources.mjs';
import {EDUCATION_SELECTS_UI_SCRIPT} from './education_selects_ui.mjs';
import {EXAM_COUNTRY_CODES} from './exam_curriculum_europe.mjs';

const ids=PRACTICAL_COURSES.map(x=>x.id);
assert.equal(ids.length,6,'Six useful practical learning disciplines');
assert.equal(new Set(ids).size,6);
assert.deepEqual(PRACTICAL_LEVELS.map(x=>x.id),['beginner','intermediate','advanced']);
assert.equal(PRACTICAL_COUNTRIES.length,13,'Country-dependent official references');
assert.deepEqual(new Set(PRACTICAL_COUNTRIES.map(x=>x[0])),new Set(EXAM_COUNTRY_CODES));
assert.ok(PRACTICAL_STATEMENT.includes('certificare')&&PRACTICAL_STATEMENT.includes('juridică'));
assert.ok(PRACTICAL_COUNTRIES.every(x=>x.length===3),'Country selection must not have an unrelated generic source URL');
const allChapters=PRACTICAL_COURSES.flatMap(c=>c.chapters);
assert.equal(allChapters.length,36,'Six sequenced lessons per practical subject');
assert.equal(Object.keys(PRACTICAL_GUIDES).length,36,'All practical lessons need a detailed tutorial');
const deep={...PRACTICAL_DEPTH,...PRACTICAL_DEPTH_EXTRA};
assert.equal(Object.keys(deep).length,36,'No course chapter may lack detailed teaching material');
assert.equal(PRACTICAL_SYLLABI.length,6,'Each practical course must have a coherent syllabus');
for(const course of PRACTICAL_COURSES){
 const syllabus=practicalSyllabus(course.id);
 assert.ok(syllabus?.intro.length>140,'A real course must start with a substantial introduction: '+course.id);
 assert.ok(syllabus.outcomes.length>=4,'Learning outcomes missing: '+course.id);
 assert.ok(syllabus.project.length>170&&syllabus.rubric.length>=4,'Meaningful final project and assessment missing: '+course.id);
 for(const chapter of course.chapters){
  const parts=deep[chapter.id];
  assert.ok(parts?.length>=3,'No shallow chapter: '+chapter.id);
  assert.ok(parts.every(([title,body])=>title.length>=7&&body.length>160),'Substantial topic-specific explanations required: '+chapter.id);
 }
}
assert.match(PRACTICAL_UI_SCRIPT,/const chapters=\[\.\.\.course\.chapters\]\.sort/,'Display all chapters together');
assert.doesNotMatch(PRACTICAL_UI_SCRIPT,/if\(stage==='levels'\)/,'No needless difficulty chooser');
assert.match(PRACTICAL_UI_SCRIPT,/practicalOpen\('chapters'\)/,'Go directly from course to lessons');
assert.match(PRACTICAL_UI_SCRIPT,/PRACTICAL_DEPTH_DATA\[chapter\.id\]/,'Render detailed topic-specific learning');
assert.match(PRACTICAL_UI_SCRIPT,/PRACTICAL_SYLLABI_DATA\.find/,'Course description and final project in app');
assert.match(PRACTICAL_UI_SCRIPT,/Criterii de evaluare/,'Final course assessment criteria');
const models=new Set();
for(const chapter of allChapters){
 const guide=practicalGuide(chapter.id);
 assert.ok(guide,'Missing guide '+chapter.id);
 assert.ok(guide.goal.length>=35,'Specific learning outcome '+chapter.id);
 assert.ok(guide.steps.length>=5,'Step-by-step tutorial '+chapter.id);
 assert.ok(guide.steps.every(x=>x.length>=35),'Substantive steps '+chapter.id);
 assert.ok(guide.model.length>=4,'Worked example '+chapter.id);
 assert.ok(guide.check.length>=3&&guide.exercise.length>=2,'Self-check and specific exercises '+chapter.id);
 const model=guide.model.join('\n');
 assert.ok(!models.has(model),'No copied model across chapters '+chapter.id);models.add(model);
}
const cv=PRACTICAL_GUIDES['career-2'];assert.ok(cv.steps.length>=7,'Complete CV-writing process');
const cvText=cv.model.join(' ');for(const field of ['PROFIL PROFESIONAL','EXPERIENȚĂ PROFESIONALĂ','STUDII','COMPETENȚE'])assert.ok(cvText.includes(field),'Missing concrete CV section '+field);
assert.ok(!cvText.includes('ANAF'),'CV must never reference the Romanian tax agency');
const romanianCvRefs=practicalReferences('RO','career','career-2');
assert.ok(romanianCvRefs.some(x=>x.url.includes('europass.europa.eu')),'Europass is relevant to a CV');
assert.ok(romanianCvRefs.some(x=>x.url.includes('anofm.ro')),'ANOFM is relevant to Romanian careers');
assert.ok(!romanianCvRefs.some(x=>x.url.includes('anaf.ro')),'ANAF is not relevant to CV writing');
assert.equal(practicalReferences('RO','daily','daily-1').length,0,'Do not invent a source for a daily-planning lesson');
assert.ok(practicalReferences('RO','business','business-5')[0].url.includes('europa.eu'),'Business registration reference must be business-specific');
assert.ok(practicalReferences('RO','trades','trades-2')[0].url.includes('inspectiamuncii.ro'),'Use workplace safety reference for trade-safety lessons');
assert.ok(practicalReferences('GB-ENG','finance','finance-1')[0].url.includes('moneyhelper.org.uk'),'Use UK budgeting authority');
assert.equal(practicalReferences('RO','trades','trades-3').length,0,'No occupational-safety homepage for material-selection lessons');
assert.ok(practicalReferences('RO','trades','trades-1')[0].url.includes('bipm.org'),'Use SI official measurements guide');
assert.equal(practicalReferences('RO','business','business-3').length,0,'Do not pass a company-registration source off as margin training');
assert.equal(practicalReferences('RO','career','career-5').length,0,'Do not display employment office as a portfolio tutorial');
for(const links of Object.values(PRACTICAL_REFERENCES))for(const item of Object.values(links))assert.ok(item.url?.startsWith('https://'),'Official source URL must exist');
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
assert.match(PRACTICAL_UI_SCRIPT,/function practicalCvWorkshop\(panel\)/,'Interactive real CV drafting workshop');
assert.match(PRACTICAL_UI_SCRIPT,/Salvează CV PDF/,'CV-only PDF export with compact accessible icon');
assert.match(PRACTICAL_UI_SCRIPT,/guide\?\.steps/,'Render chapter-specific instructions');
assert.match(PRACTICAL_UI_SCRIPT,/guide\?\.model/,'Render fully worked examples');
assert.match(PRACTICAL_UI_SCRIPT,/PRACTICAL_REFERENCES_DATA\[course\.id\]/,'Use contextual official references');
assert.doesNotMatch(PRACTICAL_UI_SCRIPT,/ref\.href=practicalCountry\(\)\[3\]/,'Remove universal ANAF country reference');
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
 "if(key==='practical'){practicalOpen('courses');return}",
 "if(root.classList.contains('learning-active')&&root.classList.contains('learning-practical'))",
 "if(practicalVoiceHandleAndroid(data))return;",
 "PRACTICAL_COURSES_DATA","PRACTICAL_COUNTRIES_DATA","PRACTICAL_LEVELS_DATA","PRACTICAL_GUIDES_DATA","PRACTICAL_REFERENCES_DATA","PRACTICAL_SYLLABI_DATA","PRACTICAL_DEPTH_DATA",
 "function practicalOpen(stage)","function practicalLesson(panel)",
 "educationInstallTapSelects()",
 "'.practical-printable'"
])assert.ok(boot.includes(fragment),'Practical module missing in boot: '+fragment);
assert.match(html,/#view-module\.learning-practical #moduleChatHost\{display:none!important\}/,'Do not duplicate conversation host');

// Verify each supported speech locale and AI response language without Android services.
assert.match(PRACTICAL_UI_SCRIPT,/function practicalSpeechLocale\(\)/,'10-language speech helper');
assert.match(PRACTICAL_UI_SCRIPT,/language:practicalSpeechLocale\(\)/,'Selected speech locale passed to Android');
const practicalVoiceLocale=new Function('state',PRACTICAL_UI_SCRIPT+';return practicalSpeechLocale();');
const practicalReplyLanguage=new Function('state',PRACTICAL_UI_SCRIPT+';return practicalResponseLanguage();');
for(const [lang,locale,label] of [
 ['ro','ro-RO','română'],['en','en-GB','engleză'],['fr','fr-FR','franceză'],['de','de-DE','germană'],['it','it-IT','italiană'],
 ['es','es-ES','spaniolă'],['pt','pt-PT','portugheză'],['nl','nl-NL','neerlandeză'],['ru','ru-RU','rusă'],['pl','pl-PL','poloneză']
]){
 assert.equal(practicalVoiceLocale({language:lang}),locale,'Recognition locale: '+lang);
 assert.equal(practicalReplyLanguage({language:lang}),label,'Response language: '+lang);
}
assert.doesNotMatch(PRACTICAL_UI_SCRIPT,/language:state\.language==='ro'\?'ro-RO':'en-GB'/,'No English-only fallback for configured languages');


// The authored lesson and quiz use the cached education translation helper.
// Translation must never alter the selected answer indices or duplicate a score report.
assert.match(PRACTICAL_UI_SCRIPT,/const translatableNodes=\[\]/,'Lesson source elements are tracked');
assert.match(PRACTICAL_UI_SCRIPT,/eduTranslateMaterial\(original,'practical:'\+chapter\.id\+':'\+i\)/,'Lesson translation is chunked and cached');
assert.match(PRACTICAL_UI_SCRIPT,/eduTranslateMaterial\(originals,'practicalQuiz:'\+course\.id/,'Quiz translation is cached per quiz version');
assert.match(PRACTICAL_UI_SCRIPT,/choiceTexts\[j\]\.textContent=displayChoices\[i\]\[j\]/,'Translations replace only visible quiz text');
assert.match(PRACTICAL_UI_SCRIPT,/selected\[i\]===q\.correct/,'Scoring still uses immutable original correct index');
assert.match(PRACTICAL_UI_SCRIPT,/questionHost\.querySelectorAll\('input'\)\.forEach\(x=>x\.disabled=true\)/,'Inputs disabled while translation is pending');


// Regression: the main Practical lesson is an activity selector, not a long
// page with a sticky chapter picker covering controls and quiz questions.
assert.match(PRACTICAL_UI_SCRIPT,/function practicalActivityDialog\(title,blocks,parking\)/);
assert.match(PRACTICAL_UI_SCRIPT,/const storage=practicalNode\('div','','practical-lesson-storage'\)/);
assert.match(PRACTICAL_UI_SCRIPT,/storage\.hidden=true/);
assert.match(PRACTICAL_UI_SCRIPT,/panel\.append\(tools,storage\)/);
assert.match(PRACTICAL_UI_SCRIPT,/makeAction\(practicalLabel\('✅ Test de verificare'/);
assert.match(PRACTICAL_UI_SCRIPT,/questionCards\.forEach\(\(card,i\)=>\{card\.hidden=i!==activeQuestion\}\)/);
assert.match(PRACTICAL_UI_SCRIPT,/activeQuestion=selected\.findIndex/);
assert.match(PRACTICAL_UI_SCRIPT,/questionHost\.hidden=true;pager\.hidden=true/);
assert.match(html,/dialog\.practical-activity-dialog\[open\]\{/);
assert.match(html,/#view-module\.learning-practical\.active \.education-topic-picker\{[\s\S]{0,70}position:static!important/);
assert.doesNotMatch(PRACTICAL_UI_SCRIPT,/if\(stage==='lesson'\)eduAttachPrintAction\(bar\)/);

console.log('PASS practical courses: 6 domains, 36 lessons, 13 country references, two quiz variants per chapter, scoring, PDF, Android navigation and one-tap selectors');
