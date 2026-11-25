#!/usr/bin/env node
// National Literature year packs: public/education/literature/authored/<CC>/<lang>-<year>.json
// The JSON packs are the only source of truth for their lesson text. This script
// validates them against the years/chapters really offered by the selector,
// computes content versions and generates the catalog.
//   node scripts/build_literature_national_packs.mjs          -> verify only (CI)
//   node scripts/build_literature_national_packs.mjs --write  -> set versions + catalog
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {expandLiteratureEuropeanGrades,LITERATURE_50_COUNTRIES} from '../literature_europe_grade_expansion.mjs';
import {worldwideSchoolYears} from '../education_worldwide_paths.mjs';
import {literatureLoadAuthoredCatalog,literatureLoadNationalYear} from '../literature_authored_pack_loader.mjs';
import {literatureNationalYearMaterial} from '../literature_national_authored_material.mjs';

export const NATIONAL_PACK_PARTS=['parcurs','intelegere','narativ','poezie','dialog','vocabular','exprimare','redactare','interpretare','verificare'];
// Native names shown in the language-of-instruction choice.
export const NATIONAL_PACK_LANGUAGE_NAMES={
 be:'Беларуская',bg:'Български',bs:'Bosanski',ca:'Català',cnr:'Crnogorski',cs:'Čeština',cy:'Cymraeg',da:'Dansk',de:'Deutsch',
 el:'Ελληνικά',en:'English',es:'Español',et:'Eesti',eu:'Euskara',fi:'Suomi',fr:'Français',ga:'Gaeilge',gd:'Gàidhlig',gl:'Galego',
 hr:'Hrvatski',hu:'Magyar',is:'Íslenska',it:'Italiano',lb:'Lëtzebuergesch',lt:'Lietuvių',lv:'Latviešu',mk:'Македонски',mt:'Malti',
 nb:'Norsk bokmål',nl:'Nederlands',nn:'Norsk nynorsk',pl:'Polski',pt:'Português',rm:'Rumantsch',ro:'Română',ru:'Русский',
 sk:'Slovenčina',sl:'Slovenščina',sq:'Shqip',sr:'Српски',sv:'Svenska',tr:'Türkçe',uk:'Українська'
};
// Years displayed by the Literature selector (index.js litOpen('grades')).
const KNOWN={'RO':{beginner:['1','2','3','4'],lower:['5','6','7','8'],medium:['9','10','11','12']},
 'GB-ENG':{beginner:['Y1','Y2','Y3','Y4','Y5','Y6'],lower:['Y7','Y8','Y9'],medium:['Y10','Y11','Y12','Y13']},
 'FR':{beginner:['CP','CE1','CE2','CM1','CM2'],lower:['6e','5e','4e','3e'],medium:['2nde','1re','terminale']}};
export function displayedYears(country,stage){
 return KNOWN[country]?.[stage]||worldwideSchoolYears(country,stage,'literature').map(x=>String(x.id));
}
export const slugOf=grade=>String(grade).toLowerCase().replace(/[^a-z0-9-]/g,'-');
export const packVersion=pack=>createHash('sha256').update(JSON.stringify([pack.labels||null,pack.chapters])).digest('hex');

const root=fileURLToPath(new URL('../public/education/literature/',import.meta.url));
const authoredRoot=root+'authored/';

async function programs(){
 const result={};
 for(const c of LITERATURE_50_COUNTRIES){
  const raw=JSON.parse(await readFile(root+'profiles/'+c+'.json','utf8'));
  result[c]=raw.profile?structuredClone(raw.profile):null;
 }
 expandLiteratureEuropeanGrades(result);
 return result;
}

export async function collectNationalPacks(){
 const progs=await programs();
 const errors=[],packs=[];
 for(const country of (await readdir(authoredRoot,{withFileTypes:true})).filter(d=>d.isDirectory()).map(d=>d.name).sort()){
  for(const file of (await readdir(authoredRoot+country)).filter(f=>/^[a-z]{2,3}-[a-z0-9-]+\.json$/.test(f)).sort()){
   const where=country+'/'+file;
   const fail=m=>errors.push(where+': '+m);
   let pack;try{pack=JSON.parse(await readFile(authoredRoot+country+'/'+file,'utf8'))}catch(e){fail('invalid JSON '+e.message);continue}
   const lang=file.split('-')[0],slug=file.slice(lang.length+1,-5);
   if(pack.schema!=='mypocket-literature-authored/v2')fail('schema');
   if(pack.country!==country)fail('country mismatch');
   if(pack.sourceLanguage!==lang)fail('sourceLanguage must equal file prefix '+lang);
   if(!NATIONAL_PACK_LANGUAGE_NAMES[lang])fail('language name missing for '+lang);
   if(!['beginner','lower','medium'].includes(pack.stage))fail('stage');
   if(slugOf(pack.grade)!==slug)fail('grade/file mismatch');
   if(!displayedYears(country,pack.stage).includes(pack.grade))fail('year '+pack.grade+' is not offered by the selector');
   if(!(typeof pack.status==='string'&&/review-pending|reviewed/.test(pack.status)))fail('status must state review state');
   if(!(typeof pack.source==='string'&&/^https:\/\//.test(pack.source)&&typeof pack.sourceTitle==='string'&&pack.sourceTitle.trim()))fail('official framework source/sourceTitle');
   if(!(Array.isArray(pack.labels)&&pack.labels.length===7&&pack.labels.every(x=>typeof x==='string'&&x.trim())))fail('7 labels');
   const offered=new Set((progs[country]?.byGrade?.[pack.grade]||[]).map(r=>String(r[0])));
   const prefix='eu-year-'+country.toLowerCase()+'-'+pack.stage+'-'+slug+'-';
   const keys=Object.keys(pack.chapters||{});
   if(keys.length!==NATIONAL_PACK_PARTS.length)fail('expected 10 chapters, found '+keys.length);
   const samples=new Set(),titles=new Set();
   for(const part of NATIONAL_PACK_PARTS){
    const key=prefix+part,record=pack.chapters?.[key];
    if(!record){fail('missing chapter '+part);continue}
    if(!offered.has(key))fail('chapter not offered by selector: '+key);
    const row=record[lang];
    if(!row||Object.keys(record).length!==1){fail(part+': exactly one source language');continue}
    for(const f of ['title','theory','sample','worked'])if(!(typeof row[f]==='string'&&row[f].trim().length>=(f==='title'?4:f==='sample'?20:60)))fail(part+'.'+f+' too short');
    for(const f of ['exercises','test'])if(!(Array.isArray(row[f])&&row[f].length===5&&row[f].every(q=>typeof q==='string'&&q.trim().length>=8)))fail(part+'.'+f+' needs 5 items');
    if(samples.has(row.sample))fail(part+': duplicated sample');samples.add(row.sample);
    if(titles.has(row.title))fail(part+': duplicated title');titles.add(row.title);
    if(new Set([...(row.exercises||[]),...(row.test||[])]).size!==10)fail(part+': repeated question');
   }
   packs.push({country,file:file.slice(0,-5),lang,pack});
  }
 }
 return {packs,errors};
}

export function buildCatalog(packs){
 const years=new Map();
 for(const {country,file,lang,pack} of packs){
  const id=country+'|'+pack.stage+'|'+pack.grade;
  if(!years.has(id))years.set(id,{country,stage:pack.stage,grade:pack.grade,languages:[]});
  years.get(id).languages.push({lang,name:NATIONAL_PACK_LANGUAGE_NAMES[lang],file,version:packVersion(pack)});
 }
 const list=[...years.values()].sort((a,b)=>a.country.localeCompare(b.country)||a.stage.localeCompare(b.stage)||
  displayedYears(a.country,a.stage).indexOf(a.grade)-displayedYears(b.country,b.stage).indexOf(b.grade));
 return {schema:'mypocket-literature-authored-catalog/v1',version:createHash('sha256').update(JSON.stringify(list)).digest('hex'),years:list};
}

const isMain=process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1];
if(isMain){
 const write=process.argv.includes('--write');
 const {packs,errors}=await collectNationalPacks();
 if(errors.length){console.error(errors.join('\n'));process.exit(1)}
 const catalogPath=authoredRoot+'catalog.json';
 for(const item of packs){
  const v=packVersion(item.pack);
  if(item.pack.version!==v){
   if(!write){console.error('Stale version: '+item.country+'/'+item.file+' (run --write)');process.exit(1)}
   item.pack.version=v;
   await writeFile(authoredRoot+item.country+'/'+item.file+'.json',JSON.stringify(item.pack,null,1)+'\n');
  }
 }
 const catalog=buildCatalog(packs);
 const current=existsSync(catalogPath)?await readFile(catalogPath,'utf8'):'';
 const next=JSON.stringify(catalog,null,1)+'\n';
 if(current!==next){
  if(!write){console.error('Stale catalog.json (run --write)');process.exit(1)}
  await writeFile(catalogPath,next);
 }
 // Round-trip through the exact browser loaders and renderer.
 const {catalog:loaded}=await literatureLoadAuthoredCatalog({storage:null,fetcher:async()=>({ok:true,json:async()=>catalog})});
 for(const entry of loaded.years)for(const l of entry.languages){
  const item=packs.find(p=>p.country===entry.country&&p.file===l.file);
  const pack=await literatureLoadNationalYear(entry,l.lang,{storage:null,fetcher:async()=>({ok:true,json:async()=>item.pack})});
  for(const part of NATIONAL_PACK_PARTS)for(const mode of ['lesson','examples','exercises','test']){
   const m=literatureNationalYearMaterial({pack,country:entry.country,stage:entry.stage,grade:entry.grade,
    topicKey:'eu-year-'+entry.country.toLowerCase()+'-'+entry.stage+'-'+slugOf(entry.grade)+'-'+part,mode});
   if(!m||m.sourceLanguage!==l.lang||!m.text.includes(pack.chapters[Object.keys(pack.chapters).find(k=>k.endsWith('-'+part))][l.lang].sample))
    throw Error('Render failed '+entry.country+' '+entry.grade+' '+l.lang+' '+part+' '+mode);
  }
 }
 const langs=new Set(packs.map(p=>p.country+':'+p.lang));
 console.log('Verified '+packs.length+' national Literature packs ('+packs.length*10+' lessons), '+catalog.years.length+' years, '+
  new Set(packs.map(p=>p.country)).size+' systems, '+langs.size+' country-languages'+(write?' — written':''));
}
