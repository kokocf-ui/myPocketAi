// Short direct feedback addressed to Pocket AI, not a destination or a
// school topic. Keep it separate from historical conversation context.
export function classifyAssistantFeedback(value){
 const text=String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLowerCase().replace(/[^a-z0-9 ]+/g,' ').replace(/\s+/g,' ').trim();
 if(!text||text.length>115)return null;
 const criticism=/^(?:(?:tu )?esti|sunteti|you are|you re)\s+(?:varza|prost|proasta|slab|slaba|pe langa|neatent|neatenta|confuz|confuza|inutil|inutila|ridicol|ridicola)(?:\s+(?:azi|astazi|la asta|la retete|la matematica))?$/
   .test(text)
  ||/^(?:nu\s+(?:te pricepi|intelegi|stii)|ai\s+(?:gresit|inteles gresit)|gresesti|raspunsul\s+(?:tau|este)\s+(?:gresit|pe langa|prost|slab)|ce prostii spui|you got it wrong|your answer is wrong|that is incorrect|you re not listening)(?:\s+(?:deloc|iar|din nou))?$/.test(text);
 return criticism?'negative':null;
}
