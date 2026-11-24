import {literatureEuropeanPractice} from './literature_europe_practice.mjs';
// Limited offline reference for an existing national chapter when its
// chapter-specific online lesson is unavailable. It is deliberately marked
// as general guidance; it must never impersonate a national syllabus or a
// language-specific grammar rule.
export function literatureGeneralFallback({area='',title='',grade='',stage='',language='',mode=''}={}){
 if(!['ro','en'].includes(language)||!['beginner','lower','medium'].includes(stage)||
    !['lesson','examples','exercises','test'].includes(mode))return null;
 const areas={genres:'intelegere',commentary:'interpretare',essay:'redactare',
  grammar:'exprimare',authors:'parcurs',communication:'dialog',narrative:'narativ',
  composition:'redactare',poetry:'poezie',theatre:'dialog',criticism:'interpretare',
  periods:'parcurs',vocabulary:'vocabular',stylistics:'interpretare',
  spelling:'exprimare',linguistics:'exprimare',comparison:'interpretare'};
 const part=areas[area];if(!part)return null;
 const practice=literatureEuropeanPractice(part,language,stage);if(!practice)return null;
 const ro=language==='ro';
 const notice=ro?
  'Sprijin general offline pentru domeniul capitolului, NU lecția completă specifică acestui capitol sau programa oficială. Exemplele sunt în română, nu reguli ale altei limbi. Pentru detaliile capitolului este necesar materialul online sau o sursă verificată.':
  'General offline support for the chapter’s subject area, NOT a complete chapter-specific lesson or an official syllabus. Examples are in English, not rules of another language. Chapter-specific detail requires online material or a verified source.';
 const header='# '+String(title||area)+'\n\n'+notice+'\n\n'+
  (ro?'An / clasă: ':'Year / grade: ')+String(grade)+'\n\n'+
  (ro?'## Exemplu original':'## Original example')+'\n'+practice.sample;
 const worked=(ro?'## Explicație':'## Explanation')+'\n'+practice.worked;
 const questions=(ro?'## Cerințe orientative':'## Practice questions')+'\n'+
  practice.questions.map((q,i)=>(i+1)+'. '+q).join('\n');
 const body=mode==='lesson'||mode==='examples'?worked+'\n\n'+questions:questions;
 return {origin:'general_offline_reference',topic:area,text:header+'\n\n'+body};
}
