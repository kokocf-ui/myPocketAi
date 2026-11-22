// Machine-readable Mathematics curriculum completeness audit (not a course).
// Technical rendering tests passing is NOT a claim of annual educational
// completeness. Require a traceable syllabus, original full explanations and
// age-specific lessons before declaring a country-year "complete".
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears,educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';
import {mathCountryStudyYears} from './math_country_grade_areas.mjs';
import {RO5_MATH_LESSONS,RO5_MATH_SOURCES} from './math_ro5_curriculum.mjs';

export const MATH_CURRICULUM_SOURCE_REGISTRY=Object.freeze({
 RO:{grades5to8:'https://www.edu.ro/Ordin_ministru_3393_2017',
     class5Manual:RO5_MATH_SOURCES.manual,
     notes:'MEN 3393/2017, grade V–VIII; current technical adaptation has country-specific lessons only for grade V'},
 'GB-ENG':{primary:'https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study',
           secondary:'https://www.gov.uk/government/publications/teaching-mathematics-at-key-stage-3',
           notes:'Official English KS documents identified; no annual lesson-by-lesson crosswalk has been completed in the app'}
});
export function mathCurriculumReadiness(){
 const rows=[],stages=[['beginner','primary'],['lower','lower'],['medium','intermediate'],['advanced','advanced']];
 for(const country of EDUCATION_EUROPE_COUNTRIES){
  for(const [stage] of stages){
   const years=mathCountryStudyYears({country,stage,years:educationCountrySchoolYears(country,stage).years});
   for(const year of years){
    const plan=educationSubjectSchoolPlan({country,stage,grade:year.id,subject:'mathematics'});
    const national=country==='RO'&&stage==='lower'&&String(year.id)==='5';
    const actual=plan.units.reduce((n,x)=>n+Number(x.lessonCount||0),0);
    // Only source-crosschecked, original and year-specific courses are even
    // candidates for further human review; not automatic approvals.
    const candidate=national&&
      plan.units.every(x=>x.countrySpecific===true)&&
      actual===RO5_MATH_LESSONS.length&&
      RO5_MATH_LESSONS.every(l=>l.statement&&l.formula&&l.worked&&l.mistake);
    rows.push({
     country,stage,grade:String(year.id),
     scope:national?'national-crosswalk-review':'unverified-advisory',
     lessonCount:actual,units:plan.units.length,
     countryYearSpecific:candidate,
     source:country==='RO'&&stage==='lower'?MATH_CURRICULUM_SOURCE_REGISTRY.RO.grades5to8:
       country==='GB-ENG'?(stage==='beginner'?MATH_CURRICULUM_SOURCE_REGISTRY['GB-ENG'].primary:
        stage==='lower'?MATH_CURRICULUM_SOURCE_REGISTRY['GB-ENG'].secondary:null):null,
     complete:false,
     blockers:candidate?
      ['Independent pedagogical validation','Check annual assessments and classroom progression','Device acceptance']:
      ['No verified national/institutional full-year lesson crosswalk','Year-specific theory still shares a generic European bank']
    });
   }
  }
 }
 return {
  total:rows.length,
  yearSpecificCandidates:rows.filter(x=>x.countryYearSpecific).length,
  fullyApproved:rows.filter(x=>x.complete).length,
  readiness:'incomplete',rows
 };
}
