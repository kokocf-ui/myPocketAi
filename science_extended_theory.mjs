// Offline-first, subject- and chapter-specific reading context for the four Sciences.
// Does not manufacture numerical inputs or replace an unsupported solver.
export const SCIENCE_GUIDES={
  "chemistry": {
    "atomic": [
      "Atomul are un nucleu cu protoni și neutroni, înconjurat de electroni descriși prin stări cuantice. Numărul protonilor Z stabilește elementul, iar numărul de masă A este suma protonilor și neutronilor. Pentru atomul neutru, numărul electronilor este Z.",
      "Un atom neutru de sodiu (Z=11) are 11 electroni; dacă pierde un electron, ionul Na⁺ păstrează 11 protoni, dar are 10 electroni. Izotopii au același Z și numere diferite de neutroni.",
      "Nu confunda numărul de masă cu masa atomică medie din tabel. Modelul cu electroni pe orbite circulare este doar o analogie didactică, nu o descriere cuantică exactă.",
      "Ce se schimbă când atomul devine ion și ce rămâne neschimbat?"
    ],
    "periodic": [
      "Tabelul periodic ordonează elementele după Z și evidențiază repetarea proprietăților asociate configurației electronice. Grupele sunt coloane; perioadele sunt rânduri. Elementele din aceeași grupă pot avea proprietăți asemănătoare, dar nu identice.",
      "Sodiul și potasiul sunt metale alcaline; ambele tind să formeze ioni cu sarcina +1. Clorul și bromul sunt halogeni; în combinații ionice obișnuite pot forma ioni −1.",
      "Tendințele periodice, precum raza atomică sau electronegativitatea, au excepții. Nu deduce proprietăți exacte din simpla vecinătate în tabel.",
      "De ce Na și K se află în aceeași grupă, dar în perioade diferite?"
    ],
    "bonding": [
      "Legăturile chimice implică redistribuirea sau participarea electronilor de valență și determină structura multor substanțe. Modelele ionice, covalente și metalice explică tipuri diferite de organizare. Polaritatea depinde, între altele, de diferența de electronegativitate și de geometria moleculei.",
      "În H₂, cei doi atomi de hidrogen participă la o pereche comună de electroni: H—H. În H₂O legăturile O—H sunt polare, iar geometria unghiulară face ca molecula să fie polară.",
      "Nu orice compus este alcătuit din molecule independente: NaCl formează o rețea ionică. O legătură covalentă nu înseamnă că electronii sunt întotdeauna împărțiți egal.",
      "Care este diferența dintre o legătură polară și polaritatea întregii molecule?"
    ],
    "reactions": [
      "O ecuație chimică exprimă transformarea reactanților în produși și trebuie să conserve numărul atomilor fiecărui element și sarcina totală. Coeficienții se modifică pentru echilibrare; indicii chimici din formule nu se schimbă arbitrar.",
      "Pentru reacția H₂ cu O₂, ecuația echilibrată este 2H₂ + O₂ → 2H₂O. În fiecare parte sunt 4 atomi de hidrogen și 2 de oxigen. Coeficienții sunt cei mai mici întregi pozitivi posibili.",
      "Ecuația echilibrată nu garantează că reacția are loc rapid ori în orice condiții. Nu inventa temperaturi, catalizatori sau rezultate experimentale.",
      "De ce 2H₂ + O₂ → H₂O nu este echilibrată?"
    ],
    "inorganic": [
      "Chimia anorganică studiază elemente, săruri, oxizi, acizi, baze și multe alte clase de compuși. Formula, starea de oxidare și tipul legăturilor ajută la clasificare, dar proprietățile trebuie analizate în context.",
      "NaCl este un compus ionic alcătuit din ioni Na⁺ și Cl⁻ în rețea cristalină. CO₂ este un oxid covalent; în apă participă la echilibre care pot conduce la formarea acidului carbonic.",
      "Nu presupune că orice oxid este acid sau bazic. Solubilitatea și reactivitatea depind de compus și de condiții.",
      "Cum deosebești o sare de un oxid pornind de la formulă și compoziție?"
    ],
    "solutions": [
      "O soluție este un amestec omogen. Solventul dizolvă solutul, iar concentrația exprimă cantitatea de solut raportată la soluție sau la solvent, după definiția folosită. Concentrația molară este c=n/V, unde V este volumul soluției în litri.",
      "Dacă 0,50 mol substanță sunt dizolvați până la un volum final de 2,0 L, c=0,25 mol/L. La diluție, dacă solutul nu se pierde, se poate folosi c₁V₁=c₂V₂.",
      "Nu confunda volumul solventului cu volumul soluției. Procentul masic, molaritatea și molalitatea sunt mărimi distincte.",
      "Ce informații trebuie cunoscute pentru calculul molarității?"
    ],
    "acids": [
      "Acizii și bazele pot fi descrise prin transferul protonilor (Brønsted–Lowry). În apă, aciditatea se corelează cu activitatea ionilor H₃O⁺ și se exprimă prin pH. La echilibru, raporturile dintre specii depind de constante și de condițiile soluției.",
      "În modelul ideal al unei soluții apoase diluate, pH≈−log₁₀[H₃O⁺]. Pentru [H₃O⁺]=10⁻³ mol/L rezultă aproximativ pH=3. Neutralizarea HCl cu NaOH produce NaCl și apă în condiții obișnuite.",
      "pH-ul nu se interpretează fără concentrație, temperatură și, la nevoie, activități chimice. Acizii slabi nu sunt neapărat diluați.",
      "Ce diferență este între acid tare și acid concentrat?"
    ],
    "organic": [
      "Chimia organică studiază compușii carbonului și relația dintre structură, funcții și reactivitate. Legăturile C—C și C—H permit lanțuri, cicluri și izomerie; grupele funcționale influențează proprietățile.",
      "Etanolul CH₃CH₂OH și dimetileterul CH₃OCH₃ au aceeași formulă moleculară C₂H₆O, dar conectivitate diferită și proprietăți distincte.",
      "Nu toate substanțele care conțin carbon sunt încadrate practic la chimie organică. O formulă moleculară nu indică singură structura.",
      "De ce izomerii cu aceeași formulă pot avea temperaturi de fierbere diferite?"
    ],
    "physical": [
      "Termochimia examinează schimburile de energie, iar cinetica studiază vitezele reacțiilor și mecanismele. Entalpia de reacție și energia de activare au semnificații diferite: prima descrie un bilanț energetic, a doua bariera de reacție.",
      "O reacție exotermă are ΔH<0 în condițiile de referință folosite. Un catalizator poate accelera atingerea echilibrului fără să schimbe poziția acestuia pentru aceeași temperatură.",
      "O reacție exotermă nu este automat rapidă. Semnul lui ΔH singur nu stabilește spontaneitatea; intervine și entropia, prin energia liberă Gibbs.",
      "Ce diferență există între viteza reacției și favorabilitatea ei termodinamică?"
    ],
    "electrochem": [
      "Oxidarea înseamnă cedare de electroni sau creșterea numărului de oxidare; reducerea înseamnă acceptare de electroni ori scăderea lui. În celulele galvanice, reacțiile redox pot furniza energie electrică.",
      "În reacția Zn + Cu²⁺ → Zn²⁺ + Cu, zincul se oxidează, iar ionul Cu²⁺ se reduce. Numărul de electroni cedați este egal cu numărul celor primiți.",
      "Nu confunda anodul cu polul pozitiv în orice tip de celulă; semnul depinde dacă sistemul este galvanic sau electrolitic. Sarcina trebuie conservată.",
      "Care specie este agentul reducător în exemplul cu zinc și Cu²⁺?"
    ],
    "analytical": [
      "Chimia analitică urmărește identificarea și cuantificarea speciilor din probe. Orice rezultat are o limită de detecție, incertitudine și dependență de metoda de prelevare și calibrare.",
      "Într-o titrare acid–bază, concentrația necunoscută poate fi calculată din stoichiometrie și volume măsurate, dacă reacția este cunoscută și punctul final e detectat corect.",
      "Precizia nu înseamnă automat acuratețe. Un rezultat fără unitate, condiții și incertitudine poate fi înșelător.",
      "Ce diferență este între repetabilitate și apropierea de valoarea de referință?"
    ],
    "biochemistry": [
      "Biochimia explică moleculele și reacțiile din organisme; chimia mediului urmărește transformarea substanțelor în apă, aer și sol; știința materialelor corelează structură și proprietăți.",
      "Enzimele accelerează reacții biochimice, fără să modifice poziția echilibrului. Un polimer își poate schimba rigiditatea când se modifică structura sau temperatura.",
      "Nu aplica mecanic modele de laborator unui organism sau ecosistem complex. Condițiile și unitățile trebuie precizate.",
      "De ce o enzimă modifică viteza reacției, dar nu echilibrul termodinamic?"
    ],
    "advanced": [
      "La nivel universitar, structura electronică, termodinamica, spectroscopia și cinetica se folosesc împreună. Modelul ales trebuie corelat cu scara fenomenului și cu aproximațiile matematice asumate.",
      "O predicție de energie moleculară poate depinde de metodă, bază de funcții și tratarea solventului. Rezultatul se interpretează comparativ cu observații sau referințe adecvate.",
      "Un calcul numeric nu este dovadă experimentală. Precizia afișată nu substituie evaluarea erorilor și limitărilor modelului.",
      "Ce verificare externă ai face înainte de a accepta o predicție de structură?"
    ]
  },
  "physics": {
    "units": [
      "Fizica leagă mărimile observabile de modele matematice și unități. Sistemul Internațional folosește șapte unități de bază, între care metrul, kilogramul și secunda. O măsurare include o valoare, unitate și incertitudine.",
      "Pentru un corp cu masa 200 g și volumul 50 cm³, densitatea este 4 g/cm³. Conversia în SI dă 4 000 kg/m³. Este necesară convertirea coerentă a tuturor mărimilor.",
      "O valoare fără unitate este incompletă, iar precizia instrumentului nu justifică oricâte cifre zecimale. Măsurările au incertitudini.",
      "Care sunt unitățile SI pentru masă, lungime, timp și densitate?"
    ],
    "kinematics": [
      "Cinematica descrie mișcarea fără a studia cauzele. Poziția, deplasarea, viteza și accelerația sunt definite în raport cu un sistem de referință. Viteza medie vectorială este deplasarea împărțită la intervalul de timp.",
      "Un mobil se deplasează rectiliniu 12 m în 3 s: modulul vitezei medii este 4 m/s, dacă mișcarea este în aceeași direcție. În mișcare uniform accelerată, v=v₀+at.",
      "Distanța parcursă nu este întotdeauna aceeași cu modulul deplasării. Accelerația nu înseamnă doar creșterea vitezei: poate schimba direcția.",
      "Ce diferență există între distanță și deplasare?"
    ],
    "dynamics": [
      "Dinamica explică modificarea mișcării prin interacțiuni și forțe. Într-un sistem inerțial, suma vectorială a forțelor este egală cu produsul dintre masă și accelerație: ΣF=ma.",
      "Pentru un corp de 2 kg asupra căruia acționează o forță rezultantă de 6 N, accelerația este 3 m/s², dacă masa este constantă.",
      "Forțele de acțiune și reacțiune acționează asupra corpurilor diferite, nu se anulează pe același corp. Trebuie desenată diagrama forțelor.",
      "Ce accelerație produce o rezultantă nulă într-un sistem inerțial?"
    ],
    "energy": [
      "Lucrul mecanic transferă energie prin acțiunea unei forțe pe o deplasare, iar puterea descrie ritmul transferului energetic. Pentru o forță constantă, W=F·d·cosθ; puterea medie este P=W/Δt.",
      "Ridicarea lentă a unei mase de 2 kg pe 1 m necesită aproximativ 19,6 J împotriva gravitației, folosind g≈9,8 m/s² și neglijând pierderile.",
      "Energia nu este același lucru cu puterea. Conservarea energiei se aplică unui sistem ales corect, ținând cont de transferuri și disipare.",
      "Ce diferență există între joule și watt?"
    ],
    "fluids": [
      "Presiunea este forța normală pe unitatea de suprafață: p=F/A. Într-un fluid în repaus, presiunea hidrostatică crește cu adâncimea, aproximativ cu Δp=ρgh pentru densitate constantă.",
      "În apă, la o adâncime de 2 m, creșterea presiunii față de suprafață este aproximativ 19 600 Pa dacă ρ≈1 000 kg/m³ și g≈9,8 m/s².",
      "Legea lui Bernoulli presupune un model de curgere specific. Nu orice schimbare de secțiune implică aceeași interpretare a presiunii.",
      "De ce presiunea hidrostatică crește cu adâncimea?"
    ],
    "heat": [
      "Temperatura indică starea termică; căldura reprezintă energie transferată între sisteme din cauza diferenței de temperatură. Pentru variații fără schimbare de fază, în condiții adecvate, Q=mcΔT.",
      "Pentru 1 kg de apă, cu c≈4 180 J/(kg·K), o creștere de 2 K necesită aproximativ 8 360 J, dacă neglijăm pierderile.",
      "Temperatura nu este cantitate de căldură. În timpul schimbării de stare poate exista transfer de energie fără variație de temperatură.",
      "Ce reprezintă capacitatea calorică masică?"
    ],
    "electric": [
      "Curentul electric este rata de trecere a sarcinii, I=ΔQ/Δt. Tensiunea descrie diferența de potențial, iar rezistența caracterizează raportul U/I în condițiile în care legea lui Ohm se aplică.",
      "Pentru o rezistență ohmică de 10 Ω la 5 V, intensitatea este I=U/R=0,5 A. Puterea disipată este P=UI=2,5 W.",
      "Nu toate componentele sunt ohmice; la diode, de pildă, raportul U/I nu este constant. Respectă polaritatea și limitele de siguranță.",
      "Ce unități au tensiunea, intensitatea și rezistența?"
    ],
    "waves": [
      "O oscilație este o variație repetată în timp. Undele transportă energie și informație; frecvența f și perioada T sunt legate prin f=1/T. Pentru o undă periodică, v=λf.",
      "La o frecvență de 50 Hz, perioada este T=0,02 s. Dacă lungimea de undă este 2 m, viteza de propagare corespunzătoare este 100 m/s.",
      "Viteza de propagare nu este viteza de oscilație a particulelor mediului. Undele mecanice au nevoie de mediu, cele electromagnetice nu.",
      "Cum se modifică perioada când frecvența se dublează?"
    ],
    "optics": [
      "Lumina poate fi modelată prin raze pentru reflexie și refracție și prin unde pentru interferență și difracție. Legea reflexiei afirmă egalitatea unghiurilor față de normală.",
      "La o oglindă plană, dacă raza incidentă formează 30° cu normala, raza reflectată formează tot 30° cu normala. Pentru refracție, legea lui Snell este n₁sinθ₁=n₂sinθ₂.",
      "Nu măsura unghiurile față de suprafață când formula cere unghiuri față de normală. Modelul geometric are limite la dimensiuni comparabile cu lungimea de undă.",
      "Care este diferența între reflexie și refracție?"
    ],
    "electromagnetism": [
      "Un curent electric generează câmp magnetic, iar un câmp magnetic variabil poate induce un câmp electric. Fenomenele sunt legate prin ecuațiile lui Maxwell.",
      "Într-o bobină, modificarea fluxului magnetic induce o tensiune conform legii Faraday. Sensul acesteia se opune variației fluxului în interpretarea lui Lenz.",
      "Un magnet static ținut lângă o bobină staționară nu produce continuu tensiune indusă doar prin prezența sa.",
      "Ce trebuie să varieze pentru inducția electromagnetică într-o bobină?"
    ],
    "thermodynamics": [
      "Termodinamica analizează transferurile de căldură și lucru și modificările energiei interne. Pentru un sistem închis se aplică bilanțul energetic cu semne definite consecvent.",
      "Pentru gazul ideal, pV=nRT. Dacă temperatura absolută se dublează la volum și cantitate de gaz constante, presiunea se dublează în modelul ideal.",
      "Legea gazului ideal este o aproximație, nu un adevăr universal. Temperatura din ecuație trebuie exprimată în kelvini.",
      "De ce nu putem folosi direct grade Celsius în pV=nRT?"
    ],
    "circuits": [
      "În circuitele de curent alternativ, tensiunea și curentul variază periodic. Rezistența, inductanța și capacitanța influențează amplitudinile și fazele; impedanța generalizează rezistența.",
      "Pentru o tensiune sinusoidală cu valoare maximă de 325 V, valoarea eficace este aproximativ 230 V. Această relație este valabilă pentru sinusoidă ideală.",
      "Nu confunda tensiunea maximă cu cea eficace. Circuitul de rețea este periculos: exemplele sunt exclusiv teoretice.",
      "Ce înseamnă valoare eficace pentru o tensiune sinusoidală?"
    ],
    "modern": [
      "Fizica modernă tratează procese unde modelele clasice devin insuficiente: cuantificarea energiei, structura atomului, radioactivitatea și relativitatea.",
      "Un foton de lumină cu frecvența f are energia E=hf; energia crește odată cu frecvența. Dezintegrarea radioactivă are caracter statistic, exprimat prin timpul de înjumătățire.",
      "Timpul de înjumătățire nu este durata de viață exactă a fiecărui nucleu. Nu confunda energia fotonului cu intensitatea unui fascicul.",
      "Ce proprietate a luminii explică relația E=hf?"
    ],
    "measurement": [
      "Metoda experimentală presupune întrebare clară, model, observabile, instrumente, repetări și interpretarea incertitudinii. Graficele și unitățile sunt parte a argumentului fizic.",
      "Dacă se măsoară de mai multe ori același interval de timp, media poate estima valoarea centrală, dar trebuie investigată și dispersia măsurărilor.",
      "Repetabilitatea nu elimină o eroare sistematică de calibrare. O potrivire pe grafic nu demonstrează singură o relație cauzală.",
      "Cum ai depista o eroare sistematică într-o serie de măsurători?"
    ]
  },
  "biology": {
    "cells": [
      "Celula este unitatea structurală și funcțională de bază a vieții. Membrana plasmatică delimitează compartimente, iar în celulele eucariote organitele susțin funcții specializate. Structurile nu lucrează izolat.",
      "Într-o celulă vegetală există, de obicei, perete celular, cloroplaste și o vacuolă centrală dezvoltată; o celulă animală nu are cloroplaste.",
      "Nu presupune că fiecare celulă are nucleu; procariotele nu au nucleu delimitat de membrană, iar unele celule specializate pierd nucleul.",
      "Ce deosebește o celulă procariotă de una eucariotă?"
    ],
    "biomolecules": [
      "Proteinele, lipidele, glucidele și acizii nucleici îndeplinesc roluri structurale, energetice și informaționale. Enzimele sunt catalizatori biologici, iar metabolismul cuprinde reacții de sinteză și degradare.",
      "În respirația celulară aerobă, oxidarea nutrienților este cuplată cu formarea ATP; energia nu apare din nimic, ci este transformată și transferată.",
      "Nu confunda ATP cu o rezervă energetică de lungă durată și nu presupune că toate organismele folosesc aceleași căi metabolice.",
      "Ce rol are o enzimă în viteza unei reacții?"
    ],
    "anatomy": [
      "Anatomia descrie structura, fiziologia funcția. Organismele pluricelulare au niveluri de organizare: celulă, țesut, organ, sistem. Funcția unui organ depinde de interacțiunea dintre mai multe țesuturi.",
      "Plămânii asigură schimbul gazelor între aer și sânge; circulația transportă oxigen către țesuturi. Cele două sisteme sunt interdependente.",
      "O analogie mecanică simplă nu descrie toate mecanismele biologice. Exemplul didactic nu trebuie tratat ca sfat medical.",
      "De ce sistemele respirator și circulator trebuie studiate împreună?"
    ],
    "genetics": [
      "Informația ereditară este stocată în secvențe de ADN. Genele pot contribui la fenotip prin exprimare și interacțiuni cu mediul. Mejoza produce variație genetică prin segregare și recombinare.",
      "Într-un model mendelian monohibrid cu dominanță completă, încrucișarea Aa × Aa oferă, în medie, genotipuri în raport 1 AA : 2 Aa : 1 aa.",
      "Raporturile simple sunt modele probabilistice și nu explică toate trăsăturile; există dominanță incompletă, codominanță și ereditate poligenică.",
      "Ce reprezintă alela și cum diferă de o genă?"
    ],
    "evolution": [
      "Evoluția descrie schimbarea caracteristicilor ereditare ale populațiilor între generații. Selecția naturală, deriva genetică, mutațiile și fluxul genetic pot modifica frecvențele alelelor.",
      "Dacă un mediu favorizează indivizii cu o trăsătură ereditară, frecvența acelei trăsături poate crește în timp, în funcție de reproducere și ceilalți factori.",
      "Indivizii nu evoluează genetic de-a lungul vieții pentru a satisface o nevoie. Evoluția nu are un scop prestabilit.",
      "De ce este importantă variabilitatea ereditară pentru selecția naturală?"
    ],
    "ecology": [
      "Ecologia investighează relațiile dintre organisme și mediu. Energia intră în multe ecosisteme prin fotosinteză și trece prin rețele trofice, în timp ce substanțele circulă în cicluri biogeochimice.",
      "O populație de ierbivore poate fi influențată atât de resursele vegetale, cât și de prădători și boli. Nu este suficientă o singură cauză pentru predicție.",
      "O rețea trofică este mai complexă decât un lanț liniar. Nu extrapola de la un experiment local la toate ecosistemele.",
      "Care este diferența dintre fluxul energiei și circuitul materiei într-un ecosistem?"
    ],
    "microbes": [
      "Microorganismele includ bacterii, arhee și eucariote microscopice; virusurile necesită gazde pentru replicare. Grupurile diferă profund prin structură și metabolism.",
      "Bacteriile se multiplică adesea prin diviziune binară; un virus folosește mecanisme celulare ale gazdei pentru a produce componente noi.",
      "Antibioticele acționează asupra unor structuri și procese bacteriene, nu asupra virusurilor în același mod. Nu generaliza patogenitatea la toate microbii.",
      "Prin ce diferă o bacterie de un virus în privința reproducerii?"
    ],
    "plants": [
      "Plantele transformă energia luminoasă prin fotosinteză și schimbă apă și gaze cu mediul. Rădăcina, tulpina, frunza și organele reproductive au funcții corelate.",
      "În frunze, stomatele reglează schimbul de gaze și pierderea apei. Xilemul conduce în principal apă și minerale, iar floemul transportă substanțe organice.",
      "Fotosinteza nu înlocuiește respirația celulară; plantele realizează ambele procese. Nu toate plantele au aceeași anatomie.",
      "Care este diferența funcțională dintre xilem și floem?"
    ],
    "homeostasis": [
      "Homeostazia reprezintă menținerea variabilelor interne într-un interval compatibil cu funcționarea organismului, prin mecanisme de reglare și feedback.",
      "Reglarea temperaturii corporale implică receptori, centre de integrare și răspunsuri precum modificarea fluxului sanguin cutanat și transpirația.",
      "Un feedback negativ tinde să reducă abaterea; aceasta nu înseamnă că valoarea rămâne absolut constantă. Nu transforma exemplele în diagnostic.",
      "Ce diferență există între feedback negativ și pozitiv?"
    ],
    "methods": [
      "Biologia folosește observații, experimente controlate, microscopie, secvențiere și analiză statistică. Interpretarea datelor depinde de calitatea eșantionării și de variabilele de confuzie.",
      "Pentru a studia efectul luminii asupra creșterii unei plante, grupurile trebuie să difere prin lumină, dar să păstreze cât mai constante apa, solul și temperatura.",
      "Corelația nu implică automat cauzalitate. Un rezultat izolat fără replicare poate fi instabil.",
      "Ce este o variabilă de control și de ce contează?"
    ]
  },
  "astronomy": {
    "solar": [
      "Sistemul solar conține Soarele, opt planete, sateliți, planete pitice și numeroase corpuri mici. Gravitația guvernează mișcările orbitale, iar lumina solară este sursa dominantă de energie pentru planete.",
      "Pământul se rotește în jurul axei în aproximativ o zi și se deplasează pe orbită în jurul Soarelui într-un an. Fazele Lunii depind de geometria Soare–Pământ–Lună.",
      "Anotimpurile sunt cauzate în principal de înclinarea axei terestre, nu de variația distanței până la Soare.",
      "De ce vedem faze diferite ale Lunii în decursul unei luni?"
    ],
    "sky": [
      "Pozițiile obiectelor cerești se descriu prin coordonate locale (altitudine, azimut) sau ecuatoriale (ascensie dreaptă, declinație). Mișcarea aparentă zilnică este dominată de rotația Pământului.",
      "O stea apropiată de polul ceresc pare să descrie un cerc mic pe cer; altitudinea polului ceresc se corelează cu latitudinea observatorului.",
      "Nu confunda mișcarea aparentă cu o orbită reală a stelei în jurul Pământului. Coordonatele locale depind de oră și poziție.",
      "Ce coordonate se schimbă odată cu ora pentru același observator?"
    ],
    "distances": [
      "Astronomia folosește unități adaptate scării: kilometru, unitate astronomică (UA), an-lumină și parsec. Anul-lumină este o distanță, nu o durată.",
      "Lumina parcurge în vid aproximativ 300 000 km într-o secundă. O stea aflată la 4 ani-lumină este observată aproximativ cum era cu 4 ani înainte.",
      "Distanele astronomice au incertitudini; nu confunda strălucirea aparentă cu luminozitatea intrinsecă.",
      "De ce o imagine a unei galaxii îndepărtate este o imagine a trecutului?"
    ],
    "gravity": [
      "Gravitația determină accelerarea corpurilor și mișcarea pe orbite. În aproximarea newtoniană, forța este F=Gm₁m₂/r². Orbitele depind de condițiile inițiale și de distribuția masei.",
      "Pentru o orbită circulară idealizată, viteza orbitală este aproximativ v=√(GM/r), unde M este masa corpului central și r raza orbitală.",
      "O orbită stabilă nu este o mișcare fără accelerație; direcția vitezei se modifică continuu. Formula circulară nu descrie toate orbitele.",
      "Ce rol are forța gravitațională în mișcarea circulară orbitală?"
    ],
    "stars": [
      "Stelele produc energie în principal prin reacții nucleare în interior și evoluează în funcție de masa inițială și compoziție. Temperatura de suprafață influențează culoarea observată.",
      "Soarele se află pe secvența principală și transformă hidrogen în heliu în nucleu. O stea mai masivă poate avea o durată de viață mai scurtă datorită consumului energetic mai rapid.",
      "Nu toate stelele devin găuri negre; evoluția finală depinde de masă și de pierderile de material.",
      "De ce masa stelei este importantă pentru evoluția ei?"
    ],
    "galaxies": [
      "Galaxiile sunt sisteme de stele, gaz, praf și materie întunecată, legate gravitațional. Se studiază prin fotometrie, spectroscopie și dinamica stelelor.",
      "Calea Lactee este o galaxie spirală barată. În regiunile bogate în gaz rece pot apărea zone active de formare stelară.",
      "Forma unei galaxii din imagine nu spune singură întreaga sa istorie; proiecția și lungimea de undă influențează aspectul.",
      "Ce informație oferă spectrul luminii unei galaxii?"
    ],
    "observations": [
      "Telescopul colectează radiație și crește puterea de rezolvare în limita opticii și a atmosferei. Instrumentele pot observa lumină vizibilă, radio, infraroșu și alte domenii.",
      "Un telescop spațial evită o parte a efectelor atmosferei, dar rezoluția și sensibilitatea depind în continuare de diametrul instrumentului, detector și lungimea de undă.",
      "Mărirea nu garantează detalii mai bune; rezoluția unghiulară și raportul semnal–zgomot sunt esențiale.",
      "De ce se folosesc mai multe lungimi de undă pentru același obiect ceresc?"
    ],
    "cosmology": [
      "Cosmologia studiază structura și evoluția Universului. Expansiunea spațiului, radiația cosmică de fond și abundența elementelor ușoare susțin modelul cosmologic standard.",
      "Deplasarea spre roșu a liniilor spectrale ale galaxiilor îndepărtate este folosită pentru a studia expansiunea; interpretarea include modelul cosmologic.",
      "Expansiunea nu presupune că există un centru obișnuit în spațiul tridimensional observabil. Estimările parametrilor au incertitudini.",
      "Ce observații independente susțin expansiunea cosmologică?"
    ],
    "exoplanets": [
      "Exoplanetele sunt planete care orbitează alte stele. Metodele de tranzit și de viteză radială identifică proprietăți diferite; combinarea lor poate estima masa și raza.",
      "Dacă o planetă traversează discul unei stele, luminozitatea observată scade periodic. Pentru un tranzit central idealizat, fracția de lumină blocată este aproximativ (Rₚ/R★)².",
      "O scădere de luminozitate nu demonstrează singură existența unei planete; este necesară excluderea altor explicații.",
      "Ce informații ne oferă fiecare dintre metodele tranzitului și vitezei radiale?"
    ]
  }
};
export const SCIENCE_FEATURED={
  "chem-new-040": "# Definiție și mecanism\nLegătura covalentă apare când atomii participă la una sau mai multe perechi comune de electroni. Modelul cu perechi comune ajută la înțelegerea multor molecule, dar descrierea avansată folosește orbitalii moleculari și distribuția densității electronice.\n\n# Formarea unei legături simple\nÎn molecula de hidrogen, H₂, fiecare atom contribuie cu câte un electron. Perechea comună este reprezentată prin H—H. Această notație este o formulă structurală; linia reprezintă o legătură, nu traseul fizic al electronilor.\n\n# Legături multiple\nDoi atomi pot participa la mai multe perechi de electroni. În O₂ legătura este reprezentată în modelul Lewis simplificat ca O=O, iar în N₂ ca N≡N. Numărul legăturilor este legat de structură și de configurația electronică.\n\n# Polaritate\nDacă atomii atrag diferit electronii, distribuția lor poate fi inegală. Legătura O—H este polară. Totuși, polaritatea întregii molecule depinde și de geometrie: CO₂ este liniară, iar dipolii legăturilor se compensează; H₂O este unghiulară și polară.\n\n# Exemplu explicat\nPentru CH₄, carbonul formează patru legături simple cu hidrogenul; geometria idealizată este tetraedrică. Aceasta explică de ce desenarea celor patru legături într-un plan nu descrie complet forma moleculei.\n\n# Confuzie frecventă\nLegătura covalentă nu înseamnă întotdeauna împărțirea egală a electronilor. Nici toate solidele covalente nu sunt molecule separate: diamantul este o rețea covalentă extinsă.\n\n# Verifică-te\n1. Ce reprezintă linia din H—H?\n2. De ce apa este polară, dar CO₂ nu are moment dipolar permanent în starea sa liniară?\nRăspunsuri: o legătură covalentă; în apă geometria unghiulară nu permite compensarea dipolilor, pe când în CO₂ aceștia se compensează.",
  "physics-units-0": "# Definiție\nO mărime fizică exprimă o proprietate care poate fi cuantificată printr-un număr și o unitate. Exemple sunt lungimea, masa, timpul, temperatura și intensitatea curentului electric.\n\n# Sistemul Internațional\nUnitățile de bază SI includ metrul (m), kilogramul (kg), secunda (s), amperul (A), kelvinul (K), molul (mol) și candela (cd). Alte unități se construiesc din acestea; de exemplu, viteza are unitatea m/s.\n\n# Măsurare și instrument\nUn instrument oferă o indicație în condiții concrete. Un rezultat complet trebuie să precizeze unitatea, iar când este necesar și incertitudinea. Un riglă gradată în milimetri nu justifică raportarea automată a multor zecimale.\n\n# Exemplu lucrat\nO distanță de 2,5 km se transformă în 2 500 m. Dacă este parcursă în 500 s, viteza medie scalară este 2 500/500 = 5 m/s, adică 18 km/h. Verificăm conversia prin înmulțirea cu 3,6.\n\n# Greșeli frecvente\nNu aduna direct valori cu unități incompatibile. 2 m + 30 cm devine 2 m + 0,30 m = 2,30 m, nu 32 m.\n\n# Verifică-te\nCe unitate are accelerația în SI și de ce? Răspuns: m/s², deoarece reprezintă variația vitezei pe unitatea de timp.",
  "bio-core-cells-1": "# Introducere\nTeoria celulară afirmă că organismele vii sunt alcătuite din celule, că celula este unitatea de bază a organizării vieții și că celulele apar din celule preexistente.\n\n# Tipuri de celule\nProcariotele nu au nucleu delimitat de membrană. Eucariotele au, de regulă, nucleu și organite membranare. O celulă animală și una vegetală au multe structuri comune, dar cea vegetală poate conține perete celular, cloroplaste și vacuolă centrală mare.\n\n# Structură și funcție\nMembrana plasmatică controlează schimburile cu mediul. Ribozomii sintetizează proteine. Mitocondriile participă la transformările energetice, iar nucleul conține majoritatea ADN-ului în celulele eucariote nucleate.\n\n# Exemplu\nO celulă a frunzei poate conține cloroplaste care absorb lumina pentru fotosinteză, dar realizează și respirație celulară. Prezența cloroplastelor nu elimină necesitatea altor procese metabolice.\n\n# De reținut\nNu fiecare celulă are toate organitele tipice; unele celule sunt specializate. Modelul desenat este schematic, nu o fotografie la scară.\n\n# Verifică-te\nCe structură delimitează toate celulele? Răspuns: membrana plasmatică.",
  "astro-solar-1": "# Soarele\nSoarele este steaua centrală a Sistemului solar și conține cea mai mare parte a masei sistemului. Energia sa provine în principal din fuziunea nucleară a hidrogenului în heliu, în nucleu.\n\n# Structura\nStraturile importante sunt nucleul, zona radiativă, zona convectivă și atmosfera solară, cu fotosferă, cromosferă și coroană. Lumina vizibilă percepută provine în principal din fotosferă.\n\n# Energia și lumina\nLumina solară ajunge la Pământ în aproximativ opt minute. Energia absorbită și reemisă contribuie la climă, fotosinteză și procesele atmosferice.\n\n# Exemplu explicat\nDistanța medie Pământ–Soare este aproximativ o unitate astronomică, adică aproape 150 de milioane km. La o viteză a luminii de circa 300 000 km/s, timpul aproximativ este 150 000 000/300 000 = 500 s, adică 8 minute și 20 s.\n\n# Limite\nSoarele nu este un corp solid și nu arde prin combustie chimică. Observarea directă fără filtre solare specializate este periculoasă pentru vedere.\n\n# Verifică-te\nDe ce primim lumina Soarelui cu întârziere? Răspuns: deoarece lumina are viteză finită și traversează distanța până la Pământ."
};
export const SCIENCE_METHOD={
  "chemistry": "Mai întâi stabilește speciile chimice și condițiile cunoscute. Compară compoziția, legăturile și stările, apoi verifică conservarea atomilor și sarcinii unde există reacții. O formulă este utilă numai dacă variabilele, unitățile și ipotezele au sens.",
  "physics": "Identifică sistemul fizic, mărimile cunoscute și unitățile. Alege modelul adecvat și justifică ipotezele; după calcul, controlează dimensiunile și ordinul de mărime. Un model simplificat nu înlocuiește observația.",
  "biology": "Localizează structura sau procesul în organism, apoi explică relația dintre structură și funcție. Deosebește mecanismele demonstrate de analogii și ține cont de variabilitatea biologică. Un exemplu școlar nu este o recomandare clinică.",
  "astronomy": "Distinge între ceea ce se observă și modelul folosit pentru interpretare. Precizează scara, unitățile și incertitudinile; nu confunda mișcarea aparentă cu cea reală. O schemă astronomică poate fi utilă fără a fi la scară."
};

export function scienceExtendedTheory(entry, chapterName='',explicit=null){
 if(!entry||!['chemistry','physics','biology','astronomy'].includes(entry.subject))return '';
 if(typeof explicit==='string'&&explicit.trim())
  return explicit.trim().split('\n').map(part=>{
   const line=part.trim();
   return line&&line===line.toLocaleUpperCase('ro-RO')&&line.length<=52&&!/[0-9]/.test(line)
    ?'# '+line:part;
  }).join('\n');
 if(SCIENCE_FEATURED[entry.id])return '# Definiție din programă\n'+String(entry.statement||'').trim()+'\n\n'+SCIENCE_FEATURED[entry.id];
 const nl='\n',gap=nl+nl;
 const guide=SCIENCE_GUIDES[entry.subject]?.[entry.topic];
 const parts=['# Definiție și idee principală',String(entry.statement||'').trim()];
 if(entry.formula&&entry.formula!=='—')parts.push('# Relație, formulă sau notație',String(entry.formula));
 if(guide){
  parts.push('# Înțelegerea conceptului în capitolul '+(chapterName||entry.topic),guide[0],
   '# Exemplu explicat din capitol',guide[1],
   '# Limite și greșeli frecvente',guide[2],
   '# Verifică-te',guide[3]);
 }else{
  parts.push('# Cum se interpretează conceptul',SCIENCE_METHOD[entry.subject],
   '# Aplicare și verificare',
   'Analizează afirmația din definiție pentru cazul „'+String(entry.title||'această temă').replaceAll('„','').replaceAll('”','')+'”. Precizează ipotezele, termenii și relațiile deja cunoscute; dacă datele nu sunt suficiente pentru un calcul numeric, nu deduce un rezultat.',
   '# Verifică-te','Ce variabile și condiții trebuie cunoscute pentru a utiliza corect această noțiune? Explică de ce un exemplu fără context ar fi nesigur.');
 }
 return parts.filter(Boolean).join(gap);
}

export const SCIENCE_CHAPTER_GUIDE_COUNT=46;
