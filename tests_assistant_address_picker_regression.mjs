import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import worker from './backend.js';

const frontend=readFileSync(new URL('./index.js',import.meta.url),'utf8');
const backend=readFileSync(new URL('./backend.js',import.meta.url),'utf8');
assert(frontend.includes('function renderStructuredAddressPicker({body,prefix,onSelect,onBack,region='),'a shared destination picker exists');
assert(frontend.includes("renderStructuredAddressPicker({body:$('moduleLayerBody')"),'map module uses same picker');
assert(frontend.includes('confirmAssistantGeographicRoute(option);return;'),'assistant confirms route before accommodation and address selection');
assert(frontend.includes('openStandaloneChoicePanel(host,String(option.entity_title'), 'assistant renders address fields in its overlay');
assert(frontend.includes('keepOpen=true')||frontend.includes('keepOpen=false'),'address lookup overlay can stay open');
assert(frontend.includes('region:region||'), 'region is supplied to backend search');
assert(frontend.includes("if(state.currentView==='assistant'&&state.assistantStructuredDestination===true){"),'selected assistant destination stays in its module');
assert(frontend.includes('state.assistantStructuredDestination=true;'),'assistant destination state is tracked');
assert(frontend.includes('if((pendingNumber&&!selected.number)||(pendingStreet&&!selected.street)'), 'typed house number cannot silently become approximate');
assert(frontend.includes("const point=cityOnly?selected.city:(selected.number||selected.street||selected.city)"),'verified locality may be destination without a street or house number');

// Global destination and accommodation decision regressions.
assert(frontend.includes('const countries=Array.from({length:26*26}'),'country picker must not be Europe-only');
assert(frontend.includes("No, continue to destination"),'declining accommodation must not force full address');
assert(frontend.includes("Town centre"),'verified city can be the destination without street');
assert(frontend.includes("Choose a street or house number"),'exact address remains a choice');
assert(!frontend.includes("(postcode.value.trim()&&!selected.number)"),'postal code must never force a selected house number');
assert(frontend.includes("input.disabled=fields.street.search.disabled=false;"),'empty street provider must not lock rural address');
assert(frontend.includes("const point=cityOnly?selected.city:(selected.number||selected.street||selected.city)"),'verified locality is a valid destination');

assert(frontend.includes('const localityIndex=new Map()'),'autocomplete cache must belong to the temporary picker');
assert(frontend.includes('localityIndex.clear();prewarmStreets();'),'switching town must discard prior suggestions');
assert(frontend.includes("stage==='street'?80:200"),'street autocomplete starts on first typed character');
assert(frontend.includes('const cached=matchCached(stage,input.value.trim())'),'cached suggestions display immediately');
assert(backend.includes("if(stage==='street'&&query.trim()&&env.TOMTOM_API_KEY)"),'TomTom provides street discovery fallback');
assert(backend.includes("types:'street'"),'TomTom is constrained to verified street results');
assert(backend.includes('Only verified street candidates within the selected municipality'),'street results are scoped to selected town');
// Shared flow guarantees: no unverified number silently becomes an exact route.
assert(frontend.includes('const approximateButton=card('),'shared picker offers an explicitly approximate destination');
assert(frontend.includes("approximation:'locality'"),'fallback keeps verified locality coordinates only');
assert(frontend.includes('Unverified address text is NOT a destination.'),'unverified address explicitly cannot become destination');
assert(frontend.includes("approximateButton.hidden=!selected.city"),'town-centre fallback requires a verified locality');
assert(frontend.includes("function prewarmStreets()"),'shared picker indexes available streets before typing');
assert(backend.includes("piedmont:'piemonte'"),'Italian province local names and English names are reconciled');
// An administrative village reference has no lat/lon: resolve its scoped map point
// silently rather than asking the user to select Alba a second time.
assert(frontend.includes("if(type==='city'&&prefillCity&&!prefillCityPoint&&!option._localityLookupDone)"),'administrative village is silently verified');
assert(frontend.includes("openAssistantStructuredAddress({...option,_localityLookupDone:true"),'verified administrative village stays in the shared picker');
assert(frontend.includes('fields.city.row.hidden=true'),'the already selected village is not selectable again');
assert(frontend.includes('selected.city={city:String(prefillCity)'),'county-scoped village name survives failed geocoding');
assert(frontend.includes("stage:'city',country:code,query:prefillCity"),'background municipality lookup keeps the chosen name');
assert(backend.includes('city,region,postcode].filter(Boolean)'), 'rural house number geocoding includes the selected county');
assert(backend.includes('a.municipalitySubdivision'), 'rural house numbers may use municipality subdivisions');
// Test the real address_lookup handler in isolation using provider-shaped mock data.
const originalFetch=globalThis.fetch;
const seen=[];
globalThis.fetch=async function(url){
 const parsed=new URL(String(url));seen.push(parsed);
 if(parsed.hostname!=='api.geoapify.com')throw Error('Unexpected provider '+parsed.hostname);
 const q=parsed.searchParams.get('text')||'',stage=parsed.searchParams.get('type')||(q.includes('180A')||parsed.searchParams.has('housenumber')?'number':'city');
 let results=[];
 if(q.toLowerCase().includes('alba iulia')&&stage==='city'){
   results=[
     {city:'Alba Iulia',county:'Alba',state:'Centru',country_code:'ro',result_type:'city',lat:46.07,lon:23.58,formatted:'Alba Iulia, județul Alba, România'},
     {city:'Alba Iulia',county:'Tulcea',state:'Sud-Est',country_code:'ro',result_type:'city',lat:45.0,lon:28.0,formatted:'Alba Iulia, județul Tulcea, România'}
   ];
 }else if(q.toLowerCase().startsWith('alba,')&&stage==='city'){
   results=[
     {village:'Alba',county:'Tulcea',country_code:'ro',result_type:'village',lat:45.1,lon:28.2,formatted:'Alba, Izvoarele, Tulcea'},
     {village:'Alba',county:'Botoșani',country_code:'ro',result_type:'village',lat:48.1,lon:26.4,formatted:'Alba, Hudești, Botoșani'}
   ];
 }else if(q.includes('180A')||parsed.searchParams.get('housenumber')==='180A'){
   results=[
     {city:'Alba',county:'Tulcea',country_code:'ro',result_type:'building',housenumber:'180A',lat:45.1,lon:28.2,formatted:'Alba 180A, Tulcea'},
     {city:'Alba',county:'Botoșani',country_code:'ro',result_type:'building',housenumber:'180A',lat:48.1,lon:26.4,formatted:'Alba 180A, Botoșani'}
   ];
 }
 return Response.json({results});
};
const api=async arg=>{
 const body={stage:arg.stage,country:'ro',city:arg.city||'',street:'',postcode:'',query:arg.query,region:arg.region};
 const response=await worker.fetch(new Request('https://unit.test/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({address_lookup:body})}),{GEOAPIFY_API_KEY:'fake'});
 assert.equal(response.status,200,'address lookup HTTP 200');
 return response.json();
};
try{
 const city=await api({stage:'city',query:'Alba Iulia',region:'Alba'});
 assert(city.candidates.some(p=>p.city==='Alba Iulia'&&p.latitude===46.07),'correct county city accepted');
 assert(!city.candidates.some(p=>p.latitude===45.0),'same-named locality in another county rejected');
 const tulcea=await api({stage:'city',query:'Alba',region:'Tulcea'});
 assert(tulcea.candidates.some(p=>p.city==='Alba'&&p.latitude===45.1),'village in selected county accepted');
 assert(!tulcea.candidates.some(p=>p.latitude===48.1),'village in another county rejected');
 const house=await api({stage:'number',query:'180A',city:'Alba',region:'Tulcea'});
 assert(house.candidates.some(p=>p.houseNumber==='180A'),'alphanumeric house numbers supported without street');
 assert(!house.candidates.some(p=>p.latitude===48.1),'house in wrong county rejected');
 assert(seen.some(u=>u.searchParams.get('text')?.includes('Tulcea')),'county included in provider queries');
}finally{globalThis.fetch=originalFetch}

// TomTom may put a numbered Romanian village under its commune, with
// Alba represented as municipalitySubdivision rather than municipality.
const tomtomRequests=[];
globalThis.fetch=async url=>{
 const u=new URL(String(url));tomtomRequests.push(u);
 if(u.hostname==='api.tomtom.com')return Response.json({results:[{
  type:'address',address:{countryCodeIso2:'RO',municipality:'Izvoarele',
   municipalitySubdivision:'Alba',countrySubdivision:'Tulcea',houseNumber:'28A',postalCode:'827106'},
  position:{coordinates:[28.2,45.1]},title:'Alba 28A'
 }]});
 return Response.json({results:[]});
};
try{
 const response=await worker.fetch(new Request('https://unit.test/api/chat',{
  method:'POST',headers:{'Content-Type':'application/json'},
  body:JSON.stringify({address_lookup:{stage:'number',country:'ro',city:'Alba',
   street:'',query:'28A',postcode:'',region:'Tulcea'}})
 }),{TOMTOM_API_KEY:'test',GEOAPIFY_API_KEY:'test'});
 assert.equal(response.status,200);
 const result=await response.json();
 assert.equal(result.provider,'tomtom','municipality subdivision can verify a rural address');
 assert.equal(result.candidates[0].houseNumber,'28A');
 assert(tomtomRequests.some(u=>u.searchParams.get('query')?.includes('Tulcea')),
  'TomTom rural query includes selected county');
}finally{globalThis.fetch=originalFetch}

// Geographic candidates from administrative sources are not fake map coordinates.
const i=backend.indexOf('// Resolve short ambiguous names');
const j=backend.indexOf('    let verifiedCity=null;',i);
assert(i>0&&j>i);
const block=backend.slice(i,j);
assert(block.includes("entity_kind:'locality_reference'"),'verified villages included as references');
assert(block.includes("region:'Tulcea'")&&block.includes("region:'Botoșani'"),'two Romanian villages represented');
assert(block.includes("geoChoices.unshift({label,entity_kind:'region_article'"),'Romanian county represented');
console.log('Assistant shared address, county-scoped city and rural house-number tests passed.');
