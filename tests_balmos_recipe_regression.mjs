import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import frontend from './index.js';

const backend=await fs.readFile(new URL('./backend.js',import.meta.url),'utf8');
const sourceStart=backend.indexOf('function traditionalBalmosRecipe(');
const sourceEnd=backend.indexOf('// Bounded safety fallback for the two recipes',sourceStart);
assert.ok(sourceStart>=0&&sourceEnd>sourceStart,'Verified balmoș recipe reference missing');
const balmos=vm.runInNewContext(backend.slice(sourceStart,sourceEnd)+';traditionalBalmosRecipe');

const standard=balmos('Vreau rețeta tradițională de balmoș','ro');
assert.ok(standard.includes('jintiță')&&standard.includes('mălai'));
assert.ok(standard.includes('brânză de burduf')&&standard.includes('unt gras'));
assert.ok(standard.includes('Mod de preparare:'));
assert.ok(standard.includes('5. '));
assert.ok(!/\b(?:zahăr|cacao|vanilie|ciocolată|bicarbonat)\b/i.test(standard),'No dessert ingredients');
const three=balmos('Vreau 3 rețete tradiționale de balmoș','ro');
assert.ok(three.length>2000,'Three recipes must be complete, not cut off');
for(const i of [1,2,3])assert.ok(three.includes('Rețeta '+i+' —'),'Missing recipe '+i);
assert.equal((three.match(/Mod de preparare:/g)||[]).length,3,'Each recipe needs its own method');
assert.equal((three.match(/Ingrediente:/g)||[]).length,3,'Each recipe needs its own ingredient list');
assert.ok(three.indexOf('Rețeta 3 —')>three.indexOf('Rețeta 2 —'));
assert.equal(balmos('Rețetă de balmoș fără lactoză','ro'),null,'Do not override allergies/dietary variations');
assert.equal(balmos('Vreau balmoș vegan','ro'),null,'Do not replace explicit dietary adaptation');
assert.equal(balmos('Cum se traduce balmoș?','ro'),null,'Translation requests are not recipes');
const en=balmos('Give me 3 recipes for traditional balmos','en');
assert.equal((en.match(/Recipe \d+ —/g)||[]).length,3,'English must remain English');
assert.ok(en.includes('cornmeal')&&en.includes('Method:'));
assert.ok(backend.includes('const recipeTokenBudget=recipeFastPath?Math.min(3800'), 'Recipe budget must scale by count');
assert.ok(backend.includes('max_tokens: eventResearchIntent ? 2200 : recipeTokenBudget'), 'Model output budget must be used, not just logged');
assert.ok(!backend.includes('recipeFastPath ? 620 : 768'), 'Insufficient 620-token recipe limit reinstated');

const mark=backend.indexOf('function recipeQualityConcern(');
const end=backend.indexOf('// Provenance: traditional Romanian balmoș recipe supplied',mark);
assert.ok(mark>=0&&end>mark);
const quality=vm.runInNewContext(backend.slice(mark,end)+';recipeQualityConcern');
assert.equal(quality('3 rețete de balmoș','Ingrediente: 250g făină, cacao, zahăr, ciocolată. Preparare: coace la 180°C.'),true);
assert.equal(quality('balmoș tradițional',standard),false);

const html=await(await frontend.fetch(new Request('https://pocket.test/'))).text();
const script=html.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script,'Generated frontend script missing');
new vm.Script(script);
const readerStart=script.indexOf('function appendRecipeReaderText(');
const readerEnd=script.indexOf('function answerExceedsFourLines(',readerStart);
assert.ok(readerStart>=0&&readerEnd>readerStart,'Recipe reader missing');
class E{
 constructor(tag){this.tagName=tag;this.children=[];this.textContent='';this.style={cssText:'',height:'',paddingLeft:'',margin:''}}
 append(...items){this.children.push(...items)}
}
const reader=vm.runInNewContext(script.slice(readerStart,readerEnd)+';appendRecipeReaderText',
 {document:{createElement:tag=>new E(tag)}});
const host=new E('section');
assert.equal(reader(host,three),true);
const titles=host.children.filter(node=>node.tagName==='h3').map(node=>node.textContent);
assert.equal(titles.length,3,'All three recipe titles must render');
assert.ok(titles.every(s=>!s.includes('**')),'Markdown asterisks must not leak into headings');
assert.ok(host.children.filter(x=>x.tagName==='h4').length>=6,'Ingredients and preparation sections must remain readable');
console.log('Balmoș integrity: authentic savory dish, three complete variants, enough tokens, formatted reader — PASS');
