import {PHYSICS_UPPER_ENGLISH_MECHANICS} from './physics_upper_english_mechanics.mjs';
import {PHYSICS_UPPER_ENGLISH_FIELDS} from './physics_upper_english_fields.mjs';

// A stable English source bank: 84 non-duplicated upper-secondary Physics
// teaching cards with distinct scientific explanations, worked examples,
// independent exercises and answer criteria. Neither a national textbook nor
// an official exam-board scheme.
export const PHYSICS_UPPER_ENGLISH_BANK=Object.freeze(Object.fromEntries(
 Object.entries({...PHYSICS_UPPER_ENGLISH_MECHANICS,...PHYSICS_UPPER_ENGLISH_FIELDS})
  .map(([topic,cards])=>[topic,Object.freeze(cards.map(
   ([title,statement,workedExample,exercise,answer],index)=>Object.freeze({
    id:'physics-upper-en-'+topic+'-'+(index+1),subject:'physics',topic,
    title,statement,workedExample,exercise,answer,language:'en',
    level:'intermediate',nationallyVerified:false,
    source:'original-open-education-advisory'
   })))]))
);
