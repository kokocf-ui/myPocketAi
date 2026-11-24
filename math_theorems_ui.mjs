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
 back.textContent=learningLabel('← Înapoi la Matematică','← Back to Mathematics');
 const previousStage='stages';
 const restore=()=>{mathTheoryQuickReferenceOpen=false;
   if(typeof mathJourneyShowChoices==='function')mathJourneyShowChoices(previousStage);
 };
 back.onclick=restore;
 if(root){root.classList.remove('math-choice-stage');root.dataset.mathStage='reference';}
 const panel=document.createElement('section');
 panel.className='math-theory-reference-panel';panel.style.cssText=
  'width:100%;min-width:0;max-width:100%;max-height:calc(100dvh - 240px);'+
  'box-sizing:border-box;display:flex;flex-direction:column;gap:9px;overflow:hidden;padding:12px;';
 const title=document.createElement('h2');
 title.textContent=learningLabel('Legi și teoreme','Laws and theorems');
 const note=document.createElement('p');
 note.textContent=learningLabel('Selectează o fișă pentru enunț, definiție și formulă.','Choose an entry for its statement and formula.');
 const query=document.createElement('input');
 query.type='search';query.autocomplete='off';query.spellcheck=false;
 query.placeholder=learningLabel('Caută o lege, teoremă sau definiție','Search laws, theorems and definitions');
 query.setAttribute('aria-label',query.placeholder);
 query.style.cssText='min-height:46px;width:100%;box-sizing:border-box;font-size:16px;';
 const topics={geometry:['Geometrie','Geometry'],algebra:['Algebră','Algebra'],
  arithmetic:['Aritmetică','Arithmetic'],trigonometry:['Trigonometrie','Trigonometry'],
  functions:['Funcții','Functions'],measurement:['Măsurători','Measurement'],
  statistics:['Statistică și probabilități','Statistics and probability'],
  'linear-algebra':['Algebră liniară','Linear algebra'],analysis:['Analiză matematică','Mathematical analysis'],
  differential:['Ecuații diferențiale','Differential equations'],
  discrete:['Matematică discretă','Discrete mathematics']};
 const group=document.createElement('select');group.style.cssText='min-height:44px;width:100%;font-size:16px;';
 // Global Android picker otherwise clips the mathematical branches to four search-only entries.
 // Explicitly use its existing swipeable all-options mode, only for this reference selector.
 group.dataset.pocketPickerMode='scroll';
 group.setAttribute('aria-label',learningLabel('Alege ramura matematicii','Choose a mathematics branch'));
 const all=document.createElement('option');all.value='';all.textContent=learningLabel('Toate ramurile','All branches');group.append(all);
 for(const topic of [...new Set(MATH_THEOREM_ITEMS.map(x=>x.topic))].sort()){
  const option=document.createElement('option');option.value=topic;
  option.textContent=learningLabel(...(topics[topic]||[topic,topic]));group.append(option);
 }
 const options=document.createElement('div');options.className='math-theory-scroll-list';
 options.style.cssText='display:flex;flex-direction:column;gap:6px;flex:1 1 auto;'+
  'overflow-y:auto;overflow-x:hidden;min-height:145px;max-height:42dvh;'+
  'touch-action:pan-y;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;';
 const details=document.createElement('article');details.style.cssText='overflow-wrap:anywhere;line-height:1.6;padding:8px;'+
  'overflow-y:auto;max-height:24dvh;min-height:0;flex:0 1 auto;-webkit-overflow-scrolling:touch;';
 function normalize(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();}
 let selectionToken=0,listToken=0;
 function openItem(item){
  // Each law/theorem/definition opens in its own full-screen paged study window
  // (statement, formula, interpretation, worked steps, mistakes, checks), as before.
  if(typeof educationOpenPagedLesson==='function'&&typeof educationMathTheoryMaterial==='function'){
   ++selectionToken;details.replaceChildren();
   educationOpenPagedLesson(item.title,educationMathTheoryMaterial(item));
   return;
  }
  const token=++selectionToken;
  details.replaceChildren();
  const name=document.createElement('h3');name.textContent=item.title;
  const statement=document.createElement('p');statement.textContent=item.statement;
  details.append(name,statement);
  if(item.formula){const formula=document.createElement('p');
   formula.style.cssText='font-size:1.15em;font-weight:600;white-space:pre-wrap;overflow-wrap:anywhere;';
   formula.textContent=item.formula;details.append(formula)}
  details.scrollIntoView({block:'nearest'});
  // Full mathematical statements remain offline. For non-Romanian app languages,
  // translate only the selected statement using the already-cached Education
  // translation service; keep the original mathematical formula unchanged.
  if(state.language!=='ro'&&typeof eduTranslateMaterial==='function'){
   const info=document.createElement('small');info.textContent=learningLabel('Se traduce definiția…','Translating the definition…');
   details.append(info);
   eduTranslateMaterial({title:item.title,statement:item.statement},'math:reference:'+item.id,'ro').then(translated=>{
    if(!mathTheoryQuickReferenceOpen||token!==selectionToken)return;
    if(translated?.title&&translated?.statement){
     name.textContent=translated.title;statement.textContent=translated.statement;
     info.remove();
    }else info.textContent=learningLabel('Este afișată definiția originală (română).','Original Romanian statement shown.');
   }).catch(()=>{if(token===selectionToken)info.textContent=learningLabel('Traducerea nu este disponibilă.','Translation is unavailable.');});
  }
 }
 function draw(){
  options.replaceChildren();
  const term=normalize(query.value).trim(),section=group.value;
  const entries=MATH_THEOREM_ITEMS.filter(x=>
   (!section||x.topic===section)&&
   (!term||normalize([x.title,...x.aliases,x.statement].join(' ')).includes(term)))
   .sort((a,b)=>a.title.localeCompare(b.title,'ro'));
  const currentPage=entries,buttons=[];
  const token=++listToken;
  for(const item of currentPage){
   const btn=document.createElement('button');btn.type='button';
   btn.className='secondary-btn';btn.textContent=item.title;
   btn.style.cssText='width:100%;text-align:left;min-height:42px;white-space:normal;';
   btn.onclick=()=>openItem(item);options.append(btn);buttons.push(btn);
  }
  if(state.language!=='ro'&&buttons.length&&typeof eduTranslateMaterial==='function'){
   for(let startIdx=0;startIdx<currentPage.length;startIdx+=20){
    const slice=currentPage.slice(startIdx,startIdx+20);
    const sliceBtns=buttons.slice(startIdx,startIdx+20);
    const cacheId='math:reference-titles:'+group.value+':'+normalize(query.value)+':'+startIdx;
    const payload={titles:slice.map(x=>x.title)};
    const cached=typeof eduReadCachedTranslation==='function'?eduReadCachedTranslation(payload,cacheId,'ro'):null;
    if(cached&&Array.isArray(cached.titles)){
     sliceBtns.forEach((btn,i)=>{if(cached.titles[i]){btn.textContent=cached.titles[i];btn.setAttribute('data-edu-localized',state.language);}});
     continue;
    }
    eduTranslateMaterial(payload,cacheId,'ro').then(translated=>{
     if(!mathTheoryQuickReferenceOpen||token!==listToken||!Array.isArray(translated?.titles))return;
     sliceBtns.forEach((btn,i)=>{if(translated.titles[i]){btn.textContent=translated.titles[i];btn.setAttribute('data-edu-localized',state.language);}});
    }).catch(()=>{});
   }
  }
  if(!entries.length){const empty=document.createElement('p');
   empty.textContent=learningLabel('Nu există rezultate.','No matching entries.');options.append(empty);}
 }
 query.addEventListener('input',()=>{details.replaceChildren();draw();options.scrollTop=0});
 group.addEventListener('change',()=>{details.replaceChildren();draw();options.scrollTop=0});
 panel.append(title,note,query,group,options,details);
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
  if(mathTheoryQuickReferenceOpen||educationCountrySelection.activeModule!=='math'||typeof mathJourney==='undefined'||mathJourney.stage!=='stages')return;
  const root=document.getElementById('view-module');
  if(!root?.classList.contains('learning-math')||host.querySelector('#math-theory-quick-reference'))return;
  const btn=document.createElement('button');btn.id='math-theory-quick-reference';
  btn.type='button';btn.className='secondary-btn';
  btn.textContent=learningLabel('📚 Legi și teoreme','📚 Laws and theorems');
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
