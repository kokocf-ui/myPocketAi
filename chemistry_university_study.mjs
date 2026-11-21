import {CHEMISTRY_UNIVERSITY_CORE} from './chemistry_university_core.mjs';
import {CHEMISTRY_SPECIALTY_TOPICS,CHEMISTRY_SPECIALTY_LESSONS} from './chemistry_advanced.mjs';
import {CHEMISTRY_STUDY_CONCEPTS} from './chemistry_school_depth.mjs';
import {chemistryUniversityRoute} from './chemistry_university_europe.mjs';
// 28 distinct core + 28 authored specialist chapters, each with original
// three sublessons, available only in the selected year and specialisation.
export const CHEMISTRY_UNIVERSITY_SPECIALTY_YEARS=Object.freeze([3,4,4,5]);
export const CHEMISTRY_UNIVERSITY_COURSE_COUNT=CHEMISTRY_UNIVERSITY_CORE.length+CHEMISTRY_SPECIALTY_TOPICS.length;
export function chemistryUniversityCourseChoices({year=0,specialty=''}={}){
 const y=Number(year),track=String(specialty);
 if(y<1||y>5||!track)return [];
 const cores=CHEMISTRY_UNIVERSITY_CORE.filter(x=>x.year===y).map(x=>({
  id:'uni-chem-core-'+x.id,courseId:x.id,originalTopic:x.topic,
  ro:x.ro,en:x.en,level:'advanced',year:y,courseType:'core'
 }));
 const specialists=CHEMISTRY_SPECIALTY_TOPICS.filter(x=>x.specialty===track)
  .filter((x,index)=>CHEMISTRY_UNIVERSITY_SPECIALTY_YEARS[index]===y).map(x=>({
   id:'uni-chem-spec-'+x.id,courseId:x.id,originalTopic:x.id,
   ro:x.ro,en:x.en,level:'advanced',year:y,courseType:'specialist'
  }));
 return [...cores,...specialists];
}
export function chemistryUniversityStudyDocument({courseId='',country='',routeId='',year=0,
 specialty='',language='ro',lessons=[]}={}){
 const route=chemistryUniversityRoute(country,routeId);
 const y=Number(year),ro=language==='ro',t=(a,b)=>ro?a:b;
 if(!route||!Number.isInteger(y)||y<1||y>route.years)return null;
 const core=CHEMISTRY_UNIVERSITY_CORE.find(x=>x.id===courseId&&x.year===y);
 const spec=CHEMISTRY_SPECIALTY_TOPICS.find(x=>x.id===courseId&&x.specialty===specialty);
 if(!core&&!spec)return null;
 if(spec){
  const order=CHEMISTRY_SPECIALTY_TOPICS.filter(x=>x.specialty===specialty).findIndex(x=>x.id===spec.id);
  if(CHEMISTRY_UNIVERSITY_SPECIALTY_YEARS[order]!==y)return null;
 }
 const name=t(core?.ro||spec?.ro,core?.en||spec?.en);
 const topic=core?.topic||'advanced';
 const base=CHEMISTRY_STUDY_CONCEPTS[topic]||CHEMISTRY_STUDY_CONCEPTS.advanced;
 const available=spec?
  CHEMISTRY_SPECIALTY_LESSONS.filter(x=>x.topic===spec.id):
  (Array.isArray(lessons)?lessons:[]).filter(x=>x.subject==='chemistry'&&x.topic===topic&&x.level==='advanced').slice(0,5);
 const gap='\n\n';
 const result=[
  '# '+name,
  t('Chimie universitară · anul ','University Chemistry · year ')+y+
   t(' din traseul de ',' of a ')+route.years+t(' ani','-year route'),
  country+' · '+t(route.noticeRo,route.noticeEn),
  '# '+t('Obiective ale cursului','Course learning objectives'),
  t(core?.conceptRo||base.conceptRo,core?.conceptEn||base.conceptEn),
  t('La acest nivel învățăm să justificăm ipotezele, să diferențiem observațiile de inferențe și să explicăm condițiile de aplicare a unei relații chimice.',
    'At this level we justify assumptions, distinguish observations from inferences and explain the scope of each chemical relation.'),
  '# '+t('Fundamentare și simboluri','Conceptual foundations and symbols'),
  t(base.conceptRo,base.conceptEn),
  t(base.symbolsRo,base.symbolsEn),
  '# '+t('Formula și unitățile','Formula and units'),
  core?.formula||available[0]?.formula||base.formula,
  t('Verifică simbolurile, unitățile, mediul și condițiile de echilibru. Coeficienții din ecuații chimice trebuie să conserve numărul atomilor și sarcina. O relație cinetică nu definește singură spontaneitatea.',
    'Check symbols, units, medium and equilibrium assumptions. Reaction coefficients must conserve atoms and charge. A kinetic relation alone does not determine spontaneity.'),
  '# '+t('Exemplu lucrat','Worked example'),
  t(core?.exampleRo||base.exampleRo,core?.exampleEn||base.exampleEn),
  t('Explică datele inițiale, substituția în relație și controlul rezultatului. Nu atribui un număr măsurat dacă nu există un set de date.',
    'State the initial data, the substitution and the result check. Never claim measured quantities without a dataset.')
 ];
 if(available.length){
  result.push('# '+t('Subcapitole distincte','Distinct academic subtopics'));
  for(const [i,lesson] of available.entries()){
   result.push('## '+(i+1)+'. '+(ro?lesson.title:'Specialist topic '+(i+1)),
    ro?lesson.statement:'Technical explanation from the original Romanian course notes: '+lesson.statement,
    t('Relația modelului: ','Model relation: ')+(lesson.formula||'—'),
    t('Cerință: explică mărimile din relație, domeniul de valabilitate și o consecință verificabilă a ei.',
      'Task: explain the variables, the model domain and one experimentally testable consequence.'));
  }
 }
 result.push(
  '# '+t('Problemă și rezolvare','Problem and worked answer'),
  t(base.questionRo,base.questionEn),
  t('Rezolvare argumentată: ','Reasoned solution: ')+t(base.answerRo,base.answerEn),
  '# '+t('Investigație și reprezentare relevantă','Investigation and relevant representation'),
  t(base.investigationRo,base.investigationEn),
  t('Un grafic se include numai când există variabile cantitative relevante pentru curs. Marchează unitățile, datele folosite și incertitudinea; un desen schematic nu trebuie prezentat drept rezultat experimental.',
    'Use a graph only when the course has meaningful quantitative variables. Label units, inputs and uncertainties; a schematic is not an experimental measurement.'),
  '# '+t('Analiză critică și siguranță','Critical analysis and safety'),
  t('Compară rezultatul așteptat cu date științifice publicate. Evaluarea riscurilor, a erorilor sistematice și a limitărilor instrumentale este obligatorie în laborator; fără proceduri nesupravegheate pentru substanțe periculoase.',
    'Compare predictions with published scientific data. Laboratory work requires risk assessment, systematic error control and instrument limitations; no unsupervised hazardous chemical procedures.'),
  '# '+t('Verificarea învățării','Knowledge check'),
  t('Descrie o ipoteză a modelului și un experiment sigur sau un set de date care ar putea să o infirme. Explică de ce acea verificare este relevantă pentru curs.',
    'Describe a model assumption and a safe experiment or published dataset that could falsify it, explaining why the test is relevant.'),
  t('Documente de referință pentru durata studiilor: ','Degree-duration reference: ')+(route.source||'')
 );
 return result.filter(Boolean).join(gap);
}
