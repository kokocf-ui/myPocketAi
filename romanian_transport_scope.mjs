// Distinguish a local Romanian POI journey from an intercity trip before Bilo is called.
// Distances only decide provider scope, never produce an invented walking/transit itinerary.
const valid=p=>p&&p.latitude!=null&&p.longitude!=null&&Number.isFinite(Number(p.latitude))&&Number.isFinite(Number(p.longitude))&&Math.abs(Number(p.latitude))<=90&&Math.abs(Number(p.longitude))<=180;
const metres=(a,b)=>{const rad=Math.PI/180,la=Number(a.latitude)*rad,lb=Number(b.latitude)*rad;
 const dLat=lb-la,dLon=(Number(b.longitude)-Number(a.longitude))*rad;
 const h=Math.sin(dLat/2)**2+Math.cos(la)*Math.cos(lb)*Math.sin(dLon/2)**2;
 return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));};
export function romanianLocalJourneyScope({from,to,urbanRegion=false}={}){
 if(!valid(from)||!valid(to))return {localRoute:false,urbanRoute:false,distanceMeters:null};
 const distanceMeters=metres(from,to);
 // A regional feed may serve locations further apart than a city centre.
 // Within 18 km, do not pass a local POI request to an intercity-only provider.
 const localRoute=Boolean(urbanRegion)||distanceMeters<=18000;
 return {localRoute,urbanRoute:Boolean(urbanRegion),distanceMeters};
}
