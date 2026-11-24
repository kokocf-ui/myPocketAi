import './tests_extra_fun_2026.mjs';
import './tests_fun_generator_2026.mjs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {EXTRA_TOOLS_SIX_NAV_SCRIPT,EXTRA_TOOLS_SIX_NAV_STYLE} from './extra_tools_six_nav.mjs';
import {EXTRA_TOOLS_WORKSPACE_SCRIPT,EXTRA_TOOLS_WORKSPACE_STYLE} from './extra_tools_workspace.mjs';
import app from './index.js';

new vm.Script(EXTRA_TOOLS_SIX_NAV_SCRIPT);
new vm.Script(EXTRA_TOOLS_WORKSPACE_SCRIPT);
const groups=new Function(EXTRA_TOOLS_SIX_NAV_SCRIPT+';return EXTRA_TOOLS_V2_GROUPS;')();
assert.equal(groups.length,4);
assert.deepEqual(groups.map(x=>x.id),['docs','creator','ideas','fun']);
assert.deepEqual(groups.find(x=>x.id==='fun').items.map(x=>x[0]),
 ['fun-astro','fun-maxim','fun-jokes','fun-puzzles']);
assert.deepEqual(groups.find(x=>x.id==='docs').items.map(x=>x[0]),['documents','ocr','my-documents']);
assert.ok(!groups.some(x=>x.items.some(item=>item[0]==='storybook')),
 'Failed mini-book must not appear in any user-visible Tools group');
assert.ok(!groups.some(x=>['studio','translate','analysis'].includes(x.id)),
 'Removed categories must not be present in the visible menu');
assert.ok(!groups.some(x=>['audio','web','ocr','my-documents'].includes(x.id)));
for(const group of groups){
 assert.ok(group.items.length);
 for(const item of group.items)assert.ok(item[2]&&item[3]&&item[4]);
}
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/if\(key==='storybook'\)return;/,
 'Retired mini-book must not reopen through a stale action');
assert.doesNotMatch(EXTRA_TOOLS_WORKSPACE_SCRIPT,/extraToolsV2Storybook|STORYBOOK_MOTION/);
assert.doesNotMatch(EXTRA_TOOLS_SIX_NAV_SCRIPT,/function extraToolsV2Storybook|extraStorybookMotionAttach/);
assert.match(EXTRA_TOOLS_SIX_NAV_STYLE,/grid-template-columns:minmax\(0,1fr\)!important/,
 'More tools must use full-width journey-style cards, not two columns');
assert.ok(EXTRA_TOOLS_WORKSPACE_STYLE.includes('extra-tools-v2'));
assert.ok(EXTRA_TOOLS_WORKSPACE_STYLE.includes('extra-fun-modal'),'Horoscope reading must use its own overlay');
assert.ok(EXTRA_TOOLS_WORKSPACE_STYLE.includes('extra-fun-viewport'),'Extra tools must scroll inside a fixed frame');
assert.doesNotMatch(EXTRA_TOOLS_WORKSPACE_SCRIPT,/panel\.scrollIntoView\(/,'Choosing a joke must never scroll the outer Tools viewport');
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/function funGeneratePuzzle/,'Rebus and integrame must be generated dynamically');
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/function funDenseProfiles/,'Dense crosswords must be built from constrained word intersections');
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/extra-fun-jokes-archive/,'Joke archive must be reachable through a scrollable dialog');
assert.doesNotMatch(EXTRA_TOOLS_WORKSPACE_SCRIPT,/Explică bancul/,'No unwanted jokes explanation action');
assert.doesNotMatch(EXTRA_TOOLS_WORKSPACE_SCRIPT,/const FUN_CROSSWORD_SETS=/,'No legacy four-board puzzle rotation remains');
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/funDailyForecast\(idx,dateKey,humor\)/,'Weekly and monthly horoscope must provide a forecast for each date');
assert.match(EXTRA_TOOLS_WORKSPACE_STYLE,/#15715e/,'Entertainment actions are green, leaving Home and Back unchanged');
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/Context astronomic/,'Horoscope retains real solar calculation without extra fields');
assert.match(EXTRA_TOOLS_SIX_NAV_STYLE,/align-items:center!important/);
const html=await (await app.fetch(new Request('https://tool-menu.test/'))).text();
const embedded=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(embedded);
new vm.Script(embedded);
assert.ok(embedded.includes('extraToolsV2Main'));
assert.ok(embedded.includes('extraToolsV2OpenGroup'));
assert.ok(!embedded.includes('extraToolsV2Storybook'));
assert.ok(!embedded.includes('extraStorybookMotionAttach'));
console.log('PASS four Tools categories, full-width illustrated cards, removed entries hidden');
