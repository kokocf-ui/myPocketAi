#!/usr/bin/env python3
"""Read-only release gate: BODS provenance + dated schedule horizons for 9 regions.
Does not download, modify, restart, link or activate any transport data.
"""
from datetime import date,timedelta
from pathlib import Path
from contextlib import closing
import json,sqlite3,sys

ROOT=Path("/home/ubuntu/pocketai-england-audit")
CANDIDATE=Path("/home/ubuntu/pocketai-england-candidate/feeds")
REGIONS=("en-ea","en-em","en-ne","en-nw","en-se","en-sw",
         "en-wm","en-yorkshire","en-london")
HORIZONS=(0,7,30)

def schedule_counts(db,day):
    ymd=day.strftime("%Y%m%d")
    weekday=day.strftime("%A").lower()
    active={row[0] for row in db.execute(
        "SELECT service_id FROM calendar WHERE start_date<=? AND end_date>=? "
        "AND "+weekday+"='1'",(ymd,ymd))}
    for service,action in db.execute(
        "SELECT service_id,exception_type FROM calendar_dates WHERE date=? "
        "ORDER BY service_id,exception_type",(ymd,)):
        if str(action)=="1":active.add(service)
        elif str(action)=="2":active.discard(service)
    return len(active)

def report_one(region,root,candidate,today):
    if region not in REGIONS:raise ValueError("unknown_region")
    original=root/(region+".sqlite3")
    provenance=root/(region+".provenance.json")
    compact=candidate/(region+".sqlite3")
    index=candidate/(region+".index.json")
    for path in (original,provenance,compact,index):
        if path.is_symlink() or not path.is_file():
            raise ValueError("missing_or_symlink_source:"+region)
    details=json.loads(provenance.read_text(encoding="utf-8"))
    expected_url="https://data.bus-data.dft.gov.uk/timetable/download/gtfs-file/"
    if details.get("region")!=region or not str(details.get("source_url","")).startswith(expected_url):
        raise ValueError("unexpected_source_provenance:"+region)
    if details.get("rights_status")!="OGL_UK_attribution_required":
        raise ValueError("unexpected_rights_status:"+region)
    if not details.get("sha256") or len(details["sha256"])!=64:
        raise ValueError("missing_source_checksum:"+region)
    # Stage JSON records source URL/hash but not a certified publisher update timestamp.
    # File mtime is an import time, NOT evidence that DfT's published feed is current.
    with closing(sqlite3.connect(original.resolve().as_uri()+"?mode=ro&immutable=1",uri=True)) as db:
        coverage={str(days):schedule_counts(db,today+timedelta(days=days)) for days in HORIZONS}
        calendar=db.execute("SELECT MIN(start_date),MAX(end_date) FROM calendar").fetchone()
        exceptions=db.execute("SELECT MIN(date),MAX(date) FROM calendar_dates").fetchone()
        count=db.execute("SELECT COUNT(*) FROM trips").fetchone()[0]
    return {"region":region,"trips":count,
        "active_service_counts":coverage,
        "calendar_range_yyyymmdd":{"first":calendar[0],"last":calendar[1]},
        "exception_range_yyyymmdd":{"first":exceptions[0],"last":exceptions[1]},
        "source_sha256_prefix":details["sha256"][:12],
        "source_last_updated":"NOT_CAPTURED_IN_PROVENANCE",
        "BODS_attribution":"REQUIRED_IN_APP",
        "candidate_database_present":True,
        "future_30_days_has_services":coverage["30"]>0}

def audit(root=ROOT,candidate=CANDIDATE,today=None):
    day=today or date.today()
    if root.is_symlink() or candidate.is_symlink() or not root.is_dir() or not candidate.is_dir():
        raise ValueError("source_or_candidate_directory_missing")
    regions=[report_one(r,root,candidate,day) for r in REGIONS]
    return {"status":"READ_ONLY_ENG_RELEASE_AUDIT_NO_DEPLOYMENT",
        "checked_date":day.isoformat(),"regions_checked":len(regions),
        "with_services_today":sum(bool(r["active_service_counts"]["0"]) for r in regions),
        "with_services_day_7":sum(bool(r["active_service_counts"]["7"]) for r in regions),
        "with_services_day_30":sum(bool(r["active_service_counts"]["30"]) for r in regions),
        "publisher_freshness":"NOT_VERIFIED",
        "visible_license_attribution":"NOT_VERIFIED_IN_ANDROID",
        "cross_region_journeys":"NOT_VERIFIED",
        "production_switch":"NOT_PERFORMED",
        "regions":regions}

if __name__=="__main__":
    try:
        from zoneinfo import ZoneInfo
        from datetime import datetime
        day=datetime.now(ZoneInfo("Europe/London")).date()
        print(json.dumps(audit(today=day),indent=2))
    except (ValueError,OSError,KeyError,sqlite3.Error) as e:
        print(json.dumps({"status":"READ_ONLY_AUDIT_FAILED","reason":str(e)[:180]}))
        sys.exit(2)
