import {SCIENCE_RO_PHYSICS_EXTRAS} from './science_ro_physics_extras.mjs';
import {PHYSICS_RO_GRADE8_MORE} from './science_ro_physics_grade8_more.mjs';
import {BIOLOGY_RO_GRADE5} from './science_ro_biology_grade5.mjs';
import {BIOLOGY_RO_GRADE6} from './science_ro_biology_grade6.mjs';
import {BIOLOGY_RO_GRADE7} from './science_ro_biology_grade7.mjs';
import {BIOLOGY_RO_GRADE8} from './science_ro_biology_grade8.mjs';
import {CHEMISTRY_RO_GRADE8} from './science_ro_chemistry_grade8.mjs';
import {PHYSICS_RO_ADDITIONS} from './science_ro_physics_additions.mjs';
import {BIOLOGY_RO_ADDITIONS} from './science_ro_biology_additions.mjs';
import {physicsAdvisoryTopicLessons} from './physics_europe_lesson_bank.mjs';

// This is a controlled original teaching outline using the CONTENT AREAS in
// Romania's 2017 lower-secondary syllabuses. It is not a Ministry-approved
// textbook, nor a mandatory week-by-week scheme for every school.
export const SCIENCE_RO_2017_SOURCE='https://www.edu.ro/Ordin_ministru_3393_2017';
export const SCIENCE_RO_LOWER_TOPICS=Object.freeze({
 physics:Object.freeze({
  '6':['units','kinematics','dynamics','energy','heat','electric','electromagnetism','optics'],
  '7':['units','dynamics','kinematics','fluids','energy'],
  '8':['heat','thermodynamics','electric','circuits','electromagnetism','optics']
 }),
 chemistry:Object.freeze({
  '7':['fundamentals','solutions','atomic','periodic','bonding'],
  '8':['reactions','inorganic','acids','solutions','bonding']
 }),
 biology:Object.freeze({
  '5':['ecology','plants'],
  '6':['cells','plants','anatomy'],
  '7':['anatomy','plants','homeostasis'],
  '8':['genetics','evolution','ecology']
 })
});
export const SCIENCE_RO_PHYSICS_LABELS={
 '6':{optics:['Lumină, umbră și reflexie','Light, shadow and reflection'],
  electromagnetism:['Magneți și fenomene magnetice','Magnets and magnetic phenomena'],
  energy:['Energie și transformări simple','Energy and simple transformations']},
 '8':{thermodynamics:['Fenomene termice și calorimetrie','Thermal phenomena and calorimetry'],
  circuits:['Circuite de curent continuu','Direct-current circuits'],
  electromagnetism:['Efecte magnetice ale curentului','Magnetic effects of current'],
  optics:['Reflexie, refracție și lentile','Reflection, refraction and lenses']}
};
export const SCIENCE_RO_LESSON_EXTRAS=Object.freeze({
 chemistry:Object.freeze({'8':CHEMISTRY_RO_GRADE8}),
 biology:Object.freeze({'5':Object.freeze([...BIOLOGY_RO_GRADE5,...BIOLOGY_RO_ADDITIONS['5']]),
  '6':Object.freeze([...BIOLOGY_RO_GRADE6,...BIOLOGY_RO_ADDITIONS['6']]),
  '7':Object.freeze([...BIOLOGY_RO_GRADE7,...BIOLOGY_RO_ADDITIONS['7']]),
  '8':Object.freeze([...BIOLOGY_RO_GRADE8,...BIOLOGY_RO_ADDITIONS['8']])}),
 physics:Object.freeze({'6':Object.freeze([...SCIENCE_RO_PHYSICS_EXTRAS['6'],...PHYSICS_RO_ADDITIONS['6']]),
  '7':Object.freeze([...SCIENCE_RO_PHYSICS_EXTRAS['7'],...PHYSICS_RO_ADDITIONS['7']]),
  '8':Object.freeze([...SCIENCE_RO_PHYSICS_EXTRAS['8'],...PHYSICS_RO_GRADE8_MORE,...PHYSICS_RO_ADDITIONS['8']])})
});
export function scienceRoGradeTopics(subject,grade,topics=[]){
 const ids=SCIENCE_RO_LOWER_TOPICS[String(subject)]?.[String(grade)]||null;
 if(!ids)return null;
 const source=new Map(topics.filter(x=>x&&!x.specialty).map(x=>[x.id,x]));
 return ids.map(id=>{
  const topic=source.get(id);
  if(!topic)return null;
  const label=subject==='physics'?SCIENCE_RO_PHYSICS_LABELS[String(grade)]?.[id]:null;
  // A class VI introduction to optical phenomena must not become the
  // secondary/upper-level 'wave optics' course merely because its parent
  // topic has a higher minLevel in a legacy catalogue.
  return {...topic,minLevel:'beginner',...(label?{ro:label[0],en:label[1]}:{})};
 }).filter(Boolean);
}
function schoolReferenceLessons(subject,grade,topic){
 return (SCIENCE_RO_LESSON_EXTRAS[subject]?.[String(grade)]||[]).filter(x=>x.topic===topic);
}
export function scienceSchoolTopicLessons({country='',subject='',grade='',topic='',lessons=[],stage='lower',years=[]}={}){
 const localized=String(country).toUpperCase()==='RO';
 const id=String(grade);
 if(subject==='physics'&&!localized&&stage==='lower'&&Array.isArray(years)&&years.length){
  return physicsAdvisoryTopicLessons({
   country,stage,grade,topic,years,
   bank:SCIENCE_RO_LESSON_EXTRAS.physics,referenceLessons:lessons
  });
 }
 if(localized&&SCIENCE_RO_LOWER_TOPICS[subject]?.[id]&&
    !SCIENCE_RO_LOWER_TOPICS[subject][id].includes(topic))return [];
 const extras=localized?(SCIENCE_RO_LESSON_EXTRAS[subject]?.[id]||[]).filter(x=>x.topic===topic):[];
 const original=Array.isArray(lessons)?lessons.filter(entry=>entry&&
  entry.subject===subject&&entry.topic===topic&&entry.level==='beginner'&&
  !entry.specialty&&entry.statement&&entry.title):[];
 // Romanian years use their own subject-specific course; do not insert
 // inappropriate advanced prerequisites simply to reach a numeric target.
 // Biology year V primarily studies ecosystem diversity and classification.
 const filtered=localized&&subject==='biology'&&id==='5'&&topic==='plants'?
  original.filter(x=>/germin|cloroplast|fotosintez/i.test(x.title||'')).slice(0,2):original;
 // For Romanian Physics and Biology, the national grade-specific authored
 // cards take precedence. Do not merge generic cross-grade facts that could
 // silently introduce Grade VIII formulas into Grade VI.
 const ordered=localized&&['physics','biology'].includes(subject)&&extras.length?
  extras:extras.concat(filtered);
 const seen=new Set();
 return ordered.filter(entry=>{
  const key=String(entry.id||entry.title);
  if(seen.has(key))return false;
  seen.add(key);return true;
 });
}
export function scienceRoAnnualCoverage({subject='',grade='',lessons=[]}={}){
 const ids=SCIENCE_RO_LOWER_TOPICS[subject]?.[String(grade)]||[];
 const groups=ids.map(topic=>({
  topic,count:scienceSchoolTopicLessons({
   country:'RO',subject,grade,topic,lessons
  }).length
 }));
 return {subject,grade:String(grade),topicCount:ids.length,
  lessonCount:groups.reduce((sum,g)=>sum+g.count,0),groups,
  source:SCIENCE_RO_2017_SOURCE,
  // This check measures available original study cards, not official weeks
  // or a promise of national textbook completeness.
  studyDepthReady:groups.reduce((sum,g)=>sum+g.count,0)>=32&&
   groups.every(g=>g.count>=1)};
}
