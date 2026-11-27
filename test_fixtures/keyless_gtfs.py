"""Synthetic timetable fixture, not a real operator feed or coverage evidence."""
import json
import sys
from datetime import date, datetime, timezone
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from build_keyless_gtfs_index import compile_feed, CATALOG


def feed(zone='Europe/Luxembourg',mode='3',start='20261127',a='10:10:00',b='10:40:00'):
    return {'agency':[{'agency_id':'TEST','agency_name':'Synthetic Operator','agency_timezone':zone}],
            'stops':[{'stop_id':'a','stop_name':'Synthetic Start','stop_lat':'49.6','stop_lon':'6.1'},
                     {'stop_id':'b','stop_name':'Synthetic End','stop_lat':'49.7','stop_lon':'6.2'}],
            'routes':[{'route_id':'r','agency_id':'TEST','route_short_name':'TEST','route_type':mode}],
            'trips':[{'trip_id':'t','route_id':'r','service_id':'s'}],
            'stop_times':[{'trip_id':'t','stop_id':'a','stop_sequence':'1','arrival_time':a,'departure_time':a},
                          {'trip_id':'t','stop_id':'b','stop_sequence':'2','arrival_time':b,'departure_time':b}],
            'calendar':[],'calendar_dates':[{'service_id':'s','date':start,'exception_type':'1'}],
            'feed_info':[],'transfers':[]}


def index(source_id='public_gtfs_lu'):
    source=next(s for s in json.loads(CATALOG.read_text()) if s['id']==source_id)
    return compile_feed(feed(mode='2' if source_id=='public_gtfs_fr' else '3'),source,'a'*64,date(2026,11,27),3,
                        'https://'+source['downloadHosts'][0]+'/synthetic-fixture.zip',datetime(2026,11,26,10,tzinfo=timezone.utc))


if __name__=='__main__':
    print(json.dumps(index(sys.argv[1] if len(sys.argv)>1 else 'public_gtfs_lu')))
