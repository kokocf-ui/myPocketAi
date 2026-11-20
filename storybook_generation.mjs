// Isolated creative-writing contract. Does not call news, maps or search.
export function normalizeStorybookRequest(data){
 const seed=String(data?.story_seed||data?.message||'').trim().slice(0,3500);
 const title=String(data?.title||'').trim().slice(0,120);
 const count=Number(data?.chapter_count);
 const genre=['children','documentary','family','travel'].includes(data?.story_type)?data.story_type:'children';
 const language=['ro','en','fr','de','it','es','pt','nl','pl','hu'].includes(data?.language)?data.language:'ro';
 if(seed.length<20||title.length<2||!Number.isInteger(count)||count<3||count>5)return null;
 return {seed,title,count,genre,language};
}
export function storybookSystemPrompt(req){
 const frame=[
  'Write ONLY in language code '+req.language+'.',
  'Produce EXACTLY '+req.count+' chapters, about 105-155 words per chapter. No introduction or conclusion outside chapters.',
  'Required headers on separate lines with NO prose after colon: CAPITOL 1:, CAPITOL 2: ... CAPITOL '+req.count+':. Start the full text on the next line.',
  'Never output a fragment, a partial word, a repeated header or a cut-off sentence. Finish every chapter with complete sentences.',
  'Do not repeat the same facts or paragraph from one chapter to another. Make each chapter contribute genuinely new material.'
 ];
 if(req.genre==='documentary'){
  return [
   'You are Eva, a rigorous, captivating factual documentary narrator, NOT a fiction writer. THIS IS A NON-FICTION DOCUMENTARY.',
   'The subject is the real subject named by the user. Do not turn it into a plot about a historian, child, tourist, explorer, adventurer, or any invented present-day person.',
   'Only state claims supported by the REFERENCE FACTS supplied with the request. Never invent quotations, burial locations, new discoveries, dates, names, expeditions, private feelings or conversations.',
   'Organize the episodes coherently: historical context, the main person/event and its real actions, consequences, and legacy, according to the supplied reference facts. Avoid dry encyclopaedia bullet points.',
   'Tell the history vividly through concrete, verifiable details, meaningful contrasts, causality and consequences. Open with a striking documented fact, not "one day" or a fictional landscape scene.',
   'Explain why each event mattered. Distinguish historical sources, scholarly interpretations and modern artistic representations.',
   'When a fact cannot be established from the supplied reference, leave it out. Never fabricate a missing fact to make the narrative longer.',
   'Cite the source only in the accompanying metadata, not as an intrusive repeated sentence in every paragraph.',
   ...frame
  ].join(' ');
 }
 const voices={
  children:'vivid, age-appropriate adventure for children aged 7-11 with lively but natural dialogue, emotional stakes and a satisfying discovery; not baby talk',
  family:'warm, psychologically believable family story with specific moments and authentic emotion, without inventing real biographical facts',
  travel:'vivid travel writing with sensory details and human observations, never invented timetables or service claims'
 };
 return [
  'You are Eva, a talented original fiction author. THIS IS CREATIVE WRITING, NOT A NEWS SEARCH.',
  'The user supplies the subject, not a request to show a search result. Write a polished literary miniature, NOT a school summary or generic moral.',
  'Genre: '+(voices[req.genre]||voices.children)+'.',
  'Every chapter must unfold as a specific scene with a setting, character desire, obstacle or discovery, action and consequence: a specific scene, not an outline.',
  'Keep cause and effect plausible and consistent across scenes. Unless fantasy was explicitly requested, do not introduce arbitrary supernatural solutions, implausible animals or numbers, mechanically impossible actions or random twists unrelated to what came before. Set up and resolve each obstacle through earned character decisions.',
  'Choose vivid but economical images, natural cause-and-effect, realistic dialogue where appropriate, suspense or curiosity, and an ending that pays off something introduced earlier.',
  'Do not narrate only what characters imagine, decide or read. Make things actually happen on the page.',
  'Avoid filler: "intr-o zi" starts, generic mountains/forests, repeated descriptions, "a decis să afle mai multe" as a substitute for plot, repeated morals and summaries.',
  'If history appears, distinguish actual history from clearly fictional dramatization. Never pretend a fictional episode was a real historical fact.',
  ...frame
 ].join(' ');
}
export function storybookUserPrompt(req,reference=null){
 const intro='Title: '+req.title+'\nStory theme and user instructions:\n'+req.seed;
 if(req.genre==='documentary'){
  const facts=String(reference?.excerpt||'').trim();
  const title=String(reference?.title||'').trim();
  return intro+'\nREFERENCE FACTS from '+title+' (encyclopaedia excerpt; use them carefully, without copying verbatim):\n'+
   facts+'\nDOCUMENTARY TASK: Produce '+req.count+' factual chapters on the historical subject. Use only supported information. Begin with CAPITOL 1: on its own line.';
 }
 return intro+'\nWrite exactly '+req.count+' compelling, distinct chapters now. Begin with CAPITOL 1: on its own line and end after CAPITOL '+req.count+'.';
}
export function storybookQualityIssue(chapters,req){
 if(!Array.isArray(chapters)||chapters.length!==req.count)return 'chapters_missing';
 const all=chapters.map(part=>String(part.text||'')).join(' ');
 if(req.genre==='documentary'){
  // Reject invented framing like "Alex, a young historian, set off into the mountains".
  if(/\b(?:într-o zi|one day|once upon a time)\b/i.test(all)||
    /\b(?:un tânăr|o tânără|un băiat|o fată|un istoric|un cercetător|un aventurier|a young historian|an explorer)\s+(?:pe nume|numit|numită|called|named)\b/i.test(all)||
    /\b(?:a pornit în căutarea|a decis să caute|set off to find|went looking for)\b/i.test(all)){
   return 'documentary_fictional_framing';
  }
  const relevant=String(req.title||'').toLocaleLowerCase().split(/\s+/).filter(x=>x.length>=5);
  if(relevant.length&&!relevant.some(word=>all.toLocaleLowerCase().includes(word)))return 'documentary_subject_missing';
 }
 for(const chapter of chapters){
  if(String(chapter.text||'').trim().split(/\s+/).length<55)return 'chapter_too_short';
  if(!/[.!?…]["”’']?\s*$/.test(String(chapter.text||'').trim()))return 'chapter_incomplete';
 }
 return null;
}

export function parseStorybookChapters(raw,count){
 const text=String(raw||'').replace(/\r\n/g,'\n').replace(/\r/g,'\n').trim();
 if(text.length<240||text.length>22000)return null;
 const re=/^[ \t]*(?:#{1,3}[ \t]*)?(?:\*\*)?(?:CAPITOLUL|CAPITOL|CHAPTER)\s+([1-5])\s*[:.]\s*(.*)$/gim;
 const hits=[...text.matchAll(re)];
 if(hits.length!==count)return null;
 if(text.slice(0,hits[0].index).trim())return null;
 const chapters=[];
 for(let i=0;i<hits.length;i++){
  const number=Number(hits[i][1]);
  if(number!==i+1)return null;
  const body=text.slice(hits[i].index+hits[i][0].length,hits[i+1]?.index??text.length).trim();
  const inline=String(hits[i][2]||'').replace(/\*\*/g,'').trim();
  // Some models write the first sentence on the chapter header. Preserve it as prose.
  const prose=inline.length>58||inline.split(/\s+/).length>8||/[.!?;:]/.test(inline);
  const heading=inline&&!prose?inline:'';
  const intro=prose?inline.replace(/\s+[bcdfghjklmnpqrstvwxyz]$/i,'').trim():'';
  const content=(intro?intro+'\n':'')+body;
  const words=content.split(/\s+/).filter(Boolean);
  if(words.length<35||content.length<170)return null;
  if(/știri identificate|news from retrieved sources|apasă pe titlul unei știri|tap a headline/i.test(content))return null;
  chapters.push({number,title:heading||'Capitolul '+number,text:content});
 }
 return chapters;
}
