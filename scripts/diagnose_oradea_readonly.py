#!/usr/bin/env python3
"""Manual, read-only Oradea diagnostic. No deployment, credentials or imports.

Two fixed public synthetic local queries, no flight/mixed/paid search request.
One bounded public GTFS inspection in memory; only aggregate metadata is saved,
not the ZIP, stop tables, timetable rows or passenger data. This is NOT a licence
approval or permission for periodic downloading/production redistribution.
"""
import argparse
import csv
import hashlib
import io
import json
import urllib.error
import urllib.request
import zipfile
from datetime import datetime, timezone
from pathlib import Path

API='https://lifewise-ai-v2.kokocf.workers.dev/api/chat'
FEED='https://external.gtfs.ro/oradea/ORADEA.zip'
ORIGIN={'latitude':47.043244,'longitude':21.95854,'label':'Public synthetic Oradea coach endpoint','country_code':'RO'}
DESTINATION={'latitude':47.0612,'longitude':21.9473,'label':'Public synthetic Oradea final endpoint','country_code':'RO'}
CASES=(('daytime','2026-12-03T10:00:00+02:00'),('previous_nighttime_case','2026-12-05T02:05:00+02:00'))


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self,req,fp,code,msg,headers,newurl):
        return None


def get_bytes(url, *, data=None, limit=2*1024*1024):
    if url not in (API,FEED):
        raise ValueError('unapproved_diagnostic_url')
    req=urllib.request.Request(url,data=data,headers={'Accept':'application/json' if data else 'application/zip',
        'User-Agent':'myPocketAI-Oradea-readonly-diagnostic/1.0',**({'Content-Type':'application/json'} if data else {})})
    try:
        response=urllib.request.build_opener(NoRedirect()).open(req,timeout=35)
    except urllib.error.HTTPError as e:
        response=e
    with response as r:
        body=r.read(limit+1)
        if len(body)>limit:
            raise ValueError('diagnostic_response_too_large')
        return r.status,body,{k:r.headers.get(k) for k in ('Content-Type','Content-Length','Last-Modified','ETag')}


def inspect_feed(request=get_bytes):
    status,raw,headers=request(FEED,limit=5*1024*1024)
    report={'http':status,'headers':headers,'bytes':len(raw),'source':FEED,'productionImport':False,'reuseReview':'unresolved'}
    if status!=200:
        return report
    report['sha256']=hashlib.sha256(raw).hexdigest()
    with zipfile.ZipFile(io.BytesIO(raw)) as archive:
        members=archive.infolist()
        if len(members)>40 or len({i.filename for i in members})!=len(members) or sum(i.file_size for i in members)>50*1024*1024:
            raise ValueError('archive_budget_or_duplicate_members')
        def rows(name):
            if name not in archive.namelist():
                return []
            if archive.getinfo(name).file_size>20*1024*1024:
                raise ValueError('table_budget')
            with archive.open(name) as source:
                return list(csv.DictReader(io.TextIOWrapper(source,encoding='utf-8-sig',newline='')))
        calendars,exceptions=rows('calendar.txt'),rows('calendar_dates.txt')
        if not calendars and not exceptions:
            raise ValueError('missing_service_calendar')
        info=rows('feed_info.txt')
        report.update({'agencyTimezones':sorted({a.get('agency_timezone','') for a in rows('agency.txt')}),
          'rows':{name:len(rows(name+'.txt')) for name in ('stops','routes','trips')},
          'calendarRows':len(calendars),'calendarExceptionRows':len(exceptions),
          'calendarStartMin':min((c.get('start_date','') for c in calendars),default=None),
          'calendarEndMax':max((c.get('end_date','') for c in calendars),default=None),
          'exceptionDateMin':min((e.get('date','') for e in exceptions),default=None),
          'exceptionDateMax':max((e.get('date','') for e in exceptions),default=None),
          'feedInfoDates':[{k:i.get(k) for k in ('feed_start_date','feed_end_date','feed_version')} for i in info[:3]],
          'attributionTablePresent':'attributions.txt' in archive.namelist()})
        coverage=[]
        days=('monday','tuesday','wednesday','thursday','friday','saturday','sunday')
        for case,when in CASES:
            day=when[:10].replace('-','');weekday=days[datetime.fromisoformat(when).weekday()]
            active={c.get('service_id') for c in calendars if c.get('start_date','')<=day<=c.get('end_date','') and c.get(weekday)=='1'}
            for e in exceptions:
                if e.get('date')==day:
                    if e.get('exception_type')=='1':active.add(e.get('service_id'))
                    elif e.get('exception_type')=='2':active.discard(e.get('service_id'))
            coverage.append({'case':case,'localDate':when[:10],'activeServiceIds':len(active)})
        report['requestedDates']=coverage
    return report


def query_local(case,when,request=get_bytes):
    body={'message':'Transport public','language':'ro','module':'maps','history':[],
      'location_requested':True,'location':ORIGIN,'coordinates':ORIGIN,'journey_origin':ORIGIN,
      'transit_destination':DESTINATION,'transit_query':DESTINATION['label'],'transit_departure_at':when,
      'mixed_journey':False,'mixed_composition':False,'national_public_transport':False,'transit_count':1}
    status,raw,_=request(API,data=json.dumps(body).encode(),limit=2*1024*1024)
    payload=json.loads(raw)
    # Legacy urban responses themselves set mixed_journey=true, even when the
    # request disables mixed search. Inspect actual foreign-source evidence.
    if payload.get('flight_candidates') or payload.get('operator_options') or payload.get('flight_search_status'):
        raise ValueError('unexpected_mixed_response_stop_diagnostic')
    provider=payload.get('transit_provider')
    if provider not in (None,'Romania GTFS static','GTFS operator route topology'):
        raise ValueError('unexpected_provider_stop_diagnostic')
    provider_status=payload.get('provider_status') or {}
    return {'case':case,'requestedAt':when,'http':status,'reason':payload.get('reason'),
      'provider':provider,'providerStatus':{k:provider_status.get(k) for k in ('ro_urban','region')},
      'scheduledJourneys':len(payload.get('transit') or []),'routeOnlyCount':len(payload.get('route_options_without_schedule') or []),
      'transportLinesAvailable':payload.get('transport_lines_available'),'transitAvailable':payload.get('transit_available')}


def notice(title,data):
    escaped=json.dumps(data,ensure_ascii=False).replace('%','%25').replace('\r','%0D').replace('\n','%0A')
    print('::notice title='+title+'::'+escaped)


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--allow-network',action='store_true')
    parser.add_argument('--output',type=Path,default=Path('.bundle-check/oradea-readonly.json'))
    args=parser.parse_args()
    report={'diagnosticOnly':True,'deploymentChanged':False,'productionFeedImported':False,
      'countrywideCoverageVerified':False,'startedAt':datetime.now(timezone.utc).isoformat(),'cases':[],
      'status':'not_run','reason':'explicit_allow_network_required'}
    if args.allow_network:
        report.pop('reason');report['status']='diagnostic_completed_not_acceptance'
        try:
            report['publicFeed']=inspect_feed();notice('oradea-public-feed',report['publicFeed'])
        except Exception as error:
            report['publicFeed']={'status':'inspection_failed','errorType':type(error).__name__}
            notice('oradea-public-feed',report['publicFeed']);report['status']='diagnostic_incomplete'
        for case,when in CASES:
            try:
                result=query_local(case,when);report['cases'].append(result);notice('oradea-live-case',result)
            except Exception as error:
                report['cases'].append({'case':case,'status':'probe_failed','errorType':type(error).__name__})
                report['status']='diagnostic_incomplete';notice('oradea-live-case',report['cases'][-1]);break
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    notice('oradea-diagnostic-summary',{'status':report['status'],'caseCount':len(report['cases']),'deploymentChanged':False,'productionFeedImported':False})
    if report['status']=='diagnostic_incomplete':
        raise SystemExit(2)


if __name__=='__main__':
    main()
