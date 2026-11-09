import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {EDUCATION_SCOPE_UI_SCRIPT} from './education_scope_ui.mjs';

new vm.Script(EDUCATION_SCOPE_UI_SCRIPT,{filename:'education-scope-ui.js'});
const api=new Function(EDUCATION_SCOPE_UI_SCRIPT+
 ';return {route:eduScopeIntent,prompt:eduScopePrompt,catalog:EDU_SCOPE_TEXT};')();
for(const [text,expected] of [
 ['Găsește-mi un hotel în Grays','travel'],
 ['Vreau un traseu cu mașina până la Victoria','maps'],
 ['Cum ajung la gara din Londra?','maps'],
 ['Adaugă lapte în lista de cumpărături','organize'],
 ['Cum va fi vremea mâine?','assistant'],
 ['Book a hotel in London','travel'],
 ['How do I get to Victoria station?','maps'],
 ['Trouve un restaurant à Paris','travel'],
 ['Jak dojade do Warszawy','maps'],
 ['Найди гостиницу рядом','travel'],
 ['Напомни завтра в календаре','organize'],
 ['Погода завтра','assistant'],
 ['Explică rolul hotelurilor în turism',null],
 ['Rezolvă o problemă despre un hotel',null],
 ['Explică-mi traseul unui râu',null],
 ['Caută informații despre hotelurile medievale',null],
 ['Explain the math behind navigation',null],
 ['Объясни, что такое гостиница',null]
]){
 assert.equal(api.route(text),expected,'Routing without academic false positives: '+text);
}
for(const lang of ['ro','en','fr','de','it','es','pt','nl','ru','pl']){
 assert.equal(api.catalog[lang].length,8,'All routing prompts exist in '+lang);
 assert.ok(api.catalog[lang].every(x=>typeof x==='string'&&x.trim()),'No empty routing strings: '+lang);
}
assert.match(api.prompt('Practice addition'),/EDU_SCOPE_REDIRECT/,'AI outputs may request cross-module routing');
assert.match(EDUCATION_SCOPE_UI_SCRIPT,/eduScopeBypass=eduScopeFold\(value\)/,'User can override false classification once');
assert.match(EDUCATION_SCOPE_UI_SCRIPT,/openModule\(key\);inputEl\.value=value/,'Transfer preserves the full question as a draft');
assert.match(EDUCATION_SCOPE_UI_SCRIPT,/dialog\.showModal\(\)/,'Transfer needs an explicit dialog choice');
assert.doesNotMatch(EDUCATION_SCOPE_UI_SCRIPT,/await submitMessage\(/,'No automatic sending in the destination');
const response=await frontend.fetch(new Request('https://education-scope-regression.test/'));
assert.equal(response.status,200);
const html=await response.text();
const client=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(client&&client.length>100000);
new vm.Script(client,{filename:'mypocket-education-scope-integrated.js'});
assert.match(client,/function eduScopeBeforeAI\(/,'Guard is included in the assembled client');
assert.match(client,/function eduScopeOffer\(/,'Confirming transfer UI is included');
assert.match(client,/if\(spoken&&eduScopeBeforeAI\(spoken/,'Foreign-language tutor checks the submitted question');
assert.match(client,/eduScopeBeforeAI\(editor\?\.value\?\.trim\(\)\|\|source/,'Mathematics input is checked');
assert.match(client,/eduScopeBeforeAI\(source,\(\)=>scienceWorkspaceRun\(mode\)\)/,'Sciences input is checked');
assert.match(client,/eduScopeBeforeAI\(assignment\|\|notes/,'Literature assignments are checked');
assert.match(client,/eduScopeBeforeAI\(editor\.value\.trim\(\),\(\)=>run\(mode\)\)/,'Computing input is checked');
assert.match(client,/eduScopeBeforeAI\(answer\.value\.trim\(\),\(\)=>generate\(mode\)\)/,'Exam input is checked');
assert.match(client,/eduScopeBeforeAI\(taskEntry\.value\.trim\(\),\(\)=>generate\(mode\)\)/,'Practical course input is checked');
assert.match(html,/\.education-scope-dialog\{/,'Routing dialog has mobile-safe styling');
console.log('PASS Education intent routing, ten UI languages, preserve drafts and assembled frontend syntax');
