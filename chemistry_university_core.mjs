import {readNodeEducationSharedPack} from './education_study_node_source.mjs';
// Original Romanian common courses; translations belong to the shared engine.
const pack=readNodeEducationSharedPack('chemistry');
export const CHEMISTRY_UNIVERSITY_CORE=Object.freeze(pack.universityCore);
