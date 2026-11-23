import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {ENGLAND_Y34_LESSONS,ENGLAND_Y34_REFERENCE,
 englandY34TopicLessons,englandY34Crosswalk} from './math_england_year3_year4_2026.mjs';
import {mathCountryStudyYears,mathCountryGradeAreas} from './math_country_grade_areas.mjs';
import {mathCountryCourseEntries,mathInDepthMaterial} from './math_depth_courses.mjs';
import {educationCountrySchoolYears,educationSubjectSchoolPlan} from './education_all_country_subject_matrix.mjs';

let total=0;
for(const [grade,minimum] of [['Y3',27],['Y4',29]]){
 const list=ENGLAND_Y34_LESSONS[grade];
 assert.equal(list.length,minimum);
 assert.equal(new Set(list.map(x=>x.id)).size,list.length,'Do not repeat maths cards');
 assert.ok(list.every(x=>x.country==='GB-ENG'&&x.grade===grade));
 assert.ok(list.every(x=>x.sourceStatus==='official-topic-reviewed'&&
  x.source===ENGLAND_Y34_REFERENCE.dfe&&x.externalUnitSequence.includes('thenational.academy')));
 assert.ok(list.every(x=>x.enTitle.length>5&&x.title.length>5&&
  x.statement.length>=85&&x.worked.length>=75&&x.practice.length>=10&&x.answers.length>=2),
  'No thin cards or empty worked examples');
 assert.ok(list.every(x=>mathInDepthMaterial(x).includes(x.formula)&&
  mathInDepthMaterial(x).includes('Exersează singur')));
 const years=mathCountryStudyYears({
  country:'GB-ENG',stage:'beginner',years:educationCountrySchoolYears('GB-ENG','beginner').years
 });
 const profile=mathCountryGradeAreas({country:'GB-ENG',stage:'beginner',grade,years});
 assert.equal(profile.status,'general-learning');
 assert.ok(profile.source.includes('gov.uk'));
 assert.ok(profile.externalUnitSequence.includes('thenational.academy'));
 assert.deepEqual(profile.units.map(x=>x.id),['arithmetic','measurement','geometry','statistics']);
 assert.equal(profile.units.reduce((sum,x)=>sum+x.lessonCount,0),list.length);
 assert.ok(profile.units.every(x=>x.countrySpecific&&x.curriculumCompletion==='partial-source-review'));
 const matrix=educationSubjectSchoolPlan({country:'GB-ENG',stage:'beginner',grade,subject:'mathematics'});
 assert.equal(matrix.status,'general-learning');
 assert.equal(matrix.verifiedManual,false);
 assert.deepEqual(matrix.units.map(x=>x.lessonCount),profile.units.map(x=>x.lessonCount));
 for(const topic of ['arithmetic','measurement','geometry','statistics']){
  const ours=englandY34TopicLessons(grade,topic);
  const routed=mathCountryCourseEntries({
   country:'GB-ENG',stage:'primary',grade,phase:grade==='Y3'?3:4,topic
  });
  assert.ok(ours.length>=3,grade+' missing source topic '+topic);
  assert.deepEqual(routed,ours,grade+' '+topic+' must not show extra generic lessons');
  total+=routed.length;
 }
 const check=englandY34Crosswalk(grade);
 assert.equal(check.lessonCount,minimum);
 assert.equal(check.complete,false);
 assert.equal(check.units.length,4);
}
assert.equal(total,56);
assert.ok(ENGLAND_Y34_LESSONS.Y3.some(x=>x.title==='Zecimi dintr-un întreg'));
assert.ok(ENGLAND_Y34_LESSONS.Y4.some(x=>x.title==='Numere negative și trecerea prin zero'));
assert.ok(!ENGLAND_Y34_LESSONS.Y3.some(x=>x.title==='Numere negative și trecerea prin zero'));
assert.ok(ENGLAND_Y34_LESSONS.Y4.some(x=>x.title==='Coordonate în primul cadran'));
assert.ok(!ENGLAND_Y34_LESSONS.Y3.some(x=>x.title==='Coordonate în primul cadran'));
assert.ok(ENGLAND_Y34_LESSONS.Y3.some(x=>x.title==='Lire, pence și restul de bani'));
assert.ok(!ENGLAND_Y34_LESSONS.Y4.some(x=>x.title==='Adunarea în coloană a numerelor de trei cifre'));
for(const grade of ['Y1','Y2','Y5','Y6']){
 const list=mathCountryCourseEntries({country:'GB-ENG',stage:'primary',grade,phase:grade==='Y6'?6:1,topic:'arithmetic'});
 assert.ok(list.length>=3,grade+' untouched by new Year 3/4 routing');
}
const html=await(await app.fetch(new Request('https://england-year34-2026.test/'))).text();
const inline=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(inline);new vm.Script(inline);
assert.ok(inline.includes('const EDU_MATH_GRADE_AREAS='));
const plans=JSON.parse(inline.split('const EDU_MATH_GRADE_AREAS=')[1].split(';\n')[0]);
assert.deepEqual(plans['GB-ENG|beginner|Y3'].map(x=>x.id),
 ['arithmetic','measurement','geometry','statistics']);
assert.deepEqual(plans['GB-ENG|beginner|Y4'].map(x=>x.id),
 ['arithmetic','measurement','geometry','statistics']);
console.log('PASS 56 ORIGINAL source-aligned DfE Year 3/4 Mathematics worked chapters; four unique branches per grade; separate annual curriculum expectations, no repeated generic lesson bank, existing years intact');
