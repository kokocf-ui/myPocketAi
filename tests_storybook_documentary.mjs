import assert from 'node:assert/strict';
import backend from './backend.js';
import {normalizeStorybookRequest,storybookSystemPrompt,storybookUserPrompt,storybookQualityIssue} from './storybook_generation.mjs';
import {fetchStorybookHistory} from './storybook_history_research.mjs';

const input={title:'Decebal',story_seed:'Documentar despre regele dacilor Decebal și războaiele dacice cu Roma.',chapter_count:3,story_type:'documentary',language:'ro',module:'creative_storybook'};
const doc=normalizeStorybookRequest(input);
assert.equal(doc?.genre,'documentary');
const documentaryPrompt=storybookSystemPrompt(doc);
assert.match(documentaryPrompt,/NON-FICTION DOCUMENTARY/);
assert.match(documentaryPrompt,/NOT a fiction writer/);
assert.match(documentaryPrompt,/Never invent quotations/);
assert.doesNotMatch(documentaryPrompt,/talented original fiction author/);
const child=normalizeStorybookRequest({...input,story_type:'children'});
assert.match(storybookSystemPrompt(child),/original fiction author/);
assert.match(storybookSystemPrompt(child),/specific scene/);

const source={
 title:'Decebal',
 extract:'Decebal a fost ultimul rege al Daciei, conducător între 87 și 106. În vremea sa s-au desfășurat războaiele dacice împotriva Imperiului Roman, conduse de împăratul Traian. După cel de-al doilea război dacic, în anul 106, Dacia a fost cucerită de romani, iar Decebal a murit. Aceste evenimente au avut urmări importante pentru istoria regiunii și pentru Dacia romană.',
 fullurl:'https://ro.wikipedia.org/wiki/Decebal',
 index:1
};
let wikiRequests=0,aiRequests=0;
const realFetch=globalThis.fetch;
const wikiMock=async (url)=>{
 wikiRequests++;
 assert.match(String(url),/wikipedia\.org\/w\/api\.php/);
 const u=new URL(url);
 assert.equal(u.searchParams.get('gsrsearch'),'Decebal');
 return new Response(JSON.stringify({query:{pages:[{title:source.title,extract:source.extract,fullurl:source.fullurl,index:1}]}}),{status:200});
};
const body='Decebal a fost unul dintre cei mai importanți conducători ai Daciei antice. În timpul domniei sale, Dacia a fost implicată în confruntări cu Imperiul Roman, una dintre cele mai puternice forțe ale lumii antice. Războaiele dacice au fost legate de expansiunea romană și de rezistența dacilor. În urma celui de-al doilea război, Dacia a intrat sub stăpânirea Romei. Istoria acestor evenimente este importantă pentru înțelegerea transformărilor politice și culturale din regiune, iar monumentele moderne dedicate lui Decebal sunt reprezentări artistice realizate mult după viața acestuia.';
const documentary=Array.from({length:3},(_,i)=>'CAPITOL '+(i+1)+':\n'+body).join('\n\n');
assert.equal(storybookQualityIssue(Array.from({length:3},()=>({text:body})),doc),null);
const fictional=Array.from({length:3},()=>({text:'Într-o zi, un tânăr istoric pe nume Alex a pornit în căutarea unui mormânt al lui Decebal. '+body}));
assert.equal(storybookQualityIssue(fictional,doc),'documentary_fictional_framing');
assert.match(storybookUserPrompt(doc,{title:'Decebal',excerpt:source.extract}),/REFERENCE FACTS/);

try{
 globalThis.fetch=wikiMock;
 const found=await fetchStorybookHistory('Decebal',{language:'ro',fetchImpl:wikiMock});
 assert.equal(found.status,'success');
 assert.equal(found.sources[0].url,source.fullurl);
 assert.equal(found.title,'Decebal');
 const env={AI:{run:async(_model,options)=>{
  aiRequests++;
  assert.match(options.messages[0].content,/NON-FICTION DOCUMENTARY/);
  assert.match(options.messages[1].content,/REFERENCE FACTS/);
  return {response:documentary};
 }}};
 const ask=async()=>backend.fetch(new Request('https://example.test/api/chat',{
  method:'POST',headers:{'Content-Type':'application/json'},
  body:JSON.stringify({...input,message:input.story_seed})
 }),env);
 const response=await ask(),data=await response.json();
 assert.equal(response.status,200);
 assert.equal(data.status,'success');
 assert.equal(data.story_type,'documentary');
 assert.equal(data.source_research_performed,true);
 assert.equal(data.references[0].url,source.fullurl);
 assert.equal(aiRequests,1);
 const again=await fetchStorybookHistory('Decebal',{language:'ro',fetchImpl:wikiMock});
 assert.equal(again.status,'success');
 assert.equal(wikiRequests,1,'Research must be cached, not re-requested');
}finally{globalThis.fetch=realFetch}
console.log('PASS: factual documentary prompt, source grounding, fictional-framing rejection and cached research');
