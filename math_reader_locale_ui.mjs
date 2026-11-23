// Localises the *visible authored mathematics lesson* on demand.
// Country selects the national curriculum. state.language ONLY chooses the
// display language: changing from Italian to English must not switch systems.
// Reuses eduTranslateMaterial's guarded/cacheable JSON translation transport.
export const MATH_READER_LOCALE_UI_SCRIPT=String.raw`
(function(){
 if(typeof document==='undefined'||typeof MutationObserver==='undefined')return;
 const seen=new WeakSet();
 let queued=false;
 function inMathReader(){
  try{
   return typeof state!=='undefined' &&
    state.language && state.language!=='ro' &&
    document.querySelector('#view-module.learning-math') &&
    typeof mathJourney!=='undefined' &&
    !!mathJourney.grade && !!mathJourney.topic &&
    typeof eduTranslateMaterial==='function';
  }catch{return false}
 }
 function formulaOnly(text){
  const str=String(text||'').trim();
  // Do not put mathematical expressions through any generative translation.
  // A variable, operator, inequality or mathematical symbol must remain exact.
  return /^[0-9\s+\-=*×÷\/^(),.:π√∫∑≤≥<>%°²³{}[\]xya-z_]+$/i.test(str) &&
   /[=+×÷√∫∑≤≥^]/.test(str);
 }
 function eligible(node,root){
  const parent=node?.parentElement,text=String(node?.nodeValue||'').trim();
  if(!parent||!root.contains(parent)||seen.has(node)||text.length<5||
   text.length>650||formulaOnly(text))return false;
  if(parent.closest('button,a,input,textarea,select,script,style,svg,[role="button"],[contenteditable="true"],[aria-hidden="true"]'))return false;
  if(parent.closest('.math-practice-entry,.education-theory-head button'))return false;
  if(!parent.getClientRects().length)return false;
  const style=getComputedStyle(parent);
  if(style.display==='none'||style.visibility==='hidden')return false;
  return true;
 }
 async function translateGroup(nodes,root,key,language){
  const original={};
  nodes.forEach((n,i)=>{original['t'+i]=String(n.nodeValue||'').trim()});
  const translated=await eduTranslateMaterial(original,key,'mixed');
  if(!translated||!root.isConnected||state.language!==language||
   !document.querySelector('#view-module.learning-math'))return;
  nodes.forEach((n,i)=>{
   if(!n.isConnected||!root.contains(n)||
    String(n.nodeValue||'').trim()!==original['t'+i])return;
   const text=translated['t'+i];
   if(typeof text!=='string'||!text.trim())return;
   const source=String(n.nodeValue||'');
   const start=source.match(/^\s*/)?.[0]||'',end=source.match(/\s*$/)?.[0]||'';
   n.nodeValue=start+text.trim()+end;
  });
 }
 function scan(){
  queued=false;
  if(!inMathReader())return;
  const root=document.getElementById('educationPagedLessonDialog');
  if(!root||!root.isConnected||!root.getClientRects().length)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];
  while(walker.nextNode()&&nodes.length<60){
   const node=walker.currentNode;
   if(eligible(node,root))nodes.push(node);
  }
  if(!nodes.length)return;
  nodes.forEach(node=>seen.add(node));
  const lang=state.language,country=String(educationCountrySelection?.code||'');
  const grade=String(mathJourney.grade||''),topic=String(mathJourney.topic||'');
  // Keep payloads comfortably below eduTranslateMaterial's 7k JSON cap.
  let group=[],total=0,n=0;
  const issue=()=>{
   if(!group.length)return;
   const selected=group,groupKey='math:'+country+':'+grade+':'+topic+
    ':reader:'+lang+':'+(n++);
   group=[];total=0;
   translateGroup(selected,root,groupKey,lang).catch(()=>{});
  };
  for(const node of nodes){
   const length=(node.nodeValue||'').length;
   if(group.length>=12||total+length>3100)issue();
   group.push(node);total+=length;
  }
  issue();
 }
 function schedule(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(scan);
 }
 function init(){
  if(!document.body)return;
  new MutationObserver(records=>{
   if(!inMathReader()||!document.getElementById('educationPagedLessonDialog'))return;
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
