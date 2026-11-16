// Private, opt-in GTFS feed registry. No downloads, scraping, or assumed operator rights.
// An index is created only after a licensed source has been imported by its operator.
import {readFileSync,writeFileSync,renameSync,lstatSync,readdirSync,statSync,unlinkSync} from 'node:fs';
import {basename,join} from 'node:path';
import {queryGtfsSqlite} from './gtfs_sqlite_reader.mjs';
import {recognizedGtfsRegion,inRomaniaApprox,inEnglandApprox,pointDistanceMeters} from './regional_gtfs_registry.mjs';
const LIMIT_BYTES=110*1024*1024; // Avoid loading unbounded national snapshots on a small VM.
const MAX_SQLITE_SNAPSHOT_BYTES=8*1024*1024*1024; // Disk-backed regional BODS snapshots; only location-specific rows are read.
const validRow=p=>p&&Number.isFinite(+p.stop_lat)&&Number.isFinite(+p.stop_lon)&&
  p.stop_lat!==null&&p.stop_lon!==null;
const zone=c=>c==='RO'?'Europe/Bucharest':'Europe/London';
const area=c=>c==='RO'?inRomaniaApprox:inEnglandApprox;
const safeFile=(dir,name)=>join(dir,name);
const statFile=path=>{try{const s=lstatSync(path);return s.isFile()&&!s.isSymbolicLink()?s:null;}catch{return null;}};
export function createGtfsFeedIndex(dir,region,country='RO',{replace=false}={}){
  if(!recognizedGtfsRegion(region,country)||region==='romania')
    throw Error('invalid_snapshot_region');
  const file=safeFile(dir,region+'.json'),st=statFile(file);
  if(!st||st.size>LIMIT_BYTES)throw Error('missing_or_oversized_feed');
  const feed=JSON.parse(readFileSync(file,'utf8'));
  if(!Array.isArray(feed.stops)||!Array.isArray(feed.trips)||!Array.isArray(feed.stop_times)||
      !feed.stops.length||!feed.trips.length||!feed.stop_times.length)throw Error('invalid_gtfs_snapshot');
  const positions=feed.stops.filter(validRow).map(p=>[+p.stop_lat,+p.stop_lon])
    .filter(([lat,lon])=>area(country)({latitude:lat,longitude:lon}));
  if(!positions.length)throw Error('feed_without_country_stops');
  const output=safeFile(dir,region+'.index.json');
  if(statFile(output)&&!replace)throw Error('index_exists_use_explicit_replace');
  const index={schema:1,region,country,timeZone:zone(country),snapshotBytes:st.size,
    snapshotMtimeMs:Math.trunc(st.mtimeMs),positions};
  // Index has stop coordinates only; no user location, token, or trip history.
  const temp=safeFile(dir,'.'+region+'.index-'+process.pid+'.tmp');
  try{writeFileSync(temp,JSON.stringify(index),{mode:0o600,flag:'wx'});
    renameSync(temp,output);}catch(e){try{unlinkSync(temp);}catch{}throw e;}
  return {region,country,stopCount:positions.length};
}
function nearestDistance(p,positions,radius){
  let best=Infinity;for(const [lat,lon] of positions){
    // Cheap bounding-box prefilter, then actual geodesic distance.
    if(Math.abs(+p.latitude-lat)>radius/100000||Math.abs(+p.longitude-lon)>radius/45000)continue;
    const d=pointDistanceMeters(p,{latitude:lat,longitude:lon});
    if(d<best){best=d;if(best<20)break;}
  }return best;
}
export function openGtfsFeedCatalog(dir,{country='RO'}={}){
  const entries=[];
  let files=[];try{files=readdirSync(dir);}catch{return {count:0,match:()=>[]};}
  for(const name of files){
    if(!name.endsWith('.index.json'))continue;
    const region=name.slice(0,-'.index.json'.length);
    if(!recognizedGtfsRegion(region,country)||region==='romania')continue;
    const indexFile=safeFile(dir,name),idxStat=statFile(indexFile);
    if(!idxStat||idxStat.size>15*1024*1024)continue;
    try{
      const index=JSON.parse(readFileSync(indexFile,'utf8'));
      const sqlite=index.schema===2&&index.backend==='sqlite';
      if(!sqlite&&index.schema!==1)continue;
      const snapshot=safeFile(dir,region+(sqlite?'.sqlite3':'.json'));
      const st=statFile(snapshot);
      if(!st||st.size>(sqlite?MAX_SQLITE_SNAPSHOT_BYTES:LIMIT_BYTES))continue;
      if(index.region!==region||index.country!==country||
        index.timeZone!==zone(country)||index.snapshotBytes!==st.size||
        index.snapshotMtimeMs!==Math.trunc(st.mtimeMs)||
        !Array.isArray(index.positions)||!index.positions.length||
        index.positions.length>250000)continue;
      const positions=index.positions.filter(x=>Array.isArray(x)&&x.length===2&&
        Number.isFinite(x[0])&&Number.isFinite(x[1]));
      if(positions.length!==index.positions.length)continue;
      entries.push({region,positions,snapshot,timeZone:zone(country),
        load:sqlite?async ({from,to,date,radius}={})=>{
          const s=statFile(snapshot);
          if(!s||s.size!==index.snapshotBytes||Math.trunc(s.mtimeMs)!==index.snapshotMtimeMs)return null;
          const res=await queryGtfsSqlite(snapshot,{from,to,date,radius});
          return res.feed||{__sqlite_status:res.status||'no_verified_itinerary'};
        }:()=>{const s=statFile(snapshot);
          if(!s||s.size!==index.snapshotBytes||Math.trunc(s.mtimeMs)!==index.snapshotMtimeMs)
            return null; // Explicit reindex after updating a feed.
          const feed=JSON.parse(readFileSync(snapshot,'utf8'));
          return Array.isArray(feed.stops)&&Array.isArray(feed.stop_times)&&
            Array.isArray(feed.trips)?feed:null;
        }});
    }catch{/* Malformed or stale source stays offline. */}
  }
  return {count:entries.length,match:(from,to,radius=1200,max=3)=>{
    const r=Math.min(1200,Math.max(150,Number(radius)||700));
    return entries.flatMap(entry=>{
      const a=nearestDistance(from,entry.positions,r),b=nearestDistance(to,entry.positions,r);
      return a<=r&&b<=r?[{...entry,distance:a+b}]:[];
    }).sort((a,b)=>a.distance-b.distance).slice(0,Math.max(1,Math.min(max,3)));
  }};
}
