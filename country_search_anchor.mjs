// A country is never a geographical search anchor.
// The device's validated coordinates are the only implicit anchor.
// Explicit destinations must be resolved by the existing geocoder; they must
// never silently fall back to phone GPS, account country or interface language.
export function searchAnchorPolicy({
 hasValidGps=false,latitude,longitude,explicitDestination='',needsDestination=false
}={}){
 const query=String(explicitDestination||'').trim();
 if(needsDestination)return {mode:'clarification',locationSource:null,useDeviceGps:false};
 if(query)return {mode:'explicit_destination',locationSource:'explicit_place_query',useDeviceGps:false};
 const lat=Number(latitude),lon=Number(longitude);
 if(hasValidGps&&latitude!==null&&latitude!==undefined&&longitude!==null&&longitude!==undefined&&
  Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180){
  return {mode:'device_gps',locationSource:'browser_gps',useDeviceGps:true};
 }
 return {mode:'clarification',locationSource:null,useDeviceGps:false};
}
