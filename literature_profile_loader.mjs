// The returned profile is country-scoped and independently versioned. Online
// reads prefer the latest asset; a previously validated local copy is fallback.
export async function literatureLoadCountryProfile(country,options={}){
 const code=String(country||'').trim().toUpperCase();
 if(!/^(?:[A-Z]{2}(?:-[A-Z]{3})?|OTHER-EU)$/.test(code))throw new Error('invalid_country');
 const valid=value=>Boolean(value&&value.schema==='mypocket-literature-profile/v1'&&
  value.country===code&&typeof value.version==='string'&&/^[a-f0-9]{64}$/.test(value.version)&&
  Object.hasOwn(value,'profile')&&(value.profile===null||
   (typeof value.profile==='object'&&!Array.isArray(value.profile))));
 let storage=null;
 try{storage=options.storage===undefined?globalThis.localStorage:options.storage}catch{}
 const key='pocketai.literature.profile.v1.'+code;
 try{
  const fetcher=options.fetcher||globalThis.fetch;
  const response=await fetcher('/education/literature/profiles/'+encodeURIComponent(code)+'.json',{cache:'no-store'});
  if(!response.ok)throw new Error('profile_http_'+response.status);
  const data=await response.json();
  if(!valid(data))throw new Error('invalid_profile');
  try{storage?.setItem(key,JSON.stringify(data))}catch{}
  return {profile:data.profile,version:data.version,offline:false};
 }catch(error){
  try{
   const saved=JSON.parse(storage?.getItem(key)||'null');
   if(valid(saved))return {profile:saved.profile,version:saved.version,offline:true};
  }catch{}
  throw new Error('literature_profile_unavailable',{cause:error});
 }
}
