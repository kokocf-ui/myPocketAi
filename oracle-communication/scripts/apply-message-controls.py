#!/usr/bin/env python3
"""Add only sender-authorized edit/delete operations to the existing Oracle API.

Keep local push/FCM and server customization intact. Never touch DB or credentials.
Run from the project checkout after: git fetch --no-tags origin main
"""
from pathlib import Path
from datetime import datetime, timezone
import os
import shutil
import subprocess
import sys
import tempfile

if len(sys.argv) != 3:
    sys.exit("Usage: apply-message-controls.py DEVICE_API_FILE BACKUP_DIRECTORY")

target = Path(sys.argv[1]).resolve(strict=True)
backup_dir = Path(sys.argv[2]).resolve()
original = target.read_text(encoding="utf-8")
upstream = subprocess.run(
    ["git", "show", "origin/main:oracle-communication/device-api.mjs"],
    check=True, capture_output=True, text=True
).stdout
old_list = "if(['messages','send','upload','attachment'].includes(action))"
new_list = "if(['messages','send','upload','attachment','edit_message','delete_message'].includes(action))"
insert_at = "    check(uuid(data.messageId)&&b64(data.iv)&&data.iv.length===16&&b64(data.cipher),400,'Mesaj invalid');"
start_flag = "    // The server never sees plaintext. Only the authenticated original sender"

def once(value, needle, label):
    if value.count(needle) != 1:
        sys.exit("STOP: "+label+" absent or ambiguous. No changes.")

if "if(action==='edit_message'||action==='delete_message')" in original:
    print("ALREADY_PRESENT: edit/delete in Oracle checkout.")
    sys.exit(0)
once(original, old_list, "local action dispatch")
once(original, insert_at, "local message validation")
once(upstream, new_list, "upstream action dispatch")
once(upstream, insert_at, "upstream message validation")
once(upstream, start_flag, "upstream mutation block")
start = upstream.index(start_flag)
end = upstream.index(insert_at, start)
if not 0 < end - start < 4000:
    sys.exit("STOP: upstream layout unexpected. No changes.")
block = upstream[start:end]
for marker in (
    "if(action==='edit_message'||action==='delete_message')",
    "UPDATE device_messages SET iv=",
    "DELETE FROM device_messages WHERE id=",
    "notify(friend,'message',me)",
):
    if marker not in block:
        sys.exit("STOP: upstream operation incomplete. No changes.")
for marker in (
    "push_register", "push_unregister", "check(await approved(pool,me,friend)",
):
    if marker not in original:
        sys.exit("STOP: existing Oracle integration differs. No changes.")

updated = original.replace(old_list, new_list, 1).replace(insert_at, block + insert_at, 1)

# Validate using the Node installation INSIDE the existing running API container.
# Syntax check does not load any credentials or contact production PostgreSQL.
check = subprocess.run(
    ["sudo", "docker", "exec", "-i", "pocketai-device-comms-api-1",
     "node", "--check", "--input-type=module"],
    input=updated, text=True, capture_output=True
)
if check.returncode:
    sys.exit("STOP: JavaScript syntax failed: " + check.stderr[:600])

backup_dir.mkdir(parents=True, exist_ok=True)
backup = backup_dir / ("device-api-before-message-controls-" +
                       datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S") + ".mjs")
shutil.copy2(target, backup)
os.chmod(backup, 0o600)
fd, tempfile_path = tempfile.mkstemp(prefix=".device-api-update-", suffix=".mjs", dir=str(target.parent))
try:
    with os.fdopen(fd, "w", encoding="utf-8") as output:
        output.write(updated)
    os.chmod(tempfile_path, target.stat().st_mode & 0o777)
    os.replace(tempfile_path, target)
finally:
    if os.path.exists(tempfile_path):
        os.unlink(tempfile_path)
print("API_SOURCE_UPDATED=DA")
print("EDIT_DELETE=ADDED")
print("FCM_CODE=PRESERVED")
print("SYNTAX=OK")
print("BACKUP=" + str(backup))
