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
 if(essay)return [
  'The task is a FINISHED ESSAY, never a lesson, outline or worksheet.',
  'Write naturally in the requested language; when Romanian is requested, use fluent standard Romanian with diacritics and verify all grammatical agreement (case, gender, number), syntax, spelling and punctuation before finalising.',
  'Compose 5–7 cohesive substantive paragraphs without labels such as Introducere, Argumentul I/II, Obiecție, Concluzie unless explicitly requested.',
  'State one precise, debatable thesis early. Build two genuinely DISTINCT arguments through a specific concrete situation and reasoning; do not merely repeat that a concept is important. Address the strongest relevant objection rather than dismissing it, and end with a synthesis that follows from the argument.',
  'Avoid formulaic openings such as „În acest eseu voi argumenta”, repetitive claims, circular reasoning, unnecessary abstract filler and moralising.',
  'Never invent quotes, bibliographic attributions or examples falsely ascribed to real authors.',
  target?'Target approximately '+target+' words, with a tolerance of about 12 percent.':'Develop substantial prose appropriate to the request.',
  'Do not output discussion questions, a lesson, a quiz or instructions to the learner.'
 ].join(' ');
 if(mode==='write')return 'Deliver the complete finished original composition in the exact requested genre. Respect the required plot, genre and adult tone; ensure natural dialogue and an earned ending. Never substitute a lesson or an outline. Revise spelling, agreement and syntax silently.';
 if(mode==='lesson'||mode==='study')return [
  'Create a full, accurate TEACHING CHAPTER for the stated class and exact topic. Develop definitions, conceptual boundaries, meaningful comparisons, illustrative examples, analysis of effects, common errors and a concise synthesis, not a bullet-only overview.',
  'In literature, distinguish a grammatical feature from a literary effect: an adjective does not automatically become an epithet; figures of speech are identified in context. Explain WHY a device is used, not just WHAT its label is.',
  'For demonstrations compose ORIGINAL short illustrative sentences or a clearly marked original sample passage and analyse it. DO NOT attribute invented examples or quotations to real poems, authors, dates or editions. Only use a verified quoted passage actually supplied in the request when attributing wording to a named work.',
  'If a particular named work is requested without the text, give careful high-level interpretation and label any textual example you create as original, not as a quote.',
  'When writing Romanian, proofread diacritics, inflection, grammatical agreement and punctuation; avoid imported terms and artificial neologisms.',
  'For secondary pupils develop approximately 450–650 meaningful words unless the request specifies otherwise, with connected paragraphs and distinct examples. Do not append a quiz unless one was requested.'
 ].join(' ');
 return '';
}
// Long repeated multiword sequences are a strong signal of circular prose even
// when a text meets the required word count and paragraph structure.
// Use a conservative threshold to avoid penalising normal thematic vocabulary.
export function literatureRepetitiveProse(text){
 const tokens=String(text||'').toLocaleLowerCase()
  .match(/[\p{L}\p{M}]+/gu)||[];
 if(tokens.length<200)return false;
 const counts=new Map();
 for(let i=0;i+5<=tokens.length;i++){
  const phrase=tokens.slice(i,i+5).join(' ');
  counts.set(phrase,(counts.get(phrase)||0)+1);
 }
 let excessive=0;
 for(const n of counts.values()){
  if(n>=3&&++excessive>=4)return true;
 }
 return false;
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
  if(literatureRepetitiveProse(text))return 'essay_repetitive_phrases';
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
