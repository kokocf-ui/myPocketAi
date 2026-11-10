export const LITERATURE_TASK_UI_SCRIPT=String.raw`

function litSimpleNode(tag,text='',className=''){const el=document.createElement(tag);el.textContent=text;if(className)el.className=className;return el}
function litSimpleButton(text,fn){const b=litSimpleNode('button',text,'lit-activity-button');b.type='button';b.onclick=fn;return b}
function litSimpleLabel(ro,en){return learningLabel(ro,en)}
let litSimpleSerial=0;
async function litSimpleGenerate(out,status,mode,request,source=''){
 if(litJourney.busy)return;
 const serial=++litSimpleSerial;
 const snapshot=[litJourney.country,litJourney.grade,litJourney.branch,litJourney.topic].join('|');
 const plan=litProgram();litJourney.busy=true;
 status.textContent=litSimpleLabel('Se pregătește materialul…','Preparing study material…');
 const language=LIT_LANGUAGES.find(x=>x[0]===litJourney.language)?.[2]||'Romanian';
 const prompt='You are an experienced, careful teacher. Write in '+language+
 '. Country of education: '+(educationCountrySelection.label||litJourney.country)+
 '. Class/year: '+litJourney.grade+'. Profile: '+litJourney.track+'. Region: '+(litJourney.region||'unspecified')+
 '. Curriculum: '+(plan.verified?'official general framework identified, lesson order is pedagogical':'only an advisory plan; do not claim official national grade programme')+
 '. Activity: '+mode+'. Respond directly with the complete useful result, not a short introduction or a form. '+
 'For teaching lessons provide definitions, detailed explanations, grade-appropriate examples, and exercises organised into at least five sections. '+
 'For exercises give several worked examples. For a quiz give five questions without answers in advance. '+
 'For literary study, cover context, themes, construction, stylistic devices and interpretation, without inventing citations. '+
 'For a summary or essay, use only reliably known facts and the user-supplied text; explain uncertainties. '+
 'Do not invent authorship, original work text, exact quotations or national curricula. Never request location/GPS. '+
 'Task: '+request+'. '+source;
 try{
  const response=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({message:eduScopePrompt(prompt),module:'assistant',language:litJourney.language,history:[]})});
  const data=await response.json();
  if(!response.ok||data.status!=='success'||!data.reply)throw Error('no_reply');
  if(!out.isConnected||serial!==litSimpleSerial||snapshot!==[litJourney.country,litJourney.grade,litJourney.branch,litJourney.topic].join('|'))return;
  hgDisplayStudyText(out,String(data.reply).slice(0,72000));
  status.textContent=litSimpleLabel('Material pregătit. Poți salva PDF sau imprima.','Material ready. You can save or print.');
  out.scrollIntoView({behavior:'auto',block:'nearest'});
 }catch{
  if(serial===litSimpleSerial&&status.isConnected)status.textContent=litSimpleLabel('Serviciul AI nu răspunde; reîncearcă fără a pierde selecția.','AI service unavailable. Retry without losing the selection.');
 }finally{litJourney.busy=false}
}
function litSimpleHeading(panel,title,note){
 panel.append(litSimpleNode('h3',title,'lit-activity-heading'));
 if(note)panel.append(litSimpleNode('p',note,'lit-activity-note'));
}
function litSimpleWorkspace(panel){
 const branch=litJourney.branch,topic=litCurrentTopic();
 const country=educationCountrySelection.label||litJourney.country;
 panel.append(litSimpleNode('p',country+' · '+litJourney.grade,'lit-activity-note'));
 if(branch==='literature'){litSimpleLiterature(panel);return}
 if(!topic){panel.append(litSimpleNode('p',litSimpleLabel('Selectează un capitol.','Choose a chapter.')));return}
 const title=litSimpleLabel(topic[1],topic[2]);
 litSimpleHeading(panel,title,litSimpleLabel('Alege o singură activitate. Rezultatul apare aici.','Choose one activity; its result appears here.'));
 const needsInput=['analysis','writing'].includes(branch)||(branch==='vocabulary'&&litJourney.topic==='dictionary');
 const request=needsInput?litSimpleNode(branch==='vocabulary'?'input':'textarea','','lit-input lit-activity-input'):null;
 if(request){request.placeholder=branch==='analysis'?litSimpleLabel('Propoziția sau fragmentul de analizat','Sentence or passage to analyse'):
    branch==='vocabulary'?litSimpleLabel('Cuvântul sau expresia','Word or expression'):
    litSimpleLabel('Cerința de redactare','Writing task');request.setAttribute('aria-label',request.placeholder);if(request.tagName==='TEXTAREA')request.rows=3;panel.append(request)}
 const bar=litSimpleNode('div','','lit-activity-bar');
 const status=litSimpleNode('p','','lit-activity-status');status.setAttribute('role','status');
 const out=litSimpleNode('article','','lit-result lit-activity-output');out.setAttribute('aria-live','polite');
 const run=(mode)=>{
  const phrase=request?.value.trim()||'';
  if(needsInput&&!phrase&&mode!=='lesson'){request.focus();status.textContent=litSimpleLabel('Introdu textul sau cuvântul solicitat.','Enter the requested text or word.');return}
  out.replaceChildren();
  if(mode==='lesson'){
   const basic=LIT_OFFLINE_THEORY_DATA[topic[0]]||LIT_OFFLINE_THEORY_DATA[branch==='vocabulary'?'vocabulary':'grammar'];
   if(basic?.length===4){out.append(litSimpleNode('h4',litSimpleLabel('Repere de bază','Key concepts')));
    out.append(litSimpleNode('p',litSimpleLabel(basic[0],basic[1])));
    out.append(litSimpleNode('h4',litSimpleLabel('Exemplu','Example')));
    out.append(litSimpleNode('p',litSimpleLabel(basic[2],basic[3])))}
  }
  const task=title+'. '+(phrase?'Textul utilizatorului: '+phrase+'. ':'')+'Solicitare: '+mode+'.';
  litSimpleGenerate(out,status,mode,task);
 };
 const buttons=branch==='analysis'?[['Analizează','Analyse','analysis'],['Explică metoda','Explain method','lesson']]:
  branch==='writing'?[['Compune','Compose','write'],['Explică','Explain','lesson']]:
  branch==='vocabulary'&&litJourney.topic==='dictionary'?[['Caută definiția','Define','define'],['Exemple','Examples','examples']]:
  [['Teorie','Theory','lesson'],['Exemple','Examples','examples'],['Exerciții','Exercises','exercises'],['Teste','Tests','test']];
 for(const [ro,en,mode]of buttons)bar.append(litSimpleButton(litSimpleLabel(ro,en),()=>run(mode)));
 panel.append(bar,status,out);
 if(!needsInput)run('lesson');
 const review=litSimpleNode('details','','lit-activity-review'),summary=litSimpleNode('summary',litSimpleLabel('Verifică răspunsurile','Check answers'));
 const answers=litSimpleNode('textarea','','lit-input');answers.rows=3;answers.placeholder=litSimpleLabel('Scrie răspunsurile tale aici','Write your answers here');
 review.append(summary,answers,litSimpleButton(litSimpleLabel('Corectează','Mark answers'),()=>{
  if(!answers.value.trim()||!out.textContent.trim()){answers.focus();return}
  litSimpleGenerate(out,status,'correction','Evaluate the learner answer: '+answers.value.trim(),'Exercises or questions: '+out.textContent.slice(0,10000));
 }));panel.append(review);
}
function litSimpleLiterature(panel){
 litSimpleHeading(panel,litSimpleLabel('Literatură: autor și operă','Literature: author and work'),
  litSimpleLabel('Selectează opera corectă, apoi Studiază, Rezumat, Eseu sau Analiză pe text.','Select a work, then Study, Summary, Essay or Text analysis.'));
 const search=litSimpleNode('input','','lit-input');search.type='search';
 search.placeholder=litSimpleLabel('Titlu — autor (ex.: Luceafărul — Mihai Eminescu)','Title — author');search.setAttribute('aria-label',search.placeholder);
 const feedback=litSimpleNode('p','','lit-activity-status');feedback.setAttribute('role','status');
 const results=litSimpleNode('div','','lit-activity-results');
 const title=litSimpleNode('h3','','lit-activity-heading');
 const acts=litSimpleNode('div','','lit-activity-bar');
 const textArea=litSimpleNode('textarea','','lit-input');textArea.rows=4;textArea.placeholder=litSimpleLabel('Fragment propriu pentru analiză (opțional)','Your own passage for analysis (optional)');
 const passage=litSimpleNode('details','','lit-activity-review');passage.append(litSimpleNode('summary',litSimpleLabel('Adaugă un fragment pentru analiză','Add a passage to analyse')),textArea);
 const out=litSimpleNode('article','','lit-result lit-activity-output');
 let chosen=null,searchNumber=0;
 const select=(name,author,url)=>{
  chosen={name,author,url};title.textContent=name+' — '+author;results.replaceChildren();acts.replaceChildren();
  const types=[['Studiază','Study','study'],['Rezumat','Summary','summary'],['Eseu','Essay','essay'],['Analiză pe text','Text analysis','analysis']];
  for(const [ro,en,mode] of types)acts.append(litSimpleButton(litSimpleLabel(ro,en),()=>{
   out.replaceChildren();litSimpleGenerate(out,feedback,mode,'Opera: '+chosen.name+'. Autor: '+chosen.author+'.',
   'Sursă bibliografică (metadate, nu text integral): '+chosen.url+'. '+
   (textArea.value.trim()?'Fragment introdus de utilizator: '+textArea.value.trim().slice(0,28000):'Text integral indisponibil; nu inventa citate sau lectura unei ediții.'));
  }));
  feedback.textContent=litSimpleLabel('Opera selectată; alege activitatea.','Work selected; choose an activity.');
  title.scrollIntoView({block:'nearest',behavior:'auto'});
 };
 const fold=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
 const find=async()=>{
  const term=search.value.trim(),n=++searchNumber;
  if(term.length<3){feedback.textContent=litSimpleLabel('Introdu cel puțin trei caractere.','Enter at least three characters.');search.focus();return}
  results.replaceChildren();feedback.textContent=litSimpleLabel('Se caută operele…','Searching works…');
  const parts=term.split(/\s+[—–-]\s+/),name=parts[0],author=fold(parts[1]||'');
  const local=[];
  for(const a of LIT_VERIFIED_AUTHORS){if(fold(a.name).includes(fold(name)))
   for(const work of a.works)local.push({title:work.title,author:a.name,url:a.sourceUrl});
   else for(const work of a.works)if(fold(work.title).includes(fold(name)))local.push({title:work.title,author:a.name,url:a.sourceUrl});
  }
  let rows=local;
  if(!rows.length)try{
   const response=await fetch('https://openlibrary.org/search.json?title='+encodeURIComponent(name)+'&limit=25&fields=key,title,author_name',{credentials:'omit'});
   if(!response.ok)throw Error('catalog');
   const data=await response.json();if(n!==searchNumber||!results.isConnected)return;
   rows=(data.docs||[]).flatMap(x=>(x.author_name||[]).map(w=>({title:String(x.title||''),author:String(w||''),url:/^\/works\/OL\d+W$/.test(x.key||'')?'https://openlibrary.org'+x.key:''})))
    .filter(x=>fold(x.title)===fold(name)&&(!author||fold(x.author).includes(author)));
  }catch{feedback.textContent=litSimpleLabel('Catalog indisponibil; nu pot confirma atribuirea.','Catalogue unavailable; attribution unverified.');return}
  // A person-name query is different from a book-title query. Open
  // the exact author's own works, not titles merely containing that name.
  if(!rows.length&&!parts[1])try{
   const response=await fetch('https://openlibrary.org/search/authors.json?q='+encodeURIComponent(name)+'&limit=8',{credentials:'omit'});
   if(!response.ok)throw Error('author_search');
   const data=await response.json();
   if(n!==searchNumber||!results.isConnected)return;
   const matches=(data.docs||[]).filter(x=>fold(x.name)===fold(name));
   const author=matches.length===1?matches[0]:null;
   const key=String(author?.key||'').replace(/^\\/authors\\//,'');
   if(/^OL\\d+A$/.test(key)){
    const worksResponse=await fetch('https://openlibrary.org/authors/'+key+'/works.json?limit=50',{credentials:'omit'});
    if(!worksResponse.ok)throw Error('author_works');
    const works=await worksResponse.json();
    if(n!==searchNumber||!results.isConnected)return;
    rows=(works.entries||[]).filter(x=>String(x.title||'').trim())
     .map(x=>({title:String(x.title).trim(),author:String(author.name),url:
      /^\\/works\\/OL\\d+W$/.test(x.key||'')?'https://openlibrary.org'+x.key:
      'https://openlibrary.org/authors/'+key}));
   }
  }catch{feedback.textContent=litSimpleLabel('Catalogul autorilor nu este disponibil acum.','Author catalogue unavailable right now.')}
  const distinct=[...new Map(rows.map(x=>[fold(x.title)+'|'+fold(x.author),x])).values()];
  let page=0;
  const show=()=>{
   const batch=distinct.slice(page,page+7);
   for(const row of batch)results.append(litSimpleButton(row.title+' — '+row.author,()=>select(row.title,row.author,row.url)));
   page+=batch.length;
   if(page<distinct.length)results.append(litSimpleButton(
    litSimpleLabel('Alte opere','More works'),()=>{
     const last=results.lastElementChild;if(last?.textContent===litSimpleLabel('Alte opere','More works'))last.remove();
     show();
    }));
  };
  show();
  feedback.textContent=distinct.length?distinct.length+' '+litSimpleLabel('rezultate distincte','distinct matches'):
   litSimpleLabel('Nicio potrivire sigură. Încearcă titlul și autorul.','No confident match; try title and author.');
 };
 search.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();find()}});
 panel.append(search,litSimpleButton(litSimpleLabel('Caută autorul / opera','Search author / work'),find),feedback,results,title,acts,passage,out);
}

`;
