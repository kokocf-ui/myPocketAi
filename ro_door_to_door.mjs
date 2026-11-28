import {inRomaniaApprox,pointDistanceMeters} from './regional_gtfs_registry.mjs';
import {romanianUrbanRegion,planRomanianUrbanViaOracle} from './ro_urban_client.mjs';

const RO_DIACRITICS={
  'ă':'a','â':'a','î':'i','ș':'s','ş':'s','ț':'t','ţ':'t',
  'Ă':'a','Â':'a','Î':'i','Ș':'s','Ş':'s','Ț':'t','Ţ':'t'
};
const fold=value=>{
  const s=String(value||'').replace(/[ăâîșşțţĂÂÎȘŞȚŢ]/g,c=>RO_DIACRITICS[c]||c);
  const ascii=/[^\x00-\x7f]/.test(s)?s.normalize('NFD').replace(/[\u0300-\u036f]/g,''):s;
  return ascii.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
};

const defaultFetch=(...args)=>globalThis.fetch(...args);

const validPoint=p=>{
  if(!p)return false;
  const lat=Number(p.latitude??p.lat),lon=Number(p.longitude??p.lon);
  return p.latitude!==null&&p.longitude!==null&&(p.lat!==null||p.latitude!==undefined)&&
    Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180;
};

const toLatLon=p=>validPoint(p)?{
  latitude:Number(p.latitude??p.lat),
  longitude:Number(p.longitude??p.lon),
  ...(p.label?{label:String(p.label)}:{})
}:null;

const GENERIC_STATION_WORDS=new Set([
  'autogara','autogarile','autogari','gara','garile','statia','statie','statii',
  'plecari','sosiri','terminal','terminalul','bus','coach','train','rail','station',
  'railway','halta','hm','hc','gr','grupa','romania','judetul','jud','municipiul',
  'orașul','orasul','centru','principala','central','de','la','din','cel','cea','ale','ai'
]);

const stationCache=new Map();
const cityCenterCache=new Map();
const walkRouteCache=new Map();

function withInflight(map,key,fn){
  if(!map)return fn();
  if(map.has(key))return map.get(key);
  const p=Promise.resolve().then(fn).finally(()=>map.delete(key));
  map.set(key,p);
  return p;
}

function isSupraLocal(value){
  const n=fold(value);
  return !n||/\b(?:metropolitan|zona metropolitana|aglomeratie|judet(?:ul)?|county|region)\b/.test(n);
}

function specificCity(props){
  const raw=String(props?.village||props?.town||props?.city||
    (isSupraLocal(props?.municipality)?'':props?.municipality)||'').trim();
  if(raw&&!isSupraLocal(raw))return raw;
  const fromFormatted=String(props?.address_line2||props?.formatted||'')
    .match(/\b\d{5,6}\s+([A-Za-zĂÂÎȘȚăâîșțŞŢşţ][A-Za-zĂÂÎȘȚăâîșțŞŢşţ -]{1,40}?)\s*(?:,|$)/)?.[1]?.trim()||'';
  return !isSupraLocal(fromFormatted)?fromFormatted:'';
}

export function parseBiloStopLabel(rawName,locality='',cityHint=''){
  const raw=String(rawName||'').trim();
  const dotParts=raw.split(/\s*[·•]\s*/).map(s=>s.trim()).filter(Boolean);
  let city=String(locality||'').trim();
  let stop=raw;
  if(dotParts.length>=2){
    if(!city)city=dotParts[0];
    stop=dotParts.slice(1).join(' ');
  }else if(!city&&cityHint){
    city=String(cityHint).trim();
  }
  const parenMatch=stop.match(/^(.+?)\s*\(([^()]{2,50})\)\s*$/);
  if(parenMatch){
    if(!city)city=parenMatch[2].trim();
    else if(fold(parenMatch[2])===fold(city))stop=parenMatch[1].trim();
  }
  const cityFold=fold(city);
  const stopTokens=fold(stop).split(' ').filter(Boolean);
  const cityWords=new Set(cityFold.split(' ').filter(Boolean));
  const distinctive=stopTokens.filter(w=>w.length>=2&&!GENERIC_STATION_WORDS.has(w)&&!cityWords.has(w));
  const isBareCity=Boolean(cityFold)&&(fold(stop)===cityFold||
    stopTokens.every(w=>cityWords.has(w)));
  const displayLabel=dotParts.length>=2?raw:(city&&!fold(raw).includes(cityFold)?`${raw}, ${city}`:raw);
  return {raw,city,stop,distinctive,isBareCity,displayLabel};
}

async function resolveCityCenter(env,city,anchorPoint,fetchImpl=defaultFetch,inflight=null){
  const cf=fold(city);
  if(!cf)return null;
  if(validPoint(anchorPoint)){
    const anchorPt=toLatLon(anchorPoint);
    const anchorCity=fold(anchorPoint.city||anchorPoint.label||'');
    if(inRomaniaApprox(anchorPt)&&(!anchorCity||anchorCity.includes(cf)||cf.split(' ').every(w=>anchorCity.includes(w)))){
      return anchorPt;
    }
  }
  const cached=cityCenterCache.get(cf);
  if(cached&&cached.until>Date.now())return cached.point;
  if(!env?.GEOAPIFY_API_KEY)return null;
  return withInflight(inflight,'city:'+cf,async()=>{
    try{
      const u=new URL('https://api.geoapify.com/v1/geocode/search');
      u.searchParams.set('text',`${city}, Romania`);
      u.searchParams.set('type','city');
      u.searchParams.set('filter','countrycode:ro');
      u.searchParams.set('format','json');
      u.searchParams.set('limit','5');
      u.searchParams.set('apiKey',String(env.GEOAPIFY_API_KEY));
      const r=await fetchImpl(u.href,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(4500)});
      if(!r.ok)return null;
      const data=await r.json();
      const rows=Array.isArray(data.results)?data.results:
        Array.isArray(data.features)?data.features.map(f=>f.properties||{}):[];
      const match=rows.find(p=>{
        const pt=toLatLon(p);
        if(!pt||!inRomaniaApprox(pt))return false;
        const sc=fold(specificCity(p)||p.name||'');
        return sc===cf||sc.startsWith(cf)||cf.split(' ').every(w=>sc.split(' ').includes(w));
      });
      const pt=match?toLatLon(match):null;
      if(pt)cityCenterCache.set(cf,{point:pt,until:Date.now()+3600000});
      return pt;
    }catch{return null;}
  });
}

function candidateMatchesCity(p,pt,cityFold,cityCenter){
  const sc=fold(specificCity(p));
  const cityWords=cityFold.split(' ').filter(Boolean);
  if(sc&&(sc===cityFold||cityWords.every(w=>sc.split(' ').includes(w))))return true;
  if(cityCenter&&pointDistanceMeters(pt,cityCenter)<=14000){
    const fmt=fold([p.formatted,p.address_line2,p.city,p.municipality].filter(Boolean).join(' '));
    if(!sc||cityWords.every(w=>fmt.includes(w)))return true;
  }
  return false;
}

function extractRomanianStreetCandidates(blob){
  const rawRx=/\b((?:Strada|Str\.?|Calea|Bulevardul|Bd\.?|B-dul|Pia[tțţ]a|P-[tțţ]a|[SȘŞ]oseaua|[SȘŞ]os\.?|Aleea|Splaiul|Drumul)\s+[A-Za-zĂÂÎȘȚăâîșțŞŢşţ0-9][A-Za-zĂÂÎȘȚăâîșțŞŢşţ0-9 .,'\x2f-]{2,64})/gi;
  const out=[];
  for(const m of blob.matchAll(rawRx)){
    const s=m[1]
      .replace(/(?<!\b(?:str|bd|sos|șos|şos|nr))\.\s+[\s\S]*$/i,'')
      .replace(/\s*(?:[;|()\n\r–—]|\b(?:telefon|tel\.?|jud(?:ețul|etul|\.)?|cod\b|program|rezerv[aă]ri|plec[aă]ri|zilnic)\b)[\s\S]*$/i,'')
      .replace(/\s*,\s+(?!(?:nr\b|num[aă]rul\b|\d{1,4}[A-Za-z]?\b))[\s\S]*$/i,'')
      .replace(/\s+-\s+[\s\S]*$/,'')
      .replace(/[.,;:\s-]+$/,'')
      .replace(/\s+/g,' ')
      .trim();
    if(s.length>=6&&s.length<=75)out.push(s);
  }
  return out;
}

export async function resolveRomanianIntercityStop(env,{
  rawName,locality='',cityHint='',anchorPoint=null,mode='bus',railReplacement=false,
  sourceStopRef=null,fetchImpl=defaultFetch,inflight=null
}={}){
  const parsed=parseBiloStopLabel(rawName,locality,cityHint);
  if(!parsed.city||!parsed.stop)return null;
  const modeLc=String(mode||'').toLowerCase();
  const isRail=['train','rail'].includes(modeLc)||railReplacement===true;

  // Tier 0: Provider-supplied stop coordinates inside Romania
  if(validPoint(sourceStopRef)){
    const refPt=toLatLon(sourceStopRef);
    if(inRomaniaApprox(refPt)){
      const center=await resolveCityCenter(env,parsed.city,anchorPoint,fetchImpl,inflight);
      if(!center||pointDistanceMeters(refPt,center)<=25000){
        return {latitude:refPt.latitude,longitude:refPt.longitude,
          label:parsed.displayLabel,verified:true,source:'bilo_stop_ref'};
      }
    }
  }

  // Never guess which coach terminal in a city if Bilo only gave a bare city name for a bus/coach.
  if(parsed.isBareCity&&!isRail)return null;

  const cacheKey=[fold(parsed.city),fold(parsed.stop),isRail?'rail':'road'].join('|');
  const cached=stationCache.get(cacheKey);
  if(cached&&cached.until>Date.now())return cached.value;

  const save=val=>{
    if(stationCache.size>=128)stationCache.delete(stationCache.keys().next().value);
    stationCache.set(cacheKey,{value:val,until:Date.now()+(val?1800000:180000)});
    return val;
  };

  if(!env?.GEOAPIFY_API_KEY)return null;
  return withInflight(inflight,'stop:'+cacheKey,async()=>{
  const cityFold=fold(parsed.city);
  const cityCenter=await resolveCityCenter(env,parsed.city,anchorPoint,fetchImpl,inflight);

  const geocodeJson=async text=>{
    try{
      const u=new URL('https://api.geoapify.com/v1/geocode/search');
      u.searchParams.set('text',text);
      u.searchParams.set('filter','countrycode:ro');
      u.searchParams.set('format','json');
      u.searchParams.set('limit','10');
      if(cityCenter)u.searchParams.set('bias',`proximity:${cityCenter.longitude},${cityCenter.latitude}`);
      u.searchParams.set('apiKey',String(env.GEOAPIFY_API_KEY));
      const r=await fetchImpl(u.href,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(4500)});
      if(!r.ok)return [];
      const data=await r.json();
      return Array.isArray(data.results)?data.results:
        Array.isArray(data.features)?data.features.map(f=>f.properties||{}):[];
    }catch{return [];}
  };

  const placesNearCity=async()=>{
    if(!cityCenter)return [];
    try{
      const u=new URL('https://api.geoapify.com/v2/places');
      u.searchParams.set('categories',isRail
        ?'public_transport.train,building.transportation,public_transport'
        :'public_transport,service.travel_agency,building.transportation');
      u.searchParams.set('filter',`circle:${cityCenter.longitude},${cityCenter.latitude},12000`);
      u.searchParams.set('bias',`proximity:${cityCenter.longitude},${cityCenter.latitude}`);
      u.searchParams.set('limit','25');
      u.searchParams.set('apiKey',String(env.GEOAPIFY_API_KEY));
      const r=await fetchImpl(u.href,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(4500)});
      if(!r.ok)return [];
      const data=await r.json();
      return (Array.isArray(data.features)?data.features:[]).map(f=>({
        ...(f.properties||{}),
        lat:f.properties?.lat??f.geometry?.coordinates?.[1],
        lon:f.properties?.lon??f.geometry?.coordinates?.[0]
      }));
    }catch{return [];}
  };

  const scoreCandidate=p=>{
    const pt=toLatLon(p);
    if(!pt||!inRomaniaApprox(pt))return null;
    if(String(p.country_code||'ro').toLowerCase()!=='ro')return null;
    if(/^(?:city|town|village|municipality|county|state|country|postcode|suburb|district)$/i.test(String(p.result_type||'')))
      return null;
    if(!candidateMatchesCity(p,pt,cityFold,cityCenter))return null;

    const raw=p.datasource?.raw||{};
    const hay=fold([p.name,p.brand,raw.name,raw['name:ro'],raw['name:en'],
      raw.operator,raw.brand,raw.network,p.address_line1].filter(Boolean).join(' '));
    const hayWords=new Set(hay.split(' ').filter(Boolean));
    const cats=fold((Array.isArray(p.categories)?p.categories:[]).join(' ')+' '+(p.result_type||''));
    const isTransit=/public_transport|railway|train|bus|coach|autogara|gara|station|transportation|travel_agency/.test(cats+' '+hay);
    const streetRequested=/\b(?:strada|str|calea|bulevardul|bd|piata|parcare|parcarea|aleea|soseaua)\b/.test(fold(parsed.stop));

    if(parsed.isBareCity&&isRail){
      if(!/railway|train|gara|station/.test(cats+' '+hay))return null;
      const central=/\b(?:central|nord|gara)\b/.test(hay)?25:0;
      const distPenalty=cityCenter?pointDistanceMeters(pt,cityCenter)/1000:0;
      return {pt,score:100+central-distPenalty,source:'geoapify_rail_station'};
    }

    if(!parsed.distinctive.length){
      if(!isTransit)return null;
      return {pt,score:60,source:'geoapify_transit_stop'};
    }

    if(/^(?:street)$/i.test(String(p.result_type||''))&&!streetRequested&&!isTransit)return null;
    const matched=parsed.distinctive.filter(t=>hayWords.has(t)||[...hayWords].some(hw=>hw.length>=4&&(hw.startsWith(t)||t.startsWith(hw))));
    if(matched.length<parsed.distinctive.length)return null;
    return {pt,score:120+(isTransit?40:0)+(p.street?10:0),source:'geoapify_verified_stop'};
  };

  // Tier 1a: Forward geocode primary query first (1 subrequest)
  const primaryQuery=parsed.isBareCity&&isRail
    ?`Gara ${parsed.city}, ${parsed.city}, Romania`
    :`${parsed.stop}, ${parsed.city}, Romania`;
  const geoPrimary=await geocodeJson(primaryQuery);
  const tier1a=geoPrimary.map(scoreCandidate).filter(Boolean).sort((a,b)=>b.score-a.score);
  if(tier1a.length){
    return save({latitude:tier1a[0].pt.latitude,longitude:tier1a[0].pt.longitude,
      label:parsed.displayLabel,verified:true,source:tier1a[0].source});
  }

  // Tier 1b: Local public_transport / terminal Places + alt query only if needed
  const altQuery=!parsed.isBareCity&&parsed.distinctive.length
    ?`Autogara ${parsed.distinctive.join(' ')}, ${parsed.city}, Romania`:null;
  const [geoAlt,placeRows]=await Promise.all([
    altQuery&&fold(altQuery)!==fold(primaryQuery)?geocodeJson(altQuery):Promise.resolve([]),
    placesNearCity()
  ]);
  const tier1b=[...placeRows,...geoAlt].map(scoreCandidate).filter(Boolean).sort((a,b)=>b.score-a.score);
  if(tier1b.length){
    return save({latitude:tier1b[0].pt.latitude,longitude:tier1b[0].pt.longitude,
      label:parsed.displayLabel,verified:true,source:tier1b[0].source});
  }

  // Tier 2: Published street address evidence verified in Geoapify (when OSM lacks the private autogara name)
  if(env?.EXA_API_KEY&&parsed.distinctive.length){
    try{
      const exaRes=await fetchImpl('https://api.exa.ai/search',{
        method:'POST',
        headers:{'Content-Type':'application/json','x-api-key':String(env.EXA_API_KEY)},
        body:JSON.stringify({
          query:`"${parsed.stop}" "${parsed.city}" adresa strada`,
          type:'auto',numResults:3,
          contents:{highlights:{numSentences:2,highlightsPerUrl:2},text:{maxCharacters:1200}}
        }),
        signal:AbortSignal.timeout(4500)
      });
      if(exaRes.ok){
        const exaJson=await exaRes.json();
        const cityWordSet=new Set(cityFold.split(' ').filter(Boolean));
        const counts=new Map();
        for(const r of (exaJson.results||[]).slice(0,3)){
          const blob=[r.title,...(Array.isArray(r.highlights)?r.highlights:[]),String(r.text||'').slice(0,1200)].join('\n');
          const blobFold=fold(blob);
          if(!cityFold.split(' ').every(w=>blobFold.includes(w)))continue;
          if(!parsed.distinctive.every(t=>blobFold.includes(t)))continue;
          for(const addr of extractRomanianStreetCandidates(blob)){
            const key=fold(addr);
            counts.set(key,{addr,hits:(counts.get(key)?.hits||0)+1});
          }
        }
        const extracted=[...counts.values()].sort((a,b)=>b.hits-a.hits||b.addr.length-a.addr.length).slice(0,2);
        for(const cand of extracted){
          const numMatch=cand.addr.match(/\b(\d{1,4}[a-z]?)(?:\s*[-/]\s*\d+[a-z]?)?\s*$/i);
          const wantedHouse=numMatch?numMatch[1].toLowerCase():'';
          let streetCore=fold(cand.addr
            .replace(/\b(?:strada|str|calea|bulevardul|bd|b dul|piata|p ta|soseaua|sos|aleea|splaiul|drumul|nr|numarul)\b/gi,' ')
            .replace(/\b\d+[a-z]?(?:[-/]\d+[a-z]?)?\b/gi,' '))
            .split(' ').filter(w=>w.length>=3);
          while(streetCore.length>1&&cityWordSet.has(streetCore.at(-1)))streetCore.pop();
          if(!streetCore.length)continue;
          const rows=await geocodeJson(`${cand.addr}, ${parsed.city}, Romania`);
          for(const row of rows){
            const pt=toLatLon(row);
            if(!pt||!inRomaniaApprox(pt)||!candidateMatchesCity(row,pt,cityFold,cityCenter))continue;
            const rowStreet=fold(row.street||row.name||'');
            if(!streetCore.every(w=>rowStreet.includes(w)))continue;
            if(wantedHouse&&row.housenumber&&!fold(row.housenumber).startsWith(fold(wantedHouse)))continue;
            return save({latitude:pt.latitude,longitude:pt.longitude,
              label:parsed.displayLabel,verified:true,source:'verified_web_street_geocode'});
          }
        }
      }
    }catch{}
  }

  return save(null);
  });
}

function decimateWalkCoords(coords,maxPoints=200){
  if(!Array.isArray(coords)||coords.length<=maxPoints)return coords;
  const out=[coords[0]];
  const step=(coords.length-2)/(maxPoints-2);
  for(let i=1;i<maxPoints-1;i++)out.push(coords[Math.round(i*step)]);
  out.push(coords.at(-1));
  return out;
}

export async function buildVerifiedWalkingLeg(env,fromPt,toPt,{
  departureTime=null,arrivalTime=null,lang='ro',fetchImpl=defaultFetch,inflight=null
}={}){
  const a=toLatLon(fromPt),b=toLatLon(toPt);
  if(!a||!b||!env?.GEOAPIFY_API_KEY)return null;
  const dist=pointDistanceMeters(a,b);
  if(!Number.isFinite(dist)||dist<15||dist>10000)return null;
  const key=[a.latitude.toFixed(5),a.longitude.toFixed(5),b.latitude.toFixed(5),b.longitude.toFixed(5),lang].join('|');
  let route=walkRouteCache.get(key);
  if(!route||route.until<=Date.now()){
    route=await withInflight(inflight,'walk:'+key,async()=>{
      try{
        const u=new URL('https://api.geoapify.com/v1/routing');
        u.searchParams.set('waypoints',`${a.latitude},${a.longitude}|${b.latitude},${b.longitude}`);
        u.searchParams.set('mode','walk');
        u.searchParams.set('lang',['ro','en','fr','de','it','es','pt','nl','ru','pl'].includes(lang)?lang:'ro');
        u.searchParams.set('apiKey',String(env.GEOAPIFY_API_KEY));
        const r=await fetchImpl(u.href,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(5500)});
        if(!r.ok)return null;
        const data=await r.json();
        const feat=data?.features?.[0];
        const props=feat?.properties;
        const rawCoords=feat?.geometry?.type==='MultiLineString'
          ?feat.geometry.coordinates.flat()
          :feat?.geometry?.type==='LineString'?feat.geometry.coordinates:[];
        const validCoords=rawCoords.filter(c=>Array.isArray(c)&&Number.isFinite(c[0])&&Number.isFinite(c[1]));
        const meters=Number(props?.distance),seconds=Number(props?.time);
        if(validCoords.length<2||!Number.isFinite(meters)||meters<=0||!Number.isFinite(seconds)||seconds<=0)return null;
        const startPt={latitude:validCoords[0][1],longitude:validCoords[0][0]};
        const endPt={latitude:validCoords.at(-1)[1],longitude:validCoords.at(-1)[0]};
        if(pointDistanceMeters(startPt,a)>150||pointDistanceMeters(endPt,b)>150)return null;
        const coords=decimateWalkCoords(validCoords,200);
        const steps=(props?.legs?.[0]?.steps||[]).map(s=>({
          text:String(s?.instruction?.text||'').trim(),
          distanceMeters:Number.isFinite(s?.distance)?Math.round(s.distance):0
        })).filter(s=>s.text).slice(0,30);
        const entry={until:Date.now()+900000,value:{coords,meters:Math.round(meters),seconds:Math.round(seconds),steps}};
        if(walkRouteCache.size>=128)walkRouteCache.delete(walkRouteCache.keys().next().value);
        walkRouteCache.set(key,entry);
        return entry;
      }catch{return null;}
    });
    if(!route)return null;
  }
  const {coords,meters,seconds,steps}=route.value;
  let depMs=departureTime?Date.parse(departureTime):null;
  let arrMs=arrivalTime?Date.parse(arrivalTime):null;
  if(Number.isFinite(arrMs)&&!Number.isFinite(depMs))depMs=arrMs-seconds*1000;
  else if(Number.isFinite(depMs)&&!Number.isFinite(arrMs))arrMs=depMs+seconds*1000;
  else if(!Number.isFinite(depMs)||!Number.isFinite(arrMs)){depMs=Date.now();arrMs=depMs+seconds*1000;}
  const fromLabel=String(fromPt.label||'Plecarea').trim();
  const toLabel=String(toPt.label||'Destinația').trim();
  return {
    mode:'walking',
    lineNames:[],
    stops:[],
    from:fromLabel,
    to:toLabel,
    departurePoint:{lat:a.latitude,lon:a.longitude,latitude:a.latitude,longitude:a.longitude,label:fromLabel},
    arrivalPoint:{lat:b.latitude,lon:b.longitude,latitude:b.latitude,longitude:b.longitude,label:toLabel},
    arrivalLatLon:{lat:b.latitude,lon:b.longitude},
    departureTime:new Date(depMs).toISOString(),
    arrivalTime:new Date(arrMs).toISOString(),
    durationMinutes:Math.max(1,Math.round(seconds/60)),
    distanceMeters:meters,
    coordinates:coords,
    geometryAvailable:true,
    steps,
    verified:true,
    provider:'Geoapify walk'
  };
}

const isWalkMode=mode=>/^(?:walking|walk|foot|pedestrian)$/i.test(String(mode||''));

function materializeLocalJourneyLegs(journey,fromPt,toPt,maxRadiusM=350){
  const raw=Array.isArray(journey?.legs)?journey.legs.map(l=>({
    ...l,
    lineNames:Array.isArray(l?.lineNames)?l.lineNames:[],
    stops:Array.isArray(l?.stops)?l.stops:[]
  })):[];
  if(!raw.length)return null;
  const fromLabel=String(fromPt?.label||'Plecarea').trim();
  const toLabel=String(toPt?.label||'Destinația').trim();

  if(isWalkMode(raw[0].mode)){
    const start=toLatLon(raw[0].departurePoint);
    if(!start||pointDistanceMeters(start,fromPt)>maxRadiusM)return null;
    if(fromLabel)raw[0].from=fromLabel;
  }else{
    const w=journey?.walkToFirstStop;
    const stopPt=toLatLon(raw[0].departurePoint||journey?.access||journey?.boarding_stop);
    const vehDepMs=Date.parse(raw[0].departureTime||'');
    if(w?.verified&&Array.isArray(w.coordinates)&&w.coordinates.length>=2&&stopPt&&Number.isFinite(vehDepMs)){
      const wStart={latitude:w.coordinates[0][1],longitude:w.coordinates[0][0]};
      if(pointDistanceMeters(wStart,fromPt)>maxRadiusM)return null;
      if((w.distanceMeters??0)>=15){
        const durMin=Math.max(1,Math.ceil(Number(w.durationMinutes)||1));
        const stopLabel=String(raw[0].from||journey?.access?.stop_name||'Stație').trim();
        raw.unshift({
          mode:'walking',
          lineNames:[],
          stops:[],
          from:fromLabel,
          to:stopLabel,
          departurePoint:{lat:fromPt.latitude,lon:fromPt.longitude,latitude:fromPt.latitude,longitude:fromPt.longitude,label:fromLabel},
          arrivalPoint:{lat:stopPt.latitude,lon:stopPt.longitude,latitude:stopPt.latitude,longitude:stopPt.longitude,label:stopLabel},
          arrivalLatLon:{lat:stopPt.latitude,lon:stopPt.longitude},
          departureTime:new Date(vehDepMs-durMin*60000).toISOString(),
          arrivalTime:raw[0].departureTime,
          durationMinutes:durMin,
          distanceMeters:w.distanceMeters,
          coordinates:w.coordinates,
          geometryAvailable:true,
          verified:true,
          provider:'Geoapify walk'
        });
      }
    }else if(!stopPt||pointDistanceMeters(stopPt,fromPt)>120){
      return null;
    }
  }

  const lastIdx=raw.length-1;
  if(isWalkMode(raw[lastIdx].mode)){
    const end=toLatLon(raw[lastIdx].arrivalPoint||raw[lastIdx].arrivalLatLon);
    if(!end||pointDistanceMeters(end,toPt)>maxRadiusM)return null;
    if(toLabel)raw[lastIdx].to=toLabel;
    raw[lastIdx].arrivalPoint={lat:end.latitude,lon:end.longitude,latitude:end.latitude,longitude:end.longitude,label:toLabel};
    raw[lastIdx].arrivalLatLon={lat:end.latitude,lon:end.longitude};
  }else{
    const w=journey?.walkFromLastStop;
    const stopPt=toLatLon(raw[lastIdx].arrivalPoint||raw[lastIdx].arrivalLatLon||journey?.egress);
    const vehArrMs=Date.parse(raw[lastIdx].arrivalTime||'');
    if(w?.verified&&Array.isArray(w.coordinates)&&w.coordinates.length>=2&&stopPt&&Number.isFinite(vehArrMs)){
      const wEnd={latitude:w.coordinates.at(-1)[1],longitude:w.coordinates.at(-1)[0]};
      if(pointDistanceMeters(wEnd,toPt)>maxRadiusM)return null;
      if((w.distanceMeters??0)>=15){
        const durMin=Math.max(1,Math.ceil(Number(w.durationMinutes)||1));
        const stopLabel=String(raw[lastIdx].to||journey?.egress?.stop_name||'Stație').trim();
        raw.push({
          mode:'walking',
          lineNames:[],
          stops:[],
          from:stopLabel,
          to:toLabel,
          departurePoint:{lat:stopPt.latitude,lon:stopPt.longitude,latitude:stopPt.latitude,longitude:stopPt.longitude,label:stopLabel},
          arrivalPoint:{lat:toPt.latitude,lon:toPt.longitude,latitude:toPt.latitude,longitude:toPt.longitude,label:toLabel},
          arrivalLatLon:{lat:toPt.latitude,lon:toPt.longitude},
          departureTime:raw[lastIdx].arrivalTime,
          arrivalTime:new Date(vehArrMs+durMin*60000).toISOString(),
          durationMinutes:durMin,
          distanceMeters:w.distanceMeters,
          coordinates:w.coordinates,
          geometryAvailable:true,
          verified:true,
          provider:'Geoapify walk'
        });
      }
    }else if(!stopPt||pointDistanceMeters(stopPt,toPt)>120){
      return null;
    }
  }

  const startMs=Date.parse(raw[0].departureTime||journey?.startDateTime||'');
  const endMs=Date.parse(raw.at(-1).arrivalTime||journey?.arrivalDateTime||'');
  if(!Number.isFinite(startMs)||!Number.isFinite(endMs)||endMs<startMs)return null;
  return {legs:raw,startMs,endMs};
}

const osmUrbanCache=new Map();

async function planOsmUrbanTransitSegment(env,fromPt,toPt,{
  latestArrivalMs=null,earliestStartMs=null,lang='ro',fetchImpl=defaultFetch,inflight=null
}={}){
  const dist=pointDistanceMeters(fromPt,toPt);
  if(!Number.isFinite(dist)||dist<1400||dist>16000)return null;
  const allowFallback=env?.RO_OSM_URBAN_FALLBACK==='true'||
    (env?.RO_OSM_URBAN_FALLBACK!=='false'&&(typeof env?.RO_URBAN_VPC?.fetch==='function'||Boolean(env?.RO_URBAN_API_URL)));
  if(!allowFallback)return null;

  const gridKey=[fromPt.latitude.toFixed(3),fromPt.longitude.toFixed(3),
    toPt.latitude.toFixed(3),toPt.longitude.toFixed(3)].join('|');
  let topo=osmUrbanCache.get(gridKey);
  if(!topo||topo.until<=Date.now()){
    topo=await withInflight(inflight,'osm-urban:'+gridKey,async()=>{
      const q=`[out:json][timeout:4];(node(around:950,${fromPt.latitude.toFixed(5)},${fromPt.longitude.toFixed(5)})["public_transport"~"stop_position|platform"];node(around:950,${fromPt.latitude.toFixed(5)},${fromPt.longitude.toFixed(5)})["highway"="bus_stop"];node(around:950,${fromPt.latitude.toFixed(5)},${fromPt.longitude.toFixed(5)})["railway"="tram_stop"];)->.starts;(node(around:950,${toPt.latitude.toFixed(5)},${toPt.longitude.toFixed(5)})["public_transport"~"stop_position|platform"];node(around:950,${toPt.latitude.toFixed(5)},${toPt.longitude.toFixed(5)})["highway"="bus_stop"];node(around:950,${toPt.latitude.toFixed(5)},${toPt.longitude.toFixed(5)})["railway"="tram_stop"];)->.ends;rel(bn.starts)["type"="route"]["route"~"^(tram|bus|trolleybus|subway|light_rail)$"]->.r1;rel.r1(bn.ends)->.direct;node(r.direct)->.rnodes;(.starts;.ends;.direct;.rnodes;);out body;`;
      let elements=null;
      for(const endpoint of ['https://overpass.private.coffee/api/interpreter','https://overpass.kumi.systems/api/interpreter']){
        try{
          const res=await fetchImpl(endpoint,{
            method:'POST',
            headers:{'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8','Accept':'application/json'},
            body:'data='+encodeURIComponent(q),
            signal:AbortSignal.timeout(4200)
          });
          if(!res.ok)continue;
          const json=await res.json();
          if(Array.isArray(json?.elements)){elements=json.elements;break;}
        }catch{}
      }
      if(!elements){return null;}
      const nodes=new Map();
      const rels=[];
      for(const el of elements){
        if(el?.type==='node'&&Number.isFinite(el.lat)&&Number.isFinite(el.lon))nodes.set(el.id,el);
        else if(el?.type==='relation'&&Array.isArray(el.members))rels.push(el);
      }
      const modeMap={tram:'tram',light_rail:'tram',bus:'bus',trolleybus:'trolleybus',subway:'metro'};
      let best=null;
      for(const rel of rels){
        const tags=rel.tags||{};
        const mode=modeMap[String(tags.route||'').toLowerCase()];
        const ref=String(tags.ref||tags.name||'').trim().slice(0,40);
        if(!mode||!ref)continue;
        const stopMembers=rel.members
          .filter(m=>m?.type==='node'&&nodes.has(m.ref)&&!/^(?:way|track)$/i.test(String(m.role||'')))
          .map(m=>nodes.get(m.ref));
        if(stopMembers.length<2)continue;
        for(let i=0;i<stopMembers.length-1;i++){
          const aNode=stopMembers[i];
          const dA=pointDistanceMeters(fromPt,{latitude:aNode.lat,longitude:aNode.lon});
          if(dA>950)continue;
          for(let k=i+1;k<stopMembers.length;k++){
            const bNode=stopMembers[k];
            const dB=pointDistanceMeters(toPt,{latitude:bNode.lat,longitude:bNode.lon});
            if(dB>950)continue;
            if(pointDistanceMeters({latitude:aNode.lat,longitude:aNode.lon},{latitude:bNode.lat,longitude:bNode.lon})<500)continue;
            const bonus=(mode==='tram'||mode==='metro')?-60:mode==='trolleybus'?-30:0;
            const score=dA+dB+(k-i)*16+bonus;
            if(!best||score<best.score){
              const slice=stopMembers.slice(i,k+1);
              const coords=slice.map(n=>[Number(n.lon),Number(n.lat)]);
              const fromStopName=String(aNode.tags?.name||aNode.tags?.['name:ro']||'Stație transport local').trim();
              const toStopName=String(bNode.tags?.name||bNode.tags?.['name:ro']||'Stație transport local').trim();
              best={
                score,mode,ref,
                operator:String(tags.operator||tags.network||'').trim().slice(0,60),
                stopCount:Math.max(1,k-i),
                aPt:{latitude:Number(aNode.lat),longitude:Number(aNode.lon),label:fromStopName},
                bPt:{latitude:Number(bNode.lat),longitude:Number(bNode.lon),label:toStopName},
                coords
              };
            }
          }
        }
      }
      const entry={until:Date.now()+(best?1800000:300000),value:best};
      if(osmUrbanCache.size>=64)osmUrbanCache.delete(osmUrbanCache.keys().next().value);
      osmUrbanCache.set(gridKey,entry);
      return entry;
    });
  }

  if(topo?.value){
    const pick=topo.value;
    const rideDist=pointDistanceMeters(pick.aPt,pick.bPt);
    const rideMin=Math.max(6,Math.ceil(rideDist/290)+Math.min(22,pick.stopCount));
    const waitBufferMin=10;
    let vehDepMs,vehArrMs;
    if(latestArrivalMs!==null){
      const estWalkBMin=Math.max(2,Math.ceil((pointDistanceMeters(pick.bPt,toPt)*1.35)/72));
      vehArrMs=latestArrivalMs-estWalkBMin*60000-4*60000;
      vehDepMs=vehArrMs-rideMin*60000;
    }else{
      const baseMs=earliestStartMs??Date.now();
      const estWalkAMin=Math.max(2,Math.ceil((pointDistanceMeters(fromPt,pick.aPt)*1.35)/72));
      vehDepMs=baseMs+(estWalkAMin+waitBufferMin)*60000;
      vehArrMs=vehDepMs+rideMin*60000;
    }
    const [wAccess,wEgress]=await Promise.all([
      pointDistanceMeters(fromPt,pick.aPt)>=25
        ?buildVerifiedWalkingLeg(env,fromPt,pick.aPt,{
            arrivalTime:new Date(vehDepMs-waitBufferMin*60000).toISOString(),lang,fetchImpl,inflight
          })
        :Promise.resolve(null),
      pointDistanceMeters(pick.bPt,toPt)>=25
        ?buildVerifiedWalkingLeg(env,pick.bPt,toPt,{
            departureTime:new Date(vehArrMs).toISOString(),lang,fetchImpl,inflight
          })
        :Promise.resolve(null)
    ]);
    const walkOk=(pointDistanceMeters(fromPt,pick.aPt)<=120||Boolean(wAccess))&&
      (pointDistanceMeters(pick.bPt,toPt)<=120||Boolean(wEgress));
    const totalWalkM=(wAccess?.distanceMeters||0)+(wEgress?.distanceMeters||0);
    if(walkOk&&totalWalkM<dist*0.8){
      if(latestArrivalMs!==null&&wEgress){
        vehArrMs=latestArrivalMs-wEgress.durationMinutes*60000-4*60000;
        vehDepMs=vehArrMs-rideMin*60000;
        if(wAccess){
          const aStart=vehDepMs-waitBufferMin*60000-wAccess.durationMinutes*60000;
          wAccess.departureTime=new Date(aStart).toISOString();
          wAccess.arrivalTime=new Date(vehDepMs-waitBufferMin*60000).toISOString();
        }
        wEgress.departureTime=new Date(vehArrMs).toISOString();
        wEgress.arrivalTime=new Date(vehArrMs+wEgress.durationMinutes*60000).toISOString();
      }
      const opNote=lang==='en'?'OSM local line (verify local headway)':'linie locală OSM (verifică frecvența locală)';
      const transitLeg={
        mode:pick.mode,
        lineNames:[pick.ref],
        stops:[],
        stopCount:pick.stopCount,
        from:pick.aPt.label,
        to:pick.bPt.label,
        departurePoint:{lat:pick.aPt.latitude,lon:pick.aPt.longitude,latitude:pick.aPt.latitude,longitude:pick.aPt.longitude,label:pick.aPt.label},
        arrivalPoint:{lat:pick.bPt.latitude,lon:pick.bPt.longitude,latitude:pick.bPt.latitude,longitude:pick.bPt.longitude,label:pick.bPt.label},
        arrivalLatLon:{lat:pick.bPt.latitude,lon:pick.bPt.longitude},
        departureTime:new Date(vehDepMs).toISOString(),
        arrivalTime:new Date(vehArrMs).toISOString(),
        durationMinutes:rideMin,
        operator:pick.operator?`${pick.operator} · ${opNote}`:opNote,
        coordinates:pick.coords.length>=2?pick.coords:[[pick.aPt.longitude,pick.aPt.latitude],[pick.bPt.longitude,pick.bPt.latitude]],
        geometryAvailable:pick.coords.length>=2,
        localScheduleEstimated:true
      };
      const full=[...(wAccess?[wAccess]:[]),transitLeg,...(wEgress?[wEgress]:[])];
      const sMs=Date.parse(full[0].departureTime||'');
      const eMs=Date.parse(full.at(-1).arrivalTime||'');
      if((earliestStartMs===null||sMs>=earliestStartMs)&&(latestArrivalMs===null||eMs<=latestArrivalMs)){
        return full;
      }
    }
  }

  // Secondary multimodal fallback via Geoapify approximated_transit for 1-transfer suburban/metropolitan links (>2.2 km)
  if(env?.GEOAPIFY_API_KEY&&dist>2200){
    try{
      const gKey='geo-transit:'+[fromPt.latitude.toFixed(4),fromPt.longitude.toFixed(4),toPt.latitude.toFixed(4),toPt.longitude.toFixed(4),lang].join('|');
      const feat=await withInflight(inflight,gKey,async()=>{
        const u=new URL('https://api.geoapify.com/v1/routing');
        u.searchParams.set('waypoints',`${fromPt.latitude},${fromPt.longitude}|${toPt.latitude},${toPt.longitude}`);
        u.searchParams.set('mode','approximated_transit');
        u.searchParams.set('details','instruction_details,route_details');
        u.searchParams.set('lang',['ro','en','fr','de','it','es','pt','nl','ru','pl'].includes(lang)?lang:'ro');
        u.searchParams.set('apiKey',String(env.GEOAPIFY_API_KEY));
        const r=await fetchImpl(u.href,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(4500)});
        if(!r.ok)return null;
        const data=await r.json();
        return data?.features?.[0]||null;
      });
      const rawSteps=feat?.properties?.legs?.[0]?.steps;
      const allCoords=feat?.geometry?.type==='MultiLineString'
        ?(Array.isArray(feat.geometry.coordinates[0])?feat.geometry.coordinates[0]:feat.geometry.coordinates.flat())
        :feat?.geometry?.type==='LineString'?feat.geometry.coordinates:[];
      if(Array.isArray(rawSteps)&&rawSteps.length>=2&&allCoords.length>=2){
        const groups=[];
        for(const st of rawSteps){
          const rawM=String(st?.travel_mode||st?.mode||'').toLowerCase();
          const isW=/^(?:walk|walking|foot|pedestrian)$/.test(rawM);
          const tMode=isW?'walking':/tram|light_rail/.test(rawM)?'tram':/trolley/.test(rawM)?'trolleybus':/subway|metro/.test(rawM)?'metro':'bus';
          const line=String(st?.transit?.short_name||st?.transit?.name||st?.route?.short_name||st?.line||'').trim().slice(0,36);
          const fIdx=Math.max(0,Number(st?.from_index)||0);
          const tIdx=Math.min(allCoords.length-1,Math.max(fIdx+1,Number(st?.to_index)||fIdx+1));
          const segCoords=allCoords.slice(fIdx,tIdx+1).filter(c=>Array.isArray(c)&&Number.isFinite(c[0])&&Number.isFinite(c[1]));
          if(segCoords.length<2)continue;
          const prev=groups.at(-1);
          if(prev&&prev.mode===tMode&&(tMode==='walking'||prev.line===line)){
            prev.coords.push(...segCoords.slice(1));
            prev.meters+=(Number(st?.distance)||0);
            prev.seconds+=(Number(st?.time)||0);
            if(tMode==='walking'&&st?.instruction?.text)prev.steps.push({text:String(st.instruction.text).trim(),distanceMeters:Math.round(Number(st.distance)||0)});
            prev.toStop=String(st?.transit?.arrival_stop?.name||st?.to_stop||prev.toStop||'');
          }else{
            groups.push({
              mode:tMode,line,
              coords:[...segCoords],
              meters:Number(st?.distance)||0,
              seconds:Number(st?.time)||0,
              fromStop:String(st?.transit?.departure_stop?.name||st?.from_stop||''),
              toStop:String(st?.transit?.arrival_stop?.name||st?.to_stop||''),
              operator:String(st?.transit?.agency_name||st?.operator||'').trim().slice(0,60),
              steps:tMode==='walking'&&st?.instruction?.text?[{text:String(st.instruction.text).trim(),distanceMeters:Math.round(Number(st.distance)||0)}]:[]
            });
          }
        }
        const hasTransit=groups.some(g=>g.mode!=='walking');
        const walkMeters=groups.filter(g=>g.mode==='walking').reduce((s,g)=>s+g.meters,0);
        if(hasTransit&&walkMeters<dist*0.8){
          const totalSec=groups.reduce((s,g)=>s+Math.max(60,g.seconds),0)+480;
          let cursorMs=latestArrivalMs!==null?(latestArrivalMs-totalSec*1000):((earliestStartMs??Date.now())+240000);
          const built=groups.map((g,idx)=>{
            const aC=g.coords[0],bC=g.coords.at(-1);
            const durMin=Math.max(1,Math.ceil(g.seconds/60));
            const depIso=new Date(cursorMs).toISOString();
            cursorMs+=durMin*60000+(g.mode!=='walking'?180000:0);
            const arrIso=new Date(cursorMs).toISOString();
            const fromLbl=idx===0?String(fromPt.label||'Plecarea'):(g.fromStop||groups[idx-1]?.toStop||'Stație locală');
            const toLbl=idx===groups.length-1?String(toPt.label||'Destinația'):(g.toStop||groups[idx+1]?.fromStop||'Stație locală');
            return {
              mode:g.mode,
              lineNames:g.mode==='walking'?[]:(g.line?[g.line]:[]),
              stops:[],
              from:fromLbl,
              to:toLbl,
              departurePoint:{lat:aC[1],lon:aC[0],latitude:aC[1],longitude:aC[0],label:fromLbl},
              arrivalPoint:{lat:bC[1],lon:bC[0],latitude:bC[1],longitude:bC[0],label:toLbl},
              arrivalLatLon:{lat:bC[1],lon:bC[0]},
              departureTime:depIso,
              arrivalTime:arrIso,
              durationMinutes:durMin,
              ...(g.mode==='walking'?{distanceMeters:Math.round(g.meters),steps:g.steps,verified:true}:{
                operator:(g.operator?g.operator+' · ':'')+(lang==='en'?'estimated local schedule':'orar local orientativ'),
                localScheduleEstimated:true
              }),
              coordinates:decimateWalkCoords(g.coords,180),
              geometryAvailable:true
            };
          });
          const sMs=Date.parse(built[0].departureTime||'');
          const eMs=Date.parse(built.at(-1).arrivalTime||'');
          if((earliestStartMs===null||sMs>=earliestStartMs)&&(latestArrivalMs===null||eMs<=latestArrivalMs)){
            return built;
          }
        }
      }
    }catch{}
  }
  return null;
}

// Lightweight direct Oracle urban transit lookup (1 Oracle subrequest + <=2 cached Geoapify walk calls),
// avoiding the 8x walk amplification of full handleBackendRequest localPlanner inside Cloudflare's 50-subrequest budget.
async function planDirectRomanianUrbanSegment(env,fromPt,toPt,{
  departureAtMs,latestArrivalMs=null,earliestStartMs=null,lang='ro',fetchImpl=defaultFetch,inflight=null
}={}){
  if(!romanianUrbanRegion(fromPt,toPt,{verifiedCountry:'RO'}))return null;
  if(!(typeof env?.RO_URBAN_VPC?.fetch==='function'||env?.RO_URBAN_API_URL)||
     String(env?.RO_URBAN_API_TOKEN||'').trim().length<32)return null;
  const candidateWindows=latestArrivalMs!==null
    ?[departureAtMs,Math.max(earliestStartMs??0,latestArrivalMs-85*60000)]
        .filter((t,i,arr)=>Number.isFinite(t)&&(i===0||Math.abs(t-arr[0])>=15*60000))
    :[departureAtMs];
  let scored=[];
  for(const windowMs of candidateWindows){
    const bucketKey='urban:'+[fromPt.latitude.toFixed(4),fromPt.longitude.toFixed(4),
      toPt.latitude.toFixed(4),toPt.longitude.toFixed(4),Math.floor(windowMs/600000)].join('|');
    const oracleRes=await withInflight(inflight,bucketKey,()=>planRomanianUrbanViaOracle(env,{
      from:fromPt,to:toPt,departureAt:new Date(windowMs).toISOString(),limit:8,verifiedCountry:'RO',maxStraightLineMeters:950
    },{fetchImpl}));
    if(!oracleRes||oracleRes.status==='feed_not_loaded'||oracleRes.status==='route_only')break;
    if(!Array.isArray(oracleRes.journeys)||!oracleRes.journeys.length)continue;
    scored=oracleRes.journeys.map(j=>{
      const legs=Array.isArray(j.legs)?j.legs:[];
      if(!legs.length)return null;
      const firstDep=Date.parse(legs[0].departureTime||'');
      const lastArr=Date.parse(legs.at(-1).arrivalTime||j.arrivalDateTime||'');
      if(!Number.isFinite(firstDep)||!Number.isFinite(lastArr))return null;
      const aPt=toLatLon(j.access||legs[0].departurePoint);
      const ePt=toLatLon(j.egress||legs.at(-1).arrivalPoint||legs.at(-1).arrivalLatLon);
      if(!aPt||!ePt)return null;
      const estWalkA=Math.ceil((pointDistanceMeters(fromPt,aPt)*1.35)/75);
      const estWalkE=Math.ceil((pointDistanceMeters(ePt,toPt)*1.35)/75);
      const estStart=firstDep-estWalkA*60000;
      const estEnd=lastArr+estWalkE*60000;
      if(earliestStartMs!==null&&estStart<earliestStartMs)return null;
      if(latestArrivalMs!==null&&estEnd>latestArrivalMs)return null;
      return {j,aPt,ePt,firstDep,lastArr,estStart,estEnd};
    }).filter(Boolean).sort((a,b)=>
      latestArrivalMs!==null?(b.estEnd-a.estEnd||b.estStart-a.estStart):(a.estEnd-b.estEnd||a.estStart-b.estStart)
    );
    if(scored.length)break;
  }
  if(!scored.length)return null;

  const pick=scored[0];
  const vLegs=pick.j.legs.map((l,i,arr)=>({
    ...l,
    lineNames:Array.isArray(l?.lineNames)?l.lineNames:[],
    stops:Array.isArray(l?.stops)?l.stops:[],
    ...(i===0?{departurePoint:{lat:pick.aPt.latitude,lon:pick.aPt.longitude,latitude:pick.aPt.latitude,longitude:pick.aPt.longitude,label:String(l.from||pick.j.access?.stop_name||'')}}:{}),
    ...(i===arr.length-1?{arrivalPoint:{lat:pick.ePt.latitude,lon:pick.ePt.longitude,latitude:pick.ePt.latitude,longitude:pick.ePt.longitude,label:String(l.to||pick.j.egress?.stop_name||'')},arrivalLatLon:{lat:pick.ePt.latitude,lon:pick.ePt.longitude}}:{})
  }));
  const [wAccess,wEgress]=await Promise.all([
    pointDistanceMeters(fromPt,pick.aPt)>=20
      ?buildVerifiedWalkingLeg(env,fromPt,{...pick.aPt,label:String(vLegs[0].from||pick.j.access?.stop_name||'Stație')},{
          arrivalTime:vLegs[0].departureTime,lang,fetchImpl,inflight
        })
      :Promise.resolve(null),
    pointDistanceMeters(pick.ePt,toPt)>=20
      ?buildVerifiedWalkingLeg(env,{...pick.ePt,label:String(vLegs.at(-1).to||pick.j.egress?.stop_name||'Stație')},toPt,{
          departureTime:vLegs.at(-1).arrivalTime,lang,fetchImpl,inflight
        })
      :Promise.resolve(null)
  ]);
  if(pointDistanceMeters(fromPt,pick.aPt)>120&&!wAccess)return null;
  if(pointDistanceMeters(pick.ePt,toPt)>120&&!wEgress)return null;
  const full=[...(wAccess?[wAccess]:[]),...vLegs,...(wEgress?[wEgress]:[])];
  const sMs=Date.parse(full[0].departureTime||'');
  const eMs=Date.parse(full.at(-1).arrivalTime||'');
  if(earliestStartMs!==null&&sMs<earliestStartMs)return null;
  if(latestArrivalMs!==null&&eMs>latestArrivalMs)return null;
  return full;
}

export async function enrichRomanianDoorToDoorJourneys(env,journeys,{
  originPoint=null,destinationPoint=null,originCity='',destinationCity='',
  localPlanner=null,lang='ro',maxEnrich=8,maxSubrequests=22,fetchImpl=defaultFetch
}={}){
  if(!Array.isArray(journeys)||!journeys.length)return journeys;
  const inflight=new Map();
  let subrequests=0;
  const budgetedFetch=async(input,init)=>{
    if(subrequests>=maxSubrequests)throw new Error('ro_door_subrequest_budget');
    subrequests++;
    return fetchImpl(input,init);
  };
  try{
  const orig=validPoint(originPoint)&&inRomaniaApprox(toLatLon(originPoint))
    ?{...toLatLon(originPoint),label:String(originPoint.label||originCity||'Plecarea').trim(),city:originPoint.city||originCity,country_code:'RO'}
    :null;
  const dest=validPoint(destinationPoint)&&inRomaniaApprox(toLatLon(destinationPoint))
    ?{...toLatLon(destinationPoint),label:String(destinationPoint.label||destinationCity||'Destinația').trim(),city:destinationPoint.city||destinationCity,country_code:'RO'}
    :null;
  if(!orig&&!dest)return journeys;

  const limitCount=Math.max(1,Math.min(10,maxEnrich));
  const prioritized=journeys.map((journey,origIdx)=>({
    journey,origIdx,
    dur:Number.isFinite(Number(journey?.durationMinutes))?Number(journey.durationMinutes):99999
  })).sort((a,b)=>a.dur-b.dur||a.origIdx-b.origIdx).slice(0,limitCount);

  const enrichOne=async(journey,priorityRank)=>{
    const rawLegs=Array.isArray(journey?.legs)?journey.legs:[];
    if(!rawLegs.length)return journey;

    const mappedIntercity=await Promise.all(rawLegs.map(async(leg,idx)=>{
      const isFirst=idx===0,isLast=idx===rawLegs.length-1;
      const [fromResolved,toResolved]=await Promise.all([
        resolveRomanianIntercityStop(env,{
          rawName:leg.from,locality:leg.fromLocality||(isFirst?originCity:''),
          cityHint:isFirst?originCity:'',anchorPoint:isFirst?orig:null,
          mode:leg.mode,railReplacement:leg.railReplacement===true,
          sourceStopRef:leg.fromSourceStopRef,fetchImpl:budgetedFetch,inflight
        }),
        resolveRomanianIntercityStop(env,{
          rawName:leg.to,locality:leg.toLocality||(isLast?destinationCity:''),
          cityHint:isLast?destinationCity:'',anchorPoint:isLast?dest:null,
          mode:leg.mode,railReplacement:leg.railReplacement===true,
          sourceStopRef:leg.toSourceStopRef,fetchImpl:budgetedFetch,inflight
        })
      ]);
      return {
        ...leg,
        lineNames:Array.isArray(leg?.lineNames)?leg.lineNames:[],
        stops:Array.isArray(leg?.stops)?leg.stops:[],
        ...(fromResolved?{departurePoint:{lat:fromResolved.latitude,lon:fromResolved.longitude,
          latitude:fromResolved.latitude,longitude:fromResolved.longitude,label:fromResolved.label}}:{}),
        ...(toResolved?{arrivalPoint:{lat:toResolved.latitude,lon:toResolved.longitude,
          latitude:toResolved.latitude,longitude:toResolved.longitude,label:toResolved.label},
          arrivalLatLon:{lat:toResolved.latitude,lon:toResolved.longitude}}:{})
      };
    }));

    const firstLeg=mappedIntercity[0];
    const lastLeg=mappedIntercity.at(-1);
    const boardingPt=toLatLon(firstLeg?.departurePoint);
    const alightingPt=toLatLon(lastLeg?.arrivalPoint||lastLeg?.arrivalLatLon);
    const firstDepMs=Date.parse(firstLeg?.departureTime||'');
    const lastArrMs=Date.parse(lastLeg?.arrivalTime||'');

    const accessPromise=(async()=>{
      if(!orig||!boardingPt||!Number.isFinite(firstDepMs))return [];
      const dist=pointDistanceMeters(orig,boardingPt);
      if(dist<=65)return [];
      const boardingTarget={...boardingPt,label:firstLeg.from,country_code:'RO'};
      const latestArrMs=firstDepMs-6*60000;
      const nowMs=Date.now();
      if(typeof localPlanner==='function'&&latestArrMs>nowMs+4*60000){
        try{
          const searchTimes=[latestArrMs-55*60000,latestArrMs-95*60000]
            .map(t=>Math.max(nowMs,t))
            .filter((t,i,arr)=>t<latestArrMs-4*60000&&(i===0||Math.abs(t-arr[0])>=15*60000));
          if(searchTimes.length){
            const samples=await Promise.allSettled(searchTimes.map(t=>
              localPlanner(env,orig,boardingTarget,4,{departureAt:new Date(t).toISOString(),allowWalking:false})
            ));
            const materialized=samples
              .flatMap(s=>s.status==='fulfilled'&&Array.isArray(s.value?.journeys)?s.value.journeys:[])
              .map(j=>materializeLocalJourneyLegs(j,orig,boardingTarget))
              .filter(m=>m&&m.startMs>=nowMs-120000&&m.endMs<=latestArrMs)
              .sort((a,b)=>b.endMs-a.endMs||b.startMs-a.startMs);
            if(materialized.length)return materialized[0].legs;
          }
        }catch{}
      }else if(!localPlanner&&priorityRank<8&&latestArrMs>nowMs+4*60000){
        try{
          const urbanLegs=await planDirectRomanianUrbanSegment(env,orig,boardingTarget,{
            departureAtMs:Math.max(nowMs,latestArrMs-50*60000),
            latestArrivalMs:latestArrMs,earliestStartMs:nowMs-120000,lang,fetchImpl:budgetedFetch,inflight
          });
          if(urbanLegs?.length)return urbanLegs;
          if(dist>1400){
            const osmLegs=await planOsmUrbanTransitSegment(env,orig,boardingTarget,{
              latestArrivalMs:latestArrMs,earliestStartMs:nowMs-120000,lang,fetchImpl:budgetedFetch,inflight
            });
            if(osmLegs?.length)return osmLegs;
          }
        }catch{}
      }
      const walkLeg=await buildVerifiedWalkingLeg(env,orig,boardingTarget,{
        arrivalTime:new Date(latestArrMs).toISOString(),lang,fetchImpl:budgetedFetch,inflight
      });
      return walkLeg?[walkLeg]:[];
    })();

    const egressPromise=(async()=>{
      if(!dest||!alightingPt||!Number.isFinite(lastArrMs))return [];
      const dist=pointDistanceMeters(alightingPt,dest);
      if(dist<=65)return [];
      const alightingSource={...alightingPt,label:lastLeg.to,country_code:'RO'};
      if(typeof localPlanner==='function'){
        try{
          const egressAtMs=Math.max(Date.now(),lastArrMs+6*60000);
          const egressRes=await localPlanner(env,alightingSource,dest,4,{
            departureAt:new Date(egressAtMs).toISOString(),allowWalking:false
          });
          const materialized=(Array.isArray(egressRes?.journeys)?egressRes.journeys:[])
            .map(j=>materializeLocalJourneyLegs(j,alightingSource,dest))
            .filter(m=>m&&m.startMs>=lastArrMs+4*60000)
            .sort((a,b)=>a.endMs-b.endMs||a.startMs-b.startMs);
          if(materialized.length)return materialized[0].legs;
        }catch{}
      }else if(!localPlanner&&priorityRank<8){
        try{
          const urbanLegs=await planDirectRomanianUrbanSegment(env,alightingSource,dest,{
            departureAtMs:Math.max(Date.now(),lastArrMs+6*60000),
            earliestStartMs:lastArrMs+4*60000,lang,fetchImpl:budgetedFetch,inflight
          });
          if(urbanLegs?.length)return urbanLegs;
          if(dist>1400){
            const osmLegs=await planOsmUrbanTransitSegment(env,alightingSource,dest,{
              earliestStartMs:lastArrMs+4*60000,lang,fetchImpl:budgetedFetch,inflight
            });
            if(osmLegs?.length)return osmLegs;
          }
        }catch{}
      }
      const walkLeg=await buildVerifiedWalkingLeg(env,alightingSource,dest,{
        departureTime:new Date(lastArrMs+5*60000).toISOString(),lang,fetchImpl:budgetedFetch,inflight
      });
      return walkLeg?[walkLeg]:[];
    })();

    const [accessLegs,egressLegs]=await Promise.all([accessPromise,egressPromise]);
    const allLegs=[...accessLegs,...mappedIntercity,...egressLegs];
    const hasCoords=allLegs.some(l=>validPoint(l.departurePoint)||validPoint(l.arrivalPoint||l.arrivalLatLon));
    if(!hasCoords)return journey;

    const firstVehicle=allLegs.find(l=>!/^(?:walking|walk|foot|pedestrian)$/i.test(String(l.mode||'')))||firstLeg;
    const fvPt=toLatLon(firstVehicle?.departurePoint);
    const startDateTime=allLegs[0]?.departureTime||journey.startDateTime;
    const arrivalDateTime=allLegs.at(-1)?.arrivalTime||journey.arrivalDateTime;
    const totalMinutes=Math.max(1,Math.round((Date.parse(arrivalDateTime)-Date.parse(startDateTime))/60000));
    const initialWalk=/^(?:walking|walk|foot|pedestrian)$/i.test(String(allLegs[0]?.mode||''));

    return {
      ...journey,
      legs:allLegs,
      startDateTime,
      arrivalDateTime,
      durationMinutes:Number.isFinite(totalMinutes)?totalMinutes:journey.durationMinutes,
      ...(fvPt?{
        boarding_stop:{
          latitude:fvPt.latitude,
          longitude:fvPt.longitude,
          label:String(firstVehicle.from||''),
          departure_time:firstVehicle.departureTime
        },
        firstVehicleDepartureTime:firstVehicle.departureTime
      }:{}),
      ...(initialWalk&&Number.isFinite(allLegs[0]?.durationMinutes)?{
        walkToFirstStopMinutes:Math.ceil(allLegs[0].durationMinutes),
        accessWalkDistanceMeters:allLegs[0].distanceMeters??null,
        accessWalkVerified:Array.isArray(allLegs[0].coordinates)&&allLegs[0].coordinates.length>=2
      }:{}),
      door_to_door_mapped:true
    };
  };

  const out=[...journeys];
  const wave1=prioritized.slice(0,2);
  const wave2=prioritized.slice(2);
  const res1=await Promise.all(wave1.map((item,i)=>enrichOne(item.journey,i)));
  wave1.forEach((item,i)=>{out[item.origIdx]=res1[i];});
  if(wave2.length){
    const res2=await Promise.all(wave2.map((item,i)=>enrichOne(item.journey,i+2)));
    wave2.forEach((item,i)=>{out[item.origIdx]=res2[i];});
  }

  return out;
  }catch{return journeys;}
}
