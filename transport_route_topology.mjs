// Country-neutral transport: document a sourced line even when it has no departure time.
// Does not establish service on the requested day, vehicle location or connection feasibility.
const types={'0':'tram','1':'metro','2':'train','3':'bus','4':'ferry','11':'trolleybus'};
const modes=new Set(['tram','metro','train','bus','ferry','trolleybus','coach','rail']);
const str=(v,n=100)=>String(v??'').trim().slice(0,n);
const valid=p=>p&&p.latitude!=null&&p.longitude!=null&&Number.isFinite(+p.latitude)&&Number.isFinite(+p.longitude)&&Math.abs(+p.latitude)<=90&&Math.abs(+p.longitude)<=180;
const dist=(a,b)=>{const rad=Math.PI/180,la=+a.latitude*rad,lb=+b.latitude*rad,h=Math.sin((lb-la)/2)**2+Math.cos(la)*Math.cos(lb)*Math.sin(((+b.longitude-+a.longitude)*rad)/2)**2;
 return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));};
export function verifiedRouteOnlyOptions(journeys=[],country=''){
 if(!/^[A-Z]{2}$/.test(str(country).toUpperCase()))return [];
 const seen=new Set(),options=[];
 for(const j of (Array.isArray(journeys)?journeys:[]).slice(0,20)){
  const l=j?.legs?.[0];
  if(j?.route_only!==true||j?.scheduled!==false||j.schedule_status!=='unavailable'||
   !['licensed_gtfs_topology','official_operator_route'].includes(j.source_type)||
   j.legs?.length!==1||j.startDateTime!=null||j.arrivalDateTime!=null||
   l?.departureTime!=null||l?.arrivalTime!=null)continue;
  const mode=str(l.mode,30),line=str(l.lineNames?.[0],60),from=str(l.from),to=str(l.to),
   startId=str(l.fromStopId,80),endId=str(l.toStopId,80);
  if(!modes.has(mode)||!line||!from||!to||!startId||!endId||startId===endId)continue;
  const id=[mode,line,startId,endId].join('|');if(seen.has(id))continue;seen.add(id);
  options.push({country:str(country).toUpperCase(),mode,line,boarding_stop:from,alighting_stop:to,
   boarding_stop_id:startId,alighting_stop_id:endId,operator:str(l.operator),
   source:str(j.source||j.provider),source_type:j.source_type,
   timetable_available:false,service_today_verified:false,departure_time:null,arrival_time:null,
   duration_minutes:null,walking_access_verified:false,transfer_verified:false});
  if(options.length>=6)break;
 }
 return options;
}
export function routeOnlyMessage(rows,language='ro'){
 if(!rows?.length)return '';
 const en=language==='en';
 const summary=rows.map((x,i)=>String(i+1)+'. '+x.mode+' '+x.line+' · '+x.boarding_stop+' → '+x.alighting_stop+
  (x.operator?' · '+x.operator:'')).join('\n');
 return (en?'Documented public transport lines — timetable unavailable:':'Linii de transport documentate — orar indisponibil:')+
  '\n'+summary+'\n\n'+(en
  ?'Departure, arrival, frequency and service on the chosen day are not confirmed. Transfers and walking access are unverified. Check with the operator.'
  :'Orele de plecare, sosire, frecvența și circulația în ziua aleasă nu sunt confirmate. Schimbările și accesul pietonal nu sunt verificate. Verifică la operator.');
}
export function routeTopologyFromGtfs(feed,from,to,{country='RO',maxStraightLineMeters=700,maxResults=4}={}){
 if(!valid(from)||!valid(to)||!Array.isArray(feed?.stops)||!Array.isArray(feed?.trips)||
 !Array.isArray(feed?.routes)||!Array.isArray(feed?.stop_times))return [];
 const radius=Math.min(1200,Math.max(150,Number(maxStraightLineMeters)||700));
 const stops=new Map(feed.stops.filter(s=>s?.stop_id&&s.stop_name&&valid({latitude:s.stop_lat,longitude:s.stop_lon}))
  .map(s=>[str(s.stop_id),s]));
 const close=p=>new Map([...stops].map(([id,s])=>[id,dist(p,{latitude:s.stop_lat,longitude:s.stop_lon})])
  .filter(v=>v[1]<=radius).sort((a,b)=>a[1]-b[1]).slice(0,12));
 const starts=close(from),ends=close(to);
 if(!starts.size||!ends.size)return [];
 const routes=new Map(feed.routes.filter(r=>r?.route_id).map(r=>[str(r.route_id),r]));
 const trips=new Map(feed.trips.filter(t=>t?.trip_id&&routes.has(str(t.route_id))).map(t=>[str(t.trip_id),t]));
 const perTrip=new Map();
 for(const row of feed.stop_times){
  const t=str(row?.trip_id),stop=str(row?.stop_id),seq=Number(row?.stop_sequence);
  if(!trips.has(t)||!Number.isSafeInteger(seq)||seq<0||(!starts.has(stop)&&!ends.has(stop)))continue;
  if(!perTrip.has(t))perTrip.set(t,[]);
  perTrip.get(t).push({stop,seq});
 }
 const candidates=[];
 for(const [tripId,items] of perTrip){
  const route=routes.get(str(trips.get(tripId).route_id));
  const line=str(route.route_short_name||route.route_long_name,60),mode=types[str(route.route_type)];
  if(!line||!mode)continue;
  for(const a of items.filter(x=>starts.has(x.stop)))for(const b of items.filter(x=>ends.has(x.stop)&&x.seq>a.seq&&x.stop!==a.stop)){
   const x=stops.get(a.stop),y=stops.get(b.stop);
   const journey={provider:'GTFS operator route topology',source:'GTFS route and stop sequence',
    source_type:'licensed_gtfs_topology',route_only:true,scheduled:false,real_time:false,
    schedule_status:'unavailable',startDateTime:null,arrivalDateTime:null,durationMinutes:null,
    legs:[{mode,lineNames:[line],from:str(x.stop_name),to:str(y.stop_name),fromStopId:a.stop,toStopId:b.stop,
      operator:str(route.agency_id),departureTime:null,arrivalTime:null}],geometryAvailable:false,routeSegments:[]};
   candidates.push({score:starts.get(a.stop)+ends.get(b.stop)+(b.seq-a.seq)*10,journey});
  }
 }
 const out=[],seen=new Set(),limit=Math.min(6,Math.max(1,Math.floor(maxResults)||4));
 for(const row of candidates.sort((a,b)=>a.score-b.score)){
  const l=row.journey.legs[0],key=[l.mode,l.lineNames[0],l.fromStopId,l.toStopId].join('|');
  if(seen.has(key))continue;seen.add(key);out.push(row.journey);
  if(out.length>=limit)break;
 }
 return verifiedRouteOnlyOptions(out,country).length?out:[];
}
