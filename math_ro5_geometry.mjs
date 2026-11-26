import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Original mathematics lessons for Romanian class V: geometry, measurement.
// Curricular references: MEN 3393/2017 annex 2 and Art Klett manual, 2022.
// These are written independently, not transcribed from the textbook.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('math');
const rows=[...pack.banks.ro5.content,...Object.values(pack.banks.ro678.content).flat()];
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const RO5_MATH_GEOMETRY=select(["math-ro5-geometry-01","math-ro5-geometry-02","math-ro5-geometry-03","math-ro5-geometry-04","math-ro5-geometry-05","math-ro5-geometry-06","math-ro5-geometry-07","math-ro5-geometry-08","math-ro5-geometry-09","math-ro5-geometry-10","math-ro5-geometry-11","math-ro5-geometry-12","math-ro5-geometry-13","math-ro5-geometry-14","math-ro5-geometry-15"]);
