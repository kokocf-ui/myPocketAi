import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Romanian year VII: independent original textbook-scope lessons on real
// numbers, linear systems and coordinate/data reasoning. MEN 3393/2017;
// Litera mathematics VII online table of contents.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('math');
const rows=[...pack.banks.ro5.content,...Object.values(pack.banks.ro678.content).flat()];
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const RO7_MATH_CORE=select(["math-ro7-reals-1","math-ro7-reals-2","math-ro7-reals-3","math-ro7-reals-4","math-ro7-reals-5","math-ro7-reals-6","math-ro7-equations-1","math-ro7-equations-2","math-ro7-equations-3","math-ro7-equations-4","math-ro7-equations-5","math-ro7-coordinates-1","math-ro7-coordinates-2","math-ro7-coordinates-3","math-ro7-coordinates-4"]);
