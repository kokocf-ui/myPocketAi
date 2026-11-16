// Read a bounded, location-specific slice from an indexed, private GTFS SQLite snapshot.
// Never pass travel coordinates through command-line args or log them.
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const program=fileURLToPath(new URL('./gtfs_sqlite_store.py',import.meta.url));

export function queryGtfsSqlite(snapshot,{from,to,date,radius=700}={}) {
  return new Promise((resolve,reject)=>{
    const child=spawn('python3',[program,'query',snapshot],{
      stdio:['pipe','pipe','pipe'],
      env:{PATH:process.env.PATH||'/usr/bin:/bin',PYTHONDONTWRITEBYTECODE:'1'}
    });
    let result='',error='',bytes=0,closed=false;
    const timer=setTimeout(()=>child.kill('SIGKILL'),12000);
    const fail=e=>{if(!closed){closed=true;clearTimeout(timer);child.kill('SIGKILL');reject(e);}};
    child.on('error',fail);
    child.stdout.on('data',part=>{
      bytes+=part.length;
      if(bytes>32*1024*1024)return fail(Error('gtfs_sqlite_result_too_large'));
      result+=part.toString('utf8');
    });
    child.stderr.on('data',part=>{if(error.length<1024)error+=part.toString('utf8').slice(0,1024);});
    child.on('close',code=>{
      if(closed)return;
      closed=true;clearTimeout(timer);
      if(code!==0)return reject(Error('gtfs_sqlite_query_failed'));
      try{resolve(JSON.parse(result));}
      catch{reject(Error('gtfs_sqlite_invalid_response'));}
    });
    const payload=JSON.stringify({from,to,date,radius});
    if(Buffer.byteLength(payload)>4096)return fail(Error('gtfs_sqlite_request_too_large'));
    child.stdin.on('error',fail);
    child.stdin.end(payload);
  });
}
