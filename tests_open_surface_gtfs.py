import importlib.util
import unittest

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

if __name__ == '__main__':
    unittest.main()
