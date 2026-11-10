// Shared cooking-intent detection, quantity and clean search query.
const normalize=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
 .toLowerCase().replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();
const numberWords={o:1,un:1,una:1,one:1,doua:2,doi:2,two:2,trei:3,three:3,patru:4,four:4,cinci:5,five:5,sase:6,six:6};
const exclude=new Set((
 'vreau as dori te rog please show find search give get want like '+
 'cauta cautami gaseste gasestemi arata aratami ofera oferami prezinta prezentami '+
 'da dami da mi imi pune pune mi '+
 'recipe recipes reteta retete retetei retetelor ingredient ingrediente ingredients '+
 'variante varianta variant variants types tipuri tip diferente diferite alt altele '+
 'mai mult multe multi multor cativa cateva several multiple many more some few '+
 'mod preparare prepararea preparat pregatire cooking cook how cum se face fac faci '+
 'traditional traditionale traditionala traditionali traditional romanesc romaneasca romanesti '+
 'pentru about from with de la in pe ale unui unei un una o si sau the and of for to me my i you '+
 '1 2 3 4 5 6 o doi doua trei patru cinci sase one two three four five six'
).split(' '));
export function recipeDishKeywords(input){
 const words=normalize(input).split(' ').filter(x=>x.length>=4&&!exclude.has(x));
 return [...new Set(words)];
}
export function parseCulinaryRequest(input){
 const text=normalize(input);
 const isRecipe=/\b(?:retet\w*|recipe\w*|ingredient\w*|cum\s+(?:se\s+)?(?:prepar\w*|gatesc|gatesti|gati\w*|face|fac)\b|how\s+to\s+cook|sarmal\w*|ciorb\w*\s+de\s+burt\w*)\b/i.test(text);
 const m=text.match(/\b(\d{1,2}|o|un|una|one|doua|doi|two|trei|three|patru|four|cinci|five|sase|six)\s+(?:(?:variante?|tipuri|versions?|variants?)\s+(?:de|of)\s+)?(?:retet\w*|recipes?)\b/)
  ||text.match(/\b(\d{1,2}|one|two|three|four|five|six)\s+(?:[a-z]+\s+){1,3}recipes?\b/);
 const wantsSeveral=!m&&/\b(?:(?:mai\s+)?multe|cateva|several|multiple|more|different|diverse)\s+(?:(?:variante?|types?|versions?)\s+(?:de|of)\s+)?(?:retet\w*|recipes?)\b/.test(text);
 const pluralRecipes=/\b(?:retete|recipes)\b/.test(text);
 const count=m?Math.min(6,Math.max(1,Number(m[1])||numberWords[m[1]]||1)):(wantsSeveral||pluralRecipes?3:1);
 return {isRecipe,count,keywords:recipeDishKeywords(input)};
}
export function culinarySearchQuery(input,language='ro'){
 const terms=recipeDishKeywords(input);
 const dish=terms.slice(0,8).join(' ');
 const hints=language==='ro'?'reteta ingrediente mod de preparare':'recipe ingredients preparation method';
 return (dish?dish+' ':normalize(input)+' ')+hints;
}
