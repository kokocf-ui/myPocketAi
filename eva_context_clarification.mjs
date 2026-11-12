// Narrow clarification gate: do not guess a missing reference on short follow-ups.
// All actual task routing stays in the existing orchestrator.
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
 .toLowerCase().replace(/[!?.,;:]+/g,' ').replace(/\s+/g,' ').trim();
export function clarifyUnresolvedReference(message,history,{language='ro'}={}){
 const text=norm(message);
 if(!text||text.length>85)return null;
 // Catch only clearly elliptical referents. Ordinary yes/no or complete questions
 // must flow through the normal conversational and module logic.
 const refers=/^(?:(?:si|dar|iar|and|but|what about)\s+)?(?:(?:acolo|acela|aceea|celalalt|cealalta|aceeasi|acelasi|la fel|that one|the other one|same one|there)|(?:si|dar|iar|what about)\s+(?:acolo|acela|cealalta|celalalt|there|the other))\b/.test(text)
  ||/^(?:nu|no)\s+(?:acela|aceea|celalalt|cealalta|that one|the other one)\b/.test(text);
 if(!refers)return null;
 const previous=(Array.isArray(history)?history:[]).filter(x=>x?.role==='user'&&typeof x?.content==='string')
  .map(x=>x.content.trim()).filter(Boolean);
 while(previous.length&&norm(previous.at(-1))===text)previous.pop();
 // If any substantive recent user topic exists, the general model should
 // resolve the reference, rather than forcing a clarification.
 const hasContext=previous.slice(-5).some(x=>x.length>=12&&!/^(?:buna|salut|hello|hi|multumesc|mersi|thanks|ok|da|nu)[!?. ]*$/i.test(x));
 if(hasContext)return null;
 return language==='ro'
  ?'La ce loc, obiect sau variantă te referi?'
  :'Which place, item or option do you mean?';
}
