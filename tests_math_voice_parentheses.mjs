import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import frontend from './index.js';

const html=await(await frontend.fetch(new Request('https://fixture/'))).text();
const embedded=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(embedded,'embedded frontend code exists');
const from=embedded.indexOf('function mathSpokenToFormula(');
const to=embedded.indexOf('\nfunction mathVoiceHandleAndroid(',from);
assert.ok(from>=0&&to>from,'spoken maths parser exists');
const sandbox={collapseRepeatedVoiceWords:value=>String(value||'').replace(/\b([\p{L}]+)(?:\s+\1\b)+/giu,'$1')};
const convert=vm.runInNewContext(embedded.slice(from,to)+'\nmathSpokenToFormula',sandbox);

for(const [spoken,formula] of [
 ['deschide paranteză','('],
 ['deschide o paranteză','('],
 ['paranteză deschisă','('],
 ['închide paranteză',')'],
 ['închide o paranteză',')'],
 ['paranteză închisă',')'],
 ['înmulțit cu','*'],
 ['împărțit la','/'],
 ['doi plus trei','2 + 3'],
 ['deschide paranteză doi plus trei închide paranteză ori patru','( 2 + 3 ) * 4']
]) assert.equal(convert(spoken),formula,spoken);

const native=fs.readFileSync('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java','utf8');
assert.match(native,/"math"\.equals\(speechMode\)\)return;/,'math speech bypasses short endpoint');
assert.match(native,/mathDictation\?4800L:2200L/,'math uses longer silence hints');
assert.match(embedded,/function mathVoiceRestart\(session,/,'math resumes after an Android recognition segment');
assert.match(embedded,/if\(mathVoiceListening\)\{[\s\S]*?mathVoiceStop\(\)/,'user can stop ongoing math dictation');
console.log('PASS math voice parentheses, arithmetic, and continuous listening contracts');
