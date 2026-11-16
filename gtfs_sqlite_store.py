#!/usr/bin/env python3
"""Private GTFS ZIP -> SQLite importer, index, and bounded route slice.
Never overwrite a live feed or persist traveller coordinates.
"""
import csv, io, json, math, os, sqlite3, sys, zipfile
from datetime import date as Date
from pathlib import Path

MAX_GTFS_BYTES=1_500_000_000
MAX_EN_GTFS_BYTES=4_000_000_000  # England regional BODS feeds can exceed RO's limit
MAX_QUERY_TRIPS=6000
MAX_QUERY_ROWS=200000
MAX_OUTPUT_TRIPS=2500
REQUIRED={
 'stops.txt':('stop_id','stop_name','stop_lat','stop_lon'),
 'routes.txt':('route_id','route_type'),
 'trips.txt':('trip_id','route_id','service_id'),
 'stop_times.txt':('trip_id','stop_id','stop_sequence','arrival_time','departure_time')
}
TABLES={
 'stops.txt':('stops','stop_id,stop_name,stop_lat,stop_lon','?,?,?,?'),
 'routes.txt':('routes','route_id,route_type,route_short_name,route_long_name,agency_id','?,?,?,?,?'),
 'trips.txt':('trips','trip_id,route_id,service_id,trip_headsign','?,?,?,?'),
 'stop_times.txt':('stop_times','trip_id,stop_id,stop_sequence,arrival_time,departure_time','?,?,?,?,?'),
 'calendar.txt':('calendar','service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date','?,?,?,?,?,?,?,?,?,?'),
 'calendar_dates.txt':('calendar_dates','service_id,date,exception_type','?,?,?')
}
SCHEMA="""
CREATE TABLE stops(stop_id TEXT PRIMARY KEY, stop_name TEXT NOT NULL, stop_lat REAL NOT NULL, stop_lon REAL NOT NULL);
CREATE TABLE routes(route_id TEXT PRIMARY KEY, route_type TEXT, route_short_name TEXT, route_long_name TEXT, agency_id TEXT);
CREATE TABLE trips(trip_id TEXT PRIMARY KEY, route_id TEXT, service_id TEXT, trip_headsign TEXT);
CREATE TABLE stop_times(trip_id TEXT, stop_id TEXT, stop_sequence INTEGER, arrival_time TEXT, departure_time TEXT);
CREATE TABLE calendar(service_id TEXT, monday TEXT, tuesday TEXT, wednesday TEXT, thursday TEXT, friday TEXT, saturday TEXT, sunday TEXT, start_date TEXT, end_date TEXT);
CREATE TABLE calendar_dates(service_id TEXT, date TEXT, exception_type TEXT);
"""

def zipped_rows(z,name,max_table_bytes=MAX_GTFS_BYTES):
    if name not in z.namelist():
        if name in REQUIRED: raise ValueError('missing_required_table: '+name)
        return
    info=z.getinfo(name)
    if info.file_size>max_table_bytes or info.file_size<0:
        raise ValueError('unsafe_table_size: '+name)
    with z.open(info) as f:
        reader=csv.DictReader(io.TextIOWrapper(f,encoding='utf-8-sig',newline=''))
        columns=set(reader.fieldnames or [])
        if name in REQUIRED and not set(REQUIRED[name]).issubset(columns):
            raise ValueError('missing_columns: '+name)
        for row in reader: yield row

def import_zip(zip_path,db_path,region,country):
    if country not in ('RO','GB') or not (region.startswith('ro-') if country=='RO' else region.startswith('en-')):
        raise ValueError('invalid_region')
    limit=MAX_GTFS_BYTES if country=='RO' else MAX_EN_GTFS_BYTES
    p=Path(db_path)
    if p.exists() or p.with_name(region+'.index.json').exists():
        raise FileExistsError('refusing_to_overwrite_existing_snapshot')
    temp=Path(str(p)+'.building')
    if temp.exists(): raise FileExistsError('another_import_may_be_in_progress')
    con=None
    try:
        with zipfile.ZipFile(zip_path) as z:
            if sum(x.file_size for x in z.infolist())>limit:
                raise ValueError('oversized_zip')
            if not any(n in z.namelist() for n in ('calendar.txt','calendar_dates.txt')):
                raise ValueError('missing_calendar')
            con=sqlite3.connect(str(temp))
            con.executescript(SCHEMA)
            counts={}
            for name,(table,cols,values) in TABLES.items():
                keys=cols.split(',')
                query=f'INSERT INTO {table} ({cols}) VALUES ({values})'
                batch=[];cnt=0
                for row in zipped_rows(z,name,limit):
                    vals=[row.get(k,'') for k in keys]
                    if table=='stops':
                        vals[2:4]=[float(x) for x in vals[2:4]]
                        if not (-90<=vals[2]<=90 and -180<=vals[3]<=180):
                            raise ValueError('invalid_stop_coordinates')
                    elif table=='stop_times':
                        vals[2]=int(vals[2])
                    batch.append(vals);cnt+=1
                    if len(batch)>=5000:
                        con.executemany(query,batch);batch.clear()
                if batch:con.executemany(query,batch)
                con.commit()
                counts[table]=cnt
            if any(counts.get(n,0)==0 for n in ('stops','trips','stop_times')):
                raise ValueError('empty_gtfs')
            if counts['calendar']==0 and counts['calendar_dates']==0:
                raise ValueError('empty_calendar')
            con.executescript("""
                CREATE INDEX idx_stops_coords ON stops(stop_lat,stop_lon);
                CREATE INDEX idx_stoptimes_stop ON stop_times(stop_id,trip_id);
                CREATE INDEX idx_stoptimes_trip ON stop_times(trip_id,stop_sequence);
                CREATE INDEX idx_trips_service ON trips(service_id);
                CREATE INDEX idx_dates ON calendar_dates(date,service_id);
            """)
            con.commit();con.close();con=None
        os.chmod(temp,0o600)
        os.replace(temp,p)
        print(json.dumps({'status':'imported','database':str(p),'counts':counts},separators=(',',':')))
    except Exception:
        if con is not None: con.close()
        temp.unlink(missing_ok=True)
        raise

def build_index(db_path,region,country):
    db=Path(db_path)
    if not db.is_file() or db.is_symlink(): raise ValueError('missing_database')
    idx=db.with_name(region+'.index.json')
    if idx.exists(): raise FileExistsError('index_exists_use_explicit_replace')
    con=sqlite3.connect(f'file:{db}?mode=ro',uri=True)
    try:
        positions=[[float(lat),float(lon)] for lat,lon in con.execute('SELECT stop_lat,stop_lon FROM stops')]
    finally:con.close()
    if not positions or len(positions)>250000:raise ValueError('invalid_stop_count')
    s=db.stat()
    doc={'schema':2,'backend':'sqlite','region':region,'country':country,
        'timeZone':'Europe/Bucharest' if country=='RO' else 'Europe/London',
        'snapshotBytes':s.st_size,'snapshotMtimeMs':int(s.st_mtime_ns//1_000_000),
        'positions':positions}
    tmp=idx.with_name('.'+idx.name+'.building')
    with tmp.open('x') as f:json.dump(doc,f,separators=(',',':'))
    os.chmod(tmp,0o600);os.replace(tmp,idx)
    print(json.dumps({'status':'indexed','region':region,'stops':len(positions)},separators=(',',':')))

def distance(a,b):
    r=math.pi/180
    h=math.sin((b[0]-a[0])*r/2)**2+math.cos(a[0]*r)*math.cos(b[0]*r)*math.sin((b[1]-a[1])*r/2)**2
    return 6371000*2*math.atan2(math.sqrt(h),math.sqrt(max(0,1-h)))

def near_stops(con,point,radius):
    lat,lon=float(point['latitude']),float(point['longitude'])
    if not(math.isfinite(lat) and math.isfinite(lon) and abs(lat)<=90 and abs(lon)<=180):
        raise ValueError('invalid_coordinates')
    latbox=radius/110000+.002
    lonbox=radius/max(20000,111000*math.cos(lat*math.pi/180))+.002
    rows=con.execute("""SELECT stop_id,stop_lat,stop_lon FROM stops
        WHERE stop_lat BETWEEN ? AND ? AND stop_lon BETWEEN ? AND ?""",
        (lat-latbox,lat+latbox,lon-lonbox,lon+lonbox))
    arr=[]
    for ident,slat,slon in rows:
        d=distance((lat,lon),(slat,slon))
        if d<=radius:arr.append((d,ident))
    return [x[1] for x in sorted(arr)[:12]]

def active_services(con,date):
    day=Date.fromisoformat(date)
    d=day.strftime('%Y%m%d')
    weekday=day.strftime('%A').lower()
    services={r[0] for r in con.execute(f"""SELECT service_id FROM calendar
        WHERE start_date<=? AND end_date>=? AND {weekday}='1'""",(d,d))}
    for service,typ in con.execute('SELECT service_id,exception_type FROM calendar_dates WHERE date=?',(d,)):
        if str(typ)=='1':services.add(service)
        elif str(typ)=='2':services.discard(service)
    return services

def batched(values,count=350):
    values=list(values)
    for i in range(0,len(values),count):yield values[i:i+count]

def trip_ids_at(con,stops,active):
    output=set()
    for chunk in batched(stops):
        q=','.join('?' for _ in chunk)
        for trip,service in con.execute(f"""SELECT DISTINCT t.trip_id,t.service_id
            FROM stop_times st JOIN trips t ON t.trip_id=st.trip_id
            WHERE st.stop_id IN ({q})""",chunk):
            if service not in active:continue
            output.add(trip)
            if len(output)>MAX_QUERY_TRIPS:raise ValueError('too_many_source_trips')
    return output

def fetch_stop_times(con,trip_ids):
    rows={};count=0
    for chunk in batched(trip_ids):
        q=','.join('?' for _ in chunk)
        for trip,stop,seq,arr,dep in con.execute(f"""SELECT trip_id,stop_id,stop_sequence,arrival_time,departure_time
            FROM stop_times WHERE trip_id IN ({q}) ORDER BY trip_id,stop_sequence""",chunk):
            rows.setdefault(trip,[]).append({'trip_id':trip,'stop_id':stop,
                'stop_sequence':str(seq),'arrival_time':arr,'departure_time':dep})
            count+=1
            if count>MAX_QUERY_ROWS:raise ValueError('too_many_stop_times_for_query')
    return rows

def query_feed(db_path,request):
    d=str(request['date']);Date.fromisoformat(d)
    radius=max(150,min(1200,float(request.get('radius',700))))
    con=sqlite3.connect(f'file:{db_path}?mode=ro',uri=True)
    try:
        starts=near_stops(con,request['from'],radius)
        ends=near_stops(con,request['to'],radius)
        if not starts or not ends:return {'status':'no_nearby_gtfs_stop','feed':None}
        active=active_services(con,d)
        if not active:return {'status':'no_service_on_date','feed':None}
        sids=trip_ids_at(con,starts,active)
        tids=trip_ids_at(con,ends,active)
        if not sids or not tids:return {'status':'no_verified_itinerary','feed':None}
        times=fetch_stop_times(con,sids|tids)
        startset=set(starts);endset=set(ends)
        outgoing={};incoming={};direct=set()
        for tid in sids:
            rows=times.get(tid,[])
            ss=[int(r['stop_sequence']) for r in rows if r['stop_id'] in startset]
            if not ss:continue
            first=min(ss)
            for r in rows:
                seq=int(r['stop_sequence'])
                if seq>first:outgoing.setdefault(r['stop_id'],set()).add(tid)
                if r['stop_id'] in endset and seq>first:direct.add(tid)
        for tid in tids:
            rows=times.get(tid,[])
            ee=[int(r['stop_sequence']) for r in rows if r['stop_id'] in endset]
            if not ee:continue
            last=max(ee)
            for r in rows:
                if int(r['stop_sequence'])<last:
                    incoming.setdefault(r['stop_id'],set()).add(tid)
        chosen=set(direct)
        for stop in outgoing.keys()&incoming.keys():
            chosen.update(outgoing[stop]);chosen.update(incoming[stop])
            if len(chosen)>MAX_OUTPUT_TRIPS:raise ValueError('too_many_transfer_candidates')
        if not chosen:return {'status':'no_verified_itinerary','feed':None}
        trip_rows=[]
        for chunk in batched(chosen):
            q=','.join('?' for _ in chunk)
            for tid,rid,serv,head in con.execute(f"""SELECT trip_id,route_id,service_id,trip_headsign
                FROM trips WHERE trip_id IN ({q})""",chunk):
                trip_rows.append({'trip_id':tid,'route_id':rid,'service_id':serv,'trip_headsign':head})
        route_ids={r['route_id'] for r in trip_rows}
        route_rows=[]
        for chunk in batched(route_ids):
            q=','.join('?' for _ in chunk)
            for rid,typ,short,long,agency in con.execute(f"""SELECT route_id,route_type,route_short_name,route_long_name,agency_id
                FROM routes WHERE route_id IN ({q})""",chunk):
                route_rows.append({'route_id':rid,'route_type':typ,
                    'route_short_name':short,'route_long_name':long,'agency_id':agency})
        chosen_times=[r for tid in chosen for r in times.get(tid,[])]
        relevant_stops={r['stop_id'] for r in chosen_times}
        stop_rows=[]
        for chunk in batched(relevant_stops):
            q=','.join('?' for _ in chunk)
            for sid,name,lat,lon in con.execute(f"""SELECT stop_id,stop_name,stop_lat,stop_lon
                FROM stops WHERE stop_id IN ({q})""",chunk):
                stop_rows.append({'stop_id':sid,'stop_name':name,'stop_lat':lat,'stop_lon':lon})
        services={r['service_id'] for r in trip_rows}
        calendar=[];calendar_dates=[]
        for chunk in batched(services):
            q=','.join('?' for _ in chunk)
            for row in con.execute(f"""SELECT service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date
                FROM calendar WHERE service_id IN ({q})""",chunk):
                calendar.append(dict(zip(['service_id','monday','tuesday','wednesday',
                    'thursday','friday','saturday','sunday','start_date','end_date'],row)))
            for serv,dte,typ in con.execute(f"""SELECT service_id,date,exception_type
                FROM calendar_dates WHERE service_id IN ({q}) AND date=?""",chunk+[d.replace('-','')]):
                calendar_dates.append({'service_id':serv,'date':dte,'exception_type':typ})
        return {'status':'success','feed':{'stops':stop_rows,'routes':route_rows,
            'trips':trip_rows,'stop_times':chosen_times,'calendar':calendar,'calendar_dates':calendar_dates}}
    finally:con.close()

def main():
    cmd=sys.argv[1] if len(sys.argv)>1 else ''
    if cmd=='import' and len(sys.argv)==6:
        import_zip(sys.argv[2],sys.argv[3],sys.argv[4],sys.argv[5])
    elif cmd=='index' and len(sys.argv)==5:
        build_index(sys.argv[2],sys.argv[3],sys.argv[4])
    elif cmd=='query' and len(sys.argv)==3:
        request=json.loads(sys.stdin.read(4096))
        print(json.dumps(query_feed(sys.argv[2],request),separators=(',',':')))
    else:raise ValueError('usage: import <zip> <db> <region> <RO|GB> | index <db> <region> <RO|GB> | query <db> (JSON stdin)')

if __name__=='__main__':
    try:main()
    except Exception as exc:
        print(json.dumps({'status':'error','error':str(exc)[:160]}),file=sys.stderr)
        sys.exit(1)
