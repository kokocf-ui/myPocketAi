import {readNodeEducationSharedPack} from './education_study_node_source.mjs';
// Content lives only in the independently published single-source pack.
const pack=readNodeEducationSharedPack('biology');
// Biology reference: exact definitions, models and principles, NOT a list of
// supposed universal laws. Reference is independent of the selected school year.
// School-level scope differs between countries, tracks and exam boards.
export const BIOLOGY_REFERENCE_GROUPS=Object.freeze([
 {id:'foundations',ro:'Definiții fundamentale',en:'Foundational definitions'},
 {id:'genetics',ro:'Ereditate și evoluție',en:'Inheritance and evolution'},
 {id:'physiology',ro:'Fiziologie și reglare',en:'Physiology and regulation'},
 {id:'ecology',ro:'Ecologie și populații',en:'Ecology and populations'},
 {id:'methods',ro:'Principii de cercetare',en:'Scientific enquiry'}
]);
export const BIOLOGY_REFERENCE=Object.freeze(pack.references);
export function biologyReferenceText(item,language='ro'){
 if(!item)return '';
 const en=(item.sourceLanguage||language)!=='ro';
 const label=(ro,english)=>en?english:ro;
 return [
  '# '+label(item.ro,item.en),
  label('Referință generală de biologie. Nu înlocuiește programa oficială a clasei și nu constituie sfat medical.',
   'General biology reference; not an official year-specific syllabus or medical advice.'),
  '# '+label('Definiție și explicație','Definition and explanation'),
  label(item.explainRo,item.explainEn),
  '# '+label('Relație sau model (unde este cazul)','Relation or model (when applicable)'),
  item.formula,
  '# '+label('Exemplu explicat','Worked example'),
  label(item.exampleRo,item.exampleEn),
  '# '+label('Condiții și limite','Scope and limitations'),
  label(item.scopeRo,item.scopeEn),
  '# '+label('Verifică înțelegerea','Check your understanding'),
  label('Identifică în exemplu ipoteza esențială și explică ce s-ar schimba dacă ea nu ar fi îndeplinită.',
   'Identify the key assumption in the example and explain how the result would change if it failed.')
 ].join('\n\n');
}
