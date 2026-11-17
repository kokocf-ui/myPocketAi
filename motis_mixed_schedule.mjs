// Date-aware ordering of complete MOTIS v6 itineraries from a licensed provider.
// Do not generate connections or infer services from nearby place names.
const ms=value=>{
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(value))return null;
 const n=Date.parse(value);return Number.isFinite(n)?n:null;
};
const nonWalking=leg=>!/^(walking|walk|foot|pedestrian)$/i.test(String(leg?.mode||''));
const modeSignature=journey=>journey.legs.filter(nonWalking).map(x=>String(x.mode||'').toLowerCase()).join(' → ');

export function motisQueryDepartureAt(input,now=Date.now()){
 if(input===null||input===undefined||input==='')return {status:'now',iso:null,ms:now};
 const timestamp=ms(input);
 if(timestamp===null||timestamp<now-120000||timestamp>now+60*86400000)
  return {status:'invalid_departure_time',iso:null,ms:null};
 return {status:'scheduled',iso:new Date(timestamp).toISOString(),ms:timestamp};
}

/** Prefer diversity of available vehicle combinations while preserving fastest
 * arrival ordering. Never label an unknown date/price as verified. */
export function selectScheduledMOTISAlternatives(raw,{departureAt=null,limit=8,now=Date.now()}={}){
 const requested=motisQueryDepartureAt(departureAt,now);
 if(requested.status==='invalid_departure_time')return [];
 const candidates=(Array.isArray(raw)?raw:[]).filter(j=>{
  if(!j||!Array.isArray(j.legs)||!j.legs.some(nonWalking))return false;
  const start=ms(j.startDateTime),end=ms(j.arrivalDateTime);
  return start!==null&&end!==null&&end>start&&start>=requested.ms-60000&&
   j.legs.every(l=>ms(l.departureTime)!==null&&ms(l.arrivalTime)!==null);
 }).sort((a,b)=>ms(a.arrivalDateTime)-ms(b.arrivalDateTime)||
                      ms(a.startDateTime)-ms(b.startDateTime)||
                      Number(a.transferCount||0)-Number(b.transferCount||0));
 const cap=Math.max(1,Math.min(12,Math.trunc(Number(limit)||8)));
 const result=[],chosen=new Set(),signatures=new Set();
 for(let i=0;i<candidates.length&&result.length<cap;i++){
  const signature=modeSignature(candidates[i]);
  if(signatures.has(signature))continue;
  signatures.add(signature);chosen.add(i);result.push(candidates[i]);
 }
 for(let i=0;i<candidates.length&&result.length<cap;i++){
  if(!chosen.has(i))result.push(candidates[i]);
 }
 return result.sort((a,b)=>ms(a.arrivalDateTime)-ms(b.arrivalDateTime)||
                   ms(a.startDateTime)-ms(b.startDateTime)||
                   Number(a.transferCount||0)-Number(b.transferCount||0));
}
