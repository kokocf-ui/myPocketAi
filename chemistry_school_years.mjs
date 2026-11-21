// Chemistry teaching progression by country year; only documentary country mappings
// claim framework alignment. Other country grades retain a labelled advisory plan.
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
export const CHEMISTRY_GRADE_FRAMEWORKS=Object.freeze({
 RO:{source:'https://www.edu.ro/Ordin_ministru_3393_2017',
   lower:{
    '7':['fundamentals','solutions','atomic','periodic','bonding','inorganic','acids'],
    '8':['reactions','inorganic','acids','solutions']
   },noteRo:'Chimie ca disciplină distinctă din clasa a VII-a. Tema și competențele urmează OMEN 3393/2017; ordinea capitolelor poate fi adaptată de profesor.',
     noteEn:'Separate Chemistry begins in Year 7 (Romanian grade VII). Topics follow OMEN 3393/2017; lesson order is the teacher’s choice.'}
});
export const CHEMISTRY_ENGLAND_KS3='https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study';
export function chemistryGradeTopicPlan({country='',stage='lower',grade='',years=[],topics=[]}={}){
 const id=String(grade),known=CHEMISTRY_GRADE_FRAMEWORKS[country]?.[stage]?.[id];
 if(known){
  const registry=new Map(topics.filter(x=>!x.specialty).map(t=>[t.id,t]));
  return {country,stage,grade,status:'official-framework-topic-alignment',source:CHEMISTRY_GRADE_FRAMEWORKS[country].source,
   topics:known.map(k=>registry.get(k)).filter(Boolean),
   note:CHEMISTRY_GRADE_FRAMEWORKS[country].noteRo};
 }
 if(country==='GB-ENG'&&stage==='lower'){
  // England specifies KS3 by the end of the stage, not a national Y7/Y8/Y9 course order.
  const group={
   'Y7':['fundamentals','atomic','solutions','periodic'],
   'Y8':['bonding','reactions','inorganic','acids'],
   'Y9':['atomic','bonding','reactions','acids','solutions']
  }[id];
  if(group){
   const reg=new Map(topics.filter(x=>!x.specialty).map(x=>[x.id,x]));
   return {country,stage,grade,status:'official-ks3-stage-advisory-sequence',
    source:CHEMISTRY_ENGLAND_KS3,topics:group.map(k=>reg.get(k)).filter(Boolean),
    note:'England Key Stage 3 Science chemistry content; suggested year distribution is NOT statutory by year.'};
  }
 }
 // Keep each country’s real school-year labels from eduYearOptions, without
 // inventing national grade equivalences; each stage varies per actual year.
 return scienceGradeTopicPlan({country,subject:'chemistry',stage,grade,years,topics});
}
export function chemistryVisualizationFor({topic='',stage='',grade='',courseVisual=''}={}){
 const t=String(topic||'');
 const year=String(grade||'');
 if(stage==='primary')return null; // integrated science: no charts imposed
 if(courseVisual)return courseVisual; // university authored course mapping
 // Only depict a visual model relevant to the topic AND age group.
 const map={
  fundamentals:'separation',atomic:'atom',periodic:'periodic',bonding:'bond',
  reactions:'reaction',inorganic:'reaction',solutions:'solubility',
  acids:'ph',organic:'molecule',physical:'energy-profile',
  electrochem:'cell',analytical:'calibration',biochemistry:'enzyme',
  advanced:'equilibrium'
 };
 const kind=map[t]||null;
 if(!kind)return null;
 if(stage==='lower'&&['physical','electrochem','analytical','biochemistry','advanced'].includes(t))return null;
 if(stage==='lower'&&t==='solutions'&&year==='8')return 'stoichiometry'; // not a duplicate solubility chart
 if(stage==='upper'&&t==='solutions')return 'concentration';
 return kind;
}
