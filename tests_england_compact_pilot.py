"""Synthetic lossless test for the separate England compact-storage pilot."""
import importlib.util
import os
import sqlite3
import tempfile
import unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parent
SOURCE=ROOT/"oracle-transport-bridge/pilot-compact-east-anglia.py"
spec=importlib.util.spec_from_file_location("compact_ea",SOURCE)
module=importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class PilotTest(unittest.TestCase):
    def make_original(self, db):
        # Original schema keeps the separate trip+sequence index.
        raw=module.COMPACT_SCHEMA.replace(
          "trip_id TEXT NOT NULL, stop_id TEXT, stop_sequence INTEGER NOT NULL, arrival_time TEXT, departure_time TEXT,\n PRIMARY KEY(trip_id,stop_sequence)) WITHOUT ROWID",
          "trip_id TEXT, stop_id TEXT, stop_sequence INTEGER, arrival_time TEXT, departure_time TEXT)")
        with sqlite3.connect(db) as con:
            con.executescript(raw)
            con.execute("INSERT INTO stops VALUES ('a','Origin',52.1,0.1)")
            con.execute("INSERT INTO stops VALUES ('b','Destination',52.2,0.2)")
            con.execute("INSERT INTO routes VALUES ('r','3','10','Test','operator')")
            con.execute("INSERT INTO trips VALUES ('t','r','WK','Destination')")
            con.executemany("INSERT INTO stop_times VALUES (?,?,?,?,?)",[
                ('t','a',1,'09:00:00','09:00:00'),
                ('t','b',2,'09:10:00','09:10:00')])
            con.execute("INSERT INTO calendar VALUES ('WK','1','1','1','1','1','1','1','20260101','20270101')")
            con.executescript(module.INDEXES+"CREATE INDEX idx_stoptimes_trip ON stop_times(trip_id,stop_sequence);")

    def test_nondestructive_copy_and_reuse_prevented(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder)
            src=root/"original.sqlite3"
            self.make_original(src)
            size=src.stat().st_size
            dst=root/"safe-pilot"
            result=module.pilot(src,dst,min_free=0)
            self.assertEqual(result["status"],"PILOT_ONLY_NOT_LIVE")
            self.assertEqual(result["all_rows_preserved"]["stop_times"],2)
            self.assertEqual(result["sample_trips_matched"],1)
            self.assertEqual(src.stat().st_size,size)
            with sqlite3.connect(dst/"en-ea.sqlite3") as db:
                self.assertEqual(db.execute("PRAGMA quick_check").fetchone(),("ok",))
                self.assertEqual(db.execute("SELECT COUNT(*) FROM stop_times").fetchone()[0],2)
                self.assertEqual(db.execute("SELECT sql FROM sqlite_master WHERE name='stop_times'").fetchone()[0].upper().count("WITHOUT ROWID"),1)
                self.assertFalse(db.execute("SELECT name FROM sqlite_master WHERE name='idx_stoptimes_trip'").fetchone())
            with sqlite3.connect(src) as db:
                self.assertTrue(db.execute("SELECT name FROM sqlite_master WHERE name='idx_stoptimes_trip'").fetchone())
            with self.assertRaisesRegex(RuntimeError,"no_overwrite"):
                module.pilot(src,dst,min_free=0)

    def test_duplicate_sequences_fail_without_writing_destination(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder)
            src=root/"original.sqlite3"
            self.make_original(src)
            with sqlite3.connect(src) as db:
                db.execute("INSERT INTO stop_times VALUES ('t','a',1,'09:00:00','09:00:00')")
            dst=root/"safe-pilot"
            with self.assertRaises(sqlite3.IntegrityError):
                module.pilot(src,dst,min_free=0)
            self.assertFalse((dst/"en-ea.sqlite3").exists())
            self.assertFalse((dst/".en-ea.sqlite3.building").exists())


    def test_second_region_isolated_and_original_unchanged(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder)
            source=root/"original.sqlite3"
            self.make_original(source)
            size=source.stat().st_size
            dest=root/"safe-pilot"
            result=module.pilot(source,dest,min_free=0,region="en-em")
            self.assertEqual(result["region"],"en-em")
            self.assertEqual(result["all_rows_preserved"]["stop_times"],2)
            self.assertEqual(source.stat().st_size,size)
            self.assertTrue((dest/"en-em.sqlite3").is_file())
            self.assertFalse((dest/"en-ea.sqlite3").exists())
            with self.assertRaisesRegex(RuntimeError,"no_overwrite"):
                module.pilot(source,dest,min_free=0,region="en-em")
            with self.assertRaisesRegex(RuntimeError,"invalid_or_unapproved_region"):
                module.pilot(source,dest,min_free=0,region="fake")

if __name__=="__main__":
    unittest.main()
