#!/usr/bin/env python3
"""Read-only sample of ACTUAL dated East Anglia GTFS paths against original and compact copies.

Only validates the GTFS date-filtered SQLite slice, not the Node planner,
Cloudflare VPC transport or end-user routing. No production changes.
"""
import contextlib
from datetime import datetime,timedelta,date
import hashlib
import json
from pathlib import Path
import sqlite3
import sys
import time
from zoneinfo import ZoneInfo

ROOT=Path(__file__).resolve().parent.parent
sys.path.insert(0,str(ROOT))
from gtfs_sqlite_store import active_services,query_feed,distance

ORIGINAL=Path("/home/ubuntu/pocketai-england-audit/en-ea.sqlite3")
COMPACT=Path("/home/ubuntu/pocketai-england-compact-pilot/en-ea.sqlite3")

def connect_ro(path):
    p=Path(path)
    if not p.is_file() or p.is_symlink():raise RuntimeError("snapshot_missing_or_symlink")
    return sqlite3.connect(p.resolve().as_uri()+"?mode=ro&immutable=1",uri=True)

def normalize(feed):
    if feed is None:return None
    return {name:sorted(json.dumps(row,sort_keys=True,separators=(',',':'))
                 for row in rows) for name,rows in feed.items()}

def compare_results(a,b):
    if a.get("status")!=b.get("status"):raise AssertionError("route_status_mismatch")
    if normalize(a.get("feed"))!=normalize(b.get("feed")):
        raise AssertionError("dated_gtfs_query_content_mismatch")
    return hashlib.sha256(json.dumps(normalize(a.get("feed")),sort_keys=True).encode()).hexdigest()[:16]

def find_sample(con,active,max_scanned=50000):
    scanned=0
    for tid,service in con.execute("SELECT trip_id,service_id FROM trips ORDER BY trip_id"):
        scanned+=1
        if scanned>max_scanned:break
        if service not in active:continue
        rows=con.execute("SELECT stop_id,stop_sequence FROM stop_times WHERE trip_id=? "
                         "ORDER BY stop_sequence LIMIT 12",(tid,)).fetchall()
        if len(rows)<2:continue
        first=rows[0][0]
        for stop,_ in reversed(rows[1:]):
            if first==stop:continue
            coords=con.execute("SELECT stop_id,stop_lat,stop_lon FROM stops "
                "WHERE stop_id IN (?,?)",(first,stop)).fetchall()
            byid={sid:(lat,lon) for sid,lat,lon in coords}
            if first not in byid or stop not in byid:continue
            meters=distance(byid[first],byid[stop])
            if not 300<=meters<=80000:continue
            return {"trip":tid,"from_stop":first,"to_stop":stop,
                    "from":{"latitude":byid[first][0],"longitude":byid[first][1]},
                    "to":{"latitude":byid[stop][0],"longitude":byid[stop][1]},
                    "distance_m":round(meters)}
    return None

def probe(original=ORIGINAL,compact=COMPACT,start=None,horizon=7):
    if original.resolve()==compact.resolve():raise RuntimeError("same_source_and_pilot")
    today=start or datetime.now(ZoneInfo("Europe/London")).date()
    attempts=0
    with contextlib.closing(connect_ro(original)) as con:
        for n in range(horizon):
            day=(today+timedelta(days=n)).isoformat()
            services=active_services(con,day)
            if not services:continue
            candidate=find_sample(con,services)
            if candidate is None:continue
            query={"date":day,"from":candidate["from"],"to":candidate["to"],"radius":150}
            try:
                start_time=time.perf_counter()
                original_result=query_feed(str(original),query)
                original_ms=(time.perf_counter()-start_time)*1000
                start_time=time.perf_counter()
                compact_result=query_feed(str(compact),query)
                compact_ms=(time.perf_counter()-start_time)*1000
            except ValueError as exc:
                # Very dense stops may exceed bounded query limits.
                return {"status":"sample_query_rejected","date":day,"reason":str(exc)[:100],
                        "note":"No live route claim; choose a less dense sample."}
            digest=compare_results(original_result,compact_result)
            attempts+=1
            return {
              "status":"DATED_QUERY_EQUAL_READ_ONLY",
              "date":day,"sample_trip":candidate["trip"],
              "from_stop":candidate["from_stop"],"to_stop":candidate["to_stop"],
              "as_crow_flies_m":candidate["distance_m"],
              "gtfs_status":original_result["status"],
              "identical_result_digest":digest,
              "original_ms":round(original_ms,1),
              "compact_ms":round(compact_ms,1),
              "sample_has_verified_route_data":original_result["status"]=="success",
              "note":"This compares real dated GTFS slices, not HTTP/Node full journeys."
            }
    return {"status":"NO_MATCHING_CURRENT_DATED_SAMPLE","checked_from":today.isoformat(),
            "days":horizon,"note":"Cannot claim current timetables. No synthetic departures created."}

if __name__=="__main__":
    print(json.dumps(probe(),indent=2,ensure_ascii=False))
