// Compact, one-screen quick-reference tools for the Literature year picker.
// The dialog is not shown until the learner chooses Dictionary or Grammar.
// No AI token use on typed prefixes; original offline entries render instantly.
export function literatureQuickReferenceAttach(panel,options={}){
 if(!panel||typeof document==='undefined'||typeof document.createElement!=='function')return null;
 const interfaceLanguage=String(options.interfaceLanguage||'ro');
 const sourceLanguage=String(options.studyLanguage||'ro').toLowerCase();
 const inRomanian=interfaceLanguage==='ro';
 const localLanguage=sourceLanguage==='ro'?'ro':sourceLanguage==='en'?'en':null;
 const words=typeof LIT_QUICK_DICTIONARY!=='undefined'?LIT_QUICK_DICTIONARY:null;
 const grammar=typeof LIT_QUICK_GRAMMAR!=='undefined'?LIT_QUICK_GRAMMAR:null;
 if(!words||!grammar)return null;
 const t=(ro,en)=>inRomanian?ro:en;
 const create=(tag,className,text)=>{
  const el=document.createElement(tag);
  if(className)el.className=className;
  if(text!==undefined)el.textContent=text;
  return el;
 };
 const toolbar=create('div','lit-quick-entry');
 toolbar.setAttribute('data-lit-quick-entry','true');
 toolbar.style.cssText='display:flex;gap:8px;flex-wrap:wrap;justify-content:center;padding:8px 0;margin:4px 0 9px;border-bottom:1px solid rgba(150,150,150,.25)';
 const entryButton=(label,onClick)=>{
  const b=create('button','secondary-btn lit-quick-entry-button',label);
  b.type='button';
  b.style.cssText='min-height:38px;padding:8px 12px;flex:1 1 126px;border-radius:9px;white-space:normal;font-size:14px';
  b.onclick=onClick;
  return b;
 };
 const wikiLanguage=(()=>{
  // The set only contains documented Wikimedia language subdomains.
  const allowed='ro en fr de it es pt pl hu hr sr tr nl ru sv no da fi cs sk sl bg el uk lt lv et is ga cy mt sq bs mk be ca eu gl lb'.split(' ');
  return allowed.includes(sourceLanguage)?sourceLanguage:'en';
 })();
 const wikiBase='https://'+(wikiLanguage==='nb'?'no':wikiLanguage)+'.wiktionary.org';
 let activeOverlay=null, searchSerial=0, controller=null, pendingTimer=null;
 const removeOverlay=()=>{
  searchSerial++;
  if(pendingTimer!==null&&typeof clearTimeout==='function'){clearTimeout(pendingTimer);pendingTimer=null}
  if(controller)controller.abort();
  controller=null;
  if(activeOverlay?.parentNode)activeOverlay.parentNode.removeChild(activeOverlay);
  activeOverlay=null;
 };
 const styleButton=(el)=>{
  el.type='button';
  el.style.cssText='padding:8px 10px;border-radius:8px;border:1px solid rgba(130,130,130,.4);background:transparent;color:inherit;cursor:pointer;text-align:left;font:inherit';
  return el;
 };
 function open(mode){
  removeOverlay();
  const body=document.body||document.querySelector?.('#moduleContent');
  if(!body?.append)return;
  const overlay=create('div','lit-quick-overlay');
  overlay.setAttribute('data-lit-quick-overlay',mode);
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label',mode==='dictionary'?t('Dicționar','Dictionary'):t('Gramatică rapidă','Quick grammar'));
  overlay.style.cssText='position:fixed;inset:0;z-index:22000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.58);padding:12px;box-sizing:border-box';
  const dialog=create('section','lit-quick-dialog');
  dialog.style.cssText='box-sizing:border-box;display:flex;flex-direction:column;gap:8px;width:min(100%,520px);max-height:calc(100dvh - 40px);min-height:180px;padding:13px;border-radius:14px;background:#fff;color:#202020;box-shadow:0 12px 38px rgba(0,0,0,.35);overflow:hidden';
  const head=create('div','lit-quick-head');
  head.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:8px;flex:0 0 auto';
  const heading=create('strong','',mode==='dictionary'?t('📖 Dicționar','📖 Dictionary'):t('📚 Gramatică rapidă','📚 Quick grammar'));
  heading.style.cssText='font-size:17px;line-height:1.35';
  const close=styleButton(create('button','',t('Înapoi','Back')));
  close.style.cssText+=';min-width:80px;text-align:center;font-weight:650;border-color:#824151';
  close.onclick=removeOverlay;
  head.append(heading,close);
  const help=create('p','',mode==='dictionary'?
   t('Alege un cuvânt din sugestiile afișate de la prima literă.','Choose a word from suggestions beginning with the first letter.'):
   t('Definiții scurte, cu exemple. Alege un termen.','Short definitions and examples. Choose a term.'));
  help.style.cssText='font-size:12px;margin:0;color:#555;flex:0 0 auto';
  const input=create('input','lit-quick-input');
  input.type='search';input.autocomplete='off';input.autocapitalize='off';input.spellcheck=false;
  input.setAttribute('aria-label',mode==='dictionary'?t('Caută cuvânt','Search word'):t('Caută noțiune gramaticală','Search grammar term'));
  input.placeholder=mode==='dictionary'?t('Introdu un cuvânt…','Enter a word…'):t('Predicat, adjectiv, timp trecut…','Predicate, adjective, past tense…');
  input.style.cssText='flex:0 0 auto;box-sizing:border-box;width:100%;min-height:40px;padding:9px;border-radius:8px;border:1px solid #999;color:#222;background:#fff;font-size:16px';
  const detail=create('div','lit-quick-detail');
  detail.setAttribute('role','status');
  detail.setAttribute('aria-live','polite');
  detail.style.cssText='display:none;border-radius:9px;border:1px solid #d4c5c8;background:#faf5f6;padding:10px;flex:0 0 auto;font-size:14px;line-height:1.4;max-height:32dvh;overflow-y:auto';
  const results=create('div','lit-quick-results');
  results.setAttribute('role','listbox');
  results.setAttribute('aria-label',t('Sugestii și termeni','Suggestions and terms'));
  results.style.cssText='display:flex;flex-direction:column;gap:5px;overflow-y:auto;overscroll-behavior:contain;min-height:60px;max-height:55dvh;flex:1 1 auto;padding:2px';
  const foot=create('p','',mode==='dictionary'
   ?t('Definițiile locale funcționează offline. Pentru alte cuvinte se consultă Wikționarul, când există internet.','Local entries work offline. Other words are checked in Wiktionary when online.')
   :t('Ghid explicativ; terminologia și programa pot diferi în funcție de limba de studiu.','Reference guide; grammar terminology and curricula vary by study language.'));
  foot.style.cssText='margin:0;padding-top:6px;font-size:11px;color:#666;flex:0 0 auto;border-top:1px solid #ddd';
  dialog.append(head,help,input,detail,results,foot);
  overlay.append(dialog);
  overlay.addEventListener('click',event=>{if(event.target===overlay)removeOverlay()});
  overlay.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();removeOverlay()}});
  body.append(overlay);
  activeOverlay=overlay;
  const clear=node=>{if(node?.replaceChildren)node.replaceChildren();else node.textContent=''};
  const status=text=>{clear(results);results.append(create('p','',text))};
  const showDetail=(word,definition,example='',href='',source='')=>{
   clear(detail);detail.style.display='block';
   const title=create('strong','',word);
   title.style.cssText='display:block;margin-bottom:6px;font-size:15px';
   const explain=create('p','',definition);
   explain.style.cssText='margin:0 0 6px;white-space:pre-wrap';
   detail.append(title,explain);
   if(example){const ex=create('p','',t('Exemplu: ','Example: ')+example);ex.style.cssText='font-style:italic;margin:3px 0 0';detail.append(ex)}
   if(source==='wiktionary'){
    const note=create('p','',t('Sursa: Wikționar · CC BY-SA; verifică limba articolului.','Source: Wiktionary · CC BY-SA; check the entry language.'));
    note.style.cssText='margin:7px 0 0;font-size:11px;color:#666';detail.append(note);
   }
   if(href){
    const anchor=create('a','',t('Consultă intrarea în Wikționar','Open entry in Wiktionary'));
    anchor.href=href;anchor.target='_blank';anchor.rel='noopener noreferrer';
    anchor.style.cssText='display:block;margin-top:7px;color:#802f48;font-size:12px;text-decoration:underline';
    detail.append(anchor);
   }
  };
  const wikiLink=word=>wikiBase+'/wiki/'+encodeURIComponent(word.replace(/ /g,'_'));
  const clean=(html)=>{
   // Never mount third-party markup in the app; show readable text only.
   return String(html||'').replace(/<br\s*\/?>/gi,'\n')
    .replace(/<[^>]*>/g,' ')
    .replace(/&nbsp;|&#160;/gi,' ')
    .replace(/&amp;/gi,'&').replace(/&lt;/gi,'<').replace(/&gt;/gi,'>')
    .replace(/&quot;/gi,'"').replace(/&#39;/gi,"'")
    .replace(/\s+/g,' ').trim().slice(0,1400);
  };
  const definitionLanguage={
   ro:'Romanian',en:'English',fr:'French',de:'German',it:'Italian',es:'Spanish',
   pt:'Portuguese',pl:'Polish',hu:'Hungarian',hr:'Croatian',sr:'Serbo-Croatian',
   tr:'Turkish',nl:'Dutch',ru:'Russian',sv:'Swedish',no:'Norwegian',da:'Danish',
   fi:'Finnish',cs:'Czech',sk:'Slovak',sl:'Slovene',bg:'Bulgarian',el:'Greek',
   uk:'Ukrainian',lt:'Lithuanian',lv:'Latvian',et:'Estonian'
  };
  async function defineRemote(word,token){
   const url=wikiLink(word);
   const abort=new AbortController();
   controller=abort;
   const primary='https://en.wiktionary.org/api/rest_v1/page/definition/'+encodeURIComponent(word);
   const langKey=definitionLanguage[sourceLanguage]||sourceLanguage;
   try{
    const response=await fetch(primary,{signal:abort.signal});
    if(!response.ok)throw Error('wiktionary_definition_'+response.status);
    const data=await response.json();
    if(token!==searchSerial)return;
    const entries=data?.[langKey]||data?.[sourceLanguage]||
     (sourceLanguage==='en'?data?.English:null);
    const definitions=Array.isArray(entries)?entries.flatMap(x=>Array.isArray(x.definitions)?x.definitions:[]):[];
    const match=definitions.map(x=>clean(x.definition)).filter(Boolean).slice(0,2).join('; ');
    if(match){showDetail(word,match,'',url,'wiktionary');return}
   }catch(err){if(abort.signal.aborted)return}
   if(token!==searchSerial)return;
   // MediaWiki local extraction: availability depends on wiki extensions.
   try{
    const params=new URLSearchParams({
     action:'query',prop:'extracts',explaintext:'1',exintro:'1',titles:word,
     format:'json',origin:'*'
    });
    const response=await fetch(wikiBase+'/w/api.php?'+params,{signal:abort.signal});
    if(!response.ok)throw Error('entry_unavailable');
    const data=await response.json();
    if(token!==searchSerial)return;
    const pages=Object.values(data?.query?.pages||{});
    const extracted=String(pages[0]?.extract||'').trim().slice(0,1100);
    if(extracted){showDetail(word,extracted,'',url,'wiktionary');return}
   }catch(err){if(abort.signal.aborted)return}
   if(token===searchSerial)
    showDetail(word,t('Definiția nu este disponibilă offline sau sursa nu a răspuns. Consultă intrarea pentru sensul verificat.',
       'No offline definition is available, or the source did not respond. Open the entry to check its meaning.'),'',url);
  }
  const addOption=(label,onClick)=>{
   const button=styleButton(create('button','lit-quick-option',label));
   button.setAttribute('role','option');
   button.style.cssText+=';width:100%;background:#f8f8f8;border-color:#ddd;min-height:36px';
   button.onclick=onClick;results.append(button);
  };
  const chooseWord=word=>{
   searchSerial++;
   if(pendingTimer!==null&&typeof clearTimeout==='function'){clearTimeout(pendingTimer);pendingTimer=null}
   if(controller){controller.abort();controller=null}
   input.value=word;
   const data=(sourceLanguage==='ro'||sourceLanguage==='en')?
    literatureQuickDefinition(word,sourceLanguage):null;
   if(data)showDetail(data.word,data.definition,data.example);
   else{
    showDetail(word,t('Se caută definiția în Wikționar…','Looking up the definition in Wiktionary…'));
    defineRemote(word,searchSerial);
   }
  };
  function displayWords(query,remote=[]){
   clear(results);
   const key=literatureQuickNormal(query);
   if(!key){status(t('Tastează prima literă pentru sugestii.','Type the first letter for suggestions.'));return}
   const local=localLanguage?literatureQuickSuggestions(query,localLanguage,16):[];
   const unique=new Map();
   for(const candidate of [...local,...remote]){
    const title=String(candidate||'').trim();
    if(!title||!literatureQuickNormal(title).startsWith(key))continue;
    const normalized=literatureQuickNormal(title);
    if(!unique.has(normalized))unique.set(normalized,title);
   }
   const matches=[...unique.values()].sort((a,b)=>a.localeCompare(b,sourceLanguage)).slice(0,18);
   if(!matches.length){
    status(t('Se caută sugestii…','Searching for suggestions…'));
   }else for(const title of matches)addOption(title,()=>chooseWord(title));
  }
  function grammarOptions(query){
   if(!grammar)return;
   clear(results);
   const list=literatureQuickGrammarSearch(query,interfaceLanguage==='ro'?'ro':'en',65);
   if(!list.length){status(t('Nu există o definiție locală pentru termenul introdus.','No local definition for this term.'));return}
   for(const [group,title,definition,example] of list){
    addOption(title+' · '+group,()=>{
     searchSerial++;
     showDetail(title,definition,example);
    });
   }
  }
  input.addEventListener('input',()=>{
   searchSerial++;
   if(controller){controller.abort();controller=null}
   if(pendingTimer!==null&&typeof clearTimeout==='function'){clearTimeout(pendingTimer);pendingTimer=null}
   detail.style.display='none';
   const q=input.value.trim();
   if(mode==='grammar'){grammarOptions(q);return}
   displayWords(q);
   if(!q)return;
   const current=searchSerial;
   if(typeof setTimeout!=='function')return;
   pendingTimer=setTimeout(async()=>{
    const abort=new AbortController();controller=abort;
    const params=new URLSearchParams({
     action:'query',list:'prefixsearch',pssearch:q,pslimit:'16',psnamespace:'0',
     format:'json',origin:'*'
    });
    try{
     const response=await fetch(wikiBase+'/w/api.php?'+params,{signal:abort.signal});
     if(!response.ok)throw Error('suggestions_unavailable');
     const data=await response.json();
     if(current!==searchSerial||!activeOverlay?.parentNode)return;
     const remote=Array.isArray(data?.query?.prefixsearch)?
      data.query.prefixsearch.map(x=>x.title):[];
     displayWords(q,remote);
     if(!remote.length&&!results.querySelector?.('button'))
      status(t('Nu s-au găsit sugestii. Poți căuta alt cuvânt.','No suggestions found. Try another word.'));
    }catch(err){
     if(current===searchSerial&&!abort.signal.aborted&&!results.querySelector?.('button'))
      status(t('Rețeaua nu este disponibilă. Încearcă un termen din dicționarul local.',
       'Network unavailable. Try an offline dictionary entry.'));
    }
   },160);
  });
  if(mode==='grammar')grammarOptions('');
  else status(t('Tastează prima literă pentru sugestii.','Type the first letter for suggestions.'));
  if(mode==='dictionary'&&typeof input.focus==='function')input.focus();
 }
 const dict=entryButton(t('📖 Dicționar','📖 Dictionary'),()=>open('dictionary'));
 const guide=entryButton(t('📚 Gramatică rapidă','📚 Quick grammar'),()=>open('grammar'));
 toolbar.append(dict,guide);
 if(typeof panel.prepend==='function')panel.prepend(toolbar);
 else panel.append(toolbar);
 return toolbar;
}
