import assert from 'node:assert/strict';
import vm from 'node:vm';
import app from './index.js';
import {UNIVERSITY_DOMAINS} from './university_domains.mjs';
import {EXAM_UI_SCRIPT} from './exam_ui.mjs';
import {UNIVERSITY_PROGRAM_OPTIONS,UNIVERSITY_ADMISSION_ENTRIES,universityProgramsForDomain,universityAdmissionsFor,universityEntryIsCurrent} from './university_admissions_verified.mjs';

const domainIds=new Set(UNIVERSITY_DOMAINS.map(d=>d.id));
assert.ok(UNIVERSITY_PROGRAM_OPTIONS.length>=20);
for(const domain of UNIVERSITY_DOMAINS){assert.ok(universityProgramsForDomain(domain.id).length>=1,'Missing specialization for '+domain.id)}
const programs=new Set(UNIVERSITY_PROGRAM_OPTIONS.map(p=>p.id));
assert.equal(programs.size,UNIVERSITY_PROGRAM_OPTIONS.length,'Program ids unique');
for(const p of UNIVERSITY_PROGRAM_OPTIONS){assert.ok(domainIds.has(p.domain));assert.ok(p.ro&&p.en)}
const records=new Set();
for(const item of UNIVERSITY_ADMISSION_ENTRIES){
 assert.ok(programs.has(item.program));assert.ok(item.country&&item.name&&Number.isInteger(item.year));
 assert.ok(item.source.startsWith('https://'));
 assert.ok(Array.isArray(item.required)&&Array.isArray(item.optional)&&Array.isArray(item.subjectIds));
 assert.ok(['verified-historical','verified-2027','reference-current','directory'].includes(item.status));
 const id=item.country+'|'+item.program+'|'+item.name+'|'+item.year;assert.ok(!records.has(id),'Duplicate institution '+id);records.add(id);
}
const iasi=universityAdmissionsFor('RO','medicine-general').find(x=>x.name.includes('Iași'));
const cluj=universityAdmissionsFor('RO','medicine-general').find(x=>x.name.includes('Cluj'));
assert.ok(iasi&&cluj,'Must distinguish medical school rules');
assert.deepEqual(iasi.required,['Anatomia și fiziologia omului']);
assert.deepEqual(iasi.optional,[['Chimie organică','Fizică']]);
assert.deepEqual(cluj.required,['Biologie','Chimie']);
assert.equal(universityEntryIsCurrent(iasi,2027),false,'Historical 2026 tests are not 2027 regulations');
assert.equal(universityAdmissionsFor('FR','medicine-general').length,0,'Never invent a French faculty');
assert.match(EXAM_UI_SCRIPT,/universityPrograms/,'Programme step required');
assert.match(EXAM_UI_SCRIPT,/universityInstitutions/,'Faculty step required');
assert.match(EXAM_UI_SCRIPT,/UNIVERSITY_ADMISSION_ENTRIES_DATA/,'Use institution-specific data in UI');
assert.match(EXAM_UI_SCRIPT,/Alegere între:/,'Show optional exam alternative');
assert.match(EXAM_UI_SCRIPT,/Exemplu istoric/,'Clearly label historical requirements');
assert.match(EXAM_UI_SCRIPT,/probe neconfirmate/,'General fallback must be honest');
const response=await app.fetch(new Request('https://university-admission-check.invalid/'));
assert.equal(response.status,200);
const html=await response.text();const boot=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(boot&&boot.includes('UNIVERSITY_PROGRAM_OPTIONS_DATA')&&boot.includes('UNIVERSITY_ADMISSION_ENTRIES_DATA'));
new vm.Script(boot,{filename:'education-university-admission-boot.js'});
console.log('PASS university admission: programme, faculty, official year, historical caution and generic fallback');
