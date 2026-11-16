#!/usr/bin/env python3
"""One-time bounded BODS regional ZIP SHA audit, download stream only.

Does NOT store archives, modify SQLite, refresh files, activate services or
schedule future downloads. Explicit --regions required, no implicit all.
A differing ZIP SHA may only reflect repackaging, not timetable changes.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

PROVENANCE=Path("/home/ubuntu/pocketai-england-audit")
REGION_PATHS={
 "en-ea":"east_anglia","en-em":"east_midlands","en-ne":"north_east",
 "en-nw":"north_west","en-se":"south_east","en-sw":"south_west",
 "en-wm":"west_midlands","en-yorkshire":"yorkshire","en-london":"london"}
HOST="data.bus-data.dft.gov.uk"
MAX_SINGLE=350_000_000
MAX_CUMULATIVE=2_000_000_000
USER_AGENT="PocketAI-BODS-regional-sha-audit/1.0"

class SameOfficialHost(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,req,fp,code,msg,headers,newurl):
        p=urllib.parse.urlsplit(newurl)
        if p.scheme!="https" or p.hostname!=HOST or p.username or p.password:
            raise urllib.error.HTTPError(newurl,code,"off_host_redirect_blocked",headers,fp)
        return super().redirect_request(req,fp,code,msg,headers,newurl)

def approved_url(region):
    if region not in REGION_PATHS:raise ValueError("unapproved_region")
    return ("https://"+HOST+"/timetable/download/gtfs-file/"
            +REGION_PATHS[region]+"/")

def read_original(region,root=PROVENANCE):
    if region not in REGION_PATHS:raise ValueError("unapproved_region")
    path=root/(region+".provenance.json")
    if path.is_symlink() or not path.is_file():
        raise ValueError("provenance_missing_or_symlink")
    record=json.loads(path.read_text(encoding="utf-8"))
    sha=record.get("sha256")
    size=record.get("compressed_bytes")
    if record.get("region")!=region or record.get("source_url")!=approved_url(region) or \
       not isinstance(sha,str) or not re.fullmatch(r"[0-9a-fA-F]{64}",sha) or \
       type(size) is not int or not 0<size<=MAX_SINGLE:
        raise ValueError("invalid_provenance")
    return sha.lower(),size

def sha_stream(region,opener=None,max_bytes=MAX_SINGLE):
    url=approved_url(region)
    opener=opener or urllib.request.build_opener(SameOfficialHost())
    req=urllib.request.Request(url,headers={"User-Agent":USER_AGENT,
          "Accept-Encoding":"identity"})
    start=time.monotonic()
    size=0
    dig=hashlib.sha256()
    with opener.open(req,timeout=40) as response:
        p=urllib.parse.urlsplit(response.geturl())
        if response.status!=200 or p.scheme!="https" or p.hostname!=HOST:
            raise ValueError("unexpected_response")
        if "html" in response.headers.get("Content-Type","").lower():
            raise ValueError("response_is_html")
        first=True
        while True:
            if time.monotonic()-start>240:raise ValueError("download_time_limit")
            chunk=response.read(128*1024)
            if not chunk:break
            if first:
                if not chunk.startswith((bytes.fromhex("504b0304"),bytes.fromhex("504b0506"))):
                    raise ValueError("not_zip")
                first=False
            size+=len(chunk)
            if size>max_bytes:raise ValueError("compressed_size_limit")
            dig.update(chunk)
    if size==0:raise ValueError("empty_archive")
    return dig.hexdigest(),size

def check_one(region,root=PROVENANCE,opener=None,max_bytes=MAX_SINGLE):
    expected_sha,expected_size=read_original(region,root)
    sha,size=sha_stream(region,opener,max_bytes)
    matched=sha==expected_sha
    return {"region":region,
       "status":"EXACT_ARCHIVE_SHA_MATCH" if matched else "ARCHIVE_CHANGED_OR_REPACKAGED",
       "previous_bytes":expected_size,"download_bytes":size,
       "same_sha256":matched,
       "timetable_semantics":"SAME_ARCHIVE_BYTES" if matched else "NOT_CHECKED",
       "data_saved_to_disk":False,
       "deployed":False}

def audit(regions,root=PROVENANCE,opener=None,
          max_total=MAX_CUMULATIVE,max_single=MAX_SINGLE,on_result=None):
    if not regions or len(regions)!=len(set(regions)) or \
       any(r not in REGION_PATHS for r in regions):
        raise ValueError("invalid_or_duplicate_regions")
    # Check the full known existing budget before starting the download.
    expected=sum(read_original(r,root)[1] for r in regions)
    if expected>max_total:
        raise ValueError("expected_download_exceeds_total_budget")
    used=0
    results=[]
    for region in regions:
        room=max_total-used
        if room<=0:raise ValueError("total_download_budget_exhausted")
        try:
            result=check_one(region,root,opener,min(room,max_single))
            used+=result["download_bytes"]
            results.append(result)
            if on_result is not None:on_result(result)
        except (urllib.error.URLError,OSError,ValueError,TimeoutError) as exc:
            # No upstream response bodies, tokens, or raw URLs in diagnostics.
            reason=str(exc) if type(exc) is ValueError else type(exc).__name__
            error={"region":region,"status":"CHECK_FAILED","reason":reason[:70]}
            results.append(error)
            if on_result is not None:on_result(error)
            break
    return {"status":"BODS_ARCHIVE_COMPARISON_ONLY",
       "requested_regions":len(regions),"completed_regions":len(results),
       "exact_archive_matches":sum(r["status"]=="EXACT_ARCHIVE_SHA_MATCH" for r in results),
       "changed_or_repackaged":sum(r["status"]=="ARCHIVE_CHANGED_OR_REPACKAGED" for r in results),
       "download_bytes":used,"disk_bytes_written":0,
       "one_time_only_not_scheduled":True,
       "production_unchanged":True,
       "results":results}

def main():
    parser=argparse.ArgumentParser(description="On-demand BODS ZIP SHA checks; no data import")
    parser.add_argument("--regions",required=True,
      help="Explicit approved region IDs separated by commas, e.g. en-em,en-ne")
    parser.add_argument("--progress",action="store_true",
      help="Flush one small result line per finished region; safe for detached log")
    args=parser.parse_args()
    regions=args.regions.split(",")
    on_result=(lambda result:print("REGION_RESULT "+json.dumps(
       result,separators=(",",":")),flush=True)) if args.progress else None
    result=audit(regions,on_result=on_result)
    print(json.dumps(result,indent=2),flush=True)
    return 2 if any(r["status"]=="CHECK_FAILED" for r in result["results"]) else 0

if __name__=="__main__":
    try:sys.exit(main())
    except (OSError,ValueError,KeyError) as err:
        code=str(err) if type(err) is ValueError else type(err).__name__
        print(json.dumps({"status":"CHECK_FAILED","error_code":code[:80],
                          "production_unchanged":True}))
        sys.exit(2)
