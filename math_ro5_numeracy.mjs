import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Romania, grade V. Original educational explanations and examples, aligned
// against MEN 3393/2017, mathematics annex 2, and the 2022 Art Klett manual's
// six-unit table of contents. No prose is copied from the textbook.
// Deliberately NO formal algebraic equations: the official methodology places
// them in class VI, and requires arithmetic problem-solving in class V.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('math');
const rows=[...pack.banks.ro5.content,...Object.values(pack.banks.ro678.content).flat()];
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const RO5_MATH_NUMBERS=select(["math-ro5-natural-01","math-ro5-natural-02","math-ro5-natural-03","math-ro5-natural-04","math-ro5-natural-05","math-ro5-natural-06","math-ro5-natural-07","math-ro5-natural-08","math-ro5-natural-09","math-ro5-natural-10","math-ro5-natural-11","math-ro5-natural-12","math-ro5-natural-13","math-ro5-natural-14","math-ro5-methods-01","math-ro5-methods-02","math-ro5-methods-03","math-ro5-methods-04","math-ro5-methods-05","math-ro5-divisibility-01","math-ro5-divisibility-02","math-ro5-divisibility-03"]);
export const RO5_MATH_SOURCES=pack.sources.ro5;
