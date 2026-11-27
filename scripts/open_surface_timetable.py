"""Date-aware GTFS intercity candidates. No search API and no guessed services.

Outer local connections are NOT provided by this module. Transfers use the exact
same operator stop ID, a conservative planning buffer, and separate-ticket
warning; times do not prove a protected connection or available seats.
"""
from collections import defaultdict
from datetime import date, datetime, time, timedelta, timezone
from zoneinfo import ZoneInfo

WEEKDAYS = ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')


def seconds(value):
    try:
        h, m, s = map(int, value.split(':'))
        return h * 3600 + m * 60 + s if 0 <= h <= 71 and 0 <= m < 60 and 0 <= s < 60 else None
    except (ValueError, TypeError, AttributeError):
        return None


def active_services(feed, day):
    value = day.strftime('%Y%m%d')
    enabled = {row['service_id'] for row in feed['calendar']
               if row.get('start_date', '') <= value <= row.get('end_date', '')
               and row.get(WEEKDAYS[day.weekday()]) == '1'}
    for row in feed['calendar_dates']:
        if row.get('date') == value:
            if row.get('exception_type') == '1':
                enabled.add(row['service_id'])
            elif row.get('exception_type') == '2':
                enabled.discard(row['service_id'])
    return enabled


def instant(day, sec, zone):
    # GTFS uses seconds since local noon minus 12h (elapsed seconds), including
    # hours >=24. Stop-local time zones do not override agency schedule time.
    base = datetime.combine(day, time(12), ZoneInfo(zone)).astimezone(timezone.utc) - timedelta(hours=12)
    return base + timedelta(seconds=sec)


def iso(stamp):
    return stamp.isoformat().replace('+00:00', 'Z')


def plan_candidates(feed, origins, destinations, departure_at, days=3, max_rides=3, transfer_minutes=45):
    requested = datetime.fromisoformat(departure_at.replace('Z', '+00:00'))
    if requested.tzinfo is None:
        raise ValueError('departure_requires_timezone')
    requested = requested.astimezone(timezone.utc)
    if not (1 <= days <= 7 and 1 <= max_rides <= 4 and 0 <= transfer_minutes <= 240):
        raise ValueError('unbounded_timetable_search')
    horizon = requested + timedelta(days=days)
    stops = {s['stop_id']: s for s in feed['stops']}
    routes = {r['route_id']: r for r in feed['routes']}
    agencies = {a.get('agency_id', ''): a for a in feed['agency']}
    default_agency = feed['agency'][0] if len(feed['agency']) == 1 else {}
    trips = {t['trip_id']: t for t in feed['trips']}
    calls = defaultdict(list)
    for row in feed['stop_times']:
        if row.get('trip_id') not in trips or row.get('stop_id') not in stops:
            continue
        arr, dep = seconds(row.get('arrival_time')), seconds(row.get('departure_time'))
        try:
            sequence = int(row['stop_sequence'])
        except (ValueError, KeyError):
            continue
        calls[row['trip_id']].append((sequence, row['stop_id'], arr, dep,
                                     row.get('pickup_type', '0') in ('', '0'),
                                     row.get('drop_off_type', '0') in ('', '0')))
    source_trips = []
    calendars = {}
    rejected = 0
    for tid, entries in calls.items():
        entries.sort()
        if len(entries) < 2 or any(e[2] is None or e[3] is None or e[3] < e[2] for e in entries):
            rejected += 1
            continue
        if any(a[0] == b[0] or b[2] < a[3] for a, b in zip(entries, entries[1:])):
            rejected += 1
            continue
        trip = trips[tid]
        route = routes.get(trip['route_id'], {})
        agency = agencies.get(route.get('agency_id'), default_agency)
        zone = agency.get('agency_timezone')
        if not zone:
            rejected += 1
            continue
        local_day = requested.astimezone(ZoneInfo(zone)).date()
        # Include previous service days for >24h GTFS calls, but never offer a
        # boarding before the requested instant. Inactive calendars are rejected.
        for delta in range(-2, days + 1):
            day = local_day + timedelta(days=delta)
            if day not in calendars:
                calendars[day] = active_services(feed, day)
            if trip['service_id'] not in calendars[day]:
                continue
            timed = [(e[1], instant(day, e[2], zone), instant(day, e[3], zone), e[4], e[5]) for e in entries]
            if timed[-1][1] < requested or timed[0][2] > horizon:
                continue
            source_trips.append((tid, trip['route_id'], agency, timed, day))
    starts = {s['id'] for s in origins}
    targets = {s['id'] for s in destinations}
    # Round-based earliest arrival: each round boards one more actual vehicle.
    # No city-name/cross-station walk or unverified interchange edge is created.
    labels = {sid: (requested, []) for sid in starts}
    candidates = []
    for round_number in range(1, max_rides + 1):
        previous = dict(labels)
        improved = dict(labels)
        for tid, route_id, agency, entries, service_day in source_trips:
            boarded = None
            route = routes.get(route_id, {})
            for index, (sid, arrival, departure, pickup, dropoff) in enumerate(entries):
                if boarded is not None and dropoff and requested <= arrival <= horizon:
                    board_index, prior_path = boarded
                    board = entries[board_index]
                    old = improved.get(sid)
                    if old is None or arrival < old[0]:
                        a, b = stops[board[0]], stops[sid]
                        mode = 'train' if route.get('route_type') in ('2', '100', '101', '102') else 'coach'
                        leg = {'tripId': tid, 'serviceDate': service_day.isoformat(), 'routeId': route_id,
                               'mode': mode, 'operator': agency.get('agency_name'),
                               'line': route.get('route_short_name') or route.get('route_long_name'),
                               'fromStopId': board[0], 'toStopId': sid, 'from': a['stop_name'], 'to': b['stop_name'],
                               'departureTime': iso(board[2]), 'arrivalTime': iso(arrival),
                               'departurePoint': {'latitude': float(a['stop_lat']), 'longitude': float(a['stop_lon'])},
                               'arrivalPoint': {'latitude': float(b['stop_lat']), 'longitude': float(b['stop_lon'])},
                               'stopCount': index - board_index,
                               'stops': [{'id': v[0], 'name': stops[v[0]]['stop_name'], 'arrivalTime': iso(v[1]), 'departureTime': iso(v[2])} for v in entries[board_index:index+1]]}
                        improved[sid] = (arrival, prior_path + [leg])
                prior = previous.get(sid)
                if pickup and prior and departure >= requested and departure <= horizon:
                    # Boarding the same trip again is not a different vehicle.
                    if any(x['tripId'] == tid and x['serviceDate'] == service_day.isoformat() for x in prior[1]):
                        continue
                    buffer = timedelta(minutes=transfer_minutes) if prior[1] else timedelta(0)
                    if prior[0] + buffer <= departure and (boarded is None or len(prior[1]) < len(boarded[1])):
                        boarded = (index, prior[1])
        labels = improved
        for target in targets:
            if target in labels and labels[target][1] and len(labels[target][1]) == round_number:
                path = labels[target][1]
                candidates.append({'legs': path, 'arrivalTime': iso(labels[target][0]),
                                   'scheduleVerified': True, 'completeDoorToDoor': False,
                                   'accessVerified': False, 'egressVerified': False,
                                   'transferBufferMinutes': transfer_minutes,
                                   'transferProtectionVerified': False, 'seatOrFareVerified': False})
    candidates.sort(key=lambda j: (j['arrivalTime'], len(j['legs'])))
    return {'status': 'scheduled_intercity_candidates' if candidates else 'no_candidate_in_loaded_feed_window',
            'requestedAt': iso(requested), 'horizon': iso(horizon), 'activeTripInstances': len(source_trips),
            'rejectedMalformedTrips': rejected, 'candidates': candidates[:3]}
