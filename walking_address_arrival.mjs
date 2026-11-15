// Verify that a mapped storefront route reaches its addressed street, not the back of a nearby block.
// Geoapify explicitly warns that walking waypoints can be moved to a different routable path.
const norm=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
 .toLowerCase().replace(/\b(?:rd)\b/g,'road').replace(/\b(?:st)\b/g,'street')
 .replace(/\b(?:ave)\b/g,'avenue').replace(/\b(?:ln)\b/g,'lane')
 .replace(/\b(?:dr)\b/g,'drive').replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
const sameStreet=(left,right)=>{
 const a=norm(left),b=norm(right);
 return Boolean(a&&b&&(a===b||a.startsWith(b+' ')||b.startsWith(a+' ')));
};
const distanceMeters=(a,b)=>{
 const lat1=Number(a?.latitude),lon1=Number(a?.longitude),lat2=Number(b?.latitude),lon2=Number(b?.longitude);
 if(![lat1,lon1,lat2,lon2].every(Number.isFinite))return Infinity;
 const p=Math.PI/180,dy=(lat2-lat1)*p,dx=(lon2-lon1)*p;
 const h=Math.sin(dy/2)**2+Math.cos(lat1*p)*Math.cos(lat2*p)*Math.sin(dx/2)**2;
 return 12742017.6*Math.asin(Math.min(1,Math.sqrt(h)));
};
export function walkingAddressFromLabel(label){
 const parts=String(label||'').split(',').map(s=>s.trim()).filter(Boolean);
 for(let i=0;i<parts.length;i++){
  const match=parts[i].match(/^(\d{1,5}[a-z]?(?:[\/-]\d+[a-z]?)?)\s+(.+)$/i);
  if(!match)continue;
  const street=match[2].trim();
  if(!/\b(?:road|rd|street|st|lane|ln|avenue|ave|drive|dr|way|close|crescent|place|square|terrace|court|boulevard|parade|quay|strada|rue|via|calle|strasse|straße)\b[.]?$/i.test(street))continue;
  const address=parts.slice(i).join(', ');
  const postcode=address.match(/\b([A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2})\b/i)?.[1]||'';
  return {number:match[1],street,address,postcode:postcode.replace(/\s/g,'').toUpperCase()};
 }
 return null;
}
export function checkWalkingArrival(route,target,address){
 if(!address)return {ok:true,reason:'address_not_identified'};
 const end=route?.coordinates?.at(-1);
 const finalPoint=Array.isArray(end)?{longitude:end[0],latitude:end[1]}:null;
 const offset=distanceMeters(target,finalPoint);
 const steps=Array.isArray(route?.steps)?route.steps:[];
 let lastStreet='';
 for(let i=steps.length-1;i>=0&&!lastStreet;i--){
  for(const street of Array.isArray(steps[i].streets)?steps[i].streets:[]){
   if(norm(street)&&!/^(?:unnamed|unknown|road|street|path|footway)$/.test(norm(street))){
    lastStreet=street;break;
   }
  }
 }
 const streetMismatch=Boolean(lastStreet&&!sameStreet(lastStreet,address.street));
 // For a precisely addressed storefront, do not accept a route that ends far
 // from its input pin even when its last street is unnamed.
 const moved=offset>65;
 return {ok:!streetMismatch&&!moved,reason:streetMismatch?'different_arrival_street':moved?'moved_arrival_waypoint':'verified',
  lastStreet,offsetMeters:offset};
}
export function verifiedAddressGeocode(features,address,original){
 for(const feature of Array.isArray(features)?features:[]){
  const p=feature?.properties||{};
  if(norm(p.housenumber)!==norm(address.number)||!sameStreet(p.street,address.street))continue;
  const post=String(p.postcode||'').replace(/\s/g,'').toUpperCase();
  if(address.postcode&&post&&post!==address.postcode)continue;
  const latitude=Number(p.lat??feature?.geometry?.coordinates?.[1]);
  const longitude=Number(p.lon??feature?.geometry?.coordinates?.[0]);
  if(!Number.isFinite(latitude)||!Number.isFinite(longitude))continue;
  const point={latitude,longitude};
  if(distanceMeters(point,original)>150)continue;
  return point;
 }
 return null;
}
