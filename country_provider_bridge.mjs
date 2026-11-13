// Safe adapter bridge. It does not call any provider unless the caller supplies
// both an enabled source ID and its implemented adapter. No API keys are stored here.
import {selectCountryProviders} from './smart_country_registry.mjs';
const point=x=>{
 const lat=Number(x?.latitude??x?.lat),lon=Number(x?.longitude??x?.lon);
 return Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180?{lat,lon}:null;
};
export function distanceMeters(a,b){
 const p=point(a),q=point(b);
 if(!p||!q)return null;
 const t=Math.PI/180,dlat=(q.lat-p.lat)*t,dlon=(q.lon-p.lon)*t;
 const h=Math.sin(dlat/2)**2+Math.cos(p.lat*t)*Math.cos(q.lat*t)*Math.sin(dlon/2)**2;
 return 12742000*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));
}
export async function dispatchCountrySources(request,{adapters={},enabledProviders=[],onDiagnostic=()=>{}}={}){
 const choice=selectCountryProviders({...request,enabledProviders});
 if(choice.status!=='ready')return {...choice,results:[]};
 const center=point(request);
 const radius=Number(request.radius);
 const spatial=choice.branch==='general'&&center&&Number.isFinite(radius)&&radius>0;
 const results=[],diagnostics=[];
 // Separate sources may be fetched concurrently by the backend's existing flow.
 // This isolated bridge remains sequential until its failure policy is verified.
 for(const provider of choice.providers){
  const invoke=adapters[provider];
  if(typeof invoke!=='function'){diagnostics.push({provider,status:'not_connected'});continue;}
  try{
   const rows=await invoke(request);
   if(!Array.isArray(rows)){diagnostics.push({provider,status:'invalid_response'});continue;}
   let accepted=0;
   for(const row of rows){
    const d=spatial?distanceMeters(center,row):null;
    // A geo-search result with missing coordinates is not a verified POI.
    if(spatial&&(d===null||d>radius))continue;
    results.push({...row,sourceProvider:provider});
    accepted++;
   }
   const status={provider,status:'ok',count:accepted,discarded:rows.length-accepted};
   diagnostics.push(status);onDiagnostic(status);
  }catch{
   const status={provider,status:'failed'};diagnostics.push(status);onDiagnostic(status);
  }
 }
 return {...choice,results,diagnostics};
}
