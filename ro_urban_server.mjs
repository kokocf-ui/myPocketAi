// Private Oracle-side planner gateway for licensed Romanian urban GTFS snapshots.
// Never publish this endpoint directly to the internet. Bind host to loopback.
import {createServer} from 'node:http';
import {timingSafeEqual} from 'node:crypto';
import {readFileSync,statSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {openGtfsFeedCatalog} from './regional_gtfs_catalog.mjs';
import {ROMANIA_GTFS_REGIONS,ENGLAND_GTFS_REGIONS,recognizedGtfsRegion,pointDistanceMeters} from './regional_gtfs_registry.mjs';
import {planRomanianUrbanGtfs} from './ro_urban_gtfs.mjs';
import {routeTopologyFromGtfs} from './transport_route_topology.mjs';

export const REGIONS=Object.freeze(['romania',...ROMANIA_GTFS_REGIONS]);
const reply=(response,code,data)=>{
 response.statusCode=code;
 response.setHeader('Content-Type','application/json; charset=utf-8');
 response.setHeader('Cache-Control','no-store');
 response.setHeader('X-Content-Type-Options','nosniff');
 response.end(JSON.stringify(data));
};
function sameToken(received,expected){
 if(!expected||expected.length<32||typeof received!=='string')return false;
 const marker='Bearer ';
 if(!received.startsWith(marker))return false;
 const supplied=Buffer.from(received.slice(marker.length)),secret=Buffer.from(expected);
 return supplied.length===secret.length && timingSafeEqual(supplied,secret);
}
export function loadRomanianFeeds(directory){
 const feeds={};
 for(const region of REGIONS){
  try{
   const filename=join(directory,region+'.json'),stats=statSync(filename);
   if(!stats.isFile()||stats.size>150*1024*1024)continue;
   const feed=JSON.parse(readFileSync(filename,'utf8'));
   if(Array.isArray(feed.stops)&&Array.isArray(feed.trips)&&Array.isArray(feed.stop_times))
    feeds[region]=feed;
  }catch{ /* Missing or malformed feeds must never produce guessed journeys. */ }
 }
 return feeds;
}
// Geographical eligibility is established from actual imported stop coordinates,
// not a claimed nationwide feed or a county inferred from an approximate bounding box.
const nearFeed=(feed,from,to,radius=700)=>{
 const r=Math.min(1200,Math.max(150,Number(radius)||700));
 let a=false,b=false;
 for(const stop of feed?.stops||[]){
  const pt={latitude:stop.stop_lat,longitude:stop.stop_lon};
  if(!a&&pointDistanceMeters(from,pt)<=r)a=true;
  if(!b&&pointDistanceMeters(to,pt)<=r)b=true;
  if(a&&b)return true;
 }
 return false;
};
const countryZone=c=>c==='GB'?'Europe/London':'Europe/Bucharest';
export function createRomanianUrbanServer({token,feeds={},catalog=null,country='RO'}={}){
 const cc=country==='GB'?'GB':'RO';
 const zone=countryZone(cc);
 const available=Object.keys(feeds).filter(k=>recognizedGtfsRegion(k,cc));
 const sources=catalog||{count:0,match:()=>[]};
 return createServer(async(request,response)=>{
  const url=new URL(request.url||'/', 'http://localhost');
  if(request.method==='GET'&&url.pathname==='/healthz')
   return reply(response,200,{status:'ok',service:'pocketai-local-gtfs',country:cc});
  if(request.method!=='POST'||url.pathname!=='/v1/plan')return reply(response,404,{error:'not_found'});
  if(!sameToken(request.headers.authorization,token))return reply(response,401,{error:'unauthorized'});
  if(!String(request.headers['content-type']||'').toLowerCase().startsWith('application/json'))
   return reply(response,415,{error:'unsupported_media_type'});
  const pieces=[];let size=0;
  try{
   for await(const chunk of request){
    size+=chunk.length;
    if(size>4096)return reply(response,413,{error:'request_too_large'});
    pieces.push(chunk);
   }
   const body=JSON.parse(Buffer.concat(pieces).toString('utf8'));
   const region=typeof body.region==='string'?body.region:'';
   if(!recognizedGtfsRegion(region,cc))return reply(response,400,{error:'unsupported_region'});
   const from=body.from,to=body.to;
   if(!from||!to||pointDistanceMeters(from,to)===Infinity)
    return reply(response,400,{error:'invalid_coordinates'});
   const radius=body.maxStraightLineMeters;
   const isCountrySearch=cc==='GB'?region==='england':region==='romania';
   // Legacy city route may use a new county feed. For all queries, select only
   // loaded feeds whose stops are genuinely near BOTH requested endpoints.
   const inMemory=available.flatMap(key=>{
    const feed=feeds[key];
    if(!feed||(!isCountrySearch&&key!==region&&region.startsWith('ro-')))return [];
    return nearFeed(feed,from,to,radius)?[{key,load:()=>feed}]:[];
   });
   const indexed=sources.match(from,to,radius,3)
    .filter(x=>isCountrySearch||x.region===region||
      (cc==='RO'&&!region.startsWith('ro-'))||
      (cc==='GB'&&region==='england'));
   // Bound CPU/RAM: a query evaluates at most three independently sourced snapshots.
   const candidates=[...inMemory,...indexed].slice(0,3);
   if(!candidates.length)return reply(response,503,{
    status:(available.length||sources.count)?'no_nearby_gtfs_stop':'feed_not_loaded',
    journeys:[],country:cc});
   const journeys=[],routeOnly=[];
   let serviceStatus='no_verified_itinerary';
   const requestDate=body.date||new Intl.DateTimeFormat('sv-SE',{
     timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'
   }).format(new Date());
   for(const candidate of candidates){
    let feed;
    try{feed=await candidate.load({from,to,date:requestDate,radius});}
    catch{serviceStatus='planner_unavailable';continue;}
    if(feed?.__sqlite_status){serviceStatus=feed.__sqlite_status;continue;}
    if(!feed)continue; // Stale index or updated snapshot: never serve cached dates.
    const result=planRomanianUrbanGtfs(feed,from,to,{
     date:body.date,afterHHMM:body.afterHHMM,timeZone:zone,
     maxStraightLineMeters:radius,maxResults:body.maxResults});
    if(result.journeys?.length)journeys.push(...result.journeys);
    else if(result.status==='no_service_on_date'||result.status==='no_verified_itinerary'){
     const lines=routeTopologyFromGtfs(feed,from,to,{
      country:cc,maxStraightLineMeters:radius,maxResults:body.maxResults});
     routeOnly.push(...lines);
     serviceStatus=result.status;
    }else if(result.status==='planner_busy')serviceStatus='planner_busy';
    else if(result.status==='invalid_date'||result.status==='invalid_departure')
     return reply(response,400,{status:result.status,journeys:[]});
   }
   const max=Math.min(6,Math.max(1,Math.floor(Number(body.maxResults)||4)));
   if(journeys.length){
    // A snapshot is not real-time. Sort and remove identical service alternatives.
    const seen=new Set(),sorted=journeys.sort((a,b)=>
      Date.parse(a.arrivalDateTime)-Date.parse(b.arrivalDateTime));
    const distinct=sorted.filter(j=>{
      const id=j.legs.map(l=>[l.mode,l.fromStopId,l.toStopId,l.departureTime].join('|')).join('>');
      if(seen.has(id))return false;seen.add(id);return true;
    }).slice(0,max);
    return reply(response,200,{status:'success',journeys:distinct,time_zone:zone,
      schedule_only:true,real_time:false});
   }
   if(routeOnly.length)return reply(response,200,{status:'route_only',
    journeys:routeOnly.slice(0,max),schedule_status:'unavailable',service_today_verified:false});
   if(['planner_busy','planner_unavailable'].includes(serviceStatus))
    return reply(response,503,{status:serviceStatus,journeys:[],time_zone:zone});
   return reply(response,200,{status:serviceStatus,journeys:[],time_zone:zone});
  }catch{return reply(response,400,{error:'invalid_request'});}
 });
}
export const createRegionalGtfsServer=createRomanianUrbanServer;
if(process.argv[1]&&import.meta.url===new URL('file://'+resolve(process.argv[1])).href){
 const token=process.env.RO_GATEWAY_TOKEN||'';
 if(token.length<32)throw Error('RO_GATEWAY_TOKEN must be provisioned privately (32+ characters)');
 const country=process.env.GTFS_COUNTRY==='GB'?'GB':'RO';
 const dir=process.env.GTFS_DATA_DIR||process.env.RO_GTFS_DATA_DIR||'/data/feeds';
 // Production is deliberately opt-in: only snapshot+matching index pairs are read.
 // This avoids holding 42 county feeds in memory in the 1 GB Docker container.
 const catalog=openGtfsFeedCatalog(dir,{country});
 const port=Number(process.env.PORT||3000);
 if(!Number.isSafeInteger(port)||port<1||port>65535)throw Error('bad_port');
 createRegionalGtfsServer({token,catalog,country}).listen(port,'0.0.0.0',()=>{
  console.info('GTFS internal gateway started; country and indexed feeds',country,catalog.count);
 });
}