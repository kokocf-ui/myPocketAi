export const SITE_GALLERY_PRESETS=Object.freeze({"hotel":[["facilities","Facilități","Facilities"],["dining","Restaurant și mic dejun","Restaurant and breakfast"],["garden","Grădină și terasă","Garden and terrace"],["surroundings","Împrejurimi","Surroundings"]],"restaurant":[["interior","Interiorul localului","Restaurant interior"],["terrace","Terasă","Terrace"],["dishes","Preparate","Dishes"],["drinks","Băuturi","Drinks"],["menu","Meniu","Menu"],["events","Evenimente","Events"]],"cafe":[["interior","Interiorul cafenelei","Café interior"],["terrace","Terasă","Terrace"],["coffee","Cafea și ceai","Coffee and tea"],["desserts","Prăjituri și deserturi","Cakes and desserts"],["breakfast","Mic dejun","Breakfast"],["events","Evenimente","Events"]],"bar":[["interior","Interiorul barului","Bar interior"],["terrace","Terasă","Terrace"],["cocktails","Cocktailuri și băuturi","Cocktails and drinks"],["food","Gustări și preparate","Snacks and food"],["ambience","Atmosferă","Atmosphere"],["events","Evenimente și muzică","Events and music"]],"services":[["works","Lucrări executate","Completed work"],["beforeafter","Înainte și după","Before and after"],["equipment","Echipamente","Equipment"],["team","Echipa","Team"],["projects","Proiecte","Projects"]],"salon":[["interior","Interiorul salonului","Salon interior"],["hair","Coafură","Hair styling"],["nails","Manichiură","Nails"],["cosmetic","Cosmetică","Beauty treatments"],["results","Rezultate","Results"],["team","Echipa","Team"]],"shop":[["store","Magazinul","Store"],["products","Produse","Products"],["collections","Colecții și categorii","Collections"],["new","Noutăți","New arrivals"],["offers","Promoții","Offers"]],"personal":[["portfolio","Portofoliu","Portfolio"],["projects","Proiecte","Projects"],["events","Evenimente","Events"],["team","Echipa","Team"],["location","Locație","Location"]],"other":[["business","Prezentarea afacerii","Business presentation"],["services","Servicii","Services"],["products","Produse","Products"],["projects","Proiecte","Projects"],["team","Echipa","Team"],["events","Evenimente","Events"]]});
export const CREATOR_GUESTHOUSE_SCRIPT="const extraCreatorGalleryPresets="+JSON.stringify(SITE_GALLERY_PRESETS)+";\n"+String.raw`
function extraCreatorGalleryCategoryOptions(kind,description,venueSubtype='auto'){
 const cats=[];
 if(kind==='hotel'||kind==='guesthouse')for(const room of extraCreatorSiteDetails(description,'hotel').counts){
  cats.push({id:'room:'+room.title.toLocaleLowerCase('ro'),ro:room.title,en:room.title,
   count:room.value,group:'room',automatic:true});
 }
 const isBar=kind==='restaurant'&&(venueSubtype==='bar'||venueSubtype==='auto'&&/\b(?:bar|pub|cocktail|lounge|berărie|berarie|tavern|club)\b/i.test(description));
 const isCafe=kind==='restaurant'&&!isBar&&(venueSubtype==='cafe'||venueSubtype==='auto'&&/\b(?:cafenea|coffee|café|cafe|ceainărie|ceainarie)\b/i.test(description));
 const catalogId=kind==='guesthouse'?'hotel':isBar?'bar':isCafe?'cafe':kind;
 const catalog=extraCreatorGalleryPresets[catalogId]||extraCreatorGalleryPresets.other;
 for(const [id,ro,en] of catalog)cats.push({id:'suggestion:'+catalogId+':'+id,ro,en,group:'category'});
 return cats;
}
function extraCreatorGuesthouseControls(area,type,desc){
 const panel=extraToolsEl('section','creator-guesthouse-gallery');
 const active=new Set(),custom=new Map(),photos=new Map();
 let venueSubtype='auto',lastSignature='';
 const norm=x=>String(x||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
 const categoryId=cat=>type.value+'|'+cat.id;
 const categories=()=>{
  const all=extraCreatorGalleryCategoryOptions(type.value,desc.value,venueSubtype);
  for(const [key,c] of custom)if(key.startsWith(type.value+'|'))all.push(c);
  return all.slice(0,32);
 };
 const isActive=cat=>cat.automatic||active.has(categoryId(cat));
 const getGallery=()=>categories().filter(isActive).flatMap(cat=>{
  const images=photos.get(categoryId(cat))||[null,null];
  return images.flatMap((data,index)=>data?[{
   group:cat.group,roomLabel:cat.group==='room'?cat.ro:'',
   categoryLabel:cat.ro,categoryEn:cat.en||cat.ro,
   caption:cat.ro+' — '+(index+1),data
  }]:[]);
 });
 async function preparePhoto(file){
  if(!file||!/^image\/(?:jpeg|png|webp)$/.test(file.type)||file.size>8*1024*1024)
   throw Error(extraToolsLocale('Alege JPG/PNG/WebP de maximum 8 MB.','Choose JPG/PNG/WebP, max 8 MB.'));
  const url=URL.createObjectURL(file),picture=new Image();picture.src=url;
  try{await picture.decode()}finally{URL.revokeObjectURL(url)}
  const canvas=extraToolsEl('canvas'),scale=Math.min(1,760/Math.max(picture.naturalWidth,picture.naturalHeight));
  canvas.width=Math.max(1,Math.round(picture.naturalWidth*scale));
  canvas.height=Math.max(1,Math.round(picture.naturalHeight*scale));
  canvas.getContext('2d').drawImage(picture,0,0,canvas.width,canvas.height);
  for(const quality of [.70,.56,.43,.30,.20]){
   const data=canvas.toDataURL('image/webp',quality);
   if(data.length<=75000)return data;
  }
  throw Error(extraToolsLocale('Fotografia este prea mare după comprimare.','Photo remains too large after compression.'));
 }
 function refresh(){
  panel.replaceChildren();
  const kind=type.value,cats=categories();
  lastSignature=kind+'|'+cats.map(c=>c.id+':'+(c.count||'')).join('|');
  panel.append(extraToolsEl('h3','',extraToolsLocale('Galerie fotografică','Photo gallery')));
  if(kind==='restaurant'){
   const row=extraToolsEl('label','extra-work-label',extraToolsLocale('Tipul localului','Venue type'));
   const selector=extraToolsEl('select','extra-work-input');
   for(const [value,ro,en] of [['auto','Eva detectează','Eva detects'],['restaurant','Restaurant','Restaurant'],
    ['cafe','Cafenea / ceainărie','Café / tea room'],['bar','Bar / pub','Bar / pub']]){
    const option=extraToolsEl('option','',extraToolsLocale(ro,en));option.value=value;selector.append(option);
   }
   selector.value=venueSubtype;
   selector.onchange=()=>{venueSubtype=selector.value;refresh()};
   row.append(selector);panel.append(row);
  }
  panel.append(extraToolsEl('p','extra-work-note',extraToolsLocale(
   'Alege numai categoriile potrivite afacerii tale. Pentru demo poți adăuga cel mult 2 poze în fiecare; după creare, administratorul poate completa galeria.',
   'Choose categories relevant to your business. Add up to 2 pictures per category for the demo; the administrator can expand the gallery later.')));
  const suggestions=extraToolsEl('div','creator-gallery-suggestions');
  for(const cat of cats.filter(c=>!c.automatic)){
   const btn=extraToolsBtn(extraToolsLocale(cat.ro,cat.en),()=>{
    const k=categoryId(cat);
    if(active.has(k))active.delete(k);
    else{
     if(cats.filter(isActive).length>=16){extraToolsStatus(extraToolsLocale('Selectează cel mult 16 categorii pentru demo.','Select at most 16 demo categories.'));return}
     active.add(k);
    }
    refresh();
   });
   btn.classList.add('creator-gallery-suggestion');
   btn.setAttribute('aria-pressed',isActive(cat)?'true':'false');
   suggestions.append(btn);
  }
  panel.append(suggestions);
  const manual=extraToolsEl('div','creator-gallery-custom');
  const customName=extraToolsEl('input','extra-work-input');
  customName.type='text';customName.maxLength=70;
  customName.placeholder=extraToolsLocale('Altă categorie foto','Another photo category');
  const add=extraToolsBtn(extraToolsLocale('＋ Adaugă categorie','＋ Add category'),()=>{
   const ro=customName.value.trim();
   if(ro.length<2){extraToolsStatus(extraToolsLocale('Introdu numele categoriei.','Enter a category name.'));return}
   if(categories().some(c=>norm(c.ro)===norm(ro))){extraToolsStatus(extraToolsLocale('Categoria există deja.','That category already exists.'));return}
   if(categories().length>=32){extraToolsStatus(extraToolsLocale('Sunt prea multe categorii.','Too many categories.'));return}
   const cat={id:'custom:'+norm(ro),ro,en:ro,group:'category'};
   custom.set(kind+'|'+cat.id,cat);active.add(kind+'|'+cat.id);refresh();
  });
  manual.append(customName,add);panel.append(manual);
  const selected=cats.filter(isActive);
  if(!selected.length){
   panel.append(extraToolsEl('p','extra-work-note',extraToolsLocale(
    'Selectează mai sus categoriile pentru care ai fotografii.','Select categories above for which you have pictures.')));
  }
  for(const cat of selected){
   const id=categoryId(cat);
   if(!photos.has(id))photos.set(id,[null,null]);
   const card=extraToolsEl('details','creator-guesthouse-room');
   const title=(cat.count?cat.count+' × ':'')+extraToolsLocale(cat.ro,cat.en);
   const summary=extraToolsEl('summary','',title);
   const count=(photos.get(id)||[]).filter(Boolean).length;
   summary.append(extraToolsEl('span','creator-gallery-count',' '+count+'/2'));
   card.append(summary);
   const slots=extraToolsEl('div','creator-guesthouse-slots');
   for(let n=0;n<2;n++){
    const holder=extraToolsEl('div','creator-guesthouse-slot');
    const input=extraToolsEl('input','extra-creator-photo');input.type='file';
    input.accept='image/jpeg,image/png,image/webp';input.hidden=true;
    const button=extraToolsBtn(extraToolsLocale('＋ Fotografie ','＋ Photo ')+(n+1),()=>input.click());
    const data=photos.get(id)[n];
    if(data){
     const img=extraToolsEl('img','creator-guesthouse-thumb');img.src=data;img.alt=title;
     button.prepend(img);
    }
    input.onchange=async()=>{
     try{
      if(!input.files?.[0])return;
      photos.get(id)[n]=await preparePhoto(input.files[0]);refresh();
     }catch(e){extraToolsStatus(e.message)}
     finally{input.value=''}
    };
    holder.append(input,button);
    if(data)holder.append(extraToolsBtn(extraToolsLocale('Elimină','Remove'),()=>{photos.get(id)[n]=null;refresh()}));
    slots.append(holder);
   }
   card.append(slots);panel.append(card);
  }
 }
 area.append(panel);
 type.addEventListener('change',refresh);
 desc.addEventListener('input',()=>{const signature=type.value+'|'+categories().map(c=>c.id+':'+(c.count||'')).join('|');if(signature!==lastSignature)refresh()});
 refresh();
 return {getGallery,refresh,preparePhoto};
}
function extraCreatorGuesthouseInjectGallery(html,images,kind='hotel'){
 const list=(Array.isArray(images)?images:[]).filter(p=>p&&typeof p.data==='string'&&
  /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/i.test(p.data)&&
  p.data.length<165000).slice(0,40);
 if(!list.length)return html;
 const groups=new Map();
 for(const photo of list){
  if(photo.group==='exterior')continue;
  const label=String(photo.categoryLabel||photo.roomLabel||'Alte fotografii').trim().slice(0,100);
  if(!label)continue;
  if(!groups.has(label))groups.set(label,[]);
  groups.get(label).push(photo);
 }
 if(!groups.size)return html;
 return html.replace(/<section class="contact" id="contact-(ro|en)">/g,(match,lang)=>{
  let counter=0;
  const categories=Array.from(groups.entries()).map(([label,photos])=>{
   const english=photos[0]?.categoryEn||label;
   const title=extraCreatorEscape(lang==='en'?english:label);
   const thumbnails=photos.map(photo=>{
    const id='room-gallery-photo-'+lang+'-'+counter++;
    const alt=extraCreatorEscape(photo.caption||label);
    return '<a class="room-gallery-tile" href="#'+id+'"><img src="'+photo.data+'" loading="lazy" alt="'+alt+'"></a>'+
     '<div class="room-gallery-full" id="'+id+'"><a href="#room-gallery-'+lang+'" class="room-gallery-close" aria-label="'+(lang==='ro'?'Închide':'Close')+'">×</a><img src="'+photo.data+'" alt="'+alt+'"></div>';
   }).join('');
   return '<div class="room-gallery-category"><h3>'+title+'</h3><div class="room-gallery-grid">'+thumbnails+'</div></div>';
  }).join('');
  const heading=(kind==='hotel'||kind==='guesthouse')?(lang==='ro'?'Galeria camerelor':'Room photo gallery'):(lang==='ro'?'Galerie foto':'Photo gallery');
  return '<section id="room-gallery-'+lang+'" class="room-gallery-section"><h2>'+heading+'</h2>'+categories+'</section>'+match;
 });
}
`;
export const GUESTHOUSE_SITE_CSS=String.raw`
.room-gallery-section{padding:65px 8%;background:var(--paper)}.room-gallery-section h2{font:700 clamp(30px,5vw,54px)/1.2 Georgia,serif;margin:0 0 30px}
.room-gallery-category{margin:0 0 28px}.room-gallery-category h3{font:700 22px/1.3 system-ui,sans-serif;margin:0 0 12px}
.room-gallery-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.room-gallery-tile{display:block;border-radius:12px;overflow:hidden;border:1px solid #0002}
.room-gallery-tile img{width:100%;height:clamp(135px,24vw,300px);display:block;object-fit:cover}
.room-gallery-full{display:none;position:fixed;inset:0;background:#06101aef;z-index:9999;align-items:center;justify-content:center;padding:48px 14px 20px}
.room-gallery-full:target{display:flex}.room-gallery-full img{max-width:100%;max-height:100%;object-fit:contain}.room-gallery-close{position:absolute;right:16px;top:6px;color:white;font:700 36px/1 sans-serif}
@media(max-width:540px){.room-gallery-section{padding:40px 18px}.room-gallery-grid{gap:8px}.room-gallery-tile img{height:150px}}
`;
export const CREATOR_GUESTHOUSE_STYLE=String.raw`
#view-module.extra-tools-workspace .creator-guesthouse-gallery{border:1px solid #56849b!important;background:#0b2b3f!important;border-radius:14px!important;padding:13px!important;margin:13px 0!important}
#view-module.extra-tools-workspace .creator-guesthouse-gallery h3{font-size:17px!important;margin:0 0 8px!important}
#view-module.extra-tools-workspace .creator-guesthouse-room{background:#153d52!important;padding:10px!important;border-radius:10px!important;margin:8px 0!important}.creator-guesthouse-room summary{font-size:14px!important;font-weight:750!important;cursor:pointer!important}
#view-module.extra-tools-workspace .creator-guesthouse-slots{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;margin-top:8px!important}
#view-module.extra-tools-workspace .creator-guesthouse-slot{display:flex!important;flex-direction:column!important;gap:5px!important;min-width:0!important}
#view-module.extra-tools-workspace .creator-guesthouse-slot button{max-width:100%!important;min-height:40px!important;font-size:12px!important;white-space:normal!important;padding:7px!important}
#view-module.extra-tools-workspace .creator-guesthouse-thumb{display:block!important;width:100%!important;height:85px!important;object-fit:cover!important;border-radius:7px!important}

#view-module.extra-tools-workspace .creator-gallery-suggestions{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:7px!important;margin:8px 0!important}
#view-module.extra-tools-workspace .creator-gallery-suggestion{font-size:12px!important;white-space:normal!important;min-height:43px!important;max-width:100%!important;padding:8px!important}
#view-module.extra-tools-workspace .creator-gallery-suggestion[aria-pressed=true]{border:2px solid #a7e9f4!important;background:#25566b!important}
#view-module.extra-tools-workspace .creator-gallery-custom{display:flex!important;gap:7px!important;align-items:stretch!important;margin:9px 0 13px!important}
#view-module.extra-tools-workspace .creator-gallery-custom input{min-width:0!important;flex:1!important;font-size:14px!important}
#view-module.extra-tools-workspace .creator-gallery-custom button{width:auto!important;max-width:48%!important;white-space:normal!important;font-size:12px!important}
#view-module.extra-tools-workspace .creator-gallery-count{font-size:11px!important;opacity:.8!important}
`;
