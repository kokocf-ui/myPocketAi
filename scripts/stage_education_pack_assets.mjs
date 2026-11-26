#!/usr/bin/env node
// Stage and validate independently published content without regenerating it
// from app source. Intentionally does NOT run the legacy parity generators.
import {readdir,readFile,mkdir,writeFile,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {curriculumPackAssetName} from '../curriculum_pack_protocol.mjs';
import {CURRICULUM_REMOTE_PACK_KEYS} from '../curriculum_pack_manifest.mjs';
import {EDUCATION_EUROPE_COUNTRIES} from '../education_all_country_subject_matrix.mjs';
import {educationValidateStudyPack} from '../education_study_pack_loader.mjs';
import {scienceValidateSharedPack} from '../science_shared_pack_loader.mjs';
import {literatureLoadAuthoredYear,literatureLoadNationalYear} from '../literature_authored_pack_loader.mjs';
import {foreignValidateResource,foreignResourceKey} from '../foreign_language_resource_loader.mjs';
import {FOREIGN_LANGUAGES} from '../foreign_languages_curriculum.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=path.join(root,'public'),dest=path.join(root,'.education-pack-assets');
const patterns=[
 {dir:'education/languages/resources-v1',pattern:/^[a-z]{2}(?:-[A-Za-z]+)?\.json$/,kind:'language'},
 {dir:'education/study-v1',pattern:/^(math|physics|chemistry|biology)\.json$/,kind:'study'},
 {dir:'packs',pattern:/^p-[0-9a-f]{24}\.json$/,kind:'year'},
 {dir:'education/literature/profiles',pattern:/^[A-Z-]+\.json$/,kind:'profile'},
 ...['literature','history','geography','computing','math','physics','chemistry','biology'].map(subject=>({dir:'education/'+subject+'/authored',pattern:/^(?:catalog|[A-Z-]+\/[A-Za-z0-9_-]+)\.json$/,kind:'authored'})),
 {dir:'education/science/review',pattern:/^RO\.json$/,kind:'review'},
 {dir:'education/math/supplements',pattern:/^[A-Z-]+\.json$/,kind:'math'},
 {dir:'education/science/shared-v2',pattern:/^(physics|chemistry|biology|astronomy)\.json$/,kind:'science'}
];
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const seen=new Set();let files=0,bytes=0;
async function listFiles(base,relative=''){
 const out=[];
 for(const entry of await readdir(path.join(base,relative),{withFileTypes:true})){
  const item=relative?relative+'/'+entry.name:entry.name;
  if(entry.isDirectory())out.push(...await listFiles(base,item));
  else if(entry.isFile())out.push(item);
  else throw Error('Unexpected non-file Education asset: '+item);
 }
 return out;
}
await rm(dest,{recursive:true,force:true});
for(const {dir,pattern,kind} of patterns){
 const input=path.join(source,dir),output=path.join(dest,dir);
 await mkdir(output,{recursive:true});
 for(const entry of await listFiles(input)){
  if(!pattern.test(entry))throw Error('Unexpected Education asset: '+dir+'/'+entry);
  const raw=await readFile(path.join(input,entry));let data;
  if(raw.length>25*1024*1024)throw Error('Education asset exceeds 25 MiB: '+dir+'/'+entry);
  try{data=JSON.parse(raw)}catch{throw Error('Invalid JSON: '+dir+'/'+entry)}
  const name=entry.slice(0,-5);
  let valid=false;
  if(kind==='year'){
   const topics=data.lessonsByTopic;
   valid=data.schema==='mypocketai-curriculum-pack/v1'&&typeof data.packVersion==='string'&&!!data.packVersion&&
    !!topics&&typeof topics==='object'&&!Array.isArray(topics)&&Object.keys(topics).length>0&&
    Object.values(topics).every(rows=>Array.isArray(rows)&&rows.every(row=>row&&typeof row==='object'&&!Array.isArray(row)))&&
    await curriculumPackAssetName(data.subject,data.country,data.grade)===entry;
   if(valid)seen.add(data.subject+'|'+data.country+'|'+data.grade);
  }else if(kind==='profile')valid=data.schema==='mypocket-literature-profile/v1'&&data.country===name&&
    (data.profile===null||(data.profile&&typeof data.profile==='object'&&!Array.isArray(data.profile)))&&data.version===digest(data.profile);
  else if(kind==='authored'){
   if(entry==='catalog.json'){
    valid=data.schema==='mypocket-literature-authored-catalog/v1'&&Array.isArray(data.years)&&data.version===digest(data.years);
    if(valid)for(const year of data.years)for(const language of year.languages||[]){
     const content=JSON.parse(await readFile(path.join(input,year.country,language.file+'.json'),'utf8'));
     if(content.version!==language.version)valid=false;
    }
   }else{
    const [country,file]=name.split('/');
    if(/^[a-z]{2,3}-/.test(file)){
     const lang=file.split('-')[0],subject=dir.split('/')[1];
     valid=data.schema==='mypocket-literature-authored/v2'&&data.country===country&&data.sourceLanguage===lang&&data.version===digest(data.units?[data.labels||null,data.chapters,data.units]:[data.labels||null,data.chapters]);
     if(valid)try{await literatureLoadNationalYear({country,stage:data.stage,grade:data.grade,languages:[{lang,file,version:data.version}]},lang,{subject,storage:null,fetcher:async()=>({ok:true,json:async()=>data})})}catch{valid=false}
    }else{
     const grade=file;
     valid=data.schema==='mypocket-literature-authored/v2'&&data.sourceLanguage===(country==='HU'?'hu':country==='FR'?'fr':'')&&data.country===country&&data.grade===grade&&typeof data.stage==='string'&&!!data.stage&&
      data.chapters&&typeof data.chapters==='object'&&!Array.isArray(data.chapters)&&Object.keys(data.chapters).length>0&&data.version===digest(data.chapters);
     if(valid)try{await literatureLoadAuthoredYear(country,data.stage,grade,{storage:null,fetcher:async()=>({ok:true,json:async()=>data})})}catch{valid=false}
    }
   }
  }
  else if(kind==='review')valid=data.schema==='mypocket-science-review/v1'&&data.country==='RO'&&data.language==='ro'&&Array.isArray(data.lessons)&&data.lessons.length>0&&data.version===digest(data.lessons);
  else if(kind==='math')valid=data.schema==='mypocket-math-supplements/v1'&&data.country===name&&data.banks&&
    ['bulk','second','final'].every(k=>data.banks[k]&&typeof data.banks[k]==='object'&&!Array.isArray(data.banks[k]))&&data.version===digest(data.banks);
  else if(kind==='language'){
   const {schema,key,version,...payload}=data;
   valid=foreignValidateResource(data,name)&&version===digest(payload);
  }
  else if(kind==='study'){
   const {schema,subject,version,...payload}=data;
   valid=educationValidateStudyPack(data,name)&&version===digest(payload);
  }
  else if(kind==='science'){
   const {schema,subject,version,...payload}=data;
   valid=scienceValidateSharedPack(data,name)&&version===digest(payload);
  }
  if(!valid)throw Error('Invalid Education asset: '+dir+'/'+entry);
  await mkdir(path.dirname(path.join(output,entry)),{recursive:true});
  await writeFile(path.join(output,entry),raw);files++;bytes+=raw.length;
 }
}
for(const key of CURRICULUM_REMOTE_PACK_KEYS)if(!seen.has(key))throw Error('Missing known year pack: '+key);
for(const country of EDUCATION_EUROPE_COUNTRIES){
 for(const dir of ['education/literature/profiles','education/math/supplements'])
  await readFile(path.join(dest,dir,country+'.json')).catch(()=>{throw Error('Missing '+dir+'/'+country+'.json')});
}
for(const file of [...['math','physics','chemistry','biology'].map(s=>'education/study-v1/'+s+'.json'),'education/literature/profiles/OTHER-EU.json','education/literature/authored/FR/CP.json',...['1','2','3','4'].map(g=>'education/literature/authored/HU/'+g+'.json'),...['physics','chemistry','biology','astronomy'].map(s=>'education/science/shared-v2/'+s+'.json')])
 await readFile(path.join(dest,file)).catch(()=>{throw Error('Missing '+file)});

for(const language of FOREIGN_LANGUAGES)for(const variant of language.variants.length?language.variants:['standard']){
 const file='education/languages/resources-v1/'+foreignResourceKey(language.id,variant)+'.json';
 await readFile(path.join(dest,file)).catch(()=>{throw Error('Missing '+file)});
}

console.log(`Staged ${files} validated Education assets (${bytes} bytes). No frontend or backend deployment performed.`);
