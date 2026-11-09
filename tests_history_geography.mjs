import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import backend from './backend.js';
import {HG_SUBJECTS,HG_LEVELS,HG_SCOPES,HG_COUNTRIES,HG_HISTORY_TOPICS,HG_GEOGRAPHY_TOPICS,HG_SPECIALISATIONS,HG_VERIFIED_MAPS,hgMapsFor,hgCountrySuggestion} from './history_geography_curriculum.mjs';

assert.deepEqual(HG_SUBJECTS.map(x=>x.id),['history','geography']);
assert.deepEqual(HG_LEVELS.map(x=>x.id),['beginner','lower','medium','advanced']);
assert.deepEqual(HG_SCOPES.map(x=>x.id),['world','national','regional']);
for(const id of ['RO','GB-ENG','GB-SCT','GB-WLS','GB-NIR','OTHER']) assert.ok(HG_COUNTRIES.some(c=>c.id===id),id);
for(const subject of HG_SUBJECTS){
 const topics=subject.id==='history'?HG_HISTORY_TOPICS:HG_GEOGRAPHY_TOPICS;
 assert.ok(topics.length>=10,'full chapter navigation for '+subject.id);
 assert.ok(HG_SPECIALISATIONS[subject.id].length>=8,'university specialisations');
 for(const topic of topics)assert.ok(topic.id&&topic.ro&&topic.en);
}
for(const topic of HG_HISTORY_TOPICS) assert.ok(topic.period && topic.periodEn, 'bilingual chronological label for '+topic.id);
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
 "if(key==='history'){hgOpen('subjects');return}"
]) assert.ok(script.includes(token),token);
assert.ok(script.includes("const HG_COUNTRY_PICKER_DATA="));
assert.ok(script.includes("className='hg-country-matches'"));
assert.ok(script.includes("slice(0,4)"));
assert.ok(script.includes("function hgFoldCountry(value)"));
assert.ok(html.includes('.learning-hg .hg-level-list'));
assert.ok(script.includes("levels:'scope'"));
assert.ok(script.includes("className='hg-level-list'")||script.includes("className='hg-level-list'")||script.includes("holder.className='hg-level-list'"));
assert.ok(html.includes('.learning-hg .hg-toolbar'));
assert.ok(html.includes('.learning-hg .hg-panel'));
assert.ok(script.includes('hgMapMatchesPeriod(map,p)&&hgMapMatchesCountry(map,c)'));
assert.ok(script.includes('function hgMapFullscreen(map,src)'));
assert.ok(script.includes('No verified historical map available for this query.'));
const source=script.slice(script.indexOf('function hgParsePeriod(value)'),script.indexOf('function hgMapFullscreen(map,src)'));
const helpers=vm.runInNewContext(source+';({parse:hgParsePeriod,matchesPeriod:hgMapMatchesPeriod,matchesCountry:hgMapMatchesCountry})',{});
assert.equal(helpers.parse('1848').start.year,1848);
assert.equal(helpers.parse('15.03.1848').precision,'day');
assert.equal(helpers.parse('1848–1849').end.year,1849);
assert.equal(helpers.parse('01.01.1848 – 31.12.1849').precision,'range');
assert.equal(helpers.parse('31.02.1848'),null);
assert.equal(helpers.matchesPeriod({year:1848},helpers.parse('1848')),true);
assert.equal(helpers.matchesPeriod({year:1848},helpers.parse('15.03.1848')),false);
assert.equal(helpers.matchesPeriod({year:1848},helpers.parse('1848–1849')),false);
assert.equal(helpers.matchesCountry({countries:['România']},'Romania'),true);
assert.equal(helpers.matchesCountry({countries:['Romania']},'France'),false);
assert.equal(helpers.matchesCountry({region:'Europe'},'Romania'),false);
assert.ok(script.includes('function hgDisplayStudyText(host,value)'));
assert.ok(script.includes('NU impune o limită de 4 sau 5 evenimente'));
assert.ok(script.includes('Nu inventa hărți, frontiere, documente, numere ori surse.'));
assert.ok(script.includes("className='hg-map-types'"));
assert.ok(script.includes("b.setAttribute('aria-pressed'"));
for(const token of ['const LIT_LANGUAGES=','const LIT_BRANCHES=','const LIT_TOPICS=','function litOpen(stage)','function litWorkspace(panel)',"if(key==='literature'){litOpen('levels');return}",'Compune / explică','Nu inventa citate','lit-input','hgDisplayStudyText(out'])assert.ok(script.includes(token),'literature: '+token);
for(const token of ['Rezumat al operei','Sinteză tematică','Autor sau titlul operei','TEXT FURNIZAT DE UTILIZATOR','Nu căuta și nu copia rezumate',"function eduOpenPrint(mode='save')",'function eduAttachPrintAction(bar)','PocketAndroidPrint.postMessage'])assert.ok(script.includes(token),'literature/print feature: '+token);

// History event queries are lesson requests, never place lookups.
assert.match(script,/module:'education_study',education_subject:hgJourney\.subject/);
let selectedModel='',selectedInput;
const historicalReply='Răscoala din 1907: cauze agrare, desfășurare și consecințe istorice.';
const testResponse=await backend.fetch(new Request('https://api.fixture.test/api/chat',{
 method:'POST',headers:{'Content-Type':'application/json'},
 body:JSON.stringify({module:'education_study',education_subject:'history',language:'ro',message:'Acționează ca profesor de istorie: Răscoala din 1907 — cauze și consecințe.'})
}),{AI:{run:async(model,data)=>{selectedModel=model;selectedInput=data;return {response:historicalReply}}}});
assert.equal(testResponse.status,200);
const result=await testResponse.json();
assert.equal(result.reply,historicalReply,'Do not return a location search response for history');
assert.equal(result.education_subject,'history');
assert.match(selectedInput.messages[0].content,/Never interpret a historical event/);
assert.match(selectedInput.messages[1].content,/Răscoala din 1907/);
assert.ok(selectedModel.startsWith('@cf/'));
console.log('PASS History Geography subjects, 3 levels, 3 curricula, UK subdivisions, specialist branches, time-exact maps and boot script');
