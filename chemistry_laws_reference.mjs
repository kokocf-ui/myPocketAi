import {readNodeEducationSharedPack} from './education_study_node_source.mjs';
// Content lives only in the independently published single-source pack.
const pack=readNodeEducationSharedPack('chemistry');
// General reference; not a substitute for a country's official school curriculum.
// Explanations, examples and conditions use the pack source language.
export const CHEMISTRY_LAWS_GROUPS=Object.freeze([
 {id:'composition',ro:'Compoziție și conservare',en:'Composition and conservation'},
 {id:'gas',ro:'Legile gazelor',en:'Gas laws'},
 {id:'equilibrium',ro:'Echilibru și termochimie',en:'Equilibrium and thermochemistry'},
 {id:'kinetics',ro:'Cinetică și soluții',en:'Kinetics and solutions'},
 {id:'electrochemistry',ro:'Electrochimie',en:'Electrochemistry'},
 {id:'periodic',ro:'Periodicitate chimică',en:'Chemical periodicity'}
]);
export const CHEMISTRY_LAWS=Object.freeze(pack.references);
