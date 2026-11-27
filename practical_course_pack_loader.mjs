// Protocol and workbook state only; canonical editorial content is in JSON assets.
export function practicalValidatePack(data,id){
 const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
 const text=x=>typeof x==='string'&&x.trim().length>0;
 const texts=x=>Array.isArray(x)&&x.length>0&&x.every(text);
 const ids=['finance','trades','business','digital','career','daily'];
 try{
  if(!ids.includes(id)||!object(data)||data.schema!=='mypocket-practical-course/v1'||data.id!==id||data.sourceLanguage!=='ro'||!/^[a-f0-9]{64}$/.test(data.version))return false;
  const p=data.content,c=p?.course;
  if(!object(p)||!object(c)||c.id!==id||!['ro','en','icon','summary'].every(k=>text(c[k]))||!Array.isArray(c.lessons)||c.lessons.length!==6||!Array.isArray(c.chapters)||c.chapters.length!==6)return false;
  if(!object(p.syllabus)||p.syllabus.id!==id||!['intro','project','prerequisite'].every(k=>text(p.syllabus[k]))||!texts(p.syllabus.outcomes)||!texts(p.syllabus.rubric))return false;
  if(!object(p.pathway)||!['title','principle','safety','finalTemplate'].every(k=>text(p.pathway[k]))||!texts(p.pathway.tools)||!Array.isArray(p.workshops)||p.workshops.length!==6)return false;
  return c.chapters.every((ch,i)=>{
   const key=id+'-'+(i+1),g=p.guides?.[key],deep=p.depth?.[key],w=p.workshops[i],q=ch.question;
   return ch.id===key&&ch.order===i+1&&['title','theory','method','caseStudy'].every(k=>text(ch[k]))&&texts(ch.practice)&&object(q)&&text(q.prompt)&&texts(q.choices)&&Number.isInteger(q.correct)&&q.correct>=0&&q.correct<q.choices.length&&object(g)&&text(g.goal)&&['steps','model','check','exercise'].every(k=>texts(g[k]))&&Array.isArray(deep)&&deep.length>0&&deep.every(row=>Array.isArray(row)&&row.length===2&&row.every(text))&&object(w)&&w.id===key&&['title','scenario','artifact','template','mistake','transfer','safety'].every(k=>text(w[k]))&&Number.isInteger(w.minutes)&&w.minutes>0&&texts(w.tools)&&Array.isArray(w.evidence)&&w.evidence.length>=3&&new Set(w.evidence.map(e=>e.id)).size===w.evidence.length&&w.evidence.every(e=>text(e.id)&&text(e.text))&&object(w.checkpoint)&&text(w.checkpoint.question)&&text(w.checkpoint.explanation)&&(w.checkpoint.type==='number'?Number.isFinite(w.checkpoint.answer):w.checkpoint.type==='choice'&&texts(w.checkpoint.choices)&&Number.isInteger(w.checkpoint.correct)&&w.checkpoint.correct>=0&&w.checkpoint.correct<w.checkpoint.choices.length);
  });
 }catch{return false}
}
export async function practicalLoadPack(id,options={}){
 if(!['finance','trades','business','digital','career','daily'].includes(id))throw Error('invalid_practical_course');
 const key='pocketai.practical.course.v1.'+id;let storage=null;try{storage=options.storage===undefined?globalThis.localStorage:options.storage}catch{}
 try{
  const response=await(options.fetcher||globalThis.fetch)('/education/practical/course-v1/'+id+'.json',{cache:'no-store'});
  if(!response.ok)throw Error('practical_pack_http_'+response.status);
  const data=await response.json();if(!practicalValidatePack(data,id))throw Error('invalid_practical_pack');
  try{storage?.setItem(key,JSON.stringify(data))}catch{}
  return{data,offline:false};
 }catch(error){
  try{const data=JSON.parse(storage?.getItem(key)||'null');if(practicalValidatePack(data,id))return{data,offline:true}}catch{}
  throw new Error('practical_pack_unavailable',{cause:error});
 }
}
export function practicalCheckpointCorrect(checkpoint,value){
 if(checkpoint.type==='choice')return String(checkpoint.correct)===String(value);
 const normalized=String(value??'').trim().replace(',','.');
 if(!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(normalized))return false;
 return Math.abs(Number(normalized)-checkpoint.answer)<1e-8;
}
export function practicalCanSelfReview(workshop,state){
 // Completeness check, NOT semantic/acoustic/professional evaluation.
 return Boolean(state&&typeof state.draft==='string'&&state.draft.trim().length>=30&&state.draft.trim()!==workshop.template.trim()&&state.draft.trim()!==String(state.seed||'').trim()&&workshop.evidence.every(e=>state.evidence?.[e.id]===true)&&practicalCheckpointCorrect(workshop.checkpoint,state.answer));
}
