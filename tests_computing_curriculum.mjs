import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {COMPUTING_LEVELS,COMPUTING_PATHS,COMPUTING_TOPICS,computingCoverage,computingPaths,computingTopics,computingTopic,computingQuizCheck} from './computing_curriculum.mjs';
import {COMPUTING_UI_SCRIPT} from './computing_ui.mjs';

const levels=new Set(COMPUTING_LEVELS.map(x=>x.id));
assert.deepEqual([...levels].sort(),['advanced','beginner','lower','medium']);
assert.equal(COMPUTING_PATHS.length,20);
assert.equal(COMPUTING_TOPICS.length,74);
assert.deepEqual(computingCoverage(),{
 beginner:{paths:4,topics:12},
 medium:{paths:5,topics:24},
 lower:{paths:3,topics:9},
 advanced:{paths:8,topics:29}
});
const paths=new Set(),topics=new Set();
for(const path of COMPUTING_PATHS){
 assert.ok(levels.has(path.level),'Unknown level: '+path.id);
 assert.ok(!paths.has(path.id),'Duplicated branch: '+path.id);
 paths.add(path.id);
 assert.ok(computingTopics(path.level,path.id).length>=3,'Unpopulated branch: '+path.id);
}
for(const topic of COMPUTING_TOPICS){
 assert.ok(!topics.has(topic.id),'Duplicated topic: '+topic.id);topics.add(topic.id);
 assert.ok(paths.has(topic.path),'Unknown branch for '+topic.id);
 for(const field of ['ro','en','theory','example','question','practice'])assert.ok(topic[field]?.length>(['ro','en'].includes(field)?2:field==='question'?7:15),'Incomplete lesson: '+topic.id+' '+field);
 assert.equal(topic.choices.length,4,'Exactly four quiz choices');
 assert.ok(topic.choices.every(x=>x.trim()),'Empty choice: '+topic.id);
 assert.ok(Number.isInteger(topic.correct)&&topic.correct>=0&&topic.correct<4,'Invalid correct answer');
 assert.deepEqual(computingQuizCheck(topic,topic.correct),{correct:true,expected:topic.choices[topic.correct]});
 for(let n=0;n<4;n++)if(n!==topic.correct)assert.equal(computingQuizCheck(topic,n).correct,false);
 assert.equal(computingTopic(COMPUTING_PATHS.find(x=>x.id===topic.path).level,topic.path,topic.id).id,topic.id);
}
assert.equal(computingTopic('beginner','devices','graphs'),null,'Branch isolation');
assert.equal(computingPaths('advanced').length,8);

const response=await app.fetch(new Request('https://boot-check.test/'));
assert.equal(response.status,200);
const html=await response.text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script&&script.length>100000);
new vm.Script(script,{filename:'pocket-computing-frontend.js'});
for(const token of [
 'function computingOpen(stage)','function computingWorkspace(panel)','function computingBack()',
 'function computingVoiceHandleAndroid(data)','function computingPhotoReview(raw)',
 'function computingStopRequest()','function computingChoices(panel,items,onSelect)',
 "if(key==='computing'){computingOpen('levels');return}",
 "if(root.classList.contains('learning-active')&&root.classList.contains('learning-computing'))",
 "if(activeLearningSubject[0]==='computing'&&computingJourney.stage==='workspace')",
 "if(computingVoiceHandleAndroid(data))return;",
 "'computing-printable'","state.speaking?learningLabel('Oprește','Stop')",
 "function eduOpenPrint(mode='save')"
])assert.ok(script.includes(token),'Missing computing UI integration: '+token);
assert.match(COMPUTING_UI_SCRIPT,/signal:controller.signal/,'Cancellation abort signal wired to request');
assert.match(COMPUTING_UI_SCRIPT,/Codul nu a fost executat/,'No false code-execution claim');
assert.match(COMPUTING_UI_SCRIPT,/\.slice\(offset,offset\+4\)/,'Maximum four choices displayed');
assert.match(COMPUTING_UI_SCRIPT,/data\.status==='recognized'/,'Android dictation review');

// Language selection must not silently send non-English speech to the English recognizer.
assert.match(COMPUTING_UI_SCRIPT,/function computingSpeechLocale\(\)/,'Speech locale helper is present');
assert.match(COMPUTING_UI_SCRIPT,/function computingLabel\(ro,en\)/,'Localized Computing labels are enabled');
const labelFor=new Function('state',COMPUTING_UI_SCRIPT+';return computingLabel;');
for(const language of ['ro','en','fr','de','it','es','pt','nl','ru','pl']){
 const label=labelFor({language});
 assert.ok(label('Alege nivelul','Choose level'),'Localized level title: '+language);
 assert.ok(label('🧩 Rezolvă pas cu pas','🧩 Solve step by step'),'Localized solve button: '+language);
}
assert.equal(labelFor({language:'fr'})('Alege nivelul','Choose level'),'Choisir le niveau');
assert.equal(labelFor({language:'de'})('Alege nivelul','Choose level'),'Niveau wählen');

assert.match(COMPUTING_UI_SCRIPT,/language:computingSpeechLocale\(\)/,'Dictation uses the selected locale');
const voiceLocale=new Function('state',COMPUTING_UI_SCRIPT+';return computingSpeechLocale;');
const responseLanguage=new Function('state',COMPUTING_UI_SCRIPT+';return computingResponseLanguage;');
for(const [language,locale,label] of [
 ['ro','ro-RO','română'],['en','en-GB','engleză'],['fr','fr-FR','franceză'],
 ['de','de-DE','germană'],['it','it-IT','italiană'],['es','es-ES','spaniolă'],
 ['pt','pt-PT','portugheză'],['nl','nl-NL','neerlandeză'],['ru','ru-RU','rusă'],
 ['pl','pl-PL','poloneză']]){
 assert.equal(voiceLocale({language}),locale,'Speech recognition locale: '+language);
 assert.equal(responseLanguage({language}),label,'Explicit AI response language: '+language);
}
assert.match(COMPUTING_UI_SCRIPT,/Evită traducerile literale/,'AI requests natural terminology');
assert.doesNotMatch(COMPUTING_UI_SCRIPT,/Nu inventa output/,'No untranslated output jargon in AI prompt');

assert.match(html,/#view-module\.learning-computing #moduleChatHost(?:,|\{display:none!important\})/,'Computing hides the duplicate assistant chat');
assert.match(script,/\.computing-printable','\.computing-ai-result'/,'Computing PDFs include both lesson and AI answer');
assert.match(COMPUTING_UI_SCRIPT,/computingNewConversation/,'New conversation action belongs to Computing workspace');
assert.match(COMPUTING_UI_SCRIPT,/computingOpen\('workspace'\);/,'New conversation reconstructs clean workspace without changing chapter');
assert.match(COMPUTING_UI_SCRIPT,/function computingRenderAnswer\(host,text\)/,'AI output uses a Markdown-aware safe renderer');
assert.match(COMPUTING_UI_SCRIPT,/computingRenderAnswer\(output,String\(data\.reply\)/,'AI answer rendered once');
assert.doesNotMatch(COMPUTING_UI_SCRIPT,/printable\.append\(generated\)/,'Duplicate AI paragraph is not appended to lesson');
assert.match(COMPUTING_UI_SCRIPT,/id='computingNextLesson'/,'Correct quiz exposes next chapter control');
assert.match(COMPUTING_UI_SCRIPT,/computingJourney\.topic=nextTopic\.id;computingOpen\('workspace'\)/,'Quiz continuation advances to next chapter');
assert.match(COMPUTING_UI_SCRIPT,/if\(!editor\.value\.trim\(\)&&!state\.speaking\)/,'Auto progress after correct answer without losing written code or interrupting narration');
assert.match(COMPUTING_UI_SCRIPT,/answers\.querySelectorAll\('button'\)\.forEach\(item=>item\.disabled=true\)/,'Completed quiz cannot be resubmitted');
// DOM-light rendering check: format assistant headings without corrupting Python **.
class MockNode {
 constructor(tag){this.tagName=tag;this.children=[];this._text='';this.style={cssText:''};this.className=''}
 set textContent(value){this._text=String(value||'');this.children=[]}
 get textContent(){return this._text+this.children.map(x=>x.textContent||'').join('')}
 append(...nodes){this.children.push(...nodes)}
 replaceChildren(...nodes){this._text='';this.children=[...nodes]}
}
const mockDocument={createElement(tag){return new MockNode(tag)}};
const renderComputingAnswer=new Function('document',COMPUTING_UI_SCRIPT+';return computingRenderAnswer;')(mockDocument);
const rendered=new MockNode('div');
renderComputingAnswer(rendered,'**Exercițiu:**\nCalculează x**2, nu x2.\n\n'+String.fromCharCode(96).repeat(3)+'python\nx = 2**3\n'+String.fromCharCode(96).repeat(3)+'\n\n* Pasul 1\n* Pasul 2');
assert.ok(rendered.children.some(n=>n.tagName==='h3'&&n.textContent==='Exercițiu:'),'Markdown heading rendered');
assert.ok(rendered.children.some(n=>n.tagName==='pre'&&n.textContent.includes('2**3')),'Python exponentiation preserved in code');
assert.ok(rendered.textContent.includes('x**2'),'Python exponentiation preserved in prose');
assert.ok(!rendered.textContent.includes('**Exercițiu:**'),'Markdown formatting stripped from heading only');
assert.equal(rendered.children.filter(n=>n.tagName==='ul').length,1,'Bullets presented as a list');
console.log('PASS Computing: 4 educational pathways, 20 branches, 74 quizzes, lower-secondary isolation, navigation, PDF, voice and full boot script.');
