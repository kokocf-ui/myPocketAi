import assert from 'node:assert/strict';
import {
 PILOT_MODELS,PILOT_CASES,MAX_LIVE_CALLS,recommendEvaTier,
 visibleModelText,readUsage,provisionalChecks,selectedPilotPlan,
 runPilot,markdownReport
} from './eva_ai_model_pilot.mjs';

assert.equal(PILOT_MODELS.length,3);
assert.equal(PILOT_CASES.length,4);
assert.equal(MAX_LIVE_CALLS,12);
assert.equal(selectedPilotPlan().length,12);
assert.deepEqual(new Set(PILOT_CASES.map(t=>t.id)),
 new Set(['history','education','transport','creative']));
assert.equal(recommendEvaTier({intent:'greeting'}).tier,'fast');
assert.equal(recommendEvaTier({intent:'education'}).tier,'balanced');
assert.equal(recommendEvaTier({intent:'documentary'}).tier,'deep');
assert.deepEqual(recommendEvaTier({intent:'news_analysis',requiresCurrentFacts:true}),
 {tier:'research',requiresSources:true});
assert.equal(visibleModelText({result:{response:'  Buna!  '}}),'Buna!');
assert.equal(visibleModelText({result:{output:[
 {type:'reasoning',summary:[{text:'PRIVATE reasoning excluded'}]},
 {type:'message',content:[{type:'output_text',text:'Visible answer'}]}
]}}),'Visible answer');
assert.deepEqual(readUsage({result:{usage:{prompt_tokens:12,completion_tokens:42}}}),
 {input_tokens:12,output_tokens:42});
const math=PILOT_CASES.find(t=>t.id==='education');
const score=provisionalChecks(math,
 'Pornim de la (3x−6)/3=4. Înmulțim cu 3: 3x−6=12. Adunăm 6: 3x=18. Deci x=6. Verificare: (3·6−6)/3=12/3=4. '.repeat(3));
assert.ok(score.criteria.some(x=>x.name==='solves_x_equals_6'&&x.ok));
const candidate='Pentru a construi un itinerariu din Grays până în Oradea, trebuie verificate cursele și orarele publicate. Fără date actualizate nu pot confirma ore sau tarife.';
const transport=PILOT_CASES.find(t=>t.id==='transport');
assert.ok(provisionalChecks(transport,candidate).criteria.some(c=>c.name==='no_invented_departure_times'&&c.ok));
await assert.rejects(()=>runPilot({models:PILOT_MODELS,cases:PILOT_CASES,maxCalls:13,accountId:'a',apiToken:'b'}),/Call cap exceeded/);
await assert.rejects(()=>runPilot({accountId:'a',apiToken:''}),/Missing Cloudflare credentials/);

let requests=0;
const okFetch=async (url,config)=>{
 requests++;
 assert.match(url,/api\.cloudflare\.com\/client\/v4\/accounts\/test\/ai\/run\/@cf\//);
 assert.equal(config.headers.Authorization,'Bearer mock-token');
 const body=JSON.parse(config.body);
 assert.equal(body.messages.length,2);
 assert.ok(body.max_tokens<=440);
 return new Response(JSON.stringify({success:true,result:{
  response:'Modelul oferă o explicație clară și completă. '.repeat(12),
  usage:{prompt_tokens:80,completion_tokens:90}
 }}),{status:200});
};
const subset=await runPilot({
 accountId:'test',apiToken:'mock-token',models:PILOT_MODELS.slice(0,2),
 cases:PILOT_CASES.slice(0,2),fetchImpl:okFetch
});
assert.equal(requests,4);
assert.equal(subset.actual_calls,4);
assert.equal(subset.results.filter(r=>r.status==='success').length,4);
assert.ok(markdownReport(subset).includes('Nu reprezintă o actualizare'));
assert.ok(!markdownReport(subset).includes('mock-token'));
let calls403=0;
const denied=await runPilot({accountId:'test',apiToken:'secret',models:PILOT_MODELS.slice(0,1),
 cases:PILOT_CASES.slice(0,3),fetchImpl:async()=>{
  calls403++;return new Response('{}',{status:403});
 }});
assert.equal(calls403,1,'A denied model must be blocked after one call');
assert.equal(denied.results[1].status,'skipped');
let calls429=0;
const quota=await runPilot({accountId:'test',apiToken:'secret',models:PILOT_MODELS.slice(0,2),
 cases:PILOT_CASES.slice(0,2),fetchImpl:async()=>{
  calls429++;return new Response('{}',{status:429});
 }});
assert.equal(calls429,1,'Stop after quota limit, do not drain credits');
assert.equal(quota.quota_stopped,true);
console.log('PASS Eva AI pilot: three models, four synthetic scenarios, no production routing, response parsing and 12-call cap');
