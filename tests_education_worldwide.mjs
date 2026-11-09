import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {EDUCATION_WORLDWIDE_SCHEMES,EDUCATION_WORLDWIDE_FALLBACK,worldwideSchoolYears,worldwideSchoolNotice,worldwideStudyChapters} from './education_worldwide_paths.mjs';
import {HG_GENERAL_GRADE_LESSONS} from './education_general_paths.mjs';

const html=await(await frontend.fetch(new Request('https://pocket-world-education.test/'))).text();
const code=html.match(/const HG_COUNTRY_CODES='([^']+)'\.split\(' '\)/)?.[1]||'';
const codes=code.split(' ').filter(Boolean);
assert.ok(codes.length>200,'All country codes remain in global Education country picker');
for(const country of new Set([...codes,'GB-ENG','GB-SCT','GB-WLS','GB-NIR'])){
 for(const level of ['beginner','lower','medium','advanced']){
  const years=worldwideSchoolYears(country,level);
  assert.ok(years.length>=1,country+' '+level+' has grade choices');
  assert.ok(years.every(x=>x.id&&x.ro&&x.en&&x.verifiedCurriculum===false),country+' '+level+' does not claim curriculum verification');
  assert.equal(new Set(years.map(x=>x.id)).size,years.length,country+' '+level+' grade ids unique');
  if(level==='advanced')continue;
  for(const subject of ['history','geography']){
   const first=years[0].id,last=years.at(-1).id;
   for(const grade of new Set([first,last])){
    const lessons=worldwideStudyChapters(country,subject,level,grade,country,country,HG_GENERAL_GRADE_LESSONS);
    assert.ok(lessons.length>=15,country+' '+subject+' '+level+' '+grade+' has 15+ meaningful chapters');
    assert.equal(new Set(lessons.map(x=>x[0])).size,lessons.length,country+' '+subject+' '+grade+' unique chapter ids');
    assert.ok(lessons.every(x=>x.length===4&&x.every(z=>typeof z==='string'&&z.length>0)),'Complete chapter entries');
    assert.ok(lessons.some(x=>x[0].includes('local')),'Local history/geography context supported');
   }
  }
 }
 assert.equal(worldwideSchoolNotice(country).verifiedCurriculum,false,'Never assert official curriculum for an unverified country');
}
assert.equal(worldwideSchoolYears('FR','beginner')[0].id,'CP');
assert.equal(worldwideSchoolYears('ES','lower')[0].id,'ESO1');
assert.equal(worldwideSchoolYears('IT','medium')[0].id,'S1');
assert.equal(worldwideSchoolYears('JP','lower')[0].id,'J1');
assert.equal(worldwideSchoolYears('GB-SCT','beginner').at(-1).id,'P7');
assert.equal(worldwideSchoolYears('US','beginner')[0].id,'K');
assert.equal(worldwideSchoolYears('ZZ','beginner')[0].id,'P1');
assert.equal(worldwideSchoolNotice('ZZ').schemeMapped,false);
assert.equal(worldwideSchoolNotice('FR').schemeMapped,true);
assert.ok(Object.keys(EDUCATION_WORLDWIDE_SCHEMES).length>=35);
assert.equal(EDUCATION_WORLDWIDE_FALLBACK.beginner.length,6);

const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Frontend embedded script exists');
new vm.Script(script,{filename:'education-worldwide-browser.js'});
for(const pattern of [
 /const worldwideSchoolYears=/,
 /const worldwideStudyChapters=/,
 /worldwideSchoolYears\(code,lv,moduleKey\)/,
 /worldwideStudyChapters\(country,subject,hgJourney\.level/,
 /buildHgThemeGuide\(\[topic\.id,topic\.ro,topic\.en,topic\.query/,
 /const curriculum=LIT_COUNTRIES\.find\(x=>x\[0\]===litJourney\.country\)\|\|\[litJourney\.country/
])assert.match(script,pattern,'International Education runtime support');

const {EXAM_UI_SCRIPT}=await import('./exam_ui.mjs');
const {PRACTICAL_UI_SCRIPT}=await import('./practical_ui.mjs');
assert.match(EXAM_UI_SCRIPT,/HG_COUNTRY_PICKER_DATA\.filter\(x=>x\.id!=='OTHER'\)/,'All countries available for exams');
assert.match(EXAM_UI_SCRIPT,/educationCountrySelection\.label\|\|examJourney\.country/,'Exam country not mistaken for Romania');
assert.match(PRACTICAL_UI_SCRIPT,/HG_COUNTRY_PICKER_DATA\.filter\(v=>v\.id!=='OTHER'\)/,'Practical course country list global');
assert.match(PRACTICAL_UI_SCRIPT,/educationCountrySelection\.label\|\|practicalJourney\.country/,'Practical courses country correct');
console.log('PASS worldwide Education: '+codes.length+' country codes, 4 levels, mapped grades, 15+ history/geography chapters by level, exams/practical and international labels');
