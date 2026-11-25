#!/usr/bin/env node
// Preserve existing Maths starter lessons while moving them out of HTML.
// These country assets are an intermediate step toward per-year packs.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {EDUCATION_EUROPE_COUNTRIES} from '../education_all_country_subject_matrix.mjs';
import {buildMathCountrySupplementCatalog} from '../math_country_supplement_catalog.mjs';
const all=buildMathCountrySupplementCatalog();
const dir=new URL('../public/education/math/supplements/',import.meta.url);
const verify=process.argv.includes('--verify');await mkdir(dir,{recursive:true});
let bytes=0;
for(const country of EDUCATION_EUROPE_COUNTRIES){
 const banks=Object.fromEntries(Object.entries(all).map(([name,rows])=>
  [name,Object.fromEntries(Object.entries(rows).filter(([key])=>key.startsWith(country+'|')))]));
 const version=createHash('sha256').update(JSON.stringify(banks)).digest('hex');
 const body=JSON.stringify({schema:'mypocket-math-supplements/v1',country,version,banks});
 const file=new URL(country+'.json',dir);
 if(verify){if(await readFile(file,'utf8').catch(()=>null)!==body)throw Error('Missing or changed Maths supplement: '+country)}
 else await writeFile(file,body);
 bytes+=Buffer.byteLength(body);
}
console.log((verify?'Verified ':'Built ')+EDUCATION_EUROPE_COUNTRIES.length+' country Maths supplements ('+bytes+' bytes)');
