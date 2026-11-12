// Evidence-only recall over conversation turns supplied in this request.
// This is NOT global account-history access. Never cross user boundaries or
// claim archived chats have been searched when only recent turns are present.
const fold=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
 .toLowerCase().replace(/[^a-z0-9\p{L}]+/gu,' ').replace(/\s+/g,' ').trim();
const stop=new Set('eva te rog sa mi imi ce care cand unde cum am ai ne noi nostru noastra noastre despre din intre si in la pe pentru mai oare acea acela acel astea acele acolo the did what when where which about from that this please find search history conversation previous earlier'.split(' '));
function requestTerms(value){
 return [...new Set(fold(value).split(' ').filter(x=>x.length>=3&&!stop.has(x)
  &&!/^(istoric|conversati[ei]|discuti[ei]|vorbit|spus|scris|intrebat|caut|gasest|saptaman|trecut|yesterday|today|mesaj|remember|recall)$/.test(x)))];
}
export function historyRecallIntent(text){
 const t=fold(text);
 // Avoid catching normal research requests mentioning historical events.
 return /\b(?:cauta|cauti|gaseste|gasesti|verifica|cautare|search|find|look up)\b.{0,55}\b(?:istoric|conversati|discuti|mesaj|history|chat|previous conversation)/.test(t)
  ||/\b(?:in|din|from)\s+(?:istoric|conversatiile noastre|discutiile noastre|our chat history|our previous conversations)\b/.test(t)
  ||/\b(?:cand|ce|care|unde|what|when)\b.{0,75}\b(?:am discutat|am vorbit|mi ai recomandat|mi ai spus|we discussed|we talked about|you recommended)\b/.test(t)
  ||/^(?:iti amintesti|mai tii minte|do you remember)\b.{8,}/.test(t);
}
export function recallFromSuppliedHistory(message,history,{language='ro'}={}){
 if(!historyRecallIntent(message))return null;
 const all=Array.isArray(history)?history:[];
 const terms=requestTerms(message);
 const rows=all.slice(-120).map((x,i)=>({
  index:i,role:x?.role,content:typeof x?.content==='string'?x.content.trim().slice(0,1000):'',
  at:typeof x?.timestamp==='string'?x.timestamp:null,
  conversation_id:typeof x?.conversation_id==='string'?x.conversation_id:null
 })).filter(x=>['user','assistant'].includes(x.role)&&x.content&&!historyRecallIntent(x.content));
 if(!rows.length)return {found:false,reason:'no_supplied_history'};
 const scored=rows.map(x=>{
  const t=fold(x.content),matched=terms.filter(term=>t.includes(term));
  return {...x,score:matched.length,matched};
 }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||b.index-a.index);
 if(!terms.length)return {found:false,reason:'topic_missing'};
 if(!scored.length)return {found:false,reason:'no_match'};
 const top=scored.slice(0,4);
 return {found:true,scope:'supplied_history_only',matches:top.map(({role,content,at,conversation_id})=>({role,content,at,conversation_id})),
  reply:(language==='ro'
   ?'Am găsit în mesajele disponibile (nu am verificat automat toate conversațiile arhivate):'
   :'I found these in the messages available to me (not a search across all archived conversations):')
   +'\n'+top.map((x,i)=>(i+1)+'. '+(x.role==='user'?(language==='ro'?'Ai spus: ':'You said: '):(language==='ro'?'Eva a răspuns: ':'Eva replied: '))+
    '„'+x.content.slice(0,260).replace(/\s+/g,' ') +(x.content.length>260?'…':'')+'”').join('\n')
 };
}

// Reject synthetic summaries with unsupported precise claims or missing citations.
// This guard supplements, but does not replace, evidence-only prompting.
export function groundedHistorySummary(candidate,matches){
 const answer=String(candidate||'').trim();
 const rows=Array.isArray(matches)?matches:[];
 if(!answer||!rows.length||answer.length>1800)return false;
 const refs=[...answer.matchAll(/\[(\d+)\]/g)].map(x=>Number(x[1]));
 if(!refs.length||refs.some(x=>x<1||x>rows.length))return false;
 const evidence=rows.map(x=>String(x?.content||'')).join(' ');
 // Strip reference indexes; dates, fares, quantities and numeric years in the
 // answer must have appeared in the excerpts, not in model imagination.
 const withoutRefs=answer.replace(/\[\d+\]/g,' ');
 const numbers=withoutRefs.match(/\b\d+(?:[.,]\d+)?\b/g)||[];
 if(numbers.some(n=>!evidence.includes(n)))return false;
 const urls=withoutRefs.match(/https?:\/\/[^\s]+/gi)||[];
 if(urls.some(url=>!evidence.includes(url)))return false;
 return true;
}
