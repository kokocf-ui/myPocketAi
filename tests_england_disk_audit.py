#!/usr/bin/env python3
"""Offline regression: disk audit is read-only and reports actual file bytes."""
import importlib.util
import sqlite3
import tempfile
from pathlib import Path
from unittest import TestCase, main

SOURCE = Path(__file__).resolve().parent / "oracle-transport-bridge/audit-england-disk.py"
spec = importlib.util.spec_from_file_location("england_disk", SOURCE)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class DiskAuditTest(TestCase):
    def test_readonly_report(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            db = root / "en-ea.sqlite3"
            with sqlite3.connect(db) as con:
                con.execute("CREATE TABLE stops (stop_id TEXT PRIMARY KEY)")
                con.execute("INSERT INTO stops VALUES ('a')")
            (root / "en-ea.index.json").write_text("{}")
            size = db.stat().st_size
            result = module.report(root=root, details=["en-ea"])
            self.assertEqual(result["count_staged"], 1)
            self.assertEqual(result["regions_expected"], 9)
            self.assertEqual(result["regions"][0]["sqlite_mib"],
                             round(size / module.MIB, 1))
            self.assertEqual(result["regions"][1]["status"], "missing")
            self.assertFalse((root / "en-ea.sqlite3-wal").exists())
            self.assertFalse((root / "en-ea.sqlite3-shm").exists())
            with sqlite3.connect(db) as con:
                self.assertEqual(con.execute("SELECT COUNT(*) FROM stops").fetchone()[0], 1)

if __name__ == "__main__":
    main()
