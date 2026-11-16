// Romanian urban GTFS (static timetable) — no external provider calls or invented times.
// The caller supplies a validated, licensed, locally-loaded GTFS snapshot.
// Precise walking routes are OUTSIDE this adapter; stop proximity is straight-line only.
const DEFAULT_ZONE='Europe/Bucharest';
const VALID_ZONES=new Set([DEFAULT_ZONE,'Europe/London']);
const weekdays=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
const modes=new Map([['0','tram'],['1','metro'],['2','train'],['3','bus'],
 ['4','ferry'],['11','trolleybus']]);
// Official GTFS-HVT extension; do not label a train-replacement bus as train.
const vehicleMode=value=>{
 const raw=String(value),n=Number(raw);
 if(modes.has(raw))return modes.get(raw);
 if(!Number.isSafeInteger(n))return 'public_transport';
 if(n>=100&&n<200)return 'train';
 if(n>=200&&n<210)return 'coach';
 if(n>=400&&n<406)return 'metro';
 if(n>=700&&n<800)return 'bus';
 if(n===800)return 'trolleybus';
 if(n>=900&&n<910)return 'tram';
 if(n===1000||n===1200)return 'ferry';
 return 'public_transport';
};
const validPoint=p=>p&&Number.isFinite(Number(p.latitude))&&Number.isFinite(Number(p.longitude))&&p.latitude!==null&&p.longitude!==null&&Math.abs(+p.latitude)<=90&&Math.abs(+p.longitude)<=180;
const byId=(rows,key)=>new Map((rows||[]).filter(x=>x&&x[key]).map(x=>[String(x[key]),x]));
const timeSec=v=>{const m=/^(\d{1,2}):(\d{2}):(\d{2})$/.exec(String(v??''));if(!m||+m[1]>47||+m[2]>59||+m[3]>59)return null;return +m[1]*3600 + +m[2]*60 + +m[3];};
const dateValid=d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d+'T12:00:00Z'))&&new Date(d+'T12:00:00Z').toISOString().startsWith(d);
function roDate(d,zone){
 const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d).map(x=>[x.type,x.value]));
 return p.year+'-'+p.month+'-'+p.day;
}
function utcAt(date,secs,zone){
 const p=new Intl.DateTimeFormat('en-GB',{timeZone:zone,timeZoneName:'shortOffset'}).formatToParts(new Date(date+'T12:00:00Z'));
 const offset=p.find(x=>x.type==='timeZoneName')?.value||'';
 const m=/^GMT([+-])(\d{1,2})(?::(\d{2}))?$/.exec(offset);
 if(!m&&offset!=='GMT')return null;
 const min=!m?0:(m[1]==='-'?-1:1)*(+m[2]*60+ +(m[3]||0));
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
 return {mode:vehicleMode(ride.route?.route_type),
  from:a.stop.stop_name,to:b.stop.stop_name,fromStopId:a.stop.stop_id,toStopId:b.stop.stop_id,
  departurePoint:{latitude:Number(a.stop.stop_lat),longitude:Number(a.stop.stop_lon),
   commonName:a.stop.stop_name,stop_id:a.stop.stop_id},
  arrivalLatLon:{lat:Number(b.stop.stop_lat),lon:Number(b.stop.stop_lon)},
  arrivalPoint:{latitude:Number(b.stop.stop_lat),longitude:Number(b.stop.stop_lon),
   commonName:b.stop.stop_name,stop_id:b.stop.stop_id},
  departureTime:new Date(a.dep).toISOString(),arrivalTime:new Date(b.arr).toISOString(),
  lineNames:[String(ride.route?.route_short_name||ride.route?.route_long_name||ride.trip.trip_headsign||'').slice(0,60)].filter(Boolean),
  operator:String(ride.route?.agency_id||'').slice(0,80)};
}
export function planRomanianUrbanGtfs(feed,from,to,options={}){
 const zone=VALID_ZONES.has(options.timeZone)?options.timeZone:DEFAULT_ZONE;
 if(!feed||!Array.isArray(feed.stops)||!Array.isArray(feed.trips)||!Array.isArray(feed.stop_times))
  return {status:'feed_not_loaded',journeys:[]};
 if(!validPoint(from)||!validPoint(to))return {status:'invalid_coordinates',journeys:[]};
 const requestTime=options.departureAt?new Date(options.departureAt):new Date();
 if(Number.isNaN(requestTime.getTime()))return {status:'invalid_departure',journeys:[]};
 const date=options.date||roDate(requestTime,zone);
 if(!dateValid(date))return {status:'invalid_date',journeys:[]};
 const at=options.afterHHMM&&/^(\d{1,2}):(\d{2})$/.exec(options.afterHHMM);
 if(options.afterHHMM&&(!at||+at[1]>23||+at[2]>59))return {status:'invalid_departure',journeys:[]};
 const earliest=at?utcAt(date,(+at[1]*60+ +at[2])*60,zone):date===roDate(requestTime,zone)?requestTime.getTime():utcAt(date,0,zone);
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
 const midnightUtc=utcAt(date,0,zone);
 if(midnightUtc===null)return {status:'invalid_date',journeys:[]};
 // One time-zone offset lookup per request instead of two costly Intl
 // formatter allocations for every row (large feeds can have 100k+ rows).
 const perTrip=new Map();
 for(const row of feed.stop_times){
  const trip=trips.get(String(row?.trip_id||'')),stop=stops.get(String(row?.stop_id||''));
  if(!trip||!stop||!allowed.has(String(trip.service_id)))continue;
  const arrival=timeSec(row.arrival_time),departure=timeSec(row.departure_time),seq=Number(row.stop_sequence);
  if(arrival===null||departure===null||departure<arrival||!Number.isSafeInteger(seq)||seq<0)continue;
  const entry={stop,seq,arr:midnightUtc+arrival*1000,dep:midnightUtc+departure*1000};
  if(!perTrip.has(trip.trip_id))perTrip.set(trip.trip_id,[]);
  perTrip.get(trip.trip_id).push(entry);
 }
 const boardings=new Map(),arrivals=new Map();
 // Index only boardable origins and second legs that can actually reach a
 // destination stop later in their trip; pre-sort these by departure time.
 for(const [tripId,entries] of perTrip){
  entries.sort((a,b)=>a.seq-b.seq);
  if(entries.length<2||entries.some((e,i)=>i&&(e.seq===entries[i-1].seq||e.arr<entries[i-1].dep)))continue;
  const trip=trips.get(tripId),ride={tripId,trip,route:routes.get(String(trip.route_id)),entries,
   signature:entries.map(e=>e.stop.stop_id+'@'+e.arr+'/'+e.dep).join('>')};
  const laterTarget=new Array(entries.length);
  let nextTarget=-1;
  for(let i=entries.length-1;i>=0;i--){
   laterTarget[i]=nextTarget;
   if(targets.has(String(entries[i].stop.stop_id)))nextTarget=i;
  }
  for(let i=0;i<entries.length-1;i++){
   const id=String(entries[i].stop.stop_id),entry=entries[i];
   if(origins.has(id)){
    if(!boardings.has(id))boardings.set(id,[]);
    boardings.get(id).push({ride,index:i,entry});
   }
   const destIndex=laterTarget[i];
   if(destIndex>=0&&entries[destIndex].arr>entry.dep){
    if(!arrivals.has(id))arrivals.set(id,[]);
    arrivals.get(id).push({ride,index:i,entry,destIndex});
   }
  }
 }
 for(const [stopId,options] of boardings){
  // Deduplicate exact trip copies only (preserve distinct stopping patterns).
  const keys=new Set(),unique=[];
  for(const item of options){
   const key=item.ride.signature+'|'+item.index;
   if(keys.has(key))continue;
   keys.add(key);unique.push(item);
  }
  unique.sort((a,b)=>a.entry.dep-b.entry.dep);
  boardings.set(stopId,unique);
 }
 for(const [stopId,options] of arrivals){
  options.sort((a,b)=>a.entry.dep-b.entry.dep);
  // Repeated GTFS trips with identical line, platform and timetable are
  // equivalent transfer options. Collapse them before searching connections.
  const keys=new Set(),unique=[];
  for(const item of options){
   const end=item.ride.entries[item.destIndex];
   const key=item.ride.signature+'|'+item.index;
   if(keys.has(key))continue;
   keys.add(key);unique.push(item);
  }
  // Lower bound on arrival for any subsequent transfer departure.
  // Lets crowded hubs skip entire noncompetitive sets without enumerating them.
  unique.minArrivalSuffix=new Float64Array(unique.length+1);
  unique.minArrivalSuffix[unique.length]=Infinity;
  for(let i=unique.length-1;i>=0;i--)
   unique.minArrivalSuffix[i]=Math.min(unique.minArrivalSuffix[i+1],
    unique[i].ride.entries[unique[i].destIndex].arr);
  arrivals.set(stopId,unique);
 }
 const result=[],seen=new Set(),walking=d=>Math.ceil((d*1.45)/1.2);
 const max=Math.min(6,Math.max(1,Math.floor(Number(options.maxResults)||4)));
 const compare=(a,b)=>Date.parse(a.arrivalDateTime)-Date.parse(b.arrivalDateTime)||
  a.legs.length-b.legs.length||
  a.egress.directMeters-b.egress.directMeters||
  a.access.directMeters-b.access.directMeters;
 const push=(legs,start,end)=>{
  // Reject physically impossible zero-minute legs and missing chronological transfers.
  if(legs.some(l=>l.fromStopId!==l.toStopId&&
     Date.parse(l.arrivalTime)<=Date.parse(l.departureTime)))return;
  if(legs.length===2&&Date.parse(legs[1].departureTime)<Date.parse(legs[0].arrivalTime)+180000)return;
  const key=legs.map(l=>l.fromStopId+'/'+l.toStopId+'/'+l.departureTime).join('|');
  if(seen.has(key))return;
  const begin=Math.max(earliest,Date.parse(legs[0].departureTime)-walking(start.d)*1000);
  const finish=Date.parse(legs.at(-1).arrivalTime);
  const option={provider:zone==='Europe/London'?'England GTFS static':'Romania GTFS static',time_zone:zone,
   startDateTime:new Date(begin).toISOString(),arrivalDateTime:new Date(finish).toISOString(),
   durationMinutes:Math.round((finish-begin)/60000),legs,
   routeSegments:[],geometryAvailable:false,scheduled:true,real_time:false,fareLocal:null,
   seatAvailability:'not_applicable',walkingAccessVerified:false,walkingEgressVerified:false,
   access:{stop_id:start.stop.stop_id,stop_name:start.stop.stop_name,directMeters:Math.ceil(start.d),
     latitude:Number(start.stop.stop_lat),longitude:Number(start.stop.stop_lon)},
   egress:{stop_id:end.stop.stop_id,stop_name:end.stop.stop_name,directMeters:Math.ceil(end.d),
     latitude:Number(end.stop.stop_lat),longitude:Number(end.stop.stop_lon)},
   source:'GTFS static (operator-published schedule, NOT live times)'};
  // Retain the best candidates without accumulating potentially millions of
  // transfer combinations in RAM. Results remain ordered by arrival time.
  if(result.length>=max&&compare(option,result.at(-1))>=0)return;
  seen.add(key);
  result.push(option);result.sort(compare);
  if(result.length>max){
   const dropped=result.pop();
   seen.delete(dropped.legs.map(l=>l.fromStopId+'/'+l.toStopId+'/'+l.departureTime).join('|'));
  }
 };
 const lowerBound=(rows,min)=>{
  let lo=0,hi=rows.length;
  while(lo<hi){const m=(lo+hi)>>>1;if(rows[m].entry.dep<min)lo=m+1;else hi=m;}
  return lo;
 };
 let searches=0;
 for(const [id,start] of origins)for(const first of boardings.get(id)||[]){
  if(first.entry.dep<earliest+walking(start.d)*1000||first.entry.dep>earliest+9*3600000)continue;
  if(result.length===max&&first.entry.dep>=Date.parse(result.at(-1).arrivalDateTime))continue;
  const entries=first.ride.entries;
  for(let i=first.index+1;i<entries.length;i++){
   const mid=entries[i],end=targets.get(String(mid.stop.stop_id));
   // A real physical ride needs a positive time difference.
   if(mid.arr<=first.entry.dep)continue;
   if(end)push([leg(first.ride,first.entry,mid)],start,end);
   const options=arrivals.get(String(mid.stop.stop_id));
   if(!options)continue;
   if(result.length===max&&mid.arr+180000>=Date.parse(result.at(-1).arrivalDateTime))continue;
   const min=mid.arr+3*60000,maxTime=mid.arr+90*60000;
   const firstTransfer=lowerBound(options,min);
   if(result.length===max&&options.minArrivalSuffix[firstTransfer]>=Date.parse(result.at(-1).arrivalDateTime))continue;
   for(let k=firstTransfer;k<options.length&&options[k].entry.dep<=maxTime;k++){
    if(result.length===max&&options[k].entry.dep>=Date.parse(result.at(-1).arrivalDateTime))break;
    if(++searches>500000)return {status:'planner_busy',journeys:[],time_zone:zone,date};
    const next=options[k];
    if(result.length===max&&next.ride.entries[next.destIndex].arr>=Date.parse(result.at(-1).arrivalDateTime))continue;
    if(next.ride.tripId===first.ride.tripId)continue;
    const last=next.ride.entries[next.destIndex],target=targets.get(String(last.stop.stop_id));
    if(!target||last.arr<=next.entry.dep)continue;
    push([leg(first.ride,first.entry,mid),leg(next.ride,next.entry,last)],start,target);
   }
  }
 }
 return {status:result.length?'success':'no_verified_itinerary',journeys:result,time_zone:zone,date,schedule_only:true};
}