#!/usr/bin/env python3
"""Inspect an operator-published GTFS without any paid API, deployment or keys.

Feed stays outside Git. Only selected bounded CSV members are read; ZIP paths
are never extracted. Topology is route evidence, NOT an aligned dated itinerary.
"""
import argparse
import csv
import hashlib
import io
import json
import math
import pathlib
import tempfile
import urllib.request
import zipfile
from collections import defaultdict, deque
from open_surface_timetable import plan_candidates

FEED_URL = "https://gtfs.gis.flix.tech/gtfs_generic_eu.zip"
SOURCE_URL = "https://transport.data.gouv.fr/datasets/flixbus-horaires-theoriques-du-reseau-europeen-1"
MAX_DOWNLOAD = 100 * 1024 * 1024
MAX_MEMBER = 200 * 1024 * 1024


def rows(archive, name, optional=False):
    try:
        info = archive.getinfo(name)
    except KeyError:
        if optional:
            return
        raise ValueError("missing_gtfs_member:" + name)
    if info.file_size > MAX_MEMBER:
        raise ValueError("gtfs_member_too_large:" + name)
    with archive.open(info) as raw:
        yield from csv.DictReader(io.TextIOWrapper(raw, encoding="utf-8-sig", newline=""))


def distance(a, b):
    lat, lon, qlat, qlon = map(math.radians, (float(a[0]), float(a[1]), float(b[0]), float(b[1])))
    v = math.sin((lat - qlat) / 2) ** 2 + math.cos(lat) * math.cos(qlat) * math.sin((lon - qlon) / 2) ** 2
    return 6371000 * 2 * math.asin(math.sqrt(min(1, max(0, v))))


def load_feed(path):
    with zipfile.ZipFile(path) as archive:
        # No shapes: road geometry is not necessary to verify stop identities.
        feed = {name[:-4]: list(rows(archive, name, optional=name in ("calendar.txt", "calendar_dates.txt", "feed_info.txt", "transfers.txt")))
                for name in ("agency.txt", "stops.txt", "routes.txt", "trips.txt", "stop_times.txt", "calendar.txt", "calendar_dates.txt", "feed_info.txt", "transfers.txt")}
    if not feed["calendar"] and not feed["calendar_dates"]:
        raise ValueError("missing_service_calendar")
    return feed


def inspect(feed, origin, destination, origin_radius=80000, destination_radius=40000, departure_at=None):
    stops = {s["stop_id"]: s for s in feed["stops"]}
    routes = {r["route_id"]: r for r in feed["routes"]}
    trips = {t["trip_id"]: t for t in feed["trips"]}
    by_trip = defaultdict(list)
    for row in feed["stop_times"]:
        if row.get("trip_id") in trips and row.get("stop_id") in stops:
            by_trip[row["trip_id"]].append(row)
    def near(point, radius):
        hits = []
        for sid, s in stops.items():
            try:
                d = distance(point, (s["stop_lat"], s["stop_lon"]))
            except (KeyError, ValueError):
                continue
            if d <= radius:
                hits.append({"id": sid, "name": s["stop_name"], "latitude": float(s["stop_lat"]), "longitude": float(s["stop_lon"]), "distanceMeters": round(d)})
        return sorted(hits, key=lambda s: s["distanceMeters"])
    starts, ends = near(origin, origin_radius), near(destination, destination_radius)
    # Each edge is an ACTUAL ordered pair on one source trip; no city-name join.
    graph = defaultdict(dict)
    patterns = set()
    for tid, calls in by_trip.items():
        calls.sort(key=lambda s: int(s["stop_sequence"]))
        pattern = tuple((s["stop_id"], s.get("pickup_type", "0"), s.get("drop_off_type", "0")) for s in calls)
        route_id = trips[tid]["route_id"]
        if (route_id, pattern) in patterns:
            continue
        patterns.add((route_id, pattern))
        for i, a in enumerate(calls):
            if a.get("pickup_type", "0") not in ("", "0"):
                continue
            for b in calls[i+1:]:
                if b.get("drop_off_type", "0") not in ("", "0"):
                    continue
                graph[a["stop_id"]].setdefault(b["stop_id"], {"routeId": route_id, "exampleTripId": tid})
    targets = {s["id"] for s in ends}
    queue = deque((s["id"], [], {s["id"]}) for s in starts)
    found, expanded = [], {(s["id"], 0) for s in starts}
    while queue and len(found) < 3:
        sid, path, visited = queue.popleft()
        if path and sid in targets:
            found.append(path)
            continue
        if len(path) >= 3:
            continue
        for to_id, evidence in graph[sid].items():
            if to_id in visited or (to_id, len(path) + 1) in expanded:
                continue
            expanded.add((to_id, len(path) + 1))
            route = routes.get(evidence["routeId"], {})
            item = {**evidence, "fromStopId": sid, "toStopId": to_id,
                    "from": stops[sid]["stop_name"], "to": stops[to_id]["stop_name"],
                    "line": route.get("route_short_name"), "routeType": route.get("route_type")}
            queue.append((to_id, path + [item], visited | {to_id}))
    report = {"source": SOURCE_URL, "download": FEED_URL, "licence": "ODbL-1.0 + PAN specific conditions",
            "counts": {key: len(value) for key, value in feed.items()},
            "agencies": [{k: a.get(k) for k in ("agency_id", "agency_name", "agency_timezone")} for a in feed["agency"]],
            "feedInfo": feed["feed_info"], "originStops": starts[:8], "destinationStops": ends[:8],
            "originStopCount": len(starts), "destinationStopCount": len(ends),
            "surfacePaths": found, "topologyOnly": True, "timetableAligned": False,
            "accessVerified": False, "egressVerified": False, "seatOrFareVerified": False}
    if departure_at:
        report["datedSearch"] = plan_candidates(feed, starts, ends, departure_at)
    return report


def download(path):
    request = urllib.request.Request(FEED_URL, headers={"User-Agent": "myPocketAI-open-GTFS-development-inspection/1.0"})
    with urllib.request.urlopen(request, timeout=90) as response, open(path, "wb") as out:
        # Follow only HTTPS redirects to the same official host.
        if not response.geturl().startswith("https://gtfs.gis.flix.tech/"):
            raise ValueError("unexpected_feed_redirect")
        total = 0
        while block := response.read(1024 * 1024):
            total += len(block)
            if total > MAX_DOWNLOAD:
                raise ValueError("feed_download_too_large")
            out.write(block)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--file", type=pathlib.Path)
    parser.add_argument("--departure-at")
    parser.add_argument("--origin", nargs=2, type=float, required=True)
    parser.add_argument("--destination", nargs=2, type=float, required=True)
    parser.add_argument("--output", type=pathlib.Path, required=True)
    args = parser.parse_args()
    with tempfile.TemporaryDirectory() as tmp:
        path = args.file or pathlib.Path(tmp) / "operator.zip"
        if not args.file:
            download(path)
        report = inspect(load_feed(path), args.origin, args.destination, departure_at=args.departure_at)
        with open(path, "rb") as source:
            report["sha256"] = hashlib.file_digest(source, "sha256").hexdigest()
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
        print(json.dumps(report, ensure_ascii=False))
        # Check annotations are readable via GitHub API even when log download
        # redirects are blocked in the coding sandbox. No secrets/private input.
        for key in ("counts", "agencies", "feedInfo", "originStops", "destinationStops", "surfacePaths", "datedSearch"):
            if key not in report:
                continue
            value = json.dumps(report[key], ensure_ascii=False).replace("%", "%25").replace("\r", "%0D").replace("\n", "%0A")
            print("::notice title=open-gtfs-" + key + "::" + value)


if __name__ == "__main__":
    main()
