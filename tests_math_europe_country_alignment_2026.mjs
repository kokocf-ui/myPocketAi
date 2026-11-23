import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears,educationSubjectSchoolPlan}
 from './education_all_country_subject_matrix.mjs';
import {mathCountryStudyYears,mathCountryGradeAreas} from './math_country_grade_areas.mjs';
import {mathCountryPhasePlan,mathCountryEvidence,MATH_EUROPE_SOURCE_REGISTRY}
 from './math_country_year_alignment_2026.mjs';
import {mathCountryCourseEntries,mathInDepthMaterial} from './math_depth_courses.mjs';

const yrs=(country,stage)=>mathCountryStudyYears({
 country,stage,years:educationCountrySchoolYears(country,stage).years
});
const ids=(country,stage)=>yrs(country,stage).map(x=>String(x.id));
assert.deepEqual(ids('PL','beginner'),['I','II','III'],
 'Polish grade IV is NOT in the early integrated mathematics course');
assert.deepEqual(ids('PL','lower'),['IV','V','VI','VII','VIII'],
 'Maths becomes separate in Polish grade IV; do not change other subjects');
assert.ok(educationCountrySchoolYears('PL','beginner').years.some(x=>x.id==='IV'),
 'Other school subjects keep their existing Polish picker');
assert.equal(educationSubjectSchoolPlan({
 country:'PL',stage:'beginner',grade:'IV',subject:'mathematics'
}).status,'invalid-selection');
const pl4=educationSubjectSchoolPlan({
 country:'PL',stage:'lower',grade:'IV',subject:'mathematics'
});
assert.equal(pl4.status,'general-learning');
assert.ok(pl4.units.some(x=>x.id==='algebra'));
assert.ok(pl4.units.every(x=>x.id!=='arithmetic'));
assert.ok(pl4.units.every(x=>x.lessonCount>=3));

for(const [country,stage,expected] of [
 ['RO','beginner',['1','2','3','4']],
 ['RO','lower',['5','6','7','8']],
 ['RO','medium',['9','10','11','12']],
 ['GB-ENG','beginner',['Y1','Y2','Y3','Y4','Y5','Y6']],
 ['GB-ENG','lower',['Y7','Y8','Y9']],
 ['GB-ENG','medium',['Y10','Y11','Y12','Y13']]
])assert.deepEqual(ids(country,stage),expected,
 'Do not alter completed Romanian and English pathways: '+country+' '+stage);

const phase=(country,stage,grade)=>mathCountryPhasePlan({
 country,stage,grade,years:yrs(country,stage)
});
assert.deepEqual(phase('PL','beginner','III').phases,[3],
 'Primary grades must not inherit age-inappropriate sixth-year topics');
assert.deepEqual(phase('PT','beginner','4').phases,[4]);
assert.deepEqual(phase('IT','lower','M3').phases,[3,4],
 'Three-year lower stage should not drop its final advisory topics');
assert.deepEqual(phase('ES','medium','B1-CYT').phases,[1,2]);
assert.deepEqual(phase('ES','medium','B2-HCS').phases,[3,4]);
assert.equal(phase('RO','lower','8').phase,4);
assert.equal(phase('GB-ENG','beginner','Y6').phase,6);
assert.equal(phase('FR','lower','5e').phase,2);

for(const [country,grade] of [['NL','G1'],['NL','G2'],['IE','JI'],['IE','SI']]){
 const topics=mathCountryGradeAreas({country,stage:'beginner',grade,years:yrs(country,'beginner')});
 assert.deepEqual(topics.units.map(x=>x.id),['arithmetic','geometry','measurement']);
 for(const topic of topics.units){
  const cards=mathCountryCourseEntries({country,stage:'primary',grade,phase:1,topic:topic.id});
  assert.equal(cards.length,3,'Three distinct infant-level tasks for '+country+'/'+grade+'/'+topic.id);
  assert.ok(cards.every(x=>x.sourceStatus==='age-appropriate-advisory'));
  assert.ok(cards.every(x=>x.statement.length>=58&&x.worked.length>=35&&x.practice.length>=10));
  assert.ok(cards.every(x=>mathInDepthMaterial(x).includes('Exemplu rezolvat')));
 }
}
const france5=mathCountryGradeAreas({country:'FR',stage:'lower',grade:'5e',years:yrs('FR','lower')});
assert.deepEqual(france5.units.map(x=>x.id),['algebra','geometry','statistics','functions']);
assert.equal(france5.units.reduce((sum,x)=>sum+x.lessonCount,0),19,
 'French 5e has original lesson coverage for the 14-heading 2026 textbook');
assert.equal(france5.status,'general-learning','A real textbook is not automatic pedagogical approval');
assert.equal(france5.manualExample,'https://www.lelivrescolaire.fr/manuels/mathematiques-5eme-2026');
for(const branch of france5.units){
 const lessons=mathCountryCourseEntries({country:'FR',stage:'lower',grade:'5e',topic:branch.id,phase:2});
 assert.equal(lessons.length,branch.lessonCount);
 assert.ok(lessons.length>=3);
 assert.ok(lessons.every(x=>x.statement&&x.worked&&x.practice&&x.answers));
 assert.ok(lessons.every(x=>x.curriculumCompletion==='partial-source-review'));
}
const plManual=mathCountryEvidence({country:'PL',stage:'lower',grade:'IV'});
assert.ok(plManual.manualExample?.includes('podreczniki.men.gov.pl'),'Official Polish 2026 grade IV textbook listing');
assert.equal(mathCountryEvidence({country:'PL',stage:'lower',grade:'V'}).manualExample,null,
 'Grade IV manual may not be presented as applicable to grade V');
const early=mathCountryCourseEntries({country:'NL',stage:'primary',grade:'G1',topic:'arithmetic'});
assert.ok(early.some(x=>x.title.includes('5')));
assert.ok(!early.some(x=>/procente|fracții|derivate|ecuații pătratice/i.test(x.title)));

for(const country of ['FR','IT','PL','HU','ES','PT','DE','NL','IE']){
 const evidence=MATH_EUROPE_SOURCE_REGISTRY[country];
 assert.ok(evidence?.curriculum?.startsWith('https://'),country+' needs an inspectable official framework');
 const school=educationCountrySchoolYears(country,'lower');
 const sample=mathCountryGradeAreas({country,stage:'lower',grade:yrs(country,'lower')[0].id,years:yrs(country,'lower')});
 assert.equal(sample.status,'general-learning');
 if(country==='PT'){
  assert.match(sample.note,/Portugalia:/);
  assert.match(sample.note,/iulie 2018/);
  assert.ok(sample.source.includes('5_matematica_18julho_rev.pdf'));
  assert.ok(sample.units.every(x=>x.curriculumCompletion==='partial-source-review'),
   'Verified topic-level source references do not constitute full annual verification');
 }else if(country==='IT'){
  assert.match(sample.note,/Italia,/);
  assert.match(sample.note,/DM 221\/2025/);
  assert.ok(sample.source.includes('gazzettaufficiale.it'));
  assert.ok(sample.units.every(x=>x.curriculumCompletion==='partial-source-review'));
  assert.ok(sample.units.every(x=>x.it),'Italian maths years must have native branch names');
 }else if(country==='PL'){
  assert.match(sample.note,/Polonia, klasa IV/);
  assert.ok(sample.source.includes('eli.gov.pl'));
  assert.ok(sample.manualExample?.includes('podreczniki.men.gov.pl'));
  assert.ok(sample.units.every(x=>x.curriculumCompletion==='partial-source-review'));
 }else if(country==='ES'){
  assert.match(sample.note,/Spania:/);
  assert.ok(sample.source.includes('BOE-A-2022-4975'));
  assert.ok(sample.units.every(x=>x.curriculumCompletion==='partial-source-review'));
  assert.ok(sample.units.every(x=>x.es),'Spanish maths years must have native subject names');
 }else{
  assert.ok(sample.note.includes(evidence.note.slice(0,12)),country+' must be clearly source-annotated');
  assert.ok(sample.units.every(x=>x.curriculumCompletion==='unverified-advisory'),
   'A framework URL is not proof of annual textbook completeness');
 }
}
assert.ok(mathCountryEvidence({country:'FR',grade:'5e'}).manualExample?.includes('lelivrescolaire'));
assert.equal(mathCountryEvidence({country:'FR',grade:'4e'}).manualExample,null,
 'Do not pretend one textbook is applicable to all grades');
assert.ok(mathCountryEvidence({country:'HU',grade:'5'}).manualExample?.includes('tankonyvkatalogus'));
assert.ok(mathCountryEvidence({country:'TR',grade:'9'}).source.includes('tymm.meb.gov.tr'),
 'Turkish 2026 cohort guidance has a ministry source');
assert.equal(mathCountryEvidence({country:'TR',grade:'9'}).status,
 'framework-referenced-not-fully-verified',
 'A ministry framework is not a certified annual textbook');

let checked=0;
for(const country of EDUCATION_EUROPE_COUNTRIES){
 for(const stage of ['beginner','lower','medium']){
  const years=yrs(country,stage);
  assert.ok(years.length>0,country+' '+stage+' has no maths year');
  for(const year of years){
   const plan=educationSubjectSchoolPlan({country,stage,grade:year.id,subject:'mathematics'});
   assert.equal(plan.status,'general-learning',country+' '+stage+' '+year.id+' must not claim verified manual');
   assert.ok(plan.units.length>=3,country+' '+stage+' '+year.id+' no maths branches');
   for(const unit of plan.units){
    const p=phase(country,stage,year.id);
    const entries=mathCountryCourseEntries({
      country,stage:stage==='beginner'?'primary':stage==='medium'?'intermediate':stage,
      grade:year.id,topic:unit.id,phase:p.phase,phases:p.phases
    });
    assert.ok(entries.length>=3,country+' '+stage+' '+year.id+' '+unit.id+' has too few lessons');
    assert.equal(unit.lessonCount,entries.length,
     country+' '+stage+' '+year.id+' '+unit.id+' advertised a different lesson count');
   }
   checked++;
  }
 }
}
const html=await(await app.fetch(new Request('https://math-alignment.test/'))).text();
const inline=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline);
new vm.Script(inline);
assert.ok(inline.includes('const EDU_MATH_GRADE_PHASES='));
assert.ok(inline.includes('const EDU_MATH_STAGE_LABELS='));
assert.ok(inline.includes('countryStage?learningLabel(countryStage[0],countryStage[1])'));
assert.ok(inline.includes('Selectează anul de studiu al țării.'));

assert.ok(inline.includes('const MATH_EARLY_YEAR_BANK='));
assert.ok(inline.includes('phases:mathYearPosition().phases'));
console.log('PASS',checked,'Mathematics-only European grade paths, sourced advisory status, accessible infant lessons and intact RO/England');
