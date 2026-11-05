import assert from "node:assert/strict";
import backend from "./backend.js";
import {classifyVoluntaryTelegramLink,telegramVerificationPrompt,telegramExternalResearchQuery} from "./telegram_voluntary_links.mjs";

const link="https://t.me/PublicNewsChannel/123";
const claim="Postarea susține că o lege nouă a intrat în vigoare în toate statele europene ieri, fără excepții.";
const direct="Verifică această postare Telegram: "+link;
const combined="Verifică această postare Telegram: "+link+" "+claim;
assert.equal(classifyVoluntaryTelegramLink("Ce știri sunt în lume?"),null);
assert.equal(classifyVoluntaryTelegramLink(direct)?.mode,"needs_claim");
assert.equal(classifyVoluntaryTelegramLink(link)?.mode,"reference_only");
const ref=classifyVoluntaryTelegramLink(combined);
assert.equal(ref?.mode,"verify_user_claim");
assert.equal(ref.url,link);
assert.ok(telegramExternalResearchQuery(ref)?.includes("lege noua"));
assert.ok(!telegramExternalResearchQuery(ref).includes("t.me"));
assert.match(telegramVerificationPrompt("ro"),/nu pot prelua automat/);
assert.equal(classifyVoluntaryTelegramLink("Verifică linkul: https://t.me/c/1234567/3").type,"unsupported");

const previous=globalThis.fetch;
let calls=[];
globalThis.fetch=async(url,options)=>{
 const value=String(url);calls.push(value);
 if(value.includes("api.telegram.org"))throw Error("Direct user link triggered Telegram Bot API");
 if(value==="https://api.exa.ai/search"){
  const body=JSON.parse(options.body);
  assert.ok(body.query.includes("lege noua"),"External search must use user-shared claim text");
  assert.ok(!body.query.includes("t.me/"),"Never search by Telegram channel URL");
  return new Response(JSON.stringify({results:[
   {url:"https://apnews.com/article/european-regulation",title:"Independent European regulatory analysis by news publisher",
    highlights:["Regulatory requirements vary by member state and implementation date."],publishedDate:"2026-11-04T12:00:00Z"},
   {url:"https://europa.eu/legislation/official-update",title:"European Union official legislative reference",
    highlights:["The latest EU regulatory overview does not establish universal implementation for all states."],publishedDate:"2026-11-04T12:00:00Z"}
  ]}),{headers:{"content-type":"application/json"}});
 }
 if(value.startsWith("https://"))return new Response("<html><body>Public publisher reference, independently provided.</body></html>",{headers:{"content-type":"text/html"}});
 throw Error("Unexpected fetch "+value);
};
const ask=async(message,env={})=>{
 const response=await backend.fetch(new Request("https://test.local/api/chat",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({
  message,language:"ro",module:"assistant",history:[]
 })}),{AI:{run:async(model,params)=>{
  const system=JSON.stringify(params);
  assert.match(system,/USER-SUBMITTED TELEGRAM CLAIM FACT-CHECK/);
  assert.match(system,/DO NOT claim to have read Telegram/);
  return {response:"Afirmația nu poate fi confirmată doar din postarea Telegram. Sursele disponibile nu confirmă aplicarea universală."};
 }},...env});
 assert.equal(response.status,200,"HTTP status for "+message);
 return response.json();
};
try{
 const request=await ask(direct);
 assert.equal(request.status,"success");
 assert.equal(request.telegram_shared_reference?.mode,"needs_claim");
 assert.equal(request.ai_generated,false);
 assert.match(request.reply,/Copiază afirmația exactă/);
 assert.equal(calls.length,0,"Link-only path should not fetch");
 const unsupported=await ask("Verifică acest link: https://t.me/c/1234567/3");
 assert.equal(unsupported.telegram_shared_reference.type,"unsupported");
 assert.equal(calls.length,0);
 const noProviders=await ask(combined);
 assert.equal(noProviders.telegram_shared_reference?.mode,"verification_no_sources");
 assert.equal(noProviders.ai_generated,false);
 assert.match(noProviders.reply,/nu am găsit surse independente/);
 assert.equal(calls.length,0);
 const withProvider=await ask(combined,{EXA_API_KEY:"test_key"});
 assert.equal(withProvider.status,"success");
 assert.ok(withProvider.sources?.length>=1);
 assert.equal(calls.some(x=>x.startsWith("https://api.telegram.org/")),false);
 assert.equal(calls.some(x=>x==="https://api.exa.ai/search"),true);
 assert.match(withProvider.reply,/nu poate fi confirmată/);
 console.log("PASS voluntary Telegram link reference, no Telegram scraping, external claim checking and fail-closed without sources");
}finally{globalThis.fetch=previous}
