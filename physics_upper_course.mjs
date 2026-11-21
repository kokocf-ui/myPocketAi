import {PHYSICS_UPPER_ENGLISH_BANK} from './physics_upper_english_bank.mjs';
import {PHYSICS_LOWER_ENGLISH_LESSONS} from './physics_lower_english_lessons.mjs';

// Six upper-level original lessons per Physics chapter, with two labelled
// prerequisite reviews where available. Every country/year route preserves
// locally selected school-year IDs and advisory status.
export function physicsUpperYearLessons({
 country='',grade='',topic='',years=[],lessons=[],reviewBank=null,language='ro'
}={}){
 const yr=String(grade),yearIndex=years.findIndex(y=>String(y.id)===yr);
 if(yearIndex<0)return [];
 const code=String(country).toUpperCase(),english=language!=='ro';
 const focusRatio=years.length<=1?0:yearIndex/(years.length-1);
 const analysisDepth=focusRatio<0.34?0:focusRatio<0.68?1:2;
 const difficultyEn=[
  ['Write the physical assumptions and define the quantities before calculating.',
   'A correct response identifies the model, variables, compatible units and conditions of validity.'],
  ['Justify the formula, compare cases, and identify one plausible source of measurement uncertainty.',
   'The argument should identify the mechanism and testable evidence, with uncertainty and units.'],
  ['Check the result against a limiting case or alternative model, explaining what the model cannot predict.',
   'A strong answer explains a limiting case, model assumptions, and where observations may differ.']
 ];
 const difficultyRo=[
  ['Precizează ipotezele modelului și unitățile înaintea calculelor.',
   'Rezolvarea trebuie să declare modelul, mărimile, unitățile și condițiile de aplicare.'],
  ['Justifică formula și arată o sursă de incertitudine experimentală.',
   'Justificarea trebuie să arate mecanismul fizic, ipotezele și unitățile.'],
  ['Compară rezultatul cu un caz-limită și explică unde încetează să fie valid modelul.',
   'O rezolvare bună discută un caz-limită și limitele predicției.']
 ];
 const challenge=(english?difficultyEn:difficultyRo)[analysisDepth];
 const englishOriginal=PHYSICS_UPPER_ENGLISH_BANK[topic]||[];
 const enrich=(entry,index,isReview)=>({
  ...entry,grade:yr,chapterIndex:index+1,
  id:'upper-'+code+'-'+yr+'-'+entry.id,
  nationallyVerified:false,
  reviewOnly:isReview,
  exercise:entry.exercise+' '+challenge[0],
  answer:(entry.answer||entry.statement)+' '+challenge[1]
 });
 const englishAdvanced=englishOriginal.map((entry,i)=>enrich(entry,i,false));
 const lowerEnglish=(PHYSICS_LOWER_ENGLISH_LESSONS[topic]||[]).slice(0,2)
  .map((item,i)=>enrich({
   ...item,id:'prerequisite-'+item.id,
   title:'Prerequisite review: '+item.title,reviewOnly:true
  },englishAdvanced.length+i,true));
 if(english)return [...englishAdvanced,...lowerEnglish];
 const native=(Array.isArray(lessons)?lessons:[]).filter(entry=>
  entry.subject==='physics'&&entry.topic===topic&&
  ['beginner','intermediate'].includes(entry.level)&&entry.title&&entry.statement);
 const roNative=native.map((entry,i)=>enrich({
  ...entry,workedExample:'Exemplu de interpretare: '+entry.statement+
    (entry.formula&&entry.formula!=='—'?
     ' Pentru relația '+entry.formula+' explică semnificația mărimilor și a unităților, fără a introduce valori inventate.':
     ' Compară două situații și precizează limitele definiției.'),
  exercise:'Explică noțiunea „'+entry.title+'” și precizează când este validă formula ori definiția.',
  answer:entry.statement
 },i,false));
 const revision=(reviewBank?.['8']||[]).filter(x=>x.topic===topic).slice(0,2)
  .map((entry,i)=>enrich({
   ...entry,id:'review-'+entry.id,
   title:'Recapitulare necesară: '+entry.title,
   source:'original-prerequisite-review'
  },roNative.length+i,true));
 // Even where the domestic Romanian catalogue has fewer advanced cards,
 // expose the original English course as a visibly marked REFERENCE rather
 // than misrepresenting that source as translated Romanian teaching.
 const englishReference=englishOriginal.map((entry,i)=>enrich({
  ...entry,id:'english-reference-'+entry.id,
  title:'Referință în engleză: '+entry.title,
  source:'original-english-upper-reference'
 },roNative.length+revision.length+i,false));
 return [...roNative,...revision,...englishReference];
}
