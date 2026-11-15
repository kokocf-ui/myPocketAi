// Rank location suggestions by requested place, not merely distance to the GPS.
// Commercial landmarks are retained; a transport stop is preferred for an explicit stop query.
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const terms=v=>norm(v).split(' ').filter(Boolean);
const descriptors=new Set(['station','underground','railway','rail','tube','metro','metrou','gara','statie','stop','london','londra']);
export function rankJourneySuggestions(query,candidates=[]){
 const q=norm(query),words=terms(q),targetWords=words.filter(w=>!descriptors.has(w));
 const requestsStop=/(?:^| )(?:station|underground|railway|rail|tube|metro|metrou|gara|statie|stop)(?: |$)/.test(q);
 const requestsTube=/(?:^| )(?:underground|tube|metro|metrou)(?: |$)/.test(q);
 return [...candidates].map((item,index)=>{
  const name=norm(item._name||String(item.label||'').split(',')[0]);
  const nameWords=new Set(terms(name));
  const categories=norm((item._categories||[]).join(' '));
  const business=/(?:commercial|catering|accommodation|shop|restaurant|hotel|cafe|service|retail)/.test(categories);
  const transit=/(?:public transport|railway|rail|underground|station|subway|metro|tram)/.test(categories)||item.source==='TfL StopPoint';
  const matched=targetWords.filter(w=>nameWords.has(w)).length;
  let score=matched*90+(targetWords.length?matched/targetWords.length*180:0);
  if(targetWords.length&&matched===targetWords.length)score+=130;
  if(name===q)score+=400;
  if(requestsStop&&transit&&!business)score+=350;
  if(requestsStop&&item.source==='TfL StopPoint')score+=130;
  if(requestsTube&&/(?:underground|tube|metro)/.test(name+' '+categories))score+=75;
  if(requestsStop&&business)score-=110;
  if(words.includes('london')||words.includes('londra')){
   if(/\blondon\b/.test(norm(item.city+' '+item.label)))score+=60;
  }
  score-=Math.max(0,terms(name).length-targetWords.length)*3;
  return {item,index,score};
 }).sort((a,b)=>b.score-a.score||a.index-b.index).map(x=>x.item);
}
