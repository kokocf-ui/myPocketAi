// Exact destination and local-relevance ranking. Keep commercial POIs available.
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const words=v=>norm(v).split(' ').filter(Boolean);
const stopTerms=new Set(['station','underground','railway','rail','tube','metro','metrou','gara','statie','stop','london','londra','in','at']);
const transit=c=>/public transport|railway|subway|rail station|underground|metro|tram/.test(norm((c._categories||[]).join(' ')))||
 c.source==='TfL StopPoint'||/railway|public_transport|subway|station|tram_stop/.test(norm(c.kind));
const distanceKm=(a,b)=>{
 if(!a||a.latitude==null||a.longitude==null||b?.latitude==null||b?.longitude==null)return null;
 const lat1=+a.latitude,lon1=+a.longitude,lat2=+b.latitude,lon2=+b.longitude;
 if(![lat1,lon1,lat2,lon2].every(Number.isFinite)||Math.abs(lat1)>90||Math.abs(lat2)>90||Math.abs(lon1)>180||Math.abs(lon2)>180)return null;
 const rad=Math.PI/180,la1=lat1*rad,la2=lat2*rad,dla=la2-la1,dlo=(lon2-lon1)*rad;
 const h=Math.sin(dla/2)**2+Math.cos(la1)*Math.cos(la2)*Math.sin(dlo/2)**2;
 return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(Math.max(0,1-h)));
};
export function rankJourneySuggestions(query,candidates=[],{origin=null,national=false}={}){
 const normalized=norm(query),tokens=words(query),core=tokens.filter(w=>!stopTerms.has(w));
 const stopRequest=/(^| )(station|underground|railway|tube|metro|metrou|gara|statie|stop)( |$)/.test(normalized);
 const tubeRequest=/(^| )(underground|tube|metro|metrou)( |$)/.test(normalized);
 const houseRequest=/^\d{1,6}[a-z]?(?:[-/]\d+)?\s+[a-z]/.test(normalized);
 const hasLocality=/,\s*\p{L}|\b(?:in|din)\s+[\p{L}]{3,}/iu.test(query);
 let items=[...candidates];
 if(national&&stopRequest){
  // A station search cannot silently become a café, district or hotel.
  items=items.filter(c=>{
   if(!transit(c))return false;
   const name=new Set(words(c._name||String(c.label||'').split(',')[0]));
   if(!core.length||!core.every(t=>name.has(t)))return false;
   return !tubeRequest||/underground|tube|metro|subway/.test(norm((c._name||'')+' '+(c._categories||[]).join(' ')+' '+c.kind));
  });
 }
 const ranked=items.map((item,index)=>{
  const name=norm(item._name||String(item.label||'').split(',')[0]),nameWords=new Set(words(name));
  const cat=norm((item._categories||[]).join(' ')),km=distanceKm(origin,item);
  const match=core.filter(t=>nameWords.has(t)).length;
  let score=90*match+(core.length?180*match/core.length:0);
  if(core.length&&match===core.length)score+=130;
  if(name===normalized)score+=400;
  if(stopRequest&&transit(item))score+=350;
  if(stopRequest&&item.source==='TfL StopPoint')score+=130;
  if(tubeRequest&&/underground|tube|metro|subway/.test(name+' '+cat))score+=75;
  if((tokens.includes('london')||tokens.includes('londra'))&&/\blondon\b/.test(norm(item.city+' '+item.label)))score+=60;
  if(national&&houseRequest&&!hasLocality&&km!==null)score-=Math.min(260,km*2.2);
  score-=Math.max(0,words(name).length-core.length)*3;
  return {item,index,km,score};
 }).sort((a,b)=>b.score-a.score||(a.km??Infinity)-(b.km??Infinity)||a.index-b.index);
 let scoped=ranked;
 if(national&&houseRequest&&!hasLocality&&ranked.some(x=>x.km!==null&&x.km<=55))
  scoped=ranked.filter(x=>x.km!==null&&x.km<=75);
 const unique=[];
 for(const entry of scoped){
  const x=entry.item,key=[norm(x.house_number),norm(x.street),norm(x.city)].join('|');
  const duplicate=national&&houseRequest&&norm(x.street)&&unique.some(v=>{
   const y=v.item,other=[norm(y.house_number),norm(y.street),norm(y.city)].join('|');
   const dist=distanceKm(x,y);
   return key===other&&dist!==null&&dist<0.25;
  });
  if(!duplicate)unique.push(entry);
 }
 return unique.map(v=>v.item);
}
