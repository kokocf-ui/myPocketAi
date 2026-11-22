// Original Romanian study progression, age-adjusted. None of these invented
// learning activities are represented as compulsory units from a ministry.
import {romanianStudentGradeRows} from './literature_ro_student_path.mjs';
import {LIT_RO_GRADE_LESSONS} from './literature_ro_grade_progression.mjs';

// [key, title, explanation, concrete example, short learner task].
// The supplementary syllabus is deliberately grade-specific, not a fixed
// ten-chapter template silently repeated in every year.
export const RO_YEAR_EXTRA={
 '1':[
 ['rime','Cuvinte care rimează','Două cuvinte rimează când se aud asemănător la sfârșit. Ne jucăm cu sunetele și le spunem cu voce tare.','soare — floare','Spune un cuvânt care rimează cu „casă”.']
 ],
 '2':[
 ['personaj','Cine apare în poveste?','Un personaj este cineva despre care se povestește. El poate fi un copil, un animal sau o ființă dintr-un basm.','Mia hrănește pisica. Mia este un personaj.','Spune cine apare în propoziție și ce face.'],
 ['bilet','Scriu un bilețel','Un bilețel transmite un mesaj scurt. Scriem pentru cine este, ce vrem să spunem și semnăm când este nevoie.','Dragă Ana, te aștept la joacă. — Radu','Scrie un bilețel de două propoziții pentru un prieten.']
 ],
 '3':[
 ['plan','Povestea în trei pași','O întâmplare are un început, o parte în care se petrece ceva și un final. Așezăm faptele în ordinea în care se întâmplă.','Mara pune o sămânță. O udă. Crește o floare.','Scrie cele trei întâmplări în ordine.'],
 ['descriu','Descriu un loc','Când descriem un loc spunem ce vedem, auzim sau simțim acolo. Alegem cuvinte care îl ajută pe cititor să și-l imagineze.','În parc sunt copaci înalți și o bancă verde.','Descrie curtea școlii în trei propoziții.'],
 ['antonime','Cuvinte cu sens opus','Unele cuvinte spun lucruri opuse. Le alegem după sensul propoziției.','mare — mic; rece — cald','Găsește opusul lui „vesel” și folosește-l într-un enunț.']
 ],
 '4':[
 ['rezumat','Povestesc pe scurt','Un rezumat spune doar ce este mai important într-o poveste. Nu adăugăm întâmplări pe care nu le-am citit.','Un copil găsește un cățel și îl duce acasă. Povestim cine, ce găsește și ce face.','Povestește întâmplarea în două sau trei propoziții.'],
 ['caracterizare','Cum este personajul?','Aflăm cum este un personaj din ceea ce face și spune. Nu este suficient să îl numim curajos: arătăm ce a făcut.','Radu împarte prânzul cu un coleg. Radu este generos.','Spune o trăsătură și fapta prin care o arată.'],
 ['dialog','Scriu un dialog','În dialog vorbesc două sau mai multe persoane. De obicei fiecare replică este scrisă pe un rând nou.','— Vii la bibliotecă?\n— Da, după ore.','Scrie patru replici între doi copii.'],
 ['opinie','Îmi spun părerea și explic','O opinie arată ce credem. Adăugăm un motiv simplu pentru ca ceilalți să ne înțeleagă.','Îmi place povestea fiindcă personajele se ajută.','Spune ce poveste îți place și de ce.']
 ],
 '5':[
 ['basm','Basmul: probe și ajutoare','În basm, personajul poate trece prin încercări neobișnuite. Urmărim cine îl ajută și ce se schimbă după fiecare probă.','Un copil primește o cheie fermecată, dar poate deschide numai o singură ușă.','Explică ce alegere ar face copilul și de ce.'],
 ['povestitor','Cine povestește?','Autorul scrie textul, iar naratorul este vocea care spune întâmplările. Uneori naratorul participă la acțiune, alteori o privește din afară.','„Am intrat în pădure.” — naratorul vorbește despre sine.','Transformă enunțul la persoana a III-a.'],
 ['descriere','Descrierea unui loc','O descriere folosește detalii despre culoare, formă, sunet sau mișcare. În povestire, ea poate pregăti atmosfera înaintea unei întâmplări.','Drumul îngust trece printre mesteceni, iar frunzele foșnesc.','Alege trei detalii din descriere.'],
 ['mesaj','Mesajul textului și rezumatul','Mesajul este ideea transmisă cititorului; rezumatul păstrează întâmplările esențiale. Nu le confundăm.','Cei doi copii repară împreună bicicleta. Mesaj posibil: colaborarea ajută.','Scrie un rezumat de trei enunțuri și o idee-mesaj.']
 ],
 '6':[
 ['fabula','Fabula și morala','Fabula este o povestire scurtă, adesea cu animale care vorbesc, din care se desprinde o învățătură. Morala trebuie sprijinită de faptele relatate.','Vulpea laudă oglinda, dar refuză să privească în ea.','Propune o morală și explică printr-un detaliu.'],
 ['narator','Punctul de vedere al naratorului','Aceeași întâmplare poate suna diferit dacă este povestită de un participant sau de un observator. Perspectiva schimbă ce află cititorul.','„Nu știam de ce a plecat.” / „Ana nu știa de ce plecase.”','Compară ce știm în cele două enunțuri.'],
 ['poezie','Imaginea poetică și comparația','Poetul poate folosi o comparație pentru a face imaginea mai vie. Explicăm ce două lucruri sunt apropiate și ce efect are expresia.','Lacul strălucește ca o oglindă.','Identifică termenii comparației și explică asemănarea.'],
 ['text-informativ','Text literar și informativ','Textul informativ urmărește în primul rând transmiterea unor fapte; cel literar poate construi o experiență artistică. Recunoaștem scopul și limbajul.','„Albina polenizează plantele.” / „Albina dansează printre flori.”','Explică de ce enunțurile au scopuri diferite.'],
 ['scrisoare','Scrisoarea și mesajul personal','O scrisoare are destinatar, formulă de adresare, mesaj și încheiere. Organizăm ideile clar, fără cuvinte nepotrivite situației.','Dragă bunico, ieri am vizitat muzeul. Cu drag, Luca.','Scrie o scrisoare scurtă despre o vizită.']
 ],
 '7':[
 ['perspectiva','Personajul văzut din două perspective','Un personaj poate părea curajos unui prieten și imprudent altuia. Analizăm afirmațiile prin fapte, nu prin judecăți fără exemple.','Dana intră în apă să ajute un câine, deși este curent puternic.','Prezintă două opinii argumentate despre gestul ei.'],
 ['liric','Vocea din poezie','Vocea care exprimă sentimente în poezie nu trebuie confundată automat cu biografia poetului. Observăm pronumele, imaginile și tonul.','„Mi-e dor de glasul serii.”','Explică sentimentul sugerat de expresie.'],
 ['dialog','Dialogul și conflictul','Replicile pot arăta o neînțelegere, o dorință ascunsă sau schimbarea relației. Pentru interpretare avem nevoie de întregul schimb.','— Ai promis că vii.\n— Am încercat, dar trenul a întârziat.','Spune ce aflăm din fiecare replică.'],
 ['argument','Argumentul și dovada din text','O interpretare este credibilă când include o afirmație, un pasaj relevant și explicația legăturii dintre ele.','Personajul revine să-și ajute prietenul: această faptă poate arăta loialitate.','Susține o trăsătură printr-un exemplu precis.'],
 ['nuvela','Nuvela și construcția întâmplării','Nuvela are, de obicei, o acțiune concentrată și un conflict dezvoltat. Urmărim cauzele și urmările deciziilor.','O scrisoare găsită întâmplător schimbă relațiile dintre trei oameni.','Construiește un plan cu situație, conflict și rezultat.'],
 ['limbaj','Sens literal și sens figurat','Sensul literal este cel obișnuit; sensul figurat transferă un cuvânt spre altă idee pentru efect expresiv.','„Mâna copilului” / „o mână de ajutor”.','Explică de ce sensurile sunt diferite.']
 ],
 '8':[
 ['argumentare','Afirmație, exemplu și explicație','Pentru o interpretare solidă formulăm o afirmație, alegem un detaliu din fragment și explicăm de ce îl susține.','Personajul își recunoaște greșeala, ceea ce dovedește asumarea responsabilității.','Scrie un argument în trei propoziții.'],
 ['text-dramatic','Scenă, replică și indicație scenică','În teatru, replicile arată ce spun personajele, iar indicațiile scenice pot arăta gesturi și decorul. Analizăm ambele.','(Se oprește în prag.) — Nu mă așteptam să te găsesc aici.','Spune ce aduce indicația scenică.'],
 ['comparație','Două fragmente, o temă','Comparăm textele fără a presupune că exprimă exact aceeași idee. Alegem un punct comun și o diferență dovedită.','Într-un text ploaia e liniștitoare, în altul îi sperie pe eroi.','Formulează o asemănare și o diferență.'],
 ['tipuri-text','Narațiune, descriere și explicație','Un text poate povesti, descrie sau explica; identificăm caracteristicile fiecărui tip și situațiile în care sunt folosite.','„A pornit la drum” povestește; „drumul era pietros” descrie.','Transformă un enunț narativ într-o descriere.'],
 ['examen-citire','Citire la prima vedere','Citirea la prima vedere cere atenție la detalii, cuvinte în context și cerințe. Răspunsul se bazează pe fragment, nu pe presupuneri.','Fragment: Mara a întors cartea la bibliotecă luni, după ore.','Spune când și unde a dus cartea.'],
 ['examen-scris','Redactare pentru Evaluarea Națională','Un text bine scris respectă cerința, are un plan, legături între idei și un final clar. Verificăm acordurile și punctuația.','Plan: început — întâmplare — rezolvare — concluzie.','Schitează planul unei compuneri cu o întâmplare.'],
 ['corectare','Cum îmi revizuiesc lucrarea','La revizuire verific sensul, claritatea, ortografia, semnele de punctuație și respectarea numărului de cuvinte, dacă a fost cerut.','„Eu vroiam” poate fi corectat la „Eu voiam”.','Corectează o propoziție și explică alegerea.']
 ],
 '9':[
 ['genuri','Genurile literare: diferențe și legături','Epicul, liricul și dramaticul pun în centru moduri diferite de construcție a textului, dar pot împrumuta procedee unul altuia.','Un roman poate conține o descriere poetică, iar teatrul poate integra povestirea unui personaj.','Compară rolul naratorului și al replicii într-un fragment.'],
 ['naratiune','Structura narațiunii și tensiunea','Conflictul pune în mișcare acțiunea; ordinea scenelor și alegerea naratorului controlează informația primită de cititor.','Cititorul știe despre scrisoare înainte ca personajul să o găsească.','Explică ce efect are această diferență de informație.'],
 ['poezie-context','Imaginea poetică și contextul','Interpretăm o imagine poetică în context, nu doar prin identificarea unei figuri de stil.','„Orașul tace” poate sugera liniște, teamă sau așteptare.','Formulează două interpretări posibile și justifică diferența.'],
 ['teatru','Conflictul și subtextul dramatic','Uneori replica spune un lucru, iar situația sugerează altul. Analizăm gesturile și contextul pentru a evita o lectură literală greșită.','— Ești punctual, spune ea după o oră de așteptare.','Explică sensul posibil al replicii.'],
 ['varietati','Limba în contexte și registre','Alegerea registrului depinde de destinatar, situație și scop. O formulare potrivită unei conversații poate fi neadecvată într-o scrisoare oficială.','„Salut!” și „Stimată doamnă” au destinatari și contexte diferite.','Rescrie un mesaj familiar într-un stil formal.'],
 ['argument','Teza și susținerea ei','Într-un eseu formulăm o idee centrală clară, apoi o dezvoltăm cu argumente și exemple exacte, nu cu generalități.','Teză: un personaj crește când își recunoaște greșeala.','Propune două argumente diferite pentru teză.'],
 ['evaluare','Portofoliu de lectură','Un portofoliu documentează lecturile reale, observațiile și revizuirile; nu înlocuiește analiza cu liste fictive de opere.','Fișă: autor, titlu, fragment, idee interpretată, întrebare deschisă.','Construiește o fișă pentru o lectură cunoscută.']
 ],
 '10':[
 ['nuvela','Nuvela: conflict, concentrare, construcție','Analizăm densitatea evenimentelor, relația personajelor cu conflictul și modul în care finalul reinterpretează începutul.','Un secret descoperit târziu schimbă sensul unui dialog vechi.','Explică rolul revelației într-o povestire.'],
 ['roman','Romanul: timpul și perspectivele','Romanul poate alterna perspective, planuri temporale și voci narative. Nu confundăm cronologia întâmplărilor cu ordinea povestirii.','Capitolul începe cu finalul unei întâmplări și revine apoi la cauze.','Refă ordinea cronologică a celor trei scene.'],
 ['poezie','Limbajul poetic și ambiguitatea','Un simbol poate avea mai multe valori, însă interpretarea trebuie sprijinită de contextul poeziei și nu de asociații arbitrare.','O ușă închisă poate sugera o limită, o alegere sau o pierdere.','Alege o interpretare și justific-o prin două indicii.'],
 ['dramaturgie','Replica și tensiunea dramatică','Ritmul replicilor, pauzele și gesturile pot intensifica un conflict. Observăm diferența între ce spune personajul și ce evită să spună.','(După o pauză.) — Nu am găsit scrisoarea.','Explică efectul pauzei asupra dialogului.'],
 ['epoca','Opera și contextul istoric','Legăm un text de epoca lui numai prin informații verificate și pertinente. Contextul ajută interpretarea, dar nu o înlocuiește.','O scrisoare din roman poate reflecta convenții sociale ale timpului povestit.','Caută o sursă verificabilă și notează ce explică.'],
 ['comentariu','Comentariul literar argumentat','Un comentariu dezvoltă idei despre structură, teme și limbaj, cu exemple exacte; rezumatul este doar punctul de plecare.','O scenă repetată capătă alt sens după schimbarea perspectivei.','Scrie un paragraf explicativ cu dovadă și concluzie.'],
 ['compar','Comparație între două genuri','Comparăm aceeași problemă umană în proză, poezie sau teatru, observând procedeele proprii fiecărui gen.','Așteptarea poate fi narată prin întâmplări sau exprimată prin imagini poetice.','Explică o asemănare și două diferențe.'],
 ['revizie','Revizuirea unui eseu','Rescriem pentru precizie, coerență și proporția argumentelor. Nu mărim artificial lungimea prin repetiții.','Înlocuiește „este foarte interesant” cu o observație exactă despre text.','Rescrie trei enunțuri vagi dintr-un paragraf.']
 ],
 '11':[
 ['curente','Curente literare și criterii de identificare','Un curent literar este descris prin trăsături estetice și istorice; o operă nu aparține automat unei categorii după o singură imagine.','Tema naturii poate apărea în texte romantice, dar nu este un criteriu suficient.','Compară două trăsături și sursele care le susțin.'],
 ['modernitate','Modernism: schimbarea expresiei','Modernismul explorează adesea forme noi de expresie, perspective fragmentate și relația limbajului cu experiența.','Un poem poate rupe tiparul ritmic pentru a reda neliniștea.','Explică legătura dintre formă și sens într-un fragment.'],
 ['realism','Realismul și reprezentarea socială','Proza realistă urmărește detalii sociale și cauze verosimile, dar nu este o fotografie neutră a lumii.','Descrierea unei piețe poate sugera diferențe între personaje.','Arată ce detaliu reflectă relațiile sociale.'],
 ['simbolism','Simboluri și sugestie','În unele texte, repetiția, muzicalitatea și simbolurile exprimă stări fără a le numi direct. Analizăm relația cu întregul poem.','Repetarea unei culori poate organiza atmosfera.','Explică efectul unei repetiții într-un text.'],
 ['perspective','Narațiune și memorie','Într-un roman al memoriei, timpul trăit și timpul povestirii pot fi diferite. Verificăm ce poate ști fiecare voce.','Naratorul își amintește un gest diferit de cum îl descrie alt personaj.','Explică ce nu poate fi stabilit sigur.'],
 ['intertext','Dialogul dintre texte','Intertextualitatea apare când un text trimite la altul prin motiv, imagine, formulare sau structură. Asemănarea trebuie arătată concret.','Două poeme folosesc imaginea ferestrei, dar în contexte opuse.','Arată o trimitere posibilă fără a o declara certă.'],
 ['critica','Argumente ale criticii literare','Citirea criticii înseamnă examinarea afirmației, a dovezilor și a limitelor interpretării, nu acceptarea unei opinii doar pentru că este publicată.','Două cronici justifică diferit evoluția personajului.','Compară dovezile folosite de critici.'],
 ['eseu','Eseu comparativ bine documentat','Eseul comparativ stabilește criterii comune, citează doar surse reale și formulează concluzii proporționale cu dovezile.','Criterii: perspectiva, tema, tehnicile narative.','Propune un plan cu două criterii comparabile.'],
 ['citate','Citare și integritate academică','Parafraza este reformularea fidelă cu atribuirea sursei; citatul redă exact un pasaj. Evităm inventarea paginilor și a operelor.','„Autorul consideră...” necesită identificarea sursei consultate.','Corectează o afirmație care nu indică sursa.']
 ],
 '12':[
 ['bac-interpretare','Analiza unui text la prima vedere','Separăm observația directă de interpretare și începem răspunsul de la cerința exactă, nu de la un comentariu memorat.','Fragmentul conține două voci opuse; justificăm acest lucru prin replici.','Formulează o idee și dovada corespunzătoare.'],
 ['bac-liric','Comentariu pe text liric','Analizăm tema, vocea, imaginile și construcția poemului, folosind citate exacte doar din textul consultat.','O imagine repetată poate lega prima și ultima strofă.','Construiște planul unei analize de poezie.'],
 ['bac-epic','Comentariu pe text epic','Observăm conflictul, naratorul, structura și relațiile dintre personaje; nu transformăm eseul într-un rezumat al întâmplărilor.','Un gest mic din final schimbă interpretarea personajului.','Explică efectul unui detaliu narativ.'],
 ['bac-dramatic','Analiză de text dramatic','Studiem conflictul, succesiunea scenelor, replicile și indicațiile scenice; argumentele trebuie susținute de opera aleasă.','Pauza dintre replici poate indica ezitare sau opoziție.','Explică sensul unei indicații scenice.'],
 ['epoci','Literatura și istoria ideilor','Organizăm interpretările după concepte, curente și contexte documentate, fără a confunda epoca autorului cu epoca acțiunii.','Un roman poate descrie o epocă diferită de aceea în care a fost scris.','Explică diferența între cele două timpuri.'],
 ['eseu','Structura eseului la examen','Un eseu răspunde cerinței, prezintă o teză, argumente și exemple relevante. Lungimea nu înlocuiește calitatea ideilor.','Plan: introducere, două argumente dezvoltate, concluzie.','Revizuiește un plan de eseu pentru două cerințe.'],
 ['subiect','Barem și punctaj explicat','Un barem indică punctele evaluate. La antrenament distingem criteriile generale de baremul oficial pentru un subiect publicat.','Criteriu: menționarea temei, susținerea cu două exemple, corectitudine.','Fă o listă de verificare înainte de predare.'],
 ['revizuire','Greșeli frecvente și autocorectare','Verificăm relația dintre afirmație și dovadă, delimitarea paragrafelor, ortografia și cerințele de redactare.','„Personajul este complex” nu este un argument fără exemple.','Rescrie un argument vag folosind o faptă concretă.'],
 ['surse','Portofoliu și bibliografie','Notează operele studiate efectiv, edițiile și paginile verificate; bibliografia nu include titluri neverificate ori citate inventate.','Fișă: titlu, autor, ediție, pasaj, ideea susținută.','Creează o fișă bibliografică pentru o operă consultată.'],
 ['sinteza','Sinteză finală pe opere și teme','Organizăm ceea ce am citit după teme și procedee, nu după un șablon repetat mecanic. Sinteza compară și diferențiază.','Tema libertății poate fi tratată diferit într-un poem și într-un roman.','Construiește un tabel cu două opere și două criterii.']
 ]
};
export const ROMANIAN_EXPANDED_COUNTS=Object.freeze(
 Object.fromEntries(Object.entries(RO_YEAR_EXTRA).map(([grade,add])=>[
  grade,romanianStudentGradeRows(grade,LIT_RO_GRADE_LESSONS[grade]||[]).length+add.length]))
);
export function romanianExpandedRows(grade,baseRows=null){
 const key=String(grade);
 if(!RO_YEAR_EXTRA[key])return null;
 const original=Array.isArray(baseRows)?baseRows.map(row=>row.slice()):romanianStudentGradeRows(key,LIT_RO_GRADE_LESSONS[key]||[]);
 const extra=RO_YEAR_EXTRA[key].map(([slug,title,teaching,example,task])=>[
  'ro-deep-'+key+'-'+slug,title,teaching+' Exemplu: '+example+' Cerință: '+task,'grade-specific'
 ]);
 return [...original,...extra];
}
// Child-facing theory never includes research terminology, editorial boilerplate,
// fake author citations, ministry notices or "inference", "hermeneutics" etc.
export const RO_CHILD_SAFE={
 '1-vorbesc':['Ascult și vorbesc pe rând. Când un coleg spune ceva, îl las să termine. Apoi îi răspund frumos.','— Bună, Ana!\n— Bună, Mara!\n— Vrei să ne jucăm?\n— Da!','Spune ce a întrebat Mara.'],
 '1-citesc':['Citim litere, apoi cuvinte. Când le unim, putem citi o propoziție. Citim încet și încercăm din nou.','Ana are mere.','Câte cuvinte sunt?'],
 '1-povesti':['O poveste ne spune ce se întâmplă cu cineva. Ascultăm, ne uităm la imagini și povestim ce am înțeles.','Mara vede un pui de pisică. Îi aduce apă. Pisica bea.','Cine a adus apă?'],
 '1-scriu':['Scriem cuvintele unul după altul, cu spații între ele. Începem propoziția cu literă mare și punem punct la sfârșit.','Eu am o carte.','Scrie o propoziție despre jucăria ta.'],
 '1-exersez':['Ne jucăm cu sunete și litere. Unim silabe ca să formăm cuvinte, apoi le citim cu voce tare.','ma + ma = mama','Unește „ca” și „să”.'],
 '2-vorbesc':['Când povestim, spunem ce s-a întâmplat mai întâi, apoi ce a urmat. Putem pune întrebări și asculta răspunsurile.','Am mers la parc. Am văzut un cățel. I-am adus apă.','Ce s-a întâmplat mai întâi?'],
 '2-citesc':['Într-o poveste aflăm cine apare și ce face. Citim atent și căutăm răspunsul în propoziții.','Luca merge cu sora lui la bibliotecă. Aleg două cărți.','Unde merge Luca?'],
 '2-povesti':['În poezie ne putem bucura de sunetele cuvintelor. Unele versuri au cuvinte care rimează.','Pe o floare stă un soare de hârtie.','Spune două cuvinte care rimează.'],
 '2-scriu':['Un mesaj poate avea două sau trei propoziții. Spunem clar ce vrem, în ordinea potrivită.','Bună, Sara! Ne vedem la joacă la ora patru.','Scrie un mesaj pentru un prieten.'],
 '2-exersez':['Cuvintele pot avea sens apropiat sau opus. Încercăm să le folosim în propoziții.','mare — mic; vesel — bucuros','Găsește opusul cuvântului „cald”.'],
 '3-vorbesc':['Povestim întâmplările în ordine, fără să sărim peste lucrul important. Spunem unde am fost, ce s-a petrecut și cum s-a terminat.','Am vizitat grădina. Am udat florile. M-am întors acasă.','Povestește o zi de școală în trei pași.'],
 '3-citesc':['În fiecare text sunt lucruri importante și amănunte. Căutăm cine apare, ce face și unde se petrece povestea.','Daria a plantat un pom lângă casă, miercuri după-amiază.','Cine a plantat pomul?'],
 '3-povesti':['Când citim, observăm ce face personajul și ce simte. În poezie ne imaginăm locurile descrise prin cuvinte.','Băiatul își ajută prietena să găsească ghiozdanul.','Ce faptă bună face personajul?'],
 '3-scriu':['Un text scurt are un început, apoi întâmplările și la final o încheiere. Așezăm ideile astfel încât cititorul să ne înțeleagă.','Am găsit un balon. L-am dus în parc. Acolo l-am dăruit unui copil.','Scrie o întâmplare cu trei părți.'],
 '3-exersez':['Unele cuvinte spun cine sau ce este ceva, altele cum este sau ce face. Le recunoaștem în propoziții scurte.','Pisica albă doarme. „Pisica” numește, „albă” descrie, „doarme” arată ce face.','Găsește cuvântul care arată ce face pisica.'],
 '4-vorbesc':['Ne putem spune părerea despre un lucru și adăuga un motiv. Ascultăm și părerile celorlalți.','Îmi place acest personaj fiindcă își ajută prietenii.','Spune ce personaj îți place și de ce.'],
 '4-citesc':['Citim povestea, alegem întâmplările importante și le spunem pe scurt. Nu adăugăm lucruri care nu apar în text.','O fetiță găsește un portofel și îl duce la poliție.','Spune fapta importantă într-o propoziție.'],
 '4-povesti':['În povești putem cunoaște personaje diferite. În poezii, cuvintele ne pot face să vedem imagini frumoase în minte.','Vântul adună frunzele galbene la poarta școlii.','Ce vezi în minte când citești propoziția?'],
 '4-scriu':['O compunere are început, mijloc și încheiere. Putem adăuga replici între personaje și avem grijă la punctuație.','— Unde este cartea?\n— Pe birou!','Scrie patru replici și adaugă semnele potrivite.'],
 '4-exersez':['Punem în practică ce știm despre cuvinte, propoziții și texte. Dacă greșim, citim încă o dată și corectăm.','„Copiii vesel joacă.” devine „Copiii veseli se joacă.”','Explică ce s-a schimbat.']
};
export function romanianExpandedMaterial({topicKey='',title='',focus='',grade='',language='ro',mode='lesson'}={}){
 const match=String(topicKey).match(/^ro-(deep|elev)-(\d{1,2})-([a-z0-9-]+)/);
 if(!match||!['lesson','examples','exercises','test'].includes(mode))return null;
 const [,kind,year,slug]=match;
 if(String(grade)!==year)return null;
 const isChild=Number(year)<=4;
 const row=kind==='deep'?RO_YEAR_EXTRA[year]?.find(x=>x[0]===slug):null;
 const safe=kind==='elev'&&isChild?RO_CHILD_SAFE[year+'-'+slug]:null;
 const concept=row?.[2]||safe?.[0]||String(focus||'');
 const example=row?.[3]||safe?.[1]||
  'Într-o dimineață, personajul se oprește în fața ușii deschise, apoi își schimbă hotărârea.';
 const task=row?.[4]||safe?.[2]||
  'Explică ideea lecției printr-un detaliu concret din text.';
 const ro=language==='ro';
 if(!['ro','en'].includes(language))return null;
 if(!ro){
  // For international interface settings the existing AI translation route
  // adapts the lesson; never label untranslated Romanian text as English.
  return null;
 }
 const heading=String(title||row?.[1]||'Lecție');
 const short=isChild;
 const extra=short?
  ['Citește cu atenție exemplul. Găsește răspunsul în cuvintele citite.',
   'Dacă nu îți iese din prima, mai citește o dată și încearcă din nou.']:
  ['Pentru a înțelege un text, pornește de la detaliile exacte ale fragmentului și separă constatarea de interpretarea proprie.',
   'Înainte de a formula concluzia, verifică dacă dovada susține afirmația. O altă perspectivă poate fi acceptabilă când are argumente.'];
 const questions=short?
  [task,'Spune cu cuvintele tale ce ai înțeles.','Alcătuiește o propoziție nouă pe aceeași temă.']:
  [task,'Formulează o interpretare proprie și susține-o cu două argumente distincte.',
   'Compară un caz diferit: ce s-ar schimba și de ce?',
   'Revizuiește un răspuns vag printr-un exemplu exact.'];
 const prefix=short?'# Hai să învățăm: ':'# ';
 let text='';
 if(mode==='lesson')text=prefix+heading+
  '\n\n## Ce învățăm\n'+concept+
  '\n\n## Exemplu\n'+example+
  '\n\n## Cum procedăm\n'+extra[0]+
  '\n\n## Încerc și eu\n'+questions[0]+
  '\n\n## Ce am înțeles\n'+extra[1];
 else if(mode==='examples')text='# Exemple: '+heading+
  '\n\n## Exemplul 1\n'+example+
  '\n\n## Exemplul 2 — explicat\n'+concept+
  '\n\n## Exemplul 3 — aplicat\n'+extra[0];
 else text=(mode==='test'?'# Mic test: ':'# Exerciții: ')+heading+
  '\n\n## Citește\n'+example+'\n\n'+questions.map((q,i)=>(i+1)+'. '+q).join('\n\n')+
  '\n\nVerifică răspunsurile cu ajutorul exemplelor și al lecției.';
 return {text,topic:topicKey,origin:'authored_ro_year_specific'};
}
