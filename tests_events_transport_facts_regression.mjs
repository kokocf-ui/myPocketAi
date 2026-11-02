import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import frontend from './index.js';

const backend=await fs.readFile(new URL('./backend.js',import.meta.url),'utf8');
const part=(start,end)=>{
 const a=backend.indexOf(start),b=backend.indexOf(end,a);
 assert.ok(a>=0&&b>a,start+' missing');return backend.slice(a,b);
};

const eventsContext=vm.createContext({Intl,Date});
vm.runInContext(part('function eventRowsFromReply(','// In long model-generated recipes'),eventsContext);
const events=eventsContext.eventRowsFromReply;
const response='Evenimente:\n* Madrigal la Oradea Arena pe 10 decembrie 2026, ora 19:00.\n* Festival din 30 – 31 octombrie 2026.\n* Concert pe 5 decembrie 2026, ora 18:30.\n* Târgul de Crăciun 27 noiembrie – 26 decembrie 2026.\n* Ora Jazz Festival 12 – 14 noiembrie 2026.';
const result=events(response,'Caută festivaluri și spectacole în Oradea în decembrie 2026','ro');
assert.equal(result.structured_list.type,'events');
assert.equal(result.structured_list.rows.length,3);
assert.ok(result.structured_list.rows[0].description.includes('Târgul'));
assert.ok(result.structured_list.rows[1].description.includes('Concert'));
assert.ok(result.structured_list.rows[2].description.includes('Madrigal'));
assert.equal(result.structured_list.rows[1].time,'18:30');
assert.ok(!result.reply.includes('Ora Jazz'));

const transportContext=vm.createContext({Date,normalizeGeoName:v=>String(v).toLowerCase().trim()});
vm.runInContext(part('function selectTransitAlternatives(','// Optional MOTIS'),transportContext);
const journey=(departure,arrival,id)=>({arrivalDateTime:'2026-11-02T'+arrival+':00Z',
 legs:[{mode:'national-rail',from:'Chafford Hundred Rail Station',to:'West Dulwich',departureTime:'2026-11-02T'+departure+':00Z',
 arrivalTime:'2026-11-02T'+arrival+':00Z',departureStopId:id,lineNames:['c2c']}]});
const options=transportContext.selectTransitAlternatives([
 journey('19:26','20:54','stop1'),journey('19:26','20:54','stop2'),journey('20:21','21:39','stop1')]);
assert.equal(options.length,2);

const factsCtx=vm.createContext({Intl,Date,AbortSignal:{timeout:()=>null},
 fetch:async()=>({ok:true,json:async()=>[
 {cca2:'RO',currencies:{RON:{name:'Romanian leu',symbol:'lei'}},languages:{ron:'Romanian'}},
 ...Array.from({length:151},(_,i)=>({cca2:String(i).padStart(2,'0')}))
 ]})});
vm.runInContext(part('let countryMetadataIndex=','function geoQueryParts(query)'),factsCtx);
const facts=await factsCtx.countryMetadata('RO','ro');
assert.equal(facts.currencies[0].code,'RON');
assert.ok(facts.languages.length>0);
assert.equal(facts.country_code,'RO');

const html=await(await frontend.fetch(new Request('https://pocket.test/'))).text();
const match=html.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
assert.ok(match);
new vm.Script(match[1]);
assert.ok(match[1].includes('appendStructuredCollectionTable'));
assert.ok(match[1].includes('journey.startDateTime||first?.departureTime'));
assert.ok(match[1].includes('article.country_facts'));

assert.ok(backend.includes('if(recipeInstruction&&!shouldSearchWeb)'));
assert.ok(backend.includes('ai_execution_ms: Date.now()-aiStartedAt'));
console.log('PASS: December range overlap, event table, chronology, removed irrelevant dates, deduplicated journeys, country metadata, compact recipe path, generated frontend syntax.');
