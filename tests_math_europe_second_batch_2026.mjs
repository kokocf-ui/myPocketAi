import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {MATH_SECOND_BATCH_COUNTRIES,MATH_SECOND_BATCH_SOURCE_REGISTRY,
 MATH_SECOND_BATCH_STAGE_LABELS,MATH_SECOND_BATCH_FIRST_GRADE,
 secondBatchMathStudyYears,secondBatchMathPhase,secondBatchMathGradeProfile,
 secondBatchMathStarterLessons,EUROPE_2026_STRUCTURE}
 from './math_europe_second_batch_2026.mjs';
import {mathCountryStudyYears,mathCountryGradeAreas} from './math_country_grade_areas.mjs';
import {mathCountryCourseEntries,mathInDepthMaterial} from './math_depth_courses.mjs';
import {mathCountryPhasePlan,MATH_COUNTRY_STAGE_LABELS,MATH_EUROPE_SOURCE_REGISTRY}
 from './math_country_year_alignment_2026.mjs';
import {educationCountrySchoolYears,educationSubjectSchoolPlan}
 from './education_all_country_subject_matrix.mjs';

const EXPECTED={
 BE:[6,3,3],CH:[6,3,3],LU:[6,3,4],CZ:[5,4,4],SK:[4,5,4],
 SI:[6,3,4],HR:[4,4,4],GR:[6,3,3],CY:[6,3,3],MT:[6,5,2],
 BG:[4,3,5],EE:[6,3,3],LV:[6,3,3],LT:[4,6,2],RS:[4,4,4],
 MD:[4,5,3],AL:[5,4,3],TR:[4,4,4],ME:[5,4,4],BA:[5,4,4],
 'GB-SCT':[7,3,3],'GB-WLS':[6,3,4],'GB-NIR':[7,3,4]
};
assert.equal(MATH_SECOND_BATCH_COUNTRIES.length,23);
assert.deepEqual(new Set(MATH_SECOND_BATCH_COUNTRIES),new Set(Object.keys(EXPECTED)));
assert.ok(EUROPE_2026_STRUCTURE.includes('b82d1d07'));
const stageOrder=['beginner','lower','medium'];
const years=(country,stage)=>mathCountryStudyYears({country,stage,
 years:educationCountrySchoolYears(country,stage).years});
let totalYears=0,totalTopics=0,totalLessons=0,entryExamples=0;
for(const code of MATH_SECOND_BATCH_COUNTRIES){
 const source=MATH_SECOND_BATCH_SOURCE_REGISTRY[code];
 assert.ok(source.curriculum.startsWith('https://'));
 assert.ok(MATH_EUROPE_SOURCE_REGISTRY[code]?.curriculum.startsWith('https://'));
 assert.deepEqual(MATH_COUNTRY_STAGE_LABELS[code],MATH_SECOND_BATCH_STAGE_LABELS[code]);
 for(const [i,stage] of stageOrder.entries()){
  const list=years(code,stage);
  assert.equal(list.length,EXPECTED[code][i],code+'/'+stage+' national cycle length wrong');
  assert.equal(new Set(list.map(x=>String(x.id))).size,list.length);
  assert.ok(list.every(x=>x.native&&x.nativeLang&&x.curriculumVerified===false));
  assert.ok(list.every(x=>x.countryFrameworkSpecific===true));
  const normalStage=stage==='beginner'?'primary':stage==='medium'?'intermediate':'lower';
  assert.ok(MATH_COUNTRY_STAGE_LABELS[code][normalStage][0]);
  const first=MATH_SECOND_BATCH_FIRST_GRADE[code][i];
  assert.equal(String(list[0].id),first,'First national stage year mismatch '+code+'/'+stage);
  const starterTopic=stage==='beginner'?'arithmetic':stage==='lower'?'algebra':'functions';
  const sample=secondBatchMathStarterLessons({
   country:code,stage:normalStage,grade:first,topic:starterTopic
  });
  assert.equal(sample.length,1,'One original entry lesson for '+code+'/'+stage);
  assert.ok(sample[0].title&&sample[0].worked&&sample[0].practice&&sample[0].answers);
  assert.ok(sample[0].source.startsWith('https://'));
  assert.equal(sample[0].sourceStatus,'national-school-structure-referenced-practice-only');
  assert.ok(mathInDepthMaterial(sample[0]).includes('Exersează singur'));
  entryExamples++;

  for(const year of list){
   const grade=String(year.id);
   const phase=mathCountryPhasePlan({country:code,stage,grade,years:list});
   assert.ok(phase.phases.length>0&&phase.phases.every(p=>p>=1&&p<=6),
    code+'/'+stage+'/'+grade+' maths stage progression');
   const profile=mathCountryGradeAreas({country:code,stage,grade,years:list});
   assert.equal(profile.status,'general-learning');
   assert.ok(profile.units.length>=3,'Maths grade without topics '+code+'/'+stage+'/'+grade);
   assert.ok(profile.source.startsWith('https://'),'Every path has a structural evidence source');
   assert.ok(profile.note.includes('nu o listă oficială')===false,
    'Warning phrasing can vary, but must never certify a textbook');
   assert.ok(profile.note.includes('orientativ'),'Country plans must be transparent');
   assert.ok(profile.note.includes('trebuie ales'),'School stream/region needs qualification');
   const fromMatrix=educationSubjectSchoolPlan({
    country:code,stage,grade,subject:'mathematics'
   });
   assert.equal(fromMatrix.status,'general-learning');
   assert.equal(fromMatrix.source,profile.source);
   assert.equal(fromMatrix.verifiedManual,false);
   const ids=new Set();
   for(const unit of profile.units){
    assert.ok(unit.ro&&unit.en&&unit.native&&unit.nativeLang);
    assert.equal(unit.countrySpecific,false);
    assert.equal(unit.countryFrameworkSpecific,true);
    assert.equal(unit.curriculumCompletion,'unverified-advisory');
    assert.ok(!ids.has(unit.id),'Repeated topics '+code+'/'+stage+'/'+grade);
    ids.add(unit.id);
    const cards=mathCountryCourseEntries({
     country:code,stage:normalStage,grade,topic:unit.id,
     phase:phase.phase,phases:phase.phases
    });
    assert.equal(cards.length,unit.lessonCount,
     'Android count must match routed lesson cards '+code+'/'+stage+'/'+grade+'/'+unit.id);
    assert.ok(cards.length>=3,'No empty chapter branch');
    assert.ok(cards.every(x=>x.statement&&x.worked&&x.practice&&x.answers));
    totalTopics++;totalLessons+=cards.length;
   }
   totalYears++;
  }
 }
}
assert.equal(entryExamples,69,'23 jurisdictions × 3 school stages = 69 originals');
assert.ok(totalYears>250&&totalTopics>900&&totalLessons>5000,
 'Coverage across every year and national school stage must be present');

// Malta differs critically from the generic 7–9/10–13 comparison scheme.
assert.deepEqual(years('MT','lower').map(x=>x.id),['7','8','9','10','11']);
assert.deepEqual(years('MT','medium').map(x=>x.id),['12','13']);
assert.equal(years('MT','lower')[4].native,'Secondary · Form 5');
assert.equal(years('MT','medium')[0].native,'Sixth Form · Year 1');
assert.equal(educationSubjectSchoolPlan({
 country:'MT',stage:'medium',grade:'10',subject:'mathematics'
}).status,'invalid-selection');
assert.equal(educationSubjectSchoolPlan({
 country:'MT',stage:'lower',grade:'10',subject:'mathematics'
}).status,'general-learning');
assert.equal(educationSubjectSchoolPlan({
 country:'MT',stage:'medium',grade:'10',subject:'literature'
}).status!=='invalid-selection',true,
 'The Malta maths-only correction must not change literature school-years');

assert.ok(years('LU','beginner')[0].native.includes('cycle 2'));
assert.ok(years('LU','beginner')[2].native.includes('cycle 3'));
assert.ok(years('LU','beginner')[4].native.includes('cycle 4'));
assert.equal(years('LT','medium')[0].native,'Gimnazija · III klasė');
assert.equal(years('LT','medium')[1].native,'Gimnazija · IV klasė');
assert.match(years('GR','lower')[0].native,/Γυμνάσιο/);
assert.match(years('CY','medium')[0].native,/Λύκειο/);
assert.match(years('GB-SCT','medium')[0].native,/Senior Phase/);
assert.match(years('GB-WLS','lower')[0].native,/Curriculum for Wales/);
assert.match(years('GB-NIR','medium')[0].native,/GCSE/);
assert.match(years('GB-NIR','medium')[2].native,/Sixth Form/);
assert.ok(years('BE','beginner').every(x=>x.nationalYearVerified===false));
assert.ok(years('CH','beginner').every(x=>x.nationalYearVerified===false));
assert.ok(years('BA','lower').every(x=>x.nationalYearVerified===false));
const turkeyNew=mathCountryGradeAreas({
 country:'TR',stage:'beginner',grade:'2',years:years('TR','beginner')
});
const turkeyOld=mathCountryGradeAreas({
 country:'TR',stage:'beginner',grade:'4',years:years('TR','beginner')
});
assert.match(turkeyNew.note,/TYMM/);
assert.match(turkeyOld.note,/retroactiv/);
assert.ok(turkeyNew.note!==turkeyOld.note,'Turkey 2026/27 cohorts must differ');

// Regression guard: existing country-grade systems stay untouched.
for(const [code,stage,expected] of [
 ['RO','beginner',['1','2','3','4']],
 ['RO','lower',['5','6','7','8']],
 ['GB-ENG','beginner',['Y1','Y2','Y3','Y4','Y5','Y6']],
 ['IT','lower',['M1','M2','M3']],
 ['ES','lower',['ESO1','ESO2','ESO3','ESO4-A','ESO4-B']],
 ['PL','lower',['IV','V','VI','VII','VIII']],
 ['NL','beginner',['G1','G2','G3','G4','G5','G6','G7','G8']]
]){
 assert.deepEqual(years(code,stage).map(x=>x.id),expected,code+' country-stage regression');
}
const html=await(await app.fetch(new Request('https://math-23-batch.test/'))).text();
const inline=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline,'Actual Android HTML must embed scripts');
new vm.Script(inline);
assert.ok(inline.includes('const MATH_SECOND_BATCH_FIRST_LESSONS='));
const raw=inline.split('const MATH_SECOND_BATCH_FIRST_LESSONS=')[1]?.split(';\n')[0];
assert.ok(raw);
const bank=JSON.parse(raw);
assert.equal(Object.keys(bank).length,69,'69 native starter cards must be shipped to Android');
assert.equal(bank['MT|lower|7|algebra'][0].country,'MT');
assert.equal(bank['TR|primary|1|arithmetic'][0].grade,'1');
assert.equal(bank['GB-WLS|intermediate|Y10|functions'][0].country,'GB-WLS');
assert.ok(inline.includes('Secondary · Form 5'));
assert.ok(inline.includes('Senior Phase · S4'));
assert.ok(inline.includes('Osnovna šola · 1. razred'));
assert.ok(inline.includes('Gimnazija · III klasė'));
assert.ok(inline.includes('function secondBatchMathStarterLessons'));
console.log('PASS 23 school systems, '+totalYears+' national-grade Maths plans, '+
 totalTopics+' national-language strands, '+totalLessons+
 ' real routed supplemental cards and 69 original entry exercises with Android embedding');
