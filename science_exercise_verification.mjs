// Exact, explainable checks for the few curated Science exercises with a
// unique numerical solution. Open-ended answers must never be guessed by
// keyword matching or silently labelled correct by the application.
export const SCIENCE_EXACT_REFERENCE=Object.freeze({
 'physics:units':Object.freeze({value:0.75,unit:'m',ro:'750 mm = 0,75 m: împărțim la 1.000.',en:'750 mm = 0.75 m: divide by 1,000.'}),
 'physics:kinematics':Object.freeze({value:4,unit:'m/s',ro:'v = 200 m / 50 s = 4 m/s.',en:'v = 200 m / 50 s = 4 m/s.'}),
 'physics:electric':Object.freeze({value:3,unit:'A',ro:'Legea lui Ohm: I = U/R = 9 V / 3 Ω = 3 A.',en:'Ohm’s law: I = V/R = 9 V / 3 Ω = 3 A.'}),
 'chemistry:solutions':Object.freeze({value:4,unit:'%',ro:'Concentrația procentuală = 8 g / 200 g × 100 = 4%.',en:'Mass percentage = 8 g / 200 g × 100 = 4%.'})
});
export function scienceCheckExactExercise({subject='',topic='',answer='',language='ro'}={}){
 const ref=SCIENCE_EXACT_REFERENCE[String(subject)+':'+String(topic)];
 const ro=language==='ro',value=String(answer||'').trim();
 if(!ref)return {status:'requires-assessment',feedback:ro?
  'Răspuns deschis: este necesară evaluarea pe baza explicației și a criteriilor lecției.':
  'Open answer: it needs reasoned assessment against the lesson criteria.'};
 if(!value)return {status:'empty',feedback:ro?'Introdu răspunsul înainte de verificare.':'Enter an answer before checking.'};
 // Capture answers WITH the requested unit; a naked number must not pass.
 const normalized=value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 const suffix=ref.unit==='m'?'(?:m(?![a-z/])|metri\\b|metres?\\b|meters?\\b)':
  ref.unit==='m/s'?'(?:m\\s*\\/\\s*s|metri\\s+pe\\s+secunda|metres?\\s+per\\s+second|meters?\\s+per\\s+second)':
  ref.unit==='A'?'(?:a\\b|amperi\\b|amperes?\\b|amps?\\b)':
  '(?:%|la\\s+suta|percent\\b|per\\s+cent\\b)';
 const exp=new RegExp('(-?\\d+(?:[.,]\\d+)?)\\s*'+suffix,'gi');
 const values=[...normalized.matchAll(exp)].map(match=>Number(match[1].replace(',','.'))).filter(Number.isFinite);
 if(!values.length)return {status:'needs-unit',feedback:ro?
  'Scrie rezultatul numeric împreună cu unitatea cerută ('+ref.unit+').':
  'Include the numerical result and the required unit ('+ref.unit+').'};
 const distinct=[...new Set(values.map(n=>n.toPrecision(9)))].map(Number);
 if(distinct.length!==1)return {status:'requires-assessment',feedback:ro?
  'Ai introdus rezultate diferite pentru aceeași unitate. Precizează clar răspunsul final.':
  'Several different results use the same unit. State one final answer clearly.'};
 // Only a bare final result may be graded numerically. A worked solution,
 // even with the right final number, can contain an incorrect method.
 const compact=normalized.replace(/^(?:v|i|c|raspuns|rezultat|answer|result)\\s*[:=]\\s*/,'')
  .replace(/[.!?]\\s*$/,'').trim();
 const direct=new RegExp('^(-?\\\\d+(?:[.,]\\\\d+)?)\\\\s*'+suffix+'
 return {status:correct?'correct':'incorrect',expected:ref.value,unit:ref.unit,
  feedback:(correct?(ro?'Corect. ':'Correct. '):(ro?'Rezultatul nu este corect. ':'The result is not correct. '))+
  (ro?ref.ro:ref.en)};
}
,'i');
 if(!direct.test(compact))return {status:'requires-assessment',feedback:ro?
  'Pentru verificarea pașilor de calcul este necesară evaluarea întregii rezolvări.':
  'The full worked solution needs assessment; a final number alone is not enough.'};
 const correct=Math.abs(distinct[0]-ref.value)<=Math.max(1e-9,Math.abs(ref.value)*1e-6);
 return {status:correct?'correct':'incorrect',expected:ref.value,unit:ref.unit,
  feedback:(correct?(ro?'Corect. ':'Correct. '):(ro?'Rezultatul nu este corect. ':'The result is not correct. '))+
  (ro?ref.ro:ref.en)};
}
