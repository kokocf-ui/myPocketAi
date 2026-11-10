import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {parseCulinaryRequest,recipeDishKeywords,culinarySearchQuery,humanizeRecipeDuration,humanizeRecipeServings} from './culinary_intent.mjs';
import {classifyAssistantFeedback} from './social_feedback.mjs';

for(const [message,quantity,expectedIntent] of [
 ['Dă-mi 3 rețete de guacamole',3,true],
 ['Găsește trei rețete de sarmale',3,true],
 ['Arată-mi o rețetă de sarmale',1,true],
 ['Te rog două variante de rețetă de guacamole',2,true],
 ['Give me three guacamole recipes',3,true],
 ['Cum se prepară ciorbă de burtă?',1,true],
 ['Caută-mi mai multe rețete de guacamole',3,true],
 ['Dă-mi mai multe rețete de guacamole',3,true],
 ['Give me several guacamole recipes',3,true],
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
const matchContext=vm.createContext({recipeDishKeywords});
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
console.log('Culinary queries/counts, recipe source matching, social GPS guard and education navigation OK');
