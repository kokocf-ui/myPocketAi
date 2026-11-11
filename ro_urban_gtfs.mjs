// Romanian urban GTFS (static timetable) — no external provider calls or invented times.
// The caller supplies a validated, licensed, locally-loaded GTFS snapshot.
// Precise walking routes are OUTSIDE this adapter; stop proximity is straight-line only.
const zone='Europe/Bucharest';
const weekdays=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
const modes=new Map([['0','tram'],['1','metro'],['2','train'],['3','bus'],['11','trolleybus']]);
const validPoint=p=>p&&Number.isFinite(Number(p.latitude))&&Number.isFinite(Number(p.longitude))&&p.latitude!==null&&p.longitude!==null&&Math.abs(+p.latitude)<=90&&Math.abs(+p.longitude)<=180;
const byId=(rows,key)=>new Map((rows||[]).filter(x=>x&&x[key]).map(x=>[String(x[key]),x]));
const timeSec=v=>{const m=/^(\d{1,2}):(\d{2}):(\d{2})$/.exec(String(v??''));if(!m||+m[1]>47||+m[2]>59||+m[3]>59)return null;return +m[1]*3600 + +m[2]*60 + +m[3];};
const dateValid=d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+'T12:00:00Z'))&&new Date(d+'T12:00:00Z').toISOString().startsWith(d);
function roDate(d){
 const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d).map(x=>[x.type,x.value]));
 return p.year+'-'+p.month+'-'+p.day;
}
function utcAt(date,secs){
 const p=new Intl.DateTimeFormat('en-GB',{timeZone:zone,timeZoneName:'shortOffset'}).formatToParts(new Date(date+'T12:00:00Z'));
 const offset=p.find(x=>x.type==='timeZoneName')?.value||'';
 const m=/^GMT([+-])(\d{1,2})(?::(\d{2}))?$/.exec(offset);
 if(!m)return null;
 const min=(m[1]==='-'?-1:1)*(+m[2]*60+ +(m[3]||0));
 return Date.parse(date+'T00:00:00Z')-min*60000+secs*1000;
}
function km(a,b){
 const rad=Math.PI/180,lat1=+a.latitude*rad,lat2=+b.latitude*rad;
 const la=lat2-lat1,lo=(+b.longitude-+a.longitude)*rad;
 const h=Math.sin(la/2)**2+Math.cos(lat1)*Math.cos(lat2)*Math.sin(lo/2)**2;
 return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));
}
function active(feed,day){
 const date=day.replaceAll('-',''),wd=weekdays[new Date(day+'T12:00:00Z').getUTCDay()];
 const allowed=new Set();
 for(const c of feed.calendar||[])if(String(c.start_date)<=date&&String(c.end_date)>=date&&String(c[wd])==='1')allowed.add(String(c.service_id));
 for(const c of feed.calendar_dates||[])if(String(c.date)===date){
  if(String(c.exception_type)==='1')allowed.add(String(c.service_id));
  else if(String(c.exception_type)==='2')allowed.delete(String(c.service_id));
 }
 return allowed;
}
function leg(ride,a,b){
 return {mode:modes.get(String(ride.route?.route_type))||'public_transport',
  from:a.stop.stop_name,to:b.stop.stop_name,fromStopId:a.stop.stop_id,toStopId:b.stop.stop_id,
  departureTime:new Date(a.dep).toISOString(),arrivalTime:new Date(b.arr).toISOString(),
  lineNames:[String(ride.route?.route_short_name||ride.route?.route_long_name||ride.trip.trip_headsign||'').slice(0,60)].filter(Boolean),
  operator:String(ride.route?.agency_id||'').slice(0,80)};
}
export function planRomanianUrbanGtfs(feed,from,to,options={}){
 if(!feed||!Array.isArray(feed.stops)||!Array.isArray(feed.trips)||!Array.isArray(feed.stop_times))
  return {status:'feed_not_loaded',journeys:[]};
 if(!validPoint(from)||!validPoint(to))return {status:'invalid_coordinates',journeys:[]};
 const requestTime=options.departureAt?new Date(options.departureAt):new Date();
 if(Number.isNaN(requestTime.getTime()))return {status:'invalid_departure',journeys:[]};
 const date=options.date||roDate(requestTime);
 if(!dateValid(date))return {status:'invalid_date',journeys:[]};
 const at=options.afterHHMM&&/^(\d{1,2}):(\d{2})$/.exec(options.afterHHMM);
 if(options.afterHHMM&&(!at||+at[1]>23||+at[2]>59))return {status:'invalid_departure',journeys:[]};
 const earliest=at?utcAt(date,(+at[1]*60+ +at[2])*60):date===roDate(requestTime)?requestTime.getTime():utcAt(date,0);
 if(earliest===null)return {status:'invalid_date',journeys:[]};
 const stops=byId(feed.stops,'stop_id'),trips=byId(feed.trips,'trip_id'),routes=byId(feed.routes,'route_id');
 const radius=Math.min(1200,Math.max(150,Number(options.maxStraightLineMeters)||700));
 const findNearest=point=>[...stops.values()].flatMap(stop=>{
  const target={latitude:stop.stop_lat,longitude:stop.stop_lon};
  if(!validPoint(target))return [];
  const d=km(point,target);
  return d<=radius?[{stop,d}]:[];
 }).sort((a,b)=>a.d-b.d).slice(0,12);
 const origins=byId(findNearest(from).map(x=>({...x,stop_id:x.stop.stop_id})),'stop_id');
 const targets=byId(findNearest(to).map(x=>({...x,stop_id:x.stop.stop_id})),'stop_id');
 if(!origins.size||!targets.size)return {status:'no_nearby_gtfs_stop',journeys:[]};
 const allowed=active(feed,date);
 if(!allowed.size)return {status:'no_service_on_date',journeys:[]};
 const perTrip=new Map();
 for(const row of feed.stop_times){
  const trip=trips.get(String(row?.trip_id||'')),stop=stops.get(String(row?.stop_id||''));
  if(!trip||!stop||!allowed.has(String(trip.service_id)))continue;
  const arrival=timeSec(row.arrival_time),departure=timeSec(row.departure_time),seq=Number(row.stop_sequence);
  if(arrival===null||departure===null||departure<arrival||!Number.isSafeInteger(seq)||seq<0)continue;
  const entry={stop,seq,arr:utcAt(date,arrival),dep:utcAt(date,departure)};
  if(entry.arr===null||entry.dep===null)continue;
  if(!perTrip.has(trip.trip_id))perTrip.set(trip.trip_id,[]);
  perTrip.get(trip.trip_id).push(entry);
 }
 const depByStop=new Map();
 for(const [tripId,entries] of perTrip){
  entries.sort((a,b)=>a.seq-b.seq);
  if(entries.length<2||entries.some((e,i)=>i&&(e.seq===entries[i-1].seq||e.arr<entries[i-1].dep)))continue;
  const trip=trips.get(tripId),ride={tripId,trip,route:routes.get(String(trip.route_id)),entries};
  for(let i=0;i<entries.length;i++){
   const id=String(entries[i].stop.stop_id);
   if(!depByStop.has(id))depByStop.set(id,[]);
   depByStop.get(id).push({ride,index:i,entry:entries[i]});
  }
 }
 const result=[],seen=new Set(),walking=d=>Math.ceil((d*1.45)/1.2);
 const push=(legs,start,end)=>{
  const key=legs.map(l=>l.fromStopId+'/'+l.toStopId+'/'+l.departureTime).join('|');
  if(seen.has(key))return;
  seen.add(key);
  const begin=Math.max(earliest,Date.parse(legs[0].departureTime)-walking(start.d)*1000);
  const finish=Date.parse(legs.at(-1).arrivalTime);
  result.push({provider:'Romania GTFS static',time_zone:zone,
   startDateTime:new Date(begin).toISOString(),arrivalDateTime:new Date(finish).toISOString(),
   durationMinutes:Math.round((finish-begin)/60000),legs,
   routeSegments:[],geometryAvailable:false,scheduled:true,real_time:false,fareLocal:null,
   seatAvailability:'not_applicable',walkingAccessVerified:false,walkingEgressVerified:false,
   access:{stop_id:start.stop.stop_id,stop_name:start.stop.stop_name,directMeters:Math.ceil(start.d),
     latitude:Number(start.stop.stop_lat),longitude:Number(start.stop.stop_lon)},
   egress:{stop_id:end.stop.stop_id,stop_name:end.stop.stop_name,directMeters:Math.ceil(end.d),
     latitude:Number(end.stop.stop_lat),longitude:Number(end.stop.stop_lon)},
   source:'GTFS static (operator-published schedule, NOT live times)'});
 };
 for(const [id,start] of origins)for(const first of depByStop.get(id)||[]){
  if(first.entry.dep<earliest+walking(start.d)*1000||first.entry.dep>earliest+9*3600000)continue;
  for(let i=first.index+1;i<first.ride.entries.length;i++){
   const mid=first.ride.entries[i],end=targets.get(String(mid.stop.stop_id));
   if(end)push([leg(first.ride,first.entry,mid)],start,end);
   for(const next of depByStop.get(String(mid.stop.stop_id))||[]){
    if(next.ride.tripId===first.ride.tripId||next.entry.dep<mid.arr+3*60000||next.entry.dep>mid.arr+90*60000)continue;
    for(let k=next.index+1;k<next.ride.entries.length;k++){
     const last=next.ride.entries[k],target=targets.get(String(last.stop.stop_id));
     if(target)push([leg(first.ride,first.entry,mid),leg(next.ride,next.entry,last)],start,target);
    }
   }
  }
 }
 result.sort((a,b)=>Date.parse(a.arrivalDateTime)-Date.parse(b.arrivalDateTime)||a.legs.length-b.legs.length);
 return {status:result.length?'success':'no_verified_itinerary',journeys:result.slice(0,Math.min(6,Math.max(1,Number(options.maxResults)||4))),time_zone:zone,date,schedule_only:true};
}