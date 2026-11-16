#!/usr/bin/env python3
"""Stage official DfT BODS regional bus GTFS ZIPs. No production activation.

No server restart, no container changes, no user coordinates or tokens. No
overwrites of existing SQLite snapshots; verify rights before publishing data.
"""
import argparse
import hashlib
import json
import os
import subprocess
import sys
import tempfile
import urllib.parse
import urllib.request
import zipfile
from pathlib import Path

REGIONS = "ea em ne nw se sw wm yorkshire london".split()
SOURCES = {
    "en-"+suffix: (
       "DfT BODS England "+suffix,
       "https://data.bus-data.dft.gov.uk/timetable/download/gtfs-file/"+suffix+"/",
       "https://www.gov.uk/guidance/find-and-use-bus-open-data"
    ) for suffix in REGIONS
}
MAX_COMPRESSED = 350_000_000
MAX_UNCOMPRESSED = 1_500_000_000
NEEDED = {"stops.txt", "routes.txt", "trips.txt", "stop_times.txt"}

class SameHostHttps(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, msg, headers, newurl):
        prev=urllib.parse.urlsplit(request.full_url)
        nxt=urllib.parse.urlsplit(newurl)
        if nxt.scheme!="https" or nxt.hostname!=prev.hostname:
            raise RuntimeError("redirect_not_preapproved")
        return super().redirect_request(request,fp,code,msg,headers,newurl)

def retrieve(url, target):
    p=urllib.parse.urlsplit(url)
    if p.scheme!="https" or p.username or p.password or not p.hostname:
        raise RuntimeError("source_must_be_https")
    opener=urllib.request.build_opener(SameHostHttps())
    digest=hashlib.sha256()
    total=0
    req=urllib.request.Request(url,headers={"User-Agent":"PocketAI-GTFS-readonly-staging/1.0"})
    with opener.open(req,timeout=35) as res, target.open("xb") as out:
        if urllib.parse.urlsplit(res.url).hostname!=p.hostname:
            raise RuntimeError("unexpected_download_host")
        if "html" in res.headers.get("Content-Type","").lower():
            raise RuntimeError("not_a_gtfs_zip")
        while True:
            block=res.read(128*1024)
            if not block:break
            total+=len(block)
            if total>MAX_COMPRESSED:raise RuntimeError("GTFS_compressed_size_limit")
            digest.update(block);out.write(block)
    with zipfile.ZipFile(target) as z:
        names={n.filename.rsplit("/",1)[-1] for n in z.infolist() if not n.is_dir()}
        if not NEEDED.issubset(names) or not {"calendar.txt","calendar_dates.txt"}&names:
            raise RuntimeError("not_a_complete_GTFS_schedule")
        if any(x.file_size>MAX_UNCOMPRESSED for x in z.infolist()):
            raise RuntimeError("GTFS_member_too_large")
        if sum(x.file_size for x in z.infolist())>MAX_UNCOMPRESSED:
            raise RuntimeError("GTFS_uncompressed_size_limit")
        if z.testzip() is not None:raise RuntimeError("bad_GTFS_zip_checksum")
    return total,digest.hexdigest()

def stage_one(region,stage,importer):
    name,url,reference=SOURCES[region]
    db=stage/(region+".sqlite3")
    idx=stage/(region+".index.json")
    if db.exists() or idx.exists():
        return {"region":region,"status":"skipped_existing_no_overwrite"}
    with tempfile.TemporaryDirectory(prefix=".pocketai-en-gtfs-",dir=stage) as temp:
        archive=Path(temp)/"feed.zip"
        build_db=Path(temp)/(region+".sqlite3")
        build_idx=Path(temp)/(region+".index.json")
        compressed,digest=retrieve(url,archive)
        subprocess.run([sys.executable,str(importer),"import",str(archive),str(build_db),region,"GB"],check=True,timeout=240,stdout=subprocess.DEVNULL)
        subprocess.run([sys.executable,str(importer),"index",str(build_db),region,"RO"],check=True,timeout=180,stdout=subprocess.DEVNULL)
        # Both database and index are verified before moving to staging.
        if db.exists() or idx.exists():raise RuntimeError("concurrent_existing_snapshot")
        os.replace(build_db,db)
        try:os.replace(build_idx,idx)
        except BaseException:
            db.unlink(missing_ok=True)
            raise
    record={"region":region,"name":name,"source_url":url,"catalogue":reference,
      "sha256":digest,"compressed_bytes":compressed,"status":"staged_not_activated",
      "rights_status":"OGL_UK_attribution_required"}
    (stage/(region+".provenance.json")).write_text(json.dumps(record,ensure_ascii=False,indent=2)+"\n")
    return record

def main():
    parser=argparse.ArgumentParser(description="England BODS regional GTFS source audit and isolated staging (never deploys)")
    parser.add_argument("--list",action="store_true")
    parser.add_argument("--stage",action="store_true",help="Download candidate public operator feeds to isolated audit directory only")
    parser.add_argument("--regions",default=",".join(SOURCES),help="Comma-separated source region IDs")
    parser.add_argument("--dir",default="/home/ubuntu/pocketai-england-audit",help="Isolated staging directory, not Docker mounted")
    args=parser.parse_args()
    if not args.stage:
        for suffix in REGIONS:
            region="en-"+suffix
            print(region,"candidate_source_found" if region in SOURCES else "no_prevalidated_source")
        print("England regional BODS datasets:",len(REGIONS),"verified HTTP ZIP endpoints:",len(SOURCES))
        print("Regional bus timetable source availability is not proof of imported journeys or rail coverage.")
        return 0
    stage=Path(args.dir)
    expected=Path("/home/ubuntu/pocketai-gtfs-audit")
    if stage.resolve()!=expected.resolve():
        raise RuntimeError("refusing_to_write_outside_designated_nonproduction_audit_directory")
    if not stage.is_dir() or stage.is_symlink():
        raise RuntimeError("audit_directory_missing_or_symlink")
    importer=Path(__file__).resolve().parent.parent/"gtfs_sqlite_store.py"
    if not importer.is_file():raise RuntimeError("sqlite_importer_missing")
    regions=args.regions.split(",")
    if len(regions)!=len(set(regions)) or any(x not in SOURCES for x in regions):
        raise RuntimeError("unsupported_or_duplicate_source")
    result=[]
    for region in regions:
        try:result.append(stage_one(region,stage,importer))
        except Exception as e:
            result.append({"region":region,"status":"stage_failed","error_code":type(e).__name__})
    print(json.dumps(result,ensure_ascii=False,indent=2))
    return 1 if any(x["status"]=="stage_failed" for x in result) else 0

if __name__=="__main__":sys.exit(main())
