#!/usr/bin/env python3
"""Compare EVERY GTFS cell and read-only query speeds for East Anglia snapshots.
Never changes snapshots, Docker, or live feeds. Run from the ubuntu account.
"""
import contextlib
import itertools
import json
import os
import sqlite3
import statistics
import time
from pathlib import Path

ORIGINAL=Path("/home/ubuntu/pocketai-england-audit/en-ea.sqlite3")
COMPACT=Path("/home/ubuntu/pocketai-england-compact-pilot/en-ea.sqlite3")
TABLES={
 "stops":("stop_id,stop_name,stop_lat,stop_lon","stop_id"),
 "routes":("route_id,route_type,route_short_name,route_long_name,agency_id","route_id"),
 "trips":("trip_id,route_id,service_id,trip_headsign","trip_id"),
 "stop_times":("trip_id,stop_id,stop_sequence,arrival_time,departure_time","trip_id,stop_sequence"),
 "calendar":("service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date",
             "service_id,start_date,end_date,monday,tuesday,wednesday,thursday,friday,saturday,sunday"),
 "calendar_dates":("service_id,date,exception_type","service_id,date,exception_type")
}

def open_ro(path):
    p=Path(path)
    if p.is_symlink() or not p.is_file():raise ValueError("unsafe_or_missing_snapshot")
    return sqlite3.connect(p.resolve().as_uri()+"?mode=ro&immutable=1",uri=True,timeout=15)

def identical_rows(a,b):
    counts={}
    missing=object()
    for table,(cols,order) in TABLES.items():
        query="SELECT "+cols+" FROM "+table+" ORDER BY "+order
        rows_a=a.execute(query)
        rows_b=b.execute(query)
        count=0
        for first,second in itertools.zip_longest(rows_a,rows_b,fillvalue=missing):
            count+=1
            if first is missing or second is missing or first!=second:
                raise AssertionError("row_mismatch:"+table+":row_"+str(count))
        counts[table]=count
    return counts

def queries_for(a):
    trip=[x[0] for x in a.execute("SELECT trip_id FROM trips ORDER BY trip_id LIMIT 10 OFFSET 10")]
    stop=[x[0] for x in a.execute("SELECT DISTINCT stop_id FROM stop_times ORDER BY stop_id LIMIT 8 OFFSET 2")]
    coord=a.execute("SELECT stop_lat,stop_lon FROM stops ORDER BY stop_id LIMIT 1").fetchone()
    if len(trip)<5 or len(stop)<4 or not coord:raise AssertionError("insufficient_real_route_samples")
    pt=",".join("?" for _ in trip)
    ps=",".join("?" for _ in stop)
    lat,lon=coord
    return {
      "trip_stop_times":("SELECT trip_id,stop_id,stop_sequence,arrival_time,departure_time "
          "FROM stop_times WHERE trip_id IN ("+pt+") ORDER BY trip_id,stop_sequence",trip),
      "stop_route_candidates":("SELECT DISTINCT t.trip_id,t.service_id FROM stop_times st "
          "JOIN trips t ON t.trip_id=st.trip_id WHERE st.stop_id IN ("+ps+") "
          "ORDER BY t.trip_id LIMIT 2000",stop),
      "nearby_stops":("SELECT stop_id,stop_lat,stop_lon FROM stops "
          "WHERE stop_lat BETWEEN ? AND ? AND stop_lon BETWEEN ? AND ? "
          "ORDER BY stop_id",(lat-.015,lat+.015,lon-.02,lon+.02))
    }

def compare_queries(a,b,repeats=5):
    report={}
    for label,(sql,params) in queries_for(a).items():
        baseline=a.execute(sql,params).fetchall()
        if baseline!=b.execute(sql,params).fetchall():
            raise AssertionError("result_mismatch:"+label)
        timings={"original":[],"compact":[]}
        for i in range(repeats+1):
            pair=[("original",a),("compact",b)]
            if i%2:pair.reverse()
            for name,con in pair:
                start=time.perf_counter()
                data=con.execute(sql,params).fetchall()
                elapsed=(time.perf_counter()-start)*1000
                if data!=baseline:raise AssertionError("unstable_result:"+label)
                if i:timings[name].append(elapsed)
        x=statistics.median(timings["original"]);y=statistics.median(timings["compact"])
        report[label]={"rows":len(baseline),"original_median_ms":round(x,2),
          "compact_median_ms":round(y,2),"compact_over_original":round(y/x,2) if x else None}
    return report

def evaluate(original=ORIGINAL,compact=COMPACT,repeats=5):
    if Path(original).resolve()==Path(compact).resolve():raise ValueError("same_source_and_target")
    with contextlib.closing(open_ro(original)) as a,contextlib.closing(open_ro(compact)) as b:
        if a.execute("PRAGMA quick_check").fetchone()!=("ok",):raise AssertionError("original_integrity")
        if b.execute("PRAGMA quick_check").fetchone()!=("ok",):raise AssertionError("compact_integrity")
        identical=identical_rows(a,b)
        benchmarks=compare_queries(a,b,repeats)
    s=Path(original).stat().st_size
    t=Path(compact).stat().st_size
    return {"status":"FULL_ROW_PARITY_PASSED_READ_ONLY",
        "all_rows_identical":identical,
        "saved_percent":round(100*(s-t)/s,1),
        "queries_equal":True,"query_benchmarks":benchmarks,
        "next_gate":"Actual date-specific journeys and live container not yet tested"}

if __name__=="__main__":
    if os.geteuid()==0:raise SystemExit("Run as non-root ubuntu")
    print(json.dumps(evaluate(),indent=2,ensure_ascii=False))
