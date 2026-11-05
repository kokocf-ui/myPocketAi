import assert from "node:assert/strict";
import vm from "node:vm";
import backend from "./backend.js";
import frontend from "./index.js";
import {translateUserSuppliedTelegramText} from "./news_article_detail.mjs";

const link="https://t.me/GenStaffUA/12345";
const supplied="Оперативна інформація. Повідомляється про пожежу на нафтовому терміналі. Масштаб завданих пошкоджень уточнюється.";
let modelCalls=0,fetchCalls=0;
const previousFetch=globalThis.fetch;
globalThis.fetch=async()=>{fetchCalls++;throw new Error("Telegram source fetching is forbidden");};
const env={AI:{run:async (_model,prompt)=>{
 modelCalls++;
 assert.match(prompt.messages[0].content,/Translate the following text/);
 assert.match(prompt.messages[1].content,/Оперативна інформація/);
 return {response:"Informații operative. Este raportat un incendiu la un terminal petrolier. Amploarea pagubelor este în curs de stabilire."};
}}};
const ask=async(body)=>{
 const r=await backend.fetch(new Request("https://fixture.example/api/telegram-user-translation",{
  method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)
 }),env);
 return {status:r.status,body:await r.json()};
};
try{
 assert.equal((await translateUserSuppliedTelegramText(env,supplied,"ro",false)).status,"consent_required");
 assert.equal(modelCalls,0);
 const missingConsent=await ask({url:link,language:"ro",text:supplied});
 assert.equal(missingConsent.body.status,"consent_required");
 assert.equal(modelCalls,0);
 const channelLink=await ask({url:"https://t.me/GenStaffUA",language:"ro",text:supplied,consent:true});
 assert.equal(channelLink.status,400);
 assert.equal(modelCalls,0);
 const privateLink=await ask({url:"https://t.me/c/1234/10",language:"ro",text:supplied,consent:true});
 assert.equal(privateLink.status,400);
 assert.equal(modelCalls,0);
 const invalidText=await ask({url:link,language:"ro",text:"short",consent:true});
 assert.equal(invalidText.body.status,"invalid_text");
 assert.equal(modelCalls,0);
 const translated=await ask({url:link,language:"ro",text:supplied,consent:true});
 assert.equal(translated.status,200);
 assert.equal(translated.body.kind,"telegram_user_translation");
 assert.equal(translated.body.status,"success");
 assert.equal(translated.body.content_status,"user_supplied_translation");
 assert.equal(translated.body.source_url,link);
 assert.equal(translated.body.claims_verified,false);
 assert.equal(translated.body.source_retrieved,false);
 assert.match(translated.body.text,/terminal petrolier/);
 assert.equal(modelCalls,1);
 assert.equal(fetchCalls,0,"The backend must not request the Telegram page");
}finally{globalThis.fetch=previousFetch;}

const html=await(await frontend.fetch(new Request("https://fixture/"))).text();
const script=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)][0]?.[1];
assert.ok(script);
new vm.Script(script);
const start=script.indexOf("function isTelegramLink(");
const end=script.indexOf("async function loadSourceBasedNewsDetail(",start);
assert.ok(start>0&&end>start);
const ctx=vm.createContext({URL});
vm.runInContext(script.slice(start,end),ctx);
assert.equal(ctx.isExactTelegramPost(link),true);
assert.equal(ctx.isExactTelegramPost("https://t.me/GenStaffUA"),false);
assert.equal(ctx.isExactTelegramPost("https://t.me/c/12345/12"),false);
assert.equal(ctx.isTelegramLink("https://t.me/GenStaffUA/12345"),true);
assert.ok(script.includes('if(isTelegramLink(url)){appendTelegramTranslationUI(target,url,language,indexExcerpt);return;}'));
assert.ok(script.includes('/api/telegram-user-translation'));
console.log("PASS: Telegram source integrity, consent-gated user translation, UI validation, no page scraping.");
