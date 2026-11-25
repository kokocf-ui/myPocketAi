import assert from 'node:assert/strict';
import vm from 'node:vm';
import {LIT_HU_GRADE1_CHAPTERS,literatureHungaryGrade1Material} from './literature_hungary_grade1.mjs';
import {LIT_EU_PROGRAMS} from './literature_curriculum_europe.mjs';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';

const keys=['hu-beginner-1-year-focus','hu-beginner-1-year-reading','hu-beginner-1-year-writing'];
const rows=JSON.parse(JSON.stringify(LIT_EU_PROGRAMS)).HU.byGrade['1'];
for(const key of keys){
 assert.ok(rows.some(row=>row[0]===key),'Authored chapter must exist in the actual embedded HU grade picker');
 for(const language of ['ro','en','hu'])for(const mode of ['lesson','examples','exercises','test']){
  const result=literatureHungaryGrade1Material({country:'HU',stage:'beginner',grade:'1',topicKey:key,language,mode});
  assert.equal(result?.origin,'authored_hungary_grade1');
  assert.ok(result.text.includes(LIT_HU_GRADE1_CHAPTERS[key][language].sample));
  if(['lesson','examples'].includes(mode))assert.ok(result.text.includes(LIT_HU_GRADE1_CHAPTERS[key][language].worked));
  else{
   assert.equal((result.text.match(/^\d+\. /gm)||[]).length,5);
   assert.ok(!result.text.includes(LIT_HU_GRADE1_CHAPTERS[key][language].worked),'No solution before answering');
  }
 }
}
assert.equal(literatureHungaryGrade1Material({country:'RO',stage:'beginner',grade:'1',topicKey:keys[0],language:'ro',mode:'lesson'}),null);
assert.equal(literatureHungaryGrade1Material({country:'HU',stage:'beginner',grade:'2',topicKey:keys[0],language:'ro',mode:'lesson'}),null);
assert.equal(literatureHungaryGrade1Material({country:'HU',stage:'beginner',grade:'1',topicKey:keys[0],language:'fr',mode:'lesson'}),null);
assert.equal(literatureHungaryGrade1Material({country:'HU',stage:'beginner',grade:'1',topicKey:keys[0],language:'ro',mode:'correction'}),null);

const journey={country:'HU',level:'beginner',grade:'1',branch:'program',topic:keys[0]+'-0',track:'TC',region:'',language:'hu',busy:false};
let key=keys[0],requests=0;
const cfg={litJourney:journey,state:{language:'ro'},
 litProgram:()=>({verified:false,units:[{id:journey.topic,topic:'genres'}]}),
 litCurrentTopic:()=>[key,'Magyar','Magyar',''],
 LIT_LANGUAGES:[['ro','Română','Romanian'],['en','Engleză','English'],['hu','Maghiară','Hungarian']],
 LIT_OFFLINE_THEORY_DATA:{},learningLabel:(ro,en)=>ro,
 educationCountrySelection:{label:'Ungaria'},CLIENT_CONFIG:{apiUrl:'/api'},
 document:{createElement:tag=>({tagName:tag.toUpperCase(),textContent:''})},
 AbortController,setTimeout,clearTimeout,fetch:async()=>{requests++;throw new TypeError('Failed to fetch')}
};
cfg.__huGrade1=LIT_HU_GRADE1_CHAPTERS;
const ui=vm.runInNewContext(LITERATURE_TASK_UI_SCRIPT+'\nObject.assign(LIT_HU_GRADE1_CHAPTERS,__huGrade1);\n({generate:litSimpleGenerate})',cfg);
const el=()=>({textContent:'',append(node){this.textContent+=node.textContent}});
for(const language of ['ro','en','hu'])for(const k of keys)for(const mode of ['lesson','examples','exercises','test']){
 cfg.state.language=language;key=k;journey.topic=k+'-0';
 const out=el(),status=el();let shown='';
 await ui.generate(out,status,mode,'task','',text=>{shown=text});
 assert.ok(shown.includes(LIT_HU_GRADE1_CHAPTERS[k][language].sample));
 assert.equal(journey.busy,false);
}
assert.equal(requests,0,'Supported local HU lessons must not invoke the online service');
// Wrong grade and correction must not accidentally reuse first-grade answers.
journey.grade='2';cfg.state.language='ro';let shown='';
await ui.generate(el(),el(),'correction','answer','',text=>{shown=text});
assert.equal(requests,1);assert.equal(shown,'');
console.log('PASS HU first-grade year-focus, reading and writing: RO/EN/HU, four activities, topic identity, offline client routing and guards');
