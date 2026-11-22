// Machine-readable Mathematics curriculum completeness audit (not a course).
// Technical rendering tests passing is NOT a claim of annual educational
// completeness. Require a traceable syllabus, original full explanations and
// age-specific lessons before declaring a country-year "complete".
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears,educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';
import {mathCountryStudyYears} from './math_country_grade_areas.mjs';
import {RO5_MATH_LESSONS,RO5_MATH_SOURCES} from './math_ro5_curriculum.mjs';
import {RO678_MATH_LESSONS} from './math_ro678_curriculum.mjs';
import {ENGLAND_Y6_MATH_LESSONS} from './math_england_y6_curriculum.mjs';

export const MATH_CURRICULUM_SOURCE_REGISTRY=Object.freeze({
 RO:{grades5to8:'https://www.edu.ro/Ordin_ministru_3393_2017',
     class5Manual:RO5_MATH_SOURCES.manual,
     notes:'MEN 3393/2017, grade V–VIII; original year-specific topic collections for grades V–VIII remain pedagogically incomplete'},
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
    const grade=String(year.id);
    const national=country==='RO'&&stage==='lower'&&['5','6','7','8'].includes(grade);
    const englandPartial=country==='GB-ENG'&&stage==='beginner'&&grade==='Y6';
    const actual=plan.units.reduce((n,x)=>n+Number(x.lessonCount||0),0);
    const sourceRows=national?(grade==='5'?RO5_MATH_LESSONS:RO678_MATH_LESSONS[grade]):[];
    // Source-reviewed outlines are candidates for independent checking, not
    // whole-year completion. Generic and nationally aligned lessons are never
    // treated as equivalent to approved textbooks.
    const candidate=national&&
      plan.units.every(x=>x.countrySpecific===true)&&
      actual===sourceRows.length&&
      sourceRows.every(l=>l.statement&&l.formula&&l.worked&&l.practice&&l.answers);
    const partialCandidate=englandPartial&&
      ENGLAND_Y6_MATH_LESSONS.length===21&&plan.units.length===5;
    rows.push({
     country,stage,grade:String(year.id),
     scope:national?'national-crosswalk-review':englandPartial?'partial-year-source-review':'unverified-advisory',
     lessonCount:actual,units:plan.units.length,
     countryYearSpecific:candidate,
     partialSourceReview:partialCandidate,
     source:country==='RO'&&stage==='lower'?MATH_CURRICULUM_SOURCE_REGISTRY.RO.grades5to8:
       country==='GB-ENG'?(stage==='beginner'?MATH_CURRICULUM_SOURCE_REGISTRY['GB-ENG'].primary:
        stage==='lower'?MATH_CURRICULUM_SOURCE_REGISTRY['GB-ENG'].secondary:null):null,
     complete:false,
     blockers:candidate?
      ['Independent pedagogical validation','Verify exact full-year content against textbooks','Check progress assessment and classroom sequencing','Android device acceptance']:
      partialCandidate?
      ['Only supplementary DfE Year 6 topic cards, not full statutory coverage','Generic European chapters still mixed into source collection','Independent pedagogical and device acceptance']:
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
