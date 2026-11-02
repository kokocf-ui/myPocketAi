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
assert.ok(backend.includes("if(recipeInstruction&&!shouldSearchWeb)"),'normal recipe fast path must remain');
const recipePattern=backend.match(/const recipeInstruction = (\/.*?\/i)\.test\(normalizedResearchRequest\)/)?.[1];
assert.ok(recipePattern,'recipe intent detector must exist');
const isRecipe=new Function('text','return '+recipePattern+'.test(text.normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").toLowerCase())');
assert.equal(isRecipe('Cum se prepară sarmalele românești tradiționale?'),true,'Romanian recipe must bypass web research');
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
assert.ok(backend.includes('eventResearchIntent?1:2'),'event page fetch budget missing');
assert.ok(backend.includes('structured_list:structuredEvents?.structured_list'),'structured event table missing');

// Regression from real phone capture: 79.5 s due to two sequential AI calls.
// Reject visibly unsafe leaves on the first model output without a second inference.
const {default: recipeWorker}=await import('./backend.js');
const {webcrypto}=await import('node:crypto');
globalThis.crypto??=webcrypto;
const priorFetch=globalThis.fetch;
let culinaryCalls=0;
globalThis.fetch=async()=>{throw Error('recipe fast path must not access the web')};
try{
 const originalConsoleInfo=console.info;
 console.info=()=>{};
 try{
  for(const [question,unsafe,forbidden,expected] of [
   ['Rețetă de sarmale tradițională românească','20 frunze de lemn, 700 g carne, 100 g orez','frunze de lemn','varză murată'],
   ['Rețetă ciorbă de burtă tradițional românească','1 kg burtă de porc, 2 cepe, 1 litru apă','burtă de porc','burtă de vită']
  ]){
   const ai={run:async()=>{culinaryCalls++;return {response:'Ingrediente: '+unsafe+'\nPreparare: se fierb toate ingredientele.'}}};
   const response=await recipeWorker.fetch(new Request('https://fixture/api/chat',{method:'POST',body:JSON.stringify({
     message:question,module:'assistant',language:'ro',history:[],
     location:{latitude:51.49,longitude:0.28}
   })}),{AI:ai});
   const payload=await response.json();
   assert.equal(payload.status,'success');
   assert.equal(payload.latency_breakdown?.recipe_fallback_used,true,'unsafe recipe should use verified local fallback');
   assert.equal(payload.latency_breakdown?.recipe_correction_ms,0,'recipe must not use second AI call');
   assert.match(payload.reply,new RegExp(expected,'i'));
   assert.ok(!payload.reply.toLowerCase().includes(forbidden.toLowerCase()),'unsafe ingredient was not removed');
  }
 }finally{console.info=originalConsoleInfo}
}finally{globalThis.fetch=priorFetch}
assert.equal(culinaryCalls,2,'two recipes should require exactly one AI call each');
const fallbackStart=backend.indexOf('function reliableRecipeFallback(');
const fallbackEnd=backend.indexOf('function removeRepeatedRecipeIngredients(',fallbackStart);
assert.ok(fallbackStart>=0&&fallbackEnd>fallbackStart,'missing safe culinary fallback');
const fallback=new Function(backend.slice(fallbackStart,fallbackEnd)+';return reliableRecipeFallback')();
assert.equal(fallback('Sarmale vegetariene de post','ro'),null,'explicitly requested vegetarian variant must not become meat sarmale');
assert.equal(fallback('Variante moderne de sarmale','ro'),null,'modern variants must not become a traditional template');
assert.ok(fallback('Sarmale tradiționale românești','ro')?.includes('varză murată'));


console.log('PASS: requested route count (normal + handoff + refresh), generated frontend escaping, recipe ingredient checks, one-pass cooking, event search budget, network retry UI.');
