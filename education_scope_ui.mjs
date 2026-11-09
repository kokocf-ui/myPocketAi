export const EDUCATION_SCOPE_UI_SCRIPT = String.raw`/* Conservative education-only intent guard: never redirect study examples. */
let eduScopeBypass='';
const EDU_SCOPE_SENTINEL='EDU_SCOPE_REDIRECT';
function eduScopeFold(value){
 return String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
}
function eduScopeIntent(raw){
 const s=eduScopeFold(raw).slice(0,1900);
 if(s.length<6)return null;
 // Explanations, coursework and interdisciplinary questions are legitimate study.
 if(/\b(?:exercitiu|lectie|tema de |tema pentru|pentru scoala|pentru curs|explica|explicatie|analizeaza|analiza literara|rezolva|demonstreaza|teorema|cum se calculeaza|ce inseamna|invat|studiez|explain|exercise|homework|lesson|teach me|what is|how does|for school|pour le cours|exercice|lecon|explique|hausaufgabe|erklar|ubung|lezione|esercizio|spiega|leccion|ejercicio|explicar|licao|oefening|lesstof|объясни|урок|задача|lekcja|zadanie|wyjasnij)\b/u.test(s))return null;
 if(/(?:cum (?:pot sa )?ajung|du[- ]ma (?:la|spre)|vreau (?:un )?traseu|arata[- ]mi (?:ruta|traseul)|traseu (?:cu masina |pietonal |spre |catre )|navigheaza|directions to|navigate to|take me to|how (?:do i|can i) get to|route to|comment aller|itineraire vers|wie komme ich|route nach|percorso per|como llegar|ruta a |como chegar|hoe kom ik|route naar|как добраться|маршрут до|jak dojade|trasa do)/u.test(s))return 'maps';
 const request=/(?:^|[.!?]\s*)(?:cauta|gaseste|rezerva|vreau sa (?:gasesc|rezerv)|find|search for|book|reserve|recommend|cherche|trouve|reserver|suche|finde|buche|cerca|trova|prenota|buscar|encuentra|reserva|procura|encontra|reservar|zoek|vind|boek|найди|забронируй|znajdz|zarezerwuj)\b/u.test(s);
 if(request&&/\b(?:hotel|hoteluri|cazare|pensiune|restaurant|restaurante|cafenea|pub|hostel|accommodation|lodging|restaurants?|cafe|hotels?|auberge|unterkunft|albergo|ristorante|hospedaje|alojamiento|restaurantes?|hotele|nocleg|гостиниц|отел|ресторан)\b/u.test(s))return 'travel';
 const action=/(?:^|[.!?]\s*)(?:adauga|noteaza|programeaza|aminteste[- ]mi|pune[- ]mi|sterge|fa[- ]mi (?:lista|un memento)|creeaza (?:un )?memento|add|schedule|remind me|create a shopping list|ajoute|planifie|erinnere mich|fuge hinzu|ricordami|aggiungi|recuerdame|anade|lembra[- ]me|adiciona|herinner me|voeg toe|напомни|добавь|zapisz|przypomnij|dodaj)\b/u.test(s);
 if(action&&/\b(?:agenda|calendar|calendario|calendrier|kalender|termin|memento|reminder|lista (?:de )?cumparaturi|shopping list|liste de courses|einkaufsliste|lista de compras|lista della spesa|boodschappenlijst|список покупок|lista zakupow|buget personal|budget tracker|task list|список дел|lista zadan)\b/u.test(s))return 'organize';
 if(/\b(?:cum (?:va fi|e|este) vremea (?:azi|maine)|vremea maine|prognoza meteo|what is the weather|what's the weather|weather forecast|meteo demain|wetter morgen|previsioni meteo|pronostico del tiempo|previsao do tempo|weer morgen|погода завтра|pogoda jutro|stirile (?:de azi|azi)|ultimele stiri|latest news|today.s news|actualites du jour|nachrichten heute|notizie di oggi|noticias de hoy|wiadomosci dzis|trimite (?:un )?(?:email|mesaj)|send (?:an )?(?:email|message)|envoyer un email|e-mail senden|enviar un correo|отправь письмо|wyslij mail)\b/u.test(s))return 'assistant';
 return null;
}
const EDU_SCOPE_TEXT={
ro:['Continuăm în alt modul?','Această cerere pare să țină de alt modul. Întrebarea este păstrată, iar tu alegi unde continui.','Deschide','Asistentul AI','Este pentru studiu','Rămân aici','Întrebarea transferată','Textul este pregătit; trimite-l când dorești.'],
en:['Continue in another section?','This request seems better suited to another section. Your question is kept; choose where to continue.','Open','AI Assistant','This is for learning','Stay here','Transferred question','Your text is ready; send it when you wish.'],
fr:['Continuer dans une autre rubrique ?','Cette demande correspond peut-être à une autre rubrique. Votre question est conservée.','Ouvrir','Assistant IA','C’est pour étudier','Rester ici','Question transférée','Le texte est prêt ; envoyez-le quand vous voulez.'],
de:['In einem anderen Bereich fortfahren?','Diese Anfrage passt möglicherweise besser in einen anderen Bereich. Deine Frage bleibt erhalten.','Öffnen','KI-Assistent','Das ist eine Lernfrage','Hier bleiben','Übertragene Frage','Der Text ist bereit; du kannst ihn senden.'],
it:['Continuare in un’altra sezione?','La richiesta potrebbe appartenere a un’altra sezione. La domanda resta disponibile.','Apri','Assistente AI','È per studiare','Resta qui','Domanda trasferita','Il testo è pronto per essere inviato.'],
es:['¿Continuar en otra sección?','Esta solicitud parece corresponder a otra sección. Tu pregunta se conserva.','Abrir','Asistente de IA','Es para estudiar','Quedarme aquí','Pregunta transferida','El texto está listo para enviarse.'],
pt:['Continuar noutra secção?','Este pedido parece pertencer a outra secção. A tua pergunta fica guardada.','Abrir','Assistente de IA','É para estudar','Ficar aqui','Pergunta transferida','O texto está pronto a enviar.'],
nl:['Doorgaan in een andere sectie?','Deze vraag hoort mogelijk bij een andere sectie. Je vraag blijft bewaard.','Open','AI-assistent','Dit is om te leren','Hier blijven','Overgedragen vraag','De tekst staat klaar om te versturen.'],
ru:['Продолжить в другом разделе?','Запрос может относиться к другому разделу. Текст вопроса сохранён.','Открыть','ИИ-помощник','Это учебный вопрос','Остаться здесь','Переданный вопрос','Текст готов к отправке.'],
pl:['Kontynuować w innej sekcji?','To pytanie może dotyczyć innej sekcji. Jego treść zostanie zachowana.','Otwórz','Asystent AI','To pytanie do nauki','Zostań tutaj','Przeniesione pytanie','Tekst jest gotowy do wysłania.']
};
function eduScopeWords(){return EDU_SCOPE_TEXT[state.language]||EDU_SCOPE_TEXT.en}
function eduScopeDestination(route){
 if(route==='assistant')return eduScopeWords()[3];
 return UI_TEXT[state.language]?.moduleTitle?.[route]||MODULES[route]?.title||route;
}
function eduScopeOffer(message,target,continueHere,closeSource){
 const value=String(message||'').trim().slice(0,4000);
 if(!value)return;
 const route=['maps','travel','organize','assistant'].includes(target)?target:'assistant',words=eduScopeWords();
 const dialog=document.createElement('dialog');dialog.className='education-scope-dialog';
 dialog.setAttribute('aria-label',words[0]);
 const title=document.createElement('h2');title.textContent=words[0];
 const desc=document.createElement('p');desc.textContent=words[1];
 const quote=document.createElement('blockquote');quote.textContent=value;
 const actions=document.createElement('div');actions.className='education-scope-actions';
 const button=(label,fn,primary)=>{
  const el=document.createElement('button');el.type='button';el.className=primary?'primary-btn':'secondary-btn';
  el.textContent=label;el.onclick=fn;actions.append(el);
 };
 const dismiss=()=>{if(dialog.open)dialog.close();dialog.remove()};
 const transfer=key=>{
  dismiss();if(typeof closeSource==='function')closeSource();
  openModule(key);inputEl.value=value;inputEl.dispatchEvent(new Event('input',{bubbles:true}));
  if(key==='organize'){
   const host=$('moduleContent');
   if(host){const draft=document.createElement('section');draft.className='education-transfer-draft';
    const label=document.createElement('strong');label.textContent=words[6];
    const text=document.createElement('p');text.textContent=value;
    const next=document.createElement('button');next.type='button';next.className='secondary-btn';next.textContent=words[3];
    next.onclick=()=>{openModule('assistant');inputEl.value=value;inputEl.dispatchEvent(new Event('input',{bubbles:true}))};
    draft.append(label,text,next);host.prepend(draft);}
  }else notify(words[7]);
 };
 button(words[2]+' '+eduScopeDestination(route),()=>transfer(route),true);
 if(route!=='assistant')button(words[3],()=>transfer('assistant'));
 if(typeof continueHere==='function')button(words[4],()=>{dismiss();eduScopeBypass=eduScopeFold(value);continueHere()});
 button(words[5],dismiss);
 dialog.append(title,desc,quote,actions);dialog.addEventListener('close',()=>dialog.remove());
 document.body.append(dialog);try{dialog.showModal()}catch{dialog.setAttribute('open','')}
}
function eduScopeBeforeAI(message,continueHere,closeSource){
 const value=String(message||'').trim();
 if(!value)return false;
 if(eduScopeBypass===eduScopeFold(value)){eduScopeBypass='';return false}
 const route=eduScopeIntent(value);if(!route)return false;
 eduScopeOffer(value,route,continueHere,closeSource);return true;
}
function eduScopePrompt(prompt){
 return String(prompt||'')+' EDUCAȚIE: Răspunde numai cu explicații, rezolvări și exemple de învățare. '+
  'Sunt permise toate întrebările interdisciplinare și exemplele școlare. '+
  'Dacă solicitarea este CLAR o acțiune practică externă (rezervare, traseu, agendă, știri curente) și nu este o cerință de studiu, '+
  'răspunde EXACT '+EDU_SCOPE_SENTINEL+' și nimic altceva. Nu confunda exemplele din lecții cu solicitările externe.';
}
function eduScopeReplyRouted(answer,question,continueHere,closeSource){
 const value=String(answer||'').trim().replace(/^[\s"']+|[\s"']+$/g,'');
 if(!new RegExp('^'+EDU_SCOPE_SENTINEL+'[.!]?$').test(value))return false;
 eduScopeOffer(question,eduScopeIntent(question)||'assistant',continueHere,closeSource);return true;
}
`;
