import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';

// A regression guard for history reuse. Do not touch the production shopping UI.
const html=await(await frontend.fetch(new Request('https://shopping-regression.test/'))).text();
const script=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'frontend script is present');
new vm.Script(script);
assert.match(script,/shoppingPendingAction=\{type:'deleteArchived',historyIndex,entryId:entry\.id\|\|null\}/);
assert.match(script,/shoppingPendingAction=\{type:'reuse',historyIndex,onlyUnchecked:true\}/);
assert.match(script,/selected\.map\(i=>shopNewItem\(i\.name,i\.quantity,i\.unit\)\)/,
 'reuse creates unchecked copies rather than mutating archived purchases');
assert.match(script,/if\(data\.items\.length\)\{notify\(shopLabel\('Arhivează întâi lista activă\.'/,
 'active list requires explicit archiving before history reuse');
assert.match(script,/approve\.disabled=!entry\|\|selected\.length===0\|\|data\.items\.length>0/);
assert.match(script,/data\.history\.splice\(historyIndex,1\)/,'archived deletion removes only the selected archived list');
assert.match(script,/footer\.append\(archive,history\)/,'active view has only archive/history actions');
assert.doesNotMatch(script,/footer\.append\(add,archive,history\)/,'no redundant add-item action in active table');


const start=script.indexOf('function shopId(){');
const end=script.indexOf('function renderShoppingList(){',start);
assert.ok(start>=0&&end>start);
const ctx=vm.createContext({Math,Date,learningLabel:(ro)=>ro,localStorage:{},document:{}});
vm.runInContext(script.slice(start,end),ctx);
const run=code=>vm.runInContext(code,ctx);
const archive=run("shopNormalizeData({currentName:'Săptămâna trecută',items:[{name:'Lapte',quantity:'2',unit:'l',checked:true,checkedAt:'2026-11-05T12:00:00Z'},{name:'Pâine',quantity:'1',unit:'buc',checked:false}]})");
ctx.data=archive;
run("shopArchive(data,'completed')");
assert.equal(archive.history[0].items.length,2);
assert.equal(archive.history[0].items[0].checked,true);
assert.equal(archive.history[0].items[1].checked,false);
assert.equal(archive.items.length,0);
ctx.archived=archive.history[0];
const selected=run("archived.items.filter(i=>!i.checked).map(i=>shopNewItem(i.name,i.quantity,i.unit))");
assert.equal(selected.length,1);
assert.equal(selected[0].name,'Pâine');
assert.equal(selected[0].checked,false);
assert.equal(selected[0].checkedAt,null);
assert.equal(archive.history[0].items[0].checked,true,'old history remains intact');
assert.equal(run('shopValidateQuantity("2,5")'),true);
assert.equal(run('shopValidateQuantity("0")'),false);
console.log('PASS: archived shopping history reuse, manual check preservation, quantity validation');
