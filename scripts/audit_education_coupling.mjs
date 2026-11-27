#!/usr/bin/env node
// Reproducible inventory, NOT an automatic deletion list. Country/language
// labels are not translated worksheets, and separate national packs are not
// duplicates merely because they share a language. Prints JSON to stdout.
import {readdir,readFile} from 'node:fs/promises';
import app from '../index.js';
const html=await(await app.fetch(new Request('https://education-audit.test/'))).text();
const embedded=[];
function pairs(value){
 if(!value||typeof value!=='object')return 0;
 return Number(!Array.isArray(value)&&'ro' in value&&'en' in value)+Object.values(value).reduce((n,x)=>n+pairs(x),0);
}
for(const m of html.matchAll(/const ([A-Z][A-Z0-9_]+)=(\{[^\n]*\}|\[[^\n]*\]);/g)){
 try{
  const data=JSON.parse(m[2]),bytes=Buffer.byteLength(m[2]);
  if(bytes>=10_000)embedded.push({name:m[1],bytes,roEnObjects:pairs(data)});
 }catch{}
}
const contentPairs=[];let assets=0;
async function scan(dir){
 for(const file of await readdir(dir,{withFileTypes:true})){
  const path=dir+'/'+file.name;
  if(file.isDirectory()){await scan(path);continue}
  if(!file.name.endsWith('.json'))continue;
  const data=JSON.parse(await readFile(path,'utf8'));assets++;
  const count=pairs(data);if(count)contentPairs.push({path,roEnObjects:count});
 }
}
await scan(new URL('../public/education',import.meta.url).pathname.replace(/\/$/,''));
await scan(new URL('../public/packs',import.meta.url).pathname.replace(/\/$/,''));
console.log(JSON.stringify({htmlUtf8Bytes:Buffer.byteLength(html),jsonAssets:assets,
 warning:'Heuristic inventory only. Review authorship and consumers before removing any material. ro/en may be navigation labels.',
 embedded:embedded.sort((a,b)=>b.bytes-a.bytes),jsonWithRoEnObjects:contentPairs},null,2));
