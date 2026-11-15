export const CREATOR_IMAGE_AI_SCRIPT=String.raw`
const extraCreatorImagePreviewUrl='https://lifewise-ai-image-studio.kokocf.workers.dev/generate';

const evaImageQuotaUrl='https://lifewise-ai-image-studio.kokocf.workers.dev/quota';
function evaImageInstallationId(){
 // Preview identity is installation-local, not a verified user account.
 // The anonymous identifier remains across ordinary APK updates.
 const key='eva_image_installation_v1';
 try{
  const existing=localStorage.getItem(key);
  if(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(existing||''))return existing;
  if(typeof crypto?.randomUUID!=='function')return null;
  const next=crypto.randomUUID();
  localStorage.setItem(key,next);
  return next;
 }catch{return null}
}
function evaImageQuotaMount(work){
 const tabs=work.area.querySelector('.eva-photo-tabs');
 if(!tabs)return;
 const display=extraToolsEl('p','eva-image-quota-status',
  extraToolsLocale('Se verifică utilizările de imagini…','Checking remaining image uses…'));
 display.setAttribute('role','status');
 tabs.after(display);
 work.evaImageInstallId=evaImageInstallationId();
 work.evaImageQuotaRemaining=null;
 work.evaImageQuotaUpdate=async()=>{
  if(!work.evaImageInstallId){
   display.textContent=extraToolsLocale(
    'Contorul local nu este disponibil. Nu se pot trimite generări.',
    'Local installation counter unavailable. Image generation is disabled.');
   if(work.evaImageGenerateButton)work.evaImageGenerateButton.disabled=true;
   if(work.evaImageEditButton)work.evaImageEditButton.disabled=true;
   return;
  }
  try{
   const r=await fetch(evaImageQuotaUrl,{method:'POST',headers:{'Content-Type':'application/json'},
    cache:'no-store',body:JSON.stringify({installationId:work.evaImageInstallId})});
   const data=await r.json();
   if(work!==extraToolsSession||!display.isConnected)return;
   if(!r.ok||data.scope!=='installation_preview'||!Number.isInteger(data.remaining))throw Error('quota_unavailable');
   work.evaImageQuotaRemaining=data.remaining;
   const personal=Number.isInteger(data.personalRemaining)?data.personalRemaining:data.remaining;
   display.textContent=data.capacityLimited&&personal>0?
    extraToolsLocale(
     'Mai ai '+personal+' din '+data.dailyLimit+' utilizări pe această instalare, dar plafonul de siguranță al testului este momentan atins.',
     'You still have '+personal+' of '+data.dailyLimit+' uses on this installation, but the preview safety cap is currently reached.'
    ):
    extraToolsLocale(
     'Imagini AI: '+personal+' din '+data.dailyLimit+' utilizări rămase astăzi pe această instalare. Resetare la 00:00 UTC.',
     'AI images: '+personal+' of '+data.dailyLimit+' uses remaining today on this installation. Resets at 00:00 UTC.'
    );
   if(!work.controller){
    if(work.evaImageGenerateButton)work.evaImageGenerateButton.disabled=data.remaining<=0;
    if(work.evaImageEditButton)work.evaImageEditButton.disabled=data.remaining<=0;
   }
  }catch{
   if(work!==extraToolsSession)return;
   work.evaImageQuotaRemaining=null;
   display.textContent=extraToolsLocale('Contorul de imagini nu poate fi verificat momentan.','Image quota cannot be checked right now.');
  }
 };
 if(!work.evaImageInstallId){
  void work.evaImageQuotaUpdate();return;
 }
 void work.evaImageQuotaUpdate();
}

function extraCreatorSceneBackground(source){
 // Highlight only background details explicitly named by the user.
 // This is a lightweight prompt enhancement, NOT image analysis or a guarantee.
 const patterns=[
  /(?:\bcu\b|\bwith\b|\bși\b|\band\b)\s+([^,;.!?]{3,100}?)\s+(?:în\s+fundal|pe\s+fundal|în\s+depărtare|la\s+orizont|in\s+the\s+background|on\s+the\s+horizon)\b/iu,
  /(?:în\s+fundal|în\s+depărtare|la\s+orizont|in\s+the\s+background|on\s+the\s+horizon)\s+(?:se\s+vede\s+|se\s+află\s+|apare\s+|there\s+is\s+|is\s+)?([^,;.!?]{3,100})/iu,
  /(?:background\s+(?:shows?|features?|contains?)|behind\s+(?:him|her|them|it))\s+([^,;.!?]{3,100})/iu
 ];
 for(const pattern of patterns){
  const m=source.match(pattern);
  if(m){
   const item=m[1].trim().replace(/\s+/g,' ');
   if(item.length>=3)return item;
  }
 }
 return '';
}
function extraCreatorEnhancedPrompt(prompt,composition,format){
 const source=String(prompt||'').trim().replace(/\s+/g,' ');
 if(!source||source.length>800)throw Error('invalid_prompt_length');
 const ratio=format==='portrait'?'Vertical 9:16 framing; do NOT infer a close-up.':
  format==='wide'?'Wide 16:9 framing.':'Square 1:1 framing.';
 const framing=composition==='portrait'?'Close portrait only when explicitly selected.':
  composition==='medium'?'Medium-wide camera; retain all requested subjects and scenery.':
  composition==='wide'?'Wide establishing shot: include requested background scenery.':
  'Full scene, camera far enough to show entire named people and animals, including legs and feet.';
 const camel=/c[aă]mil|camel/i.test(source),knight=/cavaler|knight|templier|templar/i.test(source);
 const rider=/c[aă]lare|riding|mounted|on a camel/i.test(source);
 const specific=camel&&knight&&rider?
  'Keep the knight seated ON the camel; show both complete bodies in one scene.':'';
 const background=extraCreatorSceneBackground(source);
 const bg=background?
  'REQUIRED VISIBLE BACKGROUND: '+background+'. Show this object clearly in the distance, recognizable and not hidden, cropped or replaced.':'';
 const fidelity='MANDATORY: depict every explicitly requested subject, action, setting, prop and background element. Preserve the relationships and counts. Do not silently omit distant details.';
 const composed=[ratio,framing,specific,bg,fidelity,'Original user request: '+source].filter(Boolean).join(' ');
 // The server accepts up to 1400 characters. Shorten guidance, never user text.
 if(composed.length<=1400)return composed;
 return [ratio,bg,'Include every explicitly requested foreground and background object.','Original user request: '+source].filter(Boolean).join(' ');
}
function evaImageCompactPrompt(field){
 // Image editor only. Keep the initial workspace small; expand while typing.
 if(!field)return;
 field.classList.add('eva-image-prompt');
 field.rows=2;
 field.maxLength=800;
 const resize=()=>{
  const limit=Math.min(220,Math.max(100,Math.round(window.innerHeight*.30)));
  field.style.setProperty('height','auto','important');
  const height=Math.min(limit,Math.max(76,field.scrollHeight+2));
  field.style.setProperty('height',height+'px','important');
 };
 field.addEventListener('input',resize);
 resize();
}

async function extraCreatorImageCanvas(data){
 if(typeof data!=='string'||data.length>7500000||!/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(data))throw Error('image_invalid');
 const image=new Image();image.src=data;await image.decode();
 const canvas=extraToolsEl('canvas','extra-work-image'),scale=Math.min(1,1200/Math.max(image.width,image.height));
 canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);
 canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
 return canvas;
}
function extraCreatorSaveImage(work,status){
 if(!work.creatorGeneratedCanvas)return;
 const canvas=work.creatorGeneratedCanvas,encoded=canvas.toDataURL('image/png').split(',')[1];
 if(encoded.length>9600000){status.textContent=extraToolsLocale('Imagine prea mare pentru Galerie.','Image too large for Gallery.');return}
 if(window.PocketAndroidImages?.postMessage){
  window.pocketAndroidImageSaveResult=result=>{
   if(work!==extraToolsSession)return;
   status.textContent=result==='saved'?
    extraToolsLocale('Imagine salvată în Galerie / Pictures/myPocketAI.','Image saved in Gallery / Pictures/myPocketAI.'):
    extraToolsLocale('Nu s-a putut salva imaginea.','Could not save the image.');
  };
  window.PocketAndroidImages.postMessage(JSON.stringify({action:'save',base64:encoded}));
  status.textContent=extraToolsLocale('Se salvează…','Saving…');return;
 }
 const a=extraToolsEl('a');a.download='Eva-imagine.png';a.href=canvas.toDataURL('image/png');
 document.body.append(a);a.click();a.remove();
 status.textContent=extraToolsLocale('Export PNG inițiat.','PNG download started.');
}
function extraCreatorWorkingImages(work){
 extraCreatorImages(work);
 const area=work.area,f=work.creatorImageForm;if(!f)return;
 evaImageCompactPrompt(f.imagePrompt);
 const old=Array.from(area.querySelectorAll('.extra-work-actions')).at(-1);
 if(old?.querySelector('button[disabled]'))old.remove();
 const intro=area.querySelector('.extra-creator-notice');
 if(intro)intro.textContent=extraToolsLocale(
  'Generator AI real de test. Limită globală: maximum 3 imagini pe zi, fără generare plătită nelimitată.',
  'Live AI preview. Global cap: 3 images daily, without unlimited paid requests.');
 const status=extraToolsEl('p','extra-creator-operation-status',
  extraToolsLocale('Introdu descrierea. Aici vei vedea imediat când începe generarea și când este gata.','Describe your image. Generation progress and result will appear here.'));
 status.setAttribute('role','status');
 const save=extraToolsBtn(extraToolsLocale('💾 Salvează în Galerie','💾 Save to Gallery'),()=>extraCreatorSaveImage(work,status));
 save.disabled=true;
 const zoom=extraToolsBtn(extraToolsLocale('⛶ Ecran complet','⛶ Full screen'),()=>{
  if(!work.creatorGeneratedCanvas)return;
  const overlay=extraToolsEl('div','extra-creator-image-overlay'),close=extraToolsBtn(extraToolsLocale('← Închide imaginea','← Close image'),()=>overlay.remove());
  const img=extraToolsEl('img');img.src=work.creatorGeneratedCanvas.toDataURL('image/jpeg',.9);img.alt=extraToolsLocale('Imagine generată','Generated image');
  overlay.append(close,img);document.body.append(overlay);
 });zoom.disabled=true;
 const share=extraToolsBtn(extraToolsLocale('↗ Partajează','↗ Share'),async()=>{
  if(!work.creatorGeneratedCanvas)return;
  try{
   const blob=await new Promise(done=>work.creatorGeneratedCanvas.toBlob(done,'image/png'));
   const file=new File([blob],'Eva-imagine.png',{type:'image/png'});
   if(navigator.share&&(!navigator.canShare||navigator.canShare({files:[file]})))await navigator.share({files:[file]});
   else status.textContent=extraToolsLocale('Partajarea nu este disponibilă. Salvează în Galerie.','Sharing unavailable. Save to Gallery.');
  }catch{status.textContent=extraToolsLocale('Partajare anulată sau indisponibilă.','Sharing cancelled or unavailable.')}
 });share.disabled=true;
 const generate=extraToolsBtn(extraToolsLocale('✨ Generează imaginea AI','✨ Generate AI image'),async()=>{
  const prompt=f.imagePrompt.value.trim();
  if(prompt.length<8){status.textContent=extraToolsLocale('Descrie imaginea în minimum 8 caractere.','Describe the image in at least 8 characters.');return}
  if(prompt.length>800){status.textContent=extraToolsLocale('Scurtează descrierea la maximum 800 de caractere.','Shorten the description to at most 800 characters.');return}
  if(!work.evaImageInstallId){
   status.textContent=extraToolsLocale('Identificatorul acestei instalări nu este disponibil.','Installation identifier unavailable.');return;
  }
  if(work.evaImageQuotaRemaining===0){
   status.textContent=extraToolsLocale('Nu mai sunt utilizări disponibile astăzi.','No uses left for today.');return;
  }
  if(work.controller)return;
  const ctrl=new AbortController();work.controller=ctrl;
  const timeout=setTimeout(()=>ctrl.abort(),65000);
  generate.disabled=true;generate.textContent=extraToolsLocale('⏳ Se generează…','⏳ Generating…');
  status.textContent=extraToolsLocale('Cererea a fost trimisă motorului AI.','Request sent to AI.');
  try{
   const enhanced=extraCreatorEnhancedPrompt(prompt,f.composition?.value||'full',f.format.value);
   const response=await fetch(extraCreatorImagePreviewUrl,{method:'POST',headers:{
    'Content-Type':'application/json'},
    body:JSON.stringify({prompt:enhanced,format:f.format.value,installationId:work.evaImageInstallId}),signal:ctrl.signal});
   const data=await response.json().catch(()=>null);
   if(work!==extraToolsSession||!area.isConnected)return;
   if(!response.ok||data?.status!=='success'||typeof data.image!=='string'){
    status.textContent=['installation_limit_reached','preview_capacity_reached','preview_limit_reached'].includes(data?.error)?
     extraToolsLocale('Limita zilnică globală de 3 imagini de test a fost atinsă.','The shared daily preview limit of 3 images was reached.'):
     ['workers_ai_free_limit','workers_ai_limit'].includes(data?.error)?
     extraToolsLocale('Limita gratuită Cloudflare este epuizată. Nu se face generare plătită.','Cloudflare free quota exhausted. No paid generation attempted.'):
     extraToolsLocale('Motorul AI nu a răspuns. Nu există imagine de salvat.','AI image engine unavailable. No image to save.');
    return;
   }
   const canvas=await extraCreatorImageCanvas(data.image);
   if(work!==extraToolsSession)return;
   work.creatorGeneratedCanvas=canvas;f.areaPreview.replaceChildren(canvas);f.areaPreview.classList.add('extra-creator-generated');
   save.disabled=false;zoom.disabled=false;share.disabled=false;
   status.textContent=extraToolsLocale('Imaginea este gata. Verifică dacă apar toate subiectele cerute înainte de salvare. O nouă generare consumă altă solicitare.','Image ready. Check that all requested subjects are included before saving. A new generation uses another request.');
  }catch(error){
   if(work===extraToolsSession)status.textContent=error?.name==='AbortError'?
     extraToolsLocale('Generarea a expirat. Poți încerca din nou.','Generation timed out. Retry.'):
     extraToolsLocale('Nu am putut contacta motorul de imagini.','Could not reach image generation.');
  }finally{
   clearTimeout(timeout);
   if(work===extraToolsSession){work.controller=null;generate.disabled=false;generate.textContent=extraToolsLocale('✨ Generează imaginea AI','✨ Generate AI image');void work.evaImageQuotaUpdate?.()}
  }
 },true);
 const row=extraToolsActions(area,generate,save,zoom,share);area.insertBefore(status,row);
 work.evaImageGenerateButton=generate;
 evaCreatorPhotoTabs(work);
 evaImageQuotaMount(work);
}

function evaCreatorPhotoTabs(work){
 const area=work.area;
 const originalChildren=Array.from(area.children);
 const generated=extraToolsEl('section','eva-photo-panel');
 for(const node of originalChildren.slice(2))generated.append(node);
 const tabs=extraToolsEl('div','eva-photo-tabs');
 const newBtn=extraToolsBtn(extraToolsLocale('✨ Imagine nouă','✨ New image'),()=>show(false),true);
 const editBtn=extraToolsBtn(extraToolsLocale('🖼 Modifică fotografie','🖼 Edit a photo'),()=>show(true));
 const edited=extraToolsEl('section','eva-photo-panel');edited.hidden=true;
 const album=extraToolsEl('input');album.type='file';album.accept='image/jpeg,image/png,image/webp';album.hidden=true;
 const camera=extraToolsEl('input');camera.type='file';camera.accept='image/*';camera.setAttribute('capture','environment');camera.hidden=true;
 const pick=extraToolsBtn(extraToolsLocale('🖼 Din album','🖼 From gallery'),()=>album.click());
 const shoot=extraToolsBtn(extraToolsLocale('📷 Fotografiază','📷 Take photo'),()=>camera.click());
 const guidance=extraToolsEl('p','extra-work-note',extraToolsLocale(
  'Fotografia este trimisă către Cloudflare pentru editare AI, doar după ce apeși Aplică. Originalul rămâne nemodificat.',
  'Your photo is sent to Cloudflare for AI editing only after you tap Apply. Your original remains unchanged.'));
 edited.append(guidance,album,camera);extraToolsActions(edited,pick,shoot);
 const prompt=extraToolsField(edited,extraToolsLocale('Ce dorești să modifici?','What should change?'),'textarea',
  extraToolsLocale('De exemplu: înlocuiește fundalul cu o plajă, păstrează persoana.','e.g. Change the background to a beach, keep the person.'));
 evaImageCompactPrompt(prompt);
 const format=extraToolsField(edited,extraToolsLocale('Formatul rezultatului','Result size'),'select');
 for(const [v,ro,en] of [['original','Păstrează proporțiile','Keep proportions'],
  ['square','Pătrat (1:1)','Square (1:1)'],['wide','Orizontal (16:9)','Landscape (16:9)'],
  ['portrait','Vertical (9:16)','Portrait (9:16)']]){
  const opt=extraToolsEl('option','',extraToolsLocale(ro,en));opt.value=v;format.append(opt);
 }
 const preview=extraToolsEl('div','extra-creator-image-placeholder eva-photo-preview');
 preview.textContent=extraToolsLocale('Alege o fotografie din album sau cameră.','Choose a photo from your gallery or camera.');
 const status=extraToolsEl('p','extra-creator-operation-status',extraToolsLocale('Fotografia originală nu va fi modificată.','Your original photo will not be changed.'));
 status.setAttribute('role','status');edited.append(preview,status);
 let inputImage=null,outputCanvas=null,sourceWidth=0,sourceHeight=0;
 const save=extraToolsBtn(extraToolsLocale('💾 Salvează','💾 Save'),()=>{
  if(!outputCanvas)return;
  const previous=work.creatorGeneratedCanvas;
  work.creatorGeneratedCanvas=outputCanvas;
  try{extraCreatorSaveImage(work,status)}finally{work.creatorGeneratedCanvas=previous}
 });save.disabled=true;
 const full=extraToolsBtn(extraToolsLocale('⛶ Ecran complet','⛶ Full screen'),()=>{
  if(!outputCanvas)return;
  const overlay=extraToolsEl('div','extra-creator-image-overlay');
  const back=extraToolsBtn(extraToolsLocale('← Înapoi','← Back'),()=>overlay.remove());
  const img=extraToolsEl('img');img.src=outputCanvas.toDataURL('image/jpeg',.92);
  img.alt=extraToolsLocale('Fotografie modificată','Edited photo');
  overlay.append(back,img);document.body.append(overlay);
 });full.disabled=true;
 const apply=extraToolsBtn(extraToolsLocale('✨ Aplică modificarea','✨ Apply edit'),async()=>{
  if(!inputImage){status.textContent=extraToolsLocale('Selectează întâi o fotografie.','Choose a photo first.');return}
  const instructions=prompt.value.trim();
  if(instructions.length<8){status.textContent=extraToolsLocale('Descrie modificarea în minimum 8 caractere.','Describe the change in at least eight characters.');return}
  if(!work.evaImageInstallId){
   status.textContent=extraToolsLocale('Identificatorul acestei instalări nu este disponibil.','Installation identifier unavailable.');return;
  }
  if(work.evaImageQuotaRemaining===0){
   status.textContent=extraToolsLocale('Nu mai sunt utilizări disponibile astăzi.','No uses left for today.');return;
  }
  if(work.controller)return;
  const ctrl=new AbortController();work.controller=ctrl;
  const timeout=setTimeout(()=>ctrl.abort(),85000);
  apply.disabled=true;apply.textContent=extraToolsLocale('⏳ Se editează…','⏳ Editing…');
  status.textContent=extraToolsLocale('Se trimite fotografia către motorul AI.','Sending photo to the AI engine.');
  try{
   const response=await fetch('https://lifewise-ai-image-studio.kokocf.workers.dev/edit',{
    method:'POST',headers:{'Content-Type':'application/json'},signal:ctrl.signal,cache:'no-store',
    body:JSON.stringify({prompt:instructions,format:format.value,width:sourceWidth,height:sourceHeight,image:inputImage,installationId:work.evaImageInstallId})
   });
   const data=await response.json().catch(()=>null);
   if(work!==extraToolsSession||!edited.isConnected)return;
   if(!response.ok||data?.status!=='success'||typeof data.image!=='string'){
    status.textContent=['installation_limit_reached','preview_capacity_reached','preview_limit_reached'].includes(data?.error)?
     extraToolsLocale('Limita globală de 3 imagini pe zi este atinsă.','The global daily limit of three images has been reached.'):
     extraToolsLocale('Editarea nu a reușit. Nu s-a salvat nimic.','Editing failed. Nothing was saved.');
    return;
   }
   const canvas=await extraCreatorImageCanvas(data.image);
   if(work!==extraToolsSession)return;
   outputCanvas=canvas;preview.replaceChildren(canvas);
   save.disabled=false;full.disabled=false;
   status.textContent=extraToolsLocale('Fotografie modificată. Originalul este păstrat.','Photo edited. Original remains unchanged.');
  }catch(err){
   if(work===extraToolsSession)status.textContent=err?.name==='AbortError'?
    extraToolsLocale('Editarea a expirat. Încearcă din nou.','Edit timed out. Retry.'):
    extraToolsLocale('Serverul de imagini nu răspunde.','Image server did not respond.');
  }finally{
   clearTimeout(timeout);
   if(work===extraToolsSession){work.controller=null;apply.disabled=false;apply.textContent=extraToolsLocale('✨ Aplică modificarea','✨ Apply edit');void work.evaImageQuotaUpdate?.()}
  }
 },true);
 work.evaImageEditButton=apply;
 extraToolsActions(edited,apply,save,full);
 const load=async file=>{
  if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>12000000){
   status.textContent=extraToolsLocale('Alege JPG, PNG sau WEBP sub 12 MB.','Choose JPG, PNG or WEBP under 12 MB.');return;
  }
  let url;
  try{
   url=URL.createObjectURL(file);
   const img=new Image();img.src=url;await img.decode();
   if(img.width<16||img.height<16||img.width*img.height>80000000)throw Error('invalid_photo');
   sourceWidth=img.width;sourceHeight=img.height;
   const scale=Math.min(1,480/img.width,480/img.height);
   const canvas=extraToolsEl('canvas','extra-work-image');
   canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));
   const context=canvas.getContext('2d',{alpha:false});
   context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);
   context.drawImage(img,0,0,canvas.width,canvas.height);
   inputImage=canvas.toDataURL('image/jpeg',.8);
   if(inputImage.length>950000)throw Error('image_too_large');
   outputCanvas=null;save.disabled=true;full.disabled=true;
   preview.replaceChildren(canvas);
   status.textContent=extraToolsLocale('Fotografia este pregătită. Scrie modificarea.','Photo ready. Describe the change.');
  }catch{
   inputImage=null;
   status.textContent=extraToolsLocale('Fotografia nu poate fi deschisă.','Could not open this photo.');
  }finally{if(url)URL.revokeObjectURL(url);album.value='';camera.value=''}
 };
 album.onchange=()=>load(album.files?.[0]);camera.onchange=()=>load(camera.files?.[0]);
 function show(edit){
  generated.hidden=edit;edited.hidden=!edit;
  newBtn.setAttribute('aria-pressed',String(!edit));
  editBtn.setAttribute('aria-pressed',String(edit));
  if(!edit)newBtn.classList.add('primary-btn');else newBtn.classList.remove('primary-btn');
  if(edit)editBtn.classList.add('primary-btn');else editBtn.classList.remove('primary-btn');
 }
 tabs.append(newBtn,editBtn);area.append(tabs,generated,edited);
 const header=extraToolsEl('div','eva-photo-header');
 const back=area.querySelector('.extra-creator-subback'),title=area.querySelector('.extra-creator-subtitle');
 if(back)header.append(back);
 if(title)header.append(title);
 area.prepend(header);show(false);
}

`;
export const CREATOR_IMAGE_AI_STYLE=String.raw`
#view-module.extra-tools-workspace .extra-creator-image-placeholder.extra-creator-generated{padding:8px!important;min-height:80px!important}
#view-module.extra-tools-workspace .extra-creator-image-placeholder.extra-creator-generated canvas{display:block!important;width:auto!important;height:auto!important;max-width:100%!important;max-height:40dvh!important;margin:0 auto!important}
.extra-creator-image-overlay{position:fixed!important;inset:0!important;z-index:999999!important;background:#06121d!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:11px!important;padding:calc(12px + env(safe-area-inset-top,0px)) 12px calc(12px + env(safe-area-inset-bottom,0px))!important}
.extra-creator-image-overlay>button{flex:0 0 54px!important;min-height:54px!important;width:100%!important;border-radius:13px!important;background:#7c304a!important;color:white!important}
.extra-creator-image-overlay>img{display:block!important;max-width:100%!important;max-height:calc(100% - 75px)!important;object-fit:contain!important}

.eva-photo-header{display:flex;align-items:center;gap:8px;min-height:40px}
.eva-photo-header .extra-creator-subtitle{flex:1;text-align:center;min-width:0;margin:0!important;font-size:clamp(14px,2.5vw,18px)!important}
.eva-photo-header .extra-creator-subback{flex:0 0 auto;width:auto!important;min-height:38px!important}
.eva-photo-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:6px 0 9px}
.eva-photo-tabs button{min-width:0;width:100%;min-height:41px;font-size:clamp(12px,3vw,15px)}
.eva-photo-tabs button[aria-pressed="true"]{background:#752b49!important;color:white!important}
.eva-photo-panel{display:flex;flex-direction:column;gap:8px;min-width:0;overflow-x:hidden}
.eva-photo-panel[hidden]{display:none!important}
.eva-photo-panel textarea{min-height:64px!important;max-height:30dvh!important;resize:vertical}
.eva-photo-panel .extra-work-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:7px}
.eva-photo-panel .extra-work-actions button{flex:1 1 130px;min-height:39px}
.eva-photo-panel .extra-work-actions .primary-btn{background:#752b49!important}
.eva-photo-preview{min-height:100px!important;max-height:32dvh!important;overflow:hidden}
.eva-photo-preview canvas{max-width:100%;max-height:31dvh;object-fit:contain}
@media(max-width:440px){.eva-photo-tabs button{font-size:12px}.eva-photo-panel .extra-work-actions button{flex-basis:40%;font-size:12px}}
body:has(#view-module.extra-tools-workspace .eva-photo-tabs) #view-module.extra-tools-workspace .extra-tools-workarea{overflow-y:auto!important;overscroll-behavior:contain;touch-action:pan-y}


/* Image studio only: compact description, progressive expansion without moving the app header. */
#view-module.extra-tools-workspace .eva-photo-panel textarea.extra-work-input.eva-image-prompt{
 height:76px!important;min-height:76px!important;max-height:clamp(100px,30dvh,220px)!important;
 resize:none!important;overflow-y:auto!important;overscroll-behavior:contain!important;
}

#view-module.extra-tools-workspace .eva-image-quota-status{
 margin:4px 0 7px!important;padding:7px 9px!important;font-size:12px!important;
 text-align:center;line-height:1.35!important;border:1px solid #607e8a;border-radius:9px;
 color:inherit;background:transparent;
}
`;
