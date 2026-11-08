// Accessibility enhancement only within the Education workspace.
// Replace unreliable long-press Android WebView <select> with an in-page one-tap menu.
export const EDUCATION_SELECTS_UI_SCRIPT=String.raw`
function educationInstallTapSelects(){
 const host=document.getElementById('moduleContent');if(!host||typeof MutationObserver==='undefined')return;
 const fold=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase();
 function upgrade(select){
  if(select.dataset.educationTapMenu==='1'||select.multiple||select.size>1||select.closest('.education-tap-proxy'))return;
  const options=[...select.options];if(options.length<2)return;
  const proxy=document.createElement('div');proxy.className='education-tap-proxy';proxy.style.cssText='display:block;width:100%;min-width:0;max-width:100%;box-sizing:border-box;';
  const trigger=document.createElement('button');trigger.type='button';trigger.className='secondary-btn education-tap-trigger';
  trigger.style.cssText='display:block;text-align:left;width:100%;max-width:100%;min-height:48px;white-space:normal;overflow-wrap:anywhere;touch-action:manipulation;';
  trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');
  trigger.setAttribute('aria-label',select.getAttribute('aria-label')||learningLabel('Alege opțiunea','Choose option'));
  const menu=document.createElement('div');menu.className='education-tap-list';menu.setAttribute('role','listbox');menu.hidden=true;
  menu.style.cssText='display:none;flex-direction:column;gap:6px;max-height:47dvh;overflow:auto;border:1px solid #648a9e;border-radius:10px;padding:8px;margin-top:5px;';
  let term='',offset=0;
  function label(){trigger.textContent=(select.selectedOptions[0]?.textContent||learningLabel('Alege','Choose'))+' ▾';trigger.disabled=select.disabled}
  function draw(){
   const candidates=[...select.options].map((option,index)=>({option,index})).filter(o=>fold(o.option.textContent).includes(fold(term)));
   if(offset>=candidates.length)offset=0;menu.replaceChildren();
   if([...select.options].length>4){const search=document.createElement('input');search.type='search';search.className='lit-input';search.setAttribute('aria-label',learningLabel('Caută opțiunea','Find option'));search.placeholder=learningLabel('Caută de la primul caracter…','Search from first character…');search.value=term;search.style.cssText='width:100%;min-height:43px;box-sizing:border-box;';search.oninput=()=>{term=search.value;offset=0;draw();menu.querySelector('input')?.focus()};menu.append(search)}
   const items=candidates.slice(offset,offset+4);
   if(!items.length){const empty=document.createElement('p');empty.textContent=learningLabel('Niciun rezultat.','No matches.');menu.append(empty)}
   items.forEach(({option,index})=>{const b=document.createElement('button');b.type='button';b.className='secondary-btn';b.setAttribute('role','option');b.setAttribute('aria-selected',String(select.selectedIndex===index));b.style.cssText='text-align:left;white-space:normal;min-height:43px;width:100%;touch-action:manipulation;';b.textContent=option.textContent;
    b.onclick=()=>{select.selectedIndex=index;select.dispatchEvent(new Event('input',{bubbles:true}));select.dispatchEvent(new Event('change',{bubbles:true}));label();menu.hidden=true;menu.style.display='none';trigger.setAttribute('aria-expanded','false')};menu.append(b)});
   const pages=document.createElement('div');pages.className='lit-actions';
   const nav=(text,next)=>{const b=document.createElement('button');b.type='button';b.className='secondary-btn';b.textContent=text;b.onclick=()=>{offset=next;draw()};pages.append(b)};
   if(offset>0)nav(learningLabel('← Anterior','← Previous'),Math.max(0,offset-4));
   if(offset+4<candidates.length)nav(learningLabel('Mai multe →','More →'),offset+4);
   menu.append(pages);
  }
  trigger.onclick=()=>{const isOpening=menu.hidden;menu.hidden=!isOpening;menu.style.display=isOpening?'flex':'none';trigger.setAttribute('aria-expanded',String(isOpening));if(isOpening){term='';offset=0;draw()}};
  select.addEventListener('change',label);proxy.append(trigger,menu);select.insertAdjacentElement('afterend',proxy);
  select.dataset.educationTapMenu='1';select.style.display='none';label();
 }
 function scan(){if(!document.getElementById('view-module')?.classList.contains('learning-active'))return;for(const select of host.querySelectorAll('select'))upgrade(select)}
 const observer=new MutationObserver(()=>scan());observer.observe(host,{subtree:true,childList:true});scan();
}
educationInstallTapSelects();
`;
