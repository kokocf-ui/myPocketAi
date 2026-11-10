import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {parseCulinaryRequest} from './culinary_intent.mjs';

for(const [message,quantity,expectedIntent] of [
 ['Dă-mi 3 rețete de guacamole',3,true],
 ['Găsește trei rețete de sarmale',3,true],
 ['Arată-mi o rețetă de sarmale',1,true],
 ['Te rog două variante de rețetă de guacamole',2,true],
 ['Give me three guacamole recipes',3,true],
 ['Cum se prepară ciorbă de burtă?',1,true],
 ['Unde este gara?',1,false]
]){
 const result=parseCulinaryRequest(message);
 assert.equal(result.count,quantity,message);
 assert.equal(result.isRecipe,expectedIntent,message);
}
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
assert.match(backend,/const recipeInstruction = culinaryRequest\.isRecipe/);
assert.match(backend,/const recipeRequestCount=culinaryRequest\.count/);
assert.match(backend,/const recipeCount=culinaryRequest\.count/);
assert.match(backend,/const localNameQuery=!culinaryRequest\.isRecipe/);
// Source matching must ignore words such as "găsește-mi" rather than
// rejecting every guacamole or sarmale publisher as an unrelated page.
const matchStart=backend.indexOf('function recipeSourceMatchesDish(');
const matchEnd=backend.indexOf('// Source-grounded publisher recipes',matchStart);
assert.ok(matchStart>=0&&matchEnd>matchStart);
const matchContext=vm.createContext({});
vm.runInContext(backend.slice(matchStart,matchEnd),matchContext);
for(const [query,dish] of [
 ['Găsește-mi trei rețete de guacamole','Guacamole cu lămâie'],
 ['Arată-mi 3 rețete de sarmale','Sarmale tradiționale'],
 ['Caută o rețetă de guacamole','Guacamole clasic']
]){
 const matches=vm.runInContext('recipeSourceMatchesDish('+JSON.stringify(query)+','+JSON.stringify({title:dish,publishedRecipes:[]})+')',matchContext);
 assert.equal(matches,true,'Publisher must match request: '+query);
}
const start=backend.indexOf('function normalizeSingleCulinaryAnswer(');
const end=backend.indexOf('// In long model-generated recipes',start);
assert.ok(start>=0&&end>start);
const ctx=vm.createContext({});
vm.runInContext(backend.slice(start,end),ctx);
const names=['Guacamole cu roșii','Guacamole cu ceapă','Guacamole cu ardei'];
const sample=names.map((name,i)=>[
 'Rețeta '+(i+1)+' — '+name,'Ingrediente:','- 2 avocado','- 1 lime','- 1 roșie',
 'Mod de preparare:','1. Taie ingredientele.','2. Amestecă ingredientele.',
 'Sursa: https://example.org/guacamole-'+(i+1)
].join('\n')).join('\n\n');
const normalized=vm.runInContext('normalizeCulinaryAnswer('+JSON.stringify(sample)+',"ro")',ctx);
assert.ok(normalized,'multiple complete recipes should validate');
assert.equal((normalized.match(/^Rețeta \d+/gm)||[]).length,3);
assert.equal((normalized.match(/^Ingrediente:/gm)||[]).length,3);
assert.equal((normalized.match(/^Mod de preparare:/gm)||[]).length,3);
const index=readFileSync(new URL('./index.js',import.meta.url),'utf8');
assert.doesNotMatch(index,/height:clamp\(355px,62dvh,540px\)!important/);
for(const [key,fn] of [['learning-literature','litBack'],['learning-hg','hgBack'],['learning-languages','languageBack']]){
 assert.ok(index.includes("root.classList.contains('"+key+"')){"+fn+"();return true}"),key+' must honor Android Back within its study levels');
}
const uiStart=index.indexOf('function isRecipeQuestion(text){');
const uiEnd=index.indexOf('// Keep small talk out of location and pending-route flows.',uiStart);
assert.ok(uiStart>=0&&uiEnd>uiStart,'frontend culinary classifier must be present');
const uiContext=vm.createContext({});
vm.runInContext(index.slice(uiStart,uiEnd),uiContext);
for(const sentence of ['Găsește-mi trei rețete de guacamole','Arată-mi o rețetă de sarmale','Find three guacamole recipes']){
 assert.equal(vm.runInContext('isRecipeQuestion('+JSON.stringify(sentence)+')',uiContext),true,sentence);
}
assert.match(index,/const locationIntent=!isRecipeQuestion\(text\)/);
console.log('Culinary intent, multi-recipe preservation and education navigation checks passed');
