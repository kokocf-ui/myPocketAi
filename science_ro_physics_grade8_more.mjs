import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Extra grade VIII Physics lessons on the 2017 Romanian mechanics-to-heat,
// electric and optics transition. All are independently authored.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('physics');
const rows=Object.values(pack.banks.roLower.content).flat();
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const PHYSICS_RO_GRADE8_MORE=select(["ro-physics-8-b-1","ro-physics-8-b-2","ro-physics-8-b-3","ro-physics-8-b-4","ro-physics-8-b-5","ro-physics-8-b-6","ro-physics-8-b-7","ro-physics-8-b-8","ro-physics-8-b-9","ro-physics-8-b-10","ro-physics-8-b-11","ro-physics-8-b-12","ro-physics-8-b-13","ro-physics-8-b-14","ro-physics-8-b-15","ro-physics-8-b-16","ro-physics-8-b-17"]);
