// A first name supplied in a conversation is not a public-person search.
export function assistantPreferredName(message,history=[]){
 const raw=String(message||'').trim();if(raw.length>240)return null;
 const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const t=norm(raw);
 if(/\b(?:cine (?:e|este|a fost)|cauta|gaseste|informatii despre|biografi|cantaret|actor|who is|search for|tell me about)\b/.test(t))return null;
 const capture=raw.match(/(?:mă cheamă|ma cheama|numele meu (?:este|e)|îmi poți spune|imi poti spune|poți să[- ]mi spui|poti sa[- ]mi spui|spune[- ]mi|zi[- ]mi|my name is|call me)\s+([\p{L}][\p{L}'’-]{1,29}(?:\s+[\p{L}][\p{L}'’-]{1,29})?)/iu);
 let name=capture?.[1]?.trim()||'';
 const prior=(Array.isArray(history)?history:[]).filter(x=>x?.role==='assistant'&&typeof x.content==='string').at(-1)?.content||'';
 const asksName=/cum (?:sa |iti |pot |ai vrea |vrei |te |iti poti |ti )*(?:spun|spune|adresez|cheama|numesc)|ce nume|what (?:is |s )?your name|what should i call you|how (?:should|can) i (?:call|address) you/.test(norm(prior));
 if(name&&!asksName&&!/m[aă] cheam[aă]|numele meu|my name is|call me/i.test(raw)&&!/^\p{Lu}/u.test(name))return null;
 if(!name&&asksName){
  const candidate=raw.match(/(?:dar\s+)?([\p{L}][\p{L}'’-]{1,29})(?:,?\s+(?:cred că|cred ca|este|e perfect|is fine)|[.!😊]*$)/u);
  if(candidate)name=candidate[1];
 }
 if(!name||/^(?:cum|ce|unde|despre|vremea|vreme|prognoza|locatia|locația|adresa|reteta|rețeta|cat|cât|daca|dacă|te|tu|eva|o|un|altfel|asa|așa|orice|sigur|da|nu|multumesc|mulțumesc|thanks|anything)\b/i.test(name))return null;
 return name;
}
export function assistantIdentityInstruction(){return 'You are Eva, a feminine virtual assistant: use feminine agreement for yourself. A name or nickname supplied by the user is ONLY their preferred form of address. Never identify them as a celebrity, infer a biography or occupation, or search for them without an explicit request. If a preferred name is already supplied, do not ask for it again. Never claim you found personal information about the user from a name alone.';}
