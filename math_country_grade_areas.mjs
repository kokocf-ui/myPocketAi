import {mathInDepthEntries,mathCountryCourseEntries} from './math_depth_courses.mjs';
import {ro5TopicLessons,RO5_MATH_UNITS} from './math_ro5_curriculum.mjs';
import {ro678TopicLessons,ro678GradeSummary} from './math_ro678_curriculum.mjs';
import {ENGLAND_Y6_MATH_LESSONS} from './math_england_y6_curriculum.mjs';
import {mathUpperCohortGuidance} from './math_ro_upper_cohort_policy.mjs';
import {mathCountryYearSequence,mathCountryPhasePlan,mathCountryEvidence} from './math_country_year_alignment_2026.mjs';
import {franceGrade5eLessons} from './math_france_5e_2026.mjs';
import {ITALY_MATH_YEARS,italyMathGradeProfile} from './math_italy_framework_2026.mjs';
import {portugalMath2026Lessons,PORTUGAL_MATH_2026_SOURCE} from './math_portugal_2026.mjs';
// Mathematics learning paths for every European country in the Education picker.
// A progression is *advisory* unless an official country/grade source is attached.
// Stage years are supplied by the shared school-year mapping, never inferred from
// Romanian class numbers (UK year numbering and reform cohorts differ).
const PATHS=Object.freeze({
 beginner:[
  [['arithmetic','Aritmetică: numere și adunare/scădere'],['geometry','Forme geometrice'],['measurement','Măsurători']],
  [['arithmetic','Aritmetică: înmulțire și împărțire'],['geometry','Forme și corpuri geometrice'],['measurement','Măsurători și probleme']],
  [['arithmetic','Aritmetică: operații și probleme'],['geometry','Figuri, perimetre și spațiu'],['measurement','Unități de măsură']],
  [['arithmetic','Aritmetică: fracții și operații'],['geometry','Figuri și corpuri geometrice'],['measurement','Măsurători și date']],
  [['arithmetic','Aritmetică: numere mari și fracții'],['geometry','Geometrie: unghiuri și transformări'],['measurement','Măsurători și arii']],
  [['arithmetic','Aritmetică: rapoarte și procente'],['geometry','Geometrie: arii și volume'],['statistics','Statistică: medii și diagrame']]
 ],
 lower:[
  [['algebra','Algebră: numere, operații și expresii'],['geometry','Geometrie: noțiuni introductive'],['statistics','Date și reprezentări']],
  [['algebra','Algebră: rapoarte, proporții și ecuații'],['geometry','Geometrie: unghiuri și figuri'],['statistics','Statistică introductivă']],
  [['algebra','Algebră: expresii și ecuații'],['geometry','Geometrie: proprietăți și demonstrații'],['statistics','Probabilități introductive']],
  [['algebra','Algebră: ecuații, inecuații și funcții'],['geometry','Geometrie: teoreme și aplicații'],['statistics','Statistică și probabilități']]
 ],
 medium:[
  [['algebra','Algebră și ecuații'],['functions','Funcții și grafice'],['geometry','Geometrie analitică'],['statistics','Statistică descriptivă']],
  [['functions','Funcții și grafice'],['trigonometry','Trigonometrie'],['algebra','Polinoame și ecuații'],['geometry','Geometrie analitică'],['statistics','Combinatorică și probabilități']],
  [['analysis','Analiză matematică introductivă'],['trigonometry','Trigonometrie'],['statistics','Statistică și probabilități'],['algebra','Algebră și numere complexe'],['functions','Funcții și limite'],['geometry','Vectori și geometrie']],
  [['analysis','Analiză matematică'],['algebra','Algebră și aplicații'],['statistics','Probabilități'],['functions','Studiul funcțiilor'],['trigonometry','Ecuații trigonometrice'],['geometry','Geometrie în spațiu']]
 ],
 advanced:[
  [['analysis','Analiză matematică'],['linear-algebra','Algebră liniară'],['discrete','Matematică discretă']],
  [['analysis','Analiză în mai multe variabile'],['linear-algebra','Algebră liniară'],['statistics','Probabilități']],
  [['differential','Ecuații diferențiale'],['analysis','Analiză avansată'],['discrete','Matematică discretă']],
  [['analysis','Matematică avansată pe domeniu'],['statistics','Statistică matematică'],['discrete','Structuri discrete']]
 ]
});
// General higher-education study sequence, not a national degree programme.
// Where universities differ by institution or specialisation, do not invent
// an official national four-year syllabus. Three/four stages here are clearly
// labelled advisory; users can select the phase of their own course.
export function mathCountryStudyYears({country,stage,years=[]}={}){
 const code=String(country||'').toUpperCase(),st=String(stage||'');
 if(code==='IT'&&ITALY_MATH_YEARS[st])return ITALY_MATH_YEARS[st].map(x=>({...x}));
 if(st!=='advanced')return mathCountryYearSequence({country:code,stage:st,years});
 if(Array.isArray(years)&&years.length>=3)return years;
 const count=({'RO':3,'GB-ENG':3,'GB-WLS':3,'GB-NIR':3,'GB-SCT':4})[code]||4;
 return Array.from({length:count},(_,i)=>({
  id:String(i+1),
  ro:'An universitar orientativ '+(i+1),
  en:'Advisory university study year '+(i+1),
  curriculumVerified:false,nationalYearVerified:false
 }));
}
export function mathCountryGradeAreas({country,stage,grade,years}={}){
 const st=stage==='primary'?'beginner':stage==='intermediate'?'medium':String(stage||'');
 const yearList=Array.isArray(years)?years:[];
 const index=yearList.findIndex(x=>String(x.id)===String(grade));
 if(!PATHS[st]||index<0)return {status:'invalid-selection',country,stage:st,grade,units:[]};
 if(country==='IT'){
  const native=italyMathGradeProfile(grade);
  if(native&&native.stage===st){
   const alignment=mathCountryPhasePlan({country,stage:st,grade,years:yearList});
   const clientStage=st==='beginner'?'primary':st==='medium'?'intermediate':st;
   return {status:'general-learning',country,stage:st,grade,
    source:native.source,manualExample:null,note:native.note,
    cohort:native.cohort,
    units:native.units.map(({id,ro,en,it})=>({
     id,ro,en,it,focus:'',countrySpecific:true,
     lessonCount:mathCountryCourseEntries({
      country,stage:clientStage,grade,phase:alignment.phase,
      phases:alignment.phases,topic:id}).length,
     curriculumCompletion:'partial-source-review',
     curriculumSource:native.source,manualExample:null
    }))};
  }
 }
 if(country==='PT'&&st==='lower'&&['5','6'].includes(String(grade))){
  // Official DGE 2026 references are per grade; Year 5 and Year 6 must not
  // share the same generic phase just because both belong to the 2nd cycle.
  const g=String(grade),source=PORTUGAL_MATH_2026_SOURCE[g];
  const branches=[
   ['algebra','Numere, fracții și operații','Numbers, fractions and operations'],
   ['functions',g==='5'?'Expresii numerice și raționament':'Rapoarte și proporționalitate',
     g==='5'?'Numerical expressions and reasoning':'Ratios and proportionality'],
   ['statistics','Date și probabilități','Data and probability'],
   ['geometry','Geometrie și măsurători','Geometry and measures']
  ];
  return {status:'general-learning',country,stage:st,grade,
   note:'Portugalia: anul '+g+
    ', 2026/27. Lecții originale corelate tematic cu Aprendizagens Essenciais DGE (versiunea în vigoare, iulie 2018). Proiectul din consultarea publică 2026 nu este prezentat ca programă aplicabilă. Acoperirea anuală și cuprinsul unui manual concret rămân necertificate.',
   source,manualExample:null,
   units:branches.map(([id,ro,en])=>({
    id,ro,en,focus:'',countrySpecific:true,
    lessonCount:portugalMath2026Lessons({grade:g,topic:id}).length,
    curriculumCompletion:'partial-source-review',curriculumSource:source,
    manualExample:null
   }))};
 }
 if(country==='FR'&&st==='lower'&&String(grade)==='5e'){
  const evidence=mathCountryEvidence({country,stage:st,grade});
  const units=[
   ['algebra','Numere, calcul și ecuații','Numbers, calculations and equations'],
   ['geometry','Geometrie plană și în spațiu','Plane and spatial geometry'],
   ['statistics','Statistică și probabilități','Statistics and probability'],
   ['functions','Proporționalitate și primele funcții','Proportionality and first functions']
  ].map(([id,ro,en])=>({id,ro,en,focus:'',
    lessonCount:franceGrade5eLessons(id).length,countrySpecific:true,
    curriculumCompletion:'partial-source-review',curriculumSource:evidence.source,
    manualExample:evidence.manualExample}));
  return {status:'general-learning',country,stage:st,grade,units,
   note:'Franța 5e (2026/27): 19 lecții originale grupate după capitolele manualului 2026; corelare tematică, fără validarea integrală a programei.',
   source:evidence.source,manualExample:evidence.manualExample};
 }
 const sequence=PATHS[st];
 const alignment=mathCountryPhasePlan({country,stage:st,grade,years:yearList});
 const phase=Math.max(0,Math.min(sequence.length-1,alignment.phase-1));
 const row=sequence[phase];
 const clientStage=st==='beginner'?'primary':st==='medium'?'intermediate':st;
 if(country==='RO'&&st==='lower'&&String(grade)==='5'){
  const summary={algebra:'Numere, calcule, metode aritmetice și fracții',
   geometry:'Elemente de geometrie și măsurători',
   statistics:'Colectarea, interpretarea și reprezentarea datelor'};
  return {status:'general-learning',country,stage:st,grade,
   note:'Clasa V: unități și lecții corelate cu MEN 3393/2017 și manualul Art Klett 2022; conținutul este original.',
   units:row.map(([id,ro])=>({id,ro,en:({algebra:'Numbers and arithmetic',geometry:'Geometry',statistics:'Data handling'})[id],
    focus:summary[id],lessonCount:ro5TopicLessons(id).length,
    curriculumUnitCount:RO5_MATH_UNITS.filter(x=>x.topic===id).length,
    countrySpecific:true}))};
 }
 if(country==='RO'&&st==='lower'&&['6','7','8'].includes(String(grade))){
  const selected=String(grade);
  const topics=selected==='8'?[...row,['functions','Funcții și grafice']]:row;
  return {status:'general-learning',country,stage:st,grade,
   note:'Clasa '+grade+': lecții originale legate de temele MEN 3393/2017; inventarul anual și evaluarea pedagogică necesită în continuare verificare.',
   units:topics.map(([id,ro])=>({id,ro,en:({
    algebra:'Numbers and algebra',geometry:'Geometry',
    statistics:'Data and probability',functions:'Functions and graphs'
   })[id]||ro,
    focus:'',lessonCount:ro678TopicLessons(selected,id).length,
    curriculumUnitCount:ro678GradeSummary(selected).length,
    countrySpecific:true,curriculumCompletion:'under-review'}))};
 }
 if(country==='RO'&&st==='medium'&&['9','10','11','12'].includes(String(grade))){
  const cohort=mathUpperCohortGuidance({country,grade});
  return {status:'general-learning',country,stage:st,grade,
   note:cohort.note,
   units:row.map(([id,ro])=>({id,ro,en:({
    algebra:'Algebra',functions:'Functions and graphs',
    geometry:'Analytic and spatial geometry',statistics:'Statistics',
    trigonometry:'Trigonometry',analysis:'Mathematical analysis'
   })[id]||ro,focus:'',
    lessonCount:mathCountryCourseEntries({country,stage:'intermediate',
     grade:String(grade),phase:phase+1,topic:id}).length,
    countrySpecific:false,curriculumCompletion:'unverified-advisory',
    schoolCohort:cohort.status}))};
 }
 if(country==='GB-ENG'&&st==='medium'&&['Y10','Y11'].includes(String(grade))){
  // DfE KS4/GCSE is statutory across the key stage, NOT separately prescribed
  // for Year 10 and 11. This progression is therefore a source-informed aid.
  const selected=String(grade);
  return {status:'general-learning',country,stage:st,grade,
   note:'Anglia, Key Stage 4 / GCSE: teme suplimentare raportate la cerințele DfE; repartizarea Year 10–11 este orientativă. Nu este un curs național anual verificat.',
   units:row.map(([id,ro])=>({id,ro,en:({
    algebra:'Number, ratio and algebra',functions:'Functions and graphs',
    geometry:'Geometry and measures',statistics:'Statistics and probability',
    trigonometry:'Trigonometry'})[id]||ro,focus:'',
    lessonCount:mathCountryCourseEntries({country,stage:'intermediate',grade:selected,
     phase:phase+1,topic:id}).length,countrySpecific:false,
    curriculumCompletion:'partial-source-review'}))};
 }
 if(country==='GB-ENG'&&st==='beginner'&&String(grade)==='Y6'){
  const topics=[...row,['algebra','Introducere în algebră'],['measurement','Măsurători și volume']];
  return {status:'general-learning',country,stage:st,grade,
   note:'England Year 6: 21 lecții originale suplimentare corelate cu obiectivele DfE, alături de materialul general; nu este o certificare a acoperirii anuale integrale.',
   units:topics.map(([id,ro])=>({id,ro,en:({
    arithmetic:'Number and calculation',geometry:'Geometry and shapes',
    statistics:'Statistics and data',algebra:'Introductory algebra',
    measurement:'Measurement, area and volume'
   })[id]||ro,focus:'',
    lessonCount:mathInDepthEntries({stage:'primary',phase:6,topic:id}).length+
      ENGLAND_Y6_MATH_LESSONS.filter(lesson=>lesson.topic===id).length,
    countrySpecific:false,curriculumCompletion:'partial-source-review'}))};
 }
 const evidence=mathCountryEvidence({country,stage:st,grade});
 return {status:'general-learning',country,stage:st,grade,
  note:evidence.note+' Parcurgere orientativă; un manual ales poate avea altă ordine a capitolelor.',
  source:evidence.source,manualExample:evidence.manualExample,
  units:row.map(([id,ro])=>({id,ro,en:({
   arithmetic:'Arithmetic',geometry:'Geometry and shapes',measurement:'Measurement',
   algebra:'Algebra',statistics:'Statistics and probability',functions:'Functions and graphs',
   trigonometry:'Trigonometry',analysis:'Mathematical analysis',
   'linear-algebra':'Linear algebra',discrete:'Discrete mathematics',
   differential:'Differential equations'})[id]||ro,focus:'',
   lessonCount:mathCountryCourseEntries({country,stage:clientStage,grade,
     phase:alignment.phase,phases:alignment.phases,topic:id}).length,
   countrySpecific:false,curriculumCompletion:'unverified-advisory',
   curriculumSource:evidence.source||null,manualExample:evidence.manualExample||null}))};
}
