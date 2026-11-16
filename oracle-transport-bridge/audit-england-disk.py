#!/usr/bin/env python3
"""Read-only Oracle England BODS disk footprint audit.

Does not VACUUM, attach, copy, delete or migrate databases. --details reads
SQLite dbstat and can take time on the largest regions.
"""
import argparse
import json
import sqlite3
from pathlib import Path

AUDIT = Path("/home/ubuntu/pocketai-england-audit")
REGIONS = ("en-ea", "en-em", "en-ne", "en-nw", "en-se", "en-sw",
           "en-wm", "en-yorkshire", "en-london")
MIB = 1024 * 1024

def report(root=AUDIT, details=()):
    if root.is_symlink() or not root.is_dir():
        raise ValueError("audit_directory_missing_or_symlink")
    rows = []
    total = 0
    for region in REGIONS:
        db_path = root / (region + ".sqlite3")
        idx_path = root / (region + ".index.json")
        if db_path.is_symlink() or idx_path.is_symlink():
            raise ValueError("snapshot_symlink_refused:" + region)
        if not db_path.is_file():
            rows.append({"region": region, "status": "missing"})
            continue
        size = db_path.stat().st_size
        index_size = idx_path.stat().st_size if idx_path.is_file() else 0
        total += size + index_size
        row = {
            "region": region, "status": "staged_not_live",
            "sqlite_mib": round(size / MIB, 1),
            "index_mib": round(index_size / MIB, 2),
        }
        # Immutable read-only snapshot, no -wal or -shm creation.
        con = sqlite3.connect(db_path.as_uri() + "?mode=ro&immutable=1", uri=True)
        try:
            page_size = int(con.execute("PRAGMA page_size").fetchone()[0])
            page_count = int(con.execute("PRAGMA page_count").fetchone()[0])
            free_pages = int(con.execute("PRAGMA freelist_count").fetchone()[0])
            row["free_pages_mib"] = round(free_pages * page_size / MIB, 2)
            row["indexed_pages_mib"] = round(page_size * page_count / MIB, 1)
            if region in details:
                try:
                    parts = con.execute(
                        "SELECT name, SUM(pgsize) FROM dbstat "
                        "GROUP BY name ORDER BY SUM(pgsize) DESC LIMIT 7"
                    ).fetchall()
                    row["largest_sqlite_objects_mib"] = {
                        name: round(nbytes / MIB, 1) for name, nbytes in parts
                    }
                except sqlite3.OperationalError:
                    row["largest_sqlite_objects_mib"] = "dbstat_not_available"
        finally:
            con.close()
        rows.append(row)
    return {"count_staged": sum(x["status"] == "staged_not_live" for x in rows),
            "regions_expected": 9, "sqlite_plus_index_gib": round(total / (1024*MIB), 2),
            "note": "AUDIT ONLY. Copying all snapshots to live mounts would duplicate storage.",
            "regions": rows}

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--details", choices=list(REGIONS), action="append", default=[],
                   help="Optional deep per-table and index page sizes for selected region")
    args = p.parse_args()
    print(json.dumps(report(details=args.details), indent=2))

if __name__ == "__main__":
    main()
