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
 if(fullDetail){
  parts.push('# '+(ro?'Lecție detaliată':'Detailed study content'),fullDetail);
 }else if(!specific&&chapterLesson?.explanation){
  parts.push('# '+(ro?'Contextul științific':'Scientific context'),
   chapterLesson.explanation);
 }else if(!specific&&Array.isArray(guide)&&guide[0]){
  parts.push('# '+(ro?'Context':'Context'),guide[0]);
 }
 if(formula&&formula!=='—'){
  parts.push('# '+(ro?'Relație sau notație':'Formula or notation'),formula,
   ro?'Formula ori simbolul trebuie interpretat în condițiile explicate în lecție; nu inventa date care lipsesc.':
    'Explain the notation and assumptions; do not invent missing quantities.');
 }
 const worked=specific?entry.workedExample:chapterLesson?.workedExample||guide?.[1];
 if(worked){
  parts.push('# '+(ro?'Exemplu explicat':'Worked illustration'),worked);
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
 }else if(subject==='physics'){
  parts.push(ro?'Siguranță: circuitele electrice se studiază numai cu simulări sau surse școlare adecvate, nu la prize.':
   'Safety: use safe school low-voltage sources or simulations, never mains electricity.');
 }else if(subject==='biology'){
  parts.push(ro?'Siguranță: observă viețuitoarele fără să le rănești și nu transforma lecțiile în teste medicale.':
   'Safety: observe organisms without harm; class activities are not medical tests.');
 }else if(subject==='astronomy'){
  parts.push(ro?'Siguranță: nu privi Soarele direct, nici cu instrumente fără filtre solare certificate.':
   'Safety: never look at the Sun directly or through instruments without certified solar filters.');
 }
 parts.push(ro?
  'Material didactic original bazat pe domeniul de studiu; nu este o pagină copiată din manual și nu impune ordinea lecțiilor în toate școlile.':
  'Original advisory learning material, not an official national textbook or a prescribed weekly schedule.');
 return parts.filter(Boolean).join(eol);
}
export function scienceSchoolLessonAssessment({
 entry=null,subject='',topic='',language='ro',chapterGuide=null
}={}){
 if(!entry||!entry.title)return null;
 const ro=language==='ro';
 const hasOriginalQuestion=Boolean(entry.exercise&&entry.answer);
 return {subject,topic,stage:'lower',lang:ro?'ro':'en',
  prompt:entry.exercise||
   (ro?'Explică noțiunea „'+entry.title+'” folosind definiția și exemplul din fișa de studiu.':
    'Explain the concept '+entry.title+' using the given definition and case.'),
  guide:[hasOriginalQuestion?entry.answer:null,entry.statement,
   entry.workedExample||null,
   entry.formula&&entry.formula!=='—'?entry.formula:null,
   Array.isArray(chapterGuide)?chapterGuide[2]:null].filter(Boolean).join(' '),
  // Exact numeric checks apply ONLY to the original 26 chapter-level exercises,
  // not to similarly named but distinct sublesson questions.
  localVerification:false
 };
}
