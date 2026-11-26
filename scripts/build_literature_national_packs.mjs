#!/usr/bin/env node
// National Literature year packs: public/education/literature/authored/<CC>/<lang>-<year>.json
// The JSON packs are the only source of truth for their lesson text. This script
// validates them against the years/chapters really offered by the selector,
// computes content versions and generates the catalog.
//   node scripts/build_literature_national_packs.mjs          -> verify only (CI)
//   node scripts/build_literature_national_packs.mjs --write  -> set versions + catalog
// Same engine for History/Geography/Computing: add --subject=history (or geography, computing);
// packs then live in public/education/<subject>/authored/.
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
// RO university (Faculty of Letters, Licență I–III) uses the study-year ids
// of the university selector (literature_university_years.mjs).
export const SUBJECT=(process.argv.find(a=>a.startsWith('--subject='))||'').slice(10)||'literature';
if(!['literature','history','geography','computing','math'].includes(SUBJECT))throw Error('unknown subject '+SUBJECT);
// Years displayed by the History/Geography selector (index.js hgYearGroups):
// in Romania History starts in grade 4.
const SUBJECT_KNOWN={history:{'RO':{beginner:['4'],lower:['5','6','7','8'],medium:['9','10','11','12'],advanced:['uni-ba-1','uni-ba-2','uni-ba-3']}},
 geography:{'RO':{beginner:['4'],lower:['5','6','7','8'],medium:['9','10','11','12'],advanced:['uni-ba-1','uni-ba-2','uni-ba-3']}},
 // Computing (Informatics): RO from grade 5 (Informatică și TIC); high school has
 // two national tracks per year: mate-info intensive Informatics (9..12) and
 // TIC for the other profiles (tic-9..tic-12); university = Licență I–III.
 computing:{'RO':{lower:['5','6','7','8'],medium:['9','10','11','12','tic-9','tic-10','tic-11','tic-12'],advanced:['uni-ba-1','uni-ba-2','uni-ba-3']}},
 // Mathematics: RO primary 1-4, high school 9-12 (mathematics-informatics;
 // 9-SCI keeps its own course), university Licență I-III (selector years
 // 1..3 are mapped to uni-ba-1..3 by math_national_packs.mjs). Grades 5-8
 // keep the existing programme-aligned course and need no pack.
 math:{'RO':{beginner:['1','2','3','4'],medium:['9','10','11','12'],advanced:['uni-ba-1','uni-ba-2','uni-ba-3']}}};
const LITERATURE_KNOWN={'RO':{beginner:['1','2','3','4'],lower:['5','6','7','8'],medium:['9','10','11','12'],advanced:['uni-ba-1','uni-ba-2','uni-ba-3']},
 'GB-ENG':{beginner:['Y1','Y2','Y3','Y4','Y5','Y6'],lower:['Y7','Y8','Y9'],medium:['Y10','Y11','Y12','Y13']},
 'FR':{beginner:['CP','CE1','CE2','CM1','CM2'],lower:['6e','5e','4e','3e'],medium:['2nde','1re','terminale']}};
const KNOWN=SUBJECT==='literature'?LITERATURE_KNOWN:SUBJECT_KNOWN[SUBJECT];
export function displayedYears(country,stage){
 return KNOWN[country]?.[stage]||worldwideSchoolYears(country,stage,SUBJECT==='literature'?'literature':'history').map(x=>String(x.id));
}
export const slugOf=grade=>String(grade).toLowerCase().replace(/[^a-z0-9-]/g,'-');
export const packVersion=pack=>createHash('sha256').update(JSON.stringify(pack.units?[pack.labels||null,pack.chapters,pack.units]:[pack.labels||null,pack.chapters])).digest('hex');
// Textbook-sequence packs: one lesson per textbook unit/week, grouped by unit.
export const TEXTBOOK_PACK_MIN_LESSONS=24,TEXTBOOK_PACK_MAX_LESSONS=40;
export const packLessonKeys=pack=>Object.keys(pack.chapters||{});

const root=fileURLToPath(new URL('../public/education/'+SUBJECT+'/',import.meta.url));
const authoredRoot=root+'authored/';

async function programs(){
 const result={};
 if(SUBJECT!=='literature')return result;
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
   if(!['beginner','lower','medium','advanced'].includes(pack.stage))fail('stage');
   if(pack.stage==='advanced'&&!(KNOWN[country]?.advanced||[]).includes(pack.grade))fail('university years need an explicit study-year list');
   if(slugOf(pack.grade)!==slug)fail('grade/file mismatch');
   if(!displayedYears(country,pack.stage).includes(pack.grade))fail('year '+pack.grade+' is not offered by the selector');
   if(!(typeof pack.status==='string'&&/review-pending|reviewed/.test(pack.status)))fail('status must state review state');
   if(!(typeof pack.source==='string'&&/^https:\/\//.test(pack.source)&&typeof pack.sourceTitle==='string'&&pack.sourceTitle.trim()))fail('official framework source/sourceTitle');
   if(!(Array.isArray(pack.labels)&&(pack.labels.length===7||pack.labels.length===9)&&pack.labels.every(x=>typeof x==='string'&&x.trim())))fail('7 or 9 labels');
   // Tutor packs (9 labels): every lesson explains step by step, in plain
   // words with common mistakes, and gives answers to check the test.
   const tutor=pack.labels?.length===9;
   if(pack.units!==undefined&&!tutor)fail('textbook-sequence packs need the tutor sections (9 labels: steps + answers)');
   const offered=new Set((progs[country]?.byGrade?.[pack.grade]||[]).map(r=>String(r[0])));
   const prefix='eu-year-'+country.toLowerCase()+'-'+pack.stage+'-'+slug+'-';
   const keys=Object.keys(pack.chapters||{});
   const textbook=pack.units!==undefined;
   let parts=NATIONAL_PACK_PARTS;
   if(textbook){
    // Lessons follow the official programme/textbook sequence; the selector
    // takes them from the pack, so they need not exist in the profile.
    if(!(keys.length>=TEXTBOOK_PACK_MIN_LESSONS&&keys.length<=TEXTBOOK_PACK_MAX_LESSONS))fail('textbook pack needs '+TEXTBOOK_PACK_MIN_LESSONS+'-'+TEXTBOOK_PACK_MAX_LESSONS+' lessons, found '+keys.length);
    parts=keys.map(k=>k.slice(prefix.length));
    if(!keys.every((k,i)=>k===prefix+'l'+String(i+1).padStart(2,'0')))fail('textbook lesson keys must be '+prefix+'l01.. in order');
    if(!(Array.isArray(pack.units)&&pack.units.length>=2&&pack.units.every(u=>u&&typeof u.title==='string'&&u.title.trim().length>=4&&Array.isArray(u.keys)&&u.keys.length)))fail('units');
    else if(pack.units.flatMap(u=>u.keys).join('|')!==keys.join('|'))fail('units must cover every lesson once, in order');
    if(new Set((pack.units||[]).map(u=>u.title)).size!==(pack.units||[]).length)fail('duplicated unit title');
   }else if(keys.length!==NATIONAL_PACK_PARTS.length)fail('expected 10 chapters, found '+keys.length);
   const samples=new Set(),titles=new Set();
   for(const part of parts){
    const key=prefix+part,record=pack.chapters?.[key];
    if(!record){fail('missing chapter '+part);continue}
    if(!textbook&&!offered.has(key))fail('chapter not offered by selector: '+key);
    const row=record[lang];
    if(!row||Object.keys(record).length!==1){fail(part+': exactly one source language');continue}
    for(const f of ['title','theory','sample','worked'])if(!(typeof row[f]==='string'&&row[f].trim().length>=(f==='title'?4:f==='sample'?20:60)))fail(part+'.'+f+' too short');
    for(const f of ['exercises','test'])if(!(Array.isArray(row[f])&&row[f].length===5&&row[f].every(q=>typeof q==='string'&&q.trim().length>=8)))fail(part+'.'+f+' needs 5 items');
    if(samples.has(row.sample))fail(part+': duplicated sample');samples.add(row.sample);
    if(titles.has(row.title))fail(part+': duplicated title');titles.add(row.title);
    if(new Set([...(row.exercises||[]),...(row.test||[])]).size!==10)fail(part+': repeated question');
    if(tutor){
     if(!(Array.isArray(row.steps)&&row.steps.length>=3&&row.steps.length<=7&&row.steps.every(x=>typeof x==='string'&&x.trim().length>=20)))fail(part+': steps need 3-7 plain explanations');
     if(!(Array.isArray(row.answers)&&row.answers.length===5&&row.answers.every(x=>typeof x==='string'&&x.trim().length>=1)))fail(part+': answers need 5 items');
    }else if(row.steps!==undefined||row.answers!==undefined)fail(part+': steps/answers need the 9-label tutor format');
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
 const {catalog:loaded}=await literatureLoadAuthoredCatalog({subject:SUBJECT,storage:null,fetcher:async()=>({ok:true,json:async()=>catalog})});
 for(const entry of loaded.years)for(const l of entry.languages){
  const item=packs.find(p=>p.country===entry.country&&p.file===l.file);
  const pack=await literatureLoadNationalYear(entry,l.lang,{subject:SUBJECT,storage:null,fetcher:async()=>({ok:true,json:async()=>item.pack})});
  for(const topicKey of packLessonKeys(pack))for(const mode of ['lesson','examples','exercises','test']){
   const m=literatureNationalYearMaterial({pack,country:entry.country,stage:entry.stage,grade:entry.grade,topicKey,mode});
   const part=topicKey;
   const row=pack.chapters[topicKey][l.lang];
   if(!m||m.sourceLanguage!==l.lang||!m.text.includes(row.sample)||
      (pack.labels?.length===9&&mode==='lesson'&&!m.text.includes(row.steps[0]))||(pack.labels?.length===9&&mode==='test'&&!m.text.includes(row.answers[4])))
    throw Error('Render failed '+entry.country+' '+entry.grade+' '+l.lang+' '+part+' '+mode);
  }
 }
 const langs=new Set(packs.map(p=>p.country+':'+p.lang));
 const lessons=packs.reduce((n,p)=>n+packLessonKeys(p.pack).length,0),textbookPacks=packs.filter(p=>p.pack.units).length;
 console.log('Verified '+packs.length+' national '+(SUBJECT==='literature'?'Literature':SUBJECT==='history'?'History':SUBJECT==='computing'?'Computing':SUBJECT==='math'?'Math':'Geography')+' packs ('+lessons+' lessons; '+textbookPacks+' in textbook sequence), '+catalog.years.length+' years, '+
  new Set(packs.map(p=>p.country)).size+' systems, '+langs.size+' country-languages'+(write?' — written':''));
}
