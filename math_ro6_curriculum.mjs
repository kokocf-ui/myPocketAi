import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Original Romanian grade VI mathematics supplementary theoretical lessons.
// Guided by the MEN 3393/2017 VI programme and the Maria Zaharia/Paralela 45
// 2023 textbook contents; no copied textbook prose.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('math');
const rows=[...pack.banks.ro5.content,...Object.values(pack.banks.ro678.content).flat()];
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const RO6_MATH_LESSONS=select(["math-ro6-sets-01","math-ro6-sets-02","math-ro6-sets-03","math-ro6-sets-04","math-ro6-divisibility-01","math-ro6-divisibility-02","math-ro6-divisibility-03","math-ro6-divisibility-04","math-ro6-ratio-01","math-ro6-ratio-02","math-ro6-ratio-03","math-ro6-ratio-04","math-ro6-ratio-05","math-ro6-ratio-06","math-ro6-integers-01","math-ro6-integers-02","math-ro6-integers-03","math-ro6-integers-04","math-ro6-integers-05","math-ro6-rationals-01","math-ro6-rationals-02","math-ro6-rationals-03","math-ro6-rationals-04","math-ro6-plane-01","math-ro6-plane-02","math-ro6-plane-03","math-ro6-plane-04","math-ro6-triangles-01","math-ro6-triangles-02","math-ro6-triangles-03","math-ro6-triangles-04","math-ro6-triangles-05"]);
