// Single-source advisory material, independent of national year packs.
// v2 has a distinct URL/cache: an older frontend must not read this schema.
export function scienceValidateSharedPack(data,id){
 const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
 const text=x=>typeof x==='string'&&x.trim().length>0;
 const unique=rows=>new Set(rows.map(x=>x.id)).size===rows.length;
 const sourceOnly=x=>!x||typeof x!=='object'||Object.entries(x).every(([k,v])=>
  k!=='en'&&!k.endsWith('En')&&sourceOnly(v));
 return Boolean(object(data)&&['physics','chemistry','biology','astronomy'].includes(id)&&
  data.schema==='mypocket-science-shared/v2'&&data.subject===id&&data.sourceLanguage==='ro'&&
  typeof data.version==='string'&&/^[a-f0-9]{64}$/.test(data.version)&&sourceOnly(data)&&
  object(data.topics)&&Object.keys(data.topics).length>0&&
  Object.values(data.topics).every(topic=>object(topic)&&topic.sourceLanguage===data.sourceLanguage&&
   Array.isArray(topic.content)&&topic.content.length===5&&topic.content.every(text))&&
  Array.isArray(data.references)&&data.references.length>0&&unique(data.references)&&
  data.references.every(row=>object(row)&&row.sourceLanguage===data.sourceLanguage&&
   ['id','group','ro','formula','explainRo','exampleRo','scopeRo'].every(k=>text(row[k])))&&
  Array.isArray(data.universityCore)&&unique(data.universityCore)&&
  (id==='chemistry'?data.universityCore.length>0:data.universityCore.length===0)&&
  data.universityCore.every(row=>object(row)&&row.sourceLanguage===data.sourceLanguage&&
   Number.isInteger(row.year)&&row.year>=1&&row.year<=5&&
   ['id','ro','topic','formula','conceptRo','exampleRo'].every(k=>text(row[k]))));
}
export async function scienceLoadSharedPack(subject,options={}){
 const id=String(subject||'').toLowerCase();
 if(!['physics','chemistry','biology','astronomy'].includes(id))throw new Error('invalid_subject');
 const valid=data=>scienceValidateSharedPack(data,id);
 let storage=null;
 try{storage=options.storage===undefined?globalThis.localStorage:options.storage}catch{}
 const key='pocketai.science.shared.v2.'+id;
 const result=(data,offline)=>({topics:data.topics,references:data.references,
  universityCore:data.universityCore,sourceLanguage:data.sourceLanguage,version:data.version,offline});
 try{
  const fetcher=options.fetcher||globalThis.fetch;
  const response=await fetcher('/education/science/shared-v2/'+id+'.json',{cache:'no-store'});
  if(!response.ok)throw new Error('shared_pack_http_'+response.status);
  const data=await response.json();
  if(!valid(data))throw new Error('invalid_shared_pack');
  try{
   storage?.setItem(key,JSON.stringify(data));
   // Retire only the obsolete prewritten bilingual cache after v2 is saved.
   // Shared-engine translation caches and unrelated subjects remain intact.
   storage?.removeItem?.('pocketai.science.shared.v1.'+id);
  }catch{}
  return result(data,false);
 }catch(error){
  try{
   const cached=JSON.parse(storage?.getItem(key)||'null');
   if(valid(cached))return result(cached,true);
  }catch{}
  throw new Error('science_shared_pack_unavailable',{cause:error});
 }
}
