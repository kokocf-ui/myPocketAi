// Supplemental authored banks only: this does not replace national year packs.
// Each bank has exactly one source language; independent English cards are not
// a pretranslated version of Romanian cards. Keep routes and caches versioned.
export function educationValidateStudyPack(data,subject){
 const object=x=>Boolean(x&&typeof x==='object'&&!Array.isArray(x));
 const text=x=>typeof x==='string'&&x.trim().length>0;
 const specs={math:{ro5:'ro',ro678:'ro'},physics:{roLower:'ro',englishLower:'en'},
  chemistry:{roLower:'ro'},biology:{roLower:'ro',upper:'ro'}};
 const spec=specs[subject];
 if(!spec||!object(data)||data.schema!=='mypocket-education-study/v1'||data.subject!==subject||
  typeof data.version!=='string'||!/^[a-f0-9]{64}$/.test(data.version)||!object(data.banks)||
  Object.keys(data.banks).length!==Object.keys(spec).length)return false;
 const row=(x,lang,math=false)=>object(x)&&['id','topic','title','statement',...(math?['worked','practice','answers']:['workedExample','exercise','answer'])].every(k=>text(x[k]))&&
  (x.subject===subject||(math&&x.subject===undefined))&&(!x.language||x.language===lang)&&!('ro' in x)&&!('en' in x);
 const rows=(xs,lang,math=false)=>Array.isArray(xs)&&xs.length>0&&xs.every(x=>row(x,lang,math))&&new Set(xs.map(x=>x.id)).size===xs.length;
 for(const [name,lang] of Object.entries(spec)){
  const bank=data.banks[name];if(!object(bank)||bank.sourceLanguage!==lang)return false;
  const content=bank.content;
  if(name==='ro5'){
   if(!rows(content,lang,true)||content.some(x=>x.grade!=='5'||x.country!=='RO'))return false;
  }else if(name==='upper'){
   if(!Array.isArray(content)||!content.length||!content.every(ch=>object(ch)&&Number.isInteger(ch.year)&&ch.year>=0&&ch.year<=3&&text(ch.topic)&&
    rows(ch.lessons,lang)&&ch.lessons.every(x=>x.topic===ch.topic&&x.year===ch.year))||
    new Set(content.map(ch=>ch.year+':'+ch.topic)).size!==content.length)return false;
   const all=content.flatMap(ch=>ch.lessons);if(new Set(all.map(x=>x.id)).size!==all.length)return false;
  }else{
   if(!object(content)||!Object.keys(content).length)return false;
   const grades=name==='ro678'?['6','7','8']:name==='roLower'?(subject==='physics'?['6','7','8']:subject==='biology'?['5','6','7','8']:['8']):null;
   if(grades&&(Object.keys(content).length!==grades.length||!grades.every(g=>g in content)))return false;
   for(const [key,list] of Object.entries(content)){
    if(!rows(list,lang,name==='ro678')||list.some(x=>name==='englishLower'?x.topic!==key:x.grade!==key)||
     (name==='ro678'&&list.some(x=>x.country!=='RO'))||
     (!grades&&!/^[a-z][a-z0-9-]{0,49}$/.test(key)))return false;
   }
   const flat=Object.values(content).flat();if(new Set(flat.map(x=>x.id)).size!==flat.length)return false;
  }
 }
 if(subject==='math'&&(!object(data.sources)||!['ro5','ro678'].every(k=>object(data.sources[k])&&Object.keys(data.sources[k]).length>0&&Object.values(data.sources[k]).every(text))))return false;
 return true;
}
export async function educationLoadStudyPack(subject,options={}){
 const id=String(subject||'');
 if(!['math','physics','chemistry','biology'].includes(id))throw Error('invalid_study_subject');
 let storage=null;try{storage=options.storage===undefined?globalThis.localStorage:options.storage}catch{}
 const key='pocketai.education.study.v1.'+id;
 try{
  const response=await(options.fetcher||globalThis.fetch)('/education/study-v1/'+id+'.json',{cache:'no-store'});
  if(!response.ok)throw Error('study_pack_http_'+response.status);
  const pack=await response.json();if(!educationValidateStudyPack(pack,id))throw Error('invalid_study_pack');
  try{storage?.setItem(key,JSON.stringify(pack))}catch{}
  return {...pack,offline:false};
 }catch(error){
  try{const pack=JSON.parse(storage?.getItem(key)||'null');if(educationValidateStudyPack(pack,id))return {...pack,offline:true}}catch{}
  throw new Error('education_study_pack_unavailable',{cause:error});
 }
}
