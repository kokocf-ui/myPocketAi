import {keylessGtfsSource,KEYLESS_GTFS_SOURCES,configuredKeylessGtfsSources} from './keyless_transport_sources.mjs';
import {validateOpenSurfaceIndex,planOpenSurfaceCandidates} from './open_surface_timetable.mjs';
import {readTransportJson} from './transport_bounded_json.mjs';
import {verifyDomesticJourneys,selectNationalJourneys} from './national_transport_validation.mjs';
// Prepared, short-window, direct scheduled rides. Never download ZIPs or run
// import/timezone conversion during a passenger request. No realtime claims.
const cached=new WeakMap();
const timestamp=v=>typeof v==='string'&&/(Z|[+-]\d\d:\d\d)$/.test(v)&&Number.isFinite(Date.parse(v))?Date.parse(v):null;
export function validateKeylessGtfsIndex(index,source,{now=Date.now()}={}){
 if(!source||index?.sourceId!==source.id||index.directRidesOnly!==true||index.licenseUrl!==source.licenseUrl||index.scope!==source.scope)return 'invalid_index';
 let download;try{download=new URL(index.downloadUrl);new Intl.DateTimeFormat('en',{timeZone:index.originalTimezone}).format();}catch{return 'invalid_index';}
 if(download.protocol!=='https:'||!source.downloadHosts.includes(download.hostname)||download.username||download.password||download.search||download.hash)return 'invalid_index';
 if(!Array.isArray(index.trips)||index.trips.length>10000||index.trips.reduce((n,t)=>n+(Array.isArray(t?.[3])?t[3].length:100001),0)>100000)return 'invalid_index';
 const start=timestamp(index.coverageStartUtc),end=timestamp(index.coverageEndUtc);
 if(start===null||end===null||end-start<86400000||end-start>8*86400000)return 'invalid_index';
 return validateOpenSurfaceIndex(index,{now,expectedSource:source.datasetUrl,allowedModes:source.modes});
}
export async function loadKeylessGtfsIndex(env,id,{now=Date.now()}={}){
 const source=keylessGtfsSource(id);
 if(!source||!configuredKeylessGtfsSources(env).includes(id))return {status:'not_configured',index:null};
 const binding=env.PUBLIC_GTFS_ASSETS;
 // At most one small parsed source per asset binding/isolate. Do not retain
 // six national indexes in a 128MiB Worker or launch concurrent imports.
 let entry=cached.get(binding);
 if(entry?.pending&&(entry.id!==id||now-entry.createdAt>60000))return {status:'index_busy',index:null};
 if(!entry||entry.id!==id||now-entry.createdAt>60000){
  entry={id,createdAt:now,pending:true};
  entry.job=(async()=>{
   try{
    const r=await binding.fetch(new Request('https://keyless-assets.internal/'+id+'.json',{signal:AbortSignal.timeout(7500)}));
    if(!r.ok)return {status:'index_unavailable',index:null};
    const index=await readTransportJson(r,5*1024*1024),status=validateKeylessGtfsIndex(index,source,{now});
    return {status:status==='valid'?'ready':status,index:status==='valid'?index:null};
   }catch(e){return {status:e?.message==='response_too_large'?'index_too_large':'index_unavailable',index:null};}
  })().finally(()=>{entry.pending=false;});
  cached.set(binding,entry);
 }
 const result=await entry.job;
 if(result.index&&now-Date.parse(result.index.generatedAt)>7*86400000)return {status:'stale_index',index:null};
 return result;
}
export async function planKeylessGtfsJourney(env,{from,to,originCountry,destinationCountry,departureAt,limit=4,preference='all',sourceId}={},opts={}){
 const empty=status=>({status,journeys:[]}),now=opts.now??Date.now();
 const source=keylessGtfsSource(sourceId)||(!sourceId?KEYLESS_GTFS_SOURCES.find(s=>s.country===originCountry):null);
 if(!source||originCountry!==source.country||destinationCountry!==source.country)return empty('country_not_authorized');
 const at=departureAt||new Date(now).toISOString(),ms=timestamp(at);
 if(ms===null||ms<now-120000||ms>now+60*86400000)return empty('invalid_departure');
 const valid=p=>p&&typeof p.latitude==='number'&&typeof p.longitude==='number'&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&Math.abs(p.latitude)<=90&&Math.abs(p.longitude)<=180;
 if(!valid(from)||!valid(to))return empty('invalid_coordinates');
 if(typeof opts.verifyCountry!=='function')return empty('country_verification_unavailable');
 const loaded=await loadKeylessGtfsIndex(env,source.id,{now});
 if(!loaded.index)return empty(loaded.status);
 const index=loaded.index;
 if(ms<Date.parse(index.coverageStartUtc)||ms+86400000>Date.parse(index.coverageEndUtc))return empty('outside_feed_validity');
 // Filter before planning (not just the first few returned candidates).
 const selected=preference==='bus_only'?{...index,trips:index.trips.filter(t=>['bus','coach','trolleybus'].includes(index.routes[t[1]][3]))}:index;
 const search=planOpenSurfaceCandidates(selected,{origin:from,destination:to,departureAt:at,days:1,maxRides:1,
  originRadiusKm:0.15,destinationRadiusKm:0.15,now,budgetMs:100,signal:opts.signal});
 const candidates=search.candidates.map(c=>{
  const legs=c.legs.map(l=>({...l,lineNames:l.line?[l.line]:[],realtime:false,geometryAvailable:false}));
  const first=legs[0],last=legs.at(-1);
  return {provider:source.name,source:source.name,source_url:source.datasetUrl,country_code:source.country,time_zone:index.originalTimezone,
   startDateTime:first.departureTime,arrivalDateTime:last.arrivalTime,durationMinutes:Math.ceil((Date.parse(last.arrivalTime)-Date.parse(first.departureTime))/60000),
   legs,scheduled:true,real_time:false,fareLocal:null,fareComplete:false,seatAvailability:'unverified',routeSegments:[],geometryAvailable:false,
   walkingAccessVerified:false,walkingEgressVerified:false,completeDoorToDoor:false,source_scope:source.scope,
   attribution:{text:index.attribution,url:source.datasetUrl,license_url:source.licenseUrl},
   firstVehicleDepartureTime:first.departureTime,boarding_stop:{...first.departurePoint,id:first.fromStopId,label:first.from,departure_time:first.departureTime},
   alighting_stop:{...last.arrivalPoint,id:last.toStopId,label:last.to,arrival_time:last.arrivalTime},
   _countryCheckPoints:legs.flatMap(l=>l.stops)};
 });
 const verified=await verifyDomesticJourneys(candidates,source.country,opts.verifyCountry),journeys=selectNationalJourneys(verified.journeys,limit);
 return {status:journeys.length?'ok':verified.rejected?'domestic_route_unverified':search.status==='scheduled_intercity_candidates'?'no_valid_itinerary':search.status,
  journeys,country_checks:verified.checks,source_scope:source.scope,direct_rides_only:true};
}
