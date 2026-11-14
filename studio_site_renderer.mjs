// Standalone, script-free public website renderer for the independent site studio.
// Designs reuse exactly the Creator's responsive CSS; no runtime eval and no external assets.
import {CREATOR_PREMIUM_SCRIPT} from './creator_premium_presentations.mjs';
const lead='const extraCreatorPremiumSiteStyle=';
const begin=CREATOR_PREMIUM_SCRIPT.indexOf(lead);
const end=CREATOR_PREMIUM_SCRIPT.indexOf(';\n',begin+lead.length);
if(begin<0||end<0)throw new Error('premium_styles_missing');
export const STUDIO_SITE_CSS=JSON.parse(CREATOR_PREMIUM_SCRIPT.slice(begin+lead.length,end));
export const SITE_TEMPLATES=Object.freeze({
 heritage:'asym',coastal:'immersive',forest:'organic',urban:'split',art:'mosaic',
 minimal:'minimal',rustic:'story',luxury:'editorial',soft:'cards',tech:'conversion',
 retro:'bold',wellness:'gallery'
});
export const STUDIO_THEMES=Object.keys(SITE_TEMPLATES);
const PALETTES={
 heritage:['#282131','#f7f0e9','#d9a5a4','#49344e'],coastal:['#15354b','#fff6e9','#ddb873','#2d6074'],
 forest:['#17382f','#f4f3e5','#b5cf9d','#40604e'],urban:['#112332','#e8eff4','#54c3e5','#24566e'],
 art:['#2d1a42','#f5e9f4','#ffb7e5','#573069'],minimal:['#222124','#fdfdfb','#c7c5bb','#77736c'],
 rustic:['#432c25','#fff5e7','#deb572','#84503b'],luxury:['#191715','#f6f3e9','#c4a971','#433b31'],
 soft:['#332a40','#fff1f7','#f2bbd5','#7a688b'],tech:['#0b2032','#f5fbfc','#75d1e8','#1e6981'],
 retro:['#332217','#fff2d5','#f6b853','#6b5033'],wellness:['#203e3b','#f4eee5','#a5d1ba','#4f7770']
};
export const siteEscape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const bounded=(v,n)=>typeof v==='string'?v.trim().slice(0,n):'';
const EMAIL=/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;
const PHOTO=/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/i;
export function validateStudioDraft(input){
 if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('invalid_draft');
 const name=bounded(input.name,105),description=bounded(input.description,2800);
 if(name.length<2||description.length<12)throw new Error('name_or_description_required');
 const kind=['hotel','restaurant','services','salon','shop','personal','other'].includes(input.kind)?input.kind:'other';
 const styleId=STUDIO_THEMES.includes(input.styleId)?input.styleId:'heritage';
 const lang=['ro','en','both'].includes(input.lang)?input.lang:'ro';
 const contact={
  email:bounded(input.contact?.email,180),
  phone:bounded(input.contact?.phone,55),
  address:bounded(input.contact?.address,300)
 };
 if(contact.email&&!EMAIL.test(contact.email))throw new Error('invalid_email_contact');
 const cleanCopy=x=>({
  headline:bounded(x?.headline,130),intro:bounded(x?.intro,450),about:bounded(x?.about,1700),
  services:(Array.isArray(x?.services)?x.services:[]).slice(0,9).map(item=>({
   title:bounded(item?.title,95),detail:bounded(item?.detail,450)
  })).filter(item=>item.title)
 });
 const content={ro:cleanCopy(input.content?.ro),en:cleanCopy(input.content?.en)};
 const rooms=(Array.isArray(input.rooms)?input.rooms:[]).slice(0,12).map(r=>({
  label:bounded(r?.label,100),count:Math.max(0,Math.min(999,Number(r?.count)||0))
 })).filter(r=>r.label);
 const amenities=(Array.isArray(input.amenities)?input.amenities:[]).slice(0,15).map(x=>bounded(x,100)).filter(Boolean);
 const photos=(Array.isArray(input.photos)?input.photos:[]).slice(0,6).map(x=>({
  data:bounded(x?.data,185000),caption:bounded(x?.caption,130)
 })).filter(x=>x.data&&x.data.length<185000&&PHOTO.test(x.data));
 const totalPhotoBytes=photos.reduce((n,x)=>n+x.data.length,0);
 if(totalPhotoBytes>750000)throw new Error('too_many_photo_bytes');
 return {name,description,kind,styleId,lang,contact,content,rooms,amenities,photos};
}
function typeLabel(kind,en){
 const labels={
  hotel:['Pensiune / cazare','Guesthouse & accommodation'],restaurant:['Restaurant / cafenea','Restaurant & café'],
  services:['Servicii profesionale','Professional services'],salon:['Salon & frumusețe','Salon & beauty'],
  shop:['Magazin','Shop'],personal:['Portofoliu','Portfolio'],other:['Prezentare','Introduction']
 };
 return (labels[kind]||labels.other)[en?1:0];
}
const sectionIndex=(id,en,title)=>'<div class="eyebrow">'+id+' / '+siteEscape(title)+'</div>';
function makePhoto(src,caption,idx){
 if(src)return '<div class="visual"><img src="'+src+'" alt="'+siteEscape(caption||'Fotografie furnizată de proprietar')+'" loading="lazy"></div>';
 return '<div class="visual" role="img" aria-label="Loc rezervat pentru fotografia proprietarului">'+
 '<span class="studio-photo-pending">✦<small>'+siteEscape(idx===0?'Adaugă fotografia principală':'Fotografie nouă')+'</small></span></div>';
}
function renderLanguage(draft,en){
 const lang=en?'en':'ro',c=draft.content[lang],name=siteEscape(draft.name);
 const heading=siteEscape(c.headline||(en?'Welcome':'Bine ați venit'));
 const intro=siteEscape(c.intro||(en?'Discover our services.':'Descoperă serviciile noastre.'));
 const about=siteEscape(c.about||(en?'Business information supplied by the owner.':draft.description));
 const nav=en?['About','Services','Contact']:['Despre','Servicii','Contact'];
 const aboutTitle=en?'Our story':'Povestea noastră';
 const offerTitle=draft.kind==='hotel'?(en?'Rooms & amenities':'Camere și facilități'):(en?'Our services':'Ce oferim');
 const contactTitle=en?'Contact us':'Contactează-ne';
 const kind=typeLabel(draft.kind,en);
 const leadPhoto=draft.photos[0];
 const image=()=>makePhoto(leadPhoto?.data,leadPhoto?.caption,0);
 const visual=()=>image();
 const extras=draft.photos.slice(1);
 const navHtml='<header class="design-nav"><strong class="brand">'+name+'</strong><nav>'+
 nav.map((x,i)=>'<a href="#'+['about','offer','contact'][i]+'-'+lang+'">'+x+'</a>').join('')+'</nav></header>';
 const eyebrow=sectionIndex('01',en,kind);
 const cta='<a class="cta" href="#offer-'+lang+'">'+(en?'Explore our offer':'Descoperă oferta')+' ↗</a>';
 const heroText='<div class="hero-content">'+eyebrow+'<h1>'+name+'</h1><h2>'+heading+'</h2><p>'+intro+'</p>'+cta+'</div>';
 const family=SITE_TEMPLATES[draft.styleId];
 let hero='';
 switch(family){
 case 'asym':
  hero='<section class="hero asym-hero"><span class="vertical-index">01 / BOUTIQUE</span>'+
   '<div class="hero-copy">'+heroText+'</div><div class="asym-composition">'+visual()+
   '<div class="art-accent">'+makePhoto(extras[0]?.data,extras[0]?.caption,1)+'</div>'+
   '<span class="floating-title">'+name+'</span></div></section>';break;
 case 'immersive':
  hero='<section class="hero immersive-hero">'+visual()+'<div class="hero-shade"></div>'+
   '<div class="immersive-top"><span>'+siteEscape(kind)+'</span><span>STAY / EXPLORE</span></div>'+
   heroText+'<div class="hero-bottom"><span>01 — 03</span><span>↓</span></div></section>';break;
 case 'organic':
  hero='<section class="hero organic-hero">'+heroText+'<div class="organic-art">'+visual()+
   '<div class="organic-badge">✳</div></div></section>';break;
 case 'split':
  hero='<section class="hero split-hero"><div class="split-copy">'+heroText+'</div>'+
   '<div class="split-art">'+visual()+'<div class="split-stamp">'+siteEscape(kind)+'</div></div></section>';break;
 case 'mosaic':
  hero='<section class="hero mosaic-hero"><div class="tile tile-title">'+heroText+'</div>'+
   '<div class="tile tile-photo">'+visual()+'</div><div class="tile tile-quote">'+heading+'</div>'+
   '<div class="tile tile-accent">'+makePhoto(extras[0]?.data,extras[0]?.caption,1)+'</div></section>';break;
 case 'minimal':
  hero='<section class="hero minimal-hero"><div class="mini-top">'+eyebrow+'<span>EST. / 01</span></div>'+
   heroText+'<div class="minimal-lines"><i></i><i></i><i></i></div></section>';break;
 case 'story':
  hero='<section class="hero story-hero"><div class="story-image">'+visual()+
   '<span class="story-number">01</span></div><div class="story-copy">'+heroText+'</div></section>';break;
 case 'editorial':
  hero='<section class="hero editorial-hero"><div class="editorial-heading">'+eyebrow+
   '<span class="issue">ISSUE / 01</span><h1>'+name+'</h1><div class="editorial-rule"></div><h2>'+heading+'</h2></div>'+
   '<div class="editorial-grid"><div class="editorial-left">'+intro+cta+'</div>'+visual()+
   '<p class="editorial-caption">'+siteEscape(kind)+'</p></div></section>';break;
 case 'cards':
  hero='<section class="hero cards-hero"><div class="cards-hero-content">'+heroText+'</div>'+
   '<div class="cards-image-stack">'+visual()+'<div class="stacked-card">'+
   (en?'Discover more':'Descoperă')+' ✦</div></div></section>';break;
 case 'conversion':
  hero='<section class="hero conversion-hero"><div class="conversion-copy">'+heroText+'</div>'+
   '<aside class="conversion-panel"><div class="panel-head">'+(en?'Ask about availability':'Cere detalii')+
   '</div>'+visual()+'<p>'+intro+'</p><a href="#contact-'+lang+'">'+contactTitle+' →</a></aside></section>';break;
 case 'bold':
  hero='<section class="hero bold-hero">'+eyebrow+'<div class="bold-strip"><span>'+name+
   '</span><span>↗</span></div><div class="bold-grid"><div class="bold-art">'+visual()+'</div>'+
   '<div class="bold-copy"><h1>'+heading+'</h1><p>'+intro+'</p>'+cta+'</div></div></section>';break;
 default:
  hero='<section class="hero gallery-hero"><div class="gallery-top">'+heroText+'</div>'+
   '<div class="gallery-photos">'+visual()+makePhoto(extras[0]?.data,extras[0]?.caption,1)+
   makePhoto(extras[1]?.data,extras[1]?.caption,2)+'</div></section>';
 }
 const rooms=draft.rooms.map(r=>'<div class="metric"><b>'+r.count+'</b><span>'+siteEscape(r.label)+'</span></div>').join('');
 const services=c.services.map((s,i)=>'<article class="service"><span class="num">'+String(i+1).padStart(2,'0')+
  '</span><h3>'+siteEscape(s.title)+'</h3><p>'+siteEscape(s.detail)+'</p></article>').join('');
 const amenities=draft.amenities.map(a=>'<span class="facility">'+siteEscape(a)+'</span>').join('');
 const details='<section class="offers" id="offer-'+lang+'">'+sectionIndex('02',en,offerTitle)+
  '<h2>'+offerTitle+'</h2>'+(rooms?'<div class="metrics">'+rooms+'</div>':'')+
  (services?'<div class="services">'+services+'</div>':'')+
  (amenities?'<div class="amenities">'+amenities+'</div>':'')+'</section>';
 const aboutSection='<section class="intro" id="about-'+lang+'"><div class="intro-index">01 / '+
  aboutTitle+'</div><div class="intro-copy">'+sectionIndex('01',en,aboutTitle)+
  '<h2>'+heading+'</h2><p>'+about+'</p></div></section>';
 const cInfo=[draft.contact.address,draft.contact.email,draft.contact.phone].filter(Boolean).map(siteEscape).join(' · ');
 const contact='<section class="contact" id="contact-'+lang+'">'+sectionIndex('03',en,contactTitle)+
 '<h2>'+contactTitle+'</h2><p>'+cInfo+'</p><div class="contact-signature">'+name+'</div></section>';
 const footer='<footer>'+name+'<span>· '+(en?'Owner-managed website':'Site administrat de proprietar')+'</span></footer>';
 return '<div class="locale-content lang-'+lang+'">'+navHtml+'<main>'+hero+
  (family==='conversion'||family==='cards'||family==='mosaic'||family==='gallery'?details+aboutSection:aboutSection+details)+
  contact+'</main>'+footer+'</div>';
}
export function renderStudioSite(input){
 const d=validateStudioDraft(input),theme=SITE_TEMPLATES[d.styleId],palette=PALETTES[d.styleId],cssVars=
 '--ink:'+palette[0]+';--paper:'+palette[1]+';--accent:'+palette[2]+';--mid:'+palette[3]+';';
 const languages=d.lang==='both'?renderLanguage(d,false)+renderLanguage(d,true):renderLanguage(d,d.lang==='en');
 const controls=d.lang==='both'?'<input id="lang-ro" type="radio" name="site-language" checked>'+
 '<input id="lang-en" type="radio" name="site-language"><div class="languages">'+
 '<label for="lang-ro">RO</label><label for="lang-en">EN</label></div>':'';
 const extraCss='.studio-photo-pending{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;'+
 'font:700 52px/1 Georgia,serif;color:#fff9}.studio-photo-pending small{font:600 12px/1.4 system-ui,sans-serif;'+
 'letter-spacing:.07em;padding:0 16px;text-align:center}.premium-site .offers{min-height:160px}';
 return '<!doctype html><html lang="'+(d.lang==='both'?'ro':d.lang)+'"><head><meta charset="utf-8">'+
 '<meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<meta http-equiv="Content-Security-Policy" content="default-src &#39;none&#39;;style-src &#39;unsafe-inline&#39;;img-src data:;">'+
 '<title>'+siteEscape(d.name)+'</title><style>'+STUDIO_SITE_CSS+extraCss+'</style></head>'+
 '<body class="premium-site theme-'+theme+'" style="'+cssVars+'">'+controls+'<div class="site-shell">'+
 languages+'</div></body></html>';
}
