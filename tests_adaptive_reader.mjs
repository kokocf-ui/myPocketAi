import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
import {planPresentation} from './presentation.mjs';
const html=await(await frontend.fetch(new Request('https://test/'))).text();
const js=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(js);
new vm.Script(js);
const begin=js.indexOf('function appendAdaptivePresentation('),end=js.indexOf('function appendNewsCollectionTable(',begin);
assert.ok(begin>0&&end>begin);
class Node{
 constructor(tag){this.tag=tag;this.children=[];this.style={};this.scrollTop=0;this.textContent='';}
 append(...items){this.children.push(...items)}
 replaceChildren(...items){this.children=[...items]}
}
const context={document:{createElement:tag=>new Node(tag)},state:{language:'ro'},URL,Date};
vm.createContext(context);
vm.runInContext(js.slice(begin,end),context);
const plan=planPresentation({language:'ro',reply:'Știri internaționale',structured_list:{type:'news',rows:[
 {title:'Negocieri diplomatice',summary:'Reprezentanții discută acorduri',source_name:'Digi24',published_at:'2026-11-04',url:'https://digi24.ro/stiri/one'},
 {title:'Discuții regionale',summary:'A doua prezentare',source_name:'Interfax',published_at:'2026-11-04',url:'https://interfax.ru/news/two'}
]}});
const host=new Node('section');
assert.equal(context.appendAdaptivePresentation(host,{plan}),true);
const wrap=host.children.find(n=>n.tag==='div');
assert.ok(wrap);
const table=wrap.children.find(n=>n.tag==='table');
assert.ok(table);
const group=table.children.find(n=>n.tag==='colgroup');
assert.equal(group.children.length,2);
assert.match(group.children[0].style.cssText,/76%/);
assert.match(group.children[1].style.cssText,/24%/);
const rows=table.children.find(n=>n.tag==='tbody').children;
assert.equal(rows.length,2);
const button=rows[0].children[0].children[0];
button.onclick();
assert.ok(host.children.some(n=>n.tag==='a'&&n.href==='https://digi24.ro/stiri/one'));
assert.equal(host.children[0].tag,'button');
host.children[0].onclick();
assert.ok(host.children.some(n=>n.tag==='div'),'Back restores table');
const generic=planPresentation({language:'ro',reply:'',structured_list:{type:'other',rows:[{name:'A',price:'15'},{name:'B',price:'16'}]}});
const genericHost=new Node('div');
assert.equal(context.appendAdaptivePresentation(genericHost,{plan:generic}),true);
const list=planPresentation({language:'ro',reply:'- Unu\n- Doi\n- Trei'});
const listHost=new Node('div');
assert.equal(context.appendAdaptivePresentation(listHost,{plan:list}),true);
assert.equal(listHost.children[0].tag,'ol');
assert.equal(listHost.children[0].children.length,3);
const events=planPresentation({language:'ro',reply:'Calendar',structured_list:{type:'events',rows:[{date:'2026-11-04',description:'Concert',time:'19:00'}]}});
const protectedHost=new Node('div');
assert.equal(context.appendAdaptivePresentation(protectedHost,{plan:events}),false,'Specialized event calendar must remain active');
assert.match(js,/state\.lastPresentationResponse=data\.presentation/);
console.log('Adaptive presentation viewer: interactive article table, detail, back, generic table and list PASS');
