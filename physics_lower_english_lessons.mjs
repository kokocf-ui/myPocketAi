import {readNodeEducationStudyPack} from './education_study_node_source.mjs';
// Independent original English cards, not translations of the Romanian bank.
const pack=readNodeEducationStudyPack('physics');
export const PHYSICS_LOWER_ENGLISH_LESSONS=Object.freeze(pack.banks.englishLower.content);
