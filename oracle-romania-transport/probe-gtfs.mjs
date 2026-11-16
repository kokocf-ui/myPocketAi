// Manual, offline diagnostic against a local licensed GTFS SQLite snapshot.
// The script does not enable a live service or print precise geographic coordinates.
import {spawnSync} from 'node:child_process';
import {dirname} from 'node:path';
import {openGtfsFeedCatalog} from '../regional_gtfs_catalog.mjs';
import {planRomanianUrbanGtfs} from '../ro_urban_gtfs.mjs';

const [db,date='2026-11-17']=process.argv.slice(2);
if(!db||!/^\d{4}-\d{2}-\d{2}$/.test(date)){
 console.error('usage: node oracle-romania-transport/probe-gtfs.mjs <db> [YYYY-MM-DD]');
 process.exit(2);
}
const python=String.raw`
import json, sqlite3, sys
db,day=sys.argv[1:]
con=sqlite3.connect('file:'+db+'?mode=ro',uri=True)
daycode=day.replace('-','').replace('-','')
from datetime import date
weekday=date.fromisoformat(day).strftime('%A').lower()
allowed={r[0] for r in con.execute('SELECT service_id FROM calendar WHERE start_date<=? AND end_date>=? AND '+weekday+'=?',(daycode,daycode,'1'))}
for serv,typ in con.execute('SELECT service_id,exception_type FROM calendar_dates WHERE date=?',(daycode,)):
 if str(typ)=='1':allowed.add(serv)
 elif str(typ)=='2':allowed.discard(serv)
for service in sorted(allowed):
 for (trip,) in con.execute('SELECT trip_id FROM trips WHERE service_id=? LIMIT 100',(service,)):
  rows=con.execute('SELECT s.stop_name,s.stop_lat,s.stop_lon,st.departure_time FROM stop_times st JOIN stops s ON s.stop_id=st.stop_id WHERE st.trip_id=? ORDER BY st.stop_sequence',(trip,)).fetchall()
  if len(rows)<3 or not('08:00'<=str(rows[0][3])[:5]<='15:00'):continue
  a,b=rows[0],rows[-1]
  print(json.dumps({'from':{'latitude':a[1],'longitude':a[2]},'to':{'latitude':b[1],'longitude':b[2]},'fromName':a[0],'toName':b[0],'departure':a[3]}))
  sys.exit(0)
print('{}')
sys.exit(1)
`;
const sample=spawnSync('python3',['-c',python,db,date],{encoding:'utf8',timeout:15000,maxBuffer:262144});
if(sample.status!==0)throw Error('Nu am gasit cursa GTFS activa pentru data de proba');
const request=JSON.parse(sample.stdout);
const catalog=openGtfsFeedCatalog(dirname(db),{country:'RO'});
if(!catalog.count)throw Error('Index SQLite absent sau nevalid');
const matches=catalog.match(request.from,request.to,500);
if(!matches.length)throw Error('Nu exista feed indexat pentru ambele statii');
const started=Date.now();
const feed=await matches[0].load({from:request.from,to:request.to,date,radius:500});
if(!feed||feed.__sqlite_status)throw Error('Selectia GTFS nu a produs curse: '+(feed?.__sqlite_status||'no_feed'));
const duration=Date.now()-started;
const h=Number(request.departure.slice(0,2)),m=Number(request.departure.slice(3,5));
const previous=Math.max(0,h*60+m-1);
const afterHHMM=String(Math.floor(previous/60)).padStart(2,'0')+':'+String(previous%60).padStart(2,'0');
const planned=planRomanianUrbanGtfs(feed,request.from,request.to,{date,afterHHMM,maxStraightLineMeters:500,maxResults:4});
console.log(JSON.stringify({
 date,origin:request.fromName,destination:request.toName,
 candidates:feed.trips.length,stops:feed.stops.length,stop_times:feed.stop_times.length,
 sqlite_slice_ms:duration,planner_status:planned.status,
 journeys:(planned.journeys||[]).map(j=>({start:j.startDateTime,arrival:j.arrivalDateTime,durationMinutes:j.durationMinutes,boarding_stop_id:j.access?.stop_id,boarding_direct_meters:j.access?.directMeters,alighting_stop_id:j.egress?.stop_id,alighting_stop_name:j.egress?.stop_name,alighting_direct_meters:j.egress?.directMeters,walking_to_stop_verified:j.walkingAccessVerified===true,walking_from_stop_verified:j.walkingEgressVerified===true,legs:j.legs.map(l=>({mode:l.mode,line:l.lineNames?.[0],from:l.from,to:l.to,fromStopId:l.fromStopId,toStopId:l.toStopId,departure:l.departureTime,arrival:l.arrivalTime}))}))
},null,2));
if(planned.status!=='success'||!planned.journeys?.length)process.exitCode=1;
