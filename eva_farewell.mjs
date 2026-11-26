// Full-utterance speech act, not a keyword match: a farewell quoted inside
// a task, or followed by a new task, must not swallow the actual request.
export function evaFarewellIntent(value){
 const t=String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
  .replace(/[’']/g,' ').replace(/[!?.,;:–—-]+/g,' ').replace(/\s+/g,' ').trim();
 if(!t||t.length>220)return false;
 const core=t.replace(/^(?:eva |evo )/,'').replace(/^(?:(?:bine|ok|okay|in regula|multumesc|mersi|thanks|thank you|alright|d acord|bon|gut) )+/,'')
  .replace(/^(?:eva |evo )/,'').replace(/ (?:eva|evo|multumesc|mersi|thanks|thank you)$/,'');
 return /^(?:ne (?:auzim|vedem)(?: (?:mai tarziu|mai incolo|maine|curand|data viitoare))?|vorbim (?:mai tarziu|mai incolo|maine|alta data)|pe (?:curand|maine|data viitoare)|la revedere|pa(?: pa)?|o (?:zi|seara) (?:buna|frumoasa)|noapte buna|(?:see|talk to) you (?:later|soon|tomorrow)|(?:we ll|we will) (?:talk|speak) later|bye(?: bye)?|good ?bye|good night|au revoir|a bientot|a plus tard|bonne soiree|gute nacht|bis spater|bis bald|auf wiedersehen|a presto|arrivederci|buona notte|hasta luego|hasta pronto|buenas noches|ate logo|ate breve|boa noite|tot later|tot ziens|dobranoc|do widzenia)$/.test(core);
}
export function evaFarewellFallback(language='ro'){
 return ({ro:'Ne auzim mai târziu! Ai grijă de tine.',en:'Talk to you later! Take care.',fr:'À bientôt ! Prends soin de toi.',de:'Bis später! Pass auf dich auf.',it:'A presto! Abbi cura di te.',es:'¡Hasta luego! Cuídate.',pt:'Até breve! Cuida de ti.',nl:'Tot later! Zorg goed voor jezelf.',pl:'Do usłyszenia! Dbaj o siebie.',ru:'До скорого! Береги себя.',uk:'До зустрічі! Бережи себе.'})[language]||'Talk to you later! Take care.';
}
export function evaFarewellReply(value,language='ro'){
 const raw=String(value||'').trim(),t=raw.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const closing=/\b(?:ne auzim|ne vedem|vorbim|pe curand|pe maine|la revedere|ai grija|zi (?:buna|frumoasa)|seara (?:buna|frumoasa)|noapte buna|pa|see you|talk (?:to you|soon)|take care|goodbye|bye|good night|a bientot|a plus tard|au revoir|prends soin|bis (?:bald|spater)|auf wiedersehen|gute nacht|a presto|arrivederci|buona notte|hasta (?:luego|pronto)|cuidate|ate (?:logo|breve)|boa noite|tot (?:later|ziens)|do (?:uslyszenia|widzenia)|dobranoc)\b/.test(t)||/до (?:скорого|встречи|зустрічі)|береги|бережи/i.test(t);
 const academic=/\b(?:surse|sursa|primare|secundare|primary|secondary|sources|first.hand|istoric|historical|documente|analiza|in concluzie)\b/.test(t);
 // Validate the complete draft, not a truncated first sentence that might
 // conceal an unrelated essay. Retain naturally varied, short AI farewells.
 return raw&&raw.length<=260&&raw.split(/\s+/).length<=40&&closing&&!academic&&!/[?？]/.test(raw)?raw:evaFarewellFallback(language);
}
