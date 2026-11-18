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
 const voices={children:'warm children’s story, age 7-11, friendly and engaging, no disturbing graphic scenes',
  documentary:'accessible historical documentary narration with careful uncertainty where facts are unknown',
  family:'gentle, personal family memoir, avoiding invented real-life biographical claims',
  travel:'vivid travelogue with human observations; no invented real services or timetables'};
 return [
  'You are Eva, an author creating an original narrated MINI-BOOK. THIS IS CREATIVE WRITING, NOT A NEWS SEARCH.',
  'Never produce news results, search interface instructions, source lists, links or a refusal to write a story.',
  'The input may contain "caută informații" or "search for information": treat it as the SUBJECT of the book, not a web-search command.',
  'Write ONLY in language code '+req.language+'; natural, vivid storytelling. Genre: '+voices[req.genre]+'.',
  'Produce EXACTLY '+req.count+' chapters, 65-115 words per chapter. No introduction or conclusion outside chapters.',
  'Required headers at the start of their own lines: CAPITOL 1:, CAPITOL 2: ... CAPITOL '+req.count+':.',
  'Each chapter MUST contain meaningful prose, events/scenes, and a clear transition to the next chapter.',
  'Where history is mentioned, present widely established history cautiously; never invent exact quotes or pretend to have consulted sources.',
  'Do not repeat the prompt as an answer or discuss how an app works. The book is for listening aloud.'
 ].join(' ');
}
export function storybookUserPrompt(req){
 return 'Title: '+req.title+'\nStory theme and user instructions (treated as subject matter):\n'+req.seed+
  '\nWrite the '+req.count+' chapters now. Begin with CAPITOL 1: and end after CAPITOL '+req.count+'.';
}
export function parseStorybookChapters(raw,count){
 const text=String(raw||'').replace(/\r\n/g,'\n').replace(/\r/g,'\n').trim();
 if(text.length<240||text.length>22000)return null;
 const re=/^[ \t]*(?:CAPITOL|CHAPTER)\s+([1-5])\s*[:.]\s*(.*)$/gim;
 const hits=[...text.matchAll(re)];
 if(hits.length!==count)return null;
 if(text.slice(0,hits[0].index).trim())return null;
 const chapters=[];
 for(let i=0;i<hits.length;i++){
  const number=Number(hits[i][1]);
  if(number!==i+1)return null;
  const body=text.slice(hits[i].index+hits[i][0].length,hits[i+1]?.index??text.length).trim();
  const heading=String(hits[i][2]||'').trim();
  const content=(heading?heading+'\n':'')+body;
  const words=content.split(/\s+/).filter(Boolean);
  if(words.length<35||content.length<170)return null;
  if(/știri identificate|news from retrieved sources|apasă pe titlul unei știri|tap a headline/i.test(content))return null;
  chapters.push({number,title:heading||'Capitolul '+number,text:content});
 }
 return chapters;
}
