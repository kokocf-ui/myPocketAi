export const CREATOR_SITE_AI_SCRIPT=String.raw`
function extraCreatorParseAI(text,language){
 const raw=String(text||'').trim();
 if(raw.length<20||raw.length>24000)return null;
 let parsed=null;
 const start=raw.indexOf('{'),end=raw.lastIndexOf('}');
 try{if(start>=0&&end>start)parsed=JSON.parse(raw.slice(start,end+1))}catch{return null}
 const get=obj=>{
  if(!obj||typeof obj!=='object')return null;
  const text=k=>typeof obj[k]==='string'?obj[k].trim().slice(0,k==='about'?1100:300):'';
  const section={headline:text('headline'),intro:text('intro'),about:text('about'),
   services:Array.isArray(obj.services)?obj.services.filter(x=>x&&typeof x.title==='string').slice(0,8)
    .map(x=>({title:String(x.title).slice(0,80),detail:String(x.detail||'').slice(0,250)})):[]};
  return section.headline&&section.intro&&section.about?section:null;
 };
 const ro=get(parsed?.ro),en=get(parsed?.en);
 if(language==='ro'&&!ro||language==='en'&&!en||language==='both'&&(!ro||!en))return null;
 return {ro,en};
}
function extraCreatorAiSitePrompt(input){
 return [
  'You are Eva, a professional copywriter creating a REAL website for a small business.',
  'Return exactly one VALID JSON object, no markdown and no explanations.',
  'JSON format: {"ro":{"headline":"...","intro":"...","about":"...","services":[{"title":"...","detail":"..."}]},"en":{"headline":"...","intro":"...","about":"...","services":[{"title":"...","detail":"..."}]}}.',
  'Required language: '+(input.lang==='both'?'ro AND en':input.lang)+'. Only the required language objects.',
  'Write genuine short, distinct and useful website content; avoid copying the same paragraph into multiple sections.',
  'STRICT: ONLY actual details provided by business owner. Do not invent prices, reviews, photographs, addresses, amenities or room counts.',
  'Name: '+input.name,'Category: '+input.kind,'Style: '+input.style,
  'Owner-provided description: '+input.description,
  input.english?'Owner-provided English content: '+input.english:'',
  'At most four services; headline under 80 characters; intro under 250; about under 350; each detail under 200. No news or unrelated information.'
 ].filter(Boolean).join('\n').slice(0,3950);
}
async function extraCreatorCallAiWebsite(input,signal){
 const response=await fetch('https://lifewise-ai-creator-preview.kokocf.workers.dev/site',
  {method:'POST',headers:{'Content-Type':'application/json','X-Pocket-Preview':'1'},
  body:JSON.stringify({name:input.name,kind:input.kind,description:(input.description.slice(0,650)+'\n'+extraCreatorBusinessFacts(input.kind,input.businessDetails||{}).map(x=>x.ro+': '+x.value.slice(0,180)).join('\n')).slice(0,1700),style:input.style,english:input.english,lang:input.lang}),signal});
 const data=await response.json().catch(()=>null);
 if(!response.ok||data?.status!=='success'||typeof data.reply!=='string')throw Error(data?.error||'ai_unavailable');
 const copy=extraCreatorParseAI(data.reply,input.lang);
 if(!copy)throw Error('invalid_ai_structure');
 return copy;
}
function extraCreatorExportHTML(work,name){
 if(!work.siteHtml)return;
 const filename=(String(name||'mypocket-site').normalize('NFKD').replace(/[^a-z0-9-]+/gi,'-').slice(0,50)||'mypocket-site')+'.html';
 const blob=new Blob([work.siteHtml],{type:'text/html;charset=utf-8'});
 const startDownload=()=>{
  const url=URL.createObjectURL(blob),a=extraToolsEl('a');a.href=url;a.download=filename;
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),25000);
  extraToolsStatus(extraToolsLocale('Exportul a fost inițiat. Verifică fișierele telefonului.','Export initiated. Check device downloads.'));
 };
 if(navigator.share&&typeof File!=='undefined'){
  const file=new File([blob],filename,{type:'text/html'});
  if(!navigator.canShare||navigator.canShare({files:[file]})){
   navigator.share({title:filename,files:[file]}).catch(error=>{
    if(error.name!=='AbortError')startDownload();
   });
   return;
  }
 }
 startDownload();
}
function extraCreatorWorkingWebsite(work){
 extraCreatorWebsite(work);
 const f=work.creatorForm;if(!f)return;
 const area=work.area;
 area.querySelector('.extra-creator-disabled-note')?.remove();
 const buttons=Array.from(area.querySelectorAll('.extra-work-actions'));
 if(buttons.at(-1)?.querySelector('button[disabled]'))buttons.at(-1).remove();
 const status=extraToolsEl('p','extra-creator-operation-status',
  extraToolsLocale('Eva poate redacta un site cu AI folosind serviciul existent. Verifică toate informațiile.','Eva can create website copy using the current AI. Verify all facts.'));
 status.setAttribute('role','status');
 const save=extraToolsBtn(extraToolsLocale('💾 Exportă site-ul HTML','💾 Export HTML'),()=>extraCreatorExportHTML(work,f.name.value));
 save.disabled=true;
 // Local website previews are real exportable HTML even if AI quota is exhausted.
 f.onPreviewReady=()=>{save.disabled=false;
  status.textContent=extraToolsLocale(
   'Macheta locală este gata și poate fi exportată. Generarea cu Eva este o operație separată.',
   'The local draft can be exported. AI creation with Eva is a separate operation.');
 };
 const create=extraToolsBtn(extraToolsLocale('✨ Creează site-ul cu Eva','✨ Create website with Eva'),async()=>{
  const name=f.name.value.trim(),description=f.desc.value.trim(),kind=f.type.value,lang=f.lang.value;
  if(name.length<2||description.length<15){status.textContent=extraToolsLocale('Completează numele și o descriere de cel puțin 15 caractere.','Enter a business name and a description of at least 15 characters.');return}
  // The selected management contract must be configured before generating the final AI site.
  const managementError=f.validateManagement?.();
  if(managementError){status.textContent=managementError;return}
  work.creatorProjectSettings=f.getManagement?.();
  if(work.controller)return;
  const ctrl=new AbortController();work.controller=ctrl;const timeout=setTimeout(()=>ctrl.abort(),45000);
  create.disabled=true;create.textContent=extraToolsLocale('⏳ Eva redactează…','⏳ Eva is writing…');
  status.textContent=extraToolsLocale('Eva pregătește site-ul. Rezultatul va apărea în previzualizare.','Eva is preparing the site. It will appear in the preview.');
  const style=f.getStyle(),businessDetails=f.getBusinessDetails?.()||{};
  const fingerprint=()=>JSON.stringify([f.name.value,f.type.value,f.desc.value,f.lang.value,f.contact.value,f.getStyle().id,f.getBusinessDetails?.()||{},f.getPreferences?.()||{}]);
  const initialFingerprint=fingerprint();
  try{
   const copy=await extraCreatorCallAiWebsite({name,description,kind,businessDetails,lang,style:style.ro+' '+f.extra.value},ctrl.signal);
   if(work!==extraToolsSession||!area.isConnected)return;
   if(fingerprint()!==initialFingerprint){status.textContent=extraToolsLocale('Datele s-au schimbat între timp. Răspunsul vechi nu a fost aplicat; generează pentru datele actuale.','Details changed while generating. The old reply was not applied; generate for the current details.');return}
   work.siteAiCopy=copy;
   work.siteHtml=extraCreatorLocalHtml(name,f.type.options[f.type.selectedIndex]?.textContent||kind,description,style.ro+' '+f.extra.value,f.contact.value,lang,
    {kind,businessDetails:f.getBusinessDetails?.()||{},styleId:style.id,descriptionEn:copy.en?.intro||'',photo:f.getPhoto(),gallery:f.getGallery?.()||[],aiCopy:copy,prefs:f.getPreferences?.()||{}});
   const frame=extraToolsEl('iframe','extra-creator-preview');frame.setAttribute('sandbox','');
   frame.srcdoc=work.siteHtml;frame.title=extraToolsLocale('Site generat de Eva','Website by Eva');
   f.preview.replaceChildren(frame);
   f.note.textContent=extraToolsLocale('Site AI creat. Revizuiește datele înainte de publicare.','AI website created. Review details before publishing.');
   status.textContent=extraToolsLocale('Site-ul este gata. Îl poți deschide pe tot ecranul și exporta.','Website ready. You can view and export it.');
   save.disabled=false;
   f.preview.scrollIntoView({block:'nearest',behavior:'smooth'});
  }catch(error){
   if(work!==extraToolsSession)return;
   status.textContent=error?.name==='AbortError'
    ?extraToolsLocale('Generarea a expirat. Încearcă din nou.','Request timed out. Retry.')
    :error?.message==='invalid_ai_structure'
      ?extraToolsLocale('Eva a răspuns, dar nu într-un format de site utilizabil. Încearcă o descriere mai scurtă.','AI reply was not valid website content. Try a shorter description.')
      :error?.message==='preview_limit_reached'?
       extraToolsLocale('Cota COMUNĂ de test pentru site-uri AI a fost consumată. Nu este o restricție Premium. Revine după 00:00 UTC, dacă mai există credite în limita totală. Poți previzualiza și exporta site-ul local.','The SHARED AI test quota is exhausted, not your Premium allowance. It resets after 00:00 UTC unless the lifetime cap is reached. You can preview and export a local website.')
      :extraToolsLocale('Serviciul AI nu a răspuns. Încearcă din nou sau folosește macheta locală.','AI unavailable. Retry or use the local draft.');
  }finally{
   clearTimeout(timeout);
   if(work===extraToolsSession){work.controller=null;create.disabled=false;create.textContent=extraToolsLocale('✨ Creează site-ul cu Eva','✨ Create website with Eva')}
  }
 },true);
 const row=extraToolsActions(area,create,save);area.insertBefore(status,row);
 extraCreatorAddHandoff(work,f,area,status);
}
`;
export const CREATOR_SITE_AI_STYLE=String.raw`
#view-module.extra-tools-workspace .extra-creator-operation-status{background:#12374b!important;border:1px solid #518fa9!important;color:#c1e5ef!important;border-radius:12px!important;padding:11px 12px!important;font-size:14px!important;line-height:1.45!important;margin:9px 0!important}
`;
