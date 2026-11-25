export async function mathLoadCountrySupplement(country,options={}){
 const code=String(country||'').toUpperCase();
 if(!/^[A-Z]{2}(?:-[A-Z]{3})?$/.test(code))throw Error('invalid_country');
 const valid=data=>Boolean(data&&data.schema==='mypocket-math-supplements/v1'&&data.country===code&&
  typeof data.version==='string'&&/^[a-f0-9]{64}$/.test(data.version)&&data.banks&&
  ['bulk','second','final'].every(name=>{
   const bank=data.banks[name];
   return bank&&typeof bank==='object'&&!Array.isArray(bank)&&Object.entries(bank).every(([key,rows])=>
    key.startsWith(code+'|')&&Array.isArray(rows)&&rows.every(row=>row&&typeof row==='object'&&typeof row.title==='string'));
  }));
 let storage=null;try{storage=options.storage===undefined?globalThis.localStorage:options.storage}catch{}
 const key='pocketai.math.supplements.v1.'+code;
 try{
  const response=await (options.fetcher||globalThis.fetch)('/education/math/supplements/'+encodeURIComponent(code)+'.json',{cache:'no-store'});
  if(!response.ok)throw Error('supplement_http_'+response.status);
  const data=await response.json();if(!valid(data))throw Error('invalid_supplement');
  try{storage?.setItem(key,JSON.stringify(data))}catch{}
  return {banks:data.banks,version:data.version,offline:false};
 }catch(error){
  try{const data=JSON.parse(storage?.getItem(key)||'null');if(valid(data))return {banks:data.banks,version:data.version,offline:true}}catch{}
  throw Error('math_supplement_unavailable',{cause:error});
 }
}
