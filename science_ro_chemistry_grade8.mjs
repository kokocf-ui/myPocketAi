import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Original Romanian class VIII Chemistry learning cards, in the subject areas
// of the lower-secondary syllabus. These are not a copied school textbook.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('chemistry');
const rows=Object.values(pack.banks.roLower.content).flat();
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const CHEMISTRY_RO_GRADE8=select(["ro-chemistry-8-1","ro-chemistry-8-2","ro-chemistry-8-3","ro-chemistry-8-4","ro-chemistry-8-5","ro-chemistry-8-6","ro-chemistry-8-7","ro-chemistry-8-8","ro-chemistry-8-9","ro-chemistry-8-10","ro-chemistry-8-11","ro-chemistry-8-12","ro-chemistry-8-13","ro-chemistry-8-14"]);
