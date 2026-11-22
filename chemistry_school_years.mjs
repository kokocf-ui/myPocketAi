// Chemistry teaching progression by country year; only documentary country mappings
// claim framework alignment. Other country grades retain a labelled advisory plan.
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {chemistryCountryGradePlan} from './chemistry_country_alignment.mjs';
export const CHEMISTRY_GRADE_FRAMEWORKS=Object.freeze({
 RO:{source:'https://www.edu.ro/Ordin_ministru_3393_2017',
   lower:{
    '7':['fundamentals','solutions','atomic','periodic','bonding'],
    '8':['reactions','inorganic','acids','solutions','bonding']
   },noteRo:'Chimie ca disciplină distinctă din clasa a VII-a. Tema și competențele urmează OMEN 3393/2017; ordinea capitolelor poate fi adaptată de profesor.',
     noteEn:'Separate Chemistry begins in Year 7 (Romanian grade VII). Topics follow OMEN 3393/2017; lesson order is the teacher’s choice.'}
});
// Full upper-secondary thematic catalogue. Not a profile-specific mandatory
// curriculum: national pathways and the 2026 Romanian cohort transition differ.
// Every topic below has four long, distinct study documents in the offline bank.
export const CHEMISTRY_UPPER_STUDY_SEQUENCE=Object.freeze([
 ['fundamentals','atomic','periodic','bonding','reactions','inorganic','solutions','acids'],
 ['inorganic','reactions','solutions','acids','electrochem','physical','analytical','organic'],
 ['organic','bonding','reactions','solutions','physical','biochemistry','electrochem','analytical'],
 ['organic','physical','electrochem','analytical','biochemistry','solutions','acids','reactions']
].map(list=>Object.freeze(list)));
export const CHEMISTRY_ENGLAND_KS3='https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study';
export function chemistryGradeTopicPlan({country='',stage='lower',grade='',years=[],topics=[]}={},fallbackPlan=scienceGradeTopicPlan){
 const id=String(grade),known=CHEMISTRY_GRADE_FRAMEWORKS[country]?.[stage]?.[id];
 if(stage==='lower'){
  const schoolYears=years.length?years:country==='RO'?
   ['5','6','7','8'].map(id=>({id})):country==='GB-ENG'?
   ['Y7','Y8','Y9'].map(id=>({id})):[{id}];
  const plan=chemistryCountryGradePlan({country,stage,grade:id,years:schoolYears});
  const registry=new Map(topics.filter(x=>x&&!x.specialty).map(x=>[x.id,x]));
  return {...plan,
   status:plan.status==='not-offered'||plan.status==='invalid-selection'?plan.status:
    country==='RO'?'official-framework-topic-alignment':
    country==='GB-ENG'?'official-ks3-stage-advisory-sequence':'general-learning',
   topics:plan.topics.map(key=>registry.get(key)).filter(Boolean)};
 }
 if(stage==='upper'){
  const index=country==='RO'&&/^(9|10|11|12)$/.test(id)?Number(id)-9:
   years.findIndex(y=>String(y?.id)===id);
  if(index<0)return {country,stage,grade,status:'invalid-selection',topics:[],note:'Unknown year'};
  const registry=new Map(topics.filter(x=>!x.specialty&&x.minLevel!=='advanced').map(x=>[x.id,x]));
  const ids=CHEMISTRY_UPPER_STUDY_SEQUENCE[Math.min(3,Math.floor(index*4/Math.max(4,years.length)))];
  // RO grades 9–12 correspond to actual year positions; other countries keep their own year labels.
  const sequence=country==='RO'?CHEMISTRY_UPPER_STUDY_SEQUENCE[Math.min(3,index)]:ids;
  return {country,stage,grade,
   status:'general-learning',
   source:country==='RO'?'https://www.edu.ro/press_rel_02_2026':'',
   topics:sequence.map(key=>registry.get(key)).filter(Boolean),
   note:country==='RO'?
    'Parcurs de studiu pe clase, nu programă certificată pentru fiecare profil. Programa 2026 se aplică treptat: clasa IX din 2026–2027; clasele X–XII pot urma programele anterioare.':
    'Advisory thematic selection for the country’s real school-year labels, not a verified statutory year-by-year national syllabus.'};
 }
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
 return fallbackPlan({country,subject:'chemistry',stage,grade,years,topics});
}
export function chemistryVisualizationFor({topic='',stage='',grade='',courseVisual=''}={}){
 const t=String(topic||'');
 const year=String(grade||'');
 if(stage==='primary')return null; // integrated science: no charts imposed
 if(courseVisual)return courseVisual; // university authored course mapping
 // Only depict a visual model relevant to the topic AND age group.
 const map={
  fundamentals:'separation',atomic:'atom',periodic:'periodic',bonding:'bond',
  reactions:'reaction',inorganic:null,solutions:'solubility',
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
