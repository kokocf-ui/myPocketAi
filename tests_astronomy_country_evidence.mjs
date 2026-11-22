import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {EDUCATION_EUROPE_COUNTRIES,educationCountrySchoolYears} from './education_all_country_subject_matrix.mjs';
import {ASTRONOMY_COUNTRY_EVIDENCE,astronomyNationalAlignment} from './astronomy_country_alignment.mjs';
import {ASTRONOMY_PLANETS,ASTRONOMY_PLANET_REFERENCE} from './astronomy_planets.mjs';
import {ASTRONOMY_STUDY_CASES,ASTRONOMY_PRIMARY_ALLOWED,ASTRONOMY_PRIMARY_CASES} from './astronomy_study_course.mjs';
import {ASTRONOMY_TOPICS} from './astronomy_curriculum.mjs';
import {scienceGradeTopicPlan} from './science_grade_progression.mjs';

assert.equal(EDUCATION_EUROPE_COUNTRIES.length,50);
assert.equal(Object.keys(ASTRONOMY_COUNTRY_EVIDENCE).length,50,
 'Every European school-system selector needs a documented evidence policy, including explicit Vatican exception');
for(const country of EDUCATION_EUROPE_COUNTRIES){
 assert.ok(ASTRONOMY_COUNTRY_EVIDENCE[country]?.length,
  'No curriculum source or explicit educational-system exception for '+country);
}
// The actual mobile app serializes the function, losing module closures.
// This isolated-realm test previously missed the real 'evidence is not defined' crash.
const browserAligned=vm.runInNewContext(
 'const ASTRONOMY_COUNTRY_EVIDENCE='+JSON.stringify(ASTRONOMY_COUNTRY_EVIDENCE)+';\n'+
 '('+astronomyNationalAlignment.toString()+')({country:\'RO\',stage:\'lower\',grade:\'5\'})');
assert.equal(browserAligned.status,'documented-topics');
assert.ok(EDUCATION_EUROPE_COUNTRIES.every(c=>astronomyNationalAlignment({country:c,stage:'lower',grade:'random'})));
for(const [country,items] of Object.entries(ASTRONOMY_COUNTRY_EVIDENCE)){
 assert.ok(EDUCATION_EUROPE_COUNTRIES.includes(country));
 for(const item of items){
  assert.match(item.source,/^https:\/\/(www\.)?/);
  assert.ok(item.sourceYear==null||(item.sourceYear>=1990&&item.sourceYear<=2026));
  assert.ok(['integrated','framework-only','optional-standalone','standalone','no-independent-curriculum'].includes(item.kind));
  assert.ok(item.subject&&item.title);
 }
}
const frCm2=astronomyNationalAlignment({country:'FR',stage:'primary',grade:'CM2'});
const frCm1=astronomyNationalAlignment({country:'FR',stage:'primary',grade:'CM1'});
const fr6=astronomyNationalAlignment({country:'FR',stage:'lower',grade:'6e'});
assert.equal(frCm2.sourceYear,2023,'2023 cycle-3 programme remains applicable in CM2 for 2026/27');
assert.equal(fr6.sourceYear,2023,'2023 cycle-3 programme remains applicable in 6e for 2026/27');
assert.equal(frCm1.sourceYear,2026,'2026 cycle-3 programme applies to CM1 first');
assert.equal(frCm2.supercessionConfirmed,false,'do not presume earlier 2023 programme expired');
assert.equal(astronomyNationalAlignment({country:'SI',stage:'lower',grade:'7'}).kind,'optional-standalone');
assert.equal(astronomyNationalAlignment({country:'SI',stage:'lower',grade:'7'}).sourceYear,1999,
 'Older officially listed elective must not be dropped because of its date');
assert.equal(astronomyNationalAlignment({country:'SI',stage:'lower',grade:'7'}).verifiedOptionalAsStandalone,true);
assert.equal(astronomyNationalAlignment({country:'LT',stage:'upper',grade:'11'}).kind,'optional-standalone');
assert.deepEqual(astronomyNationalAlignment({country:'LT',stage:'upper',grade:'12'}).topicIds,
 ['stars','galaxies','cosmology','exoplanets','gravity','distances','observations','sky']);
assert.equal(astronomyNationalAlignment({country:'VA',stage:'primary',grade:'1'}).status,'no-independent-national-school-syllabus');
assert.equal(astronomyNationalAlignment({country:'VA',stage:'lower',grade:'7'}).kind,'no-independent-curriculum');
assert.equal(astronomyNationalAlignment({country:'BY',stage:'upper',grade:'11'}).verifiedSeparateAstronomyProgramme,true);
assert.equal(astronomyNationalAlignment({country:'BA',stage:'lower',grade:'8'}).yearScoped,false,
 'Bosnian cantons and entities, not common core, assign compulsory grade chapters');
assert.equal(astronomyNationalAlignment({country:'MK',stage:'lower',grade:'8'}).sourceYear,2026);
assert.equal(astronomyNationalAlignment({country:'MK',stage:'lower',grade:'7'}).sourceYear,2025);
assert.equal(astronomyNationalAlignment({country:'SM',stage:'primary',grade:'1'}).sourceYear,2006);
assert.equal(astronomyNationalAlignment({country:'LI',stage:'primary',grade:'1'}).sourceYear,2019);
assert.equal(astronomyNationalAlignment({country:'IS',stage:'lower',grade:'8'}).sourceYear,2024);
assert.equal(astronomyNationalAlignment({country:'AD',stage:'lower',grade:'7'}).yearScoped,false,
 'Andorra cannot use one Astronomy programme for its three separate national school systems');
assert.equal(astronomyNationalAlignment({country:'BE',stage:'lower',grade:'7'}).sourceYear,null,
 'Undated Belgian cross-community programme must not receive fabricated publication year');
assert.equal(astronomyNationalAlignment({country:'IT',stage:'lower',grade:'M1'}).sourceYear,2025,
 'Italy new 2025 curriculum starts with lower-secondary Year 1 in 2026/27');
assert.equal(astronomyNationalAlignment({country:'IT',stage:'lower',grade:'M3'}).sourceYear,2012,
 'Italy 2012 framework legally remains in force for pre-reform cohorts');
assert.equal(astronomyNationalAlignment({country:'IT',stage:'primary',grade:'P1'}).sourceYear,2025);
assert.equal(astronomyNationalAlignment({country:'IT',stage:'primary',grade:'P5'}).sourceYear,2012);
assert.equal(astronomyNationalAlignment({country:'MT',stage:'lower',grade:'7'}).sourceYear,2025);
assert.equal(astronomyNationalAlignment({country:'MT',stage:'lower',grade:'8'}).sourceYear,2026);
assert.equal(astronomyNationalAlignment({country:'UA',stage:'upper',grade:'11'}).topicIds.length,8);
assert.equal(astronomyNationalAlignment({country:'TR',stage:'upper',grade:'10'}).sourceYear,2026);
assert.equal(astronomyNationalAlignment({country:'TR',stage:'upper',grade:'11'}).kind,'optional-standalone');
assert.equal(astronomyNationalAlignment({country:'SK',stage:'primary',grade:'1'}).sourceYear,2023);
assert.equal(astronomyNationalAlignment({country:'RU',stage:'upper',grade:'10'}).yearScoped,false,
 'Future 2027 Russian draft cannot be presented as mandatory 2026 Astronomy chapters');
assert.equal(astronomyNationalAlignment({country:'UA',stage:'upper',grade:'10'}).yearScoped,false,
 'Grade 10 standalone is available in the profile route but not a mandated universal topic-by-year list');
assert.equal(astronomyNationalAlignment({country:'LV',stage:'lower',grade:'7'}).sourceYear,2018);
assert.equal(astronomyNationalAlignment({country:'MD',stage:'upper',grade:'12'}).sourceYear,2019,
 'Moldovan adopted 2019 Physics/Astronomy curriculum must remain recognized while 2026 proposal is pending');
assert.equal(astronomyNationalAlignment({country:'DE',stage:'lower',grade:'8'}).kind,'framework-only',
 'German Länder annual Astronomy curriculum is not automatically established by KMK standards');
assert.equal(astronomyNationalAlignment({country:'CZ',stage:'lower',grade:'7'}).sourceYear,2004,
 'Older Czech framework must not be discarded before cohort-specific replacement');
assert.equal(astronomyNationalAlignment({country:'NO',stage:'lower',grade:'8'}).sourceYear,2026,
 'Use Norway NAT01-05, not superseded 2020 NAT01-04');
for(const code of ['DK','NL','NO','SE','LT','SI']){
 const stage=code==='NL'?'primary':'lower';
 assert.notEqual(astronomyNationalAlignment({country:code,stage,grade:'7'}).status,'source-not-yet-reviewed');
}
assert.equal(astronomyNationalAlignment({country:'RO',stage:'lower',grade:'5'}).kind,'integrated');
assert.equal(astronomyNationalAlignment({country:'GB-ENG',stage:'primary',grade:'Y5'}).kind,'integrated');
assert.equal(astronomyNationalAlignment({country:'AD',stage:'upper',grade:'general-upper-1'}).kind,'unknown',
 'Unreviewed does not equal absent curriculum');
for(const [country,stage,grade,expected] of [
 ['RO','lower','5',['solar','sky']],['GB-ENG','primary','Y5',['solar','sky']],
 ['FR','primary','CM2',['solar','sky']],['PT','lower','7',['solar','sky','distances']],
 ['PL','lower','VI',['solar','sky']]
]){
 const years=educationCountrySchoolYears(country,stage==='primary'?'beginner':'lower').years;
 const plan=scienceGradeTopicPlan({country,stage,grade,years,subject:'astronomy',topics:ASTRONOMY_TOPICS});
 assert.deepEqual(plan.topics.map(x=>x.id),expected,country+'/'+stage+'/'+grade);
 assert.ok(plan.curriculumReference,'Existing official references must be traceable');
 assert.ok(plan.note.includes('din '),'Source year must remain visible');
}
assert.deepEqual(ASTRONOMY_PLANETS.map(p=>p.ro),
 ['Mercur','Venus','Pământ','Marte','Jupiter','Saturn','Uranus','Neptun']);
assert.deepEqual(ASTRONOMY_PLANETS.map(p=>p.en),
 ['Mercury','Venus','Earth','Mars','Jupiter','Saturn','Uranus','Neptune']);
assert.ok(ASTRONOMY_PLANETS.every((p,i)=>p.au>0&&(i===0||p.au>ASTRONOMY_PLANETS[i-1].au)));
assert.equal(ASTRONOMY_PLANET_REFERENCE.astronomicalUnitMeters,149597870700);
for(const [topic,ids] of Object.entries(ASTRONOMY_PRIMARY_ALLOWED)){
 assert.ok(ids.every(id=>id.startsWith('astro-'+topic+'-')));
 assert.equal(ASTRONOMY_PRIMARY_CASES[topic].core.length,2);
 for(const name of ['examples','questions','answers'])
  assert.equal(ASTRONOMY_PRIMARY_CASES[topic][name].length,2);
}
for(const p of Object.values(ASTRONOMY_STUDY_CASES))
 assert.equal(p.questions.length,p.answers.length,'Every exercise needs its own answer');
const html=await(await app.fetch(new Request('https://astro-national.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
assert.ok(script.includes('const ASTRONOMY_COUNTRY_EVIDENCE='));
assert.ok(script.includes('const ASTRONOMY_PLANETS='));
assert.ok(script.includes('const ASTRONOMY_PRIMARY_CASES='));
assert.match(script,/function astronomyOrbit3DOpen\(\)/);
assert.match(script,/for\(const \[i,planet\] of ASTRONOMY_PLANETS\.entries\(\)\)/);
new vm.Script(script);
console.log('PASS Astronomy dated curricula (including supersession transitions), 50-jurisdiction honesty, eight planets and primary-stage safety');
