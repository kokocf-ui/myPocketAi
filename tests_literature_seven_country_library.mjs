import assert from 'node:assert/strict';
import vm from 'node:vm';
import {SEVEN_COUNTRY_LITERARY_LIBRARY} from './literature_seven_country_library.mjs';
import {VERIFIED_LITERARY_AUTHORS,verifiedAuthorsByQuery,verifiedWorksByQuery} from './literature_verified_authors.mjs';
import {LITERATURE_TASK_UI_SCRIPT} from './literature_task_ui.mjs';

const countries=['MD','PL','HR','RS','HU','AT','TR'];
assert.deepEqual(SEVEN_COUNTRY_LITERARY_LIBRARY.map(a=>a.country),countries);
assert.equal(new Set(SEVEN_COUNTRY_LITERARY_LIBRARY.map(a=>a.id)).size,7);
for(const a of SEVEN_COUNTRY_LITERARY_LIBRARY){
 assert.ok(a.name&&a.sourceTitle&&a.sourceUrl.startsWith('https://'),a.country+' source');
 assert.ok(a.works.length>=2,a.country+' at least two offline sample works');
 assert.equal(new Set(a.works.map(w=>w.title.toLowerCase())).size,a.works.length,a.country+' duplicate title');
 for(const w of a.works){
  assert.ok(w.title&&w.kind&&w.sourceUrl.startsWith('https://'),a.country+' work evidence');
  assert.ok(w.year===null||Number.isInteger(w.year),a.country+' publication year');
  assert.ok(!('text' in w),'No copyrighted full text bundled');
 }
 assert.ok(VERIFIED_LITERARY_AUTHORS.includes(a),'Author serialized into frontend');
}
assert.equal(verifiedAuthorsByQuery('Grigore Vieru').length,1);
assert.equal(verifiedAuthorsByQuery('Petofi Sandor').length,1);
assert.equal(verifiedAuthorsByQuery('Desanka').length,0,'Original Cyrillic indexing does not invent a roman transliteration');
assert.equal(verifiedWorksByQuery('János vitéz')[0]?.author.country,'HU');
assert.equal(verifiedWorksByQuery('Priče iz davnine')[0]?.author.country,'HR');
assert.equal(verifiedWorksByQuery('Malina')[0]?.author.country,'AT');
new vm.Script(LITERATURE_TASK_UI_SCRIPT,{filename:'literature_task_ui.browser.js'});
assert.match(LITERATURE_TASK_UI_SCRIPT,/showCountryLibrary\(\);/,'Offline suggestions are rendered initially');
assert.match(LITERATURE_TASK_UI_SCRIPT,/a\.country===litJourney\.country/,'Offline suggestions are country-scoped');
assert.match(LITERATURE_TASK_UI_SCRIPT,/w\.sourceUrl\|\|a\.sourceUrl/,'Work-specific bibliographic evidence preserved');
assert.match(LITERATURE_TASK_UI_SCRIPT,/if\(!term\)\{showCountryLibrary\(\);return\}/,'Empty search restores offline suggestions');
console.log('PASS: seven evidence-linked offline literary libraries and country-aware browsing');
