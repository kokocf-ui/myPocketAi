// TfL Journey path.lineString is normally a JSON [latitude,longitude] array,
// NOT a Google polyline string. The map contract is [longitude,latitude].
import {mixedGreatCircleKm} from './mixed_route_quality.mjs';
function encodedPoints(value){
 if(typeof value!=='string'||!value||value.length>300000||!/^[?-~]+$/.test(value))return [];
 let index=0,lat=0,lon=0;const points=[];
 const read=()=>{
  let result=0,shift=0,byte;
  do{if(index>=value.length||shift>30)throw Error('invalid_polyline');byte=value.charCodeAt(index++)-63;result|=(byte&31)<<shift;shift+=5}while(byte>=32);
  return result&1?~(result>>1):result>>1;
 };
 try{while(index<value.length){lat+=read();lon+=read();points.push([lon/1e5,lat/1e5]);if(points.length>20000)return []}}catch{return []}
 return points;
}
export function tflJourneyCoordinates(leg){
 let coordinates=[];
 try{
  const path=leg?.path||{},line=path.lineString;
  if(Array.isArray(line)||typeof line==='string'&&line.trimStart().startsWith('[')){
   if(typeof line==='string'&&line.length>1000000)return [];
   const rows=Array.isArray(line)?line:JSON.parse(line);
   if(!Array.isArray(rows)||rows.length>20000||rows.some(p=>!Array.isArray(p)||p.length!==2||typeof p[0]!=='number'||typeof p[1]!=='number'))return [];
   coordinates=rows.map(([lat,lon])=>[lon,lat]);
  }else coordinates=encodedPoints(path.lineStringEncoded||line);
  if(coordinates.length<2||coordinates.some(p=>!Number.isFinite(p[0])||!Number.isFinite(p[1])||Math.abs(p[0])>180||Math.abs(p[1])>90))return [];
  const first=coordinates[0],last=coordinates.at(-1),a=mixedGreatCircleKm({latitude:first[1],longitude:first[0]},leg.departurePoint),b=mixedGreatCircleKm({latitude:last[1],longitude:last[0]},leg.arrivalPoint);
  // A syntactically decodable string near (0,0) is not evidence of a London
  // route. Missing/conflicting endpoints hide geometry, never draw a fake line.
  if(a===null||b===null||a>1.5||b>1.5)return [];
  return coordinates;
 }catch{return []}
}
