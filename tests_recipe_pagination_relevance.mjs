import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseCulinaryRequest,recipeSpeciesCompatible} from './culinary_intent.mjs';
import {recipeQualityGate,assembleSourcedRecipeVariants} from './culinary_multi.mjs';
import {parseRecipePages,RECIPE_READER_PAGES_UI_SCRIPT} from './recipe_reader_pages_ui.mjs';
import {classifyConversationTurn} from './conversation_intent.mjs';

const free=parseCulinaryRequest('Arată mai multe rețete cu piept de pui');
assert.equal(free.openEnded,true);
assert.equal(free.explicitCount,false);
assert.ok(free.count>3,'indefinite multi-recipe queries must not default to three');
assert.equal(parseCulinaryRequest('Dă-mi 4 rețete de guacamole').count,4);
assert.equal(parseCulinaryRequest('Dă-mi 3 rețete de sarmale').count,3);
assert.equal(parseCulinaryRequest('Dă-mi 4 rețete de guacamole').openEnded,false);
assert.equal(recipeSpeciesCompatible('piept de pui','Piept de pui cu legume'),true);
assert.equal(recipeSpeciesCompatible('piept de pui','Piept de rață cu portocale'),false);
assert.equal(recipeSpeciesCompatible('piept de pui','Piept de rata caramelizat'),false);
assert.equal(recipeSpeciesCompatible('piept de rață','Piept de pui la grătar'),false);
assert.equal(recipeSpeciesCompatible('sarmale','Sarmale tradiționale cu varză'),true);
assert.equal(classifyConversationTurn('Păi, dacă cer rețete cu piept de pui, de ce îmi arăți rețeta cu piept de rață?')?.kind,'correction');
assert.equal(classifyConversationTurn('Dă-mi trei rețete cu piept de pui'),null);
assert.equal(classifyConversationTurn('Vroiam să te întreb ce rețete culinare am cerut azi?')?.kind,'reference');

const good=[
 'Rețeta 1 — Piept de pui cu legume','Ingrediente:',
 '- 2 piepturi de pui','- 2 morcovi','- 2 ardei','- 1 ceapă','Mod de preparare:',
 '1. Taie carnea și legumele.','2. Gătește până sunt bine făcute.'
].join('\n');
const wrong=good.replaceAll('pui','rață');
assert.ok(recipeQualityGate(good,'piept de pui'));
assert.equal(recipeQualityGate(wrong,'piept de pui'),false);
const source={title:'Piept de rață cu sos de portocale',url:'https://publisher.example/duck'};
const rejected=await assembleSourcedRecipeVariants({
 count:4,openEnded:false,language:'ro',dish:'piept de pui',sources:[{...source,pageEvidence:'ingrediente'}],published:[],
 renderSource:async()=>wrong,validate:()=>true
});
assert.equal(rejected.count,0,'duck recipes must not be counted as chicken');
const open=await assembleSourcedRecipeVariants({
 count:10,openEnded:true,language:'ro',dish:'piept de pui',sources:[],published:[],
 validate:()=>true
});
assert.doesNotMatch(open.reply,/din cele 10 rețete cerute/);
const recipeText=[
 'Am găsit 4 variante.','',
 'Rețeta 1 — Guacamole clasic','Ingrediente:','- 2 avocado','Mod de preparare:','1. Amestecă.','','────────────────','',
 'Rețeta 2 — Guacamole picant','Ingrediente:','- 2 avocado','- 1 ardei','Mod de preparare:','1. Amestecă.','','────────────────','',
 'Rețeta 3 — Guacamole cu mango','Ingrediente:','- 2 avocado','- 1 mango','Mod de preparare:','1. Amestecă.','','────────────────','',
 'Rețeta 4 — Guacamole cu iaurt','Ingrediente:','- 2 avocado','- 2 linguri iaurt','Mod de preparare:','1. Amestecă.'
].join('\n');
const parsed=parseRecipePages(recipeText);
assert.equal(parsed.pages.length,4);
assert.equal(parsed.pages[0].title,'Guacamole clasic');
assert.equal(parsed.pages[3].title,'Guacamole cu iaurt');
assert.match(parsed.intro,/4 variante/);
assert.ok(parsed.pages.every((page,i)=>page.number===i+1&&page.text.includes('Ingrediente:')));
assert.equal(parseRecipePages('Rețeta 1 — Unică\nIngrediente:\n- 1 ingredient').pages.length,0);
assert.match(RECIPE_READER_PAGES_UI_SCRIPT,/layer\.insertBefore\(nav,body\)/);
assert.match(RECIPE_READER_PAGES_UI_SCRIPT,/body\.scrollTop=0/);
assert.match(RECIPE_READER_PAGES_UI_SCRIPT,/Anterioara/);
assert.match(RECIPE_READER_PAGES_UI_SCRIPT,/Următoarea/);
const html=readFileSync(new URL('./index.js',import.meta.url),'utf8');
assert.match(html,/RECIPE_READER_PAGES_UI_SCRIPT/);
assert.match(html,/recipePaged=renderRecipePages/);
assert.match(html,/let running=!recipePaged/);
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
assert.match(backend,/recipeSpeciesCompatible\(request,title\)/);
assert.match(backend,/openEnded:culinaryRequest\.openEnded/);
console.log('Unbounded plural recipe intent, ingredient relevance and recipe reader pages passed');
