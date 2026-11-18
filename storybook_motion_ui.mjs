export const STORYBOOK_MOTION_SCRIPT=String.raw`
function extraStorybookMotionAttach(work,reader){
 const motion=extraToolsEl('section','eva-story-motion');
 const picture=extraToolsEl('div','eva-story-picture');
 const image=extraToolsEl('img','eva-story-image');
 image.alt=extraToolsLocale('Ilustrație a capitolului','Chapter illustration');
 image.hidden=true;
 const lights=extraToolsEl('div','eva-story-lights');lights.setAttribute('aria-hidden','true');
 const placeholder=extraToolsEl('div','eva-story-placeholder',
  extraToolsLocale('Fotografiile reale din surse reutilizabile apar aici, cu mișcare discretă.',
   'Reusable real photographs appear here, with subtle motion.'));
 const subtitles=extraToolsEl('div','eva-story-subtitles');
 picture.append(image,lights,placeholder,subtitles);
 motion.append(picture);
 const info=extraToolsEl('p','eva-story-image-status');
 info.setAttribute('role','status');
 info.textContent=extraToolsLocale(
  'Fotografiile provin din Wikimedia Commons. Autorul și licența sunt afișate pentru fiecare imagine. Mișcarea este de cameră, nu animație a personajelor.',
  'Photos come from Wikimedia Commons. Author and licence appear for each image. Motion is camera movement, not character animation.');
 motion.append(info);
 reader.prepend(motion);
 const credit=extraToolsEl('div','eva-story-credit');motion.append(credit);
 const photoSearch=extraToolsField(motion,extraToolsLocale('Subiect pentru fotografii (poți ajusta)','Photo search topic (editable)'),
  'text',extraToolsLocale('Ex.: Armata de teracotă','e.g. Terracotta Army'));
 photoSearch.maxLength=110;
 const tools=extraToolsEl('div','eva-story-media-tools');
 const generate=extraToolsBtn(extraToolsLocale('🔎 Caută fotografii reale','🔎 Find real photos'),()=>void makeIllustrations(),true);
 const animate=extraToolsBtn(extraToolsLocale('▶ Urmărește și ascultă','▶ Watch and listen'),()=>startNarration());
 const musicLabel=extraToolsEl('label','eva-story-audio-label',extraToolsLocale('🎵 Muzică de fundal (fișier propriu sau licențiat)','🎵 Background music (owned or licensed file)'));
 const file=extraToolsEl('input');file.type='file';file.accept='audio/*';
 musicLabel.append(file);
 const music=extraToolsEl('audio');music.loop=true;music.preload='none';music.volume=0.14;
 const stop=extraToolsBtn(extraToolsLocale('■ Oprește','■ Stop'),()=>stopNarration());
 tools.append(generate,animate,stop,musicLabel,music);
 motion.append(tools);
 let book=[],chapter=0,scenes=[],playing=false,audioObjectUrl=null;
 const speakLocale=()=>({ro:'ro-RO',en:'en-GB',fr:'fr-FR',de:'de-DE',it:'it-IT',es:'es-ES',pt:'pt-PT',nl:'nl-NL',pl:'pl-PL',hu:'hu-HU'})[state.language]||state.language||'ro-RO';
 function setCurrent(i){
  chapter=Math.max(0,Math.min(book.length-1,i));
  const nextImage=scenes[chapter];
  image.hidden=!nextImage;
  if(nextImage)image.src=nextImage.url;
  else image.removeAttribute('src');
  placeholder.hidden=Boolean(nextImage);
  picture.classList.remove('eva-story-slide-active');
  void picture.offsetWidth;
  picture.classList.add('eva-story-slide-active');
  picture.style.setProperty('--story-shift',chapter%2?' -3%':'3%');
  subtitles.textContent=book[chapter]?.text?.slice(0,220).replace(/\s+/g,' ')||'';
  credit.replaceChildren();
  if(nextImage){
   const author=extraToolsEl('span','',nextImage.author+' · '+nextImage.license+' · Wikimedia Commons');
   const source=extraToolsEl('a','',extraToolsLocale('Vezi fotografia și licența','View photo and licence'));
   source.href=nextImage.source;source.target='_blank';source.rel='noopener';
   credit.append(author,source);
  }
  generate.textContent=scenes.every(Boolean)?
   extraToolsLocale('✅ Fotografii pregătite','✅ Photos ready'):
   extraToolsLocale('🔎 Caută fotografii reale','🔎 Find real photos');
 }
 function setBook(newBook){
  stopNarration();
  book=newBook||[];chapter=0;scenes=Array(book.length).fill(null);
  photoSearch.value=String(work.title?.value||'').slice(0,110);
  setCurrent(0);
 }
 function stopNarration(){
  playing=false;
  music.pause();music.currentTime=0;
  work.storybookOnVoiceEvent=null;
  try{if(typeof stopSpeech==='function')stopSpeech()}catch{}
  try{window.speechSynthesis?.cancel()}catch{}
  animate.disabled=false;
 }
 function playChapter(){
  if(!playing||!book.length)return;
  setCurrent(chapter);
  const text=String(book[chapter].text||'').trim();
  if(!text){advance();return}
  if(typeof pocketNativeVoiceAvailable==='function'&&pocketNativeVoiceAvailable()){
   const success=pocketNativeVoiceSend({action:'speak',text,language:speakLocale(),rate:0.95});
   if(success){
    work.storybookOnVoiceEvent=(data)=>{
     if(!playing||data?.mode!=='tts')return;
     if(data.status==='done')advance();
     else if(data.status==='error')stopNarration();
    };
    return;
   }
  }
  if(typeof window.SpeechSynthesisUtterance==='function'&&window.speechSynthesis){
   const u=new SpeechSynthesisUtterance(text);u.lang=speakLocale();u.rate=0.94;
   u.onend=()=>{if(playing)advance()};
   u.onerror=()=>stopNarration();
   window.speechSynthesis.speak(u);
  }else{
   info.textContent=extraToolsLocale('Citirea vocală nu este disponibilă pe acest dispozitiv.','Voice playback is unavailable on this device.');
   stopNarration();
  }
 }
 function advance(){
  if(!playing)return;
  if(chapter>=book.length-1){stopNarration();return}
  chapter++;
  work.storybookShowChapter?.(chapter);
  playChapter();
 }
 function startNarration(){
  if(!book.length)return;
  stopNarration();
  playing=true;animate.disabled=true;
  if(music.src){const p=music.play();if(p?.catch)p.catch(()=>{});}
  playChapter();
 }
 async function makeIllustrations(){
  if(!book.length||work.controller)return;
  const topic=photoSearch.value.trim()||String(work.title?.value||'').trim();
  if(topic.length<3){
   info.textContent=extraToolsLocale('Scrie subiectul fotografiilor.','Enter a photo search topic.');return;
  }
  const api=new URL(CLIENT_CONFIG.apiUrl,location.href);
  if(!/\/api\/chat$/.test(api.pathname)){
   info.textContent=extraToolsLocale('Serviciul de fotografii nu este configurat.','Photo service is not configured.');return;
  }
  api.pathname=api.pathname.replace(/\/api\/chat$/,'/api/storybook-photos');
  const controller=new AbortController();
  work.controller=controller;generate.disabled=true;
  info.textContent=extraToolsLocale('Eva caută fotografii reutilizabile, cu autor și licență…',
   'Eva is searching reusable photos with author and licence…');
  const timer=setTimeout(()=>controller.abort(),18000);
  try{
   const response=await fetch(api.toString(),{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({query:topic,limit:book.length}),
    signal:controller.signal
   });
   const data=await response.json().catch(()=>null);
   if(work!==extraToolsSession||!reader.isConnected)return;
   if(!response.ok||data?.status!=='success'||!Array.isArray(data.photos)||!data.photos.length){
    scenes=Array(book.length).fill(null);setCurrent(chapter);
    info.textContent=extraToolsLocale('Nu am găsit fotografii potrivite cu licență verificabilă. Încearcă o expresie mai scurtă sau în engleză.',
     'No suitably licensed photos found. Try a shorter search phrase or an English topic.');
    return;
   }
   const safe=data.photos.filter(p=>typeof p.url==='string'&&
    /^https:\/\/upload\.wikimedia\.org\//.test(p.url)&&
    /^https:\/\/commons\.wikimedia\.org\//.test(p.source)&&
    typeof p.author==='string'&&typeof p.license==='string');
   scenes=book.map((_,i)=>safe[i]||null);
   setCurrent(chapter);
   info.textContent=extraToolsLocale(
    'Am găsit '+safe.length+' fotografii cu surse și licențe. Apasă „Urmărește și ascultă”.',
    'Found '+safe.length+' photos with sources and licences. Tap Watch and listen.');
  }catch(error){
   if(work===extraToolsSession)info.textContent=controller.signal.aborted?
    extraToolsLocale('Căutarea fotografiilor a expirat.','Photo search timed out.'):
    extraToolsLocale('Nu am putut consulta biblioteca de fotografii.','Photo library could not be reached.');
  }finally{
   clearTimeout(timer);
   if(work===extraToolsSession){work.controller=null;generate.disabled=false;}
  }
 }
 file.addEventListener('change',()=>{
  const chosen=file.files?.[0];
  if(audioObjectUrl){URL.revokeObjectURL(audioObjectUrl);audioObjectUrl=null;}
  music.pause();music.removeAttribute('src');
  if(!chosen)return;
  if(!chosen.type.startsWith('audio/')||chosen.size>16000000){
   info.textContent=extraToolsLocale('Alege un fișier audio de maximum 16 MB.','Choose an audio file up to 16 MB.');
   file.value='';return;
  }
  audioObjectUrl=URL.createObjectURL(chosen);music.src=audioObjectUrl;
  info.textContent=extraToolsLocale('Melodia este încărcată și va cânta discret în timpul narațiunii.',
   'Music added; it will play quietly under the narration.');
 });
 work.storybookCleanup=()=>{
  stopNarration();
  if(audioObjectUrl)URL.revokeObjectURL(audioObjectUrl);
  music.removeAttribute('src');
  scenes=[];
 };
 return {setBook,setCurrent,stopNarration,makeIllustrations};
}
`;
export const STORYBOOK_MOTION_STYLE=String.raw`
#view-module.extra-tools-workspace .eva-story-motion{display:flex;flex-direction:column;gap:8px;margin:0 0 12px;width:100%}
#view-module.extra-tools-workspace .eva-story-picture{position:relative;aspect-ratio:16/9;width:100%;overflow:hidden;background:radial-gradient(circle at 70% 30%,#526d82,#102a41 76%);border:1px solid #947180;border-radius:14px}
#view-module.extra-tools-workspace .eva-story-image{position:absolute;width:110%;height:110%;left:-5%;top:-5%;object-fit:cover;animation:evaStoryPan 16s ease-in-out infinite alternate;transform-origin:center;will-change:transform}
#view-module.extra-tools-workspace .eva-story-picture.eva-story-slide-active{animation:evaStorySceneEnter 0.8s ease}
#view-module.extra-tools-workspace .eva-story-lights{position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 12% 62%,#f7d5a122 0 6px,transparent 8px),radial-gradient(circle at 72% 20%,#fff4bd33 0 3px,transparent 5px);background-size:240px 170px;animation:evaStoryLightDrift 14s linear infinite;mix-blend-mode:screen}
#view-module.extra-tools-workspace .eva-story-placeholder{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:18px;color:#deedf4;font-size:14px}
#view-module.extra-tools-workspace .eva-story-subtitles{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,#071523e8);color:#fff;text-align:center;padding:20px 12px 8px;font-size:clamp(11px,2.8vw,14px);line-height:1.4;max-height:72px;overflow:hidden;pointer-events:none}
.eva-story-credit{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:6px;font-size:11px;line-height:1.35;color:#c4dbe8;padding:3px 6px}
.eva-story-credit a{color:#e7abc4;text-decoration:underline}
#view-module.extra-tools-workspace .eva-story-media-tools{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
#view-module.extra-tools-workspace .eva-story-media-tools>button{flex:1 1 140px;min-width:0}
#view-module.extra-tools-workspace .eva-story-audio-label{display:flex;flex-direction:column;gap:7px;flex:1 1 100%;font-size:13px;color:#d9e5ef}
#view-module.extra-tools-workspace .eva-story-audio-label input{max-width:100%;font-size:13px;color:#d9e5ef}
#view-module.extra-tools-workspace .eva-story-image-status{font-size:12px;line-height:1.4;color:#d0dde9;text-align:center}
#view-module.extra-tools-workspace .eva-story-image[hidden],#view-module.extra-tools-workspace .eva-story-placeholder[hidden]{display:none!important}
@keyframes evaStoryPan{from{transform:scale(1.02) translate(-2%,1%)}to{transform:scale(1.15) translate(2%,-2%)}}
@keyframes evaStoryLightDrift{from{background-position:0 0,0 0}to{background-position:300px -120px,-200px 120px}}
@keyframes evaStorySceneEnter{from{opacity:.45;transform:translateY(9px)}to{opacity:1;transform:translateY(0)}}
@media(prefers-reduced-motion:reduce){#view-module.extra-tools-workspace .eva-story-image,#view-module.extra-tools-workspace .eva-story-lights,#view-module.extra-tools-workspace .eva-story-picture.eva-story-slide-active{animation:none!important}}
`;
