// Shared objective for long-form literature essays. A mobile reader "page"
// is not an A4 PDF sheet. The word budget uses the actual Android PDF's
// 11.5 pt body type, A4 margins and 18 pt line-height as an estimate.
// Native export can measure the final sheet count after pagination.
export function litEssaySpec(input){
 const pages=Math.max(1,Math.min(5,Math.round(Number(input)||3)));
 return Object.freeze({pages,targetWords:pages*400,minWords:pages*340,
   maxWords:pages*480,segments:pages});
}
export function litEssayWords(input){
 return (String(input||'').match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)||[]).length;
}
export function litEssayQuality(input,pages){
 const text=String(input||'').trim();
 const spec=litEssaySpec(pages),words=litEssayWords(text);
 const paras=text.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean);
 const numbered=paras.filter(x=>/^\s*(?:[-*•]|\d+[.)])\s+/.test(x)).length;
 // Disallow a worksheet masquerading as a finished essay.
 if(numbered>=Math.max(3,Math.ceil(paras.length/3)))return {ok:false,reason:'essay_is_outline',words,...spec};
 if(words<spec.minWords)return {ok:false,reason:'essay_too_short',words,...spec};
 if(words>spec.maxWords)return {ok:false,reason:'essay_too_long',words,...spec};
 const fingerprints=paras.filter(x=>litEssayWords(x)>24).map(x=>x.toLocaleLowerCase().replace(/\s+/g,' '));
 if(fingerprints.length>=3&&new Set(fingerprints).size<fingerprints.length-1)
  return {ok:false,reason:'essay_repeated_paragraphs',words,...spec};
 return {ok:true,reason:null,words,...spec};
}
