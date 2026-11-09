import {COMPUTING_EXTENDED_THEORY} from './computing_extended_theory.mjs';
// Computing curriculum for general computer science literacy and specialisations.

// Educational ordering, not national accreditation; EU country alignment is a later, separate step.

export const COMPUTING_LEVELS=[
  {
    "id": "beginner",
    "ro": "Începător · inițiere digitală",
    "en": "Beginner · digital foundations",
    "focus": "Familiarizare, siguranță, gândire logică și utilizarea responsabilă a dispozitivelor."
  },
  {
    "id": "lower",
    "ro": "Începător · gimnaziu (clasele V–VIII)",
    "en": "Beginner · lower secondary (Years 7–9 in England)",
    "focus": "Gândire algoritmică, programare introductivă, date și utilizare sigură, cu lecții proprii gimnaziului."
  },
  {
    "id": "medium",
    "ro": "Mediu · liceu (clasele IX–XII)",
    "en": "Intermediate · upper secondary",
    "focus": "Algoritmi, programare, date, rețele, web și proiecte verificate, separat de lecțiile gimnaziului."
  },
  {
    "id": "advanced",
    "ro": "Avansat · universitate și specializări",
    "en": "Advanced · university and specialisations",
    "focus": "Inginerie, sisteme, algoritmi avansați, metode și proiecte de specialitate."
  }
];

export const COMPUTING_PATHS=[
  {
    "id": "devices",
    "level": "beginner",
    "ro": "Dispozitive și software",
    "en": "Devices and software",
    "icon": "💻"
  },
  {
    "id": "logic",
    "level": "beginner",
    "ro": "Logică și algoritmi vizuali",
    "en": "Logic and visual algorithms",
    "icon": "🧩"
  },
  {
    "id": "digital",
    "level": "beginner",
    "ro": "Instrumente digitale și date",
    "en": "Digital tools and data",
    "icon": "📁"
  },
  {
    "id": "safety",
    "level": "beginner",
    "ro": "Siguranță și cetățenie digitală",
    "en": "Digital safety and citizenship",
    "icon": "🛡️"
  },
  {
    "id": "algorithms",
    "level": "medium",
    "ro": "Algoritmică",
    "en": "Algorithms",
    "icon": "🧠"
  },
  {
    "id": "programming",
    "level": "medium",
    "ro": "Programare",
    "en": "Programming",
    "icon": "⌨️"
  },
  {
    "id": "web",
    "level": "medium",
    "ro": "Web și interfețe",
    "en": "Web and interfaces",
    "icon": "🌐"
  },
  {
    "id": "databases",
    "level": "medium",
    "ro": "Date și baze de date",
    "en": "Data and databases",
    "icon": "🗄️"
  },
  {
    "id": "networks",
    "level": "medium",
    "ro": "Sisteme, rețele și proiecte",
    "en": "Systems, networks and projects",
    "icon": "🔗"
  },
  {
    "id": "software",
    "level": "advanced",
    "ro": "Inginerie software",
    "en": "Software engineering",
    "icon": "🧱"
  },
  {
    "id": "computer-science",
    "level": "advanced",
    "ro": "Teoria calculului și algoritmi",
    "en": "Computer science theory",
    "icon": "🧮"
  },
  {
    "id": "artificial-intelligence",
    "level": "advanced",
    "ro": "Inteligență artificială și ML",
    "en": "Artificial intelligence and ML",
    "icon": "🤖"
  },
  {
    "id": "cybersecurity",
    "level": "advanced",
    "ro": "Securitate informatică defensivă",
    "en": "Defensive cybersecurity",
    "icon": "🔐"
  },
  {
    "id": "data-science",
    "level": "advanced",
    "ro": "Date, statistică și inginerie",
    "en": "Data science and engineering",
    "icon": "📊"
  },
  {
    "id": "systems",
    "level": "advanced",
    "ro": "Sisteme și cloud",
    "en": "Systems and cloud",
    "icon": "☁️"
  },
  {
    "id": "embedded",
    "level": "advanced",
    "ro": "Sisteme încorporate și IoT",
    "en": "Embedded and IoT",
    "icon": "⚙️"
  },
  {
    "id": "hci",
    "level": "advanced",
    "ro": "Interacțiune, grafică și accesibilitate",
    "en": "HCI, graphics and accessibility",
    "icon": "🎨"
  }
];

export const COMPUTING_TOPICS=[
  {
    "id": "device-types",
    "path": "devices",
    "ro": "Tipuri de calculatoare",
    "en": "Types of computers",
    "theory": "Un dispozitiv de calcul primește date, le prelucrează și produce rezultate. Telefonul, tableta și laptopul au componente și sisteme de operare diferite.",
    "example": "Un telefon fotografiază un obiect (intrare), îl prelucrează și afișează imaginea (ieșire).",
    "question": "Care este un exemplu de dispozitiv de calcul?",
    "choices": [
      "Un creion",
      "Un laptop",
      "O masă",
      "Un caiet"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "hardware",
    "path": "devices",
    "ro": "Componente hardware",
    "en": "Computer hardware",
    "theory": "Procesorul execută instrucțiuni; memoria RAM păstrează temporar date; stocarea păstrează fișiere după oprire. Ecranul și tastatura sunt periferice.",
    "example": "Dacă oprești laptopul, un fișier salvat pe SSD rămâne; conținutul temporar din RAM se pierde.",
    "question": "Ce păstrează de regulă fișierele după oprire?",
    "choices": [
      "RAM",
      "Procesorul",
      "SSD-ul",
      "Tastatura"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "software",
    "path": "devices",
    "ro": "Sistem de operare și aplicații",
    "en": "Operating systems and apps",
    "theory": "Sistemul de operare gestionează dispozitivul, procesele și fișierele. Aplicațiile folosesc serviciile lui pentru sarcini concrete.",
    "example": "Android este sistem de operare; editorul foto este aplicație.",
    "question": "Ce face sistemul de operare?",
    "choices": [
      "Controlează resursele dispozitivului",
      "Înlocuiește internetul",
      "Este doar un joc",
      "Este un tip de tastatură"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "sequence",
    "path": "logic",
    "ro": "Pași în ordine",
    "en": "Sequences",
    "theory": "Un algoritm este o succesiune finită de instrucțiuni neambigue. Ordinea contează pentru rezultat.",
    "example": "Rețetă: pregătește ingredientele → amestecă → coace; inversarea pașilor poate schimba rezultatul.",
    "question": "Ce caracterizează un algoritm corect?",
    "choices": [
      "Instrucțiuni aleatoare",
      "Pași finiți și clari",
      "Doar imagini",
      "Lipsa oricărei reguli"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "decisions",
    "path": "logic",
    "ro": "Decizii dacă / altfel",
    "en": "Conditions",
    "theory": "O condiție testează o afirmație; execuția urmează una dintre ramuri. Folosește condiții observabile.",
    "example": "Dacă plouă, ia umbrela; altfel pleacă fără ea.",
    "question": "Ce instrucțiune alege între două ramuri?",
    "choices": [
      "Repetă",
      "Tipărește",
      "Dacă / altfel",
      "Salvează"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "repetition",
    "path": "logic",
    "ro": "Repetiții și bucle",
    "en": "Loops",
    "theory": "O buclă repetă pași până la un număr de iterații sau până la o condiție de oprire. O buclă fără ieșire se poate bloca.",
    "example": "Repetă de 3 ori: desenează o stea; la final ai 3 stele.",
    "question": "La ce folosește o buclă?",
    "choices": [
      "La repetarea unor pași",
      "La ștergerea ecranului",
      "La alegerea unei parole",
      "La instalarea telefonului"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "files",
    "path": "digital",
    "ro": "Fișiere, foldere și formate",
    "en": "Files and formats",
    "theory": "Fișierele au nume, extensie și conținut; folderele le organizează. Extensia sugerează tipul, nu garantează siguranța.",
    "example": "tema.pdf este un document; poza.png este imagine; documentele ar trebui denumite clar.",
    "question": "Ce face un folder?",
    "choices": [
      "Execută tot codul",
      "Organizează fișiere",
      "Schimbă limba tastaturii",
      "Trimite automat e-mailuri"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "search",
    "path": "digital",
    "ro": "Căutare și verificarea surselor",
    "en": "Searching and evaluating sources",
    "theory": "Caută cu termeni specifici, verifică autorul, data și dovezile. Distinge publicitatea de informația verificabilă.",
    "example": "Compară două surse independente înainte să folosești o cifră într-un referat.",
    "question": "Care este cea mai bună practică?",
    "choices": [
      "Preiei prima afirmație",
      "Ignori data",
      "Verifici sursele și data",
      "Te bazezi pe titlu"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "spreadsheets",
    "path": "digital",
    "ro": "Tabele și formule de bază",
    "en": "Spreadsheets",
    "theory": "Un tabel are rânduri, coloane și celule. O formulă se recalculează când se schimbă datele de intrare.",
    "example": "Într-o foaie de calcul, =SUM(A1:A3) însumează valorile din celulele A1–A3.",
    "question": "Ce începe de obicei o formulă într-un tabel?",
    "choices": [
      "Semnul egal",
      "Un emoji",
      "O virgulă",
      "Un spațiu"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "passwords",
    "path": "safety",
    "ro": "Parole și autentificare",
    "en": "Passwords and authentication",
    "theory": "Folosește parole unice și lungi și autentificare cu mai mulți factori. Nu împărtăși codurile de verificare.",
    "example": "Un administrator de parole poate crea și păstra parole diferite pentru conturi diferite.",
    "question": "Care practică este sigură?",
    "choices": [
      "Aceeași parolă peste tot",
      "Parole unice și MFA",
      "Parola trimisă colegilor",
      "Codul MFA public"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "phishing",
    "path": "safety",
    "ro": "Mesaje frauduloase",
    "en": "Phishing awareness",
    "theory": "Mesajele frauduloase pot imita instituții și cer date sau acces urgent. Verifică expeditorul și accesează serviciul separat, nu prin link suspect.",
    "example": "Un SMS cu amenințare de blocare a contului și link scurt este un semnal de verificat.",
    "question": "Cum verifici un mesaj suspect?",
    "choices": [
      "Răspunzi cu parola",
      "Deschizi orice atașament",
      "Intri separat pe site-ul oficial",
      "Trimiți codul MFA"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "digital-footprint",
    "path": "safety",
    "ro": "Amprentă digitală și respect",
    "en": "Digital footprint and respect",
    "theory": "Publicarea poate lăsa urme durabile. Respectă confidențialitatea, drepturile de autor și accesibilitatea.",
    "example": "Nu publica fotografia unui coleg fără permisiune și oferă descrieri alternative imaginilor.",
    "question": "Ce protejează viața privată?",
    "choices": [
      "Cererea consimțământului",
      "Distribuirea oricăror date",
      "Publicarea adreselor",
      "Ignorarea surselor"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "pseudocode",
    "path": "algorithms",
    "ro": "Pseudocod și diagrame",
    "en": "Pseudocode and flowcharts",
    "theory": "Pseudocodul descrie logica fără sintaxa unui limbaj. Diagramele arată secvențe, decizii și repetiții.",
    "example": "Citește n; dacă n > 0 afișează «pozitiv»; altfel afișează «nepozitiv».",
    "question": "De ce folosim pseudocod?",
    "choices": [
      "Pentru a ascunde buguri",
      "Pentru a descrie logic algoritmul",
      "Pentru a mări RAM",
      "Pentru a executa orice browser"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "variables",
    "path": "algorithms",
    "ro": "Variabile și expresii",
    "en": "Variables and expressions",
    "theory": "O variabilă leagă un nume de o valoare; expresiile combină valori și operatori. Alegerea tipului influențează operațiile.",
    "example": "x = 3; x = x + 2; rezultatul este x = 5.",
    "question": "Ce valoare are x după x=3; x=x+2?",
    "choices": [
      "3",
      "2",
      "5",
      "6"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "branches",
    "path": "algorithms",
    "ro": "Condiții și operatori logici",
    "en": "Conditionals and logic",
    "theory": "Operatorii AND, OR, NOT compun predicate. Condițiile trebuie testate și pentru valori-limită.",
    "example": "Acces permis dacă vârsta >= 18 AND contActiv.",
    "question": "Ce întoarce True AND False?",
    "choices": [
      "False",
      "True",
      "18",
      "Eroare mereu"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "iteration",
    "path": "algorithms",
    "ro": "For, while și terminare",
    "en": "Loops and termination",
    "theory": "Buclele au inițializare, condiție și actualizare. Verifică posibilitatea de oprire și cazurile cu zero iterații.",
    "example": "Suma pentru i de la 1 la 4 este 1+2+3+4 = 10.",
    "question": "Câte iterații are for i in range(3) în Python?",
    "choices": [
      "2",
      "3",
      "4",
      "Infinit"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "functions",
    "path": "algorithms",
    "ro": "Funcții și parametri",
    "en": "Functions and parameters",
    "theory": "Funcțiile grupează calcule reutilizabile. Parametrii oferă intrări, return păstrează un rezultat fără efecte colaterale necesare.",
    "example": "def patrat(x): return x*x; patrat(4) întoarce 16.",
    "question": "Ce face return?",
    "choices": [
      "Oprește calculatorul",
      "Apelează automat internetul",
      "Întoarce rezultatul funcției",
      "Șterge variabilele globale"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "collections",
    "path": "algorithms",
    "ro": "Liste, șiruri și dicționare",
    "en": "Collections",
    "theory": "Listele au poziții ordonate; dicționarele folosesc chei. Accesul trebuie să respecte limitele și existența cheilor.",
    "example": "lista = [10, 20, 30]; lista[1] este 20 în Python.",
    "question": "Care este lista[1] pentru [10,20,30]?",
    "choices": [
      "20",
      "10",
      "30",
      "1"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "recursion",
    "path": "algorithms",
    "ro": "Recursivitate",
    "en": "Recursion",
    "theory": "O funcție recursivă se apelează pe o problemă mai mică și necesită caz de bază pentru terminare.",
    "example": "factorial(3)=3×factorial(2); factorial(0)=1 este cazul de bază.",
    "question": "Ce este esențial în recursivitate?",
    "choices": [
      "MFA",
      "Un caz de bază",
      "Un fișier PDF",
      "O tastatură"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "complexity",
    "path": "algorithms",
    "ro": "Complexitate temporală și spațială",
    "en": "Complexity basics",
    "theory": "Notația O descrie cum crește costul cu dimensiunea intrării, ignorând factorii constanți. Compară algoritmii pe inputuri mari.",
    "example": "Parcurgerea unei liste cu n elemente este O(n); accesul prin index este de regulă O(1).",
    "question": "Care este complexitatea unei parcurgeri simple prin n valori?",
    "choices": [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n!)"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "python-syntax",
    "path": "programming",
    "ro": "Bazele Python",
    "en": "Python foundations",
    "theory": "Python folosește indentarea pentru blocuri. print afișează, input citește text; conversia numerică este explicită.",
    "example": "n = int(input('Număr: ')); print(n*2)",
    "question": "Ce tip întoarce input() în Python?",
    "choices": [
      "str",
      "int",
      "float",
      "bool"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "javascript",
    "path": "programming",
    "ro": "Bazele JavaScript",
    "en": "JavaScript foundations",
    "theory": "JavaScript rulează în browser sau pe server. const și let definesc variabile cu reguli diferite de reasignare.",
    "example": "const x = 2; console.log(x + 3); afișează 5.",
    "question": "Cum declari o variabilă ce poate fi reasignată?",
    "choices": [
      "const",
      "let",
      "import",
      "return"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "types",
    "path": "programming",
    "ro": "Tipuri și conversii",
    "en": "Types and conversions",
    "theory": "Numerele, șirurile, booleenele și colecțiile se comportă diferit. Conversiile trebuie tratate explicit și validate.",
    "example": "În JavaScript, Number('7') produce numărul 7; '7' rămâne un șir.",
    "question": "Ce este bool în Python?",
    "choices": [
      "Tip de fișier",
      "Tablou",
      "Tip logic True/False",
      "Operator de rețea"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "debugging",
    "path": "programming",
    "ro": "Depanare și teste",
    "en": "Debugging and tests",
    "theory": "Reproduce eroarea, citește mesajul și izolează un exemplu minim. Testele verifică intrări obișnuite, limite și erori.",
    "example": "Testează împărțirea la 0 separat de calculul valid, în loc să ascunzi excepția.",
    "question": "Ce faci înainte să modifici un bug necunoscut?",
    "choices": [
      "Îl reproduci",
      "Ștergi toate testele",
      "Ignori jurnalul",
      "Publici imediat"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "git",
    "path": "programming",
    "ro": "Versionare și colaborare",
    "en": "Git and collaboration",
    "theory": "Un commit este o fotografie logică a schimbărilor. Branch-urile izolează lucrul, review-ul verifică înainte de integrare.",
    "example": "Folosește commit-uri mici și mesaje descriptive pentru o modificare de cod.",
    "question": "Ce păstrează istoricul modificărilor?",
    "choices": [
      "PDF",
      "Git",
      "CSS",
      "DNS"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "html",
    "path": "web",
    "ro": "HTML semantic",
    "en": "Semantic HTML",
    "theory": "HTML descrie structura și sensul elementelor: headings, paragrafe, formulare și legături. Semanticitatea susține accesibilitatea.",
    "example": "<button type='button'>Salvează</button> este preferabil unui div folosit ca buton.",
    "question": "Care element reprezintă o acțiune apăsabilă?",
    "choices": [
      "<div>",
      "<span>",
      "<button>",
      "<br>"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "css",
    "path": "web",
    "ro": "CSS și layout responsive",
    "en": "CSS and responsive layout",
    "theory": "CSS controlează prezentarea. Flexbox și Grid ajută la layouturi adaptabile; unitățile relative evită depășirea ecranelor.",
    "example": "Folosește max-width:100% pentru imagini și flex-wrap pentru controale când spațiul este mic.",
    "question": "Ce proprietate permite împachetarea elementelor flex?",
    "choices": [
      "flex-wrap",
      "border-radius",
      "font-style",
      "opacity"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "dom",
    "path": "web",
    "ro": "DOM și evenimente",
    "en": "DOM and events",
    "theory": "DOM reprezintă documentul în obiecte. Ascultătorii de evenimente reacționează la input, fără a executa cod venit de la utilizator.",
    "example": "button.addEventListener('click', () => { status.textContent='Gata'; });",
    "question": "Ce metodă atașează un eveniment?",
    "choices": [
      "innerText",
      "addEventListener",
      "JSON.parse",
      "Date.now"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "accessibility",
    "path": "web",
    "ro": "Accesibilitate web",
    "en": "Web accessibility",
    "theory": "Conținutul trebuie să funcționeze la tastatură, cu etichete clare, contrast și statusuri anunțate. Nu construi controale doar din culori.",
    "example": "Un input are label explicit, iar statusul rezultatului poate avea role='status'.",
    "question": "Ce îmbunătățește accesibilitatea unui formular?",
    "choices": [
      "Placeholder exclusiv",
      "Imagine fără descriere",
      "Etichetă asociată inputului",
      "Culoare fără text"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "tables",
    "path": "databases",
    "ro": "Tabele, înregistrări și chei",
    "en": "Tables and keys",
    "theory": "Un tabel relațional conține rânduri și coloane. Cheia primară identifică unic fiecare rând; tipurile previn confuziile.",
    "example": "elevi(id, nume, clasa); id este unic chiar dacă doi elevi au același nume.",
    "question": "Ce este o cheie primară?",
    "choices": [
      "Identificator unic",
      "Titlul tabelului",
      "O parolă",
      "Numele bazei"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "sql",
    "path": "databases",
    "ro": "Interogări SQL SELECT",
    "en": "SQL selection",
    "theory": "SELECT cere coloane, FROM sursa, WHERE filtrarea; interogările parametrizate previn injectarea la introduceri externe.",
    "example": "SELECT nume FROM elevi WHERE clasa = 9;",
    "question": "Care clauză filtrează rândurile?",
    "choices": [
      "ORDER BY",
      "WHERE",
      "FROM",
      "CREATE"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "joins",
    "path": "databases",
    "ro": "Relații și JOIN",
    "en": "Database joins",
    "theory": "O cheie străină asociază entități; JOIN combină rândurile care corespund condiției de legătură.",
    "example": "comenzi(client_id) se leagă de clienti(id); apoi JOIN oferă numele clientului.",
    "question": "La ce folosește JOIN?",
    "choices": [
      "Șterge serverul",
      "Creează fișiere",
      "Combină date din tabele relaționate",
      "Schimbă extensia"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "internet",
    "path": "networks",
    "ro": "IP, DNS și HTTP",
    "en": "Internet foundations",
    "theory": "DNS rezolvă nume de domenii în adrese pentru conectare. HTTPS asigură protecția transportului, nu garantează corectitudinea unui site.",
    "example": "Introduci un domeniu → DNS oferă adresa → browserul stabilește conexiunea HTTPS.",
    "question": "Ce serviciu leagă numele unui domeniu de o adresă IP?",
    "choices": [
      "DNS",
      "SSD",
      "RAM",
      "HTML"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "os-processes",
    "path": "networks",
    "ro": "Procese și sistem de operare",
    "en": "Processes and operating systems",
    "theory": "Procesele execută programe; sistemul planifică folosirea CPU și memoriei. Fișierele și permisiunile limitează accesul.",
    "example": "Două aplicații pot rula simultan în procese separate.",
    "question": "Cine planifică procesele?",
    "choices": [
      "Editorul de imagini",
      "Sistemul de operare",
      "Cablul USB",
      "PDF-ul"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "encryption",
    "path": "networks",
    "ro": "Criptare și protecție date",
    "en": "Encryption basics",
    "theory": "Criptarea transformă datele pentru a fi citite doar cu cheia potrivită. Hash-ul nu este criptare reversibilă și nu înlocuiește o parolă sigură.",
    "example": "HTTPS folosește criptarea transportului; parola se verifică printr-un mecanism de autentificare.",
    "question": "Ce face criptarea?",
    "choices": [
      "Șterge erorile",
      "Afișează fișiere",
      "Protejează confidențialitatea datelor",
      "Garantează adevărul unei pagini"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "projects",
    "path": "networks",
    "ro": "Proiect integrator și testare",
    "en": "Capstone and verification",
    "theory": "Un proiect clar are cerințe, intrări, ieșiri, cazuri de test, documentație și etape de revizuire. Rezultatul trebuie verificat, nu doar descris.",
    "example": "Construiește o listă de cumpărături care adaugă, editează și elimină elemente; testează duplicările.",
    "question": "Ce dovedește că o cerință funcționează?",
    "choices": [
      "Un test reproductibil",
      "Doar o captură estetică",
      "Un titlu frumos",
      "Un comentariu vag"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "architecture",
    "path": "software",
    "ro": "Arhitectură modulară",
    "en": "Modular architecture",
    "theory": "Separă interfața, logica de domeniu și persistența prin contracte clare. Evită dependențele circulare și efectele ascunse.",
    "example": "O aplicație folosește module diferite pentru UI, validare și stocare.",
    "question": "Ce îmbunătățește separarea responsabilităților?",
    "choices": [
      "Cuplarea excesivă",
      "Testabilitatea",
      "Duplicarea codului",
      "Lipsa interfețelor"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "testing-advanced",
    "path": "software",
    "ro": "Teste unitare, integrare și proprietăți",
    "en": "Unit and integration testing",
    "theory": "Unit-test validează funcții izolate; integrarea validează colaborarea; testarea de proprietăți examinează invarianti pe multe intrări.",
    "example": "Pentru sortare verifică: rezultatul este ordonat și conține exact multisetul inițial.",
    "question": "Ce verifică un test de integrare?",
    "choices": [
      "Doar designul",
      "Lungimea numelui",
      "Interacțiunea componentelor",
      "Parola utilizatorului"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "deployment",
    "path": "software",
    "ro": "CI/CD și lansări sigure",
    "en": "CI/CD and release engineering",
    "theory": "Pipeline-ul ar trebui să construiască, testeze, scaneze și publice artefacte reproductibile. Versionarea și rollback-ul reduc riscurile.",
    "example": "Publică dintr-un commit testat; păstrează artifact semnat și plan de rollback.",
    "question": "Ce reduce riscul unei lansări?",
    "choices": [
      "Pipeline cu teste și rollback",
      "Modificări direct în producție",
      "Ignorarea erorilor",
      "Secrete în cod"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "structures",
    "path": "computer-science",
    "ro": "Structuri de date avansate",
    "en": "Advanced data structures",
    "theory": "Heap, arbori și tabele hash oferă compromisuri diferite de timp și spațiu. Alege structura după operațiile dominante.",
    "example": "O coadă cu priorități se poate implementa eficient cu un heap binar.",
    "question": "Care structură este potrivită pentru prioritatea minimă?",
    "choices": [
      "Listă sortată manual mereu",
      "Heap",
      "Fișier audio",
      "Parser HTML"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "graphs",
    "path": "computer-science",
    "ro": "Grafuri și algoritmi",
    "en": "Graph algorithms",
    "theory": "Grafurile au vârfuri și muchii; BFS găsește distanțe minime în grafuri neponderate; Dijkstra pentru ponderi nenegative.",
    "example": "Într-un graf neponderat, BFS pornește din sursă și explorează pe straturi.",
    "question": "Ce algoritm oferă distanțe minime în graf neponderat?",
    "choices": [
      "DFS întotdeauna",
      "Quicksort",
      "BFS",
      "Hashing"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "automata",
    "path": "computer-science",
    "ro": "Automate, computabilitate și limite",
    "en": "Automata and computability",
    "theory": "Automatele finite recunosc limbaje regulate; mașinile Turing modelează calculul general. Există probleme indecidabile.",
    "example": "Problema opririi nu poate fi rezolvată de un algoritm general pentru orice program și intrare.",
    "question": "Ce este indecidabil în general?",
    "choices": [
      "Problema opririi",
      "Adunarea a două numere",
      "Sortarea unei liste finite",
      "Parcurgerea unui graf finit"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "optimization",
    "path": "computer-science",
    "ro": "Complexitate și analiză amortizată",
    "en": "Complexity and amortized analysis",
    "theory": "Analiza asimptotică separă clase de creștere; amortizarea estimează costul mediu pe o secvență de operații, nu pe o distribuție aleatoare.",
    "example": "Dublarea capacității unui vector dinamic oferă append amortizat O(1).",
    "question": "Ce cost amortizat are append într-un vector cu dublare?",
    "choices": [
      "O(n²)",
      "O(1)",
      "O(n!)",
      "O(log n) obligatoriu"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "ml-pipeline",
    "path": "artificial-intelligence",
    "ro": "Pregătirea și separarea datelor",
    "en": "ML data pipeline",
    "theory": "Împarte seturile de antrenare, validare și test astfel încât exemplele sau entitățile corelate să nu se scurgă între ele.",
    "example": "Datele viitoare pentru predicție temporală nu trebuie să apară în antrenare.",
    "question": "Ce produce scurgere de date?",
    "choices": [
      "Validare separată",
      "Test ținut deoparte",
      "Features derivate din ținta viitoare",
      "Documentație"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "learning",
    "path": "artificial-intelligence",
    "ro": "Învățare supervizată și metrici",
    "en": "Supervised learning and metrics",
    "theory": "Clasificarea prezice categorii; regresia valori. Alege metrici după costul erorilor, dezechilibrul claselor și context.",
    "example": "Pentru clase rare, precizia și recall pot fi mai utile decât acuratețea totală.",
    "question": "Ce măsoară recall-ul?",
    "choices": [
      "Proporția cazurilor pozitive reale detectate",
      "Dimensiunea fișierelor",
      "Viteza rețelei",
      "Numărul epocilor"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "neural",
    "path": "artificial-intelligence",
    "ro": "Rețele neuronale și optimizare",
    "en": "Neural networks and optimization",
    "theory": "Parametrii sunt ajustați pentru minimizarea pierderii folosind gradientul. Supraajustarea necesită validare și regularizare.",
    "example": "Un model cu pierdere de antrenare mică și pierdere de validare mare poate supraajusta.",
    "question": "Ce indică supraajustare?",
    "choices": [
      "Ambele erori zero pe date noi",
      "Generalizare slabă pe validare",
      "Numărul corect de clase",
      "Validare independentă bună"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "ai-governance",
    "path": "artificial-intelligence",
    "ro": "Evaluare, bias și utilizare responsabilă",
    "en": "AI evaluation and governance",
    "theory": "Modelele pot produce erori, conținut nefundamentat și discriminare. Evaluează pe grupuri relevante și păstrează intervenția umană pentru decizii sensibile.",
    "example": "Un asistent pentru educație ar trebui să indice incertitudinea și să nu inventeze surse.",
    "question": "Care este o măsură de control?",
    "choices": [
      "Lipsa oricăror teste",
      "Automatizarea deciziilor critice fără revizuire",
      "Evaluarea erorilor și supraveghere umană",
      "Ignorarea biasului"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "threat-model",
    "path": "cybersecurity",
    "ro": "Modelare de amenințări",
    "en": "Threat modeling",
    "theory": "Inventariază active, limite de încredere, suprafețe de atac și impact. Abordarea este preventivă și pe sisteme autorizate.",
    "example": "Pentru o aplicație, verifică accesul la documente, sesiunile și rolurile.",
    "question": "Ce urmărește modelarea amenințărilor?",
    "choices": [
      "Identificarea riscurilor înaintea incidentelor",
      "Exploatarea unor servere străine",
      "Publicarea cheilor",
      "Dezactivarea jurnalelor"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "secure-code",
    "path": "cybersecurity",
    "ro": "Dezvoltare sigură și validarea intrărilor",
    "en": "Secure coding",
    "theory": "Validează date la granița de încredere; folosește interogări parametrizate, encoding contextual și controale de acces pe server.",
    "example": "Pentru SQL folosește parametri, nu concatenarea șirurilor furnizate de utilizator.",
    "question": "Ce previne de regulă SQL injection?",
    "choices": [
      "Concatenezi input-ul",
      "Interogări parametrizate",
      "Ascunzi butonul",
      "Obfuschezi CSS"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "identity",
    "path": "cybersecurity",
    "ro": "Autentificare, autorizare și secrete",
    "en": "IAM and secrets",
    "theory": "Autentificarea stabilește identitatea, autorizarea decide permisiunile. Gestionează secretele în sisteme dedicate și aplică principiul privilegiilor minime.",
    "example": "Un cont elev poate vedea propriile documente, dar nu pe ale altuia.",
    "question": "Ce verificare este esențială pe server?",
    "choices": [
      "Doar culoarea butonului",
      "Doar titlul paginii",
      "Autorizarea fiecărei acțiuni",
      "Numele fișierului"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "incident",
    "path": "cybersecurity",
    "ro": "Monitorizare și răspuns la incidente",
    "en": "Detection and response",
    "theory": "Monitorizează evenimente relevante, limitează expunerea datelor și pregătește procesul de izolare, remediere și recuperare.",
    "example": "La compromiterea unui token: revocă-l, investighează accesul, rotește secretele afectate.",
    "question": "Care este prima măsură la detectarea unui token compromis?",
    "choices": [
      "Revocă accesul compromis",
      "Publică token-ul",
      "Ignoră alerta",
      "Șterge toate copiile de siguranță"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "statistics",
    "path": "data-science",
    "ro": "Statistica aplicată și inferență",
    "en": "Applied statistics",
    "theory": "Distinge populație și eșantion, corelație și cauzalitate. Intervalele de încredere reflectă incertitudinea sub ipotezele modelului.",
    "example": "O corelație între două variabile nu demonstrează o relație cauzală.",
    "question": "Ce NU demonstrează corelația singură?",
    "choices": [
      "O asociere",
      "Cauzalitate",
      "O tendință observată",
      "O covariație"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "data-pipelines",
    "path": "data-science",
    "ro": "ETL și calitatea datelor",
    "en": "ETL and data quality",
    "theory": "Extrage, validează, transformă și încarcă date cu proveniență verificabilă. Gestionează duplicatele, valorile lipsă și schimbarea schemelor.",
    "example": "Un pipeline verifică tipurile coloanelor înainte de încărcare și raportează rândurile respinse.",
    "question": "Ce este un control de calitate util?",
    "choices": [
      "Ignori valorile lipsă",
      "Elimini schema",
      "Validezi tipurile și duplicările",
      "Amesteci sursele"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "database-design",
    "path": "data-science",
    "ro": "Normalizare și tranzacții",
    "en": "Database design and transactions",
    "theory": "Normalizarea reduce anomaliile; tranzacțiile ACID oferă garanții de consistență în condițiile definite de motor.",
    "example": "Un transfer între conturi trebuie să debiteze și să crediteze atomic.",
    "question": "Care proprietate evită o tranzacție parțială?",
    "choices": [
      "Atomicitate",
      "Compresie",
      "HTML",
      "DNS"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "visualization",
    "path": "data-science",
    "ro": "Vizualizare și interpretare",
    "en": "Data visualisation",
    "theory": "Alege graficul după tipul de date, unități și comparație; evită axele înșelătoare și omisiunile de eșantion.",
    "example": "Pentru evoluții în timp, graficul liniar este adesea potrivit dacă axele sunt clare.",
    "question": "Ce face graficul mai corect?",
    "choices": [
      "Eliminarea unităților",
      "Axe și surse clare",
      "Tăierea arbitrară a datelor",
      "Culori fără legendă"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "concurrency",
    "path": "systems",
    "ro": "Fire, procese și sincronizare",
    "en": "Concurrency and synchronization",
    "theory": "Execuția concurentă necesită protejarea stării partajate; blocările pot preveni curse dar pot produce deadlock.",
    "example": "Două fire care măresc aceeași variabilă fără sincronizare pot pierde actualizări.",
    "question": "Ce apare când accesul concurent nu este sincronizat?",
    "choices": [
      "CSS",
      "DNS",
      "Condiție de cursă",
      "O extensie PDF"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "distributed",
    "path": "systems",
    "ro": "Sisteme distribuite și consistență",
    "en": "Distributed systems",
    "theory": "Eșecurile parțiale, latența și duplicarea mesajelor sunt normale. Proiectează operații idempotente și retry-uri limitate.",
    "example": "O comandă repetată cu același id nu trebuie să încaseze de două ori.",
    "question": "Ce descrie idempotent?",
    "choices": [
      "Repetarea operației nu produce efecte suplimentare",
      "Lipsa jurnalelor",
      "Criptare obligatorie",
      "Păstrarea tuturor parolelor"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "cloud",
    "path": "systems",
    "ro": "Cloud, containere și observabilitate",
    "en": "Cloud and observability",
    "theory": "Containerul împachetează aplicația; orchestrarea și observabilitatea urmăresc stări, loguri, metrici și trasee.",
    "example": "Un deployment are health checks și rollback înainte de extinderea la toți utilizatorii.",
    "question": "Ce ajută la diagnosticarea latenței?",
    "choices": [
      "Titlul aplicației",
      "Metrici, loguri și trasee",
      "Culoarea iconiței",
      "Numele utilizatorului"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "performance",
    "path": "systems",
    "ro": "Profilare și optimizare",
    "en": "Profiling and performance",
    "theory": "Măsoară întâi blocajul real și schimbă incremental. Optimizarea prematură fără profilare poate crește riscul de erori.",
    "example": "Un flame graph arată unde se consumă timpul CPU.",
    "question": "Ce faci înaintea optimizării?",
    "choices": [
      "Rescrii întreg codul",
      "Elimini testele",
      "Măsori cu profiler",
      "Crești toate timeouturile"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "electronics",
    "path": "embedded",
    "ro": "Microcontrolere și semnale",
    "en": "Microcontrollers and signals",
    "theory": "Microcontrolerul execută firmware și interacționează cu senzori prin intrări și ieșiri. Nivelurile electrice trebuie respectate.",
    "example": "Un GPIO poate citi un buton sau controla un LED prin circuit potrivit.",
    "question": "Ce poate face un GPIO?",
    "choices": [
      "Citi o intrare digitală",
      "Stoca fișiere nelimitat",
      "Găzdui orice browser",
      "Înlocui routerul"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "realtime",
    "path": "embedded",
    "ro": "Sisteme de timp real",
    "en": "Real-time systems",
    "theory": "Corectitudinea depinde și de respectarea termenelor-limită. Planificarea și durata maximă de execuție trebuie analizate.",
    "example": "Un controler trebuie să reacționeze într-un interval maxim specificat, nu doar în medie.",
    "question": "Ce definește o cerință de timp real?",
    "choices": [
      "Doar viteza medie",
      "Respectarea termenului-limită",
      "Numărul de ferestre",
      "Culoarea interfeței"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "iot-security",
    "path": "embedded",
    "ro": "IoT și securizarea dispozitivelor",
    "en": "IoT and device security",
    "theory": "Dispozitivele conectate au nevoie de actualizări semnate, identități unice și acces minim. Nu expune controlul fizic fără autorizare.",
    "example": "Un senzor trimite date prin TLS și verifică semnătura firmware-ului.",
    "question": "Ce protejează actualizarea firmware-ului?",
    "choices": [
      "Numele produsului",
      "Un buton roșu",
      "Verificarea semnăturii",
      "Un cablu mai lung"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "user-research",
    "path": "hci",
    "ro": "Cercetare UX și cerințe",
    "en": "UX research and requirements",
    "theory": "Formulează obiective observabile din interviuri și teste, nu din presupuneri. Studiază utilizatori cu abilități diferite.",
    "example": "Testează o aplicație educațională cu elevi și profesori, nu doar cu dezvoltatori.",
    "question": "Ce validează o ipoteză UX?",
    "choices": [
      "Testul cu utilizatori reali",
      "Preferința developerului",
      "Un logo",
      "Un slogan"
    ],
    "correct": 0,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "graphics",
    "path": "hci",
    "ro": "Grafică, coordonate și transformări",
    "en": "Computer graphics",
    "theory": "Transformările translatează, rotesc și scalează obiecte. Camera și proiecția definesc reprezentarea spațiului 3D.",
    "example": "O rotație 3D modifică orientarea obiectului; nu trebuie confundată cu mutarea lui.",
    "question": "Ce schimbă o translație?",
    "choices": [
      "Culoarea textului",
      "Poziția obiectului",
      "Memoria RAM",
      "Numărul de fișiere"
    ],
    "correct": 1,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  },
  {
    "id": "accessible-design",
    "path": "hci",
    "ro": "Design incluziv și testare",
    "en": "Inclusive and accessible design",
    "theory": "Proiectează pentru contrast, navigație la tastatură, etichete pentru cititoare și dimensiuni tactile potrivite. Nu simula accesibilitatea doar estetic.",
    "example": "Un buton are etichetă clară, rol nativ și zonă tactilă suficientă.",
    "question": "Ce este un control accesibil?",
    "choices": [
      "Doar o iconiță fără text",
      "Un div fără interacțiune",
      "Buton nativ etichetat",
      "Text doar în imagine"
    ],
    "correct": 2,
    "practice": "Explică în cuvintele tale conceptul și construiește un exemplu propriu, apoi compară-l cu explicația din lecție."
  }
];

export function computingPaths(level){return COMPUTING_PATHS.filter(p=>p.level===level)}

export function computingTopics(level,path){return COMPUTING_TOPICS.filter(t=>t.path===path&&COMPUTING_PATHS.some(p=>p.id===path&&p.level===level))}

export function computingTopic(level,path,id){return computingTopics(level,path).find(t=>t.id===id)||null}

export function computingQuizCheck(topic,choice){if(!topic||!Number.isInteger(choice))return null;return {correct:choice===topic.correct,expected:topic.choices[topic.correct]}}

export function computingCoverage(){return Object.fromEntries(COMPUTING_LEVELS.map(l=>[l.id,{paths:computingPaths(l.id).length,topics:COMPUTING_TOPICS.filter(t=>computingPaths(l.id).some(p=>p.id===t.path)).length}]))}

// Standalone lower-secondary lessons: do not reuse primary or high-school course records.
COMPUTING_PATHS.push(...[{"id":"lower-logic","level":"lower","ro":"Logică și algoritmi de gimnaziu","en":"Lower-secondary logic and algorithms","icon":"🧩"},{"id":"lower-programming","level":"lower","ro":"Programare introductivă de gimnaziu","en":"Introductory school programming","icon":"💻"},{"id":"lower-digital","level":"lower","ro":"Date și proiecte digitale de gimnaziu","en":"Lower-secondary digital projects","icon":"📁"}]);
COMPUTING_TOPICS.push(...[{"id":"lower-sequences","path":"lower-logic","ro":"Pași și secvențe","en":"Sequences and instructions","theory":"Un algoritm are pași clari, ordonați, care duc la un rezultat și trebuie să aibă o condiție de terminare.","example":"Pentru a calcula media a trei numere: citește valorile, însumează, împarte la trei, afișează rezultatul.","question":"Ce trebuie să aibă un algoritm? ","choices":["Pași neclari","Pași corecți și finiți","Doar imagini","Numai parole"],"correct":1,"practice":"Analizează exemplul, construiește o soluție proprie, verifică rezultatul pe date diferite și explică de ce funcționează."},{"id":"lower-conditions","path":"lower-logic","ro":"Condiții logice","en":"Decisions and comparisons","theory":"Expresia dacă–altfel alege ramura de execuție în funcție de o condiție verificabilă. Pentru o verificare completă, testează atât cazul adevărat cât și cazul fals.","example":"Dacă temperatura este sub zero, afișează «îngheț»; altfel afișează «fără îngheț».","question":"Dacă o condiție este falsă, ce ramură se execută? ","choices":["Ramura altfel","Ambele simultan","Nu există condiție","La întâmplare"],"correct":0,"practice":"Analizează exemplul, construiește o soluție proprie, verifică rezultatul pe date diferite și explică de ce funcționează."},{"id":"lower-loops","path":"lower-logic","ro":"Repetiții controlate","en":"Controlled repetition","theory":"O buclă repetă o instrucțiune un număr de ori sau până la o condiție. O oprire bine definită împiedică rularea la infinit.","example":"Repetă de cinci ori: adaugă 2 la total, începând cu 0. Rezultatul final este 10.","question":"La ce se folosesc buclele într-un algoritm? ","choices":["La ștergerea fișierelor","La repetarea controlată","La deschiderea pozelor","La alegerea limbii"],"correct":1,"practice":"Analizează exemplul, construiește o soluție proprie, verifică rezultatul pe date diferite și explică de ce funcționează."},{"id":"lower-variables","path":"lower-programming","ro":"Variabile și valori","en":"Variables and values","theory":"O variabilă păstrează o valoare care poate fi citită sau schimbată în timpul programului. Tipul de date influențează operațiile permise.","example":"punctaj = 4; punctaj = punctaj + 3; acum valoarea este 7. Citește pas cu pas actualizările.","question":"Ce valoare are n după n=2; n=n+4? ","choices":["2","4","6","8"],"correct":2,"practice":"Analizează exemplul, construiește o soluție proprie, verifică rezultatul pe date diferite și explică de ce funcționează."},{"id":"lower-python","path":"lower-programming","ro":"Primul program Python","en":"Your first Python program","theory":"Python execută instrucțiunile în ordinea lor. Funcția print afișează text sau valori; respectă sintaxa, ghilimelele și indentarea blocurilor.","example":"print(2 + 3) afișează 5. print('Salut') afișează textul Salut, fără a include ghilimelele.","question":"Ce afișează print(3+4) în Python? ","choices":["34","7","3+4","Nimic"],"correct":1,"practice":"Analizează exemplul, construiește o soluție proprie, verifică rezultatul pe date diferite și explică de ce funcționează."},{"id":"lower-debug","path":"lower-programming","ro":"Testare și depanare","en":"Testing and debugging","theory":"Un program poate avea erori de sintaxă, de logică sau de intrare. Folosește cazuri simple și valori-limită, apoi compară rezultatul așteptat cu cel obținut.","example":"Pentru funcția care detectează numere pare, testează 0, 1, 2, 9 și valori negative; notează diferențele.","question":"Cum verifici dacă un program funcționează? ","choices":["Testezi intrări diferite","Îl consideri corect din prima","Ștergi codul","Ignori erorile"],"correct":0,"practice":"Analizează exemplul, construiește o soluție proprie, verifică rezultatul pe date diferite și explică de ce funcționează."},{"id":"lower-data","path":"lower-digital","ro":"Date și reprezentare","en":"Digital data and representation","theory":"Calculatoarele reprezintă informația prin valori binare. Imaginile, sunetele și textele au formate și dimensiuni diferite, iar compresia poate schimba calitatea.","example":"O fotografie JPEG și un document PDF au utilizări diferite; compară fișierele după format, mărime și scop.","question":"Ce este o reprezentare binară? ","choices":["O hartă","Date exprimate prin 0 și 1","Un cablu","O parolă"],"correct":1,"practice":"Analizează exemplul, construiește o soluție proprie, verifică rezultatul pe date diferite și explică de ce funcționează."},{"id":"lower-privacy","path":"lower-digital","ro":"Confidențialitate și surse","en":"Privacy and source verification","theory":"Protejează datele personale, limitează permisiunile aplicațiilor și verifică sursele înainte de a distribui informații. Mesajele urgente cu cereri de parole sunt suspecte.","example":"Primești un mesaj care cere codul de autentificare: nu îl trimiți, deschizi separat aplicația oficială și verifici.","question":"Ce faci când primești o cerere nesolicitată pentru codul MFA? ","choices":["Îl distribui","Îl publici","Nu îl divulgi și verifici sursa","Îl postezi"],"correct":2,"practice":"Analizează exemplul, construiește o soluție proprie, verifică rezultatul pe date diferite și explică de ce funcționează."},{"id":"lower-project","path":"lower-digital","ro":"Proiect digital de gimnaziu","en":"A lower-secondary digital project","theory":"Un proiect didactic combină un scop clar, date potrivite, pași expliciți, verificare și prezentare. Nu presupune programe plătite sau publicarea datelor personale.","example":"Realizează o evidență fictivă a temperaturilor pe cinci zile, calculează media și prezintă sursa datelor și limitele.","question":"Ce trebuie inclus într-un proiect corect? ","choices":["Doar coperta","Doar un program instalat","Doar răspunsul final","Scop, pași, verificări și sursă"],"correct":3,"practice":"Analizează exemplul, construiește o soluție proprie, verifică rezultatul pe date diferite și explică de ce funcționează."}]);


// Explanations are visible immediately, offline, without an AI request.
// They supplement the topic-specific definition, example, practice and quiz.
// The national curriculum defines skills by key stage; each year assignment is an
// age-appropriate teaching organisation, not an invented statutory lesson order.
const COMPUTING_DEEP_THEORY={
 'device-types':`Cum recunoști un calculator
Un calculator este un dispozitiv care primește informații (intrări), le transformă folosind instrucțiuni și oferă un rezultat (ieșire). Nu trebuie să aibă forma unui laptop: un telefon, o tabletă, o consolă și un calculator desktop îndeplinesc această funcție.

Intrare, procesare, ieșire și stocare
La un telefon, camera captează lumina și o transformă în date; procesorul aplică instrucțiuni; ecranul afișează fotografia; memoria de stocare o păstrează dacă alegi să o salvezi. Fiecare operație implică componente și programe care colaborează.

Comparație
Un desktop are de regulă unitate centrală și periferice separate. Un laptop reunește tastatura, ecranul și bateria, iar telefonul are senzori și ecran tactil. Ele au funcții comune, deși diferă prin mărime, consum de energie și utilizare.

De reținut: obiectele care folosesc tehnologia nu sunt neapărat calculatoare; caută prelucrarea informației după instrucțiuni. Exersează desenând un lanț intrare → procesare → ieșire pentru un dispozitiv cunoscut.`,
 'hardware':`Piesele unui sistem de calcul
Hardware înseamnă componente fizice: procesor (CPU), memorie, unitate de stocare, placă de bază, ecran, tastatură și componente de conectare. Software înseamnă instrucțiunile și programele care folosesc aceste componente.

Procesorul (CPU)
CPU interpretează și execută instrucțiuni. Nu păstrează de unul singur toate documentele sau aplicațiile. Puterea unui computer depinde de mai multe componente, nu doar de viteza procesorului.

Memoria RAM
RAM (Random Access Memory) este memoria rapidă în care se află datele și instrucțiunile folosite de programele active. Ea este volatilă: datele din RAM se pierd în mod normal la oprirea alimentării. Mai multă RAM poate permite mai multe aplicații deschise fără ca sistemul să transfere des date pe stocare.

Stocarea SSD/HDD
Pe SSD sau pe HDD se păstrează fișiere, aplicații și sistemul de operare după oprirea dispozitivului. De exemplu, când scrii un document, aplicația folosește RAM; când alegi „Salvează”, documentul este scris pe stocarea permanentă. RAM nu înlocuiește SSD-ul.

Periferice
Tastatura, microfonul și camera sunt intrări; ecranul și difuzoarele sunt ieșiri. Unele dispozitive, precum ecranul tactil, pot îndeplini ambele roluri.

Verificare: explică ce se întâmplă cu un document nesalvat atunci când dispozitivul se oprește brusc și de ce salvarea contează.`,
 'software':`Sistem de operare, aplicație și fișier
Sistemul de operare (de exemplu Android, Windows sau Linux) coordonează hardware-ul, memoria, fișierele, conexiunile și procesele. Aplicațiile sunt programe care folosesc aceste servicii pentru o activitate: fotografiere, editarea textelor, navigare sau învățare.

Cum lucrează împreună
Când deschizi o fotografie, aplicația solicită fișierul prin sistemul de operare. Acesta îl citește de pe stocare, îi pune datele în memorie, iar aplicația desenează imaginea pe ecran.

Instalare și actualizare
Instalarea introduce fișierele unei aplicații; o actualizare poate corecta erori și vulnerabilități. Folosește surse cunoscute și verifică permisiunile. Un document .pdf nu este o aplicație instalată.

Exercițiu: separă în trei categorii Android, editor foto, cameră și procesor: sistem de operare, aplicație sau hardware.`,
 'sequence':`De ce contează ordinea
Un algoritm este o descriere finită, clară a pașilor necesari pentru a rezolva o problemă. Fiecare pas trebuie să poată fi înțeles fără interpretări contradictorii. Intrările sunt datele inițiale, iar ieșirea este rezultatul.

Execută manual
Pentru media numerelor 2, 4 și 6: adună 2+4+6=12; împarte 12 la 3; obții 4. Dacă împarți înainte să aduni, rezultatul poate deveni incorect.

Cum verifici
Rulează pașii pe alte valori, inclusiv zero. Identifică primul pas, ultimul pas și momentul în care algoritmul se oprește. O diagramă de flux poate reprezenta instrucțiunile prin săgeți.`,
 'decisions':`Ce este o condiție
O condiție are rezultatul adevărat sau fals. Instrucțiunea „dacă … altfel” permite executarea unei ramuri în funcție de rezultat. Comparările pot folosi egalitatea sau semnele mai mic / mai mare.

Exemplu verificat
Dacă temperatura este mai mică decât 0, afișează „îngheț”; altfel afișează „fără îngheț”. La -2 rezultatul este „îngheț”; la 0 rezultatul este „fără îngheț”.

Test la limită
Valoarea exactă de la graniță, aici 0, este esențială. Înainte de programare, notează ce se întâmplă atât când condiția este adevărată, cât și când este falsă.`,
 'repetition':`Repetiția evită copierea pașilor
O buclă repetă una sau mai multe instrucțiuni. Poți folosi un număr fix de repetări („de 5 ori”) sau poți repeta până când o condiție devine falsă.

Trasare
Pornește cu total=0. La fiecare din trei repetări adaugă 2. După prima ai 2, după a doua 4, după a treia 6. Un tabel cu numărul repetării și valoarea totalului te ajută să urmărești exact algoritmul.

Oprirea
Bucla trebuie să aibă o condiție de terminare. Dacă această condiție nu se modifică niciodată, o buclă poate deveni infinită. Testează valorile inițiale și cazul cu zero repetări.`,
 'files':`Fișier, folder și cale
Un fișier reprezintă un conținut salvat sub un nume, de exemplu „tema.pdf”. Un folder grupează fișiere și subfoldere. O cale arată unde se află un fișier în structura dispozitivului.

Extensiile
.pdf este folosit pentru documente, .png pentru imagini, .txt pentru text. Extensia ajută la recunoaștere, dar nu demonstrează că un fișier este sigur. Evită să deschizi atașamente neașteptate.

Exersează
Creează structura Școală → Informatică → Tema1 și propune nume clare pentru documente. Explică de ce un fișier cu numele „final-final2” este mai greu de găsit.`,
 'search':`Căutare și verificare
Un motor de căutare găsește pagini pe baza cuvintelor introduse. Rezultatele sunt selectate și ordonate automat; primul rezultat nu este neapărat cel mai corect.

Metodă
Formulează cuvinte-cheie precise. Verifică autorul, instituția, data publicării și dacă alte surse independente confirmă informația. Pentru o definiție tehnică, preferă documentația originală.

Exercițiu
Caută aceeași informație prin două formulări și compară de ce apar pagini diferite. Nu copia un răspuns fără să înțelegi sursa.`,
 'spreadsheets':`Ce este un tabel de calcul
O foaie de calcul conține rânduri, coloane și celule. O celulă poate avea text, numere sau formule. O formulă începe de regulă cu semnul = și calculează folosind valorile celulelor.

Exemplu
Dacă A1=5 și A2=7, formula =A1+A2 produce 12. Schimbarea valorii A1 poate actualiza automat rezultatul. Un grafic poate ajuta la compararea valorilor.

Lucrul corect
Scrie titluri explicite, nu amesteca unitățile de măsură, verifică datele introduse și nu afișa informații personale în tabele distribuite public.`,
 'passwords':`Parole și autentificare
O parolă protejează accesul la cont. Folosește parole lungi și unice pentru fiecare serviciu. Un manager de parole poate crea și stoca în siguranță parole diferite.

Autentificare suplimentară
Un al doilea factor, precum un cod în aplicație sau o cheie de securitate, reduce riscul dacă parola este furată. Nu comunica nimănui codurile de autentificare.

Activitate
Compară o parolă scurtă reutilizată cu o expresie lungă și unică, fără să folosești parolele tale reale în exercițiu.`,
 'phishing':`Cum recunoști o înșelătorie
Phishing înseamnă încercarea de a obține parole, bani sau date prin mesaje care imită persoane ori instituții. Indicii frecvente sunt urgența artificială, adrese neobișnuite și solicitarea unui cod secret.

Procedură sigură
Nu folosi linkul din mesajul suspect. Deschide separat aplicația sau site-ul oficial și verifică informația. Raportează mesajul dacă este necesar.

Exercițiu
Analizează un mesaj fictiv care amenință cu blocarea contului. Identifică două semnale de alarmă și o modalitate sigură de verificare.`,
 'digital-footprint':`Ce rămâne după publicare
Amprenta digitală include fotografii, comentarii, conturi și informații colectate despre activitatea online. Unele materiale pot fi copiate înainte să le ștergi.

Protecție
Verifică setările de confidențialitate, publică doar ce este necesar și cere permisiunea altor persoane înainte de a posta date sau imagini despre ele.

Exercițiu
Compară ce informații ar trebui să fie publice și ce informații ar trebui păstrate private într-un profil școlar fictiv.`,
 'lower-sequences':`Instrucțiuni precise și executare
Un algoritm descrie pași finiți, neambigui, cu intrări și rezultate. În pseudocod, un algoritm poate fi citit și verificat independent de limbajul de programare.

Exemplu pas cu pas
Pentru media numerelor 3, 6 și 9: citește cele trei numere; suma devine 18; împarte 18 la 3; afișează 6. Dacă programul primește alte valori, pașii rămân identici.

Verificare
Scrie un tabel cu intrările, calculul și ieșirea. Găsește două intrări noi și aplică aceeași succesiune. Dacă nu poți determina rezultatul fără să ghicești, instrucțiunile nu sunt suficient de precise.`,
 'lower-conditions':`Expresii logice și ramificare
Operatorii de comparație (<, >, ==) testează valori. Rezultatul unei expresii logice este adevărat sau fals. În program, condiția determină dacă se execută ramura „dacă” sau „altfel”.

Exemplu
La testul „nota >= 5”, nota 7 duce pe ramura adevărată, nota 3 pe ramura falsă, iar nota 5 verifică limita. Compară rezultatul așteptat cu cel obținut.

Condiții compuse
Două condiții pot fi reunite cu „și”, când trebuie îndeplinite amândouă, sau cu „sau”, când este suficientă una. Verifică fiecare caz, nu doar exemplul în care condiția este adevărată.`,
 'lower-loops':`Cum funcționează o buclă
O buclă „pentru” este potrivită când știi numărul de repetări. O buclă „cât timp” continuă doar când condiția sa rămâne adevărată.

Trasare manuală
Pentru total=0 și cinci repetări ale instrucțiunii total=total+2, valorile sunt 2,4,6,8,10. Tabelul repetare → valoare previne greșelile de numărare.

Erori obișnuite
Verifică inițializarea, actualizarea și condiția de oprire. Dacă indicele nu se modifică, bucla poate să nu se termine.`,
 'lower-variables':`Memorie și valori
O variabilă este un nume asociat unei valori. Atribuirea schimbă conținutul variabilei, spre deosebire de egalitatea din matematică, unde semnul = exprimă o relație.

Exemplu urmărit
După n=2, expresia n=n+4 citește vechea valoare 2 și memorează 6. Apoi n=n*2 produce 12. Creează un tabel al valorilor după fiecare instrucțiune.

Tipuri de date
Un număr, un text și o valoare adevărat/fals au utilizări diferite. Textul „5” nu trebuie confundat cu numărul 5 la adunare.`,
 'lower-python':`Programare Python – prima lecție
Python este un limbaj de programare interpretat. Un program este format din instrucțiuni pe care interpretul le citește conform regulilor limbajului. O comandă nu funcționează doar pentru că seamănă cu o propoziție în română.

Afișarea pe ecran
print("Salut") afișează Salut. print(2+3) afișează 5, în timp ce print("2"+"3") afișează textul 23. Ghilimelele transformă conținutul în șir de caractere.

Variabile și tipuri
n=5 memorează numărul 5. print(n*2) afișează 10. Poți modifica n printr-o atribuire nouă și apoi reafișa valoarea.

Indentare și erori
După o instrucțiune if, blocul asociat trebuie indentat corespunzător. Codul din lecție este explicat static: aplicația nu pretinde că l-a executat. Scrie trei instrucțiuni și prezice ieșirea înainte de a le testa într-un mediu Python.`,
 'lower-debug':`Tipuri de erori
O eroare de sintaxă încalcă regulile limbajului; o eroare de logică produce un rezultat greșit chiar dacă programul rulează; o eroare de intrare apare când programul nu tratează valori neașteptate.

Metodă sistematică
Reproduce eroarea cu un exemplu mic. Notează intrarea, rezultatul așteptat și rezultatul obținut. Caută instrucțiunea unde valorile diferă; corectează doar cauza și rulează din nou testele.

Valori-limită
Pentru verificarea numerelor pare testează 0, 1, 2, un număr negativ și un număr mare. Un singur caz corect nu garantează funcționarea tuturor cazurilor.`,
 'lower-data':`Date binare și fișiere
Un bit poate avea valoarea 0 sau 1. Opt biți alcătuiesc un octet. Calculatoarele folosesc codificări pentru a reprezenta litere, numere, imagini și sunete.

Exemplu de reprezentare
Numărul zecimal 5 poate fi scris 101 în baza 2. Textul are nevoie de o codificare, precum UTF-8, pentru a fi stocat și citit corect.

Compresie și formate
PNG și JPEG stochează imagini folosind metode diferite. Compresia cu pierderi poate reduce dimensiunea, dar poate elimina detalii. Compară două fișiere după format, dimensiune și fidelitate.`,
 'lower-privacy':`Date personale și surse verificate
Datele personale pot identifica direct sau indirect o persoană. Partajarea numelui, adresei sau locației precise poate avea consecințe asupra confidențialității.

Permisiuni
O aplicație ar trebui să primească doar permisiunile necesare. De exemplu, un calculator de buzunar nu are în mod normal nevoie de acces la contacte.

Evaluarea sursei
Verifică cine publică o informație, când și cu ce dovezi. Pentru mesaje ce cer urgent coduri de autentificare, nu răspunde și verifică separat serviciul oficial.`,
 'lower-project':`Structura unui proiect digital
Un proiect are scop, cerințe, date, metodă, rezultate și verificare. Un proiect bun poate fi reprodus de o altă persoană pornind de la pașii documentați.

Exemplu: temperaturile din cinci zile
Creează date fictive 12,14,11,15,13 °C. Suma este 65, iar media este 13 °C. Reprezintă datele într-un tabel sau grafic, precizează că sunt fictive și nu le prezenta ca măsurători reale.

Verificarea rezultatului
Controlează formulele, unitățile și intervalele. Arată o limitare: cinci valori nu descriu clima unei regiuni. Încheie cu o concluzie bazată pe date.`
};
Object.assign(COMPUTING_DEEP_THEORY,COMPUTING_EXTENDED_THEORY);
for(const topic of COMPUTING_TOPICS){
 const extra=COMPUTING_DEEP_THEORY[topic.id];
 if(extra)topic.theory=topic.theory+'\n\n'+extra;
}
