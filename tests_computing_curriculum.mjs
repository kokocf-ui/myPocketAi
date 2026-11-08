import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {COMPUTING_LEVELS,COMPUTING_PATHS,COMPUTING_TOPICS,computingCoverage,computingPaths,computingTopics,computingTopic,computingQuizCheck} from './computing_curriculum.mjs';
import {COMPUTING_UI_SCRIPT} from './computing_ui.mjs';

const levels=new Set(COMPUTING_LEVELS.map(x=>x.id));
assert.deepEqual([...levels].sort(),['advanced','beginner','medium']);
assert.equal(COMPUTING_PATHS.length,17);
assert.equal(COMPUTING_TOPICS.length,65);
assert.deepEqual(computingCoverage(),{
 beginner:{paths:4,topics:12},
 medium:{paths:5,topics:24},
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
 for(const field of ['ro','en','theory','example','question','practice'])assert.ok(topic[field]?.length>15,'Incomplete lesson: '+topic.id+' '+field);
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
console.log('PASS Computing: 3 levels, 17 populated branches, 65 quizzes, navigation, PDF, OCR, voice, AI and full boot script.');
