// Intent guard for referring to an existing conversation.
// A question about an answer is not a command to search for its topic again.
// Keep the classification narrow to avoid stealing actual recipe/place/news work.
const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();

export function classifyConversationTurn(value){
 const t=normalize(value);
 if(!t||t.length>550)return null;
 if(/^(?:la revedere|pa|pa pa|bye|goodbye|good bye|ne auzim|o zi buna|noapte buna|salut|buna|hello|hi|multumesc|merci|thanks)$/.test(t))return {kind:'social',normalized:t};
 const explicitContext=/\b(?:conversatia\s+noastra|discutia\s+noastra|in\s+conversatie|in\s+istoric|ce\s+am\s+(?:cerut|spus|scris|intrebat)|cate\s+am\s+cerut|ce\s+mi\s+ai\s+(?:raspuns|spus)|what\s+did\s+i\s+(?:ask|say)|earlier\s+in\s+(?:our|this)\s+(?:chat|conversation)|our\s+conversation|previous\s+(?:answer|reply)|raspunsul\s+(?:tau|anterior))\b/.test(t)
  ||/\b(?:cate|care|ce|how many|what)\b.*\b(?:am\s+(?:cerut|spus|solicitat)|mi\s+ai\s+(?:raspuns|spus|aratat)|ai\s+(?:afisat|aratat)|did\s+i\s+ask)\b/.test(t);
 const aboutAssistant=/\b(?:mi\s+ai|m\s+ai|tu\s+(?:mi\s+)?ai|(?:imi|mi)\s+(?:arati|dai|oferi|prezinti|recomanzi)|ai\s+(?:spus|afisat|aratat|raspuns|oferit|dat|gasit|inteles|ignorat|promis)|you\s+(?:said|showed|gave|answered|found|promised|missed)|you\s+only|tu\s+ai)\b/.test(t);
 const discrepancy=/\b(?:dar|insa|totusi|doar|numai|gresit|diferit|in\s+loc|de\s+ce|why|but|only|instead|wrong|not\s+what|less)\b/.test(t);
 const accounting=/\b(?:cate|cati|numar|solicitare|cerut|afisat|aratat|spus|promis|count|how\s+many|asked|requested|shown|displayed)\b/.test(t);
 const explicitNew=/^(?:(?:da|arata|cauta|gaseste|vreau|ofera|prezinta|show|find|give|search)\s+(?:mi\s+)?(?:\d+\s+)?(?:retet|recipe|stiri|news|locuri|places)\b)/.test(t);
 const multiRequestRecall=/\b(?:ce|care|cate|what|which)\b.*\b(?:retet\w*|recipe\w*)\b.*\b(?:am\s+(?:cerut|solicitat)|i\s+(?:asked|requested))\b/.test(t);
 if(multiRequestRecall)return {kind:'reference',normalized:t};
 const mismatchQuestion=/\b(?:de\s+ce|why)\b/.test(t)&&aboutAssistant
  &&/\b(?:cerut|asked|pui|chicken|rata|duck|gresit|wrong|instead)\b/.test(t);
 if(mismatchQuestion)return {kind:'correction',normalized:t};
 if(explicitNew&&!explicitContext&&!discrepancy)return null;
 if(explicitContext&&(aboutAssistant||accounting||/\b(?:ce|care|cate|what|how)\b/.test(t)))
   return {kind:'reference',normalized:t};
 if(aboutAssistant&&discrepancy)
   return {kind:'correction',normalized:t};
 if(/\b(?:am\s+cerut|ti\s+am\s+cerut|i\s+asked|i\s+requested)\b/.test(t)&&
    /\b(?:mi\s+ai|ai\s+(?:dat|afisat|oferit)|you\s+(?:gave|showed|answered))\b/.test(t))
   return {kind:'correction',normalized:t};
 return null;
}

export function buildConversationEvidence(history,currentMessage){
 const prior=(Array.isArray(history)?history:[])
  .filter(x=>x&&['user','assistant'].includes(x.role)&&typeof x.content==='string')
  .filter(x=>x.content.trim()!==String(currentMessage||'').trim())
  .slice(-14)
  .map(x=>({role:x.role,content:x.content.trim().slice(0,1800)}));
 return prior;
}
