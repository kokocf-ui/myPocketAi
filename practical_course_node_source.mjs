// Node authoring/test compatibility; no editorial JSON import in the Worker.
const cache=new Map();
export function readPracticalNodePack(id){
 if(typeof process==='undefined'||typeof process.getBuiltinModule!=='function')return null;
 if(!cache.has(id)){
  try{const fs=process.getBuiltinModule('node:fs');cache.set(id,JSON.parse(fs.readFileSync(new URL('./public/education/practical/course-v1/'+id+'.json',import.meta.url),'utf8')).content)}catch{return null}
 }
 return cache.get(id);
}
