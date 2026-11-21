import {PHYSICS_UPPER_CASES} from './physics_upper_cases.mjs';
import {PHYSICS_UPPER_CASES_EN} from './physics_upper_cases_en.mjs';
import {PHYSICS_LOWER_ENGLISH_LESSONS} from './physics_lower_english_lessons.mjs';
// Original advisory study catalogue for upper-secondary Physics. A physical
// law/formula is an individual learning concept; a review pre-requisite is
// labelled as review rather than a new advanced national lesson.
export function physicsUpperYearLessons({country='',grade='',topic='',years=[],lessons=[],reviewBank=null,language='ro'}={}){
 const yr=String(grade);
 if(!years.some(x=>String(x.id)===yr))return [];
 const core=(Array.isArray(lessons)?lessons:[]).filter(item=>
  item.subject==='physics'&&item.topic===topic&&
  ['beginner','intermediate'].includes(item.level)&&item.title&&item.statement);
 const gradeIndex=years.findIndex(y=>String(y.id)===yr);
 const reviewQuestions=[
  ['Verifică rezultatul printr-o unitate sau un caz-limită.',
   'Justifică unitatea și o ipoteză a modelului.'],
  ['Compară metoda cu o altă situație fizică și indică ce date s-ar modifica.',
   'Arată ce mărimi sau ipoteze se schimbă și ce relații rămân valabile.'],
  ['Descrie o posibilă eroare de măsurare și efectul ei asupra rezultatului.',
   'Explică o sursă plauzibilă de eroare și sensul influenței asupra rezultatului.'],
  ['Propune un experiment sigur care să pună la încercare modelul.',
   'Specifică mărimea măsurată, controlul, predicția și criteriul de verificare.']
 ];
 const inquiry=reviewQuestions[Math.min(gradeIndex,reviewQuestions.length-1)];
 const caseBank=language==='ro'?PHYSICS_UPPER_CASES:PHYSICS_UPPER_CASES_EN;
 const cases=(caseBank[topic]||[]).map((entry,n)=>({
  ...entry,grade:yr,source:'original-upper-physics-advisory',nationallyVerified:false,
  id:'upper-physics-case-'+String(country)+'-'+yr+'-'+entry.id,
  chapterIndex:n+1,exercise:entry.exercise+' '+inquiry[0],
  answer:entry.answer+' '+inquiry[1]
 }));
 const order=(language==='ro'?core:[]).map((item,n)=>({
  ...item,grade:yr,source:'original-upper-physics-advisory',nationallyVerified:false,
  id:'upper-physics-'+String(country)+'-'+yr+'-'+String(item.id),
  chapterIndex:cases.length+n+1,
  exercise:'Interpretează noțiunea „'+item.title+'”, formulează ipotezele de aplicare și verifică dimensional relația: '+String(item.formula||'fără formulă numerică')+'.',
  workedExample:'Exemplu de interpretare: '+item.statement+' '+
   (item.formula&&item.formula!=='—'?
    'În relația '+item.formula+', explică semnificația mărimilor și a unităților înainte de a calcula.':
    'Compară două situații fizice și arată când este utilă definiția.'),
  answer:'O rezolvare adecvată trebuie să explice conceptul, să declare ipotezele, unitățile și limitele formulei, fără rezultate numerice inventate.'
 }));
 // Clearly marked prior-knowledge review: these are not new national
 // high-school topics, and their counts are not used to claim programme
 // verification. English follows original English sources, never Romanian
 // source summaries mislabelled as translated lessons.
 const revision=language==='ro'?
  (reviewBank?.['8']||[]).filter(x=>x.topic===topic).slice(0,6).map((entry,index)=>({
   ...entry,id:'upper-review-'+String(country)+'-'+yr+'-'+entry.id,
   title:'Recapitulare: '+entry.title,source:'original-upper-physics-review',
   grade:yr,chapterIndex:cases.length+order.length+index+1,reviewOnly:true
  })):
  (PHYSICS_LOWER_ENGLISH_LESSONS[topic]||[]).slice(0,5).map((entry,index)=>({
   ...entry,id:'upper-english-review-'+String(country)+'-'+yr+'-'+entry.id,
   title:'Prerequisite review: '+entry.title,
   exercise:entry.exercise+' '+inquiry[0],answer:entry.answer+' '+inquiry[1],
   source:'original-english-physics-prerequisite',language:'en',
   grade:yr,chapterIndex:cases.length+index+1,reviewOnly:true
  }));
 return [...cases,...order,...revision];
}
