import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Original grade-V theory: ordinary fractions, decimals and basic data.
// Source alignment: MEN 3393/2017 Mathematics V–VIII and approved Art Klett
// 2022 grade V contents. Not a reproduction of the manual's prose or examples.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('math');
const rows=[...pack.banks.ro5.content,...Object.values(pack.banks.ro678.content).flat()];
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const RO5_MATH_FRACTIONS=select(["math-ro5-fractions-01","math-ro5-fractions-02","math-ro5-fractions-03","math-ro5-fractions-04","math-ro5-fractions-05","math-ro5-fractions-06","math-ro5-fractions-07","math-ro5-fractions-08","math-ro5-fractions-09","math-ro5-fractions-10","math-ro5-fractions-11","math-ro5-decimals-01","math-ro5-decimals-02","math-ro5-decimals-03","math-ro5-decimals-04","math-ro5-decimals-05","math-ro5-decimals-06","math-ro5-decimals-07","math-ro5-decimals-08","math-ro5-decimals-09","math-ro5-decimals-10","math-ro5-decimals-11","math-ro5-decimals-12","math-ro5-data-01","math-ro5-data-02","math-ro5-data-03","math-ro5-data-04"]);
