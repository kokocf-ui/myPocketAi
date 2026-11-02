import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import frontend from './index.js';

const backend=await fs.readFile(new URL('./backend.js',import.meta.url),'utf8');
assert.match(backend,/article\.is_country=isCountryProfile/);
assert.match(backend,/article\.major_cities=highlights\.cities/);
assert.match(backend,/article\.attractions_scope='capital'/);
assert.match(backend,/countryNameCodes\.has\(normalizeGeoName\(encyclopediaTitle\)\)/);

const a=backend.indexOf('const countryHighlightsCache=new Map();');
const b=backend.indexOf('function geoQueryParts(query){',a);
assert.ok(a>=0&&b>a,'Wikidata and capital fallback helpers missing');
const calls=[];
const fakeFetch=async input=>{
 const url=new URL(String(input));calls.push(url);
 if(url.hostname==='query.wikidata.org'){
  const query=url.searchParams.get('query');
  assert.match(query,/wdt:P17 wd:Q29/,'country must be verified by Wikidata');
  assert.match(query,/wdt:P625/,'geo coordinates required');
  return {ok:true,json:async()=>({results:{bindings:[
   {site:{value:'https://www.wikidata.org/entity/Q1'},siteLabel:{value:'Q1'},kind:{value:'sight'},coord:{value:'Point(0 0)'}},
   {site:{value:'https://www.wikidata.org/entity/Q2'},siteLabel:{value:'Rejected coordinates'},kind:{value:'sight'},coord:{value:'Point(250 95)'}},
   {site:{value:'https://www.wikidata.org/entity/Q16014'},siteLabel:{value:'Museo del Prado'},siteDescription:{value:'art museum in Madrid'},kind:{value:'sight'},coord:{value:'Point(-3.692 40.4138)'}},
   {site:{value:'https://www.wikidata.org/entity/Q1492'},siteLabel:{value:'Barcelona'},kind:{value:'city'},coord:{value:'Point(2.17 41.38)'}},
   {site:{value:'https://www.wikidata.org/entity/Q16014'},siteLabel:{value:'Duplicate'},kind:{value:'sight'},coord:{value:'Point(-3.692 40.4138)'}}
  ]}})};
 }
 if(url.pathname.includes('/v1/geocode/search')&&url.searchParams.get('type')==='country')return {ok:true,json:async()=>({features:[
  {properties:{country_code:'FR',result_type:'country',place_id:'0123456789abcdef0123456789abcdef'}},
  {properties:{country_code:'ES',result_type:'country',place_id:'abcdef0123456789abcdef0123456789',name:'Spain'}}
 ]})};
 if(url.pathname.includes('/v1/geocode/search'))return {ok:true,json:async()=>({features:[
  {properties:{country_code:'FR',city:'Madrid',lat:40.4,lon:-3.7}},
  {properties:{country_code:'ES',city:'Madrid',lat:40.4168,lon:-3.7038}}
 ]})};
 if(url.pathname.includes('/v2/places')&&url.searchParams.get('filter')?.startsWith('place:'))return {ok:true,json:async()=>({features:[
  {properties:{name:'Museo del Prado',lat:40.4138,lon:-3.692,city:'Madrid',state:'Madrid',country_code:'ES'}},
  {properties:{name:'Park Güell',lat:41.4145,lon:2.1527,city:'Barcelona',state:'Catalonia',country_code:'ES'}},
  {properties:{name:'Plaza de España',lat:37.377,lon:-5.986,city:'Sevilla',state:'Andalucía',country_code:'ES'}},
  {properties:{name:'Alhambra',lat:37.177,lon:-3.589,city:'Granada',state:'Andalucía',country_code:'ES'}},
  {properties:{name:'Foreign test',lat:48.86,lon:2.35,city:'Paris',state:'Île-de-France',country_code:'FR'}},
  {properties:{name:'Park Güell',lat:41.4145,lon:2.1527,city:'Barcelona',state:'Catalonia',country_code:'ES'}}
 ]})};
 if(url.pathname.includes('/v2/places'))return {ok:true,json:async()=>({features:[
  {properties:{name:'Museo del Prado',lat:40.4138,lon:-3.692,city:'Madrid'}},
  {properties:{name:'Museo del Prado',lat:40.4138,lon:-3.692,city:'Madrid'}},
  {properties:{name:'Palacio Real',lat:40.418,lon:-3.714,city:'Madrid'}}
 ]})};
 throw Error('unexpected url: '+url);
};
const ctx=vm.createContext({URL,AbortSignal,Date,fetch:fakeFetch,normalizeGeoName:x=>String(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()});
vm.runInContext(backend.slice(a,b),ctx);
const highlights=await vm.runInContext("getCountryHighlights('Q29','ro')",ctx);
assert.equal(highlights.sights.length,1);
assert.equal(highlights.sights[0].name,'Museo del Prado');
assert.equal(highlights.cities[0].name,'Barcelona');
assert.equal(highlights.sights[0].latitude,40.4138);
const cached=await vm.runInContext("getCountryHighlights('Q29','ro')",ctx);
assert.equal(cached,highlights,'cached country highlights must be reused');
const nationwide=await vm.runInContext("getCountryWideSights({english_name:'Spain',country_code:'ES'},'test-key','ro')",ctx);
assert.ok(nationwide.length>=3,'nationwide query must yield multiple verified cities');
assert.ok(nationwide.some(x=>x.description.includes('Barcelona')),'landmarks outside capital required');
assert.ok(nationwide.some(x=>x.description.includes('Sevilla')),'third geographic region required');
assert.ok(nationwide.every(x=>x.url.startsWith('https://www.openstreetmap.org/')));
assert.ok(calls.some(u=>u.searchParams.get('filter')?.startsWith('place:')),'country boundary filter required');
const capital=await vm.runInContext("getCapitalSights({capital:'Madrid',country_code:'ES'},'test-key')",ctx);
assert.equal(capital.length,2,'duplicate venues must be removed');
assert.ok(capital.every(x=>Number.isFinite(x.latitude)&&x.url.startsWith('https://www.openstreetmap.org/')));
assert.equal(calls.filter(x=>x.hostname==='query.wikidata.org').length,1);

const html=await(await frontend.fetch(new Request('https://pocket.test/'))).text();
const js=html.match(/<script[^>]*>([\s\S]*?)<\/script>/i)?.[1];
assert.ok(js,'generated frontend script missing');
new vm.Script(js);
for(const label of ['Date esențiale','Obiective turistice','Orașe importante','Sursă date țară','zona capitalei'])assert.ok(js.includes(label),'missing UI label: '+label);
assert.ok(js.includes('const isCountry=article.is_country===true;'),'country/city ambiguity returned');
assert.ok(js.includes("const nav=document.createElement('button')"),'route action removed');
assert.ok(js.includes("const topRoute=nav.cloneNode(true)"),'top route action missing');
assert.ok(js.includes("formatTravelDurationMinutes(route.durationSeconds/60)"),'map durations not expressed in days/hours/minutes');
assert.ok(js.includes("state.tripCountryOnChoice&&data.needs_travel_mode"),'country flow must retain accommodation');
assert.ok(js.includes('Înapoi la prezentare'),'no return to country/city presentation');
assert.ok(backend.includes("latitude:Number(x.lat),longitude:Number(x.lon)"),'city sights must be routeable');
console.log('country profile regression checks passed');
