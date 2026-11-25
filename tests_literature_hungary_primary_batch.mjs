import assert from 'node:assert/strict';
import vm from 'node:vm';
import {LIT_HU_PRIMARY_BATCH,literatureHungaryPrimaryMaterial} from './literature_hungary_primary_batch.mjs';
import {LIT_EU_PROGRAMS} from './literature_curriculum_europe.mjs';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';

const keys=['year-focus','year-reading','year-writing'];
const embedded=JSON.parse(JSON.stringify(LIT_EU_PROGRAMS));
for(const grade of ['2','3','4'])for(const part of keys){
 const topicKey=`hu-beginner-${grade}-${part}`;
 assert.ok(embedded.HU.byGrade[grade].some(row=>row[0]===topicKey),'Must match the actual national chapter ID');
 for(const language of ['ro','en','hu']){
  const row=LIT_HU_PRIMARY_BATCH[grade].chapters[part][language];
  assert.equal(row[2].length,5);assert.equal(row[3].length,5);
  assert.notDeepEqual(row[2],row[3],'Practice test must use a different set of questions');
  for(const mode of ['lesson','examples','exercises','test']){
   const result=literatureHungaryPrimaryMaterial({country:'HU',stage:'beginner',grade,topicKey,language,mode});
   assert.equal(result?.origin,'authored_hungary_primary_batch');
   assert.ok(result.text.includes(LIT_HU_PRIMARY_BATCH[grade].sample),'Display actual Hungarian passage');
   if(['lesson','examples'].includes(mode))assert.ok(result.text.includes(LIT_HU_PRIMARY_BATCH[grade].meaning[language]));
   else{
    assert.equal((result.text.match(/^\d+\. /gm)||[]).length,5);
    assert.ok(!result.text.includes(LIT_HU_PRIMARY_BATCH[grade].meaning[language]),'Do not reveal the worked explanation in assessment');
    for(const task of row[mode==='test'?3:2])assert.ok(result.text.includes(task));
   }
  }
 }
}
const opts={country:'HU',stage:'beginner',grade:'2',topicKey:'hu-beginner-2-year-focus',language:'hu',mode:'lesson'};
for(const change of [{country:'RO'},{stage:'lower'},{grade:'3'},{topicKey:'hu-beginner-2-language-1'},{language:'fr'},{mode:'correction'}])
 assert.equal(literatureHungaryPrimaryMaterial({...opts,...change}),null);
let calls=0,key=opts.topicKey;
const journey={country:'HU',level:'beginner',grade:'2',branch:'program',topic:key+'-0',track:'TC',region:'',language:'hu',busy:false};
const cfg={litJourney:journey,state:{language:'ro'},litProgram:()=>({verified:false,units:[{id:journey.topic,topic:'genres'}]}),
 litCurrentTopic:()=>[key,'Year chapter','Year chapter',''],LIT_LANGUAGES:[['ro','Română','Romanian'],['en','Engleză','English'],['hu','Maghiară','Hungarian']],
 LIT_OFFLINE_THEORY_DATA:{},learningLabel:(ro,en)=>ro,educationCountrySelection:{label:'Ungaria'},CLIENT_CONFIG:{apiUrl:'/api'},
 document:{createElement:tag=>({tagName:tag.toUpperCase(),textContent:''})},AbortController,setTimeout,clearTimeout,
 fetch:async()=>{calls++;throw new TypeError('Failed to fetch')}};
cfg.__huPrimary=LIT_HU_PRIMARY_BATCH;
const ui=vm.runInNewContext(LITERATURE_TASK_UI_SCRIPT+'\nObject.assign(LIT_HU_PRIMARY_BATCH,__huPrimary);\n({generate:litSimpleGenerate})',cfg);
const element=()=>({textContent:'',append(node){this.textContent+=node.textContent}});
for(const grade of ['2','3','4'])for(const part of keys)for(const language of ['ro','en','hu'])for(const mode of ['lesson','examples','exercises','test']){
 journey.grade=grade;key=`hu-beginner-${grade}-${part}`;journey.topic=key+'-0';cfg.state.language=language;
 let text='';await ui.generate(element(),element(),mode,'task','',x=>{text=x});
 assert.ok(text.includes(LIT_HU_PRIMARY_BATCH[grade].sample),`${grade}/${part}/${language}/${mode}`);
 assert.equal(journey.busy,false);
}
assert.equal(calls,0,'A supported specific lesson is served offline without an AI request');
console.log('PASS HU primary batch: 9 specific chapters, RO/EN/HU, distinct exercises/tests and real serialized-client offline routing');
