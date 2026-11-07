import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {patchAvatarLipSync} from './scripts/patch-avatar-lipsync.mjs';

const source=fs.readFileSync('public/avatar-v4.html','utf8');
const patched=patchAvatarLipSync(source);
assert.ok(patched.length>=source.length,'only the tiny animation logic changes');
assert.equal(patchAvatarLipSync(patched),patched,'deployment patch is idempotent');
assert.ok(patched.includes('state.morphWeights.set(shapes.X)'),'direct morph closure is present');
assert.ok(!patched.includes('idx=Math.max(0,words.length-3)'),'no more recycling the final two/three words');
const stopStart=patched.indexOf('function stopSpeech(){');
const stopEnd=patched.indexOf('function setWordBoundary(',stopStart);
const tickStart=patched.indexOf('function mouthTick(ms){');
const tickEnd=patched.indexOf('function setVisible(',tickStart);
assert.ok(stopStart>0&&stopEnd>stopStart&&tickStart>stopEnd&&tickEnd>tickStart);
const shapes={X:[0,0,0,0,0,.84,0],A:[0,0,0,0,0,.97,0],
 B:[.12,.1,0,.14,0,.05,0],C:[.44,.33,0,.21,0,0,0],
 D:[.62,.64,0,.12,0,0,0],E:[.35,.36,.62,0,0,0,0],
 F:[.14,.18,.76,0,.08,0,0],G:[.38,.04,0,0,.72,0,0],
 H:[.36,.34,0,0,0,0,.75]};
const names=['UpperLipRaise','LowerLipDrop','LipPucker','MouthWide','Labiodental','LipSeal','TongueRaise'];
const state={speaking:true,wordBoundarySeen:false,wordIndex:1,wordStart:0,
 speechText:'salut lume',words:['salut','lume'],targetWeights:new Float32Array(7),
 morphWeights:new Float32Array(7)};
const mesh={morphTargetDictionary:Object.fromEntries(names.map((x,i)=>[x,i])),
 morphTargetInfluences:Array(7).fill(0)};
const api=vm.runInNewContext(patched.slice(stopStart,stopEnd)+'\n'+patched.slice(tickStart,tickEnd)+
 '\n({stopSpeech,mouthTick})',{
 state,shapes,names,meshes:[mesh],setStatus:()=>{},mouthShape:()=> 'C',Math
});
api.mouthTick(30);
assert.notEqual(state.targetWeights[0],0,'mouth may still articulate during speech');
state.targetWeights.fill(.4);state.morphWeights.fill(.4);mesh.morphTargetInfluences.fill(.4);
api.stopSpeech();
assert.equal(state.speaking,false);
assert.equal(state.words.length,0,'speech word list is cleared');
assert.deepEqual(Array.from(state.targetWeights),Array.from(new Float32Array(shapes.X)));
assert.deepEqual(Array.from(state.morphWeights),Array.from(new Float32Array(shapes.X)));
assert.deepEqual(mesh.morphTargetInfluences,Array.from(new Float32Array(shapes.X)),
 'mesh receives closed shape without extra frames');
state.speaking=true;state.words=['Salut','lume'];state.wordIndex=1;
state.wordStart=0;state.wordBoundarySeen=false;state.targetWeights.fill(.4);
api.mouthTick(1800);
assert.deepEqual(Array.from(state.targetWeights),Array.from(new Float32Array(shapes.X)),
 'no looping of last words without speech boundaries');
state.wordBoundarySeen=true;state.wordIndex=1;state.wordStart=200;state.targetWeights.fill(.4);
api.mouthTick(1800);
assert.deepEqual(Array.from(state.targetWeights),Array.from(new Float32Array(shapes.X)),
 'last Android word boundary has a definitive terminal rest');
const native=fs.readFileSync('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java','utf8');
assert.match(native, /onRangeStart\(String id,int start,int end,int frame\)/,
 'native TTS progress is used');
assert.match(native, /activeTtsUtteranceId=null/,'stale utterances are invalidated');
const frontend=fs.readFileSync('index.js','utf8');
assert.match(frontend,/avatar3dSend\('boundary',\{charIndex:Number\(data\.text\)\|\|0\}\)/,
 'browser forwards native word boundaries');
assert.match(frontend,/pocketNativeSpokenText=prepareSpeechText\(text\)/,
 'boundary indices match actual TTS text');
const gradle=fs.readFileSync('android/app/build.gradle','utf8');
const cloudflare=fs.readFileSync('.github/workflows/deploy-cloudflare.yml','utf8');
assert.match(gradle,/patch-avatar-lipsync\.mjs/);
assert.match(cloudflare,/patch-avatar-lipsync\.mjs public\/avatar-v4\.html/);
console.log('PASS avatar stops immediately and does not flap after final spoken word (Android + Cloudflare)');
