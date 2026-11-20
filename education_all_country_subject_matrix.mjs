// Uniform inventory for all European school systems in the Education picker.
// This describes which *existing* lessons are available; it does not transform
// a generic topic list into a supposedly verified national textbook.
import {EDUCATION_SCHOOL_YEARS,hgSchoolChapters} from './education_school_paths.mjs';
import {EDUCATION_WORLDWIDE_SCHEMES,worldwideSchoolYears} from './education_worldwide_paths.mjs';
import {litEuropeanPlan,LIT_EU_PROGRAMS} from './literature_curriculum_europe.mjs';
import {PHYSICS_TOPICS,PHYSICS_LESSONS} from './physics_curriculum.mjs';
import {CHEMISTRY_TOPICS,CHEMISTRY_LESSONS} from './chemistry_curriculum.mjs';
import {BIOLOGY_TOPICS,BIOLOGY_LESSONS} from './biology_curriculum.mjs';
import {ASTRONOMY_TOPICS,ASTRONOMY_LESSONS} from './astronomy_curriculum.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
import {COMPUTING_PATHS,COMPUTING_TOPICS} from './computing_curriculum.mjs';
import {FOREIGN_TOPICS} from './foreign_languages_curriculum.mjs';
import {examByGrade} from './exam_curriculum_europe.mjs';

export const EDUCATION_SCHOOL_YEAR='2026/27';
export const EDUCATION_EUROPE_COUNTRIES=Object.freeze('AD AL AT BA BE BG BY CH CY CZ DE DK EE ES FI FR GR HR HU IE IS IT LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SK SM TR UA VA XK GB-ENG GB-SCT GB-WLS GB-NIR'.split(' '));
export const EDUCATION_CORE_SUBJECTS=Object.freeze(['mathematics','physics','chemistry','biology','astronomy','history','geography','computing','literature','foreign_languages','exams']);
export const EDUCATION_SCHOOL_STAGES=Object.freeze(['beginner','lower','medium','advanced']);
const allowedCountries=new Set(EDUCATION_EUROPE_COUNTRIES);
const allowedSubjects=new Set(EDUCATION_CORE_SUBJECTS);
const rank={beginner:0,intermediate:1,advanced:2};
const stageRank={beginner:0,lower:0,medium:1,advanced:2};
const regionalRequirements={
 DE:'Land și tip de școală',AT:'Land și tip de școală',CH:'Canton și limbă de predare',
 ES:'Comunitate autonomă și filieră',BE:'Comunitate lingvistică',
 'GB-ENG':'Școală și, la GCSE, exam board','GB-SCT':'Calificare și traseu',
 'GB-WLS':'Școală și progres curricular','GB-NIR':'Exam board și traseu',
 PL:'Cohorta reformei și filieră',IT:'Tip de școală și cohortă',
 HU:'Gimnázium/technikum sau alt traseu',MD:'Limba de predare',
 RS:'Tip de școală și limbă',HR:'Gimnazija/strukovna',TR:'Tip de liceu'
};
const mathAreas={
 beginner:[['numbers','Numere și operații'],['measures','Măsurători și unități'],['shapes','Forme și spațiu'],['problems','Probleme și modele']],
 lower:[['algebra','Algebră și ecuații'],['geometry','Geometrie'],['data','Date și probabilități'],['relations','Raporturi și funcții']],
 medium:[['functions','Funcții și grafice'],['algebra','Ecuații și inecuații'],['trigonometry','Trigonometrie'],['probability','Statistică și probabilități']],
 advanced:[['analysis','Analiză matematică'],['linear','Algebră liniară'],['discrete','Structuri discrete'],['probability','Probabilități']]
};
const level=x=>x==='primary'?'beginner':x==='intermediate'?'medium':String(x||'');
const unit=(id,ro,en,focus='',lessonCount=0)=>({id:String(id),ro:String(ro),en:String(en||ro),focus:String(focus||''),lessonCount:Number(lessonCount)||0});
const scienceTopics=(topics,lessons,stage)=>topics.filter(x=>rank[x.minLevel||'beginner']<=stageRank[stage]).map(x=>
 unit(x.id,x.ro,x.en,'',lessons.filter(y=>y.topic===x.id).length));
export function educationCountrySchoolYears(country,stage){
 const code=String(country||'').toUpperCase(),st=level(stage);
 if(!allowedCountries.has(code)||!EDUCATION_SCHOOL_STAGES.includes(st))
  return {country:code,stage:st,years:[],status:'unmapped',source:null};
 const known=EDUCATION_SCHOOL_YEARS[code]?.[st];
 if(known?.length)return {country:code,stage:st,status:'mapped-years',source:null,
  years:known.map(x=>({...x,curriculumVerified:false}))};
 const scheme=EDUCATION_WORLDWIDE_SCHEMES[code];
 if(scheme)return {country:code,stage:st,status:'mapped-years-advisory',
  source:scheme.source||null,years:worldwideSchoolYears(code,st).map(x=>({...x,curriculumVerified:false}))};
 // Do not invent fictitious P1/L1/U1 national grades for uncovered microstates.
 return {country:code,stage:st,status:'grade-unmapped',source:null,
  years:[{id:'grade-not-mapped',ro:'Clasa de confirmat',en:'Grade to confirm',curriculumVerified:false}]};
}
function subjectInventory(subject,{country,stage,grade,track}){
 if(subject==='literature'){
  const path=litEuropeanPlan(country,stage,grade,track);
  return {units:path.units.map(x=>unit(x.id,x.label,x.label,x.focus)),
   verified:path.verified,gradeSpecific:Boolean(LIT_EU_PROGRAMS[country]?.byGrade?.[grade]),
   source:path.source,note:path.note||''};
 }
 if(subject==='history'||subject==='geography'){
  const path=hgSchoolChapters(country,subject,stage,grade);
  return {units:path.chapters.map(x=>unit(x.id,x.ro,x.en,x.query)),
   verified:path.status==='official-framework',
   gradeSpecific:path.status==='official-framework',source:path.source,note:''};
 }
 if(subject==='mathematics')return {units:mathAreas[stage].map(x=>unit(x[0],x[1],x[1])),
  verified:false,gradeSpecific:false,source:null,note:''};
 if(['physics','chemistry','biology','astronomy'].includes(subject)){
  const tables={
   physics:[PHYSICS_TOPICS,PHYSICS_LESSONS],chemistry:[CHEMISTRY_TOPICS,CHEMISTRY_LESSONS],
   biology:[BIOLOGY_TOPICS,BIOLOGY_LESSONS],astronomy:[ASTRONOMY_TOPICS,ASTRONOMY_LESSONS]
  };
  const [topics,lessons]=tables[subject];
  const schoolStage=stage==='beginner'?'primary':stage==='medium'?'upper':stage;
  const mappedYears=educationCountrySchoolYears(country,stage).years;
  const track=schoolStage==='advanced'?null:scienceGradeTopicPlan({
   country,subject,stage:schoolStage,grade,years:mappedYears,topics
  });
  const ordered=track?.topics?.length?track.topics:topics.filter(x=>!x.specialty&&rank[x.minLevel||'beginner']<=stageRank[stage]);
  return {units:ordered.map(x=>unit(x.id,x.ro,x.en,'',lessons.filter(y=>y.topic===x.id).length)),
   verified:false,gradeSpecific:false,source:null,
   note:'Program general de științe diferențiat pe clase; nu este manual sau programă națională verificată.'+
    (subject==='astronomy'?' Astronomia este opțională sau integrată în alte discipline în multe sisteme.':'')};
 }
 if(subject==='computing'){
  const pathLevel=stage==='advanced'?'advanced':stage==='medium'?'medium':'beginner';
  return {units:COMPUTING_PATHS.filter(p=>p.level===pathLevel).map(p=>
   unit(p.id,p.ro,p.en,'',COMPUTING_TOPICS.filter(t=>t.path===p.id).length)),
   verified:false,gradeSpecific:false,source:null,note:''};
 }
 if(subject==='foreign_languages')return {units:FOREIGN_TOPICS.map(t=>unit(t.id,t.ro,t.en)),
  verified:false,gradeSpecific:false,source:null,
  note:'CEFR este un nivel de competență, nu un an școlar.'};
 if(subject==='exams'){
  const specs=examByGrade(country,grade);
  return {units:specs.map(x=>unit(x.id,x.ro||x.name||x.id,x.en||x.name||x.id)),
   verified:false,gradeSpecific:specs.length>0,source:null,
   note:'Simulările originale nu sunt subiecte oficiale de examen.'};
 }
 return {units:[],verified:false,gradeSpecific:false,source:null,note:''};
}
export function educationSubjectSchoolPlan({country,stage,grade,subject,track='',region='',manual=''}={}){
 const code=String(country||'').toUpperCase(),st=level(stage),g=String(grade||''),key=String(subject||'');
 const school=educationCountrySchoolYears(code,st);
 const valid=allowedCountries.has(code)&&allowedSubjects.has(key)&&
  school.years.some(x=>x.id===g);
 if(!valid)return {country:code,stage:st,grade:g,subject:key,status:'invalid-selection',
  units:[],schoolYear:EDUCATION_SCHOOL_YEAR,gradeStatus:school.status,verifiedManual:false};
 const data=subjectInventory(key,{country:code,stage:st,grade:g,track});
 const status=data.verified?'framework-verified':data.gradeSpecific?'grade-content-unverified':'general-learning';
 const requires=regionalRequirements[code]||null;
 return {country:code,stage:st,grade:g,subject:key,status,gradeStatus:school.status,
  schoolYear:EDUCATION_SCHOOL_YEAR,units:data.units,source:data.source||null,
  verifiedManual:false,gradeContentSpecific:Boolean(data.gradeSpecific),
  track:String(track||''),region:String(region||''),manual:String(manual||''),
  requires,notes:[
   status==='framework-verified'?
    'Cadru curricular verificat; ordinea lecțiilor nu reprezintă cuprinsul obligatoriu al unui manual.':
    'Parcurs general: programa completă pentru această țară și clasă nu a fost verificată.',
   ...(requires&&!region?['Pentru programa exactă trebuie precizat: '+requires]:[]),
   ...(data.note?[data.note]:[])
  ]};
}
export function educationAllSubjectsForClass(country,stage,grade,extra={}){
 return EDUCATION_CORE_SUBJECTS.map(subject=>
  educationSubjectSchoolPlan({country,stage,grade,subject,...extra}));
}
export function educationCoverageTotals(){
 const totals={countries:EDUCATION_EUROPE_COUNTRIES.length,subjects:EDUCATION_CORE_SUBJECTS.length,
  grades:0,combinations:0,frameworkVerified:0,gradeContentUnverified:0,generalLearning:0,
  unmappedStages:0,missingUnits:0};
 for(const code of EDUCATION_EUROPE_COUNTRIES)for(const stage of EDUCATION_SCHOOL_STAGES){
  const years=educationCountrySchoolYears(code,stage);
  if(years.status==='grade-unmapped')totals.unmappedStages++;
  for(const year of years.years){
   totals.grades++;
   for(const plan of educationAllSubjectsForClass(code,stage,year.id)){
    totals.combinations++;
    if(plan.status==='framework-verified')totals.frameworkVerified++;
    else if(plan.status==='grade-content-unverified')totals.gradeContentUnverified++;
    else totals.generalLearning++;
    if(!plan.units.length)totals.missingUnits++;
   }
  }
 }
 return totals;
}

// Non-negotiable gate: a UI which merely accepts a country/grade is not a
// complete educational curriculum. A single successful Android build is not
// evidence of lesson completeness. Manual and device reviews remain additional
// acceptance criteria after this automated coverage gate is green.
export function educationCompletionGate(){
 const totals=educationCoverageTotals();
 const missingCurriculum=totals.generalLearning+totals.gradeContentUnverified;
 const ready=totals.unmappedStages===0&&totals.missingUnits===0&&missingCurriculum===0;
 return {ready,schoolYear:EDUCATION_SCHOOL_YEAR,totals,
  blockers:[
   ...(totals.unmappedStages?['Unmapped national school-year stages: '+totals.unmappedStages]:[]),
   ...(totals.generalLearning?['Country/class/subject combinations with only general-learning outlines: '+totals.generalLearning]:[]),
   ...(totals.gradeContentUnverified?['Grade-specific content awaiting official verification: '+totals.gradeContentUnverified]:[]),
   ...(totals.missingUnits?['Missing chapter lists: '+totals.missingUnits]:[]),
   'Manual edition and on-device lesson quality must be verified separately.'
  ]};
}
