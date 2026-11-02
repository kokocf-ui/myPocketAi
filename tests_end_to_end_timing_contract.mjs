import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import frontend from './index.js';
const backend=await fs.readFile(new URL('./backend.js',import.meta.url),'utf8');
const front=await fs.readFile(new URL('./index.js',import.meta.url),'utf8');
const html=await(await frontend.fetch(new Request('https://pocket.test/'))).text();
const js=html.match(/<script[^>]*>([\s\S]*?)<\/script>/i)?.[1];
assert.ok(js,'missing generated UI script');
new vm.Script(js);
assert.match(backend,/const requestStartMs=Date\.now\(\)/);
assert.match(backend,/server_total_ms=Date\.now\(\)-requestStartMs/);
assert.match(backend,/Server-Timing/);
assert.match(backend,/research_elapsed_ms:/);
assert.match(backend,/primary_ai_ms:/);
assert.match(backend,/review_ai_ms:/);
assert.match(backend,/recipe_correction_ms:/);
assert.match(backend,/event_pipeline_diagnostics:eventPipelineDiagnostics/);
assert.match(backend,/model_list_markers:/);
assert.match(backend,/structured_event_count:/);
assert.match(backend,/replace\(\/\\btripe\\b\/giu,'burtă'\)/);
assert.match(front,/time_to_headers_ms:/);
assert.match(front,/response_read_ms:/);
assert.match(front,/api_elapsed_ms:/);
assert.match(front,/gps_ms:/);
assert.match(front,/server_total_ms:/);
const a=backend.indexOf('function recipeQualityConcern('),b=backend.indexOf('function removeRepeatedRecipeIngredients(',a);
assert.ok(a>0&&b>a);
const culinary=new Function(backend.slice(a,b)+';return recipeQualityConcern')();
assert.equal(culinary('Rețetă ciorbă de burtă românească','Se folosește 1 kg burtă de porc.'),true);
assert.equal(culinary('Rețetă ciorbă de burtă românească','Se folosește 1 kg burtă de vită.'),false);
assert.equal(culinary('Sarmale românești','Se folosesc frunze de lemn.'),true);

// A model change is effective only when a real Worker request uses it.
// Test both the faster default and an operator-controlled rollback without any external API calls.
const {default: worker}=await import('./backend.js');
const {webcrypto}=await import('node:crypto');
globalThis.crypto??=webcrypto;
const seenModels=[];
for(const [override,expected] of [
  [undefined,'@cf/meta/llama-3.1-8b-instruct-fast'],
  ['@cf/meta/llama-3.1-8b-instruct-fp8','@cf/meta/llama-3.1-8b-instruct-fp8']
]){
 const env={AI:{run:async model=>{
   seenModels.push(model);
   return {response:'Ingrediente: 700 g carne, 120 g orez, 20 de foi de varză murată. Preparare: se învelesc în varză și se fierb la foc mic până sunt complet gătite.'};
 }}};
 if(override)env.POCKET_AI_TEXT_MODEL=override;
 const req=new Request('https://fixture/api/chat',{method:'POST',body:JSON.stringify({
   message:'Rețetă de sarmale tradițională românească',language:'ro',module:'assistant',history:[]
 })});
 const response=await worker.fetch(req,env);
 const data=await response.json();
 assert.equal(data.status,'success');
 assert.equal(data.version,'v170');
 assert.equal(data.latency_breakdown?.ai_model,expected);
 assert.equal(data.latency_breakdown?.model_calls_estimate,1);
 assert.equal(data.latency_breakdown?.recipe_correction_ms,0);
 assert.ok(Number.isFinite(data.server_total_ms));
}
assert.deepEqual(seenModels,['@cf/meta/llama-3.1-8b-instruct-fast','@cf/meta/llama-3.1-8b-instruct-fp8']);

console.log('PASS: generated UI, full server/client timing fields, error timing, beef tripe and cabbage recipe checks.');
