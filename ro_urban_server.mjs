// Private Oracle-side planner gateway for licensed Romanian urban GTFS snapshots.
// Never publish this endpoint directly to the internet. Bind host to loopback.
import {createServer} from 'node:http';
import {timingSafeEqual} from 'node:crypto';
import {readFileSync,statSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {planRomanianUrbanGtfs} from './ro_urban_gtfs.mjs';

export const REGIONS=['oradea','bucharest','cluj','iasi'];
const reply=(response,code,data)=>{
 response.statusCode=code;
 response.setHeader('Content-Type','application/json; charset=utf-8');
 response.setHeader('Cache-Control','no-store');
 response.setHeader('X-Content-Type-Options','nosniff');
 response.end(JSON.stringify(data));
};
function sameToken(received,expected){
 if(!expected||expected.length<32||typeof received!=='string')return false;
 const marker='Bearer ';
 if(!received.startsWith(marker))return false;
 const supplied=Buffer.from(received.slice(marker.length)),secret=Buffer.from(expected);
 return supplied.length===secret.length && timingSafeEqual(supplied,secret);
}
export function loadRomanianFeeds(directory){
 const feeds={};
 for(const region of REGIONS){
  try{
   const filename=join(directory,region+'.json'),stats=statSync(filename);
   if(!stats.isFile()||stats.size>150*1024*1024)continue;
   const feed=JSON.parse(readFileSync(filename,'utf8'));
   if(Array.isArray(feed.stops)&&Array.isArray(feed.trips)&&Array.isArray(feed.stop_times))
    feeds[region]=feed;
  }catch{ /* Missing or malformed feeds must never produce guessed journeys. */ }
 }
 return feeds;
}
export function createRomanianUrbanServer({token,feeds={}}={}){
 return createServer(async(request,response)=>{
  const url=new URL(request.url||'/', 'http://localhost');
  if(request.method==='GET'&&url.pathname==='/healthz')return reply(response,200,{status:'ok',service:'pocketai-romania-urban'});
  if(request.method!=='POST'||url.pathname!=='/v1/plan')return reply(response,404,{error:'not_found'});
  if(!sameToken(request.headers.authorization,token))return reply(response,401,{error:'unauthorized'});
  if(!String(request.headers['content-type']||'').toLowerCase().startsWith('application/json'))
   return reply(response,415,{error:'unsupported_media_type'});
  const pieces=[];let size=0;
  try{
   for await(const chunk of request){
    size+=chunk.length;
    if(size>4096)return reply(response,413,{error:'request_too_large'});
    pieces.push(chunk);
   }
   const body=JSON.parse(Buffer.concat(pieces).toString('utf8'));
   const region=typeof body.region==='string'?body.region:'';
   if(!REGIONS.includes(region))return reply(response,400,{error:'unsupported_region'});
   if(!feeds[region])return reply(response,503,{status:'feed_not_loaded',journeys:[]});
   const result=planRomanianUrbanGtfs(feeds[region],body.from,body.to,{
    date:body.date,afterHHMM:body.afterHHMM,
    maxStraightLineMeters:body.maxStraightLineMeters,maxResults:body.maxResults
   });
   return reply(response,200,result);
  }catch{return reply(response,400,{error:'invalid_request'});}
 });
}
if(process.argv[1]&&import.meta.url===new URL('file://'+resolve(process.argv[1])).href){
 const token=process.env.RO_GATEWAY_TOKEN||'';
 if(token.length<32)throw Error('RO_GATEWAY_TOKEN must be provisioned privately (32+ characters)');
 const dir=process.env.RO_GTFS_DATA_DIR||'/data/feeds';
 const feeds=loadRomanianFeeds(dir);
 const port=Number(process.env.PORT||3000);
 if(!Number.isSafeInteger(port)||port<1||port>65535)throw Error('bad_port');
 createRomanianUrbanServer({token,feeds}).listen(port,'0.0.0.0',()=>{
  console.info('Romania urban internal gateway started; loaded feed count',Object.keys(feeds).length);
 });
}