// Shared acceptance rules, not a shared provider protocol. Countries keep their
// own requests/normalizers. Only verify the actual points supplied by each API.
export const nationalBusOnly=j=>j.legs.some(l=>['bus','coach','trolleybus'].includes(l.mode))&&j.legs.every(l=>['walking','bus','coach','trolleybus'].includes(l.mode));
const key=p=>p.latitude.toFixed(6)+','+p.longitude.toFixed(6);
const valid=p=>p&&typeof p.latitude==='number'&&typeof p.longitude==='number'&&Number.isFinite(p.latitude)&&Number.isFinite(p.longitude)&&Math.abs(p.latitude)<=90&&Math.abs(p.longitude)<=180;
export async function verifyDomesticJourneys(candidates,country,verifyCountry){
 const countryCache=new Map();let checks=0,rejected=0;
 const deadline=Date.now()+6500;
 const verify=p=>{
  const k=key(p);if(countryCache.has(k))return countryCache.get(k);
  if(checks>=36||Date.now()>=deadline)return Promise.resolve(null);
  checks++;
  const job=Promise.resolve().then(()=>verifyCountry(p)).catch(()=>null);
  const bounded=new Promise(resolve=>{const timer=setTimeout(()=>resolve(null),Math.max(1,deadline-Date.now()));
   job.then(v=>{clearTimeout(timer);resolve(v);});});
  countryCache.set(k,bounded);return bounded;
 };
 const seen=new Set(),journeys=[];
 for(const j of candidates){
  if(!/^[A-Z]{2}$/.test(country)||typeof verifyCountry!=='function'||!Array.isArray(j._countryCheckPoints)||
     !j._countryCheckPoints.length||j._countryCheckPoints.some(p=>!valid(p))){rejected++;continue;}
  const points=[...new Map(j._countryCheckPoints.map(p=>[key(p),p])).values()];
  if(points.length>36){rejected++;continue;}
  let domestic=true;
  for(let i=0;i<points.length;i+=4){
   const countries=await Promise.all(points.slice(i,i+4).map(verify));
   if(countries.some(c=>c!==country)){domestic=false;break;}
  }
  if(!domestic){rejected++;continue;}
  const signature=JSON.stringify(j.legs.map(l=>[l.mode,l.fromStopId,l.toStopId,l.from,l.to,l.departureTime,l.arrivalTime,l.lineNames]));
  if(seen.has(signature))continue;seen.add(signature);
  const {_countryCheckPoints,...publicJourney}=j;
  journeys.push({...publicJourney,stop_countries_verified:true});
 }
 return {journeys,checks,rejected};
}
export function selectNationalJourneys(journeys,limit){
 const sorted=[...journeys].sort((a,b)=>Date.parse(a.arrivalDateTime)-Date.parse(b.arrivalDateTime));
 const max=Math.min(6,Math.max(1,Math.floor(Number(limit))||4)),selected=sorted.slice(0,max),road=sorted.find(nationalBusOnly);
 if(max>1&&road&&!selected.some(nationalBusOnly)){if(selected.length>=max)selected.pop();selected.push(road);selected.sort((a,b)=>Date.parse(a.arrivalDateTime)-Date.parse(b.arrivalDateTime));}
 return selected;
}
