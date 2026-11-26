// Mathematics national year packs use the Literature engine: same schema,
// loader ({subject:'math'}), renderer and shared reader. Romania: primary
// 1-4 (Matematică și explorarea mediului I-II, Matematică III-IV), high
// school 9-12 mathematics-informatics, university Licență I-III (selector
// years 1..3 -> uni-ba-1..3). Grades 5-8 and 9-SCI keep their existing course.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {literatureLoadAuthoredCatalog,literatureLoadNationalYear} from './literature_authored_pack_loader.mjs';
import {literatureNationalYearMaterial} from './literature_national_authored_material.mjs';
import {MATH_NATIONAL_PACKS_SCRIPT} from './math_national_packs.mjs';
import {mathCountryStudyYears} from './math_country_grade_areas.mjs';
execFileSync(process.execPath,['scripts/build_literature_national_packs.mjs','--subject=math'],{stdio:'pipe'});
const read=p=>readFile(new URL(p,import.meta.url),'utf8');
const catalog=JSON.parse(await read('./public/education/math/authored/catalog.json'));
assert.ok(catalog.years.length>=1);
const urls=[];
const fetcher=async url=>{urls.push(url);const path=url.replace('/education/','./public/education/');return {ok:true,json:async()=>JSON.parse(await read(path))}};
const {catalog:loaded}=await literatureLoadAuthoredCatalog({subject:'math',storage:null,fetcher});
assert.equal(urls[0],'/education/math/authored/catalog.json');
const allowed={beginner:['1','2','3','4'],medium:['9','10','11','12'],advanced:['uni-ba-1','uni-ba-2','uni-ba-3']};
let lessons=0;
for(const entry of loaded.years){
 assert.equal(entry.country,'RO');
 assert.ok(allowed[entry.stage]?.includes(entry.grade),'RO Math packs: primary, mate-info high school, Licență: '+entry.stage+' '+entry.grade);
 const pack=await literatureLoadNationalYear(entry,'ro',{subject:'math',storage:null,fetcher});
 assert.ok(urls.at(-1).startsWith('/education/math/authored/RO/'));
 assert.ok(pack.units.length>=2&&Object.keys(pack.chapters).length>=30,'about 30-36 lessons per year: '+entry.grade);
 assert.match(pack.labels[0],/Matematic/);
 for(const key of Object.keys(pack.chapters)){
  const row=pack.chapters[key].ro;lessons++;
  assert.ok(row.steps.at(-1).startsWith('Greșeala frecventă'),'last step is the common mistake: '+row.title);
  const m=literatureNationalYearMaterial({pack,country:'RO',stage:entry.stage,grade:entry.grade,topicKey:key,mode:'test'});
  assert.ok(m.text.includes(row.answers[4]),'test shows answers');
  const l=literatureNationalYearMaterial({pack,country:'RO',stage:entry.stage,grade:entry.grade,topicKey:key,mode:'lesson'});
  assert.ok(l.text.includes(row.steps[0]),'lesson shows the step-by-step explanation');
 }
}
const index=await read('./index.js');
assert.match(index,/\$\{EDUCATION_NATIONAL_SUBJECT_PACKS_SCRIPT\}\n\$\{MATH_NATIONAL_PACKS_SCRIPT\}\n/);
assert.match(index,/\(stage==='branches'\|\|stage==='national-lesson'\)&&typeof mathNationalRender==='function'&&mathNationalRender\(stage,host\)/,'year opens the national pack first, generic branches as fallback');
assert.match(index,/if\(stage==='national-lesson'\)return mathJourneyShowChoices\('branches'\)/,'Back from a lesson returns to the lesson list');
for(const name of ['mathNationalKey','mathNationalLabel','mathNationalButton','mathNationalRender'])
 assert.ok(MATH_NATIONAL_PACKS_SCRIPT.includes('var '+name+'=function '+name+'('),'bundler-safe var emission: '+name);
assert.match(MATH_NATIONAL_PACKS_SCRIPT,/literatureLoadAuthoredCatalog\(\{subject:'math'\}\)/);
assert.match(MATH_NATIONAL_PACKS_SCRIPT,/eduNationalShowMaterial\(row\.title,material\.text,out,pack\.language\)/,'shared reader');
assert.match(MATH_NATIONAL_PACKS_SCRIPT,/'uni-ba-'\+raw/,'university selector years map to uni-ba packs');
new Function(MATH_NATIONAL_PACKS_SCRIPT);
const uni=mathCountryStudyYears({country:'RO',stage:'advanced'});
assert.deepEqual(uni.map(y=>y.id),['1','2','3']);
assert.match(uni[0].ro,/Licență Matematică · anul I$/);
const medium=mathCountryStudyYears({country:'RO',stage:'medium',years:['9','10','11','12'].map(id=>({id}))});
assert.ok(medium.some(y=>y.id==='9'&&/Matematică-informatică/.test(y.ro))&&medium.some(y=>y.id==='9-SCI'),'grade 9: mate-info pack + science track kept');
console.log('PASS Math national packs:',loaded.years.map(y=>y.grade).join(', '),'('+lessons+' lessons) — Literature engine, shared reader, generic branches kept');
