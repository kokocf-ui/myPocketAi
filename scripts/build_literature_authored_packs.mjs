#!/usr/bin/env node
// Move the twelve existing HU primary authored chapters into grade-specific
// static packs; these do not claim completion of the national curriculum.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {LIT_HU_GRADE1_CHAPTERS} from '../literature_hungary_grade1.mjs';
import {LIT_HU_PRIMARY_BATCH} from '../literature_hungary_primary_batch.mjs';
const dir=new URL('../public/education/literature/authored/HU/',import.meta.url);
const verify=process.argv.includes('--verify');await mkdir(dir,{recursive:true});
for(const grade of ['1','2','3','4']){
 const chapters=grade==='1'?LIT_HU_GRADE1_CHAPTERS:LIT_HU_PRIMARY_BATCH[grade];
 const version=createHash('sha256').update(JSON.stringify(chapters)).digest('hex');
 const body=JSON.stringify({schema:'mypocket-literature-authored/v1',country:'HU',stage:'beginner',grade,version,chapters});
 const file=new URL(grade+'.json',dir);
 if(verify){if(await readFile(file,'utf8').catch(()=>null)!==body)throw Error('Literature authored pack missing or stale: HU/'+grade)}
 else await writeFile(file,body);
}
console.log((verify?'Verified':'Built')+' 4 Hungarian Literature authored year packs');
