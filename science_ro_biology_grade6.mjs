import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Romania Biology class VI (2017 syllabus): nutrition, respiration,
// circulation, excretion and biological organisation. Original instruction.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('biology');
const rows=Object.values(pack.banks.roLower.content).flat();
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const BIOLOGY_RO_GRADE6=select(["ro-biology-6-1","ro-biology-6-2","ro-biology-6-3","ro-biology-6-4","ro-biology-6-5","ro-biology-6-6","ro-biology-6-7","ro-biology-6-8","ro-biology-6-9","ro-biology-6-10","ro-biology-6-11","ro-biology-6-12","ro-biology-6-13","ro-biology-6-14","ro-biology-6-15","ro-biology-6-16","ro-biology-6-17","ro-biology-6-18","ro-biology-6-19","ro-biology-6-20","ro-biology-6-21","ro-biology-6-22","ro-biology-6-23"]);
