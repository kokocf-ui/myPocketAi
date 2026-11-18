// Official operator route-page discovery for international mixed transport.
//
// This is a route EVIDENCE feed, not a licensed live timetable, ticket search,
// or proof of a complete door-to-door journey. It uses the existing Exa key
// and Geoapify geography to find provider-owned route pages. Never guess
// operator URLs, intermediate cities, departure times, prices or reservations.
const allowed=Object.freeze([
 {domain:'flixbus.co.uk',operator:'FlixBus',mode:'coach'},
 {domain:'flixbus.com',operator:'FlixBus',mode:'coach'},
 {domain:'eurostar.com',operator:'Eurostar',mode:'train'},
 {domain:'regiojet.com',operator:'RegioJet',mode:'train'},
 {domain:'nationalexpress.com',operator:'National Express',mode:'coach'},
 {domain:'blablacar.com',operator:'BlaBlaCar Bus',mode:'coach'}
]);
const trim=(x,n=160)=>String(x||'').trim().slice(0,n);
const fold=x=>trim(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const safeUrl=value=>{
 try{
  const u=new URL(String(value||''));
  if(u.protocol!=='https:'||u.username||u.password||u.port||u.href.length>1800)return null;
  if(u.hostname==='localhost'||u.hostname.endsWith('.local'))return null;
  return u;
 }catch{return null}
};
const supplier=url=>{
 const host=url.hostname.toLowerCase().replace(/^www\./,'');
 return allowed.find(x=>host===x.domain||host.endsWith('.'+x.domain))||null;
};
const locality=value=>{
 const own=trim(value?.city||value?.locality||value?.town,75);
 if(own)return own;
 const label=trim(value?.label||value?.name||'',220);
 const parts=label.split(',').map(x=>x.trim()).filter(Boolean);
 if(!parts.length)return '';
 // Street names and exact house numbers must NOT be sent to a search engine.
 const street=/\b(?:strada|str\.?|street|road|lane|avenue|boulevard|drive|close|mill|calea|bulevardul|ulica)\b/i;
 return trim((parts.length>1&&(street.test(parts[0])||/\d/.test(parts[0]))?parts[1]:parts[0]),75);
};
const country=value=>{
 const raw=trim(value?.country_code||value?.countryCode||'',2).toUpperCase();
 return /^[A-Z]{2}$/.test(raw)?raw:'';
};
const fromToTitle=(title,targetCity)=>{
 const text=trim(title,200).replace(/\s+/g,' ');
 // A provider-owned route title must explicitly state the origin AND target.
 // Do not accept a generic operator homepage or an unrelated destination.
 const match=text.match(/^(.{2,72}?)\s+(?:to|→|vers|spre)\s+(.{2,72}?)\b(?:\s+(?:coach|bus|train|rail|ferry|travel|tickets|ticket|service|services|rides|ride|cheap|affordable)\b|\s*[|–—-]|$)/i);
 if(!match)return null;
 const destination=trim(match[2],75).replace(/\s+(?:coach|bus|train|rail|ferry)$/i,'');
 // When a title has a more verbose suffix, its destination should still
 // start with the exact city requested, not an unrelated intermediate stop.
 if(!fold(destination).startsWith(fold(targetCity))||!fold(targetCity))return null;
 const origin=trim(match[1].replace(/^(?:bus|coach|train|rail|cheap tickets)\s+(?:from\s+)?/i,''),75);
 if(!origin||fold(origin)===fold(destination)||
    /^(?:bus|coach|train|rail|ferry|ticket|tickets|travel|cheap tickets|bus tickets)$/i.test(origin))return null;
 return {origin,destination:targetCity};
};
const fareFromText=text=>{
 const m=String(text||'').match(/\b(?:from|starting at|de la)\s*(£|€|\$)\s*(\d{1,5}(?:[.,]\d{1,2})?)/i);
 if(!m)return null;
 const amount=Number(m[2].replace(',','.'));
 if(!Number.isFinite(amount)||amount<0)return null;
 return {amount,currency:m[1]==='£'?'GBP':m[1]==='€'?'EUR':'USD',kind:'published_starting_at'};
};
export function normalizeMixedOperatorEvidence(results,{origin,destination}={}){
 const fromCity=locality(origin),toCity=locality(destination);
 if(!toCity)return [];
 const seen=new Set(),items=[];
 for(const result of Array.isArray(results)?results:[]){
  const url=safeUrl(result?.url),vendor=url&&supplier(url);
  if(!vendor)continue;
  const title=trim(result.title,200);
  const route=fromToTitle(title,toCity);
  if(!route)continue;
  const key=vendor.operator+'|'+fold(route.origin)+'|'+fold(route.destination);
  if(seen.has(key))continue;
  seen.add(key);
  const excerpt=trim([result.text,result.description,...(Array.isArray(result.highlights)?result.highlights:[])].join(' '),1300);
  const fare=fareFromText(excerpt);
  items.push({
   id:'operator:'+items.length,
   operator:vendor.operator,mode:vendor.mode,
   from:route.origin,to:route.destination,url:url.href,
   source_title:title,source_type:'official_operator_route_page',
   schedule_status:'unavailable',journey_status:'indicative_ground_segment',
   timetable_verified:false,transfer_verified:false,door_to_door_complete:false,
   access_transfer_needed:fold(route.origin)!==fold(fromCity),
   destination_transfer_needed:true,
   ...(fare?{fareFrom:fare}:{}),
   note:'Check operator for departure dates, full price, seats and booking'
  });
 }
 return items.slice(0,6);
}
async function nearbyMajorCity(env,origin,expected,{fetcher}){
 const lat=Number(origin?.latitude),lon=Number(origin?.longitude);
 if(!origin||origin.latitude==null||origin.longitude==null||
  !Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||
  Math.abs(lon)>180||!env?.GEOAPIFY_API_KEY)return '';
 const url=new URL('https://api.geoapify.com/v2/places');
 url.searchParams.set('categories','populated_place.city');
 url.searchParams.set('filter','circle:'+lon+','+lat+',140000');
 url.searchParams.set('bias','proximity:'+lon+','+lat);
 url.searchParams.set('limit','40');
 url.searchParams.set('apiKey',env.GEOAPIFY_API_KEY);
 try{
  const r=await fetcher(url,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(6000)});
  if(!r.ok)return '';
  const body=await r.json();
  const cities=(Array.isArray(body.features)?body.features:[]).map(feature=>{
   const p=feature.properties||{},raw=p.datasource?.raw||{};
   const code=String(p.country_code||'').toUpperCase();
   const name=trim(p.name||p.city||'',75);
   const population=Number(p.population??raw.population);
   return {name,country:code,population:Number.isFinite(population)?population:0};
  }).filter(c=>c.name&&(!expected||c.country===expected));
  cities.sort((a,b)=>b.population-a.population);
  return cities[0]?.name||'';
 }catch{return ''}
}
async function resolveOriginCountry(env,origin,{fetcher}){
 const explicit=country(origin);
 if(explicit)return explicit;
 const lat=Number(origin?.latitude),lon=Number(origin?.longitude);
 if(!origin||origin.latitude==null||origin.longitude==null||
  !Number.isFinite(lat)||!Number.isFinite(lon)||Math.abs(lat)>90||Math.abs(lon)>180||
  !env?.GEOAPIFY_API_KEY)return '';
 const url=new URL('https://api.geoapify.com/v1/geocode/reverse');
 url.searchParams.set('lat',String(lat));
 url.searchParams.set('lon',String(lon));
 url.searchParams.set('limit','1');
 url.searchParams.set('apiKey',env.GEOAPIFY_API_KEY);
 try{
  const r=await fetcher(url,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(5000)});
  if(!r.ok)return '';
  const data=await r.json();
  const guess=String(data.features?.[0]?.properties?.country_code||'').toUpperCase();
  return /^[A-Z]{2}$/.test(guess)?guess:'';
 }catch{return ''}
}
async function verifyOriginGeography(env,city,expected,{fetcher}){
 if(!expected||!env?.GEOAPIFY_API_KEY)return false;
 const u=new URL('https://api.geoapify.com/v1/geocode/search');
 u.searchParams.set('text',city);
 u.searchParams.set('filter','countrycode:'+expected.toLowerCase());
 u.searchParams.set('limit','2');
 u.searchParams.set('apiKey',env.GEOAPIFY_API_KEY);
 try{
  const r=await fetcher(u,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(5500)});
  if(!r.ok)return false;
  const body=await r.json();
  return (body.features||[]).some(f=>{
   const p=f.properties||{};
   return String(p.country_code||'').toUpperCase()===expected&&
    [p.city,p.town,p.village,p.municipality].some(x=>fold(x)===fold(city));
  });
 }catch{return false}
}
export async function discoverMixedGroundOperators(env,{origin,destination,fetcher=fetch}={}){
 const fromCity=locality(origin),toCity=locality(destination);
 if(!fromCity||!toCity)return {status:'location_unavailable',operators:[]};
 const key=trim(env?.EXA_API_KEY,300);
 const braveKey=trim(env?.BRAVE_API_KEY,300);
 if(!key&&!braveKey)return {status:'search_providers_not_configured',operators:[]};
 // Search only approximate places, not street addresses or precise GPS.
 const sourceCountry=await resolveOriginCountry(env,origin,{fetcher});
 const destinationCountry=country(destination);
 const readableCountry=sourceCountry?
  new Intl.DisplayNames(['en'],{type:'region'}).of(sourceCountry):fromCity;
 const majorCity=await nearbyMajorCity(env,origin,sourceCountry,{fetcher});
 const queries=[
  [fromCity,toCity,'bus coach train transport operator official route'].join(' '),
  [majorCity||readableCountry,toCity,destinationCountry,
   'international coach bus operator official route'].filter(Boolean).join(' ')
 ];
 let candidateResults=[],successful=0;
 const errors=[];
 if(key)await Promise.all(queries.map(async query=>{
  try{
   const r=await fetcher('https://api.exa.ai/search',{
    method:'POST',headers:{'Content-Type':'application/json','x-api-key':key},
    body:JSON.stringify({query,type:'auto',numResults:8,
      contents:{text:{maxCharacters:850},highlights:{numSentences:2}}}),
    signal:AbortSignal.timeout(8000)
   });
   if(!r.ok){errors.push('exa_http_'+r.status);return;}
   const data=await r.json();
   if(Array.isArray(data.results)){successful++;candidateResults.push(...data.results)}
  }catch{errors.push('exa_network_error')}
 }));
 // Use the existing licensed Brave Search key only when the Exa source is
 // unavailable or returned no eligible operator page. No SerpApi flight
 // credits, scraping, or invented outbound URLs.
 let eligible=normalizeMixedOperatorEvidence(candidateResults,{origin,destination});
 if(!eligible.length&&braveKey){
  // One broad discovery, followed only if necessary by a provider-domain
  // query. Both cities are derived from request geography; there is no
  // London/Oradea-specific branch or invented route URL.
  const searchTerms=[
   queries[1]+' tickets timetable',
   'site:flixbus.co.uk/bus-routes/ "'+(majorCity||fromCity)+'" "'+toCity+'" coach bus'
  ];
  for(const query of searchTerms){
   const url=new URL('https://api.search.brave.com/res/v1/web/search');
   url.searchParams.set('q',query);
   url.searchParams.set('count','20');
   try{
    const r=await fetcher(url,{headers:{
     Accept:'application/json','X-Subscription-Token':braveKey
    },signal:AbortSignal.timeout(7000)});
    if(!r.ok)errors.push('brave_http_'+r.status);
    else {
     const data=await r.json();
     if(Array.isArray(data.web?.results)){
      successful++;
      candidateResults.push(...data.web.results.map(x=>({
       url:x.url,title:x.title,description:x.description,highlights:x.extra_snippets
      })));
     }
    }
   }catch{errors.push('brave_network_error')}
   eligible=normalizeMixedOperatorEvidence(candidateResults,{origin,destination});
   if(eligible.some(x=>fold(x.from)===fold(majorCity||fromCity)||fold(x.from)===fold(fromCity)))break;
  }
 }
 if(!successful)return {status:errors.join('|')||'provider_unavailable',operators:[],
  summary:{fromCity,toCity,majorCity,sourceHits:0,matchingRoutes:0,errors:errors.slice(0,4)}};
 // Validate all candidate origins concurrently, bounded by the shortlist,
 // instead of a potentially 30-second chain of individual geocoding requests.
 const verdicts=await Promise.all(eligible.map(async option=>{
  if(!option.access_transfer_needed)return {...option,
   access_transfer_verified:true,country_match_verified:true};
  if(!sourceCountry)return null;
  const valid=await verifyOriginGeography(env,option.from,sourceCountry,{fetcher});
  return valid?{...option,access_transfer_verified:false,country_match_verified:true}:null;
 }));
 const accepted=verdicts.filter(Boolean);
 return {status:accepted.length?'official_operator_options':'no_verified_operator_pages',
  operators:accepted,queriesUsed:queries.length,scheduledServicesVerified:false,
  sourceErrors:errors.slice(0,4),
  summary:{fromCity,toCity,majorCity,sourceHits:candidateResults.length,
   matchingRoutes:eligible.length,matchingOrigins:eligible.map(x=>x.from).slice(0,6),
   geographicallyAccepted:accepted.length,errors:errors.slice(0,4)}};
}
