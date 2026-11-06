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

// Arithmetic equality verification must be deterministic for simple expressions
// and must never evaluate arbitrary source or attempt to solve equations in x.
const equalityStart=embedded.indexOf('function mathArithmeticValue(');
const equalityEnd=embedded.indexOf('function mathResultPage(',equalityStart);
assert.ok(equalityStart>0&&equalityEnd>equalityStart,'local arithmetic verifier is present');
const arithmetic=vm.runInNewContext(embedded.slice(equalityStart,equalityEnd)+
 String.fromCharCode(10)+'({value:mathArithmeticValue,check:mathArithmeticEquality,explain:mathEqualityExplanation})',
 {state:{language:'ro'},learningLabel:(ro,en)=>ro,Intl});
const verified=arithmetic.check('3 * (2 * -1) + 5 = 20');
assert.equal(verified.left,-1);
assert.equal(verified.right,20);
assert.equal(verified.equal,false);
assert.match(arithmetic.explain(verified),/falsă.*Stânga.*-1.*dreapta.*20/);
assert.equal(arithmetic.check('3 * (2 * -1) + 5 = -1').equal,true);
assert.equal(arithmetic.check('1,5 + 2,5 = 4').equal,true);
assert.equal(arithmetic.check('(3.5 + 0.5) / 2 = 2').equal,true);
assert.equal(arithmetic.check('-(3-5) = 2').equal,true);
assert.equal(arithmetic.check('2*(3+4) = 14').equal,true);
assert.equal(arithmetic.check('2*(3+4) = 15').equal,false);
assert.equal(arithmetic.check('x+1=2'),null,'variables are delegated to the maths solver');
assert.equal(arithmetic.check('2/0=Infinity'),null,'division by zero is not asserted');
assert.equal(arithmetic.check('2(3+4)=14'),null,'implicit multiplication is not miscalculated');
assert.equal(arithmetic.check('3+4=7=7'),null,'multiple equalities remain with the maths solver');
assert.equal(arithmetic.check('3^2=9'),null,'unsupported operators are not guessed');
assert.match(embedded,/Nu cita lecții video, site-uri sau surse/,'avoid fabricated lesson references');
assert.ok(embedded.includes("const checked=equality&&session.mode!=='explain'?"),'only full solutions include deterministic equality in the teaching prompt');
assert.ok(embedded.includes('mathEqualityExplanation(verifiedEquality)'),'always render arithmetic equality independently of model replies');

// The UI must not depend on generative AI for basic arithmetic: all terms
// survive every reduction, and the final comparison agrees with the checker.
const detailed=vm.runInNewContext(embedded.slice(equalityStart,equalityEnd)+
 String.fromCharCode(10)+'mathDetailedArithmetic',
 {state:{language:'ro'},learningLabel:(ro,en)=>ro,Intl});
const worked=detailed('3 * (2 * -1) + 5 = 20');
assert.ok(worked,'dictated equality is supported by the local step renderer');
assert.equal(worked.steps.length,3,'parenthesis, multiplication and addition all get independent steps');
assert.match(worked.steps[0].operation,/2.*×.*−1.*=.*−2/);
assert.match(worked.steps[0].after,/3.*×.*\(−2\).* \+ 5/,'+5 is not dropped after reducing parentheses');
assert.match(worked.steps[1].operation,/3.*×.*\(−2\).*=.*−6/);
assert.match(worked.steps[1].after,/−6 \+ 5/,'+5 is retained until the final addition');
assert.match(worked.steps[2].operation,/−6 \+ 5 = −1/);
assert.match(worked.conclusion,/falsă.*Stânga.*-1.*dreapta.*20/);
assert.equal(detailed('3 * (2 * -1) + 5 = -1').steps.length,3);
assert.equal(detailed('2*(3+4) = 14').steps.length,2);
assert.equal(detailed('2*(3+4) = 15').conclusion.includes('falsă'),true);
assert.equal(detailed('1,5 + 2,5 = 4').steps.length,1,'decimal commas survive');
assert.equal(detailed('(3.5 + 0.5) / 2 = 2').steps.length,2,'decimal dots survive');
assert.equal(detailed('-(3-5) = 2').conclusion.includes('adevărată'),true);
assert.equal(detailed('2/0 = 9'),null,'division by zero needs another solver');
assert.equal(detailed('2(3+4)=14'),null,'implicit multiplication is unsupported');
assert.equal(detailed('x+1=2'),null,'symbolic equations go to the general model');
// A schoolteacher-style solution must say WHY each transformation is applied,
// retain both sides of the proposed equation, and state the verdict only once.
assert.match(worked.intro,/ordinea|regula|paranteze/i,'the lesson begins with the precedence rule');
assert.equal(worked.steps[0].label,'Calculăm în paranteză');
assert.match(worked.steps[0].reason,/paranteză.*prioritate/i,'first step explains why we start inside brackets');
assert.match(worked.steps[0].signRule,/pozitiv.*negativ.*negativ/,'explain why 2 × (-1) is negative');
assert.equal(worked.steps[0].fullAfter,'3 × (−2) + 5 = 20','after the bracket, keep the entire proposed equality');
assert.equal(worked.steps[1].fullAfter,'−6 + 5 = 20','after multiplication, still keep the +5 and right side');
assert.equal(worked.steps[2].fullAfter,'−1 = 20','the final written comparison is fully visible');
assert.match(worked.steps[1].reason,/înmulțirile.*înaintea.*adunărilor/,'explain multiplication priority');
assert.match(worked.steps[2].reason,/stânga la dreapta/,'explain remaining additive operations');
assert.match(worked.conclusion,/Egalitatea este falsă/);
const correct=detailed('3 * (2 * -1) + 5 = -1');
assert.match(correct.conclusion,/Egalitatea este adevărată/);
assert.equal(correct.steps[2].fullAfter,'−1 = −1');
assert.equal(detailed('5+2').steps[0].fullAfter,'7','standalone expressions should not gain a made-up equals sign');
assert.match(detailed('(-3)*(-2) = 6').steps[0].signRule,/două numere negative/,'same-sign rule is explained');
const bothSides=detailed('2+3=1+4');
assert.equal(bothSides.steps[0].fullAfter,'5 = 1+4');
assert.equal(bothSides.steps[1].fullAfter,'5 = 5');
assert.ok(embedded.includes("if(verifiedEquality&&!item.detailed&&session.mode!==\'explain\')"),'do not repeat the verdict above worked steps or method guides');
assert.ok(embedded.includes("step.reason"),'teacher explains each operation');
assert.ok(embedded.includes("step.fullAfter"),'complete expressions are displayed');
assert.ok(embedded.includes("step.signRule"),'sign rules are shown where relevant');
assert.ok(embedded.includes("step.fullAfter).join(' ')"),'voice reads the lesson, not only the final result');

assert.ok(embedded.includes("item.detailed=steps"),'supported arithmetic uses the local step renderer');
assert.ok(embedded.includes("item.detailed.steps.length"),'multiple numbered steps are displayed');

// The Method button is not a second solution: it teaches reusable rules.
// Use the same verified arithmetic corpus as the Solve button.
const method=vm.runInNewContext(embedded.slice(equalityStart,equalityEnd)+
 String.fromCharCode(10)+'mathMethodGuide',
 {state:{language:'ro'},learningLabel:(ro,en)=>ro,Intl});
const guide=method('3 * (2 * -1) + 5 = 20');
assert.ok(guide,'the sample gets a local, reusable teaching guide');
assert.match(guide.heading,/Cum abordăm/i);
assert.match(guide.intro,/regula generală/,'method tells the student what it teaches');
assert.ok(guide.rules.length>=5,'cover precedence, parentheses, signs, checking');
assert.ok(guide.rules.some(r=>/Regula semnelor/.test(r.title)),'negative multiplication rule');
assert.ok(guide.rules.some(r=>/Verificarea/.test(r.title)),'general equality-checking advice');
assert.ok(guide.rules.every(r=>!r.text.includes('Stânga = −1')),'do not repeat the solved equation');
assert.ok(guide.rules.every(r=>!r.text.includes('egalitatea este falsă')),'no repeated specific verdict');
assert.equal(method('x+1=2'),null,'symbolic exercises use the method-specific AI prompt');
assert.equal(method('2/0=3'),null,'invalid arithmetic is not treated as valid');
assert.ok(embedded.includes("session.mode!=='explain'"),'method mode hides the exact verdict banner');
assert.ok(embedded.includes('item.methodGuide'),'method has its own visible renderer');
assert.ok(embedded.includes("mode==='explain'?learningLabel('Matematică · Metodă'"),'method dialog has a distinct title');
assert.ok(embedded.includes('Predă numai METODA GENERALĂ'),'fallback AI prompt requests general teaching');
assert.ok(embedded.includes("mode==='explain'?(mathLinearMethodGuide(text)||mathMethodGuide(text))"),'both linear-equation and arithmetic method results are built locally');

// A learner must never lose the typed/dictated exercise when choosing one
// of the three actions, navigating between modules, or reopening the WebView.
const draftStart=embedded.indexOf('const MATH_EXERCISE_DRAFT_KEY');
const draftEnd=embedded.indexOf('function openLearningSubject(',draftStart);
assert.ok(draftStart>0&&draftEnd>draftStart,'persistent math draft support exists');
const values=new Map();
const memoryStorage={
 getItem:key=>values.has(key)?values.get(key):null,
 setItem:(key,value)=>values.set(key,String(value))
};
const freshDraft=()=>vm.runInNewContext(embedded.slice(draftStart,draftEnd)+
 String.fromCharCode(10)+'({read:mathRestoreDraft,write:mathRememberDraft})',
 {localStorage:memoryStorage});
const firstDraft=freshDraft();
assert.equal(firstDraft.read(),'','new installations start with an empty field');
firstDraft.write('3 * (2 * -1) + 5 = 20');
assert.equal(firstDraft.read(),'3 * (2 * -1) + 5 = 20','input stays in memory');
assert.equal(freshDraft().read(),'3 * (2 * -1) + 5 = 20','input survives a WebView reload');
firstDraft.write('3 * (2 * -1) + 5 = 18');
assert.equal(freshDraft().read(),'3 * (2 * -1) + 5 = 18','editing individual numbers updates the draft');
firstDraft.write('');
assert.equal(freshDraft().read(),'','only an explicit clear removes the saved draft');
const runStart=embedded.indexOf('function mathEducationRun(');
const runEnd=embedded.indexOf("$('mathResultClose').onclick",runStart);
assert.ok(runStart>0&&runEnd>runStart,'math actions remain present');
const runCode=embedded.slice(runStart,runEnd);
assert.ok(!runCode.includes("editor.value=''"),'solve/graph/method never clear the exercise');
assert.ok(runCode.includes('mathRememberDraft(editor.value)'),'math actions retain the last user input');
assert.ok(embedded.includes("editor.value=mathRestoreDraft()"),'navigating back restores the input');
assert.ok(embedded.includes("editor.addEventListener('input',()=>{mathRememberDraft(editor.value)"),'manual input updates the stored draft');
assert.ok(embedded.includes("mathRememberDraft('')"),'new conversation explicitly clears the draft');
assert.ok(embedded.includes('if(text){editor.value=text;mathRememberDraft(text)}'),
 'empty OCR never deletes a previously typed exercise');


// Regression: same mathematical function must generate both chart and lesson.
const graphStart=embedded.indexOf('function mathGraphModel(');
const graphEnd=embedded.indexOf('function mathSvgElement(',graphStart);
const lessonStart=embedded.indexOf('function mathFunctionLesson(');
const lessonEnd=embedded.indexOf('function mathResultPage(',lessonStart);
assert.ok(graphStart>0&&lessonStart>graphEnd&&lessonEnd>lessonStart,'function renderer exists');
const functionApi=vm.runInNewContext(
 embedded.slice(graphStart,graphEnd)+String.fromCharCode(10)+
 embedded.slice(lessonStart,lessonEnd)+String.fromCharCode(10)+
 '({model:mathGraphModel,lesson:mathFunctionLesson,clean:mathCleanAnswerMarkup})',
 {state:{language:'ro'},learningLabel:(ro,en)=>ro,Intl});
const selectedFunction='Reprezintă grafic funcția:\nf(x) = 2x-3';
const model=functionApi.model(selectedFunction);
assert.deepEqual([model.a,model.b,model.c],[0,2,-3]);
for(const mode of ['solve','graph','explain']){
 const lesson=functionApi.lesson(selectedFunction,mode);
 assert.ok(lesson,mode+' has a verified, locally calculated function lesson');
 const text=[lesson.heading,lesson.intro,lesson.conclusion,...lesson.steps.map(s=>s.name+' '+s.description)].join(' ');
 assert.match(text,/f\(x\) = 2x−3/,'lesson must name the selected function');
 assert.match(text,/Două puncte distincte/,'two distinct points define a line');
 assert.match(text,/1,5/,'correct x-axis intercept is one and a half');
 assert.ok(!text.includes('18 − 3'),'must not leak another exercise');
 assert.ok(!text.includes('3 + 4'),'must not leak another exercise');
}
assert.equal(functionApi.lesson('Calculează 3 + 4 × 2','graph'),null,
 'an arithmetic task is not a function');
const quadratic=functionApi.lesson('f(x)=x^2-4','explain');
assert.ok(quadratic&&quadratic.steps.some(s=>/parabolă/.test(s.description)));
const constant=functionApi.lesson('f(x)=0x+5','graph');
assert.ok(constant&&constant.steps.some(s=>/orizontal/.test(s.description)));
const slash=String.fromCharCode(92);
const latex='Întâi $3 + 4 '+slash+'times 2$; apoi $35 '+slash+'div 7$; '+
 slash+'('+slash+'frac{1}{2}'+slash+').';
const clean=functionApi.clean(latex);
assert.equal(clean.includes(String.fromCharCode(36)),false,'math dollar delimiters are removed');
assert.match(clean,/3 \+ 4 × 2/);
assert.match(clean,/35 ÷ 7/);
assert.match(clean,/\(1\)\/\(2\)/);
assert.equal(functionApi.clean('Prețul este $25. Cost: $15.'),'Prețul este $25. Cost: $15.',
 'ordinary currency symbols must stay');
assert.ok(embedded.includes('item.functionLesson=verifiedFunction'),'function answers bypass generated unrelated explanations');
assert.ok(embedded.includes("if(session.mode==='graph'&&!mathGeometryFigure(item.text))"),
 'unsupported plots are reported as unsupported');
assert.ok(embedded.includes("mathLastSpokenReply=item.spokenReply||item.reply||''"),
 'speech follows the selected task tab');
assert.ok(embedded.includes('appendAnswerText(result,mathCleanAnswerMarkup(item.reply))'),
 'math-only content is formatted before display');

const native=fs.readFileSync('android/app/src/main/java/ai/mypocket/mobile/MainActivity.java','utf8');
assert.match(native,/"math"\.equals\(speechMode\)\)return;/,'math speech bypasses short endpoint');
assert.match(native,/mathDictation\?4800L:2200L/,'math uses longer silence hints');
assert.match(native,/RecognizerIntent\.EXTRA_MAX_RESULTS,5/,'Android offers alternate maths hypotheses');
assert.match(native,/data\.put\("alternatives",choices\)/,'Android returns alternatives only for math');
assert.match(embedded,/function mathVoiceRestart\(session,/,'math resumes after an Android recognition segment');
assert.match(embedded,/if\(mathVoiceListening\)\{[\s\S]*?mathVoiceStop\(\)/,'user can stop ongoing math dictation');
console.log('PASS math voice parentheses, arithmetic, and continuous listening contracts');
