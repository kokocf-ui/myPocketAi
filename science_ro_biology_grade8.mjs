import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Original Romania Biology VIII study cards: genetics, evolution,
// ecosystems, health, human impact, and independent biological inquiry.
// Source for content areas: OMEN 3393/2017, Anexa 2.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('biology');
const rows=Object.values(pack.banks.roLower.content).flat();
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const BIOLOGY_RO_GRADE8=select(["ro-biology-8-1","ro-biology-8-2","ro-biology-8-3","ro-biology-8-4","ro-biology-8-5","ro-biology-8-6","ro-biology-8-7","ro-biology-8-8","ro-biology-8-9","ro-biology-8-10","ro-biology-8-11","ro-biology-8-12","ro-biology-8-13","ro-biology-8-14","ro-biology-8-15","ro-biology-8-16","ro-biology-8-17","ro-biology-8-18","ro-biology-8-19","ro-biology-8-20","ro-biology-8-21","ro-biology-8-22","ro-biology-8-23"]);
