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
 const actions=document.createElement('div');actions.style.cssText='display:flex;gap:9px';
 const createButton=(caption,click)=>{const btn=document.createElement('button');btn.type='button';btn.className='module-result-card journey-primary-action';btn.style.cssText='min-width:0;min-height:55px;flex:1 1 0;padding:10px 12px;white-space:normal;font-size:15px;font-weight:750;touch-action:manipulation';btn.textContent=caption;btn.onclick=click;return btn};
 let country='',point=null,origin=null,seq=0,timer=null,abort=null;
 const session={stop(){seq++;clearTimeout(timer);abort?.abort()}};nationalTransitSession=session;
 const alive=()=>root.isConnected&&nationalTransitSession===session&&state.currentView==='module'&&state.currentModule==='maps';
 const go=createButton(t('search'),()=>{
  if(!alive()||state.busy||state.moduleSearchBusy||!country||!origin||!point||String(point.country_code||'').toUpperCase()!==country)return;
  // Calendar appears AFTER the national destination is confirmed, BEFORE offers.
  const destination={latitude:Number(point.latitude),longitude:Number(point.longitude),
   label:String(point.label||''),city:String(point.city||''),country_code:country,
   stop_id:String(point.stop_id||'')};
  const step=createTransportDepartureStep({
   title:ro?'Când dorești să pleci?':'When would you like to leave?',
   destination:destination.label,
   onBack:()=>{step.remove();root.hidden=false},
   onSearch:async departureAt=>{
    if(!alive()||state.busy||state.moduleSearchBusy)return;
    session.stop();
    await runModuleSearch({...choice,kind:'transit',nationalPublicTransport:true,mixedJourney:false,transitDirect:true,
     transitDestination:destination,
     transitQuery:destination.label,transitPreference:'all',transitDepartureOffset:0,transitDepartureAt:departureAt,
     prompt:(ro?'Transport public către ':'Public transport to ')+destination.label});
   }
  });
  root.hidden=true;host.append(step);
 });go.disabled=true;
 const back=createButton(t('back'),()=>{session.stop();handleModuleLayerBack()});back.classList.add('pocket-nav-return');
 back.style.cssText+=';background:linear-gradient(145deg,#903550,#602139)!important;border:2px solid #e9a9b8!important;color:white!important;box-shadow:inset 0 2px 0 #ffffff30,inset 0 -4px 0 #2a1020,0 4px 0 #341426,0 7px 12px #0006!important';
 actions.append(back,go);
 const lookup=async()=>{
  if(!alive()||!country)return;
  const query=field.value.trim();if(query.length<2){status.textContent=t('short');return}
  const n=++seq;abort?.abort();abort=new AbortController();status.textContent=t('lookup');
  try{
   const response=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},signal:abort.signal,body:JSON.stringify({journey_suggest:{query,country_code:country,location:origin}})});
   const data=await response.json();if(!response.ok)throw Error('search_unavailable');
   if(!alive()||n!==seq)return;choices.replaceChildren();
   const options=(Array.isArray(data.candidates)?data.candidates:[]).filter(p=>String(p.country_code||'').toUpperCase()===country);
   status.textContent=options.length?'':t('noresults');
   for(const candidate of options.slice(0,8)){
    const btn=createButton(String(candidate.label||''),()=>{point=candidate;field.value=candidate.label;choices.replaceChildren();selectedText.textContent=t('selected')+': '+candidate.label;status.textContent='';go.disabled=false});
    btn.className='transit-choice-action journey-suggestion';btn.style.flex='0 0 auto';btn.style.width='100%';btn.style.textAlign='left';choices.append(btn);
   }
  }catch(err){if(alive()&&n===seq&&err?.name!=='AbortError')status.textContent=t('failed')}
 };
 field.addEventListener('input',()=>{
  seq++;clearTimeout(timer);abort?.abort();point=null;go.disabled=true;choices.replaceChildren();selectedText.textContent='';
  if(field.value.trim().length<2){status.textContent=t('short');return}
  timer=setTimeout(()=>void lookup(),300);
 });
 field.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();if(point)go.click();else{clearTimeout(timer);void lookup()}}});
 const retry=createButton(t('retry'),()=>void detect());retry.style.cssText+=';display:none';
 const detect=async()=>{
  country='';point=null;go.disabled=true;field.disabled=true;choices.replaceChildren();selectedText.textContent='';status.textContent=t('waiting');retry.style.display='none';
  try{
   origin=await getCurrentCoordinates(false);if(!alive())return;
   if(!Number.isFinite(origin?.latitude)||!Number.isFinite(origin?.longitude))throw Error('gps_denied');
   const response=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({national_transit_country:{location:origin}})});
   const data=await response.json();if(!alive())return;
   const code=String(data.country_code||'').toUpperCase();
   if(!response.ok||!/^[A-Z]{2}$/.test(code))throw Error('country_unverified');
   if(data.supported!==true){status.textContent=t('unsupported');retry.style.display='';return}
   country=code;field.disabled=false;let name=country;
   try{name=new Intl.DisplayNames([state.language||'ro'],{type:'region'}).of(country)||country}catch{}
   status.textContent=t('scope')+': '+name+'. '+t('short');
  }catch(e){if(alive()){status.textContent=e?.message==='gps_denied'?t('denied'):t('unknown');retry.style.display=''}}
 };
 root.append(label,field,hint,status,choices,selectedText,actions,retry);host.replaceChildren(root);void detect();
}
`;
