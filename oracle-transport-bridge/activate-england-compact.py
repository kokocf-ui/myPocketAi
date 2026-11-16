#!/usr/bin/env python3
"""Operator-approved England-only zero-copy activation with rollback.

Rebuilds one image from the validated feature checkout, reuses existing runtime
environment in memory, starts on the existing loopback port, and automatically
restores the old container if the replacement fails health/data checks.
Does not delete originals or touch other containers/ports.
"""
import json
import os
from pathlib import Path
import subprocess
import sys
import time
import urllib.error
import urllib.request

NAME="pocketai-england-local"
BACKUP="pocketai-england-local-rollback"
PORT="8768"
CANDIDATE="/home/ubuntu/pocketai-england-candidate/feeds"
REGIONS=("en-ea","en-em","en-ne","en-nw","en-se",
         "en-sw","en-wm","en-yorkshire","en-london")
SOURCE=Path(__file__).resolve().parents[1]
DOCKERFILE=SOURCE/"oracle-england-transport/Dockerfile"
IMAGE="pocketai-england-compact:validated"

def docker(*args,check=True,timeout=120):
    r=subprocess.run(["docker",*args],capture_output=True,text=True,timeout=timeout)
    if check and r.returncode:
        raise RuntimeError("docker_command_failed:"+args[0])
    return r

def inspect(name):
    r=docker("inspect",name,check=False)
    if r.returncode:return None
    return json.loads(r.stdout)[0]

def check_before():
    if os.geteuid()!=0:raise RuntimeError("requires_root_via_sudo")
    if inspect(BACKUP):raise RuntimeError("rollback_container_already_exists")
    old=inspect(NAME)
    if not old or not old["State"]["Running"]:
        raise RuntimeError("live_england_container_not_running")
    if old["State"].get("Health",{}).get("Status")!="healthy":
        raise RuntimeError("live_england_container_not_healthy")
    if not DOCKERFILE.is_file():raise RuntimeError("missing_dockerfile")
    if not Path(CANDIDATE).is_dir() or Path(CANDIDATE).is_symlink():
        raise RuntimeError("candidate_missing")
    if any(not (Path(CANDIDATE)/(r+".sqlite3")).is_file() or
           not (Path(CANDIDATE)/(r+".index.json")).is_file() for r in REGIONS):
        raise RuntimeError("nine_feed_pairs_not_found")
    bindings=old["HostConfig"].get("PortBindings",{})
    binds=bindings.get("3000/tcp",[])
    if len(binds)!=1 or binds[0].get("HostIp") not in ("127.0.0.1","") or \
       binds[0].get("HostPort")!=PORT:
        raise RuntimeError("unexpected_active_port_binding")
    mounts=old.get("Mounts",[])
    if len(mounts)!=1 or mounts[0].get("Destination")!="/data/feeds" or \
       mounts[0].get("Source")!="/home/ubuntu/pocketai-england/feeds":
        raise RuntimeError("unexpected_active_mounts")
    if old["Config"].get("User")!="10001:10001":
        raise RuntimeError("unexpected_service_user")
    if old["HostConfig"].get("NetworkMode") not in ("bridge",):
        raise RuntimeError("unexpected_service_network")
    if not old["HostConfig"].get("ReadonlyRootfs"):
        raise RuntimeError("unexpected_rootfs_security")
    if old["HostConfig"].get("Privileged"):
        raise RuntimeError("unexpected_privileged_service")
    if old["HostConfig"].get("CapDrop")!=["ALL"]:
        raise RuntimeError("unexpected_capabilities")
    env=old["Config"].get("Env",[])
    if not any(x.startswith("RO_GATEWAY_TOKEN=") and len(x)>40 for x in env):
        raise RuntimeError("existing_gateway_token_missing")
    if not any(x.startswith("GTFS_COUNTRY=GB") for x in env):
        raise RuntimeError("unexpected_country")
    return old,env

def probe():
    for attempt in range(12):
        obj=inspect(NAME)
        if obj and obj["State"]["Running"] and \
           obj["State"].get("Health",{}).get("Status")=="healthy":
            try:
                with urllib.request.urlopen(
                    "http://127.0.0.1:"+PORT+"/healthz",timeout=5) as response:
                    if response.status!=200:raise RuntimeError("health_http_not_200")
                # Read nine SQLite databases as the actual service user, not host ubuntu.
                code=("import sqlite3,pathlib;"
                  "p=pathlib.Path('/data/feeds');"
                  "d=list(p.glob('*.sqlite3'));"
                  "assert len(d)==9, 'wrong_count';"
                  "[(lambda c:(c.execute('SELECT count(*) FROM stops').fetchone(),c.close()))"
                  "(sqlite3.connect(x.as_uri()+'?mode=ro&immutable=1',uri=True)) for x in d]")
                docker("exec","--user","10001:10001",NAME,"python3","-c",code,
                       timeout=45)
                return
            except (OSError,RuntimeError,urllib.error.URLError,subprocess.TimeoutExpired):
                pass
        time.sleep(3)
    raise RuntimeError("new_england_service_failed_health_or_nine_feed_probe")

def main():
    old,env=check_before()
    # Building happens before any operational change; old stays healthy.
    print("BUILD_ENGLAND_IMAGE (existing service still online)",flush=True)
    docker("build","-t",IMAGE,"-f",str(DOCKERFILE),str(SOURCE),timeout=900)
    started=False
    renamed=False
    stopped=False
    try:
        print("SWITCHING_ONLY_ENGLAND_PORT_8768",flush=True)
        docker("rename",NAME,BACKUP)
        renamed=True
        docker("stop","--time","15",BACKUP,timeout=45)
        stopped=True
        # Reuse the same environment exactly, directly from existing Docker
        # inspect. Secrets never pass through command arguments or logs.
        envfile=Path("/run/pocketai-england-switch-env")
        fd=os.open(envfile,os.O_CREAT|os.O_EXCL|os.O_WRONLY,0o600)
        try:
            with os.fdopen(fd,"w") as out:
                for item in env:out.write(item+"\n")
            # Keep the original auth token; no new credentials required.
            docker("run","-d","--name",NAME,
                   "--restart","unless-stopped",
                   "--read-only","--cap-drop","ALL",
                   "--security-opt","no-new-privileges",
                   "--pids-limit","80","--memory","1g",
                   "--user","10001:10001",
                   "--env-file",str(envfile),
                   "--env","GTFS_DATA_DIR=/data/feeds",
                   "--mount",f"type=bind,src={CANDIDATE},dst=/data/feeds,readonly",
                   "-p","127.0.0.1:8768:3000",
                   "--health-cmd",("node -e \"fetch('http://127.0.0.1:3000/healthz')"
                   ".then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))\""),
                   "--health-interval","10s",
                   "--health-timeout","5s","--health-retries","3",
                   IMAGE)
            started=True
        finally:
            envfile.unlink(missing_ok=True)
        probe()
        print("ENGLAND_COMPACT_LIVE_HEALTHY_NINE_FEEDS",flush=True)
        print("ROLLBACK_CONTAINER_RETAINED_STOPPED:"+BACKUP,flush=True)
        print("OTHER_SERVICES_UNCHANGED",flush=True)
    except BaseException:
        print("ACTIVATION_FAILED_STARTING_AUTOMATIC_ROLLBACK",file=sys.stderr,flush=True)
        if started or inspect(NAME):
            docker("rm","-f",NAME,check=False,timeout=30)
        if renamed and inspect(BACKUP):
            docker("rename",BACKUP,NAME,check=False,timeout=30)
            if stopped:docker("start",NAME,check=False,timeout=35)
        if inspect(NAME) and inspect(NAME)["State"]["Running"]:
            print("PREVIOUS_ENGLAND_CONTAINER_RESTORED",flush=True)
        else:
            print("ROLLBACK_NEEDS_OPERATOR_REVIEW",file=sys.stderr)
        raise

if __name__=="__main__":
    try:main()
    except Exception as exc:
        print("ERROR:"+str(exc)[:100],file=sys.stderr)
        sys.exit(2)
