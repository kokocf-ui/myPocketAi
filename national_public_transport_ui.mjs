export const NATIONAL_PUBLIC_TRANSPORT_SCRIPT=String.raw`
// Only Maps > National public transport; GPS country and domestic routes are verified server-side.
let nationalTransitSession=null;
function showNationalTransitSearch(choice){
 if(nationalTransitSession?.stop)nationalTransitSession.stop();
 state.moduleSearchCategory=choice;state.moduleSearchReturnMode='root';
 setModuleLayerMode(dialogText('Transport public național','National public transport'));
 const ro=state.language==='ro',host=$('moduleLayerBody');
 const t=key=>({
  label:ro?'Unde dorești să ajungi?':'Where would you like to go?',
  hint:ro?'Scrie o localitate, adresă sau stație. Căutarea este numai în țara ta.':'Enter a place, address or station. Search is limited to your country.',
  placeholder:ro?'Destinație în țara ta':'Destination within your country',
  waiting:ro?'Se identifică țara prin GPS…':'Detecting country from GPS…',
  denied:ro?'Permite accesul la locația GPS pentru transportul național.':'Allow GPS location for national transport.',
  unknown:ro?'Țara nu a putut fi verificată. Reîncearcă.':'Country could not be verified. Retry.',
  unsupported:ro?'Nu este conectat încă un motor verificat de transport public pentru această țară.':'A verified public transport planner is not connected for this country.',
  scope:ro?'Țara':'Country',
  search:ro?'Caută transport public':'Find public transport',
  back:ro?'← Înapoi':'← Back',
  retry:ro?'Reverifică GPS':'Retry GPS',
  short:ro?'Începe să scrii destinația.':'Start typing your destination.',
  lookup:ro?'Caut destinații în țara identificată…':'Searching destinations in your country…',
  noresults:ro?'Nu există sugestii verificate în această țară.':'No confirmed results within this country.',
  failed:ro?'Nu am putut încărca sugestiile. Reîncearcă.':'Suggestions unavailable. Retry.',
  selected:ro?'Destinație confirmată':'Confirmed destination'
 })[key];
 const root=document.createElement('section');root.className='national-transit-one-field';
 root.style.cssText='display:flex;flex-direction:column;gap:10px;min-width:0;padding:4px 0 14px';
 const label=document.createElement('strong');label.textContent=t('label');
 const field=document.createElement('input');field.type='text';field.className='journey-one-field-input';field.autocomplete='off';field.spellcheck=false;field.maxLength=190;field.disabled=true;field.placeholder=t('placeholder');field.setAttribute('aria-label',t('label'));
 field.style.cssText='width:100%;min-height:54px;box-sizing:border-box;border-radius:16px;padding:12px;background:#102d40;border:2px solid #62b9d0;color:#fff;font-size:16px;touch-action:manipulation';
 const hint=document.createElement('p');hint.textContent=t('hint');hint.style.cssText='margin:0;font-size:13px;color:#b7d3df';
 const status=document.createElement('p');status.textContent=t('waiting');status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.style.cssText='margin:0;min-height:22px;font-size:13px;color:#c8e0e9';
 const choices=document.createElement('div');choices.className='national-transit-suggestions';choices.style.cssText='display:flex;flex-direction:column;gap:7px;max-height:40dvh;overflow-y:auto;overscroll-behavior:contain';
 const selectedText=document.createElement('p');selectedText.style.cssText='font-weight:700;margin:0;overflow-wrap:anywhere';
 const createButton=(caption,click)=>{const btn=document.createElement('button');btn.type='button';btn.className='module-result-card journey-primary-action';btn.style.cssText='min-width:0;min-height:55px;flex:1 1 0;padding:10px 12px;white-space:normal;font-size:15px;font-weight:750;touch-action:manipulation';btn.textContent=caption;btn.onclick=click;return btn};
 let country='',point=null,origin=null,seq=0,timer=null,abort=null;
 const session={stop(){seq++;clearTimeout(timer);abort?.abort()}};nationalTransitSession=session;
 const alive=()=>root.isConnected&&nationalTransitSession===session&&state.currentView==='module'&&state.currentModule==='maps';
 const searchNodes=[];
 const resetCalendarScroll=()=>{
  for(let element=host;element&&element.id!=='moduleQuickLayer';element=element.parentElement)element.scrollTop=0;
 };
 const openDeparture=()=>{
  if(!alive()||state.busy||state.moduleSearchBusy||!country||!origin||!point||String(point.country_code||'').toUpperCase()!==country)return;
  // Calendar appears AFTER the national destination is confirmed, BEFORE offers.
  const destination={latitude:Number(point.latitude),longitude:Number(point.longitude),
   label:String(point.label||''),city:String(point.city||''),country_code:country,
   stop_id:String(point.stop_id||'')};
  const step=createTransportDepartureStep({
   title:ro?'Când dorești să pleci?':'When would you like to leave?',
   destination:destination.label,
   onBack:()=>{
    root.replaceChildren(...searchNodes);
    if(point){
     const again=createButton(String(point.label||''),()=>openDeparture());
     again.className='transit-choice-action journey-suggestion';
     again.style.flex='0 0 auto';again.style.width='100%';again.style.textAlign='left';
     choices.replaceChildren(again);
    }
    resetCalendarScroll();
   },
   onSearch:async departureAt=>{
    if(!alive()||state.busy||state.moduleSearchBusy)return;
    session.stop();
    await runModuleSearch({...choice,kind:'transit',nationalPublicTransport:true,mixedJourney:false,transitDirect:true,
     transitDestination:destination,
     transitQuery:destination.label,transitPreference:'all',transitDepartureOffset:0,transitDepartureAt:departureAt,
     prompt:(ro?'Transport public către ':'Public transport to ')+destination.label});
   }
  });
  // Keep the calendar in the first visible position instead of below the search form.
  root.replaceChildren(step);
  resetCalendarScroll();
 };
 // The parent quick-layer header already provides Back.
 const lookup=async()=>{
  if(!alive()||!country)return;
  const query=field.value.trim();if(query.length<2){status.textContent=t('short');return}
  const n=++seq;abort?.abort();abort=new AbortController();status.textContent=t('lookup');
  try{
   // Keep the exact destination. Retry only the named station when the
   // geocoder cannot parse an address containing it; never select a town.
   const stationRequest=/\b(?:railway\s+station|train\s+station|station|gara|gară)\b/i.test(query);
   const stationName=query.split(',')[0].trim();
   const fallback=stationRequest&&stationName!==query?stationName:'';
   let options=[];
   for(const attempt of [query,...(fallback?[fallback]:[])]){
    const response=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},signal:abort.signal,body:JSON.stringify({journey_suggest:{query:attempt,country_code:country,location:origin}})});
    const data=await response.json();if(!response.ok)throw Error('search_unavailable');
    if(!alive()||n!==seq)return;
    const candidates=(Array.isArray(data.candidates)?data.candidates:[]).filter(p=>String(p.country_code||'').toUpperCase()===country);
    options=stationRequest?candidates.filter(p=>{
     const name=String(p._name||p.label||'').toLowerCase(),kind=String(p.kind||'')+' '+String((p._categories||[]).join(' '));
     const base=stationName.replace(/\b(?:railway|train|station)\b/gi,'').trim().toLowerCase();
     return name.includes(base)&&(/station|railway|public_transport|train|rail/i.test(kind)||/station|railway/i.test(name));
    }):candidates;
    if(options.length)break;
   }
   if(!alive()||n!==seq)return;choices.replaceChildren();
   status.textContent=options.length?'':t('noresults');
   for(const candidate of options.slice(0,8)){
    const btn=createButton(String(candidate.label||''),()=>{
     point=candidate;field.value=candidate.label;choices.replaceChildren();selectedText.textContent='';status.textContent='';
     // A verified suggestion is the confirmation: open the calendar immediately.
     openDeparture();
    });
    btn.className='transit-choice-action journey-suggestion';btn.style.flex='0 0 auto';btn.style.width='100%';btn.style.textAlign='left';choices.append(btn);
   }
  }catch(err){if(alive()&&n===seq&&err?.name!=='AbortError')status.textContent=t('failed')}
 };
 field.addEventListener('input',()=>{
  seq++;clearTimeout(timer);abort?.abort();point=null;choices.replaceChildren();selectedText.textContent='';
  if(field.value.trim().length<2){status.textContent=t('short');return}
  timer=setTimeout(()=>void lookup(),300);
 });
 field.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();if(point)openDeparture();else{clearTimeout(timer);void lookup()}}});
 const retry=createButton(t('retry'),()=>void detect());retry.hidden=true;retry.style.display='none';
 const detect=async()=>{
  country='';point=null;field.disabled=true;choices.replaceChildren();selectedText.textContent='';status.textContent=t('waiting');retry.hidden=true;retry.style.display='none';
  try{
   origin=await getCurrentCoordinates(false);if(!alive())return;
   if(!Number.isFinite(origin?.latitude)||!Number.isFinite(origin?.longitude))throw Error('gps_denied');
   const response=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({national_transit_country:{location:origin}})});
   const data=await response.json();if(!alive())return;
   const code=String(data.country_code||'').toUpperCase();
   if(!response.ok||!/^[A-Z]{2}$/.test(code))throw Error('country_unverified');
   if(data.supported!==true){status.textContent=t('unsupported');retry.hidden=false;retry.style.display='block';return}
   country=code;field.disabled=false;let name=country;
   try{name=new Intl.DisplayNames([state.language||'ro'],{type:'region'}).of(country)||country}catch{}
   // A connected provider is not proof of live timetables. Show exactly
   // which Romanian adapter is configured before destination entry.
   const coverage=code==='RO'&&data.provider_coverage&&typeof data.provider_coverage==='object'
    ?data.provider_coverage:null;
   status.style.whiteSpace='pre-line';
   status.textContent=t('scope')+': '+name+'. '+t('short')+
    (coverage?'\n'+(ro?'Tren/autocar':'Train/coach')+': '+
      (coverage.intercity_configured?(ro?'configurat':'configured'):(ro?'neconfigurat':'not configured'))+
      ' · '+(ro?'Transport urban':'City transport')+': '+
      (coverage.urban_configured?(ro?'configurat':'configured'):(ro?'neconfigurat':'not configured')):'');
   const saved=choice?.transitDestination;
   if(saved&&Number.isFinite(Number(saved.latitude))&&Number.isFinite(Number(saved.longitude))&&
      String(saved.country_code||country).toUpperCase()===country){
    point={...saved,country_code:country};field.value=String(point.label||'');
    const again=createButton(field.value,()=>openDeparture());
    again.className='transit-choice-action journey-suggestion';
    again.style.flex='0 0 auto';again.style.width='100%';again.style.textAlign='left';
    choices.replaceChildren(again);
   }
  }catch(e){if(alive()){status.textContent=e?.message==='gps_denied'?t('denied'):t('unknown');retry.hidden=false;retry.style.display='block'}}
 };
 searchNodes.push(label,field,hint,status,choices,selectedText,retry);
 root.append(...searchNodes);host.replaceChildren(root);void detect();
}
`;
