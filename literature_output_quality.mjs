// Editorial minimums for literature study and school writing.
// These checks catch wrong genres and implausibly short outputs; they cannot
// independently establish factual accuracy, elegance or literary merit.
export function literatureWordCount(value){
 return (String(value||'').match(/[\p{L}\p{M}]{2,}(?:[’'-][\p{L}\p{M}]+)*/gu)||[]).length;
}
export function literatureRequestedWords(request){
 const match=String(request||'').match(/\b(\d{2,4})\s*(?:de\s+)?(?:cuvinte|words)\b/iu);
 const n=Number(match?.[1]||0);
 return n>=100&&n<=2000?n:null;
}
export function literatureOutputInstruction(activity,request=''){
 const mode=String(activity||'').toLowerCase();
 const target=literatureRequestedWords(request);
 const essay=mode==='essay'||(mode==='write'&&/\beseu\b|\bargumentativ\b|\bessay\b/iu.test(request));
 if(essay)return 'The task is a FINISHED ESSAY, not a lesson. Write continuous polished prose divided into natural paragraphs, with a clear defensible thesis, two distinct evidence-based developed arguments, any requested counterargument, and a consequential conclusion. Preserve the exact user topic and audience. Do NOT write a lesson, learning objectives, a worksheet, a quiz, reflection questions, instructions to pupils, or a plan for the essay. '+(target?'The user asks for about '+target+' words; do not shorten it to a one-page sketch. ':'For an unspecified length, develop a substantial essay, not a summary. ')+'Avoid hollow filler, invented quotations, repetitive sentences, and meta-commentary on essay writing.';
 if(mode==='write')return 'Produce the complete finished writing in the requested genre, not a lecture or instructions on how to write it. Maintain credible details, natural paragraphing and the requested tone. Do not add a worksheet or a test.';
 if(mode==='lesson'||mode==='study')return 'Produce a full substantive TEACHING CHAPTER matched to the exact class and topic. Start with accurate definitions and context, develop every major subtopic with causes, contrasts, mechanisms or interpretation, add multiple concrete distinct examples with reasoning, discuss common misunderstandings, and finish with a short synthesis. Use normal paragraphs, clear headings and explain rather than list vague keywords. For upper-secondary grades aim for approximately 450–650 meaningful words (more if required); middle school 300–500, primary age appropriately. Do not append an unrelated test, invented literary quotations or generic learning objectives.';
 return '';
}
export function literatureOutputIssue(reply,activity,request=''){
 const text=String(reply||'').trim();
 if(!text)return 'empty';
 const mode=String(activity||'').toLowerCase();
 const essay=mode==='essay'||(mode==='write'&&/\beseu\b|\bargumentativ\b|\bessay\b/iu.test(request));
 const proseActivity=essay||mode==='lesson'||mode==='study';
 if(!proseActivity)return null;
 const words=literatureWordCount(text);
 if(essay){
  if(/^(?:#{1,4}\s*)?(?:lec(?:ț|t)ie|obiective(?:le)?\s+(?:lec(?:ț|t)iei|de\s+învă(?:ț|t)are)|fi(?:ș|s)(?:ă|a)\s+de\s+lucru|întrebări\s+(?:de\s+)?verificare|test\s+de\s+evaluare)\b/imu.test(text)||
     /\b(?:în cadrul acestei lec(?:ț|t)ii|elevii vor explora|după această lec(?:ț|t)ie)\b/iu.test(text)||
     /(?:^|\n)\s*(?:#{1,4}\s*)?(?:exerci(?:ț|t)ii|întrebări de (?:verificare|reflec(?:ț|t)ie)|test de evaluare)\s*[:\n]/imu.test(text))
    return 'essay_returned_as_lesson';
  if(/(?:^|\n)\s*\d+[.)]\s*(?:Ce\s|Care\s|Când\s|Cum\s|De\s+ce\s|Identifică\s|Explică\s)/imu.test(text))
    return 'essay_contains_quiz';
  const requested=literatureRequestedWords(request);
  if(words<Math.max(220,requested?Math.floor(requested*.72):230))return 'essay_too_short';
  const paragraphs=text.split(/\n\s*\n/).filter(p=>literatureWordCount(p)>=16);
  if(paragraphs.length<3)return 'essay_unstructured';
  const sentences=(text.match(/[.!?…](?:\s|$)/g)||[]).length;
  if(sentences<8)return 'essay_undeveloped';
 }else{
  const grade=String(request).match(/Class\/year:\s*([^.;\n]+)/i)?.[1]||'';
  const n=Number(grade.match(/\d+/)?.[0]||0);
  const min=n>=9?330:n>=5?250:n>=1?130:185;
  if(words<min)return 'lesson_too_short';
  if(!/\n\s*\n/.test(text)&&words>170)return 'lesson_unstructured';
 }
 if(/(?:^|\n)([^\n]{90,})\n\s*\1(?:\n|$)/u.test(text))return 'repeated_paragraph';
 return null;
}
