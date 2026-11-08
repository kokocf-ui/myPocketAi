import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://science-smoke.test/'))).text();
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1]||'';
new vm.Script(script);
const begin=script.indexOf('async function scienceWorkspaceRun(mode)');
const end=script.indexOf('function sciencePhotoReview(',begin);
const run=script.slice(begin,end);
assert.ok(begin>0&&end>begin);
for(const [term,reason] of [
 ["scienceShowResult(learningLabel('Exercițiu lipsă'","empty user input is acknowledged"],
 ["scienceShowResult(learningLabel('Chimie · date de verificat'","invalid input is acknowledged"],
 ["scienceShowResult(mode==='solve'","request starts with a visible status dialog"],
 ["scienceShowResult(learningLabel('Rezolvare indisponibilă'","request failures are visible"],
 ["if(scienceRequestController)","duplicate pending requests guarded"]
])assert.ok(run.includes(term),reason);
assert.ok(script.includes("['Indici','₀ ₁ ₂ ₃ ₄ ₅ ₆ ₇ ₈ ₉']"));
assert.ok(script.includes("['Ioni','⁺ ⁻ ²⁺ ³⁺ ²⁻ ³⁻']"));
assert.ok(script.includes("['Stări','(s) (l) (g) (aq)']"));
assert.ok(script.includes('section.append(collection);tray.append(section)'));
assert.match(html,/\.science-symbol-tray:not\(\[hidden\]\)/);
assert.match(html,/max-height:min\(39dvh,290px\)/);
console.log('PASS: science resolution visible empty/invalid/loading/error feedback; chemistry extended symbols scroll and insertion');
