import assert from 'node:assert/strict';
import worker from './backend.js';
import {webcrypto} from 'node:crypto';
globalThis.crypto??=webcrypto;
const info=console.info;console.info=()=>{};
let calls=[],broken='',aiCalls=0;
const cities={oradea:{lat:'47.05',lon:'21.94',name:'Oradea',display_name:'Oradea, Bihor, România',address:{city:'Oradea',country_code:'ro',country:'România'}},grays:{lat:'51.48',lon:'.32',name:'Grays',display_name:'Grays, Essex, United Kingdom',address:{town:'Grays',country_code:'gb',country:'United Kingdom'}},barcelona:{lat:'41.38',lon:'2.17',name:'Barcelona',display_name:'Barcelona, España',address:{city:'Barcelona',country_code:'es',country:'España'}}};
const localDate=tz=>{const p=new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const g=k=>p.find(x=>x.type===k).value;return `${g('year')}-${g('month')}-${g('day')}`};
globalThis.fetch=async input=>{
 const u=new URL(input);calls.push(u);
 if(u.hostname==='nominatim.openstreetmap.org'){
  const q=u.searchParams.get('q').toLowerCase();
  if(q==='paris')return Response.json([
   {lat:'48.86',lon:'2.32',name:'Paris',display_name:'Paris, Île-de-France, France métropolitaine, France',address:{city:'Paris',state:'Île-de-France',country:'France',country_code:'fr'}},
   {lat:'48.90',lon:'2.36',name:'Paris',display_name:'Paris, Île-de-France, France, France métropolitaine, France',address:{city:'Paris',state:'Île-de-France',country:'France',country_code:'fr'}},
   {lat:'33.66',lon:'-95.55',name:'Paris',display_name:'Paris, Texas, United States',address:{city:'Paris',state:'Texas',country:'United States',country_code:'us'}},
   {lat:'39.61',lon:'-87.69',name:'Paris',display_name:'Paris, Illinois, United States',address:{city:'Paris',state:'Illinois',country:'United States',country_code:'us'}}
  ].filter(r=>!u.searchParams.get('countrycodes')||r.address.country_code===u.searchParams.get('countrycodes')));
  return Response.json(Object.values(cities).filter(c=>c.name.toLowerCase()===q));
 }
 if(u.hostname.endsWith('api.open-meteo.com')){
  if(broken==='http')return new Response('',{status:429});
  if(broken==='network')throw Error('offline');
  const lat=Number(u.searchParams.get('latitude')),tz=lat>46&&lat<48?'Europe/Bucharest':'Europe/London';
  const start=new Date(localDate(tz)+'T12:00:00Z');
  const dates=Array.from({length:16},(_,i)=>new Date(start.getTime()+i*86400000).toISOString().slice(0,10));
  const hi=lat>46&&lat<48?11:lat<43?22:14;
  const now=new Date(Date.now()+0).toISOString().slice(0,16);
  const data={timezone:tz,utc_offset_seconds:0,current:{time:now,temperature_2m:7},current_units:{temperature_2m:'°C'},daily_units:{temperature_2m_min:'°C',temperature_2m_max:'°C',precipitation_probability_max:'%',wind_speed_10m_max:'km/h'},daily:{time:dates,temperature_2m_min:dates.map(()=>hi-5),temperature_2m_max:dates.map(()=>hi),precipitation_probability_max:dates.map(()=>30),wind_speed_10m_max:dates.map(()=>20)}};
  if(broken==='null')data.daily.temperature_2m_max=dates.map(()=>null);
  if(broken==='missingdate')data.daily.time=[];
  if(broken==='units')data.daily_units.temperature_2m_max='°F';
  if(broken==='reversed')data.daily.temperature_2m_min=dates.map(()=>100);
  if(broken==='stale')data.current.time='2000-01-01T00:00';
  return Response.json(data);
 }
 if(u.hostname==='api.geoapify.com')return Response.json({features:[]});
 if(u.hostname==='photon.komoot.io')return Response.json({features:[]});
 throw Error('Unexpected URL '+u.hostname);
};
const env={GEOAPIFY_API_KEY:'mock',AI:{run:async()=>{aiCalls++;return {response:'general answer'}}}};
async function ask(message,extra={}){calls=[];return (await worker.fetch(new Request('https://test/api/chat',{method:'POST',body:JSON.stringify({message,language:'ro',history:[],...extra})}),env)).json()}
let d=await ask('Câte grade vor fi mâine în Oradea?');assert.equal(d.weather_ok,true);assert.equal(d.weather.maximum,11);assert.equal(d.weather_context.offset,1);assert.equal(d.weather.date,new Date(new Date(localDate('Europe/Bucharest')+'T12:00:00Z').getTime()+86400000).toISOString().slice(0,10));assert.ok(d.reply.includes('Maximă: 11°C'));assert.ok(d.reply.includes('Open-Meteo'));assert.ok(!d.reply.includes('am verificat'));
const oradeaContext=d.weather_context;
d=await ask('Dar în grays?',{weather_context:oradeaContext});assert.equal(d.weather_ok,true);assert.equal(d.weather.maximum,14);assert.equal(d.weather_context.offset,1);assert.equal(d.weather_context.query,'grays');assert.ok(!d.reply.includes('Oradea'));assert.equal(calls.find(u=>u.hostname==='nominatim.openstreetmap.org').searchParams.get('q'),'grays');
let context=d.weather_context;
d=await ask('Dar în Barcelona?',{weather_context:context});assert.equal(d.weather.maximum,22);assert.equal(d.weather_context.offset,1);
d=await ask('Dar în grays?',{history:[{role:'user',content:'Câte grade vor fi mâine în Oradea?'},{role:'assistant',content:'Oradea 18°C. Romania.'},{role:'user',content:'Dar în grays?'}]});assert.equal(d.weather_ok,true);assert.equal(d.weather.maximum,14);assert.equal(d.weather_context.query,'grays');
d=await ask('Dar poimâine?',{weather_context:context});assert.equal(d.weather_context.offset,2);assert.equal(d.weather_context.query,'grays');
d=await ask('Dar azi?',{weather_context:context});assert.equal(d.weather_context.offset,0);
d=await ask('Weather in Grays tomorrow',{language:'en'});assert.equal(d.weather_ok,true);assert.equal(d.weather_context.query,'Grays');assert.ok(d.reply.includes('Maximum'));
d=await ask('Cum e vremea mâine aici?',{location:{latitude:51.48,longitude:.32}});assert.equal(d.weather_ok,true);assert.ok(!calls.some(u=>u.hostname==='nominatim.openstreetmap.org'));
d=await ask('Cum e vremea mâine aici?');assert.equal(d.needs_location_clarification,true);assert.equal(d.weather_ok,false);assert.ok(!calls.some(u=>u.hostname.endsWith('open-meteo.com')));
d=await ask('Grays',{weather_context:d.weather_context});assert.equal(d.weather_ok,true);assert.equal(d.weather_context.offset,1);
d=await ask('Câte grade vor fi mâine în Atlantis?',{location:{latitude:51.48,longitude:.32}});assert.equal(d.weather_ok,false);assert.equal(d.needs_location_clarification,true);assert.ok(!calls.some(u=>u.hostname.endsWith('open-meteo.com')),'unknown explicit place never falls back to GPS');
d=await ask('Vremea mâine în Paris');assert.equal(d.needs_location_clarification,true);assert.equal(d.weather_context.candidates.length,3,'duplicate France merged, Texas and Illinois distinct');
d=await ask('Franța',{weather_context:d.weather_context});assert.equal(d.weather_ok,true);assert.equal(d.weather_context.offset,1);assert.equal(d.weather.longitude,2.32);
for(const fail of ['http','network','null','missingdate','units','reversed']){broken=fail;d=await ask('Vremea mâine în Oradea');assert.equal(d.weather_ok,false,fail);assert.ok(!d.reply.includes('°C'),fail);assert.ok(d.weather_context.query==='Oradea');}broken='';
d=await ask('Vremea acum în Grays');assert.equal(d.weather_ok,true);assert.equal(d.weather.temperature,7);broken='stale';d=await ask('Vremea acum în Grays');assert.equal(d.weather_ok,false);broken='';
for(const message of ['Vremea luni în Oradea','Vremea în Oradea 2030-01-01','Vremea în Oradea 2026-02-30']){d=await ask(message);assert.equal(d.weather_ok,false);assert.ok(d.reply.includes('16'));}
for(const lang of ['ro','en','fr','de','it','es','pt','nl','ru','pl']){d=await ask('Weather tomorrow in Oradea',{language:lang});assert.equal(d.weather_ok,true,lang);assert.equal(d.language,lang);}
d=await ask('Weather for tomorrow in Grays',{language:'en'});assert.equal(d.weather_ok,true);assert.equal(d.weather_context.query,'Grays');
d=await ask('Vremea mâine în Paris');d=await ask('1',{weather_context:d.weather_context});assert.equal(d.weather_ok,true);assert.equal(d.weather_context.offset,1);
d=await ask('Vremea mâine în Oradea');const fresh=d.weather_context;d=await ask('Dar hoteluri în Grays?',{weather_context:fresh});assert.equal(d.weather_context,null);
assert.equal(aiCalls,0,'no weather answer is generated by AI, even on provider failure');
d=await ask('Explică fotosinteza',{weather_context:context});assert.equal(d.reply,'general answer');assert.equal(d.weather_context,null);assert.equal(aiCalls,1);
d=await ask('De ce plouă?');assert.equal(d.weather_context,null);assert.ok(d.reply.startsWith('general answer'));assert.ok(!calls.some(u=>u.hostname.endsWith('open-meteo.com')));
console.info=info;
console.log('PASS: weather city replacement, user-only history, date retention/change, GPS fallback rules, ambiguity/dedup, 10 response languages, units/null/stale/error validation, no invented temperatures, unrelated-topic reset.');
