// Temporary diagnostic: national packs as served by production.
import {literatureLoadAuthoredCatalog,literatureLoadNationalYear} from '../literature_authored_pack_loader.mjs';
import {literatureNationalYearMaterial} from '../literature_national_authored_material.mjs';
const BASE='https://lifewise-ai-v2.kokocf.workers.dev';
const UA='Mozilla/5.0 (Linux; Android 14; wv) AppleWebKit/537.36 Chrome/131 Mobile Safari/537.36';
const fetcher=(p,o)=>fetch(BASE+p,{...o,headers:{'user-agent':UA}});
for(const [subject,grade] of [['history','5'],['geography','6'],['computing','11'],['literature','9']]){
 try{
  const raw=await fetcher('/education/'+subject+'/authored/catalog.json');
  console.log(subject,'catalog http',raw.status,raw.headers.get('content-type'),raw.headers.get('content-encoding'));
  const {catalog}=await literatureLoadAuthoredCatalog({subject,fetcher,storage:null});
  const entry=catalog.years.find(y=>y.country==='RO'&&y.grade===grade);
  console.log(' entry',JSON.stringify(entry));
  const r=await fetcher('/education/'+subject+'/authored/RO/'+entry.languages[0].file+'.json');
  const txt=await r.text();console.log(' pack http',r.status,txt.length,txt.slice(0,160).replace(/\n/g,' '));
  const pack=await literatureLoadNationalYear(entry,'ro',{subject,fetcher,storage:null});
  const key=Object.keys(pack.chapters)[0];
  const m=literatureNationalYearMaterial({pack,country:pack.country,stage:pack.stage,grade:pack.grade,topicKey:key,mode:'lesson'});
  console.log(' material',m?m.text.slice(0,120).replace(/\n/g,' '):m, 'stage',pack.stage,'grade',pack.grade,'lang',pack.language,'labels',pack.labels&&pack.labels.length);
 }catch(e){console.log(subject,'ERROR',e.message,e.cause&&e.cause.message)}
}
const html=await (await fetcher('/?nativeLaunch=1')).text();
console.log('html',html.length,'eduNationalShowMaterial',html.includes('function eduNationalShowMaterial('));
const i=html.indexOf('function literatureNationalYearMaterial(');console.log(html.slice(i,i+700));
