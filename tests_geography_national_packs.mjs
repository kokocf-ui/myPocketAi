// Geography national year packs use the Literature engine: same schema, loader
// ({subject:'geography'}), renderer and shared reader; HG chapters/lesson stages
// switch to the pack only when one exists for the selected country and year.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {literatureLoadAuthoredCatalog,literatureLoadNationalYear} from './literature_authored_pack_loader.mjs';
import {literatureNationalYearMaterial} from './literature_national_authored_material.mjs';
import {EDUCATION_NATIONAL_SUBJECT_PACKS_SCRIPT} from './education_national_subject_packs.mjs';
execFileSync(process.execPath,['scripts/build_literature_national_packs.mjs','--subject=geography'],{stdio:'pipe'});
const read=p=>readFile(new URL(p,import.meta.url),'utf8');
const catalog=JSON.parse(await read('./public/education/geography/authored/catalog.json'));
assert.ok(catalog.years.length>=1);
const urls=[];
const fetcher=async url=>{urls.push(url);const path=url.replace('/education/','./public/education/');return {ok:true,json:async()=>JSON.parse(await read(path))}};
const {catalog:loaded}=await literatureLoadAuthoredCatalog({subject:'geography',storage:null,fetcher});
assert.equal(urls[0],'/education/geography/authored/catalog.json');
for(const entry of loaded.years){
 assert.equal(entry.country,'RO');
 if(entry.stage==='beginner')assert.equal(entry.grade,'4','RO Geography starts in grade 4');
 const pack=await literatureLoadNationalYear(entry,'ro',{subject:'geography',storage:null,fetcher});
 assert.ok(urls.at(-1).startsWith('/education/geography/authored/RO/'));
 assert.ok(pack.units.length>=2&&Object.keys(pack.chapters).length>=24);
 assert.match(pack.labels[0],/Geografie/);
 for(const key of Object.keys(pack.chapters)){
  const row=pack.chapters[key].ro;
  assert.ok(row.steps.at(-1).startsWith('Greșeala frecventă'));
  const m=literatureNationalYearMaterial({pack,country:'RO',stage:entry.stage,grade:entry.grade,topicKey:key,mode:'test'});
  assert.ok(m.text.includes(row.answers[4]),'test shows answers');
 }
}
// Literature keeps its own path and storage keys.
const litUrls=[];
await literatureLoadAuthoredCatalog({storage:null,fetcher:async u=>{litUrls.push(u);return {ok:true,json:async()=>JSON.parse(await read('./public/education/literature/authored/catalog.json'))}}});
assert.equal(litUrls[0],'/education/literature/authored/catalog.json');
const index=await read('./index.js');
assert.match(index,/\$\{EDUCATION_NATIONAL_SUBJECT_PACKS_SCRIPT\}/);
assert.match(index,/hgWithNationalYear\(\(\)=>hgOpen\('chapters'\),general\)/,'year tile opens the national pack first');
assert.match(index,/hgRenderNationalChapters\(panel\)/);
assert.match(index,/hgRenderNationalLesson\(panel\)\)\)hgLesson\(panel\)/,'existing lessons stay as fallback');
for(const name of ['hgNationalPackActive','hgWithNationalYear','hgRenderNationalChapters','hgRenderNationalLesson'])
 assert.ok(EDUCATION_NATIONAL_SUBJECT_PACKS_SCRIPT.includes('function '+name+'('));
new Function(EDUCATION_NATIONAL_SUBJECT_PACKS_SCRIPT);
console.log('PASS Geography national packs:',loaded.years.map(y=>y.grade).join(', '),'— Literature engine, shared reader, generic fallback kept');
