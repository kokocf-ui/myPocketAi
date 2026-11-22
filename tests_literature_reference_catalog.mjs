import assert from 'node:assert/strict';
import {LIT_REFERENCE_CATALOG,literatureReferenceEntries} from './literature_reference_catalog.mjs';
import {literatureQuickSuggestions,literatureQuickDefinition} from './literature_quick_reference.mjs';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';
assert.ok(LIT_REFERENCE_CATALOG.length>=230,'Reference must cover substantial forms and units');
const valid=new Set(['grammatica','abrevieri','unitati']);
const counts=Object.fromEntries([...valid].map(s=>[s,LIT_REFERENCE_CATALOG.filter(x=>x[0]===s).length]));
assert.ok(counts.grammatica>=100,'Full range of common grammatical categories required');
assert.ok(counts.abrevieri>=50,'Abbreviations section too thin');
assert.ok(counts.unitati>=50,'Units section too thin');
for(const row of LIT_REFERENCE_CATALOG){
 assert.ok(valid.has(row[0]),'Unknown section: '+row[0]);
 assert.equal(row.length,5,'Every reference has category, group, label, definition and example');
 assert.ok(row.every(x=>typeof x==='string'&&x.trim().length>0),'Empty reference field');
}
for(const [section,group,term,part] of [
 ['grammatica','Propoziție','Predicat','subiect'],
 ['grammatica','Verb: timpuri','Viitor anterior','viitoare'],
 ['grammatica','Substantiv și articol','Genitiv','posesia'],
 ['grammatica','Adjectiv și pronume','Superlativ absolut','însușire'],
 ['abrevieri','Formule uzuale','ș.a.m.d.','mai departe'],
 ['abrevieri','Carte și școală','ISBN','ediție'],
 ['unitati','Lungime','km','o mie de metri'],
 ['unitati','Masă','kg','masă'],
 ['unitati','Timp','min','șaizeci'],
 ['unitati','Viteză','mph','britanice'],
 ['unitati','Date digitale','MiB','1024']
]){
 const row=literatureReferenceEntries(section,group).find(x=>x[2]===term);
 assert.ok(row,section+'/'+term+' must be selectable');
 assert.ok(row[3].toLowerCase().includes(part.toLowerCase()),'Wrong definition: '+term);
}
assert.ok(literatureQuickSuggestions('c','ro',30).some(x=>x==='copac'));
assert.ok(literatureQuickSuggestions('cop','ro',30).some(x=>x==='copac'));
assert.match(literatureQuickDefinition('copac','ro')?.definition||'',/Plantă lemnoasă/);
assert.match(LITERATURE_TASK_UI_SCRIPT,/const LIT_REFERENCE_CATALOG=/,'Reference must actually be embedded');
assert.match(LITERATURE_TASK_UI_SCRIPT,/function literatureQuickReferenceAttach\(/);
assert.match(LITERATURE_TASK_UI_SCRIPT,/authored_ro_year_specific/);
assert.match(LITERATURE_TASK_UI_SCRIPT,/authored_university_year/);
assert.ok(!LIT_REFERENCE_CATALOG.some(x=>/Războiul stelelor/i.test(x[2])),'A media franchise must not be an unverified required literary work');
console.log('PASS: '+LIT_REFERENCE_CATALOG.length+' reference entries: '+JSON.stringify(counts)+', grammar definitions, abbreviations, SI/UK units, offline copac');
