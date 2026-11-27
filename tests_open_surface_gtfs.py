import importlib.util
import unittest
import sys
sys.path.insert(0, "scripts")

spec = importlib.util.spec_from_file_location('surface', 'scripts/inspect_open_surface_gtfs.py')
surface = importlib.util.module_from_spec(spec)
spec.loader.exec_module(surface)

class OpenSurfaceEvidence(unittest.TestCase):
    def setUp(self):
        self.feed = {key: [] for key in ('agency', 'stops', 'routes', 'trips', 'stop_times', 'calendar', 'calendar_dates', 'feed_info', 'transfers')}
        for sid, lat in [('A', 51), ('B', 50), ('C', 49)]:
            self.feed['stops'].append({'stop_id': sid, 'stop_name': sid, 'stop_lat': str(lat), 'stop_lon': '0'})
        for tid, calls in [('one', ['A', 'B']), ('two', ['B', 'C'])]:
            self.feed['routes'].append({'route_id': tid, 'route_short_name': tid, 'route_type': '3'})
            self.feed['trips'].append({'trip_id': tid, 'route_id': tid})
            self.feed['stop_times'] += [{'trip_id': tid, 'stop_id': sid, 'stop_sequence': str(i)} for i, sid in enumerate(calls)]

    def test_only_source_ordered_pairs(self):
        out = surface.inspect(self.feed, (51, 0), (49, 0), 100, 100)
        self.assertEqual(len(out['surfacePaths']), 1)
        self.assertEqual([s['from'] for s in out['surfacePaths'][0]], ['A', 'B'])
        self.assertFalse(out['timetableAligned'])
        self.assertFalse(out['accessVerified'])
        self.assertEqual(surface.inspect(self.feed, (49, 0), (51, 0), 100, 100)['surfacePaths'], [])

    def test_no_boarding_means_no_connection(self):
        self.feed['stop_times'][0]['pickup_type'] = '1'
        self.assertEqual(surface.inspect(self.feed, (51, 0), (49, 0), 100, 100)['surfacePaths'], [])

    def test_exact_stop_not_name_join(self):
        self.feed['stops'].append({'stop_id': 'different', 'stop_name': 'B', 'stop_lat': '50', 'stop_lon': '0'})
        self.feed['stop_times'][2]['stop_id'] = 'different'
        self.assertEqual(surface.inspect(self.feed, (51, 0), (49, 0), 100, 100)['surfacePaths'], [])

class OpenSurfaceTimetable(OpenSurfaceEvidence):
    def setUp(self):
        super().setUp()
        self.feed['agency'] = [{'agency_id': 'operator', 'agency_name': 'Fixture operator', 'agency_timezone': 'UTC'}]
        for route in self.feed['routes']:
            route['agency_id'] = 'operator'
        for trip in self.feed['trips']:
            trip['service_id'] = 'thursday'
        self.feed['calendar'] = [{'service_id': 'thursday', 'start_date': '20261203', 'end_date': '20261203', 'thursday': '1'}]
        for row, t in zip(self.feed['stop_times'], ['08:00:00', '10:00:00', '11:00:00', '12:00:00']):
            row['arrival_time'] = t
            row['departure_time'] = t

    def planned(self):
        return surface.inspect(self.feed, (51, 0), (49, 0), 100, 100, '2026-12-03T06:00:00Z')['datedSearch']

    def test_dated_stop_to_stop_not_door_to_door(self):
        result = self.planned()
        self.assertEqual(result['status'], 'scheduled_intercity_candidates')
        best = result['candidates'][0]
        self.assertEqual(len(best['legs']), 2)
        self.assertEqual(best['legs'][0]['departureTime'], '2026-12-03T08:00:00Z')
        self.assertEqual(best['legs'][1]['arrivalTime'], '2026-12-03T12:00:00Z')
        self.assertEqual(best['legs'][0]['stopCount'], 1)
        self.assertFalse(best['completeDoorToDoor'])
        self.assertFalse(best['transferProtectionVerified'])

    def test_calendar_exception_removes_trip(self):
        self.feed['calendar_dates'] = [{'service_id': 'thursday', 'date': '20261203', 'exception_type': '2'}]
        self.assertEqual(self.planned()['candidates'], [])

    def test_cannot_catch_connection(self):
        self.feed['stop_times'][2]['arrival_time'] = '10:30:00'
        self.feed['stop_times'][2]['departure_time'] = '10:30:00'
        self.assertEqual(self.planned()['candidates'], [])

    def test_no_silent_missing_intermediate_stop(self):
        self.feed['stop_times'][0]['arrival_time'] = 'unknown'
        self.assertEqual(self.planned()['candidates'], [])

    def test_overnight_and_stop_local_timezone(self):
        from open_surface_timetable import instant, iso
        from datetime import date
        self.assertEqual(iso(instant(date(2026, 12, 3), 25 * 3600, 'Europe/Bucharest')), '2026-12-03T23:00:00Z')
        # GTFS stop-local time zones do not override agency timezone.
        self.feed['stops'][0]['stop_timezone'] = 'Europe/Bucharest'
        self.assertEqual(self.planned()['candidates'][0]['legs'][0]['departureTime'], '2026-12-03T08:00:00Z')

if __name__ == '__main__':
    unittest.main()
