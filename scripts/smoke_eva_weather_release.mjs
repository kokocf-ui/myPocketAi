// Authorized post-deployment probes. Synthetic conversation/location, no account data.
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const origin=process.env.POCKET_SMOKE_ORIGIN||'https://lifewise-ai-api.kokocf.workers.dev';
const results=[];
const save=()=>writeFileSync('eva-weather-live-smoke.json',JSON.stringify({origin,checked_at:new Date().toISOString(),results},null,2));
process.on('uncaughtException',error=>{save();console.error('::error::'+String(error.message).replace(/\r?\n/g,' ').slice(0,500)+' | '+JSON.stringify(results.at(-1)||{}).slice(0,2500));process.exitCode=1;});
async function ask(message,extra={}){
 const response=await fetch(origin+'/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({module:'assistant',language:'ro',message,history:[],...extra}),signal:AbortSignal.timeout(60000)});
 const data=await response.json();
 results.push({message,status:response.status,version:data.version,error:data.error,reply:data.reply,conversation_intent:data.conversation_intent,weather_ok:data.weather_ok,weather_location:data.weather?.location,web_search_status:data.web_search_status});save();
 assert.equal(response.status,200,JSON.stringify({status:response.status,error:data.error}));assert.equal(data.version,'v185');return data;
}
const name=await ask('Cum vrei tu, dar Costi, cred că este perfect',{history:[{role:'user',content:'Ce faci?'},{role:'assistant',content:'Sunt pregătită să aflu despre tine, Costi. Cum îți poți spune?'}]});
assert.equal(name.conversation_intent,'eva_name_preference');assert.match(name.reply,/îți spun Costi/);assert.equal(name.web_search_status,'not_needed');assert.doesNotMatch(name.reply,/cântăreț|manele|am găsit|am căutat/);
const weather=await ask('Vremea azi',{location:{latitude:51.479,longitude:0.29,accuracy:20,updatedAt:Date.now()},location_requested:true});
assert.equal(weather.weather_ok,true,'Live forecast must be verified');assert.ok(typeof weather.weather.location==='string'&&weather.weather.location.length>1,'Provider locality must be present');assert.doesNotMatch(weather.weather.location,/South Stifford/i);assert.ok(Array.isArray(weather.weather.practical_advice));
const location=await ask('Locația mea',{location:{latitude:51.479,longitude:0.29,accuracy:20,updatedAt:Date.now()},location_requested:true});
assert.equal(location.current_location,true);assert.equal(location.postcode,null);assert.deepEqual(location.nearby_postcodes,[]);assert.doesNotMatch(location.reply,/Coduri poștale din apropiere|Nearby postcodes/);
const social=await ask('Ce faci?',{user_profile:{preferred_name:'Costi'}});assert.equal(social.conversational_reply,true);assert.equal(social.web_search_status,'not_needed');assert.doesNotMatch(social.reply,/am găsit.*despre tine|ești un cântăreț|eşti un cântăreţ/i);
writeFileSync('eva-weather-live-smoke.json',JSON.stringify({origin,checked_at:new Date().toISOString(),results},null,2));
console.log('PASS live v185: exact Costi turn without search, real GPS-area forecast, no uncertain postcode list and conversational Eva response.');
