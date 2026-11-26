import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Aligned, original school-year inventory for Romania, class V.
// Conformance crosswalk: MEN 3393/28.02.2017, Mathematics appendix 2,
// methodical instructions p.32 ("ecuaţie" introduced in class VI);
// Art Klett 2022 class-V manual: six content units, assessments excluded.
const pack=readNodeEducationStudyPack('math');
export const RO5_MATH_SOURCES=Object.freeze(pack.sources.ro5);
export const RO5_MATH_LESSONS=Object.freeze(pack.banks.ro5.content);
export const RO5_MATH_UNITS=Object.freeze([
 {id:'natural',title:'Numere naturale și operații',topic:'algebra'},
 {id:'methods',title:'Metode aritmetice de rezolvare a problemelor',topic:'algebra'},
 {id:'divisibility',title:'Divizibilitatea numerelor naturale',topic:'algebra'},
 {id:'fractions',title:'Fracții ordinare',topic:'algebra'},
 {id:'decimals',title:'Fracții zecimale, măsurători și date',topic:'algebra'},
 {id:'data',title:'Organizarea și reprezentarea datelor',topic:'statistics'},
 {id:'geometry',title:'Elemente de geometrie și unități de măsură',topic:'geometry'}
]);
export function ro5LessonSummary(){
 return RO5_MATH_UNITS.map(unit=>({
  ...unit,count:RO5_MATH_LESSONS.filter(lesson=>lesson.unitId===unit.id).length
 }));
}
export function ro5TopicLessons(topic){
 return RO5_MATH_LESSONS.filter(lesson=>lesson.topic===topic);
}
