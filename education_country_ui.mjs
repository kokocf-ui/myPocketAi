export const EDUCATION_COUNTRY_UI_SCRIPT=String.raw`
// Shared country-first entry for every Education category except foreign languages.
// This is ONE editable country field, not a grid of countries.
// One deterministic, offline vocabulary for Education navigation.
const EDUCATION_UI_TRANSLATIONS={"en":{"← Înapoi":"← Back","Țara pentru care dorești să înveți":"Country you want to study for","Țara telefonului este sugerată doar dacă locația este disponibilă. Poți schimba țara oricând.":"Your location may suggest a country. You can change it anytime.","Scrie sau alege țara…":"Type or choose a country…","Țara studiului":"Country of study","Continuă":"Continue","Țară sugerată din locația disponibilă a telefonului.":"Country suggested from your location.","Ultima țară aleasă; poți schimba.":"Previously selected country; you can change it.","Țara nu a fost confirmată; alege din câmp.":"No country confirmed; choose one.","Alege o țară validă din sugestii.":"Choose a country from the suggestions.","Alege clasa / anul de studiu":"Choose grade or school year","Materia se adaptează clasei selectate.":"Lessons follow your selected grade.","Scrie clasa sau anul…":"Enter grade or year…","Nu am găsit clasa.":"No matching grade.","Alte clase →":"More grades →","← Clase anterioare":"← Previous grades","Alege opțiunea":"Choose an option","Alege":"Choose","Caută opțiunea":"Find an option","Caută de la primul caracter…":"Search from the first letter…","Niciun rezultat.":"No results.","← Anterior":"← Previous","Mai multe →":"More →","Cursuri practice":"Practical courses","Alege orice capitol.":"Choose any chapter.","Ce conține acest curs":"Course overview","Criterii de evaluare":"Assessment criteria","Proiect final de curs":"Final course project","Simulare nouă":"New practice test","Microfon indisponibil.":"Microphone unavailable.","Dictarea nu este disponibilă.":"Dictation unavailable.","Aud: ":"Hearing: ","← Înapoi la listă":"← Back to list","Anulează":"Cancel"},"fr":{"← Înapoi":"← Retour","Țara pentru care dorești să înveți":"Pays dont vous souhaitez suivre le programme","Țara telefonului este sugerată doar dacă locația este disponibilă. Poți schimba țara oricând.":"Le pays peut être suggéré d'après votre position. Vous pouvez le modifier à tout moment.","Scrie sau alege țara…":"Saisir ou choisir un pays…","Țara studiului":"Pays d'étude","Continuă":"Continuer","Țară sugerată din locația disponibilă a telefonului.":"Pays proposé d'après votre position.","Ultima țară aleasă; poți schimba.":"Dernier pays choisi ; vous pouvez le modifier.","Țara nu a fost confirmată; alege din câmp.":"Aucun pays confirmé ; faites votre choix.","Alege o țară validă din sugestii.":"Choisissez un pays dans les suggestions.","Alege clasa / anul de studiu":"Choisissez la classe ou l'année d'étude","Materia se adaptează clasei selectate.":"Les leçons correspondent à la classe choisie.","Scrie clasa sau anul…":"Saisir la classe ou l'année…","Nu am găsit clasa.":"Aucune classe correspondante.","Alte clase →":"Autres classes →","← Clase anterioare":"← Classes précédentes","Alege opțiunea":"Choisir une option","Alege":"Choisir","Caută opțiunea":"Rechercher une option","Caută de la primul caracter…":"Rechercher dès la première lettre…","Niciun rezultat.":"Aucun résultat.","← Anterior":"← Précédent","Mai multe →":"Plus →","Cursuri practice":"Cours pratiques","Alege orice capitol.":"Choisissez un chapitre.","Ce conține acest curs":"Contenu du cours","Criterii de evaluare":"Critères d'évaluation","Proiect final de curs":"Projet de fin de cours","Simulare nouă":"Nouvelle simulation","Microfon indisponibil.":"Microphone indisponible.","Dictarea nu este disponibilă.":"Dictée indisponible.","Aud: ":"Entendu : ","← Înapoi la listă":"← Retour à la liste","Anulează":"Annuler"},"de":{"← Înapoi":"← Zurück","Țara pentru care dorești să înveți":"Land, nach dessen Lehrplan du lernen möchtest","Țara telefonului este sugerată doar dacă locația este disponibilă. Poți schimba țara oricând.":"Anhand deines Standorts kann ein Land vorgeschlagen werden. Du kannst es jederzeit ändern.","Scrie sau alege țara…":"Land eingeben oder auswählen…","Țara studiului":"Land des Lehrplans","Continuă":"Weiter","Țară sugerată din locația disponibilă a telefonului.":"Land anhand deines Standorts vorgeschlagen.","Ultima țară aleasă; poți schimba.":"Zuletzt gewähltes Land; du kannst es ändern.","Țara nu a fost confirmată; alege din câmp.":"Kein Land bestätigt; bitte eines auswählen.","Alege o țară validă din sugestii.":"Bitte ein Land aus den Vorschlägen wählen.","Alege clasa / anul de studiu":"Klasse oder Schuljahr auswählen","Materia se adaptează clasei selectate.":"Die Lerninhalte richten sich nach der gewählten Klasse.","Scrie clasa sau anul…":"Klasse oder Schuljahr eingeben…","Nu am găsit clasa.":"Keine passende Klasse gefunden.","Alte clase →":"Weitere Klassen →","← Clase anterioare":"← Vorherige Klassen","Alege opțiunea":"Option auswählen","Alege":"Auswählen","Caută opțiunea":"Option suchen","Caută de la primul caracter…":"Ab dem ersten Zeichen suchen…","Niciun rezultat.":"Keine Ergebnisse.","← Anterior":"← Zurück","Mai multe →":"Mehr →","Cursuri practice":"Praxiskurse","Alege orice capitol.":"Wähle ein Kapitel.","Ce conține acest curs":"Kursübersicht","Criterii de evaluare":"Bewertungskriterien","Proiect final de curs":"Abschlussprojekt","Simulare nouă":"Neue Übungsprüfung","Microfon indisponibil.":"Mikrofon nicht verfügbar.","Dictarea nu este disponibilă.":"Diktieren nicht verfügbar.","Aud: ":"Erkannt: ","← Înapoi la listă":"← Zurück zur Liste","Anulează":"Abbrechen"},"it":{"← Înapoi":"← Indietro","Țara pentru care dorești să înveți":"Paese di cui vuoi seguire il programma","Țara telefonului este sugerată doar dacă locația este disponibilă. Poți schimba țara oricând.":"Il Paese può essere suggerito in base alla posizione. Puoi cambiarlo in qualsiasi momento.","Scrie sau alege țara…":"Scrivi o scegli un Paese…","Țara studiului":"Paese di studio","Continuă":"Continua","Țară sugerată din locația disponibilă a telefonului.":"Paese suggerito in base alla posizione.","Ultima țară aleasă; poți schimba.":"Ultimo Paese scelto; puoi cambiarlo.","Țara nu a fost confirmată; alege din câmp.":"Nessun Paese confermato; scegline uno.","Alege o țară validă din sugestii.":"Scegli un Paese dai suggerimenti.","Alege clasa / anul de studiu":"Scegli la classe o l'anno di studio","Materia se adaptează clasei selectate.":"Le lezioni seguono la classe selezionata.","Scrie clasa sau anul…":"Inserisci classe o anno…","Nu am găsit clasa.":"Nessuna classe trovata.","Alte clase →":"Altre classi →","← Clase anterioare":"← Classi precedenti","Alege opțiunea":"Scegli un'opzione","Alege":"Scegli","Caută opțiunea":"Cerca un'opzione","Caută de la primul caracter…":"Cerca dalla prima lettera…","Niciun rezultat.":"Nessun risultato.","← Anterior":"← Precedente","Mai multe →":"Altre →","Cursuri practice":"Corsi pratici","Alege orice capitol.":"Scegli un capitolo.","Ce conține acest curs":"Contenuti del corso","Criterii de evaluare":"Criteri di valutazione","Proiect final de curs":"Progetto finale del corso","Simulare nouă":"Nuova simulazione","Microfon indisponibil.":"Microfono non disponibile.","Dictarea nu este disponibilă.":"Dettatura non disponibile.","Aud: ":"Ascolto: ","← Înapoi la listă":"← Torna all'elenco","Anulează":"Annulla"},"es":{"← Înapoi":"← Atrás","Țara pentru care dorești să înveți":"País cuyo programa quieres estudiar","Țara telefonului este sugerată doar dacă locația este disponibilă. Poți schimba țara oricând.":"Se puede sugerir un país según tu ubicación. Puedes cambiarlo cuando quieras.","Scrie sau alege țara…":"Escribe o elige un país…","Țara studiului":"País de estudio","Continuă":"Continuar","Țară sugerată din locația disponibilă a telefonului.":"País sugerido según tu ubicación.","Ultima țară aleasă; poți schimba.":"Último país elegido; puedes cambiarlo.","Țara nu a fost confirmată; alege din câmp.":"No hay ningún país confirmado; elige uno.","Alege o țară validă din sugestii.":"Elige un país de las sugerencias.","Alege clasa / anul de studiu":"Elige curso o año escolar","Materia se adaptează clasei selectate.":"Las lecciones se adaptan al curso elegido.","Scrie clasa sau anul…":"Escribe el curso o año…","Nu am găsit clasa.":"No se encontró el curso.","Alte clase →":"Más cursos →","← Clase anterioare":"← Cursos anteriores","Alege opțiunea":"Elige una opción","Alege":"Elegir","Caută opțiunea":"Buscar opción","Caută de la primul caracter…":"Buscar desde la primera letra…","Niciun rezultat.":"Sin resultados.","← Anterior":"← Anterior","Mai multe →":"Más →","Cursuri practice":"Cursos prácticos","Alege orice capitol.":"Elige un capítulo.","Ce conține acest curs":"Contenido del curso","Criterii de evaluare":"Criterios de evaluación","Proiect final de curs":"Proyecto final del curso","Simulare nouă":"Nueva simulación","Microfon indisponibil.":"Micrófono no disponible.","Dictarea nu este disponibilă.":"Dictado no disponible.","Aud: ":"Escucho: ","← Înapoi la listă":"← Volver a la lista","Anulează":"Cancelar"},"pt":{"← Înapoi":"← Voltar","Țara pentru care dorești să înveți":"País cujo programa queres estudar","Țara telefonului este sugerată doar dacă locația este disponibilă. Poți schimba țara oricând.":"O país pode ser sugerido com base na localização. Podes alterá-lo quando quiseres.","Scrie sau alege țara…":"Escreve ou escolhe um país…","Țara studiului":"País de estudo","Continuă":"Continuar","Țară sugerată din locația disponibilă a telefonului.":"País sugerido com base na localização.","Ultima țară aleasă; poți schimba.":"Último país escolhido; podes alterá-lo.","Țara nu a fost confirmată; alege din câmp.":"Nenhum país confirmado; escolhe um.","Alege o țară validă din sugestii.":"Escolhe um país das sugestões.","Alege clasa / anul de studiu":"Escolhe o ano de escolaridade","Materia se adaptează clasei selectate.":"As lições adaptam-se ao ano escolhido.","Scrie clasa sau anul…":"Escreve o ano escolar…","Nu am găsit clasa.":"Ano escolar não encontrado.","Alte clase →":"Mais anos →","← Clase anterioare":"← Anos anteriores","Alege opțiunea":"Escolhe uma opção","Alege":"Escolher","Caută opțiunea":"Procurar opção","Caută de la primul caracter…":"Pesquisar desde a primeira letra…","Niciun rezultat.":"Sem resultados.","← Anterior":"← Anterior","Mai multe →":"Mais →","Cursuri practice":"Cursos práticos","Alege orice capitol.":"Escolhe um capítulo.","Ce conține acest curs":"Conteúdo do curso","Criterii de evaluare":"Critérios de avaliação","Proiect final de curs":"Projeto final do curso","Simulare nouă":"Nova simulação","Microfon indisponibil.":"Microfone indisponível.","Dictarea nu este disponibilă.":"Ditado indisponível.","Aud: ":"A ouvir: ","← Înapoi la listă":"← Voltar à lista","Anulează":"Cancelar"},"nl":{"← Înapoi":"← Terug","Țara pentru care dorești să înveți":"Land waarvan je het lesprogramma wilt volgen","Țara telefonului este sugerată doar dacă locația este disponibilă. Poți schimba țara oricând.":"Op basis van je locatie kan een land worden voorgesteld. Je kunt het altijd wijzigen.","Scrie sau alege țara…":"Typ of kies een land…","Țara studiului":"Land van studie","Continuă":"Doorgaan","Țară sugerată din locația disponibilă a telefonului.":"Land voorgesteld op basis van je locatie.","Ultima țară aleasă; poți schimba.":"Eerder gekozen land; je kunt het wijzigen.","Țara nu a fost confirmată; alege din câmp.":"Geen land bevestigd; kies een land.","Alege o țară validă din sugestii.":"Kies een land uit de suggesties.","Alege clasa / anul de studiu":"Kies klas of leerjaar","Materia se adaptează clasei selectate.":"De lessen sluiten aan bij het gekozen leerjaar.","Scrie clasa sau anul…":"Vul klas of leerjaar in…","Nu am găsit clasa.":"Geen passend leerjaar.","Alte clase →":"Meer leerjaren →","← Clase anterioare":"← Vorige leerjaren","Alege opțiunea":"Kies een optie","Alege":"Kiezen","Caută opțiunea":"Optie zoeken","Caută de la primul caracter…":"Zoek vanaf de eerste letter…","Niciun rezultat.":"Geen resultaten.","← Anterior":"← Vorige","Mai multe →":"Meer →","Cursuri practice":"Praktijkcursussen","Alege orice capitol.":"Kies een hoofdstuk.","Ce conține acest curs":"Inhoud van de cursus","Criterii de evaluare":"Beoordelingscriteria","Proiect final de curs":"Eindproject","Simulare nouă":"Nieuwe oefentoets","Microfon indisponibil.":"Microfoon niet beschikbaar.","Dictarea nu este disponibilă.":"Dicteren niet beschikbaar.","Aud: ":"Ik hoor: ","← Înapoi la listă":"← Terug naar lijst","Anulează":"Annuleren"},"ru":{"← Înapoi":"← Назад","Țara pentru care dorești să înveți":"Страна, по программе которой вы хотите учиться","Țara telefonului este sugerată doar dacă locația este disponibilă. Poți schimba țara oricând.":"Страна может быть предложена по местоположению. Её можно изменить в любой момент.","Scrie sau alege țara…":"Введите или выберите страну…","Țara studiului":"Страна обучения","Continuă":"Продолжить","Țară sugerată din locația disponibilă a telefonului.":"Страна предложена по местоположению.","Ultima țară aleasă; poți schimba.":"Ранее выбранная страна; её можно изменить.","Țara nu a fost confirmată; alege din câmp.":"Страна не подтверждена; выберите её.","Alege o țară validă din sugestii.":"Выберите страну из предложенных.","Alege clasa / anul de studiu":"Выберите класс или год обучения","Materia se adaptează clasei selectate.":"Уроки соответствуют выбранному классу.","Scrie clasa sau anul…":"Введите класс или год…","Nu am găsit clasa.":"Класс не найден.","Alte clase →":"Другие классы →","← Clase anterioare":"← Предыдущие классы","Alege opțiunea":"Выберите вариант","Alege":"Выбрать","Caută opțiunea":"Поиск варианта","Caută de la primul caracter…":"Поиск с первой буквы…","Niciun rezultat.":"Нет результатов.","← Anterior":"← Назад","Mai multe →":"Ещё →","Cursuri practice":"Практические курсы","Alege orice capitol.":"Выберите любую главу.","Ce conține acest curs":"Содержание курса","Criterii de evaluare":"Критерии оценки","Proiect final de curs":"Итоговый проект курса","Simulare nouă":"Новый пробный тест","Microfon indisponibil.":"Микрофон недоступен.","Dictarea nu este disponibilă.":"Диктовка недоступна.","Aud: ":"Слышу: ","← Înapoi la listă":"← Назад к списку","Anulează":"Отмена"},"pl":{"← Înapoi":"← Wstecz","Țara pentru care dorești să înveți":"Kraj, którego programu nauczania chcesz się uczyć","Țara telefonului este sugerată doar dacă locația este disponibilă. Poți schimba țara oricând.":"Kraj może zostać zasugerowany na podstawie lokalizacji. Możesz go zmienić w każdej chwili.","Scrie sau alege țara…":"Wpisz lub wybierz kraj…","Țara studiului":"Kraj nauki","Continuă":"Kontynuuj","Țară sugerată din locația disponibilă a telefonului.":"Kraj zasugerowany na podstawie lokalizacji.","Ultima țară aleasă; poți schimba.":"Ostatnio wybrany kraj; możesz go zmienić.","Țara nu a fost confirmată; alege din câmp.":"Nie potwierdzono kraju; wybierz kraj.","Alege o țară validă din sugestii.":"Wybierz kraj z podpowiedzi.","Alege clasa / anul de studiu":"Wybierz klasę lub rok nauki","Materia se adaptează clasei selectate.":"Lekcje odpowiadają wybranej klasie.","Scrie clasa sau anul…":"Wpisz klasę lub rok…","Nu am găsit clasa.":"Nie znaleziono klasy.","Alte clase →":"Więcej klas →","← Clase anterioare":"← Poprzednie klasy","Alege opțiunea":"Wybierz opcję","Alege":"Wybierz","Caută opțiunea":"Szukaj opcji","Caută de la primul caracter…":"Szukaj od pierwszej litery…","Niciun rezultat.":"Brak wyników.","← Anterior":"← Poprzednie","Mai multe →":"Więcej →","Cursuri practice":"Kursy praktyczne","Alege orice capitol.":"Wybierz dowolny rozdział.","Ce conține acest curs":"Zawartość kursu","Criterii de evaluare":"Kryteria oceny","Proiect final de curs":"Projekt końcowy kursu","Simulare nouă":"Nowy test próbny","Microfon indisponibil.":"Mikrofon niedostępny.","Dictarea nu este disponibilă.":"Dyktowanie niedostępne.","Aud: ":"Słyszę: ","← Înapoi la listă":"← Wróć do listy","Anulează":"Anuluj"}};
function eduUiLabel(ro,en){
 const lang=state.language||'ro';
 if(lang==='ro')return ro;
 return EDUCATION_UI_TRANSLATIONS[lang]?.[ro]||(typeof learningLabel==='function'?eduUiLabel(ro,en):(en||ro));
}
const EDU_UK_COUNTRY_NAMES={"GB-ENG":{"ro":"Anglia","en":"England","fr":"Angleterre","de":"England","it":"Inghilterra","es":"Inglaterra","pt":"Inglaterra","nl":"Engeland","ru":"Англия","pl":"Anglia"},"GB-SCT":{"ro":"Scoția","en":"Scotland","fr":"Écosse","de":"Schottland","it":"Scozia","es":"Escocia","pt":"Escócia","nl":"Schotland","ru":"Шотландия","pl":"Szkocja"},"GB-WLS":{"ro":"Țara Galilor","en":"Wales","fr":"Pays de Galles","de":"Wales","it":"Galles","es":"Gales","pt":"País de Gales","nl":"Wales","ru":"Уэльс","pl":"Walia"},"GB-NIR":{"ro":"Irlanda de Nord","en":"Northern Ireland","fr":"Irlande du Nord","de":"Nordirland","it":"Irlanda del Nord","es":"Irlanda del Norte","pt":"Irlanda do Norte","nl":"Noord-Ierland","ru":"Северная Ирландия","pl":"Irlandia Północna"}};
let educationCountrySelection={code:'',label:'',method:'unconfirmed',activeModule:null,callback:null,requestId:0};
function eduCountryFold(value){return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLocaleLowerCase()}
function eduCountryOptions(){
 const all=typeof HG_COUNTRY_PICKER_DATA!=='undefined'?HG_COUNTRY_PICKER_DATA:[];
 const seen=new Set();return all.filter(x=>x&&x.id!=='OTHER'&&!seen.has(x.id)&&seen.add(x.id));
}
function eduCountryLabel(country){
 const code=country?.id||'',lang=state.language||'ro';
 if(EDU_UK_COUNTRY_NAMES[code])return EDU_UK_COUNTRY_NAMES[code][lang]||EDU_UK_COUNTRY_NAMES[code].en;
 if(lang==='ro')return country.ro||country.id;
 try{
  const locale=lang==='pt'?'pt-PT':lang;
  const name=new Intl.DisplayNames([locale],{type:'region'}).of(code);
  if(name&&name!==code)return name;
 }catch{}
 return eduUiLabel(country.ro||country.id,country.en||country.id);
}
function eduCountryFind(code){return eduCountryOptions().find(c=>c.id===code)||null}
function eduCountryFromCode(country,coords){
 const code=String(country||'').toUpperCase();
 if(code==='GB'||code==='UK'){
  const lat=Number(coords?.latitude),lon=Number(coords?.longitude);
  if(Number.isFinite(lat)&&Number.isFinite(lon)){
   if(lat>=54&&lat<=55.4&&lon>=-8.3&&lon<=-5.3)return 'GB-NIR';
   if(lat>=51.2&&lat<=53.5&&lon>=-5.6&&lon<=-2.6)return 'GB-WLS';
   if(lat>55.8&&lat<=60.9&&lon>=-8.8&&lon<=-0.5)return 'GB-SCT';
   if(lat>=50&&lat<=55.8&&lon>=-6.5&&lon<=2.3)return 'GB-ENG';
  }
  return '';
 }
 return eduCountryFind(code)?code:'';
}
function eduCountryLastConfirmed(){try{const item=JSON.parse(localStorage.getItem('pocket-edu-country-confirmed-v1')||'null');return eduCountryFind(item?.code)?item.code:''}catch{return ''}}
function eduCountryApply(moduleKey,code){
 const c=eduCountryFind(code);if(!c)return false;
 educationCountrySelection.code=code;educationCountrySelection.label=eduCountryLabel(c);educationCountrySelection.method='selected';
 try{localStorage.setItem('pocket-edu-country-confirmed-v1',JSON.stringify({code,updatedAt:Date.now()}))}catch{}
 if(typeof hgJourney!=='undefined'){hgJourney.country=code;hgJourney.region='';hgJourney.topic=null;hgJourney.speciality=null;hgJourney.level=null;hgJourney.grade=null}
 if(typeof litJourney!=='undefined'){litJourney.country=code;litJourney.level='beginner';litJourney.grade='';litJourney.branch='program';litJourney.topic='';const def=LIT_COUNTRIES.find(x=>x[0]===code);if(def)litJourney.language=def[3]}
 if(typeof examJourney!=='undefined'){examJourney.country=code;examJourney.grade='';examJourney.exam=null;examJourney.subject=null;examJourney.domain=null;examJourney.topic=null;examJourney.track='';examJourney.board='';examJourney.region='';examJourney.aiQuestions=null;examJourney.practiceVersion=0}
 if(typeof practicalJourney!=='undefined'){practicalJourney.country=code;practicalJourney.course='';practicalJourney.chapter=''}
 if(typeof mathJourney!=='undefined'){mathJourney.stage='levels';mathJourney.level=null;mathJourney.topic=null;mathJourney.grade=null}
 if(typeof scienceJourney!=='undefined'){scienceJourney.stage='subjects';scienceJourney.level=null;scienceJourney.specialty=null;scienceJourney.topic=null;scienceJourney.grade=null}
 if(typeof computingJourney!=='undefined'){computingJourney.stage='levels';computingJourney.level=null;computingJourney.path=null;computingJourney.topic=null;computingJourney.grade=null}
 return true;
}
function educationCountryGate(moduleKey,proceed){
 if(moduleKey==='languages'){proceed();return}
 educationCountrySelection.requestId++;
 const requestId=educationCountrySelection.requestId;
 educationCountrySelection.activeModule=moduleKey;
 const root=document.getElementById('view-module'),host=document.getElementById('moduleContent');if(!host||!root)return;
 root.classList.remove('learning-choose','learning-math','learning-science','learning-hg','learning-literature','learning-computing','learning-exams','learning-practical','science-choice-stage','math-choice-stage');
 root.classList.add('learning-active','learning-country-gate');
 const currentSubject=LEARNING_SUBJECTS.find(x=>x[0]===moduleKey);
 document.getElementById('moduleTitle').textContent=eduUiLabel(currentSubject?.[2]||'Educație',currentSubject?.[3]||'Education');
 document.getElementById('moduleLead').textContent='';host.replaceChildren();
 const toolbar=document.createElement('div');toolbar.className='education-toolbar lit-toolbar';
 const back=document.createElement('button');back.type='button';back.className='secondary-btn';back.textContent=eduUiLabel('← Înapoi','← Back');back.onclick=()=>{educationCountrySelection.requestId++;renderLearningSubjects()};
 toolbar.append(back);host.append(toolbar);
 const panel=document.createElement('section');panel.className='math-choice-panel science-choice-panel lit-panel edu-country-panel';
 panel.style.cssText='min-width:0;width:100%;max-width:100%;box-sizing:border-box;padding:12px 14px 20px;overflow-wrap:anywhere;';
 const h=document.createElement('h2');h.textContent=eduUiLabel('Țara pentru care dorești să înveți','Country whose curriculum you want to study');
 const note=document.createElement('p');note.textContent=eduUiLabel('Țara telefonului este sugerată doar dacă locația este disponibilă. Poți schimba țara oricând.','The phone location suggests a country only when available. You can always choose another.');
 const input=document.createElement('input');input.type='search';input.className='lit-input edu-country-input';input.id='eduCountryInput';input.autocomplete='off';input.spellcheck=false;input.placeholder=eduUiLabel('Scrie sau alege țara…','Type or choose a country…');
 input.setAttribute('aria-label',eduUiLabel('Țara studiului','Country of study'));
 input.style.cssText='width:100%;max-width:100%;min-height:49px;box-sizing:border-box;font-size:16px;touch-action:manipulation;';
 const matches=document.createElement('div');matches.className='edu-country-matches';matches.style.cssText='display:none;flex-direction:column;gap:6px;margin-top:6px;max-height:250px;overflow:auto;';
 const status=document.createElement('p');status.setAttribute('role','status');
 const confirm=document.createElement('button');confirm.type='button';confirm.className='primary-btn';confirm.textContent=eduUiLabel('Continuă','Continue');confirm.style.cssText='min-height:48px;touch-action:manipulation;max-width:100%;';
 panel.append(h,note,input,matches,status,confirm);host.append(panel);
 let selected='',touched=false;
 function suggest(code,method){
  const country=eduCountryFind(code);if(!country||touched||educationCountrySelection.requestId!==requestId)return;
  selected=code;input.value=eduCountryLabel(country);
  educationCountrySelection.method=method;
  status.textContent=method==='location'?eduUiLabel('Țară sugerată din locația disponibilă a telefonului.','Suggested from available phone location.'):eduUiLabel('Ultima țară aleasă; poți schimba.','Previously chosen country; you can change it.');
 }
 const saved=eduCountryLastConfirmed();if(saved)suggest(saved,'saved');
 else status.textContent=eduUiLabel('Țara nu a fost confirmată; alege din câmp.','Country not yet confirmed; choose it using the field.');
 input.addEventListener('focus',()=>{input.select()});
 const countries=eduCountryOptions(),fold=eduCountryFold;
 function draw(){
  matches.replaceChildren();
  const query=fold(input.value);if(!query){matches.style.display='none';return}
  const hits=countries.filter(c=>fold(eduCountryLabel(c)).startsWith(query)||fold(c.ro).startsWith(query)||fold(c.en).startsWith(query)||fold(c.id).startsWith(query)).slice(0,4);
  for(const hit of hits){const b=document.createElement('button');b.type='button';b.className='secondary-btn';b.textContent=eduCountryLabel(hit);b.style.cssText='text-align:left;width:100%;min-height:45px;white-space:normal;touch-action:manipulation;';b.onclick=()=>{selected=hit.id;input.value=eduCountryLabel(hit);matches.replaceChildren();matches.style.display='none';status.textContent=''};matches.append(b)}
  matches.style.display=hits.length?'flex':'none';
 }
 input.addEventListener('input',()=>{touched=true;selected='';status.textContent='';draw()});
 input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();confirm.click()}});
 confirm.onclick=()=>{
  const exact=countries.find(c=>fold(eduCountryLabel(c))===fold(input.value)||fold(c.ro)===fold(input.value)||fold(c.en)===fold(input.value)||fold(c.id)===fold(input.value));
  const code=selected||exact?.id;
  if(!code){status.textContent=eduUiLabel('Alege o țară validă din sugestii.','Choose a valid country from the matches.');return}
  if(!eduCountryApply(moduleKey,code))return;
  educationCountrySelection.requestId++;root.classList.remove('learning-country-gate');
  proceed();
 };
 // Geo resolution is asynchronous, never requests fresh permission and never changes a field the user touched.
 function autoDetectFromCoords(coords){
  if(!Number.isFinite(Number(coords?.latitude))||!Number.isFinite(Number(coords?.longitude)))return;
  try{const url=new URL(CLIENT_CONFIG.apiUrl);url.pathname='/api/finance-country';url.search='';url.searchParams.set('lat',String(coords.latitude));url.searchParams.set('lon',String(coords.longitude));
   fetch(url.toString(),{headers:{Accept:'application/json'}}).then(x=>{if(!x.ok)throw Error('country');return x.json()}).then(x=>suggest(eduCountryFromCode(x.country,coords),'location')).catch(()=>{});
  }catch{}
 }
 const coords=state.location;
 if(Number.isFinite(Number(coords?.latitude))&&Number.isFinite(Number(coords?.longitude)))autoDetectFromCoords(coords);
 else if(state.locationStarted&&typeof getCurrentCoordinates==='function')getCurrentCoordinates(false).then(autoDetectFromCoords).catch(()=>{});
 else if(typeof budgetDetectedCountry==='string'&&budgetDetectedCountry)suggest(eduCountryFromCode(budgetDetectedCountry,null),'detected');
}
function eduYearOptions(code,level,moduleKey){
 const lv=level==='intermediate'?'medium':level;
 const source=EDUCATION_SCHOOL_YEARS_DATA[code]?.[lv];
 const numeric=(a,b,prefix='')=>Array.from({length:b-a+1},(_,i)=>({id:prefix+(a+i),ro:prefix?'Year '+(a+i):'Clasa '+(a+i),en:prefix?'Year '+(a+i):'Grade '+(a+i)}));
 if(moduleKey==='math'){
  if(code==='RO')return lv==='beginner'?numeric(1,8):lv==='medium'?numeric(9,12):[{id:'universitate',ro:'Universitate',en:'University'}];
  if(code==='GB-ENG')return lv==='beginner'?numeric(1,9,'Y'):lv==='medium'?numeric(10,13,'Y'):[{id:'university',ro:'Higher education',en:'Higher education'}];
 }
 if(moduleKey==='history'){
  if(code==='RO')return lv==='beginner'?numeric(4,4):lv==='lower'?numeric(5,8):lv==='medium'?numeric(9,12):[{id:'universitate',ro:'Universitate',en:'University'}];
  if(code==='GB-ENG')return lv==='beginner'?numeric(1,6,'Y'):lv==='lower'?numeric(7,9,'Y'):lv==='medium'?numeric(10,13,'Y'):[{id:'university',ro:'Higher education',en:'Higher education'}];
 }
 if(moduleKey==='computing'){
  if(code==='RO')return lv==='beginner'?numeric(1,4):lv==='lower'?numeric(5,8):lv==='medium'?numeric(9,12):[{id:'universitate',ro:'Universitate',en:'University'}];
  if(code==='GB-ENG')return lv==='beginner'?numeric(1,6,'Y'):lv==='lower'?numeric(7,9,'Y'):lv==='medium'?numeric(10,13,'Y'):[{id:'university',ro:'Higher education',en:'Higher education'}];
 }
 if(source){
   if(code==='RO'){
    if(moduleKey==='math'&&lv==='beginner')return numeric(1,8);
    if(moduleKey==='science'&&lv==='beginner')return numeric(typeof scienceJourney!=='undefined'&&scienceJourney.subject==='chemistry'?7:typeof scienceJourney!=='undefined'&&scienceJourney.subject==='physics'?6:5,8);
    if(moduleKey==='history'&&lv==='beginner'&&typeof hgJourney!=='undefined'&&['history','geography'].includes(hgJourney.subject))return source.filter(x=>x.id==='4');
    if(moduleKey==='science'&&lv==='medium')return numeric(9,12);
    if(moduleKey==='computing'&&lv==='beginner')return numeric(1,4);
   }
   return source;
 }
 return [{id:'general-'+lv,ro:lv==='beginner'?'Învățare generală – primar':lv==='medium'?'Învățare generală – secundar':'Învățare generală – universitar',en:lv==='beginner'?'General primary learning':lv==='medium'?'General secondary learning':'General university learning'}];
}
function educationGradeGate(moduleKey,level,proceed,back){
 const root=document.getElementById('view-module'),host=document.getElementById('moduleContent');
 if(!root||!host)return;
 const country=educationCountrySelection.code;
 const options=eduYearOptions(country,level,moduleKey);
 if(options.length===1){proceed(options[0].id);return}
 host.replaceChildren();
 const toolbar=document.createElement('div');toolbar.className='education-toolbar lit-toolbar';
 const previous=document.createElement('button');previous.type='button';previous.className='secondary-btn';previous.textContent=eduUiLabel('← Înapoi','← Back');previous.onclick=back;toolbar.append(previous);host.append(toolbar);
 const panel=document.createElement('section');panel.className='math-choice-panel science-choice-panel lit-panel edu-grade-panel';panel.style.cssText='min-width:0;max-width:100%;box-sizing:border-box;';
 const h=document.createElement('h2');h.textContent=eduUiLabel('Alege clasa / anul de studiu','Choose grade / school year');
 const context=document.createElement('p');context.textContent=educationCountrySelection.label+' · '+eduUiLabel('Materia se adaptează clasei selectate.','Learning content follows the selected school year.');
 const search=document.createElement('input');search.type='search';search.className='lit-input';search.placeholder=eduUiLabel('Scrie clasa sau anul…','Type a grade or year…');search.setAttribute('aria-label',h.textContent);
 search.style.cssText='width:100%;box-sizing:border-box;min-height:48px;font-size:16px;';
 const list=document.createElement('div');list.style.cssText='display:flex;flex-direction:column;gap:7px;max-width:100%;margin:8px 0;';
 panel.append(h,context,search,list);host.append(panel);
 let page=0;function draw(){
  list.replaceChildren();const text=eduCountryFold(search.value);
  const filtered=options.filter(o=>!text||eduCountryFold(o.ro).includes(text)||eduCountryFold(o.en).includes(text)||eduCountryFold(o.id).includes(text));
  if(page>=filtered.length)page=0;
  filtered.slice(page,page+4).forEach(o=>{const b=document.createElement('button');b.type='button';b.className='secondary-btn';b.textContent=eduUiLabel(o.ro,o.en);b.style.cssText='min-height:45px;text-align:left;width:100%;';b.onclick=()=>proceed(o.id);list.append(b)});
  if(!filtered.length){const p=document.createElement('p');p.textContent=eduUiLabel('Nu am găsit clasa.','No matching grade.');list.append(p)}
  if(page+4<filtered.length){const b=document.createElement('button');b.type='button';b.className='secondary-btn';b.textContent=eduUiLabel('Alte clase →','More grades →');b.onclick=()=>{page+=4;draw()};list.append(b)}
  if(page>0){const b=document.createElement('button');b.type='button';b.className='secondary-btn';b.textContent=eduUiLabel('← Clase anterioare','← Previous grades');b.onclick=()=>{page=Math.max(0,page-4);draw()};list.prepend(b)}
 }
 search.addEventListener('focus',()=>search.select());
 search.oninput=()=>{page=0;draw()};draw();
}

`;