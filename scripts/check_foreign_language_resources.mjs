#!/usr/bin/env node
// JSON is the editorial source. Never recreate it from app/legacy constants.
// --refresh-hashes updates hashes only, after explicit editorial JSON changes.
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {FOREIGN_LANGUAGES} from '../foreign_languages_curriculum.mjs';
import {foreignResourceKey,foreignValidateResource} from '../foreign_language_resource_loader.mjs';
const directory=new URL('../public/education/languages/resources-v1/',import.meta.url);
const keys=FOREIGN_LANGUAGES.flatMap(l=>(l.variants.length?l.variants:['standard']).map(v=>foreignResourceKey(l.id,v)));
const names=(await readdir(directory)).sort();
if(JSON.stringify(names)!==JSON.stringify(keys.map(k=>k+'.json').sort()))throw Error('Unexpected or missing language resource');
let bytes=0;
for(const key of keys){
 const file=new URL(key+'.json',directory),raw=await readFile(file,'utf8'),data=JSON.parse(raw);
 if(!foreignValidateResource(data,key))throw Error('Invalid language resource: '+key);
 const {schema,key:identity,version,...payload}=data;
 const hash=createHash('sha256').update(JSON.stringify(payload)).digest('hex');
 if(process.argv.includes('--refresh-hashes')){data.version=hash;await writeFile(file,JSON.stringify(data,null,2)+'\n')}
 else if(version!==hash)throw Error('Language resource hash mismatch: '+key);
 bytes+=Buffer.byteLength(raw);
}
console.log('PASS '+keys.length+' editorial language packs: validated schema/identity/source hashes ('+bytes+' bytes)');
