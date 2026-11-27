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
 if(!field||field.dataset.educationInputTools)return;
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
 tools.append(bar,palette,preview,status);field.after(tools);field.addEventListener('input',refresh);field.addEventListener('focus',refresh);
 field.addEventListener('change',refresh);tools.educationRefresh=refresh;refresh();
}

export function educationInstallInputTools(){
 if(typeof MutationObserver!=='function')return;
 const visit=node=>{
  if(!node||node.nodeType!==1)return;
  const fields=node.matches('textarea')?[node]:Array.from(node.querySelectorAll('textarea'));
  for(const field of fields){
   if(typeof state!=='object'||state.currentModule!=='learning'||!field.closest('#moduleContent,dialog')||field.readOnly||field.disabled)continue;
   educationAttachInputTools(field);
  }
 };
 const observer=new MutationObserver(records=>{for(const r of records){if(r.type==='attributes'){const f=r.target;f.nextElementSibling?.educationRefresh?.();visit(f)}else for(const n of r.addedNodes)visit(n)}});
 observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['readonly','disabled']});
 document.addEventListener('change',()=>requestAnimationFrame(()=>{for(const f of document.querySelectorAll('#moduleContent textarea'))f.nextElementSibling?.educationRefresh?.()}),true);
 visit(document.getElementById('moduleContent'));
}
export const EDUCATION_INPUT_TOOLS_SCRIPT=[['educationBracePreview',educationBracePreview],['educationInputInsert',educationInputInsert],['educationAttachInputTools',educationAttachInputTools],['educationInstallInputTools',educationInstallInputTools]].map(([n,f])=>'var '+n+'='+f.toString()+';').join('\n')+'\nglobalThis.educationAttachInputTools=educationAttachInputTools;\nif(typeof MutationObserver==="function")Promise.resolve().then(educationInstallInputTools);';
