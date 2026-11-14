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
function extraCreatorSiteDetails(description,kind){
 const raw=String(description||'').trim();
 const counts=[];
 if(kind==='hotel'){
  const rex=/\b(\d{1,3})\s*(camere?\s+(?:single|duble|dubla|double|matrimoniale)|apartamente?|rooms?\s+(?:single|double|twin)|apartments?|suites?)\b/gi;
  for(const match of raw.matchAll(rex)){
   const value=match[1],title=match[2].trim();if(!counts.some(s=>s.title.toLowerCase()===title.toLowerCase()))counts.push({value,title});
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
 const short=kind==='hotel'&&amenities.some(x=>x.ro==='Mic dejun inclus')?
  'Cazare cu mic dejun inclus':(segments[0]||raw).replace(/\b(?:Are|We have|There are)\s+\d+.*$/i,'').trim().slice(0,165);
 const remainder=(kind==='hotel'?segments.slice(1):segments).slice(0,5);
 return {counts:counts.slice(0,6),amenities:amenities.slice(0,8),short:short||segments[0]||raw.slice(0,130),remainder};
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
 const area=work.area;area.replaceChildren();extraCreatorSubBack(work);
 area.append(extraToolsEl('h3','extra-creator-subtitle',extraToolsLocale('Creează pagini web','Create websites')));
 extraCreatorNotice(area,'Machetă locală: în acest APK testăm stilul și structura. Generarea cu Eva și accesul Premium verificat sunt încă neactivate.','Local draft: in this APK you can test style and structure. Eva generation and verified Premium access are not enabled.');
 const name=extraToolsField(area,extraToolsLocale('Numele afacerii','Business name'),'text',extraToolsLocale('Ex.: Aramis','e.g. Aramis'));
 const type=extraToolsField(area,extraToolsLocale('Domeniu','Business category'),'select');
 const categories=[['hotel','Pensiune / cazare','Guesthouse / hotel'],['restaurant','Restaurant / cafenea','Restaurant / café'],['services','Meseriași / servicii','Trades / services'],['salon','Salon / frumusețe','Beauty salon'],['shop','Magazin / produse','Shop'],['personal','Portofoliu / eveniment','Portfolio / event'],['other','Alt domeniu','Other']];
 for(const [key,ro,en] of categories){const option=extraToolsEl('option','',extraToolsLocale(ro,en));option.value=key;type.append(option)}
 const desc=extraToolsField(area,extraToolsLocale('Descrie serviciile și particularitățile','Describe services and details'),'textarea',
  extraToolsLocale('Ex.: 5 camere single, 10 duble, mic dejun inclus, bucătărie la comun','e.g. 5 single rooms, 10 doubles, breakfast included'));
 let selected=extraCreatorVisualStyles[0];
 const styleButton=extraToolsBtn(extraToolsLocale('🎨 Alege stilul din exemple','🎨 Choose a visual style'),()=>extraCreatorStylePicker(selected.id,value=>{
  selected=value;styleLabel.textContent=extraToolsLocale('Stil ales: ','Selected style: ')+extraToolsLocale(value.ro,value.en);
 }));
 styleButton.classList.add('extra-creator-style-pick');
 const styleLabel=extraToolsEl('p','extra-creator-selected-style',extraToolsLocale('Stil ales: ','Selected style: ')+extraToolsLocale(selected.ro,selected.en));
 area.append(styleButton,styleLabel);
 const extra=extraToolsField(area,extraToolsLocale('Detalii suplimentare (opțional)','Additional design details (optional)'),'text',extraToolsLocale('Culori preferate, atmosferă sau alte idei','Preferred colours, atmosphere, details'));
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
 const photoLabel=extraToolsEl('p','extra-work-note',extraToolsLocale('Poți adăuga fotografia reală a afacerii.','You can add your business photo.'));
 let photoData='';
 photo.onchange=()=>{
  const file=photo.files&&photo.files[0];if(!file)return;
  if(!/^image\/(?:jpeg|png|webp)$/.test(file.type)||file.size>3*1024*1024){
   extraToolsStatus(extraToolsLocale('Alege o fotografie JPG, PNG sau WebP, maximum 3 MB.','Choose a JPG, PNG or WebP under 3 MB.'));return;
  }
  const reader=new FileReader();reader.onload=()=>{photoData=String(reader.result||'');photoLabel.textContent=extraToolsLocale('Fotografia reală a fost selectată.','Your photo is selected.')};
  reader.onerror=()=>extraToolsStatus(extraToolsLocale('Nu s-a putut încărca fotografia.','Could not read photo.'));
  reader.readAsDataURL(file);
 };
 const photoButton=extraToolsBtn(extraToolsLocale('📷 Fotografie proprie (opțional)','📷 Your photo (optional)'),()=>photo.click());
 area.append(photo,photoButton,photoLabel);
 const preview=extraToolsEl('div','extra-creator-preview-wrap');
 const note=extraToolsEl('p','extra-creator-preview-info',extraToolsLocale('Apasă Previzualizează pentru a vedea site-ul demonstrativ.','Tap Preview to see your local website draft.'));
 const generate=()=>{
  const title=name.value.trim(),story=desc.value.trim();
  if(!title||!story){note.textContent=extraToolsLocale('Completează numele afacerii și serviciile oferite.','Enter the business name and services.');return}
  work.creatorProjectSettings=management.getConfig();
  work.siteHtml=extraCreatorLocalHtml(title,type.options[type.selectedIndex]?.textContent||type.value,story,selected.ro+' '+extra.value,contact.value,lang.value,
   {kind:type.value,styleId:selected.id,photo:photoData});
  const frame=extraToolsEl('iframe','extra-creator-preview');
  frame.setAttribute('sandbox','');frame.title=extraToolsLocale('Machetă locală a site-ului','Local website draft');
  frame.srcdoc=work.siteHtml;preview.replaceChildren(frame);
  note.textContent=lang.value==='ro'?
  extraToolsLocale('Previzualizare locală fără AI; verifică datele înainte de publicare.','Local preview without AI; review before publishing.'):
  extraToolsLocale('Previzualizare a designului; traducerea în engleză este pregătită automat la generarea cu Eva.','Design preview only; the English translation is produced when Eva generates the site.');
  work.creatorForm?.onPreviewReady?.();
 };
 const actions=extraToolsActions(area,
  extraToolsBtn(extraToolsLocale('👁 Previzualizează site-ul','👁 Preview site'),generate,true),
  extraToolsBtn(extraToolsLocale('⛶ Ecran complet','⛶ Full screen'),()=>work.siteHtml?extraCreatorFullscreen(work.siteHtml):(note.textContent=extraToolsLocale('Creează întâi previzualizarea.','Preview first.'))));
 area.append(note,preview);
 work.creatorForm={name,type,desc,extra,lang,contact,getStyle:()=>selected,getPhoto:()=>photoData,getManagement:management.getConfig,validateManagement:management.validate,preview,note,generate};
 const aiNote=extraToolsEl('p','extra-creator-disabled-note',extraToolsLocale('Generarea AI a site-ului este încă neactivată. Butonul de previzualizare creează doar o machetă locală, fără costuri.','AI website generation is not yet enabled. Preview creates only a local draft, without AI charges.'));
 const aiButton=extraToolsBtn(extraToolsLocale('✨ Generare AI neactivată','✨ AI generation not enabled'),()=>{});
 aiButton.disabled=true;area.append(aiNote);extraToolsActions(area,aiButton);
}
function extraCreatorImages(work){
 const area=work.area;area.replaceChildren();extraCreatorSubBack(work);
 area.append(extraToolsEl('h3','extra-creator-subtitle',extraToolsLocale('Creează imagini','Create images')));
 extraCreatorNotice(area,'Motorul AI de imagini nu este conectat. În acest APK nu se poate genera sau salva o imagine nouă. Nu pornește nicio cerere și nu se percepe niciun cost.','The image AI engine is not connected. This APK cannot generate or save a new image. No request starts and no charge occurs.');
 const imagePrompt=extraToolsField(area,extraToolsLocale('Descrierea imaginii','Image description'),'textarea',
  extraToolsLocale('Ce ai dori să genereze Eva?','What would you like Eva to generate?'));
 const format=extraToolsField(area,extraToolsLocale('Format imagine','Image format'),'select');
 for(const [v,label] of [['square','Pătrat · 1:1'],['wide','Orizontal · 16:9'],['portrait','Vertical · 9:16']]){const opt=extraToolsEl('option','',label);opt.value=v;format.append(opt)}
 const areaPreview=extraToolsEl('div','extra-creator-image-placeholder');
 areaPreview.append(extraToolsEl('span','extra-creator-symbol','🖼️'),
  extraToolsEl('strong','',extraToolsLocale('Generarea imaginilor nu este încă activă','Image generation is not yet active')));
 area.append(areaPreview);
 work.creatorImageForm={imagePrompt,format,areaPreview};
 const make=extraToolsBtn(extraToolsLocale('✨ Generare indisponibilă','✨ Generation unavailable'),()=>{});
 make.disabled=true;
 const save=extraToolsBtn(extraToolsLocale('💾 Salvează în Galerie','💾 Save to Gallery'),()=>{});
 save.disabled=true;
 const share=extraToolsBtn(extraToolsLocale('↗ Partajează','↗ Share'),()=>{});
 share.disabled=true;
 extraToolsActions(area,make,save,share);
}
`;
export const CREATOR_SITE_STYLE=String.raw`
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
