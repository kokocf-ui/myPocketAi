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
`;
export const NAV_RETURN_ACCENT_SCRIPT=String.raw`
(function(){
 if(typeof document==='undefined'||!document.body||typeof window==='undefined')return;
 if(window.__pocketReturnAccentInstalled)return;
 window.__pocketReturnAccentInstalled=true;

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
 const mark=button=>{
  if(!button||button.tagName!=='BUTTON'||!button.classList)return;
  const isReturn=matches(button);
  button.classList.toggle('pocket-nav-return',isReturn);
  button.classList.toggle('pocket-nav-text',isReturn&&/[\p{L}]{2,}/u.test(String(button.textContent||'')));
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
  if(!actions)return;
  const existing=actions.querySelector?.('button.pocket-inline-back');
  const inEducation=root.classList.contains('learning-active');
  const toolbar=inEducation?root.querySelector?.('#moduleContent .education-toolbar:not(.math-navigation)'):null;
  const available=actions.getBoundingClientRect?.().width||actions.clientWidth||0;
  const canFit=Boolean(toolbar&&available>=270&&
   !toolbar.classList.contains('math-navigation')&&
   root.querySelector?.('#moduleContent')?.contains(toolbar));
  if(!canFit){
   if(existing){
    if(toolbar?.isConnected&&existing.isConnected)toolbar.insertBefore(existing,toolbar.firstChild);
    else existing.remove();
    existing.classList.remove('pocket-inline-back');
   }
   actions.classList.remove('pocket-inline-nav');
   toolbar?.classList.remove('pocket-back-extracted');
   return;
  }
  const candidates=Array.from(toolbar.children||[]).filter(button=>
   button.tagName==='BUTTON'&&matches(button));
  const fresh=candidates.length===1?candidates[0]:null;
  if(fresh&&fresh!==existing){
   if(existing)existing.remove(); // removes only obsolete previous-stage Back
   fresh.classList.add('pocket-inline-back','pocket-nav-return');
   actions.append(fresh); // original onClick retained
  }
  if(fresh||existing?.isConnected){
   actions.classList.add('pocket-inline-nav');
   toolbar.classList.add('pocket-back-extracted');
  }
 };
 const refresh=()=>{routeStage();adjustEducationNav()};
 added(document.body);
 refresh();
 if(typeof MutationObserver!=='function')return;
 const observer=new MutationObserver(changes=>{
  for(const change of changes){
   if(change.type==='attributes'){mark(change.target);continue}
   const target=change.target?.nodeType===1?change.target:change.target?.parentElement;
   if(target?.tagName==='BUTTON')mark(target);
   else if(target?.closest)mark(target.closest('button'));
   for(const node of change.addedNodes||[])added(node);
  }
  refresh();
 });
 observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-label']});
 window.addEventListener?.('resize',refresh,{passive:true});
})();
`;
