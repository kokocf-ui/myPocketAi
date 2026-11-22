// WebView-safe fast references, with visible offline results and no AI calls.
// A single overlay for both functions, loaded only on a user click.
// Deliberately uses DOM textContent: never inserts remote HTML.
export function literatureQuickReferenceAttach(panel,options={}){
 if(!panel||typeof document==='undefined'||!document.createElement)return null;
 const existing=panel.querySelector?.('[data-lit-quick-entry]');
 if(existing)return existing;
 const language=String(options.studyLanguage||'ro').toLowerCase();
 const ui=String(options.interfaceLanguage||'ro')==='ro'?'ro':'en';
 const tr=(ro,en)=>ui==='ro'?ro:en;
 const catalog=typeof LIT_REFERENCE_CATALOG==='undefined'?[]:LIT_REFERENCE_CATALOG;
 const dict=typeof LIT_QUICK_DICTIONARY==='undefined'?{ro:[],en:[]}:LIT_QUICK_DICTIONARY;
 const grammar=typeof LIT_QUICK_GRAMMAR==='undefined'?{ro:[],en:[]}:LIT_QUICK_GRAMMAR;
 const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLocaleLowerCase();
 const el=(tag,cls,label)=>{
  const n=document.createElement(tag);
  if(cls)n.className=cls;
  if(label!==undefined)n.textContent=label;
  return n;
 };
 const button=(label,handler,kind='option')=>{
  const n=el('button','lit-quick-'+kind,label);
  n.type='button';
  n.style.cssText='box-sizing:border-box!important;color:#1d2a34!important;background:#f8fafc!important;border:1px solid #becbd2!important;border-radius:9px!important;padding:9px 10px!important;min-height:36px!important;display:block!important;font-size:14px!important;font-weight:500!important;line-height:1.35!important;text-align:left!important;white-space:normal!important;opacity:1!important;cursor:pointer!important';
  n.onclick=handler;
  return n;
 };
 const bar=el('div','lit-quick-entry');
 bar.setAttribute('data-lit-quick-entry','true');
 bar.style.cssText='display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:9px 0;border-bottom:1px solid #456476;margin:0 0 8px';
 let active=null,requestSerial=0,remoteTimer=null,aborter=null;
 const clear=x=>{if(x?.replaceChildren)x.replaceChildren();else x.textContent=''};
 function close(){
  requestSerial++;
  if(remoteTimer!==null&&typeof clearTimeout==='function')clearTimeout(remoteTimer);
  remoteTimer=null;
  if(aborter){aborter.abort();aborter=null}
  if(active){if(active.remove)active.remove();else active.parentNode?.removeChild(active)}
  active=null;
 }
 function open(mode){
  close();
  const ro=ui==='ro',wordMode=mode==='dictionary';
  const overlay=el('div','lit-quick-overlay');
  overlay.setAttribute('data-lit-quick-overlay',mode);
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.style.cssText='position:fixed!important;inset:0!important;z-index:2147483000!important;display:flex!important;align-items:center!important;justify-content:center!important;background:rgba(0,9,20,.78)!important;padding:10px!important;box-sizing:border-box!important;overflow:hidden!important';
  const box=el('section','lit-quick-dialog');
  box.style.cssText='box-sizing:border-box!important;display:flex!important;flex-direction:column!important;gap:13px!important;width:min(100%,560px)!important;max-height:calc(100dvh - 20px)!important;height:min(85dvh,720px)!important;min-height:270px!important;overflow:hidden!important;border-radius:15px!important;border:1px solid #8bb3c3!important;background:#fff!important;color:#1d2a34!important;padding:clamp(14px,3.4vw,24px)!important';
  const header=el('div','lit-quick-head');
  header.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:8px;flex:0 0 auto';
  const heading=el('strong','',wordMode?tr('📖 Dicționar','📖 Dictionary'):tr('📚 Ghid rapid','📚 Quick reference'));
  heading.style.cssText='font-size:17px;color:#172333!important;line-height:1.3';
  const back=button(tr('Înapoi','Back'),close,'back');
  back.style.cssText+=';background:#762d49!important;color:#fff!important;min-width:85px!important;text-align:center!important';
  header.append(heading,back);
  const hint=el('p','lit-quick-hint',wordMode?
   tr('Cuvintele apar chiar de la prima literă. Alege unul pentru definiție.', 'Suggestions appear from the first letter. Tap to read its meaning.'):
   tr('Alege o categorie și un termen. Definițiile sunt disponibile și fără internet.', 'Choose a category and term. Definitions work offline.'));
  hint.style.cssText='font-size:12px;color:#364b5a!important;margin:0!important;flex:0 0 auto';
  const tabs=el('div','lit-quick-tabs');
  tabs.style.cssText='display:flex;flex-wrap:wrap;gap:5px;flex:0 0 auto';
  const input=el('input','lit-quick-input');
  input.type='search';input.autocomplete='off';input.autocapitalize='off';input.spellcheck=false;
  input.placeholder=wordMode?tr('Introdu un cuvânt…','Enter a word…'):
   tr('Caută: predicat, etc., km…','Search: predicate, etc., km…');
  input.setAttribute('aria-label',input.placeholder);
  input.style.cssText='display:block!important;flex:0 0 auto;box-sizing:border-box!important;width:100%!important;min-height:41px!important;padding:9px 12px!important;background:#fff!important;color:#142331!important;border:1px solid #8497a0!important;border-radius:8px!important;font:16px system-ui,sans-serif!important';
  const groups=el('div','lit-quick-groups');
  groups.style.cssText='display:flex;flex-wrap:wrap;gap:5px;max-height:84px;overflow:auto;flex:0 0 auto';
  const pinned=el('div','lit-quick-pinned');
  pinned.style.cssText='display:flex!important;gap:5px!important;flex-wrap:wrap!important;flex:0 0 auto!important;max-height:90px!important;overflow-y:auto!important;color:#172333!important';
  const detail=el('article','lit-quick-detail');
  detail.setAttribute('role','status');
  detail.setAttribute('aria-live','polite');
  detail.style.cssText='display:none!important;flex:1 1 auto!important;min-height:0!important;max-height:none!important;overflow-y:auto!important;overscroll-behavior:contain!important;padding:clamp(16px,4vw,25px)!important;border:1px solid #b2c5ce!important;border-radius:12px!important;background:#f8fbfc!important;color:#172333!important;font:17px/1.7 system-ui,sans-serif!important';
  const results=el('div','lit-quick-results');
  results.setAttribute('role','listbox');
  results.style.cssText='display:flex!important;flex-direction:column!important;gap:8px!important;flex:1 1 120px!important;min-height:100px!important;overflow-y:auto!important;overscroll-behavior:contain!important;padding:9px!important;background:#fff!important;border:1px solid #ccd8de!important;border-radius:10px!important;color:#172333!important';
  const info=el('p','lit-quick-foot',wordMode?
    tr('Cuvintele locale se explică offline. Pentru alte intrări poate fi necesar Wikționarul online.',
       'Local words work offline. Other entries may require online Wiktionary.'):
    tr('Ghid de consultare, nu lista exhaustivă a tuturor regulilor sau unităților.',
       'A practical reference, not an exhaustive catalogue of every rule or unit.'));
  info.style.cssText='font-size:12px!important;color:#556471!important;line-height:1.5!important;margin:0!important;flex:0 0 auto';
  box.append(header,hint);
  if(!wordMode)box.append(tabs);
  box.append(input);
  if(!wordMode)box.append(groups);
  box.append(pinned,detail,results,info);
  overlay.append(box);
  const body=document.body||document.querySelector('#moduleContent');
  if(!body){return}
  body.append(overlay);
  active=overlay;overlay.litQuickClose=close;
  overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
  overlay.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close()}});
  const showInfo=(msg)=>{
   clear(results);
   const line=el('p','',msg);
   line.style.cssText='font-size:13px;color:#40505d!important;margin:7px!important';
   results.append(line);
  };
  // On a small phone display the list and the explanation must never compete
  // for vertical space. Selection opens a dedicated readable detail view.
  let reading=false;
  const setVisible=(node,shown,display='block')=>{
   if(!node?.style)return;
   if(typeof node.style.setProperty==='function')
    node.style.setProperty('display',shown?display:'none','important');
   else node.style.cssText+=';display:'+(shown?display:'none')+'!important';
  };
  const switchReading=show=>{
   reading=!!show;
   setVisible(hint,!show,'block');
   setVisible(tabs,!show&&!wordMode,'flex');
   setVisible(input,!show,'block');
   setVisible(groups,!show&&!wordMode,'flex');
   setVisible(pinned,!show,'flex');
   setVisible(results,!show,'flex');
   setVisible(info,!show,'block');
   setVisible(detail,show,'block');
   if(show){
    if(typeof input.blur==='function')input.blur();
    detail.scrollTop=0;
   }
  };
  const detailAction=(label,href)=>{
   const a=el('a','lit-quick-source-link',label);
   a.href=href;a.rel='noopener noreferrer';a.target='_blank';
   a.style.cssText='display:inline-block!important;margin:4px 12px 4px 0!important;padding:9px 12px!important;border:1px solid #a2b6c0!important;border-radius:9px!important;color:#703149!important;background:#fff!important;text-decoration:none!important;font-size:14px!important;line-height:1.5!important';
   return a;
  };
  const showDetail=(word,definition,example='',url='')=>{
   clear(detail);
   const backToList=button(tr('← Înapoi la listă','← Back to the list'),()=>switchReading(false),'detail-back');
   backToList.style.cssText+=';width:auto!important;min-height:43px!important;margin:0 0 17px!important;background:#e8f0f3!important;color:#17334a!important;font-size:15px!important;border:1px solid #9bb7c4!important';
   const title=el('h3','lit-quick-definition-title',word);
   title.style.cssText='font-size:clamp(21px,5.3vw,27px)!important;line-height:1.3!important;font-weight:750!important;color:#142e3c!important;margin:0 0 18px!important;letter-spacing:-.01em!important;overflow-wrap:anywhere!important';
   const label=el('div','lit-quick-definition-label',tr('DEFINIȚIE','DEFINITION'));
   label.style.cssText='font-size:12px!important;letter-spacing:.08em!important;text-transform:uppercase!important;font-weight:750!important;color:#536b7b!important;margin-bottom:8px!important';
   const explanation=el('p','lit-quick-definition-text',String(definition||''));
   explanation.style.cssText='font-size:17px!important;line-height:1.75!important;font-weight:400!important;letter-spacing:.01em!important;white-space:pre-wrap!important;overflow-wrap:anywhere!important;color:#203443!important;margin:0 0 22px!important';
   detail.append(backToList,title,label,explanation);
   if(example){
    const divider=el('div','lit-quick-divider');
    divider.style.cssText='height:1px!important;background:#cbd8dd!important;margin:2px 0 18px!important';
    const exampleLabel=el('strong','lit-quick-example-label',tr('EXEMPLU DE UTILIZARE','EXAMPLE'));
    exampleLabel.style.cssText='display:block!important;font-size:12px!important;letter-spacing:.06em!important;color:#536b7b!important;margin:0 0 9px!important';
    const ex=el('p','lit-quick-example-text',example);
    ex.style.cssText='font-size:16px!important;line-height:1.75!important;color:#30485c!important;margin:0 0 20px!important;font-style:italic!important';
    detail.append(divider,exampleLabel,ex);
   }
   if(wordMode&&language==='ro'){
    const note=el('p','lit-quick-source-note',tr('Pentru mai multe sensuri, pronunție și forme, consultă sursele lexicografice.','For additional senses, pronunciation and forms, consult lexical sources.'));
    note.style.cssText='font-size:13px!important;line-height:1.65!important;color:#435768!important;margin:14px 0 12px!important';
    detail.append(note);
    const safe=encodeURIComponent(String(word||'').trim());
    detail.append(detailAction('DEX online','https://dexonline.ro/definitie/'+safe));
    detail.append(detailAction('Wikționar',url||'https://ro.wiktionary.org/wiki/'+safe));
   }else if(url)detail.append(detailAction(tr('Wikționar','Wiktionary'),url));
   switchReading(true);
  };
  const makeOption=(title,fn,receiver=results)=>{
   const n=button(title,fn,'option');
   n.setAttribute('role','option');
   n.style.cssText+=';width:100%!important;min-height:48px!important;padding:12px 13px!important;font-size:15px!important;line-height:1.5!important;border-color:#c9d8de!important';
   receiver.append(n);
   return n;
  };
  const pin=(items)=>{
   clear(pinned);
   for(const [word,fn] of items.slice(0,5)){
    const n=button(word,fn,'chip');
    n.style.cssText+=';padding:8px 10px!important;min-height:37px!important;width:auto!important;border-color:#8d4e61!important;background:#f6e9ef!important;font-size:13px!important;line-height:1.5!important';
    pinned.append(n);
   }
  };
  const sectionNames=[
   ['gramatica',tr('Gramatică','Grammar')],
   ['abrevieri',tr('Prescurtări / abrevieri','Abbreviations')],
   ['unitati',tr('Unități de măsură','Units of measure')]
  ];
  let section='gramatica',selectedGroup='';
  const rowMeaning=(x)=>{showDetail(x[2],x[3],x[4])};
  const filteredReference=q=>catalog.filter(x=>x[0]===section&&
   (!selectedGroup||x[1]===selectedGroup)&&
   (!q||norm(x[2]).includes(norm(q))||norm(x[1]).includes(norm(q))));
  const safely=fn=>{try{fn()}catch(error){
   console.error?.('literature_quick_render_failed',error);
   showInfo(tr('Lista nu a putut fi afișată. Închide și încearcă din nou.','List unavailable. Close and try again.'));
  }};
  const drawReference=()=>{
   clear(results);
   const q=input.value.trim();
   const found=filteredReference(q);
   if(!found.length){pin([]);showInfo(tr('Nu există potriviri în această categorie.','No matches in this category.'));return}
   switchReading(false);
   const sorted=found.slice().sort((a,b)=>a[2].localeCompare(b[2],ui));
   const pinnedRows=section==='gramatica'&&!q&&!selectedGroup?
    ['Predicat','Adjectiv','Adverb','Timpul prezent','Timpul trecut']
     .map(name=>sorted.find(row=>row[2]===name)).filter(Boolean):
    sorted.slice(0,5);
   pin(pinnedRows.map(x=>[x[2],()=>rowMeaning(x)]));
   for(const row of sorted){
    const label=row[2]+' · '+row[1];
    makeOption(label,()=>rowMeaning(row));
   }
  };
  const drawGroups=()=>{
   clear(groups);
   const all=button(tr('Toate','All'),()=>{selectedGroup='';safely(drawGroups);safely(drawReference)},'group');
   all.style.cssText+=';padding:5px 7px!important;width:auto!important;background:'+(selectedGroup?'#f8fafc':'#e5eff4')+'!important;font-size:12px!important';
   groups.append(all);
   const groupsList=[...new Set(catalog.filter(x=>x[0]===section).map(x=>x[1]))];
   for(const group of groupsList){
    const btn=button(group,()=>{selectedGroup=group;safely(drawGroups);safely(drawReference)},'group');
    btn.style.cssText+=';padding:5px 7px!important;width:auto!important;font-size:12px!important;background:'+(selectedGroup===group?'#e5eff4':'#f8fafc')+'!important';
    groups.append(btn);
   }
  };
  const drawTabs=()=>{
   clear(tabs);
   for(const [id,label] of sectionNames){
    const b=button(label,()=>{
     section=id;selectedGroup='';input.value='';switchReading(false);
     safely(drawTabs);safely(drawGroups);safely(drawReference);
    },'tab');
    b.style.cssText+=';padding:7px 8px!important;flex:1 1 90px!important;text-align:center!important;background:'+(section===id?'#f0dbe3':'#eef3f6')+'!important;font-size:12px!important;border-color:#a2aeb9!important';
    tabs.append(b);
   }
  };
  const wiktionaryHost=(()=>{
   const allowed='ro en fr de it es pt pl hu hr sr tr nl ru sv no da fi cs sk sl bg el uk lt lv et is ga cy mt'.split(' ');
   return 'https://'+(allowed.includes(language)?language:'en')+'.wiktionary.org';
  })();
  const wikiLink=word=>wiktionaryHost+'/wiki/'+encodeURIComponent(word.replace(/ /g,'_'));
  const cleanWikitext=text=>String(text||'')
   .replace(/\{\{[^{}]*\}\}/g,'').replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g,'$2')
   .replace(/\[\[([^\]]+)\]\]/g,'$1').replace(/'{2,}/g,'')
   .replace(/<[^>]*>/g,'').replace(/\[[^\]]{1,80}\]/g,'').trim().slice(0,900);
  async function remoteDefinition(word,version){
   const controller=new AbortController();
   aborter=controller;
   const link=wikiLink(word);
   try{
    const query=new URLSearchParams({action:'parse',page:word,prop:'wikitext',format:'json',origin:'*'});
    const r=await fetch(wiktionaryHost+'/w/api.php?'+query,{signal:controller.signal});
    if(!r.ok)throw Error('http '+r.status);
    const json=await r.json();
    if(version!==requestSerial||!active)return;
    const wikitext=String(json.parse?.wikitext?.['*']||'');
    const def=wikitext.match(/^#(?![#*:])[ \t]*([^\n]+)/m);
    if(def){showDetail(word,cleanWikitext(def[1]),'',link);return}
   }catch(error){if(controller.signal.aborted)return}
   if(version===requestSerial&&active)
    showDetail(word,tr('Nu am găsit o definiție verificabilă în sursa online. Poți consulta intrarea Wikționarului.',
      'No verified online definition returned. Open the Wiktionary entry.'),'',link);
  }
  const selectWord=word=>{
   requestSerial++;
   if(aborter){aborter.abort();aborter=null}
   const local=(dict[language]||[]).find(x=>norm(x[0])===norm(word))||
    (grammar[language]||[]).find(x=>norm(x[1])===norm(word))?.slice(1);
   input.value=word;
   if(local)showDetail(local[0],local[1],local[2]);
   else{
    showDetail(word,tr('Se verifică definiția online…','Checking online meaning…'));
    remoteDefinition(word,requestSerial);
   }
  };
  function drawWords(remote=[]){
   clear(results);
   const q=input.value.trim();
   if(!q){pin([]);showInfo(tr('Tastează prima literă pentru sugestii.','Type a first letter to see suggestions.'));return}
   const fromLocal=[
    ...(dict[language]||[]).map(x=>x[0]),
    ...(grammar[language]||[]).map(x=>x[1]),
    ...remote
   ];
   const unique=new Map();
   for(const term of fromLocal){
    if(norm(term).startsWith(norm(q))&&!unique.has(norm(term)))unique.set(norm(term),term);
   }
   const sorted=[...unique.values()].sort((a,b)=>a.localeCompare(b,language)).slice(0,25);
   pin(sorted.slice(0,5).map(word=>[word,()=>selectWord(word)]));
   for(const word of sorted)makeOption(word,()=>selectWord(word));
   // Always provide a direct online fallback instead of showing a blank box.
   const lookup=button(tr('Caută definiția: ','Look up: ')+q,()=>selectWord(q),'lookup');
   lookup.style.cssText+=';width:100%!important;border-color:#8d4e61!important;margin-top:4px!important';
   results.append(lookup);
   if(!sorted.length){const item=el('p','',tr('Nu există sugestii locale; poți căuta online cuvântul.', 'No offline suggestions; try online lookup.'));item.style.cssText='margin:4px;color:#394b59!important;font-size:12px';results.prepend(item)}
  }
  const remoteSuggestions=async(q,version)=>{
   const controller=new AbortController();aborter=controller;
   try{
    const opts=new URLSearchParams({action:'query',list:'prefixsearch',pssearch:q,pslimit:'15',psnamespace:'0',format:'json',origin:'*'});
    const r=await fetch(wiktionaryHost+'/w/api.php?'+opts,{signal:controller.signal});
    if(!r.ok)throw Error('suggestions');
    const j=await r.json();
    if(version!==requestSerial||!active||input.value.trim()!==q)return;
    drawWords((j.query?.prefixsearch||[]).map(x=>x.title));
   }catch(error){/* Offline suggestions already visible; keep them. */}
  };
  function inputChanged(){
   requestSerial++;
   if(aborter){aborter.abort();aborter=null}
   if(remoteTimer!==null&&typeof clearTimeout==='function')clearTimeout(remoteTimer);
   remoteTimer=null;
   switchReading(false);
   if(wordMode){
    safely(()=>drawWords());
    const q=input.value.trim(),version=requestSerial;
    if(q&&typeof setTimeout==='function')
     remoteTimer=setTimeout(()=>remoteSuggestions(q,version),280);
   }else safely(drawReference);
  }
  input.addEventListener('input',inputChanged);
  // Android IME implementations differ; change/keyup are safe fallbacks.
  input.addEventListener('change',inputChanged);
  input.addEventListener('keyup',inputChanged);
  if(wordMode){
   safely(()=>drawWords());
   if(typeof input.focus==='function')input.focus();
  }else{
   safely(drawTabs);safely(drawGroups);safely(drawReference);
  }
 }
 const d=button(tr('📖 Dicționar','📖 Dictionary'),()=>open('dictionary'),'entry-button');
 const g=button(tr('📚 Gramatică rapidă','📚 Quick grammar'),()=>open('reference'),'entry-button');
 for(const x of [d,g]){
  x.className='secondary-btn lit-quick-entry-button';
  x.style.cssText+=';background:linear-gradient(180deg,#174963,#0a293d)!important;color:#fff!important;text-align:center!important;min-height:42px!important;border:2px solid #3994ae!important';
 }
 bar.append(d,g);
 if(typeof panel.prepend==='function')panel.prepend(bar);else panel.append(bar);
 return bar;
}
