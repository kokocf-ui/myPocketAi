import hashlib
import importlib.util
import io
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

SCRIPT=Path(__file__).resolve().parent/"oracle-transport-bridge/verify-bods-regional-sha.py"
spec=importlib.util.spec_from_file_location("bodsregional",SCRIPT)
mod=importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

class Response(io.BytesIO):
    status=200
    headers={"Content-Type":"application/zip"}
    def __init__(self,data,url):super().__init__(data);self._url=url
    def geturl(self):return self._url
class Opener:
    def __init__(self,content):self.content=content
    def open(self,request,timeout):
        assert request.get_method()=="GET"
        assert timeout==40
        return Response(self.content,request.full_url)
def make_zip():
    b=io.BytesIO()
    with zipfile.ZipFile(b,"w") as z:
        z.writestr("stops.txt","stop_id,stop_name\nA,One\n")
    return b.getvalue()
def write_provenance(root,region,content,match=True):
    (root/(region+".provenance.json")).write_text(json.dumps({
        "region":region,"source_url":mod.approved_url(region),
        "sha256":hashlib.sha256(content).hexdigest() if match else "0"*64,
        "compressed_bytes":len(content)}))
class RegionalSha(unittest.TestCase):
    def test_two_regions_match_with_zero_files_created(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);content=make_zip()
            for r in ("en-em","en-ne"):write_provenance(root,r,content)
            old=sorted((str(p),p.stat().st_mtime_ns) for p in root.iterdir())
            res=mod.audit(["en-em","en-ne"],root,Opener(content))
            new=sorted((str(p),p.stat().st_mtime_ns) for p in root.iterdir())
            self.assertEqual(old,new)
            self.assertEqual(res["exact_archive_matches"],2)
            self.assertEqual(res["disk_bytes_written"],0)
            self.assertTrue(res["one_time_only_not_scheduled"])
    def test_streamed_progress_after_each_completed_region(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);content=make_zip()
            for region in ("en-em","en-ne"):write_provenance(root,region,content)
            captured=[]
            result=mod.audit(["en-em","en-ne"],root,Opener(content),
                             on_result=captured.append)
            self.assertEqual([x["region"] for x in captured],["en-em","en-ne"])
            self.assertEqual(result["exact_archive_matches"],2)

    def test_differing_hash_is_never_marked_as_equal_timetables(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);content=make_zip()
            write_provenance(root,"en-sw",content,False)
            r=mod.audit(["en-sw"],root,Opener(content))["results"][0]
            self.assertEqual(r["status"],"ARCHIVE_CHANGED_OR_REPACKAGED")
            self.assertEqual(r["timetable_semantics"],"NOT_CHECKED")
    def test_invalid_region_and_maximum_preflight(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);content=make_zip()
            write_provenance(root,"en-em",content)
            with self.assertRaisesRegex(ValueError,"invalid_or_duplicate"):
                mod.audit(["en-em","en-em"],root,Opener(content))
            with self.assertRaisesRegex(ValueError,"expected_download_exceeds_total_budget"):
                mod.audit(["en-em"],root,Opener(content),max_total=1)
            with self.assertRaisesRegex(ValueError,"compressed_size_limit"):
                mod.sha_stream("en-em",Opener(content),max_bytes=5)
    def test_unapproved_urls_and_host_are_rejected(self):
        with self.assertRaisesRegex(ValueError,"unapproved_region"):
            mod.approved_url("bad")
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);content=make_zip()
            write_provenance(root,"en-em",content)
            file=root/"en-em.provenance.json"
            d=json.loads(file.read_text())
            d["source_url"]="https://evil.invalid/"
            file.write_text(json.dumps(d))
            with self.assertRaisesRegex(ValueError,"invalid_provenance"):
                mod.read_original("en-em",root)
if __name__=="__main__":
    unittest.main()
