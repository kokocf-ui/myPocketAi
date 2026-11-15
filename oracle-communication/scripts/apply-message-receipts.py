#!/usr/bin/env python3
"""Safely add receipt API actions to an Oracle checkout with local FCM changes.

Does not touch Docker, database, environment variables, or secret files.
Run only after 'git fetch origin main:refs/remotes/origin/main'.
"""
from datetime import datetime, timezone
from pathlib import Path
import os
import shutil
import subprocess
import sys
import tempfile

if len(sys.argv) != 3:
    sys.exit("Usage: apply-message-receipts.py DEVICE_API_PATH BACKUP_DIRECTORY")
target = Path(sys.argv[1]).resolve(strict=True)
backup_dir = Path(sys.argv[2]).resolve()
local = target.read_text(encoding="utf-8")
upstream = subprocess.run(
    ["git", "show", "origin/main:oracle-communication/device-api.mjs"],
    capture_output=True, text=True, check=True).stdout

def once(text, value, label):
    if text.count(value) != 1:
        sys.exit("STOP: Missing or non-unique anchor: " + label + ". No files changed.")

def extract(start, end):
    once(upstream,start,"upstream "+start[:35])
    index=upstream.index(start)
    end_index=upstream.index(end,index)
    if end_index<=index or end_index-index>4500:
        sys.exit("STOP: unexpected API layout. No files changed.")
    return upstream[index:end_index]

if "if(action==='receipt')" in local and "if(action==='pending_messages')" in local:
    print("RECEIPTS_SOURCE=ALREADY_PRESENT")
    sys.exit(0)

old_dispatch="if(['messages','send','upload','attachment','edit_message','delete_message'].includes(action))"
new_dispatch="if(['messages','send','upload','attachment','edit_message','delete_message','receipt'].includes(action))"
old_query="SELECT id,sender_id AS sender,recipient_id AS recipient,iv,cipher,kind,attachment_id,created_ms::float8 AS created_ms FROM device_messages WHERE pair_key=$1 ORDER BY created_ms DESC,id DESC LIMIT 100"
new_query="SELECT m.id,m.sender_id AS sender,m.recipient_id AS recipient,m.iv,m.cipher,m.kind,m.attachment_id,a.kind AS attachment_kind,m.created_ms::float8 AS created_ms,m.delivered_at,m.read_at,m.played_at FROM device_messages m LEFT JOIN device_attachments a ON a.id=m.attachment_id WHERE m.pair_key=$1 ORDER BY m.created_ms DESC,m.id DESC LIMIT 100"
pending_anchor="   if(action==='invite')limit('invite:'+me,20,86400000);"
receipt_anchor="    if(action==='attachment'){"
pending_start="   // Fetch encrypted envelopes for receipt-capable clients even before chat opens."
receipt_start="    // Only the cryptographically authenticated recipient can acknowledge"

for marker in ("if(action==='push_register')", "if(action==='push_unregister')",
               "notify(friend,'message',me)", "if(action==='edit_message'||action==='delete_message')"):
    if marker not in local:
        sys.exit("STOP: locally customized Oracle API is missing expected feature: "+marker)
for marker,label in ((old_dispatch,"old dispatcher"),(old_query,"old messages SELECT"),
                     (pending_anchor,"pending insertion point"),(receipt_anchor,"receipt insertion point")):
    once(local,marker,label)
for marker,label in ((new_dispatch,"upstream receipt dispatcher"),(new_query,"upstream SELECT")):
    once(upstream,marker,label)

pending=extract(pending_start,pending_anchor)
receipt=extract(receipt_start,receipt_anchor)
for fragment in ("if(action==='pending_messages')", "m.recipient_id=$1 AND m.delivered_at IS NULL"):
    if fragment not in pending:
        sys.exit("STOP: incomplete incoming action. No changes.")
for fragment in ("if(action==='receipt')", "m.recipient_id=$1 AND m.sender_id=$2", "played_at=CASE"):
    if fragment not in receipt:
        sys.exit("STOP: incomplete signed receipt action. No changes.")

result=local.replace(pending_anchor,pending+pending_anchor,1)
result=result.replace(old_dispatch,new_dispatch,1)
result=result.replace(old_query,new_query,1)
result=result.replace(receipt_anchor,receipt+receipt_anchor,1)

check=subprocess.run(["sudo","docker","exec","-i","pocketai-device-comms-api-1",
                      "node","--check","--input-type=module"],
                     input=result,text=True,capture_output=True)
if check.returncode:
    sys.exit("STOP: Oracle API syntax invalid: "+check.stderr[:600])

backup_dir.mkdir(parents=True,exist_ok=True)
backup=backup_dir/("device-api-before-receipts-"+datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S")+".mjs")
shutil.copy2(target,backup)
os.chmod(backup,0o600)
fd,temp=tempfile.mkstemp(prefix=".device-api-receipts-",suffix=".mjs",dir=str(target.parent))
try:
    with os.fdopen(fd,"w",encoding="utf-8") as file:
        file.write(result)
    os.chmod(temp,target.stat().st_mode & 0o777)
    os.replace(temp,target)
finally:
    if os.path.exists(temp):os.unlink(temp)
print("RECEIPTS_SOURCE=UPDATED")
print("LOCAL_FCM_AND_MESSAGE_CONTROLS=PRESERVED")
print("SYNTAX=OK")
print("BACKUP="+str(backup))
