"""Read-only preflight: index metadata and hardlink eligibility."""
import importlib.util
import json
import os
from pathlib import Path
import tempfile
import unittest

SCRIPT=Path(__file__).resolve().parent/"oracle-transport-bridge/preflight-england-compact-activation.py"
spec=importlib.util.spec_from_file_location("england_preflight",SCRIPT)
m=importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

class PreflightTest(unittest.TestCase):
 def fixture(self,root):
    audit=root/"audit";compact=root/"compact";live=root/"live"
    for d in (audit,compact,live):d.mkdir()
    for i,region in enumerate(m.REGIONS):
       for target in (audit,compact):
          snap=target/(region+".sqlite3")
          snap.write_bytes(b"sample\x00"+bytes([i]))
          info={"schema":2,"backend":"sqlite","country":"GB","region":region,
              "timeZone":"Europe/London","snapshotBytes":snap.stat().st_size,
              "snapshotMtimeMs":snap.stat().st_mtime_ns//1000000,
              "positions":[[52,0]]}
          (target/(region+".index.json")).write_text(json.dumps(info))
    return audit,compact,live
 def test_readonly_and_all_regions(self):
    with tempfile.TemporaryDirectory() as tmp:
       audit,compact,live=self.fixture(Path(tmp))
       before=sorted((f,str(f.stat().st_size),str(f.stat().st_mtime_ns))
                     for d in (audit,compact) for f in d.iterdir())
       result=m.preflight(audit,compact,live,with_docker=False)
       after=sorted((f,str(f.stat().st_size),str(f.stat().st_mtime_ns))
                    for d in (audit,compact) for f in d.iterdir())
       self.assertEqual(before,after)
       self.assertEqual(result["regions_with_original_and_compact_indexes"],9)
       self.assertTrue(result["same_device_hardlink_ready"])
       self.assertEqual(list(live.iterdir()),[])
 def test_wrong_index_fails_closed(self):
    with tempfile.TemporaryDirectory() as tmp:
       audit,compact,live=self.fixture(Path(tmp))
       index=compact/"en-se.index.json"
       doc=json.loads(index.read_text())
       doc["snapshotBytes"]+=1
       index.write_text(json.dumps(doc))
       with self.assertRaisesRegex(ValueError,"index_snapshot_metadata_mismatch"):
          m.preflight(audit,compact,live,with_docker=False)

if __name__=="__main__":
 unittest.main()
