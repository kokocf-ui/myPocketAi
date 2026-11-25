// Temporary diagnostic: national packs as served by production.
import {literatureLoadAuthoredCatalog,literatureLoadNationalYear} from '../literature_authored_pack_loader.mjs';
import {literatureNationalYearMaterial} from '../literature_national_authored_material.mjs';
const BASE='https://lifewise-ai-v2.kokocf.workers.dev';
const UA='Mozilla/5.0 (Linux; Android 14; wv) AppleWebKit/537.36 Chrome/131 Mobile Safari/537.36';
const fetcher=(p,o)=>fetch(BASE+p,{...o,headers:{'user-agent':UA}});
for(const [subject,grade] of []){
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
const local=await (await (await import('../index.js')).default.fetch(new Request(BASE+'/?nativeLaunch=1'))).text();
console.log('html live',html.length,'local',local.length);
for(const n of ['eduNationalShowMaterial','literatureNationalYearMaterial','Materialul nu a putut fi','educationOpenPagedLesson(title','function hgRenderNationalLesson'])console.log(n,'live',html.split(n).length-1,'local',local.split(n).length-1);
let i=html.indexOf('Materialul nu a putut fi');console.log('CTX1',html.slice(i-900,i+50).replace(/\n/g,' '));
i=html.indexOf('literatureNationalYearMaterial');console.log('CTX2',html.slice(i-100,i+500).replace(/\n/g,' '));
let d=0;while(d<html.length&&html[d]===local[d])d++;console.log('first diff at',d,'LIVE',html.slice(d-80,d+200).replace(/\n/g,' '),'LOCAL',local.slice(d-80,d+200).replace(/\n/g,' '));
