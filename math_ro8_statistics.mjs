import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Romania grade VIII original statistical reasoning per MEN 3393/2017.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('math');
const rows=[...pack.banks.ro5.content,...Object.values(pack.banks.ro678.content).flat()];
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const RO8_MATH_STATISTICS=select(["math-ro8-stats-1","math-ro8-stats-2","math-ro8-stats-3"]);
