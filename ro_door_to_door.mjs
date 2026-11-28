import {inRomaniaApprox,pointDistanceMeters} from './regional_gtfs_registry.mjs';
import {romanianUrbanRegion,planRomanianUrbanViaOracle} from './ro_urban_client.mjs';

const fold=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/[șş]/gi,'s').replace(/[țţ]/gi,'t').replace(/[ăâ]/gi,'a').replace(/î/gi,'i')
  .toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

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
const inflightStations=new Map();
const inflightCities=new Map();
const inflightWalks=new Map();
const inflightUrban=new Map();

function withInflight(map,key,fn){
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
    .match(/\b\d{5,6}\s+([\p{L}\p{M}][\p{L}\p{M} -]{1,40}?)\s*(?:,|$)/u)?.[1]?.trim()||'';
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

async function resolveCityCenter(env,city,anchorPoint,fetchImpl=fetch){
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
  return withInflight(inflightCities,cf,async()=>{
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

export async function resolveRomanianIntercityStop(env,{
  rawName,locality='',cityHint='',anchorPoint=null,mode='bus',railReplacement=false,
  sourceStopRef=null,fetchImpl=fetch
}={}){
  const parsed=parseBiloStopLabel(rawName,locality,cityHint);
  if(!parsed.city||!parsed.stop)return null;
  const modeLc=String(mode||'').toLowerCase();
  const isRail=['train','rail'].includes(modeLc)||railReplacement===true;

  // Tier 0: Provider-supplied stop coordinates inside Romania
  if(validPoint(sourceStopRef)){
    const refPt=toLatLon(sourceStopRef);
    if(inRomaniaApprox(refPt)){
      const center=await resolveCityCenter(env,parsed.city,anchorPoint,fetchImpl);
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
  return withInflight(inflightStations,cacheKey,async()=>{
  const cityFold=fold(parsed.city);
  const cityCenter=await resolveCityCenter(env,parsed.city,anchorPoint,fetchImpl);

  const geocodeJson=async text=>{
    try{
      const u=new URL('https://api.geoapify.com/v1/geocode/search');
      u.searchParams.set('text',text);
      u.searchParams.set('filter','countrycode:ro');
      u.searchParams.set('format','json');
      u.searchParams.set('limit','12');
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
      u.searchParams.set('limit','80');
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
          type:'auto',numResults:5,
          contents:{highlights:true,text:{maxCharacters:4000}}
        }),
        signal:AbortSignal.timeout(4500)
      });
      if(exaRes.ok){
        const exaJson=await exaRes.json();
        const streetRx=/\b((?:Strada|Str\.|Calea|Bulevardul|Bd\.|B-dul|Piața|P-ța|Piata|Șoseaua|Șos\.|Soseaua|Sos\.|Aleea|Splaiul|Drumul)\s+(?:\d{1,2}\s+)?[\p{L}\p{M}][\p{L}\p{M}'-]{1,25}(?:\s+(?!nr\b|num[aă]rul\b|cod\b|jud\b|tel\b)(?:\d{4}|\d{1,2}(?=\s+[\p{L}])|[\p{L}\p{M}][\p{L}\p{M}'-]{1,25})){0,4}(?:\s*,?\s*(?:nr\.?\s*|num[aă]rul\s*)?\d{1,4}[A-Za-z]?(?:[-/]\d{1,4}[A-Za-z]?)?)?)/giu;
        const cityWordSet=new Set(cityFold.split(' ').filter(Boolean));
        const counts=new Map();
        for(const r of (exaJson.results||[]).slice(0,5)){
          const blob=[r.title,...(Array.isArray(r.highlights)?r.highlights:[]),String(r.text||'').slice(0,4000)].join('\n');
          const blobFold=fold(blob);
          if(!cityFold.split(' ').every(w=>blobFold.includes(w)))continue;
          if(!parsed.distinctive.every(t=>blobFold.includes(t)))continue;
          for(const m of blob.matchAll(streetRx)){
            const addr=m[1].replace(/\s+/g,' ').trim();
            if(addr.length<6||addr.length>75)continue;
            const key=fold(addr);
            counts.set(key,{addr,hits:(counts.get(key)?.hits||0)+1});
          }
        }
        const extracted=[...counts.values()].sort((a,b)=>b.hits-a.hits||b.addr.length-a.addr.length).slice(0,3);
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

export async function buildVerifiedWalkingLeg(env,fromPt,toPt,{
  departureTime=null,arrivalTime=null,lang='ro',fetchImpl=fetch
}={}){
  const a=toLatLon(fromPt),b=toLatLon(toPt);
  if(!a||!b||!env?.GEOAPIFY_API_KEY)return null;
  const dist=pointDistanceMeters(a,b);
  if(!Number.isFinite(dist)||dist<15||dist>10000)return null;
  const key=[a.latitude.toFixed(5),a.longitude.toFixed(5),b.latitude.toFixed(5),b.longitude.toFixed(5),lang].join('|');
  let route=walkRouteCache.get(key);
  if(!route||route.until<=Date.now()){
    route=await withInflight(inflightWalks,key,async()=>{
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
        const coords=rawCoords.filter(c=>Array.isArray(c)&&Number.isFinite(c[0])&&Number.isFinite(c[1]));
        const meters=Number(props?.distance),seconds=Number(props?.time);
        if(coords.length<2||!Number.isFinite(meters)||meters<=0||!Number.isFinite(seconds)||seconds<=0)return null;
        const startPt={latitude:coords[0][1],longitude:coords[0][0]};
        const endPt={latitude:coords.at(-1)[1],longitude:coords.at(-1)[0]};
        if(pointDistanceMeters(startPt,a)>150||pointDistanceMeters(endPt,b)>150)return null;
        const steps=(props?.legs?.[0]?.steps||[]).map(s=>({
          text:String(s?.instruction?.text||'').trim(),
          distanceMeters:Number.isFinite(s?.distance)?Math.round(s.distance):0
        })).filter(s=>s.text).slice(0,40);
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
  const raw=Array.isArray(journey?.legs)?journey.legs.map(l=>({...l})):[];
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

// Lightweight direct Oracle urban transit lookup (1 Oracle subrequest + <=2 cached Geoapify walk calls),
// avoiding the 8x walk amplification of full handleBackendRequest localPlanner inside Cloudflare's 50-subrequest budget.
async function planDirectRomanianUrbanSegment(env,fromPt,toPt,{
  departureAtMs,latestArrivalMs=null,earliestStartMs=null,lang='ro',fetchImpl=fetch
}={}){
  if(!romanianUrbanRegion(fromPt,toPt,{verifiedCountry:'RO'}))return null;
  if(!(typeof env?.RO_URBAN_VPC?.fetch==='function'||env?.RO_URBAN_API_URL)||
     String(env?.RO_URBAN_API_TOKEN||'').trim().length<32)return null;
  const bucketKey=[fromPt.latitude.toFixed(4),fromPt.longitude.toFixed(4),
    toPt.latitude.toFixed(4),toPt.longitude.toFixed(4),Math.floor(departureAtMs/600000)].join('|');
  const oracleRes=await withInflight(inflightUrban,bucketKey,()=>planRomanianUrbanViaOracle(env,{
    from:fromPt,to:toPt,departureAt:new Date(departureAtMs).toISOString(),limit:4,verifiedCountry:'RO'
  },{fetchImpl}));
  if(!oracleRes||oracleRes.status==='route_only'||!Array.isArray(oracleRes.journeys)||!oracleRes.journeys.length)return null;

  const scored=oracleRes.journeys.map(j=>{
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
  if(!scored.length)return null;

  const pick=scored[0];
  const vLegs=pick.j.legs.map((l,i,arr)=>({
    ...l,
    ...(i===0?{departurePoint:{lat:pick.aPt.latitude,lon:pick.aPt.longitude,latitude:pick.aPt.latitude,longitude:pick.aPt.longitude,label:String(l.from||pick.j.access?.stop_name||'')}}:{}),
    ...(i===arr.length-1?{arrivalPoint:{lat:pick.ePt.latitude,lon:pick.ePt.longitude,latitude:pick.ePt.latitude,longitude:pick.ePt.longitude,label:String(l.to||pick.j.egress?.stop_name||'')},arrivalLatLon:{lat:pick.ePt.latitude,lon:pick.ePt.longitude}}:{})
  }));
  const [wAccess,wEgress]=await Promise.all([
    pointDistanceMeters(fromPt,pick.aPt)>=20
      ?buildVerifiedWalkingLeg(env,fromPt,{...pick.aPt,label:String(vLegs[0].from||pick.j.access?.stop_name||'Stație')},{
          arrivalTime:vLegs[0].departureTime,lang,fetchImpl
        })
      :Promise.resolve(null),
    pointDistanceMeters(pick.ePt,toPt)>=20
      ?buildVerifiedWalkingLeg(env,{...pick.ePt,label:String(vLegs.at(-1).to||pick.j.egress?.stop_name||'Stație')},toPt,{
          departureTime:vLegs.at(-1).arrivalTime,lang,fetchImpl
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
  localPlanner=null,lang='ro',maxEnrich=3,maxSubrequests=18,fetchImpl=fetch
}={}){
  if(!Array.isArray(journeys)||!journeys.length)return journeys;
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

  const head=journeys.slice(0,Math.max(1,Math.min(4,maxEnrich)));
  const tail=journeys.slice(head.length);

  const enrichedHead=await Promise.all(head.map(async(journey,jIdx)=>{
    const rawLegs=Array.isArray(journey?.legs)?journey.legs:[];
    if(!rawLegs.length)return journey;

    const mappedIntercity=await Promise.all(rawLegs.map(async(leg,idx)=>{
      const isFirst=idx===0,isLast=idx===rawLegs.length-1;
      const [fromResolved,toResolved]=await Promise.all([
        resolveRomanianIntercityStop(env,{
          rawName:leg.from,locality:leg.fromLocality||(isFirst?originCity:''),
          cityHint:isFirst?originCity:'',anchorPoint:isFirst?orig:null,
          mode:leg.mode,railReplacement:leg.railReplacement===true,
          sourceStopRef:leg.fromSourceStopRef,fetchImpl:budgetedFetch
        }),
        resolveRomanianIntercityStop(env,{
          rawName:leg.to,locality:leg.toLocality||(isLast?destinationCity:''),
          cityHint:isLast?destinationCity:'',anchorPoint:isLast?dest:null,
          mode:leg.mode,railReplacement:leg.railReplacement===true,
          sourceStopRef:leg.toSourceStopRef,fetchImpl:budgetedFetch
        })
      ]);
      return {
        ...leg,
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
      }else if(!localPlanner&&jIdx<2&&latestArrMs>nowMs+4*60000){
        try{
          const urbanLegs=await planDirectRomanianUrbanSegment(env,orig,boardingTarget,{
            departureAtMs:Math.max(nowMs,latestArrMs-55*60000),
            latestArrivalMs:latestArrMs,earliestStartMs:nowMs-120000,lang,fetchImpl:budgetedFetch
          });
          if(urbanLegs?.length)return urbanLegs;
        }catch{}
      }
      const walkLeg=await buildVerifiedWalkingLeg(env,orig,boardingTarget,{
        arrivalTime:new Date(latestArrMs).toISOString(),lang,fetchImpl:budgetedFetch
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
      }else if(!localPlanner&&jIdx<2){
        try{
          const urbanLegs=await planDirectRomanianUrbanSegment(env,alightingSource,dest,{
            departureAtMs:Math.max(Date.now(),lastArrMs+6*60000),
            earliestStartMs:lastArrMs+4*60000,lang,fetchImpl:budgetedFetch
          });
          if(urbanLegs?.length)return urbanLegs;
        }catch{}
      }
      const walkLeg=await buildVerifiedWalkingLeg(env,alightingSource,dest,{
        departureTime:new Date(lastArrMs+5*60000).toISOString(),lang,fetchImpl:budgetedFetch
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
  }));

  return [...enrichedHead,...tail];
  }catch{return journeys;}
}
