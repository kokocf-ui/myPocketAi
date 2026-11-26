// Content lives only in the independently published single-source pack.
import pack from './public/education/science/shared-v2/physics.json' with {type:'json'};
// General, non-country-certified reference for Physics: direct from the year selector.
// Each entry contains an interpretation, valid conditions and a worked or reasoned example.
export const PHYSICS_LAWS_GROUPS=Object.freeze([
 {id:'mechanics',ro:'Mecanică și conservare',en:'Mechanics and conservation'},
 {id:'fluids',ro:'Fluide și presiune',en:'Fluids and pressure'},
 {id:'electricity',ro:'Electricitate și magnetism',en:'Electricity and magnetism'},
 {id:'waves',ro:'Unde și optică',en:'Waves and optics'},
 {id:'thermal',ro:'Termodinamică și radiație',en:'Thermodynamics and radiation'},
 {id:'modern',ro:'Fizică modernă',en:'Modern physics'}
]);
export const PHYSICS_LAWS=Object.freeze(pack.references);
