import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {COMPUTING_TOPICS,COMPUTING_PATHS} from './computing_curriculum.mjs';
import {COMPUTING_UI_SCRIPT} from './computing_ui.mjs';
import {PRACTICAL_UI_SCRIPT} from './practical_ui.mjs';
import {EXAM_UI_SCRIPT} from './exam_ui.mjs';
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
 'const guide=hgGuaranteedSections(topic);const lessonView=hgShowCoreLesson(panel,guide);']){
 assert.ok(boot.includes(fragment),'Missing integrated lesson UI: '+fragment);
}
assert.ok(boot.includes('function educationTopicPicker(label,entries,selected,onSelect){'),
 'All study modules share one compact chapter navigator');
assert.ok(boot.includes('function educationOpenPagedLesson(title,body){'),
 'Education uses a reusable paginated reading dialog');
assert.ok(boot.includes('educationOpenPagedLesson(heading,body);'),
 'History and geography themes open in the paginated dialog');
assert.ok(boot.includes('educationOpenPagedLesson(item.title,material);'),
 'Science study themes open in the paginated dialog');
assert.ok(boot.includes('head.eduPrintableMaterial=()=>({title:educationCleanLessonLine(title),text:educationCleanLessonText(raw)})'),
 'Save and print stay inside the opened lesson');
const hgReader=boot.slice(boot.indexOf('function hgShowCoreLesson(panel,guide){'),boot.indexOf('function hgLesson(panel){'));
assert.ok(!hgReader.includes("createElement('details')"),
 'History and geography topic lists must not expand long text inline');
assert.ok(boot.includes('lessonView.mountAI(aiInline)'),
 'AI deepening is mounted directly under the selected theory topic');
assert.ok(!boot.includes('secondary-btn hg-toc-button'),
 'Do not duplicate the chapter list as a second grid');
assert.ok(html.includes('main.page:has(#view-module.learning-hg.active)'),
 'History and geography viewport layout exists');
assert.ok(html.includes('className=')||boot.includes('className='),
 'Produced markup or client script must be non-empty');
for(const section of ['scienceTopicChoices().filter','mathChaptersForSelection()',
 'litJourney.branch===']){
 assert.ok(boot.includes(section),'Education topic picker missing integration: '+section);
}
assert.ok(boot.includes("if(stage==='topics')options=FOREIGN_TOPIC_DATA;"),
 'Foreign-language themes remain selectable in the dedicated themes menu');
assert.ok(boot.includes('function languageReadLocalLesson(){')&&boot.includes('educationOpenPagedLesson(title,parts.join(nl+nl))'),
 'Foreign-language teaching text opens in the shared paginated reader');
assert.ok(!boot.slice(boot.indexOf('function languageOpen(stage){'),boot.indexOf('// History & Geography: independent curriculum pathway')).includes('educationTopicPicker('),
 'Foreign-language lesson displays the selected theme, not an extra in-lesson theme picker');
assert.ok(boot.includes('function educationScienceTheoryReader(subjectId,topicId,level){'),
 'Science workspace includes a topic-only local theory menu');
const begin=boot.indexOf('function hgBack(){'),end=boot.indexOf('function hgOpen(stage){',begin);
assert.ok(begin>=0&&end>begin,'History Back source missing');
const makeBack=(journey,open,opts,gradeGate)=>new Function('hgJourney','hgOpen','eduYearOptions','educationCountrySelection','educationGradeGate','renderLearningSubjects',
 boot.slice(begin,end)+';return hgBack;')(journey,open,opts,{code:'RO'},gradeGate,()=>{});
{
 const journey={stage:'chapters',level:'beginner'},screens=[];
 const back=makeBack(journey,stage=>screens.push(stage),()=>[{id:'4'}],()=>{throw Error('A single grade must not loop via the grade gate')});
 back();assert.deepEqual(screens,['years'],'Back from Romanian Grade 4 chapters returns to grouped school years');
}
{
 const journey={stage:'chapters',level:'lower'},screens=[];
 const back=makeBack(journey,stage=>screens.push(stage),()=>[{id:'5'},{id:'6'}],(_m,_l,_accept,_cancel)=>screens.push('grade-gate'));
 back();assert.deepEqual(screens,['years'],'Other chapter levels also return directly to grouped school years');
}
{
 const journey={stage:'chapters',level:'advanced'},screens=[];
 const back=makeBack(journey,stage=>screens.push(stage),()=>[],()=>{});
 back();assert.deepEqual(screens,['specialties']);
}
assert.ok(!boot.includes('Capitolul are structură de studiu. Pentru explicații detaliate'),
 'Opening a chapter must not be just a placeholder');
// Permanent product rule: teaching text, whether offline or AI-generated, is
// presented only in paginated windows; menus and workspace keep theme names.
for(const token of [
 "function educationOpenPagedLesson(title,body){",
 "function educationTextFromLesson(node){",
 "educationOpenPagedLesson(hgL(topic.ro,topic.en)",
 "educationOpenPagedLesson(heading,body)",
 "educationOpenPagedLesson(item.title,material)",
 "educationOpenPagedLesson(assignment||workInfo||learningLabel(topic[1],topic[2]),material)",
 "output.style.display='none';aiInline.append(deepen,output)",
 "out.className='lit-result';out.style.display='none'"
])assert.ok(boot.includes(token),'Education modal-only rule missing: '+token);
for(const [name,script,patterns] of [
 ['Computing',COMPUTING_UI_SCRIPT,["printable.style.display='none'","educationOpenPagedLesson(lessonHeading.textContent,material)","educationOpenPagedLesson(computingLabel(t.ro,t.en)"]],
 ['Practical',PRACTICAL_UI_SCRIPT,["study.style.cssText='display:none","educationOpenPagedLesson(chapter.title,educationTextFromLesson(study))","educationOpenPagedLesson(chapter.title+' · '"]],
 ['Exams',EXAM_UI_SCRIPT,["printable.style.cssText='display:none","educationOpenPagedLesson(examLabel(subject.ro,subject.en),educationTextFromLesson(printable))","educationOpenPagedLesson(examLabel(subject.ro,subject.en)+' · '"]]
])for(const pattern of patterns)assert.ok(script.includes(pattern),name+': inline lesson text regression '+pattern);

// Lesson rendering must be professional, nonempty, paginated and touch-friendly.
for(const marker of [
 'function educationCleanLessonLine(value){',
 'function educationCleanLessonText(value){',
 'function hgGuaranteedSections(topic){',
 'const guide=hgGuaranteedSections(topic);',
 "dialog.append(head,heading,content,footer)",
 "educationOpenPagedLesson(learningLabel('Lecție · ','Lesson · ')",
 "extras.className='foreign-level-actions'",
 "icon.className='foreign-choice-icon'",
 "button.classList.add('foreign-choice-card')"
])assert.ok(boot.includes(marker),'Missing Education rule: '+marker);
for(const css of [
 '.foreign-level-actions,',
 '.foreign-options{',
 'touch-action:pan-y!important',
 '.hg-local-toc{',
 'dialog.education-paged-dialog[open] .education-paged-text'
])assert.ok(html.includes(css),'Missing mobile scroll/card style: '+css);
{
 const start=boot.indexOf('function educationCleanLessonLine(value){');
 const end=boot.indexOf('\nfunction educationScienceTheoryReader(',start);
 assert.ok(start>=0&&end>start,'Common formatted reader missing');
 class Node{
  constructor(tag){this.tag=tag;this.children=[];this.style={};this.attrs={};this.scrollTop=0;this.hidden=false;this.disabled=false;this.textContent=''}
  append(...items){this.children.push(...items)}
  replaceChildren(...items){this.children=[...items]}
  setAttribute(name,value){this.attrs[name]=value}
  addEventListener(){}
  remove(){}
  showModal(){this.open=true}
  close(){this.open=false}
 }
 const doc={body:new Node('body'),createElement:tag=>new Node(tag),getElementById:()=>null};
 const factory=new Function('document','window','learningLabel','eduAttachPrintAction',
  boot.slice(start,end)+';return {open:educationOpenPagedLesson,clean:educationCleanLessonText};');
 const reader=factory(doc,{innerWidth:390},x=>x,bar=>{bar.printButtonsAttached=true});
 const sample='**Capitol:** Familii și comunități\n\n**Subteme:**\n* Cronologia personală\n- Mărturii și obiecte\n\n'+
  'Istoria familiei explică schimbările dintre generații. '.repeat(44);
 const dialog=reader.open('Trecutul familiei și al comunității · Ce este trecutul familiei?',sample);
 const [head,heading,content,footer]=dialog.children;
 assert.ok(head.printButtonsAttached,'Save and print are inside the paginated reading window');
 assert.equal(heading.tag,'h2','Title has a full-width row separate from actions');
 assert.equal(heading.textContent.includes('familiei'),true);
 assert.ok(content.style.cssText.includes('touch-action:pan-y'),'Blank reading area can be dragged');
 const rendered=(n)=>[n.textContent||'',...(n.children||[]).map(rendered)].flat().join(' ');
 assert.ok(!rendered(content).includes('**'),'No raw Markdown bold tokens visible');
 assert.ok(!rendered(content).includes('* Cronologia'),'No raw Markdown bullet tokens visible');
 assert.ok(head.eduPrintableMaterial().text.includes('• Cronologia'),'PDF exports clean list text');
 assert.ok(!head.eduPrintableMaterial().text.includes('**'),'PDF exports clean typography');
 const [prev,counter,next]=footer.children;
 assert.ok(counter.textContent.includes('1 / '),'Long lesson has multiple pages');
 next.onclick();assert.ok(counter.textContent.includes('2 / '),'Next shows page two');
 assert.equal(content.scrollTop,0,'Changing page resets text scroll');
 prev.onclick();assert.ok(counter.textContent.includes('1 / '),'Previous restores page one');
}
{
 const start=boot.indexOf('function hgGuaranteedSections(topic){');
 const end=boot.indexOf('\nfunction hgShowCoreLesson(',start);
 assert.ok(start>=0&&end>start,'History/Geography safe curriculum sections missing');
 const make=new Function('hgLessonSections','hgL','hgThemeFold','hgJourney','hgCountry','educationCountrySelection','buildHgThemeGuide',
  boot.slice(start,end)+';return hgGuaranteedSections;');
 const normalized=x=>String(x||'').normalize('NFD').replace(/[^\x00-\x7F]/g,'').toLowerCase();
 const ready=make(()=>{throw Error('simulate unavailable chapter guide')},x=>x,normalized,
  {subject:'geography',country:'RO',grade:'5',otherCountry:''},()=>({ro:'România',en:'Romania'}),
  {label:'România'},()=>[]);
 for(const [id,ro,en] of [
  ['geo5-world','Pământul și reprezentarea lui','Earth and its representation'],
  ['ro6-enlight','Iluminism, revoluții și drepturi','Enlightenment, revolutions and rights'],
  ['geo-earth','Structura internă a Pământului',"Earth's interior"]]){
  const rows=ready({id,ro,en,query:'Studiu local'});
  assert.ok(rows.length>=3,'No empty chapter even if dynamic guide fails: '+ro);
  assert.ok(rows.every(x=>x[0]?.length>9&&x[1]?.length>80),'Every chapter has teachable material: '+ro);
 }
}

console.log('PASS curriculum: England Year 1–13 study topics, Year 7 computing, offline theory, compact year picker, browser boot');
