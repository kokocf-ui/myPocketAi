import assert from 'node:assert/strict';
import vm from 'node:vm';
import frontend from './index.js';
const html=await(await frontend.fetch(new Request('https://fixture.test/'))).text();
const source=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(source);
new vm.Script(source);
const start=source.indexOf('function appendAnswerText('),end=source.indexOf('function answerExceedsFourLines(',start);
assert.ok(start>=0&&end>start);
class E{
 constructor(tag){this.tagName=tag;this.className='';this.style={};this.children=[];this.textContent=''}
 append(...items){this.children.push(...items)}
}
const document={createElement:t=>new E(t),createTextNode:text=>({tagName:'#text',textContent:text})};
const ctx={document};vm.createContext(ctx);vm.runInContext(source.slice(start,end),ctx);
const flatten=node=>(node.textContent||'')+(node.children||[]).map(flatten).join('');
const sample='Rețeta 1 — Ciorbă de burtă\n\nIngrediente:\n- 1 kg burtă\n- 2,5 l apă\n\nMod de preparare:\n1. Fierbeți oasele de vităPuneți oasele de vită la fiert în apă.Indepărtați spuma.\n2. Adăugați usturoiulPresați usturoiul și amestecați-l cu apă rece.\n3. Dregeți ciorba cu smântână și gălbenușuriOpriți focul.Într-un castron amestecați.';
const host=new E('section');
assert.equal(ctx.appendRecipeReaderText(host,sample),true);
const steps=host.children.filter(x=>x.className==='recipe-reader-step');
assert.equal(steps.length,3);
assert.deepEqual(steps.map(x=>flatten(x.children[0])),[
 '1. Fierbeți oasele de vită','2. Adăugați usturoiul','3. Dregeți ciorba cu smântână și gălbenușuri'
]);
assert.ok(flatten(steps[0].children[1]).startsWith('Puneți oasele de vită'));
assert.ok(flatten(steps[0]).includes('apă. Indepărtați'));
assert.ok(flatten(steps[2]).includes('Opriți focul. Într-un castron'));
assert.equal(host.children.filter(x=>x.className==='recipe-reader-ingredient').length,2);
assert.equal(ctx.recipeStepPresentation('4. Puneți sare și amestecați.').title,undefined);
assert.equal(ctx.recipeStepPresentation('4. Puneți sare și amestecați.').body,'4. Puneți sare și amestecați.');
console.log('PASS: step headings and body text are separated without modifying source facts or recipe content.');
