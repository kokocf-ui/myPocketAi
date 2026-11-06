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
 ['paranteză doi ori unu paranteză','( 2 * 1 )'],
 ['trei ori paranteză doi ori unu paranteză plus cinci','3 * ( 2 * 1 ) + 5'],
 ['() doi ori unu ()','( 2 * 1 )'],
 ['paranteză paranteză','( ('],
 ['deschide paranteză doi plus trei închide paranteză ori patru','( 2 + 3 ) * 4']
]) assert.equal(convert(spoken),formula,spoken);

// Whole-utterance Whisper produces natural punctuation after spoken pauses.
// It must not turn comma breaks or a full stop after "egal" into maths tokens.
for(const [spoken,formula] of [
 ['Trei ori, paranteză, doi ori, minus unu, închide paranteza, plus cinci, egal. Douăzeci.', '3 * ( 2 * -1 ) + 5 = 20'],
 ['3 *, (, 2 *, - 1, ), + 5, = . 20.', '3 * ( 2 * -1 ) + 5 = 20'],
 ['Deschide paranteza, minus unu, închide paranteza.', '( -1 )'],
 ['3,5 plus 1,25', '3,5 + 1,25'],
 ['3.5 plus 1.25', '3.5 + 1.25'],
 ['trei ori, deschide paranteza, doi ori minus unu, închide paranteza', '3 * ( 2 * -1 )'],
 ['trei minus unu', '3 - 1']
]) assert.equal(convert(spoken),formula,'Whisper speech punctuation: '+spoken);


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
editor.value='3 *';session.captureId=5;
assert.equal(accept('paranteză',session),true);
session.captureId=6;
assert.equal(accept('2 * 1 paranteză + 5',session),true);
assert.equal(editor.value,'3 * ( 2 * 1 ) + 5','unnamed bracket closes across captures after an operand');
editor.value='3 *';session.captureId=7;
assert.equal(accept('paranteză',session),true);
session.captureId=8;
assert.equal(accept('paranteză',session),true);
assert.equal(editor.value,'3 * ( (','two nested opening brackets remain possible');
const choose=vm.runInNewContext(embedded.slice(from,to)+'\nmathVoiceChooseTranscript',sandbox);
assert.equal(
 choose('3 ori paranteză 2 ori 1 paranteză plus 5',['3 ori paranteză 2 ori minus unu paranteză plus 5']),
 '3 ori paranteză 2 ori minus unu paranteză plus 5','recover negative operand when supported by an alternate transcript');
assert.equal(choose('trei ori unu',['trei ori doi']),'trei ori unu','unrelated alternatives cannot change the dictated number');
assert.equal(choose('trei minus unu',['trei plus unu']),'trei minus unu','never reverse the spoken operation');

const native=fs.readFileSync('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java','utf8');
assert.match(native,/"math"\.equals\(speechMode\)\)return;/,'math speech bypasses short endpoint');
assert.match(native,/mathDictation\?4800L:2200L/,'math uses longer silence hints');
assert.match(native,/RecognizerIntent\.EXTRA_MAX_RESULTS,5/,'Android offers alternate maths hypotheses');
assert.match(native,/data\.put\("alternatives",choices\)/,'Android returns alternatives only for math');
assert.match(embedded,/function mathVoiceRestart\(session,/,'math resumes after an Android recognition segment');
assert.match(embedded,/if\(mathVoiceListening\)\{[\s\S]*?mathVoiceStop\(\)/,'user can stop ongoing math dictation');
console.log('PASS math voice parentheses, arithmetic, and continuous listening contracts');
