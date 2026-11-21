// Navigation-only theme correction: no global .primary-btn, .secondary-btn,
// option-card, or dock color overrides. This stylesheet is loaded last in the app.
export const NAV_RETURN_ACCENT_CSS=String.raw`
button.pocket-nav-return,
.view button.pocket-nav-return,
#view-module button.pocket-nav-return,
#view-module.learning-active .education-toolbar button.pocket-nav-return,
#view-module.learning-active .module-actions-row button.pocket-nav-return,
#moduleQuickLayer.open .module-quick-sheet button.pocket-nav-return,
#moduleQuickLayer.open .module-quick-sheet #moduleLayerBody button.pocket-nav-return,
#pocketStandaloneChoices button.pocket-nav-return,
.route-choice-screen button.pocket-nav-return,
.lit-material-reader button.pocket-nav-return{
 background:linear-gradient(145deg,#913653,#63213c)!important;
 background-color:#782844!important;
 border:1.5px solid #eab3c1!important;
 color:#fff!important;
 border-radius:17px!important;
 box-shadow:inset 0 2px 0 #ffffff20,0 4px 0 #331323,0 8px 15px #0006!important;
 text-shadow:none!important;
 font-weight:750!important;
}
button.pocket-nav-return.pocket-nav-text,
.view button.pocket-nav-return.pocket-nav-text,
#view-module button.pocket-nav-return.pocket-nav-text,
#moduleQuickLayer.open .module-quick-sheet button.pocket-nav-return.pocket-nav-text{
 display:inline-flex!important;justify-content:center!important;align-items:center!important;
 box-sizing:border-box!important;min-width:112px!important;min-height:50px!important;
 padding:9px 14px!important;font-size:clamp(14px,3.6vw,17px)!important;
 white-space:normal!important;text-align:center!important;
}
button.pocket-nav-return:focus-visible{outline:3px solid #ffd6e0!important;outline-offset:2px!important}

/* Education: keep Home and Back at the same width/height, on one row when it fits.
   Only the real Back DOM node is moved; its click handler remains unchanged. */
#view-module.learning-active .module-actions-row.pocket-inline-nav{
 display:flex!important;flex-direction:row!important;align-items:center!important;
 justify-content:space-between!important;gap:10px!important;width:100%!important;
 min-width:0!important;margin-bottom:7px!important;
}
#view-module.learning-active .module-actions-row.pocket-inline-nav > .module-home-btn,
#view-module.learning-active .module-actions-row.pocket-inline-nav > .pocket-inline-back{
 flex:0 1 44%!important;width:44%!important;min-width:0!important;max-width:240px!important;
 height:clamp(50px,7dvh,60px)!important;min-height:50px!important;
 padding:8px 12px!important;margin:0!important;
 display:inline-flex!important;align-items:center!important;justify-content:center!important;
 box-sizing:border-box!important;white-space:nowrap!important;
 font-size:clamp(13px,3.7vw,17px)!important;
}
#view-module.learning-active .education-toolbar.pocket-back-extracted > .edu-pdf-actions{
 margin-left:auto!important;justify-self:end!important;
}
#view-module.learning-active .education-toolbar.pocket-back-extracted:empty{display:none!important}


/* Expand the Home/Back row across the entire module. Previously the module's
   two-column header constrained it to a narrow first column, forcing Back below. */
#view-module.pocket-paired-nav-layout.learning-active{
 grid-template-rows:auto auto minmax(0,1fr)!important;
}
#view-module.pocket-paired-nav-layout.learning-country-gate #moduleChatHost{
 display:none!important;
}
#view-module.pocket-paired-nav-layout > .module-actions-row{
 grid-column:1/-1!important;grid-row:1!important;width:100%!important;
 max-width:100%!important;justify-self:stretch!important;
}
#view-module.pocket-paired-nav-layout > .module-heading-row{
 grid-column:1/-1!important;grid-row:2!important;width:100%!important;
 max-width:100%!important;margin:2px 0 8px!important;align-self:center!important;
}
#view-module.pocket-paired-nav-layout > #moduleContent{
 grid-column:1/-1!important;grid-row:3!important;min-width:0!important;
}
#view-module.pocket-paired-nav-layout .module-actions-row.pocket-inline-nav{
 gap:10px!important;max-width:100%!important;
}
#view-module.pocket-paired-nav-layout .module-actions-row.pocket-inline-nav > .module-home-btn,
#view-module.pocket-paired-nav-layout .module-actions-row.pocket-inline-nav > .pocket-inline-back{
 flex:0 1 calc(50% - 5px)!important;width:calc(50% - 5px)!important;
 max-width:none!important;min-height:50px!important;
 height:clamp(50px,7dvh,60px)!important;
}
#view-module.organize-active.pocket-paired-nav-layout .agenda-voice-controls{
 display:flex!important;justify-content:flex-end!important;
}
/* Only journey-origin and structured destination/confirmation choices use petrol,
   like the already approved car/mixed-travel mode choices. Never color Back here. */
#moduleQuickLayer.open .module-quick-sheet.pocket-route-entry #moduleLayerBody button.module-result-card:not(.pocket-nav-return){
 background:linear-gradient(125deg,#1a605f 0%,#10465b 55%,#0d3045 100%)!important;
 color:#f3fbff!important;border-color:#63adb5!important;
 box-shadow:inset 0 2px 0 rgba(235,255,255,.14),0 4px 0 #031723,0 9px 16px rgba(0,0,0,.28)!important;
}

/* Assistant & shared chatbot: the send arrow stays vertically and horizontally
   centered against the text-entry field as it grows. Only layout, not color. */
#view-assistant .chat-form,
#view-module #sharedChatShell .chat-form{
 display:flex!important;align-items:center!important;
}
#view-assistant .chat-form > .send-btn,
#view-module #sharedChatShell .chat-form > .send-btn{
 flex:0 0 46px!important;align-self:center!important;display:grid!important;
 place-items:center!important;justify-content:center!important;align-items:center!important;
 box-sizing:border-box!important;margin:0!important;padding:0!important;
 width:46px!important;min-width:46px!important;height:46px!important;
 line-height:1!important;text-align:center!important;
}
@media(max-width:350px){
 #view-assistant .chat-form > .send-btn,
 #view-module #sharedChatShell .chat-form > .send-btn{
  flex-basis:42px!important;width:42px!important;min-width:42px!important;height:42px!important;
 }
}

/* Only the New conversation button is resized to the already established
   Home button grid cell. Do not change Home: the previous 50%-inside-50%
   rule made both buttons half width. Preserve distinct 3D petrol styling. */
#view-assistant .assistant-actions > #newChatBtn{
 display:inline-flex!important;align-items:center!important;justify-content:center!important;
 width:100%!important;max-width:none!important;min-width:0!important;
 height:100%!important;min-height:58px!important;
 margin:0!important;padding:12px 8px!important;box-sizing:border-box!important;
 border-radius:20px!important;
 font-size:clamp(12px,3.5vw,16px)!important;font-weight:750!important;
 white-space:normal!important;text-align:center!important;line-height:1.18!important;
 background:linear-gradient(145deg,#1b6076,#0e314c)!important;
 border:2px solid #64bfd0!important;color:#fff!important;
 box-shadow:inset 0 2px 0 #ffffff20,0 4px 0 #041925,0 8px 15px #0006!important;
 text-shadow:none!important;
}
#view-assistant .assistant-actions > #newChatBtn:active{
 transform:translateY(2px);
 box-shadow:inset 0 2px 0 #ffffff14,0 2px 0 #041925!important;
}
/* Only the map closing action was still bright red. The map's Back action
   keeps the previously working navigation rule. */
.route-map-header > button.route-header-action:last-child{
 background:linear-gradient(145deg,#913653,#63213c)!important;
 background-color:#782844!important;
 border:1.5px solid #eab3c1!important;
 border-radius:17px!important;
 color:#fff!important;
 box-shadow:inset 0 2px 0 #ffffff20,0 4px 0 #331323,0 8px 15px #0006!important;
 text-shadow:none!important;font-weight:750!important;
}
`;
export const NAV_RETURN_ACCENT_SCRIPT=String.raw`
(function(){
 if(typeof document==='undefined'||!document.body||typeof window==='undefined')return;
 if(window.__pocketReturnAccentInstalled)return;
 window.__pocketReturnAccentInstalled=true;
 // Install final, screen-specific corrections after the older inline styles.
 const compactLayoutStyle=typeof document.createElement==='function'?document.createElement('style'):null;
 if(compactLayoutStyle){
 compactLayoutStyle.id='pocket-layout-science-documents-20261121';
 compactLayoutStyle.textContent="\n/* Shared bounded selection viewport. Never resize or move the fixed bottom dock. */\nmain.page:has(#view-module.learning-science.science-scroll-stage.active){\n flex:0 0 auto!important;box-sizing:border-box!important;\n height:var(--science-selector-height,calc(100dvh - 230px))!important;\n max-height:var(--science-selector-height,calc(100dvh - 230px))!important;\n min-height:0!important;overflow:hidden!important;padding-bottom:0!important;\n}\n#view-module.learning-science.science-scroll-stage.active{\n display:grid!important;grid-template-columns:minmax(0,1fr)!important;\n grid-template-rows:auto auto minmax(0,1fr)!important;\n height:100%!important;max-height:100%!important;min-height:0!important;\n overflow:hidden!important;align-content:stretch!important;\n}\n#view-module.learning-science.science-scroll-stage.active>.module-actions-row{\n grid-column:1!important;grid-row:1!important;\n}\n#view-module.learning-science.science-scroll-stage.active>.module-heading-row{\n grid-column:1!important;grid-row:2!important;\n}\n#view-module.learning-science.science-scroll-stage.active>#moduleContent{\n grid-column:1!important;grid-row:3!important;\n display:flex!important;flex-direction:column!important;\n height:100%!important;max-height:100%!important;min-height:0!important;\n overflow:hidden!important;padding:0!important;\n}\n#view-module.learning-science.science-scroll-stage.active .science-choice-panel{\n position:relative!important;display:flex!important;flex-direction:column!important;\n flex:1 1 0%!important;height:100%!important;max-height:100%!important;\n min-height:0!important;overflow:hidden!important;\n}\n#view-module.learning-science.science-scroll-stage.active .science-choice-list{\n flex:1 1 0%!important;min-height:0!important;height:auto!important;max-height:100%!important;\n overflow-y:auto!important;overflow-x:hidden!important;\n touch-action:pan-y!important;-webkit-overflow-scrolling:touch!important;\n overscroll-behavior:contain!important;box-sizing:border-box!important;\n padding-right:19px!important;padding-bottom:22px!important;scroll-padding-bottom:22px!important;\n scrollbar-width:thin;scrollbar-color:#76acbc #102b3e;\n}\n/* Two chemistry quick links occupy identical cells even with different text lengths. */\n#view-module.learning-science.science-year-stage.active .science-stage-toolbar:has(.science-periodic-entry){\n display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;\n align-items:stretch!important;gap:9px!important;flex-wrap:nowrap!important;\n}\n#view-module.learning-science.science-year-stage.active .science-stage-toolbar:has(.science-periodic-entry)>.science-laws-entry{\n display:flex!important;justify-content:center!important;align-items:center!important;\n box-sizing:border-box!important;flex:none!important;min-width:0!important;\n width:100%!important;height:clamp(52px,7dvh,65px)!important;\n margin:0!important;padding:8px 5px!important;\n font-size:clamp(12px,3.3vw,16px)!important;text-align:center!important;\n line-height:1.2!important;white-space:normal!important;\n}\n/* My Documents: Home/Back in one row, title on a second line, list scrolls inside. */\nmain.page:has(#view-module.my-documents-active.active){\n box-sizing:border-box!important;flex:0 0 auto!important;\n height:var(--pocket-documents-height,calc(100dvh - 230px))!important;\n max-height:var(--pocket-documents-height,calc(100dvh - 230px))!important;\n min-height:0!important;overflow:hidden!important;padding:0!important;\n}\n#view-module.my-documents-active.active{\n display:grid!important;grid-template-columns:minmax(0,1fr)!important;\n grid-template-rows:auto auto minmax(0,1fr)!important;\n height:100%!important;max-height:100%!important;min-height:0!important;\n overflow:hidden!important;align-content:stretch!important;gap:6px!important;\n}\n#view-module.my-documents-active>.module-actions-row.pocket-docs-nav{\n display:flex!important;grid-column:1!important;grid-row:1!important;\n align-items:center!important;justify-content:space-between!important;\n gap:10px!important;width:100%!important;min-width:0!important;\n margin:0!important;padding:0!important;\n}\n#view-module.my-documents-active .module-actions-row.pocket-docs-nav>.module-home-btn,\n#view-module.my-documents-active .module-actions-row.pocket-docs-nav>.pocket-docs-back{\n display:inline-flex!important;align-items:center!important;justify-content:center!important;\n box-sizing:border-box!important;flex:0 1 calc(50% - 5px)!important;\n width:calc(50% - 5px)!important;max-width:none!important;min-width:0!important;\n min-height:52px!important;height:clamp(52px,7dvh,60px)!important;\n margin:0!important;padding:8px!important;white-space:nowrap!important;\n font-size:clamp(13px,3.7vw,17px)!important;\n}\n#view-module.my-documents-active>.module-heading-row{\n grid-column:1!important;grid-row:2!important;min-width:0!important;\n display:flex!important;align-items:center!important;\n}\n#view-module.my-documents-active>#moduleContent{\n grid-column:1!important;grid-row:3!important;display:flex!important;\n flex-direction:column!important;width:100%!important;height:100%!important;\n max-height:100%!important;min-height:0!important;overflow:hidden!important;\n padding:0!important;margin:0!important;\n}\n#view-module.my-documents-active .my-documents-panel{\n position:relative!important;display:flex!important;flex-direction:column!important;\n flex:1 1 0%!important;height:100%!important;max-height:100%!important;\n min-height:0!important;overflow:hidden!important;box-sizing:border-box!important;\n width:100%!important;margin:0!important;padding:9px 11px 12px!important;gap:8px!important;\n border:1px solid #518aa3!important;border-radius:17px!important;background:#102f40!important;\n}\n#view-module.my-documents-active .my-documents-panel>.education-toolbar{display:none!important}\n#view-module.my-documents-active .my-documents-panel>p,\n#view-module.my-documents-active .my-documents-panel>.my-documents-status{\n flex:0 0 auto!important;margin:0!important;min-height:0!important;\n}\n#view-module.my-documents-active .my-documents-batch{\n position:static!important;flex:0 0 auto!important;\n}\n#view-module.my-documents-active .my-documents-list{\n display:flex!important;flex-direction:column!important;\n flex:1 1 0%!important;height:auto!important;max-height:100%!important;min-height:0!important;\n overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain!important;\n touch-action:pan-y!important;-webkit-overflow-scrolling:touch!important;\n box-sizing:border-box!important;padding:4px 20px 16px 1px!important;\n gap:9px!important;scroll-padding-bottom:16px!important;\n scrollbar-width:thin;scrollbar-color:#76acbc #102b3e;\n}\n#view-module.my-documents-active .my-documents-list>.my-documents-row{flex:0 0 auto!important}\n/* Optional manually draggable scrubber; native swipe remains available. */\n.pocket-fast-scroll-track{\n position:absolute!important;right:2px!important;z-index:15!important;width:13px!important;\n border-radius:10px!important;background:rgba(20,65,85,.58)!important;touch-action:none!important;\n cursor:ns-resize!important;user-select:none!important;\n}\n.pocket-fast-scroll-track[hidden]{display:none!important}\n.pocket-fast-scroll-thumb{\n position:absolute!important;left:2px!important;right:2px!important;min-height:34px!important;\n border-radius:10px!important;background:#79bed1!important;border:1px solid #bee3ee!important;\n box-sizing:border-box!important;\n}\n#view-module.learning-science .science-choice-list::-webkit-scrollbar,\n#view-module.my-documents-active .my-documents-list::-webkit-scrollbar{width:8px}\n#view-module.learning-science .science-choice-list::-webkit-scrollbar-thumb,\n#view-module.my-documents-active .my-documents-list::-webkit-scrollbar-thumb{\n border-radius:8px;background:#79bed1\n}\n/* The lesson reader keeps Back wide and uses an icon-only playback control. */\n.education-paged-dialog .science-lesson-read{\n width:46px!important;min-width:46px!important;max-width:46px!important;height:46px!important;\n flex:0 0 46px!important;padding:0!important;margin:0!important;\n display:inline-flex!important;align-items:center!important;justify-content:center!important;\n font-size:0!important;line-height:0!important;border-radius:13px!important;\n}\n.education-paged-dialog .science-lesson-read:before{content:'🔊';font-size:21px!important;line-height:1!important}\n.education-paged-dialog .science-lesson-read[aria-pressed=\"true\"]:before{content:'■';font-size:20px!important}\n";
 document.head?.append(compactLayoutStyle);
 }

 const fold=value=>String(value||'').replace(/^[\s←⟵‹«❮↩]+/u,'').trim()
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ');
 const matches=button=>{
  if(button.closest?.('.bottom-nav')||button.matches?.('[data-nav]'))return false;
  if(button.id==='moduleLayerBack'||button.hasAttribute?.('data-back'))return true;
  const label=fold(button.getAttribute?.('aria-label')||button.textContent||button.title||'');
  if(/^(?:acasa|inapoi|anterior|revenire|home|back|previous|return|retour|zuruck|indietro|volver|atras|wstecz|vissza|geri|назад)(?:$|\s+(?:la|to|catre|spre|aux?|al|in|din)\b)/u.test(label))return true;
  // Icon-only back controls: never infer from a rotation/zoom arrow.
  const glyph=String(button.textContent||'').trim();
  return /^(?:❮|‹|⟵|←)$/.test(glyph)&&
   Boolean(button.closest?.('.module-quick-header,.answer-reader-header,.education-toolbar,.route-choice-screen'));
 };
 const originalStyles=new WeakMap();
 const navSignatures=new WeakMap();
 const navStyle={
  background:'linear-gradient(145deg,#913653,#63213c)',
  'background-color':'#782844',
  border:'1.5px solid #eab3c1',
  color:'#fff',
  'border-radius':'17px',
  'box-shadow':'inset 0 2px 0 #ffffff20,0 4px 0 #331323,0 8px 15px #0006',
  'text-shadow':'none'
 };
 const syncScienceReaderButton=button=>{
  if(!button?.classList?.contains('science-lesson-read'))return;
  const stopped=/(?:oprește|stop|■)/i.test(button.textContent||'');
  const label=stopped?'Oprește citirea / Stop reading':'Citește pagina / Read page';
  if(button.getAttribute?.('aria-label')!==label)button.setAttribute('aria-label',label);
  button.setAttribute?.('aria-pressed',stopped?'true':'false');
  button.title=label;
 };
 const mark=button=>{
  if(!button||button.tagName!=='BUTTON'||!button.classList)return;
  syncScienceReaderButton(button);
  const isReturn=matches(button);
  const title=String(button.textContent||'');
  const signature=(isReturn?'back:':'other:')+title+'|'+String(button.getAttribute?.('aria-label')||'');
  if(navSignatures.get(button)===signature)return; // no repeated re-style per DOM change
  navSignatures.set(button,signature);
  button.classList.toggle('pocket-nav-return',isReturn);
  button.classList.toggle('pocket-nav-text',isReturn&&/[\p{L}]{2,}/u.test(title));
  // This wins over legacy #view-module and .module-home-btn selectors which
  // use !important and were making Home bright red while Back was burgundy.
  // Preserve any original inline values if a button is repurposed.
  if(!button.style?.setProperty)return;
  if(isReturn){
   if(!originalStyles.has(button)){
    const before={};
    for(const key of Object.keys(navStyle))before[key]=[
     button.style.getPropertyValue?.(key)||'',button.style.getPropertyPriority?.(key)||''];
    originalStyles.set(button,before);
   }
   for(const [key,value] of Object.entries(navStyle))button.style.setProperty(key,value,'important');
  }else if(originalStyles.has(button)){
   const original=originalStyles.get(button);
   for(const [key,[value,priority]] of Object.entries(original))
    if(value)button.style.setProperty(key,value,priority);
    else button.style.removeProperty?.(key);
   originalStyles.delete(button);
  }
 };
 const added=element=>{
  if(!element||element.nodeType!==1)return;
  if(element.tagName==='BUTTON')mark(element);
  else mark(element.closest?.('button'));
  element.querySelectorAll?.('button').forEach(mark);
 };

 const routeStage=()=>{
  const sheet=document.querySelector?.('#moduleQuickLayer .module-quick-sheet');
  if(!sheet?.classList)return;
  const title=fold(document.getElementById?.('moduleLayerTitle')?.textContent||'');
  const body=document.getElementById?.('moduleLayerBody');
  const hasCards=Boolean(body?.querySelector?.('button.module-result-card'));
  const recognized=/^(?:alege plecarea|choose departure|destinatie|destination|plecare|departure|confirma calatoria|confirm journey|confirma destinatia|confirm destination|partenza|arrivo|salida|abfahrt|ziel|depart|destination)/u.test(title);
  const hasAddressFields=Boolean(body?.querySelector?.('input[placeholder*="Țară"],input[placeholder*="Country"],input[placeholder*="Localitate"]'));
  sheet.classList.toggle('pocket-route-entry',Boolean(hasCards&&(recognized||hasAddressFields)));
 };

 const adjustEducationNav=()=>{
  const root=document.getElementById?.('view-module');
  if(!root)return;
  const actions=root.querySelector?.('.module-actions-row');
  const host=root.querySelector?.('#moduleContent');
  if(!actions||!host)return;
  const isEducation=root.classList.contains('learning-active');
  const isAgenda=root.classList.contains('organize-active')&&
   Boolean(host.querySelector?.('.agenda-voice-controls'));
  const toolbar=isEducation?host.querySelector?.('.education-toolbar:not(.math-navigation)'):
   isAgenda?host.querySelector?.('.agenda-voice-controls'):null;
  const existing=actions.querySelector?.('button.pocket-inline-back');
  const existingDocBack=actions.querySelector?.('button.pocket-docs-back');
  if(root.classList.contains('my-documents-active')){
   const obsoleteBack=actions.querySelector?.('button.pocket-inline-back');
   if(obsoleteBack)obsoleteBack.remove();
   actions.classList.remove('pocket-inline-nav');
   root.classList.remove('pocket-paired-nav-layout');
   const documentToolbar=host.querySelector?.('.my-documents-panel>.education-toolbar');
   if(documentToolbar){
    const back=documentToolbar.querySelector?.('button');
    if(back){
     if(existingDocBack&&existingDocBack!==back)existingDocBack.remove();
     back.classList.add('pocket-docs-back');
     actions.append(back);mark(back);
    }
    actions.classList.add('pocket-docs-nav');
   }
   return;
  }
  if(existingDocBack){existingDocBack.remove();actions.classList.remove('pocket-docs-nav')}
  // The maths workspace owns Home | centred topic | Back. Never transfer
  // a second Back into this row from a previous grade/chapter screen.
  if(root.classList.contains('learning-math')&&root.classList.contains('math-workspace-header')){
   actions.querySelectorAll('button.pocket-inline-back').forEach(node=>node.remove());
   actions.classList.remove('pocket-inline-nav');
   root.classList.remove('pocket-paired-nav-layout');
   host.querySelector('.education-toolbar')?.classList.remove('pocket-back-extracted');
   return;
  }
  const overall=root.getBoundingClientRect?.().width||root.clientWidth||0;
  const available=overall||actions.getBoundingClientRect?.().width||0;
  const canFit=Boolean(toolbar&&available>=280&&
    !toolbar.classList.contains('math-navigation')&&
    host.contains(toolbar));
  if(!canFit){
   if(existing){
    if(toolbar?.isConnected&&existing.isConnected)toolbar.insertBefore(existing,toolbar.firstChild);
    else existing.remove();
    existing.classList.remove('pocket-inline-back');
   }
   actions.classList.remove('pocket-inline-nav');
   root.classList.remove('pocket-paired-nav-layout');
   toolbar?.classList.remove('pocket-back-extracted');
   return;
  }
  const candidates=Array.from(toolbar.children||[]).filter(button=>
    button.tagName==='BUTTON'&&matches(button));
  const fresh=candidates.length===1?candidates[0]:null;
  if(fresh&&fresh!==existing){
   if(existing)existing.remove(); // remove obsolete Back from the prior stage
   fresh.classList.add('pocket-inline-back','pocket-nav-return');
   actions.append(fresh); // same node, preserves original click handler
   mark(fresh);
  }
  if(fresh||existing?.isConnected){
   actions.classList.add('pocket-inline-nav');
   root.classList.add('pocket-paired-nav-layout');
   toolbar.classList.add('pocket-back-extracted');
  }
 };
 const updateBoundedViewport=()=>{
  const page=document.querySelector?.('main.page'),root=document.getElementById?.('view-module');
  if(!page||!root)return;
  if(!root.classList.contains('my-documents-active')||!root.classList.contains('active')){
   page.style?.removeProperty?.('--pocket-documents-height');return;
  }
  const viewport=window.visualViewport;
  const limit=viewport?viewport.offsetTop+viewport.height:window.innerHeight;
  const top=page.getBoundingClientRect().top;
  const dock=document.querySelector?.('.bottom-nav')?.getBoundingClientRect?.().top;
  const bottom=Number.isFinite(dock)&&dock>top&&dock<limit?dock:limit;
  page.style?.setProperty?.('--pocket-documents-height',Math.max(190,Math.floor(bottom-top-8))+'px');
 };
 const ensureScrollGrip=()=>{
  const root=document.getElementById?.('view-module');
  if(!root?.classList.contains('active'))return;
  const scroller=root.classList.contains('my-documents-active')?
   root.querySelector('.my-documents-list'):
   root.classList.contains('learning-science')&&root.classList.contains('science-scroll-stage')?
   root.querySelector('.science-choice-list'):null;
  if(!scroller)return;
  const owner=scroller.parentElement;
  if(!owner)return;
  const existing=scroller.__pocketFastScroll;
  if(existing){existing.update();return;}
  const track=document.createElement('div');track.className='pocket-fast-scroll-track';
  track.setAttribute('aria-hidden','true');
  const thumb=document.createElement('div');thumb.className='pocket-fast-scroll-thumb';
  track.append(thumb);owner.append(track);
  let dragging=false;
  const update=()=>{
   if(!scroller.isConnected||!owner.isConnected)return;
   const bounds=scroller.getBoundingClientRect(),container=owner.getBoundingClientRect();
   const height=scroller.clientHeight,total=scroller.scrollHeight;
   track.style.top=Math.max(0,bounds.top-container.top)+'px';
   track.style.height=Math.max(0,height)+'px';
   track.hidden=height<55||total<=height+5;
   if(track.hidden)return;
   const thumbHeight=Math.min(height,Math.max(34,Math.round(height*height/total)));
   const travel=Math.max(0,height-thumbHeight);
   thumb.style.height=thumbHeight+'px';
   thumb.style.top=(travel?Math.round(travel*scroller.scrollTop/(total-height)):0)+'px';
  };
  const seek=event=>{
   const bounds=track.getBoundingClientRect();
   const travel=Math.max(1,bounds.height-thumb.offsetHeight);
   const pos=Math.max(0,Math.min(travel,event.clientY-bounds.top-thumb.offsetHeight/2));
   scroller.scrollTop=pos/travel*Math.max(0,scroller.scrollHeight-scroller.clientHeight);
   update();
  };
  track.addEventListener('pointerdown',event=>{
   if(track.hidden)return;
   dragging=true;event.preventDefault();track.setPointerCapture?.(event.pointerId);seek(event);
  });
  track.addEventListener('pointermove',event=>{if(dragging){event.preventDefault();seek(event)}});
  const endDrag=()=>{dragging=false};
  track.addEventListener('pointerup',endDrag);
  track.addEventListener('pointercancel',endDrag);
  scroller.addEventListener('scroll',update,{passive:true});
  if(typeof ResizeObserver==='function'){
   const resize=new ResizeObserver(update);resize.observe(scroller);resize.observe(owner);
  }
  scroller.__pocketFastScroll={update,track};
  window.requestAnimationFrame?.(update);
 };
 const refresh=()=>{routeStage();adjustEducationNav();updateBoundedViewport();ensureScrollGrip()};
 let refreshQueued=false;
 const scheduleRefresh=()=>{
  if(refreshQueued)return;
  if(typeof window.requestAnimationFrame!=='function'){refresh();return}
  refreshQueued=true;
  window.requestAnimationFrame(()=>{refreshQueued=false;refresh()});
 };
 added(document.body);
 refresh();
 if(typeof MutationObserver!=='function')return;
 const relevantChange=change=>{
  const t=change.target?.nodeType===1?change.target:change.target?.parentElement;
  // Result cards and chat messages are unrelated to navigation geometry. They
  // previously caused a full layout scan on every append, even across Maps.
  if(t?.closest?.('.module-place-results-list,.module-places-results,.chat-messages,.lit-reader-overlay,.lit-reader-scroll'))return false;
  if(t?.id==='moduleLayerTitle'||t?.id==='moduleLayerBody'||t?.id==='moduleContent')return true;
  if(t?.classList?.contains('my-documents-list')||t?.classList?.contains('science-choice-list'))return true;
  if(t?.classList?.contains('education-toolbar')||t?.classList?.contains('agenda-voice-controls')||
     t?.classList?.contains('module-actions-row'))return true;
  return Array.from(change.addedNodes||[]).some(n=>n.nodeType===1&&(
   n.matches?.('.education-toolbar,.agenda-voice-controls,.module-actions-row,.module-result-card')||
   n.querySelector?.('.education-toolbar,.agenda-voice-controls,.module-actions-row,.module-result-card')));
 };
 const observer=new MutationObserver(changes=>{
  let needsLayout=false;
  for(const change of changes){
   if(change.type==='attributes'){mark(change.target);continue}
   const target=change.target?.nodeType===1?change.target:change.target?.parentElement;
   if(target?.tagName==='BUTTON')mark(target);
   else if(target?.closest)mark(target.closest('button'));
   for(const node of change.addedNodes||[])added(node);
   if(!needsLayout&&relevantChange(change))needsLayout=true;
  }
  if(needsLayout)scheduleRefresh();
 });
 observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-label','data-back']});
 window.addEventListener?.('resize',scheduleRefresh,{passive:true});
 window.visualViewport?.addEventListener?.('resize',scheduleRefresh,{passive:true});
})();
`;
