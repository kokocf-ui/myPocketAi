#!/usr/bin/env python3
"""Audit exact GTFS stop IDs and nearest target platform; read-only, no network."""
import math,sqlite3,sys,unicodedata

def normalize(x):
 return ''.join(c for c in unicodedata.normalize('NFD',x.casefold()) if unicodedata.category(c)!='Mn')

def meters(a,b):
 lat1,lon1,lat2,lon2=(math.radians(float(v)) for v in (a[2],a[3],b[2],b[3]))
 x=math.sin((lat2-lat1)/2)**2+math.cos(lat1)*math.cos(lat2)*math.sin((lon2-lon1)/2)**2
 return 6371000*2*math.atan2(math.sqrt(x),math.sqrt(max(0,1-x)))

def main():
 if len(sys.argv)!=3:
  raise SystemExit("usage: python3 audit-stop-distances.py <sqlite-db> <destination-station-name>")
 db,target=sys.argv[1:]
 con=sqlite3.connect('file:'+db+'?mode=ro',uri=True)
 try:
  ids=('7353','7352','3642','7434')
  q=','.join('?' for _ in ids)
  stations={str(r[0]):r for r in con.execute(
   f'SELECT stop_id,stop_name,stop_lat,stop_lon FROM stops WHERE stop_id IN ({q})',ids)}
  target_rows=[r for r in con.execute('SELECT stop_id,stop_name,stop_lat,stop_lon FROM stops')
               if normalize(target) in normalize(str(r[1]))]
  if not target_rows:raise ValueError('destination_not_found')
  print('Destinatie:',target,'GTFS platforms:',len(target_rows))
  for sid in ids:
   station=stations.get(sid)
   if not station:
    print('Stop',sid,'missing');continue
   nearest=min(target_rows,key=lambda x:meters(station,x))
   print(f'ID {sid} ({station[1]}) -> {target} ID {nearest[0]}: {round(meters(station,nearest))} m direct')
  if all(x in stations for x in ('7353','7352')):
   a,b=stations['7353'],stations['7352']
   print(f'141 stop IDs 7353 -> 7352: {round(meters(a,b))} m direct')
  print('NOTE: direct-line distances are NOT verified pedestrian routes.')
 finally:con.close()

if __name__=='__main__':
 main()
