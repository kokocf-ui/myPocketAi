import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import frontend from './index.js';

const backend=await fs.readFile(new URL('./backend.js',import.meta.url),'utf8');
const page=await(await frontend.fetch(new Request('https://pocket.test/'))).text();
const inline=page.match(/<script[^>]*>([\s\S]*?)<\/script>/i)?.[1];
assert.ok(inline,'generated application script missing');
new vm.Script(inline);

const a=inline.indexOf('function isRecipeQuestion(');
const b=inline.indexOf('async function coordinatesForRequest(',a);
assert.ok(a>=0 && b>a,'recipe-location guard missing');
const ctx=vm.createContext({needsLocation:v=>/near me|in jurul meu/i.test(v)});
vm.runInContext(inline.slice(a,b),ctx);
for(const query of [
  'Rețetă sarmale tradiționale românești',
  'Rețeta ciorbă de burtă',
  'Cum se prepară sarmalele?',
  'Ciorbă de burtă'
]){
 assert.equal(ctx.isRecipeQuestion(query),true,'recipe detection: '+query);
 assert.equal(ctx.requestUsesLocation(query),false,'recipe must not await GPS: '+query);
}
assert.equal(ctx.requestUsesLocation('Decathlon Lakeside'),true);
assert.equal(ctx.requestUsesLocation('near me'),true);
assert.ok(inline.includes('clientRequestStartedAt=performance.now()'));
assert.ok(inline.includes('gpsElapsedMs='));
assert.ok(inline.includes('backend_round_trip_ms:'));
assert.ok(inline.includes("console.info('Pocket AI request timing'"));

assert.match(backend,/const maxSearchWaitMs=eventResearchIntent\?7000:6000/);
assert.match(backend,/const tracked=providerTasks\.map/);
assert.match(backend,/Promise\.race\(\[Promise\.all\(tracked\),ready,/);
assert.ok(!backend.includes('setTimeout(resolve,1400)'),'old extra search delay still present');
assert.match(backend,/if\(deadlineTimer!==null\)clearTimeout\(deadlineTimer\)/);
assert.match(backend,/pendingProviderCount/);
assert.match(backend,/!recipeFastPath && needsComplianceReview\(message\)/);
assert.match(backend,/sentence_correction_ms:/);
assert.match(backend,/modelHistory=recipeFastPath\?history\.slice\(-4\):history/);
assert.match(backend,/latency_breakdown:/);

// A stuck third provider must not hold up two usable event providers.
const coordStart=backend.indexOf('        const outcomes=[];',backend.indexOf('const providerTasks = [];'));
const coordEnd=backend.indexOf('        const providerDiagnostics=',coordStart);
assert.ok(coordStart>=0&&coordEnd>coordStart,'provider coordinator boundaries');
const coordinator=new Function('providerTasks','eventResearchIntent',
 'return (async()=>{'+backend.slice(coordStart,coordEnd)+';return {settled,pendingProviderCount};})()');
const source=n=>({status:'fulfilled',value:{results:Array.from({length:n},(_,i)=>({title:'Event '+i}))}});
const started=Date.now();
const done=await coordinator([Promise.resolve(source(6)),Promise.resolve(source(6)),new Promise(()=>{})],true);
assert.equal(done.settled.length,2,'two ready search engines should be usable');
assert.equal(done.pendingProviderCount,1,'unresponsive third engine should be reported');
assert.ok(Date.now()-started<3500,'response should not await the stuck engine');
console.log('PASS: frontend recipe/GPS prioritisation, generated script syntax, stage timing, single bounded provider wait, model-review fast path.');
