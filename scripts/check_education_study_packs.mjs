#!/usr/bin/env node
// Editorial JSON is authoritative. Never regenerate worksheets from legacy JS.
// Default/--verify only checks. --refresh-hashes is explicit after JSON edits.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {educationValidateStudyPack} from '../education_study_pack_loader.mjs';
let bytes=0;
for(const subject of ['math','physics','chemistry','biology']){
 const file=new URL('../public/education/study-v1/'+subject+'.json',import.meta.url);
 const raw=await readFile(file,'utf8'),data=JSON.parse(raw);
 if(!educationValidateStudyPack(data,subject))throw Error('Invalid study source: '+subject);
 const {schema,subject:id,version,...payload}=data;
 const hash=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
 if(process.argv.includes('--refresh-hashes'))await writeFile(file,JSON.stringify({schema,subject:id,version:hash,...payload}));
 else if(hash!==version)throw Error('Study hash mismatch: '+subject);
 bytes+=Buffer.byteLength(raw);
}
console.log('PASS 4 editorial study packs: validated source and hashes ('+bytes+' bytes)');
