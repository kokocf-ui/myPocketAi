// Node-only compatibility for authoring tools/tests, following the existing
// curriculum_pack_protocol pattern. No static JSON or node:* imports: Workers
// ship zero worksheet bytes from these packs. Browser readers fetch the assets.
const nodeStudyCache=new Map();
function readNodeEducationAsset(relative,empty){
 if(typeof process==='undefined'||typeof process.getBuiltinModule!=='function')return empty();
 if(nodeStudyCache.has(relative))return nodeStudyCache.get(relative);
 try{
  const fs=process.getBuiltinModule('node:fs');
  const pack=JSON.parse(fs.readFileSync(new URL('./public/education/'+relative+'.json',import.meta.url),'utf8'));
  nodeStudyCache.set(relative,pack);return pack;
 }catch{return empty()}
}
export function readNodeEducationStudyPack(subject){
 if(!['math','physics','chemistry','biology'].includes(subject))throw Error('invalid_study_subject');
 return readNodeEducationAsset('study-v1/'+subject,()=>({banks:{ro5:{content:[]},ro678:{content:{}},roLower:{content:{}},
  englishLower:{content:{}},upper:{content:[]}},sources:{ro5:{},ro678:{}}}));
}
export function readNodeEducationSharedPack(subject){
 if(!['physics','chemistry','biology','astronomy'].includes(subject))throw Error('invalid_shared_subject');
 return readNodeEducationAsset('science/shared-v2/'+subject,()=>({subject,topics:{},references:[],universityCore:[]}));
}
