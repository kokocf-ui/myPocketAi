#!/usr/bin/env python3
"""One-region-only, strictly bounded read-only BODS compressed ZIP SHA check.

Downloads GTFS bytes into a hashing stream, never writes ZIP/DB/index.
An identical SHA proves exact archive identity at this check time; a different
SHA does not necessarily prove timetable content changed (ZIP metadata differs).
"""
import hashlib
import json
from pathlib import Path
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

REGION="en-ea"
SOURCE="https://data.bus-data.dft.gov.uk/timetable/download/gtfs-file/east_anglia/"
AUDIT=Path("/home/ubuntu/pocketai-england-audit/en-ea.provenance.json")
MAX_BYTES=100_000_000
HOST="data.bus-data.dft.gov.uk"

class FixedHost(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,req,fp,code,msg,headers,newurl):
        p=urllib.parse.urlsplit(newurl)
        if p.scheme!="https" or p.hostname!=HOST or p.username or p.password:
            raise urllib.error.HTTPError(newurl,code,"off_host_redirect_blocked",headers,fp)
        return super().redirect_request(req,fp,code,msg,headers,newurl)

def verify_provenance(file=AUDIT):
    if file.is_symlink() or not file.is_file():raise ValueError("provenance_missing_or_symlink")
    metadata=json.loads(file.read_text(encoding="utf-8"))
    digest=metadata.get("sha256")
    if metadata.get("region")!=REGION or metadata.get("source_url")!=SOURCE or \
       not isinstance(digest,str) or not re.fullmatch(r"[0-9a-fA-F]{64}",digest):
        raise ValueError("unexpected_provenance")
    return {"sha256":digest.lower(),"compressed_bytes":metadata.get("compressed_bytes")}

def stream_sha(opener=None,limit=MAX_BYTES):
    opener=opener or urllib.request.build_opener(FixedHost())
    request=urllib.request.Request(SOURCE,headers={
        "User-Agent":"PocketAI-BODS-integrity-check/1.0",
        "Accept-Encoding":"identity"})
    digest=hashlib.sha256()
    size=0
    start=time.monotonic()
    with opener.open(request,timeout=30) as response:
        if response.status!=200:raise ValueError("download_http_not_200")
        p=urllib.parse.urlsplit(response.geturl())
        if p.scheme!="https" or p.hostname!=HOST:raise ValueError("unsafe_response_origin")
        if "html" in response.headers.get("Content-Type","").lower():
            raise ValueError("download_is_html")
        first=True
        while True:
            if time.monotonic()-start>180:raise ValueError("stream_timeout")
            chunk=response.read(128*1024)
            if not chunk:break
            if first:
                if not chunk.startswith((b"PK\x03\x04",b"PK\x05\x06")):
                    raise ValueError("response_not_zip")
                first=False
            size+=len(chunk)
            if size>limit:raise ValueError("compressed_bytes_limit")
            digest.update(chunk)
    if size==0:raise ValueError("empty_download")
    return {"current_sha256":digest.hexdigest(),"current_compressed_bytes":size}

def examine(provenance=AUDIT,opener=None):
    previous=verify_provenance(provenance)
    current=stream_sha(opener)
    same=current["current_sha256"]==previous["sha256"]
    return {"region":REGION,
       "status":"EXACT_ARCHIVE_SHA_MATCH" if same else "ARCHIVE_SHA_CHANGED_OR_REPACKAGED",
       "original_compressed_bytes":previous["compressed_bytes"],
       "current_compressed_bytes":current["current_compressed_bytes"],
       "sha256_equal":same,
       "schedule_content_equivalence":"NOT_CHECKED" if not same else "SAME_ARCHIVE_BYTES",
       "other_eight_regions":"NOT_CHECKED",
       "download":"STREAMED_NOT_SAVED",
       "live_service":"UNCHANGED",
       "no_production_deployment":True}

if __name__=="__main__":
    if len(sys.argv)!=1:
        sys.exit("This pilot deliberately accepts no arguments and checks only East Anglia")
    try:
        print(json.dumps(examine(),indent=2))
    except (OSError,ValueError,urllib.error.URLError,TimeoutError,KeyError) as e:
        code=str(e) if isinstance(e,ValueError) else type(e).__name__
        print(json.dumps({"status":"CHECK_FAILED","region":REGION,"error_code":code[:80],
                          "live_service":"UNCHANGED"}))
        sys.exit(2)
