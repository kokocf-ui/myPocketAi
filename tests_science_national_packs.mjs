// Physics / Chemistry / Biology national year packs use the Literature engine:
// same schema, loader ({subject}), renderer and shared reader. They draw the
// Sciences "topics" screen of a year; years without a pack keep the existing
// chapters. Romania: Biology primary = Științe ale naturii III–IV (grades I–II
// are covered by Matematică și explorarea mediului in the Math packs).
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {literatureLoadAuthoredCatalog,literatureLoadNationalYear} from './literature_authored_pack_loader.mjs';
import {literatureNationalYearMaterial} from './literature_national_authored_material.mjs';
import {SCIENCE_NATIONAL_PACKS_SCRIPT} from './science_national_packs.mjs';
const read=p=>readFile(new URL(p,import.meta.url),'utf8');
const exists=p=>access(new URL(p,import.meta.url)).then(()=>true,()=>false);
const allowed={
 physics:{lower:['6','7','8'],medium:['9','10','11','12']},
 chemistry:{lower:['7','8'],medium:['9','10','11','12']},
 biology:{beginner:['3','4'],lower:['5','6','7','8'],medium:['9','10','11','12']}
};
const summary=[];let lessons=0;
for(const subject of Object.keys(allowed)){
 if(!await exists('./public/education/'+subject+'/authored/catalog.json'))continue;
 execFileSync(process.execPath,['scripts/build_literature_national_packs.mjs','--subject='+subject],{stdio:'pipe'});
 const urls=[];
 const fetcher=async url=>{urls.push(url);const path=url.replace('/education/','./public/education/');return {ok:true,json:async()=>JSON.parse(await read(path))}};
 const {catalog}=await literatureLoadAuthoredCatalog({subject,storage:null,fetcher});
 assert.equal(urls[0],'/education/'+subject+'/authored/catalog.json');
 for(const entry of catalog.years){
  assert.equal(entry.country,'RO');
  assert.ok(allowed[subject][entry.stage]?.includes(entry.grade),subject+': unexpected year '+entry.stage+' '+entry.grade);
  const pack=await literatureLoadNationalYear(entry,'ro',{subject,storage:null,fetcher});
  assert.ok(urls.at(-1).startsWith('/education/'+subject+'/authored/RO/'));
  assert.ok(pack.units.length>=2&&Object.keys(pack.chapters).length>=30,'about 30-36 lessons per year: '+subject+' '+entry.grade);
  if(subject==='biology'&&entry.stage==='beginner')assert.match(pack.labels[0],/Științe ale naturii/);
  for(const key of Object.keys(pack.chapters)){
   const row=pack.chapters[key].ro;lessons++;
   assert.ok(row.steps.at(-1).startsWith('Greșeala frecventă'),'last step is the common mistake: '+row.title);
   const m=literatureNationalYearMaterial({pack,country:'RO',stage:entry.stage,grade:entry.grade,topicKey:key,mode:'test'});
   assert.ok(m.text.includes(row.answers[4]),'test shows answers');
   const l=literatureNationalYearMaterial({pack,country:'RO',stage:entry.stage,grade:entry.grade,topicKey:key,mode:'lesson'});
   assert.ok(l.text.includes(row.steps[0]),'lesson shows the step-by-step explanation');
  }
  summary.push(subject+' '+entry.grade);
 }
}
assert.ok(summary.includes('biology 3')&&summary.includes('biology 4'),'Științe ale naturii III–IV published');
const index=await read('./index.js');
assert.match(index,/\$\{MATH_NATIONAL_PACKS_SCRIPT\}\n\$\{SCIENCE_NATIONAL_PACKS_SCRIPT\}\n/);
assert.match(index,/\(stage==='topics'\|\|stage==='national-lesson'\)&&typeof scienceNationalRender==='function'&&scienceNationalRender\(stage,host\)/,'year opens the national pack first, generic chapters as fallback');
assert.match(index,/else if\(current==='national-lesson'\)scienceJourney\.stage='topics';/,'Back from a lesson returns to the lesson list');
assert.match(index,/country==='RO'&&band\.schoolStage==='primary'&&scienceJourney\.subject==='biology'\)\n\s*years=years\.filter\(entry=>\['3','4'\]\.includes/,'RO Biology primary shows only grades III–IV');
for(const name of ['scienceNationalKey','scienceNationalLabel','scienceNationalButton','scienceNationalRender'])
 assert.ok(SCIENCE_NATIONAL_PACKS_SCRIPT.includes('var '+name+'=function '+name+'('),'bundler-safe var emission: '+name);
assert.match(SCIENCE_NATIONAL_PACKS_SCRIPT,/literatureLoadAuthoredCatalog\(\{subject:key\.subject\}\)/);
assert.match(SCIENCE_NATIONAL_PACKS_SCRIPT,/eduNationalShowMaterial\(row\.title,material\.text,out,pack\.language\)/,'shared reader');
assert.ok(!/mathJourney|MATH_NATIONAL/.test(SCIENCE_NATIONAL_PACKS_SCRIPT),'no Math state leaks into Sciences');
new Function(SCIENCE_NATIONAL_PACKS_SCRIPT);
console.log('PASS Science national packs:',summary.join(', '),'('+lessons+' lessons) — Literature engine, shared reader, generic chapters kept');
