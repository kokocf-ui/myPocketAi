#!/usr/bin/env node
// Generate country-level Literature programme assets without importing them in
// the frontend document. This is an intermediate step, not year-pack migration.
import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {LIT_EU_PROGRAMS} from '../literature_curriculum_europe.mjs';
import {EDUCATION_EUROPE_COUNTRIES} from '../education_all_country_subject_matrix.mjs';

const dir=new URL('../public/education/literature/profiles/',import.meta.url);
const verify=process.argv.includes('--verify');
await mkdir(dir,{recursive:true});
let bytes=0;
// toJSON supplies the exact compact base used in the existing browser; the
// selected year is still materialized by the same client logic as before.
const clientPrograms=JSON.parse(JSON.stringify(LIT_EU_PROGRAMS));
const countries=[...EDUCATION_EUROPE_COUNTRIES,'OTHER-EU'];
for(const country of countries){
 // A null profile preserves the existing generic fallback for jurisdictions
 // without a national base entry; it is not a claim of national coverage.
 const profile=clientPrograms[country]??null;
 const version=createHash('sha256').update(JSON.stringify(profile)).digest('hex');
 const content=JSON.stringify({schema:'mypocket-literature-profile/v1',country,version,profile});
 const target=new URL(country+'.json',dir);
 if(verify){
  const actual=await readFile(target,'utf8').catch(()=>null);
  if(actual!==content)throw new Error('Literature profile missing or out of date: '+country);
 }else await writeFile(target,content);
 bytes+=Buffer.byteLength(content);
}
console.log((verify?'Verified ':'Built ')+countries.length+' Literature country profiles ('+bytes+' bytes)');
