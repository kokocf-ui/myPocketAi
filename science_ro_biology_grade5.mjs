import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Class V Biology, original pupil-level notes aligned by area with
// Romania's OMEN 3393/2017: ecosystem diversity, classification, safe enquiry.
// School textbooks may sequence these topics differently.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('biology');
const rows=Object.values(pack.banks.roLower.content).flat();
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const BIOLOGY_RO_GRADE5=select(["ro-biology-5-1","ro-biology-5-2","ro-biology-5-3","ro-biology-5-4","ro-biology-5-5","ro-biology-5-6","ro-biology-5-7","ro-biology-5-8","ro-biology-5-9","ro-biology-5-10","ro-biology-5-11","ro-biology-5-12","ro-biology-5-13","ro-biology-5-14","ro-biology-5-15","ro-biology-5-16","ro-biology-5-17","ro-biology-5-18","ro-biology-5-19","ro-biology-5-20","ro-biology-5-21","ro-biology-5-22","ro-biology-5-23","ro-biology-5-24","ro-biology-5-25","ro-biology-5-26","ro-biology-5-27","ro-biology-5-28","ro-biology-5-29"]);
