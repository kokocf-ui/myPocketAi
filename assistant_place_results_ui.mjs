// Small, opt-in UI addition. Runs inside the existing frontend's IIFE.
// Uses existing answer-reader dialog, navigation and assistant conversation.
export const ASSISTANT_PLACE_RESULTS_SCRIPT = String.raw`
function openAssistantPlaceResults(places){
 if(!Array.isArray(places)||!places.length)return false;
 const results=places.slice(0,100),perPage=6,host=document.createElement('div');
 host.dataset.directChoices='true';
 host.style.cssText='width:100%;min-width:0;display:flex;flex-direction:column;gap:9px';
 const title=dialogText('Rezultatele căutării','Search results');
 let page=0;
 const action=(label,handler)=>{
  const b=document.createElement('button');b.type='button';
  b.className='transit-choice-action';
  b.style.cssText='min-height:43px;min-width:0;width:100%;white-space:normal;overflow-wrap:anywhere;text-align:left';
  b.textContent=label;b.addEventListener('click',handler);return b;
 };
 const line=(name,value)=>{
  const row=document.createElement('p');row.style.cssText='margin:7px 0;overflow-wrap:anywhere;line-height:1.5';
  const caption=document.createElement('strong');caption.textContent=name+': ';
  row.append(caption,document.createTextNode(value));return row;
 };
 const detail=place=>{
  const name=String(place.name||place.tags?.name||dialogText('Locație','Location')).trim();
  const address=String(place.address||place.formatted||dialogText('Adresă indisponibilă','Address unavailable'));
  const phone=String(place.phone||place.telephone||place.contact_phone||place.tags?.phone||
   place.tags?.['contact:phone']||'').trim();
  host.replaceChildren();
  host.append(line(dialogText('Nume','Name'),name),line(dialogText('Adresă','Address'),address),
   line(dialogText('Telefon','Phone'),phone||dialogText('Nu este disponibil','Not available')));
  if(phone&&/^[+0-9() .-]{5,35}$/.test(phone)){
   const call=action(dialogText('Apelează','Call'),()=>{window.location.href='tel:'+phone.replace(/[^+\d]/g,'')});
   host.append(call);
  }
  const latitude=Number(place.latitude),longitude=Number(place.longitude);
  if(place.latitude!=null&&place.longitude!=null&&Number.isFinite(latitude)&&Number.isFinite(longitude)
    &&Math.abs(latitude)<=90&&Math.abs(longitude)<=180){
   host.append(action(dialogText('Navighează către locație','Navigate to location'),()=>{
    if(state.busy)return;
    document.getElementById('pocketStandaloneChoices')?.remove();
    const label=[name,address].filter(Boolean).join(', ').slice(0,240);
    // Keep the user's assistant conversation open while choosing a travel mode.
    // Without this flag, the shared router switches to the Maps module.
    state.assistantStructuredDestination=true;
    const opened=openTransportModeFromAssistant({route_context:{destination_query:label,
     destination:{latitude,longitude,label},pending:'profile'}});
    if(!opened)state.assistantStructuredDestination=false;
   }));
  }
  host.append(action(dialogText('Înapoi la rezultate','Back to results'),()=>renderPage()));
  openStandaloneChoicePanel(host,name,{keepOpen:true});
 };
 const renderPage=()=>{
  host.replaceChildren();
  const pages=Math.ceil(results.length/perPage);
  const status=document.createElement('p');status.style.cssText='font-size:13px;margin:3px 0 9px';
  status.textContent=results.length+' '+dialogText('rezultate','results')+' · '+dialogText('Pagina','Page')+' '+(page+1)+'/'+pages;
  host.append(status);
  const table=document.createElement('table');table.className='travel-mode-table';
  table.style.cssText='width:100%;table-layout:fixed';
  const tbody=document.createElement('tbody');
  for(const place of results.slice(page*perPage,(page+1)*perPage)){
   const tr=document.createElement('tr'),td=document.createElement('td');
   td.style.cssText='width:100%;overflow-wrap:anywhere';
   const name=String(place.name||place.tags?.name||dialogText('Locație','Location'));
   const address=String(place.address||place.formatted||'');
   td.append(action(name+(address?' — '+address:''),()=>detail(place)));tr.append(td);tbody.append(tr);
  }
  table.append(tbody);host.append(table);
  if(pages>1){
   const nav=document.createElement('div');nav.style.cssText='display:flex;gap:8px;justify-content:space-between';
   const prev=action(dialogText('‹ Anterior','‹ Previous'),()=>{if(page>0){page--;renderPage()}});
   const next=action(dialogText('Următoarea ›','Next ›'),()=>{if(page<pages-1){page++;renderPage()}});
   prev.disabled=page===0;next.disabled=page===pages-1;
   prev.style.textAlign='center';next.style.textAlign='center';nav.append(prev,next);host.append(nav);
  }
  openStandaloneChoicePanel(host,title,{keepOpen:true});
 };
 renderPage();return true;
}
function openHotelEvaDialogue(){
 const view=$('view-module');
 if(state.currentModule!=='travel')return;
 view.classList.remove('module-landing');
 $('moduleContent').replaceChildren();
 $('moduleLead').textContent=dialogText('Întreab-o pe Eva despre hoteluri, cazări sau alte locuri.','Ask Eva about hotels and places.');
 document.getElementById('moduleQuickLayer')?.classList.remove('open');
 document.getElementById('moduleQuickLayer')?.setAttribute('aria-hidden','true');
 inputEl.placeholder=dialogText('Ce dorești să cauți?','What would you like to find?');
}
`;
