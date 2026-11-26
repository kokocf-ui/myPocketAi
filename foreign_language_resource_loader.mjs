// Small protocol only: editorial data lives exclusively in independently served JSON.
export function foreignResourceKey(language,variant='standard'){
 const variants={ro:['standard'],en:['GB','US'],fr:['standard'],de:['standard'],it:['standard'],es:['standard'],pt:['standard'],nl:['standard'],ru:['standard'],pl:['standard'],la:['classical','ecclesiastical'],zh:['simplified','traditional'],ja:['standard'],el:['modern','ancient','koine']};
 const v=variant||'standard';
 if(!variants[language]?.includes(v))throw Error('invalid_language_variant');
 return language+(v==='standard'?'':'-'+v);
}
export function foreignValidateResource(data,key){
 const obj=x=>x&&typeof x==='object'&&!Array.isArray(x);
 const text=x=>typeof x==='string'&&x.trim().length>0&&x.length<=6000;
 const unique=rows=>new Set(rows.map(x=>x.id)).size===rows.length;
 try{
  if(!obj(data)||data.schema!=='mypocket-language-resources/v1'||data.key!==key||foreignResourceKey(data.language,data.variant)!==key||data.sourceLanguage!=='ro'||!['A1','foundation'].includes(data.level)||!text(data.locale)||!text(data.pronunciationNote)||!text(data.scopeNote)||!/^[a-f0-9]{64}$/.test(data.version))return false;
  if(!Array.isArray(data.provenance)||!data.provenance.length||!data.provenance.every(text))return false;
  if(!Array.isArray(data.dictionary)||!data.dictionary.length||data.dictionary.length>1000||!unique(data.dictionary)||!data.dictionary.every(x=>obj(x)&&['id','term','phonetic','gloss','category'].every(k=>text(x[k]))&&['ro','en'].includes(x.glossLanguage)&&['ipa','pinyin','romaji','transliteration'].includes(x.notation)))return false;
  if(!Array.isArray(data.lessons)||!data.lessons.length||!unique(data.lessons)||!data.lessons.every(x=>obj(x)&&['id','title','explanation'].every(k=>text(x[k]))&&x.sourceLanguage==='ro'&&Array.isArray(x.forms)&&x.forms.length>0&&x.forms.every(f=>obj(f)&&text(f.person)&&text(f.form))&&obj(x.task)&&text(x.task.prompt)&&text(x.task.feedback)&&Array.isArray(x.task.answers)&&x.task.answers.length>0&&x.task.answers.every(text)))return false;
  const ids=new Set(data.dictionary.map(x=>x.id));
  return Array.isArray(data.guide)&&data.guide.length>0&&unique(data.guide)&&data.guide.every(x=>obj(x)&&text(x.id)&&text(x.title)&&typeof x.note==='string'&&Array.isArray(x.entryIds)&&x.entryIds.length>0&&new Set(x.entryIds).size===x.entryIds.length&&x.entryIds.every(id=>ids.has(id)));
 }catch{return false}
}
export async function foreignLoadResource(language,variant,options={}){
 const key=foreignResourceKey(language,variant),cacheKey='pocketai.languages.resources.v1.'+key;
 let storage=null;try{storage=options.storage===undefined?globalThis.localStorage:options.storage}catch{}
 const valid=x=>foreignValidateResource(x,key);
 try{
  const response=await(options.fetcher||globalThis.fetch)('/education/languages/resources-v1/'+key+'.json',{cache:'no-store'});
  if(!response.ok)throw Error('language_resource_http_'+response.status);
  const data=await response.json();if(!valid(data))throw Error('invalid_language_resource');
  try{storage?.setItem(cacheKey,JSON.stringify(data))}catch{}
  return{data,offline:false};
 }catch(error){
  try{const data=JSON.parse(storage?.getItem(cacheKey)||'null');if(valid(data))return{data,offline:true}}catch{}
  throw new Error('language_resource_unavailable',{cause:error});
 }
}
