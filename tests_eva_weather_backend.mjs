import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import worker from './backend.js';
globalThis.crypto??=webcrypto;
const original=globalThis.fetch,info=console.info,warn=console.warn;console.info=()=>{};console.warn=()=>{};
let calls=[],warm=false,wet=false;
const env={AI:{run:async()=>{throw Error('Neither name preference nor verified weather should use AI')}}};
async function ask(message,history=[]){calls=[];return(await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({module:'assistant',language:'ro',message,history,location:{latitude:51.479,longitude:.29,accuracy:12}})}),env)).json()}
globalThis.fetch=async(input)=>{const u=new URL(String(input));calls.push(u.href);
 if(u.hostname==='nominatim.openstreetmap.org')return Response.json({address:{town:'Grays',suburb:'South Stifford',country:'United Kingdom'}});
 if(u.hostname==='api.open-meteo.com'){
  const date=new Date().toISOString().slice(0,10),temp=warm?23:3,rows=Array.from({length:24},(_,i)=>date+'T'+String(i).padStart(2,'0')+':00');
  return Response.json({timezone:'Europe/London',daily_units:{temperature_2m_min:'°C',temperature_2m_max:'°C'},daily:{time:[date],temperature_2m_min:[temp-1],temperature_2m_max:[temp+1]},hourly:{time:rows,temperature_2m:rows.map(()=>temp),apparent_temperature:rows.map(()=>temp),precipitation_probability:rows.map(()=>wet?90:0),precipitation:rows.map(()=>wet?2:0),weather_code:rows.map(()=>wet?61:0),cloud_cover:rows.map(()=>10),wind_speed_10m:rows.map(()=>10)}});
 }throw Error('Unsolicited provider '+u.hostname)
};
try{
 const n=await ask('Cum vrei tu, dar Costi, cred că este perfect',[{role:'user',content:'Ce faci?'},{role:'assistant',content:'Sunt pregătită să aflu despre tine, Costi. Cum îți poți spune?'}]);assert.equal(n.conversation_intent,'eva_name_preference');assert.match(n.reply,/îți spun Costi/);assert.deepEqual(calls,[]);assert.doesNotMatch(n.reply,/cântăreț|căutat|găsit|manele/);
 let w=await ask('Vremea azi');assert.equal(w.weather_ok,true,JSON.stringify(w));assert.equal(w.weather.location,'Grays');assert.doesNotMatch(w.reply,/South Stifford|jachetă|umbrelă/);assert.match(w.reply,/haină groasă/);
 warm=true;w=await ask('Vremea azi');assert.doesNotMatch(w.reply,/jachetă|haină groasă|umbrelă/);
 wet=true;w=await ask('Vremea azi');assert.match(w.reply,/umbrelă/);assert.doesNotMatch(w.reply,/jachetă/);assert.equal(w.weather.location,'Grays');
 info('PASS Worker exact Costi screenshot turn: no AI/search, no celebrity inference; cold/warm/rain forecasts, umbrella only when relevant, Grays not suburb. Providers mocked.');
}finally{globalThis.fetch=original;console.info=info;console.warn=warn}
