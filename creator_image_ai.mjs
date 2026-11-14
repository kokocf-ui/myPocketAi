export const CREATOR_IMAGE_AI_SCRIPT=String.raw`
const extraCreatorImagePreviewUrl='https://lifewise-ai-creator-preview.kokocf.workers.dev/image';
function extraCreatorEnhancedPrompt(prompt,composition,format){
 const source=String(prompt||'').trim().replace(/\s+/g,' ');
 const ratio=format==='portrait'?'Vertical 9:16 image framing, not automatically a close-up.':
  format==='wide'?'Wide 16:9 image layout.':'Square 1:1 image layout.';
 const framing=composition==='portrait'?'Portrait framing requested: show the named subject clearly.':
  composition==='medium'?'Medium-wide shot. Keep all named essential subjects in the image.':
  composition==='wide'?'Wide establishing shot with environmental context.':
  'FULL SCENE, FULL BODY, camera far enough for every named person, animal and object to be ENTIRELY VISIBLE. No head-only portrait.';
 const camel=/c[aă]mil|camel/i.test(source),knight=/cavaler|knight|templier|templar/i.test(source);
 const rider=/c[aă]lare|riding|mounted|on a camel/i.test(source);
 const specific=camel&&knight&&rider?
  ' Critical: show exactly one medieval Templar knight RIDING ON TOP OF A CAMEL. The whole camel (head, body, four legs) AND the full knight must be visible at once. Clearly show the relationship rider seated on animal. NOT a headshot.':'';
 return (ratio+' '+framing+specific+' Original requested content: '+source).slice(0,500);
}
async function extraCreatorImageCanvas(data){
 if(typeof data!=='string'||data.length>7500000||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(data))throw Error('image_invalid');
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
  if(work.controller)return;
  const ctrl=new AbortController();work.controller=ctrl;
  const timeout=setTimeout(()=>ctrl.abort(),65000);
  generate.disabled=true;generate.textContent=extraToolsLocale('⏳ Se generează…','⏳ Generating…');
  status.textContent=extraToolsLocale('Cererea a fost trimisă motorului AI.','Request sent to AI.');
  try{
   const enhanced=extraCreatorEnhancedPrompt(prompt,f.composition?.value||'full',f.format.value);
   const response=await fetch(extraCreatorImagePreviewUrl,{method:'POST',headers:{
    'Content-Type':'application/json','X-Pocket-Preview':'1'},
    body:JSON.stringify({prompt:enhanced}),signal:ctrl.signal});
   const data=await response.json().catch(()=>null);
   if(work!==extraToolsSession||!area.isConnected)return;
   if(!response.ok||data?.status!=='success'||typeof data.image!=='string'){
    status.textContent=data?.error==='preview_limit_reached'?
     extraToolsLocale('Limita zilnică globală de 3 imagini de test a fost atinsă.','The shared daily preview limit of 3 images was reached.'):
     data?.error==='workers_ai_free_limit'?
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
   if(work===extraToolsSession){work.controller=null;generate.disabled=false;generate.textContent=extraToolsLocale('✨ Generează imaginea AI','✨ Generate AI image')}
  }
 },true);
 const row=extraToolsActions(area,generate,save,zoom,share);area.insertBefore(status,row);
}
`;
export const CREATOR_IMAGE_AI_STYLE=String.raw`
#view-module.extra-tools-workspace .extra-creator-image-placeholder.extra-creator-generated{padding:8px!important;min-height:80px!important}
#view-module.extra-tools-workspace .extra-creator-image-placeholder.extra-creator-generated canvas{display:block!important;width:auto!important;height:auto!important;max-width:100%!important;max-height:40dvh!important;margin:0 auto!important}
.extra-creator-image-overlay{position:fixed!important;inset:0!important;z-index:999999!important;background:#06121d!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:11px!important;padding:calc(12px + env(safe-area-inset-top,0px)) 12px calc(12px + env(safe-area-inset-bottom,0px))!important}
.extra-creator-image-overlay>button{flex:0 0 54px!important;min-height:54px!important;width:100%!important;border-radius:13px!important;background:#7c304a!important;color:white!important}
.extra-creator-image-overlay>img{display:block!important;max-width:100%!important;max-height:calc(100% - 75px)!important;object-fit:contain!important}
`;
