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
 {domain:'blablacar.com',operator:'BlaBlaCar Bus',mode:'coach'},
 {domain:'flixbus.ro',operator:'FlixBus',mode:'coach'},
 {domain:'flixbus.de',operator:'FlixBus',mode:'coach'},
 {domain:'flixbus.fr',operator:'FlixBus',mode:'coach'},
 {domain:'euro-fratello.ro',operator:'Euro Fratello',mode:'coach'},
 {domain:'tarsin.ro',operator:'Tarsin',mode:'coach'},
 {domain:'oebb.at',operator:'ÖBB',mode:'train'},
 {domain:'bahn.de',operator:'Deutsche Bahn',mode:'train'},
 {domain:'mavcsoport.hu',operator:'MÁV',mode:'train'},
 {domain:'cfrcalatori.ro',operator:'CFR Călători',mode:'train'},
 {domain:'sncf-connect.com',operator:'SNCF Connect',mode:'train'}
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
const cleanLocality=value=>{
 // Addresses supplied by geocoders can prefix a city with a postal code:
 // "Strada Nufărului 1, 410100 Oradea, România" must search "Oradea".
 // Strip only postal codes at the start of an address component.
 const text=trim(value,100).replace(/\s+/g,' ');
 return trim(text
  .replace(/^\d{4,6}[\s,–-]+/,'')
  .replace(/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}[\s,–-]+/i,''),75);
};
const locality=value=>{
 const own=cleanLocality(value?.city||value?.locality||value?.town);
 if(own)return own;
 const label=trim(value?.label||value?.name||'',220);
 const parts=label.split(',').map(x=>x.trim()).filter(Boolean);
 if(!parts.length)return '';
 // Street names and exact house numbers must NOT be sent to a search engine.
 const street=/\b(?:strada|str\.?|street|road|lane|avenue|boulevard|drive|close|mill|calea|bulevardul|ulica)\b/i;
 return cleanLocality(parts.length>1&&(street.test(parts[0])||/\d/.test(parts[0]))?parts[1]:parts[0]);
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

const radians=degrees=>degrees*Math.PI/180;
const earthRadius=6371;
const onGlobe=(p,q,t)=>{
 const a=radians(Number(p.latitude)),b=radians(Number(q.latitude));
 const d1=radians(Number(p.longitude)),d2=radians(Number(q.longitude));
 const cosine=Math.max(-1,Math.min(1,Math.sin(a)*Math.sin(b)+Math.cos(a)*Math.cos(b)*Math.cos(d2-d1)));
 const angle=Math.acos(cosine);
 if(angle<1e-9)return {latitude:Number(p.latitude),longitude:Number(p.longitude)};
 const x=Math.sin((1-t)*angle)/Math.sin(angle),y=Math.sin(t*angle)/Math.sin(angle);
 const X=x*Math.cos(a)*Math.cos(d1)+y*Math.cos(b)*Math.cos(d2);
 const Y=x*Math.cos(a)*Math.sin(d1)+y*Math.cos(b)*Math.sin(d2);
 const Z=x*Math.sin(a)+y*Math.sin(b);
 return {latitude:Math.atan2(Z,Math.hypot(X,Y))/Math.PI*180,
  longitude:Math.atan2(Y,X)/Math.PI*180};
};
const greatCircle=(a,b)=>{
 const p=onGlobe(a,b,0),q=onGlobe(a,b,1);
 return earthRadius*Math.acos(Math.max(-1,Math.min(1,
  Math.sin(radians(p.latitude))*Math.sin(radians(q.latitude))+
  Math.cos(radians(p.latitude))*Math.cos(radians(q.latitude))*
  Math.cos(radians(q.longitude-p.longitude)))));
};
/**
 * Discover major *candidate* interchanges from geography, never from an
 * embedded list of routes. Geoapify returns city positions, NOT services.
 * Only an official operator route page for BOTH halves can turn one of these
 * cities into an indicative rail/coach/coach+coach transfer alternative.
 */
export async function discoverGroundCorridorCities(env,{origin,destination,fetcher=fetch,maxCities=5}={}){
 const p={latitude:Number(origin?.latitude),longitude:Number(origin?.longitude)};
 const q={latitude:Number(destination?.latitude),longitude:Number(destination?.longitude)};
 if(!env?.GEOAPIFY_API_KEY||![p.latitude,p.longitude,q.latitude,q.longitude].every(Number.isFinite)||
   Math.abs(p.latitude)>90||Math.abs(q.latitude)>90||
   Math.abs(p.longitude)>180||Math.abs(q.longitude)>180)return [];
 const total=greatCircle(p,q);
 if(!Number.isFinite(total)||total<250)return [];
 const positions=[0.17,0.45,0.7,0.84];
 const lookups=await Promise.all(positions.map(async portion=>{
  const mid=onGlobe(p,q,portion);
  const url=new URL('https://api.geoapify.com/v2/places');
  url.searchParams.set('categories','populated_place.city');
  // Operator route titles are normally indexed in English. Request the
  // provider's translated place name instead of querying for Wien vs Vienna.
  url.searchParams.set('lang','en');
  url.searchParams.set('filter','circle:'+mid.longitude+','+mid.latitude+',175000');
  url.searchParams.set('bias','proximity:'+mid.longitude+','+mid.latitude);
  url.searchParams.set('limit','35');
  url.searchParams.set('apiKey',env.GEOAPIFY_API_KEY);
  try{
   const response=await fetcher(url,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(5500)});
   if(!response.ok)return [];
   const data=await response.json();
   return (Array.isArray(data.features)?data.features:[]).map(feature=>{
    const prop=feature.properties||{},raw=prop.datasource?.raw||{};
    const name=trim(raw['name:en']||prop.name_en||prop.name||prop.city||'',75);
    const coords={latitude:Number(prop.lat??feature?.geometry?.coordinates?.[1]),
     longitude:Number(prop.lon??feature?.geometry?.coordinates?.[0])};
    const pop=Number(prop.population??raw.population??0);
    const dist=Number.isFinite(coords.latitude)&&Number.isFinite(coords.longitude)?
      greatCircle(mid,coords):Infinity;
    const fromKm=Number.isFinite(coords.latitude)&&Number.isFinite(coords.longitude)?
      greatCircle(p,coords):Infinity;
    const toKm=Number.isFinite(coords.latitude)&&Number.isFinite(coords.longitude)?
      greatCircle(coords,q):Infinity;
    return {name,country_code:String(prop.country_code||'').toUpperCase(),
     population:Number.isFinite(pop)?pop:0,dist,fromKm,toKm,portion};
   }).filter(x=>x.name&&x.country_code&&(x.population>=40000||x.population===0)&&x.dist<=175&&
     x.fromKm>100&&x.toKm>100&&x.fromKm+x.toKm<=total*1.55+180)
    // A large city far from the corridor must not hide a closer
    // interchange such as the actual border/cross-Channel rail gateway.
    // Population is a secondary connectivity signal, not an identity list.
    .sort((a,b)=>{
     const score=x=>x.dist/175+
      (x.population>0?Math.max(0,0.16*Math.log10(1000000/x.population)):0.28);
     return score(a)-score(b)||b.population-a.population;
    }).slice(0,3);
  }catch{return []}
 }));
 const selected=[],seen=new Set();
 for(let rank=0;selected.length<maxCities&&rank<3;rank++){
  for(const group of lookups){
   const city=group[rank];
   if(!city||seen.has(fold(city.name)))continue;
   seen.add(fold(city.name));selected.push(city);
   if(selected.length>=maxCities)break;
  }
 }
 return selected;
}
/** Compose *route-page evidence*, never a fictional dated timetable.
 * Transfer city comes from geocoded geography and must appear as the end of
 * one official operator leg AND the beginning of another.
 */
export function composeOfficialGroundConnections(legs,{fromCity,toCity,interchanges=[],max=6}={}){
 const normalized=Array.isArray(legs)?legs:[];
 const results=[],seen=new Set();
 for(const city of interchanges){
  const mid=trim(city?.name||city,75);
  if(!mid||fold(mid)===fold(fromCity)||fold(mid)===fold(toCity))continue;
  const starts=normalized.filter(o=>fold(o.from)===fold(fromCity)&&fold(o.to)===fold(mid));
  const ends=normalized.filter(o=>fold(o.from)===fold(mid)&&fold(o.to)===fold(toCity));
  for(const first of starts)for(const second of ends){
   if(!first.url||!second.url||!first.operator||!second.operator)continue;
   const identity=fold(mid)+'|'+first.url+'|'+second.url;
   if(seen.has(identity))continue;
   seen.add(identity);
   results.push({
    id:'ground-connection:'+results.length,
    from:fromCity,to:toCity,transferCity:mid,
    segments:[first,second],modes:[first.mode,second.mode],
    journey_status:'indicative_operator_route_chain',
    timetable_verified:false,transfer_verified:false,
    door_to_door_complete:false,
    note:'Both operator route pages exist, but changeover, date, boarding stops, transfer time and total price are not confirmed'
   });
  }
 }
 // Show rail+coach, coach+rail, and coach-only networks alongside each other
 // when sources actually provide them; no mode combination is fabricated.
 const unique=[],duplicates=[],signatures=new Set();
 for(const route of results){
  const signature=route.modes.join('>')+'|'+route.transferCity;
  if(signatures.has(signature))duplicates.push(route);
  else {signatures.add(signature);unique.push(route)}
 }
 return [...unique,...duplicates].slice(0,Math.max(1,Math.min(12,max)));
}
async function discoverOfficialCorridorConnections(env,{
 origin,destination,majorCity,fromCity,toCity,braveKey,fetcher
}={}){
 if(!braveKey)return {connections:[],corridorCities:[],segmentPages:0,status:'provider_unavailable'};
 const cities=await discoverGroundCorridorCities(env,{origin,destination,fetcher,maxCities:5});
 if(!cities.length)return {connections:[],corridorCities:[],segmentPages:0,status:'corridor_city_unavailable'};
 const gateway=majorCity||fromCity,requests=[],searchedPairs=[];
 for(const city of cities){
  requests.push({from:gateway,to:city.name});
  requests.push({from:city.name,to:toCity});
 }
 // Query endpoints separately, not "route London via hardcoded X". Every X
 // comes from the geographic corridor. Concurrency is bounded for the API.
 let cursor=0;
 const pages=[];
 const worker=async()=>{
  while(cursor<requests.length){
   const index=cursor++,pair=requests[index];
   const lookup=async query=>{
    const u=new URL('https://api.search.brave.com/res/v1/web/search');
    u.searchParams.set('q',query);u.searchParams.set('count','20');
    try{
     const r=await fetcher(u,{headers:{Accept:'application/json',
      'X-Subscription-Token':braveKey},signal:AbortSignal.timeout(7000)});
     if(!r.ok)return [];
     const data=await r.json();
     const hits=(Array.isArray(data.web?.results)?data.web.results:[]).map(x=>({
      url:x.url,title:x.title,description:x.description,highlights:x.extra_snippets
     }));
     return normalizeMixedOperatorEvidence(hits,{
      origin:{city:pair.from},destination:{city:pair.to}
     }).filter(x=>fold(x.from)===fold(pair.from));
    }catch{return []}
   };
   let eligible=await lookup(pair.from+' to '+pair.to+
    ' train coach bus tickets official Eurostar FlixBus RegioJet BlaBlaCar');
   // A generic mixed-mode search is often dominated by coach results.
   // Ask again specifically for rail at the first hop and coach at the
   // last hop, WITHOUT hardcoding any departure, transfer or target city.
   const firstHop=fold(pair.from)===fold(gateway);
   const wantedMode=firstHop?'train':'coach';
   if(!eligible.some(x=>x.mode===wantedMode)){
    const query=firstHop?
     pair.from+' to '+pair.to+' train tickets Eurostar rail official operator':
     pair.from+' to '+pair.to+' coach tickets FlixBus official bus route';
    eligible=[...eligible,...await lookup(query)];
   }
   pages.push(...eligible);
   searchedPairs.push({from:pair.from,to:pair.to,
    modes:[...new Set(eligible.map(x=>x.mode))],
    operatorPages:eligible.length});
  }
 };
 await Promise.all(Array.from({length:Math.min(4,requests.length)},()=>worker()));
 return {
  connections:composeOfficialGroundConnections(pages,{
   fromCity:gateway,toCity,interchanges:cities,max:6
  }),
  corridorCities:cities.map(x=>({name:x.name,country_code:x.country_code})),
  segmentPages:pages.length,
  searchedPairs:searchedPairs.sort((a,b)=>a.from.localeCompare(b.from)||a.to.localeCompare(b.to)),
  status:'operator_route_page_discovery'
 };
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
  // A major city already discovered by Geoapify Places within 140 km of the
  // actual departure coordinates, with matching country code, is stronger
  // evidence than a second fuzzy worldwide geocoding search.
  if(majorCity&&fold(option.from)===fold(majorCity))
   return {...option,access_transfer_verified:false,
    country_match_verified:true,origin_country_evidence:'nearby_city_geography'};
  const valid=await verifyOriginGeography(env,option.from,sourceCountry,{fetcher});
  return valid?{...option,access_transfer_verified:false,country_match_verified:true,
   origin_country_evidence:'geocode_city'}:null;
 }));
 const accepted=verdicts.filter(Boolean);
 // Independently look for rail+coach and coach-only operator route chains.
 // An unavailable provider or unconfirmed leg never becomes an invented route.
 const corridor=await discoverOfficialCorridorConnections(env,{
  origin,destination,majorCity,fromCity,toCity,braveKey,fetcher
 });
 return {connections:corridor.connections,
  corridorDiscoveryStatus:corridor.status,
  corridorCitiesChecked:corridor.corridorCities,
  corridorSegmentPages:corridor.segmentPages,
  status:accepted.length?'official_operator_options':'no_verified_operator_pages',
  operators:accepted,queriesUsed:queries.length,scheduledServicesVerified:false,
  sourceErrors:errors.slice(0,4),
  summary:{fromCity,toCity,majorCity,sourceHits:candidateResults.length,
   matchingRoutes:eligible.length,matchingOrigins:eligible.map(x=>x.from).slice(0,6),
   geographicallyAccepted:accepted.length,errors:errors.slice(0,4),
   corridorCities:corridor.corridorCities,
   corridorOperatorPages:corridor.segmentPages,
   corridorSearchedPairs:corridor.searchedPairs||[]}};
}
