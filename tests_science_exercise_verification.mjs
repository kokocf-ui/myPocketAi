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
console.log('PASS Sciences: exact numerical grading + no false open-response certainty + in-lesson review UI');
