import importlib.util
from datetime import date
from pathlib import Path
import sqlite3
import tempfile
import unittest

SRC=Path(__file__).resolve().parent/"oracle-transport-bridge/probe-east-anglia-dated.py"
spec=importlib.util.spec_from_file_location("date_parity",SRC)
mod=importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

SCHEMA="""
CREATE TABLE stops(stop_id TEXT PRIMARY KEY,stop_name TEXT,stop_lat REAL,stop_lon REAL);
CREATE TABLE routes(route_id TEXT PRIMARY KEY,route_type TEXT,route_short_name TEXT,route_long_name TEXT,agency_id TEXT);
CREATE TABLE trips(trip_id TEXT PRIMARY KEY,route_id TEXT,service_id TEXT,trip_headsign TEXT);
CREATE TABLE stop_times(trip_id TEXT,stop_id TEXT,stop_sequence INTEGER,arrival_time TEXT,departure_time TEXT);
CREATE TABLE calendar(service_id TEXT,monday TEXT,tuesday TEXT,wednesday TEXT,thursday TEXT,friday TEXT,saturday TEXT,sunday TEXT,start_date TEXT,end_date TEXT);
CREATE TABLE calendar_dates(service_id TEXT,date TEXT,exception_type TEXT);
CREATE INDEX idx_stops_coords ON stops(stop_lat,stop_lon);
CREATE INDEX idx_stoptimes_stop ON stop_times(stop_id,trip_id);
CREATE INDEX idx_stoptimes_trip ON stop_times(trip_id,stop_sequence);
CREATE INDEX idx_trips_service ON trips(service_id);
CREATE INDEX idx_dates ON calendar_dates(date,service_id);
"""
def build(path):
 with sqlite3.connect(path) as db:
  db.executescript(SCHEMA)
  db.executemany("INSERT INTO stops VALUES (?,?,?,?)",[
      ("a","A",52.1,0.1),("b","B",52.115,0.11)])
  db.execute("INSERT INTO routes VALUES ('R','3','10','A - B','Operator')")
  db.execute("INSERT INTO trips VALUES ('T','R','WK','B')")
  db.executemany("INSERT INTO stop_times VALUES (?,?,?,?,?)",[
      ("T","a",1,"09:00:00","09:00:00"),
      ("T","b",2,"09:20:00","09:20:00")])
  db.execute("INSERT INTO calendar VALUES ('WK','1','1','1','1','1','1','1','20260101','20270101')")

class DateProbe(unittest.TestCase):
 def test_real_date_same_data(self):
  with tempfile.TemporaryDirectory() as tmp:
   first=Path(tmp)/"one.sqlite3";second=Path(tmp)/"two.sqlite3"
   build(first);build(second)
   out=mod.probe(first,second,start=date(2026,11,16),horizon=1)
   self.assertEqual(out["status"],"DATED_QUERY_EQUAL_READ_ONLY")
   self.assertTrue(out["sample_has_verified_route_data"])
   self.assertEqual(out["gtfs_status"],"success")
 def test_fails_on_changed_time(self):
  with tempfile.TemporaryDirectory() as tmp:
   first=Path(tmp)/"one.sqlite3";second=Path(tmp)/"two.sqlite3"
   build(first);build(second)
   with sqlite3.connect(second) as db:
    db.execute("UPDATE stop_times SET departure_time='09:30:00' WHERE stop_id='a'")
   with self.assertRaisesRegex(AssertionError,"dated_gtfs_query_content_mismatch"):
    mod.probe(first,second,start=date(2026,11,16),horizon=1)
 def test_no_current_service_is_not_a_success(self):
  with tempfile.TemporaryDirectory() as tmp:
   first=Path(tmp)/"one.sqlite3";second=Path(tmp)/"two.sqlite3"
   build(first);build(second)
   out=mod.probe(first,second,start=date(2028,1,1),horizon=2)
   self.assertEqual(out["status"],"NO_MATCHING_CURRENT_DATED_SAMPLE")

if __name__=="__main__":
 unittest.main()
