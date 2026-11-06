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
 ['paranteză rotundă','('],
 ['închide paranteza rotundă',')'],
 ['deschide paranteza rotundă','('],
 ['paranteză rotundă închisă',')'],
 ['paranteză pătrată','['],
 ['deschide paranteza pătrată','['],
 ['închide paranteza pătrată',']'],
 ['paranteză dreaptă','['],
 ['închide paranteza dreaptă',']'],
 ['acoladă','{'],
 ['deschide acolada','{'],
 ['închide acolada','}'],
 ['acoladă închisă','}'],
 ['paranteză pătrată doi plus trei închide paranteza pătrată ori cinci','[ 2 + 3 ] * 5'],
 ['acoladă paranteză rotundă doi plus trei închide paranteza rotundă închide acolada','{ ( 2 + 3 ) }'],
 ['paranteză','('],
 ['paranteză deschisă','('],
 ['paranteză închisă',')'],
 ['paranteză rotundă deschisă','('],
 ['paranteză pătrată închisă',']'],
 ['()','('],
 ['() deschisa','('],
 ['() inchisa',')'],
 ['[]','['],
 ['[] deschisa','['],
 ['[] inchisa',']'],
 ['{}','{'],
 ['{} deschisa','{'],
 ['{} inchisa','}'],
 ['() deschisa [] {}','( [ {'],
 ['minus unu','-1'],
 ['minus 1','-1'],
 ['negativ unu','-1'],
 ['unu','1'],
 ['3 * minus unu + 5 = 20','3 * -1 + 5 = 20'],
 ['3 * - 1 + 5 = 20','3 * -1 + 5 = 20'],
 ['trei ori minus unu','3 * -1'],
 ['cinci minus unu','5 - 1'],
 ['paranteză rotundă minus unu închide paranteza rotundă','( -1 )'],
 ['deschide paranteză doi plus trei închide paranteză ori patru','( 2 + 3 ) * 4']
]) assert.equal(convert(spoken),formula,spoken);

// Exercise dictation is split into independent Android recognition sessions.
const acceptFrom=embedded.indexOf('function mathVoiceAccept(');
assert.ok(acceptFrom>=0&&acceptFrom<from,'chunk acceptance is available');
const editor={value:'',dispatchEvent:()=>{}};
const segmentContext={
 collapseRepeatedVoiceWords:sandbox.collapseRepeatedVoiceWords,
 $:id=>id==='mathEducationText'?editor:null,
 Event:class Event{constructor(type,init){this.type=type;this.init=init}},
 mathVoiceSession:null
};
const accept=vm.runInNewContext(embedded.slice(acceptFrom,from)+'\n'+embedded.slice(from,to)+'\nmathVoiceAccept',segmentContext);
const session={active:true,lastRaw:'',captureId:1};
segmentContext.mathVoiceSession=session;
assert.equal(accept('paranteză rotundă',session),true);
session.captureId=2;
assert.equal(accept('paranteză rotundă',session),true,'identical commands from separate speech captures are valid');
assert.equal(editor.value,'( (');
editor.value='3 *';session.captureId=3;
assert.equal(accept('minus',session),true);
session.captureId=4;
assert.equal(accept('unu',session),true);
assert.equal(editor.value,'3 * -1','minus and one from separate captures become a negative operand');

const native=fs.readFileSync('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java','utf8');
assert.match(native,/"math"\.equals\(speechMode\)\)return;/,'math speech bypasses short endpoint');
assert.match(native,/mathDictation\?4800L:2200L/,'math uses longer silence hints');
assert.match(embedded,/function mathVoiceRestart\(session,/,'math resumes after an Android recognition segment');
assert.match(embedded,/if\(mathVoiceListening\)\{[\s\S]*?mathVoiceStop\(\)/,'user can stop ongoing math dictation');
console.log('PASS math voice parentheses, arithmetic, and continuous listening contracts');
