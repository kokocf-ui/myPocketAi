export const POCKET_IMAGE_GENERATOR_UI_SCRIPT=String.raw`
function pocketImageGeneratorWorkspace(area,work){
 const loc=(ro,en)=>extraToolsLocale(ro,en);
 const section=extraToolsEl('section','pocket-image-generator');
 section.append(extraToolsEl('h3','pocket-image-title',loc('✨ Generează o imagine cu Eva','✨ Create an image with Eva')));
 section.append(extraToolsEl('p','extra-work-note',loc('Fiecare apăsare pe Generează solicită o singură imagine AI.','Each Generate tap requests one AI image.')));
 const prompt=extraToolsField(section,loc('Descrierea imaginii','Describe the image'),'textarea',loc('Ex.: o cabană de lemn la munte, lângă un lac, la apus','E.g. a wooden cabin in the mountains by a lake at sunset'));
 prompt.maxLength=750;prompt.rows=3;
 const choose=(host,ro,en,choices,selected)=>{
  const field=extraToolsField(host,loc(ro,en),'select');
  choices.forEach(([value,labelRo,labelEn])=>{const option=extraToolsEl('option','',loc(labelRo,labelEn));option.value=value;field.append(option)});
  field.value=selected;return field;
 };
 const style=choose(section,'Stil artistic','Art style',[
 ['realistic','Fotorealist','Photorealistic'],['cinematic','Cinematografic','Cinematic'],['digital','Artă digitală','Digital art'],
 ['oil','Pictură în ulei','Oil painting'],['watercolor','Acuarelă','Watercolour'],['acrylic','Acrilic','Acrylic painting'],
 ['pencil','Creion','Pencil drawing'],['ink','Tuș','Ink drawing'],['charcoal','Cărbune','Charcoal'],
 ['anime','Anime','Anime'],['cartoon','Desen animat','Cartoon'],['comic','Bandă desenată','Comic book'],
 ['3d','Randare 3D','3D render'],['clay','Plastilină','Claymation'],['pixel','Pixel art','Pixel art'],
 ['retro','Retro','Retro'],['vintage','Poster vintage','Vintage poster'],['fantasy','Fantastic','Fantasy'],
 ['scifi','Science fiction','Science fiction'],['surreal','Suprarealist','Surrealist'],
 ['impressionist','Impresionist','Impressionist'],['minimal','Minimalist','Minimalist'],
 ['isometric','Izometric','Isometric'],['lowpoly','Low-poly','Low poly'],
 ['architecture','Arhitectură','Architecture'],['product','Fotografie de produs','Product photography']
 ],'realistic');
 const aspect=choose(section,'Formatul imaginii','Image format',[
 ['1:1','Pătrat 1:1','Square 1:1'],['4:3','Orizontal 4:3','Landscape 4:3'],
 ['16:9','Panoramic 16:9','Widescreen 16:9'],['3:4','Portret 3:4','Portrait 3:4'],['9:16','Vertical 9:16','Vertical 9:16']
 ],'1:1');
 const advanced=extraToolsEl('details','pocket-image-advanced');
 advanced.append(extraToolsEl('summary','',loc('Opțiuni artistice suplimentare','Additional creative options')));
 const mood=choose(advanced,'Atmosferă','Mood',[
 ['neutral','Naturală','Natural'],['warm','Caldă','Warm'],['dramatic','Dramatică','Dramatic'],['calm','Liniștită','Calm'],
 ['playful','Veselă','Playful'],['mysterious','Misterioasă','Mysterious'],['epic','Epică','Epic']
 ],'neutral');
 const lighting=choose(advanced,'Iluminare','Lighting',[
 ['auto','Automată','Automatic'],['daylight','Lumină naturală','Daylight'],['golden','Ora aurie','Golden hour'],
 ['studio','Studio','Studio'],['night','Noapte','Night'],['neon','Neon','Neon'],
 ['soft','Lumină difuză','Soft light'],['contrast','Contrast mare','High contrast']
 ],'auto');
 const composition=choose(advanced,'Perspectivă','Composition',[
 ['auto','Automată','Automatic'],['portrait','Portret apropiat','Close-up portrait'],['wide','Cadru larg','Wide shot'],
 ['macro','Macro','Macro'],['overhead','De sus','Top-down'],['isometric','Izometrică','Isometric'],['center','Centrată','Centred']
 ],'auto');
 const palette=choose(advanced,'Paleta de culori','Colour palette',[
 ['auto','Naturală','Natural'],['vivid','Intense','Vivid'],['pastel','Pastel','Pastel'],['earth','Pământii','Earthy'],
 ['mono','Alb-negru','Black and white'],['cool','Reci','Cool'],['warm','Calde','Warm']
 ],'auto');
 const quality=choose(advanced,'Calitate','Quality',[
 ['standard','Standard (4 pași)','Standard (4 steps)'],['detailed','Detaliat (8 pași)','Detailed (8 steps)']
 ],'standard');
 const avoid=extraToolsField(advanced,loc('Ce elemente evităm? (opțional)','What should be avoided? (optional)'),'text','');
 avoid.maxLength=180;
 const seed=extraToolsField(advanced,loc('Seed (opțional)','Seed (optional)'),'text','');
 seed.inputMode='numeric';seed.maxLength=10;
 advanced.append(extraToolsEl('p','extra-work-note',loc('Modelul generează pătrat. Celelalte formate se decupează local, fără deformare.','The model generates square images. Other formats are cropped locally without distortion.')));
 section.append(advanced);
 const generated=extraToolsEl('div','pocket-image-result');generated.hidden=true;
 const preview=extraToolsEl('img','pocket-image-preview');preview.alt=loc('Imagine creată de Eva','Image created by Eva');generated.append(preview);
 const detail=extraToolsEl('p','extra-work-note');generated.append(detail);
 const fullscreen=extraToolsEl('dialog','pocket-image-fullscreen');
 const fullImage=extraToolsEl('img');fullImage.alt=preview.alt;
 fullscreen.append(extraToolsBtn(loc('← Înapoi','← Back'),()=>fullscreen.close()),fullImage);
 const showFull=()=>{if(!work.image)return;fullImage.src=work.canvas.toDataURL('image/png');if(!fullscreen.open)fullscreen.showModal()};
 preview.onclick=showFull;
 extraToolsActions(generated,
  extraToolsBtn(loc('🔍 Pe tot ecranul','🔍 Full screen'),showFull),
  extraToolsBtn(loc('💾 Salvează PNG','💾 Save PNG'),()=>work.imageSaveButton?.click())
 );
 const status=extraToolsEl('p','extra-work-status');status.setAttribute('role','status');
 const generate=async()=>{
  if(work.controller)return;
  const description=prompt.value.trim();
  if(description.length<3){status.textContent=loc('Descrie mai întâi imaginea.','Describe the image first.');return}
  const controller=new AbortController();work.controller=controller;generateButton.disabled=true;variationButton.disabled=true;
  status.textContent=loc('Eva generează imaginea…','Eva is generating the image…');
  try{
   const api=CLIENT_CONFIG.apiUrl.replace(/\/api\/chat(?:\?.*)?$/,'/api/image');
   const response=await fetch(api,{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,
    body:JSON.stringify({prompt:description,style:style.value,aspect:aspect.value,mood:mood.value,
     lighting:lighting.value,composition:composition.value,palette:palette.value,
     quality:quality.value,avoid:avoid.value,seed:seed.value})});
   const data=await response.json();
   if(!response.ok||data.status!=='success'||typeof data.image!=='string')throw Error(data.error||'failed');
   if(data.image.length>12000000)throw Error('invalid_image_response');
   const source=new Image();source.src='data:image/jpeg;base64,'+data.image;await source.decode();
   if(extraToolsSession!==work||!work.area?.isConnected)return;
   const dims={'1:1':[1024,1024],'4:3':[1024,768],'16:9':[1280,720],'3:4':[768,1024],'9:16':[720,1280]}[aspect.value]||[1024,1024];
   const canvas=work.canvas;if(!canvas)throw Error('canvas_unavailable');
   canvas.width=dims[0];canvas.height=dims[1];
   const scale=Math.max(dims[0]/source.width,dims[1]/source.height),sw=dims[0]/scale,sh=dims[1]/scale;
   canvas.getContext('2d').drawImage(source,(source.width-sw)/2,(source.height-sh)/2,sw,sh,0,0,dims[0],dims[1]);
   const rendered=new Image();rendered.src=canvas.toDataURL('image/png');await rendered.decode();
   if(extraToolsSession!==work)return;
   work.image=rendered;work.imageWidth=dims[0];work.imageHeight=dims[1];work.rotation=0;work.gray=false;
   work.generatorPreview=preview;preview.src=rendered.src;generated.hidden=false;
   seed.value=String(data.seed??'');detail.textContent=loc('Imagine creată · seed ','Created image · seed ')+seed.value+' · '+dims.join(' × ')+' PNG';
   status.textContent=loc('Imagine pregătită. Poți salva PNG sau edita local imaginea.','Image ready. Save PNG or edit the image locally.');
  }catch(e){
   if(extraToolsSession!==work)return;
   const errors={
    image_quota_exceeded:loc('Cota Cloudflare pentru imagini a fost atinsă.','Cloudflare image quota reached.'),
    image_provider_unavailable:loc('Motorul de imagini nu este disponibil.','Image engine unavailable.'),
    invalid_image_prompt:loc('Descriere nevalidă (3–750 caractere).','Invalid description (3–750 characters).')
   };
   status.textContent=e.name==='AbortError'?loc('Generare anulată.','Generation cancelled.'):(errors[e.message]||loc('Nu am putut genera imaginea; rezultatul anterior rămâne disponibil.','Generation failed; the previous result remains available.'));
  }finally{if(extraToolsSession===work){work.controller=null;generateButton.disabled=false;variationButton.disabled=false}}
 };
 const generateButton=extraToolsBtn(loc('✨ Generează imaginea','✨ Generate image'),generate,true);
 const variationButton=extraToolsBtn(loc('↻ Variație nouă','↻ New variation'),()=>{seed.value='';generate()});
 extraToolsActions(section,generateButton,variationButton);
 section.append(generated,status,fullscreen);area.append(section);
}
`;
export const POCKET_IMAGE_GENERATOR_UI_STYLE=String.raw`
#view-module.extra-tools-workspace .pocket-image-generator{box-sizing:border-box;border:1px solid #537c91;border-radius:15px;padding:10px;margin:8px 0 16px;background:#112d40;width:100%;min-width:0}
#view-module.extra-tools-workspace .pocket-image-title{font-size:17px;margin:3px 0 8px;color:#f1e9f0}
#view-module.extra-tools-workspace .pocket-image-advanced{border:1px solid #537e94;border-radius:9px;padding:8px;margin:9px 0}
#view-module.extra-tools-workspace .pocket-image-advanced summary{cursor:pointer;min-height:42px;display:flex;align-items:center;font-weight:750;touch-action:manipulation}
#view-module.extra-tools-workspace .pocket-image-result{margin-top:12px;border:1px solid #568da5;padding:8px;border-radius:12px}
#view-module.extra-tools-workspace img.pocket-image-preview{display:block;width:auto;max-width:100%;max-height:42dvh;object-fit:contain;border-radius:8px;margin:auto}
.pocket-image-fullscreen{position:fixed;inset:8px;box-sizing:border-box;max-width:calc(100vw - 16px);max-height:calc(100dvh - 16px);width:calc(100vw - 16px);height:calc(100dvh - 16px);padding:10px;background:#0e2638;color:white;border:1px solid #557b90;border-radius:14px;z-index:9999;overflow:auto}
.pocket-image-fullscreen>button{display:block;margin:0 0 10px;min-height:45px}
.pocket-image-fullscreen>img{display:block;max-width:100%;max-height:calc(100dvh - 90px);object-fit:contain;margin:auto}
.pocket-image-fullscreen::backdrop{background:rgba(0,0,0,.88)}
`;
