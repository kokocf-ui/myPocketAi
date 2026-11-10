import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {parseCulinaryRequest,recipeDishKeywords,recipeSpeciesCompatible,culinarySearchQuery,humanizeRecipeDuration,humanizeRecipeServings} from './culinary_intent.mjs';
import {classifyAssistantFeedback,resolveRecipeFollowupComplaint,resolveRecipeRequestRecall,formatRecipeRequestRecall} from './social_feedback.mjs';
import {assembleSourcedRecipeVariants,recipeIngredientSignature,recipeQualityGate} from './culinary_multi.mjs';

for(const [message,quantity,expectedIntent] of [
 ['Dă-mi 3 rețete de guacamole',3,true],
 ['Găsește trei rețete de sarmale',3,true],
 ['Arată-mi o rețetă de sarmale',1,true],
 ['Te rog două variante de rețetă de guacamole',2,true],
 ['Give me three guacamole recipes',3,true],
 ['Cum se prepară ciorbă de burtă?',1,true],
 ['Caută-mi mai multe rețete de guacamole',10,true],
 ['Dă-mi mai multe rețete de guacamole',10,true],
 ['Give me several guacamole recipes',10,true],
 ['Unde este gara?',1,false],
 ['Ești varză',1,false]
]){
 const result=parseCulinaryRequest(message);
 assert.equal(result.count,quantity,message);
 assert.equal(result.isRecipe,expectedIntent,message);
}
for(const prompt of ['Găsește-mi trei rețete de guacamole','Caută-mi mai multe rețete de guacamole']){
 assert.deepEqual(recipeDishKeywords(prompt),['guacamole'],prompt);
 const search=culinarySearchQuery(prompt,'ro');
 assert.match(search,/^guacamole reteta ingrediente mod de preparare$/);
 assert.doesNotMatch(search,/cauta|gaseste|multe|trei/);
}
assert.deepEqual(recipeDishKeywords('Dă-mi 3 rețete de sarmale'),['sarmale']);

const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
assert.match(backend,/const recipeInstruction = culinaryRequest\.isRecipe/);
assert.match(backend,/const recipeRequestCount=culinaryRequest\.count/);
assert.match(backend,/const recipeCount=culinaryRequest\.count/);
assert.match(backend,/const localNameQuery=!nonPlaceFeedback&&!culinaryRequest\.isRecipe/);
assert.match(backend,/recipeInstruction\?culinarySearchQuery\(message,searchLanguage\)/);
assert.match(backend,/recipeInstruction\?Math\.min\(12,Math\.max\(5,culinaryRequest\.count\*3\)\):2/);

// The publisher matcher should ignore "more"/"mai multe", not reject
// genuine recipe pages merely because their titles omit search instructions.
const matchStart=backend.indexOf('function recipeSourceMatchesDish(');
const matchEnd=backend.indexOf('// Source-grounded publisher recipes',matchStart);
assert.ok(matchStart>=0&&matchEnd>matchStart);
const matchContext=vm.createContext({recipeDishKeywords,recipeSpeciesCompatible});
vm.runInContext(backend.slice(matchStart,matchEnd),matchContext);
for(const [query,dish,expected] of [
 ['Găsește-mi trei rețete de guacamole','Guacamole cu lămâie',true],
 ['Caută-mi mai multe rețete de guacamole','Guacamole clasic',true],
 ['Dă-mi 3 rețete de sarmale','Sarmale tradiționale',true],
 ['Caută o rețetă de guacamole','Sarmale cu porc',false]
]){
 const matches=vm.runInContext('recipeSourceMatchesDish('+JSON.stringify(query)+','+JSON.stringify({title:dish,publishedRecipes:[]})+')',matchContext);
 assert.equal(matches,expected,'Publisher must match request: '+query);
}

// The backend must not treat compliments/complaints as business names,
// including when the mobile app accidentally sends old cached coordinates.
const fbStart=backend.indexOf('const nonPlaceFeedback=');
const fbEnd=backend.indexOf(';',fbStart);
assert.ok(fbStart>=0&&fbEnd>fbStart,'backend feedback classifier');
const fbFn=new Function('message','const earlyIntentText=String(message).normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();'+backend.slice(fbStart,fbEnd+1)+'return nonPlaceFeedback');
for(const text of ['ești varză','esti varza','nu te pricepi','you are wrong'])assert.equal(fbFn(text),true,text);
for(const text of ['Aldi','Decathlon','Grays','unde este gara'])assert.equal(fbFn(text),false,text);

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
const casualEnd=index.indexOf('function requestUsesLocation(text){',uiEnd);
const locationEnd=index.indexOf('async function coordinatesForRequest(text){',casualEnd);
const needsStart=index.indexOf('function needsLocation(text){',locationEnd);
assert.ok(uiStart>=0&&uiEnd>uiStart&&casualEnd>uiEnd&&locationEnd>casualEnd);
const uiContext=vm.createContext({needsLocation:()=>false});
vm.runInContext(index.slice(uiStart,locationEnd),uiContext);
for(const sentence of ['Găsește-mi trei rețete de guacamole','Arată-mi o rețetă de sarmale','Find three guacamole recipes']){
 assert.equal(vm.runInContext('isRecipeQuestion('+JSON.stringify(sentence)+')',uiContext),true,sentence);
 assert.equal(vm.runInContext('requestUsesLocation('+JSON.stringify(sentence)+')',uiContext),false,sentence);
}
for(const sentence of ['ești varză','esti varza','nu te pricepi','you are wrong']){
 assert.equal(vm.runInContext('isCasualConversationReply('+JSON.stringify(sentence)+')',uiContext),true,sentence);
 assert.equal(vm.runInContext('requestUsesLocation('+JSON.stringify(sentence)+')',uiContext),false,sentence);
}
for(const place of ['Aldi','Decathlon'])assert.equal(vm.runInContext('isCasualConversationReply('+JSON.stringify(place)+')',uiContext),false,'a business name must not be social feedback: '+place);
// The index.js text is an HTML template; literal double-escaped regexes are resolved
// when the Worker serves the browser script, so do not evaluate its POI regex raw.
assert.match(index,/const locationIntent=!isRecipeQuestion\(text\)/);

for(const [text,expected] of [
 ['Ești varză','negative'],['esti varza','negative'],
 ['Nu te pricepi','negative'],['Ai greșit','negative'],
 ['Unde este Aldi?',null],['Ești pregătită să pleci?',null],
 ['Unde găsesc varză?',null],['sarmale',null],['salut',null]
])assert.equal(classifyAssistantFeedback(text),expected,'Feedback intent: '+text);
const socialPosition=backend.indexOf("if(classifyAssistantFeedback(message)==='negative')");
const oldHistoryPosition=backend.indexOf('const modelHistory=');
assert.ok(socialPosition>0&&oldHistoryPosition>socialPosition,
 'Direct criticism must return before reuse of lesson history or AI generation');
assert.match(backend,/reply:replies\[lang\]\|\|replies\.en/);
assert.match(backend,/const modelHistory=recipeInstruction&&culinaryRequest\.keywords\.length\?\[\]/);
for(const prompt of [
 'Dă-mi mai multe rețete de guacomole','Găsește 3 rețete de guacamol',
 'Vreau 3 rețete de guacamole'
]){
 assert.deepEqual(recipeDishKeywords(prompt),['guacamole'],'Correct common spelling: '+prompt);
 assert.match(culinarySearchQuery(prompt,'ro'),/^guacamole reteta ingrediente mod de preparare$/);
}
assert.equal(humanizeRecipeDuration('PT10M','ro'),'10 minute');
assert.equal(humanizeRecipeDuration('PT1H15M','ro'),'1 oră 15 minute');
assert.equal(humanizeRecipeServings('4, 4 porții','ro'),'4 porții');
assert.equal(humanizeRecipeServings('4','ro'),'Porții: 4');
const fmtStart=backend.indexOf('function formatPublishedRecipe(');
const fmtEnd=backend.indexOf('// Reformat only a real recipe section',fmtStart);
assert.ok(fmtStart>0&&fmtEnd>fmtStart);
const fmt=new Function('humanizeRecipeDuration','humanizeRecipeServings',
 backend.slice(fmtStart,fmtEnd)+'\nreturn formatPublishedRecipe;')(humanizeRecipeDuration,humanizeRecipeServings);
const samplePublished={name:'Guacamole',servings:'4, 4 porții',time:'PT10M',
 ingredients:['2 avocado','1 ceapă','1 lime'],
 instructions:['Se toacă ceapa.','Se zdrobește avocado și se amestecă.']};
const native=fmt(samplePublished,'ro',{title:'Guacamole',url:'https://example.org/guacamole'},1);
assert.ok(native.includes('4 porții'));
assert.ok(native.includes('Timp total: 10 minute'));
assert.ok(!native.includes('PT10M')&&!native.includes('4, 4 porții'));
assert.match(backend,/if\(recipeInstruction&&publishedSelected\.length>=recipeRequestCount\)/);
assert.match(backend,/if\(prepared\.length>=recipeRequestCount\)/);
assert.match(backend,/Exa:CookingEnglish/);
assert.match(backend,/const recipeBalanced=recipeInstruction/);
assert.match(backend,/pageText:recipeInstruction&&typeof x\.text==="string"/);
assert.match(backend,/pageFetchStatus="provider_extracted"/);
assert.match(backend,/\["fetched","provider_extracted"\]\.includes\(x\.pageFetchStatus\)/);
assert.match(backend,/providerExtractedRecipePages/);


const relevantHistory=[
 {role:'user',content:'Dă-mi 2 rețete de guacamole'},
 {role:'assistant',content:'Rețeta 1 — Guacamole clasic'},
 {role:'user',content:'Ești varză'},
 {role:'assistant',content:'Am răspuns pe lângă subiect. Ce anume vrei să corectez?'}
];
const complaint='Am cerut mai multe rețete și tu mi-ai oferit doar una';
assert.deepEqual(resolveRecipeFollowupComplaint(complaint,relevantHistory),{
 kind:'retry',dish:'guacamole',count:2,request:'Dă-mi 2 rețete de guacamole'
});
assert.deepEqual(resolveRecipeFollowupComplaint(complaint,[]),{kind:'clarify'});
assert.equal(resolveRecipeFollowupComplaint('Dă-mi trei rețete de guacamole',relevantHistory),null);
assert.deepEqual(resolveRecipeFollowupComplaint('Ți-am cerut 3 rețete și mi-ai dat numai una',[
 {role:'user',content:'Caută-mi trei rețete de sarmale'}
]),{kind:'retry',dish:'sarmale',count:3,request:'Dă-mi 3 rețete de sarmale'});
assert.match(backend,/const cookingCorrection=resolveRecipeFollowupComplaint\(message,data\.history\)/);
assert.match(backend,/if\(cookingCorrection\?\.kind==='retry'\)message=cookingCorrection\.request/);
assert.match(backend,/await assembleSourcedRecipeVariants\(/);
assert.match(backend,/delivered_recipe_count:result\.count/);
assert.match(backend,/requested_recipe_count:result\.requested/);
assert.match(backend,/const titleCandidates=lines\.slice\(0,firstIngredient\)/);

// Full recipes are composed from independent publisher evidence. The tested
// count is the number of COMPLETE ingredient and method sections, not the
// requested number repeated in a system instruction.
const makeRecipe=(name,items,url,num=1)=>[
 'Rețeta '+num+' — '+name,
 'Ingrediente:',
 ...items.map(x=>'- '+x),
 'Mod de preparare:',
 '1. Taie ingredientele în bucăți.',
 '2. Amestecă și servește preparatul.',
 'Sursa: '+url
].join('\n');
const items=[
 ['2 avocado','1 lime','1 ceapă roșie','1 roșie'],
 ['2 avocado','1 mango','1 lime','1 ardei iute'],
 ['2 avocado','2 linguri iaurt','1 castravete','1 lămâie']
];
const demo=[
 {url:'https://first.test/guacamole',title:'Guacamole clasic',pageEvidence:'Ingrediente și Mod de preparare'},
 {url:'https://second.test/mango',title:'Guacamole mango',pageEvidence:'Ingrediente și Mod de preparare'},
 {url:'https://third.test/iaurt',title:'Guacamole cu iaurt',pageEvidence:'Ingrediente și Mod de preparare'}
];
const fullResult=await assembleSourcedRecipeVariants({
 count:3,language:'ro',dish:'guacamole',sources:demo,
 published:[{source:demo[0],recipe:{name:'Guacamole clasic',ingredients:items[0]}}],
 renderPublished:(recipe,language,src,num)=>makeRecipe(recipe.name,recipe.ingredients,src.url,num),
 renderSource:async src=>{
  const pos=demo.findIndex(x=>x.url===src.url);
  return makeRecipe(src.title,items[pos],src.url);
 },
 validate:()=>true
});
assert.equal(fullResult.count,3);
assert.equal(fullResult.missing,0);
assert.equal((fullResult.reply.match(/^Rețeta \d+/gm)||[]).length,3);
assert.equal((fullResult.reply.match(/^Ingrediente:/gm)||[]).length,3);
assert.equal((fullResult.reply.match(/^Mod de preparare:/gm)||[]).length,3);
assert.equal(fullResult.sources.length,3);
assert.ok(!fullResult.reply.includes('Nu voi inventa restul'));
assert.equal(recipeIngredientSignature(fullResult.reply.split('────────────────')[0]).length,4);

const onlyOne=await assembleSourcedRecipeVariants({
 count:3,language:'ro',dish:'guacamole',sources:[demo[0]],
 published:[{source:demo[0],recipe:{ingredients:items[0]}}],
 renderPublished:(recipe,language,src,num)=>makeRecipe('Guacamole clasic',recipe.ingredients,src.url,num),
 renderSource:async()=>{throw Error('must not repeat the same publisher')},
 validate:()=>true
});
assert.equal(onlyOne.count,1);
assert.equal(onlyOne.requested,3);
assert.match(onlyOne.reply,/Am găsit 1 din cele 3 rețete cerute/);
assert.equal((onlyOne.reply.match(/^Rețeta \d+/gm)||[]).length,1);

const repeated=await assembleSourcedRecipeVariants({
 count:2,language:'ro',dish:'guacamole',sources:[demo[0],demo[1]],
 published:[],
 renderSource:async s=>makeRecipe(s.title,items[0],s.url),
 validate:()=>true
});
assert.equal(repeated.count,1,'same ingredient list must not count as a distinct variation');

const recallHistory=[
 {role:'user',content:'Dă-mi 3 rețete de sarmale'},
 {role:'assistant',content:'Rețeta 1 — Sarmale cu varză murată'},
 {role:'user',content:'Arată mai multe rețete de guacamole'},
 {role:'assistant',content:'Rețeta 1 — Guacamole'},
 {role:'user',content:'Câte rețete de sarmale am spus să îmi dai?'}
];
const recalled=resolveRecipeRequestRecall('Câte rețete de sarmale am spus să îmi dai?',recallHistory);
assert.equal(recalled?.kind,'found');
assert.equal(recalled.count,3);
assert.equal(recalled.dish,'sarmale');
assert.equal(recalled.original,'Dă-mi 3 rețete de sarmale');
assert.equal(formatRecipeRequestRecall(recalled,'ro'),'Mi-ai cerut 3 rețete de sarmale.');
const altRecall=resolveRecipeRequestRecall('Care a fost solicitarea mea cu privire la sarmale?',recallHistory);
assert.equal(altRecall?.count,3);
assert.equal(altRecall?.dish,'sarmale');
const guacRecall=resolveRecipeRequestRecall('Câte rețete de guacamole am cerut?',recallHistory);
assert.equal(guacRecall?.count,3);
assert.equal(guacRecall?.explicitCount,false);
assert.match(formatRecipeRequestRecall(guacRecall,'ro'),/Ai cerut mai multe rețete de guacamole/);
const unknown=resolveRecipeRequestRecall('Câte rețete de sarmale ți-am cerut?',[
 {role:'user',content:'Dă-mi 2 rețete de guacamole'}
]);
assert.equal(unknown?.kind,'not_found');
assert.equal(unknown.dish,'sarmale');
assert.match(formatRecipeRequestRecall(unknown,'ro'),/Nu găsesc/);
assert.equal(resolveRecipeRequestRecall('Dă-mi trei rețete de sarmale',recallHistory),null);
assert.equal(resolveRecipeRequestRecall('Câte rețete de sarmale există în România?',recallHistory),null);
assert.match(backend,/const recipeRecall=resolveRecipeRequestRecall\(message,data\.history\)/);
assert.ok(backend.indexOf('const recipeRecall=resolveRecipeRequestRecall(')<backend.indexOf('const cookingCorrection=resolveRecipeFollowupComplaint('));
assert.match(backend,/web_search_status:'not_needed',ai_connected:Boolean\(env\.AI\)/);

// The incomplete three-ingredient advertising-style "sarmale" response in
// the Android screenshot must not count as a verified second recipe.
const weakSarmale=[
 'Rețeta 1 — Sarmale tradiționale cu porc',
 'Ingrediente:',
 '- 1 kg Varză murată foi Drag de România',
 '- 500 g Carne tocată amestec Carrefour La Piață',
 '- 200 g Untură de gâscă',
 'Mod de preparare:',
 '1. Pregătește varza.',
 '2. Fierbe sarmalele.'
].join('\n');
assert.equal(recipeQualityGate(weakSarmale,'sarmale'),false);
const validSarmale=[
 'Rețeta 1 — Sarmale de post cu ciuperci',
 'Ingrediente:',
 '- 1 varză murată',
 '- 400 g ciuperci',
 '- 150 g orez',
 '- 2 cepe',
 '- 2 linguri ulei',
 '- 1 lingură boia',
 'Mod de preparare:',
 '1. Călește ceapa și amestecă umplutura.',
 '2. Înfășoară sarmalele în foi de varză și fierbe.'
].join('\n');
assert.equal(recipeQualityGate(validSarmale,'sarmale'),true);
const sellers=Array.from({length:7},(_,i)=>({
 url:'https://sursaculinara'+i+'.example/reteta-sarmale',
 title:'Sarmale variante '+i,pageEvidence:'Ingrediente și Mod de preparare'
}));
const callLog=[];
const extras=[
 ['1 varză murată','400 g ciuperci','150 g orez','2 cepe','2 linguri ulei'],
 ['1 varză murată','500 g carne de porc','150 g orez','2 cepe','2 linguri smântână'],
 ['5 foi de viță','600 g carne de vită','200 g orez','1 morcov','2 cepe'],
 ['1 varză murată','200 g păsat','2 cepe','1 morcov','2 linguri ulei']
];
const expanded=await assembleSourcedRecipeVariants({
 count:3,language:'ro',dish:'sarmale',sources:sellers,published:[],
 renderSource:async src=>{
  const i=sellers.findIndex(x=>x.url===src.url);callLog.push(i);
  if(i===0)return weakSarmale;
  if(i===1)return '';
  if(i===2)return validSarmale;
  if(i===3)return validSarmale;
  if(i===4||i===5)return makeRecipe('Sarmale '+i,extras[i-3],src.url);
  if(i===6)return makeRecipe('Sarmale cu păsat',extras[3],src.url);
  return '';
 },
 validate:()=>true
});
assert.equal(expanded.count,3,'Second evidence batch should recover distinct, complete recipes');
assert.ok(callLog.some(x=>x>=4),'Second batch should run when early sources are bad');
assert.equal((expanded.reply.match(/^Rețeta \d+/gm)||[]).length,3);
assert.equal(expanded.sources.length,3);
assert.equal(expanded.missing,0);
assert.ok(expanded.provenance.every(x=>x==='publisher_assisted'));

// A partial response must disclose the shortfall BEFORE a long recipe list.
assert.ok(onlyOne.reply.startsWith('Am găsit 1 din cele 3 rețete cerute'));

console.log('Culinary queries/counts, recipe source matching, social GPS guard and education navigation OK');
