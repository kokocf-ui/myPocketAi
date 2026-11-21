import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {SCIENCE_EXACT_REFERENCE,scienceCheckExactExercise} from './science_exercise_verification.mjs';

const check=(subject,topic,answer,language='ro')=>
 scienceCheckExactExercise({subject,topic,answer,language});
for(const [subject,topic,answer,bad,unit] of [
 ['physics','units','0,75 m','0,76 m','0,75'],
 ['physics','kinematics','4 m/s','6 m/s','4'],
 ['physics','electric','3 A','2 A','3'],
 ['chemistry','solutions','4%','5%','4']
]){
 assert.equal(check(subject,topic,answer).status,'correct',subject+'/'+topic+' correct');
 assert.equal(check(subject,topic,bad).status,'incorrect',subject+'/'+topic+' incorrect');
 assert.equal(check(subject,topic,unit).status,'needs-unit',subject+'/'+topic+' requires unit');
 assert.ok(check(subject,topic,bad).feedback.length>=35,'explanation on incorrect result');
}
assert.equal(Object.keys(SCIENCE_EXACT_REFERENCE).length,4,'only backed numeric questions');
assert.equal(check('biology','cells','Celula vegetală are perete celular.').status,'requires-assessment',
 'Do not mark free-text answers correct by simple keyword heuristics');
assert.equal(check('astronomy','stars','Nu știu.').status,'requires-assessment');
assert.equal(check('physics','units','0.75 m și 0.8 m').status,'requires-assessment',
 'Conflicting numeric results require one clear answer');
assert.equal(check('physics','units','').status,'empty');
assert.equal(check('physics','kinematics','v = 200 + 50 = 4 m/s').status,'requires-assessment',
 'A fabricated method must not be marked correct just because the last number is right');
assert.equal(check('physics','electric','I = 9 / 3 = 3 A').status,'requires-assessment',
 'Worked steps need a holistic rubric');
assert.equal(check('physics','kinematics','4 metres per second','en').status,'correct');
assert.equal(check('chemistry','solutions','4 percent','en').status,'correct');
const html=await(await frontend.fetch(new Request('https://science-feedback-test.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'main webview script exists');
new vm.Script(script);
for(const part of [
 'function scienceLessonReviewSpec(){','function scienceAttachLessonReview(dialog){',
 'if(scienceReader)scienceAttachLessonReview(dialog);',
 'scienceCheckExactExercise({','education_activity:\'correction\'',
 'Verifică răspunsul','Evaluare AI orientativă',
 'Grade lesson','SCIENCE_EXACT_REFERENCE'
])assert.ok(script.includes(part),'Science answer-check action must be wired: '+part);

// Exercise the actual browser DOM handlers, not just the presence of source text.
const start=script.indexOf('function scienceLessonReviewSpec(){');
const end=script.indexOf('function educationOpenPagedLesson(title,body){',start);
assert.ok(start>=0&&end>start,'answer review handlers are present');
class FakeElement{
 constructor(tag){this.tag=tag;this.children=[];this.style={display:'none'};
  this.textContent='';this.value='';this.listeners={};this.disabled=false;this.isConnected=true;}
 append(...nodes){this.children.push(...nodes)}
 setAttribute(){}
 addEventListener(name,cb){this.listeners[name]=cb}
 focus(){}
}
const journey={subject:'physics',topic:'kinematics',schoolStage:'lower',grade:'6'};
const reviewState={language:'ro'};
let networkCalls=0;
const reviewEnv={
 document:{createElement:tag=>new FakeElement(tag)},
 scienceJourney:journey,state:reviewState,
 scienceLowerTopicContent:()=>({exercise:'O bicicletă parcurge 200 m în 50 s. Viteza medie?',answer:'4 m/s'}),
 SCIENCE_UNIVERSITY_TRACK_GUIDES:{},SCIENCE_GUIDES:{},SCIENCE_GUIDES_EN:{},
 SCIENCE_EXACT_REFERENCE,scienceCheckExactExercise,
 educationCountrySelection:{label:'România'},
 CLIENT_CONFIG:{apiUrl:'/api/chat'},eduScopePrompt:text=>text,
 AbortController,fetch:async()=>{networkCalls++;return {ok:true,json:async()=>({status:'success',reply:'Parțial corect: justifică formula și unitatea.'})}}
};
const reviewApi=vm.runInNewContext(script.slice(start,end)+
 ';({spec:scienceLessonReviewSpec,attach:scienceAttachLessonReview})',reviewEnv);
let modal=new FakeElement('dialog');
reviewApi.attach(modal);
assert.equal(modal.children.length,1,'one compact review control');
let wrapper=modal.children[0],toggle=wrapper.children[0],panel=wrapper.children[1];
assert.equal(panel.style.display,'none','assessment stays collapsed until requested');
toggle.onclick();
assert.equal(panel.style.display,'flex','assessment opens on demand');
const entry=panel.children[1],verify=panel.children[2],feedback=panel.children[3];
entry.value='4 m/s';
await verify.onclick();
assert.match(feedback.textContent,/Corect/,'correct final result is checked on device');
assert.equal(networkCalls,0,'exact answers must not waste AI calls');
entry.value='5 m/s';
await verify.onclick();
assert.match(feedback.textContent,/nu este corect/,'wrong result receives explanation');
entry.value='v = 200 + 50 = 4 m/s';
await verify.onclick();
assert.match(feedback.textContent,/Parțial corect/,'worked explanation needs contextual assessment');
assert.equal(networkCalls,1,'open response is reviewed once by AI');
journey.subject='biology';journey.topic='cells';
modal=new FakeElement('dialog');reviewApi.attach(modal);
assert.equal(modal.children.length,1,'biology reuses same check mechanism');
modal.children[0].children[1].children[1].value='Nu știu.';
await modal.children[0].children[1].children[2].onclick();
assert.equal(networkCalls,2,'Biology open responses reach contextual assessment');

console.log('PASS Sciences: exact numerical grading + no false open-response certainty + in-lesson review UI');
