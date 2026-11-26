import {FOREIGN_PRACTICE_PROTOCOL_SCRIPT} from './foreign_language_practice.mjs';
export const FOREIGN_LANGUAGE_PRACTICE_STYLE=String.raw`
dialog.foreign-practice-dialog[open]{position:fixed;inset:0;margin:auto;box-sizing:border-box;width:min(96vw,760px);max-width:calc(100vw - 16px);height:calc(100dvh - 24px);max-height:calc(100dvh - 24px);display:flex;flex-direction:column;gap:10px;overflow:hidden;padding:12px;border:1px solid #58a9bd;border-radius:18px;background:#0e2d40;color:#e6f7fc}
.foreign-practice-dialog header,.foreign-practice-nav{display:flex;align-items:center;justify-content:space-between;gap:8px;flex:0 0 auto}
.foreign-practice-dialog h2{font-size:20px;margin:0}.foreign-practice-body{flex:1 1 auto;min-height:0;overflow:auto;overscroll-behavior:contain;touch-action:pan-y;padding:3px}
.foreign-practice-dialog label{display:block;margin:10px 0}.foreign-practice-dialog select,.foreign-practice-dialog input{box-sizing:border-box;display:block;position:static!important;transform:none!important;width:100%;height:48px;min-height:48px;margin:6px 0;padding:10px;font-size:16px;background:#163c50;color:#effaff;border:1px solid #5799aa;border-radius:9px}
.foreign-practice-dialog button{min-height:44px!important;min-width:0!important;height:auto!important;margin:0!important;padding:10px!important;font-size:14px!important;white-space:normal!important}.foreign-practice-dialog p{overflow-wrap:anywhere;line-height:1.5}.foreign-practice-target{font-size:25px;display:block;overflow-wrap:anywhere}.foreign-practice-dialog [hidden]{display:none!important}
`;
export const FOREIGN_LANGUAGE_PRACTICE_SCRIPT=FOREIGN_PRACTICE_PROTOCOL_SCRIPT+String.raw`
function foreignPracticeOpen(initialFocus='conversation'){
 languageVoiceStop();
 document.querySelectorAll('.foreign-practice-dialog').forEach(d=>{d.foreignPracticeStop?.();d.close();d.remove()});
 const language=languageJourney.language,variant=languageJourney.variant||'standard',classical=languageIsClassical();
 const label=(ro,en)=>learningLabel(ro,en),node=(tag,text,parent)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;parent?.append(n);return n};
 const dialog=node('dialog');dialog.className='foreign-practice-dialog';dialog.setAttribute('aria-label',label('Atelier de limbi · AI','Language practice · AI'));
 const head=node('header',undefined,dialog);node('h2',label('Atelier de limbi · AI','Language practice · AI'),head);
 const close=foreignStudyButton(label('← Înapoi','← Back'),()=>dialog.close());head.append(close);
 const body=node('div',undefined,dialog);body.className='foreign-practice-body';
 const status=node('p','',dialog);status.setAttribute('role','status');
 const nav=node('nav',undefined,dialog);nav.className='foreign-practice-nav';
 let alive=true,controller=null,serial=0,index=0,batch=null,previous=[],sessionConfig=null;
 const cacheKey='pocket.language.practice.v1.'+language+'|'+variant;
 const stop=()=>{serial++;controller?.abort();controller=null;languageVoiceStop()};dialog.foreignPracticeStop=stop;
 dialog.addEventListener('close',()=>{alive=false;stop();dialog.remove()},{once:true});
 const onHide=()=>dialog.close();window.addEventListener('pagehide',onHide,{once:true});dialog.addEventListener('close',()=>window.removeEventListener('pagehide',onHide),{once:true});
 const settings=node('form',undefined,body);settings.addEventListener('submit',e=>e.preventDefault());
 node('p',label('Alegi situația și obiectivul; asistentul creează șase exemple și exerciții noi. Necesită internet și serviciul AI. Materialul este orientativ; transcrierile și răspunsurile AI pot avea erori. Ultimul set valid rămâne disponibil local, dacă stocarea permite.','Choose a situation and goal; the assistant creates six new examples and exercises. Requires internet and AI service. Material is advisory; AI transcriptions and answers can contain errors. The last valid set remains locally available when storage permits.'),settings);
 const select=(title,options,value)=>{const wrap=node('label',title,settings),s=node('select',undefined,wrap);s.setAttribute('aria-label',title);for(const [id,text]of options){const o=node('option',text,s);o.value=id}s.value=value;return s};
 const levels=classical?[['foundation',label('Fundamente','Foundations')],['grammar',label('Gramatică și texte','Grammar and texts')],['advanced',label('Filologie · avansat','Advanced philology')]]:['A1','A2','B1','B2','C1','C2'].map(x=>[x,x]);
 const level=select(label('Nivel','Level'),levels,levels.some(x=>x[0]===languageJourney.level)?languageJourney.level:levels[0][0]);
 const modern=[['airport',label('La aeroport','At the airport')],['kitchen',label('În bucătărie','In the kitchen')],['restaurant',label('La restaurant','At the restaurant')],['shopping',label('La cumpărături','Shopping')],['greetings',label('Saluturi și prezentare','Greetings and introductions')],['travel',label('Călătorii și cazare','Travel and accommodation')],['school',label('La școală și serviciu','At school and work')],['custom',label('Altă situație','Other situation')]];
 const historical=[['home',label('Casa și viața cotidiană antică','Ancient home and daily life')],['study',label('Lectură și gramatică','Reading and grammar')],['history',label('Istorie și cultură','History and culture')],['custom',label('Alt subiect de lectură','Other reading topic')]];
 const topic=select(label('Situație / subiect','Situation / topic'),classical?historical:modern,classical?'study':'greetings');
 const customLabel=node('label',label('Precizează ce vrei să exersezi','Describe what to practise'),settings),custom=node('input',undefined,customLabel);custom.maxLength=180;customLabel.hidden=true;custom.setAttribute('aria-label',label('Subiect propriu','Custom topic'));topic.onchange=()=>customLabel.hidden=topic.value!=='custom';
 const focus=select(label('Obiectiv','Practice goal'),[['conversation',classical?label('Propoziții de lectură','Reading sentences'):label('Conversație','Conversation')],['grammar',label('Gramatică și forme verbale','Grammar and verb forms')],['vocabulary',label('Vocabular în context','Vocabulary in context')],['listening',label('Ascultare și repetare','Listening and repetition')]],initialFocus);
 const start=foreignStudyButton(label('Creează 6 exemple · AI','Create 6 examples · AI'),()=>generate(false));settings.append(start);
 const resume=foreignStudyButton(label('Deschide ultimul set salvat','Open last saved set'),()=>{try{stop();start.disabled=false;cancel.hidden=true;const saved=JSON.parse(localStorage.getItem(cacheKey)||'null');batch=foreignPracticeParse(JSON.stringify(saved),saved);sessionConfig=foreignPracticeConfig(saved);previous=batch.items.map(x=>x.target);index=0;render();status.textContent=label('Set AI salvat local; nu este generat acum și nu este verificat de un profesor.','Locally saved AI set; not newly generated or teacher-verified.')}catch{status.textContent=label('Nu există un set local valid pentru această variantă.','No valid saved set for this variant.')}});settings.append(resume);
 const reading=node('article',undefined,body);reading.hidden=true;
 const cancel=foreignStudyButton(label('Anulează generarea','Cancel generation'),()=>{stop();start.disabled=false;cancel.hidden=true;status.textContent=label('Generare anulată; setul anterior este păstrat.','Generation cancelled; the previous set is retained.');if(batch)render()});cancel.hidden=true;dialog.insertBefore(cancel,nav);
 function config(){return foreignPracticeConfig({language,variant,level:level.value,focus:focus.value,topic:topic.value==='custom'?custom.value:topic.selectedOptions[0].textContent,interfaceLanguage:state.language||'ro'})}
 async function generate(more){
  if(controller)return;let selected;
  try{selected=more?sessionConfig:config()}catch{status.textContent=label('Completează subiectul (maximum 180 caractere).','Enter a topic (maximum 180 characters).');return}
  const request=++serial,abort=new AbortController();controller=abort;start.disabled=true;cancel.hidden=false;nav.querySelectorAll('button').forEach(b=>b.disabled=true);
  const timeout=setTimeout(()=>abort.abort(),60000);status.textContent=label('Asistentul pregătește exemplele…','The assistant is preparing examples…');
  try{
   const response=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},signal:abort.signal,body:JSON.stringify({module:'education_study',education_subject:'foreign_language',education_activity:'practice',language:selected.interfaceLanguage,history:[],message:foreignPracticePrompt(selected,more?previous:[])})});
   const data=await response.json();if(!response.ok||data.status!=='success')throw Error('unavailable');
   const parsed=foreignPracticeParse(data.reply,selected,more?previous:[]);
   if(!alive||!dialog.open||!dialog.isConnected||request!==serial)return;
   batch=parsed;sessionConfig=selected;previous=more?[...previous,...parsed.items.map(x=>x.target)].slice(-36):parsed.items.map(x=>x.target);index=0;
   try{localStorage.setItem(cacheKey,JSON.stringify(parsed))}catch{}
   render();status.textContent=label('Generat de AI · verifică explicațiile și transcrierile; nu este certificare de nivel.','AI-generated · check explanations and transcriptions; not level certification.');
  }catch(error){if(alive&&request===serial)status.textContent=error.name==='AbortError'?label('Generarea a fost întreruptă sau a expirat. Poți reîncerca; setul anterior este păstrat.','Generation interrupted or timed out. Retry; the previous set is retained.'):label('Setul nu a putut fi generat sau nu are un format valid. Poți reîncerca ori deschide setul salvat; nu afișez un răspuns incomplet ca lecție validă.','The set could not be generated or has an invalid format. Retry or open the saved set; incomplete output is not shown as a valid lesson.');}
  finally{clearTimeout(timeout);if(alive&&request===serial){controller=null;start.disabled=false;cancel.hidden=true;nav.querySelectorAll('button').forEach(b=>b.disabled=false);if(batch)renderNav()}}
 }
 function renderNav(){
  nav.replaceChildren();if(!batch)return;
  const prev=foreignStudyButton(label('← Anterior','← Previous'),()=>{languageVoiceStop();index--;render()});prev.disabled=index===0;
  const next=foreignStudyButton(index===5?label('Încă 6 exemple · AI','6 more examples · AI'):label('Următor →','Next →'),()=>{languageVoiceStop();if(index===5)generate(true);else{index++;render()}});
  nav.append(prev,node('span',(index+1)+' / 6'),next);
 }
 function render(){
  if(!batch)return;settings.hidden=true;reading.hidden=false;reading.replaceChildren();const item=batch.items[index];
  node('p',batch.language+' · '+batch.variant+' · '+batch.level+' · '+batch.topic,reading);
  node('strong',item.target,reading).className='foreign-practice-target';
  if(item.phonetic)node('p',item.phonetic,reading);node('p',item.meaning,reading);
  const play=slow=>{const old={language:languageJourney.language,variant:languageJourney.variant,slow:languageJourney.slow};Object.assign(languageJourney,{language:batch.language,variant:batch.variant,slow});try{languageSpeak(item.target)}finally{Object.assign(languageJourney,old)}};
  reading.append(foreignStudyButton(label('🔊 Ascultă','🔊 Listen'),()=>play(false)),foreignStudyButton(label('🐢 Lent','🐢 Slow'),()=>play(true)));
  node('p',item.explanation,reading);node('p',item.question,reading);
  const answer=node('input',undefined,reading);answer.setAttribute('aria-label',label('Răspuns la exercițiu','Exercise answer'));answer.lang=batch.language;answer.autocomplete='off';
  const feedback=node('p','',reading);feedback.setAttribute('role','status');const norm=x=>String(x).normalize('NFKC').trim().toLocaleLowerCase().replace(/[.!?。！？]+$/,'');
  reading.append(foreignStudyButton(label('Verifică textul','Check text'),()=>{feedback.textContent=item.answers.some(x=>norm(x)===norm(answer.value))?label('Corect după reperul AI. Continuă cu Următor.','Correct against the AI reference. Continue with Next.'):label('Compară cu răspunsul-model și încearcă din nou.','Compare with the model answer and try again.')}));
  const reveal=node('details',undefined,reading);node('summary',label('Răspuns-model AI','AI model answer'),reveal);node('p',item.answers.join(' / '),reveal);
  reading.append(foreignStudyButton(label('Schimbă situația / obiectivul','Change situation / goal'),()=>{stop();batch=null;settings.hidden=false;reading.hidden=true;nav.replaceChildren();status.textContent=''}));
  renderNav();body.scrollTop=0;
 }
 document.body.append(dialog);try{dialog.showModal()}catch{dialog.setAttribute('open','')}
 return dialog;
}
`;
