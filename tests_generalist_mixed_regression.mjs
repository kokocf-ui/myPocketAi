import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs/promises';
import frontend from './index.js';

const backend=await fs.readFile(new URL('./backend.js',import.meta.url),'utf8');
const html=await(await frontend.fetch(new Request('https://pocket.test/'))).text();
const match=html.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
assert.ok(match?.[1],'frontend should include an inline application script');
const script=match[1];
new vm.Script(script);

const preserve='Oradea este cunoscută în vestul României';
assert.ok(script.includes("const content=String(article.extract||'').trim().replace(/\\s+/g,' ')"),'encyclopedia whitespace regex must survive frontend template generation');
const dictStart=script.indexOf('function cleanVoiceConversationTranscript(');
const dictEnd=script.indexOf('function stopRecognition()',dictStart);
assert.ok(dictStart>=0&&dictEnd>dictStart,'voice transcript helper must exist');
const voice=vm.createContext({});
vm.runInContext(script.slice(dictStart,dictEnd),voice);
assert.equal(voice.cleanVoiceConversationTranscript([preserve]),preserve,'speech cleanup must never erase letter s');
assert.equal(voice.cleanVoiceConversationTranscript(['este  cunoscută','vestul  României']),'este cunoscută vestul României');

const fmtStart=script.indexOf('function formatTravelDurationMinutes(');
const fmtEnd=script.indexOf('function transitClock(',fmtStart);
assert.ok(fmtStart>=0&&fmtEnd>fmtStart,'frontend duration helper must exist');
const durationCtx=vm.createContext({Intl,Math,Number,state:{language:'ro'}});
vm.runInContext(script.slice(fmtStart,fmtEnd),durationCtx);
const frontDuration=durationCtx.formatTravelDurationMinutes;
assert.match(frontDuration(45),/45.*minute?/);
assert.match(frontDuration(135),/2.*ore.*15.*minute?/);
assert.match(frontDuration(1575),/1.*zi.*2.*ore.*15.*minute?/);
assert.match(frontDuration(2880),/2.*zile/);
for(const language of ['ro','en','fr','de','it','es','pt','nl','ru','pl']){
 durationCtx.state.language=language;
 assert.ok(frontDuration(1575).length>=5,'missing localized duration in '+language);
}

const backendFmtStart=backend.indexOf('function formatJourneyDurationMinutes(');
const backendFmtEnd=backend.indexOf('// Show distinct ways to travel',backendFmtStart);
assert.ok(backendFmtStart>=0&&backendFmtEnd>backendFmtStart);
const backendTime=vm.createContext({Intl,Number,Math});
vm.runInContext(backend.slice(backendFmtStart,backendFmtEnd),backendTime);
assert.match(backendTime.formatJourneyDurationMinutes(1575,'ro'),/1.*zi.*2.*ore.*15.*minute?/);
assert.match(backendTime.formatJourneyDurationMinutes(60,'en'),/1.*hour/);
assert.ok(backend.includes('const explicitLookup = '),'generalist search intent must accept direct lookup commands');
assert.ok(backend.includes('countryNameEntries.find('),'legal searches must use worldwide country names');

const start=backend.indexOf('async function planMOTISMixedJourney(');
const end=backend.indexOf('// Coordinate-backed boarding places',start);
assert.ok(start>=0&&end>start,'international MOTIS routing helper must exist');
let calledUrl='';
const now=Date.now()+7200000;
const at=m=>new Date(now+m*60000).toISOString();
const pos=(name,lat,lon,tz='Europe/London')=>({name,lat,lon,tz,stopId:name.replace(/\W+/g,'')});
const a=pos('Origin',51.480,.280),b=pos('Station A',51.481,.281),c=pos('Station B',51.500,.300,'Europe/Paris'),d=pos('Destination',51.501,.301,'Europe/Paris');
const fixture={itineraries:[{duration:2940,startTime:at(0),endTime:at(49),transfers:0,legs:[
 {mode:'FOOT',from:a,to:b,duration:300,startTime:at(0),endTime:at(5),legGeometry:{points:''},realTime:false,scheduled:true},
 {mode:'REGIONAL_RAIL',from:b,to:c,duration:2100,startTime:at(10),endTime:at(45),legGeometry:{points:''},realTime:false,scheduled:true,routeShortName:'R1',agencyName:'Fixture Rail'},
 {mode:'FOOT',from:c,to:d,duration:240,startTime:at(45),endTime:at(49),legGeometry:{points:''},realTime:false,scheduled:true}
]}]};
const adapterCtx=vm.createContext({URL,Date,Number,Math,AbortSignal,Intl,
 transitCoordinate:(v,limit)=>Number.isFinite(Number(v))&&Math.abs(Number(v))<=limit?Number(v):null,
 transitBoardingStop:legs=>{const l=legs.find(x=>x.mode!=='walking');return {label:l?.from||'',latitude:l?.departurePoint?.lat,longitude:l?.departurePoint?.lon}},
 fetch:async url=>{calledUrl=String(url);return {ok:true,json:async()=>fixture}}
});
vm.runInContext(backend.slice(start,end),adapterCtx);
const fn=adapterCtx.planMOTISMixedJourney;
const from={latitude:a.lat,longitude:a.lon},to={latitude:d.lat,longitude:d.lon};
const missing=await fn({},from,to,'ro');
assert.equal(missing.status,'not_configured');
const restricted=await fn({MOTIS_API_BASE_URL:'https://api.transitous.org'},from,to,'ro');
assert.equal(restricted.status,'provider_usage_not_authorized');
const result=await fn({MOTIS_API_BASE_URL:'https://planner.example.org'},from,to,'ro');
assert.equal(result.status,'success');
assert.equal(result.journeys.length,1);
assert.equal(result.journeys[0].legs.length,3);
assert.equal(result.journeys[0].legs[1].operator,'Fixture Rail');
assert.ok(result.journeys[0].walkToFirstStopMinutes===5);
assert.ok(calledUrl.includes('/api/v6/plan?'));
assert.equal(result.journeys[0].legs[1].arrivalZone,'Europe/Paris');
const bad=structuredClone(fixture);bad.itineraries[0].legs[1].cancelled=true;
adapterCtx.fetch=async()=>({ok:true,json:async()=>bad});
const rejected=await fn({MOTIS_API_BASE_URL:'https://planner.example.org'},from,to,'ro');
assert.equal(rejected.journeys.length,0,'cancelled transport cannot appear as verified');

console.log('PASS: frontend script compilation, intact s/voice transcription, 10-language duration display, generalist search, global jurisdictions, licensed mixed-mode adapter, transfer and cancellation validation.');
