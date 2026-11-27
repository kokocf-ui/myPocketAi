import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Original, bounded learning cards arranged against the Romanian 2017
// lower-secondary Physics content areas (OMEN 3393/2017). The programme sets
// domains and competences, not one compulsory weekly textbook sequence.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('physics');
const rows=Object.values(pack.banks.roLower.content).flat();
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const SCIENCE_RO_PHYSICS_EXTRAS=Object.freeze({"6":select(["ro-physics-6-1","ro-physics-6-2","ro-physics-6-3","ro-physics-6-4","ro-physics-6-5","ro-physics-6-6","ro-physics-6-7","ro-physics-6-8","ro-physics-6-9","ro-physics-6-10","ro-physics-6-11","ro-physics-6-12","ro-physics-6-13","ro-physics-6-14"]),"7":select(["ro-physics-7-1","ro-physics-7-2","ro-physics-7-3","ro-physics-7-4","ro-physics-7-5","ro-physics-7-6","ro-physics-7-7","ro-physics-7-8","ro-physics-7-9","ro-physics-7-10","ro-physics-7-11","ro-physics-7-12","ro-physics-7-13","ro-physics-7-14","ro-physics-7-15","ro-physics-7-16"]),"8":select(["ro-physics-8-1","ro-physics-8-2","ro-physics-8-3","ro-physics-8-4","ro-physics-8-5","ro-physics-8-6","ro-physics-8-7","ro-physics-8-8","ro-physics-8-9","ro-physics-8-10","ro-physics-8-11"])});
