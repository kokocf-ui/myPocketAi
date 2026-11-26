import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
import {BIOLOGY_UPPER_YEAR_SEQUENCE,biologyYearUnits} from './biology_year_distribution.mjs';
const pack=readNodeEducationStudyPack('biology');
// Biology: year-specific, authored upper-secondary lessons. This is a study
// pathway, NOT a claim that every European nation mandates this exact sequence.
// Year indices map to each country's actual school-year picker, never to RO IDs.
// Each item contains a definition, contextual reasoning, a worked illustration,
// an assessment question and its grounded answer.
export const BIOLOGY_UPPER_YEAR_TOPICS=BIOLOGY_UPPER_YEAR_SEQUENCE;
export const BIOLOGY_UPPER_YEAR_BANK=Object.freeze(pack.banks.upper.content);
export function biologyUpperYearLessons({country='',grade='',topic='',years=[],language='ro'}={}){
 const units=biologyYearUnits({stage:'upper',grade,years}).filter(x=>x.topic===topic);
 return units.flatMap(({tier})=>{
  const chapter=BIOLOGY_UPPER_YEAR_BANK.find(x=>x.year===tier&&x.topic===topic);
  if(!chapter)return [];
  return chapter.lessons.map(x=>({...x,grade:String(grade),advisoryTier:'upper-'+tier,
   curriculumScope:String(country).toUpperCase()==='RO'?
    'Romania: advisory, cohort- and track-dependent':'Europe: year-position advisory'}));
 });
}
