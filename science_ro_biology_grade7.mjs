import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Romania Biology class VII (OMEN 3393/2017), original learning cards:
// relationship functions, coordination, sensory systems, locomotion,
// reproduction, development and health.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('biology');
const rows=Object.values(pack.banks.roLower.content).flat();
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const BIOLOGY_RO_GRADE7=select(["ro-biology-7-1","ro-biology-7-2","ro-biology-7-3","ro-biology-7-4","ro-biology-7-5","ro-biology-7-6","ro-biology-7-7","ro-biology-7-8","ro-biology-7-9","ro-biology-7-10","ro-biology-7-11","ro-biology-7-12","ro-biology-7-13","ro-biology-7-14","ro-biology-7-15","ro-biology-7-16","ro-biology-7-17","ro-biology-7-18","ro-biology-7-19","ro-biology-7-20","ro-biology-7-21","ro-biology-7-22","ro-biology-7-23","ro-biology-7-24","ro-biology-7-25","ro-biology-7-26","ro-biology-7-27","ro-biology-7-28","ro-biology-7-29"]);
