#!/usr/bin/env node
// Extract the original shared secondary teaching frames into per-subject
// static assets. This is not a substitute for a national year pack.
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {SCIENCE_LOWER_TOPIC_LESSONS} from '../science_lower_secondary_lessons.mjs';
const dir=new URL('../public/education/science/shared/',import.meta.url);
const verify=process.argv.includes('--verify');
await mkdir(dir,{recursive:true});
let bytes=0;
for(const subject of ['physics','chemistry','biology','astronomy']){
 const topics=SCIENCE_LOWER_TOPIC_LESSONS[subject];
 const version=createHash('sha256').update(JSON.stringify(topics)).digest('hex');
 const content=JSON.stringify({schema:'mypocket-science-shared/v1',subject,version,topics});
 const file=new URL(subject+'.json',dir);
 if(verify){
  if((await readFile(file,'utf8').catch(()=>null))!==content)throw new Error('Shared science pack missing or out of sync: '+subject);
 }else await writeFile(file,content);
 bytes+=Buffer.byteLength(content);
}
console.log((verify?'Verified':'Built')+' 4 shared science packs ('+bytes+' bytes)');
