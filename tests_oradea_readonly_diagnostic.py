import csv
import io
import json
import subprocess
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent/'scripts'))
from diagnose_oradea_readonly import API,FEED,CASES,inspect_feed,query_local,get_bytes


def archive():
    data=io.BytesIO()
    with zipfile.ZipFile(data,'w') as z:
        tables={'agency':[{'agency_timezone':'Europe/Bucharest'}],
          'stops':[{'stop_id':'s','stop_name':'Private raw row must not be saved'}],
          'routes':[{'route_id':'r'}],'trips':[{'trip_id':'t'}],
          'calendar':[{'service_id':'s','start_date':'20261101','end_date':'20261231',**{d:'1' for d in ('monday','tuesday','wednesday','thursday','friday','saturday','sunday')}}],
          'calendar_dates':[{'service_id':'s','date':'20261205','exception_type':'2'}]}
        for name,rows in tables.items():
            out=io.StringIO();w=csv.DictWriter(out,fieldnames=list(rows[0]));w.writeheader();w.writerows(rows);z.writestr(name+'.txt',out.getvalue())
    return data.getvalue()


class ReadonlyTests(unittest.TestCase):
    def test_feed_inspected_once_in_memory_summary_not_rows(self):
        calls=[]
        def request(url,**options):
            calls.append(url);self.assertEqual(options['limit'],5*1024*1024)
            return 200,archive(),{'Content-Type':'application/zip'}
        report=inspect_feed(request)
        self.assertEqual(calls,[FEED]);self.assertEqual(report['rows'],{'stops':1,'routes':1,'trips':1})
        self.assertEqual(report['requestedDates'][0]['activeServiceIds'],1)
        self.assertEqual(report['requestedDates'][1]['activeServiceIds'],0)
        self.assertNotIn('Private raw row',json.dumps(report))
        self.assertFalse(report['productionImport']);self.assertEqual(len(report['sha256']),64)

    def test_fixed_public_local_requests_no_mixed_or_national_fallback(self):
        calls=[]
        def request(url,**options):
            calls.append(url);body=json.loads(options['data'])
            for flag in ('mixed_journey','mixed_composition','national_public_transport'):
                self.assertFalse(body[flag])
            self.assertEqual(body['module'],'maps');self.assertEqual(body['history'],[])
            self.assertEqual(body['location']['country_code'],'RO');self.assertEqual(body['transit_destination']['country_code'],'RO')
            self.assertEqual(body['transit_count'],1)
            return 200,json.dumps({'mixed_journey':True,'transit_provider':'Romania GTFS static',
               'reason':'ro_urban_feed_unavailable','provider_status':{'ro_urban':'feed_not_loaded','region':'oradea','private':'must not save'}}).encode(),{}
        for case,when in CASES:
            result=query_local(case,when,request)
            self.assertEqual(result['providerStatus'],{'ro_urban':'feed_not_loaded','region':'oradea'})
            self.assertNotIn('must not save',json.dumps(result))
        self.assertEqual(calls,[API,API])

    def test_legacy_control_keeps_points_time_but_removes_country_hints(self):
        def request(url,**options):
            body=json.loads(options['data'])
            self.assertNotIn('country_code',body['journey_origin'])
            self.assertNotIn('country_code',body['transit_destination'])
            self.assertEqual(body['journey_origin']['latitude'],47.043244)
            self.assertEqual(body['transit_departure_at'],CASES[0][1])
            return 200,json.dumps({'transit_provider':'Romania GTFS static'}).encode(),{}
        result=query_local('legacy_oradea_dispatch',CASES[0][1],request)
        self.assertEqual(result['case'],'legacy_oradea_dispatch')

    def test_unknown_destinations_or_provider_expansion_refused(self):
        with self.assertRaisesRegex(ValueError,'unapproved'):
            get_bytes('https://api.entur.io/')
        for payload in [{'flight_candidates':[{}]},{'operator_options':[{}]},{'transit_provider':'Bilo'}]:
            with self.assertRaisesRegex(ValueError,'unexpected'):
                query_local(*CASES[0],request=lambda *a,**k:(200,json.dumps(payload).encode(),{}))

    def test_invalid_archive_and_http_do_not_import_anything(self):
        report=inspect_feed(lambda *a,**k:(503,b'unavailable',{}))
        self.assertEqual(report['http'],503);self.assertFalse(report['productionImport'])
        with self.assertRaises(zipfile.BadZipFile):
            inspect_feed(lambda *a,**k:(200,b'not zip',{}))
        data=io.BytesIO()
        with zipfile.ZipFile(data,'w') as z:
            for i in range(41):z.writestr(str(i),'x')
        with self.assertRaisesRegex(ValueError,'archive_budget'):
            inspect_feed(lambda *a,**k:(200,data.getvalue(),{}))

    def test_cli_network_opt_in_required(self):
        with tempfile.TemporaryDirectory() as folder:
            output=Path(folder)/'summary.json'
            run=subprocess.run([sys.executable,'scripts/diagnose_oradea_readonly.py','--output',str(output)],capture_output=True,text=True)
            self.assertEqual(run.returncode,0,run.stderr)
            report=json.loads(output.read_text())
            self.assertEqual(report['status'],'not_run');self.assertEqual(report['cases'],[])
            self.assertFalse(report['deploymentChanged']);self.assertFalse(report['productionFeedImported'])

    def test_workflow_is_exclusive_no_secret_bindings_for_new_job(self):
        text=Path('.github/workflows/mixed-live-diagnostic.yml').read_text()
        job=text.split('  oradea-readonly:',1)[1].split('  live-mixed:',1)[0]
        self.assertIn('if: inputs.probe_oradea_readonly == true',job)
        self.assertIn('if: inputs.probe_oradea_readonly != true',text)
        self.assertNotIn('secrets.',job);self.assertNotIn('wrangler',job);self.assertNotIn('deploy',job)
        self.assertIn('--allow-network',job)


if __name__=='__main__':
    unittest.main()
