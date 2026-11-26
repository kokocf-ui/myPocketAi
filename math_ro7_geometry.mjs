import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Original Romanian grade VII geometry (quadrilaterals, circle,
// similarity, metrics and elementary right-triangle trigonometry).
// MEN 3393/2017 and Litera grade-VII contents; no textbook prose copied.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('math');
const rows=[...pack.banks.ro5.content,...Object.values(pack.banks.ro678.content).flat()];
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const RO7_MATH_GEOMETRY=select(["math-ro7-quadrilaterals-1","math-ro7-quadrilaterals-2","math-ro7-quadrilaterals-3","math-ro7-quadrilaterals-4","math-ro7-circle-1","math-ro7-circle-2","math-ro7-circle-3","math-ro7-circle-4","math-ro7-similarity-1","math-ro7-similarity-2","math-ro7-similarity-3","math-ro7-similarity-4","math-ro7-metric-1","math-ro7-metric-2","math-ro7-metric-3","math-ro7-metric-4","math-ro7-metric-5"]);
