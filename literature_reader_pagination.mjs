// Reusable, layout-independent page segmentation for lengthy Education texts.
// Keeps paragraph/stanza breaks and never changes the original document used for PDF.
export function splitLiteraturePages(raw,pageCharacters=850){
 const text=String(raw||'').replace(/\r\n?/g,'\n').trim();
 if(!text)return [];
 const limit=Math.max(280,Math.min(2600,Number(pageCharacters)||850));
 const pages=[];let current='';
 const flush=()=>{if(current.trim())pages.push(current.trim());current=''};
 const add=(unit,separator='\n\n')=>{
  if(!unit)return;
  if(current&&current.length+separator.length+unit.length>limit)flush();
  current+=current?separator+unit:unit;
 };
 const sliceLong=block=>{
  const tokens=block.match(/\S+\s*/g)||[block];
  let part='';
  const parts=[];
  for(let token of tokens){
   if(part&&part.length+token.length>limit){parts.push(part.trimEnd());part=''}
   while(token.length>limit){
    if(part){parts.push(part.trimEnd());part=''}
    parts.push(token.slice(0,limit));token=token.slice(limit);
   }
   part+=token;
  }
  if(part.trim())parts.push(part.trimEnd());
  return parts;
 };
 for(const block of text.split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean)){
  if(block.length<=limit){add(block);continue}
  flush();
  // Break long paragraphs and poetry on complete word boundaries where possible.
  for(const piece of sliceLong(block)){add(piece,'\n');}
 }
 flush();
 return pages;
}

// Fit actual rendered text into the available reader height. A phone reader
// page is a screen of readable text; PDF A4 sheet count is measured separately.
// The callback is UI-owned, making this algorithm independently testable.
export function paginateLiteratureByFit(raw,fits){
 const text=String(raw||'').replace(/\r\n?/g,'\n').trim();
 if(!text)return [];
 if(typeof fits!=='function')return splitLiteraturePages(text,2000);
 const tokens=text.match(/\S+\s*/g)||[];
 if(!tokens.length)return [];
 const pages=[];
 let start=0;
 while(start<tokens.length){
  let low=start+1,high=tokens.length,best=start;
  while(low<=high){
   const mid=Math.floor((low+high)/2);
   const candidate=tokens.slice(start,mid).join('').trim();
   let good=false;
   try{good=Boolean(fits(candidate))}catch{good=false}
   if(good){best=mid;low=mid+1}
   else high=mid-1;
  }
  if(best===start)best=start+1; // Progress even for a single extra-long token.
  pages.push(tokens.slice(start,best).join('').trim());
  start=best;
 }
 return pages;
}
