// Business-specific owner facts: shared offline schema, no guessed amenities.
// Fields: id, Romanian label, English label, owner guidance/example.
export const CREATOR_BUSINESS_PROFILES={
 guesthouse:{ro:'Pensiune',en:'Guesthouse',offer:['Camere și ședere','Rooms & stays'],cta:['Solicită disponibilitatea','Enquire about availability'],lead:['O ședere în ritmul tău','A stay at your own pace'],fields:[['rooms','Tipuri de camere și capacitate','Room types & capacity','Ex.: 3 camere duble, baie proprie; numai date reale'],['hosting','Gazde și experiența șederii','Hosts & stay experience','Primire, specific local, acces pentru oaspeți'],['meals','Mese și spații comune','Meals & shared spaces','Precizează dacă micul dejun este inclus, opțional sau nu se oferă'],['arrival','Sosire și reguli de ședere','Arrival & house rules','Check-in / check-out, animale, copii; numai regulile reale']]},
 hotel:{ro:'Hotel',en:'Hotel',offer:['Camere și servicii hoteliere','Rooms & hotel services'],cta:['Cere o ofertă de cazare','Request a stay quote'],lead:['Cazare, cu detaliile care contează','Accommodation, with the details that matter'],fields:[['rooms','Categorii de camere și capacitate','Room categories & capacity','Ex.: camere standard / suite, capacitate și dotări confirmate'],['reception','Recepție și check-in','Reception & check-in','Programul real al recepției, check-in / check-out'],['hotelServices','Servicii hoteliere','Hotel services','Numai servicii existente: curățenie, room service, accesibilitate etc.'],['classification','Clasificare și servicii business','Classification & business facilities','Stele numai dacă sunt oficiale; săli sau servicii business numai dacă există']]},
 restaurant:{ro:'Restaurant',en:'Restaurant',offer:['Bucătărie și meniu','Cuisine & menu'],cta:['Întreabă despre o masă','Enquire about a table'],lead:['Bucătăria noastră, pe îndelete','Our cuisine, at your pace'],fields:[['cuisine','Bucătărie și preparate reprezentative','Cuisine & signature dishes','Specific culinar și preparate care există în meniu'],['menu','Meniu și tarife confirmate','Menu & confirmed prices','Preparate, prețuri cu monedă, informații despre alergeni verificate'],['service','Servirea mesei și programul bucătăriei','Dining & kitchen hours','Program, servire în local, terasă sau takeaway, dacă există'],['tables','Rezervări și grupuri','Tables & groups','Cum se solicită o masă; capacitate și condiții reale']]},
 cafe:{ro:'Cafenea / ceainărie',en:'Café / tea room',offer:['Cafea, ceai și pauze bune','Coffee, tea & good breaks'],cta:['Planifică o vizită','Plan a visit'],lead:['Un loc pentru pauza ta','A place for your pause'],fields:[['drinks','Cafea, ceai și metode de preparare','Coffee, tea & brewing','Băuturile reale, origini/metode numai dacă sunt confirmate'],['pastry','Patiserie și gustări','Pastries & light bites','Doar produsele oferite; nu presupune existența unei bucătării'],['hours','Program și servire','Opening hours & service','Program, consum în local / takeaway, după caz'],['space','Spațiu și facilități pentru vizitatori','Space & visitor facilities','Locuri, acces, prize/Wi-Fi numai dacă există']]},
 bar:{ro:'Bar / pub',en:'Bar / pub',offer:['Băuturi și atmosferă','Drinks & atmosphere'],cta:['Întreabă despre o vizită','Enquire about visiting'],lead:['Seara începe aici','Your evening starts here'],fields:[['drinks','Lista de băuturi','Drinks list','Cocktailuri, bere, vin și opțiuni fără alcool existente'],['hours','Program și acces','Hours & entry','Ore de deschidere, condiții de acces aplicabile'],['events','Muzică și evenimente confirmate','Confirmed music & events','Date și condiții reale, nu inventa programul serilor'],['groups','Grupuri și rezervări','Groups & reservations','Mese, evenimente private și gustări numai dacă sunt oferite']]},
 services:{ro:'Meseriaș / servicii',en:'Trades / services',offer:['Servicii și lucrări','Services & work'],cta:['Solicită o evaluare','Request an assessment'],lead:['Servicii explicate clar','Services, clearly explained'],fields:[['services','Servicii oferite','Services provided','Specializări și lucrări reale'],['coverage','Zonă de lucru și disponibilitate','Service area & availability','Localități, program, deplasare'],['process','Etape și estimarea costului','Process & estimates','Constatare, ofertă, execuție; fără promisiuni neconfirmate'],['credentials','Experiență și acreditări','Experience & credentials','Doar calificări și garanții verificabile']]},
 salon:{ro:'Salon / frumusețe',en:'Beauty salon',offer:['Tratamente și programări','Treatments & appointments'],cta:['Solicită o programare','Request an appointment'],lead:['Îngrijire, în stilul tău','Care, in your own style'],fields:[['treatments','Servicii și durate','Services & durations','Servicii disponibile și durata lor reală'],['prices','Tarife','Prices','Tarife confirmate cu monedă'],['team','Echipă și specializări','Team & specialisms','Nume și calificări numai cu acord și confirmare'],['appointments','Program și condiții de programare','Hours & appointment terms','Program, anulare, pregătire dacă este cazul']]},
 shop:{ro:'Magazin / produse',en:'Shop / products',offer:['Colecții și produse','Collections & products'],cta:['Întreabă despre produse','Enquire about products'],lead:['Produse alese cu grijă','Thoughtfully selected products'],fields:[['collections','Categorii și colecții','Categories & collections','Categorii reale de produse'],['products','Produse reprezentative','Featured products','Denumiri și prețuri confirmate; nu se presupune stocul'],['fulfilment','Ridicare și livrare','Collection & delivery','Zone, costuri și termene reale'],['returns','Retur și contact comercial','Returns & customer service','Condiții reale, nu o politică juridică inventată']]},
 personal:{ro:'Portofoliu',en:'Portfolio',offer:['Proiecte selectate','Selected projects'],cta:['Discută un proiect','Discuss a project'],lead:['Lucrări cu o perspectivă proprie','Work with a personal perspective'],fields:[['speciality','Specializare','Speciality','Domeniu și tipuri de proiecte'],['projects','Proiecte și contribuții','Projects & contributions','Lucrări reale și rolul tău în ele'],['process','Mod de colaborare','Collaboration','Etape, disponibilitate, condiții'],['links','Referințe furnizate de tine','Owner-provided references','Titluri și detalii verificabile']]},
 other:{ro:'Alt domeniu',en:'Other business',offer:['Ofertă și detalii','Offer & details'],cta:['Cere detalii','Enquire'],lead:['Oferta ta, prezentată clar','Your offer, clearly presented'],fields:[['offer','Ce oferi','What you offer','Produse sau servicii reale'],['audience','Cui te adresezi','Who it is for','Public și situații de utilizare'],['process','Cum se lucrează','How it works','Etape și condiții'],['details','Detalii practice','Practical details','Program, acces, informații verificate']]}
};
export const CREATOR_BUSINESS_SCRIPT='const extraCreatorBusinessProfiles='+JSON.stringify(CREATOR_BUSINESS_PROFILES)+';\n'+String.raw`
function extraCreatorBusinessProfile(kind){return extraCreatorBusinessProfiles[kind]||extraCreatorBusinessProfiles.other}
function extraCreatorBusinessFacts(kind,details={}){
 const profile=extraCreatorBusinessProfile(kind);
 return profile.fields.flatMap(([id,ro,en])=>typeof details[id]==='string'&&details[id].trim()?[{id,ro,en,value:details[id].trim().slice(0,700)}]:[]);
}
function extraCreatorBusinessText(kind,details={}){
 return extraCreatorBusinessFacts(kind,details).map(x=>x.ro+': '+x.value).join('\n');
}
function extraCreatorBusinessControls(area,type,changed){
 const drafts=new Map();
 const summary=extraToolsEl('p','extra-work-note');
 const button=extraToolsBtn('',open);button.classList.add('creator-business-open');
 const getDetails=()=>({...drafts.get(type.value)});
 function update(){const p=extraCreatorBusinessProfile(type.value),count=extraCreatorBusinessFacts(type.value,getDetails()).length;
  button.textContent=extraToolsLocale('Completează datele pentru: ','Complete details for: ')+extraToolsLocale(p.ro,p.en);
  summary.textContent=extraToolsLocale('Secțiuni specifice completate: ','Business-specific sections completed: ')+count+'/'+p.fields.length;
 }
 function open(){
  const kind=type.value,p=extraCreatorBusinessProfile(kind),draft={...getDetails()};
  const overlay=extraToolsEl('div','creator-business-overlay');
  const dialog=extraToolsEl('section','creator-business-dialog');dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
  dialog.setAttribute('aria-label',extraToolsLocale(p.ro,p.en));
  const heading=extraToolsEl('h3','',extraToolsLocale(p.ro,p.en)+' · '+extraToolsLocale('Date pentru site','Website details'));
  const body=extraToolsEl('div','creator-business-fields');
  body.append(extraToolsEl('p','extra-work-note',extraToolsLocale('Completează numai date reale. Câmpurile goale nu apar pe site. Schimbarea domeniului nu mută aceste date la alt tip de afacere.','Enter actual facts only. Empty fields are omitted. Switching business type keeps each type’s details separate.')));
  const inputs=[];
  for(const [id,ro,en,hint] of p.fields){const field=extraToolsField(body,extraToolsLocale(ro,en),'textarea',state.language==='ro'?hint:en);field.value=draft[id]||'';field.maxLength=700;field.rows=3;field.dataset.businessField=id;inputs.push([id,field])}
  const actions=extraToolsEl('div','creator-business-actions');
  const cancel=extraToolsBtn(extraToolsLocale('Anulează','Cancel'),()=>{overlay.remove();button.focus()});
  const save=extraToolsBtn(extraToolsLocale('Salvează detaliile','Save details'),()=>{drafts.set(kind,Object.fromEntries(inputs.map(([id,f])=>[id,f.value.trim()])));changed();update();overlay.remove();button.focus()},true);
  actions.append(cancel,save);dialog.append(heading,body,actions);overlay.append(dialog);document.body.append(overlay);
  overlay.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();overlay.remove();button.focus()}if(e.key==='Tab'){const list=Array.from(dialog.querySelectorAll('textarea,button'));const first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
  inputs[0]?.[1].focus();
 }
 area.append(button,summary);type.addEventListener('change',()=>{changed();update()});update();return {getDetails};
}
`;
export const CREATOR_BUSINESS_STYLE=String.raw`
.creator-business-overlay{position:fixed!important;inset:0!important;z-index:999999!important;background:#03131cef!important;padding:12px!important;display:flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important}
.creator-business-dialog{display:flex!important;flex-direction:column!important;min-height:0!important;width:min(100%,700px)!important;max-height:92dvh!important;background:#0c293b!important;border:1px solid #75c5cf!important;border-radius:18px!important;padding:16px!important;box-sizing:border-box!important;gap:12px!important;color:#f4fcff!important}
.creator-business-dialog h3{margin:0!important;font-size:20px!important;line-height:1.3!important}
.creator-business-fields{overflow-y:auto!important;min-height:0!important;overscroll-behavior:contain!important}
.creator-business-fields textarea{display:block!important;box-sizing:border-box!important;width:100%!important;max-width:100%!important;min-height:84px!important;background:#102f41!important;color:white!important;border:1px solid #63adbd!important;border-radius:10px!important;padding:10px!important;font:16px/1.4 system-ui!important}
.creator-business-fields label{display:block!important;margin:10px 0!important;font-size:14px!important;line-height:1.4!important}
.creator-business-actions{display:flex!important;gap:8px!important;flex-shrink:0!important}
.creator-business-actions button{flex:1!important;min-height:48px!important;font-size:14px!important;white-space:normal!important}
@media(max-height:500px){.creator-business-dialog{max-height:96dvh!important;padding:10px!important;gap:6px!important}}
`;
