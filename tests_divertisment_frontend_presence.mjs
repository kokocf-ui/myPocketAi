// Regression guard: "Divertisment" (More tools → Just for fun) must exist in the
// *served* frontend, not only in its source modules. A signed branch preview APK
// built from a branch without the Divertisment files froze a snapshot without
// it, so the module silently disappeared on the phone. This test runs on the
// exact HTML that Cloudflare serves and that build_android_ui_preview.mjs
// bundles, so neither production nor a branch snapshot can lose it again.
import assert from 'node:assert/strict';
import frontend from './index.js';

const response=await frontend.fetch(new Request('https://pocket.example/'));
assert.equal(response.status,200);
const html=await response.text();

// The fourth Tools category, with its four entries, in this order.
assert.match(html,/id:'fun',icon:'[^']+',ro:'Divertisment',en:'Just for fun'/,
 'Tools must list the Divertisment category');
for(const key of ['fun-astro','fun-maxim','fun-jokes','fun-puzzles'])
 assert.ok(html.includes("['"+key+"'"),'Divertisment entry missing: '+key);
// Category order stays docs → creator → ideas → fun (fun is not dropped).
const order=['docs','creator','ideas','fun'].map(id=>html.indexOf("{id:'"+id+"',icon:"));
assert.ok(order.every(i=>i>0),'All four Tools categories must be present');
assert.deepEqual([...order].sort((a,b)=>a-b),order,'Tools categories must keep their order');

// Routing and the four screens are bundled in the same page.
assert.match(html,/if\(key\.startsWith\('fun-'\)\)return extraFunOpen\(key\)/,
 'Divertisment cards must route to extraFunOpen');
for(const fn of ['function extraFunOpen(','function extraFunAstrology(','function extraFunMaxims(',
 'function extraFunJokes(','function extraFunGames(','function funGeneratePuzzle','function funDailyMaxim'])
 assert.ok(html.includes(fn),'Divertisment code missing from served frontend: '+fn);
// Single-column card layout (no return to the two-column grid) and own styles.
assert.match(html,/\.extra-tools-v2-grid\{display:grid!important;grid-template-columns:minmax\(0,1fr\)!important/,
 'Tools cards stay in a single column');
assert.ok(html.includes('extra-fun-viewport'),'Divertisment styles must be bundled');
console.log('PASS: Divertisment present in served frontend (4 entries, routing, screens, styles)');
