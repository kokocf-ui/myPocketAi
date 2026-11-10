// Publisher-grounded culinary completeness. Never infer an ingredient or method from
// a search snippet, an unrelated article paragraph, or a video-only recipe card.
const clean=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const INGREDIENT=/\b(?:ingrediente|ingredients|zutaten|ingredientes|ingredienti|ingrédients|skladniki)\b/i;
const METHOD=/^\s*(?:mod\s+de\s+preparare|mod\s+de\s+pregatire|method|preparation|instructions|directions|zubereitung|preparación|preparazione|przygotowanie)\b/i;
const STOP=/^\s*(?:nutritie|nutriție|nutrition|calorii|nutrition facts|comentarii|comments|recenzii|reviews|retete similare|rețete similare|articole similare|distribuie|share|scrie un comentariu)\b/i;
const quantity=/^(?:\d|[½¼¾⅓⅔]|un(?:a|u|ul)?\b|o\b|sare\b|piper\b|apa\b|apă\b|bors\b|borș\b|ulei\b|smantana\b|smântână\b|optional\b|opțional\b|dupa\b|după\b|putin\b|puțin\b|cateva\b|câteva\b)/i;
function stripHtml(html){
 return String(html||'').slice(0,400000)
  .replace(/<(script|style|noscript|svg|nav)\b[^>]*>[\s\S]*?<\/\1>/gi,' ')
  .replace(/<li\b[^>]*>/gi,'\n- ').replace(/<\/li\s*>/gi,'\n')
  .replace(/<(?:h[1-6]|p|div|section|ul|ol|br|tr)\b[^>]*>/gi,'\n')
  .replace(/<\/(?:h[1-6]|p|div|section|ul|ol|tr)\s*>/gi,'\n')
  .replace(/<[^>]+>/g,' ')
  .replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&')
  .replace(/&quot;/gi,'"').replace(/&apos;|&#39;/gi,"'")
  .replace(/&#x([0-9a-f]+);/gi,(_,n)=>String.fromCodePoint(Math.min(0x10ffff,parseInt(n,16))))
  .replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Math.min(0x10ffff,Number(n))))
  .replace(/[ \t]+/g,' ');
}
function ingredientLine(line){
 const v=String(line||'').trim().replace(/^(?:[-*•]\s*)+(?:\[\s*Input\s*\]\s*)?/i,'')
   .replace(/^\[\s*Input\s*\]\s*/i,'').replace(/^\[[ xX]\]\s*/,'').trim();
 if(!v||v.length>190||/^(?:pentru\s+(?:ciorb|perișo|periso|final)|for\s+(?:the|soup|meatballs))[^.]{0,50}:\s*$/i.test(v))return '';
 if(/^(?:ingrediente|mod de preparare|method|nutrition|timp de|portii|porții|servings)\b/i.test(v))return '';
 if(!quantity.test(v)&&!/[0-9]/.test(v)&&v.length>65)return '';
 if(/(?:https?:\/\/|www\.|@|reclama|publicitate|ad choices)/i.test(v))return '';
 return v;
}
function ingredientLines(lines){
 return lines.map(line=>{
   const marked=/^\s*(?:[-*•]|\[\s*Input\s*\])/i.test(line);
   return marked?ingredientLine(line):'';
 }).filter(Boolean);
}
function methodEvidence(lines){
 const trimmed=[];
 for(const line of lines){
  if(STOP.test(line)&&trimmed.length)break;
  if(trimmed.join('').length>10500)break;
  trimmed.push(line);
 }
 const body=trimmed.join('\n').trim();
 const norm=clean(body);
 const videoOnly=/(?:instructiunile|instructiuni|modul de preparare).{0,125}(?:clipul|videoclipul|videoul|video-ul|filmul)\b/.test(norm)
  || /(?:watch|follow|see|find).{0,90}(?:video|clip).{0,50}(?:instructions|method|recipe)/i.test(body);
 const numbered=(body.match(/^\s*(?:\d{1,2}[.)]\s|pasul\s+\d+)/gim)||[]).length;
 const verbs=(norm.match(/\b(?:curata|taie|toaca|incinge|caleste|fierbe|adauga|amesteca|formeaza|pune|lasa|asezoneaza|serveste|pregateste|spala|rastoarna|scoate|cook|chop|mix|stir|simmer|boil|add|heat|pour|serve|bake|combine|slice)\w*/g)||[]).length;
 return {body,videoOnly,numbered,verified:!videoOnly&&(numbered>=2||(body.length>=160&&verbs>=3))};
}
// This inspector is deliberately conservative. The absence of verifiable
// instructions is NOT permission to generate instructions from memory.
export function inspectPublisherRecipeEvidence(page,{html=false}={}){
 const text=(html?stripHtml(page):String(page||'')).replace(/\r\n?/g,'\n')
   .replace(/^\s*#{1,6}\s*/gm,'').replace(/\[\s*Input\s*\]/gi,'')
   .replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n');
 const lines=text.split('\n').map(x=>x.trim()).filter(Boolean);
 const candidates=[];
 for(let i=0;i<lines.length;i++){
  const heading=clean(lines[i]);
  if(lines[i].length>145||!INGREDIENT.test(heading))continue;
  if(!/^(?:ingrediente|ingredients|zutaten|ingredientes|ingredienti|ingredients\s+for|ciorba.{0,85}ingrediente|ciorba.{0,85}ingredients)/i.test(heading)
     && !/reteta.{0,85}ingrediente/i.test(heading))continue;
  const methodIndex=lines.findIndex((line,j)=>j>i&&j<i+160&&METHOD.test(clean(line)));
  if(methodIndex<0)continue;
  const ingredients=ingredientLines(lines.slice(i+1,methodIndex));
  if(ingredients.length<3)continue;
  const method=methodEvidence(lines.slice(methodIndex+1,methodIndex+130));
  candidates.push({ingredients,method,first:i,last:methodIndex});
 }
 candidates.sort((a,b)=>b.ingredients.length-a.ingredients.length);
 const best=candidates[0];
 if(!best)return {ingredients:[],methodVerified:false,videoOnly:false,excerpt:''};
 const ingredients=[...new Set(best.ingredients)].slice(0,45);
 const excerpt='Ingrediente:\n'+ingredients.map(x=>'- '+x).join('\n')+
  '\n\nMod de preparare:\n'+best.method.body.slice(0,8000);
 return {ingredients,methodVerified:best.method.verified,videoOnly:best.method.videoOnly,
  numberedSteps:best.method.numbered,excerpt,languageHint:/\b(?:ingrediente|mod de preparare)\b/i.test(lines[best.first])?'ro':''};
}
function parseAnswerSections(text){
 const raw=String(text||'');
 const ing=raw.match(/(?:^|\n)(?:Ingrediente|Ingredients|Zutaten|Ingrédients|Ingredientes)\s*:\s*\n([\s\S]*?)(?=\n(?:Mod de preparare|Method|Preparation|Instructions|Preparare)\s*:)/i);
 const method=raw.match(/(?:^|\n)(?:Mod de preparare|Method|Preparation|Instructions|Preparare)\s*:\s*\n([\s\S]*?)(?=\n(?:Sursa|Source)\s*:|$)/i);
 return {ing,method,items:ing?ing[1].split('\n').filter(x=>/^\s*[-•]\s+\S/.test(x)):[],
  steps:method?(method[1].match(/^\s*\d{1,2}[.)]\s+\S/gm)||[]).length:0};
}
export function repairRecipeFromPublisher(answer,source,language,dish=''){
 let text=String(answer||'').trim();
 const {ing,method,items,steps}=parseAnswerSections(text);
 if(!ing||!method||steps<2)return '';
 const evidence=source?.recipeCoverage||inspectPublisherRecipeEvidence(source?.pageEvidence||'');
 if(evidence.videoOnly)return '';
 // When a full ingredient list is available from the original publisher in
 // the requested language, use the factual quantities directly: no LLM summary.
 const schema=source?.publishedRecipes?.[0];
 const officialItems=(schema?.ingredients?.length>=3?schema.ingredients:evidence.ingredients)||[];
 const sourceLang=source?.pageLanguage||evidence.languageHint;
 if(officialItems.length>=5&&sourceLang===language){
  const block=ing[0];
  const replacement=block.replace(ing[1],officialItems.map(x=>'- '+x).join('\n')+'\n');
  text=text.replace(block,replacement);
 }else if(officialItems.length>=5&&items.length<officialItems.length){
  return ''; // A translated, shortened shopping list is not the publisher recipe.
 }
 const repaired=parseAnswerSections(text);
 const soup=/\b(?:ciorb|soup|supa|supă|bors|borș|perisoar|perișoar)\w*/i.test(clean(dish));
 if(soup&&(repaired.items.length<7||repaired.steps<3))return '';
 const methodText=clean(repaired.method?.[1]||'');
 const vague=/\b(?:pregateste ingredientele|prepare the ingredients|follow the instructions|urmarest[eie] videoclipul)\b/.test(methodText);
 if(vague&&(repaired.steps<=3||methodText.length<200))return '';
 if(soup&&methodText.length<145)return '';
 // A source with a known but video-only procedure was already rejected. When
 // an article has no identified method, avoid claiming publisher verification.
 if(evidence.ingredients?.length>=5&&!evidence.methodVerified&&!schema?.instructions?.length)return '';
 return text;
}
