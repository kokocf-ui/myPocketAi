// Offline GTFS text importer. Does not fetch external feeds.
// Use only source data that is licensed and current for the intended product.
import {statSync,readFileSync,writeFileSync,chmodSync} from 'node:fs';
import {join,resolve} from 'node:path';
const tables=['stops','routes','trips','stop_times','calendar','calendar_dates'];
const columns={
 stops:['stop_id','stop_name','stop_lat','stop_lon'],
 routes:['route_id','route_type'],
 trips:['trip_id','route_id','service_id'],
 stop_times:['trip_id','arrival_time','departure_time','stop_id','stop_sequence']
};
const limits={stops:32000000,routes:5000000,trips:150000000,stop_times:250000000,calendar:5000000,calendar_dates:15000000};
export function parseGtfsCsv(value){
 if(typeof value!=='string')throw Error('invalid_csv');
 value=value.replace(/^\uFEFF/,'');
 let current='',row=[],rows=[],quoted=false;
 for(let i=0;i<value.length;i++){
  const c=value[i];
  if(c==='"'){
   if(quoted&&value[i+1]==='"'){current+='"';i++;}
   else quoted=!quoted;
  }else if(c===','&&!quoted){row.push(current);current='';}
  else if((c==='\n'||c==='\r')&&!quoted){
   if(c==='\r'&&value[i+1]==='\n')i++;
   row.push(current);current='';
   if(row.some(x=>x.trim()!=='') )rows.push(row);
   row=[];
  }else current+=c;
 }
 if(quoted)throw Error('unclosed_csv_quote');
 if(current||row.length){row.push(current);if(row.some(x=>x.trim()!==''))rows.push(row);}
 if(!rows.length)return [];
 const keys=rows.shift().map(x=>x.trim());
 if(keys.some(x=>!x)||new Set(keys).size!==keys.length)throw Error('bad_csv_header');
 return rows.map(r=>Object.fromEntries(keys.map((k,i)=>[k,String(r[i]??'').trim()])));
}
export function importGtfsDir(dir){
 const feed={};
 for(const table of tables){
  const path=join(dir,table+'.txt');
  let bytes;
  try{
   const st=statSync(path);
   if(!st.isFile()||st.size>limits[table])throw Error('gtfs_table_too_large: '+table);
   bytes=readFileSync(path,'utf8');
  }catch(e){
   if(e.code==='ENOENT'&&!columns[table]){feed[table]=[];continue;}
   throw e;
  }
  feed[table]=parseGtfsCsv(bytes);
  if(columns[table]){
   const keys=new Set(Object.keys(feed[table][0]||{}));
   if(columns[table].some(c=>!keys.has(c)))throw Error('gtfs_missing_columns: '+table);
  }
 }
 if(!feed.calendar.length&&!feed.calendar_dates.length)throw Error('gtfs_no_calendar');
 if(!feed.stops.length||!feed.trips.length||!feed.stop_times.length)throw Error('gtfs_empty');
 return feed;
}
if(process.argv[1]&&import.meta.url===new URL('file://'+resolve(process.argv[1])).href){
 const source=process.argv[2],destination=process.argv[3];
 if(!source||!destination)throw Error('Usage: node ro_urban_gtfs_import.mjs <extracted-GTFS-directory> <private-output.json>');
 const feed=importGtfsDir(source);
 writeFileSync(destination,JSON.stringify(feed),{mode:0o600,flag:'wx'});
 chmodSync(destination,0o600);
 console.log(JSON.stringify({status:'imported',row_counts:Object.fromEntries(tables.map(t=>[t,feed[t].length]))}));
}