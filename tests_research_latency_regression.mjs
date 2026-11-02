import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';

// Deterministic, no network or secrets required. Checks v158 budgets and regressions.
const backend = await fs.readFile(new URL('./backend.js', import.meta.url), 'utf8');
const frontend = await fs.readFile(new URL('./index.js', import.meta.url), 'utf8');
assert.match(backend, /const providerTasks = \[\];[\s\S]*?const researchStartedAt=Date\.now\(\)/);
assert.match(backend, /const settled=await Promise\.all\(providerTasks\)/, 'search providers must run concurrently');
assert.match(backend, /eventResearchIntent\?7500:9000/, 'Exa search deadline changed');
assert.match(backend, /eventResearchIntent\?7000:8500/, 'Brave search deadline changed');
assert.match(backend, /eventResearchIntent\?2000:3000/, 'source-page timeout changed');
assert.match(backend, /webSources\.slice\(0,eventResearchIntent\?1:2\)/, 'page fetch count changed');
assert.match(backend, /research_elapsed_ms:/, 'research latency missing from diagnostics');
assert.match(backend, /ai_execution_ms:/, 'AI latency missing from response');
assert.match(backend, /max_tokens: eventResearchIntent \? 2200 : 768/, 'full event lists may be truncated');
assert.match(backend, /structured_list:structuredEvents\?\.structured_list/, 'structured event table missing');
assert.match(frontend, /fetch\(CLIENT_CONFIG\.apiUrl/, 'client request path missing');

// Test calendar overlap and preservation of multiple independent events.
const first=backend.indexOf('function eventRowsFromReply(');
const last=backend.indexOf('// In long model-generated recipes',first);
assert.ok(first>=0&&last>first);
const context=vm.createContext({Date,Intl});
vm.runInContext(backend.slice(first,last),context);
const reply='Events:\n'+Array.from({length:12},(_,i)=>
  '- Concert '+(i+1)+' în Oradea, '+(i+1)+' decembrie 2026, ora 19:00.').join('\n')+
  '\n- Festival în altă lună, 18 noiembrie 2026.';
const parsed=context.eventRowsFromReply(reply,'Ce evenimente sunt organizate în Oradea în decembrie 2026?','ro');
assert.equal(parsed.structured_list.rows.length,12,'do not cap valid events to four');
assert.ok(!parsed.reply.includes('Festival în altă lună'));
assert.match(parsed.structured_list.rows[0].date,/1 decembrie/);
assert.match(parsed.structured_list.rows[11].date,/12 decembrie/);
console.log('PASS: v158 provider budgets, parallel search, research and AI timing, 12-event chronology, month filtering, table preserved.');
