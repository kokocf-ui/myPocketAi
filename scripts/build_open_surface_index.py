"""Compile the official UTC Flix GTFS into a bounded Worker-readable asset.

No API keys, no guessed service, no shapes and no per-user route. The original
source ZIP remains authoritative. Run manually; never fetch inside a journey.
"""
import argparse
import hashlib
import json
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from inspect_open_surface_gtfs import load_feed, FEED_URL
from open_surface_timetable import seconds


def compile_feed(feed, sha256, generated_at=None):
    agencies = {a.get('agency_id', ''): a for a in feed['agency']}
    default = feed['agency'][0] if len(feed['agency']) == 1 else {}
    stops, stop_ids = [], {}
    for s in feed['stops']:
        try:
            lat, lon = float(s['stop_lat']), float(s['stop_lon'])
            if not (-90 <= lat <= 90 and -180 <= lon <= 180) or not s.get('stop_name'):
                continue
        except (KeyError, ValueError):
            continue
        stop_ids[s['stop_id']] = len(stops)
        stops.append([s['stop_id'], s['stop_name'], lat, lon])
    calendars = {c['service_id']: c for c in feed['calendar']}
    exceptions = defaultdict(dict)
    for e in feed['calendar_dates']:
        if e.get('exception_type') in ('1', '2'):
            exceptions[e['service_id']][e['date']] = int(e['exception_type'])
    services, service_ids, service_keys = [], {}, {}
    for sid in calendars.keys() | exceptions.keys():
        c = calendars.get(sid, {})
        mask = sum((1 << i) for i, k in enumerate(('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')) if c.get(k) == '1')
        row = [c.get('start_date', ''), c.get('end_date', ''), mask, exceptions.get(sid, {})]
        key = json.dumps(row, sort_keys=True)
        if key not in service_keys:
            service_keys[key] = len(services)
            services.append(row)
        service_ids[sid] = service_keys[key]
    routes, route_ids = [], {}
    for r in feed['routes']:
        agency = agencies.get(r.get('agency_id'), default)
        # The official European source declares UTC. Reject other feeds rather
        # than interpreting their local calendar as UTC or importing RO rules.
        if agency.get('agency_timezone') != 'UTC':
            raise ValueError('unsupported_agency_timezone')
        t = str(r.get('route_type'))
        mode = 'train' if t in ('2', '100', '101', '102') else 'coach' if t in ('3', '200', '201', '202') else None
        if not mode:
            continue
        route_ids[r['route_id']] = len(routes)
        routes.append([r['route_id'], agency.get('agency_name', ''), r.get('route_short_name') or r.get('route_long_name', ''), mode])
    calls = defaultdict(list)
    invalid = set()
    for s in feed['stop_times']:
        tid = s.get('trip_id')
        try:
            a, d = seconds(s.get('arrival_time')), seconds(s.get('departure_time'))
            if a is None or d is None or d < a or s['stop_id'] not in stop_ids:
                raise ValueError('bad_call')
            calls[tid].append((int(s['stop_sequence']), [stop_ids[s['stop_id']], a, d, int(s.get('pickup_type', '0') in ('', '0')), int(s.get('drop_off_type', '0') in ('', '0'))]))
        except (KeyError, ValueError, TypeError):
            invalid.add(tid)
    trips = []
    for t in feed['trips']:
        tid = t['trip_id']
        if tid in invalid or t['route_id'] not in route_ids or t['service_id'] not in service_ids:
            invalid.add(tid)
            continue
        rows = sorted(calls.get(tid, []))
        if len(rows) < 2 or any(a[0] >= b[0] or a[1][2] > b[1][1] for a, b in zip(rows, rows[1:])):
            invalid.add(tid)
            continue
        trips.append([tid, route_ids[t['route_id']], service_ids[t['service_id']], [s[1] for s in rows]])
    info = feed['feed_info'][0] if feed['feed_info'] else {}
    if not info.get('feed_start_date') or not info.get('feed_end_date'):
        raise ValueError('missing_feed_validity')
    return {'schema': 1, 'source': FEED_URL, 'sourceSha256': sha256,
            'generatedAt': generated_at or datetime.now(timezone.utc).isoformat(),
            'validFrom': info['feed_start_date'], 'validTo': info['feed_end_date'], 'timezone': 'UTC',
            'attribution': 'FlixBus / FlixTrain — European theoretical GTFS, ODbL 1.0 + PAN particular conditions',
            'publisherUrl': 'https://transport.data.gouv.fr/datasets/flixbus-horaires-theoriques-du-reseau-europeen-1',
            'licenseUrl': 'https://doc.transport.data.gouv.fr/le-point-d-acces-national/cadre-juridique/conditions-dutilisation-des-donnees/licence-odbl',
            'rejectedTrips': len(invalid), 'stops': stops, 'routes': routes, 'services': services, 'trips': trips}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--file', type=Path, required=True, help='Existing official ZIP; download is an explicit separate step')
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    data = compile_feed(load_feed(args.file), hashlib.sha256(args.file.read_bytes()).hexdigest())
    encoded = json.dumps(data, ensure_ascii=False, separators=(',', ':')).encode()
    if len(encoded) > 20 * 1024 * 1024:
        raise ValueError('index_exceeds_worker_asset_budget')
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_bytes(encoded)
    print(json.dumps({'bytes': len(encoded), **{k: len(data[k]) for k in ('stops', 'routes', 'services', 'trips')}, 'rejectedTrips': data['rejectedTrips']}))


if __name__ == '__main__':
    main()
