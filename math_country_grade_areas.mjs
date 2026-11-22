import {mathInDepthEntries} from './math_depth_courses.mjs';
import {ro5TopicLessons,RO5_MATH_UNITS} from './math_ro5_curriculum.mjs';
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
 if(st!=='advanced')return Array.isArray(years)?years:[];
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
 const sequence=PATHS[st];
 const phase=Math.min(sequence.length-1,Math.floor(index*sequence.length/Math.max(sequence.length,yearList.length)));
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
 return {status:'general-learning',country,stage:st,grade,
  note:'Parcurs matematic orientativ, diferențiat pe etapă și an; nu reprezintă programa națională verificată.',
  units:row.map(([id,ro])=>({id,ro,en:({
   arithmetic:'Arithmetic',geometry:'Geometry and shapes',measurement:'Measurement',
   algebra:'Algebra',statistics:'Statistics and probability',functions:'Functions and graphs',
   trigonometry:'Trigonometry',analysis:'Mathematical analysis',
   'linear-algebra':'Linear algebra',discrete:'Discrete mathematics',
   differential:'Differential equations'})[id]||ro,focus:'',lessonCount:mathInDepthEntries({stage:clientStage,phase:phase+1,topic:id}).length}))};
}
