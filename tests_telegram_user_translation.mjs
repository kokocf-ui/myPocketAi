import assert from "node:assert/strict";
import vm from "node:vm";
import backend from "./backend.js";
import frontend from "./index.js";
import {translateUserSuppliedTelegramText} from "./news_article_detail.mjs";

const link="https://t.me/GenStaffUA/12345";
const ukrainian="Оперативна інформація. Повідомляється про пожежу на нафтовому терміналі. Масштаб завданих пошкоджень уточнюється.";
const persian="کابوس بازارهای مالی، مخرب‌تر از بحران ۲۰۰۸ است. اقتصاددانان هشدار می‌دهند که قیمت نفت و تورم در منطقه ممکن است افزایش پیدا کند.";
const roUk="Informații operative. Este raportat un incendiu la un terminal petrolier. Amploarea pagubelor este în curs de stabilire.";
const roFa="Coșmarul piețelor financiare ar putea fi mai distructiv decât criza din 2008. Economiștii avertizează că prețul petrolului și inflația ar putea crește în regiune.";
let modelCalls=[],networkCalls=0;
const previousFetch=globalThis.fetch;
globalThis.fetch=async()=>{networkCalls++;throw Error("No Telegram post fetching allowed");};
let aiBehavior=(model,prompt)=>{
 assert.equal(model,"@cf/meta/m2m100-1.2b");
 assert.equal(prompt.source_lang,"uk");
 assert.equal(prompt.target_lang,"ro");
 return {translated_text:roUk};
};
const env={AI:{run:async (model,prompt)=>{modelCalls.push({model,prompt});return aiBehavior(model,prompt)}}};
const ask=async body=>{
 const r=await backend.fetch(new Request("https://fixture.example/api/telegram-user-translation",{
  method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)}),env);
 return {http:r.status,body:await r.json()};
};
try{
 assert.equal((await translateUserSuppliedTelegramText(env,ukrainian,"ro",false)).status,"consent_required");
 assert.equal(modelCalls.length,0);
 const missingConsent=await ask({url:link,language:"ro",text:ukrainian});
 assert.equal(missingConsent.body.status,"consent_required");
 assert.equal(modelCalls.length,0);
 for(const invalidLink of ["https://t.me/GenStaffUA","https://t.me/c/1234/10"]){
  const response=await ask({url:invalidLink,language:"ro",text:ukrainian,consent:true});
  assert.equal(response.http,400);
 }
 assert.equal(modelCalls.length,0);
 assert.equal((await ask({url:link,language:"ro",text:"short",consent:true})).body.status,"invalid_text");
 assert.equal(modelCalls.length,0);
 const translated=await ask({url:link,language:"ro",text:ukrainian,consent:true});
 assert.equal(translated.http,200);
 assert.equal(translated.body.status,"success");
 assert.equal(translated.body.kind,"telegram_user_translation");
 assert.equal(translated.body.content_status,"user_supplied_translation");
 assert.equal(translated.body.source_url,link);
 assert.equal(translated.body.claims_verified,false);
 assert.equal(translated.body.source_retrieved,false);
 assert.equal(translated.body.source_language,"uk");
 assert.equal(translated.body.translation_engine,"m2m100");
 assert.match(translated.body.text,/terminal petrolier/);
 assert.equal(modelCalls.length,1);
 assert.equal(networkCalls,0);

 // Reproduce the user's failure: a Farsi input may return unchanged Farsi
 // even though the old backend labeled it a successful Romanian translation.
 modelCalls=[];
 aiBehavior=(model,prompt)=>{
  if(model==="@cf/meta/m2m100-1.2b"){
   assert.equal(prompt.source_lang,"fa");
   assert.equal(prompt.target_lang,"ro");
   return {translated_text:persian};
  }
  assert.equal(model,"@cf/meta/llama-3.3-70b-instruct-fp8-fast");
  return {response:roFa};
 };
 const corrected=await ask({url:link,language:"ro",text:persian,consent:true});
 assert.equal(corrected.body.status,"success");
 assert.equal(corrected.body.source_language,"fa");
 assert.equal(corrected.body.translation_engine,"llama-3.3-70b");
 assert.match(corrected.body.text,/piețelor financiare/);
 assert.ok(!/[\u0600-\u06ff]/u.test(corrected.body.text));
 assert.deepEqual(modelCalls.map(c=>c.model),["@cf/meta/m2m100-1.2b","@cf/meta/llama-3.3-70b-instruct-fp8-fast"]);

 // Dedicated translator succeeds directly; no unnecessary LLM fallback.
 modelCalls=[];
 aiBehavior=(model,prompt)=>{assert.equal(model,"@cf/meta/m2m100-1.2b");return {translated_text:roFa}};
 const direct=await ask({url:link,language:"ro",text:persian,consent:true});
 assert.equal(direct.body.status,"success");
 assert.equal(direct.body.translation_engine,"m2m100");
 assert.equal(modelCalls.length,1);

 // If both engines produce Persian, the API MUST fail closed, never pretend.
 modelCalls=[];
 aiBehavior=()=>({response:persian,translated_text:persian});
 const rejected=await ask({url:link,language:"ro",text:persian,consent:true});
 assert.equal(rejected.body.status,"translation_unavailable");
 assert.equal(rejected.body.content_status,"unavailable");
 assert.equal(rejected.body.text,"");
 assert.equal(rejected.body.reason,"translation_not_confirmed");
 assert.equal(modelCalls.length,2);

 // Long Persian posts must be processed in bounded chunks rather than
 // returning just the first paragraph or timing out on an unbounded request.
 modelCalls=[];
 aiBehavior=(model,prompt)=>{
  assert.equal(model,"@cf/meta/m2m100-1.2b");
  assert.ok(prompt.text.length<=850);
  assert.equal(prompt.source_lang,"fa");
  return {translated_text:roFa.repeat(Math.max(4,Math.ceil(prompt.text.length/140)))};
 };
 const longInput=Array(24).fill(persian).join("\n\n");
 assert.ok(longInput.length<5000&&longInput.length>1500);
 const longResult=await translateUserSuppliedTelegramText(env,longInput,"ro",true);
 assert.equal(longResult.status,"success");
 assert.ok(modelCalls.length>=2);
 assert.ok(longResult.text.includes("Coșmarul piețelor"));
 assert.equal(networkCalls,0);
}finally{globalThis.fetch=previousFetch}

const html=await(await frontend.fetch(new Request("https://fixture/"))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script);new vm.Script(script);
const start=script.indexOf("function isTelegramLink(");
const end=script.indexOf("async function loadSourceBasedNewsDetail(",start);
assert.ok(start>0&&end>start);
const ctx=vm.createContext({URL});
vm.runInContext(script.slice(start,end),ctx);
assert.equal(ctx.isExactTelegramPost(link),true);
assert.equal(ctx.isExactTelegramPost("https://t.me/GenStaffUA"),false);
assert.equal(ctx.isExactTelegramPost("https://t.me/c/12345/12"),false);
assert.equal(ctx.isTelegramLink(link),true);
assert.equal(ctx.telegramTranslationLooksLocalized(persian,persian,"ro"),false);
assert.equal(ctx.telegramTranslationLooksLocalized(persian,roFa,"ro"),true);
assert.equal(ctx.telegramTranslationLooksLocalized(ukrainian,ukrainian,"ro"),false);
assert.equal(ctx.telegramTranslationLooksLocalized(ukrainian,roUk,"ro"),true);
assert.ok(script.includes('if(isTelegramLink(url)){appendTelegramTranslationUI(target,url,language,indexExcerpt);return;}'));
assert.ok(script.includes('/api/telegram-user-translation'));
console.log("PASS Telegram Romanian translation from Persian and Ukrainian, multilingual model fallback, safe rejection, long posts and consent.");
