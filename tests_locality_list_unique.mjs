import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import frontend from './index.js';
import backend from './backend.js';

const source=readFileSync(new URL('./index.js',import.meta.url),'utf8');
assert(source.includes('state.tripCountryOnChoice=null;offerAssistantLocalityTravelMode(scope);return;'),
 'country and county presentations must choose a town before transport or lodging');
assert(source.includes("Confirmă localitatea de destinație"),
 'city-only picker must not mention accommodation before choosing a vehicle');
assert(source.includes('offerAssistantLocalityTravelMode(selected);'),
 'places in country/county presentation must use the same mode-first journey');

const original=globalThis.fetch;
globalThis.fetch=async url=>{
 const u=new URL(String(url));
 if(u.hostname!=='api.geoapify.com')throw new Error('Unexpected provider '+u.hostname);
 return Response.json({results:[
  {result_type:'city',city:'Alba Iulia',county:'Alba',country:'Romania',
    country_code:'ro',formatted:'Alba Iulia, AB, Romania',lat:46.068,lon:23.57},
  {result_type:'city',city:'Alba Iulia',county:'Alba',country:'Romania',
    country_code:'ro',postcode:'510010',formatted:'510010 Alba Iulia, Romania',lat:46.0681,lon:23.571},
  {result_type:'amenity',city:'Alba Iulia',name:'Alba Carolina Citadel',county:'Alba',
    country:'Romania',country_code:'ro',lat:46.067,lon:23.56},
  {result_type:'village',village:'Victoria',municipality:'Comuna Victoria',county:'Brăila',
    country:'Romania',country_code:'ro',lat:45.02,lon:27.71},
  {result_type:'village',village:'Victoria',municipality:'Comuna Victoria',county:'Iași',
    country:'Romania',country_code:'ro',lat:47.29,lon:27.59}
 ]});
};
try{
 const lookup=async query=>{
  const response=await backend.fetch(new Request('https://example.test/api/chat',{
   method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
    address_lookup:{stage:'city',country:'ro',city:'',street:'',region:'',postcode:'',query}
   })
  }),{GEOAPIFY_API_KEY:'test'});
  assert.equal(response.status,200);
  return response.json();
 };
 const alba=await lookup('Alba Iu');
 assert.equal(alba.candidates.length,1,'Alba Iulia listed once despite alternate postcode and citadel');
 assert.equal(alba.candidates[0].city,'Alba Iulia');
 assert(!alba.candidates[0].label.includes('510010'),'postal code is not a town label');
 assert.match(alba.candidates[0].label,/Alba/);
 const victoria=await lookup('Victoria');
 assert.equal(victoria.candidates.length,2,'distinct homonymous settlements in different counties remain distinct');
 assert(victoria.candidates.some(x=>x.county==='Brăila'));
 assert(victoria.candidates.some(x=>x.county==='Iași'));
}finally{globalThis.fetch=original}
const page=await (await frontend.fetch(new Request('https://example.test/'))).text();
assert(page.includes('Confirmă localitatea de destinație'),'new labels are present in generated browser UI');
console.log('Country to locality flow and geographical locality de-duplication — PASS');
