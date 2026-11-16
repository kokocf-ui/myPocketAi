import importlib.util
from datetime import datetime,timezone
from pathlib import Path
import unittest
HERE=Path(__file__).resolve().parent
P=HERE/"oracle-transport-bridge/audit-england-bods-metadata.py"
spec=importlib.util.spec_from_file_location("bodshead",P)
mod=importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

class HeadCheck(unittest.TestCase):
 def test_exact_url_whitelist(self):
    self.assertEqual(len(mod.ENDPOINTS),9)
    self.assertEqual(mod.official_url("en-london"),
       "https://data.bus-data.dft.gov.uk/timetable/download/gtfs-file/london/")
    with self.assertRaisesRegex(ValueError,"unapproved_region"):
       mod.official_url("https://evil.invalid/")
 def test_header_age_is_not_certified_feed_freshness(self):
    now=datetime(2026,11,16,17,0,tzinfo=timezone.utc)
    self.assertEqual(mod.parse_date("Mon, 16 Nov 2026 16:00:00 GMT",now)["days_old"],0.0)
    self.assertIsNone(mod.parse_date("garbled",now)["days_old"])
    self.assertFalse(mod.parse_date(None,now)["header_present"])
 def test_metadata_read_only_no_body(self):
    class FakeResponse:
       status=200
       headers={"Last-Modified":"Mon, 16 Nov 2026 16:00:00 GMT",
          "ETag":'"not-guaranteed-zip-content"',"Content-Length":"250000"}
       def geturl(self):return mod.official_url("en-ea")
       def __enter__(self):return self
       def __exit__(self,*args):return None
    class Opener:
       def open(self,req,timeout):
          self.method=req.get_method()
          self.timeout=timeout
          return FakeResponse()
    op=Opener()
    r=mod.check_head("en-ea",datetime(2026,11,16,17,tzinfo=timezone.utc),op)
    self.assertEqual(op.method,"HEAD")
    self.assertEqual(r["head_status"],200)
    self.assertEqual(r["advertised_zip_bytes"],250000)
    self.assertFalse(r["content_freshness_verified"])
 def test_summary_never_claims_production(self):
    x={"status":"READ_ONLY_ENG_RELEASE_AUDIT_NO_DEPLOYMENT",
       "checked_date":"2026-11-16","regions_checked":9,
       "with_services_today":9,"with_services_day_7":9,"with_services_day_30":9}
    out=mod.concise_report(x,[{"region":"en-london","head_status":200}])
    self.assertEqual(out["publisher_zip_hash_current"],"NOT_VERIFIED")
    self.assertEqual(out["live_England_service"],"UNCHANGED")
    self.assertTrue(out["HEAD_does_not_prove_same_ZIP_sha256"])

if __name__=="__main__":
 unittest.main()
