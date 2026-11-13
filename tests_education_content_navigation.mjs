import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {COMPUTING_TOPICS,COMPUTING_PATHS} from './computing_curriculum.mjs';
import {COMPUTING_UI_SCRIPT} from './computing_ui.mjs';
import {HG_SCHOOL_PLANS,hgSchoolChapters} from './education_school_paths.mjs';
import {HG_LOCAL_GUIDES} from './education_hg_lessons.mjs';
import {LIT_EU_COMMON,LIT_EU_PROGRAMS,litEuropeanPlan} from './literature_curriculum_europe.mjs';
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
// Study topics must cover more than a handful of cards for every mapped year.
for(const [country,years] of [['RO',['4','5','6','7','8','9','10','11','12']],['GB-ENG',Array.from({length:13},(_,i)=>'Y'+(i+1))]]){
 for(const subject of ['history','geography'])for(const grade of years){
  const n=Number(String(grade).replace('Y',''));
  const level=country==='RO'?n<=4?'beginner':n<=8?'lower':'medium':n<=6?'beginner':n<=9?'lower':'medium';
  const plan=hgSchoolChapters(country,subject,level,grade);
  assert.ok(plan.chapters.length>=9,country+'/'+subject+'/'+grade+' has only '+plan.chapters.length+' modules');
  assert.equal(new Set(plan.chapters.map(x=>x.id)).size,plan.chapters.length,country+'/'+subject+'/'+grade+' duplicate ids');
  assert.equal(new Set(plan.chapters.map(x=>x.ro)).size,plan.chapters.length,country+'/'+subject+'/'+grade+' duplicate labels');
 }
}
for(const subject of ['history','geography'])for(const level of ['beginner','lower','medium','advanced']){
 const plan=hgSchoolChapters('FR',subject,level,'general-'+level);
 assert.ok(plan.chapters.length>=9,'Unverified curriculum must have a general non-statutory study path: '+subject+'/'+level);
 assert.equal(plan.status,'general-learning','No unsupported statutory claims');
}
for(const id of ['ro4-family','ro4-sources','ro4-heritage','ro4-people','ro4-change','geo4-near','geo4-romania','geo4-people']){
 const guide=HG_LOCAL_GUIDES[id];
 assert.ok(guide?.length>=6,id+' must have a structured offline lesson');
 assert.ok(guide.every(x=>x.length===4&&x[2].length>=80&&x[3].length>=80),id+' bilingual theory incomplete');
}
for(const [level,units] of Object.entries(LIT_EU_COMMON)){
 assert.ok(units.length>=10,'Literature '+level+' must have at least ten structured units');
 assert.equal(new Set(units.map(x=>x[0])).size,units.length,'Duplicate literature unit keys');
}
for(const country of ['RO','GB-ENG','FR','DE','IT','ES']){
 const profile=LIT_EU_PROGRAMS[country];
 if(!profile)continue;
 for(const [level,units] of Object.entries(profile.byLevel||{}))assert.ok(units.length>=10,country+' '+level+' literature too short');
 for(const [grade,units] of Object.entries(profile.byGrade||{}))assert.ok(units.length>=10,country+' '+grade+' literature too short');
}
assert.ok(litEuropeanPlan('RO','medium','9','TC').units.length>=10,'Romanian ninth-grade literature must not be four broad cards');
assert.equal(litEuropeanPlan('RO','medium','9','TC').verified,true,'Keep ninth grade official framework separate from advisory unit sequencing');
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
 'const guide=hgLessonSections(topic);const lessonView=hgShowCoreLesson(panel,guide);']){
 assert.ok(boot.includes(fragment),'Missing integrated lesson UI: '+fragment);
}
assert.ok(boot.includes('function educationTopicPicker(label,entries,selected,onSelect){'),
 'All study modules share one compact chapter navigator');
assert.ok(boot.includes("chapters.forEach(other=>{if(other!==details)other.open=false})"),
 'Opening one local theory chapter closes the previous one');
assert.ok(boot.includes('lessonView.mountAI(aiInline)'),
 'AI deepening is mounted directly under the selected theory topic');
assert.ok(!boot.includes('secondary-btn hg-toc-button'),
 'Do not duplicate the chapter list as a second grid');
assert.ok(html.includes('main.page:has(#view-module.learning-hg.active)'),
 'History and geography viewport layout exists');
assert.ok(html.includes('className=')||boot.includes('className='),
 'Produced markup or client script must be non-empty');
for(const section of ['scienceTopicChoices().filter','mathChaptersForSelection()',
 'litJourney.branch===','FOREIGN_TOPIC_DATA,languageJourney.topic']){
 assert.ok(boot.includes(section),'Education topic picker missing integration: '+section);
}
assert.ok(boot.includes('function educationScienceTheoryReader(subjectId,topicId,level){'),
 'Science workspaces must show their existing local theory directly');
const begin=boot.indexOf('function hgBack(){'),end=boot.indexOf('function hgOpen(stage){',begin);
assert.ok(begin>=0&&end>begin,'History Back source missing');
const makeBack=(journey,open,opts,gradeGate)=>new Function('hgJourney','hgOpen','eduYearOptions','educationCountrySelection','educationGradeGate','renderLearningSubjects',
 boot.slice(begin,end)+';return hgBack;')(journey,open,opts,{code:'RO'},gradeGate,()=>{});
{
 const journey={stage:'chapters',level:'beginner'},screens=[];
 const back=makeBack(journey,stage=>screens.push(stage),()=>[{id:'4'}],()=>{throw Error('A single grade must not loop via the grade gate')});
 back();assert.deepEqual(screens,['levels'],'Back from Romanian Grade 4 chapters returns to the level selector');
}
{
 const journey={stage:'chapters',level:'lower'},screens=[];
 const back=makeBack(journey,stage=>screens.push(stage),()=>[{id:'5'},{id:'6'}],(_m,_l,_accept,_cancel)=>screens.push('grade-gate'));
 back();assert.equal(journey.stage,'grade');assert.deepEqual(screens,['grade-gate']);
}
{
 const journey={stage:'chapters',level:'advanced'},screens=[];
 const back=makeBack(journey,stage=>screens.push(stage),()=>[],()=>{});
 back();assert.deepEqual(screens,['specialties']);
}
assert.ok(!boot.includes('Capitolul are structură de studiu. Pentru explicații detaliate'),
 'Opening a chapter must not be just a placeholder');
console.log('PASS curriculum: England Year 1–13 study topics, Year 7 computing, offline theory, compact year picker, browser boot');
