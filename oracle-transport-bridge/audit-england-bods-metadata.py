#!/usr/bin/env python3
"""Read-only BODS HEAD metadata check and concise nine-region calendar summary.

Only HEAD requests to approved official source URLs. Never downloads ZIP
bodies, imports, writes, restarts services, or promotes production.
HTTP metadata alone never proves feed content freshness.
"""
import argparse
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
import importlib.util
import json
from pathlib import Path
import sys
import urllib.error
import urllib.parse
import urllib.request

HERE=Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location(
    "england_readiness",HERE/"audit-england-release-readiness.py")
audit_mod=importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit_mod)

ENDPOINTS={
 "en-ea":"east_anglia","en-em":"east_midlands",
 "en-ne":"north_east","en-nw":"north_west",
 "en-se":"south_east","en-sw":"south_west",
 "en-wm":"west_midlands","en-yorkshire":"yorkshire",
 "en-london":"london"
}
HOST="data.bus-data.dft.gov.uk"

class OfficialHostOnly(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,req,fp,code,msg,headers,newurl):
        p=urllib.parse.urlsplit(newurl)
        if p.scheme!="https" or p.hostname!=HOST or p.username or p.password:
            raise urllib.error.HTTPError(newurl,code,"unsafe_redirect",headers,fp)
        return super().redirect_request(req,fp,code,msg,headers,newurl)

def official_url(region):
    if region not in ENDPOINTS:raise ValueError("unapproved_region")
    return ("https://"+HOST+"/timetable/download/gtfs-file/"
            +ENDPOINTS[region]+"/")

def parse_date(header,now):
    if not header:return {"header_present":False,"days_old":None}
    try:
        dt=parsedate_to_datetime(header)
        if dt.tzinfo is None:raise ValueError("missing_tz")
        days=(now-dt.astimezone(timezone.utc)).total_seconds()/86400
        return {"header_present":True,"days_old":round(days,1)}
    except (TypeError,ValueError,OverflowError):
        return {"header_present":True,"days_old":None}

def check_head(region,now,opener=None):
    url=official_url(region)
    opener=opener or urllib.request.build_opener(OfficialHostOnly())
    request=urllib.request.Request(
        url,method="HEAD",headers={"User-Agent":"PocketAI-BODS-metadata-audit/1.0"})
    try:
        with opener.open(request,timeout=8) as response:
            final=urllib.parse.urlsplit(response.geturl())
            if final.scheme!="https" or final.hostname!=HOST:
                raise ValueError("response_host_not_approved")
            modified=parse_date(response.headers.get("Last-Modified"),now)
            content_length=response.headers.get("Content-Length")
            try:
                size=int(content_length) if content_length is not None else None
                if size is not None and size<0:size=None
            except ValueError:size=None
            return {"region":region,"head_status":int(response.status),
              "last_modified_days_old":modified["days_old"],
              "last_modified_header_present":modified["header_present"],
              "etag_header_present":bool(response.headers.get("ETag")),
              "advertised_zip_bytes":size,
              "content_freshness_verified":False}
    except (urllib.error.URLError,urllib.error.HTTPError,TimeoutError,
            OSError,ValueError) as e:
        kind="http_error" if isinstance(e,urllib.error.HTTPError) else type(e).__name__
        return {"region":region,"head_status":None,"metadata_status":"unavailable",
          "failure_type":kind,"content_freshness_verified":False}

def concise_report(audit_result,heads=None):
    if audit_result.get("status")!="READ_ONLY_ENG_RELEASE_AUDIT_NO_DEPLOYMENT":
        raise ValueError("readiness_audit_did_not_pass")
    summary={"status":"BODS_RELEASE_CHECK_NO_DEPLOYMENT",
      "checked_date":audit_result["checked_date"],
      "regions":audit_result["regions_checked"],
      "services_today":audit_result["with_services_today"],
      "services_day_7":audit_result["with_services_day_7"],
      "services_day_30":audit_result["with_services_day_30"],
      "publisher_zip_hash_current":"NOT_VERIFIED",
      "live_England_service":"UNCHANGED",
      "attribution_in_Eva":"NOT_VERIFIED"}
    if heads is not None:
        summary["HEAD_metadata_only"]=heads
        summary["HEAD_does_not_prove_same_ZIP_sha256"]=True
    return summary

def main():
    p=argparse.ArgumentParser(description="9-region read-only calendar audit; optional BODS HTTP metadata")
    p.add_argument("--remote-head",action="store_true",
        help="Only nine public HEAD requests, no ZIP bodies; cannot prove feed equality")
    args=p.parse_args()
    from zoneinfo import ZoneInfo
    now=datetime.now(ZoneInfo("Europe/London"))
    out=audit_mod.audit(today=now.date())
    heads=[check_head(r,datetime.now(timezone.utc)) for r in ENDPOINTS] if args.remote_head else None
    print(json.dumps(concise_report(out,heads),indent=2,ensure_ascii=False))

if __name__=="__main__":
    try:main()
    except (ValueError,KeyError,OSError) as e:
        print(json.dumps({"status":"READ_ONLY_CHECK_FAILED","reason":str(e)[:140]}))
        sys.exit(2)
