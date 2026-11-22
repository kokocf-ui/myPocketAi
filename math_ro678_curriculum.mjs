// Original Romanian grade VI–VIII teaching material. Explicit school years
// prevent reusing seventh-grade Thales and similarity in class VIII, or
// sixth-grade triangle congruence in class VII.
// Source-level alignment: MEN order 3393/2017, Mathematics V–VIII; school-year
// pedagogical completeness is NOT asserted.
import {RO6_MATH_LESSONS} from './math_ro6_curriculum.mjs';
import {RO6_MATH_DATA} from './math_ro6_data.mjs';
import {RO7_MATH_CORE} from './math_ro7_core.mjs';
import {RO7_MATH_GEOMETRY} from './math_ro7_geometry.mjs';
import {RO8_MATH_CORE} from './math_ro8_core.mjs';
import {RO8_MATH_GEOMETRY} from './math_ro8_geometry.mjs';
import {RO8_MATH_STATISTICS} from './math_ro8_statistics.mjs';

const unitOrder={
 '6':['sets','divisibility','ratio','integers','rationals','data','plane','triangles'],
 '7':['reals','equations','coordinates','quadrilaterals','circle','similarity','metric'],
 '8':['intervals','algebra','functions','statistics','space','polyhedra','round','projection','volume']
};
const gradeParts={
 '6':[...RO6_MATH_LESSONS,...RO6_MATH_DATA],
 '7':[...RO7_MATH_CORE,...RO7_MATH_GEOMETRY],
 '8':[...RO8_MATH_CORE,...RO8_MATH_GEOMETRY,...RO8_MATH_STATISTICS]
};
export const RO678_MATH_LESSONS=Object.freeze(Object.fromEntries(
 Object.entries(gradeParts).map(([grade,rows])=>[grade,Object.freeze(
  rows.slice().sort((a,b)=>unitOrder[grade].indexOf(a.unitId)-unitOrder[grade].indexOf(b.unitId))
 )])
));
export const RO678_MATH_SOURCES=Object.freeze({
 programme:'https://www.edu.ro/Ordin_ministru_3393_2017',
 class6Manual:'https://www.libraronline.ro/carte/matematica-manual-pentru-clasa-a-vi-a-ordin-de-ministru-nr-5022-06-07-2023-maria-zaharia--i72840',
 class7Manual:'https://edu.litera.ro/manuale/matematica-7-1/index.html',
 class8Manual:'https://www.art-educational.ro/info/carte/manual-de-matematica'
});
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
