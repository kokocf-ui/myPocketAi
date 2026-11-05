import assert from "node:assert/strict";
import backend from "./backend.js";

const oldFetch=globalThis.fetch;
let aiCalls=0;
try{
 globalThis.fetch=async(url,opts)=>{
  assert.equal(String(url),"https://api.exa.ai/search");
  return new Response(JSON.stringify({results:[{
   url:"https://t.me/newsroompublic/123",
   title:"Военкор Котенок – Telegram",
   highlights:["Еще одно видео с ударами по автомобильному мосту."],
   publishedDate:"2026-11-05T08:00:00Z"
  }]}),{headers:{"content-type":"application/json"}});
 };
 const env={EXA_API_KEY:"fixture",AI:{run:async(model,params)=>{
  aiCalls++;
  const system=String(params.messages?.[0]?.content||"");
  if(system.includes("JSON array"))return {response:JSON.stringify([{id:0,title:"Corespondent de război – Telegram",summary:"Un nou videoclip arată lovituri asupra unui pod rutier."}])};
  return {response:JSON.stringify({title:"Corespondent de război – Telegram",summary:"Un nou videoclip arată lovituri asupra unui pod rutier."})};
 }}};
 const response=await backend.fetch(new Request("https://test.local/api/chat",{
  method:"POST",headers:{"content-type":"application/json"},
  body:JSON.stringify({message:"Caută pe Telegram știri despre Ucraina",language:"ro",module:"assistant",history:[]})
 }),env);
 assert.equal(response.status,200);
 const data=await response.json();
 assert.equal(data.structured_list?.rows?.length,1);
 assert.equal(data.structured_list.rows[0].title,"Corespondent de război – Telegram");
 assert.match(data.structured_list.rows[0].summary,/Un nou videoclip/);
 assert.equal(data.structured_list.rows[0].url,"https://t.me/newsroompublic/123");
 assert.equal(data.structured_list.rows[0].original_title,"Военкор Котенок – Telegram");
 assert.equal(data.structured_list.rows[0].translation_status,"translated");
 assert.equal(data.telegram_translation_scope,"indexed_public_metadata_only");
 assert.ok(aiCalls>0);
 console.log("PASS public Telegram index metadata localized into Romanian");
}finally{globalThis.fetch=oldFetch}
