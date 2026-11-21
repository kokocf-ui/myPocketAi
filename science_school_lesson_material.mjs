import {physicsGrade6TeacherNotes} from './physics_grade6_pedagogy.mjs';
import {physicsGrade6Formula} from './physics_grade6_formula_notes.mjs';
import {physicsGrade7TeacherGuide} from './physics_grade7_teacher_guides.mjs';
import {physicsGrade8TeacherGuide} from './physics_grade8_teacher_guides.mjs';

// Present a REAL distinct sublesson, not the same generic chapter for all
// buttons. Native catalogue notes are augmented by existing authored chapter
// guides, and original Romanian per-grade lessons supply their own case/tasks.
export function scienceSchoolLessonMaterial({
 entry=null,subject='',grade='',chapter='',language='ro',
 guide=null,chapterLesson=null,detailed=null
}={}){
 if(!entry||!entry.title||!entry.statement)return null;
 const ro=language==='ro',eol='\n\n',specific=Boolean(entry.workedExample);
 const title=String(entry.title);
 const core=String(entry.statement);
 const formula=String(entry.formula||'').trim();
 const fullDetail=typeof detailed==='string'&&detailed.trim().length>150?detailed.trim():null;
 const practice=entry.exercise||
  (ro?'Definește precis noțiunea „'+title+'”, explică unde se aplică și propune o verificare a exemplului.':
   'Explain the concept '+title+' in your own words and describe how the example could be checked.');
 const parts=[
  ro?'ȘTIINȚE · Fișă de învățare · Clasa '+grade:
   'SCIENCE · Study card · Year '+grade,
  (ro?'Capitol: ':'Chapter: ')+chapter,
  '# '+title
 ];
 if(!ro&&entry.language!=='en'){
  parts.push('Romanian reference lesson. A verified translation into the selected language is not available; this lesson is not presented as a certified national course.');
 }else if(!ro&&entry.language==='en'&&language!=='en'){
  parts.push('Original English reference material. Translation into the selected interface language is not independently verified; this is an advisory course, not a certified national syllabus.');
 }
 parts.push('# '+(ro?'Explicația noțiunii':'Concept explanation'),core);
 const romanianPhysics=subject==='physics'&&ro;
 // Apply lower-secondary teaching notes only to the actual source year.
 // Upper-secondary and university are different courses even where titles repeat.
 const sourceYear=String(entry.advisoryTier||entry.grade||grade);
 const teacherNotes=romanianPhysics&&sourceYear==='6'?physicsGrade6TeacherNotes(title,language):'';
 const introFormula=romanianPhysics&&sourceYear==='6'?physicsGrade6Formula(title):null;
 const teacherGuide=romanianPhysics&&sourceYear==='7'?physicsGrade7TeacherGuide(title):
  romanianPhysics&&sourceYear==='8'?physicsGrade8TeacherGuide(title):null;
 // A formula and its symbols come BEFORE any worked calculation.
 const mainFormula=teacherGuide?.formula||introFormula?.formula||(formula&&formula!=='—'?formula:'');
 if(mainFormula){
  parts.push('# '+(ro?'Formula de pornire':'Starting formula'),mainFormula);
  const symbols=teacherGuide?.symbols||introFormula?.symbols||entry.symbols;
  if(symbols)parts.push('# '+(ro?'Ce înseamnă simbolurile și unitățile':'Symbols and units'),symbols);
 }
 if(entry.method)parts.push('# '+(ro?'Cum aplici modelul':'How to apply the model'),entry.method);
 if(teacherNotes)parts.push('# Explicație aprofundată',teacherNotes);
 if(teacherGuide){
  parts.push('# Cum gândim și aplicăm, pas cu pas',teacherGuide.method,
   '# Exemplu rezolvat pas cu pas',teacherGuide.worked,
   '# Cum verificăm rezultatul și ce greșeli evităm',teacherGuide.check);
 }else if(introFormula){
  parts.push('# Exemplu cu formula',introFormula.worked,
   '# Verifică dacă ai înțeles',introFormula.check);
 }
 if(fullDetail){
  parts.push('# '+(ro?'Lecție detaliată':'Detailed study content'),fullDetail);
 }else if(!specific&&chapterLesson?.explanation){
  parts.push('# '+(ro?'Contextul științific':'Scientific context'),
   chapterLesson.explanation);
 }else if(!specific&&Array.isArray(guide)&&guide[0]){
  parts.push('# '+(ro?'Context':'Context'),guide[0]);
 }
 const worked=specific?entry.workedExample:chapterLesson?.workedExample||guide?.[1];
 if(worked){
  parts.push('# '+(ro?(teacherGuide||introFormula?'Observație și exemplu suplimentar':'Exemplu explicat'):'Worked illustration'),worked);
 }
 const misconception=!specific?(chapterLesson?.answer||guide?.[2]):null;
 if(misconception){
  parts.push('# '+(ro?'Ce verificăm și ce evităm':'Common pitfall'),misconception);
 }
 parts.push('# '+(ro?'Exercițiu pentru elev':'Pupil exercise'),practice,
  ro?'Folosește butonul „Verifică răspunsul” pentru a trimite soluția ta, nu pentru a copia rezolvarea.':
   'Use Check my answer to submit your own answer, not to copy an answer key.');
 if(subject==='chemistry'){
  parts.push(ro?'Siguranță: nu gusta și nu amesteca substanțe necunoscute; experimentele de laborator se fac supravegheat.':
   'Safety: never taste or mix unknown chemicals; lab activities require supervision.');
 }else if(subject==='physics'&&['electric','circuits'].includes(entry.topic)){
  parts.push(ro?'Siguranță: circuitele electrice se studiază numai cu simulări sau surse școlare adecvate, nu la prize.':
   'Safety: use safe school low-voltage sources or simulations, never mains electricity.');
 }else if(subject==='biology'){
  parts.push(ro?'Siguranță: observă viețuitoarele fără să le rănești și nu transforma lecțiile în teste medicale.':
   'Safety: observe organisms without harm; class activities are not medical tests.');
 }else if(subject==='astronomy'){
  parts.push(ro?'Siguranță: nu privi Soarele direct, nici cu instrumente fără filtre solare certificate.':
   'Safety: never look at the Sun directly or through instruments without certified solar filters.');
 }
 // Pedagogical provenance belongs in metadata/curriculum status, not as a repeated page in the pupil's lesson.
 return parts.filter(Boolean).join(eol);
}
export function scienceSchoolLessonAssessment({
 entry=null,subject='',topic='',language='ro',chapterGuide=null
}={}){
 if(!entry||!entry.title)return null;
 const ro=language==='ro';
 const hasOriginalQuestion=Boolean(entry.exercise&&entry.answer);
 const referenceGuide=subject==='physics'&&ro?
  (physicsGrade7TeacherGuide(entry.title)||physicsGrade8TeacherGuide(entry.title)):null;
 return {subject,topic,stage:'lower',lang:ro?'ro':'en',
  prompt:entry.exercise||
   (ro?'Explică noțiunea „'+entry.title+'” folosind definiția și exemplul din fișa de studiu.':
    'Explain the concept '+entry.title+' using the given definition and case.'),
  guide:[hasOriginalQuestion?entry.answer:null,entry.statement,
   entry.workedExample||null,
   referenceGuide?.formula||physicsGrade6Formula(entry.title)?.formula||
    (entry.formula&&entry.formula!=='—'?entry.formula:null),
   referenceGuide?.worked||null,
   Array.isArray(chapterGuide)?chapterGuide[2]:null].filter(Boolean).join(' '),
  // Exact numeric checks apply ONLY to the original 26 chapter-level exercises,
  // not to similarly named but distinct sublesson questions.
  localVerification:false
 };
}
