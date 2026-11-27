// Shared input aids. Plain text remains the sole submitted source of truth.
export function educationBracePreview(value){
 const text=String(value||'');const start=text.indexOf('{');
 if(start<0||!text.slice(start).includes('\n'))return null;
 let depth=0,end=-1;
 for(let i=start;i<text.length;i++){if(text[i]==='{')depth++;if(text[i]==='}'&&--depth===0){end=i;break}}
 const body=text.slice(start+1,end<0?undefined:end).replace(/^\n/,'');
 return {prefix:text.slice(0,start),body,suffix:end<0?'':text.slice(end+1),rows:Math.max(1,body.split('\n').length)};
}
export function educationInputInsert(field,text){
 if(!field||field.readOnly||field.disabled)return false;
 const start=field.selectionStart??field.value.length,end=field.selectionEnd??start;
 const next=field.value.slice(0,start)+text+field.value.slice(end);
 if(field.maxLength>=0&&next.length>field.maxLength)return false;
 field.value=next;field.setSelectionRange(start+text.length,start+text.length);
 // Deliberately do not focus: a palette tap must not summon the mobile keyboard.
 field.dispatchEvent(new Event('input',{bubbles:true}));return true;
}
export function educationAttachInputTools(field){
 if(!field||field.dataset.educationInputTools||field.closest('[data-education-ink]'))return;
 field.dataset.educationInputTools='true';
 const label=(ro,en)=>typeof learningLabel==='function'?learningLabel(ro,en):ro;
 const el=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n};
 const tools=el('div');tools.className='edu-input-tools';
 tools.style.cssText='display:flex;flex-direction:column;gap:8px;min-width:0;width:100%;box-sizing:border-box;';
 const bar=el('div');bar.style.cssText='display:flex;gap:6px;flex-wrap:wrap;';
 const button=(text,fn,parent=bar)=>{const n=el('button',text);n.type='button';n.className='secondary-btn';n.style.cssText='min-height:42px;min-width:42px;white-space:normal;';n.onclick=fn;n.onpointerdown=e=>e.preventDefault();parent.append(n);return n};
 const palette=el('div');palette.hidden=true;palette.style.cssText='max-height:220px;overflow:auto;min-width:0;';
 const status=el('small');status.setAttribute('role','status');
 const insert=text=>{status.textContent=educationInputInsert(field,text)?'':label('Textul nu încape sau câmpul nu este editabil.','Text will not fit or the field is not editable.');};
 const symbolButton=button(label('∑ Simboluri și șabloane','∑ Symbols and templates'),()=>{palette.hidden=!palette.hidden;symbolButton.setAttribute('aria-expanded',String(!palette.hidden))});symbolButton.setAttribute('aria-expanded','false');
 const groups=[
  [label('Operații și relații','Operations and relations'),' + − × ÷ = ≠ ≈ ≤ ≥ ± √ ∞ % ° ∫ ∑ ∂ ∇ → ⇌ ∈ ∉ ⊂ ∪ ∩ ∅ ℝ ℤ ℕ '.trim().split(' ')],
  [label('Paranteze și puteri','Brackets and powers'),['(',')','[',']','{','}','|','^','²','³','₀','₁','₂','₃','⁻','⁺']],
  [label('Litere','Letters'),'α β γ δ ε θ λ μ π ρ σ τ φ ψ ω Ω Δ Σ'.split(' ')]
 ];
 for(const [name,symbols] of groups){palette.append(el('strong',name));const row=el('div');row.style.cssText='display:flex;flex-wrap:wrap;gap:4px;margin:5px 0;';for(const s of symbols)button(s,()=>insert(s),row);palette.append(row)}
 const templates=el('div');templates.style.cssText='display:flex;flex-wrap:wrap;gap:4px;';
 for(const [name,text] of [
  [label('Sistem cu acoladă','Braced system'),'{\n  x + y = 5\n  x − y = 1\n}'],
  [label('Funcție pe cazuri','Piecewise function'),'f(x) = {\n  x^2, '+label('dacă','if')+' x < 0\n  2x + 1, '+label('dacă','if')+' x ≥ 0\n}'],
  [label('Fracție','Fraction'),'(a)/(b)'],[label('Putere','Power'),'x^(n)'],[label('Rădăcină','Root'),'√(x)']
 ])button(name,()=>insert(text),templates);
 palette.append(el('p',label('Șabloanele sunt exemple editabile. Înlocuiește valorile înainte de rezolvare.','Templates are editable examples. Replace the values before solving.')),templates);
 const preview=el('div');preview.className='edu-brace-preview';preview.setAttribute('aria-label',label('Previzualizare acoladă','Brace preview'));preview.style.cssText='overflow:auto;max-width:100%;border:1px solid #568697;border-radius:8px;padding:8px;';
 const refresh=()=>{
  tools.hidden=field.readOnly||field.disabled;tools.style.display=tools.hidden?'none':'flex';
  preview.replaceChildren();const p=educationBracePreview(field.value);preview.hidden=!p;
  if(!p)return;
  preview.append(el('small',label('Previzualizare; textul original rămâne editabil.','Preview; the original text remains editable.')));
  const row=el('div');row.style.cssText='display:flex;align-items:stretch;gap:4px;width:max-content;min-height:24px;';
  const prefix=el('pre',p.prefix);prefix.style.cssText='margin:0;font:inherit;line-height:24px;';
  const brace=document.createElementNS('http://www.w3.org/2000/svg','svg');brace.setAttribute('viewBox','0 0 24 100');brace.setAttribute('preserveAspectRatio','none');brace.setAttribute('aria-hidden','true');brace.style.cssText='width:20px;flex:0 0 20px;align-self:stretch;';brace.setAttribute('height',String(p.rows*24));
  const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M22 1 C9 1 13 25 9 40 Q7 49 2 50 Q7 51 9 60 C13 75 9 99 22 99');path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');path.setAttribute('stroke-width','2');brace.append(path);
  const content=el('pre',p.body+(p.body.endsWith('\n')?' ':''));content.style.cssText='margin:0;font:inherit;line-height:24px;white-space:pre;';
  row.append(prefix,brace,content,el('span',p.suffix));preview.append(row);
 };
 const ink=button(label('✍ Scrie cu degetul / stylusul','✍ Write with finger / stylus'),()=>educationOpenInk(field));
 ink.dataset.inkOpen='true';
 tools.append(bar,palette,preview,status);field.after(tools);field.addEventListener('input',refresh);field.addEventListener('focus',refresh);
 field.addEventListener('change',refresh);tools.educationRefresh=refresh;refresh();
}

export function educationOpenInk(field){
 if(!field?.isConnected||field.readOnly||field.disabled)return;
 const label=(ro,en)=>typeof learningLabel==='function'?learningLabel(ro,en):ro;
 const previous=field.educationInkSelection;
 const selection=document.activeElement!==field&&previous?.value===field.value?{...previous}:{start:field.selectionStart??field.value.length,end:field.selectionEnd??field.value.length,value:field.value};
 field.educationInkSelection=selection;
 document.querySelector('[data-education-ink]')?.close();
 const dialog=document.createElement('dialog');dialog.dataset.educationInk='true';
 dialog.style.cssText='box-sizing:border-box;width:min(96vw,800px);max-width:96vw;max-height:94dvh;overflow:auto;padding:12px;border:2px solid #5596ad;border-radius:14px;background:#0b2639;color:#fff;';
 const make=(tag,text='')=>{const n=document.createElement(tag);n.textContent=text;return n};
 const bar=make('div');bar.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin:8px 0;';
 const button=(text,fn)=>{const b=make('button',text);b.type='button';b.className='secondary-btn';b.style.minHeight='44px';b.onclick=fn;bar.append(b);return b};
 dialog.append(make('h3',label('Scriere de mână','Handwriting')),make('p',label('Scrie cu un singur deget sau cu stylusul. Numai „Transcrie” trimite desenul către Cloudflare Workers AI. Verifică textul recunoscut înainte de inserare; nu se rezolvă automat.','Write with one finger or a stylus. Only “Transcribe” sends the drawing to Cloudflare Workers AI. Check the recognized text before inserting; nothing is solved automatically.')));
 const canvas=make('canvas');canvas.width=1200;canvas.height=700;canvas.setAttribute('aria-label',label('Tablă de scriere','Handwriting board'));canvas.style.cssText='display:block;width:100%;height:280px;background:#fff;border-radius:8px;touch-action:none;user-select:none;';
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const strokes=field.educationInkDraft||[];field.educationInkDraft=strokes;let active=null,controller=null,revision=0,acceptedRevision=-1;
 const status=make('p');status.setAttribute('role','status');
 const text=make('textarea');text.rows=4;text.maxLength=12000;text.style.cssText='width:100%;box-sizing:border-box;font-size:16px;';text.setAttribute('aria-label',label('Transcriere de verificat','Transcription to review'));text.placeholder=label('Aici apare transcrierea. Corecteaz-o înainte de inserare.','The transcription appears here. Correct it before inserting.');
 const check=make('input');check.type='checkbox';const confirm=make('label');confirm.append(check,document.createTextNode(label(' Am verificat transcrierea.',' I have checked the transcription.')));
 const redraw=()=>{ctx.clearRect(0,0,1200,700);ctx.beginPath();ctx.fillStyle='#fff';ctx.fillRect(0,0,1200,700);ctx.strokeStyle='#111';ctx.fillStyle='#111';ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';for(const s of strokes){ctx.beginPath();ctx.moveTo(...s[0]);if(s.length===1){ctx.arc(s[0][0],s[0][1],2,0,Math.PI*2);ctx.fill()}else{for(const p of s.slice(1))ctx.lineTo(...p);ctx.stroke()}}};
 const changed=()=>{revision++;controller?.abort();controller=null;check.checked=false;acceptedRevision=-1;send.disabled=false;insert.disabled=true;status.textContent=label('Desen modificat. Transcrie din nou înainte de inserare.','Drawing changed. Transcribe again before inserting.');};
 const point=e=>{const r=canvas.getBoundingClientRect();return [Math.max(0,Math.min(1200,(e.clientX-r.left)*1200/r.width)),Math.max(0,Math.min(700,(e.clientY-r.top)*700/r.height))]};
 canvas.onpointerdown=e=>{if(active!==null||e.button>0)return;e.preventDefault();active=e.pointerId;try{canvas.setPointerCapture(e.pointerId)}catch{}strokes.push([point(e)]);changed();redraw()};
 canvas.onpointermove=e=>{if(e.pointerId!==active)return;e.preventDefault();const events=e.getCoalescedEvents?.();for(const p of events?.length?events:[e])strokes.at(-1).push(point(p));redraw()};
 const finish=e=>{if(e.pointerId===active){active=null;try{canvas.releasePointerCapture(e.pointerId)}catch{}}};
 canvas.onpointerup=finish;canvas.onpointercancel=finish;canvas.onlostpointercapture=finish;
 button(label('Anulează ultima trasare','Undo last stroke'),()=>{if(active!==null)return;strokes.pop();changed();redraw()});
 button(label('Șterge desenul','Clear drawing'),()=>{if(active!==null)return;strokes.length=0;changed();redraw()});
 button(label('Descarcă desenul','Download drawing'),()=>{const a=make('a');a.href=canvas.toDataURL('image/png');a.download='education-handwriting.png';a.click()});
 const send=button(label('Transcrie (trimite desenul)','Transcribe (send drawing)'),async()=>{
  if(!strokes.length||active!==null){status.textContent=label('Scrie întâi pe tablă și ridică degetul/stylusul.','Write on the board first, then lift your finger/stylus.');return}
  controller?.abort();const inflight=new AbortController();controller=inflight;const version=revision;send.disabled=true;insert.disabled=true;check.checked=false;acceptedRevision=-1;
  const timer=setTimeout(()=>inflight.abort(),45000);status.textContent=label('Se transcrie desenul…','Transcribing drawing…');
  try{
   const response=await fetch('/api/education-ink',{method:'POST',headers:{'Content-Type':'application/json'},signal:inflight.signal,body:JSON.stringify({image:canvas.toDataURL('image/png'),consent:true,language:typeof state==='object'?state.language:'ro'})});
   const data=await response.json();if(!response.ok||data.status!=='success'||!data.transcript)throw Error('unavailable');
   if(!dialog.open||revision!==version||inflight.signal.aborted)return;
   text.value=data.transcript;acceptedRevision=version;status.textContent=label('Transcriere AI neverificată. Corectează cifrele, semnele și rândurile, apoi confirmă.','Unverified AI transcription. Correct numbers, symbols and lines, then confirm.');
  }catch{if(dialog.open&&revision===version)status.textContent=label('Transcriere indisponibilă sau anulată. Desenul rămâne aici; îl poți descărca. Poți folosi simbolurile și șabloanele fără AI.','Transcription unavailable or cancelled. Your drawing remains here; download it if needed. Symbols and templates work without AI.');}
  finally{clearTimeout(timer);if(controller===inflight){controller=null;send.disabled=false}}
 });
 let contextValid=true;
 const invalidate=e=>{if(!dialog.contains(e.target)){contextValid=false;controller?.abort();insert.disabled=true;status.textContent=label('Cerința a fost schimbată. Redeschide tabla pentru noua cerință.','The task has changed. Reopen the board for the new task.');}};
 document.addEventListener('input',invalidate,true);document.addEventListener('change',invalidate,true);
 const insert=button(label('Inserează transcrierea verificată','Insert checked transcription'),()=>{
  if(!contextValid||!check.checked||acceptedRevision!==revision||!text.value.trim())return;
  if(!field.isConnected||field.readOnly||field.disabled||field.value!==selection.value){status.textContent=label('Câmpul a fost schimbat. Închide tabla și redeschide-o pentru noua cerință.','The field has changed. Close the board and reopen it for the new task.');return}
  field.setSelectionRange(selection.start,selection.end);
  if(!educationInputInsert(field,text.value)){status.textContent=label('Transcrierea nu încape în câmp. Scurteaz-o sau copiaz-o separat.','Transcription will not fit. Shorten it or copy it separately.');return}dialog.close();
 });insert.disabled=true;
 check.onchange=()=>{insert.disabled=!contextValid||!check.checked||acceptedRevision!==revision||!text.value.trim()};text.oninput=()=>{check.checked=false;insert.disabled=true};
 button(label('Închide','Close'),()=>dialog.close());
 dialog.append(canvas,bar,status,text,confirm);document.body.append(dialog);redraw();
 dialog.addEventListener('close',()=>{controller?.abort();document.removeEventListener('input',invalidate,true);document.removeEventListener('change',invalidate,true);dialog.remove();if(field.isConnected&&field.value===selection.value)field.setSelectionRange(selection.start,selection.end)},{once:true});dialog.showModal();
}

export function educationInstallInputTools(){
 if(typeof MutationObserver!=='function')return;
 const visit=node=>{
  if(!node||node.nodeType!==1)return;
  const fields=node.matches('textarea')?[node]:Array.from(node.querySelectorAll('textarea'));
  for(const field of fields){
   if(typeof state!=='object'||state.currentModule!=='learning'||!field.closest('#moduleContent,dialog')||field.closest('[data-education-ink]')||field.readOnly||field.disabled)continue;
   educationAttachInputTools(field);
  }
 };
 const observer=new MutationObserver(records=>{for(const r of records){if(r.type==='attributes'){const f=r.target;f.nextElementSibling?.educationRefresh?.();visit(f)}else for(const n of r.addedNodes)visit(n)}});
 observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['readonly','disabled']});
 document.addEventListener('change',()=>requestAnimationFrame(()=>{for(const f of document.querySelectorAll('#moduleContent textarea'))f.nextElementSibling?.educationRefresh?.()}),true);
 visit(document.getElementById('moduleContent'));
}
export const EDUCATION_INPUT_TOOLS_SCRIPT=[['educationBracePreview',educationBracePreview],['educationInputInsert',educationInputInsert],['educationAttachInputTools',educationAttachInputTools],['educationOpenInk',educationOpenInk],['educationInstallInputTools',educationInstallInputTools]].map(([n,f])=>'var '+n+'='+f.toString()+';').join('\n')+'\nglobalThis.educationAttachInputTools=educationAttachInputTools;\nif(typeof MutationObserver==="function")Promise.resolve().then(educationInstallInputTools);';
