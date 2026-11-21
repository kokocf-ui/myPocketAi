import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {THEORY_ENTRIES} from './education_theory.mjs';
import {SCIENCE_UNIVERSITY_TRACK_GUIDES} from './science_university_track_guides.mjs';
import {scienceUniversityChapter} from './science_university_chapters.mjs';
import {physicsUniversityTopicUnits,physicsUniversityUnitMaterial} from './physics_university_learning_units.mjs';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {PHYSICS_TOPICS,PHYSICS_SPECIALIZATIONS} from './physics_curriculum.mjs';
import {CHEMISTRY_TOPICS} from './chemistry_curriculum.mjs';
import {CHEMISTRY_SPECIALTY_TOPICS,CHEMISTRY_SPECIALIZATIONS} from './chemistry_advanced.mjs';
import {BIOLOGY_TOPICS,BIOLOGY_SPECIALTY_TOPICS,BIOLOGY_SPECIALIZATIONS} from './biology_curriculum.mjs';
import {ASTRONOMY_TOPICS,ASTRONOMY_SPECIALIZATIONS} from './astronomy_curriculum.mjs';

const subjectRegistry={
 physics:[PHYSICS_TOPICS,PHYSICS_SPECIALIZATIONS],
 chemistry:[[...CHEMISTRY_TOPICS,...CHEMISTRY_SPECIALTY_TOPICS],CHEMISTRY_SPECIALIZATIONS],
 biology:[[...BIOLOGY_TOPICS,...BIOLOGY_SPECIALTY_TOPICS],BIOLOGY_SPECIALIZATIONS],
 astronomy:[ASTRONOMY_TOPICS,ASTRONOMY_SPECIALIZATIONS]
};
let programmes=0,chapters=0,subtopics=0;
for(const [subject,[topics,tracks]] of Object.entries(subjectRegistry)){
 const guide=SCIENCE_UNIVERSITY_TRACK_GUIDES[subject];
 assert.equal(Object.keys(guide).length,tracks.length,subject+' program guide missing');
 for(const programme of tracks){
  const prose=guide[programme.id];
  assert.ok(prose?.ro?.length===4&&prose?.en?.length===4,subject+'/'+programme.id+' needs bilingual authored course');
  assert.ok(prose.ro.every(s=>s.length>=50)&&prose.en.every(s=>s.length>=50),'A track may not be a placeholder');
  const pathway=topics.filter(t=>t.specialty===programme.id||!t.specialty&&programme.core.includes(t.id));
  assert.ok(pathway.filter(t=>t.specialty===programme.id).length>=1,subject+'/'+programme.id+' has no specialist chapters');
  for(const topic of pathway){
   const all=THEORY_ENTRIES.filter(e=>e.subject===subject&&e.topic===topic.id);
   const advanced=all.filter(e=>e.level==='advanced');
   const spec=topic.specialty===programme.id;
   const rows=spec?advanced:
    advanced.concat(all.filter(e=>e.level!=='advanced').slice(0,Math.max(0,3-advanced.length)));
   assert.ok(rows.length>=1,subject+'/'+programme.id+'/'+topic.id+' has no university/core material');
   if(spec)assert.ok(rows.length>=3,subject+'/'+programme.id+'/'+topic.id+' needs detailed specialist subtopics');
   const input={subject,specialty:programme.id,topic:topic.id,chapter:topic.ro,grade:'university',lessons:THEORY_ENTRIES};
   const ro=scienceUniversityChapter({...input,language:'ro'});
   const en=scienceUniversityChapter({...input,language:'en',chapter:topic.en});
   assert.ok(ro?.length>600&&en?.length>600,'University full text too short: '+subject+'/'+topic.id);
   assert.ok(ro.includes(prose.ro[1])&&en.includes(prose.en[1]),'Selected specialisation case is required');
   assert.ok(ro.includes(topic.ro)&&en.includes(topic.en),'Real chapter context must be explicit');
   assert.match(ro,/program acreditat/,'Advisory programme must not be presented as certified');
   assert.match(en,/translation not verified/,'English source caveat must be explicit');
   for(const row of rows){
    assert.ok(ro.includes(row.statement),'No Romanian subtopic may disappear from the chapter');
    assert.ok(en.includes(row.statement),'English fallback must preserve source evidence without inventing a translation');
    if(row.formula&&row.formula!=='—'){
     assert.ok(ro.includes(row.formula),'Preserve specialist notation');
     assert.ok(en.includes(row.formula),'Preserve technical symbols');
    }
   }
   chapters++;
   subtopics+=rows.length;
  }
  programmes++;
 }
}
assert.equal(programmes,30,'Every University specialisation across the Sciences');
assert.equal(EDUCATION_EUROPE_COUNTRIES.length,50);
for(const country of EDUCATION_EUROPE_COUNTRIES){
 const school=educationCountrySchoolYears(country,'advanced');
 assert.ok(Array.isArray(school.years)&&school.years.length>=1,country+' university route is not navigable');
}
assert.equal(scienceUniversityChapter({subject:'chemistry',topic:'does-not-exist',lessons:THEORY_ENTRIES}),null,
 'Do not invent a lesson for missing specialist source material');
const html=await(await frontend.fetch(new Request('https://science-university-integrated.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
assert.ok(script.length>100000,'Android WebView bootstrap missing');
new vm.Script(script);
assert.ok(script.includes('const SCIENCE_UNIVERSITY_TRACK_GUIDES=')&&script.includes('const SCIENCE_UNIVERSITY_CHAPTER='),
 'Full university course must be embedded into the Android application, not only imported in Node');
for(const marker of [
 "const scienceReader=Boolean(document.querySelector?.('#view-module.learning-science'));",
 "const started=speakText(pages[page]);",
 "const playing=readingThisPage&&state.speaking;",
  "readPageButton.textContent=playing?",
 "prev.onclick=()=>{if(page>0){stopPageAudio();page--;paint()}};",
 "next.onclick=()=>{if(page<pages.length-1){stopPageAudio();page++;paint()}};",
 "dialog.addEventListener('close',()=>{stopPageAudio();if(scienceReader)window.removeEventListener('pocket-speech-state',updatePageSpeech);dialog.remove()});"
])assert.ok(script.includes(marker),'Missing Science audio page start/stop lifecycle: '+marker);
const start=script.indexOf('function educationScienceTheoryReader('),end=script.indexOf('function scienceOpenChemistrySection(',start);
assert.ok(start>=0&&end>start);
const opened=[],state={language:'ro'},journey={level:'advanced',schoolStage:'advanced',specialty:'quantum',grade:'University year 1'};
const topic=PHYSICS_TOPICS.find(t=>t.id==='special-quantum');
const makeElement=tag=>({tag,children:[],style:{},textContent:'',
 classList:{add(){}},append(...parts){this.children.push(...parts)}});
const context={
 document:{createElement:makeElement},state,scienceJourney:journey,
 EDUCATION_THEORY_DATA:THEORY_ENTRIES,scienceTopicInfo:()=>topic,
 SCIENCE_UNIVERSITY_CHAPTER:scienceUniversityChapter,
 physicsUniversityTopicUnits,physicsUniversityUnitMaterial,
 learningLabel:(ro,en)=>state.language==='ro'?ro:en,
 educationOpenPagedLesson:(title,material)=>opened.push({title,material})
};
const ui=vm.runInNewContext('let physicsUniversitySelectedLessonIndex=0;let sciencePendingAssessmentSpec=null;'+
 script.slice(start,end)+';({render:educationScienceTheoryReader,pending:()=>sciencePendingAssessmentSpec})',context);
let screen=ui.render('physics','special-quantum','advanced');
assert.equal(screen.children.length,2,'University Physics must show a heading plus real lesson list');
assert.equal(screen.children[1].children.length,4,'Four distinct specialist studies must be selectable');
screen.children[1].children[0].onclick();
assert.ok(opened.at(-1).material.includes('Lungimea de undă de Broglie'));
assert.ok(opened.at(-1).material.includes('Formula de pornire'));
assert.equal(ui.pending(),null,'Answer review state must be cleared');
screen.children[1].children[1].onclick();
assert.notEqual(opened.at(-1).title,opened.at(-2).title,'Different university studies must open different pages');
state.language='en';
screen=ui.render('physics','special-quantum','advanced');
assert.equal(screen.children[1].children.length,4);
screen.children[1].children[0].onclick();
assert.ok(opened.at(-1).material.includes('De Broglie wavelength'));
assert.ok(opened.at(-1).material.includes('Starting formula'));
context.EDUCATION_THEORY_DATA=[];
screen=ui.render('physics','special-quantum','advanced');
assert.equal(screen.children[1].children.length,4,
 'University Physics authored specialist lessons must not disappear when a generic theory bank is unavailable');
const other=ui.render('chemistry','does-not-exist','advanced');
assert.equal(other.children[1].tag,'p','Unmapped other Science chapter must not be invented');
assert.match(script,/const wasSpeaking=state\.speaking/,'Speech stop captures active state');
assert.match(script,/if\(wasSpeaking&&avatarOverlay\.classList\.contains\('visible'\)&&!pocketExitOpen\)hideAvatar\(\)/,'Stop must dismiss visible avatar outside exit prompt');
assert.match(script,/function updatePageSpeech\(\)|const updatePageSpeech=\(\)=>/,'Lesson reader must sync play state');
assert.match(script,/window\.addEventListener\('pocket-speech-state',updatePageSpeech\)/,'Playback completion updates button');
assert.match(script,/window\.removeEventListener\('pocket-speech-state',updatePageSpeech\)/,'Lesson reader removes speech listener when closed');
console.log('PASS Sciences University: '+programmes+' specialisations, '+chapters+' nonempty programme chapters, '+subtopics+' real subtopics, all 50 school systems; full paginated Android reader');
