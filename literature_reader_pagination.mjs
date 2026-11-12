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
