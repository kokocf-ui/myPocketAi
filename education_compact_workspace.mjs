// Presentation only: keep the existing drafts, subject context and tutor API.
// Physics/Chemistry/Astronomy retain their existing dedicated presentation.
export function educationUseCompactWorkspace(subject){
 return !['physics','chemistry','astronomy'].includes(String(subject||''));
}
export function educationCompactWorkspace({box,prompt,answer,select,actions,status,label,row,tasks}){
 box.classList.add('edu-compact-workspace');
 box.querySelector('h3')?.remove();box.querySelector(':scope > p')?.remove();
 const make=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n};
 const context=make('div');context.className='edu-compact-context';
 const topic=make('p',row.title);topic.className='edu-compact-topic';context.append(topic);
 select.className='edu-compact-task';select.hidden=tasks.length===1;
 context.append(select);box.prepend(context);
 const fields=make('div');fields.className='edu-compact-fields';
 for(const [field,title,key] of [[prompt,label('Enunț','Question'),'prompt'],[answer,label('Rezolvarea mea','My solution'),'answer']]){
  const section=make('label');section.className='edu-compact-field';section.dataset.field=key;
  const name=make('span',title);name.className='edu-compact-field-name';section.append(name,field);fields.append(section);
  // Soft wrapping changes presentation only: never insert line breaks into
  // a formula/question or shorten the submitted text to fit the viewport.
  field.wrap='soft';
  field.addEventListener('input',()=>requestAnimationFrame(()=>{
   if(!field.isConnected)return;
   field.scrollLeft=0;
   if(field.selectionStart===field.value.length&&field.selectionEnd===field.value.length)field.scrollTop=field.scrollHeight;
  }));
  field.placeholder=key==='prompt'?label('Scrie cerința sau alege un exercițiu…','Write a question or choose an exercise…'):label('Scrie aici rezolvarea și pașii urmați…','Write your answer and working here…');
 }
 // Tool buttons must not live inside a label (which would focus the keyboard).
 const tools=make('div');tools.className='edu-compact-tools';
 const sync=field=>{
  for(const current of [prompt,answer]){
   current.parentElement.classList.toggle('edu-compact-field-active',current===field);
   const bar=current.educationCompactTools;
   if(!bar)continue;
   bar.classList.toggle('edu-compact-tools-active',current===field);
   if(current!==field){const expanded=bar.querySelector('[aria-expanded="true"]');if(expanded)expanded.click()}
  }
  tools.setAttribute('aria-label',field===prompt?label('Instrumente pentru enunț','Question tools'):label('Instrumente pentru rezolvare','Solution tools'));
 };
 for(const field of [prompt,answer]){
  if(typeof globalThis.educationAttachInputTools==='function')globalThis.educationAttachInputTools(field);
  const bar=field.nextElementSibling;
  if(bar?.classList.contains('edu-input-tools')){field.educationCompactTools=bar;tools.append(bar)}
  field.addEventListener('focus',()=>sync(field));
 }
 box.insertBefore(fields,actions);box.insertBefore(tools,actions);
 const primary=make('div');primary.className='edu-compact-primary';
 const extra=make('div');extra.className='edu-compact-extra';extra.hidden=true;
 extra.setAttribute('aria-label',label('Alte opțiuni','More options'));
 const buttons=[...actions.querySelectorAll('button')];
 for(const [i,button] of buttons.entries()){
  button.setAttribute('aria-label',button.textContent);button.title=button.textContent;
  if(i<3){button.textContent=[label('✓ Verifică','✓ Check'),label('🧩 Rezolvă','🧩 Solve'),label('🎓 Metoda','🎓 Method')][i];primary.append(button)}
  else extra.append(button);
 }
 actions.className='edu-compact-actions';actions.replaceChildren(primary);
 const more=make('button',label('Alte opțiuni','More options'));more.type='button';more.className='secondary-btn edu-compact-more';more.setAttribute('aria-expanded','false');
 const closeExtra=()=>{extra.hidden=true;more.setAttribute('aria-expanded','false')};
 more.onclick=()=>{extra.hidden=!extra.hidden;more.setAttribute('aria-expanded',String(!extra.hidden))};
 extra.addEventListener('click',event=>{if(event.target.closest('button'))closeExtra()});
 actions.append(more,extra);status.classList.add('edu-compact-status');
 box.eduCompactRefresh=()=>{
  prompt.educationCompactTools?.educationRefresh?.();answer.educationCompactTools?.educationRefresh?.();
  sync(prompt.readOnly?answer:prompt);
 };
 box.eduCompactRefresh();
}
export const EDUCATION_COMPACT_WORKSPACE_STYLE=String.raw`
/* Only the corrected shared work area; science reference screens are untouched. */
dialog.edu-workspace-dialog.edu-compact-dialog[open]{padding:10px!important;gap:6px!important;max-width:calc(100vw - 16px)!important;height:calc(100dvh - 20px)!important;max-height:calc(100dvh - 20px)!important}
.edu-compact-dialog>.education-theory-head{min-height:44px!important;padding:0 0 6px!important;align-items:center!important}
.edu-compact-dialog>.education-theory-head>h2{font-size:18px!important;line-height:1.2!important}
.edu-compact-dialog>.education-theory-head>button{min-height:40px!important;padding:7px 12px!important;font-size:15px!important}
.edu-compact-dialog>.edu-workspace-body{display:flex!important;flex-direction:column!important;gap:6px!important;padding:0!important;overflow:hidden!important}
.edu-compact-dialog .edu-compact-workspace{position:relative;display:flex!important;flex-direction:column!important;flex:1 1 0!important;min-height:0!important;max-height:100%!important;overflow:hidden!important;gap:6px!important;border:0!important;padding:0!important;margin:0!important}
.edu-compact-context{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:6px;flex:none!important;min-width:0}
.edu-compact-context>.edu-compact-topic{grid-column:1/-1;margin:0!important;font-size:14px!important;line-height:1.25!important;overflow-wrap:anywhere}
.edu-compact-dialog .edu-compact-context>select{width:100%!important;min-width:0!important;min-height:40px!important;height:40px!important;padding:6px!important;font-size:14px!important;color:#e6f7fc!important;background:#0b2233!important;border:1px solid #63a5b7!important;border-radius:9px!important}
.edu-compact-workspace [hidden],.edu-compact-dialog [hidden]{display:none!important}
.edu-compact-dialog .edu-compact-fields{display:flex;flex-direction:column;flex:1 1 0!important;min-height:0!important;gap:8px!important}
.edu-compact-dialog .edu-compact-field{display:flex!important;flex-direction:column!important;flex:1 1 0!important;min-height:0!important;gap:4px!important;min-width:0!important}
.edu-compact-dialog .edu-compact-field-name{font-size:14px!important;line-height:1.2!important;font-weight:650;color:#d6eef5}
.edu-compact-dialog .edu-compact-field>textarea{position:static!important;flex:1 1 0!important;height:0!important;min-height:36px!important;max-height:none!important;width:100%!important;box-sizing:border-box!important;resize:none!important;white-space:pre-wrap!important;overflow-wrap:anywhere!important;word-break:break-word!important;overflow-x:hidden!important;overflow-y:auto!important;padding:9px!important;font-size:16px!important;line-height:1.35!important;color:#effaff!important;background:#081e2d!important;border:1px solid #72b2c5!important;border-radius:12px!important}
.edu-compact-dialog .edu-compact-tools{flex:none!important;position:relative;min-width:0}
.edu-compact-dialog .edu-compact-tools>.edu-input-tools{display:none!important;margin:0!important;gap:0!important;min-height:0!important}
.edu-compact-dialog .edu-compact-tools>.edu-compact-tools-active:not([hidden]){display:flex!important}
.edu-compact-dialog .edu-compact-tools .edu-input-tools>div:first-child{display:grid!important;grid-template-columns:1fr 1fr;gap:6px!important}
.edu-compact-dialog .edu-compact-tools button{font-size:13px!important;line-height:1.2!important;padding:6px!important;min-height:40px!important;border-radius:10px!important}
.edu-compact-dialog .edu-compact-tools .edu-input-tools>div:nth-child(2):not([hidden]){position:absolute!important;bottom:100%;left:0;right:0;z-index:3;max-height:210px!important;overflow:auto!important;box-sizing:border-box;padding:10px;background:#102d40;border:1px solid #6ba9ba;border-radius:12px}
.edu-compact-dialog .edu-brace-preview:not([hidden]){max-height:65px!important;overflow:auto!important;font-size:12px!important}
.edu-compact-dialog .edu-compact-tools small:empty{display:none!important}
.edu-compact-dialog .edu-compact-actions{position:relative;display:flex!important;flex-direction:column!important;flex:none!important;gap:6px!important}
.edu-compact-primary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.edu-compact-dialog .edu-compact-primary>button{width:100%!important;min-height:44px!important;padding:6px!important;border-radius:12px!important;font-size:14px!important;line-height:1.2!important}
.edu-compact-dialog .edu-compact-primary>button:nth-child(2){background:linear-gradient(145deg,#923653,#63213c)!important;border-color:#c88d9f!important}
.edu-compact-dialog .edu-compact-more{width:100%!important;min-height:36px!important;padding:5px!important;font-size:13px!important;border-radius:10px!important}
.edu-compact-dialog .edu-compact-extra:not([hidden]){display:grid!important;grid-template-columns:1fr 1fr;gap:8px;position:absolute;bottom:100%;left:0;right:0;z-index:4;padding:10px;max-height:55dvh;overflow:auto;background:#102d40;border:1px solid #78b4c4;border-radius:12px;box-shadow:0 -5px 20px #0008}
.edu-compact-dialog .edu-compact-extra>button{min-height:48px!important;padding:8px!important;font-size:14px!important;border-radius:10px!important;line-height:1.25!important}
.edu-compact-dialog .edu-compact-status{flex:none!important;min-height:0;margin:0!important;font-size:13px!important;line-height:1.3!important;max-height:3.9em;overflow:auto;overflow-wrap:anywhere}
.edu-compact-dialog .edu-compact-status:empty{display:none!important}
/* Keyboard leaves the focused field usable instead of stacking two editors. */
.edu-compact-dialog.edu-compact-keyboard .edu-compact-field:not(.edu-compact-field-active){display:none!important}
.edu-compact-dialog.edu-compact-keyboard .edu-compact-context{display:none!important}
@media(max-height:500px){.edu-compact-dialog .edu-compact-workspace{gap:4px!important}.edu-compact-dialog .edu-compact-topic{display:none!important}.edu-compact-dialog .edu-compact-field:not(:focus-within){flex:.65 1 0!important}.edu-compact-dialog .edu-compact-more{min-height:32px!important}}
`;
export const EDUCATION_COMPACT_WORKSPACE_SCRIPT=[['educationUseCompactWorkspace',educationUseCompactWorkspace],['educationCompactWorkspace',educationCompactWorkspace]].map(([name,fn])=>'var '+name+'='+fn.toString()+';').join('\n');
