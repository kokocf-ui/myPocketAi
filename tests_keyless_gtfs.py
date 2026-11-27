import copy
import csv
import io
import json
import subprocess
import tempfile
import zipfile
import sys
import unittest
from datetime import date,datetime,timezone
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent/'test_fixtures'))
from keyless_gtfs import feed,index,compile_feed,CATALOG
from build_keyless_gtfs_index import select_feed
SOURCE=next(s for s in json.loads(CATALOG.read_text()) if s['id']=='public_gtfs_lu')


def build(f,start=date(2026,11,27),source=SOURCE,days=3,url='https://download.data.public.lu/synthetic-fixture.zip'):
    return compile_feed(f,source,'a'*64,start,days,url,datetime(2026,11,26,10,tzinfo=timezone.utc))


def actual(data,call=0):
    trip=data['trips'][0]
    day=next(iter(data['services'][trip[2]][3]))
    return datetime.strptime(day,'%Y%m%d').replace(tzinfo=timezone.utc).timestamp()+trip[3][call][2]


class CompilerTests(unittest.TestCase):
    def test_catalog_all_six_sources(self):
        for source in json.loads(CATALOG.read_text()):
            data=index(source['id'])
            self.assertEqual(data['sourceId'],source['id'])
            self.assertTrue(data['directRidesOnly'])
            self.assertEqual(data['timezone'],'UTC')
            self.assertEqual(len(data['trips']),1)

    def test_normal_and_after_midnight(self):
        data=build(feed())
        self.assertEqual(datetime.fromtimestamp(actual(data),timezone.utc).isoformat(),'2026-11-27T09:10:00+00:00')
        data=build(feed(a='25:10:00',b='26:20:00'))
        self.assertEqual(datetime.fromtimestamp(actual(data),timezone.utc).isoformat(),'2026-11-28T00:10:00+00:00')

    def test_dst_gtfs_noon_anchor(self):
        for day,expected in [('20260329','2026-03-29T00:30:00+00:00'),('20261025','2026-10-25T01:30:00+00:00')]:
            d=datetime.strptime(day,'%Y%m%d').date()
            data=build(feed(start=day,a='02:30:00',b='03:30:00'),start=d)
            self.assertEqual(datetime.fromtimestamp(actual(data),timezone.utc).isoformat(),expected)

    def test_calendar_removal_and_addition(self):
        f=feed();f['calendar_dates']=[]
        f['calendar']=[{'service_id':'s','start_date':'20261127','end_date':'20261129',**{d:'1' for d in ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')}}]
        f['calendar_dates']=[{'service_id':'s','date':'20261128','exception_type':'2'}]
        data=build(f)
        self.assertEqual(len(data['trips']),2)
        self.assertFalse(any('@2026-11-28' in t[0] for t in data['trips']))

    def test_malformed_trip_never_shortened(self):
        for patch in [{'arrival_time':'bad'},{'stop_id':'unknown'},{'stop_sequence':'1'},{'arrival_time':'09:00:00','departure_time':'09:00:00'}]:
            f=feed();f['stop_times'][1].update(patch)
            with self.assertRaisesRegex(ValueError,'no_scheduled_trips'):
                build(f)

    def test_pickup_dropoff_preserved(self):
        f=feed();f['stop_times'][0]['pickup_type']='1';f['stop_times'][1]['drop_off_type']='2'
        data=build(f)
        self.assertEqual(data['trips'][0][3][0][3],0)
        self.assertEqual(data['trips'][0][3][1][4],0)

    def test_operator_selection_keeps_all_intermediate_stops(self):
        f=feed();f['routes'].append({'route_id':'other','agency_id':'TEST','route_type':'3'})
        f['stops'].append({'stop_id':'foreign','stop_name':'Foreign intermediate','stop_lat':'50','stop_lon':'7'})
        f['stop_times'][1]['stop_sequence']='3'
        f['stop_times'].append({'trip_id':'t','stop_id':'foreign','stop_sequence':'2','arrival_time':'10:20:00','departure_time':'10:20:00'})
        selected=select_feed(f,route_ids=['r'])
        self.assertEqual(len(selected['routes']),1)
        self.assertEqual({s['stop_id'] for s in selected['stops']},{'a','b','foreign'})
        self.assertEqual(len(build(selected)['trips'][0][3]),3)
        with self.assertRaisesRegex(ValueError,'selection_has_no_routes'):
            select_feed(f,route_ids=['absent'])

    def test_real_cli_zip_gates_and_no_path_extraction(self):
        with tempfile.TemporaryDirectory() as folder:
            root=Path(folder);archive=root/'synthetic.zip'
            with zipfile.ZipFile(archive,'w') as z:
                for table,rows in feed().items():
                    if rows:
                        out=io.StringIO();writer=csv.DictWriter(out,fieldnames=list(rows[0]));writer.writeheader();writer.writerows(rows)
                        z.writestr(table+'.txt',out.getvalue())
                z.writestr('../must-not-extract.txt','unsafe path not extracted')
            cmd=[sys.executable,'scripts/build_keyless_gtfs_index.py','--source','public_gtfs_lu','--file',str(archive),'--start','2026-11-27',
                 '--download-url','https://download.data.public.lu/synthetic.zip','--output-dir',str(root/'assets')]
            blocked=subprocess.run(cmd,capture_output=True,text=True)
            self.assertNotEqual(blocked.returncode,0)
            self.assertFalse((root/'assets').exists())
            passed=subprocess.run(cmd+['--terms-reviewed','--route-id','r'],capture_output=True,text=True)
            self.assertEqual(passed.returncode,0,passed.stderr)
            self.assertEqual(json.loads(passed.stdout)['status'],'compiled_not_live_validated')
            self.assertTrue((root/'assets/public_gtfs_lu.json').is_file())
            self.assertFalse((root/'must-not-extract.txt').exists())
            with zipfile.ZipFile(archive,'a') as z:
                z.writestr('frequencies.txt','trip_id,start_time,end_time,headway_secs\nt,10:00:00,11:00:00,300')
            blocked=subprocess.run(cmd+['--terms-reviewed'],capture_output=True,text=True)
            self.assertNotEqual(blocked.returncode,0)
            self.assertIn('frequency_service_not_supported',blocked.stderr)

    def test_fail_closed_origins_modes_timezones_budgets(self):
        for url in ['http://download.data.public.lu/a.zip','https://evil.test/a.zip','https://download.data.public.lu/a.zip?key=secret','https://user:pass@download.data.public.lu/a.zip']:
            with self.assertRaisesRegex(ValueError,'unapproved_download_origin'):
                build(feed(),url=url)
        for days in [0,1,8]:
            with self.assertRaisesRegex(ValueError,'window_requires'):
                build(feed(),days=days)
        f=feed();f['agency'].append({'agency_id':'OTHER','agency_name':'Other','agency_timezone':'Europe/London'})
        with self.assertRaisesRegex(ValueError,'mixed_or_missing'):
            build(f)
        with self.assertRaisesRegex(ValueError,'no_scheduled_trips'):
            build(feed(mode='99'))
        f=feed();f['trips'].append(copy.deepcopy(f['trips'][0]))
        with self.assertRaisesRegex(ValueError,'duplicate_or_missing_id'):
            build(f)


if __name__=='__main__':
    unittest.main()
