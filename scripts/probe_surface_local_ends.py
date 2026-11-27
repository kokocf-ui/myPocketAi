"""Two bounded requests to existing domestic planners; never a mixed search.

Only public synthetic test points from the caller; no key lookup or credential
logging. No new service/configuration/deployment or provider-search fallback.
"""
import json
import urllib.error
import urllib.request
from datetime import datetime, timedelta

API = 'https://lifewise-ai-v2.kokocf.workers.dev/api/chat'


def ask_local(origin, destination, when):
    payload = {'message': 'Transport public', 'language': 'ro', 'module': 'maps', 'history': [],
               'location_requested': True, 'location': origin, 'coordinates': origin,
               'journey_origin': origin, 'transit_destination': destination,
               'transit_query': destination['label'], 'transit_departure_at': when,
               'mixed_journey': False, 'mixed_composition': False,
               'national_public_transport': False, 'transit_count': 4}
    request = urllib.request.Request(API, data=json.dumps(payload).encode(),
                                     headers={'Content-Type': 'application/json', 'Accept': 'application/json',
                                              'User-Agent': 'Mozilla/5.0 myPocketAI-controlled-local-connection-check'}, method='POST')
    try:
        with urllib.request.urlopen(request, timeout=35) as response:
            data = json.load(response)
        if data.get('flight_candidates') or data.get('operator_options'):
            return {'status': 'unexpected_mixed_response'}
        leg_fields = ('mode', 'from', 'to', 'departureTime', 'arrivalTime', 'durationMinutes', 'lineNames', 'departurePoint', 'arrivalPoint', 'arrivalLatLon')
        compact = []
        for journey in (data.get('transit') or [])[:1]:
            item = {k: journey.get(k) for k in ('startDateTime', 'arrivalDateTime', 'time_zone', 'durationMinutes')}
            item['legs'] = [{k: leg.get(k) for k in leg_fields} for leg in (journey.get('legs') or [])]
            compact.append(item)
        return {'status': data.get('reason', data.get('status')), 'provider': data.get('transit_provider'),
                'providerStatus': data.get('provider_status'),
                'journeys': compact,
                'routeOnlyCount': len(data.get('route_options_without_schedule') or [])}
    except (urllib.error.URLError, ValueError, TimeoutError) as error:
        return {'status': 'local_check_unavailable', 'errorType': type(error).__name__}


def probe_local_ends(report, origin, destination):
    journeys = report.get('datedSearch', {}).get('candidates', [])
    if not journeys:
        return {'status': 'no_dated_intercity_candidate', 'requests': 0}
    first, last = journeys[0]['legs'][0], journeys[0]['legs'][-1]
    start = {'latitude': origin[0], 'longitude': origin[1], 'label': 'Public test point near Grays', 'country_code': 'GB'}
    end = {'latitude': destination[0], 'longitude': destination[1], 'label': 'Public test point in Oradea', 'country_code': 'RO'}
    boarding = {**first['departurePoint'], 'label': first['from'], 'country_code': 'GB'}
    alighting = {**last['arrivalPoint'], 'label': last['to'], 'country_code': 'RO'}
    after = (datetime.fromisoformat(last['arrivalTime'].replace('Z', '+00:00')) + timedelta(minutes=10)).isoformat()
    entry = ask_local(start, boarding, report['datedSearch']['requestedAt'])
    exit = ask_local(alighting, end, after)
    # These are provider responses, NOT a claim of coordinate anchoring or
    # chronological end-to-end completion. The actual join validates those.
    return {'status': 'local_endpoint_checks', 'requests': 2, 'access': entry, 'egress': exit,
            'boardingTime': first['departureTime'], 'alightingTime': last['arrivalTime'],
            'accessRequestedAt': report['datedSearch']['requestedAt'], 'egressRequestedAt': after,
            'completeDoorToDoor': False}
