#!/usr/bin/env python3
"""Non-destructive, East Anglia-only GTFS SQLite storage pilot.

The trial replaces the duplicated trip+sequence B-tree with a clustered
WITHOUT ROWID stop_times table. It keeps all time/stop fields and the
stop-based lookup index. Nothing in a live service is mounted or modified.
"""
import json
import os
import shutil
import sqlite3
import sys
from pathlib import Path

SOURCE = Path("/home/ubuntu/pocketai-england-audit/en-ea.sqlite3")
DEST_DIR = Path("/home/ubuntu/pocketai-england-compact-pilot")
RESERVE_BYTES = 2 * 1024**3
REGION = "en-ea"
TABLES = ("stops", "routes", "trips", "stop_times", "calendar", "calendar_dates")
COMPACT_SCHEMA = """
CREATE TABLE stops(stop_id TEXT PRIMARY KEY, stop_name TEXT NOT NULL, stop_lat REAL NOT NULL, stop_lon REAL NOT NULL);
CREATE TABLE routes(route_id TEXT PRIMARY KEY, route_type TEXT, route_short_name TEXT, route_long_name TEXT, agency_id TEXT);
CREATE TABLE trips(trip_id TEXT PRIMARY KEY, route_id TEXT, service_id TEXT, trip_headsign TEXT);
CREATE TABLE stop_times(trip_id TEXT NOT NULL, stop_id TEXT, stop_sequence INTEGER NOT NULL, arrival_time TEXT, departure_time TEXT,
 PRIMARY KEY(trip_id,stop_sequence)) WITHOUT ROWID;
CREATE TABLE calendar(service_id TEXT, monday TEXT, tuesday TEXT, wednesday TEXT, thursday TEXT, friday TEXT, saturday TEXT, sunday TEXT, start_date TEXT, end_date TEXT);
CREATE TABLE calendar_dates(service_id TEXT, date TEXT, exception_type TEXT);
"""
INDEXES = """
CREATE INDEX idx_stops_coords ON stops(stop_lat,stop_lon);
CREATE INDEX idx_stoptimes_stop ON stop_times(stop_id,trip_id);
CREATE INDEX idx_trips_service ON trips(service_id);
CREATE INDEX idx_dates ON calendar_dates(date,service_id);
"""

def count(db, table, schema="main"):
    return db.execute("SELECT COUNT(*) FROM " + schema + "." + table).fetchone()[0]

def sample_trips(db, schema="main"):
    # Three deterministic trip identifiers, used to detect content changes.
    return [row[0] for row in db.execute(
        "SELECT trip_id FROM "+schema+".trips ORDER BY trip_id LIMIT 3")]

def trip_rows(db, ids, schema="main"):
    return {trip: db.execute(
        "SELECT trip_id,stop_id,stop_sequence,arrival_time,departure_time "
        "FROM "+schema+".stop_times WHERE trip_id=? ORDER BY stop_sequence",
        (trip,)).fetchall() for trip in ids}

def pilot(source, dest_dir, min_free=RESERVE_BYTES):
    source, dest_dir = Path(source), Path(dest_dir)
    if source.is_symlink() or not source.is_file():
        raise RuntimeError("missing_or_symlink_source")
    if dest_dir.is_symlink():
        raise RuntimeError("symlink_destination")
    dest_dir.mkdir(mode=0o700, parents=False, exist_ok=True)
    if not dest_dir.is_dir() or not os.access(dest_dir, os.W_OK):
        raise RuntimeError("unwritable_destination")
    destination=dest_dir/(REGION+".sqlite3")
    building=dest_dir/("."+REGION+".sqlite3.building")
    for p in (destination,building,dest_dir/(REGION+".index.json")):
        if p.exists() or p.is_symlink():
            raise RuntimeError("output_already_exists_no_overwrite")
    if shutil.disk_usage(dest_dir).free < min_free:
        raise RuntimeError("insufficient_free_disk_for_safe_pilot")
    os.close(os.open(building,os.O_CREAT|os.O_EXCL|os.O_WRONLY,0o600))
    con=None
    try:
        con=sqlite3.connect(str(building),timeout=5)
        # Source is always attached immutable/read-only, never migrated in place.
        con.execute("ATTACH DATABASE ? AS src",
                    (source.as_uri()+"?mode=ro&immutable=1",))
        con.execute("PRAGMA journal_mode=OFF")  # New, discardable pilot only.
        con.execute("PRAGMA synchronous=OFF")
        con.executescript(COMPACT_SCHEMA)
        before={table:count(con,table,"src") for table in TABLES}
        if min(before["stops"],before["routes"],before["trips"],before["stop_times"])==0:
            raise RuntimeError("source_missing_required_gtfs_tables")
        sample_ids=sample_trips(con,"src")
        originals=trip_rows(con,sample_ids,"src")
        for table in TABLES:
            con.execute("INSERT INTO "+table+" SELECT * FROM src."+table)
            con.commit()
        con.executescript(INDEXES)
        con.commit()
        after={table:count(con,table) for table in TABLES}
        if before!=after or originals!=trip_rows(con,sample_ids):
            raise RuntimeError("content_mismatch")
        check=con.execute("PRAGMA quick_check").fetchone()
        if check!=("ok",):
            raise RuntimeError("pilot_integrity_failure")
        con.execute("DETACH DATABASE src")
        con.close()
        con=None
        os.chmod(building,0o600)
        # Only publish fully verified pilot file; never overwrites an original.
        os.replace(building,destination)
        old_bytes=source.stat().st_size
        new_bytes=destination.stat().st_size
        return {"region":REGION,"status":"PILOT_ONLY_NOT_LIVE",
                "source_bytes":old_bytes,"pilot_bytes":new_bytes,
                "saved_percent":round(100*(old_bytes-new_bytes)/old_bytes,1),
                "all_rows_preserved":before,"sample_trips_matched":len(sample_ids),
                "pilot_path":str(destination)}
    except BaseException:
        if con is not None:
            con.close()
        building.unlink(missing_ok=True)
        raise

def main():
    if len(sys.argv)!=1:
        raise SystemExit("No arguments; fixed isolated Oracle paths only")
    if os.environ.get("USER") not in (None,"ubuntu") or os.geteuid()==0:
        raise SystemExit("Run only as the unprivileged ubuntu account")
    report=pilot(SOURCE,DEST_DIR)
    print(json.dumps(report,indent=2))

if __name__=="__main__":
    main()
