import {EDUCATION_LESSON_WORKSPACE_SCRIPT} from './education_lesson_workspace.mjs';
// Browser-only opener for national-pack activities (History, Geography,
// Computing). Serialized with an explicit `var` name: wrangler/esbuild renames
// module-level declarations that are also used as browser globals elsewhere
// (e.g. eduNationalShowMaterial -> eduNationalShowMaterial2), which broke the
// Android/production page while local Node tests passed.
// Opens a national-pack activity. Primary: the paged Education dialog used by
// Sciences/Mathematics on Android; then the Literature overlay; if neither is
// really visible on the device, the material is shown under the buttons.
function eduNationalShowMaterial(title,text,out,language){
 const body=String(text||'').trim();if(!body)return false;
 const inline=(note)=>{
  out.replaceChildren();
  if(note){const p=document.createElement('p');p.className='edu-national-note';p.textContent=note;out.append(p)}
  const box=document.createElement('div');box.className='edu-national-inline';
  try{if(typeof renderStudyBlocks==='function')renderStudyBlocks(box,body);else throw Error('no_renderer')}
  catch{box.style.whiteSpace='pre-line';box.textContent=body}
  out.append(box);
  try{out.scrollIntoView?.({behavior:'smooth',block:'start'})}catch{}
 };
 const visible=el=>{
  try{
   if(!el||!el.isConnected)return false;
   const r=el.getBoundingClientRect?.();if(!r||r.width<40||r.height<40)return false;
   const x=Math.round((typeof window!=='undefined'?window.innerWidth:360)/2),y=Math.round((typeof window!=='undefined'?window.innerHeight:640)/2);
   const hit=document.elementFromPoint?.(x,y);
   return !hit||el===hit||el.contains(hit);
  }catch{return true}
 };
 out.replaceChildren();
 let opened=null;
 try{
  if(typeof educationOpenPagedLesson==='function'){
   // The dialog shows the title in its header; do not repeat it as page text.
   const first=body.split(String.fromCharCode(10))[0];
   const paged=first.replace(/^#\s+/,'').trim()===String(title||'').trim()?body.slice(first.length).trim():body;
   educationOpenPagedLesson(title,paged||body,{sourceLanguage:language||'ro'});
   const d=document.getElementById('educationPagedLessonDialog');
   if(d&&(d.open||d.hasAttribute('open')))opened=d;
  }
 }catch{opened=null}
 if(!opened){
  try{if(typeof litShowMaterialReader==='function'&&litShowMaterialReader(title,body)===true)opened=document.querySelector('.lit-reader-overlay')}catch{opened=null}
 }
 if(!opened){inline('');return true}
 // Some WebViews attach a dialog that is never painted: keep the lesson reachable.
 setTimeout(()=>{if(opened.isConnected&&!visible(opened)){try{opened.close?.()}catch{}try{opened.remove()}catch{}inline('')}},450);
 return true;
}

export const EDUCATION_NATIONAL_READER_SCRIPT=EDUCATION_LESSON_WORKSPACE_SCRIPT+'\nvar eduNationalShowMaterial='+eduNationalShowMaterial.toString()+';';
