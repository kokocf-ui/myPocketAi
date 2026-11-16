import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtempSync,rmSync,utimesSync,writeFileSync,truncateSync,statSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {openGtfsFeedCatalog} from './regional_gtfs_catalog.mjs';
import {planRomanianUrbanGtfs} from './ro_urban_gtfs.mjs';

const python=(args,stdin)=> {
 const r=spawnSync('python3',args,{encoding:'utf8',input:stdin,timeout:30000});
 assert.equal(r.status,0,r.stderr||'Python process failed');
 return r.stdout.trim();
};

test('SQLite GTFS import: real file, indexed regional query, transfer, expiry and stale index',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'pocketai-gtfs-sql-'));
 try{
  const zip=join(dir,'sample.zip');
  const db=join(dir,'ro-b.sqlite3');
  const fixture=String.raw`
import sys,zipfile
files={
'stops.txt':'stop_id,stop_name,stop_lat,stop_lon\na,Origin,44.43,26.10\nb,Transfer,44.44,26.11\nc,Destination,44.45,26.12\n',
'routes.txt':'route_id,route_short_name,route_type\nr1,10,3\nr2,20,0\n',
'trips.txt':'trip_id,route_id,service_id\nt1,r1,WK\nt2,r2,WK\n',
'stop_times.txt':'trip_id,arrival_time,departure_time,stop_id,stop_sequence\nt1,09:00:00,09:00:00,a,1\nt1,09:10:00,09:10:00,b,2\nt2,09:17:00,09:17:00,b,1\nt2,09:25:00,09:25:00,c,2\n',
'calendar.txt':'service_id,monday,tuesday,wednesday,thursday,friday,saturday,sunday,start_date,end_date\nWK,1,1,1,1,1,1,1,20260101,20270105\n'}
with zipfile.ZipFile(sys.argv[1],'w') as z:
 for name,value in files.items():z.writestr(name,value)
`;
  python(['-c',fixture,zip]);
  const py='gtfs_sqlite_store.py';
  assert.match(python([py,'import',zip,db,'ro-b','RO']),/imported/);
  assert.match(python([py,'index',db,'ro-b','RO']),/indexed/);
  const catalog=openGtfsFeedCatalog(dir,{country:'RO'});
  assert.equal(catalog.count,1);
  const from={latitude:44.43,longitude:26.10};
  const to={latitude:44.45,longitude:26.12};
  const matches=catalog.match(from,to,700);
  assert.equal(matches.length,1);
  const feed=await matches[0].load({from,to,date:'2026-11-16',radius:700});
  assert.equal(feed.trips.length,2);
  const planned=planRomanianUrbanGtfs(feed,from,to,{date:'2026-11-16',afterHHMM:'08:40'});
  assert.equal(planned.status,'success',JSON.stringify(planned));
  assert.equal(planned.journeys[0].legs.length,2);
  assert.equal(planned.journeys[0].legs[0].lineNames[0],'10');
  assert.equal(planned.journeys[0].legs[1].lineNames[0],'20');
  const missing=await matches[0].load({from,to,date:'2027-02-01',radius:700});
  assert.equal(missing.__sqlite_status,'no_service_on_date');
  const {status}=JSON.parse(python([py,'query',db],JSON.stringify({from,to,date:'2026-11-16',radius:700})));
  assert.equal(status,'success');
  // A changed database without explicit reindex must not be silently served.
  const far=new Date('2025-01-01T00:00:00Z');
  utimesSync(db,far,far);
  assert.equal(openGtfsFeedCatalog(dir,{country:'RO'}).count,0);
 }finally{rmSync(dir,{recursive:true,force:true});}
});

test('England BODS catalog accepts large on-disk SQLite snapshots without loading them',()=>{
 const dir=mkdtempSync(join(tmpdir(),'pocketai-bods-large-index-'));
 const region='en-london',db=join(dir,region+'.sqlite3'),idx=join(dir,region+'.index.json');
 try {
  // Sparse file: simulates a 1.2 GB BODS database without allocating that disk space.
  writeFileSync(db,'');
  truncateSync(db,1_200_000_000);
  const s=statSync(db);
  const doc={schema:2,backend:'sqlite',region,country:'GB',timeZone:'Europe/London',
    snapshotBytes:s.size,snapshotMtimeMs:Math.trunc(s.mtimeMs),
    positions:[[51.51,-0.12],[51.52,-0.13]]};
  writeFileSync(idx,JSON.stringify(doc));
  const catalog=openGtfsFeedCatalog(dir,{country:'GB'});
  assert.equal(catalog.count,1,'1.2 GB valid indexed SQLite snapshot must be discoverable');
  const near=catalog.match({latitude:51.51,longitude:-0.12},
    {latitude:51.52,longitude:-0.13},100);
  assert.equal(near.length,1,'large database is matched by its small coordinate index');
  // No query is made against the sparse placeholder: real journey reads require valid SQLite.
  // Stale size metadata must disable the snapshot rather than serving unverified data.
  truncateSync(db,1_200_000_001);
  assert.equal(openGtfsFeedCatalog(dir,{country:'GB'}).count,0,
    'changed snapshot without matching index must stay offline');
 } finally {rmSync(dir,{recursive:true,force:true});}
});
