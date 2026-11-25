// Build-time-only reconstruction of the legacy national Maths starter banks.
// The frontend must consume the resulting assets, not import this catalogue.
import {EDUCATION_EUROPE_COUNTRIES,EDUCATION_SCHOOL_STAGES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {mathCountryStudyYears} from './math_country_grade_areas.mjs';
import {MATH_BULK_CODES,bulkMathFirstLessons} from './math_europe_batch_2026.mjs';
import {MATH_SECOND_BATCH_COUNTRIES,secondBatchMathStarterLessons} from './math_europe_second_batch_2026.mjs';
import {MATH_FINAL_COUNTRIES,finalMathStarterLessons} from './math_europe_final_systems_2026.mjs';

export function buildMathCountrySupplementCatalog(){
 const banks={bulk:{},second:{},final:{}};
 const bulk=new Set(MATH_BULK_CODES),second=new Set(MATH_SECOND_BATCH_COUNTRIES),final=new Set(MATH_FINAL_COUNTRIES);
 for(const code of EDUCATION_EUROPE_COUNTRIES)for(const stage of EDUCATION_SCHOOL_STAGES){
  const years=mathCountryStudyYears({country:code,stage,years:educationCountrySchoolYears(code,stage).years});
  for(const year of years){
   if(stage==='advanced')continue;
   const clientStage=stage==='beginner'?'primary':stage==='medium'?'intermediate':stage;
   const topic=stage==='beginner'?'arithmetic':stage==='lower'?'algebra':'functions';
   const key=[code,clientStage,year.id,topic].join('|');
   for(const [bank,enabled,entries] of [
    ['bulk',bulk.has(code),()=>bulkMathFirstLessons({country:code,stage:clientStage,grade:year.id,topic})],
    ['second',second.has(code),()=>secondBatchMathStarterLessons({country:code,stage:clientStage,grade:year.id,topic,years})],
    ['final',final.has(code),()=>finalMathStarterLessons({country:code,stage:clientStage,grade:year.id,topic})]
   ])if(enabled){const rows=entries();if(rows.length)banks[bank][key]=rows;}
  }
 }
 return banks;
}
