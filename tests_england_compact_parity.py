"""Offline full-content and query-equivalence regression for East Anglia."""
import importlib.util
import sqlite3
import tempfile
import unittest
from pathlib import Path
root=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location("verify_compact",
    root/"oracle-transport-bridge/verify-east-anglia-compact.py")
mod=importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

class ParityTests(unittest.TestCase):
    def make_db(self,path):
        with sqlite3.connect(path) as db:
            db.executescript("""
            CREATE TABLE stops(stop_id TEXT PRIMARY KEY,stop_name TEXT,stop_lat REAL,stop_lon REAL);
            CREATE TABLE routes(route_id TEXT PRIMARY KEY,route_type TEXT,route_short_name TEXT,route_long_name TEXT,agency_id TEXT);
            CREATE TABLE trips(trip_id TEXT PRIMARY KEY,route_id TEXT,service_id TEXT,trip_headsign TEXT);
            CREATE TABLE stop_times(trip_id TEXT,stop_id TEXT,stop_sequence INTEGER,arrival_time TEXT,departure_time TEXT);
            CREATE TABLE calendar(service_id TEXT,monday TEXT,tuesday TEXT,wednesday TEXT,thursday TEXT,friday TEXT,saturday TEXT,sunday TEXT,start_date TEXT,end_date TEXT);
            CREATE TABLE calendar_dates(service_id TEXT,date TEXT,exception_type TEXT);
            CREATE INDEX idx_stoptimes_trip ON stop_times(trip_id,stop_sequence);
            CREATE INDEX idx_stoptimes_stop ON stop_times(stop_id,trip_id);
            """)
            db.executemany("INSERT INTO stops VALUES (?,?,?,?)",[
                ("s"+str(i),"Station "+str(i),52+i/10000,0.1+i/10000) for i in range(40)])
            db.execute("INSERT INTO routes VALUES ('r','3','10','Test','operator')")
            db.executemany("INSERT INTO trips VALUES (?,?,?,?)",[
                ("t"+str(i),"r","W","Head") for i in range(40)])
            db.executemany("INSERT INTO stop_times VALUES (?,?,?,?,?)",[
                ("t"+str(i),"s"+str((i+j)%40),j,"09:00:00","09:01:00")
                for i in range(40) for j in range(4)])
            db.execute("INSERT INTO calendar VALUES ('W','1','1','1','1','1','1','1','20260101','20271231')")
    def test_parity_and_tamper_detection(self):
        with tempfile.TemporaryDirectory() as d:
            a=Path(d)/"old.sqlite3";b=Path(d)/"pilot.sqlite3"
            self.make_db(a);self.make_db(b)
            report=mod.evaluate(a,b,repeats=2)
            self.assertEqual(report["status"],"FULL_ROW_PARITY_PASSED_READ_ONLY")
            self.assertEqual(report["all_rows_identical"]["stop_times"],160)
            self.assertTrue(report["queries_equal"])
            with sqlite3.connect(b) as db:
                db.execute("UPDATE stop_times SET arrival_time='09:09:00' WHERE trip_id='t2'")
            with self.assertRaisesRegex(AssertionError,"row_mismatch:stop_times"):
                mod.evaluate(a,b,repeats=1)

if __name__=="__main__":
    unittest.main()
