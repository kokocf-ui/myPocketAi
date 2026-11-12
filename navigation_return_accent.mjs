// Maroon accent ONLY for controls that navigate Home / Back (including icon buttons).
// Blue/petrol module cards, route choices, send/confirm buttons, and bottom dock stay unchanged.
export const NAV_RETURN_ACCENT_CSS=String.raw`
button.pocket-nav-return,
.view button.pocket-nav-return,
.lit-material-reader button.pocket-nav-return,
.module-quick-sheet button.pocket-nav-return{
 background:linear-gradient(145deg,#913653,#63213c)!important;
 border-color:#eab3c1!important;
 color:#fff!important;
 box-shadow:0 3px 13px #42162b55!important;
}
button.pocket-nav-return:focus-visible{outline:3px solid #ffd6e0!important;outline-offset:2px!important}
`;
export const NAV_RETURN_ACCENT_SCRIPT=String.raw`
(function(){
 if(typeof document==='undefined'||!document.body||typeof window==='undefined')return;
 if(window.__pocketReturnAccentInstalled)return;
 window.__pocketReturnAccentInstalled=true;
 const fold=value=>String(value||'').replace(/^[\\s←⟵‹«❮]+/u,'').trim().normalize('NFD')
  .replace(/[\\u0300-\\u036f]/g,'').toLowerCase().replace(/\\s+/g,' ');
 const matches=button=>{
  if(button.closest?.('.bottom-nav')||button.matches?.('[data-nav]'))return false;
  const text=fold(button.getAttribute?.('aria-label')||button.textContent||'');
  return /^(?:acasa|inapoi|home|back)(?:$|\\s+(?:la|to)\\b)/u.test(text);
 };
 const mark=button=>{
  if(!button||button.tagName!=='BUTTON'||!button.classList)return;
  // class toggling never changes any button function or destination.
  button.classList.toggle('pocket-nav-return',matches(button));
 };
 const added=element=>{
  if(!element||element.nodeType!==1)return;
  if(element.tagName==='BUTTON')mark(element);
  else mark(element.closest?.('button'));
  element.querySelectorAll?.('button').forEach(mark);
 };
 added(document.body);
 if(typeof MutationObserver!=='function')return;
 const observer=new MutationObserver(changes=>{
  for(const change of changes){
   if(change.type==='attributes'){mark(change.target);continue}
   const target=change.target?.nodeType===1?change.target:change.target?.parentElement;
   if(target?.tagName==='BUTTON')mark(target);
   else if(target?.closest)mark(target.closest('button'));
   for(const node of change.addedNodes||[])added(node);
  }
 });
 observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['aria-label']});
})();
`;
