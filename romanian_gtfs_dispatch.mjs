// Countrywide *dispatch*, not countrywide timetable coverage. Never stitch
// feeds by matching stop names or IDs: connections remain within one feed.
import {recognizedGtfsRegion,pointDistanceMeters} from './regional_gtfs_registry.mjs';
import {planRomanianUrbanGtfs} from './ro_urban_gtfs.mjs';
import {routeTopologyFromGtfs} from './transport_route_topology.mjs';
const valid=p=>p&&p.latitude!=null&&p.longitude!=null&&Number.isFinite(+p.latitude)&&Number.isFinite(+p.longitude)&&Math.abs(+p.latitude)<=90&&Math.abs(+p.longitude)<=180;
const signature=j=>(j.legs||[]).map(l=>[l.mode,l.from,l.to,l.departureTime,l.arrivalTime,...(l.lineNames||[])].join('|')).join('>');
export function createRomanianGtfsDispatcher(feeds={}){
 const entries=Object.entries(feeds).filter(([region,feed])=>recognizedGtfsRegion(region,'RO')&&Array.isArray(feed?.stops));
 const bounds=new Map(entries.map(([region,feed])=>{
  let minLat=Infinity,maxLat=-Infinity,minLon=Infinity,maxLon=-Infinity;
  for(const stop of feed.stops){
   const p={latitude:stop.stop_lat,longitude:stop.stop_lon};if(!valid(p))continue;
   minLat=Math.min(minLat,+p.latitude);maxLat=Math.max(maxLat,+p.latitude);
   minLon=Math.min(minLon,+p.longitude);maxLon=Math.max(maxLon,+p.longitude);
  }
  return [region,{minLat,maxLat,minLon,maxLon}];
 }));
 const nearBounds=(p,b)=>p.latitude>=b.minLat-.02&&p.latitude<=b.maxLat+.02&&p.longitude>=b.minLon-.03&&p.longitude<=b.maxLon+.03;
 return body=>{
  const region=typeof body?.region==='string'?body.region:'';
  if(!recognizedGtfsRegion(region,'RO'))return {httpStatus:400,error:'unsupported_region'};
  if(!valid(body.from)||!valid(body.to))return {httpStatus:400,error:'invalid_coordinates'};
  if((region!=='romania'&&!feeds[region])||!entries.length)return {httpStatus:503,status:'feed_not_loaded',journeys:[]};
  const radius=Math.min(1200,Math.max(150,Number(body.maxStraightLineMeters)||700));
  const selected=region==='romania'?entries.filter(([id,feed])=>{
   const b=bounds.get(id);if(!nearBounds(body.from,b)||!nearBounds(body.to,b))return false;
   let nearFrom=false,nearTo=false;
   for(const stop of feed.stops){
    const p={latitude:stop.stop_lat,longitude:stop.stop_lon};
    if(!nearFrom&&pointDistanceMeters(body.from,p)<=radius)nearFrom=true;
    if(!nearTo&&pointDistanceMeters(body.to,p)<=radius)nearTo=true;
    if(nearFrom&&nearTo)return true;
   }
   return false;
  }):entries.filter(([id])=>id===region);
  if(!selected.length)return {status:'no_nearby_gtfs_stop',journeys:[],
   coverage_reason:'no_single_imported_feed_covers_endpoints',coverage_verified:false};
  const journeys=[],lines=[],statuses=[],seen=new Set();
  const options={date:body.date,afterHHMM:body.afterHHMM,maxStraightLineMeters:body.maxStraightLineMeters,maxResults:body.maxResults};
  for(const [id,feed] of selected){
   const result=planRomanianUrbanGtfs(feed,body.from,body.to,options);
   if(['invalid_date','invalid_departure','invalid_coordinates'].includes(result.status))return result;
   statuses.push(result.status);
   for(const j of result.journeys){const key=signature(j);if(!seen.has(key)){seen.add(key);journeys.push({...j,feed_region:id});}}
   if(!result.journeys.length&&['no_service_on_date','no_verified_itinerary'].includes(result.status)){
    lines.push(...routeTopologyFromGtfs(feed,body.from,body.to,{country:'RO',...options}).map(j=>({...j,feed_region:id})));
   }
  }
  const limit=Math.max(1,Math.min(6,Math.floor(Number(body.maxResults))||4));
  journeys.sort((a,b)=>Date.parse(a.arrivalDateTime)-Date.parse(b.arrivalDateTime));
  if(journeys.length){
   const chosen=journeys.slice(0,limit),busOnly=j=>j.legs?.length&&j.legs.every(l=>['bus','coach','trolleybus'].includes(l.mode));
   const bus=journeys.find(busOnly);
   if(limit>1&&bus&&!chosen.some(busOnly)){
    if(chosen.length>=limit)chosen.pop();chosen.push(bus);
    chosen.sort((a,b)=>Date.parse(a.arrivalDateTime)-Date.parse(b.arrivalDateTime));
   }
   return {status:'success',journeys:chosen,selected_regions:selected.map(([id])=>id),coverage_verified:false};
  }
  if(lines.length)return {status:'route_only',journeys:lines.slice(0,limit),schedule_status:'unavailable',service_today_verified:false,coverage_verified:false};
  return {status:statuses.every(s=>s==='no_service_on_date')?'no_service_on_date':'no_verified_itinerary',journeys:[],coverage_verified:false};
 };
}
