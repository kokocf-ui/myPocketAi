// Service-area registry. Region codes are deployment slots, NOT claims of timetable coverage.
// County codes: ISO 3166-2:RO (41 counties + Bucharest).
export const ROMANIA_REGION_CODES=Object.freeze(
  'AB AG AR B BC BH BN BR BT BV BZ CJ CL CS CT CV DB DJ GJ GL GR HD HR IF IL IS MH MM MS NT OT PH SB SJ SM SV TL TM TR VL VN VS'.split(' ')
);
export const ROMANIA_LEGACY_REGIONS=Object.freeze(['oradea','bucharest','cluj','iasi']);
export const ROMANIA_GTFS_REGIONS=Object.freeze([
  ...ROMANIA_LEGACY_REGIONS,...ROMANIA_REGION_CODES.map(code=>'ro-'+code.toLowerCase())
]);
export const ENGLAND_GTFS_REGION='england';
// England-wide national GTFS may be too large for a 1 GB container;
// this supports optional BODS regional snapshots with their documented suffixes.
export const ENGLAND_GTFS_REGIONS=Object.freeze(
  'en-ea en-em en-ne en-nw en-se en-sw en-wm en-yorkshire en-london'.split(' ')
);
export function recognizedGtfsRegion(region,country='RO'){
  if(typeof region!=='string')return false;
  return country==='GB' ? (region===ENGLAND_GTFS_REGION||ENGLAND_GTFS_REGIONS.includes(region)) :
    country==='RO' && (region==='romania'||ROMANIA_GTFS_REGIONS.includes(region));
}
const validPoint=p=>p&&p.latitude!=null&&p.longitude!=null&&
  Number.isFinite(Number(p.latitude))&&Number.isFinite(Number(p.longitude))&&
  Math.abs(Number(p.latitude))<=90&&Math.abs(Number(p.longitude))<=180;
// Bounds are deliberately coarse: server requires actually imported GTFS stops nearby.
// They are never used as proof of nationality or actual public transport coverage.
export function inRomaniaApprox(p){
  return validPoint(p)&&Number(p.latitude)>=43.58&&Number(p.latitude)<=48.28&&
    Number(p.longitude)>=20.20&&Number(p.longitude)<=29.80&&
    !['GB','UK','HU','UA','MD','RS','BG'].includes(String(p.country_code||p.countryCode||'').toUpperCase());
}
export function inEnglandApprox(p){
  return validPoint(p)&&Number(p.latitude)>=49.85&&Number(p.latitude)<=55.85&&
    Number(p.longitude)>=-6.5&&Number(p.longitude)<=2.0&&
    !['RO','FR','IE','GB-SCT','GB-WLS','GB-NIR'].includes(String(p.country_code||p.countryCode||'').toUpperCase());
}
export function pointDistanceMeters(a,b){
  if(!validPoint(a)||!validPoint(b))return Infinity;
  const r=Math.PI/180,a1=Number(a.latitude)*r,b1=Number(b.latitude)*r;
  const h=Math.sin((b1-a1)/2)**2+Math.cos(a1)*Math.cos(b1)*
    Math.sin((Number(b.longitude)-Number(a.longitude))*r/2)**2;
  return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));
}
