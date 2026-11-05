import assert from "node:assert/strict";
import vm from "node:vm";
import backend from "./backend.js";
import frontend from "./index.js";
let aiCalls=0,fetchCalls=0;
const originalFetch=globalThis.fetch;
globalThis.fetch=async()=>{fetchCalls++;throw Error("Social and formatting turns must not search maps or web");};
try{
 const ask=async(message,history=[])=>{
  const response=await backend.fetch(new Request("https://test.local/api/chat",{
   method:"POST",headers:{"Content-Type":"application/json"},
   body:JSON.stringify({message,language:"ro",module:"assistant",location:{latitude:51.485,longitude:.285},history})
  }),{
   GEOAPIFY_API_KEY:"test_only_geocoding_secret",
   AI:{run:async(model,params)=>{aiCalls++;return {response:"Răspuns relevant și concis."};}}
  });
  assert.equal(response.status,200,message);
  const data=await response.json();
  assert.equal(data.status,"success",message);
  assert.notEqual(data.named_venue,true,message);
  assert.notEqual(data.needs_location_clarification,true,message);
  assert.equal(data.web_search_status,"not_needed",message);
  assert.equal(data.reply,"Răspuns relevant și concis.",message);
  return data;
 };
 const prior=[{role:"user",content:"Care este capitala Franței?"},{role:"assistant",content:"Capitala Franței este Paris."}];
 const social1=await ask("Parcă astăzi ești cam serioasă!",prior);
 assert.equal(social1.context_diagnostics.dialogue_intent_kind,"social_feedback");
 const social2=await ask("Glumeam, voiam doar să văd dacă ai simțul umorului. 😄",prior);
 assert.equal(social2.context_diagnostics.dialogue_intent_kind,"social_feedback");
 const formatted=await ask("Răspunde într-o singură propoziție.",prior);
 assert.equal(formatted.context_diagnostics.dialogue_intent_kind,"reformat_previous");
 const salary=await ask("Explică-mi în două propoziții diferența dintre salariul brut și cel net.",prior);
 assert.equal(salary.context_diagnostics.dialogue_intent_kind,"explanation");
 assert.equal(fetchCalls,0,"Social/instructional turns used an external source or POI service");
 assert.ok(aiCalls>=4&&aiCalls<=6,"All four turns must reach AI; an extra sentence-count correction is legitimate");
}finally{globalThis.fetch=originalFetch}
const html=await(await frontend.fetch(new Request("https://test.local/"))).text();
const source=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].find(x=>x[1].includes("function requestUsesLocation("))?.[1];
assert.ok(source,"Browser script missing");
new vm.Script(source);
const start=source.indexOf("function requestUsesLocation("),end=source.indexOf("async function coordinatesForRequest(",start);
assert.ok(start>0&&end>start);
const requestUsesLocation=vm.runInNewContext(source.slice(start,end)+"\nrequestUsesLocation;",{isRecipeQuestion:()=>false,needsLocation:()=>false});
for(const q of [
 "Răspunde într-o singură propoziție.",
 "Explică-mi în două propoziții diferența dintre salariul brut și cel net.",
 "Glumeam, voiam doar să văd dacă ai simțul umorului.",
 "Parcă astăzi ești cam serioasă!"
])assert.equal(requestUsesLocation(q),false,"GPS was requested for dialogue: "+q);
for(const q of ["Aldi","Decathlon Lakeside"])assert.equal(requestUsesLocation(q),true,"A real place lost GPS: "+q);
console.log("PASS T3/T8 worker and embedded mobile frontend regression");
