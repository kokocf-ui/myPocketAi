import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import worker from './backend.js';

const backend=await fs.readFile(new URL('./backend.js',import.meta.url),'utf8');
const start=backend.indexOf('function formatPublishedRecipe(');
const end=backend.indexOf('// In long model-generated recipes',start);
assert.ok(start>=0&&end>start);
const ctx=vm.createContext({});
vm.runInContext(backend.slice(start,end),ctx);

const text=`Ciorbă de perișoare este o supă caracterizată prin mici mici de carne într-un bulion tangajos.
Rețeta de ciorbă de perișoare este foarte variată.

**Rețetă de ciorbă de perișoare**
Ingrediente:
* 3 linguri orez
* 1 morcov
* 3 linguri de orez
* 500 g carne tocată
Mod de preparare:
1. Pregătește legumele.
2. Pune perișoarele în ciorba care fierbe.
Sursa: https://culinary.example/reteta`;
const cleaned=ctx.normalizeCulinaryAnswer(text,'ro');
assert.ok(cleaned.startsWith('Rețetă de ciorbă de perișoare'),'No preamble before the recipe');
assert.equal((cleaned.match(/orez/g)||[]).length,1,'Equivalent ingredient quantities must not be repeated');
assert.ok(!cleaned.includes('bulion tangajos'),'Unrelated introduction must not leak');
assert.ok(!cleaned.includes('**'),'Raw Markdown title markers must be removed');
assert.ok(cleaned.includes('1. Pregătește legumele.'));
assert.equal(ctx.normalizeCulinaryAnswer('Ingrediente: carne, orez, morcov. Preparare: amestecă tot.', 'ro'),null,'Reject essay instead of structured recipe');
const published={name:'Ciorbă de perișoare',ingredients:['500 g carne tocată','3 linguri orez','1 ou','2 morcovi'],instructions:['Amestecă ingredientele și formează perișoare.','Fierbe perișoarele direct în ciorbă.'],servings:'6 porții'};
const publisher=ctx.formatPublishedRecipe(published,'ro',{title:'Ciorbă de perișoare',url:'https://culinary.example/reteta'});
assert.match(publisher,/Mod de preparare:\n1\. /);
assert.match(publisher,/Sursa: https:\/\/culinary.example\/reteta/);
assert.equal((publisher.match(/Ingrediente:/g)||[]).length,1);
assert.equal((publisher.match(/Mod de preparare:/g)||[]).length,1);

const priorFetch=globalThis.fetch,priorInfo=console.info;
let modelCalls=0;
const jsonLd={'@context':'https://schema.org','@type':'Recipe',name:published.name,recipeIngredient:published.ingredients,recipeInstructions:published.instructions.map(step=>({'@type':'HowToStep',text:step})),recipeYield:'6 porții'};
globalThis.fetch=async input=>{
 const url=String(input);
 if(url.includes('api.exa.ai/search'))return Response.json({results:[{title:'Ciorbă de perișoare',url:'https://culinary.example/reteta',highlights:['Ingrediente: carne tocată, orez, ou, morcovi. Mod de preparare: fierbe perișoarele în ciorbă.']}]});
 if(url.includes('culinary.example'))return new Response('<html lang="ro-RO"><script type="application/ld+json">'+JSON.stringify(jsonLd)+'</script><h1>Ciorbă de perișoare</h1>Ingrediente: carne, orez, ou. Mod de preparare: fierbere în supă.</html>',{headers:{'content-type':'text/html'}});
 throw Error('Unexpected test URL: '+url);
};
console.info=()=>{};
try{
 const response=await worker.fetch(new Request('https://fixture.test/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Rețetă de ciorbă de perișoare',language:'ro',module:'assistant',history:[]})}),{EXA_API_KEY:'test',AI:{run:async()=>{modelCalls++;return {response:'bulion tangajos'}}}});
 const data=await response.json();
 assert.equal(data.status,'success');
 assert.equal(data.version,'v177');
 assert.equal(data.recipe_grounding_status,'publisher_structured');
 assert.equal(modelCalls,0,'Do not hallucinate when the source itself provides a complete recipe');
 assert.match(data.reply,/Fierbe perișoarele direct în ciorbă/);
 assert.doesNotMatch(data.reply,/bulion tangajos/);
 assert.equal(data.sources?.length,1);
}finally{globalThis.fetch=priorFetch;console.info=priorInfo}

console.log('PASS: publisher steps rendered without model hallucination; repeated ingredients and essay preamble removed; incomplete recipes rejected.');
