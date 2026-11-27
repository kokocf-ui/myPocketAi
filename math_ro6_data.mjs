import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Original data-handling supplements for Romanian class VI, MEN 3393/2017.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('math');
const rows=[...pack.banks.ro5.content,...Object.values(pack.banks.ro678.content).flat()];
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const RO6_MATH_DATA=select(["math-ro6-data-1","math-ro6-data-2","math-ro6-data-3","math-ro6-data-4"]);
