// Geography-based sanity checks for VERIFIED multimodal itineraries.
// Not a list of airports, cities or privileged routes: every comparison is
// derived from the actual origin, destination and provider-supplied stop points.
// Geodesic distances are LOWER bounds, not real driving or railway distances.
const R_KM=6371.0088;
const rad=d=>d*Math.PI/180;
export function mixedPoint(p){
 if(!p||typeof p!=='object')return null;
 const lat=p.latitude??p.lat,lon=p.longitude??p.lon??p.lng??p.long;
 if(lat===null||lat===undefined||lon===null||lon===undefined)return null;
 const a=Number(lat),b=Number(lon);
 return Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a)<=90&&Math.abs(b)<=180?
  {latitude:a,longitude:b}:null;
}
export function mixedGreatCircleKm(a,b){
 const p=mixedPoint(a),q=mixedPoint(b);
 if(!p||!q)return null;
 const dlat=rad(q.latitude-p.latitude),dlon=rad(q.longitude-p.longitude);
 const h=Math.sin(dlat/2)**2+Math.cos(rad(p.latitude))*Math.cos(rad(q.latitude))*Math.sin(dlon/2)**2;
 return 2*R_KM*Math.asin(Math.min(1,Math.sqrt(h)));
}
const stopPoint=(s)=>mixedPoint(s);

/**
 * A counter-clockwise detour can be perfectly valid around a sea, mountain,
 * border closure or an airport without a direct connection. Keep generous,
 * distance-scaled room: reject only strongly implausible global excursions.
 * If coordinates are missing, NEVER invent distances or call the route
 * geography-verified. The dates/connections must still be checked separately.
 */
export function evaluateMixedJourneyGeography(path,{origin,destination,maxDetourFactor=3.5,
  corridorSlackKm=350,conflictToleranceKm=5}={}){
 const legs=Array.isArray(path)?path:[];
 if(!legs.length)return {status:'no_path',screened:false};
 const points=new Map();
 const add=(id,p)=>{
  const coord=stopPoint(p);
  if(!coord)return true;
  const other=points.get(id);
  if(other&&mixedGreatCircleKm(other,coord)>conflictToleranceKm)return false;
  if(!other)points.set(id,coord);
  return true;
 };
 if(!add(legs[0].from.id,origin)||!add(legs.at(-1).to.id,destination))
  return {status:'conflicting_stop_locations',screened:false};
 for(const leg of legs){
  if(!add(leg.from.id,leg.from)||!add(leg.to.id,leg.to))
   return {status:'conflicting_stop_locations',screened:false};
 }
 const originPt=points.get(legs[0].from.id),destPt=points.get(legs.at(-1).to.id);
 const complete=Boolean(originPt&&destPt&&legs.every(l=>points.has(l.from.id)&&points.has(l.to.id)));
 if(!complete)return {status:'coordinates_incomplete',screened:false};
 const directKm=mixedGreatCircleKm(originPt,destPt);
 const travelledKm=legs.reduce((sum,l)=>sum+mixedGreatCircleKm(points.get(l.from.id),points.get(l.to.id)),0);
 const factor=Number.isFinite(maxDetourFactor)?Math.min(8,Math.max(2,maxDetourFactor)):3.5;
 const slack=Number.isFinite(corridorSlackKm)?Math.min(1000,Math.max(150,corridorSlackKm)):350;
 // A 2km urban trip must not be rejected for an ordinary 15km rail diversion.
 const maxKm=Math.max(directKm*factor,directKm+slack,150);
 const detourFactor=directKm>0?travelledKm/directKm:null;
 return {status:travelledKm>maxKm?'excessive_geographic_detour':'plausible_geography',
  screened:true,directKm:Math.round(directKm),
  minimumPathKm:Math.round(travelledKm),maxReasonableKm:Math.round(maxKm),
  detourFactor:detourFactor===null?null:Math.round(detourFactor*100)/100};
}


/**
 * Even an authenticated timetable can have mis-mapped stops or a bad time
 * zone. Reject physically implausible point-to-point speeds only when BOTH
 * stop coordinates and unambiguous UTC instants are present. Thresholds are
 * deliberately generous; these are error checks, not realistic ETAs.
 */
export function isPlausibleMixedLegSpeed(leg){
 if(!leg)return false;
 const km=mixedGreatCircleKm(leg.from,leg.to);
 if(km===null)return true;
 const departure=Date.parse(leg.departureTime),arrival=Date.parse(leg.arrivalTime);
 const hours=(arrival-departure)/3600000;
 if(!Number.isFinite(hours)||hours<=0)return false;
 const caps={
  walking:18,bus:180,coach:180,train:460,metro:180,tram:130,
  ferry:150,flight:1500
 };
 const max=caps[leg.mode];
 if(!max)return false;
 return km/hours<=max;
}
