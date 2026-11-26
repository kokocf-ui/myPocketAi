export async function literatureLoadAuthoredYear(country,stage,grade,options={}){
 const c=String(country||'').toUpperCase(),s=String(stage||''),g=String(grade||'');
 const hungary=c==='HU'&&s==='beginner'&&['1','2','3','4'].includes(g);
 const france=c==='FR'&&s==='beginner'&&g==='CP';
 if(!hungary&&!france)throw Error('unknown_authored_year');
 const valid=x=>{
  if(!(x&&x.schema==='mypocket-literature-authored/v2'&&x.sourceLanguage===(france?'fr':'hu')&&x.country===c&&x.stage===s&&x.grade===g&&
   typeof x.version==='string'&&/^[a-f0-9]{64}$/.test(x.version)&&x.chapters&&typeof x.chapters==='object'&&!Array.isArray(x.chapters)))return false;
  if(france)return ['parcurs','intelegere','redactare'].every(part=>x.chapters['eu-year-fr-beginner-cp-'+part])&&
   Object.entries(x.chapters).every(([key,record])=>{
    const row=record?.fr;
    return key.startsWith('eu-year-fr-beginner-cp-')&&record&&Object.keys(record).length===1&&row&&
     ['title','theory','sample','worked'].every(k=>typeof row[k]==='string'&&row[k].trim())&&
     ['exercises','test'].every(k=>Array.isArray(row[k])&&row[k].length>0&&row[k].every(q=>typeof q==='string'&&q.trim()));
   });
  const parts=['year-focus','year-reading','year-writing'];
  if(g==='1')return parts.every(part=>x.chapters['hu-beginner-1-'+part])&&Object.values(x.chapters).every(record=>{
   const row=record?.hu;
   return record&&Object.keys(record).length===1&&row&&['title','sample','theory','worked','steps'].every(k=>typeof row[k]==='string'&&row[k].trim())&&
    ['exercises','test'].every(k=>Array.isArray(row[k])&&row[k].length>0&&row[k].every(q=>typeof q==='string'&&q.trim()));
  });
  return typeof x.chapters.sample==='string'&&x.chapters.sample.trim()&&Object.keys(x.chapters.meaning||{}).join(',')==='hu'&&
   typeof x.chapters.meaning.hu==='string'&&x.chapters.meaning.hu.trim()&&parts.every(part=>x.chapters.chapters?.[part])&&
   Object.values(x.chapters.chapters||{}).every(record=>record&&Object.keys(record).join(',')==='hu'&&
    Array.isArray(record.hu)&&record.hu.length===4&&record.hu.slice(0,2).every(x=>typeof x==='string'&&x.trim())&&
    record.hu.slice(2).every(items=>Array.isArray(items)&&items.length>0&&items.every(q=>typeof q==='string'&&q.trim())));
 };
 let storage=null;try{storage=options.storage===undefined?globalThis.localStorage:options.storage}catch{}
 const key='pocketai.literature.authored.v1.'+c+'.'+s+'.'+g;
 try{
  const response=await (options.fetcher||globalThis.fetch)('/education/literature/authored/'+c+'/'+g+'.json',{cache:'no-store'});
  if(!response.ok)throw Error('authored_pack_http_'+response.status);
  const data=await response.json();if(!valid(data))throw Error('invalid_authored_pack');
  try{storage?.setItem(key,JSON.stringify(data))}catch{}
  return {chapters:data.chapters,version:data.version,offline:false};
 }catch(error){
  try{const saved=JSON.parse(storage?.getItem(key)||'null');if(valid(saved))return {chapters:saved.chapters,version:saved.version,offline:true}}catch{}
  throw Error('literature_authored_year_unavailable',{cause:error});
 }
}

// Generic national Literature year packs (schema v2, one source language per
// file). The catalog lists which country/stage/year/language packs exist, so
// new packs can be published as static assets without changing the frontend.
// Both functions are serialized into the browser script: keep them closed.
export async function literatureLoadAuthoredCatalog(options={}){
 // Same engine for every school subject with national year packs:
 // public/education/<subject>/authored/ (default: literature).
 const subject=['history','geography','computing','math','physics','chemistry','biology'].includes(options.subject)?options.subject:'literature';
 const valid=x=>Boolean(x&&x.schema==='mypocket-literature-authored-catalog/v1'&&typeof x.version==='string'&&
  /^[a-f0-9]{64}$/.test(x.version)&&Array.isArray(x.years)&&x.years.every(y=>y&&/^[A-Z]{2}(?:-[A-Z]{3})?$/.test(String(y.country||''))&&
   ['beginner','lower','medium','advanced'].includes(y.stage)&&typeof y.grade==='string'&&y.grade&&
   Array.isArray(y.languages)&&y.languages.length>0&&y.languages.every(l=>l&&/^[a-z]{2,3}$/.test(String(l.lang||''))&&
    /^[a-z]{2,3}-[a-z0-9-]+$/.test(String(l.file||''))&&/^[a-f0-9]{64}$/.test(String(l.version||''))&&
    typeof l.name==='string'&&l.name.trim())));
 let storage=null;try{storage=options.storage===undefined?globalThis.localStorage:options.storage}catch{}
 const key=subject==='literature'?'pocketai.literature.authored.catalog.v1':'pocketai.'+subject+'.authored.catalog.v1';
 try{
  const response=await (options.fetcher||globalThis.fetch)('/education/'+subject+'/authored/catalog.json',{cache:'no-store'});
  if(!response.ok)throw Error('authored_catalog_http_'+response.status);
  const data=await response.json();if(!valid(data))throw Error('invalid_authored_catalog');
  try{storage?.setItem(key,JSON.stringify(data))}catch{}
  return {catalog:data,offline:false};
 }catch(error){
  try{const saved=JSON.parse(storage?.getItem(key)||'null');if(valid(saved))return {catalog:saved,offline:true}}catch{}
  throw Error('literature_authored_catalog_unavailable',{cause:error});
 }
}
export async function literatureLoadNationalYear(entry,language,options={}){
 const subject=['history','geography','computing','math','physics','chemistry','biology'].includes(options.subject)?options.subject:'literature';
 const c=String(entry?.country||'').toUpperCase(),s=String(entry?.stage||''),g=String(entry?.grade||'');
 const choice=(entry?.languages||[]).find(l=>l.lang===language);
 if(!choice)throw Error('unknown_national_year_language');
 const slug=g.toLowerCase().replace(/[^a-z0-9-]/g,'-');
 const prefix='eu-year-'+c.toLowerCase()+'-'+s+'-'+slug+'-';
 const parts=['parcurs','intelegere','narativ','poezie','dialog','vocabular','exprimare','redactare','interpretare','verificare'];
 const text=v=>typeof v==='string'&&v.trim().length>0;
 const list=v=>Array.isArray(v)&&v.length>=3&&v.every(text);
 const valid=x=>Boolean(x&&x.schema==='mypocket-literature-authored/v2'&&x.country===c&&x.stage===s&&x.grade===g&&
  x.sourceLanguage===language&&x.version===choice.version&&x.chapters&&typeof x.chapters==='object'&&!Array.isArray(x.chapters)&&
  (x.labels===undefined||(Array.isArray(x.labels)&&(x.labels.length===7||x.labels.length===9)&&x.labels.every(text)))&&
  // Textbook-sequence packs group their lessons into the units of the
  // official programme/textbook; every lesson belongs to exactly one unit.
  (x.units===undefined||(Array.isArray(x.units)&&x.units.length>0&&x.units.every(u=>u&&text(u.title)&&Array.isArray(u.keys)&&u.keys.length>0&&u.keys.every(k=>x.chapters?.[k]))&&
   x.units.flatMap(u=>u.keys).join('|')===Object.keys(x.chapters||{}).join('|')))&&
  Object.keys(x.chapters).length>0&&Object.entries(x.chapters).every(([k,record])=>{
   if(!k.startsWith(prefix)||!(parts.includes(k.slice(prefix.length))||/^l\d{2}$/.test(k.slice(prefix.length))))return false;
   const row=record?.[language];
   return Boolean(record&&Object.keys(record).length===1&&row&&['title','theory','sample','worked'].every(f=>text(row[f]))&&
    list(row.exercises)&&list(row.test)&&(row.steps===undefined||list(row.steps))&&
    (row.answers===undefined||(Array.isArray(row.answers)&&row.answers.length===row.test.length&&row.answers.every(text))));
  }));
 let storage=null;try{storage=options.storage===undefined?globalThis.localStorage:options.storage}catch{}
 const key=(subject==='literature'?'pocketai.literature.national.v1.':'pocketai.'+subject+'.national.v1.')+c+'.'+s+'.'+g+'.'+language;
 try{
  const response=await (options.fetcher||globalThis.fetch)('/education/'+subject+'/authored/'+c+'/'+choice.file+'.json',{cache:'no-store'});
  if(!response.ok)throw Error('national_pack_http_'+response.status);
  const data=await response.json();if(!valid(data))throw Error('invalid_national_pack');
  try{storage?.setItem(key,JSON.stringify(data))}catch{}
  return {country:c,stage:s,grade:g,language,chapters:data.chapters,labels:data.labels||null,units:data.units||null,source:data.source||null,sourceTitle:data.sourceTitle||'',version:data.version,status:data.status||'',offline:false};
 }catch(error){
  // A cached copy of an older version stays usable offline; validate its own
  // structure, not the version announced by the newer catalog.
  try{
   const saved=JSON.parse(storage?.getItem(key)||'null');
   if(saved&&/^[a-f0-9]{64}$/.test(String(saved.version||''))&&valid({...saved,version:choice.version}))
    return {country:c,stage:s,grade:g,language,chapters:saved.chapters,labels:saved.labels||null,units:saved.units||null,source:saved.source||null,sourceTitle:saved.sourceTitle||'',version:saved.version,status:saved.status||'',offline:true};
  }catch{}
  throw Error('literature_national_year_unavailable',{cause:error});
 }
}
