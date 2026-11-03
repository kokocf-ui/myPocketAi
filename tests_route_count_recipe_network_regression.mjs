import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import frontend from './index.js';

const backend=await fs.readFile(new URL('./backend.js',import.meta.url),'utf8');
const block=(source,start,end)=>{
 const a=source.indexOf(start),b=source.indexOf(end,a);
 assert.ok(a>=0&&b>a,'missing '+start);return source.slice(a,b);
};
const countCtx=vm.createContext({});
vm.runInContext(block(backend,'function requestedTransitCount(','function selectTransitAlternatives('),countCtx);
const requested=countCtx.requestedTransitCount;
assert.equal(requested('Vreau trei variante cu transportul public până la West Dulwich'),3);
assert.equal(requested('Arată 2 variante'),2);
assert.equal(requested('Alege o variantă'),1);
assert.equal(requested('Transport public',3),3,'handoff/refresh must preserve chosen count');
assert.equal(requested('Transport public'),4,'ordinary mode defaults to 4 at most');

const qualityCtx=vm.createContext({});
vm.runInContext(block(backend,'function recipeQualityConcern(','function removeRepeatedRecipeIngredients('),qualityCtx);
const plausible=qualityCtx.recipeQualityConcern;
assert.equal(plausible('Sarmale pentru 6 persoane','20 frunze de lemn sau țelină'),true);
assert.equal(plausible('Sarmale pentru 6 persoane','20 de frunze de varză murată, carne, orez'),false);
assert.equal(plausible('Supă de legume','Frunze de țelină în supă'),false,'celery is a valid herb in other dishes');
assert.ok(backend.includes('if(recipeInstruction&&result&&typeof result.response'));
assert.ok(backend.includes("if(recipeInstruction){"),'sourced culinary instructions must be used');
const recipePattern=backend.match(/const recipeInstruction = (\/.*?\/i)\.test\(normalizedResearchRequest\)/)?.[1];
assert.ok(recipePattern,'recipe intent detector must exist');
const isRecipe=new Function('text','return '+recipePattern+'.test(text.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase())');
assert.equal(isRecipe('Cum se prepară sarmalele românești tradiționale?'),true,'Romanian recipe intent must be detected');
assert.equal(isRecipe('Cum prepar sarmale?'),true);
assert.equal(isRecipe('Care sunt ingredientele pentru sarmale?'),true);
assert.equal(isRecipe('Ce evenimente sunt în Oradea?'),false);

const html=await(await frontend.fetch(new Request('https://pocket.test/'))).text();
const script=html.match(/<script[^>]*>([\s\S]*?)<\/script>/i)?.[1];
assert.ok(script,'generated application script missing');
new vm.Script(script);
const frontCtx=vm.createContext({});
vm.runInContext(block(script,'function requestedTransitCountInMessage(','async function submitMessage('),frontCtx);
assert.equal(frontCtx.requestedTransitCountInMessage('Vreau trei variante'),3);
assert.equal(frontCtx.requestedTransitCountInMessage('Arată-mi 2 variante'),2);
assert.equal(frontCtx.requestedTransitCountInMessage('Alege o variantă'),1);
assert.ok(script.includes('transit_count:source?.requested_transit_count'),'refresh count lost');
assert.ok(script.includes('transit_count:state.requestedTransitCount||undefined'),'assistant to transit handoff lost');
assert.ok(script.includes('Reîncearcă întrebarea'),'network interruption must offer a manual retry');
assert.ok(script.includes('Conexiunea cu serverul a fost întreruptă'),'raw Failed to fetch must not appear in user response');

assert.ok(backend.includes('eventResearchIntent?7500:9000'),'event research budget missing');
assert.ok(backend.includes('eventResearchIntent?1:recipeInstruction?4:2'),'bounded event and recipe fetch budget missing');
assert.ok(backend.includes('structured_list:structuredEvents?.structured_list'),'structured event table missing');

// Source-backed culinary regression: source retrieval, single model pass, no canned replacements.
const {default: recipeWorker}=await import('./backend.js');
const {webcrypto}=await import('node:crypto');
globalThis.crypto??=webcrypto;
const priorFetch=globalThis.fetch;
let culinaryCalls=0,sourceFetches=0;
let fixtureRecipeTitle='';
globalThis.fetch=async (request,options={})=>{
 const url=String(request);
 if(url.includes('api.exa.ai/search')){
  const query=String(JSON.parse(options.body||'{}').query||'').toLowerCase();
  fixtureRecipeTitle=query.includes('sarmal')?'Sarmale tradiționale':'Ciorbă de burtă tradițională';
  return Response.json({results:[{title:'Rețetă: '+fixtureRecipeTitle,url:'https://culinary-fixture.test/reteta',highlights:['Ingrediente: varză murată, carne, orez, burtă de vită. Mod de preparare: se fierbe până la gătirea completă.']}]});
 }
 if(url.includes('culinary-fixture.test')){sourceFetches++;return new Response('<html lang="ro"><body><h1>'+fixtureRecipeTitle+'</h1>Ingrediente: varză murată, carne, orez, burtă de vită, ceapă, smântână. Mod de preparare: se fierb legumele, carnea și orezul după rețeta respectivă.</body></html>',{status:200,headers:{'content-type':'text/html'}});}
 throw Error('Unexpected recipe fixture request: '+url);
};
try{
 const originalConsoleInfo=console.info;
 console.info=()=>{};
 try{
  for(const [question,unsafe,forbidden] of [
   ['Rețetă de sarmale tradițională românească','20 frunze de lemn, 700 g carne, 100 g orez','frunze de lemn'],
   ['Rețetă ciorbă de burtă tradițional românească','1 kg burtă de porc, 2 cepe, 1 litru apă','burtă de porc']
  ]){
   const ai={run:async()=>{culinaryCalls++;return {response:'Ingrediente: '+unsafe+'\\nPreparare: se fierb toate ingredientele.'}}};
   const response=await recipeWorker.fetch(new Request('https://fixture/api/chat',{method:'POST',body:JSON.stringify({
     message:question,module:'assistant',language:'ro',history:[],
     location:{latitude:51.49,longitude:0.28}
   })}),{AI:ai,EXA_API_KEY:'fixture'});
   const payload=await response.json();
   assert.equal(payload.status,'success');
   assert.equal(payload.recipe_grounding_status,'sourced');
   assert.equal(payload.latency_breakdown?.recipe_rejected,true,'unsafe cooking must be rejected');
   assert.equal(payload.latency_breakdown?.recipe_fallback_used,false,'fixed templates forbidden');
   assert.ok(!payload.reply.toLowerCase().includes(forbidden.toLowerCase()),'unsafe model response leaked');
   assert.equal(payload.sources?.length,1,'actual culinary source must be returned');
  }
 }finally{console.info=originalConsoleInfo}
}finally{globalThis.fetch=priorFetch}
assert.equal(culinaryCalls,2,'two recipes should need exactly one model pass each');
assert.ok(sourceFetches>=2,'recipe pages should be fetched for grounding');
assert.ok(!backend.includes('function reliableRecipeFallback('),'do not reintroduce fixed recipes');



// Real device regression: four journey starts were 22:04, 22:34, 22:26, 22:56.
// The 22:26 option must be before 22:34, despite later first-vehicle boarding.
const comparatorStart=script.indexOf('function compareTransitDisplayTimes(');
const comparatorEnd=script.indexOf('function feasibleTransitChoices(',comparatorStart);
assert.ok(comparatorStart>=0&&comparatorEnd>comparatorStart,'frontend transit chronological comparator missing');
const compareTransitDisplayTimes=new Function(script.slice(comparatorStart,comparatorEnd)+';return compareTransitDisplayTimes')();
const trip=(start,board,arrive)=>({
 startDateTime:'2026-11-02T'+start+':00Z',
 firstVehicleDepartureTime:'2026-11-02T'+board+':00Z',
 arrivalDateTime:'2026-11-03T'+arrive+':00Z',
 legs:[{mode:'walking',departureTime:'2026-11-02T'+start+':00Z'}]
});
const unsorted=[
 trip('22:04','22:06','00:24'),
 trip('22:34','22:36','00:26'),
 trip('22:26','22:51','00:52'),
 trip('22:56','23:21','00:22')
];
const ordered=[...unsorted].sort(compareTransitDisplayTimes);
assert.deepEqual(ordered.map(x=>x.startDateTime.slice(11,16)),['22:04','22:26','22:34','22:56']);
const ties=[
 {startDateTime:'2026-11-02T22:04:00Z',arrivalDateTime:'2026-11-03T00:25:00Z'},
 {startDateTime:'2026-11-02T22:04:00Z',arrivalDateTime:'2026-11-02T23:50:00Z'}
].sort(compareTransitDisplayTimes);
assert.equal(ties[0].arrivalDateTime,'2026-11-02T23:50:00Z','same departure should prefer earlier arrival');
assert.match(backend,/selected\.sort\(\(a,b\)=>\{[\s\S]*?j\.startDateTime\|\|legs\[0\]\?\.departureTime\|\|j\.firstVehicleDepartureTime/,'backend must sort by card departure');
assert.match(backend,/j\.arrivalDateTime\|\|legs\.at\(-1\)\?\.arrivalTime/,'backend must use arrival as tiebreaker');
assert.match(backend,/journeys\.sort\(\(a,b\)=>Date\.parse\(a\.startDateTime\)/,'MOTIS results must be chronological');

const techniqueStart=backend.indexOf('function recipeUnsupportedTechnique(');
const techniqueEnd=backend.indexOf('function recipeSourceMatchesDish(',techniqueStart);
assert.ok(techniqueStart>=0&&techniqueEnd>techniqueStart);
const unsupportedTechnique=new Function(backend.slice(techniqueStart,techniqueEnd)+';return recipeUnsupportedTechnique')();
const methodSource=[{publishedRecipes:[{instructions:['Modelează perișoare și fierbe-le direct în supă.']}]}];
assert.equal(unsupportedTechnique('Prăjește perișoarele înainte de fierbere.',methodSource),true,'unsupported frying must be rejected for any dish');
assert.equal(unsupportedTechnique('Fierbe perișoarele direct în supă.',methodSource),false,'published cooking method should pass');

// General lexical quality gate is supplementary to source grounding.
const qualityStart=backend.indexOf('function recipeQualityConcern(');
const qualityEnd=backend.indexOf('function removeRepeatedRecipeIngredients(',qualityStart);
assert.ok(qualityStart>=0&&qualityEnd>qualityStart);
const recipeQualityConcern=new Function(backend.slice(qualityStart,qualityEnd)+';return recipeQualityConcern')();
const dish='Rețetă ciorbă de burtă tradițională românească';
assert.equal(recipeQualityConcern(dish,'Ingrediente: 1 kg ficat de vită (burtă), 2 căni de apă.'),true);
assert.equal(recipeQualityConcern(dish,'Ingrediente: 1 kg burtă de vită, 250 g smântână.'),false);
assert.equal(recipeQualityConcern(dish,'Ingrediente: 1 cană de sare și 1 kg burtă de vită.'),true);
assert.equal(recipeQualityConcern('Ciorbă de burtă vegetariană cu ciuperci','Ingrediente: ficat de vită.'),false);

console.log('PASS: route count and chronology, frontend, sourced culinary pages, unsafe rejection, single model call, event budgets, network retry UI.');
