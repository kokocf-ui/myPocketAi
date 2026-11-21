import {physicsCountryGradePlan} from './physics_europe_frameworks.mjs';
import {PHYSICS_EUROPE_EXTRA_LESSONS} from './physics_europe_wave_measurement.mjs';
import {PHYSICS_LOWER_ENGLISH_LESSONS} from './physics_lower_english_lessons.mjs';

// An ORIGINAL, transparent cross-country *advisory* Physics study bank.
// It reuses original, individually authored concept/activity cards, not a
// Romanian national syllabus. Year and learning order depend on the selected
// country's actual school-year IDs; the source is NEVER labelled official.
export const PHYSICS_ADVISORY_OER_SOURCES=Object.freeze([
 'https://openstax.org/subjects/physics',
 'https://openstax.org/books/physics/pages/preface',
 'https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study'
]);
export function physicsAdvisoryTopicLessons({
 country='',stage='lower',grade='',topic='',years=[],bank=null,referenceLessons=[],language='ro'
}={}){
 const plan=physicsCountryGradePlan({country,stage,grade,years});
 if(plan.status==='invalid-grade'||plan.status==='not-offered'||!plan.topics.includes(topic))return [];
 const all=Array.isArray(years)?years:[];
 const phase=stage==='medium'||stage==='intermediate'?'upper':stage;
 const scoped=String(grade),code=String(country).toUpperCase();
 if(phase==='lower'){
  const allTiers=['6','7','8'],index=all.findIndex(y=>String(y.id)===scoped);
  if(index<0)return [];
  // A separate subject may start part-way through an integrated school stage.
  // Progress the advisory course across ONLY the years in which this country
  // offers an individual Physics or Physics/Science study opportunity.
  const available=all.filter(y=>physicsCountryGradePlan({
   country:code,stage,grade:y.id,years:all
  }).status!=='not-offered');
  const rank=available.findIndex(y=>String(y.id)===scoped);
  if(rank<0)return [];
  const ratio=available.length<=1?0:rank/(available.length-1);
  const tier=allTiers[Math.round(ratio*(allTiers.length-1))];
  const direct=(bank?.[tier]||[]).filter(entry=>entry.topic===topic);
  // Where an official stage spans several grades, Physics topics can be
  // revisited in a spiral. If a topic has no original introductory cards
  // at this level, use another real authored example rather than a dead
  // chapter with a fake count or an AI-invented lesson.
  const supplemental=['6','7','8'].filter(x=>x!==tier)
   .flatMap(x=>(bank?.[x]||[]).filter(entry=>entry.topic===topic))
   .concat(PHYSICS_EUROPE_EXTRA_LESSONS[topic]||[]);
  const english=language!=='ro'?(PHYSICS_LOWER_ENGLISH_LESSONS[topic]||[]):[];
  const sourceEntries=english.length?english:[...direct,...supplemental];
  const seen=new Set();
  const entries=sourceEntries.filter(entry=>{
   const key=String(entry.title||'').normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g,'').toLowerCase();
   if(seen.has(key))return false;
   seen.add(key);return true;
  });
  const inquiryRo=[
   ['Observă un exemplu sigur din viața de zi cu zi și descrie fenomenul fără presupuneri.',
    'Exemplul trebuie să fie verificabil, observat direct și delimitat de interpretări.'],
   ['Compară două situații și explică ce variabilă ai păstra constantă.',
    'Comparația trebuie să controleze condițiile relevante și să numească variabila investigată.'],
   ['Propune un instrument adecvat și o unitate pentru a verifica explicația.',
    'Trebuie precizate mărimea măsurată, instrumentul, unitatea și limita de citire.'],
   ['Construiește un tabel de trei măsurători și interpretează variațiile.',
    'Tabelul trebuie să aibă etichete, unități și o interpretare a variației datelor.'],
   ['Compară două modele și precizează ipoteza care le deosebește.',
    'Răspunsul trebuie să identifice o ipoteză, o limită de valabilitate și un test relevant.'],
   ['Explică o posibilă eroare sistematică și cum ai verifica-o.',
    'Se cere o sursă de eroare și o verificare sau recalibrare potrivită.'],
   ['Demonstrează cu un caz-limită când modelul ales nu se mai aplică.',
    'Exemplul trebuie să arate condiția încălcată și consecința asupra modelului.']
  ];
  const inquiryEn=[
   ['Describe one safe real-world observation without adding unsupported assumptions.',
    'The observation must be testable and distinguish data from interpretation.'],
   ['Compare two cases and say which relevant variable you would keep constant.',
    'The comparison must identify a controlled condition and the variable under investigation.'],
   ['Choose a measuring instrument and unit that could test your explanation.',
    'A complete response names the measured quantity, instrument, unit and reading limitation.'],
   ['Build a three-reading data table and interpret its variation.',
    'The table needs labelled quantities, units and a reasoned interpretation of variation.'],
   ['Compare two models and explain which assumption distinguishes them.',
    'Identify a model assumption, its range of validity and an appropriate test.'],
   ['Identify a systematic error and explain how to check or correct it.',
    'Give one plausible bias and a suitable independent check or recalibration.'],
   ['Test a limiting case in which the proposed model no longer applies.',
    'State which assumption fails and how that affects the prediction.']
  ];
  const tasks=language==='ro'?inquiryRo:inquiryEn;
  const challenge=tasks[Math.min(rank,tasks.length-1)];
  return entries.map((entry,index)=>({...entry,
   id:'advisory-physics-'+code+'-'+scoped+'-'+tier+'-'+entry.id,
   grade:scoped,source:'oer-original-advisory',nationallyVerified:false,
   advisoryTier:tier,chapterIndex:index+1,
   exercise:(entry.exercise||'')+' '+challenge[0],
   answer:(entry.answer||'')+' '+challenge[1]
  }));
 }
 if(phase==='upper'){
  const index=all.findIndex(y=>String(y.id)===scoped);
  if(index<0)return [];
  const entries=(Array.isArray(referenceLessons)?referenceLessons:[]).filter(entry=>
   entry.subject==='physics'&&entry.topic===topic&&
   ['beginner','intermediate'].includes(entry.level)&&entry.statement&&entry.title);
  return entries.map((entry,n)=>({...entry,
   id:'advisory-physics-upper-'+code+'-'+scoped+'-'+entry.id,
   grade:scoped,source:'oer-original-advisory',nationallyVerified:false,
   chapterIndex:n+1}));
 }
 return [];
}
