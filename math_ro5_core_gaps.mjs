import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Original supplementary Romanian class-V mathematics lessons addressing
// statutory topics omitted in the first 64-lesson crosswalk.
// Source: MEN 3393/2017, Mathematics V–VIII, content table on pp. 8–9.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('math');
const rows=[...pack.banks.ro5.content,...Object.values(pack.banks.ro678.content).flat()];
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const RO5_MATH_CORE_GAPS=select(["math-ro5-gap-01","math-ro5-gap-02","math-ro5-gap-03","math-ro5-gap-04","math-ro5-gap-05","math-ro5-gap-06","math-ro5-gap-07"]);
