import hashlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

SCRIPT=Path(__file__).resolve().parent/"oracle-transport-bridge/verify-bods-east-anglia-current.py"
spec=importlib.util.spec_from_file_location("easha",SCRIPT)
mod=importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

class MockResponse(io.BytesIO):
    status=200
    headers={"Content-Type":"application/zip"}
    def geturl(self):return mod.SOURCE
class MockOpener:
    def __init__(self,data):self.data=data
    def open(self,request,timeout):
        assert request.get_method()=="GET"
        assert timeout==30
        return MockResponse(self.data)
def zip_bytes():
    b=io.BytesIO()
    with zipfile.ZipFile(b,"w") as z:
        z.writestr("stops.txt","stop_id,stop_name\nA,One\n")
    return b.getvalue()
def provenance(target,digest,length):
    target.write_text(json.dumps({"region":"en-ea","source_url":mod.SOURCE,
                "sha256":digest,"compressed_bytes":length}))
class Verify(unittest.TestCase):
    def test_exact_sha_no_writes(self):
        content=zip_bytes()
        with tempfile.TemporaryDirectory() as tmp:
            path=Path(tmp)/"old.json"
            provenance(path,hashlib.sha256(content).hexdigest(),len(content))
            mtime=path.stat().st_mtime_ns
            result=mod.examine(path,MockOpener(content))
            self.assertEqual(result["status"],"EXACT_ARCHIVE_SHA_MATCH")
            self.assertTrue(result["sha256_equal"])
            self.assertEqual(path.stat().st_mtime_ns,mtime)
            self.assertEqual(len(list(Path(tmp).iterdir())),1)
    def test_repacked_or_updated_archive_requires_later_semantic_check(self):
        content=zip_bytes()
        with tempfile.TemporaryDirectory() as tmp:
            path=Path(tmp)/"old.json"
            provenance(path,"0"*64,len(content))
            result=mod.examine(path,MockOpener(content))
            self.assertEqual(result["status"],"ARCHIVE_SHA_CHANGED_OR_REPACKAGED")
            self.assertEqual(result["schedule_content_equivalence"],"NOT_CHECKED")
            self.assertEqual(result["other_eight_regions"],"NOT_CHECKED")
    def test_limit_and_html_fail_closed(self):
        with self.assertRaisesRegex(ValueError,"compressed_bytes_limit"):
            mod.stream_sha(MockOpener(zip_bytes()),limit=10)
        with self.assertRaisesRegex(ValueError,"response_not_zip"):
            mod.stream_sha(MockOpener(b"<html>not a zip</html>"))
    def test_untrusted_provenance_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            path=Path(tmp)/"bad.json"
            provenance(path,"0"*64,100)
            obj=json.loads(path.read_text())
            obj["source_url"]="https://other.example/evil"
            path.write_text(json.dumps(obj))
            with self.assertRaisesRegex(ValueError,"unexpected_provenance"):
                mod.verify_provenance(path)

if __name__=="__main__":
    unittest.main()
