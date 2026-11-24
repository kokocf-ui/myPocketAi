// Localises visible authored Education content and the paged lesson reader on demand
// across all 44 supported app languages while keeping national curriculum selection
// (educationCountrySelection.code) strictly independent from state.language.
export const MATH_READER_LOCALE_UI_SCRIPT=String.raw`
(function(){
 if(typeof document==='undefined'||typeof MutationObserver==='undefined')return;
 const seenLang=new WeakMap();
 let queued=false;
 const EDU_ACTIVE_CLASSES='.learning-math,.learning-science,.learning-hg,.learning-literature,.learning-computing,.learning-exams,.learning-practical,.learning-active';
 function inMathReader(){
  try{
   return typeof state!=='undefined' &&
    state.language && state.language!=='ro' &&
    !!document.querySelector('#view-module'+EDU_ACTIVE_CLASSES.split(',').join(',#view-module')) &&
    typeof eduTranslateMaterial==='function';
  }catch{return false}
 }
 function formulaOnly(text){
  const str=String(text||'').trim();
  // Do not put mathematical expressions through generative translation.
  return /^[0-9\s+\-=*×÷\/^(),.:π√∫∑≤≥<>%°²³{}[\]xya-z_]+$/i.test(str) &&
   /[=+×÷√∫∑≤≥^]/.test(str);
 }
 function restoreRomanianNodes(root){
  if(!root||!root.isConnected)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){
   const n=walker.currentNode;
   if(typeof n.__pocketOrigText==='string'&&seenLang.get(n)&&seenLang.get(n)!=='ro'){
    n.nodeValue=n.__pocketOrigText;
    seenLang.set(n,'ro');
   }
  }
 }
 function eligible(node,root,isDialog){
  const parent=node?.parentElement;
  if(!parent||!root.contains(parent))return false;
  const lang=state?.language||'ro';
  if(seenLang.get(node)===lang)return false;
  const baseText=typeof node.__pocketOrigText==='string'?node.__pocketOrigText:String(node?.nodeValue||'');
  const text=baseText.trim();
  if(text.length<4||text.length>4200||formulaOnly(text))return false;
  if(/^[0-9\s.,:;+\-*/=()[\]%°•·←→↑↓✓✗○🔊■📷🖼️🎙️📄🎓📚📝🛠️✅🔗]+$/.test(text))return false;
  if(isDialog){
   if(parent.closest('[data-edu-translated="'+lang+'"]'))return false;
   if(parent.closest('button,a,input,textarea,select,script,style,svg,pre,code,[role="button"],[contenteditable="true"],[aria-hidden="true"]'))return false;
   if(parent.closest('.math-practice-entry,.education-theory-head button'))return false;
  }else{
   if(parent.closest('input,textarea,select,option,script,style,svg,pre,code,[contenteditable="true"],[aria-hidden="true"]'))return false;
   if(parent.closest('.education-toolbar,.lit-toolbar,.module-actions-row,.edu-country-panel,.edu-grade-panel,.math-practice-entry'))return false;
   // Do not translate pure action buttons that have no curriculum title text
   const btn=parent.closest('button,[role="button"]');
   if(btn&&!btn.matches('.science-inline-theory-item,.hg-topic-btn,.hg-chapter-card,.math-lesson-btn,.lit-card,.computing-topic-card,.computing-chapter-btn,.practical-card,.exam-topic-btn')&&
    text.length<22&&/^[←→＋✓✗○🔊■📷🖼️🎙️📄]/.test(text))return false;
  }
  if(!parent.getClientRects().length)return false;
  const style=getComputedStyle(parent);
  if(style.display==='none'||style.visibility==='hidden')return false;
  return true;
 }
 async function translateGroup(nodes,root,key,language){
  const original={};
  nodes.forEach((n,i)=>{
   if(typeof n.__pocketOrigText!=='string')n.__pocketOrigText=String(n.nodeValue||'');
   let clean=n.__pocketOrigText.trim();
   if(n.parentElement?.closest?.('.science-inline-theory-item')){
    clean=clean.replace(/\s*·\s*(?:RO source|EN reference)\s*$/i,'').trim();
   }
   original['t'+i]=clean;
  });
  const translated=await eduTranslateMaterial(original,key,'mixed');
  if(!translated||!root.isConnected||state.language!==language||!inMathReader())return;
  nodes.forEach((n,i)=>{
   if(!n.isConnected||!root.contains(n))return;
   const text=translated['t'+i];
   if(typeof text!=='string'||!text.trim()){seenLang.delete(n);return;}
   const source=String(n.__pocketOrigText||n.nodeValue||'');
   const start=source.match(/^\s*/)?.[0]||'',end=source.match(/\s*$/)?.[0]||'';
   n.nodeValue=start+text.trim()+end;
  });
 }
 function activeEduIdentity(){
  const root=document.getElementById('view-module');
  const cls=String(root?.className||'');
  const mod=cls.match(/learning-(math|science|hg|literature|computing|exams|practical)/)?.[1]||'edu';
  const country=String(typeof educationCountrySelection!=='undefined'?educationCountrySelection?.code||'':'');
  let grade='',topic='';
  try{
   if(mod==='math'&&typeof mathJourney!=='undefined'){grade=mathJourney.grade||'';topic=mathJourney.topic||'';}
   else if(mod==='science'&&typeof scienceJourney!=='undefined'){grade=scienceJourney.grade||'';topic=(scienceJourney.subject||'')+'-'+(scienceJourney.topic||'');}
   else if(mod==='hg'&&typeof hgJourney!=='undefined'){grade=hgJourney.grade||'';topic=(hgJourney.subject||'')+'-'+(hgJourney.topic||'');}
   else if(mod==='literature'&&typeof litJourney!=='undefined'){grade=litJourney.grade||'';topic=litJourney.topic||litJourney.branch||'';}
   else if(mod==='computing'&&typeof computingJourney!=='undefined'){grade=computingJourney.grade||'';topic=computingJourney.topic||computingJourney.path||'';}
   else if(mod==='exams'&&typeof examJourney!=='undefined'){grade=examJourney.grade||'';topic=(examJourney.subject||'')+'-'+(examJourney.topic||'');}
   else if(mod==='practical'&&typeof practicalJourney!=='undefined'){topic=(practicalJourney.course||'')+'-'+(practicalJourney.chapter||'');}
  }catch{}
  return [mod,country,grade,topic].map(x=>String(x||'')).join(':');
 }
 function scanRoot(root,isDialog){
  if(!root||!root.isConnected||!root.getClientRects().length)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];
  const cap=isDialog?90:120;
  while(walker.nextNode()&&nodes.length<cap){
   const node=walker.currentNode;
   if(eligible(node,root,isDialog))nodes.push(node);
  }
  if(!nodes.length)return;
  const lang=state.language;
  nodes.forEach(node=>seenLang.set(node,lang));
  const ident=activeEduIdentity();
  let group=[],total=0,n=0;
  const issue=()=>{
   if(!group.length)return;
   const selected=group,groupKey=ident+(isDialog?':reader:':':view:')+lang+':'+(n++);
   group=[];total=0;
   translateGroup(selected,root,groupKey,lang).catch(()=>{selected.forEach(nd=>seenLang.delete(nd))});
  };
  for(const node of nodes){
   const length=(node.nodeValue||'').length;
   if(group.length>=12||total+length>3400)issue();
   group.push(node);total+=length;
  }
  issue();
 }
 function scan(){
  queued=false;
  const dialog=document.getElementById('educationPagedLessonDialog');
  const modContent=document.getElementById('moduleContent');
  if(typeof state!=='undefined'&&state.language==='ro'){
   if(dialog)restoreRomanianNodes(dialog);
   if(modContent)restoreRomanianNodes(modContent);
   return;
  }
  if(!inMathReader())return;
  if(dialog)scanRoot(dialog,true);
  if(modContent)scanRoot(modContent,false);
 }
 function schedule(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(scan);
 }
 if(typeof window!=='undefined')window.pocketScheduleEducationLocaleScan=schedule;
 function init(){
  if(!document.body)return;
  new MutationObserver(records=>{
   if(!inMathReader())return;
   if(!document.getElementById('educationPagedLessonDialog')&&!document.getElementById('moduleContent'))return;
   if(!records.some(r=>r.type==='childList'||r.attributeName==='style'||r.attributeName==='class'))return;
   schedule();
  }).observe(document.body,{subtree:true,childList:true,attributes:true,
   attributeFilter:['style','class']});
  schedule();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
})();
`;
