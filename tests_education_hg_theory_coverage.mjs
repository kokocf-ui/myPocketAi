import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {HG_SCHOOL_PLANS} from './education_school_paths.mjs';
import {HG_LOCAL_GUIDES} from './education_hg_lessons.mjs';
import {HG_THEME_DATA,buildHgThemeGuide,expandHgLessonGuides} from './education_hg_theme_guides.mjs';

assert.ok(HG_THEME_DATA.length>=30,'Enough subject-specific theory anchors');
const draft={...HG_LOCAL_GUIDES};
const originals=Object.fromEntries(Object.entries(HG_LOCAL_GUIDES).map(([k,v])=>[k,JSON.stringify(v)]));
const coverage=expandHgLessonGuides(HG_SCHOOL_PLANS,draft);
assert.equal(coverage.generated,497,'Only the 497 chapters without existing original guides are expanded');
let total=0;
for(const country of ['RO','GB-ENG'])for(const subject of ['history','geography']){
 for(const [year,rows] of Object.entries(HG_SCHOOL_PLANS[country][subject])){
  assert.ok(rows.length>=10,country+' '+subject+' '+year+' should have at least ten chapters');
  for(const row of rows){
   total++;
   const lesson=draft[row[0]];
   assert.ok(lesson&&lesson.length>=3,row[0]+' has an offline study guide');
   assert.ok(lesson.every(x=>x.length===4&&x.every(v=>typeof v==='string'&&v.length>0)),row[0]+' is bilingual');
   assert.equal(new Set(lesson.map(x=>x[0])).size,lesson.length,row[0]+' headings are unique');
   if(!originals[row[0]])assert.ok(lesson.some(x=>x[0].startsWith('Teorie:')),row[0]+' must contain explained theory');
  }
 }
}
assert.equal(total,512,'All 512 school-year topics tested');
for(const [id,raw] of Object.entries(originals))assert.equal(JSON.stringify(draft[id]),raw,id+' original guide retained');
const roman=buildHgThemeGuide(['ro5-romans','Roma antică, geto-dacii și romanizarea','Rome, Dacians and romanisation',''], 'history','5','RO');
assert.match(roman.map(x=>x[2]).join(' '),/Traian|Dacia/);
const weather=buildHgThemeGuide(['eng-geography-y9-sub1','Schimbări climatice','Climate change',''], 'geography','Y9','GB-ENG');
assert.match(weather.map(x=>x[3]).join(' '),/climate|Weather|Earth/i);
const html=await(await app.fetch(new Request('https://education-coverage.test/'))).text();
const source=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source,'HTML embeds full script');
new vm.Script(source,{filename:'hg-theory.js'});
assert.match(source,/function hgLessonSections\(topic\)/);
assert.match(source,/buildHgThemeGuide\(\[topic.id,topic.ro,topic.en,topic.query/);
assert.match(source,/const HG_THEME_DATA=/);
assert.ok(html.length<6000000,'Lazy theory expansion avoids excessive initial HTML');
console.log('PASS: 512 history/geography study topics; 497 newly expanded offline lessons, no title duplicates, lightweight UI');
