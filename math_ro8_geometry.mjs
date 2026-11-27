import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Original year-VIII Romanian spatial geometry and volume theory.
// MEN 3393/2017 spatial geometry and solids, Art Klett 2025 textbook scope.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('math');
const rows=[...pack.banks.ro5.content,...Object.values(pack.banks.ro678.content).flat()];
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const RO8_MATH_GEOMETRY=select(["math-ro8-space-1","math-ro8-space-2","math-ro8-space-3","math-ro8-space-4","math-ro8-space-5","math-ro8-polyhedra-1","math-ro8-polyhedra-2","math-ro8-polyhedra-3","math-ro8-polyhedra-4","math-ro8-polyhedra-5","math-ro8-round-1","math-ro8-round-2","math-ro8-round-3","math-ro8-round-4","math-ro8-round-5","math-ro8-projection-1","math-ro8-projection-2","math-ro8-projection-3","math-ro8-projection-4","math-ro8-volume-1","math-ro8-volume-2","math-ro8-volume-3","math-ro8-volume-4","math-ro8-volume-5"]);
