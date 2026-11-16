#!/usr/bin/env python3
"""READ-ONLY preflight: England compact GTFS 9/9 before any live deployment.
Never links, copies, deletes, chmods, deploys, restarts or changes credentials.
"""
import json
import os
from pathlib import Path
import stat
import subprocess
import sys

REGIONS=("en-ea","en-em","en-ne","en-nw","en-se","en-sw",
         "en-wm","en-yorkshire","en-london")
AUDIT=Path("/home/ubuntu/pocketai-england-audit")
COMPACT=Path("/home/ubuntu/pocketai-england-compact-pilot")
LIVE=Path("/home/ubuntu/pocketai-england/feeds")

def safe_stat(path,regular=True):
    if path.is_symlink() or not path.exists():
        raise ValueError("missing_or_symlink:"+str(path))
    s=path.stat()
    if regular and not stat.S_ISREG(s.st_mode):raise ValueError("not_a_regular_file:"+str(path))
    if not regular and not stat.S_ISDIR(s.st_mode):raise ValueError("not_a_directory:"+str(path))
    return s

def index_info(path,snapshot,region):
    safe_stat(path)
    with path.open("r",encoding="utf-8") as f:
        doc=json.load(f)
    db=safe_stat(snapshot)
    if doc.get("schema")!=2 or doc.get("backend")!="sqlite" or \
       doc.get("region")!=region or doc.get("country")!="GB" or \
       doc.get("timeZone")!="Europe/London" or \
       doc.get("snapshotBytes")!=db.st_size or \
       doc.get("snapshotMtimeMs")!=db.st_mtime_ns//1_000_000:
        raise ValueError("index_snapshot_metadata_mismatch:"+region)
    if not isinstance(doc.get("positions"),list) or not doc["positions"] or len(doc["positions"])>250000:
        raise ValueError("empty_or_excessive_stop_index:"+region)
    return len(doc["positions"])

def region_readiness(region,audit=AUDIT,compact=COMPACT,live=LIVE):
    original=audit/(region+".sqlite3")
    optimized=compact/(region+".sqlite3")
    prior=safe_stat(original)
    opt=safe_stat(optimized)
    src_stops=index_info(audit/(region+".index.json"),original,region)
    compact_stops=index_info(compact/(region+".index.json"),optimized,region)
    if src_stops!=compact_stops:raise ValueError("source_and_compact_stops_differ:"+region)
    live_st=safe_stat(live,regular=False)
    return {"region":region,"indexed_stops":src_stops,
       "original_mib":round(prior.st_size/1048576,1),
       "compact_mib":round(opt.st_size/1048576,1),
       "disk_saved_percent":round((1-opt.st_size/prior.st_size)*100,1),
       "hardlink_possible_same_device":opt.st_dev==live_st.st_dev,
       "compact_file_user":opt.st_uid,
       "compact_file_group":opt.st_gid,
       "compact_file_mode":oct(stat.S_IMODE(opt.st_mode)),
       "container_uid_10001_read_permission":(
          (opt.st_uid==10001 and bool(opt.st_mode&stat.S_IRUSR)) or
          (opt.st_gid==10001 and bool(opt.st_mode&stat.S_IRGRP)) or
          bool(opt.st_mode&stat.S_IROTH))}

def docker_state():
    def run(args,timeout=10):
        return subprocess.run(["sudo","-n","docker"]+args,
                              capture_output=True,text=True,timeout=timeout,check=True)
    try:
        result=run(["inspect","pocketai-england-local"])
        data=json.loads(result.stdout)[0]
        mounts=[x.get("Source") for x in data.get("Mounts",[])
                if x.get("Destination")=="/data/feeds"]
        state=data.get("State",{})
        # Never print environment values or Docker inspect's full JSON.
        state_report={"container_found":True,"running":state.get("Running",False),
           "health":state.get("Health",{}).get("Status","not_reported"),
           "feed_mount_expected":mounts==[str(LIVE)]}
        check=run(["exec","--user","10001:10001","pocketai-england-local",
                  "sh","-c","command -v node >/dev/null && command -v python3 >/dev/null"],timeout=10)
        state_report["live_container_has_node_and_python"]=check.returncode==0
        return state_report
    except (OSError,subprocess.SubprocessError,ValueError,IndexError):
        return {"container_check":"unavailable","reason":"docker_read_only_probe_failed"}

def preflight(audit=AUDIT,compact=COMPACT,live=LIVE,with_docker=True):
    for path in (audit,compact,live):safe_stat(path,regular=False)
    regions=[region_readiness(name,audit,compact,live) for name in REGIONS]
    a_bytes=sum((audit/(r+".sqlite3")).stat().st_size for r in REGIONS)
    c_bytes=sum((compact/(r+".sqlite3")).stat().st_size for r in REGIONS)
    result={"status":"PREFLIGHT_ONLY_NO_DEPLOYMENT",
      "regions_with_original_and_compact_indexes":len(regions),
      "original_total_gib":round(a_bytes/1073741824,2),
      "compact_total_gib":round(c_bytes/1073741824,2),
      "saved_percent_weighted":round((1-c_bytes/a_bytes)*100,1),
      "same_device_hardlink_ready":all(r["hardlink_possible_same_device"] for r in regions),
      "container_read_ready_now":all(r["container_uid_10001_read_permission"] for r in regions),
      "attribution_and_feed_freshness":"NOT_VERIFIED",
      "live_deployment":"NOT_AUTHORIZED_OR_EXECUTED",
      "regions":regions}
    if with_docker:result["docker"]=docker_state()
    return result

if __name__=="__main__":
    if os.geteuid()==0:
        sys.exit("Run as ubuntu, not root (read-only sudo docker inspection is internal).")
    try:
        print(json.dumps(preflight(),indent=2))
    except (ValueError,OSError,PermissionError,KeyError) as err:
        print(json.dumps({"status":"PREFLIGHT_FAILED","reason":str(err)[:180]}))
        sys.exit(2)
