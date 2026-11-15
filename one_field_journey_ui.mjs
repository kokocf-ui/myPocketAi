export const ONE_FIELD_JOURNEY_SCRIPT=String.raw`
// Scoped to Maps → Deplasare spre…; other Maps/Hoteluri cards stay unchanged.
let oneFieldJourneySession=null;
let oneFieldJourneyIncoming=null;
const ONE_FIELD_JOURNEY_TEXT={
 ro:{title:'Deplasare spre…',label:'Unde dorești să ajungi?',hint:'Scrie o adresă, o stradă, un obiectiv sau „de la A la B”. Sugestiile apar pe măsură ce scrii.',placeholder:'Ex.: Nufărului 12, Oradea',search:'Verifică destinația',checking:'Caut locații pe hartă…',noResults:'Nu am găsit o destinație verificată. Adaugă localitatea sau codul poștal.',retry:'Căutarea este momentan indisponibilă. Încearcă din nou.',pick:'Selectează o locație dintre rezultate',selected:'Destinație confirmată',from:'Plecarea',fromGPS:'Locația telefonului (GPS)',verifyFrom:'Verific punctul de plecare…',missingFrom:'Nu am putut confirma plecarea. Precizeaz-o în aceeași solicitare.',modes:'Cum dorești să călătorești?',walk:'Pe jos',transit:'Transport mixt',drive:'Mașină',back:'← Înapoi',change:'Schimbă destinația',short:'Începe să scrii o locație.',oneField:'O singură solicitare. Fără formulare suplimentare.'},
 en:{title:'Directions to…',label:'Where would you like to go?',hint:'Enter an address, street, landmark or “from A to B”. Suggestions appear while typing.',placeholder:'e.g. 25 Oxford Street, London',search:'Find destination',checking:'Searching mapped places…',noResults:'No verified destination found. Add a town or postcode.',retry:'Search is unavailable. Please try again.',pick:'Choose a location from the results',selected:'Destination verified',from:'Leaving from',fromGPS:'Your phone location (GPS)',verifyFrom:'Checking departure…',missingFrom:'Departure could not be verified. Include a more precise origin in the same request.',modes:'How would you like to travel?',walk:'Walking',transit:'Mixed transport',drive:'Driving',back:'← Back',change:'Change destination',short:'Start entering a place.',oneField:'One request. No extra forms.'},
 fr:{title:'Itinéraire vers…',label:'Où souhaitez-vous aller ?',hint:'Saisissez une adresse, un lieu ou « de A à B ». Suggestions en direct.',placeholder:'Ex. : 12 Rue de Rivoli, Paris',search:'Chercher',checking:'Recherche cartographique…',noResults:'Destination non vérifiée. Précisez la ville.',retry:'Recherche indisponible.',pick:'Choisissez un résultat',selected:'Destination vérifiée',from:'Départ',fromGPS:'Position GPS',verifyFrom:'Vérification du départ…',missingFrom:'Départ non vérifié. Précisez-le dans la même demande.',modes:'Moyen de transport ?',walk:'À pied',transit:'Multimodal',drive:'Voiture',back:'← Retour',change:'Changer la destination',short:'Commencez à saisir.',oneField:'Une seule demande.'},
 de:{title:'Route nach…',label:'Wohin möchten Sie?',hint:'Adresse, Ort oder „von A nach B“ eingeben. Vorschläge erscheinen beim Tippen.',placeholder:'z. B. Hauptstraße 10, Berlin',search:'Ziel suchen',checking:'Suche auf der Karte…',noResults:'Kein bestätigtes Ziel. Ort ergänzen.',retry:'Suche nicht verfügbar.',pick:'Ort auswählen',selected:'Ziel bestätigt',from:'Start',fromGPS:'GPS-Standort',verifyFrom:'Start wird geprüft…',missingFrom:'Start nicht bestätigt. Bitte in derselben Anfrage präzisieren.',modes:'Wie reisen Sie?',walk:'Zu Fuß',transit:'Kombinierter Verkehr',drive:'Auto',back:'← Zurück',change:'Ziel ändern',short:'Ort eingeben.',oneField:'Eine Anfrage, kein Formular.'},
 it:{title:'Percorso verso…',label:'Dove vuoi andare?',hint:'Scrivi un indirizzo, luogo o « da A a B ». Suggerimenti durante la digitazione.',placeholder:'Es.: Via Roma 10, Milano',search:'Cerca destinazione',checking:'Ricerca sulla mappa…',noResults:'Destinazione non verificata. Aggiungi la città.',retry:'Ricerca non disponibile.',pick:'Scegli un luogo',selected:'Destinazione verificata',from:'Partenza',fromGPS:'Posizione GPS',verifyFrom:'Verifico la partenza…',missingFrom:'Partenza non verificata. Specifica nella stessa richiesta.',modes:'Come vuoi viaggiare?',walk:'A piedi',transit:'Trasporto misto',drive:'Auto',back:'← Indietro',change:'Cambia destinazione',short:'Inizia a scrivere.',oneField:'Un solo campo.'},
 es:{title:'Ir a…',label:'¿Adónde quieres ir?',hint:'Escribe una dirección, lugar o « de A a B ». Sugerencias al escribir.',placeholder:'Ej.: Calle Mayor 10, Madrid',search:'Buscar destino',checking:'Buscando en el mapa…',noResults:'Destino sin verificar. Añade la localidad.',retry:'Búsqueda no disponible.',pick:'Elige un lugar',selected:'Destino verificado',from:'Origen',fromGPS:'Ubicación GPS',verifyFrom:'Verificando origen…',missingFrom:'Origen no verificado. Precísalo en la misma búsqueda.',modes:'¿Cómo quieres viajar?',walk:'A pie',transit:'Transporte mixto',drive:'Coche',back:'← Atrás',change:'Cambiar destino',short:'Empieza a escribir.',oneField:'Un solo campo.'},
 pt:{title:'Ir para…',label:'Aonde pretende ir?',hint:'Escreva uma morada, local ou « de A para B ». As sugestões aparecem enquanto escreve.',placeholder:'Ex.: Rua Augusta 12, Lisboa',search:'Procurar destino',checking:'A pesquisar no mapa…',noResults:'Destino não confirmado. Acrescente a localidade ou código postal.',retry:'Pesquisa indisponível. Tente novamente.',pick:'Escolha um local',selected:'Destino confirmado',from:'Partida',fromGPS:'Posição GPS',verifyFrom:'A verificar a partida…',missingFrom:'Partida não confirmada. Especifique na mesma pesquisa.',modes:'Como quer viajar?',walk:'A pé',transit:'Transporte misto',drive:'Carro',back:'← Voltar',change:'Alterar destino',short:'Comece a escrever.',oneField:'Um único campo.'},
 nl:{title:'Naar…',label:'Waar wilt u naartoe?',hint:'Typ een adres, plaats of « van A naar B ». Suggesties verschijnen tijdens het typen.',placeholder:'Bijv.: Damrak 12, Amsterdam',search:'Bestemming zoeken',checking:'Zoeken op de kaart…',noResults:'Geen bevestigde bestemming. Voeg een plaats of postcode toe.',retry:'Zoeken tijdelijk niet beschikbaar.',pick:'Kies een locatie',selected:'Bestemming bevestigd',from:'Vertrek',fromGPS:'GPS-locatie',verifyFrom:'Vertrek controleren…',missingFrom:'Vertrek niet bevestigd. Vul het vertrekpunt in dezelfde vraag aan.',modes:'Hoe wilt u reizen?',walk:'Lopen',transit:'Gemengd vervoer',drive:'Auto',back:'← Terug',change:'Bestemming wijzigen',short:'Begin te typen.',oneField:'Eén invoerveld.'},
 ru:{title:'Маршрут до…',label:'Куда хотите поехать?',hint:'Введите адрес, место или « от A до B ». Подсказки появляются при вводе.',placeholder:'Например: улица Ленина 12, Москва',search:'Найти пункт назначения',checking:'Поиск на карте…',noResults:'Адрес не подтверждён. Уточните город или индекс.',retry:'Поиск временно недоступен.',pick:'Выберите место',selected:'Пункт назначения подтверждён',from:'Отправление',fromGPS:'GPS-положение',verifyFrom:'Проверяю отправление…',missingFrom:'Отправление не подтверждено. Уточните его в том же запросе.',modes:'Как поедем?',walk:'Пешком',transit:'Смешанный транспорт',drive:'Автомобиль',back:'← Назад',change:'Изменить пункт',short:'Начните вводить место.',oneField:'Одно поле ввода.'},
 pl:{title:'Trasa do…',label:'Dokąd chcesz jechać?',hint:'Wpisz adres, miejsce lub « z A do B ». Podpowiedzi pojawiają się podczas pisania.',placeholder:'Np. Długa 12, Warszawa',search:'Szukaj celu',checking:'Wyszukiwanie na mapie…',noResults:'Nie potwierdzono adresu. Dodaj miasto lub kod pocztowy.',retry:'Wyszukiwanie niedostępne.',pick:'Wybierz miejsce',selected:'Cel potwierdzony',from:'Początek',fromGPS:'Lokalizacja GPS',verifyFrom:'Sprawdzam punkt początkowy…',missingFrom:'Nie potwierdzono punktu początkowego. Uzupełnij go w tym samym zapytaniu.',modes:'Jak chcesz podróżować?',walk:'Pieszo',transit:'Transport mieszany',drive:'Samochód',back:'← Wstecz',change:'Zmień cel',short:'Zacznij pisać.',oneField:'Jedno pole.'}
};
function oneFieldJourneyCopy(){return ONE_FIELD_JOURNEY_TEXT[state.language]||ONE_FIELD_JOURNEY_TEXT.en}
function handoffJourneyFromAssistant(handoff){
 if(!handoff||state.busy)return false;
 // Preserve the shared conversation; do not ask the model to calculate a route.
 rememberNavigationSource();
 const source=state.navigationReturnContext;
 oneFieldJourneyIncoming=handoff;
 inputEl.value='';
 switchConversationModule('maps');
 const choice=(MODULE_QUICK_CHOICES.maps||[]).find(item=>item.mixedJourney);
 if(!choice)return false;
 openModuleLandingAction(choice);
 state.navigationReturnContext=source;
 state.moduleSearchReturnMode='root';
 setStatus(dialogText('Solicitarea de navigație a fost transferată la Deplasare spre…',
  'Navigation request transferred to Directions.'));
 return true;
}
function showOneFieldJourney(choice){
 if(oneFieldJourneySession?.stop)oneFieldJourneySession.stop();
 const incoming=oneFieldJourneyIncoming;
 oneFieldJourneyIncoming=null;
 state.moduleSearchCategory=choice;
 state.moduleSearchReturnMode='root';
 const text=oneFieldJourneyCopy(),host=$('moduleLayerBody');
 setModuleLayerMode(text.title);
 const root=document.createElement('section');root.className='journey-one-field';
 root.style.cssText='display:flex;flex-direction:column;gap:10px;min-width:0;width:100%;padding:4px 0 14px';
 const title=document.createElement('label');title.textContent=text.label;title.style.cssText='font-weight:800;font-size:16px';
 const input=document.createElement('input');input.type='text';input.className='journey-one-field-input';
 input.autocomplete='off';input.spellcheck=false;input.maxLength=200;
 input.placeholder=text.placeholder;input.setAttribute('aria-label',text.label);
 input.style.cssText='box-sizing:border-box;width:100%;min-height:54px;font-size:16px;color:#fff;background:#102d40;border:2px solid #62b9d0;border-radius:16px;padding:12px;outline-offset:2px;touch-action:manipulation';
 const hint=document.createElement('p');hint.textContent=text.hint;hint.style.cssText='margin:0;color:#b7d3df;font-size:13px;line-height:1.45';
 const status=document.createElement('p');status.setAttribute('aria-live','polite');status.style.cssText='font-size:13px;min-height:20px;margin:0;color:#c8e0e9';
 const results=document.createElement('div');results.className='journey-live-suggestions';
 results.style.cssText='display:flex;flex-direction:column;gap:7px;min-height:0;max-height:37dvh;overflow-y:auto;overscroll-behavior:contain';
 const confirmed=document.createElement('div');confirmed.className='journey-selected-destination';
 confirmed.style.cssText='display:flex;flex-direction:column;gap:8px';
 const actions=document.createElement('div');actions.style.cssText='display:flex;gap:8px;flex-wrap:wrap';
 const makeButton=(caption,click,principal=false)=>{
  const button=document.createElement('button');button.type='button';
  button.className=principal?'module-result-card journey-primary-action':'transit-choice-action';
  button.style.cssText='min-height:48px;min-width:0;white-space:normal;overflow-wrap:anywhere;text-align:center;touch-action:manipulation';
  button.textContent=caption;button.onclick=click;return button;
 };
 let timer=null,controller=null,seq=0,selected=null,origin=null,typing='';
 const session={stop(){seq++;if(timer!==null)clearTimeout(timer);controller?.abort()}};
 oneFieldJourneySession=session;
 const alive=()=>root.isConnected&&oneFieldJourneySession===session&&state.currentView==='module'&&state.currentModule==='maps';
 const fetchMatches=async(query,signal)=>{
  const r=await fetch(CLIENT_CONFIG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({journey_suggest:{query}}),signal});
  const data=await r.json();
  if(!r.ok)throw Error(String(data.error||'journey_search_failed'));
  return Array.isArray(data.candidates)?data.candidates:[];
 };
 const searchPhrase=()=>parseJourneyExpression(input.value.trim());
 const drawButtons=(list,onChoose)=>{
  results.replaceChildren();
  for(const item of list.slice(0,8)){
   const btn=makeButton(String(item.label||''),()=>onChoose(item));
   btn.classList.add('journey-suggestion');
   btn.style.textAlign='left';btn.style.width='100%';results.append(btn);
  }
 };
 const runMode=async(mode)=>{
  if(state.busy||state.moduleSearchBusy||!selected)return;
  const point={latitude:selected.latitude,longitude:selected.longitude,label:selected.label,
   country_code:selected.country_code||''};
  const from=origin?{latitude:origin.latitude,longitude:origin.longitude,label:origin.label,
   country_code:origin.country_code||''}:null;
  if(mode==='transit'){
   await runModuleSearch({...choice,kind:'transit',mixedJourney:true,transitDirect:true,
    journeyOrigin:from,transitDestination:point,transitQuery:point.label,
    transitPreference:'all',transitDepartureOffset:0,transitDepartureAt:null,
    prompt:dialogText('Caută transport mixt către ','Find mixed transport to ')+point.label});
   return;
  }
  const labels=TRAVEL_MODE_TEXT[state.language]||TRAVEL_MODE_TEXT.en;
  state.pendingTravelMode=mode;state.pendingRouteDestination=point;
  state.routeSearchContext={destination_query:point.label,destination:point,
   origin:from,origin_query:from?.label||'',pending:'profile',profile:null};
  if(!state.navigationReturnContext)rememberNavigationSource();
  enterModuleRouteConversation();
  inputEl.value=labels[mode==='walk'?1:3];
  await submitMessage();
 };
 const showModes=()=>{
  if(!selected||!alive())return;
  results.replaceChildren();
  confirmed.replaceChildren();
  const summary=document.createElement('strong');summary.textContent=text.selected+': '+selected.label;
  summary.style.cssText='overflow-wrap:anywhere;line-height:1.45';
  const departure=document.createElement('p');departure.style.cssText='margin:0;color:#b7d3df;font-size:13px';
  departure.textContent=text.from+': '+(origin?.label||text.fromGPS);
  const modes=document.createElement('strong');modes.textContent=text.modes;
  confirmed.append(summary,departure,modes);
  const distance=origin?Math.hypot(Number(origin.latitude)-Number(selected.latitude),
   (Number(origin.longitude)-Number(selected.longitude))*Math.cos(Number(selected.latitude)*Math.PI/180))*111:distanceToDestinationKm(selected);
  const suggestedMode=searchPhrase().preferred_mode;
  // The dedicated Hărți → Traseu pietonal remains the only walking entry.
  const choices=[['transit',text.transit],['drive',text.drive]];
  if(suggestedMode)choices.sort((a,b)=>(a[0]===suggestedMode?-1:0)-(b[0]===suggestedMode?-1:0));
  for(const [mode,label] of choices){
   if(mode==='walk'&&Number.isFinite(distance)&&distance>5)continue;
   const button=makeButton(label,()=>void runMode(mode),true);button.style.width='100%';
   confirmed.append(button);
  }
  status.textContent='';
 };
 const choose=async(item)=>{
  if(!alive())return;
  selected=item;origin=null;
  if(!Number.isFinite(Number(item.latitude))||!Number.isFinite(Number(item.longitude))){selected=null;return}
  const from=searchPhrase().origin_query;
  if(from){
   status.textContent=text.verifyFrom+' '+from;
   confirmed.replaceChildren();results.replaceChildren();
   try{
    const origins=await fetchMatches(from,new AbortController().signal);
    if(!alive()||selected!==item)return;
    if(origins.length===1){origin=origins[0];showModes();return}
    if(origins.length>1){
     status.textContent=text.from+': '+from;
     drawButtons(origins,p=>{origin=p;showModes()});
     return;
    }
    status.textContent=text.missingFrom;return;
   }catch{if(alive())status.textContent=text.missingFrom;return}
  }
  showModes();
 };
 const lookup=async(force=false)=>{
  if(!alive())return;
  const raw=input.value.trim();
  if(!raw){results.replaceChildren();status.textContent=text.short;return}
  const query=parseJourneyExpression(raw).destination_query;
  if(query.length<2){status.textContent=text.short;return}
  const thisSeq=++seq;controller?.abort();controller=new AbortController();
  status.textContent=text.checking;typing=raw;
  try{
   const candidates=await fetchMatches(query,controller.signal);
   if(!alive()||thisSeq!==seq||input.value.trim()!==typing)return;
   if(candidates.length){status.textContent=text.pick;drawButtons(candidates,choose)}
   else{results.replaceChildren();status.textContent=text.noResults}
  }catch(error){
   if(!alive()||thisSeq!==seq||error?.name==='AbortError')return;
   results.replaceChildren();status.textContent=text.retry;
  }
 };
 const schedule=()=>{
  if(timer!==null)clearTimeout(timer);
  controller?.abort();seq++;selected=null;origin=null;
  confirmed.replaceChildren();results.replaceChildren();
  const query=parseJourneyExpression(input.value).destination_query;
  if(query.length<2){status.textContent=text.short;return}
  status.textContent=text.checking;
  timer=setTimeout(()=>void lookup(),280);
 };
 input.addEventListener('input',schedule);
 input.addEventListener('keydown',event=>{if(event.key==='Enter'){
  event.preventDefault();if(timer!==null)clearTimeout(timer);void lookup(true)}});
 const search=makeButton(text.search,()=>{if(timer!==null)clearTimeout(timer);void lookup(true)},true);
 search.style.flex='1 1 55%';
 const back=makeButton(text.back,()=>{session.stop();handleModuleLayerBack()});
 back.classList.add('pocket-nav-return');
 back.style.flex='1 1 35%';
 actions.append(back,search);
 root.append(title,input,hint,status,results,confirmed,actions);
 host.append(root);
 input.value=incoming?.raw||'';
 const direct=incoming?.selected_destination;
 if(direct&&Number.isFinite(Number(direct.latitude))&&Number.isFinite(Number(direct.longitude))){
  selected={latitude:Number(direct.latitude),longitude:Number(direct.longitude),
   label:String(direct.label||incoming.destination_query||input.value),
   country_code:String(direct.country_code||'')};
  showModes();
 }else{
  status.textContent=input.value?text.checking:text.short;
  if(input.value)schedule();
 }
}

`;
