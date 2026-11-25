// Computing (Informatics) national year packs use the Literature engine: same
// schema, loader ({subject:'computing'}), renderer and shared reader. The
// Computing module opens the pack first (grade → track → chapters → lesson)
// and keeps the existing branches/chapters as fallback and as extra topics.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {literatureLoadAuthoredCatalog,literatureLoadNationalYear} from './literature_authored_pack_loader.mjs';
import {literatureNationalYearMaterial} from './literature_national_authored_material.mjs';
import {COMPUTING_NATIONAL_PACKS_SCRIPT} from './computing_national_packs.mjs';
import {COMPUTING_UI_SCRIPT} from './computing_ui.mjs';
execFileSync(process.execPath,['scripts/build_literature_national_packs.mjs','--subject=computing'],{stdio:'pipe'});
const read=p=>readFile(new URL(p,import.meta.url),'utf8');
const catalog=JSON.parse(await read('./public/education/computing/authored/catalog.json'));
assert.ok(catalog.years.length>=1);
const urls=[];
const fetcher=async url=>{urls.push(url);const path=url.replace('/education/','./public/education/');return {ok:true,json:async()=>JSON.parse(await read(path))}};
const {catalog:loaded}=await literatureLoadAuthoredCatalog({subject:'computing',storage:null,fetcher});
assert.equal(urls[0],'/education/computing/authored/catalog.json');
const allowed={lower:['5','6','7','8'],medium:['9','10','11','12','tic-9','tic-10','tic-11','tic-12'],advanced:['uni-ba-1','uni-ba-2','uni-ba-3']};
for(const entry of loaded.years){
 assert.equal(entry.country,'RO');
 assert.ok(allowed[entry.stage]?.includes(entry.grade),'RO Computing starts in grade 5; high school has Informatics and TIC tracks: '+entry.stage+' '+entry.grade);
 const pack=await literatureLoadNationalYear(entry,'ro',{subject:'computing',storage:null,fetcher});
 assert.ok(urls.at(-1).startsWith('/education/computing/authored/RO/'));
 assert.ok(pack.units.length>=2&&Object.keys(pack.chapters).length>=24);
 assert.match(pack.labels[0],/Informatic|TIC/);
 for(const key of Object.keys(pack.chapters)){
  const row=pack.chapters[key].ro;
  assert.ok(row.steps.at(-1).startsWith('Greșeala frecventă'));
  const m=literatureNationalYearMaterial({pack,country:'RO',stage:entry.stage,grade:entry.grade,topicKey:key,mode:'test'});
  assert.ok(m.text.includes(row.answers[4]),'test shows answers');
 }
}
const index=await read('./index.js');
assert.match(index,/\$\{COMPUTING_NATIONAL_PACKS_SCRIPT\}\n\$\{COMPUTING_UI_SCRIPT\}/);
assert.match(COMPUTING_UI_SCRIPT,/computingWithNational\(\(\)=>computingOpen\('paths'\)\)/,'grade opens the national pack first, generic branches as fallback');
for(const stage of ['national-tracks','national-chapters','national-lesson'])assert.ok(COMPUTING_UI_SCRIPT.includes("stage==='"+stage+"'"));
assert.match(COMPUTING_UI_SCRIPT,/stage==='paths'\)computingOpen\(COMPUTING_NATIONAL\.pack\?'national-chapters':'levels'\)/);
for(const name of ['computingWithNational','computingOpenNationalYear','computingRenderNationalTracks','computingRenderNationalChapters','computingRenderNationalLesson'])
 assert.ok(COMPUTING_NATIONAL_PACKS_SCRIPT.includes('function '+name+'('));
assert.match(COMPUTING_NATIONAL_PACKS_SCRIPT,/literatureLoadAuthoredCatalog\(\{subject:'computing'\}\)/);
assert.match(COMPUTING_NATIONAL_PACKS_SCRIPT,/litShowMaterialReader\(row\.title,material\.text\)/,'shared reader');
new Function(COMPUTING_NATIONAL_PACKS_SCRIPT);
console.log('PASS Computing national packs:',loaded.years.map(y=>y.grade).join(', '),'— Literature engine, shared reader, generic branches kept');
