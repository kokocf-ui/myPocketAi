// Machine-readable Mathematics curriculum completeness audit (not a course).
// Technical rendering tests passing is NOT a claim of annual educational
// completeness. Require a traceable syllabus, original full explanations and
// age-specific lessons before declaring a country-year "complete".
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears,educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';
import {mathCountryStudyYears} from './math_country_grade_areas.mjs';
import {RO5_MATH_LESSONS,RO5_MATH_SOURCES} from './math_ro5_curriculum.mjs';
import {RO678_MATH_LESSONS} from './math_ro678_curriculum.mjs';
import {ENGLAND_Y6_MATH_LESSONS} from './math_england_y6_curriculum.mjs';
import {ENGLAND_Y34_LESSONS,ENGLAND_Y34_REFERENCE} from './math_england_year3_year4_2026.mjs';
import {PL_IV_2026_LESSONS,PL_CLASS4_2026_SOURCES} from './math_poland_class4_2026_lessons.mjs';
import {ENGLISH_KS4_REFERENCE,englandKS4CardRows} from './math_england_ks4_curriculum.mjs';
import {MATH_EUROPE_SOURCE_REGISTRY,mathCountryEvidence} from './math_country_year_alignment_2026.mjs';
import {RO9_SCIENCE_2026_LESSONS,RO9_SCIENCE_2026_SOURCES} from './math_ro9_science_2026.mjs';

export const MATH_CURRICULUM_SOURCE_REGISTRY=Object.freeze({
 ...Object.fromEntries(Object.entries(MATH_EUROPE_SOURCE_REGISTRY)
  .filter(([code])=>!['RO','GB-ENG'].includes(code))
  .map(([code,data])=>[code,{framework:data.curriculum,manualExample:data.manualExample||null,
    notes:data.note,fullYearVerified:false}])),
 RO:{grades5to8:'https://www.edu.ro/Ordin_ministru_3393_2017',
     class5Manual:RO5_MATH_SOURCES.manual,
     notes:'MEN 3393/2017, grade V–VIII; original year-specific topic collections for grades V–VIII remain pedagogically incomplete'},
 'GB-ENG':{primary:'https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study',
           secondary:'https://www.gov.uk/government/publications/teaching-mathematics-at-key-stage-3',
           ks4:ENGLISH_KS4_REFERENCE.ks4,gcse:ENGLISH_KS4_REFERENCE.gcse,
           notes:'Official English KS documents identified; no annual lesson-by-lesson crosswalk has been completed in the app'}
});
export function mathCurriculumReadiness(){
 const rows=[],stages=[['beginner','primary'],['lower','lower'],['medium','intermediate'],['advanced','advanced']];
 for(const country of EDUCATION_EUROPE_COUNTRIES){
  for(const [stage] of stages){
   const years=mathCountryStudyYears({country,stage,years:educationCountrySchoolYears(country,stage).years});
   for(const year of years){
    const plan=educationSubjectSchoolPlan({country,stage,grade:year.id,subject:'mathematics'});
    const grade=String(year.id);
    const evidence=mathCountryEvidence({country,stage,grade});
    const national=country==='RO'&&stage==='lower'&&['5','6','7','8'].includes(grade);
    const polandIV=country==='PL'&&stage==='lower'&&grade==='IV';
    const englandY34=country==='GB-ENG'&&stage==='beginner'&&['Y3','Y4'].includes(grade);
    const englandY6=country==='GB-ENG'&&stage==='beginner'&&grade==='Y6';
    const englandKS4=country==='GB-ENG'&&stage==='medium'&&['Y10','Y11'].includes(grade);
    const actual=plan.units.reduce((n,x)=>n+Number(x.lessonCount||0),0);
    const sourceRows=national?(grade==='5'?RO5_MATH_LESSONS:RO678_MATH_LESSONS[grade]):[];
    // Source-reviewed outlines are candidates for independent checking, not
    // whole-year completion. Generic and nationally aligned lessons are never
    // treated as equivalent to approved textbooks.
    const candidate=national&&
      plan.units.every(x=>x.countrySpecific===true)&&
      actual===sourceRows.length&&
      sourceRows.every(l=>l.statement&&l.formula&&l.worked&&l.practice&&l.answers);
    const sourceYr34=englandY34?ENGLAND_Y34_LESSONS[grade]||[]:[];
    const authoredY34=englandY34&&sourceYr34.length>=25&&
      ['arithmetic','geometry','measurement','statistics'].every(topic=>
       sourceYr34.filter(l=>l.topic===topic).length>=3)&&
      plan.units.length===4&&actual===sourceYr34.length;
    const authoredPolandIV=polandIV&&PL_IV_2026_LESSONS.length>=30&&
      actual===PL_IV_2026_LESSONS.length&&plan.units.length===3&&
      ['algebra','geometry','statistics'].every(t=>PL_IV_2026_LESSONS.filter(l=>l.topic===t).length>=3);
    const romania9=country==='RO'&&stage==='medium'&&grade==='9-SCI'&&
      plan.units.every(x=>x.countrySpecific===true)&&
      actual===RO9_SCIENCE_2026_LESSONS.length&&plan.units.length===4;
    const partialCandidate=romania9||authoredPolandIV||authoredY34||
      (englandY6&&ENGLAND_Y6_MATH_LESSONS.length===21&&plan.units.length===5)||
      (englandKS4&&plan.units.length>=4&&
       plan.units.filter(unit=>englandKS4CardRows(grade,unit.id).length>=3).length>=3);
    rows.push({
     country,stage,grade:String(year.id),
     scope:national?'national-crosswalk-review':
      romania9?'source-unit-reviewed-track-specific':
      partialCandidate?'partial-year-source-review':'unverified-advisory',
     lessonCount:actual,units:plan.units.length,
     countryYearSpecific:candidate,
     partialSourceReview:partialCandidate,
     officialYearSourceMapped:romania9||authoredY34||authoredPolandIV,
     independentCourseSequence:authoredPolandIV?PL_CLASS4_2026_SOURCES.independentScheme:
       authoredY34?(grade==='Y3'?ENGLAND_Y34_REFERENCE.oak3:ENGLAND_Y34_REFERENCE.oak4):null,
     evidenceStatus:evidence.status,
     manualExample:romania9?RO9_SCIENCE_2026_SOURCES.manual:
      authoredPolandIV?PL_CLASS4_2026_SOURCES.approvedManual:evidence.manualExample,
     source:romania9?RO9_SCIENCE_2026_SOURCES.syllabus:
      authoredPolandIV?PL_CLASS4_2026_SOURCES.law:
      country==='RO'&&stage==='lower'?MATH_CURRICULUM_SOURCE_REGISTRY.RO.grades5to8:
       country==='GB-ENG'?(stage==='beginner'?MATH_CURRICULUM_SOURCE_REGISTRY['GB-ENG'].primary:
        stage==='lower'?MATH_CURRICULUM_SOURCE_REGISTRY['GB-ENG'].secondary:
        stage==='medium'?MATH_CURRICULUM_SOURCE_REGISTRY['GB-ENG'].ks4:null):evidence.source,
     complete:false,
     blockers:romania9?
      ['Only Științe ale naturii (TC+CS) mapped; other Romanian lycée profiles need separate programmes',
       'All seven 2026 textbook units represented but statutory competencies and assessments not independently crosschecked',
       'Review exact edition, lesson coverage and Android device acceptance']:
      candidate?
      ['Independent pedagogical validation','Verify exact full-year content against textbooks','Check progress assessment and classroom sequencing','Android device acceptance']:
      authoredPolandIV?
      ['MEN 2026 framework and registered manual compared, but objective-by-objective exhaustiveness requires independent review',
       'New 2026 curriculum applies to class IV, not retroactively to classes V–VIII',
       'Review grade-specific exercises and teaching sequence before annual approval']:
      authoredY34?
      ['DfE year objectives and original worked lessons crosswalked, but the precise bullet-to-lesson coverage remains to be independently audited',
       'Oak unit sequence is an external comparison, not an embedded or verified adopted textbook',
       'Device test and independent pedagogical review of complete year']:
      partialCandidate?(englandKS4?
      ['KS4 is a two-year DfE key stage, not official Year 10/11 allocations',
       'Only supplementary GCSE-aligned lessons, not full statutory topic coverage',
       'Verify GCSE foundation/higher specification, examination board and device acceptance']:
      ['Only supplementary DfE Year 6 topic cards, not full statutory coverage',
       'Generic European chapters still mixed into source collection',
       'Independent pedagogical and device acceptance']):
      ['No verified national/institutional full-year lesson crosswalk','Year-specific theory still shares a generic European bank']
    });
   }
  }
 }
 return {
  total:rows.length,
  yearSpecificCandidates:rows.filter(x=>x.countryYearSpecific).length,
  partialSourceReviews:rows.filter(x=>x.partialSourceReview).length,
  fullyApproved:rows.filter(x=>x.complete).length,
  readiness:'incomplete',rows
 };
}
