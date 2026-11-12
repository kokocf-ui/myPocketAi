// Smart Country Registry v2 — configuration and dispatch decisions, no network calls.
// Providers must be explicitly enabled by backend configuration, never by this file.
// A resolved country is the country of the REQUEST, not necessarily the phone's GPS.
const fold = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const countries = {
 RO:['romania','românia','roumania'],GB:['united kingdom','uk','great britain','britain','regatul unit','anglia','england','scotland','wales','northern ireland'],
 HU:['hungary','ungaria','magyarorszag'],FR:['france','franta','franța'],DE:['germany','germania','deutschland'],
 IT:['italy','italia'],ES:['spain','spania','espana','españa'],MD:['moldova','republica moldova'],
 IE:['ireland','irlanda'],AT:['austria'],BE:['belgium','belgia'],NL:['netherlands','olanda','tarile de jos','țările de jos'],
 PL:['poland','polonia'],PT:['portugal'],CH:['switzerland','elvetia','elveția'],BG:['bulgaria'],
 GR:['greece','grecia'],CZ:['czechia','cehia','czech republic'],SK:['slovakia','slovacia'],
 HR:['croatia','croația'],SI:['slovenia'],RS:['serbia'],TR:['turkey','turcia','turkiye']
};
const aliases = new Map(Object.entries(countries).flatMap(([code,names])=>[[fold(code),code],...names.map(name=>[fold(name),code])]));
// Resolve all ISO countries, including those without a specialized local adapter.
// Build the international aliases only on first use; keep validated ISO codes.
let worldwideAliases;
function worldwideCountries(){
 if(worldwideAliases)return worldwideAliases;
 const lookup=new Map();
 try{
   const langs=['en','ro','fr','de','it','es','pt','hu','pl','tr'];
   const display=langs.map(lang=>new Intl.DisplayNames([lang],{type:'region'}));
   for(let a=65;a<=90;a++)for(let b=65;b<=90;b++){
     const code=String.fromCharCode(a,b);
     if(display[0].of(code)===code)continue;
     lookup.set(fold(code),code);
     for(const d of display)lookup.set(fold(d.of(code)),code);
   }
 }catch{/* Unknown country stays unresolved rather than guessing. */}
 worldwideAliases=lookup;
 return lookup;
}
export const identifyCountry = value => aliases.get(fold(value)) ?? worldwideCountries().get(fold(value)) ?? null;
const poi = new Set(['restaurant','pub','cafe','hotel','pharmacy','supermarket','parking','zoo','park','museum','market','shop','fuel','car_repair','fast_food','confectionery','corner_shop','lounge','hospital','cinema','atm','bank','post_office','library','shopping_fashion','beauty_services','home_goods','appliances','furniture','diy_garden','mall','charging','car_wash','car_dealers','school','stadium','toilets','poi']);
const categoryAliases = {transport:'mixed_transport',transport_mixed:'mixed_transport',mixed:'mixed_transport',hoteluri:'hotel',restaurante:'restaurant',parcari:'parking',parcări:'parking',farmacii:'pharmacy',evenimente:'events',stiri:'news',știri:'news'};
export function classifyCategory(category){
 const key=fold(category).replace(/\s+/g,'_');
 const normalized=categoryAliases[key]||key;
 return {category:normalized,branch:['urban_transport','intercity_transport','mixed_transport','international_transport','airport_transfer','walking','driving'].includes(normalized)?'transport':'general'};
}
const globalGeneral = {
 places:['geoapify','photon','tomtom_places'],
 geocode:['geoapify','photon'],
 news:[],events:[],education:[],weather:[]
};
const local = {
 RO:{transport:{urban_transport:['ro_urban_gtfs'],intercity_transport:['ro_national_transit']},general:{}},
 GB:{transport:{urban_transport:['tfl'],intercity_transport:['uk_national_transit']},general:{shop:['uk_food_retailers'],corner_shop:['uk_food_retailers'],fast_food:['uk_food_retailers']}},
 HU:{transport:{},general:{}},FR:{transport:{},general:{}},
 DE:{transport:{},general:{}},IT:{transport:{},general:{}},
 ES:{transport:{},general:{}}
};
const unique = values => [...new Set(values.filter(Boolean))];
function configuredIds(ids,enabled){const allowed=new Set(enabled);return unique(ids).filter(id=>allowed.has(id));}
const locality = (id,request) => id!=='tfl'||fold(request.region)==='london';
function sourcesFor(country,category,branch,request){
 const profile=local[country]||{transport:{},general:{}};
 if(branch==='general'){
  const key=poi.has(category)?'places':category;
  return [...(globalGeneral[key]||[]),...(profile.general[category]||[])];
 }
 if(category==='mixed_transport'){
  // Without confirmed legs, only discover candidates from endpoints;
  // do not run every country's urban and national providers.
  return [...(profile.transport.intercity_transport||[])];
 }
 if(category==='airport_transfer')return [...(profile.transport.urban_transport||[])];
 return [...(profile.transport[category]||[])];
}
export function selectCountryProviders(request={}){
 const {category,branch}=classifyCategory(request.category);
 if(!category)return {branch,countries:[],providers:[],status:'missing_category'};
 const explicit=identifyCountry(request.country);
 const origin=identifyCountry(request.originCountry),destination=identifyCountry(request.destinationCountry);
 const isTransport=branch==='transport';
 const resolved=isTransport && origin && destination ? unique([origin,destination]) : [explicit||destination||origin].filter(Boolean);
 if(!resolved.length)return {branch,countries:[],providers:[],status:'country_unresolved'};
 const candidateIds=resolved.flatMap(c=>sourcesFor(c,category,branch,request));
 const selected=configuredIds(candidateIds,request.enabledProviders||[]).filter(id=>locality(id,request));
 return {branch,countries:resolved,providers:selected,status:selected.length?'ready':'no_configured_provider'};
}
// A mixed itinerary is composed from validated, country-tagged stages.
// Example: RO airport access -> cross-border flight -> GB airport access -> GB urban transit.
// The registry chooses source IDs; itinerary search, flight schedules, transfer feasibility
// and connection times must be verified by existing specialized planners.
export function planMixedTransportSources({stages=[],enabledProviders=[]}={}){
 if(!Array.isArray(stages)||stages.length===0)return {stages:[],status:'missing_verified_stages'};
 const entries=stages.map((stage,index)=>{
  const mode=fold(stage.mode||stage.category);
  const category=mode==='flight'?'international_transport':mode==='airport'?'airport_transfer':mode==='rail'?'intercity_transport':mode==='bus'?'urban_transport':mode||'mixed_transport';
  const result=selectCountryProviders({...stage,category,enabledProviders});
  return {index,mode,category,...result};
 });
 return {stages:entries,status:entries.every(x=>x.status==='ready')?'ready':'partial_coverage'};
}
export function countryCoverage(country){
 const code=identifyCountry(country);
 if(!code)return null;
 return {country:code,branches:['transport','general'],configuredByBackend:true,notes:'Coverage requires enabled and verified adapters'};
}
export const COUNTRY_REGISTRY_VERSION=2;
