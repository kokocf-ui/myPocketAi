// Literature at university is organised by actual *study year / cycle*, not
// school grades. Exact curricula are approved by each university and depend
// on degree, faculty, language, country and admission cohort. This is an
// original educational reference plan, never an official national syllabus.
export const LIT_UNIVERSITY_YEARS=Object.freeze([
 Object.freeze({id:'uni-ba-1',ro:'Licență · anul I',en:'Bachelor · Year 1',stage:'bachelor'}),
 Object.freeze({id:'uni-ba-2',ro:'Licență · anul II',en:'Bachelor · Year 2',stage:'bachelor'}),
 Object.freeze({id:'uni-ba-3',ro:'Licență · anul III',en:'Bachelor · Year 3',stage:'bachelor'}),
 Object.freeze({id:'uni-ba-4',ro:'Licență · anul IV (unde există)',en:'Bachelor · Year 4 (where offered)',stage:'bachelor'}),
 Object.freeze({id:'uni-ma-1',ro:'Master · anul I',en:'Master · Year 1',stage:'master'}),
 Object.freeze({id:'uni-ma-2',ro:'Master · anul II',en:'Master · Year 2',stage:'master'}),
 Object.freeze({id:'uni-doctoral',ro:'Doctorat · cercetare (fără an fix)',en:'Doctoral research (year depends on programme)',stage:'doctoral'})
]);
const UNIVERSITY_UNITS={
 'uni-ba-1':[
  ['introducere','Introducere în studiile literare','Deosebește interpretarea literară de rezumat și explică de ce citatul trebuie să provină din ediția consultată.','Analizează un fragment original folosind o observație textuală și o ipoteză de interpretare.','criticism'],
  ['teorie-genuri','Teoria genurilor și a speciilor','Distinge convențiile epicului, liricului și dramaticului și identifică zonele de întâlnire dintre ele.','Un text poetic poate include un mic episod narativ; explică în ce fel.','genres'],
  ['istoria-literaturii','Istoria literaturii: periodizare și surse','Explică deosebirea dintre data unei opere, epoca evocată și curentul cu care este asociată.','O narațiune istorică poate fi scrisă la sute de ani după evenimentele descrise.','periods'],
  ['naratologie','Elemente de naratologie','Studiază acțiunea, vocea, perspectiva, timpul relatării și construcția personajelor.','Cineva povestește după mulți ani ce a crezut despre un eveniment, iar amintirea rămâne nesigură.','narrative'],
  ['poetica','Elemente de poetică și versificație','Analizează ritmul, imaginea, structura versurilor și sensurile figurate fără a reduce interpretarea la o listă de figuri de stil.','Repetarea unui cuvânt la finalul a trei versuri poate schimba tonul poemului.','poetry'],
  ['text-si-discurs','Introducere în analiza discursului','Studiază felul în care vocabularul, structura frazei și contextul influențează efectul mesajului.','Aceeași afirmație sună diferit într-un jurnal și într-un discurs public.','grammar'],
  ['scriere-academica','Scriere academică: argument și referințe','Construiește o teză modestă și verificabilă, separă citatul de parafrază și notează ediția consultată.','Un eseu atribuie unei surse ideea pe care o rezumă, chiar dacă folosește alte cuvinte.','essay'],
  ['atelier','Seminar de lectură apropiată','Examinează un pasaj scurt cu întrebări despre vocabular, ritm, structură și alternative de interpretare.','Într-o replică, tăcerea dintre două răspunsuri poate avea un efect dramatic.','commentary']
 ],
 'uni-ba-2':[
  ['teoria-literara','Direcții ale teoriei literare','Compară lectura formală, istorică și orientată spre receptare; explică ce probe caută fiecare.','O critică formală urmărește construcția, iar o lectură istorică verifică împrejurările publicării.','criticism'],
  ['literatura-europeana','Literatura europeană în contexte','Analizează relațiile dintre tradiții, traduceri, forme și epoci fără a atribui o origine unică fiecărui motiv.','O imagine poetică circulă prin traduceri și își schimbă valoarea în contexte noi.','periods'],
  ['roman','Romanul: tehnici narative','Studiază timpul povestirii, focalizarea, naratorul nesigur și organizarea conflictului în construcții ample.','Un roman începe cu rezultatul unei acțiuni și reconstruiește apoi cauzele.','narrative'],
  ['teatru','Teoria textului dramatic','Examinează relația dintre dialog, indicație scenică, conflict, convenție și reprezentare teatrală.','Același dialog poate produce un efect opus dacă actorul schimbă intonația.','theatre'],
  ['comparatism','Introducere în literatura comparată','Alege criterii precise pentru a compara texte, teme sau forme provenite din tradiții diferite.','Două texte tratează exilul, dar unul îl prezintă ca ruptură, iar celălalt ca început.','commentary'],
  ['interpretare','Hermeneutică: interpretare și limite','Distinge o interpretare plauzibilă de o afirmație care nu este susținută de text; admite posibilitatea mai multor lecturi.','Un obiect repetat în poveste poate avea sens simbolic doar dacă contextul îl justifică.','criticism'],
  ['editii','Introducere în critica textuală','Explică diferențele dintre manuscris, ediție, traducere și notele editoriale; verifică proveniența citatelor.','Două ediții schimbă punctuația unei propoziții, dar nu toate schimbările sunt ale autorului.','research'],
  ['seminar','Seminar de analiză comparativă','Organizează un comentariu de analiză cu pasaje, argumente și concluzii care respectă limitele probelor.','O lucrare compară două finaluri narative folosind același criteriu.','essay'],
  ['prezentare','Prezentare orală și dezbatere','Structurează o comunicare științifică scurtă și răspunde critic la întrebări, fără citate inventate.','Studentul explică de ce două interpretări nu se exclud neapărat.','communication']
 ],
 'uni-ba-3':[
  ['modernitate','Literatura modernă și contemporană','Studiază schimbări de limbaj și convenție literară, raportate la date, contexte și ediții verificabile.','Un text întrerupe ordinea cronologică pentru a sugera memoria fragmentară.','periods'],
  ['studii-culturale','Literatură și studii culturale','Analizează cum identitatea, instituțiile și mediile culturale influențează producerea și receptarea textelor.','Același roman primește interpretări diferite în două epoci de publicare.','criticism'],
  ['teorie-critica','Școli și practici de critică','Compară criteriile de lectură ale unor abordări critice și precizează ce pot sau nu pot demonstra.','O lectură formală oferă alte întrebări decât una centrată pe istoria receptării.','criticism'],
  ['intertextualitate','Intertextualitate și rescriere','Cercetează relațiile demonstrabile dintre texte, traduceri și adaptări fără a deduce automat o influență.','Două opere folosesc aceeași poveste tradițională, dar dau finaluri diferite.','commentary'],
  ['traductologie','Traducerea literară și sensul','Analizează alegerile traducătorului privind registrul, ritmul, jocurile de cuvinte și diferența dintre ediții.','O metaforă păstrează imaginea într-o traducere și o schimbă în alta.','genres'],
  ['metodologie','Metodologia unei cercetări literare','Construiește întrebare de cercetare, corpus delimitat, metodă, ipoteză și bibliografie verificabilă.','O cercetare selectează cinci poeme pe baza unui criteriu declarat, nu la întâmplare.','research'],
  ['proiect-licenta','Proiectul lucrării de licență','Definește obiectivul, limitele și etapele unui proiect, apoi corelează fiecare afirmație cu sursa.','Plan: problemă, texte analizate, instrumente, capitole și bibliografie.','research'],
  ['etica','Etica redactării universitare','Recunoaște plagiatul, citarea greșită și referințele neverificate; lucrează transparent cu edițiile consultate.','O parafrază necesită trimitere la sursa ideii chiar dacă formularea este originală.','essay'],
  ['sustinere','Prezentarea rezultatelor','Prezintă concluzii proporționale cu dovezile și răspunde la obiecții fără a depăși ceea ce a fost verificat.','O concluzie spune ce arată analiza și ce rămâne de cercetat.','communication'],
  ['portofoliu','Portofoliu critic independent','Reunește analize revizuite, recenzii și reflecții asupra limitelor interpretării.','Fiecare fișă notează pagina, argumentul și observația personală.','essay']
 ],
 'uni-ba-4':[
  ['filologie','Studii filologice aprofundate','Aprofundează relația dintre variantele textului, limba epocii și deciziile de editare; disponibil numai unde există program de patru ani.','Două variante ale unei propoziții diferă printr-un termen arhaic.','research'],
  ['critica-editie','Editare critică și aparat de note','Explică principiile unei ediții critice: martori textuali, variante, note și justificarea intervențiilor editoriale.','O notă identifică versiunea în care apare un vers suplimentar.','research'],
  ['literatura-comparata','Seminar avansat de comparatism','Compară mișcări, teme și procedee printr-un corpus multilingv delimitat și documentat.','O imagine circulă dintr-o tradiție orală într-un roman modern.','commentary'],
  ['literatura-nationala','Seminar de literatură în limba aleasă','Studiază un corpus potrivit specializării și contextului național fără a impune o listă universală de opere.','Programa facultății selectează autorii; aplicația explică metoda de analiză.','periods'],
  ['text-digital','Introducere în analiza digitală de text','Examinează frecvențe, concordanțe și limitele instrumentelor digitale într-un corpus verificat.','Frecvența unui cuvânt nu demonstrează singură semnificația sa în operă.','research'],
  ['practica','Practică editorială sau de cercetare','Organizează fișe bibliografice, note de lectură și verificarea referințelor dintr-un proiect real.','Fișă: autor, titlu, ediție, pagini și observație textuală.','essay'],
  ['lucrare','Lucrare de absolvire și susținere','Construiește o argumentație coerentă și transparentă privind limitele corpusului și ale metodei.','Concluzia nu afirmă cauze istorice pe care analiza nu le poate dovedi.','research'],
  ['seminar','Seminar integrator de specializare','Aplică metoda aleasă asupra unui corpus convenit, redactează și revizuiește un comentariu academic.','Compară două pasaje cu criterii constante și argumente verificabile.','criticism']
 ],
 'uni-ma-1':[
  ['metode','Metode avansate de cercetare','Alege o metodologie potrivită întrebării și justifică legătura dintre concepte, corpus și date.','O ipoteză despre receptare necesită documente de recepție, nu doar textul operei.','research'],
  ['teoria','Dezbateri contemporane în teoria literară','Compară cadre teoretice și recunoaște presupunerile care influențează interpretarea.','Două teorii privesc diferit relația dintre autor, text și cititor.','criticism'],
  ['receptare','Istoria receptării și critica surselor','Studiază cum au fost citite și reinterpretate operele în timp folosind documente datate.','O cronică din anul apariției și o recenzie actuală pot pune întrebări diferite.','periods'],
  ['traducere','Seminar de traducere și adaptare','Analizează efectele transferului dintre limbi, registre și medii artistice cu referințe exacte.','O traducere păstrează aliterația, alta păstrează sensul literal.','genres'],
  ['comparatism','Studii comparate aprofundate','Aplică un cadru comparativ explicit la texte și contexte diferite, evitând analogiile facile.','Compară un motiv din două romane pe baza aceleiași grile.','commentary'],
  ['bibliografie','Bibliografie critică și arhive','Construiește o bibliografie selectivă, identifică edițiile și evaluează sursele primare și secundare.','Un manuscris și o analiză modernă au roluri diferite în cercetare.','research'],
  ['seminar-master','Seminar de proiect de master','Elaborează un proiect original cu întrebare, obiective, corpus, plan și calendar.','Explică de ce corpusul selectat poate răspunde întrebării propuse.','essay'],
  ['prezentare','Comunicare științifică','Prezintă rezultate, primește feedback și revizuiește interpretările în limita dovezilor.','Un rezultat negativ poate fi relevant dacă metoda și limitele sunt documentate.','communication']
 ],
 'uni-ma-2':[
  ['corpus','Construirea corpusului pentru disertație','Definește criterii transparente de selecție și înregistrează toate sursele utilizate.','Include doar texte pentru care poți verifica ediția, data și locul publicării.','research'],
  ['analiza','Analiză aprofundată și testarea ipotezelor','Corelează datele și pasajele interpretate cu întrebarea cercetării; discută explicații concurente.','Dacă un text contrazice ipoteza, îl discuți în loc să îl omiți.','criticism'],
  ['metode','Triangularea metodelor de lectură','Explică ce aduce compararea lecturii apropiate cu o analiză a contextului sau a receptării.','Un termen frecvent poate avea sensuri diferite în contexte literare distincte.','commentary'],
  ['studii','Studii de caz și critică de sursă','Construiește studii de caz documentate care pot fi reconstituite din citări și referințe.','Două recenzii sunt datate, contextualizate și comparate cu opera.','periods'],
  ['scriere','Redactarea disertației','Dezvoltă capitole argumentate, explică limitele cercetării și verifică aparatul critic.','Titlurile capitolelor urmăresc problema de cercetare, nu o listă de termeni.','essay'],
  ['revizuire','Revizie academică și integritate','Verifică erorile de citare, interpretările neargumentate și coerența concluziilor.','O afirmație puternică fără sursă trebuie susținută ori reformulată.','essay'],
  ['sustinere','Susținerea disertației','Pregătește o prezentare clară a întrebării, metodei, rezultatelor și limitelor.','Explică în două minute ce aduce cercetarea și ce nu demonstrează.','communication'],
  ['publicare','De la disertație la articol academic','Adaptează un capitol într-un argument concentrat și respectă regulile editoriale și de citare.','Un articol clar delimitează contribuția față de literatura critică existentă.','research']
 ],
 'uni-doctoral':[
  ['intrebare','Întrebarea doctorală și originalitatea','Formulează o contribuție posibil originală și delimitează ce a fost deja cercetat în domeniu.','O bibliografie sistematică arată care întrebări au rămas insuficient investigate.','research'],
  ['stadiul','Stadiul cercetării și revizuirea literaturii','Organizează critic literatura de specialitate și explică dezacordurile dintre interpretări.','Un studiu recent contrazice o ipoteză clasică; ambele trebuie analizate.','criticism'],
  ['corpus','Corpus, arhive și drepturi','Delimitează documentele și materialele consultate, proveniența și drepturile de utilizare.','O copie digitală și un manuscris autentic nu sunt aceeași sursă.','research'],
  ['metoda','Metode și reproductibilitate','Documentează etapele selecției, analizei și excluderii materialelor pentru a permite evaluarea critică.','Criteriile de selecție rămân explicite chiar când apar date neașteptate.','research'],
  ['publicare','Articol de cercetare și peer review','Transformă un rezultat într-un articol transparent privind metoda, dovezile și limitele.','Comentariile evaluatorilor duc la verificarea unei referințe și clarificarea unei afirmații.','essay'],
  ['seminar','Seminar doctoral și argument critic','Discută obiecțiile și interpretările rivale fără a transforma dialogul într-o colecție de opinii neverificate.','O critică metodologică necesită răspuns cu argumente verificabile.','communication'],
  ['teza','Structurarea și revizuirea tezei','Construiește legătura dintre ipoteză, capitole, analize și concluzie; verifică integritatea referințelor.','Fiecare capitol contribuie cu o întrebare sau rezultat necesar argumentului central.','research'],
  ['sustinere','Prezentarea și apărarea cercetării','Prezintă contribuția, limitele și direcțiile viitoare, respectând observațiile experților.','O întrebare dificilă poate primi răspunsul „nu este demonstrat încă”, cu justificare.','communication']
 ]
};
export function literatureUniversityPlan(year,language='ro'){
 const id=String(year||''),rows=UNIVERSITY_UNITS[id];
 if(!rows)return null;
 return {
  source:null,sourceTitle:'',verified:false,regions:false,university:true,
  note:language==='ro'?
   'Parcurs academic orientativ. Universitățile stabilesc separat programele, specializările și durata; anul IV de licență și masteratul nu sunt obligatorii peste tot. Nu se aplică programa de liceu.':
   'Illustrative higher-education pathway; degree syllabi and duration depend on the university and degree. A fourth bachelor year and a master’s cycle are not universally required.',
  units:rows.map(([slug,title,concept,example,topic],index)=>({
   id:'uni-lit-'+id+'-'+slug,topic,ro:title,en:title,focus:concept+' Exemplu de studiu: '+example,
   order:index+1
  }))
 };
}
export function literatureUniversityMaterial({topicKey='',grade='',title='',mode='lesson',language='ro'}={}){
 const key=String(topicKey),prefix='uni-lit-'+String(grade)+'-';
 if(!key.startsWith(prefix)||!['lesson','examples','exercises','test'].includes(mode)||language!=='ro')return null;
 const slug=key.slice(prefix.length);
 const row=(UNIVERSITY_UNITS[String(grade)]||[]).find(x=>x[0]===slug);
 if(!row)return null;
 const [,heading,idea,example,topic]=row;
 const keyConcept=topic==='research'?'Metoda se alege în funcție de problema și de sursele pe care le poți verifica.':
  topic==='narrative'?'Analiza urmărește felul în care organizarea textului influențează informația primită de cititor.':
  topic==='poetry'?'Forma și ritmul sunt relevante atunci când pot fi legate de sensul concret al fragmentului.':
  topic==='criticism'?'Interpretările sunt ipoteze argumentate, nu verdicte care înlocuiesc lectura textului.':
  'Contextul este util doar când legătura lui cu opera poate fi explicată și documentată.';
 const method='Pentru analiză: (1) delimitează pasajul ori corpusul; (2) formulează întrebarea; (3) descrie observațiile concrete; (4) discută interpretări alternative; (5) citează edițiile și explică limitele rezultatului.';
 const tasks=[
  'Formulează o întrebare de analiză specifică acestei teme și identifică materialul necesar.',
  'Aplică ideea lecției la exemplul prezentat, distingând faptele observabile de interpretări.',
  'Construiește un scurt argument cu două dovezi dintr-un fragment consultat.',
  'Arată o lectură alternativă și precizează ce informație suplimentară ar putea-o verifica.',
  'Notează sursele și limitele unui posibil eseu sau proiect pe această temă.'
 ];
 let output='';
 if(mode==='lesson')output='# '+String(title||heading)+'\n\n## Obiectul studiului\n'+idea+
  '\n\n## Principiul de analiză\n'+keyConcept+
  '\n\n## Studiu de caz explicat\n'+example+'\n'+
  'Observația trebuie formulată astfel încât să poată fi verificată în fragment. Discută dacă efectul identificat depinde de traducere, ediție ori context.\n\n'+
  '## Metodă de lucru\n'+method+
  '\n\n## Greșeli frecvente\nNu inventa fragmente, ediții, citate sau referințe. Nu transforma un exemplu original într-o afirmație despre un autor real.\n\n'+
  '## Întrebare de seminar\n'+tasks[0];
 else if(mode==='examples')output='# '+String(title||heading)+' · exemple\n\n'+
  '## Exemplul 1: problema\n'+example+'\n\n## Exemplul 2: aplicare\n'+idea+
  '\n\n## Exemplul 3: verificare critică\n'+keyConcept+'\n'+method;
 else output='# '+(mode==='test'?'Evaluare academică':'Exerciții de seminar')+
  ' · '+String(title||heading)+'\n\n'+
  tasks.map((x,i)=>(i+1)+'. '+x).join('\n\n')+
  '\n\nSe verifică argumentele, sursele identificabile și respectarea întrebării.';
 return {text:output,topic:key,origin:'authored_university_year'};
}
