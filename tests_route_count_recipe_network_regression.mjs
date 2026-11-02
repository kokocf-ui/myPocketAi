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

assert.ok(backend.includes('eventResearchIntent?9500:14000'),'event research budget missing');
assert.ok(backend.includes('eventResearchIntent?2:3'),'event page fetch budget missing');
assert.ok(backend.includes('structured_list:structuredEvents?.structured_list'),'structured event table missing');
console.log('PASS: requested route count (normal + handoff + refresh), generated frontend escaping, recipe ingredient checks, one-pass cooking, event search budget, network retry UI.');
