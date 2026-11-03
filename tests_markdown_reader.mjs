import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';

const html=await(await frontend.fetch(new Request('https://pocket.test/'))).text();
const source=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source,'Expected inline application script');
new vm.Script(source);
const start=source.indexOf('function appendAnswerText('),end=source.indexOf('function answerExceedsFourLines(',start);
assert.ok(start>=0&&end>start,'Missing reader formatting functions');

class Node{
 constructor(tag){this.tagName=tag;this.children=[];this.textContent='';this.style={};this.className=''}
 append(...items){this.children.push(...items)}
}
const document={createElement:t=>new Node(t),createTextNode:t=>({tagName:'#text',textContent:t})};
const context={document};vm.createContext(context);vm.runInContext(source.slice(start,end),context);
const flatten=x=>(x.textContent||'')+(x.children||[]).map(flatten).join('');

const normal=new Node('div');
context.appendAnswerText(normal,'**Timp de preparare:** 10 minute, **Ingrediente:** 500 g mălai. Sursa: https://example.org/a');
assert.equal(flatten(normal),'Timp de preparare: 10 minute, Ingrediente: 500 g mălai. Sursa: https://example.org/a');
assert.equal(normal.children.filter(x=>x.tagName==='strong').length,2);
assert.equal(normal.children.filter(x=>x.tagName==='a').length,1);
const security=new Node('div');
context.appendAnswerText(security,'<script>hello</script> **Sigur**');
assert.equal(security.children.filter(x=>x.tagName==='script').length,0);
assert.equal(flatten(security),'<script>hello</script> Sigur');

const recipe=new Node('section');
const input='**Rețeta 1 — Balmoș**\n\n**Ingrediente:**\n- 500 g mălai\n- 1 l lapte\n\n**Mod de preparare:**\n1. Adaugă mălaiul.\n2. Fierbe-l și amestecă.\n\n**Sursa:** https://example.org/b';
assert.equal(context.appendRecipeReaderText(recipe,input),true);
assert.ok(!flatten(recipe).includes('**'),'Markdown markers should not appear');
assert.equal(recipe.children.filter(x=>x.tagName==='h3').length,1);
assert.equal(recipe.children.filter(x=>x.tagName==='h4').length,2);
assert.equal(recipe.children.filter(x=>x.className==='recipe-reader-step').length,2);
assert.ok(flatten(recipe).includes('Sursa: https://example.org/b'));
console.log('PASS: bold Markdown rendered without visible markers in text and recipe reader; links and safe rendering preserved.');
