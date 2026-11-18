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
// Shared one-screen date/time step for Maps -> national public transport and mixed journeys.
// "Unchanged" always means search from the moment the user submits, not a stale prefilled minute.
function createTransportDepartureStep({title='',destination='',initialDepartureAt=null,onBack,onSearch}={}){
 const phrases={
  ro:['Data și ora plecării','Poți schimba data și ora sau poți căuta de acum.','Caută trasee','← Înapoi','Data și ora sunt cele ale telefonului.','Alege o dată și oră valide, care nu au trecut.','Căutare de la ora actuală','Căutare pentru data și ora aleasă'],
  en:['Departure date and time','Change the date and time, or search from now.','Find routes','← Back','The date and time use your phone time zone.','Choose a valid future date and time.','Searching from now','Searching for selected date and time'],
  fr:['Date et heure de départ','Modifiez la date ou recherchez dès maintenant.','Chercher les trajets','← Retour','Fuseau horaire du téléphone.','Choisissez une date future valide.','Recherche immédiate','Recherche à la date choisie'],
  de:['Abfahrtsdatum und Uhrzeit','Zeit ändern oder ab jetzt suchen.','Verbindungen suchen','← Zurück','Zeitzone des Telefons.','Bitte gültige künftige Zeit wählen.','Suche ab jetzt','Suche zum gewählten Zeitpunkt'],
  it:['Data e ora di partenza','Modifica la data o cerca da adesso.','Cerca percorsi','← Indietro','Fuso orario del telefono.','Scegli una data futura valida.','Ricerca da adesso','Ricerca per la data scelta'],
  es:['Fecha y hora de salida','Cambia la fecha o busca desde ahora.','Buscar rutas','← Atrás','Zona horaria del teléfono.','Elige una fecha futura válida.','Búsqueda desde ahora','Búsqueda para la fecha elegida'],
  pt:['Data e hora da partida','Altere a data ou pesquise a partir de agora.','Procurar rotas','← Voltar','Fuso horário do telemóvel.','Escolha uma data futura válida.','Pesquisa a partir de agora','Pesquisa para a data escolhida'],
  nl:['Vertrekdatum en tijd','Wijzig de tijd of zoek vanaf nu.','Routes zoeken','← Terug','Tijdzone van je telefoon.','Kies een geldige toekomstige tijd.','Zoeken vanaf nu','Zoeken op de gekozen tijd'],
  ru:['Дата и время отправления','Измените дату или ищите с текущего момента.','Найти маршруты','← Назад','Часовой пояс телефона.','Укажите корректное будущее время.','Поиск с текущего момента','Поиск на выбранное время'],
  pl:['Data i godzina wyjazdu','Zmień datę albo wyszukaj od teraz.','Szukaj tras','← Wstecz','Strefa czasowa telefonu.','Wybierz poprawną przyszłą datę.','Wyszukiwanie od teraz','Wyszukiwanie na wybraną godzinę']
 };
 const words=phrases[state.language]||phrases.en;
 const formatLocal=stamp=>{
  const pad=n=>String(n).padStart(2,'0');
  return stamp.getFullYear()+'-'+pad(stamp.getMonth()+1)+'-'+pad(stamp.getDate())+
   'T'+pad(stamp.getHours())+':'+pad(stamp.getMinutes());
 };
 const step=document.createElement('section');
 step.className='transport-departure-step';
 step.style.cssText='width:100%;min-width:0;display:flex;flex-direction:column;gap:13px;padding:10px 0 16px';
 const headline=document.createElement('strong');
 headline.textContent=title||words[0];headline.style.cssText='font-size:18px;text-align:center';
 const summary=document.createElement('p');
 summary.textContent=destination;summary.style.cssText='margin:0;line-height:1.45;font-weight:700;overflow-wrap:anywhere';
 const label=document.createElement('label');label.textContent=words[0];
 label.style.cssText='font-weight:700;font-size:15px';
 const picker=document.createElement('input');picker.type='datetime-local';
 picker.className='transport-departure-datetime';
 picker.setAttribute('aria-label',words[0]);
 const initialDate=initialDepartureAt?new Date(initialDepartureAt):null;
 const validInitial=initialDate&&Number.isFinite(initialDate.getTime());
 picker.value=formatLocal(validInitial?initialDate:new Date());
 picker.style.cssText='box-sizing:border-box;width:100%;min-height:56px;font-size:17px;padding:10px 12px;background:#102d40;border:2px solid #62b9d0;border-radius:15px;color:#fff;color-scheme:dark;touch-action:manipulation';
 const explain=document.createElement('p');
 explain.textContent=words[1]+' '+words[4];
 explain.style.cssText='font-size:13px;color:#bed6e0;margin:0;line-height:1.5';
 const notice=document.createElement('p');notice.setAttribute('role','status');
 notice.setAttribute('aria-live','polite');notice.style.cssText='font-size:13px;color:#c6e1ec;margin:0;min-height:19px';
 const row=document.createElement('div');row.style.cssText='display:flex;gap:9px;flex-wrap:wrap';
 const button=(text,click)=>{
  const b=document.createElement('button');b.type='button';b.className='module-result-card journey-primary-action';
  b.textContent=text;b.onclick=click;
  b.style.cssText='min-width:0;min-height:51px;flex:1 1 145px;padding:10px 12px;font-size:15px;white-space:normal;touch-action:manipulation';
  return b;
 };
 let changed=Boolean(validInitial),submitting=false;
 const update=()=>{changed=true;notice.textContent=words[7];};
 picker.addEventListener('input',update);
 picker.addEventListener('change',update);
 const back=button(words[3],()=>{if(!submitting)onBack?.()});
 back.classList.add('pocket-nav-return');
 back.style.cssText+=';background:linear-gradient(145deg,#903550,#602139)!important;border:2px solid #e9a9b8!important;color:white!important';
 const submit=button(words[2],async()=>{
  if(submitting)return;
  let departureAt=null;
  if(changed){
   const date=new Date(picker.value);
   if(!picker.value||!Number.isFinite(date.getTime())||date.getTime()<Date.now()-120000){
    notice.textContent=words[5];picker.focus();return;
   }
   departureAt=date.toISOString();
  }
  submitting=true;submit.disabled=true;back.disabled=true;
  notice.textContent=changed?words[7]:words[6];
  try{await onSearch?.(departureAt)}
  catch(error){
   if(step.isConnected)notice.textContent=String(error?.message||words[5]);
  }finally{
   submitting=false;
   if(step.isConnected){submit.disabled=false;back.disabled=false;}
  }
 });
 submit.style.cssText+=';background:linear-gradient(145deg,#903550,#602139)!important;border:2px solid #e9a9b8!important;color:white!important';
 row.append(back,submit);
 step.append(headline,summary,label,picker,explain,notice,row);
 return step;
}

function showOneFieldJourney(choice){
 if(oneFieldJourneySession?.stop)oneFieldJourneySession.stop();
 const incoming=oneFieldJourneyIncoming;
 oneFieldJourneyIncoming=null;
 // A destination editor is not a results screen: do not let header Back
 // resurrect an outdated calendar from a previous search.
 state.moduleSearchCategory=null;
 state.moduleSearchReturnMode='root';
 // Same reset used by the working National public transport form.
 // A previous results-mode sheet can obstruct the new destination input.
 document.querySelector('.module-quick-sheet')?.classList.remove('results-mode','details-mode','mode-choice-screen');
 $('moduleLayerBody').style.cssText='';
 const text=oneFieldJourneyCopy(),host=$('moduleLayerBody');
 setModuleLayerMode(text.title);
 const root=document.createElement('section');root.className='journey-one-field national-transit-one-field';
 root.style.cssText='display:flex;flex-direction:column;gap:10px;min-width:0;width:100%;padding:4px 0 14px';
 const title=document.createElement('strong');title.textContent=text.label;title.style.cssText='font-weight:800;font-size:16px';
 const input=document.createElement('input');input.type='text';input.className='journey-one-field-input';
 input.autocomplete='off';input.spellcheck=false;input.maxLength=200;
 input.placeholder=text.placeholder;input.setAttribute('aria-label',text.label);
 input.style.cssText='box-sizing:border-box;width:100%;min-height:54px;font-size:16px;color:#fff;background:#102d40;border:2px solid #62b9d0;border-radius:16px;padding:12px;outline-offset:2px;touch-action:manipulation';
 const hint=document.createElement('p');hint.textContent=text.hint;hint.style.cssText='margin:0;color:#b7d3df;font-size:13px;line-height:1.45';
 const status=document.createElement('p');status.setAttribute('aria-live','polite');status.style.cssText='font-size:13px;min-height:20px;margin:0;color:#c8e0e9';
 const results=document.createElement('div');results.className='journey-live-suggestions national-transit-suggestions';
 results.style.cssText='display:flex;flex-direction:column;gap:7px;min-height:0;max-height:37dvh;overflow-y:auto;overscroll-behavior:contain';
 const confirmed=document.createElement('div');confirmed.className='journey-selected-destination';
 confirmed.style.cssText='display:flex;flex-direction:column;gap:8px';
 const makeButton=(caption,click,principal=false)=>{
  const button=document.createElement('button');button.type='button';
  button.className=principal?'module-result-card journey-primary-action':'transit-choice-action';
  button.style.cssText='min-height:48px;min-width:0;white-space:normal;overflow-wrap:anywhere;text-align:center;touch-action:manipulation';
  button.textContent=caption;button.onclick=click;return button;
 };
 let timer=null,controller=null,seq=0,selected=null,origin=null,typing='',observedRaw='';
 const session={
  stop(){seq++;if(timer!==null)clearTimeout(timer);controller?.abort()},
  back(){
   if(!alive())return false;
   if(root.querySelector('.transport-departure-datetime')){
    state.moduleSearchCategory=null;
    root.replaceChildren(...searchNodes);showModes();resetJourneyScroll();
    return true;
   }
   if(selected){
    state.moduleSearchCategory=null;
    selected=null;origin=null;input.readOnly=false;
    root.replaceChildren(...searchNodes);confirmed.replaceChildren();results.replaceChildren();
    input.setAttribute('aria-label',text.label);observedRaw='';schedule();resetJourneyScroll();
    return true;
   }
   return false;
  }
 };
 oneFieldJourneySession=session;
 // The mounted editor, not a lagging Maps/overlay flag, owns this lookup.
 // Android keyboard transitions can change view state without removing the form.
 const alive=()=>root.isConnected&&host.contains(root)&&oneFieldJourneySession===session;
 // A geocoder response normally arrives within seconds. Limit the complete HTTP
 // exchange, including JSON parsing; never leave "Searching" displayed forever.
 const fetchMatches=async(query,requestController)=>{
  let deadline=null;
  const work=(async()=>{
   const response=await fetch(CLIENT_CONFIG.apiUrl,{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({journey_suggest:{query}}),signal:requestController.signal});
   const data=await response.json();
   if(!response.ok)throw Error(String(data.error||'journey_search_failed'));
   const places=Array.isArray(data.candidates)?data.candidates:[];
   // Completion suggestions are *not* geocoded destinations. Re-run the
   // address search after the user selects a provider-confirmed city.
   const completions=Array.isArray(data.completions)?data.completions
    .filter(x=>typeof x.query==='string'&&x.query.length<=200&&typeof x.label==='string')
    .map(x=>({completion_only:true,completion_query:x.query,label:x.label})):[];
   // Text-only city completions come first; selecting one must still
   // verify the exact numbered address.
   return [...completions,...places];
  })();
  try{
   return await Promise.race([work,new Promise((_,reject)=>{
    deadline=setTimeout(()=>{
     requestController.abort();
     reject(Error('journey_search_timeout'));
    },12000);
   })]);
  }finally{if(deadline!==null)clearTimeout(deadline)}
 };
 const searchPhrase=()=>parseJourneyExpression(input.value.trim());
 const drawButtons=(list,onChoose)=>{
  results.replaceChildren();
  for(const item of list){
   const btn=makeButton(String(item.label||''),()=>onChoose(item));
   btn.classList.add('journey-suggestion');
   btn.style.textAlign='left';btn.style.width='100%';results.append(btn);
  }
 };
 // Restore the previously selected destination and modes when returning from the calendar.
 const searchNodes=[title,input,hint,status,results,confirmed];
 const resetJourneyScroll=()=>{
  for(let element=host;element&&element.id!=='moduleQuickLayer';element=element.parentElement)element.scrollTop=0;
 };
 const runMode=async(mode)=>{
  if(state.busy||state.moduleSearchBusy||!selected)return;
  const point={latitude:selected.latitude,longitude:selected.longitude,label:selected.label,
   country_code:selected.country_code||''};
  const from=origin?{latitude:origin.latitude,longitude:origin.longitude,label:origin.label,
   country_code:origin.country_code||''}:null;
  if(mode==='transit'){
   // Store the complete selected A→B stage for both Back mechanisms.
   const stageChoice={...choice,kind:'transit',mixedJourney:true,transitDirect:true,mixedComposition:true,
    journeyOrigin:from,transitDestination:point,transitQuery:point.label,
    transitPreference:'all',transitDepartureOffset:0,
    prompt:dialogText('Caută transport mixt către ','Find mixed transport to ')+point.label};
   state.moduleSearchCategory=stageChoice;
   const step=createTransportDepartureStep({
    title:dialogText('Când dorești să pleci?','When would you like to leave?'),
    destination:point.label,
    onBack:()=>{state.moduleSearchCategory=null;root.replaceChildren(...searchNodes);showModes();resetJourneyScroll()},
    onSearch:async departureAt=>{
     session.stop();
     await runModuleSearch({...stageChoice,transitDepartureAt:departureAt});
    }
   });
   // Keep the calendar in the initial viewport; do not append it below the address/mode form.
   root.replaceChildren(step);
   resetJourneyScroll();
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
  state.moduleSearchCategory=null;
  // Selection is a stage of the same screen, not another modal. Keep the
  // confirmed destination visible in the editable input; no repeat explanation.
  input.value=String(selected.label||'');
  observedRaw=input.value.trim();
  input.readOnly=true;input.blur();
  input.setAttribute('aria-label',text.selected+': '+input.value);
  results.replaceChildren();confirmed.replaceChildren();
  const mixedArt=[
   "<svg viewBox='0 0 300 115' width='100%' height='102' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>",
   "<g fill='none' stroke='#79bfd0' stroke-width='2' stroke-dasharray='4 5' opacity='.75'><path d='M150 102L150 30'/><path d='M150 102L66 71'/><path d='M150 102L234 71'/></g>",
   "<circle cx='150' cy='102' r='6' fill='#e7aac3' stroke='#fff' stroke-width='2'/>",
   "<path d='M150 8L155 23L175 31L175 37L153 34L153 44L161 50L161 54L150 51L139 54L139 50L147 44L147 34L125 37L125 31L145 23Z' fill='#e4f5f9' stroke='#7bd8e4' stroke-width='2' stroke-linejoin='round'/>",
   "<rect x='41' y='42' width='53' height='40' rx='10' fill='#12384c' stroke='#85d4e0' stroke-width='2.6'/>",
   "<rect x='47' y='48' width='41' height='20' rx='5' fill='#77bed1' opacity='.85'/>",
   "<path d='M67 48V68' stroke='#183d4e' stroke-width='2'/>",
   "<rect x='48' y='73' width='8' height='5' rx='2' fill='#f5e3a7'/><rect x='79' y='73' width='8' height='5' rx='2' fill='#f5e3a7'/>",
   "<path d='M51 85L46 92M84 85L89 92' stroke='#b7d7e5' stroke-width='3' stroke-linecap='round'/>",
   "<rect x='206' y='42' width='53' height='40' rx='8' fill='#193e51' stroke='#85d4e0' stroke-width='2.6'/>",
   "<rect x='212' y='48' width='41' height='19' rx='3' fill='#77bed1' opacity='.86'/>",
   "<path d='M212 57H253' stroke='#204052' stroke-width='2'/>",
   "<path d='M218 71H247' stroke='#c4dce8' stroke-width='2.5' stroke-linecap='round'/>",
   "<circle cx='216' cy='77' r='3' fill='#f5e3a7'/><circle cx='249' cy='77' r='3' fill='#f5e3a7'/>",
   "<path d='M216 84V90M249 84V90' stroke='#b7d7e5' stroke-width='3' stroke-linecap='round'/>",
   "</svg>"
  ].join('');
  const carArt=[
   "<svg viewBox='0 0 300 115' width='100%' height='102' xmlns='http://www.w3.org/2000/svg' aria-hidden='true'>",
   "<g fill='none' stroke='#6c95a8' stroke-width='2' opacity='.55'><path d='M84 113L100 82M216 113L200 82'/></g>",
   "<path d='M111 44L122 27Q128 21 140 21H160Q172 21 178 27L189 44L204 54V86Q204 94 195 94H105Q96 94 96 86V54Z' fill='#173e52' stroke='#8dd4dd' stroke-width='2.6' stroke-linejoin='round'/>",
   "<path d='M123 34Q128 29 141 29H159Q172 29 177 34L185 49H115Z' fill='#8ac6d6' opacity='.9'/>",
   "<path d='M150 29V49' stroke='#296478' stroke-width='2'/>",
   "<path d='M104 56H196' stroke='#afd9e3' stroke-width='2' opacity='.8'/>",
   "<rect x='105' y='62' width='22' height='11' rx='5' fill='#ffe2a3'/><rect x='173' y='62' width='22' height='11' rx='5' fill='#ffe2a3'/>",
   "<rect x='131' y='72' width='38' height='9' rx='4' fill='#091f2f' stroke='#a2c5d1' stroke-width='1.5'/>",
   "<path d='M116 94V102M184 94V102' stroke='#b6dce8' stroke-width='8' stroke-linecap='round'/>",
   "</svg>"
  ].join('');
  const makeModeCard=(mode,label,illustration)=>{
   const button=document.createElement('button');
   button.type='button';button.className='journey-mode-illustrated';
   button.setAttribute('aria-label',label);
   button.style.cssText='box-sizing:border-box;width:100%;min-height:153px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:10px 12px;border:2px solid #9b617d;border-radius:18px;background:linear-gradient(152deg,#18374a,#0b2031);color:#fff;box-shadow:inset 0 2px 0 #ffffff20,0 5px 0 #071c2d,0 10px 17px #0005;touch-action:manipulation';
   const icon=document.createElement('span');icon.className='journey-mode-illustration';
   icon.style.cssText='width:100%;max-width:300px;height:102px;display:block;pointer-events:none';
   icon.innerHTML=illustration;
   const caption=document.createElement('strong');
   caption.textContent=label;caption.style.cssText='font-size:18px;line-height:1.2;text-align:center';
   button.append(icon,caption);
   button.onclick=()=>void runMode(mode);
   return button;
  };
  const departure=document.createElement('p');
  departure.className='journey-origin-confirmation';
  departure.style.cssText='margin:0;padding:8px 10px;border-radius:10px;color:#e1edf4;background:#173043;font-size:13px;line-height:1.45';
  const tip=state.language==='ro'?' Pentru altă plecare, atinge adresa și scrie „de la A la B”.':
   ' To change it, tap the destination and enter “from A to B”.';
  departure.textContent=text.from+': '+(origin?.label||text.fromGPS)+(origin?'':'.'+tip);
  confirmed.append(departure,makeModeCard('transit',text.transit,mixedArt),
   makeModeCard('drive',text.drive,carArt));
  root.replaceChildren(input,confirmed);
  resetJourneyScroll();
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
    const origins=await fetchMatches(from,new AbortController());
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
 // Keep the working national input listener; no second IME poller can
 // repeatedly cancel identical requests. Only actual text changes schedule.
 const lookup=async()=>{
  if(!alive())return;
  const raw=input.value.trim();
  let query='';
  try{query=parseJourneyExpression(raw).destination_query}
  catch{status.textContent=text.retry;results.replaceChildren();return}
  if(query.length<2){status.textContent=text.short;results.replaceChildren();return}
  const n=++seq;controller?.abort();controller=new AbortController();
  status.textContent=text.checking;typing=raw;
  try{
   const options=await fetchMatches(query,controller);
   if(!alive()||n!==seq)return;
   if(input.value.trim()!==typing){
    // Android may mutate the input without an event. Retry the actual value.
    observedRaw='';schedule();return;
   }
   const used=new Set();results.replaceChildren();
   for(const candidate of options){
    if(candidate.completion_only){
     const completed=String(candidate.completion_query||'').trim();
     if(!completed||completed===raw)continue;
     const btn=makeButton('Completează localitatea: '+String(candidate.label||completed),()=>{
      input.value=completed;observedRaw='';schedule();
     });
     btn.className='transit-choice-action journey-city-completion';
     btn.style.flex='0 0 auto';btn.style.width='100%';btn.style.textAlign='left';
     results.append(btn);
      continue;
    }
    if(!Number.isFinite(Number(candidate.latitude))||!Number.isFinite(Number(candidate.longitude)))continue;
    const label=String(candidate.label||'').trim();
    if(!label)continue;
    const key=label.toLocaleLowerCase()+'|'+Number(candidate.latitude).toFixed(5)+'|'+Number(candidate.longitude).toFixed(5);
    if(used.has(key))continue;used.add(key);
    const btn=makeButton(label,()=>void choose(candidate));
    btn.className='transit-choice-action journey-suggestion';
    btn.style.flex='0 0 auto';btn.style.width='100%';btn.style.textAlign='left';
    results.append(btn);
    }
   status.textContent=results.children.length?'':text.noResults;
  }catch(err){
   // A timeout or unexpected abort is an error, not an infinite loading state.
   if(alive()&&n===seq){
    results.replaceChildren();status.textContent=text.retry;
   }
  }
 };
 const schedule=()=>{
  if(root.children.length!==searchNodes.length){
   input.readOnly=false;root.replaceChildren(...searchNodes);
   input.setAttribute('aria-label',text.label);
  }
  const raw=input.value.trim();
  if(raw===observedRaw)return; // Ignore duplicate Android input events.
  observedRaw=raw;
  seq++;clearTimeout(timer);controller?.abort();selected=null;origin=null;
  confirmed.replaceChildren();results.replaceChildren();
  if(raw.length<2){status.textContent=text.short;return}
  status.textContent=text.checking;
  timer=setTimeout(()=>void lookup(),300);
 };
 // Tapping the confirmed field returns to the address suggestions on the
 // same screen. No extra confirmation page or navigation stack.
 input.addEventListener('click',()=>{
  if(!selected)return;
  selected=null;origin=null;input.readOnly=false;
  root.replaceChildren(...searchNodes);confirmed.replaceChildren();
  status.textContent=text.short;input.setAttribute('aria-label',text.label);
  input.focus();
 });
 input.addEventListener('input',schedule);
 input.addEventListener('change',schedule);
 input.addEventListener('compositionend',schedule);
 input.addEventListener('keydown',event=>{
  if(event.key==='Enter'){event.preventDefault();clearTimeout(timer);void lookup()}
 });
 root.append(title,input,hint,status,results,confirmed);
 // Replace all old content atomically, just as the working national form does.
 host.replaceChildren(root);
 input.value=incoming?.raw||'';
 const direct=incoming?.selected_destination;
 if(direct&&Number.isFinite(Number(direct.latitude))&&Number.isFinite(Number(direct.longitude))){
  selected={latitude:Number(direct.latitude),longitude:Number(direct.longitude),
   label:String(direct.label||incoming.destination_query||input.value),
   country_code:String(direct.country_code||''),city:String(direct.city||'')};
  const priorOrigin=incoming?.selected_origin;
  if(priorOrigin&&Number.isFinite(Number(priorOrigin.latitude))&&Number.isFinite(Number(priorOrigin.longitude)))
   origin={...priorOrigin,latitude:Number(priorOrigin.latitude),longitude:Number(priorOrigin.longitude)};
  showModes();
 }else{
  status.textContent=input.value?text.checking:text.short;
  if(input.value)schedule();
 }
}

`;
