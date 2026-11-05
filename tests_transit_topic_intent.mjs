import assert from "node:assert/strict";
import worker from "./backend.js";
import {isTransitJourneyRequest, correctedResearchTopic} from "./transit_intent.mjs";
const cases=[["Nu, eu mă refeream la transportul public din Londra.",{},false],["Spune-mi despre transportul public din Londra.",{},false],["Cum funcționează metroul în Londra?",{},false],["Ce tipuri de transport public există în Londra?",{},false],["Transportul public din Londra",{},false],["Transport public",{},false],["Transport public",{"pendingRouteProfile":true},true],["Transport public",{"history":[{"role":"user","content":"Cum ajung la Victoria Station?"}]},true],["Cu trenul",{"pendingRouteProfile":true},true],["Vreau să ajung la London Victoria cu transport public.",{},true],["Cum ajung cu trenul la London Liverpool Street?",{},true],["Transport public până la Victoria Station",{},true],["Transport public spre London Bridge",{},true],["Planifică un traseu cu autobuzul spre Victoria",{},true],["What is public transport in London?",{},false],["Tell me about the London Underground.",{},false],["How do I get to Victoria Station by tube?",{},true],["Mă refeream la traseul cu transport public până la Victoria.",{},true],["Cât costă un bilet de metrou în Londra?",{},false],["Ce variante de transport public am până la Victoria?",{},true],["What transport options to London Victoria?",{},true],["Cât costă un bilet de metrou până la Victoria?",{},false],["Când pleacă autobuzul 100 spre Londra?",{},false],["La ce oră pleacă trenul spre Liverpool Street?",{},false],["How much is a train ticket to Victoria?",{},false],["What time does the bus leave to London?",{},false],["Ce autobuz merge la Victoria?",{},true],["Which bus goes to London Victoria?",{},true]];
for(const [query,options,expected] of cases){
 const actual=isTransitJourneyRequest(query,options);
 assert.equal(actual.is_journey,expected,query+" "+JSON.stringify(actual));
}
assert.equal(correctedResearchTopic("Nu, eu mă refeream la transportul public din Londra."),"transportul public din Londra");
assert.equal(correctedResearchTopic("I meant public transport in London."),"public transport in London");
assert.equal(correctedResearchTopic("Cum ajung la London Victoria?"),null);
console.log("PASS transport explanation vs journey: "+cases.length+" cases");

// End-to-end: a correction mentioning public transport MUST reach the AI
// assistant, not journey planner / TfL / guessed nearest venue.
const originalFetch=globalThis.fetch;
let modelCalls=0,externalCalls=0;
globalThis.fetch=async()=>{externalCalls++;throw Error("Unexpected external call in informational correction test");};
try{
 const response=await worker.fetch(new Request("https://test.local/api/chat",{
  method:"POST",headers:{"content-type":"application/json"},
  body:JSON.stringify({
   message:"Nu, eu mă refeream la transportul public din Londra.",
   language:"ro",module:"assistant",
   history:[
    {role:"user",content:"Spune-mi câteva informații despre Londra."},
    {role:"assistant",content:"Londra este capitala Regatului Unit."},
    {role:"user",content:"Nu, eu mă refeream la transportul public din Londra."}
   ]
  })
 }),{
  AI:{run:async()=>{modelCalls++;return {response:"În Londra poți folosi metroul, autobuzele, DLR și trenurile suburbane."};}},
  TFL_APP_KEY:"dummy_test_key"
 });
 assert.equal(response.status,200);
 const result=await response.json();
 assert.equal(result.status,"success");
 assert.match(result.reply,/metroul/);
 assert.equal(modelCalls,1,"the explanatory model must answer, not transit routing");
 assert.equal(externalCalls,0,"no TfL or other route provider should be contacted");
 assert.equal(result.context_diagnostics?.topic_correction_applied,true);
 assert.equal(result.context_diagnostics?.transit_intent_reason,"informational_or_correction");
 assert.notEqual(result.transit_available,true);
 assert.notEqual(result.route_available,true);
}finally{
 globalThis.fetch=originalFetch;
}
console.log("PASS: correction stays in assistant and does not route to unrelated destination");
