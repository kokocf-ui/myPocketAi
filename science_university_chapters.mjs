import {SCIENCE_UNIVERSITY_TRACK_GUIDES} from './science_university_track_guides.mjs';
import {PHYSICS_UNIVERSITY_STUDIES} from './physics_university_studies.mjs';

// Creates a substantive, bounded university chapter from its real existing
// topic-specific sublessons. Unmapped specialties do not invent material.
// All countries share this clearly marked advisory route, never a fictitious
// national university syllabus or accreditation.
export function scienceUniversityChapter({
 subject='',specialty='',topic='',chapter='',language='ro',grade='',lessons=[]
}={}){
 const allowed=['physics','chemistry','biology','astronomy'];
 if(!allowed.includes(subject)||!topic||!Array.isArray(lessons))return null;
 const available=lessons.filter(x=>x&&x.subject===subject&&x.topic===topic
  &&typeof x.statement==='string'&&x.statement.trim());
 const advanced=available.filter(x=>x.level==='advanced');
 // Specialised chapters must have their own advanced notes. Shared core
 // chapters may deliberately revisit earlier concepts in the context of
 // university case studies; label those notes as prerequisites.
 const isSpecial=topic.startsWith('special-')||Boolean(available.find(x=>x.level==='advanced'&&
  (x.id||'').includes('-spec-')));
 const source=isSpecial?advanced:
  advanced.concat(available.filter(x=>x.level!=='advanced').slice(0,Math.max(0,3-advanced.length)));
 if(!source.length)return null;
 // Biology's specialisation-wide case study is ONLY relevant to its authored
 // specialist chapters. Never inject an anatomy story into a plant course.
 const track=(subject==='biology'&&!isSpecial)?null:
  SCIENCE_UNIVERSITY_TRACK_GUIDES[subject]?.[specialty]||null;
 const ro=language==='ro';
 const line=String.fromCharCode(10),gap=line+line;
 const names={physics:['Fizică','Physics'],chemistry:['Chimie','Chemistry'],
  biology:['Biologie','Biology'],astronomy:['Astronomie','Astronomy']};
 const root=[
  '# '+(ro?'Studii universitare':'University study')+' · '+(ro?names[subject][0]:names[subject][1]),
  (ro?'Program general orientativ, nu program acreditat ori curriculum național certificat.':
   'General advisory study route, not an accredited or nationally certified degree programme.'),
  (ro?'Specializare: ':'Specialisation: ')+(specialty||'-')+' · '+(ro?'An: ':'Year: ')+(grade||'-'),
  '# '+(chapter||topic)
 ];
 if(track){
  const p=ro?track.ro:track.en;
  root.push(
   '# '+(ro?'Contextul specializării':'Specialisation context'),p[0],
   '# '+(ro?'Studiu de caz explicat':'Reasoned case study'),p[1],
   '# '+(ro?'Limite și interpretare':'Limits and interpretation'),p[2]);
 }
 root.push('# '+(ro?'Subcapitole și concepte verificabile':'Chapter-specific concepts'));
 for(const [i,entry] of source.entries()){
  root.push(
   '## '+(i+1)+'. '+(ro?entry.title:'Source concept '+(i+1))+(entry.level!=='advanced'?(ro?' · recapitulare fundament':' · prerequisite review'):''),
   (ro?'Definiție și explicație: ':'Romanian primary-source study statement (English translation not verified): ')+entry.statement,
   entry.formula&&entry.formula!=='—'?(ro?'Relație și notație: ':'Formula or notation: ')+entry.formula:'',
   ro?
    'Analizează ipotezele din afirmație, identifică mărimile și explică în ce condiții formula sau modelul pot fi aplicate.':
    'Interpret this notation in the source context; do not assume the Romanian text is a certified translation.'
  );
 }
 if(subject==='physics'&&PHYSICS_UNIVERSITY_STUDIES[topic]){
  const cases=PHYSICS_UNIVERSITY_STUDIES[topic][ro?'ro':'en'];
  root.push('# '+(ro?'Studii de caz universitare':'University-level worked case studies'));
  for(const [index,unit] of cases.entries()){
   root.push(
    '## '+(index+1)+'. '+unit.title,
    '# '+(ro?'Explicație universitară':'Scientific explanation'),unit.explanation,
    unit.formula?'# '+(ro?'Formula de pornire':'Starting formula'):'',
    unit.formula||'',
    unit.symbols?'# '+(ro?'Simboluri și unități':'Symbols and units'):'',
    unit.symbols||'',
    unit.method?'# '+(ro?'Metoda de aplicare':'How to apply the model'):'',
    unit.method||'',
    '# '+(ro?'Exemplu rezolvat':'Worked example'),unit.workedExample,
    '# '+(ro?'Exercițiu de evaluare':'Independent exercise'),unit.exercise,
    ro?
      'Rezolvă exercițiul înainte să apeși „Verifică răspunsul”; explicația trebuie să arate ipotezele și unitățile, nu doar rezultatul numeric.':
      'Attempt the exercise before using Check my answer; explain assumptions and physical units, not merely the final number.'
   );
  }
  root.push(ro?
   'Cele patru studii de caz sunt unități originale de învățare, NU un an universitar complet ori un curs acreditat.':
   'These four original case studies do NOT constitute a full accredited university module or degree year.');
 }
 if(track){
  root.push('# '+(ro?'Sarcină de verificare':'Independent study question'),
   (ro?track.ro[3]:track.en[3]));
 }else{
  root.push('# '+(ro?'Sarcină de verificare':'Independent study question'),
   ro?'Alege două concepte din capitol, explică legătura dintre ele și identifică o condiție în care modelul nu se mai aplică.':
   'Compare two concepts in the chapter and identify an assumption that limits their interpretation.');
 }
 root.push(ro?
  'Dacă un rezultat numeric nu este determinat de datele existente, nu inventa valori. Modelele, formulele și exercițiile sunt pentru studiu.':
  'No numerical results are invented when data are absent. Specialist sublesson statements remain in Romanian where their English translation has not been verified.');
 return root.filter(Boolean).join(gap);
}
