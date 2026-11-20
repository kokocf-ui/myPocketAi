import assert from 'node:assert/strict';
import backend from './backend.js';
import {literatureOutputIssue,literatureRequestedWords,literatureWordCount,literatureRepetitiveProse} from './literature_output_quality.mjs';

const essayRequest='Redactează un eseu argumentativ de aproximativ 500 de cuvinte despre rolul memoriei în construirea identității personale. Formulează o teză clară, două argumente, o obiecție și o concluzie.';
const paragraphs=[
 'Memoria nu este un simplu depozit de întâmplări, ci un mod în care ne interpretăm existența. O persoană nu se definește numai prin date biografice, ci prin legăturile pe care le stabilește între experiențele sale. Tocmai de aceea, identitatea are o dimensiune narativă: alegem momente, le comparăm și le acordăm un sens care se poate modifica odată cu trecerea timpului. Această selecție nu anulează realitatea, dar explică de ce două persoane își pot aminti foarte diferit aceeași întâmplare.',
 'Un prim argument privește continuitatea personală. Când un om își amintește de o alegere dificilă, poate recunoaște motivele care l-au făcut să acționeze într-un anumit fel și poate evalua consecințele. Această confruntare cu propriile decizii îi oferă un reper pentru alegerile viitoare. Identitatea devine astfel un proces, nu o etichetă primită la naștere. Memoria permite compararea dintre cel care am fost și cel care suntem, chiar dacă înțelegerea trecutului nostru se schimbă.',
 'Un al doilea argument ține de relațiile cu ceilalți. Amintirile comune construiesc apartenența la o familie, la o comunitate sau la o cultură. Un obiect păstrat din copilărie poate avea o valoare modestă pentru un străin, însă pentru proprietar poate reface întregul context al unei relații. Totuși, semnificația acestor amintiri nu este permanentă: ceea ce părea neimportant într-o perioadă poate deveni esențial când relațiile sau responsabilitățile se schimbă. Identitatea personală se află mereu în dialog cu memoria colectivă.',
 'S-ar putea obiecta că memoria este nesigură, deoarece uităm, deformăm sau reinterpretăm trecutul. Obiecția este întemeiată, dar nu dovedește că amintirile sunt inutile pentru cunoașterea de sine. Dimpotrivă, obligația de a compara mărturii și de a recunoaște erorile face parte din maturizarea individului. Nu trebuie să considerăm fiecare amintire o fotografie fidelă. Este suficient să înțelegem că ea reprezintă o perspectivă, susceptibilă de corectare prin dialog, documente și reflecție. Această luciditate poate preveni transformarea experiențelor personale în certitudini inflexibile.',
 'În concluzie, memoria contribuie la identitate prin continuitatea deciziilor, prin relațiile care ne leagă de ceilalți și prin felul în care reinterpretăm experiențele trăite. Tocmai caracterul ei imperfect ne obligă să rămânem atenți la alte perspective. Identitatea nu este produsul automat al unui inventar de amintiri, ci rezultatul unei înțelegeri mereu revizuite. O viață asumată presupune atât capacitatea de a păstra ceea ce contează, cât și libertatea de a privi critic propria poveste.'
];
const essay=paragraphs.join('\n\n');
const lesson=Array.from({length:5},(_,i)=>'Partea '+(i+1)+': Noțiuni, context și interpretare\n\n'+
 paragraphs[i]+' În studiul literaturii trebuie stabilite diferențele dintre o observație despre text și o interpretare a efectului său. O formulare susținută prin dovezi este mai utilă decât o simplă enumerare de termeni.').join('\n\n');
assert.equal(literatureRequestedWords(essayRequest),500);
assert.ok(literatureWordCount(essay)>350);
assert.equal(literatureOutputIssue(essay,'write',essayRequest),null,'Complete argumentative essay is accepted');
assert.equal(literatureOutputIssue('Lecție: Rolul memoriei\n\nÎn cadrul acestei lecții, elevii vor explora memoria.\n\n1. Ce este memoria?','write',essayRequest),'essay_returned_as_lesson');
assert.equal(literatureOutputIssue('Memoria ne definește.','essay',essayRequest),'essay_too_short');
const circular=['Memoria ne ajută să înțelegem trecutul și să ne conectăm la trecutul nostru. Înțelegem propriile nevoi și dorințe prin intermediul memoriei.','Memoria ne ajută să înțelegem trecutul și să ne conectăm la trecutul nostru. Înțelegem propriile nevoi și dorințe prin intermediul memoriei.','Memoria ne ajută să înțelegem trecutul și să ne conectăm la trecutul nostru. Înțelegem propriile nevoi și dorințe prin intermediul memoriei.','Memoria ne ajută să înțelegem trecutul și să ne conectăm la trecutul nostru. Înțelegem propriile nevoi și dorințe prin intermediul memoriei.'].join('\n\n').repeat(3);
assert.equal(literatureRepetitiveProse(circular),true,'Repeated five-word sequences must be visible in quality audit');
assert.equal(literatureOutputIssue(circular,'write',essayRequest),'essay_repetitive_phrases');
assert.equal(literatureRepetitiveProse(essay),false,'Developed essay fixture should not be rejected for normal topic repetition');
assert.equal(literatureOutputIssue(lesson,'lesson','Class/year: 10. Teorie despre rolul memoriei.'),null,'Substantial upper-secondary theory');
assert.equal(literatureOutputIssue('Definiție. Teoria se aplică literaturii.','lesson','Class/year: 10.'),'lesson_too_short');

async function post(activity,message,replies){
 let calls=0;
 const res=await backend.fetch(new Request('https://unit.test/api/chat',{method:'POST',
 headers:{'Content-Type':'application/json'},body:JSON.stringify({
  module:'education_study',education_subject:'language_literature',education_activity:activity,
  language:'ro',message
 })}),{AI:{run:async(_model,options)=>{
  calls++;
  assert.ok(options.messages[0].content.includes(activity==='lesson'?'TEACHING CHAPTER':'FINISHED ESSAY'));
  return {response:replies[Math.min(calls-1,replies.length-1)]};
 }}});
 return {status:res.status,data:await res.json(),calls};
}
let out=await post('write',essayRequest,['Lecție: Rolul memoriei\n\nÎn cadrul acestei lecții, elevii vor explora identitatea.',essay]);
assert.equal(out.status,200);
assert.equal(out.calls,2,'One internal editorial repair, not unbounded retries');
assert.equal(out.data.reply,essay);
out=await post('write',essayRequest,['Lecție: Despre memorie','Altă lecție despre memorie.']);
assert.equal(out.status,502,'Wrong output genre cannot be displayed as successful essay');
assert.equal(out.data.error,'education_quality_invalid');
assert.equal(out.calls,2);
out=await post('lesson','Class/year: 10. Teorie despre memorie.',['Trecere în revistă extrem de scurtă.',lesson]);
assert.equal(out.status,200);
assert.equal(out.calls,2);
console.log('PASS literature essay genre, approximate length, complete theory and bounded editorial rejection');
