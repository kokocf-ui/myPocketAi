import {physicsCountryGradePlan} from './physics_europe_frameworks.mjs';
import {PHYSICS_EUROPE_EXTRA_LESSONS} from './physics_europe_wave_measurement.mjs';

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
 country='',stage='lower',grade='',topic='',years=[],bank=null,referenceLessons=[]
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
  const seen=new Set();
  const entries=[...direct,...supplemental].filter(entry=>{
   const key=String(entry.title||'').normalize('NFD').replace(/[^a-z0-9]+/g,'').toLowerCase();
   if(seen.has(key))return false;
   seen.add(key);return true;
  });
  return entries.map((entry,index)=>({...entry,
   id:'advisory-physics-'+code+'-'+scoped+'-'+tier+'-'+entry.id,
   grade:scoped,source:'oer-original-advisory',nationallyVerified:false,
   advisoryTier:tier,chapterIndex:index+1}));
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
