import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import app from './index.js';
import {MATH_FINAL_COUNTRIES,MATH_FINAL_STAGE_LABELS,MATH_FINAL_SOURCES,
 MATH_FINAL_FIRST,finalMathStudyYears,finalMathPhase,finalMathGradeProfile,
 finalMathStarterLessons} from './math_europe_final_systems_2026.mjs';
import {MATH_SECOND_BATCH_COUNTRIES} from './math_europe_second_batch_2026.mjs';
import {MATH_BULK_CODES} from './math_europe_batch_2026.mjs';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears,
 educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';
import {mathCountryStudyYears,mathCountryGradeAreas} from './math_country_grade_areas.mjs';
import {mathCountryPhasePlan,MATH_EUROPE_SOURCE_REGISTRY,
 MATH_COUNTRY_STAGE_LABELS} from './math_country_year_alignment_2026.mjs';
import {mathCountryCourseEntries} from './math_depth_courses.mjs';

const expected={
 AD:[6,4,2],BY:[4,5,2],IS:[7,3,4],LI:[5,4,4],MC:[5,4,3],
 MK:[5,4,4],RU:[4,5,2],SM:[5,3,5],UA:[4,5,3],VA:[1,1,1],XK:[5,4,3]
};
assert.equal(MATH_FINAL_COUNTRIES.length,11);
assert.deepEqual(new Set(MATH_FINAL_COUNTRIES),new Set(Object.keys(expected)));
const covered=new Set([
 'RO','GB-ENG','FR','PT','IT','ES',...MATH_BULK_CODES,
 ...MATH_SECOND_BATCH_COUNTRIES,...MATH_FINAL_COUNTRIES
]);
assert.equal(covered.size,50,'One comprehensive country structural alignment, not 50 user interruptions');
assert.deepEqual(covered,new Set(EDUCATION_EUROPE_COUNTRIES));

const stages=['beginner','lower','medium'];
const years=(country,stage)=>mathCountryStudyYears({
 country,stage,years:educationCountrySchoolYears(country,stage).years
});
let annual=0,topics=0,lessons=0,originals=0;
for(const code of MATH_FINAL_COUNTRIES){
 const source=MATH_FINAL_SOURCES[code]?.curriculum;
 assert.ok(source?.startsWith('https://'),code+' curriculum/structure reference');
 assert.equal(MATH_EUROPE_SOURCE_REGISTRY[code].curriculum,source);
 assert.deepEqual(MATH_COUNTRY_STAGE_LABELS[code],MATH_FINAL_STAGE_LABELS[code]);
 for(const [idx,stage] of stages.entries()){
  const list=years(code,stage),clientStage=stage==='beginner'?'primary':stage==='medium'?'intermediate':'lower';
  assert.equal(list.length,expected[code][idx],code+'/'+stage+' school year count');
  assert.equal(new Set(list.map(y=>y.id)).size,list.length);
  assert.ok(list.every(y=>y.native&&y.nativeLang&&y.curriculumVerified===false));
  assert.ok(list.every(y=>y.countryFrameworkSpecific));
  for(const year of list){
   const grade=String(year.id);
   const progress=mathCountryPhasePlan({country:code,stage,grade,years:list});
   assert.ok(progress.phases.length>0&&progress.phases.every(x=>x>0&&x<=6));
   const plan=mathCountryGradeAreas({country:code,stage,grade,years:list});
   const integrated=educationSubjectSchoolPlan({
    country:code,stage,grade,subject:'mathematics'
   });
   assert.equal(integrated.status,'general-learning');
   assert.equal(integrated.source,source);
   assert.equal(plan.status,'general-learning');
   assert.equal(plan.source,source);
   assert.ok(plan.note.includes('auxiliare'),'These are not official annual textbooks');
   assert.ok(plan.units.length>=3,code+'/'+stage+'/'+grade+' has no branches');
   const used=new Set();
   for(const unit of plan.units){
    assert.ok(unit.id&&unit.ro&&unit.en&&unit.native);
    assert.ok(unit.countryFrameworkSpecific&&!unit.countrySpecific);
    assert.equal(unit.curriculumCompletion,'unverified-advisory');
    assert.ok(!used.has(unit.id));
    used.add(unit.id);
    const cards=mathCountryCourseEntries({
     country:code,stage:clientStage,grade,topic:unit.id,
     phase:progress.phase,phases:progress.phases
    });
    assert.equal(cards.length,unit.lessonCount);
    assert.ok(cards.length>=3);
    assert.ok(cards.every(x=>x.statement&&x.worked&&x.practice&&x.answers));
    topics++;lessons+=cards.length;
   }
   annual++;
  }
  const first=MATH_FINAL_FIRST[code]?.[idx];
  if(code==='VA'){
   assert.equal(first,undefined,'No invented Vatican national grade starter');
   continue;
  }
  assert.equal(String(list[0].id),first);
  const topic=stage==='beginner'?'arithmetic':stage==='lower'?'algebra':'functions';
  const entry=finalMathStarterLessons({
   country:code,stage:clientStage,grade:first,topic
  });
  assert.equal(entry.length,1,code+' missing example '+stage);
  assert.ok(entry[0].worked&&entry[0].formula&&entry[0].practice&&entry[0].answers);
  assert.equal(entry[0].curriculumCompletion,'unverified-advisory');
  originals++;
 }
}
assert.equal(originals,30,'Ten educational jurisdictions × three stages; never invent Vatican maths');
assert.ok(annual>110&&topics>340&&lessons>3000);

// Source-specific policy and boundary conditions.
assert.deepEqual(years('VA','beginner').map(x=>x.id),['external-curriculum']);
assert.deepEqual(years('VA','lower').map(x=>x.id),['external-curriculum']);
assert.deepEqual(years('VA','medium').map(x=>x.id),['external-curriculum']);
assert.ok(years('VA','beginner').every(x=>x.nationalYearVerified===false));
assert.equal(educationSubjectSchoolPlan({country:'VA',stage:'beginner',
 grade:'general-primary-1',subject:'mathematics'}).status,'invalid-selection');
assert.equal(educationSubjectSchoolPlan({country:'VA',stage:'beginner',
 grade:'external-curriculum',subject:'mathematics'}).status,'general-learning');
assert.notEqual(educationSubjectSchoolPlan({country:'VA',stage:'beginner',
 grade:'general-primary-1',subject:'literature'}).status,'invalid-selection',
 'Only Mathematics has its non-national school selector changed');
assert.match(mathCountryGradeAreas({country:'VA',stage:'beginner',
 grade:'external-curriculum',years:years('VA','beginner')}).note,/Roma/);

assert.match(years('AD','beginner')[0].native,/Escola Andorrana/);
assert.match(years('MC','lower')[0].native,/Collège/);
assert.deepEqual(years('SM','lower').map(x=>x.native),
 ['Scuola Media · 1ª','Scuola Media · 2ª','Scuola Media · 3ª']);
assert.match(years('LI','medium')[0].native,/Gymnasium/);
assert.match(years('MK','beginner')[0].native,/Основно образование/);
const u=years('UA','medium');
assert.deepEqual(u.map(x=>x.id),['10','11','12']);
assert.equal(u[2].nationalYearVerified,false);
assert.equal(u[2].pilotOnly,true);
assert.match(u[2].native,/лише пілот/);
assert.match(mathCountryGradeAreas({
 country:'UA',stage:'medium',grade:'12',years:u
}).note,/Numai elevii din licee-pilot/);
assert.match(mathCountryGradeAreas({
 country:'UA',stage:'medium',grade:'10',years:u
}).note,/pilotul/);
assert.equal(finalMathStarterLessons({
 country:'VA',stage:'primary',grade:'external-curriculum',topic:'arithmetic'
}).length,0);
assert.deepEqual(years('RU','medium').map(x=>x.id),['10','11']);

// Previous accepted country/grade paths still have their own structures.
for(const [country,stage,expectedIds] of [
 ['RO','beginner',['1','2','3','4']],
 ['GB-ENG','lower',['Y7','Y8','Y9']],
 ['IT','lower',['M1','M2','M3']],
 ['ES','lower',['ESO1','ESO2','ESO3','ESO4-A','ESO4-B']],
 ['MT','medium',['12','13']],
 ['PL','lower',['IV','V','VI','VII','VIII']]
]){
 assert.deepEqual(years(country,stage).map(x=>x.id),expectedIds,
  country+' must not be regressed by this Europe batch');
}
const html=await(await app.fetch(new Request('https://math-all-50-stage.test/'))).text();
const inline=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline);
new vm.Script(inline);
assert.ok(inline.includes('const MATH_FINAL_FIRST_LESSONS=Object.create(null)'), 'Starter bank must not be embedded');
const bank=Object.assign({},...EDUCATION_EUROPE_COUNTRIES.map(code=>JSON.parse(readFileSync(new URL('./public/education/math/supplements/'+code+'.json',import.meta.url),'utf8')).banks.final));
assert.equal(Object.keys(bank).length,30);
assert.ok(bank['UA|primary|1|arithmetic'][0].worked);
assert.ok(bank['SM|lower|6|algebra'][0].worked);
assert.ok(!Object.keys(bank).some(x=>x.startsWith('VA|')));
assert.ok(inline.includes('Scuola Media · 1ª'));
assert.ok(inline.includes('Ліцей · 12 клас (лише пілот / 2026–27)'));
assert.ok(inline.includes('Seleziona il curriculum della scuola esterna'));
assert.ok(inline.includes('function finalMathStarterLessons'));
console.log('PASS ALL 50 jurisdictions structurally covered; final 11 across '+
 annual+' country/school maths paths, '+topics+' strands, '+lessons+
 ' routed supplementary lessons; 30 first-year originals, truthful Vatican and Ukraine exceptions');
