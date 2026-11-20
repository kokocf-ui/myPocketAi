import {SCIENCE_UNIVERSITY_TRACK_GUIDES} from './science_university_track_guides.mjs';

// Creates a substantive, bounded university chapter from its real existing
// topic-specific sublessons. Unmapped specialties do not invent material.
// All countries share this clearly marked advisory route, never a fictitious
// national university syllabus or accreditation.
export function scienceUniversityChapter({
 subject='',specialty='',topic='',chapter='',language='ro',grade='',lessons=[]
}={}){
 const allowed=['physics','chemistry','biology','astronomy'];
 if(!allowed.includes(subject)||!topic||!Array.isArray(lessons))return null;
 const source=lessons.filter(x=>x&&x.subject===subject&&x.topic===topic&&x.level==='advanced'
  &&typeof x.statement==='string'&&x.statement.trim());
 if(!source.length)return null;
 const track=SCIENCE_UNIVERSITY_TRACK_GUIDES[subject]?.[specialty]||null;
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
   '## '+(i+1)+'. '+(ro?entry.title:'Source concept '+(i+1)),
   (ro?'Definiție și explicație: ':'Romanian primary-source study statement (English translation not verified): ')+entry.statement,
   entry.formula&&entry.formula!=='—'?(ro?'Relație și notație: ':'Formula or notation: ')+entry.formula:'',
   ro?
    'Analizează ipotezele din afirmație, identifică mărimile și explică în ce condiții formula sau modelul pot fi aplicate.':
    'Interpret this notation in the source context; do not assume the Romanian text is a certified translation.'
  );
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
