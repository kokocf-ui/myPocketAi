import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {COMPUTING_TOPICS,COMPUTING_PATHS} from './computing_curriculum.mjs';
import {COMPUTING_UI_SCRIPT} from './computing_ui.mjs';
import {HG_SCHOOL_PLANS,hgSchoolChapters} from './education_school_paths.mjs';
import {HG_LOCAL_GUIDES} from './education_hg_lessons.mjs';
import {EDUCATION_COUNTRY_UI_SCRIPT} from './education_country_ui.mjs';

const filtered = new Function('educationCountrySelection','computingJourney',
 COMPUTING_UI_SCRIPT.slice(COMPUTING_UI_SCRIPT.indexOf('function computingGradePathAllowed('),
  COMPUTING_UI_SCRIPT.indexOf('function computingOpen(stage){'))+
 '\nreturn computingGradePathAllowed;')(
 {code:'GB-ENG'}, {level:'lower',grade:'Y7'});
const lower=COMPUTING_PATHS.filter(p=>p.level==='lower'&&filtered(p)).map(p=>p.id);
assert.deepEqual(lower,['lower-logic','lower-programming','lower-digital'],
 'Every Year 7 path must be selectable; no empty list');
for(const grade of ['Y7','Y8','Y9']){
 const allowed=new Function('educationCountrySelection','computingJourney',
  COMPUTING_UI_SCRIPT.slice(COMPUTING_UI_SCRIPT.indexOf('function computingGradePathAllowed('),
   COMPUTING_UI_SCRIPT.indexOf('function computingOpen(stage){'))+
  '\nreturn computingGradePathAllowed;')({code:'GB-ENG'},{level:'lower',grade});
 assert.equal(COMPUTING_PATHS.filter(p=>p.level==='lower'&&allowed(p)).length,3,
  'England '+grade+' lower-secondary branch coverage');
}
for(const topic of ['hardware','device-types','software','lower-python','lower-sequences','lower-data']){
 const t=COMPUTING_TOPICS.find(x=>x.id===topic);
 assert.ok(t&&t.theory.length>400,topic+': must contain teachable offline theory');
 assert.ok(t.example.length>15&&t.question.length>7,topic+': example and quiz');
}
assert.match(COMPUTING_UI_SCRIPT,/Aplică și exersează/);
assert.match(COMPUTING_UI_SCRIPT,/codeExample\?'pre':'div'/,
 'Everyday-life examples must not be mislabeled as code');
assert.ok(COMPUTING_UI_SCRIPT.includes('const paths=COMPUTING_PATHS_DATA.filter('));

for(const subject of ['history','geography']){
 for(let i=1;i<=13;i++){
  const year='Y'+i;
  const chapters=hgSchoolChapters('GB-ENG',subject,i<=6?'beginner':i<=9?'lower':'medium',year).chapters;
  assert.ok(chapters.length>=3,subject+' '+year+' must offer multiple school topics');
  assert.equal(new Set(chapters.map(x=>x.id)).size,chapters.length,
   subject+' '+year+' must have no repeated topic IDs');
  assert.ok(chapters.every(x=>x.query.length>45),subject+' '+year+' topic explanations populated');
 }
}
for(const id of ['eng-geo-y1-local','eng-geography-y1-sub1','eng-geography-y1-sub2','eng-geography-y1-sub3','eng-y1-memory','eng-y7-medieval']){
 const guide=HG_LOCAL_GUIDES[id];
 assert.ok(guide?.length>=3,'Offline chapter missing: '+id);
 assert.ok(guide.every(row=>row.length===4&&row[2].length>90&&row[3].length>90),id+' must have real bilingual theory');
}
const england1=hgSchoolChapters('GB-ENG','geography','beginner','Y1');
assert.equal(england1.status,'official-framework','KS1 geography should reference statutory DfE programme');
const year=EDUCATION_COUNTRY_UI_SCRIPT;
assert.match(year,/className='edu-grade-choice-grid'/);
assert.match(year,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.match(year,/search\.addEventListener\('focus',/);

const response=await frontend.fetch(new Request('https://education-content.test/'));
assert.equal(response.status,200);
const html=await response.text();
const boot=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(boot,'Generated browser script missing');
new vm.Script(boot,{filename:'pocket-education-content.js'});
for(const fragment of ['const HG_LOCAL_GUIDES_DATA=','function hgLessonSections(topic){',
 'function hgShowCoreLesson(panel,guide){','className=\'hg-offline-lesson\'',
 'className=\'hg-local-toc\'','className=\'hg-lesson-suggestions\'',
 'const guide=hgLessonSections(topic);hgShowCoreLesson(panel,guide);']){
 assert.ok(boot.includes(fragment),'Missing integrated lesson UI: '+fragment);
}
assert.ok(!boot.includes('Capitolul are structură de studiu. Pentru explicații detaliate'),
 'Opening a chapter must not be just a placeholder');
console.log('PASS curriculum: England Year 1–13 study topics, Year 7 computing, offline theory, compact year picker, browser boot');
