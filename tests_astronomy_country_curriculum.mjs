// Source-scoped 2026/27 Astronomy: no invented national curricula for 50 countries.
import assert from 'node:assert/strict';
import app from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears,educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';
import {ASTRONOMY_EUROPE_COUNTRIES,ASTRONOMY_EUROPE_FRAMEWORKS,astronomyCountryGradePlan} from './astronomy_europe_frameworks.mjs';
import {ASTRONOMY_TOPICS} from './astronomy_curriculum.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';
assert.deepEqual(new Set(ASTRONOMY_EUROPE_COUNTRIES),new Set(EDUCATION_EUROPE_COUNTRIES));
let checked=0,unknown=0,official=0;
const get=(country,stage,grade)=>{
 const mapStage=stage==='primary'?'beginner':stage==='upper'?'medium':stage;
 const years=educationCountrySchoolYears(country,mapStage).years;
 const policy=astronomyCountryGradePlan({country,stage,grade,years});
 const plan=scienceGradeTopicPlan({country,subject:'astronomy',stage,grade,years,topics:ASTRONOMY_TOPICS});
 return {policy,plan,years};
};
for(const country of EDUCATION_EUROPE_COUNTRIES){
 for(const [stage,level] of [['primary','beginner'],['lower','lower'],['upper','medium']]){
  const years=educationCountrySchoolYears(country,level).years;
  for(const year of years){
   const {policy,plan}=get(country,stage,year.id);
   assert.notEqual(policy.status,'invalid-selection',country+'/'+stage+'/'+year.id);
   assert.equal(policy.country,country);assert.equal(policy.grade,year.id);
   assert.ok(policy.noteRo.length>60&&policy.noteEn.length>60);
   assert.ok(['national-optional','integrated','enrichment','unverified'].includes(policy.kind));
   assert.ok(policy.source===null||policy.source.startsWith('https://'));
   assert.ok(policy.offerVerified===false||policy.source,'an official offer needs a source');
   assert.equal(policy.topicsVerified,false,'no full national chapter mapping is yet certified');
   assert.equal(plan.astronomyTeachingKind,policy.kind);
   assert.equal(plan.astronomyStatus,policy.status);
   assert.equal(plan.astronomyReference,policy.source);
   assert.deepEqual(plan.topics.map(x=>x.id),educationSubjectSchoolPlan({country,stage:level,grade:year.id,subject:'astronomy'}).units.map(x=>x.id));
   if(policy.topicIds.length)assert.deepEqual(plan.topics.map(x=>x.id),policy.topicIds);
   assert.ok(plan.topics.length>0);
   if(policy.kind==='unverified'){unknown++;assert.equal(policy.source,null,'no invented source for unverified country');}
   if(policy.offerVerified)official++;
   checked++;
  }
 }
}
const ro5=get('RO','lower','5'),ro7=get('RO','lower','7');
assert.equal(ro5.policy.kind,'national-optional');
assert.equal(ro7.policy.kind,'national-optional');
assert.notDeepEqual(ro5.plan.topics.map(x=>x.id),ro7.plan.topics.map(x=>x.id));
for(const [grade,name,first] of [
 ['9','Cerul mai aproape','sky'],['10','Universul în mișcare','gravity'],
 ['11','Stelele sub lupă','stars'],['12','Universul și omul','cosmology']
]){
 const {policy,plan}=get('RO','upper',grade);
 assert.equal(policy.kind,'national-optional');
 assert.ok(policy.programmeRo.includes(name));
 assert.equal(plan.topics[0].id,first);
 assert.equal(plan.astronomyOfferingVerified,true);
}
for(const y of ['6','8'])assert.equal(get('RO','lower',y).policy.kind,'enrichment');
const en5=get('GB-ENG','primary','Y5');
assert.equal(en5.policy.kind,'integrated');
assert.equal(en5.policy.sourceScope,'national-stage-and-year');
for(const year of ['Y7','Y8','Y9']){
 const plan=get('GB-ENG','lower',year);
 assert.equal(plan.policy.kind,'integrated');
 assert.equal(plan.policy.sourceScope,'national-key-stage');
 assert.equal(plan.policy.topicsVerified,false);
}
for(const country of ['GB-SCT','GB-WLS','GB-NIR'])
 assert.equal(get(country,'lower',educationCountrySchoolYears(country,'lower').years[0].id).policy.kind,'integrated');
for(const country of ['HU','FR','IT','PL','DE','PT','NO','TR']){
 const first=educationCountrySchoolYears(country,'lower').years[0];
 assert.equal(get(country,'lower',first.id).policy.status,'country-curriculum-unverified');
}
assert.equal(astronomyCountryGradePlan({country:'RO',stage:'lower',grade:'99',years:[]}).status,'invalid-selection');
const html=await(await app.fetch(new Request('https://astronomy-europe-registry.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
assert.ok(script.includes('const astronomyCountryGradePlan=')&&script.includes('const ASTRONOMY_EUROPE_COUNTRIES='));
assert.ok(script.includes("if(scienceJourney.subject==='astronomy'&&stage==='topics'"));
console.log('PASS Astronomy scoped curriculum:',ASTRONOMY_EUROPE_COUNTRIES.length,
 'jurisdictions,',checked,'school-year tracks,',official,'source-backed offerings,',unknown,'unverified flags');
