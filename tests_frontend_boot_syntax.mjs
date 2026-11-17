import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';

// Browser boot uses one large inline strict script. A single duplicate declaration
// prevents the whole interface from appearing after the native avatar finishes.
const response=await frontend.fetch(new Request('https://boot-check.test/'));
assert.equal(response.status,200,'frontend HTML is served');
const html=await response.text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script&&script.length>100000,'generated app script exists');
new vm.Script(script,{filename:'mypocketai-embedded-app.js'});

// Wrangler/esbuild wraps nested parser helpers with __name(...) during
// production bundling. The inline WebView script must provide that helper.
const helperAt=script.indexOf('const __name=(target,value)=>');
const parserAt=script.indexOf('function parseJourneyExpression(');
assert.ok(helperAt>0&&parserAt>helperAt,
 'Embedded destination parser must include its esbuild name helper BEFORE the parser');
const helperLine=script.slice(helperAt,script.indexOf('\n',helperAt));
const named=vm.runInNewContext(helperLine+'\n__name((x)=>x.trim(), "cleanSuffix")');
assert.equal(named.name,'cleanSuffix','Production-style compiled helper is available');
assert.equal(named('  Basildon  '),'Basildon','Wrapped parser helper remains callable');

assert.ok(script.includes('function foreignStudyButton('),'languages button has isolated name');
assert.ok(script.includes('function languageOpen(stage)'),'language learning mounted');
assert.ok(script.includes('function scienceJourneyShowChoices(stage)'),'sciences preserved');
assert.ok(script.includes('function openLearningSubject(key)'),'education navigation preserved');
console.log('PASS frontend boot: generated inline JavaScript compiles without duplicate declarations');
