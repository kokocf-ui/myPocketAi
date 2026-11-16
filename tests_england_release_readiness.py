import importlib.util,json,sqlite3,tempfile,unittest
from datetime import date
from pathlib import Path
P=Path(__file__).resolve().parent/"oracle-transport-bridge/audit-england-release-readiness.py"
spec=importlib.util.spec_from_file_location("enrelease",P)
m=importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
class AuditTests(unittest.TestCase):
 def fixture(self,dir):
  r=dir/"audit";c=dir/"candidate"
  r.mkdir();c.mkdir()
  for region in m.REGIONS:
   db=r/(region+".sqlite3")
   with sqlite3.connect(db) as con:
    con.executescript("""
    CREATE TABLE calendar(service_id TEXT,monday TEXT,tuesday TEXT,wednesday TEXT,thursday TEXT,friday TEXT,saturday TEXT,sunday TEXT,start_date TEXT,end_date TEXT);
    CREATE TABLE calendar_dates(service_id TEXT,date TEXT,exception_type TEXT);
    CREATE TABLE trips(trip_id TEXT);
    INSERT INTO calendar VALUES('wk','1','1','1','1','1','1','1','20260101','20261231');
    INSERT INTO trips VALUES('t');""")
   (r/(region+".provenance.json")).write_text(json.dumps({
    "region":region,"source_url":"https://data.bus-data.dft.gov.uk/timetable/download/gtfs-file/"+region+"/",
    "rights_status":"OGL_UK_attribution_required","sha256":"f"*64}))
   (c/(region+".sqlite3")).write_bytes(b"placeholder")
   (c/(region+".index.json")).write_text("{}")
  return r,c
 def test_nine_region_date_horizons_without_modification(self):
  with tempfile.TemporaryDirectory() as tmp:
   r,c=self.fixture(Path(tmp))
   before={str(p):p.stat().st_mtime_ns for d in (r,c) for p in d.iterdir()}
   res=m.audit(r,c,date(2026,11,16))
   after={str(p):p.stat().st_mtime_ns for d in (r,c) for p in d.iterdir()}
   self.assertEqual(res["regions_checked"],9)
   self.assertEqual(res["with_services_today"],9)
   self.assertEqual(res["with_services_day_30"],9)
   self.assertEqual(before,after)
   self.assertEqual(res["production_switch"],"NOT_PERFORMED")
 def test_expired_calendar_is_clearly_marked(self):
  with tempfile.TemporaryDirectory() as tmp:
   r,c=self.fixture(Path(tmp))
   res=m.audit(r,c,date(2028,11,16))
   self.assertEqual(res["with_services_today"],0)
   self.assertEqual(res["with_services_day_30"],0)
 def test_missing_provenance_fails_not_guesses(self):
  with tempfile.TemporaryDirectory() as tmp:
   r,c=self.fixture(Path(tmp))
   (r/"en-ea.provenance.json").unlink()
   with self.assertRaisesRegex(ValueError,"missing_or_symlink"):
    m.audit(r,c,date(2026,11,16))
if __name__=="__main__":
 unittest.main()
