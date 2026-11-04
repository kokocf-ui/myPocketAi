import assert from 'node:assert/strict';
import worker from './backend.js';
let aiCalls=0,webCalls=0;
const originalFetch=globalThis.fetch;
globalThis.fetch=async()=>{webCalls++;throw Error('No web searches permitted for standalone greeting');};
const ai={run:async()=>{aiCalls++;return {response:'Historical sources are primary materials.'}}};
try{
 const ask=async(message,language='ro')=>{
  const response=await worker.fetch(new Request('https://test.local/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({message,language,history:[
   {role:'user',content:'Tell me about historical sources'},
   {role:'assistant',content:'Primary sources are original materials from an event.'}
  ]})}),{AI:ai});
  assert.equal(response.status,200,message);
  return response.json();
 };
 for(const greeting of ['Salut! Cum te simți astăzi?','Salut, cum te simți azi?','Cum te simți astăzi?','Bună! Ce mai faci azi?']){
  const r=await ask(greeting);
  assert.equal(r.conversational_reply,true,greeting);
  assert.match(r.reply,/Salut|Hei|Bună/);
  assert.ok(r.reply.length<150,'Social response must be short');
  assert.doesNotMatch(r.reply,/istoric|surs[ăe] primar/i,'No unrelated historical subject');
  assert.equal(r.web_search_status,'not_needed');
 }
 const en=await ask('How are you feeling today?','en');
 assert.equal(en.conversational_reply,true);
 assert.ok(en.reply.length<140);
 assert.equal(aiCalls,0,'No inference for social greetings');
 assert.equal(webCalls,0,'No external web for social greetings');
 // A greeting with a real substantive question must not be swallowed.
 const more=await ask('Salut! Cum te simți astăzi? Care sunt știrile geopolitice?');
 assert.notEqual(more.conversational_reply,true,'Substantive requests need normal routing');
 console.log('Social wellbeing greetings: fast, contextual and no AI/web invocation PASS');
}finally{globalThis.fetch=originalFetch}
