import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import frontend from './index.js';

const backend=await fs.readFile(new URL('./backend.js',import.meta.url),'utf8');
// A test fixture verifies rendering; it is NOT a recipe stored in the app.
const three=[1,2,3].map(i=>'Rețeta '+i+' — Preparat de test '+i+'\n\nIngrediente:\n- 500 g ingredient de test\n- 250 ml apă\n- Un praf de sare\n\nMod de preparare:\n1. Pregătește ingredientele.\n2. Gătește conform sursei.').join('\n\n────────────────\n\n');
assert.ok(!backend.includes('function traditionalBalmosRecipe('),'Individual recipe must not be hardcoded');
assert.ok(!backend.includes('function reliableRecipeFallback('),'Unsafe recipes must not be replaced with hardcoded ones');
assert.ok(backend.includes('const culinaryEvidence='),'Recipes must require culinary source evidence');
assert.ok(backend.includes('recipe_grounding_status'),'Source status must be surfaced');
assert.ok(backend.includes('const recipeTokenBudget=recipeInstruction?Math.min(3800'),'Token budget must scale for sourced recipes');
assert.ok(backend.includes('max_tokens: eventResearchIntent ? 2200 : recipeTokenBudget'),'Output token budget must be active');
const mark=backend.indexOf('function recipeQualityConcern(');
const end=backend.indexOf('function removeRepeatedRecipeIngredients(',mark);
assert.ok(mark>=0&&end>mark);
const quality=vm.runInNewContext(backend.slice(mark,end)+';recipeQualityConcern');
assert.equal(quality('3 rețete de balmoș','Ingrediente: 250g făină, cacao, zahăr. Preparare: coace la 180°C.'),true);
assert.equal(quality('sarmale tradiționale','20 frunze de lemn sau țelină'),true);

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
 {document:{createElement:tag=>new E(tag)},appendAnswerText:(node,value)=>{node.textContent=String(value)},recipeStepPresentation:(value)=>({title:'',body:String(value)})});
const host=new E('section');
assert.equal(reader(host,three),true);
const titles=host.children.filter(node=>node.tagName==='h3').map(node=>node.textContent);
assert.equal(titles.length,3,'All three recipe titles must render');
assert.ok(titles.every(s=>!s.includes('**')),'Markdown asterisks must not leak into headings');
assert.ok(host.children.filter(x=>x.tagName==='h4').length>=6,'Ingredients and preparation sections must remain readable');
console.log('Culinary sources required, fixed recipes removed, three sections render fully — PASS');
