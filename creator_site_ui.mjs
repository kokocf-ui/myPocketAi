export const CREATOR_SITE_SCRIPT=String.raw`
const extraCreatorVisualStyles=[
 {id:'heritage',ro:'Clasic rafinat',en:'Refined classic',desc:'Tonuri calde, eleganță și tipografie editorială',colors:['#282131','#f7f0e9','#d9a5a4','#49344e'],font:'Georgia,serif'},
 {id:'coastal',ro:'Mediteranean',en:'Mediterranean',desc:'Lumină, crem și albastru marin',colors:['#15354b','#fff6e9','#ddb873','#2d6074'],font:'Georgia,serif'},
 {id:'forest',ro:'Natural și liniștit',en:'Natural and calm',desc:'Verde pădure și forme organice',colors:['#17382f','#f4f3e5','#b5cf9d','#40604e'],font:'Georgia,serif'},
 {id:'urban',ro:'Urban modern',en:'Urban modern',desc:'Contrast curajos și compoziție modernă',colors:['#17212e','#eff7f9','#64ccdc','#335a71'],font:'system-ui,sans-serif'},
 {id:'art',ro:'Artistic expresiv',en:'Artistic expressive',desc:'Culori vii și forme îndrăznețe',colors:['#382340','#fff3ef','#f7af65','#744465'],font:'system-ui,sans-serif'},
 {id:'minimal',ro:'Minimalist premium',en:'Premium minimalist',desc:'Spațiu alb, linii fine, accent discret',colors:['#273036','#fbfaf8','#b5b0a8','#566169'],font:'system-ui,sans-serif'},
 {id:'rustic',ro:'Rustic tradițional',en:'Rustic traditional',desc:'Teracotă, lemn și texturi calde',colors:['#4b2e24','#fff0df','#d79a69','#7e503c'],font:'Georgia,serif'},
 {id:'luxury',ro:'Lux contemporan',en:'Contemporary luxury',desc:'Antracit, auriu și spații generoase',colors:['#15181d','#eae8e1','#c3a46f','#313439'],font:'Georgia,serif'},
 {id:'soft',ro:'Delicat și prietenos',en:'Soft and welcoming',desc:'Roz pudrat, crem și colțuri moi',colors:['#503545','#fff2ed','#e6b4b7','#805c70'],font:'system-ui,sans-serif'},
 {id:'tech',ro:'Tehnologic',en:'Technology',desc:'Bleumarin, albastru electric și precizie',colors:['#0c2440','#edf4ff','#58b8ff','#1c486d'],font:'system-ui,sans-serif'},
 {id:'retro',ro:'Retro creativ',en:'Creative retro',desc:'Portocaliu, petrol și tipografie cu caracter',colors:['#244348','#fcf1db','#e49a56','#537c78'],font:'Georgia,serif'},
 {id:'wellness',ro:'Wellness luminos',en:'Light wellness',desc:'Tonuri naturale și atmosferă aerisită',colors:['#35423b','#f7f8f1','#cad6c1','#6d8273'],font:'system-ui,sans-serif'}
];
function extraCreatorStyleById(id){
 return extraCreatorVisualStyles.find(s=>s.id===id)||extraCreatorVisualStyles[0];
}
function extraCreatorStylePicker(selected,onSelect){
 const overlay=extraToolsEl('div','extra-creator-style-overlay');
 const windowEl=extraToolsEl('section','extra-creator-style-dialog');
 windowEl.setAttribute('role','dialog');windowEl.setAttribute('aria-modal','true');
 const title=extraToolsEl('h3','',extraToolsLocale('Alege direcția vizuală','Choose visual direction'));
 const explain=extraToolsEl('p','extra-work-note',extraToolsLocale('Alege o inspirație vizuală; site-ul este adaptat afacerii tale, nu copiat identic.','Select visual inspiration; your site is tailored to your business.'));
 const options=extraToolsEl('div','extra-creator-styles');
 const close=extraToolsBtn(extraToolsLocale('← Înapoi fără schimbare','← Back without changes'),()=>overlay.remove());
 close.classList.add('extra-creator-style-close');
 for(const style of extraCreatorVisualStyles){
  const b=extraToolsEl('button','extra-creator-style-card');
  b.type='button';b.setAttribute('aria-pressed',selected===style.id?'true':'false');
  const colors=extraToolsEl('span','extra-creator-swatches');
  for(const shade of style.colors.slice(0,3)){
   const swatch=extraToolsEl('i','extra-creator-swatch');swatch.style.background=shade;colors.append(swatch);
  }
  const copy=extraToolsEl('span','extra-creator-style-copy');
  copy.append(extraToolsEl('strong','',extraToolsLocale(style.ro,style.en)),
   extraToolsEl('small','',style.desc));
  b.append(colors,copy);b.onclick=()=>{onSelect(style);overlay.remove()};
  options.append(b);
 }
 const custom=extraToolsEl('p','extra-work-note',extraToolsLocale('Pentru un stil diferit, îl poți descrie ulterior în câmpul Detalii suplimentare.','For another style, add your own details later.'));
 windowEl.append(title,explain,options,custom,close);overlay.append(windowEl);
 overlay.addEventListener('click',event=>{if(event.target===overlay)overlay.remove()});
 document.body.append(overlay);
 close.focus();
}

function extraCreatorOptionText(p){
 const colors={model:['Culorile modelului','Template colours'],burgundy:['Vișiniu și crem','Burgundy and cream'],ocean:['Bleumarin și auriu','Navy and gold'],sage:['Verde și ivoire','Sage and ivory'],gold:['Antracit și auriu','Charcoal and gold']};
 const fonts={model:['Fontul modelului','Template typography'],classic:['Font clasic','Classic typography'],modern:['Font modern','Modern typography']};
 const moods={model:['Atmosfera modelului','Template atmosphere'],warm:['Cald și primitor','Warm and welcoming'],refined:['Rafinat și aerisit','Refined and spacious'],bold:['Îndrăzneț și energic','Bold and energetic']};
 const focus={offer:['Oferta și serviciile','Offer and services'],about:['Povestea afacerii','Business story'],contact:['Contactul rapid','Quick contact']};
 const label=v=>extraToolsLocale(v[0],v[1]);
 return label(colors[p.palette]||colors.model)+' · '+label(fonts[p.font]||fonts.model)+' · '+label(moods[p.mood]||moods.model)+' · '+label(focus[p.focus]||focus.offer);
}
function extraCreatorOptionPicker(current,onSave){
 const overlay=extraToolsEl('div','extra-creator-style-overlay extra-creator-option-overlay');
 const dialog=extraToolsEl('section','extra-creator-style-dialog extra-creator-option-dialog');
 dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
 dialog.setAttribute('aria-label',extraToolsLocale('Personalizează site-ul','Customize your website'));
 const heading=extraToolsEl('h3','',extraToolsLocale('Personalizează site-ul','Customize your website'));
 const lead=extraToolsEl('p','extra-work-note',extraToolsLocale('Alege câte o variantă. Modificările se văd în previzualizare fără generări AI.','Choose one in each group. Changes appear in the preview without using AI.'));
 const scroll=extraToolsEl('div','extra-creator-option-groups');
 const chosen={palette:current.palette||'model',font:current.font||'model',mood:current.mood||'model',focus:current.focus||'offer'};
 const groups=[
  {key:'palette',ro:'Culori',en:'Colours',items:[
   ['model','Culorile modelului','Template colours'],['burgundy','Vișiniu + crem','Burgundy + cream'],
   ['ocean','Bleumarin + auriu','Navy + gold'],['sage','Verde + ivoire','Sage + ivory'],
   ['gold','Antracit + auriu','Charcoal + gold']]},
  {key:'font',ro:'Tipografia',en:'Typography',items:[
   ['model','Fontul modelului','Template font'],['classic','Clasic','Classic'],['modern','Modern','Modern']]},
  {key:'mood',ro:'Atmosferă',en:'Atmosphere',items:[
   ['model','Ca în model','As in template'],['warm','Cald și primitor','Warm and welcoming'],
   ['refined','Rafinat și aerisit','Refined and spacious'],['bold','Îndrăzneț','Bold']]},
  {key:'focus',ro:'Ce evidențiem pe prima pagină?',en:'What should be highlighted first?',items:[
   ['offer','Oferta și serviciile','Offer and services'],['about','Povestea afacerii','Business story'],
   ['contact','Contact rapid','Quick contact']]}
 ];
 const swatches={model:[],burgundy:['#431f32','#fcf3ee','#d0a67b'],ocean:['#10283f','#f9f1e4','#d5b26e'],sage:['#274238','#faf8ea','#a8bc90'],gold:['#20242b','#f5f0e6','#c9a86d']};
 for(const group of groups){
  const set=extraToolsEl('section','extra-creator-option-set');
  set.append(extraToolsEl('h4','',extraToolsLocale(group.ro,group.en)));
  const tiles=extraToolsEl('div','extra-creator-option-choices');
  const buttons=[];
  for(const item of group.items){
   const button=extraToolsEl('button','extra-creator-option-chip');
   button.type='button';button.setAttribute('aria-pressed',chosen[group.key]===item[0]?'true':'false');
   if(group.key==='palette'&&swatches[item[0]]?.length){
    const colors=extraToolsEl('span','extra-creator-option-swatches');
    for(const c of swatches[item[0]]){const dot=extraToolsEl('i','');dot.style.background=c;colors.append(dot)}
    button.append(colors);
   }
   button.append(extraToolsEl('span','',extraToolsLocale(item[1],item[2])));
   button.onclick=()=>{chosen[group.key]=item[0];buttons.forEach(b=>b.setAttribute('aria-pressed',b===button?'true':'false'))};
   tiles.append(button);buttons.push(button);
  }
  set.append(tiles);scroll.append(set);
 }
 const actions=extraToolsEl('div','extra-creator-option-actions');
 const close=extraToolsBtn(extraToolsLocale('Înapoi','Back'),()=>overlay.remove());
 const apply=extraToolsBtn(extraToolsLocale('✓ Aplică și previzualizează','✓ Apply and preview'),()=>{onSave(chosen);overlay.remove()},true);
 actions.append(close,apply);dialog.append(heading,lead,scroll,actions);overlay.append(dialog);
 overlay.addEventListener('click',event=>{if(event.target===overlay)overlay.remove()});
 overlay.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();overlay.remove()}});
 document.body.append(overlay);apply.focus();
}
function extraCreatorSiteDetails(description,kind){
 const raw=String(description||'').trim();
 const counts=[];
 if(kind==='hotel'||kind==='guesthouse'){
  const rex=/\b(\d{1,3})\s*(camere?\s+(?:single|duble|dubla|double|matrimoniale|twin|triple|familiale|family|suite|standard|deluxe)|(?:single|duble|dubla|double|matrimoniale|twin|triple|familiale|suite|standard|deluxe)|apartamente?|rooms?\s+(?:single|double|twin|family|suite|deluxe|standard)|apartments?|suites?)\b/gi;
  for(const match of raw.matchAll(rex)){
   const value=match[1];let title=match[2].trim();
   if(/^(?:single|duble|dubla|double|matrimoniale|twin|triple|familiale|suite|standard|deluxe)$/i.test(title))title='camere '+title;if(!counts.some(s=>s.title.toLowerCase()===title.toLowerCase()))counts.push({value,title});
  }
 }
 const amenities=[];
 const amenityPatterns=[
  [/mic\s+dejun\s+inclus|breakfast\s+included/i,'Mic dejun inclus','Breakfast included'],
  [/bucătărie\s+(?:la\s+)?comun|shared kitchen/i,'Bucătărie comună','Shared kitchen'],
  [/sal[aă]\s+de\s+mese|dining (?:room|area)/i,'Sală de mese','Dining area'],
  [/parcare|parking/i,'Parcare','Parking'],
  [/wi[\s-]?fi|internet/i,'Wi-Fi / internet','Wi-Fi / Internet'],
  [/teras[aă]|terrace/i,'Terasă','Terrace'],
  [/gr[aă]din[aă]|garden/i,'Grădină','Garden'],
  [/piscin[aă]|pool/i,'Piscină','Pool']
 ];
 for(const [re,ro,en] of amenityPatterns)if(re.test(raw))amenities.push({ro,en});
 const segments=raw.split(/[.;\n]+/).map(x=>x.trim()).filter(Boolean);
 const short=(kind==='hotel'||kind==='guesthouse')&&amenities.some(x=>x.ro==='Mic dejun inclus')?
  'Cazare cu mic dejun inclus':(segments[0]||raw).replace(/\b(?:Are|We have|There are)\s+\d+.*$/i,'').trim().slice(0,165);
 const remainder=(kind==='hotel'||kind==='guesthouse'?segments.slice(1):segments).slice(0,5);
 return {counts:counts.slice(0,12),amenities:amenities.slice(0,8),short:short||segments[0]||raw.slice(0,130),remainder};
}
function extraCreatorLocalHtml(name,activity,description,style,contact,language,options={}){
 // Static, script-free local design proof; every user string is escaped before rendering.
 const styleId=options.styleId||extraCreatorVisualStyles[
   String(name+'|'+style).split('').reduce((n,ch)=>(n*31+ch.charCodeAt(0))>>>0,0)%extraCreatorVisualStyles.length
 ].id;
 const scheme=extraCreatorStyleById(styleId),colors=scheme.colors;
 const dark=colors[0],light=colors[1],accent=colors[2],panel=colors[3];
 const type=options.kind||(/pensiun|cazare|hotel|guest/i.test(activity)?'hotel':/restaurant|cafe|pizzer/i.test(activity)?'restaurant':'other');
 const code=String(name+'|'+style+'|'+type).split('').reduce((n,ch)=>(n*37+ch.charCodeAt(0))>>>0,11);
 const layout=code%3;
 const bilingual=language==='both';
 const picture=typeof options.photo==='string'&&/^data:image\/(?:png|jpeg|webp);base64,[a-z0-9+/=]+$/i.test(options.photo)?options.photo:'';
 const safe=s=>extraCreatorEscape(String(s||''));
 const copies={
  ro:{about:'Povestea noastră',features:type==='hotel'?'Camere și apartamente':'Ce oferim',amenities:'Facilități',contact:'Contact',explore:'Descoperă oferta',aboutUs:'Despre',intro:'Oferta pe scurt',find:'Contactează-ne',none:'Conținut furnizat de proprietar',demo:'Concept demonstrativ – nepublicat',photo:'Fotografie furnizată de proprietar',more:'Detalii'},
  en:{about:'Our story',features:type==='hotel'?'Rooms and apartments':'What we offer',amenities:'Amenities',contact:'Contact',explore:'Explore our offer',aboutUs:'About',intro:'At a glance',find:'Get in touch',none:'Content supplied by owner',demo:'Demonstration – not published',photo:'Photo supplied by owner',more:'Details'}
 };
 const serviceBlock=(lang,info)=>{
  const t=copies[lang],en=lang==='en',e=extraCreatorSiteDetails(info,type);
  const aiCopy=options.aiCopy&&typeof options.aiCopy==='object'?options.aiCopy[lang]||null:null;
  const typeNames={
   hotel:['Pensiune / cazare','Guesthouse / accommodation'],
   restaurant:['Restaurant / cafenea','Restaurant / café'],
   services:['Servicii locale','Local services'],
   salon:['Salon / frumusețe','Beauty salon'],
   shop:['Magazin','Shop'],
   personal:['Portofoliu / eveniment','Portfolio / event']
  };
  const activityText=typeNames[type]?(en?typeNames[type][1]:typeNames[type][0]):activity;
  if(en&&type==='hotel'){
   const original=extraCreatorSiteDetails(description,type);
   if(!e.counts.length)e.counts=original.counts;
   if(!e.amenities.length)e.amenities=original.amenities;
  }
  if(en&&type==='hotel'){
   e.counts=e.counts.map(item=>{
    const title=item.title.toLowerCase();
    const label=/apartament|apartment/.test(title)?'apartments':/single/.test(title)?'single rooms':/dub|double/.test(title)?'double rooms':/twin/.test(title)?'twin rooms':/suite/.test(title)?'suites':item.title;
    return {value:item.value,title:label};
   });
  }
  const serviceCopy=Array.isArray(aiCopy?.services)?aiCopy.services.slice(0,8).filter(x=>x&&typeof x.title==='string').map(x=>({title:String(x.title).slice(0,85),detail:String(x.detail||'').slice(0,350)})):[];
  const stats=e.counts.map(item=>'<article class="metric"><b>'+safe(item.value)+'</b><span>'+safe(item.title)+'</span></article>').join('');
  const amenityHtml=e.amenities.map(a=>'<article class="amenity"><span class="round"></span><b>'+safe(en?a.en:a.ro)+'</b></article>').join('');
  const items=e.remainder.map((detail,i)=>'<article class="service"><span class="number">0'+(i+1)+'</span><p>'+safe(detail)+'</p></article>').join('');
  const generatedServices=serviceCopy.map((service,i)=>'<article class="service"><span class="number">0'+(i+1)+'</span><b>'+safe(service.title)+'</b><p>'+safe(service.detail)+'</p></article>').join('');
  const hasContent=stats||amenityHtml||generatedServices||items;
  const heroTitle=type==='hotel'?(en?'A place to stay':'Un loc în care să te cazezi'):type==='restaurant'?(en?'Discover our cuisine':'Descoperă preparatele noastre'):t.explore;
  const heroCaption=type==='hotel'?e.short:type==='restaurant'?(en?'Explore the menu and services below.':'Descoperă mai jos meniul și serviciile.'): (en?'Explore the details supplied by this business.':'Descoperă oferta acestei afaceri.');
  const heroHeading=typeof aiCopy?.headline==='string'?aiCopy.headline.slice(0,140):heroTitle;
  const heroDescription=typeof aiCopy?.intro==='string'?aiCopy.intro.slice(0,400):heroCaption;
  const aboutText=typeof aiCopy?.about==='string'?aiCopy.about.slice(0,1300):'';
  return '<div class="locale-content lang-'+lang+'"><div class="hero '+(layout===1?'centered':layout===2?'split':'editorial')+'">'+
    '<div class="hero-content"><div class="eyebrow">'+safe(activityText)+'</div><h1>'+safe(name)+'</h1>'+
    '<h2>'+safe(heroHeading)+'</h2><p>'+safe(heroDescription)+'</p><a class="cta" href="#offer-'+lang+'">'+t.explore+'</a></div>'+
    (picture?'<div class="hero-photo"><img alt="'+t.photo+'" src="'+picture+'"></div>':
      '<div class="graphic" aria-label="'+t.none+'"><span>'+safe(name.slice(0,1).toUpperCase())+'</span><small>'+t.demo+'</small></div>')+
    '</div><section class="intro" id="about-'+lang+'"><span class="eyebrow">'+t.aboutUs+'</span><h2>'+t.about+'</h2><p>'+
    (aboutText?safe(aboutText):(type==='hotel'?(en?'Accommodation and amenities, based on the details provided by the owner.':'Cazare și facilități, conform informațiilor oferite de proprietar.'):(en?'All information comes from the business owner.':'Informațiile sunt prezentate pe baza descrierii proprietarului.')))+
    '</p></section><section class="offers" id="offer-'+lang+'"><span class="eyebrow">'+t.intro+'</span><h2>'+t.features+'</h2>'+
    (stats?'<div class="metrics">'+stats+'</div>':'')+
    (serviceCopy.length?'<div class="services">'+generatedServices+'</div>':(items?'<div class="services">'+items+'</div>':''))+
    (amenityHtml?'<h3>'+t.amenities+'</h3><div class="amenities">'+amenityHtml+'</div>':'')+
    (!hasContent?'<p>'+safe(info)+'</p>':'')+
    '</section><section class="contact" id="contact-'+lang+'"><span class="eyebrow">'+t.contact+'</span><h2>'+t.find+'</h2><p>'+
    safe(contact|| (en?'Add verified contact details here.':'Adaugă aici date de contact verificate.'))+
    '</p></section><footer>'+safe(name)+' · '+t.demo+'</footer></div>';
 };
 // A no-cost design preview cannot claim a translation was performed by AI.
 // Once Eva generates the site, the AI-supplied English copy replaces this placeholder.
 const enText=String(options.descriptionEn||'').trim();
 const englishPreview= enText || 'Translation into English will be prepared by Eva when you generate your website with AI.';
 const firstLang=language==='en'?'en':'ro';
 const english=serviceBlock('en',englishPreview);
 const romanian=serviceBlock('ro',String(description||''));
 const sections=bilingual?romanian+english:firstLang==='en'?english:romanian;
 const controls=bilingual?'<input type="radio" id="lang-ro" name="lang" checked><input type="radio" id="lang-en" name="lang">'+
  '<div class="languages"><label for="lang-ro">RO</label><label for="lang-en">EN</label></div>':'';
 const font=scheme.font;
 return '<!doctype html><html lang="'+(bilingual?'ro':firstLang)+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
  '<meta http-equiv="Content-Security-Policy" content="default-src &#39;none&#39;;style-src &#39;unsafe-inline&#39;;img-src data:;">'+
  '<title>'+safe(name)+'</title><style>'+
  '*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:'+light+';color:'+dark+';font:16px/1.6 system-ui,sans-serif}a{text-decoration:none;color:inherit}'+
  'body>input[type=radio]{position:absolute;opacity:0;pointer-events:none}.languages{display:flex;gap:0;position:sticky;top:0;z-index:3;justify-content:flex-end;background:'+dark+';padding:9px max(5%,15px)}'+
  '.languages label{cursor:pointer;padding:7px 13px;color:'+light+';border:1px solid '+accent+';font-weight:700}#lang-ro:checked~.languages label[for=lang-ro],#lang-en:checked~.languages label[for=lang-en]{background:'+accent+';color:'+dark+'}'+
  '#lang-ro:checked~.site-shell .lang-en,#lang-en:checked~.site-shell .lang-ro{display:none}'+
  '.hero{min-height:480px;display:flex;gap:24px;align-items:center;justify-content:space-between;background:'+dark+';color:'+light+';padding:55px max(6%,22px)}'+
  '.hero.centered{flex-direction:column;text-align:center}.hero.centered .hero-content{max-width:680px}.hero.split{background:linear-gradient(140deg,'+dark+' 63%,'+panel+')}'+
  '.hero-content{max-width:570px;flex:1 1 55%}.eyebrow{color:'+accent+';font-weight:800;letter-spacing:.18em;text-transform:uppercase;font-size:12px}h1{font:700 clamp(40px,7vw,84px)/1.06 '+font+';margin:20px 0 10px;letter-spacing:-.025em;overflow-wrap:anywhere}'+
  '.hero h2{font:500 clamp(19px,3vw,28px)/1.2 '+font+';margin:6px 0 18px;opacity:.87}.hero p{font-size:clamp(15px,2vw,19px);line-height:1.65;max-width:500px}'+
  '.cta{display:inline-block;background:'+accent+';color:'+dark+';padding:12px 22px;margin-top:18px;font-weight:800;border-radius:7px}.hero-photo{flex:0 1 41%;height:360px;overflow:hidden;border-radius:10px}.hero-photo img{height:100%;width:100%;object-fit:cover}'+
  '.graphic{flex:0 1 36%;height:320px;min-width:170px;border-radius:45% 8% 36% 8%;background:linear-gradient(125deg,'+panel+','+accent+');box-shadow:22px 18px 0 #ffffff14;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}.graphic span{font:700 150px/1 '+font+';color:'+dark+';opacity:.53}.graphic small{font-size:10px;text-align:center;padding:5px;background:#ffffff27}'+
  'section{padding:70px max(7%,22px)}section h2{font:700 clamp(28px,4.8vw,49px)/1.13 '+font+';margin:12px 0 25px}section p{max-width:820px;font-size:18px}.intro{background:'+light+'}.offers{background:#fff}.offers .eyebrow{color:'+panel+'}'+
  '.metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:24px 0}.metric{background:'+light+';padding:25px 16px;border-top:4px solid '+accent+';border-radius:10px}.metric b{font:700 52px/1 '+font+';display:block;color:'+dark+'}.metric span{font-size:15px}'+
  '.amenities{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px}.amenity{padding:16px;display:flex;gap:12px;align-items:center;background:'+light+';border-radius:9px}.round{display:block;width:12px;height:12px;flex:0 0 12px;border-radius:100%;background:'+accent+'}'+
  '.services{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px;margin:25px 0}.service{border-left:4px solid '+accent+';padding:12px 19px;background:'+light+'}.service .number{font-size:12px;font-weight:800;color:'+panel+'}.service p{font-size:16px;margin:4px 0;overflow-wrap:anywhere}'+
  '.contact{background:'+panel+';color:'+light+'}.contact .eyebrow{color:'+accent+'}.contact p{overflow-wrap:anywhere}footer{background:'+dark+';color:'+light+';padding:22px max(7%,22px);font-size:13px}'+
  '@media(max-width:680px){.hero,.hero.centered{flex-direction:column;align-items:stretch;min-height:0;padding:48px 22px}.hero-photo,.graphic{flex:0 0 auto;width:100%;height:240px}.graphic{min-width:0}.graphic span{font-size:90px}section{padding:46px 22px}.metrics{grid-template-columns:repeat(3,minmax(0,1fr))}.metric{padding:15px 9px}.metric b{font-size:35px}.metric span{font-size:12px}.amenities,.services{grid-template-columns:1fr}h1{font-size:43px}.hero p{font-size:16px}}'+
  '</style></head><body>'+controls+'<div class="site-shell">'+sections+'</div></body></html>';
}
function extraCreatorHome(work){
 const area=work.area;area.replaceChildren();
 extraCreatorNotice(area,'Mod de verificare: poți testa machetele locale. Generarea AI și verificarea abonamentelor nu sunt încă activate.','Preview mode: local concepts are available. AI generation and subscription validation are not enabled.');
 extraCreatorCard(area,'🌐','Creează pagini web','Create websites',
  'Alege vizual un stil, descrie afacerea și vezi o previzualizare organizată.',
  'Pick a visual style, describe the business and preview a structured site.',
  ()=>extraCreatorWorkingWebsite(work));
 extraCreatorCard(area,'🎨','Creează imagini','Create images',
  'Aici va fi generarea AI cu salvare în Galerie, după conectarea motorului.',
  'Image generation and Gallery saving will be available after connecting the model.',
  ()=>extraCreatorWorkingImages(work));
}
function extraCreatorWebsite(work){
 const area=work.area;area.replaceChildren();
 area.append(extraToolsEl('h3','extra-creator-subtitle',extraToolsLocale('Creează pagini web','Create websites')));
 extraCreatorNotice(area,'Machetă locală: în acest APK testăm stilul și structura. Generarea cu Eva și accesul Premium verificat sunt încă neactivate.','Local draft: in this APK you can test style and structure. Eva generation and verified Premium access are not enabled.');
 const name=extraToolsField(area,extraToolsLocale('Numele afacerii','Business name'),'text',extraToolsLocale('Ex.: Aramis','e.g. Aramis'));
 const type=extraToolsField(area,extraToolsLocale('Domeniu','Business category'),'select');
 const categories=[['guesthouse','Pensiune','Guesthouse'],['hotel','Hotel','Hotel'],['restaurant','Restaurant','Restaurant'],['cafe','Cafenea / ceainărie','Café / tea room'],['bar','Bar / pub','Bar / pub'],['services','Meseriași / servicii','Trades / services'],['salon','Salon / frumusețe','Beauty salon'],['shop','Magazin / produse','Shop'],['personal','Portofoliu / eveniment','Portfolio / event'],['other','Alt domeniu','Other']];
 for(const [key,ro,en] of categories){const option=extraToolsEl('option','',extraToolsLocale(ro,en));option.value=key;type.append(option)}
 const desc=extraToolsField(area,extraToolsLocale('Descrie serviciile și particularitățile','Describe services and details'),'textarea',
  extraToolsLocale('Ex.: 5 camere single, 10 duble, mic dejun inclus, bucătărie la comun','e.g. 5 single rooms, 10 doubles, breakfast included'));
 const businessDetails=extraCreatorBusinessControls(area,type,()=>{
  work.siteAiCopy=null;work.siteHtml='';
  work.creatorForm?.preview?.replaceChildren();
  if(work.creatorForm?.note)work.creatorForm.note.textContent=extraToolsLocale('Domeniul sau datele s-au schimbat. Regenerează previzualizarea.','Business type or details changed. Rebuild the preview.');
 });
 let selected=extraCreatorVisualStyles[0];
 const styleButton=extraToolsBtn(extraToolsLocale('🎨 Vezi modele profesionale de site','🎨 Browse professional website layouts'),()=>extraCreatorStylePicker(selected.id,value=>{
  selected=value;styleLabel.textContent=extraToolsLocale('Model ales: ','Selected layout: ')+extraToolsLocale(value.ro,value.en);
 },{name:name.value.trim(),kind:type.value,activity:type.options[type.selectedIndex]?.textContent||'',
   description:desc.value.trim(),contact:contact.value.trim(),photo:photoData,gallery:guesthouseGallery.getGallery(),language:lang.value,prefs:designPrefs,businessDetails:businessDetails.getDetails()}));
 styleButton.classList.add('extra-creator-style-pick');
 const styleLabel=extraToolsEl('p','extra-creator-selected-style',extraToolsLocale('Stil ales: ','Selected style: ')+extraToolsLocale(selected.ro,selected.en));
 area.append(styleButton,styleLabel);
 const designPrefs={palette:'model',font:'model',mood:'model',focus:'offer'};
 const extra=extraToolsEl('input','extra-creator-internal-options');extra.type='hidden';
 extra.value=extraCreatorOptionText(designPrefs);area.append(extra);
 const designSummary=extraToolsEl('p','extra-creator-option-summary',extraCreatorOptionText(designPrefs));
 const designButton=extraToolsBtn(extraToolsLocale('🎛 Personalizează site-ul','🎛 Customize website'),()=>extraCreatorOptionPicker(designPrefs,next=>{
  Object.assign(designPrefs,next);extra.value=extraCreatorOptionText(designPrefs);
  designSummary.textContent=extra.value;
  extra.dispatchEvent(new Event('input',{bubbles:true}));
  if(work.siteHtml&&work.creatorForm)work.creatorForm.generate();
 }));
 designButton.classList.add('extra-creator-design-button');
 area.append(designButton,designSummary);
 const lang=extraToolsField(area,extraToolsLocale('Limba site-ului','Website language'),'select');
 for(const [key,label] of [['ro','Română'],['en','English'],['both','Română + English']]){const opt=extraToolsEl('option','',label);opt.value=key;lang.append(opt)}
 lang.value=state.language==='en'?'en':'ro';
 const translateNote=extraToolsEl('p','extra-creator-translation-note');
 const updateTranslationNote=()=>{
  translateNote.textContent=lang.value==='ro'?
   extraToolsLocale('Conținutul este în română.','Content will be in Romanian.'):
   extraToolsLocale('Eva va traduce automat din română. Previzualizarea gratuită arată structura, iar traducerea reală apare după generarea AI.','Eva translates automatically from Romanian. Free preview shows the layout; the actual translation appears after AI generation.');
 };
 lang.addEventListener('change',updateTranslationNote);
 updateTranslationNote();area.append(translateNote);
 const management=extraCreatorManagementForm(area);
 const contact=extraToolsField(area,extraToolsLocale('Date de contact verificate (opțional)','Verified contact details (optional)'),'text',extraToolsLocale('E-mail, telefon sau adresă reală','Real email, phone or address'));
 const photo=extraToolsEl('input','extra-creator-photo');photo.type='file';photo.accept='image/jpeg,image/png,image/webp';photo.hidden=true;
 const photoLabel=extraToolsEl('p','extra-work-note','');
 let photoData='';
 photo.onchange=async()=>{
  try{
   const file=photo.files?.[0];if(!file)return;
   photoData=await guesthouseGallery.preparePhoto(file);
   photoLabel.textContent=extraToolsLocale('✓ Fotografia principală a fost adăugată.','✓ Main photograph added.');
  }catch(e){extraToolsStatus(e.message)}
  finally{photo.value=''}
 };
 const photoButton=extraToolsBtn(extraToolsLocale('📷 Fotografie principală','📷 Main photo'),()=>photo.click());
 area.append(photo,photoButton,photoLabel);
 const updatePhotoGuidance=()=>{
  const hints={
   guesthouse:['🏡 Fotografia pensiunii','Guesthouse exterior','Alege o fotografie reală a pensiunii.','Choose a real photograph of the guesthouse.'],
   hotel:['🏨 Fotografia hotelului','Hotel photograph','Alege exteriorul hotelului sau un spațiu reprezentativ.','Choose the hotel exterior or a representative space.'],
   cafe:['☕ Fotografia cafenelei','Café photograph','Prezintă spațiul sau băuturile reale.','Show the space or actual drinks.'],
   bar:['🍸 Fotografia barului','Bar photograph','Prezintă atmosfera reală a barului.','Show the actual bar atmosphere.'],
   restaurant:['🍽 Fotografia localului','Venue photograph','Alege o fotografie reprezentativă a restaurantului, cafenelei sau barului.','Choose a representative restaurant, café or bar photograph.'],
   services:['🛠 Fotografie reprezentativă','Representative photo','Poate fi o lucrare reală executată sau echipa.','Choose real completed work or your team.'],
   salon:['✂ Fotografia salonului','Salon photograph','Alege o imagine a salonului sau a serviciului principal.','Choose the salon or its principal service.'],
   shop:['🛍 Fotografia magazinului','Shop photograph','Alege imaginea magazinului sau a unui produs reprezentativ.','Choose your shop or featured product.'],
   personal:['🖼 Fotografie de prezentare','Portfolio photograph','Alege o imagine reprezentativă pentru portofoliu sau eveniment.','Choose a representative portfolio or event image.'],
   other:['📷 Imagine principală','Main photograph','Alege fotografia care reprezintă cel mai bine activitatea.','Choose a photo that best represents this business.']
  };
  const h=hints[type.value]||hints.other;
  photoButton.textContent=extraToolsLocale(h[0],h[1]);
  photoLabel.textContent=extraToolsLocale(h[2],h[3]);
 };
 type.addEventListener('change',updatePhotoGuidance);
 updatePhotoGuidance();
 const guesthouseGallery=extraCreatorGuesthouseControls(area,type,desc);
 const business=extraToolsEl('details','extra-creator-backend-choices');
 const caption=extraToolsEl('summary','',extraToolsLocale('⚙ Funcții ale site-ului (backend)','⚙ Website functions (backend)'));
 business.append(caption,extraToolsEl('p','extra-work-note',extraToolsLocale(
  'Alege funcțiile dorite. Eva le include în proiectul editabil, dar devin active numai după instalarea și publicarea backendului în contul clientului.',
  'Choose required functionality. Eva includes it in the editable project; it becomes live only after deploying the backend to the client account.')));
 const featureContact=extraToolsEl('input','');featureContact.type='checkbox';featureContact.checked=false;
 const contactLabel=extraToolsEl('label','extra-creator-backend-option');
 contactLabel.append(featureContact,extraToolsEl('span','',extraToolsLocale('Mesaje de la vizitatori și inbox privat','Customer messages and private inbox')));
 const featureBooking=extraToolsEl('input','');featureBooking.type='checkbox';featureBooking.checked=false;
 const bookingLabel=extraToolsEl('label','extra-creator-backend-option');
 bookingLabel.append(featureBooking,extraToolsEl('span','',extraToolsLocale('Solicitări de rezervări sau programări','Booking and appointment requests')));
 const featureShop=extraToolsEl('input','');featureShop.type='checkbox';
 const shopLabel=extraToolsEl('label','extra-creator-backend-option');
 shopLabel.append(featureShop,extraToolsEl('span','',
  extraToolsLocale('Catalog, comenzi și plăți prin furnizor extern','Catalog, orders and external payment provider')));
 const autoConfirm=extraToolsEl('input','');autoConfirm.type='checkbox';
 const confirmLabel=extraToolsEl('label','extra-creator-backend-option');
 confirmLabel.append(autoConfirm,extraToolsEl('span','',
  extraToolsLocale('Confirmare automată numai dacă există disponibilitate','Auto-confirm only when availability is verified')));
 business.append(contactLabel,bookingLabel,shopLabel,confirmLabel);
 const commercial=extraToolsEl('details','extra-creator-commerce-options');
 commercial.append(extraToolsEl('summary','',extraToolsLocale('Calendar și produse (opțional)','Calendar and products (optional)')));
 const field=(label,type='text')=>{
  const wrap=extraToolsEl('label','extra-work-label');wrap.append(extraToolsEl('span','',label));
  const input=extraToolsEl('input','extra-work-input');input.type=type;
  wrap.append(input);commercial.append(wrap);return input;
 };
 const capacity=field(extraToolsLocale('Capacitate simultană (mese / programări)','Simultaneous seats / appointments'),'number');
 capacity.min='0';capacity.max='999';capacity.value='0';
 const currencyLabel=extraToolsEl('label','extra-work-label');
 currencyLabel.append(extraToolsEl('span','',extraToolsLocale('Monedă produse','Product currency')));
 const currency=extraToolsEl('select','extra-work-input');
 for(const code of ['GBP','EUR','RON','USD']){
  const option=extraToolsEl('option','',code);option.value=code;currency.append(option)
 }
 currencyLabel.append(currency);commercial.append(currencyLabel);
 const productList=extraToolsEl('div','extra-creator-product-list'),products=[];
 const refreshProducts=()=>{
  productList.replaceChildren();
  for(const [idx,item] of products.entries()){
   const row=extraToolsEl('div','extra-creator-product-item');
   const name=extraToolsEl('input','extra-work-input');name.placeholder=extraToolsLocale('Numele produsului','Product name');
   name.value=item.title;name.maxLength=95;
   name.oninput=()=>item.title=name.value.slice(0,95);
   const price=extraToolsEl('input','extra-work-input');price.type='number';price.step='0.01';price.min='0';
   price.placeholder=extraToolsLocale('Preț','Price');price.value=item.priceMinor?(item.priceMinor/100).toFixed(2):'';
   price.oninput=()=>item.priceMinor=Math.max(0,Math.round(Number(price.value||0)*100));
   const stock=extraToolsEl('input','extra-work-input');stock.type='number';stock.min='0';stock.max='99999';
   stock.placeholder=extraToolsLocale('Stoc','Stock');stock.value=item.inventory||'';
   stock.oninput=()=>item.inventory=Math.max(0,Math.floor(Number(stock.value)||0));
   const remove=extraToolsBtn(extraToolsLocale('Șterge','Remove'),()=>{products.splice(idx,1);refreshProducts()});
   row.append(name,price,stock,remove);productList.append(row);
  }
 };
 const addProduct=extraToolsBtn(extraToolsLocale('＋ Adaugă produs','＋ Add product'),()=>{
  if(products.length>=30)return extraToolsStatus(extraToolsLocale('Maximum 30 produse în prima versiune demonstrativă.','Maximum 30 products in the initial demo.'));
  products.push({id:'p-'+(products.length+1)+'-'+Date.now().toString(36),title:'',priceMinor:0,inventory:0});
  refreshProducts();
 });
 commercial.append(productList,addProduct);
 business.append(commercial);
 const privacy=field(extraToolsLocale('Politica de confidențialitate: URL HTTPS, dacă există deja','Privacy policy: HTTPS URL, if already available'),'url');
 business.append(extraToolsEl('p','extra-work-note',extraToolsLocale(
  'Fără configurația de capacitate și furnizorii autorizați, rezervările și comenzile rămân solicitări. Prețurile sunt introduse numai de proprietar.',
  'Without capacity configuration and authorized providers, bookings and orders remain requests. Only the owner enters prices.')));
 area.append(business);
 const preview=extraToolsEl('div','extra-creator-preview-wrap');
 const note=extraToolsEl('p','extra-creator-preview-info',extraToolsLocale('Apasă Previzualizează pentru a vedea site-ul demonstrativ.','Tap Preview to see your local website draft.'));
 const generate=()=>{
  const title=name.value.trim(),story=desc.value.trim();
  if(!title||!story){note.textContent=extraToolsLocale('Completează numele afacerii și serviciile oferite.','Enter the business name and services.');return}
  work.creatorProjectSettings=management.getConfig();
  work.siteHtml=extraCreatorLocalHtml(title,type.options[type.selectedIndex]?.textContent||type.value,story,selected.ro+' '+extra.value,contact.value,lang.value,
   {kind:type.value,businessDetails:businessDetails.getDetails(),styleId:selected.id,photo:photoData,gallery:guesthouseGallery.getGallery(),prefs:designPrefs,aiCopy:work.siteAiCopy||null});
  const frame=extraToolsEl('iframe','extra-creator-preview');
  frame.setAttribute('sandbox','');frame.title=extraToolsLocale('Machetă locală a site-ului','Local website draft');
  frame.srcdoc=work.siteHtml;preview.replaceChildren(frame);
  note.textContent=lang.value==='ro'?
  extraToolsLocale('Previzualizare locală fără AI; verifică datele înainte de publicare.','Local preview without AI; review before publishing.'):
  extraToolsLocale('Previzualizare a designului; traducerea în engleză este pregătită automat la generarea cu Eva.','Design preview only; the English translation is produced when Eva generates the site.');
  work.creatorForm?.onPreviewReady?.();
 };
 desc.addEventListener('input',()=>{work.siteAiCopy=null});
 const actions=extraToolsActions(area,
  extraToolsBtn(extraToolsLocale('👁 Previzualizează site-ul','👁 Preview site'),generate,true),
  extraToolsBtn(extraToolsLocale('⛶ Ecran complet','⛶ Full screen'),()=>work.siteHtml?extraCreatorFullscreen(work.siteHtml):(note.textContent=extraToolsLocale('Creează întâi previzualizarea.','Preview first.'))));
 area.append(note,preview);
 work.creatorForm={name,type,desc,extra,lang,contact,getBusinessDetails:businessDetails.getDetails,getStyle:()=>selected,getPreferences:()=>({...designPrefs}),getPhoto:()=>photoData,getGallery:guesthouseGallery.getGallery,getFeatures:()=>({contact:featureContact.checked,booking:featureBooking.checked,
  shop:featureShop.checked,privacyUrl:privacy.value.trim()}),
 getCommerce:()=>({currency:currency.value,slotCapacity:Number(capacity.value)||0,slotMinutes:60,
  automaticConfirmation:autoConfirm.checked,products:products.filter(p=>p.title.trim()&&p.priceMinor>0).map(p=>({...p}))}),
 backendChoices:{contact:featureContact,booking:featureBooking,shop:featureShop},getManagement:management.getConfig,validateManagement:management.validate,preview,note,generate};
 const aiNote=extraToolsEl('p','extra-creator-disabled-note',extraToolsLocale('Generarea AI a site-ului este încă neactivată. Butonul de previzualizare creează doar o machetă locală, fără costuri.','AI website generation is not yet enabled. Preview creates only a local draft, without AI charges.'));
 const aiButton=extraToolsBtn(extraToolsLocale('✨ Generare AI neactivată','✨ AI generation not enabled'),()=>{});
 aiButton.disabled=true;area.append(aiNote);extraToolsActions(area,aiButton);
}
function extraCreatorImages(work){
 // The former static "not connected" preview is intentionally retired.
 // A real, quota-limited image Worker is attached by extraCreatorWorkingImages.
 const area=work.area;area.replaceChildren();
 area.append(extraToolsEl('h3','extra-creator-subtitle',extraToolsLocale('Creează imagini','Create images')));
 const imagePrompt=extraToolsField(area,extraToolsLocale('Descrierea imaginii','Image description'),'textarea',
  extraToolsLocale('Ce imagine dorești?','What image would you like?'));
 const choose=(host,ro,en,choices,initial)=>{
  const field=extraToolsField(host,extraToolsLocale(ro,en),'select');
  for(const [value,labelRo,labelEn] of choices){
   const opt=extraToolsEl('option','',extraToolsLocale(labelRo,labelEn));
   opt.value=value;field.append(opt);
  }
  field.value=initial;return field;
 };
 const artStyle=choose(area,'Stil artistic','Art style',EVA_IMAGE_STYLES,'realistic');
 // All 26 options stay in the DOM; the shared app picker shows four at once and scrolls.
 artStyle.dataset.pocketPickerMode='scroll';
 artStyle.setAttribute('aria-label',extraToolsLocale('Stil artistic','Art style'));
 artStyle.setAttribute('aria-haspopup','dialog');
 const format=choose(area,'Formatul imaginii','Image format',[
  ['square','Pătrat · 1:1','Square · 1:1'],
  ['landscape43','Orizontal · 4:3','Landscape · 4:3'],
  ['wide','Panoramic · 16:9','Widescreen · 16:9'],
  ['portrait34','Portret · 3:4','Portrait · 3:4'],
  ['portrait','Vertical · 9:16','Vertical · 9:16']
 ],'square');
 const composition=choose(area,'Încadrarea','Framing',[
  ['full','Scenă completă','Full scene'],['wide','Cadru larg','Wide shot'],
  ['medium','Plan mediu','Medium shot'],['portrait','Portret apropiat','Close portrait']
 ],'full');
 const advanced=extraToolsEl('details','eva-image-advanced');
 advanced.append(extraToolsEl('summary','',extraToolsLocale('Atmosferă, lumină, culori și detalii','Mood, light, colours and details')));
 const mood=choose(advanced,'Atmosferă','Mood',[
  ['neutral','Naturală','Natural'],['warm','Caldă','Warm'],
  ['dramatic','Dramatică','Dramatic'],['calm','Liniștită','Calm'],
  ['playful','Veselă','Playful'],['mysterious','Misterioasă','Mysterious'],
  ['epic','Epică','Epic']
 ],'neutral');
 const lighting=choose(advanced,'Iluminare','Lighting',[
  ['auto','Automată','Automatic'],['daylight','Lumină naturală','Daylight'],
  ['golden','Ora aurie','Golden hour'],['studio','Studio','Studio'],
  ['night','Noapte','Night'],['neon','Neon','Neon'],
  ['soft','Lumină difuză','Soft lighting'],['contrast','Contrast puternic','High contrast']
 ],'auto');
 const palette=choose(advanced,'Culori','Colours',[
  ['auto','Naturale','Natural'],['vivid','Intense','Vivid'],
  ['pastel','Pastel','Pastel'],['earth','Pământii','Earthy'],
  ['mono','Alb-negru','Black and white'],['cool','Reci','Cool'],
  ['warm','Calde','Warm']
 ],'auto');
 const avoid=extraToolsField(advanced,extraToolsLocale('De evitat (opțional)','Avoid (optional)'),'text',
  extraToolsLocale('Ex.: text, sigle','e.g. text, logos'));
 avoid.maxLength=130;
 area.append(advanced);
 const areaPreview=extraToolsEl('div','extra-creator-image-placeholder');
 areaPreview.hidden=true;area.append(areaPreview);
 work.creatorImageForm={imagePrompt,artStyle,format,composition,mood,lighting,palette,avoid,areaPreview};
 // Working image controls are inserted by the live image module, not placeholders.
}
`;
export const CREATOR_SITE_STYLE=String.raw`



#view-module.extra-tools-workspace .extra-creator-commerce-options{border:1px solid #547185!important;border-radius:12px!important;padding:10px!important}
#view-module.extra-tools-workspace .extra-creator-product-item{display:grid!important;grid-template-columns:minmax(0,2fr) repeat(2,minmax(0,1fr))!important;gap:5px!important;padding:8px!important;border:1px solid #547185!important;border-radius:10px!important;margin:7px 0!important}
#view-module.extra-tools-workspace .extra-creator-product-item button{grid-column:span 3!important;min-height:34px!important}
#view-module.extra-tools-workspace .extra-creator-product-item input{min-width:0!important;width:100%!important;box-sizing:border-box!important}
#view-module.extra-tools-workspace .extra-creator-backend-choices{margin:12px 0!important;padding:12px!important;border:1px solid #63899d!important;border-radius:13px!important;background:#0f3246!important}
#view-module.extra-tools-workspace .extra-creator-backend-choices summary{font-weight:750!important;cursor:pointer!important}
#view-module.extra-tools-workspace .extra-creator-backend-option{display:flex!important;align-items:flex-start!important;gap:9px!important;padding:10px!important}
#view-module.extra-tools-workspace .extra-creator-backend-option input{width:20px!important;height:20px!important;flex:0 0 auto!important;accent-color:#7a304e!important}
#view-module.extra-tools-workspace .extra-creator-design-button{display:block!important;width:100%!important;min-height:50px!important;padding:10px 14px!important;text-align:left!important;white-space:normal!important}
#view-module.extra-tools-workspace .extra-creator-option-summary{font-size:12px!important;color:#abebeb!important;margin:4px 0 10px!important;line-height:1.4!important}
.extra-creator-option-dialog{max-width:640px!important;max-height:95%!important}
.extra-creator-option-groups{min-height:0!important;overflow:auto!important;flex:1 1 auto!important;padding:2px!important}
.extra-creator-option-set{margin:0 0 12px!important;padding:0!important;border:0!important;min-width:0!important}
.extra-creator-option-set h4{font-size:14px!important;margin:4px 0 8px!important}
.extra-creator-option-choices{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important}
.extra-creator-option-chip{box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;min-width:0!important;min-height:43px!important;padding:9px 7px!important;border-radius:11px!important;background:#123b50!important;border:1px solid #5e8599!important;color:#f0f8fb!important;font-size:12px!important;white-space:normal!important;text-align:center!important}
.extra-creator-option-chip[aria-pressed=true]{border:2px solid #9de8ed!important;background:#214d60!important;box-shadow:inset 0 0 0 1px #5ab8c9!important}
.extra-creator-option-swatches{display:flex!important;gap:2px!important;flex:0 0 auto!important}
.extra-creator-option-swatches i{display:block!important;width:9px!important;height:16px!important;border-radius:2px!important}
.extra-creator-option-actions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;align-items:stretch!important;gap:8px!important;flex:0 0 auto!important}
.extra-creator-option-actions button{width:100%!important;height:100%!important;min-height:76px!important;align-self:stretch!important;box-sizing:border-box!important;min-width:0!important;margin:0!important;white-space:normal!important;line-height:1.25!important}
#view-module.extra-tools-workspace .extra-creator-style-pick{display:block!important;width:100%!important;min-height:55px!important;max-width:none!important;padding:11px 14px!important;white-space:normal!important;text-align:left!important}
#view-module.extra-tools-workspace .extra-creator-selected-style{color:#9de8ed!important;font-weight:700!important;font-size:13px!important;margin:3px 0 12px!important}
#view-module.extra-tools-workspace .extra-creator-english[hidden]{display:none!important}
#view-module.extra-tools-workspace .extra-creator-preview-info{color:#c1e5ef!important;font-size:13px!important;margin:8px 0!important;line-height:1.4!important}
#view-module.extra-tools-workspace .extra-creator-disabled-note{color:#bdd3de!important;font-size:13px!important;margin:12px 0 5px!important}
#view-module.extra-tools-workspace button[disabled]{opacity:.53!important;filter:grayscale(.3)!important;cursor:not-allowed!important}
#view-module.extra-tools-workspace .extra-creator-photo{display:none!important}
.extra-creator-style-overlay{position:fixed!important;z-index:999999!important;inset:0!important;display:flex!important;align-items:center!important;justify-content:center!important;background:#02121ded!important;padding:calc(9px + env(safe-area-inset-top,0px)) 10px calc(12px + env(safe-area-inset-bottom,0px))!important}
.extra-creator-style-dialog{box-sizing:border-box!important;background:#0a283b!important;color:#f2fbff!important;display:flex!important;flex-direction:column!important;gap:10px!important;border:1px solid #60b1c6!important;border-radius:16px!important;width:100%!important;max-width:680px!important;max-height:100%!important;overflow:hidden!important;padding:14px!important}
.extra-creator-style-dialog h3{font-size:20px!important;margin:0!important}
.extra-creator-styles{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:9px!important;overflow-y:auto!important;min-height:0!important;flex:1 1 auto!important;padding:4px!important}
.extra-creator-style-card{box-sizing:border-box!important;display:flex!important;flex-direction:column!important;gap:7px!important;align-items:stretch!important;text-align:left!important;padding:11px!important;min-height:117px!important;max-width:100%!important;border:1px solid #50849d!important;border-radius:12px!important;background:#123c52!important;color:#fff!important}
.extra-creator-style-card[aria-pressed=true]{border:2px solid #82edf0!important}
.extra-creator-swatches{display:flex!important;gap:4px!important}
.extra-creator-swatch{display:block!important;height:25px!important;flex:1!important;border-radius:5px!important}
.extra-creator-style-copy{display:flex!important;flex-direction:column!important;gap:4px!important}
.extra-creator-style-copy strong{font-size:14px!important}
.extra-creator-style-copy small{font-size:11px!important;color:#c0d7e2!important;line-height:1.28!important}
.extra-creator-style-close{flex:0 0 auto!important;min-height:44px!important;max-height:none!important;background:linear-gradient(180deg,#883c55,#68243d)!important;color:white!important;border:1px solid #c99aaa!important;border-radius:12px!important}
`;
