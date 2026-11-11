// High-confidence guard for degenerate language-model responses.
// Detects repeated long sentences or entire repeated paragraphs; it does not
// rewrite legitimate lists, code samples, poetry, or short emphasis.
function normalizeChunk(value){
 return String(value||'').toLocaleLowerCase('und').normalize('NFKC')
   .replace(/[\p{P}\p{S}\s]+/gu,' ').trim();
}
export function hasAssistantRepetitionLoop(text){
 const raw=String(text||'');
 if(raw.length<170)return false;
 // Code and quoted/structured content can intentionally repeat lines.
 const plain=raw.replace(/```[\s\S]*?```/g,'');
 const paragraphs=plain.split(/\n\s*\n+/g).map(normalizeChunk).filter(v=>v.length>=65);
 const seenParagraphs=new Map();
 for(const para of paragraphs){
  const count=(seenParagraphs.get(para)||0)+1;
  if(count>=3)return true;
  seenParagraphs.set(para,count);
 }
 // A short paragraph can contain many identical full sentences.
 const sentences=(plain.match(/[^.!?\n]+[.!?]+(?:[»”"']+)?/gu)||[])
   .map(normalizeChunk).filter(v=>v.length>=48);
 const seenSentences=new Map();
 for(const sentence of sentences){
  const count=(seenSentences.get(sentence)||0)+1;
  if(count>=3)return true;
  seenSentences.set(sentence,count);
 }
 // A single long repeated text block without paragraph punctuation.
 const lines=plain.split(/\n+/).map(normalizeChunk).filter(x=>x.length>=80);
 const seenLines=new Map();
 for(const line of lines){
  const count=(seenLines.get(line)||0)+1;
  if(count>=3)return true;
  seenLines.set(line,count);
 }
 return false;
}
