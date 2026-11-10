// Centralized cooking-request detection and requested variant count.
// A request for recipes is not a request for GPS or nearby businesses.
export function parseCulinaryRequest(input){
 const text=String(input||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
  .replace(/[^a-z0-9]+/g,' ').trim();
 const isRecipe=/\b(?:retet\w*|recipe\w*|ingredient\w*|cum\s+(?:se\s+)?(?:prepar\w*|gatesc|gatesti|gati\w*|face|fac)\b|how\s+to\s+cook|sarmal\w*|ciorb\w*\s+de\s+burt\w*)\b/i.test(text);
 const quantityWords={o:1,un:1,una:1,one:1,doua:2,doi:2,two:2,trei:3,three:3,patru:4,four:4,cinci:5,five:5,sase:6,six:6};
 const m=text.match(/\b(\d{1,2}|o|un|una|one|doua|doi|two|trei|three|patru|four|cinci|five|sase|six)\s+(?:(?:variante?|tipuri|versions?|variants?)\s+(?:de|of)\s+)?(?:retet\w*|recipes?)\b/)
  ||text.match(/\b(\d{1,2}|one|two|three|four|five|six)\s+(?:[a-z]+\s+){1,3}recipes?\b/);
 const count=m?Math.min(6,Math.max(1,Number(m[1])||quantityWords[m[1]]||1)):1;
 return {isRecipe,count};
}
