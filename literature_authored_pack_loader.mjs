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
