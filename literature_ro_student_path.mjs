// Pupil-facing Romanian Language & Literature routes. An original learning
// sequence informed by OMEN 3418/2013, 5003/2014, 3393/2017 and the
// 2026–27 transition, not a claim that every title is a compulsory unit.
const THEMES={
 '1':[
 ['vorbesc','Vorbesc și ascult','Ascult o scurtă poveste sau instrucțiune, aștept rândul și răspund în propoziții simple. Exersăm cu o conversație despre școală.','communication'],
 ['citesc','Citesc cuvinte și propoziții','Citesc litere și silabe cunoscute, apoi propoziții scurte. Înțeleg cine face acțiunea și răspund la întrebări foarte simple.','genres'],
 ['povesti','Ascult povești și poezii','Descopăr personaje, întâmplări și rime din povești și poezii pentru copii. Povestesc ce mi-a plăcut, fără analiză literară avansată.','narrative'],
 ['scriu','Scriu câteva propoziții','Scriu lizibil, las spații între cuvinte și folosesc litera mare și punctul. Alcătuiesc două sau trei propoziții despre mine.','composition'],
 ['exersez','Jocuri cu litere și cuvinte','Recunosc sunete, completez silabe, citesc și potrivesc cuvinte. Exercițiile pornesc ușor și devin treptat mai interesante.','grammar']
 ],
 '2':[
 ['vorbesc','Povestesc și pun întrebări','Ascult atent, formulez întrebări și spun în ordine ce s-a întâmplat. Exersez dialoguri despre familie, prieteni și școală.','communication'],
 ['citesc','Citesc și înțeleg povești','Recunosc personajele, locul și succesiunea întâmplărilor dintr-un text potrivit clasei a II-a. Dau răspunsuri folosind textul.','genres'],
 ['povesti','Poezii, rime și întâmplări','Citesc poezii pentru copii și povești scurte, observ rima și pot spune ce simte sau dorește personajul principal.','narrative'],
 ['scriu','Scriu mesaje și povestiri scurte','Formulez o invitație, un bilet sau o întâmplare de câteva enunțuri. Verific majusculele, punctuația și ordinea ideilor.','composition'],
 ['exersez','Cuvinte noi și jocuri de scriere','Descopăr sensuri apropiate și opuse, completez enunțuri și repar greșeli simple din propoziții cunoscute.','grammar']
 ],
 '3':[
 ['vorbesc','Prezint o întâmplare','Povestesc clar o experiență, respect ordinea faptelor și formulez întrebări potrivite; compar două moduri de a spune aceeași idee.','communication'],
 ['citesc','Ideea principală dintr-un text','Citesc o povestire, identific personajele și evenimentele importante, apoi găsesc un titlu potrivit și răspund cu dovezi din text.','genres'],
 ['povesti','Povești, poezii și personaje','Observ în povestiri ce fac personajele, iar în poezii imagini și emoții; explic cu propriile cuvinte fără termeni de liceu.','narrative'],
 ['scriu','Descriu și compun un text','Scriu o descriere simplă sau o compunere cu început, cuprins și încheiere. Aleg cuvinte potrivite și verific ordinea ideilor.','composition'],
 ['exersez','Exersez gramatica în propoziții','Folosesc substantive, adjective și verbe în enunțuri reale, nu doar definiții de memorat. Corectez o propoziție și explic schimbarea.','grammar']
 ],
 '4':[
 ['vorbesc','Spun o opinie și o explic','Povestesc, ascult opiniile colegilor și susțin o idee cu un exemplu simplu. Exersez exprimarea clară într-o discuție.','communication'],
 ['citesc','Personaje, idei și rezumat','Citesc proză potrivită vârstei, urmăresc întâmplările, aleg ideile esențiale și redactez un rezumat scurt fără detalii inventate.','genres'],
 ['povesti','Poezii și texte pentru copii','Înțeleg versurile și mesajul unui poem pentru copii, descriu un personaj și compar două texte scurte folosind exemple.','narrative'],
 ['scriu','Compuneri și texte cu dialog','Scriu o compunere, o descriere ori un dialog cu început și final. Verific virgula, semnele de punctuație și legătura dintre enunțuri.','composition'],
 ['exersez','Recapitulez pentru clasa a V-a','Aplic într-un text citirea, vocabularul, pronumele, părțile de vorbire și redactarea; exercițiile sunt potrivite clasei a IV-a.','grammar']
 ],
 '5':[
 ['citire','Cum înțeleg un text nou','Găsesc informațiile importante, tema și ideile principale din texte literare sau informative și justific răspunsurile prin fragmente.','genres'],
 ['povestire','Basme, povești și personaje','Recunosc întâmplările, personajele, timpul și locul, deosebesc naratorul de autor și descriu un personaj pe baza faptelor sale.','narrative'],
 ['poezie','Versuri, ritm și imagini','Citesc poezii, observ strofa, versul, rima și expresiile care ajută imaginația; explic imaginile pornind de la text.','poetry'],
 ['scris','Rezumat și descriere','Scriu un rezumat clar, o descriere sau un mesaj potrivit unei situații. Exersez ordinea ideilor și corectitudinea propozițiilor.','composition'],
 ['exersare','Recapitulare: citire și gramatică','Rezolv exerciții de înțelegere, vocabular, forme ale cuvintelor și redactare de nivel clasa a V-a.','grammar']
 ],
 '6':[
 ['citire','Înțeleg și compar texte','Compar două texte și explic idei, perspective sau informații relevante, sprijinind interpretarea pe detalii identificabile.','genres'],
 ['literatura','Povestirea și perspectiva','Urmăresc un text narativ, diferențiez perspectiva naratorului de comportamentul personajelor și descriu conflictul principal.','narrative'],
 ['poezie','Limbajul expresiv în poezie','Identific imagini și figuri de stil accesibile clasei, apoi explic efectul lor în legătură cu tema și emoțiile textului.','poetry'],
 ['redactare','Povestesc, descriu și argumentez','Redactez un text coerent, introduc exemple și îmi justific simplu opinia. Corectez trecerile neclare și repetițiile.','composition'],
 ['exersare','Recapitulare: sens și gramatică','Aplic pronumele, numeralul, timpul verbului și funcțiile din propoziție în texte concrete, împreună cu înțelegerea lecturii.','grammar']
 ],
 '7':[
 ['citire','Citesc critic și compar idei','Deosebesc afirmația de opinie, susțin o interpretare prin dovezi și compar punctele de vedere din texte adecvate clasei a VII-a.','genres'],
 ['literatura','Povestire, personaje și conflict','Analizez evoluția unui personaj și influența naratorului, apoi explic o schimbare din acțiune cu exemple din text.','narrative'],
 ['poezie','Vocea lirică și imaginile poetice','Interpretez mesajul unei poezii, imaginile și expresivitatea în legătură cu emoțiile și perspectiva vocii lirice.','poetry'],
 ['redactare','Caracterizare și text argumentativ','Construiesc o caracterizare și susțin o opinie cu două argumente, exemple și o concluzie fără repetări.','composition'],
 ['exersare','Recapitulare: fraza și exprimarea','Aplic relațiile dintre propoziții, registrele de limbă și tehnicile de argumentare în enunțuri proprii.','grammar']
 ],
 '8':[
 ['citire','Cum rezolv cerințe pe text','Extrag informații, explic sensuri și justific interpretări dintr-un text la prima vedere, în stilul exercițiilor de gimnaziu.','genres'],
 ['literatura','Text narativ, liric și dramatic','Recunosc particularități ale povestirii, poeziei și dialogului dramatic și argumentez diferențele prin exemple.','authors'],
 ['interpretare','Compar două texte literare','Construiesc o comparație motivată, observ o idee comună și folosesc dovezi adecvate fiecărui text.','commentary'],
 ['redactare','Compunere și argumentare','Scriu un text descriptiv, narativ sau argumentativ, cu organizare clară, exemple și exprimare corectă.','composition'],
 ['examen','Pregătire pentru Evaluarea Națională','Exersez lectura la prima vedere, noțiuni de limbă și redactare, cu explicații progresive; nu confund exercițiile cu subiecte oficiale.','essay']
 ],
 '9':[
 ['lectura','Descopăr literatura la liceu','Citesc texte literare și nonliterare din perspectiva temelor, vocilor și contextelor. Aleg opere cu sursă verificabilă, fără listă fals obligatorie.','genres'],
 ['povestire','Povestirea și perspectiva naratorului','Analizez perspectiva, personajele și construcția conflictului; argumentez efectul unui detaliu narativ asupra sensului.','narrative'],
 ['poezie','Poezia: imagini și interpretare','Interpretez imagini poetice, simboluri și voce lirică, asociind observațiile cu pasaje concrete și nu cu definiții izolate.','poetry'],
 ['dramatic','Dialog și text dramatic','Recunosc relația dintre replici, personaj și conflict și susțin interpretarea unei scene prin indicații din text.','theatre'],
 ['limba','Limba folosită în contexte','Aleg registrul potrivit și construiesc mesaje orale și scrise, concentrându-mă pe sens, argument și corectitudine.','grammar'],
 ['eseu','Primele eseuri și interpretări','Redactez o interpretare unitară, cu teză, argumente și concluzie, despre un text studiat la clasa a IX-a.','essay'],
 ['recap','Recapitulare și lectură argumentată','Verific înțelegerea textului, elementele de limbaj și capacitatea de a formula o opinie argumentată în programa noii clase a IX-a.','criticism']
 ],
 '10':[
 ['lectura','Interpretarea operei literare','Analizez tema, structura și personajele unei opere, susținând ideile cu episoade exacte și evitând rezumatul ca substitut al interpretării.','genres'],
 ['epic','Nuvela și romanul: conflicte și perspective','Compar tehnici de narațiune, evoluția personajelor și forme de conflict în proză, pornind de la operele studiate efectiv.','narrative'],
 ['liric','Poezia: sens și expresivitate','Explic efectele imaginilor, figurilor și structurii textului poetic în relație cu mesajul și perspectiva lirică.','poetry'],
 ['teatru','Textul dramatic și dialogul','Interpretez o scenă, analizez conflictul și rolul replicilor, fără să confund elementele teatrale cu structura unui poem.','theatre'],
 ['context','Literatură și context cultural','Pun în legătură ideile operei cu epoca și mediul cultural când există informații verificabile și relevante pentru lectură.','periods'],
 ['eseu','Comentariu și argumentare literară','Redactez un comentariu susținut de dovezi și un eseu cu idei dezvoltate, evitând introducerile repetate.','essay'],
 ['recap','Recapitulare: texte și argumente','Compar două interpretări, aleg exemple potrivite și revizuiesc coerența și exprimarea unui text propriu.','criticism']
 ],
 '11':[
 ['epoci','Literatura și transformările ideilor','Studiez raportul dintre literatură și schimbările culturale, fără a impune aceeași listă de opere pentru toate manualele.','periods'],
 ['narativ','Romanul și tehnicile narative','Analizez perspectiva, construcția timpului, memoria și relațiile dintre personaje, cu observații susținute textual.','narrative'],
 ['poezie','Poezia modernă și simbolurile','Interpretez imagini, simboluri și organizarea discursului liric în raport cu stilul și contextul operei.','poetry'],
 ['compar','Compar literatură și perspective','Construiesc argumente prin compararea a două opere sau fragmente, precizând asemănări, diferențe și limitele comparației.','commentary'],
 ['limba','Discurs, limbaj și argumentare','Identific strategii de persuasiune și construiesc un discurs logic, adecvat interlocutorului și situației de comunicare.','grammar'],
 ['eseu','Eseul de analiză literară','Redactez un eseu matur, cu interpretare originală și exemple verificabile, fără umplere de pagini prin repetiții.','essay'],
 ['recap','Recapitulare și lectură critică','Verific cunoașterea operei, argumentarea și capacitatea de analiză în funcție de nivelul clasei a XI-a.','criticism']
 ],
 '12':[
 ['recap-lit','Recapitulez literatura studiată','Organizez operele efectiv studiate, disting curentele și ideile principale, apoi consolidez interpretările prin exemple din texte.','periods'],
 ['poezie','Poezia: analiză pentru Bacalaureat','Interpretez tema, imaginile și expresivitatea, susținând fiecare afirmație prin detalii exacte din poezia studiată.','poetry'],
 ['proza','Proza: personaje, narator și conflicte','Pregătesc o analiză a prozei bazată pe tema operei, construcția personajului și tehnicile narative cu dovezi relevante.','narrative'],
 ['dramatic','Textul dramatic: conflict și construcție','Analizez o operă dramatică după personaje, conflict, scene și replici, fără a o confunda cu un poem ori un text epic.','theatre'],
 ['eseu','Eseul de Bacalaureat: structură și argumente','Organizez introducerea, argumentele dezvoltate, exemplele și concluzia; verific relevanța și coerența pentru subiectul cerut.','essay'],
 ['subiecte','Subiecte de antrenament și barem explicat','Rezolv exerciții originale după tipurile de competențe evaluate, cu feedback detaliat, fără a pretinde că sunt subiecte oficiale.','criticism'],
 ['revizuire','Revizuiesc și corectez lucrările','Identific repetițiile, formulările vagi, greșelile de expresie și argumentele slabe înainte de salvarea PDF-ului.','composition']
 ]
};
export function romanianStudentGradeRows(grade,grammarLessons=[]){
 const key=String(grade),items=THEMES[key];
 if(!items)return [];
 const rows=items.map(([id,title,focus,area])=>['ro-elev-'+key+'-'+id,title,focus,area]);
 const grammar=(grammarLessons||[]).map(unit=>[unit.id,unit.ro,unit.intro,unit.id]);
 if(Number(key)<=4){rows.splice(2,0,...grammar)}
 else if(Number(key)<=8){rows.splice(2,0,...grammar)}
 return rows;
}
export const LIT_RO_STUDENT_GRADES=Object.freeze(Object.keys(THEMES));
