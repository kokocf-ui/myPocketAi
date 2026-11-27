import {FOREIGN_LANGUAGE_PRACTICE_SCRIPT,FOREIGN_LANGUAGE_PRACTICE_STYLE} from './foreign_language_practice_ui.mjs';
// Editorial packs are fetched only when the learner opens this reference dialog.
export const FOREIGN_LANGUAGE_RESOURCES_STYLE=FOREIGN_LANGUAGE_PRACTICE_STYLE+String.raw`
dialog.foreign-resource-dialog[open]{box-sizing:border-box;position:fixed;inset:0;margin:auto;width:min(760px,96vw);max-width:calc(100vw - 16px);height:calc(100dvh - 24px);max-height:calc(100dvh - 24px);display:flex;flex-direction:column;gap:10px;overflow:hidden;border:1px solid #58a9bd;border-radius:18px;padding:14px;background:linear-gradient(150deg,#12374a,#081c2d);color:#e6f7fc}
.foreign-resource-dialog::backdrop{background:#000a}
.foreign-resource-head{display:flex;align-items:center;justify-content:space-between;gap:10px;flex:0 0 auto}
.foreign-resource-head h2{margin:0;font-size:clamp(16px,4.5vw,22px);line-height:1.2;overflow-wrap:anywhere}
.foreign-resource-toolbar{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.foreign-resource-toolbar,.foreign-resource-actions{display:flex;gap:8px;flex-wrap:wrap;margin:0;flex:0 0 auto}
.foreign-resource-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;flex:0 0 auto}
.foreign-resource-dialog button{box-sizing:border-box;min-height:44px!important;height:auto!important;min-width:0;max-width:100%;margin:0!important;padding:9px 10px!important;font-size:14px!important;line-height:1.25!important;white-space:normal;overflow-wrap:anywhere;touch-action:manipulation;flex-shrink:0}
.foreign-resource-tabs button[aria-pressed=true]{outline:2px solid #66d9ed;outline-offset:1px;background:linear-gradient(150deg,#236e8d,#104765)!important}
.foreign-resource-content{flex:1 1 auto;min-height:0;min-width:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;touch-action:pan-y;scroll-padding:8px;padding:3px 3px 16px;outline:none}
.foreign-resource-content>h3{margin:4px 0 10px;font-size:18px}
.foreign-resource-dialog>.foreign-resource-status{margin:0;font-size:13px;flex:0 0 auto}
.foreign-resource-dialog>.foreign-resource-status:empty{display:none}
.foreign-resource-content input,.foreign-resource-content select{box-sizing:border-box;width:100%;padding:12px;font-size:16px;color:inherit;background:#ffffff12;border:1px solid #5799aa;border-radius:8px}
.foreign-resource-entry{border:1px solid #ffffff30;border-radius:12px;padding:12px;margin:10px 0;overflow-wrap:anywhere}.foreign-resource-entry strong{font-size:1.15em}.foreign-resource-entry p{margin:8px 0}.foreign-resource-entry table{width:100%;border-collapse:collapse}.foreign-resource-entry th,.foreign-resource-entry td{text-align:start;border-bottom:1px solid #ffffff30;padding:8px;overflow-wrap:anywhere}.foreign-resource-entry audio{width:100%;margin:10px 0}.foreign-resource-note{opacity:.85;font-size:.9em}.foreign-resource-content [hidden]{display:none!important}
@media(max-height:520px){dialog.foreign-resource-dialog[open]{gap:6px;padding:9px}.foreign-resource-dialog button{min-height:40px!important;padding:6px!important}.foreign-resource-head h2{font-size:16px}}
`;
export const FOREIGN_LANGUAGE_RESOURCES_SCRIPT=FOREIGN_LANGUAGE_PRACTICE_SCRIPT+String.raw`
let languageResourceActive=null;
async function languageResourcesOpen(initialTab='dictionary'){
 if(languageResourceActive)languageResourceActive.close();
 languageVoiceStop();
 const language=languageJourney.language,variant=languageJourney.variant||'standard';
 const dialog=document.createElement('dialog');dialog.className='foreign-resource-dialog';
 dialog.setAttribute('aria-label',learningLabel('Resurse de limbi străine','Language resources'));
 const heading=document.createElement('h2');heading.textContent=learningLabel('Dicționar · gramatică · conversație · audio','Dictionary · grammar · conversation · audio');
 const toolbar=document.createElement('div');toolbar.className='foreign-resource-toolbar';
 const close=foreignStudyButton(learningLabel('Închide','Close'),()=>dialog.close());toolbar.append(close);
 const status=document.createElement('p');status.className='foreign-resource-status';status.setAttribute('role','status');status.textContent=learningLabel('Se încarcă resursa…','Loading resource…');
 const tabs=document.createElement('div');tabs.className='foreign-resource-tabs';tabs.setAttribute('aria-label',learningLabel('Secțiuni','Sections'));
 const content=document.createElement('div');content.className='foreign-resource-content';
 const header=document.createElement('header');header.className='foreign-resource-head';header.append(heading,close);
 content.tabIndex=-1;content.setAttribute('aria-live','polite');
 dialog.append(header,toolbar,status,tabs,content);document.body.append(dialog);
 let alive=true,pack=null,tab=initialTab,translation={},translating=false,grammarIndex=0,guideIndex=0;
 let recorder=null,stream=null,recordingToken=0,recordTimer=null,audioURL=null,audioEl=null;
 function stopCapture(discard=false){
  if(discard)recordingToken++;
  clearTimeout(recordTimer);recordTimer=null;
  if(recorder&&recorder.state!=='inactive')try{recorder.stop()}catch{}
  stream?.getTracks().forEach(t=>t.stop());stream=null;
 }
 function cleanupAudio(){
  stopCapture(true);recorder=null;
  if(audioEl){audioEl.pause();audioEl.removeAttribute('src');audioEl.load();audioEl=null}
  if(audioURL){URL.revokeObjectURL(audioURL);audioURL=null}
  try{if(pocketNativeVoiceAvailable())pocketNativeVoiceSend({action:'stop'});window.speechSynthesis?.cancel()}catch{}
 }
 function cleanup(){if(!alive)return;alive=false;cleanupAudio();window.removeEventListener('pagehide',onPageHide);if(languageResourceActive===dialog)languageResourceActive=null;dialog.remove()}
 function onPageHide(){dialog.close();cleanup()}
 dialog.addEventListener('close',cleanup);window.addEventListener('pagehide',onPageHide);
 languageResourceActive=dialog;try{dialog.showModal()}catch{dialog.setAttribute('open','')}
 const txt=(key,source)=>translation[key]||source;
 const el=(tag,text,parent,lang)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(lang)node.lang=lang;parent?.append(node);return node};
 function speech(text,slow=false){
  audioEl?.pause();
  const old=languageJourney.slow;languageJourney.slow=slow;
  try{languageSpeak(text)}finally{languageJourney.slow=old}
  if(languageIsClassical())status.textContent=txt('pronunciationNote',pack.pronunciationNote);
  else if(pocketNativeVoiceAvailable())status.textContent=learningLabel('TTS Android: disponibilitatea vocii depinde de motorul instalat.','Android TTS: voice availability depends on the installed engine.');
  else{
   const voices=window.speechSynthesis?.getVoices?.()||[];
   const exact=voices.some(v=>v.lang.toLowerCase()===pack.locale.toLowerCase());
   status.textContent=exact?learningLabel('Redare TTS, nu înregistrare umană.','TTS playback, not a human recording.'):learningLabel('Voce regională exactă negăsită; motorul poate folosi altă voce. Instalează un pachet vocal potrivit.','Exact regional voice not found; the engine may use another voice. Install a matching voice pack.');
  }
 }
 function playButtons(parent,text){const row=el('div',undefined,parent);row.className='foreign-resource-actions';row.append(foreignStudyButton(learningLabel('🔊 Ascultă','🔊 Listen'),()=>speech(text)),foreignStudyButton(learningLabel('🐢 Lent','🐢 Slow'),()=>speech(text,true)));}
 function entryCard(row,parent){
  const card=el('article',undefined,parent);card.className='foreign-resource-entry';
  el('strong',row.term,card,pack.locale);
  if(row.phonetic!=='—')el('p',({ipa:'IPA',pinyin:'Pinyin',romaji:'Rōmaji',transliteration:learningLabel('Transliterare','Transliteration')})[row.notation]+': '+row.phonetic,card);
  const translated=translation['gloss-'+row.id];el('p',translated||row.gloss,card,translated?(state.language||'ro'):row.glossLanguage);
  playButtons(card,row.term);return card;
 }
 async function translate(){
  if(translating||!pack||!alive)return;translating=true;translateButton.disabled=true;
  const explanationLanguage=state.language||'ro';
  const groups={ro:{scopeNote:pack.scopeNote,pronunciationNote:pack.pronunciationNote},en:{}};
  pack.dictionary.forEach(x=>{groups[x.glossLanguage]['gloss-'+x.id]=x.gloss});
  pack.lessons.forEach(x=>{groups.ro['explain-'+x.id]=x.explanation;groups.ro['feedback-'+x.id]=x.task.feedback});
  pack.guide.forEach(x=>{groups.ro['guide-'+x.id]=x.title;if(x.note)groups.ro['note-'+x.id]=x.note});
  let failed=false;const next={};
  try{
   for(const source of ['ro','en']){
    const original=groups[source];if(!Object.keys(original).length)continue;
    const result=source===explanationLanguage?original:await eduTranslateMaterial(original,'foreign-resources-'+pack.key+'-'+pack.version+'-'+source,source,{targetLanguage:explanationLanguage,priority:true});
    if(!alive)return;
    if(result&&Object.keys(original).every(k=>typeof result[k]==='string'&&result[k].trim()))Object.keys(original).forEach(k=>next[k]=result[k]);else failed=true;
   }
   translation=next;render();
   status.textContent=failed?learningLabel('Traducere indisponibilă pentru unele explicații; originalul este păstrat. Poți reîncerca.','Some explanations could not be translated; the original is preserved. You can retry.'):learningLabel('Explicații în limba aplicației; exemplele rămân în limba studiată.','Explanations use the app language; examples keep their target language.');
  }catch{if(alive)status.textContent=learningLabel('Traducere indisponibilă; originalul este păstrat.','Translation unavailable; the original is preserved.')}
  finally{translating=false;if(alive)translateButton.disabled=false}
 }
 const translateButton=foreignStudyButton(learningLabel('Tradu / reîncearcă explicațiile','Translate / retry explanations'),translate);toolbar.append(translateButton);
 const generateButton=foreignStudyButton(learningLabel('✨ Atelier adaptiv · AI','✨ Adaptive practice · AI'),()=>{cleanupAudio();foreignPracticeOpen(({dictionary:'vocabulary',grammar:'grammar',guide:'conversation',audio:'listening'})[tab]||'conversation')});toolbar.append(generateButton);
 function progression(index,total,onChange){
  const nav=el('nav',undefined,content);nav.className='foreign-resource-actions foreign-resource-progression';nav.setAttribute('aria-label',learningLabel('Parcurgere material','Material progression'));
  const previous=foreignStudyButton(learningLabel('← Anterior','← Previous'),()=>onChange(index-1));previous.disabled=index===0;
  const count=el('span',(index+1)+' / '+total);nav.style.cssText='display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);align-items:center;';count.setAttribute('role','status');
  const next=foreignStudyButton(learningLabel('Următor →','Next →'),()=>onChange(index+1));next.disabled=index===total-1;nav.append(previous,count,next);
  if(index===total-1)el('p',learningLabel('Ultima temă din acest pachet local. Nu este un curs complet; poți recapitula temele anterioare.','Last topic in this local pack. This is not a complete course; you can review previous topics.'),content);
 }
 function render(){
  cleanupAudio();content.replaceChildren();
  const names={dictionary:learningLabel('Dicționar','Dictionary'),grammar:learningLabel('Teme și conjugări','Topics and conjugations'),guide:learningLabel('Ghid de conversație','Conversation guide'),audio:learningLabel('Laborator audio','Audio lab')};
  el('h3',names[tab]||names.dictionary,content);
  const info=el('details',undefined,content);info.className='foreign-resource-info';el('summary',learningLabel('Despre resursă, transcriere și traducere','About this resource, transcription and translation'),info);
  tabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tab===tab)));
  el('p',learningLabel('Explicații originale: română. Sensurile lexicale sunt în română (engleză pentru cuvintele românești). Butonul de traducere folosește motorul comun al aplicației și păstrează exemplele originale.','Original explanations: Romanian. Glosses are Romanian (English for Romanian words). The translation button uses the shared app engine and preserves original target examples.'),info).className='foreign-resource-note';
  const scope=el('p',txt('scopeNote',pack.scopeNote),info,translation.scopeNote?(state.language||'ro'):'ro');scope.className='foreign-resource-note';
  el('p',txt('pronunciationNote',pack.pronunciationNote),info,translation.pronunciationNote?(state.language||'ro'):'ro').className='foreign-resource-note';
  if(tab==='dictionary'){
   const search=el('input',undefined,content);search.type='search';search.placeholder=learningLabel('Caută cuvânt, transcriere sau sens','Search term, transcription or meaning');search.setAttribute('aria-label',search.placeholder);
   const count=el('p','',content);count.setAttribute('role','status');const results=el('div',undefined,content);
   const norm=x=>String(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();
   const update=()=>{results.replaceChildren();const query=norm(search.value||'');const rows=pack.dictionary.filter(x=>norm([x.term,x.phonetic,x.gloss,txt('gloss-'+x.id,'')].join(' ')).includes(query));count.textContent=rows.length+' / '+pack.dictionary.length;if(!rows.length)el('p',learningLabel('Niciun rezultat în lexicul introductiv local.','No results in the local introductory lexicon.'),results);rows.forEach(x=>entryCard(x,results))};search.addEventListener('input',update);update();
  }else if(tab==='grammar'){
   el('p',learningLabel('Teme introductive: citește explicația, compară formele, completează și verifică. Nu toate limbile conjugă după persoană.','Starter topics: read the explanation, compare forms, complete and check. Not every language conjugates for person.'),info);
   progression(grammarIndex,pack.lessons.length,i=>{grammarIndex=i;render();content.scrollTop=0});
   pack.lessons.slice(grammarIndex,grammarIndex+1).forEach(lesson=>{
    const card=el('article',undefined,content);card.className='foreign-resource-entry';el('h3',lesson.title,card,pack.locale);const explanation=el('details',undefined,card);explanation.className='foreign-grammar-explanation';el('summary',learningLabel('Explicație și greșeli frecvente','Explanation and common mistakes'),explanation);el('p',txt('explain-'+lesson.id,lesson.explanation),explanation,translation['explain-'+lesson.id]?(state.language||'ro'):'ro');
    const table=el('table',undefined,card);const caption=el('caption',learningLabel('Forme de învățat','Forms to learn'),table);const body=el('tbody',undefined,table);
    lesson.forms.forEach(f=>{const tr=el('tr',undefined,body),th=el('th',f.person,tr,pack.locale);th.scope='row';el('td',f.form,tr,pack.locale);const td=el('td',undefined,tr);td.append(foreignStudyButton('🔊',()=>speech(f.form)));td.firstChild.setAttribute('aria-label',learningLabel('Ascultă: ','Listen: ')+f.form)});
    el('p',lesson.task.prompt,card,pack.locale);
    const input=el('input',undefined,card);input.type='text';input.autocomplete='off';input.setAttribute('aria-label',learningLabel('Completează forma lipsă','Complete the missing form'));input.lang=pack.locale;
    const feedback=el('p','',card);feedback.setAttribute('role','status');
    const norm=x=>String(x).normalize('NFC').trim().toLocaleLowerCase();
    card.append(foreignStudyButton(learningLabel('Verifică','Check'),()=>{const ok=lesson.task.answers.some(x=>norm(x)===norm(input.value));feedback.textContent=ok?learningLabel('Corect! Continuă cu Tema următoare sau recapitulează la final.','Correct! Continue with Next topic or review at the end.'):learningLabel('Mai încearcă. ','Try again. ')+txt('feedback-'+lesson.id,lesson.task.feedback)}));
    const solution=el('details',undefined,card);solution.className='foreign-grammar-answer';el('summary',learningLabel('Arată răspunsul','Show answer'),solution);el('p',lesson.task.answers.join(' / '),solution,pack.locale);
   });
  }else if(tab==='guide'){
   progression(guideIndex,pack.guide.length,i=>{guideIndex=i;render();content.scrollTop=0});
   pack.guide.slice(guideIndex,guideIndex+1).forEach(group=>{const section=el('section',undefined,content);el('h3',txt('guide-'+group.id,group.title),section);if(group.note)el('p',txt('note-'+group.id,group.note),section);group.entryIds.forEach(id=>entryCard(pack.dictionary.find(x=>x.id===id),section))});
  }else{
   el('p',learningLabel('Alege un model din lista cu denumiri, ascultă, repetă și scrie ce ai auzit. Deschide răspunsul pentru transcriere. Verificarea compară textul, nu pronunția.','Choose a named model, listen, repeat and write what you heard. Reveal the answer for its transcription. Checking compares text, not pronunciation.'),content);
   el('p',learningLabel('Alege un cuvânt, o expresie sau o formă gramaticală. Lista include tot materialul disponibil al pachetului; meniul oferă căutare și pagini. Săgețile trec direct la exemplul anterior sau următor. Normal: 0,80×; lent: 0,40× (viteza efectivă depinde de motorul TTS).','Choose a word, phrase or grammar form. The list covers this entire pack; its menu has search and pages. Arrows move to the previous or next example. Normal: 0.80×; slow: 0.40× (actual speed depends on the TTS engine).'),info);
   const examples=[...pack.dictionary,...pack.lessons.flatMap(l=>l.forms.map((f,i)=>({id:'form-'+l.id+'-'+i,term:f.form,phonetic:'—',gloss:l.title+' · '+f.person,glossLanguage:pack.language==='ro'?'en':'ro',notation:'transliteration'})))];
   const picker=el('select',undefined,content);picker.setAttribute('aria-label',learningLabel('Exemplul audio','Audio example'));examples.forEach((x,i)=>{const option=el('option',(i+1)+' / '+examples.length+' · '+x.term+' — '+x.gloss,picker);option.value=x.id});
   const playback=el('div',undefined,content);let selected=examples[0];
   const answer=el('input',undefined,content);answer.type='text';answer.setAttribute('aria-label',learningLabel('Scrie ce auzi','Write what you hear'));answer.lang=pack.locale;
   const feedback=el('p','',content);feedback.setAttribute('role','status');
   content.append(foreignStudyButton(learningLabel('Verifică textul','Check text'),()=>{const norm=x=>x.normalize('NFKC').toLocaleLowerCase().replace(/[.,!?;:。！？]/g,'').replace(/\s+/g,' ').trim();feedback.textContent=norm(answer.value)===norm(selected.term)?learningLabel('Text corect; nu este scor fonetic.','Correct text; this is not a pronunciation score.'):learningLabel('Compară cu răspunsul și încearcă din nou.','Compare with the answer and try again.')}));
   const reveal=el('details',undefined,content);el('summary',learningLabel('Arată textul și transcrierea','Reveal text and transcription'),reveal);const revealed=el('div',undefined,reveal);
   const choose=()=>{cleanupAudio();selected=examples.find(x=>x.id===picker.value)||examples[0];answer.value='';feedback.textContent='';reveal.open=false;playback.replaceChildren();revealed.replaceChildren();playButtons(playback,selected.term);entryCard(selected,revealed)};picker.addEventListener('change',choose);choose();
   const audioNav=el('nav',undefined,content);audioNav.className='foreign-resource-actions';const move=delta=>{picker.selectedIndex=Math.max(0,Math.min(examples.length-1,picker.selectedIndex+delta));picker.dispatchEvent(new Event('change',{bubbles:true}))};audioNav.append(foreignStudyButton(learningLabel('← Exemplul anterior','← Previous example'),()=>move(-1)),foreignStudyButton(learningLabel('Exemplul următor →','Next example →'),()=>move(1)));
   const own=el('section',undefined,content);own.className='foreign-resource-entry';el('h3',learningLabel('Înregistrează și ascultă propria voce','Record and replay your voice'),own);
   el('p',learningLabel('Opțional: microfonul necesită permisiune. Maximum 45 secunde. Înregistrarea rămâne în memoria acestei ferestre, nu se încarcă pe server și se șterge la schimbarea secțiunii sau închidere. Nu există evaluare acustică automată.','Optional: microphone permission required. Maximum 45 seconds. The recording stays in this dialog’s memory, is not uploaded and is discarded when switching sections or closing. There is no automated acoustic scoring.'),own);
   const recordingStatus=el('p','',own);recordingStatus.setAttribute('role','status');
   const audio=el('audio',undefined,own);audio.controls=true;audio.hidden=true;audio.setAttribute('aria-label',learningLabel('Înregistrarea mea','My recording'));audioEl=audio;
   const record=foreignStudyButton(learningLabel('🎙 Înregistrează local','🎙 Record locally'),async()=>{
    cleanupAudio();const token=++recordingToken;record.disabled=true;
    try{
     recordingStatus.textContent=learningLabel('Se cere acces la microfon…','Requesting microphone access…');
     const acquired=await navigator.mediaDevices.getUserMedia({audio:true});
     if(!alive||token!==recordingToken){acquired.getTracks().forEach(t=>t.stop());return}
     stream=acquired;audioEl=audio;const chunks=[];let bytes=0,tooLarge=false;
     const current=new MediaRecorder(acquired);recorder=current;
     current.ondataavailable=e=>{if(token!==recordingToken||!e.data.size)return;bytes+=e.data.size;if(bytes>4*1024*1024){tooLarge=true;stopCapture();return}chunks.push(e.data)};
     current.onerror=()=>{stopCapture(true);if(alive){record.disabled=false;recordingStatus.textContent=learningLabel('Înregistrarea a eșuat.','Recording failed.')}};
     current.onstop=()=>{
      acquired.getTracks().forEach(t=>t.stop());
      if(!alive||token!==recordingToken)return;
      clearTimeout(recordTimer);recordTimer=null;recorder=null;stream=null;record.disabled=false;
      if(tooLarge||!chunks.length){recordingStatus.textContent=learningLabel('Înregistrare goală sau prea mare. Reîncearcă mai scurt.','Recording empty or too large. Try a shorter recording.');return}
      audioURL=URL.createObjectURL(new Blob(chunks,{type:current.mimeType||chunks[0].type}));audio.src=audioURL;audio.hidden=false;
      recordingStatus.textContent=learningLabel('Înregistrare locală gata. Ascultă și compară cu modelul.','Local recording ready. Listen and compare with the model.');
     };
     current.start(1000);recordTimer=setTimeout(()=>stopCapture(),45000);recordingStatus.textContent=learningLabel('Se înregistrează… maximum 45 secunde.','Recording… maximum 45 seconds.');
    }catch{stopCapture(true);if(alive){record.disabled=false;recordingStatus.textContent=learningLabel('Microfon indisponibil sau permisiune refuzată. Ascultarea TTS rămâne disponibilă.','Microphone unavailable or permission denied. TTS listening remains available.')}}
   });
   if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){record.disabled=true;recordingStatus.textContent=learningLabel('Înregistrarea nu este suportată aici; folosește ascultarea TTS.','Recording is not supported here; use TTS listening.')}
   picker.addEventListener('change',()=>{record.disabled=!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder;audio.hidden=true;recordingStatus.textContent=''});
   own.append(record,foreignStudyButton(learningLabel('■ Oprește înregistrarea','■ Stop recording'),()=>stopCapture()),foreignStudyButton(learningLabel('Șterge înregistrarea','Delete recording'),()=>{cleanupAudio();audio.hidden=true;record.disabled=false;recordingStatus.textContent=''}));
  }
 }
 const tabNames=[['dictionary','📚 Dicționar','📚 Dictionary'],['grammar','📐 Teme și conjugări','📐 Topics and conjugations'],['guide','💬 Ghid de conversație','💬 Conversation guide'],['audio','🎧 Laborator audio','🎧 Audio lab']];
 tabNames.forEach(([id,ro,en])=>{const b=foreignStudyButton(learningLabel(ro,en),()=>{if(!pack)return;tab=id;render();content.scrollTop=0});b.dataset.tab=id;b.disabled=true;tabs.append(b)});
 try{
  const loaded=await foreignLoadResource(language,variant);if(!alive)return;
  pack=loaded.data;tabs.querySelectorAll('button').forEach(b=>b.disabled=false);status.textContent=loaded.offline?learningLabel('Resursă din cache. Vocile TTS depind de dispozitiv.','Cached resource. TTS voices depend on the device.'):'';
  render();
 }catch{
  if(!alive)return;
  status.textContent=learningLabel('Resursa nu este disponibilă și nu există o copie validă în cache. Este necesară prima descărcare online.','Resource unavailable and no valid cached copy exists. An initial online download is required.');
  content.append(foreignStudyButton(learningLabel('Reîncearcă','Retry'),()=>{dialog.close();languageResourcesOpen(initialTab)}));translateButton.disabled=true;
 }
}
`;
