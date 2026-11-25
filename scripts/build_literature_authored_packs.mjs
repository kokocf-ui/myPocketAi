#!/usr/bin/env node
// Authored packs are the sole source of truth, not generated from app code.
// Kept as a verifier for existing CI and release commands; never overwrites content.
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {literatureLoadAuthoredYear} from '../literature_authored_pack_loader.mjs';
for(const grade of ['1','2','3','4']){
 const pack=JSON.parse(await readFile(new URL('../public/education/literature/authored/HU/'+grade+'.json',import.meta.url),'utf8'));
 if(pack.version!==createHash('sha256').update(JSON.stringify(pack.chapters)).digest('hex'))throw Error('Incorrect authored pack version: HU/'+grade);
 await literatureLoadAuthoredYear('HU','beginner',grade,{storage:null,fetcher:async()=>({ok:true,json:async()=>pack})});
}
console.log('Verified 4 single-source Hungarian Literature authored packs');
