import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Additional authored Romanian Biology class V–VIII sublessons, organised
// by the study areas of OMEN 3393/2017 rather than an invented textbook.
// Legacy Node export adapter; lesson text is authored only in the JSON pack.
const pack=readNodeEducationStudyPack('biology');
const rows=Object.values(pack.banks.roLower.content).flat();
const select=ids=>Object.freeze(!rows.length?[]:ids.map(id=>{const row=rows.find(x=>x.id===id);if(!row)throw Error('Missing source lesson: '+id);return row}));
export const BIOLOGY_RO_ADDITIONS=Object.freeze({"5":select(["ro-biology-extra-5-1","ro-biology-extra-5-2","ro-biology-extra-5-3","ro-biology-extra-5-4"]),"6":select(["ro-biology-extra-6-1","ro-biology-extra-6-2","ro-biology-extra-6-3","ro-biology-extra-6-4","ro-biology-extra-6-5","ro-biology-extra-6-6","ro-biology-extra-6-7","ro-biology-extra-6-8","ro-biology-extra-6-9","ro-biology-extra-6-10","ro-biology-extra-6-11"]),"7":select(["ro-biology-extra-7-1","ro-biology-extra-7-2","ro-biology-extra-7-3","ro-biology-extra-7-4"]),"8":select(["ro-biology-extra-8-1","ro-biology-extra-8-2","ro-biology-extra-8-3","ro-biology-extra-8-4","ro-biology-extra-8-5","ro-biology-extra-8-6","ro-biology-extra-8-7","ro-biology-extra-8-8","ro-biology-extra-8-9","ro-biology-extra-8-10","ro-biology-extra-8-11"])});
