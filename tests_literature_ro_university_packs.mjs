// RO Faculty of Letters (Licență I–III): national tutor packs open from the
// university study-year selector; other countries keep the generic plan.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const catalog=JSON.parse(await readFile(new URL('./public/education/literature/authored/catalog.json',import.meta.url),'utf8'));
const uni=catalog.years.filter(y=>y.stage==='advanced');
assert.ok(uni.length>=1,'at least one university pack');
for(const y of uni){
 assert.equal(y.country,'RO','only RO has university packs');
 assert.match(y.grade,/^uni-ba-[123]$/,'Licență I–III study-year ids');
 const file=y.languages[0].file;
 const pack=JSON.parse(await readFile(new URL('./public/education/literature/authored/RO/'+file+'.json',import.meta.url),'utf8'));
 assert.equal(pack.stage,'advanced');assert.equal(pack.labels.length,9);
 const keys=Object.keys(pack.chapters);assert.ok(keys.length>=24&&keys.length<=40);
 for(const k of keys){const r=pack.chapters[k].ro;assert.ok(r.steps.at(-1).startsWith('Greșeala frecventă'));assert.equal(r.answers.length,r.test.length)}
 assert.match(pack.sourceTitle,/ARACIS/);
}
const ui=await readFile(new URL('./literature_task_ui.mjs',import.meta.url),'utf8');
assert.match(ui,/litWithNationalYear\(go\)/,'university year card loads the national pack');
assert.match(ui,/loadedUniversityPack/,'loaded university pack takes precedence over the generic plan');
const index=await readFile(new URL('./index.js',import.meta.url),'utf8');
assert.doesNotMatch(index,/stage==='advanced'\|\|!country\|\|country==='OTHER-EU'/,'advanced stage is not skipped');
console.log('PASS RO university Literature packs:',uni.map(y=>y.grade).join(', '));
