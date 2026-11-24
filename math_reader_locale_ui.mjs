// Universal Education & Lesson Reader DOM Localization (all 44 languages).
// Preserves formulas, numbers, symbols, and layout while localizing any remaining
// Romanian or mixed-language prose across Education views & Paged Lesson Readers.
export const MATH_READER_LOCALE_UI_SCRIPT=`(function(){
 let translating=false,queued=false;
 const EDUCATION_VIEW_CLASSES=['learning-home','learning-math','learning-science','learning-foreign','learning-hg','learning-literature','learning-computing','learning-admissions'];
 function inMathReader(){
  const host=document.getElementById('view-module');
  const dialog=document.getElementById('educationPagedLessonDialog');
  const hasEduHost=Boolean(host&&EDUCATION_VIEW_CLASSES.some(c=>host.classList.contains(c)));
  const hasOpenDialog=Boolean(dialog&&(dialog.open||dialog.offsetParent!==null||dialog.style.display==='block'||dialog.hasAttribute('open')));
  return hasEduHost||hasOpenDialog;
 }
 function formulaOnly(text){
  const s=String(text||'').trim();
  if(!s)return true;
  if(s.length<=2&&!/[A-Za-zĂÂÎȘȚăâîșț]/.test(s))return true;
  if(!/[A-Za-zĂÂÎȘȚăâîșț]{3,}/.test(s))return true;
  if(/^[0-9xXyYzZaAbBcCmMnNkKpPqQrRsStTuUvVwW+\\-*/=().,:^√π≤≥≠≈%°\\s]+$/.test(s)&&!/[A-Za-zĂÂÎȘȚăâîșț]{4,}/.test(s))return true;
  return false;
 }
 function syncStaticTranslate(raw){
  if(typeof eduUiText!=='function')return null;
  const trimmed=String(raw||'').trim();
  if(!trimmed)return null;
  const direct=eduUiText(trimmed);
  if(direct&&direct!==trimmed)return direct;
  return null;
 }
 async function translateVisibleReader(){
  if(typeof state==='undefined'||!state||!state.language||state.language==='ro')return;
  if(typeof eduTranslateMaterial!=='function'&&typeof eduUiText!=='function')return;
  if(!inMathReader())return;
  if(translating){queued=true;return}
  const lang=String(state.language);
  const roots=[];
  const dialog=document.getElementById('educationPagedLessonDialog');
  const host=document.getElementById('view-module');
  if(dialog)roots.push({el:dialog,sel:'h1,h2,h3,h4,p,li,summary,blockquote,figcaption,td,th'});
  if(host&&EDUCATION_VIEW_CLASSES.some(c=>host.classList.contains(c))){
   roots.push({el:host,sel:'h1,h2,h3,h4,p,li,summary,blockquote,figcaption,td,th,.education-card strong,.education-card span,.education-toolbar button,.math-stage-back'});
  }
  const seen=new Set();
  const rawNodes=[];
  for(const r of roots){
   for(const el of r.el.querySelectorAll(r.sel)){
    if(seen.has(el))continue;
    seen.add(el);
    if(el.closest('[data-edu-no-translate],[data-edu-translated],code,pre,svg,math,.katex,.math-formula'))continue;
    if(el.closest('[data-edu-localized]')===dialog&&dialog?.dataset?.eduLocalized===lang)continue;
    if(el.dataset?.eduTranslated===lang)continue;
    if(el.querySelector('button,input,select,textarea,svg,canvas'))continue;
    if(el.children.length>0&&el.matches('p,li,td,th,div'))continue;
    const text=(el.__pocketOrigText||el.dataset?.eduSourceText||el.textContent||'').trim();
    if(!text||text.length>900||formulaOnly(text))continue;
    const staticHit=syncStaticTranslate(text);
    if(staticHit){
     if(!el.__pocketOrigText)el.__pocketOrigText=text;
     el.textContent=staticHit;
     el.dataset.eduTranslated=lang;
     continue;
    }
    if(typeof eduDetectProseLang==='function'&&eduDetectProseLang(text)===lang){
     el.dataset.eduTranslated=lang;
     continue;
    }
    rawNodes.push(el);
   }
  }
  if(!rawNodes.length||typeof eduTranslateMaterial!=='function')return;
  translating=true;
  try{
   const BATCH_SIZE=12;
   for(let start=0;start<rawNodes.length;start+=BATCH_SIZE){
    if(String(state.language)!==lang)break;
    const slice=rawNodes.slice(start,start+BATCH_SIZE);
    const original={};
    slice.forEach((el,idx)=>{
     const src=(el.__pocketOrigText||el.dataset.eduSourceText||el.textContent||'').trim();
     el.__pocketOrigText=src;
     el.dataset.eduSourceText=src;
     original['n'+idx]=src;
    });
    const key='edu-dom-v3-'+lang+'-'+(typeof mathJourney!=='undefined'&&mathJourney?.grade||'g')+'-'+(typeof mathJourney!=='undefined'&&mathJourney?.topic||'t')+'-'+start+'-'+slice.map(x=>(x.dataset.eduSourceText||'').slice(0,18)).join('|').slice(0,110);
    if(typeof eduReadCachedTranslation==='function'){
     const cached=eduReadCachedTranslation(key,original);
     if(cached){
      slice.forEach((el,idx)=>{
       const next=cached['n'+idx];
       if(typeof next==='string'&&next.trim()){
        el.textContent=next;
        el.dataset.eduTranslated=lang;
       }
      });
      continue;
     }
    }
    const translated=await eduTranslateMaterial(original,key,'mixed');
    if(!translated||String(state.language)!==lang)continue;
    slice.forEach((el,idx)=>{
     const next=translated['n'+idx];
     if(typeof next==='string'&&next.trim()){
      el.textContent=next;
      el.dataset.eduTranslated=lang;
     }
    });
   }
  }finally{
   translating=false;
   if(queued){queued=false;setTimeout(translateVisibleReader,60)}
  }
 }
 if(typeof window!=='undefined')window.pocketScheduleEducationLocaleScan=()=>setTimeout(translateVisibleReader,30);
 const observer=typeof MutationObserver!=='undefined'?new MutationObserver(()=>{if(typeof state!=='undefined'&&state?.language&&state.language!=='ro'&&inMathReader())setTimeout(translateVisibleReader,40)}):null;
 if(observer&&typeof document!=='undefined'&&document.body)observer.observe(document.body,{childList:true,subtree:true});
 else if(observer&&typeof addEventListener==='function')addEventListener('DOMContentLoaded',()=>observer.observe(document.body,{childList:true,subtree:true}));
 if(typeof addEventListener==='function'){
  addEventListener('click',()=>setTimeout(translateVisibleReader,90),true);
  addEventListener('change',()=>setTimeout(translateVisibleReader,90),true);
 }
})();`;
