import assert from 'node:assert/strict';
import vm from 'node:vm';
import {EXTRA_TOOLS_SIX_NAV_SCRIPT,EXTRA_TOOLS_SIX_NAV_STYLE} from './extra_tools_six_nav.mjs';
import {EXTRA_TOOLS_WORKSPACE_SCRIPT,EXTRA_TOOLS_WORKSPACE_STYLE} from './extra_tools_workspace.mjs';
import app from './index.js';

new vm.Script(EXTRA_TOOLS_SIX_NAV_SCRIPT);
new vm.Script(EXTRA_TOOLS_WORKSPACE_SCRIPT);
const groups=new Function(EXTRA_TOOLS_SIX_NAV_SCRIPT+';return EXTRA_TOOLS_V2_GROUPS;')();
assert.equal(groups.length,6);
assert.deepEqual(groups.map(x=>x.id),['docs','translate','studio','creator','analysis','ideas']);
assert.deepEqual(groups.find(x=>x.id==='docs').items.map(x=>x[0]),['documents','ocr','my-documents']);
assert.ok(groups.find(x=>x.id==='studio').items.some(x=>x[0]==='storybook'));
assert.ok(!groups.some(x=>['audio','web','ocr','my-documents'].includes(x.id)));
for(const group of groups){
 assert.ok(group.items.length);
 for(const item of group.items)assert.ok(item[2]&&item[3]&&item[4]);
}
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/if\(key==='storybook'\)/);
assert.match(EXTRA_TOOLS_WORKSPACE_SCRIPT,/extraToolsV2Storybook\(work,area,addPdf,input,primary,secondary,note\)/);
assert.match(EXTRA_TOOLS_SIX_NAV_SCRIPT,/speakText\(book\[index\]\.text\)/);
assert.match(EXTRA_TOOLS_SIX_NAV_SCRIPT,/module:'creative_storybook'/);
assert.match(EXTRA_TOOLS_SIX_NAV_SCRIPT,/data\.chapters\.length!==count/);
assert.doesNotMatch(EXTRA_TOOLS_SIX_NAV_SCRIPT,/await extraToolsAI\(instruction,raw\)/);
assert.match(EXTRA_TOOLS_SIX_NAV_STYLE,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.ok(EXTRA_TOOLS_WORKSPACE_STYLE.includes('extra-tools-v2'));
assert.match(EXTRA_TOOLS_SIX_NAV_STYLE,/align-items:center!important/);
assert.match(EXTRA_TOOLS_SIX_NAV_STYLE,/\.extra-storybook-page/);
const html=await (await app.fetch(new Request('https://tool-menu.test/'))).text();
const embedded=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(embedded);
new vm.Script(embedded);
assert.ok(embedded.includes('extraToolsV2Main'));
assert.ok(embedded.includes('extraToolsV2OpenGroup'));
assert.ok(embedded.includes('extraToolsV2Storybook'));
console.log('PASS six Tools categories, real nested cards, studio storybook and existing tools preserved');
