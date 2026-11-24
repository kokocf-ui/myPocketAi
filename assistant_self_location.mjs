// Only self-location/address questions, not addresses of other people, sites or concepts.
// Standalone so this same function can be included in the client bundle.
export function assistantSelfLocationQuery(raw){
 const t=String(raw||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
  .replace(/[’']/g,' ').replace(/[^\p{L}\p{N}]+/gu,' ').trim().replace(/\s+/g,' ');
 if(!t)return false;
 const s=t.replace(/^(?:(?:buna|salut|hey|hello|hi) )?(?:(?:eva|evo) )?/,'');
 return /\bunde sunt(?: eu)?(?: acum| exact)?(?:$| (?:eva|te rog)$)/.test(s)||/\b(?:unde ma aflu|unde ma gasesc|pe ce strada (?:ma aflu|sunt|ma gasesc)|la ce adresa (?:sunt|ma aflu|ma gasesc)|la ce numar (?:sunt|ma aflu)|care (?:este|e) adresa (?:mea|la care (?:sunt|ma aflu|ma gasesc))|ce adresa (?:am|are locatia mea|este aici)|(?:care|ce) (?:este |e )?(?:numarul|numar) (?:casei|cladirii) (?:la care sunt|unde (?:sunt|ma aflu))|(?:codul postal|postcode|postal code) (?:al locatiei mele|unde sunt|aici|at my location|where i am)|adresa (?:mea|locatiei mele|curenta|actuala)|locatia (?:mea|actuala)|pozitia (?:mea|actuala)|coordonatele mele|localizeaza ma|ma poti localiza|poti sa ma localizezi|where (?:exactly )?am i|where am i (?:now|located)|what(?: is| s) my (?:current )?(?:address|location|position)|what address am i (?:at|near)|which address am i at|my current (?:address|location|position)|locate me)\b/.test(s);
}
