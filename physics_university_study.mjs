// Distinct university Physics study documents for year, specialty and country route.
// Studies are educational and comparative, not accredited national syllabi.
import {PHYSICS_UNIVERSITY_CORE} from './physics_university_core.mjs';
import {PHYSICS_UNIVERSITY_SPECIALIST} from './physics_university_specialist.mjs';
import {physicsUniversityRoute} from './physics_university_europe.mjs';
export const PHYSICS_UNIVERSITY_ALL_COURSES=Object.freeze([...PHYSICS_UNIVERSITY_CORE,...PHYSICS_UNIVERSITY_SPECIALIST]);
export function physicsUniversityCourseChoices({year,specialty}={}){
 const y=Number(year),spec=String(specialty||'');
 if(!Number.isInteger(y)||y<1||y>5||!spec)return [];
 return PHYSICS_UNIVERSITY_ALL_COURSES.filter(c=>c.year===y&&(!c.specialty||c.specialty===spec))
  .map(c=>({id:'university-'+c.id,courseId:c.id,topic:c.topic,ro:c.ro,en:c.en,
   minLevel:'advanced',year:c.year,specialty:c.specialty||null}));
}
export function physicsUniversityStudyDocument({
 courseId='',country='',routeId='',specialty='',year=0,language='ro',
 lessons=[],trackGuide=null
}={}){
 const course=PHYSICS_UNIVERSITY_ALL_COURSES.find(c=>c.id===courseId);
 const route=physicsUniversityRoute(country,routeId);
 const y=Number(year);
 if(!course||!route||y!==course.year||y>route.years||
   (course.specialty&&course.specialty!==specialty))return null;
 const ro=language==='ro',loc=(a,b)=>ro?a:b;
 const n=String.fromCharCode(10),gap=n+n;
 const title=loc(course.ro,course.en);
 const lines=[
  '# '+title,
  loc('Fizică universitară · anul '+y+' din traseul de '+route.years+' ani',
   'University Physics · year '+y+' of a '+route.years+'-year route'),
  loc('Țară / jurisdicție: ','Country / jurisdiction: ')+country,
  route.provenanceRo&&loc(route.provenanceRo,route.provenanceEn),
  loc('Atenție: această fișă este un curs original orientativ. Nu reprezintă planul acreditat al unei anumite universități și nu certifică ordinea națională a disciplinelor.',
   'This is an original advisory study module, not an accredited university plan or a nationally certified course sequence.'),
  '# '+loc('Obiective și bază conceptuală','Goals and conceptual foundations'),
  loc(course.focusRo,course.focusEn),
  loc('Identifică variabilele fizice, unitățile și ipotezele înainte de a construi un model. Separă observația, aproximația, predicția și interpretarea.',
   'Identify physical variables, units and assumptions before building a model. Distinguish observation, approximation, prediction and interpretation.'),
  '# '+loc('Model, formule și interpretare','Model, equations and interpretation'),
  course.formula,
  loc('Explică fiecare simbol și verifică unitățile sau sensul dimensional al ecuației. O expresie corectă formal poate fi inaplicabilă dacă sunt încălcate ipotezele.',
   'Explain every symbol and check dimensions or units. A formally correct equation can be inapplicable when assumptions fail.'),
  '# '+loc('Exemplu lucrat și interpretat','Worked example and interpretation'),
  loc(course.exampleRo,course.exampleEn),
  loc('Etapele justificării: stabilește sistemul și mărimile cunoscute; selectează relația de mai sus; aplică modelul în regimul corect; verifică rezultatul și limita de valabilitate.',
   'Reasoning steps: define the system and known values; choose the relation above; apply it within its assumptions; verify the result and its validity limits.')
 ];
 const relevant=Array.isArray(lessons)?lessons.filter(x=>
  x&&x.subject==='physics'&&x.topic===course.topic&&
  typeof x.statement==='string'&&x.statement.trim()):[];
 const advanced=relevant.filter(x=>x.level==='advanced');
 const selected=(advanced.length?advanced:relevant).slice(0,6);
 if(selected.length){
  lines.push('# '+loc('Subcapitole academice și notații explicate','Academic subtopics and notation'));
  for(const [i,item] of selected.entries()){
   lines.push('## '+(i+1)+'. '+(ro?item.title:loc('Concept din sursa românească ','Romanian source concept ')+(i+1)),
    ro?item.statement:'Primary reference (Romanian text; English translation not verified): '+item.statement,
    item.formula&&item.formula!=='—'?loc('Relație asociată: ','Related relation: ')+item.formula:'',
    loc('Analizează condițiile în care relația este utilă și verifică diferența dintre model și date.',
     'Check when the relation is valid and distinguish the model from the data.'));
  }
 }
 if(course.specialty&&trackGuide){
  const guide=ro?trackGuide.ro:trackGuide.en;
  if(Array.isArray(guide)&&guide.length===4){
   lines.push('# '+loc('Aplicație în specializare','Specialist application'),guide[0],
    '# '+loc('Studiu de caz','Case study'),guide[1],
    '# '+loc('Limite ale modelului','Model limitations'),guide[2]);
  }
 }
 lines.push(
  '# '+loc('Exercițiu de verificare','Review exercise'),
  loc('Reformulează exemplul explicat, schimbă o ipoteză sau un parametru și arată ce consecință fizică rezultă. Justifică prin formula: ','Revisit the worked example, vary one assumption or parameter, and explain the physical consequence using: ')+course.formula,
  '# '+loc('Ghid de răspuns','Answer guidance'),
  loc('Răspunsul trebuie să identifice mărimile, să justifice sensul variației și să spună când expresia nu se aplică. Rezultatul de referință pentru problema inițială este: ',
   'A sound answer identifies variables, justifies the direction of change and states when the model is invalid. Reference result for the original example: ')+loc(course.exampleRo,course.exampleEn),
  '# '+loc('Laborator, simulare sau investigație','Laboratory, simulation or investigation'),
  loc('Proiectează o investigație pentru fenomenul discutat în curs: ','Design an investigation for the phenomenon discussed in this course: ')+loc(course.focusRo,course.focusEn),
  loc('Notează ipoteza, variabilele controlate, pașii de măsurare ori simulare, graficul așteptat, incertitudinile, siguranța, limitările și criteriul de verificare independentă. Dacă experimentul nu este sigur sau disponibil, folosește exclusiv date publicate ori o simulare.',
   'Record the hypothesis, controlled variables, measurement or simulation steps, predicted graph, uncertainty, safety, limitations and independent validation. If a practical experiment is unsafe or unavailable, analyse published data or simulate instead.'),
  '# '+loc('Evaluare și bibliografie','Assessment and references'),
  loc('Compară explicația cu un manual universitar potrivit programei reale a instituției. Pentru credite ECTS, discipline obligatorii și examene verifică planul universității selectate.',
   'Compare the explanation against university textbooks for the actual degree. Check institution-specific ECTS, mandatory modules and exams against its published plan.'),
  loc('Sursă structură de studiu: ','Study route example: ')+(route.source||'')
 );
 return lines.filter(Boolean).join(gap);
}
