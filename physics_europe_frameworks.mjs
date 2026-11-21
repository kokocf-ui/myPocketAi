// 2026/27: syllabus STAGE references and provisional year sequencing
// for Physics across the European Education picker. This file makes no
// assertion that a stage-level learning outcome is compulsory in every grade.
// A year-specific plan is labelled advisory unless a published specification
// prescribes that year. Regions/exam boards may override the common framework.
export const PHYSICS_EUROPE_REFERENCE='https://op.europa.eu/en/publication-detail/-/publication/b82d1d07-abf4-11f1-b9e5-01aa75ed71a1/language-en';
const refs=Object.freeze({
 RO:{source:'https://www.edu.ro/Ordin_ministru_3393_2017',scope:'national-stage',name:'Fizică · învățământ gimnazial',lowerEntry:'6',noLower:['5'],note:'Clasele VI–VIII; la liceu distribuția depinde de profil și de programa clasei.'},
 'GB-ENG':{source:'https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study',scope:'national-stage',name:'Science: physics component',integrated:['primary','lower'],note:'Key Stage 3 covers Years 7–9; topics are prescribed at key-stage level, NOT as a legally fixed sequence in each year. Year 12–13 programmes are qualification-dependent.'},
 'GB-SCT':{source:'https://education.gov.scot/curriculum-for-excellence/curriculum-areas/sciences/',scope:'national-stage',name:'Curriculum for Excellence: Sciences',integrated:['primary','lower'],note:'BGE experiences and outcomes use curriculum levels (Early–Fourth); S1–S3 do not correspond to a national Physics chapter-by-year scheme.'},
 'GB-WLS':{source:'https://hwb.gov.wales/curriculum-for-wales/areas-of-learning-and-experience/science-and-technology/principles-of-progression/',scope:'national-stage',name:'Curriculum for Wales: Science and Technology',integrated:['primary','lower'],note:'Science and Technology follows progression steps, not mandatory lesson lists per Year 7, 8 or 9.'},
 'GB-NIR':{source:'https://ccea.org.uk/key-stage-3/curriculum/science-and-technology',scope:'national-stage',name:'Science and Technology, KS3',integrated:['primary','lower'],note:'Northern Ireland has integrated Science in Key Stage 3; exam-board syllabuses determine GCSE and post-16 Physics options.'},
 IE:{source:'https://curriculumonline.ie/junior-cycle/junior-cycle-subjects/science/expectations-for-students-learning-outcomes/',scope:'national-stage',name:'Junior Cycle Science — Physical World',integrated:['primary','lower'],note:'Learning outcomes cover the entire three-year Junior Cycle, so a fixed J1/J2/J3 chapter distribution would be a false official attribution.'},
 FR:{source:'https://eduscol.education.gouv.fr/5739/ressources-d-accompagnement-du-programme-de-physique-chimie-au-cycle-4',scope:'national-stage',name:'Physique-chimie · cycle 4',integrated:['primary'],mixed:['lower'],note:'Cycle 4 covers 5e, 4e and 3e; the school-year sequence is advisory, not prescribed for each class. 6e is interdisciplinary science.'},
 HU:{source:'https://www.oktatas.hu/kozneveles/kerettantervek/2020_nat',scope:'national-stage',name:'Fizika · NAT 2020',noLower:['5','6'],lowerEntry:'7',note:'Grade 7–8 Física/Fizika foundation, revised in grades 9–10; specialised school tracks may vary.'},
 PL:{source:'https://zpe.gov.pl/podstawa-programowa/szkola-podstawowa/fizyka',scope:'national-stage',name:'Fizyka · klasy VII–VIII',lowerEntry:'VII',noLower:['V','VI'],note:'Separate Physics in classes VII and VIII; 2026 curriculum transition may be cohort-sensitive.'},
 PT:{source:'https://www.dge.mec.pt/programas-e-metas-curriculares/fisico-quimica',scope:'national-year',name:'Físico-Química · 7.º–9.º ano',noLower:['5','6'],lowerEntry:'7',mixed:['lower'],note:'Physics and Chemistry are combined in 7th–9th. 8th includes Sound and Light; 9th includes Motion/Forces and Electricity. 10th–12th depend on course options.'},
 ES:{source:'https://www.boe.es/eli/es/rd/2022/03/29/217/con',scope:'national-stage',name:'Física y Química · ESO',mixed:['lower'],note:'ESO minimum teaching framework; autonomous communities and school streams determine exact annual distribution and whether Physics/Chemistry is selected.'},
 IT:{source:'https://www.mim.gov.it/',scope:'education-structure',name:'Scienze · scuola secondaria I',integrated:['primary','lower'],note:'Lower-secondary Physics concepts fall under Scienze. Physics as a separate subject in upper secondary depends on school stream.'},
 DE:{source:'https://www.kmk.org/en/bildungsministerkonferenz/bildungsthemen/bildungsstandards.html',scope:'national-stage',name:'Physik · Bundesländer',note:'KMK sets common educational standards; exact grades/topics depend on Land and school type. National standard is NOT an annual schedule.'},
 AT:{source:'https://www.bmb.gv.at/',scope:'education-structure',name:'Physik · Schulart',note:'Separate Physics arrangements depend on AHS/Mittelschule and local school type. Year allocation remains advisory until school stream is chosen.'},
 CH:{source:'https://www.edk.ch/',scope:'education-structure',name:'Natur und Technik · Kantone',integrated:['primary'],note:'Canton and language determine exact programme; a national single grade timetable must not be asserted.'},
 BE:{source:'https://eurydice.eacea.ec.europa.eu/',scope:'education-structure',name:'Sciences · Communities',integrated:['primary'],note:'Belgium requires the linguistic community and stream before Physics grade-specific curriculum can be confirmed.'}
});
export const PHYSICS_EUROPE_REFERENCES=refs;
const countryGroups=Object.freeze({
 // These are original, advisory progressions for school years; they are not
 // attributed to official annual outcomes in stage-level national frameworks.
 lower:[
  ['units','kinematics','heat','energy','optics'],
  ['kinematics','dynamics','fluids','energy','waves'],
  ['electric','circuits','optics','electromagnetism','measurement'],
  ['energy','thermodynamics','waves','electric','optics']
 ],
 upper:[
  ['measurement','kinematics','dynamics','energy','fluids'],
  ['heat','thermodynamics','waves','optics','circuits'],
  ['electric','circuits','electromagnetism','measurement','waves'],
  ['modern','measurement','energy','waves','thermodynamics']
 ],
 primary:[
  ['units','energy','heat'],
  ['units','kinematics','energy','fluids'],
  ['heat','energy','fluids','units'],
  ['kinematics','fluids','energy','units']
 ]
});
const specialPlans={
 // National year headings where published guidance supports a strand,
 // not a claim that the entire year MUST be taught in this exact order.
 PT:{lower:{
  '7':['units','energy','heat','solar','kinematics'],
  '8':['waves','optics','energy','heat','measurement'],
  '9':['kinematics','dynamics','electric','circuits','energy']
 }},
 RO:{lower:{
  '6':['units','kinematics','dynamics','energy','heat','electric','electromagnetism','optics'],
  '7':['units','dynamics','kinematics','fluids','energy'],
  '8':['heat','thermodynamics','electric','circuits','electromagnetism','optics']
 }},
 'GB-ENG':{lower:{
  Y7:['units','kinematics','dynamics','energy','heat'],
  Y8:['fluids','waves','optics','electric','energy'],
  Y9:['electromagnetism','circuits','measurement','dynamics','energy']
 }},
 HU:{lower:{
  '7':['units','kinematics','dynamics','energy','heat'],
  '8':['electric','optics','waves','thermodynamics','electromagnetism']
 }},
 PL:{lower:{
  VII:['units','kinematics','dynamics','fluids','energy','heat'],
  VIII:['electric','circuits','electromagnetism','waves','optics']
 }},
 FR:{lower:{
  '6e':['units','energy','heat','optics'],
  '5e':['units','kinematics','energy','electric'],
  '4e':['dynamics','electric','waves','optics'],
  '3e':['kinematics','energy','electric','optics','measurement']
 }}
};
export const PHYSICS_ADVISORY_TOPIC_SEQUENCES=Object.freeze(countryGroups);
export const PHYSICS_COUNTRY_YEAR_SEQUENCES=Object.freeze(specialPlans);
const normalizeStage=stage=>stage==='medium'||stage==='intermediate'?'upper':stage==='beginner'?'primary':String(stage||'');
export function physicsCountryGradePlan({country='',stage='lower',grade='',years=[]}={}){
 const code=String(country).toUpperCase(),phase=stage==='medium'||stage==='intermediate'?'upper':stage==='beginner'?'primary':String(stage||'');
 const yr=String(grade),rows=Array.isArray(years)?years:[];
 const idx=rows.findIndex(x=>String(x.id)===yr);
 if(!['primary','lower','upper','advanced'].includes(phase)||idx<0)
  return {country:code,grade:yr,stage:phase,status:'invalid-grade',topics:[],source:null,kind:'unmapped'};
 const ref=PHYSICS_EUROPE_REFERENCES[code]||null;
 const integrated=phase==='primary'||ref?.integrated?.includes(phase);
 const mixed=ref?.mixed?.includes(phase);
 const noSeparate=phase==='lower'&&ref?.noLower?.includes(yr);
 const status=noSeparate?'integrated-or-not-taught':integrated?'integrated-science':
  mixed?'mixed-physics-chemistry':ref?'framework-advisory':'european-advisory';
 const base=PHYSICS_ADVISORY_TOPIC_SEQUENCES[phase]||[];
 const sequence=base.length?base[Math.round(idx*(base.length-1)/Math.max(1,rows.length-1))]:[];
 const yearly=PHYSICS_COUNTRY_YEAR_SEQUENCES[code]?.[phase]?.[yr]||sequence;
 const blocked=Boolean(noSeparate);
 return {country:code,stage:phase,grade:yr,yearIndex:idx,
  status:blocked?'not-offered':status,
  kind:blocked?'not-taught':noSeparate?'not-separate':integrated?'integrated':
   mixed?'mixed':'subject-or-track-dependent',
  // No stand-alone grade V Physics for RO; other systems may offer the
  // same concepts as integrated science without calling them a Physics class.
  topics:blocked?[]:[...new Set(yearly)].filter(x=>x!=='solar'),
  source:ref?.source||PHYSICS_EUROPE_REFERENCE,
  sourceScope:ref?.scope||'cross-national-comparative',
  programmeName:ref?.name||'Advisory Physics strand',
  verifiedAnnual:false,
  nationalGradeLabels:Boolean(ref),
  note:ref?.note||'Local Physics syllabus/grade timetable not independently verified. This is an original advisory science progression grounded in Eurydice/ISCED school structures, not a national year-by-year curriculum.'
 };
}
