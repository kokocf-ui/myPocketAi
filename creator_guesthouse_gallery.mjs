export const CREATOR_GUESTHOUSE_SCRIPT=String.raw`
function extraCreatorGuesthouseControls(area,type,desc){
 const section=extraToolsEl('section','creator-guesthouse-gallery');
 const photos=new Map(),normalize=x=>String(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const categories=()=>type.value==='hotel'?extraCreatorSiteDetails(desc.value,'hotel').counts:[];
 const getGallery=()=>categories().flatMap(c=>(photos.get(normalize(c.title))||[]).flatMap((data,i)=>
  data?[{group:'room',roomLabel:c.title,caption:c.title+' — '+(i+1),data}]:[]));
 async function readPhoto(file){
  if(!file||!/^image\/(?:jpeg|png|webp)$/.test(file.type)||file.size>8*1024*1024)throw Error('Alege o fotografie JPG/PNG/WebP de maximum 8 MB.');
  const url=URL.createObjectURL(file),image=new Image();image.src=url;
  try{await image.decode()}finally{URL.revokeObjectURL(url)}
  const canvas=extraToolsEl('canvas'),factor=Math.min(1,760/Math.max(image.naturalWidth,image.naturalHeight));
  canvas.width=Math.max(1,Math.round(image.naturalWidth*factor));
  canvas.height=Math.max(1,Math.round(image.naturalHeight*factor));
  canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
  for(const quality of [.7,.56,.43,.3,.2]){
   const result=canvas.toDataURL('image/webp',quality);if(result.length<=105000)return result;
  }
  throw Error('Imaginea nu poate fi comprimată suficient. Alege o imagine mai mică.');
 }
 function refresh(){
  section.replaceChildren();
  if(type.value!=='hotel'){section.hidden=true;return}
  section.hidden=false;
  section.append(extraToolsEl('h3','',extraToolsLocale('Galerie pe tipuri de camere','Gallery by room type')));
  section.append(extraToolsEl('p','extra-work-note',extraToolsLocale('Fotografia pensiunii se adaugă prima, deasupra. Alege maximum 2 fotografii pentru fiecare categorie; altele pot fi adăugate ulterior din administrare.','First add the guesthouse exterior photo above. Select up to two images per category; add more later from administration.')));
  const rooms=categories();
  if(!rooms.length){
   section.append(extraToolsEl('p','extra-work-note',extraToolsLocale('Scrie în descriere tipurile: 5 camere single, 10 duble, 3 apartamente.','Describe room types: 5 singles, 10 doubles, 3 apartments.')));
  }
  for(const c of rooms){
   const id=normalize(c.title);if(!photos.has(id))photos.set(id,[null,null]);
   const group=extraToolsEl('details','creator-guesthouse-room');
   const summary=extraToolsEl('summary','',c.value+' × '+c.title);
   group.append(summary);
   const slots=extraToolsEl('div','creator-guesthouse-slots');
   for(let n=0;n<2;n++){
    const holder=extraToolsEl('div','creator-guesthouse-slot');
    const input=extraToolsEl('input','extra-creator-photo');input.type='file';input.accept='image/jpeg,image/png,image/webp';input.hidden=true;
    const button=extraToolsBtn(extraToolsLocale('＋ Fotografie ','＋ Photo ')+(n+1),()=>input.click());
    const stored=photos.get(id)[n];
    if(stored){const img=extraToolsEl('img','creator-guesthouse-thumb');img.src=stored;img.alt=c.title+' '+(n+1);button.prepend(img)}
    input.onchange=async()=>{
     try{if(!input.files?.[0])return;photos.get(id)[n]=await readPhoto(input.files[0]);refresh()}
     catch(error){extraToolsStatus(error.message)}finally{input.value=''}
    };
    holder.append(input,button);
    if(stored)holder.append(extraToolsBtn(extraToolsLocale('Șterge','Remove'),()=>{photos.get(id)[n]=null;refresh()}));
    slots.append(holder);
   }
   group.append(slots);section.append(group);
  }
 }
 area.append(section);
 type.addEventListener('change',refresh);desc.addEventListener('input',refresh);refresh();
 return {getGallery,refresh};
}
function extraCreatorGuesthouseInjectGallery(html,images){
 const list=(Array.isArray(images)?images:[]).filter(x=>x&&typeof x.roomLabel==='string'&&typeof x.data==='string'&&/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/i.test(x.data)&&x.data.length<165000).slice(0,40);
 if(!list.length)return html;
 const byType=new Map();
 for(const photo of list){const room=photo.roomLabel.trim().slice(0,100);if(!room)continue;if(!byType.has(room))byType.set(room,[]);byType.get(room).push(photo)}
 if(!byType.size)return html;
 return html.replace(/<section class="contact" id="contact-(ro|en)">/g,(match,lang)=>{
  let counter=0;
  const groups=Array.from(byType.entries()).map(([room,pics])=>'<div class="room-gallery-category"><h3>'+extraCreatorEscape(room)+'</h3><div class="room-gallery-grid">'+pics.map(p=>{
   const id='room-gallery-photo-'+lang+'-'+(counter++);
   const alt=extraCreatorEscape(p.caption||room);
   return '<a class="room-gallery-tile" href="#'+id+'"><img src="'+p.data+'" loading="lazy" alt="'+alt+'"></a><div class="room-gallery-full" id="'+id+'"><a href="#room-gallery-'+lang+'" class="room-gallery-close" aria-label="Close">×</a><img src="'+p.data+'" alt="'+alt+'"></div>';
  }).join('')+'</div></div>').join('');
  return '<section id="room-gallery-'+lang+'" class="room-gallery-section"><h2>'+(lang==='ro'?'Galeria camerelor':'Room photo gallery')+'</h2>'+groups+'</section>'+match;
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
`;
