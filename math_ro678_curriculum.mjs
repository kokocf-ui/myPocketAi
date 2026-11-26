import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Original Romanian grade VI–VIII teaching material. Explicit school years
// prevent reusing seventh-grade Thales and similarity in class VIII, or
// sixth-grade triangle congruence in class VII.
// Source-level alignment: MEN order 3393/2017, Mathematics V–VIII; school-year
// pedagogical completeness is NOT asserted.
const pack=readNodeEducationStudyPack('math');
export const RO678_MATH_LESSONS=Object.freeze(pack.banks.ro678.content);
export const RO678_MATH_SOURCES=Object.freeze(pack.sources.ro678);
export function ro678TopicLessons(grade,topic){
 return (RO678_MATH_LESSONS[String(grade)]||[]).filter(l=>l.topic===topic);
}
export function ro678GradeSummary(grade){
 const lessons=RO678_MATH_LESSONS[String(grade)]||[];
 return [...new Set(lessons.map(x=>x.unitId))].map(id=>({
  id,title:lessons.find(x=>x.unitId===id).unit,
  count:lessons.filter(x=>x.unitId===id).length
 }));
}
