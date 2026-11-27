// Adapt an ACTUAL standalone walking-router response, never a straight line or
// a guessed walking speed. Timing is explicitly a duration estimate, not a bus
// timetable. Snapped/nearby approaches cannot certify arrival at an exact point.
import {mixedGreatCircleKm} from './mixed_route_quality.mjs';
export function walkingRouteConnection(data,from,to,departureAt){
 const route=data?.route;
 const start=typeof departureAt==='string'&&/(Z|[+-]\d\d:\d\d)$/.test(departureAt)?Date.parse(departureAt):NaN;
 if(data?.route_available!==true||!['walk','foot'].includes(route?.profile)||
  route.access_kind==='nearby_pedestrian_path'||route.arrival_verified===false||
  !Number.isFinite(start)||typeof route.durationSeconds!=='number'||route.durationSeconds<=0||route.durationSeconds>7200||
  typeof route.distanceMeters!=='number'||route.distanceMeters<=0||route.distanceMeters>8000||
  !Array.isArray(route.coordinates)||route.coordinates.length<2||route.coordinates.length>30000)return null;
 const coordinates=route.coordinates;
 if(coordinates.some(c=>!Array.isArray(c)||c.length<2||typeof c[0]!=='number'||typeof c[1]!=='number'||
  !Number.isFinite(c[0])||!Number.isFinite(c[1])||Math.abs(c[0])>180||Math.abs(c[1])>90))return null;
 const point=c=>({latitude:c[1],longitude:c[0]});
 const first=point(coordinates[0]),last=point(coordinates.at(-1));
 const a=mixedGreatCircleKm(first,from),b=mixedGreatCircleKm(last,to);
 if(a===null||b===null||a>.075||b>.075)return null;
 // Reject a malformed provider duration without replacing it with our own.
 if(route.distanceMeters/route.durationSeconds>3)return null;
 const departure=new Date(start).toISOString(),arrival=new Date(start+route.durationSeconds*1000).toISOString();
 const leg={mode:'walking',from:String(from.label||'Origin'),to:String(to.label||'Destination'),
  departurePoint:first,arrivalPoint:last,departureTime:departure,arrivalTime:arrival,
  durationMinutes:route.durationSeconds/60,distanceMeters:route.distanceMeters,coordinates,
  steps:Array.isArray(route.steps)?route.steps:[],geometryAvailable:true,timingEstimated:true};
 return {provider:'Existing standalone pedestrian router',time_zone:'UTC',startDateTime:departure,arrivalDateTime:arrival,
  durationMinutes:leg.durationMinutes,legs:[leg],routeSegments:[leg],geometryAvailable:true,
  schedule_status:'walking_duration_estimate',timingEstimated:true,walkingRoute:route};
}
