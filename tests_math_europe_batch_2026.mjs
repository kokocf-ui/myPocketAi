import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {MATH_BULK_CODES,MATH_BULK_SOURCES,MATH_BULK_STAGE_LABELS,
 bulkMathYearLabels,bulkMathNationalProfile,bulkMathPhase,bulkMathFirstLessons}
 from './math_europe_batch_2026.mjs';
import {mathCountryStudyYears,mathCountryGradeAreas}
 from './math_country_grade_areas.mjs';
import {mathCountryPhasePlan,MATH_EUROPE_SOURCE_REGISTRY,MATH_COUNTRY_STAGE_LABELS}
 from './math_country_year_alignment_2026.mjs';
import {mathCountryCourseEntries,mathInDepthMaterial} from './math_depth_courses.mjs';
import {educationCountrySchoolYears,educationSubjectSchoolPlan}
 from './education_all_country_subject_matrix.mjs';
import {HUNGARY_MATH_SOURCES} from './math_hungary_full_track_2026.mjs';

const EXPECTED={
 FI:[6,3,3],SE:[6,3,3],NO:[7,3,3],DK:[6,3,3],NL:[8,3,3],
 IE:[8,3,3],DE:[4,6,3],AT:[4,4,5],PL:[3,5,4],HU:[4,4,5]
};
const FIRST={
 FI:['1','7','10'],SE:['1','7','10'],NO:['1','8','11'],
 DK:['1','7','10'],NL:['G3','V1','V4'],IE:['1C','J1','5Y'],
 DE:['1','5','11'],AT:['1','5','9'],PL:['I','IV','L1'],HU:['1','5','9']
};
const stages=['beginner','lower','medium'];
assert.equal(MATH_BULK_CODES.length,10);
assert.deepEqual(new Set(MATH_BULK_CODES),new Set(Object.keys(EXPECTED)));

const years=(country,stage)=>mathCountryStudyYears({
 country,stage,years:educationCountrySchoolYears(country,stage).years
});
let totalYears=0,totalBranches=0,totalLessons=0,sourceEntries=0;
for(const country of MATH_BULK_CODES){
 assert.ok(MATH_BULK_STAGE_LABELS[country]?.primary?.[0]);
 assert.ok(MATH_BULK_STAGE_LABELS[country]?.lower?.[0]);
 assert.ok(MATH_BULK_STAGE_LABELS[country]?.intermediate?.[0]);
 assert.deepEqual(MATH_COUNTRY_STAGE_LABELS[country],MATH_BULK_STAGE_LABELS[country]);
 assert.ok(MATH_BULK_SOURCES[country].basic.startsWith('https://'));
 assert.ok(MATH_EUROPE_SOURCE_REGISTRY[country].curriculum.startsWith('https://'));
 for(const [i,stage] of stages.entries()){
  const list=years(country,stage);
  assert.equal(list.length,EXPECTED[country][i],
   'National Maths cycle duration mismatch: '+country+'/'+stage);
  assert.equal(new Set(list.map(x=>x.id)).size,list.length);
  assert.ok(list.every(x=>x.native&&x.nativeLang&&!x.curriculumVerified));
  assert.ok(list.every(x=>x.countryFrameworkSpecific===true));
  const src=MATH_BULK_SOURCES[country][stage==='medium'?'upper':'basic'];
  for(const year of list){
   const grade=year.id;
   const phase=mathCountryPhasePlan({country,stage,grade,years:list});
   assert.ok(phase.phases.length>0&&phase.phases.every(p=>p>=1&&p<=6));
   const plan=mathCountryGradeAreas({country,stage,grade,years:list});
   const integrated=educationSubjectSchoolPlan({country,stage,grade,
    subject:'mathematics'});
   assert.equal(plan.status,'general-learning');
   assert.equal(integrated.status,'general-learning',
    'Official framework != verified annual textbook');
   const plIV=country==='PL'&&stage==='lower'&&String(grade)==='IV';
   const expectedSrc=plIV?'https://eli.gov.pl/eli/DU/2026/378/ogl/pol':
    country==='HU'?HUNGARY_MATH_SOURCES[stage==='beginner'?'primary':stage==='lower'?'lower':'upper']:src;
   assert.equal(plan.source,expectedSrc);
   assert.equal(integrated.source,expectedSrc);
   assert.ok(plIV?plan.note.includes('Nu sunt texte copiate din manuale'):
    plan.note.includes('nu o listă oficială'),
    'All jurisdictions need transparent coverage warnings');
   assert.ok(plan.units.length>=3,'Missing strands: '+country+'/'+stage+'/'+grade);
   const topics=new Set();
   for(const u of plan.units){
    assert.ok(u.ro&&u.en&&(plIV||u.native&&u.nativeLang));
    assert.equal(u.countrySpecific,plIV);
    if(!plIV)assert.equal(u.countryFrameworkSpecific,true);
    assert.equal(u.curriculumCompletion,plIV?'partial-source-review':'unverified-advisory');
    assert.ok(!topics.has(u.id),'Duplicate topics '+country+'/'+grade);
    topics.add(u.id);
    const courseStage=stage==='beginner'?'primary':stage==='medium'?'intermediate':stage;
    const cards=mathCountryCourseEntries({
     country,stage:courseStage,grade,topic:u.id,
     phase:phase.phase,phases:phase.phases
    });
    assert.equal(cards.length,u.lessonCount,
     'UI lesson count != routed original cards: '+country+'/'+grade+'/'+u.id);
    assert.ok(cards.length>=3,'Empty or inadequate content '+country+'/'+grade+'/'+u.id);
    assert.ok(cards.every(x=>x.title&&x.statement&&x.worked&&x.practice&&x.answers));
    totalBranches++;totalLessons+=cards.length;
   }
   totalYears++;
  }
  const starterGrade=FIRST[country][i],topic=i===0?'arithmetic':i===1?'algebra':'functions';
  const specific=bulkMathFirstLessons({
   country,stage:stage==='beginner'?'primary':stage==='medium'?'intermediate':stage,
   grade:starterGrade,topic
  });
  assert.equal(specific.length,1,'Missing country/stage original example '+country+'/'+stage);
  assert.equal(specific[0].source,src);
  assert.equal(specific[0].country,country);
  assert.equal(specific[0].curriculumCompletion,'unverified-advisory');
  assert.ok(mathInDepthMaterial(specific[0]).includes('Exersează singur'));
  sourceEntries++;
 }
}
assert.equal(sourceEntries,30);
assert.equal(totalYears,EXPECTED&&Object.values(EXPECTED).reduce((n,x)=>n+x.reduce((a,b)=>a+b,0),0));
assert.ok(totalBranches>280&&totalLessons>850);

const NL=years('NL','beginner');
assert.deepEqual(NL.slice(0,3).map(x=>x.native),
 ['Basisschool · groep 1','Basisschool · groep 2','Basisschool · groep 3']);
assert.deepEqual(mathCountryPhasePlan({country:'NL',stage:'beginner',grade:'G3',years:NL}).phases,[1]);
const NO=years('NO','beginner');
assert.equal(NO[6].native,'Grunnskolen · 7. trinn');
assert.equal(NO[6].curriculumVerified,false);
const DE=years('DE','beginner');
assert.ok(DE.every(x=>x.nationalYearVerified===false),'No mandatory national 4-year Grundschule in Berlin');
const HU=years('HU','medium');
assert.match(HU[4].native,/technikum/);
assert.equal(HU[4].nationalYearVerified,false);
const AT=years('AT','medium');
assert.match(AT[4].native,/BHS/);
assert.deepEqual(years('IE','beginner').slice(0,2).map(x=>x.id),['JI','SI']);
assert.equal(years('IE','medium')[0].id,'TY');
assert.deepEqual(mathCountryPhasePlan({country:'IE',stage:'medium',grade:'TY',years:years('IE','medium')}).phases,[1]);
assert.ok(MATH_EUROPE_SOURCE_REGISTRY.PL.manualExample.includes('podreczniki.men.gov.pl'));
assert.ok(MATH_EUROPE_SOURCE_REGISTRY.HU.manualExample.includes('tankonyvkatalogus'));
assert.deepEqual(years('PL','beginner').map(x=>x.id),['I','II','III']);
assert.deepEqual(years('PL','lower').map(x=>x.id),['IV','V','VI','VII','VIII']);
assert.equal(educationSubjectSchoolPlan({country:'PL',stage:'beginner',grade:'IV',
 subject:'mathematics'}).status,'invalid-selection');

for(const [country,stage,ids] of [
 ['RO','beginner',['1','2','3','4']],
 ['RO','lower',['5','6','7','8']],
 ['GB-ENG','beginner',['Y1','Y2','Y3','Y4','Y5','Y6']],
 ['GB-ENG','lower',['Y7','Y8','Y9']],
 ['IT','lower',['M1','M2','M3']],
 ['ES','lower',['ESO1','ESO2','ESO3','ESO4-A','ESO4-B']]
]){
 assert.deepEqual(years(country,stage).map(x=>x.id),ids,'Regression: '+country);
}
const html=await(await app.fetch(new Request('https://europe-batch.test/'))).text();
const inline=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline);
new vm.Script(inline);
assert.ok(inline.includes('o.native&&state.language===o.nativeLang'),
 'National grade picker should use language-matched local year names');
assert.ok(inline.includes('const MATH_BULK_FIRST_LESSONS='),
 '30 national starter cards must be shipped to Android, not just Node');
const clientBankText=inline.split('const MATH_BULK_FIRST_LESSONS=')[1]?.split(';\n')[0];
assert.ok(clientBankText);
const clientBank=JSON.parse(clientBankText);
assert.equal(Object.keys(clientBank).length,30,
 'All ten countries × three levels must be reachable on device');
assert.equal(clientBank['NO|lower|8|algebra'][0].title,'Regnerekkefølge');
assert.equal(clientBank['NL|primary|G3|arithmetic'][0].title,'Getallen tot tien');
assert.equal(clientBank['IE|intermediate|5Y|functions'][0].title,'Functions and representations');
assert.ok(inline.includes('Grundskolan · årskurs 1'));
assert.ok(inline.includes('Lukio · 1. opintovuosi'));
assert.ok(inline.includes('Liczby i działania'));
assert.ok(inline.includes('countryStage?learningLabel(countryStage[0],countryStage[1])'));
console.log('PASS ten European school systems across '+totalYears+' maths years, '
 +totalBranches+' country-named branch paths, '+totalLessons+' routed lessons, '
 +sourceEntries+' country/stage originals, no regressions to RO/GB/IT/ES');
