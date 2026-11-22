// Aligned, original school-year inventory for Romania, class V.
// Conformance crosswalk: MEN 3393/28.02.2017, Mathematics appendix 2,
// methodical instructions p.32 ("ecuaţie" introduced in class VI);
// Art Klett 2022 class-V manual: six content units, assessments excluded.
import {RO5_MATH_NUMBERS,RO5_MATH_SOURCES} from './math_ro5_numeracy.mjs';
import {RO5_MATH_FRACTIONS} from './math_ro5_fractions.mjs';
import {RO5_MATH_GEOMETRY} from './math_ro5_geometry.mjs';
import {RO5_MATH_CORE_GAPS} from './math_ro5_core_gaps.mjs';

export {RO5_MATH_SOURCES};
const RO5_UNIT_ORDER=['natural','methods','divisibility','fractions','decimals','data','geometry'];
export const RO5_MATH_LESSONS=Object.freeze([
 ...RO5_MATH_NUMBERS,...RO5_MATH_FRACTIONS,...RO5_MATH_GEOMETRY,...RO5_MATH_CORE_GAPS
].sort((a,b)=>RO5_UNIT_ORDER.indexOf(a.unitId)-RO5_UNIT_ORDER.indexOf(b.unitId)));
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
