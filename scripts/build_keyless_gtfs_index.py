#!/usr/bin/env python3
"""Offline bounded GTFS compiler for the reviewed keyless source catalog.

No network, extraction, deployment or automatic terms acceptance. Input ZIPs
stay outside Git. Expand a short LOCAL service-date window into dated UTC trips
using GTFS noon-minus-12h semantics (including DST and times above 24:00).
Direct rides only at runtime: transfers/pathways/frequencies are NOT guessed.
"""
import argparse
import hashlib
import json
import re
import zipfile
from collections import defaultdict
from datetime import date, datetime, time, timedelta, timezone
from pathlib import Path
from urllib.parse import urlparse
from zoneinfo import ZoneInfo
from inspect_open_surface_gtfs import load_feed

CATALOG = Path(__file__).resolve().parents[1] / 'keyless_gtfs_sources.json'
MODES = {'0':'tram','1':'metro','2':'train','3':'bus','4':'ferry','5':'cable-car','6':'cable-car','7':'funicular','11':'trolleybus',
         '100':'train','101':'train','102':'train','103':'train','106':'train','109':'train',
         '200':'bus','201':'bus','202':'bus','700':'bus','800':'trolleybus','900':'tram','1000':'ferry','1300':'cable-car','1400':'funicular'}
WEEKDAYS = ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')


def secs(value):
    if not re.fullmatch(r'\d{1,2}:\d{2}:\d{2}', value or ''):
        raise ValueError('invalid_gtfs_time')
    h, m, s = map(int, value.split(':'))
    if h > 71 or m > 59 or s > 59:
        raise ValueError('invalid_gtfs_time')
    return h*3600+m*60+s


def active(feed, day):
    key = day.strftime('%Y%m%d')
    result = {c['service_id'] for c in feed['calendar'] if c['start_date'] <= key <= c['end_date'] and c.get(WEEKDAYS[day.weekday()]) == '1'}
    for e in feed['calendar_dates']:
        if e.get('date') == key:
            if e.get('exception_type') == '1':
                result.add(e['service_id'])
            elif e.get('exception_type') == '2':
                result.discard(e['service_id'])
    return result


def unique(rows, field):
    result = {}
    for row in rows:
        key = row.get(field)
        if not key or key in result:
            raise ValueError('duplicate_or_missing_id:' + field)
        result[key] = row
    return result


def compile_feed(feed, source, sha256, start, days=3, download_url='', now=None):
    if not isinstance(days, int) or not 2 <= days <= 7:
        raise ValueError('window_requires_2_to_7_days')
    url = urlparse(download_url)
    if url.scheme != 'https' or url.hostname not in source['downloadHosts'] or url.username or url.password or url.query or url.fragment:
        raise ValueError('unapproved_download_origin')
    agencies = unique(feed['agency'], 'agency_id') if len(feed['agency']) > 1 else {feed['agency'][0].get('agency_id',''):feed['agency'][0]} if feed['agency'] else {}
    if not agencies:
        raise ValueError('missing_agency')
    # Mixed agency zones are possible in GTFS, but not supported by this bounded
    # first implementation. Fail closed rather than assigning the wrong date.
    zones = {a.get('agency_timezone') for a in agencies.values()}
    if len(zones) != 1 or not next(iter(zones)):
        raise ValueError('mixed_or_missing_agency_timezone')
    zone_name = next(iter(zones))
    zone = ZoneInfo(zone_name)
    unique(feed['trips'], 'trip_id')
    stops, stop_ids = [], {}
    for sid, s in unique(feed['stops'], 'stop_id').items():
        lat, lon = float(s['stop_lat']), float(s['stop_lon'])
        if not -90 <= lat <= 90 or not -180 <= lon <= 180 or not s.get('stop_name'):
            raise ValueError('invalid_stop')
        stop_ids[sid] = len(stops)
        stops.append([sid,s['stop_name'],lat,lon])
    routes, route_ids = [], {}
    for rid, r in unique(feed['routes'], 'route_id').items():
        mode = MODES.get(r.get('route_type'))
        if mode not in source['modes'] or r.get('continuous_pickup','1') not in ('','1') or r.get('continuous_drop_off','1') not in ('','1'):
            continue
        agency = agencies.get(r['agency_id']) if r.get('agency_id') else next(iter(agencies.values())) if len(agencies)==1 else None
        if not agency or not agency.get('agency_name'):
            raise ValueError('unknown_agency')
        route_ids[rid] = len(routes)
        routes.append([rid,agency['agency_name'],r.get('route_short_name') or r.get('route_long_name',''),mode])
    calls, invalid = defaultdict(list), set()
    for row in feed['stop_times']:
        tid = row.get('trip_id')
        try:
            a,d = secs(row.get('arrival_time')),secs(row.get('departure_time'))
            seq = int(row['stop_sequence'])
            if d<a or seq<0 or row['stop_id'] not in stop_ids:
                raise ValueError('invalid_call')
            # On-demand/continuous boarding is not equivalent to a scheduled
            # walk-up service. Preserve ordinary pickup/dropoff only.
            pickup = int(row.get('pickup_type','0') in ('','0') and row.get('continuous_pickup','1') in ('','1'))
            dropoff = int(row.get('drop_off_type','0') in ('','0') and row.get('continuous_drop_off','1') in ('','1'))
            calls[tid].append((seq,[stop_ids[row['stop_id']],a,d,pickup,dropoff]))
        except (KeyError,ValueError,TypeError):
            invalid.add(tid)
    valid_trips = []
    for trip in feed['trips']:
        tid = trip['trip_id']
        rows = sorted(calls.get(tid,[]))
        if tid in invalid or len(rows)<2 or any(a[0]>=b[0] or a[1][2]>b[1][1] for a,b in zip(rows,rows[1:])):
            invalid.add(tid)
            continue
        if trip['route_id'] in route_ids:
            valid_trips.append((trip,[r[1] for r in rows]))
    services, service_ids, trips = [], {}, []
    utc = timezone.utc
    for n in range(days):
        day = start + timedelta(days=n)
        enabled = active(feed,day)
        # GTFS times are elapsed seconds from local noon minus twelve hours;
        # subtract in UTC so DST transition days are not treated as 24h walls.
        anchor = datetime.combine(day,time(12),zone).astimezone(utc)-timedelta(hours=12)
        for trip, rows in valid_trips:
            if trip['service_id'] not in enabled:
                continue
            first = anchor + timedelta(seconds=rows[0][1])
            base = first.replace(hour=0,minute=0,second=0,microsecond=0)
            key = base.strftime('%Y%m%d')
            if key not in service_ids:
                service_ids[key] = len(services)
                services.append(['','',0,{key:1}])
            shift = int((anchor-base).total_seconds())
            converted = [[r[0],r[1]+shift,r[2]+shift,r[3],r[4]] for r in rows]
            if converted[0][1]<0 or converted[-1][2]>=72*3600:
                invalid.add(trip['trip_id'])
                continue
            trips.append([trip['trip_id']+'@'+day.isoformat(),route_ids[trip['route_id']],service_ids[key],converted])
            if len(trips)>10000:
                raise ValueError('trip_budget_exceeded_select_smaller_feed_or_window')
    if not trips:
        raise ValueError('no_scheduled_trips_in_window')
    if len(stops)>10000 or len(routes)>10000 or sum(len(t[3]) for t in trips)>100000:
        raise ValueError('index_budget_exceeded_select_smaller_feed_or_window')
    begin = datetime.combine(start,time(12),zone).astimezone(utc)-timedelta(hours=12)
    end = datetime.combine(start+timedelta(days=days),time(12),zone).astimezone(utc)-timedelta(hours=12)
    return {'schema':1,'sourceId':source['id'],'source':source['datasetUrl'],'sourceSha256':sha256,'downloadUrl':download_url,
            'generatedAt':(now or datetime.now(utc)).isoformat(),'timezone':'UTC','originalTimezone':zone_name,
            'validFrom':begin.strftime('%Y%m%d'),'validTo':end.strftime('%Y%m%d'),
            'coverageStartUtc':begin.isoformat(),'coverageEndUtc':end.isoformat(),'directRidesOnly':True,
            'attribution':source['name']+' — '+source['license'],'licenseUrl':source['licenseUrl'],'scope':source['scope'],
            'stops':stops,'routes':routes,'services':services,'trips':trips,'rejectedTrips':len(invalid)}


def select_feed(feed, agency_ids=(), route_ids=()):
    """Explicit operator/route selection, preserving complete trips and calls.

    This is not a geographic crop: keep all intermediate (including foreign)
    stops so runtime domestic verification cannot be bypassed by clipping.
    """
    if not agency_ids and not route_ids:
        return feed
    default = feed['agency'][0].get('agency_id','') if len(feed['agency'])==1 else None
    agencies, routes = set(agency_ids), set(route_ids)
    selected = [r for r in feed['routes'] if (not agencies or (r.get('agency_id') or default) in agencies) and (not routes or r['route_id'] in routes)]
    if not selected:
        raise ValueError('selection_has_no_routes')
    if routes-set(r['route_id'] for r in selected):
        raise ValueError('unknown_selected_route')
    if agencies-set(a.get('agency_id','') for a in feed['agency']):
        raise ValueError('unknown_selected_agency')
    rids = {r['route_id'] for r in selected}
    trips = [t for t in feed['trips'] if t['route_id'] in rids]
    tids = {t['trip_id'] for t in trips}
    calls = [c for c in feed['stop_times'] if c['trip_id'] in tids]
    sids = {c['stop_id'] for c in calls}
    used_agencies = {r.get('agency_id') or default for r in selected}
    return {**feed,'routes':selected,'trips':trips,'stop_times':calls,
            'stops':[s for s in feed['stops'] if s['stop_id'] in sids],
            'agency':[a for a in feed['agency'] if a.get('agency_id','') in used_agencies]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source',required=True)
    parser.add_argument('--file',required=True,type=Path)
    parser.add_argument('--download-url',required=True)
    parser.add_argument('--start',required=True,type=date.fromisoformat)
    parser.add_argument('--days',type=int,default=3)
    parser.add_argument('--terms-reviewed',action='store_true')
    parser.add_argument('--agency-id',action='append',default=[],help='Optional explicit operator IDs from this feed (repeatable)')
    parser.add_argument('--route-id',action='append',default=[],help='Optional explicit route IDs from this feed (repeatable)')
    parser.add_argument('--output-dir',type=Path,default=Path('.keyless-gtfs-assets'))
    args = parser.parse_args()
    if not args.terms_reviewed:
        parser.error('Explicit source licence/attribution/distribution review is required: --terms-reviewed')
    source = next((s for s in json.loads(CATALOG.read_text()) if s['id']==args.source),None)
    if not source:
        parser.error('Unknown source; use the reviewed source catalog')
    if args.file.stat().st_size>100*1024*1024:
        raise ValueError('zip_exceeds_offline_download_budget')
    with zipfile.ZipFile(args.file) as archive:
        names = archive.namelist()
        if len(names)!=len(set(names)) or sum(i.file_size for i in archive.infolist())>512*1024*1024:
            raise ValueError('duplicate_members_or_expanded_archive_budget')
        if 'frequencies.txt' in names and archive.getinfo('frequencies.txt').file_size:
            raise ValueError('frequency_service_not_supported')
    feed = select_feed(load_feed(args.file),args.agency_id,args.route_id)
    data = compile_feed(feed,source,hashlib.sha256(args.file.read_bytes()).hexdigest(),args.start,args.days,args.download_url)
    data['selection'] = {'agencyIds':args.agency_id,'routeIds':args.route_id,'clippedIntermediateStops':False}
    encoded = json.dumps(data,ensure_ascii=False,separators=(',',':')).encode()
    if len(encoded)>5*1024*1024:
        raise ValueError('index_exceeds_5MiB')
    args.output_dir.mkdir(parents=True,exist_ok=True)
    target = args.output_dir/(source['id']+'.json')
    target.write_bytes(encoded)
    print(json.dumps({'source':source['id'],'bytes':len(encoded),'trips':len(data['trips']),'stops':len(data['stops']),'output':str(target),'status':'compiled_not_live_validated'}))


if __name__=='__main__':
    main()
