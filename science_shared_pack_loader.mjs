// Fetch the selected science's shared lower-secondary teaching frames. These
// are advisory cross-country data, not the national year packs. Cache fallback
// is available only after a successful download and is not permanent storage.
export async function scienceLoadSharedPack(subject,options={}){
 const id=String(subject||'').toLowerCase();
 if(!['physics','chemistry','biology','astronomy'].includes(id))throw new Error('invalid_subject');
 const valid=data=>Boolean(data&&data.schema==='mypocket-science-shared/v1'&&data.subject===id&&
  typeof data.version==='string'&&/^[a-f0-9]{64}$/.test(data.version)&&
  data.topics&&typeof data.topics==='object'&&!Array.isArray(data.topics)&&Object.keys(data.topics).length>0&&
  Object.values(data.topics).every(topic=>topic&&Array.isArray(topic.ro)&&topic.ro.length===5&&
   Array.isArray(topic.en)&&topic.en.length===5&&[...topic.ro,...topic.en].every(x=>typeof x==='string')));
 let storage=null;
 try{storage=options.storage===undefined?globalThis.localStorage:options.storage}catch{}
 const key='pocketai.science.shared.v1.'+id;
 try{
  const fetcher=options.fetcher||globalThis.fetch;
  const response=await fetcher('/education/science/shared/'+id+'.json',{cache:'no-store'});
  if(!response.ok)throw new Error('shared_pack_http_'+response.status);
  const data=await response.json();
  if(!valid(data))throw new Error('invalid_shared_pack');
  try{storage?.setItem(key,JSON.stringify(data))}catch{}
  return {topics:data.topics,version:data.version,offline:false};
 }catch(error){
  try{
   const cached=JSON.parse(storage?.getItem(key)||'null');
   if(valid(cached))return {topics:cached.topics,version:cached.version,offline:true};
  }catch{}
  throw new Error('science_shared_pack_unavailable',{cause:error});
 }
}
