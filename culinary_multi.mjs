import {recipeSpeciesCompatible} from './culinary_intent.mjs';
// Build multiple separate source-backed cooking variants. Neither a model
// prompt nor a list of search results proves that the requested count was met.
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
 .toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export function recipeIngredientSignature(text){
 const t=String(text||'');
 const match=t.match(/(?:^|\n)(?:Ingrediente|Ingredients|Zutaten|Ingrédients|Ingredientes)\s*:\s*\n([\s\S]*?)(?=\n(?:Mod de preparare|Method|Preparation|Instructions|Preparare)\s*:|$)/i);
 if(!match)return [];
 return [...new Set(match[1].split('\n').map(x=>norm(x.replace(/^\s*[-•]\s*/,'')))
   .map(x=>x.replace(/^(?:\d+(?:[.,]\d+)?\s*)+(?:g|kg|ml|l|linguri|lingurite|bucati|cups?|tbsp|tsp)?\s*(?:de\s+)?/,'').trim())
   .filter(x=>x.length>=3))].sort();
}
// A complete cooking recipe is more than a shopping/product catalog.
// For sarmale, a three-item list with store brand names is not a
// sufficiently documented preparation to count as a separate recipe.
export function recipeQualityGate(text,dish=''){
 const raw=String(text||'');
 const section=raw.match(/(?:^|\n)(?:Ingrediente|Ingredients|Zutaten|Ingrédients|Ingredientes)\s*:\s*\n([\s\S]*?)(?=\n(?:Mod de preparare|Method|Preparation|Instructions|Preparare)\s*:|$)/i);
 if(!section)return false;
 const ingredients=section[1].split('\n').filter(x=>/^\s*[-•]\s+\S/.test(x));
 if(ingredients.length<3)return false;
 if(!recipeSpeciesCompatible(dish,raw.slice(0,section.index+section[0].length)))return false;
 if(ingredients.some(x=>/\b(?:carrefour|kaufland|auchan|tesco|lidl|aldi|walmart|sainsburys|drag\s+de\s+romania)\b/i.test(norm(x))))return false;
 if(/\bsarmal/.test(norm(dish))){
  if(ingredients.length<5)return false;
  if(!/(?:varza|cabbage|frunze|foi\s+de\s+vita|grape\s+leaves)/i.test(norm(raw)))return false;
 }
 return true;
}
function isSameVariant(a,b){
 if(!a.length||!b.length)return false;
 const set=new Set(a),overlap=b.filter(x=>set.has(x)).length;
 return overlap/Math.max(a.length,b.length)>=0.78;
}
export async function assembleSourcedRecipeVariants({
 count=1,openEnded=false,language='ro',request='',dish='',sources=[],published=[],
 renderPublished,renderSource,validate
}){
 const requested=Math.min(12,Math.max(1,Number(count)||1)),items=[],usedUrls=new Set(),signatures=[];
 const languageLabel=language==='ro'?'Rețeta ':'Recipe ';
 const sourceLabel=language==='ro'?'Sursa: ':'Source: ';
 const apply=(value,source,kind)=>{
  if(!source||typeof source.url!=='string'||!/^https:\/\//i.test(source.url))return false;
  let content=typeof value==='string'?value.trim():'';
  if(!content||!recipeQualityGate(content,dish)||!validate(content,source))return false;
  content=content.replace(/(?:\n|^)\s*(?:Sursa|Source)\s*:[^\n]*/gi,'').trim();
  const signature=recipeIngredientSignature(content);
  if(signature.length<3||signatures.some(s=>isSameVariant(s,signature)))return false;
  if(usedUrls.has(source.url))return false;
  const n=items.length+1;
  content=content.replace(/^\s*(?:Rețeta|Reteta|Recipe)\s+\d+(?=\s*[—:-])/i,languageLabel+n);
  // Preserve the dish-specific title, not an arbitrary model-supplied source.
  if(!new RegExp('^(?:Rețeta|Reteta|Recipe)\\s+\\d+\\s*[—:-]','i').test(content))
    content=languageLabel+n+' — '+dish+'\n\n'+content;
  content=content+'\n\n'+sourceLabel+source.url;
  items.push({text:content,source,kind});usedUrls.add(source.url);signatures.push(signature);
  return true;
 };
 for(const item of published){
  if(items.length>=requested)break;
  if(!item||!item.source||!item.recipe)continue;
  const native=typeof renderPublished==='function'
    ?renderPublished(item.recipe,language,item.source,items.length+1):'';
  apply(native,item.source,'publisher_structured');
 }
 if(items.length<requested&&typeof renderSource==='function'){
  const waiting=sources.filter(s=>s&&s.url&&!usedUrls.has(s.url)&&
    (s.pageEvidence||(s.publishedRecipes&&s.publishedRecipes.length)));
  // Only a bounded parallel batch. Avoid repeating a single publisher URL
  // or burning unrestricted Workers AI calls.
  const unique=[...new Map(waiting.map(s=>[s.url,s])).values()];
  const pool=unique.slice(0,Math.min(10,Math.max(4,requested*2+1)));
  const firstBatch=Math.min(4,Math.max(2,requested));
  // Work through a second batch only when fewer real variants have passed
  // validation. This improves recall without always spending 7 AI calls.
  for(let start=0;start<pool.length&&items.length<requested;start+=firstBatch){
   const batch=pool.slice(start,start+firstBatch);
   const answers=await Promise.allSettled(batch.map(source=>renderSource(source)));
   for(let i=0;i<answers.length&&items.length<requested;i++){
    if(answers[i].status!=='fulfilled')continue;
    apply(answers[i].value,batch[i],'publisher_assisted');
   }
  }
 }
 const missing=requested-items.length;
 const warning=missing>0?(openEnded
  ?(language==='ro'?'Am găsit '+items.length+' variante distincte în sursele consultate până acum. Poți cere și alte variante.':'I found '+items.length+' distinct variants in the sources checked so far. You can request more.')
  :(language==='ro'
  ?'Am găsit '+items.length+' din cele '+requested+' rețete cerute cu ingrediente și pași susținuți de sursele disponibile. Nu voi inventa restul.'
  :'I found '+items.length+' of '+requested+' requested recipes with ingredients and steps supported by available sources. I will not invent the rest.')):'';
 return {count:items.length,requested,missing,
  reply:(warning?warning+(items.length?'\n\n':''):'')+items.map(x=>x.text).join('\n\n────────────────\n\n'),
  sources:items.map(x=>x.source),provenance:items.map(x=>x.kind)};
}
