import {THEORY_ENTRIES} from './education_theory.mjs';
// Read-only quick reference: never asks the model to invent laws or results.
const MATH_THEOREM_ITEMS=THEORY_ENTRIES.filter(x=>x.subject==='math').map(x=>({
 id:x.id,title:x.title,statement:x.statement,formula:x.formula||'',
 topic:x.topic||'other',aliases:x.aliases||[]
}));
export const MATH_THEOREMS_UI_SCRIPT=
 'const MATH_THEOREM_ITEMS='+JSON.stringify(MATH_THEOREM_ITEMS)+';\n'+String.raw`
let mathTheoryQuickReferenceOpen=false;
let mathTheoryQuickReferenceObserver=null;
function mathTheoryQuickReference(){
 const host=document.getElementById('moduleContent');
 if(!host)return;
 mathTheoryQuickReferenceOpen=true;
 const root=document.getElementById('view-module');
 const back=document.createElement('button');
 back.type='button';back.className='secondary-btn';
 back.textContent=eduUiLabel('← Înapoi la Matematică','← Back to Mathematics');
 const restore=()=>{mathTheoryQuickReferenceOpen=false;
   if(typeof mathJourneyShowChoices==='function')mathJourneyShowChoices('branches');
 };
 back.onclick=restore;
 const panel=document.createElement('section');
 panel.className='math-choice-panel';panel.style.cssText=
  'width:100%;min-width:0;max-width:100%;box-sizing:border-box;display:flex;flex-direction:column;gap:10px;overflow-y:auto;max-height:calc(100dvh - 190px);padding:12px;';
 const title=document.createElement('h2');
 title.textContent=eduUiLabel('Legi și teoreme','Laws and theorems');
 const note=document.createElement('p');
 note.textContent=eduUiLabel('Selectează o fișă pentru enunț, definiție și formulă.','Choose an entry for its statement and formula.');
 const query=document.createElement('input');
 query.type='search';query.autocomplete='off';query.spellcheck=false;
 query.placeholder=eduUiLabel('Caută o lege, teoremă sau definiție','Search laws, theorems and definitions');
 query.setAttribute('aria-label',query.placeholder);
 query.style.cssText='min-height:46px;width:100%;box-sizing:border-box;font-size:16px;';
 const options=document.createElement('div');options.style.cssText='display:flex;flex-direction:column;gap:6px;';
 const details=document.createElement('article');details.style.cssText='overflow-wrap:anywhere;line-height:1.6;padding:8px;';
 function normalize(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
 function openItem(item){
  details.replaceChildren();
  const name=document.createElement('h3');name.textContent=item.title;
  const statement=document.createElement('p');statement.textContent=item.statement;
  details.append(name,statement);
  if(item.formula){const formula=document.createElement('p');
   formula.style.cssText='font-size:1.15em;font-weight:600;white-space:pre-wrap;overflow-wrap:anywhere;';
   formula.textContent=item.formula;details.append(formula)}
  details.scrollIntoView({block:'nearest'});
 }
 function draw(){
  options.replaceChildren();
  const term=normalize(query.value).trim();
  const entries=MATH_THEOREM_ITEMS.filter(x=>!term||normalize([x.title,...x.aliases,x.statement].join(' ')).includes(term));
  for(const item of entries.slice(0,40)){
   const btn=document.createElement('button');btn.type='button';
   btn.className='secondary-btn';btn.textContent=item.title;
   btn.style.cssText='width:100%;text-align:left;min-height:42px;white-space:normal;';
   btn.onclick=()=>openItem(item);options.append(btn);
  }
  if(entries.length>40){const info=document.createElement('p');
   info.textContent=eduUiLabel('Rafinează căutarea pentru mai multe rezultate.','Refine the search for more results.');
   options.append(info)}
 }
 query.addEventListener('input',draw);
 panel.append(title,note,query,options,details);
 host.replaceChildren(back,panel);
 if(root)root.classList.add('learning-math');
 draw();
}
function mathInstallTheoryShortcut(){
 mathTheoryQuickReferenceOpen=false;
 const host=document.getElementById('moduleContent');
 if(!host)return;
 if(mathTheoryQuickReferenceObserver)mathTheoryQuickReferenceObserver.disconnect();
 function refresh(){
  if(mathTheoryQuickReferenceOpen||educationCountrySelection.activeModule!=='math'||typeof mathJourney==='undefined'||mathJourney.stage!=='branches')return;
  const root=document.getElementById('view-module');
  if(!root?.classList.contains('learning-math')||host.querySelector('#math-theory-quick-reference'))return;
  const btn=document.createElement('button');btn.id='math-theory-quick-reference';
  btn.type='button';btn.className='secondary-btn';
  btn.textContent=eduUiLabel('📚 Legi și teoreme','📚 Laws and theorems');
  btn.style.cssText='min-height:46px;width:100%;margin:10px 0;touch-action:manipulation;';
  btn.onclick=mathTheoryQuickReference;
  const panel=host.querySelector('.math-choice-panel');
  if(panel)panel.prepend(btn);else host.prepend(btn);
 }
 mathTheoryQuickReferenceObserver=new MutationObserver(refresh);
 mathTheoryQuickReferenceObserver.observe(host,{childList:true,subtree:true});
 refresh();
}
`;
