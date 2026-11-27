#!/usr/bin/env node
// Historical command retained for CI. v2 JSON is now the authored source, not
// output regenerated from bilingual JS banks. Normal mode refreshes hashes;
// --verify never writes. Staging separately validates the same contract.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {scienceValidateSharedPack} from '../science_shared_pack_loader.mjs';
const dir=new URL('../public/education/science/shared-v2/',import.meta.url);
const verify=process.argv.includes('--verify');
let bytes=0;
for(const subject of ['physics','chemistry','biology','astronomy']){
 const file=new URL(subject+'.json',dir);
 const raw=await readFile(file,'utf8'),data=JSON.parse(raw);
 const {schema,subject:packSubject,version,...payload}=data;
 if(!scienceValidateSharedPack(data,subject))throw new Error('Invalid source science pack: '+subject);
 const digest=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
 if(verify&&version!==digest)throw new Error('Science pack hash out of sync: '+subject);
 const content=JSON.stringify({schema,subject:packSubject,version:digest,...payload});
 if(!verify)await writeFile(file,content);
 bytes+=Buffer.byteLength(content);
}
console.log((verify?'Verified':'Updated hashes for')+' 4 single-source science packs ('+bytes+' bytes)');
