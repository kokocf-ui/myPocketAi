// Coding assistant capability contract: authoring code is available in text;
// running, hosting and deploying code require separately connected tooling.
const clean = value => String(value||'').normalize('NFD')
 .replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const codeSubject = /\b(?:program(?:el|are|ul|e|ele|ului)?|aplicati(?:e|i)|software|script(?:uri)?|cod(?:ul|ului|are)?|code|coding|programming|html|css|javascript|typescript|python|java|c\+\+|php|sql|website|webpage|web page|site(?:-?ul| web)?|pagina web|pagini web|pagina de internet|pagini de internet|formular web|joc(?:ulet|uri)?|game|app(?:lication)?|debug|bug|eroare de compilare)\b/;
const codeAction = /\b(?:crea|creezi|creeaza|creez|fa|facut|depanez|depanare|construi|construiesti|construiasca|face|faci|facem|scrie|scrii|scriem|genera|generezi|genereaza|dezvolta|dezvolti|implementa|implementezi|programa|programezi|corecta|corecteaza|repara|explica|invata|invat|ajuta|ajuti|poti|putem|vreau|as vrea|exemplu|arata|arati|create|build|make|write|develop|implement|generate|fix|debug|explain|learn|help|can|could|want)\b/;
const codeFollowUp = /^(?:da|ok|bine|hai|continua|continua cu|mai departe|arata mi|fa l|scrie l|modifica l|vreau codul|adauga|acum)(?:\b|$)/;
export function classifyProgrammingRequest(message, history=[]){
 const q=clean(message);
 if(!q||q.length>5000)return {kind:'none'};
 if(codeSubject.test(q)&&codeAction.test(q))return {kind:'coding',reason:'explicit_coding_request'};
 if(codeSubject.test(q)&&/^(?:cum|ce este|ce inseamna|why|what|how|de ce)\b/.test(q))return {kind:'coding',reason:'programming_learning'};
 if(codeFollowUp.test(q)&&Array.isArray(history)){
  const prior=history.filter(x=>x&&x.role==='user').slice(-4);
  if(prior.some(x=>codeSubject.test(clean(x.content))&&codeAction.test(clean(x.content))))
   return {kind:'coding',reason:'coding_followup'};
 }
 return {kind:'none'};
}
export function programmingAssistantInstruction(language='ro'){
 return language==='ro'
  ? 'PROGRAMARE ȘI DEZVOLTARE WEB: Eva poate SCRIE, EXPLICA, REVIZUI și DEPANA cod ca text în conversație: HTML, CSS, JavaScript, Python și alte limbaje, plus mici programe, pagini web, exerciții de informatică și exemple complete. Nu răspunde că nu poți crea pagini web sau programe doar fiindcă nu poți găzdui site-ul. Dacă utilizatorul întreabă dacă poți, spune că da, poți genera codul și explica testarea; nu promite că îl execuți, îl găzduiești sau îl publici automat. Dacă cere un proiect concret și există suficiente detalii, furnizează cod funcțional, complet și coerent, în blocuri cu limbajul potrivit; numește fișierele și arată cum se salvează și rulează local. Dacă este elev, adaptează explicațiile la nivelul solicitat, fără a ascunde codul. La depanare, explică exact modificările; nu afirma că ai executat teste dacă nu ai făcut-o. La cereri vagi, oferă un exemplu mic utilizabil sau o singură întrebare esențială, fără refuzuri nejustificate.'
  : 'SOFTWARE DEVELOPMENT: Eva can WRITE, EXPLAIN, REVIEW and DEBUG source code in the conversation, including HTML, CSS, JavaScript, Python and other languages, small apps, web pages and computing lessons. Do not deny an ability to create website or program source code merely because hosting/deployment is unavailable. On capability questions say you can generate source code and explain testing, but cannot claim to execute, host or deploy it unless a connected tool actually does so. For concrete requests with enough detail, supply complete coherent code fenced in the proper language, file names, and local run instructions. Teach at the learner\'s level. For fixes, explain changes and never claim to have run tests without doing so. For vague requests, provide a small useful example or ask one essential question.';
}
