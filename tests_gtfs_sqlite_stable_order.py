"""GTFS result order must not depend on SQLite layout or Python hash seed."""
import json,os,sqlite3,subprocess,sys,tempfile,unittest
from pathlib import Path
from gtfs_sqlite_store import SCHEMA,query_feed

QUERY={"date":"2026-11-16","radius":150,
       "from":{"latitude":52.1,"longitude":0.1},
       "to":{"latitude":52.12,"longitude":0.12}}
STOPS=[("A","Origin A",52.1,0.1),("B","Origin B",52.1002,0.1002),
       ("C","Destination C",52.12,0.12),("D","Destination D",52.1202,0.1202)]
INDEXES="""CREATE INDEX idx_stops_coords ON stops(stop_lat,stop_lon);
CREATE INDEX idx_stoptimes_stop ON stop_times(stop_id,trip_id);
CREATE INDEX idx_trips_service ON trips(service_id);
CREATE INDEX idx_dates ON calendar_dates(date,service_id);"""

def populate(file,compact,reverse):
    schema=SCHEMA
    if compact:
        before="CREATE TABLE stop_times(trip_id TEXT, stop_id TEXT, stop_sequence INTEGER, arrival_time TEXT, departure_time TEXT);"
        after="CREATE TABLE stop_times(trip_id TEXT NOT NULL,stop_id TEXT,stop_sequence INTEGER NOT NULL,arrival_time TEXT,departure_time TEXT,PRIMARY KEY(trip_id,stop_sequence)) WITHOUT ROWID;"
        assert before in schema
        schema=schema.replace(before,after)
    else:
        schema+="CREATE INDEX idx_stoptimes_trip ON stop_times(trip_id,stop_sequence);"
    trips=[(f"T{i:03}","R","WK",f"Trip {i}") for i in range(32)]
    rows=[]
    for i in range(32):
        a,b=("A","C") if i%2==0 else ("B","D")
        minute=i//8
        rows.extend([(f"T{i:03}",a,1,f"09:{minute:02}:00",f"09:{minute:02}:00"),
                     (f"T{i:03}",b,2,f"09:{20+minute:02}:00",f"09:{20+minute:02}:00")])
    with sqlite3.connect(file) as con:
        con.executescript(schema)
        con.executemany("INSERT INTO stops VALUES (?,?,?,?)",STOPS[::-1] if reverse else STOPS)
        con.execute("INSERT INTO routes VALUES ('R','3','10','Route','Operator')")
        con.executemany("INSERT INTO trips VALUES (?,?,?,?)",trips[::-1] if reverse else trips)
        con.executemany("INSERT INTO stop_times VALUES (?,?,?,?,?)",rows[::-1] if reverse else rows)
        con.execute("INSERT INTO calendar VALUES ('WK','1','1','1','1','1','1','1','20260101','20270101')")
        con.executescript(INDEXES)

class StableSlices(unittest.TestCase):
    def test_same_bytes_for_compact_and_original_under_four_hash_seeds(self):
        with tempfile.TemporaryDirectory() as tmp:
            a=Path(tmp)/"original.sqlite3"
            b=Path(tmp)/"compact.sqlite3"
            populate(a,False,False)
            populate(b,True,True)
            self.assertEqual(query_feed(str(a),QUERY)["status"],"success")
            self.assertEqual(query_feed(str(b),QUERY)["status"],"success")
            timestamps={p:p.stat().st_mtime_ns for p in (a,b)}
            outputs=[]
            code="import json,sys;from gtfs_sqlite_store import query_feed;print(json.dumps(query_feed(sys.argv[1],json.loads(sys.argv[2])),separators=(',',':')))"
            for seed in ("1","2","17","97"):
                for file in (a,b):
                    env=dict(os.environ,PYTHONHASHSEED=seed,PYTHONDONTWRITEBYTECODE="1")
                    r=subprocess.run([sys.executable,"-c",code,str(file),json.dumps(QUERY)],
                                     check=True,capture_output=True,text=True,env=env,timeout=20)
                    outputs.append(r.stdout.strip())
            self.assertEqual(len(set(outputs)),1,
                "Equal GTFS content must produce identical ordered JSON slices")
            for p in (a,b):
                self.assertEqual(p.stat().st_mtime_ns,timestamps[p])
                self.assertFalse(Path(str(p)+"-wal").exists())

if __name__=="__main__":
    unittest.main()
