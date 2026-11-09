import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {FOREIGN_LANGUAGES,FOREIGN_LEVELS,FOREIGN_TOPICS,FOREIGN_PHRASES,ANCIENT_GREEK_PHRASES,CLASSICAL_LEVELS,languageCourseLevels,languageCoursePhrases,checkStudyAnswer} from './foreign_languages_curriculum.mjs';
import {FOREIGN_TOPIC_EXAMPLES,FOREIGN_CLASSICAL_VARIANTS} from './foreign_languages_examples.mjs';
import {foreignStudyCourseMap,foreignStudyPlan,foreignStudyRubric,foreignStudyReview,foreignStudyDue,foreignStudyPlacementQuestions,foreignStudyPlacementResult} from './foreign_languages_learning.mjs';
assert.equal(FOREIGN_LANGUAGES.length,14,'14 selectable languages including Greek');
assert.equal(new Set(FOREIGN_LANGUAGES.map(x=>x.id)).size,14);
for(const id of ['ro','en','fr','de','it','es','pt','nl','ru','pl','la','zh','ja','el'])assert.ok(FOREIGN_LANGUAGES.find(x=>x.id===id),id);
assert.equal(FOREIGN_LEVELS.length,6);
assert.deepEqual(FOREIGN_LEVELS.map(x=>x.id),['A1','A2','B1','B2','C1','C2']);
assert.equal(FOREIGN_TOPICS.length,8);
assert.equal(CLASSICAL_LEVELS.length,3);
assert.equal(languageCourseLevels('la').length,3);
assert.equal(languageCourseLevels('el','ancient').length,3);
assert.equal(languageCourseLevels('el','modern').length,6);
assert.equal(ANCIENT_GREEK_PHRASES.length,6);
assert.equal(languageCoursePhrases('el','ancient')[1].original,'λόγος');
for(const lang of FOREIGN_LANGUAGES){
 const examples=FOREIGN_PHRASES[lang.id];
 assert.equal(examples.length,6,lang.id+' has starter examples');
 assert.ok(examples.every(x=>x.original&&x.phonetic&&x.meaning&&x.level==='A1'));
}
assert.equal(FOREIGN_PHRASES.zh[0].original,'你好');
assert.match(FOREIGN_PHRASES.zh[0].phonetic,/ǐ/);
assert.equal(FOREIGN_PHRASES.ja[0].original,'こんにちは');
assert.equal(checkStudyAnswer('Hello!','hello'),true);
assert.equal(checkStudyAnswer('Nein','Ja'),false);
assert.equal(FOREIGN_LANGUAGES.find(x=>x.id==='el').variants.length,3);
assert.equal(FOREIGN_CLASSICAL_VARIANTS.koine.length,6);
assert.equal(foreignStudyCourseMap().length,14);
for(const language of FOREIGN_LANGUAGES){
 for(const topic of ['alphabet','vocabulary','grammar','conversation','reading']){
  assert.ok(FOREIGN_TOPIC_EXAMPLES[language.id][topic].every(x=>x.original&&x.phonetic&&x.meaning));
 }
 const variants=language.variants.length?language.variants:['standard'];
 for(const variant of variants){
  const classical=language.id==='la'||language.id==='el'&&['ancient','koine'].includes(variant);
  const levels=classical?CLASSICAL_LEVELS:FOREIGN_LEVELS;
  for(const level of levels)for(const topic of FOREIGN_TOPICS){
   const plan=foreignStudyPlan(language.id,variant,level.id,topic.id);
   assert.equal(plan?.language,language.id);
   assert.ok(plan.goals.length>=3&&plan.topicGoals.length>=3&&plan.exercises.length>=3);
  }
 }
}
assert.equal(foreignStudyPlan('el','koine','foundation','grammar')?.mode,'classical');
assert.equal(foreignStudyPlan('zh','simplified','C2','assessment')?.phonetics,'Pinyin tonal');
assert.equal(foreignStudyRubric('C1').certified,false);
const initial=foreignStudyReview(null,true,0),second=foreignStudyReview(initial,true,86400000);
assert.equal(initial.due,86400000);
assert.equal(second.due,86400000+3*86400000);
assert.deepEqual(foreignStudyDue({one:{due:0},two:{due:10000}},5000),['one']);
const questions=foreignStudyPlacementQuestions('en','GB');
assert.equal(questions.length,6);
assert.equal(foreignStudyPlacementResult(questions.map(x=>x.answer),questions).recommendation,'A1','starter test cannot certify advanced level');
const html=await(await frontend.fetch(new Request('https://foreign-language-regression.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(script);
for(const key of ['FOREIGN_LANGUAGE_DATA','FOREIGN_LEVEL_DATA','FOREIGN_PHRASE_DATA',
 'function languageOpen(stage)','function languagePractice(card)','function languageAIGenerate(request)',
 'function languageSpeak(text)','function languageVoiceHandleAndroid(data)',
 'function languageFullPlacement()','function languageConversationStart(mode)','function languageReviewOpen()',
 "if(key==='languages'){languageOpen('languages');return}"])
 assert.ok(script.includes(key),key);
assert.match(html,/\.foreign-word-card/);
assert.match(script,/if\(languageVoiceHandleAndroid\(data\)\)return/);
const start=script.indexOf('const FOREIGN_LANGUAGE_DATA=');
const end=script.indexOf('function openLearningSubject(key)',start);
assert.ok(start>=0&&end>start);
class FakeEl{
 constructor(tag){this.tag=tag;this.children=[];this.textContent='';this.className='';this.value='';this.style={};this.hidden=false;this.onclick=null;this.attributes={};this.classList={add:(...names)=>{this.className=[this.className,...names].join(' ').trim()},remove:()=>{}};}
 append(...kids){this.children.push(...kids)}
 replaceChildren(...kids){this.children=[...kids]}
 setAttribute(k,v){this.attributes[k]=v}
 querySelector(){return null}
 addEventListener(){}
}
const classes=new Set();
const root={classList:{add:(...a)=>a.forEach(x=>classes.add(x)),remove:(...a)=>a.forEach(x=>classes.delete(x))}};
const host=new FakeEl('div'),title=new FakeEl('h2'),lead=new FakeEl('div');
const lookup={'view-module':root,moduleContent:host,moduleTitle:title,moduleLead:lead};
const sandbox={
 document:{createElement:tag=>new FakeEl(tag),querySelector:()=>null,getElementById:()=>null},
 $:id=>lookup[id]||null,
 LEARNING_SUBJECTS:[['languages','🗣️','Limbi străine','Languages']],
 learningLabel:(ro,en)=>ro,
 pocketNativeVoiceAvailable:()=>false,
 renderLearningSubjects:()=>{},localStorage:{getItem:()=>null,setItem:()=>{}},
 state:{language:'ro'},Math,Date
};
const api=vm.runInNewContext('let activeLearningSubject=null;'+script.slice(start,end)+'\n({open:languageOpen,back:languageBack,journey:languageJourney})',sandbox);
let rows=()=>host.children[1].children.find(x=>x.className?.includes('math-choice-list'))?.children||[];
api.open('languages');assert.equal(rows().length,14);
rows()[13].onclick();assert.equal(api.journey.language,'el');assert.equal(api.journey.stage,'variants');
rows()[1].onclick();assert.equal(api.journey.variant,'ancient');assert.equal(api.journey.stage,'levels');assert.equal(rows().length,3);
rows()[0].onclick();assert.equal(api.journey.stage,'topics');assert.equal(rows().length,8);
rows()[1].onclick();assert.equal(api.journey.stage,'lesson');
assert.ok(host.children[1].children.some(x=>x.className==='foreign-word-card'),'classical original script examples visible');
api.back();assert.equal(api.journey.stage,'topics');
api.open('languages');rows()[1].onclick();assert.equal(api.journey.stage,'variants');rows()[0].onclick();assert.equal(rows().length,6);
console.log('PASS 14 languages, six CEFR tiers, classical branches, original-script transliterations, Android hooks and lesson navigation');
