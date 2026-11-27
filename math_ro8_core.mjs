import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Romanian grade VIII: original intervals, algebra, functions and data.
// MEN 3393/2017 and approved Art Klett grade-VIII textbook scope.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('math');
const rows=[...pack.banks.ro5.content,...Object.values(pack.banks.ro678.content).flat()];
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const RO8_MATH_CORE=select(["math-ro8-intervals-1","math-ro8-intervals-2","math-ro8-intervals-3","math-ro8-intervals-4","math-ro8-algebra-1","math-ro8-algebra-2","math-ro8-algebra-3","math-ro8-algebra-4","math-ro8-algebra-5","math-ro8-algebra-6","math-ro8-algebra-7","math-ro8-algebra-8","math-ro8-functions-1","math-ro8-functions-2","math-ro8-functions-3","math-ro8-functions-4"]);
