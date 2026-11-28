// Exact destination and local-relevance ranking. Keep commercial POIs available.
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const words=v=>norm(v).split(' ').filter(Boolean);
const stopTerms=new Set(['station','underground','railway','rail','tube','metro','metrou','gara','statie','stop','london','londra','in','at']);
const transit=c=>/public transport|railway|subway|rail station|underground|metro|tram/.test(norm((c._categories||[]).join(' ')))||
 c.source==='TfL StopPoint'||/railway|public_transport|subway|station|tram_stop/.test(norm(c.kind));
const stripSupraLocal=v=>String(v||'')
 .replace(/\b[\p{L}\p{M}-]+(?:\s+[\p{L}\p{M}-]+)?\s+metropolitan\s+area\b/giu,' ')
 .replace(/\bzona\s+metropolitan[aă]\s+[\p{L}\p{M}-]+(?:\s+[\p{L}\p{M}-]+)?\b/giu,' ')
 .replace(/\b(?:area\s+metropolitana|aire\s+m[eé]tropolitaine|metropolregion)\s+[\p{L}\p{M}-]+\b/giu,' ')
 .replace(/\bmetropolitan\s+area\b/giu,' ');
const streetCanon=v=>{
 const expand={str:'strada',bd:'bulevardul',bvd:'bulevardul',sos:'soseaua',cal:'calea',
  al:'aleea',pta:'piata',st:'street',rd:'road',ave:'avenue',ln:'lane',blvd:'boulevard',dr:'drive'};
 return words(v)
  .map(w=>expand[w]||w)
  .filter((w,i,a)=>!(i===0&&a.length>1&&['strada','ulica','calle','via','rue'].includes(w)))
  .join(' ');
};
const splitQueryClauses=raw=>{
 const text=String(raw||'').trim();
 const parts=text.split(',').map(p=>p.trim()).filter(Boolean);
 if(parts.length>=2){
  let head=parts[0],tail=parts.slice(1);
  if(tail.length>=2&&/^(?:(?:nr\.?|numar(?:ul)?|no\.?|number|#)\s*)?\d+[a-z]?(?:[-/]\d+)?$/iu.test(norm(tail[0]))){
   head=head+' '+tail[0];tail=tail.slice(1);
  }
  return {head,clauses:tail};
 }
 const prep=text.match(/^(.+?)\s+(?:din|în|in)\s+([\p{L}\p{M}][\p{L}\p{M}' .-]{1,60})$/iu);
 if(prep&&!/\b(?:station|stop|underground|tube|metro)$/iu.test(prep[2].trim()))
  return {head:prep[1].trim(),clauses:[prep[2].trim()]};
 return {head:text,clauses:[]};
};
const cityCanon=value=>{
 const n=norm(value);
 return ({bucharest:'bucuresti',bukarest:'bucuresti'})[n]||n;
};
const candidateMatchesClause=(c,clause)=>{
 const clauseNorm=cityCanon(clause),clauseWords=words(clauseNorm);
 if(!clauseNorm||!clauseWords.length)return true;
 const cityNorm=cityCanon(c.city||''),cityWords=words(cityNorm);
 const cityMatch=Boolean(cityNorm)&&(cityNorm===clauseNorm||cityNorm.startsWith(clauseNorm)||
  clauseWords.every(w=>cityWords.some(cw=>cw===w||cw.startsWith(w))));
 if(cityMatch)return true;
 const code=String(c.country_code||'').toUpperCase();
 if(((clauseNorm==='uk'||clauseNorm==='united kingdom'||clauseNorm==='great britain'||
     clauseNorm==='marea britanie'||clauseNorm==='anglia'||clauseNorm==='england')&&code==='GB')||
    (clauseNorm==='romania'&&code==='RO')||
    (clauseNorm.length===2&&code===clauseNorm.toUpperCase()))return true;
 if(code==='RO'&&cityNorm){
  const roStructured=words([cityNorm,norm(c._postcode||''),norm(stripSupraLocal([c.suburb,c.district].filter(Boolean).join(' ')))].join(' '));
  return Boolean(roStructured.length)&&clauseWords.every(w=>roStructured.some(sw=>sw===w||sw.startsWith(w)));
 }
 const cleanLabel=norm(stripSupraLocal([c.suburb,c.district,c.label].filter(Boolean).join(' ')));
 const labelWords=words(cleanLabel);
 return clauseWords.every(w=>labelWords.some(lw=>lw===w||lw.startsWith(w)));
};
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
 const {head,clauses}=splitQueryClauses(query);
 const headNorm=norm(head),headCore=words(head).filter(w=>!stopTerms.has(w));
 const activeCore=headCore.length?headCore:core;
 const stopRequest=/(^| )(station|underground|railway|tube|metro|metrou|gara|statie|stop)( |$)/.test(normalized);
 const tubeRequest=/(^| )(underground|tube|metro|metrou)( |$)/.test(normalized);
 const houseRequest=/^\d{1,6}[a-z]?(?:[-/]\d+)?\s+[a-z]/.test(headNorm)||
  /^[a-z][a-z0-9 ]*\s+(?:(?:nr|numar|numarul|no|number)\s+)?\d{1,6}[a-z]?(?:[-/]\d+)?$/.test(headNorm);
 const hasLocality=clauses.length>0||/,\s*\p{L}|\b(?:in|din)\s+[\p{L}]{3,}/iu.test(query);
 const queryHasPostcode=/\b(?:[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}|\d{5,6})\b/i.test(String(query||''));
 let items=[...candidates];
 // Never silently substitute a different city when the user gave an explicit locality.
 if(clauses.length){
  items=items.filter(c=>clauses.every(cl=>candidateMatchesClause(c,cl)));
 }
 if(national&&stopRequest){
  // A station search cannot silently become a café, district or hotel.
  const requireLondon=tokens.includes('london')||tokens.includes('londra');
  items=items.filter(c=>{
   if(!transit(c))return false;
   if(requireLondon&&!/\blondon\b/.test(norm((c.city||'')+' '+(c.label||''))))return false;
   const headWords=new Set(words(c._name||String(c.label||'').split(',')[0]));
   const localityWords=new Set(words((c.city||'')+' '+(c.label||'')));
   if(!activeCore.length||!activeCore.some(t=>headWords.has(t))||
      !activeCore.every(t=>headWords.has(t)||localityWords.has(t)))return false;
   return !tubeRequest||/underground|tube|metro|subway/.test(norm((c._name||'')+' '+(c._categories||[]).join(' ')+' '+c.kind));
  });
 }
 const primaryLocality=clauses[0]?norm(clauses[0]):'';
 const ranked=items.map((item,index)=>{
  const headLabel=String(item._name||String(item.label||'').split(',')[0]);
  const name=norm(headLabel);
  const addrTokens=words([item.house_number,item.street].filter(Boolean).join(' '));
  const nameWords=new Set([...words(name),...addrTokens]);
  const cat=norm((item._categories||[]).join(' ')),km=distanceKm(origin,item);
  const match=activeCore.filter(t=>nameWords.has(t)).length;
  let score=90*match+(activeCore.length?180*match/activeCore.length:0);
  if(activeCore.length&&match===activeCore.length)score+=130;
  if(name===headNorm||name===normalized)score+=400;
  if(primaryLocality&&norm(item.city||'')===primaryLocality)score+=260;
  else if(primaryLocality&&norm(item.city||'').startsWith(primaryLocality))score+=110;
  const wantedHouseNum=(headNorm.match(/^(\d{1,6}[a-z]?)(?:\s|$)/)||headNorm.match(/\b(\d{1,6}[a-z]?)$/))?.[1]||'';
  if(houseRequest){
   const pureAddress=['building','house','street'].includes(norm(item.kind))||
    !norm(item._name)||streetCanon(item._name)===streetCanon(item.street);
   if(pureAddress)score+=95;
   if(wantedHouseNum&&norm(item.house_number)===wantedHouseNum)score+=45;
  }else if(item.street&&item.house_number){
   score+=12;
  }
  if(stopRequest&&transit(item))score+=350;
  if(stopRequest&&item.source==='TfL StopPoint')score+=130;
  if(tubeRequest&&/underground|tube|metro|subway/.test(name+' '+cat))score+=75;
  if((tokens.includes('london')||tokens.includes('londra'))&&/\blondon\b/.test(norm(item.city+' '+item.label)))score+=60;
  if(national&&houseRequest&&!hasLocality&&km!==null)score-=Math.min(260,km*2.2);
  score-=Math.max(0,words(name).length-activeCore.length)*3;
  return {item:{...item},index,km,score};
 }).sort((a,b)=>b.score-a.score||(a.km??Infinity)-(b.km??Infinity)||a.index-b.index);
 let scoped=ranked;
 if(national&&houseRequest&&!hasLocality&&ranked.some(x=>x.km!==null&&x.km<=55))
  scoped=ranked.filter(x=>x.km!==null&&x.km<=75);
 const unique=[];
 const removePostcodeFromLabel=(label,pc)=>{
  const rawPc=String(pc||'').trim();
  if(!rawPc)return label;
  const escaped=rawPc.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return String(label||'')
   .replace(new RegExp(',\\s*'+escaped+'(?=\\s*,|$)','gi'),'')
   .replace(new RegExp('\\b'+escaped+'\\s+','gi'),'')
   .replace(/\s{2,}/g,' ')
   .replace(/,\s*,/g,',')
   .trim();
 };
 for(const entry of scoped){
  const x=entry.item;
  const cHouse=norm(x.house_number),cStreet=streetCanon(x.street),cCity=norm(x.city);
  const hasStructuredAddress=Boolean(cHouse&&cStreet&&cCity);
  const key=hasStructuredAddress?[String(x.country_code||'').toUpperCase(),cCity,cStreet,cHouse].join('|'):'';
  if(hasStructuredAddress){
   const existing=unique.find(v=>{
    const y=v.item;
    const other=[String(y.country_code||'').toUpperCase(),norm(y.city),streetCanon(y.street),norm(y.house_number)].join('|');
    if(key!==other)return false;
    const dist=distanceKm(x,y);
    if(dist===null||dist<2.5)return true;
    return hasLocality&&!norm(x.suburb||'')&&!norm(y.suburb||'')&&dist<5.0;
   });
   if(existing){
    // Multiple postcode variants at the exact same street + number + locality
    // cannot all be distinct addresses; strip a disputed postcode if neither was requested.
    if(!queryHasPostcode){
     const pcA=String(existing.item._postcode||'').trim();
     const pcB=String(x._postcode||'').trim();
     if(pcA&&pcB&&norm(pcA)!==norm(pcB)){
      existing.item.label=removePostcodeFromLabel(existing.item.label,pcA);
      existing.item._postcode='';
     }
    }
    continue;
   }
  }else{
   const headA=norm(x._name||String(x.label||'').split(',')[0]);
   const labelA=norm(stripSupraLocal(x.label||''));
   const pcA=norm(x._postcode||'');
   const duplicateUnnumbered=unique.some(v=>{
    const y=v.item;
    if(norm(y.house_number))return false;
    const dist=distanceKm(x,y);
    const sameCity=!cCity||!norm(y.city)||cCity===norm(y.city);
    const labelB=norm(stripSupraLocal(y.label||''));
    if(labelA&&labelA===labelB&&sameCity&&(dist===null||dist<3.0))return true;
    const headB=norm(y._name||String(y.label||'').split(',')[0]);
    if(!headA||headA!==headB||!sameCity)return false;
    const pcB=norm(y._postcode||'');
    if(pcA&&pcB&&pcA===pcB&&(dist===null||dist<3.0))return true;
    if(cStreet&&cStreet===streetCanon(y.street)&&cCity&&(dist===null||dist<2.5))return true;
    return dist!==null&&dist<0.25;
   });
   if(duplicateUnnumbered)continue;
  }
  unique.push(entry);
 }
 return unique.map(v=>v.item);
}
