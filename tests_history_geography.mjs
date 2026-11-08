import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {HG_SUBJECTS,HG_LEVELS,HG_SCOPES,HG_COUNTRIES,HG_HISTORY_TOPICS,HG_GEOGRAPHY_TOPICS,HG_SPECIALISATIONS,HG_VERIFIED_MAPS,hgMapsFor,hgCountrySuggestion} from './history_geography_curriculum.mjs';

assert.deepEqual(HG_SUBJECTS.map(x=>x.id),['history','geography']);
assert.deepEqual(HG_LEVELS.map(x=>x.id),['beginner','medium','advanced']);
assert.deepEqual(HG_SCOPES.map(x=>x.id),['world','national','regional']);
for(const id of ['RO','GB-ENG','GB-SCT','GB-WLS','GB-NIR','OTHER']) assert.ok(HG_COUNTRIES.some(c=>c.id===id),id);
for(const subject of HG_SUBJECTS){
 const topics=subject.id==='history'?HG_HISTORY_TOPICS:HG_GEOGRAPHY_TOPICS;
 assert.ok(topics.length>=10,'full chapter navigation for '+subject.id);
 assert.ok(HG_SPECIALISATIONS[subject.id].length>=8,'university specialisations');
 for(const topic of topics)assert.ok(topic.id&&topic.ro&&topic.en);
}
assert.equal(hgMapsFor(117,'antiquity').length,1);
assert.equal(hgMapsFor(117,'medieval').length,0,'never substitute maps from other context');
assert.equal(hgMapsFor(118,'antiquity').length,0,'never pretend a nearby year is exact');
assert.equal(hgMapsFor(1918,'twentieth').length,1);
assert.equal(hgMapsFor(1914,'twentieth').length,0,'unknown border data remains unverified');
assert.equal(hgMapsFor(1916,'twentieth','military').length,1);
assert.equal(hgMapsFor(-1300,'antiquity','economic').length,1);
assert.equal(hgMapsFor(1054,'medieval','cultural').length,1);
assert.equal(hgMapsFor(395,'antiquity','military').length,0);
assert.ok(HG_VERIFIED_MAPS.every(x=>x.source.startsWith('https://')&&Number.isInteger(x.year)));
assert.equal(hgCountrySuggestion(51.5,-.12),'GB-ENG');
assert.equal(hgCountrySuggestion(47.07,21.92),'RO');
assert.equal(hgCountrySuggestion(40.71,-74.0),null);
const html=await(await frontend.fetch(new Request('https://hg-curriculum-regression.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(script);
for(const token of [
 'const HG_SUBJECT_DATA=','const HG_COUNTRY_DATA=','function hgOpen(stage)',
 'function hgLesson(panel)','function hgHistoricalMap(panel,topic)',
 'function hgGeographyMap(panel,topic)','function hgGenerate(extra,output)',
 "if(key==='history'){hgRestore();hgOpen('subjects');return}"
]) assert.ok(script.includes(token),token);
assert.ok(html.includes('.learning-hg .hg-toolbar'));
assert.ok(html.includes('.learning-hg .hg-panel'));
assert.ok(script.includes("m.year===y&&m.topic===topic.id&&m.kind===type"));
assert.ok(script.includes("className='hg-map-types'"));
assert.ok(script.includes("button.setAttribute('aria-pressed'"));
console.log('PASS History Geography subjects, 3 levels, 3 curricula, UK subdivisions, specialist branches, time-exact maps and boot script');
