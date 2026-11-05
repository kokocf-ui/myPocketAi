import assert from "node:assert/strict";
import vm from "node:vm";
import backend from "./backend.js";
import frontend from "./index.js";
import {classifyDialogueIntent} from "./dialogue_intent.mjs";

const history=[
 {role:"user",content:"Salut, ce mai faci?"},
 {role:"assistant",content:"Sunt bine, mulțumesc! Tu cum te simți?"}
];
const priorRoute={destination:{label:"Sunt Farm, Tandridge, United Kingdom",latitude:51.25,longitude:-0.02},
 destination_query:"Sunt bine",pending:"profile"};
const cases=[
 ["Sunt bine","positive"],
 ["Bine, mulțumesc","positive"],
 ["Foarte bine, mersi!","positive"],
 ["Nu sunt bine","concern"],
 ["I am fine, thanks.","positive"]
];
let networkCalls=0,modelCalls=0;
const seenReplies=new Map();
const previousFetch=globalThis.fetch;
globalThis.fetch=async()=>{networkCalls++;throw Error("Social reply cannot search web or maps");};
const env={GEOAPIFY_API_KEY:"fixture_key",TOMTOM_API_KEY:"fixture_key",AI:{run:async()=>{modelCalls++;throw Error("Social response must not require AI");}}};
try{
 for(const [message,sentiment] of cases){
  const r=await backend.fetch(new Request("https://fixture.example/api/chat",{
   method:"POST",headers:{"content-type":"application/json"},
   body:JSON.stringify({message,language:message.startsWith("I am")?"en":"ro",module:"assistant",
    route_context:priorRoute,location:{latitude:51.48,longitude:0.28},history})
  }),env);
  assert.equal(r.status,200,message);
  const x=await r.json();
  assert.equal(x.status,"success",message);
  assert.equal(x.context_diagnostics?.dialogue_intent_kind,"social_checkin",message);
  assert.equal(x.context_diagnostics?.sentiment,sentiment,message);
  assert.equal(x.web_search_status,"not_needed",message);
  assert.equal(x.conversational_reply,true,message);
  assert.ok(!x.needs_travel_confirmation&&!x.needs_travel_mode&&!x.needs_location_clarification,message);
  assert.ok(!x.route_context?.destination&&!x.named_venue&&!x.place_lookup,message);
  assert.match(x.reply,/[A-Za-z\u00c0-\u024f]/u);
  seenReplies.set(message,x.reply);
 }
 assert.notEqual(seenReplies.get("Sunt bine"),seenReplies.get("Bine, mulțumesc"),"Polite response should differ from generic wellbeing acknowledgement");
 assert.equal(networkCalls,0,"Social replies made a network request");
 assert.equal(modelCalls,0,"Social replies invoked a model");
 for(const query of ["Unde este Sunt Farm?","Caută Sunt Farm în Tandridge","Sunt Farm",
  "Bine, mulțumesc, dar caută știri","Sunt bine, caută o farmacie"]){
  assert.equal(classifyDialogueIntent(query).kind,"none",query+" should not be swallowed as small talk");
 }
}finally{globalThis.fetch=previousFetch}

const html=await(await frontend.fetch(new Request("https://fixture/"))).text();
const js=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(js);
new vm.Script(js);
const begin=js.indexOf("function isCasualConversationReply("),end=js.indexOf("async function coordinatesForRequest(",begin);
assert.ok(begin>0&&end>begin);
const c=vm.createContext({isRecipeQuestion:()=>false,needsLocation:()=>false});
vm.runInContext(js.slice(begin,end),c);
for(const [message] of cases){
 assert.equal(c.isCasualConversationReply(message),true,message);
 assert.equal(c.requestUsesLocation(message),false,message+" must not request GPS");
}
for(const message of ["Aldi","Decathlon Lakeside","Sunt Farm","Unde este Sunt Farm?"]){
 assert.equal(c.isCasualConversationReply(message),false,message);
 assert.equal(c.requestUsesLocation(message),true,message+" must retain normal place lookup");
}
assert.ok(js.includes("const locationIntent=!isCasualConversationReply(text)"),"Pending route must not force GPS for small talk");
assert.ok(js.includes("if(isCasualConversationReply(message)){state.pendingEncyclopediaDestination=null;"),"Social reply must not inherit pending routes");
console.log("PASS 8-point T2/T3/T7 regression: conversational replies, no false POI, no GPS, old route cleared.");
