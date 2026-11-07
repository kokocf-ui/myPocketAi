// Offline Chemistry preview catalogue. No requests, no billing, no automatic synthesis.
// Levels: beginner (grades VII–VIII), intermediate (IX–XII), advanced (university+).
export const CHEMISTRY_LEVELS = Object.freeze([
 {id:'beginner',ro:'Începător',en:'Beginner',scopeRo:'Gimnaziu · clasele VII–VIII',scopeEn:'Lower secondary · grades 7–8'},
 {id:'intermediate',ro:'Mediu',en:'Intermediate',scopeRo:'Liceu · clasele IX–XII',scopeEn:'Upper secondary · grades 9–12'},
 {id:'advanced',ro:'Avansat',en:'Advanced',scopeRo:'Universitate și mai departe',scopeEn:'University and beyond'}
]);
export const CHEMISTRY_TOPICS = Object.freeze([
  {
    "id": "fundamentals",
    "ro": "Materie și laborator",
    "en": "Matter & laboratory",
    "minLevel": "beginner"
  },
  {
    "id": "atomic",
    "ro": "Atomul și structura materiei",
    "en": "Atomic structure",
    "minLevel": "beginner"
  },
  {
    "id": "periodic",
    "ro": "Sistemul periodic",
    "en": "Periodic table",
    "minLevel": "beginner"
  },
  {
    "id": "bonding",
    "ro": "Legături și structuri",
    "en": "Bonding & structure",
    "minLevel": "beginner"
  },
  {
    "id": "reactions",
    "ro": "Reacții și ecuații chimice",
    "en": "Chemical reactions",
    "minLevel": "beginner"
  },
  {
    "id": "inorganic",
    "ro": "Chimie anorganică",
    "en": "Inorganic chemistry",
    "minLevel": "beginner"
  },
  {
    "id": "solutions",
    "ro": "Soluții și calcule chimice",
    "en": "Solutions & calculations",
    "minLevel": "beginner"
  },
  {
    "id": "acids",
    "ro": "Acizi, baze și echilibre",
    "en": "Acids, bases & equilibria",
    "minLevel": "beginner"
  },
  {
    "id": "organic",
    "ro": "Chimie organică",
    "en": "Organic chemistry",
    "minLevel": "intermediate"
  },
  {
    "id": "physical",
    "ro": "Termochimie și cinetică",
    "en": "Physical chemistry",
    "minLevel": "intermediate"
  },
  {
    "id": "electrochem",
    "ro": "Oxidare, reducere și electrochimie",
    "en": "Redox & electrochemistry",
    "minLevel": "intermediate"
  },
  {
    "id": "analytical",
    "ro": "Chimie analitică",
    "en": "Analytical chemistry",
    "minLevel": "intermediate"
  },
  {
    "id": "biochemistry",
    "ro": "Biochimie, mediu și materiale",
    "en": "Biochemistry, environment & materials",
    "minLevel": "intermediate"
  },
  {
    "id": "advanced",
    "ro": "Chimie universitară avansată",
    "en": "Advanced university chemistry",
    "minLevel": "advanced"
  }
]);
export const CHEMISTRY_LESSONS = Object.freeze([
  {
    "id": "chem-new-001",
    "subject": "chemistry",
    "topic": "fundamentals",
    "level": "beginner",
    "title": "Materia",
    "statement": "Materia are masă și ocupă spațiu. Poate exista în stări de agregare diferite.",
    "formula": "m>0",
    "aliases": [
      "materie"
    ]
  },
  {
    "id": "chem-new-002",
    "subject": "chemistry",
    "topic": "fundamentals",
    "level": "beginner",
    "title": "Substanță pură",
    "statement": "O substanță pură are compoziție chimică definită; poate fi element sau compus.",
    "formula": "—",
    "aliases": [
      "substanta pura"
    ]
  },
  {
    "id": "chem-new-003",
    "subject": "chemistry",
    "topic": "fundamentals",
    "level": "beginner",
    "title": "Amestec",
    "statement": "Un amestec conține cel puțin două substanțe fără o legătură chimică obligatorie între ele.",
    "formula": "—",
    "aliases": [
      "amestec substante"
    ]
  },
  {
    "id": "chem-new-004",
    "subject": "chemistry",
    "topic": "fundamentals",
    "level": "beginner",
    "title": "Amestec omogen",
    "statement": "Un amestec omogen prezintă aceeași compoziție macroscopică în toate regiunile sale.",
    "formula": "—",
    "aliases": [
      "omogen"
    ]
  },
  {
    "id": "chem-new-005",
    "subject": "chemistry",
    "topic": "fundamentals",
    "level": "beginner",
    "title": "Amestec eterogen",
    "statement": "Un amestec eterogen prezintă faze sau regiuni cu proprietăți diferite.",
    "formula": "—",
    "aliases": [
      "eterogen"
    ]
  },
  {
    "id": "chem-new-006",
    "subject": "chemistry",
    "topic": "fundamentals",
    "level": "beginner",
    "title": "Element chimic",
    "statement": "Un element chimic este definit de numărul protonilor din nucleele atomilor săi.",
    "formula": "Z=numărul protonilor",
    "aliases": [
      "element"
    ]
  },
  {
    "id": "chem-new-007",
    "subject": "chemistry",
    "topic": "fundamentals",
    "level": "beginner",
    "title": "Compus chimic",
    "statement": "Un compus este o substanță alcătuită din atomi ai cel puțin două elemente în proporții chimice definite.",
    "formula": "H₂O, CO₂",
    "aliases": [
      "compus"
    ]
  },
  {
    "id": "chem-new-008",
    "subject": "chemistry",
    "topic": "fundamentals",
    "level": "beginner",
    "title": "Transformare fizică",
    "statement": "O transformare fizică modifică starea sau forma, fără să schimbe identitatea substanțelor.",
    "formula": "H₂O(s) → H₂O(l)",
    "aliases": [
      "topire"
    ]
  },
  {
    "id": "chem-new-009",
    "subject": "chemistry",
    "topic": "fundamentals",
    "level": "beginner",
    "title": "Transformare chimică",
    "statement": "O transformare chimică produce substanțe noi prin reorganizarea atomilor și a legăturilor.",
    "formula": "2H₂ + O₂ → 2H₂O",
    "aliases": [
      "reactie chimica"
    ]
  },
  {
    "id": "chem-new-010",
    "subject": "chemistry",
    "topic": "fundamentals",
    "level": "beginner",
    "title": "Stări de agregare",
    "statement": "Solidul are formă și volum propriu; lichidul are volum propriu; gazul ocupă volumul recipientului.",
    "formula": "solid ⇄ lichid ⇄ gaz",
    "aliases": [
      "stari agregare"
    ]
  },
  {
    "id": "chem-new-011",
    "subject": "chemistry",
    "topic": "fundamentals",
    "level": "beginner",
    "title": "Filtrarea",
    "statement": "Filtrarea separă în principal solide insolubile din fluide printr-un material poros.",
    "formula": "—",
    "aliases": [
      "separare filtrare"
    ]
  },
  {
    "id": "chem-new-012",
    "subject": "chemistry",
    "topic": "fundamentals",
    "level": "beginner",
    "title": "Decantarea",
    "statement": "Decantarea separă faze cu densități diferite după sedimentare sau stratificare.",
    "formula": "—",
    "aliases": [
      "separare decantare"
    ]
  },
  {
    "id": "chem-new-013",
    "subject": "chemistry",
    "topic": "fundamentals",
    "level": "beginner",
    "title": "Distilarea",
    "statement": "Distilarea separă componente volatile folosind diferențe de volatilitate și condensarea vaporilor.",
    "formula": "—",
    "aliases": [
      "separare distilare"
    ]
  },
  {
    "id": "chem-new-014",
    "subject": "chemistry",
    "topic": "fundamentals",
    "level": "beginner",
    "title": "Siguranța în laborator",
    "statement": "În laborator se citesc etichetele și fișele de securitate, se poartă protecție adecvată și nu se gustă substanțe.",
    "formula": "—",
    "aliases": [
      "protectie laborator"
    ]
  },
  {
    "id": "chem-new-015",
    "subject": "chemistry",
    "topic": "atomic",
    "level": "beginner",
    "title": "Atomul",
    "statement": "Atomul este alcătuit din nucleu cu protoni și neutroni și electroni în jurul nucleului.",
    "formula": "—",
    "aliases": [
      "structura atomului"
    ]
  },
  {
    "id": "chem-new-016",
    "subject": "chemistry",
    "topic": "atomic",
    "level": "beginner",
    "title": "Protonul",
    "statement": "Protonul are sarcină electrică pozitivă și se află în nucleul atomului.",
    "formula": "q_p=+e",
    "aliases": [
      "protoni"
    ]
  },
  {
    "id": "chem-new-017",
    "subject": "chemistry",
    "topic": "atomic",
    "level": "beginner",
    "title": "Neutronul",
    "statement": "Neutronul este neutru electric și se află în nucleul atomului.",
    "formula": "q_n=0",
    "aliases": [
      "neutroni"
    ]
  },
  {
    "id": "chem-new-018",
    "subject": "chemistry",
    "topic": "atomic",
    "level": "beginner",
    "title": "Electronul",
    "statement": "Electronul are sarcină electrică negativă și ocupă stări cuantice în atom.",
    "formula": "q_e=−e",
    "aliases": [
      "electroni"
    ]
  },
  {
    "id": "chem-new-019",
    "subject": "chemistry",
    "topic": "atomic",
    "level": "beginner",
    "title": "Numărul atomic",
    "statement": "Numărul atomic Z este numărul protonilor din nucleu.",
    "formula": "Z=p",
    "aliases": [
      "numar atomic"
    ]
  },
  {
    "id": "chem-new-020",
    "subject": "chemistry",
    "topic": "atomic",
    "level": "beginner",
    "title": "Numărul de masă",
    "statement": "Numărul de masă A este suma protonilor și neutronilor din nucleu.",
    "formula": "A=Z+N",
    "aliases": [
      "numar masa"
    ]
  },
  {
    "id": "chem-new-021",
    "subject": "chemistry",
    "topic": "atomic",
    "level": "beginner",
    "title": "Izotopii",
    "statement": "Izotopii aceluiași element au același Z, dar numere diferite de neutroni.",
    "formula": "Z constant, N diferit",
    "aliases": [
      "izotopi"
    ]
  },
  {
    "id": "chem-new-022",
    "subject": "chemistry",
    "topic": "atomic",
    "level": "beginner",
    "title": "Ionii",
    "statement": "Un ion este un atom sau grup de atomi cu sarcină netă după pierdere sau câștig de electroni.",
    "formula": "Na⁺, Cl⁻",
    "aliases": [
      "cation anion"
    ]
  },
  {
    "id": "chem-new-023",
    "subject": "chemistry",
    "topic": "atomic",
    "level": "intermediate",
    "title": "Orbitalul atomic",
    "statement": "Orbitalul atomic descrie o stare cu o distribuție de probabilitate pentru electron.",
    "formula": "ψ, |ψ|²",
    "aliases": [
      "orbital"
    ]
  },
  {
    "id": "chem-new-024",
    "subject": "chemistry",
    "topic": "atomic",
    "level": "intermediate",
    "title": "Configurația electronică",
    "statement": "Configurația electronică indică ocuparea orbitalilor de către electronii unui atom.",
    "formula": "O: 1s² 2s² 2p⁴",
    "aliases": [
      "configuratie electronica"
    ]
  },
  {
    "id": "chem-new-025",
    "subject": "chemistry",
    "topic": "atomic",
    "level": "intermediate",
    "title": "Stratul de valență",
    "statement": "Electronii de valență participă în mod esențial la legăturile chimice și reactivitate.",
    "formula": "—",
    "aliases": [
      "electroni valenta"
    ]
  },
  {
    "id": "chem-new-026",
    "subject": "chemistry",
    "topic": "atomic",
    "level": "advanced",
    "title": "Numere cuantice",
    "statement": "Stările electronilor atomici sunt caracterizate, în modelul orbital, prin numerele cuantice n, l, m_l și m_s.",
    "formula": "n, l, m_l, m_s",
    "aliases": [
      "numere cuantice atom"
    ]
  },
  {
    "id": "chem-new-027",
    "subject": "chemistry",
    "topic": "periodic",
    "level": "beginner",
    "title": "Tabelul periodic",
    "statement": "Elementele sunt ordonate în sistemul periodic după numărul atomic crescător.",
    "formula": "Z crescător",
    "aliases": [
      "sistem periodic"
    ]
  },
  {
    "id": "chem-new-028",
    "subject": "chemistry",
    "topic": "periodic",
    "level": "beginner",
    "title": "Grupa",
    "statement": "Elementele din aceeași coloană sunt grupate după proprietăți chimice asemănătoare, cu excepții.",
    "formula": "—",
    "aliases": [
      "grupe periodic"
    ]
  },
  {
    "id": "chem-new-029",
    "subject": "chemistry",
    "topic": "periodic",
    "level": "beginner",
    "title": "Perioada",
    "statement": "O perioadă este un rând al tabelului periodic.",
    "formula": "—",
    "aliases": [
      "perioade periodic"
    ]
  },
  {
    "id": "chem-new-030",
    "subject": "chemistry",
    "topic": "periodic",
    "level": "beginner",
    "title": "Metalele",
    "statement": "Metalele au în general conductivitate electrică bună, luciu metalic și tind să formeze cationi.",
    "formula": "—",
    "aliases": [
      "metal"
    ]
  },
  {
    "id": "chem-new-031",
    "subject": "chemistry",
    "topic": "periodic",
    "level": "beginner",
    "title": "Nemetalele",
    "statement": "Nemetalele au proprietăți variate și formează adesea legături covalente.",
    "formula": "—",
    "aliases": [
      "nemetal"
    ]
  },
  {
    "id": "chem-new-032",
    "subject": "chemistry",
    "topic": "periodic",
    "level": "beginner",
    "title": "Gazele nobile",
    "statement": "Gazele nobile sunt elemente din grupa 18 cu reactivitate de obicei redusă.",
    "formula": "He, Ne, Ar",
    "aliases": [
      "gaze nobile"
    ]
  },
  {
    "id": "chem-new-033",
    "subject": "chemistry",
    "topic": "periodic",
    "level": "intermediate",
    "title": "Raza atomică periodică",
    "statement": "Raza atomică variază periodic cu structura electronică; în general scade pe perioadă spre dreapta.",
    "formula": "—",
    "aliases": [
      "tendinte raza atomica"
    ]
  },
  {
    "id": "chem-new-034",
    "subject": "chemistry",
    "topic": "periodic",
    "level": "intermediate",
    "title": "Electronegativitatea",
    "statement": "Electronegativitatea este tendința unui atom dintr-o legătură de a atrage densitatea electronică.",
    "formula": "χ",
    "aliases": [
      "electronegativitate"
    ]
  },
  {
    "id": "chem-new-035",
    "subject": "chemistry",
    "topic": "periodic",
    "level": "intermediate",
    "title": "Energia de ionizare",
    "statement": "Energia de ionizare este energia necesară desprinderii unui electron dintr-un atom sau ion în stare gazoasă.",
    "formula": "M(g) → M⁺(g)+e⁻",
    "aliases": [
      "ionizare"
    ]
  },
  {
    "id": "chem-new-036",
    "subject": "chemistry",
    "topic": "periodic",
    "level": "intermediate",
    "title": "Halogenii",
    "statement": "Halogenii sunt elementele grupei 17 și formează adesea anioni cu sarcina −1.",
    "formula": "F, Cl, Br, I",
    "aliases": [
      "halogeni"
    ]
  },
  {
    "id": "chem-new-037",
    "subject": "chemistry",
    "topic": "periodic",
    "level": "intermediate",
    "title": "Metalele alcaline",
    "statement": "Metalele alcaline sunt elementele grupei 1, cu excepția hidrogenului, și au frecvent starea de oxidare +1.",
    "formula": "Li, Na, K",
    "aliases": [
      "alcaline"
    ]
  },
  {
    "id": "chem-new-038",
    "subject": "chemistry",
    "topic": "bonding",
    "level": "beginner",
    "title": "Legătura chimică",
    "statement": "O legătură chimică este interacțiunea care stabilizează asocierea unor atomi sau ioni.",
    "formula": "—",
    "aliases": [
      "legatura"
    ]
  },
  {
    "id": "chem-new-039",
    "subject": "chemistry",
    "topic": "bonding",
    "level": "beginner",
    "title": "Legătura ionică",
    "statement": "Legătura ionică implică atracția electrostatică între ioni cu sarcini opuse.",
    "formula": "Na⁺ + Cl⁻ → NaCl(s)",
    "aliases": [
      "ionica"
    ]
  },
  {
    "id": "chem-new-040",
    "subject": "chemistry",
    "topic": "bonding",
    "level": "beginner",
    "title": "Legătura covalentă",
    "statement": "Legătura covalentă implică participarea comună a electronilor între atomi.",
    "formula": "H—H",
    "aliases": [
      "covalenta"
    ]
  },
  {
    "id": "chem-new-041",
    "subject": "chemistry",
    "topic": "bonding",
    "level": "beginner",
    "title": "Legătura metalică",
    "statement": "În metale, electronii de valență sunt delocalizați în structura cristalină.",
    "formula": "—",
    "aliases": [
      "metalica"
    ]
  },
  {
    "id": "chem-new-042",
    "subject": "chemistry",
    "topic": "bonding",
    "level": "intermediate",
    "title": "Legătura covalentă polară",
    "statement": "Într-o legătură covalentă polară, densitatea electronică este distribuită inegal între atomi.",
    "formula": "δ⁺—δ⁻",
    "aliases": [
      "polaritate"
    ]
  },
  {
    "id": "chem-new-043",
    "subject": "chemistry",
    "topic": "bonding",
    "level": "intermediate",
    "title": "Legătura de hidrogen",
    "statement": "Legătura de hidrogen este o interacțiune direcțională care implică de regulă un H legat de N, O sau F și un acceptor.",
    "formula": "O—H···O",
    "aliases": [
      "hidrogen"
    ]
  },
  {
    "id": "chem-new-044",
    "subject": "chemistry",
    "topic": "bonding",
    "level": "intermediate",
    "title": "Regula octetului",
    "statement": "Multe elemente reprezentative tind să adopte opt electroni de valență în structuri stabile; există excepții.",
    "formula": "8 e⁻ de valență",
    "aliases": [
      "octet"
    ]
  },
  {
    "id": "chem-new-045",
    "subject": "chemistry",
    "topic": "bonding",
    "level": "intermediate",
    "title": "Structura Lewis",
    "statement": "Structurile Lewis reprezintă electronii de valență prin perechi de legătură și perechi neparticipante.",
    "formula": "H:O:H",
    "aliases": [
      "lewis"
    ]
  },
  {
    "id": "chem-new-046",
    "subject": "chemistry",
    "topic": "bonding",
    "level": "intermediate",
    "title": "Geometria VSEPR",
    "statement": "Modelul VSEPR estimează geometria locală din repulsia domeniilor electronice.",
    "formula": "AX₂, AX₃, AX₄",
    "aliases": [
      "vsepr"
    ]
  },
  {
    "id": "chem-new-047",
    "subject": "chemistry",
    "topic": "bonding",
    "level": "advanced",
    "title": "Hibridizarea orbitalilor",
    "statement": "Modelul hibridizării descrie anumite orientări ale orbitalilor de legătură prin combinații de orbitali atomici.",
    "formula": "sp, sp², sp³",
    "aliases": [
      "hibridizare"
    ]
  },
  {
    "id": "chem-new-048",
    "subject": "chemistry",
    "topic": "bonding",
    "level": "advanced",
    "title": "Orbitali moleculari",
    "statement": "Modelul orbitalilor moleculari descrie electroni delocalizați peste întreaga moleculă.",
    "formula": "σ, π, σ*, π*",
    "aliases": [
      "molecular orbital"
    ]
  },
  {
    "id": "chem-new-049",
    "subject": "chemistry",
    "topic": "reactions",
    "level": "beginner",
    "title": "Ecuația chimică",
    "statement": "Ecuația chimică redă simbolic reactanții, produșii și coeficienții stoechiometrici.",
    "formula": "reactanți → produși",
    "aliases": [
      "ecuatie reactie"
    ]
  },
  {
    "id": "chem-new-050",
    "subject": "chemistry",
    "topic": "reactions",
    "level": "beginner",
    "title": "Egalarea ecuațiilor",
    "statement": "Coeficienții unei ecuații se aleg astfel încât numărul atomilor fiecărui element să fie conservat.",
    "formula": "2H₂ + O₂ → 2H₂O",
    "aliases": [
      "egalare ecuatii"
    ]
  },
  {
    "id": "chem-new-051",
    "subject": "chemistry",
    "topic": "reactions",
    "level": "beginner",
    "title": "Reacția de combinare",
    "statement": "Într-o reacție de combinare, mai mulți reactanți formează un produs principal.",
    "formula": "A+B → AB",
    "aliases": [
      "sinteza"
    ]
  },
  {
    "id": "chem-new-052",
    "subject": "chemistry",
    "topic": "reactions",
    "level": "beginner",
    "title": "Reacția de descompunere",
    "statement": "O specie chimică se transformă în două sau mai multe specii produse.",
    "formula": "AB → A+B",
    "aliases": [
      "descompunere"
    ]
  },
  {
    "id": "chem-new-053",
    "subject": "chemistry",
    "topic": "reactions",
    "level": "beginner",
    "title": "Reacția de substituție",
    "statement": "Un element sau grup de atomi înlocuiește altul într-un compus.",
    "formula": "A+BC → AC+B",
    "aliases": [
      "substitutie"
    ]
  },
  {
    "id": "chem-new-054",
    "subject": "chemistry",
    "topic": "reactions",
    "level": "beginner",
    "title": "Reacția de schimb",
    "statement": "Într-o reacție de dublu schimb, ionii sau grupurile de atomi sunt redistribuite între compuși.",
    "formula": "AB+CD → AD+CB",
    "aliases": [
      "dublu schimb"
    ]
  },
  {
    "id": "chem-new-055",
    "subject": "chemistry",
    "topic": "reactions",
    "level": "beginner",
    "title": "Precipitarea",
    "statement": "Într-o reacție de precipitare se formează un solid slab solubil dintr-o soluție.",
    "formula": "Ag⁺+Cl⁻ → AgCl(s)",
    "aliases": [
      "precipitat"
    ]
  },
  {
    "id": "chem-new-056",
    "subject": "chemistry",
    "topic": "reactions",
    "level": "beginner",
    "title": "Combustia",
    "statement": "Combustia este o reacție de oxidare, de obicei puternic exotermă, adesea cu oxigen.",
    "formula": "CH₄+2O₂ → CO₂+2H₂O",
    "aliases": [
      "ardere"
    ]
  },
  {
    "id": "chem-new-057",
    "subject": "chemistry",
    "topic": "reactions",
    "level": "intermediate",
    "title": "Reacții reversibile",
    "statement": "Unele reacții se pot desfășura în ambele sensuri și pot atinge un echilibru dinamic.",
    "formula": "A+B ⇌ C+D",
    "aliases": [
      "reversibil"
    ]
  },
  {
    "id": "chem-new-058",
    "subject": "chemistry",
    "topic": "reactions",
    "level": "intermediate",
    "title": "Reactiv limitant",
    "statement": "Reactivul limitant este reactantul care se consumă primul pentru stoechiometria specificată și limitează cantitatea de produs.",
    "formula": "n_produs=min(n_i/ν_i)·ν_produs",
    "aliases": [
      "limitant"
    ]
  },
  {
    "id": "chem-new-059",
    "subject": "chemistry",
    "topic": "reactions",
    "level": "intermediate",
    "title": "Randamentul reacției",
    "statement": "Randamentul procentual compară cantitatea reală de produs cu cantitatea teoretic posibilă.",
    "formula": "η=100·m_real/m_teoretic",
    "aliases": [
      "randament reactie"
    ]
  },
  {
    "id": "chem-new-060",
    "subject": "chemistry",
    "topic": "reactions",
    "level": "intermediate",
    "title": "Energia de activare",
    "statement": "Energia de activare caracterizează bariera energetică a procesului chimic pentru un mecanism dat.",
    "formula": "Eₐ",
    "aliases": [
      "activare"
    ]
  },
  {
    "id": "chem-new-061",
    "subject": "chemistry",
    "topic": "inorganic",
    "level": "beginner",
    "title": "Oxizii",
    "statement": "Oxizii sunt compuși binari ai oxigenului cu un alt element, cu anumite excepții de clasificare.",
    "formula": "MgO, CO₂",
    "aliases": [
      "oxizi"
    ]
  },
  {
    "id": "chem-new-062",
    "subject": "chemistry",
    "topic": "inorganic",
    "level": "beginner",
    "title": "Acizii",
    "statement": "Acizii sunt substanțe care pot dona protoni sau forma H₃O⁺ în apă, în funcție de model.",
    "formula": "HCl, H₂SO₄",
    "aliases": [
      "acizi"
    ]
  },
  {
    "id": "chem-new-063",
    "subject": "chemistry",
    "topic": "inorganic",
    "level": "beginner",
    "title": "Bazele",
    "statement": "Bazele pot accepta protoni, iar unele baze dizolvate în apă furnizează ioni OH⁻.",
    "formula": "NaOH, NH₃",
    "aliases": [
      "baze"
    ]
  },
  {
    "id": "chem-new-064",
    "subject": "chemistry",
    "topic": "inorganic",
    "level": "beginner",
    "title": "Sărurile",
    "statement": "Sărurile sunt compuși ionici alcătuiți din cationi și anioni.",
    "formula": "NaCl, CaCO₃",
    "aliases": [
      "saruri"
    ]
  },
  {
    "id": "chem-new-065",
    "subject": "chemistry",
    "topic": "inorganic",
    "level": "beginner",
    "title": "Hidroxizii",
    "statement": "Hidroxizii conțin gruparea OH⁻; proprietățile variază cu cationul.",
    "formula": "Ca(OH)₂",
    "aliases": [
      "hidroxizi"
    ]
  },
  {
    "id": "chem-new-066",
    "subject": "chemistry",
    "topic": "inorganic",
    "level": "intermediate",
    "title": "Acidul sulfuric",
    "statement": "Acidul sulfuric este un acid diprotic puternic în prima etapă de disociere.",
    "formula": "H₂SO₄",
    "aliases": [
      "sulfuric"
    ]
  },
  {
    "id": "chem-new-067",
    "subject": "chemistry",
    "topic": "inorganic",
    "level": "intermediate",
    "title": "Acidul azotic",
    "statement": "Acidul azotic este un acid tare și poate manifesta proprietăți oxidante.",
    "formula": "HNO₃",
    "aliases": [
      "azotic"
    ]
  },
  {
    "id": "chem-new-068",
    "subject": "chemistry",
    "topic": "inorganic",
    "level": "intermediate",
    "title": "Amoniacul",
    "statement": "Amoniacul este un compus molecular care se comportă ca bază slabă în apă.",
    "formula": "NH₃+H₂O ⇌ NH₄⁺+OH⁻",
    "aliases": [
      "amoniac"
    ]
  },
  {
    "id": "chem-new-069",
    "subject": "chemistry",
    "topic": "inorganic",
    "level": "intermediate",
    "title": "Apa ca solvent",
    "statement": "Apa este un solvent polar și poate dizolva multe substanțe ionice și polare.",
    "formula": "H₂O",
    "aliases": [
      "solvent apa"
    ]
  },
  {
    "id": "chem-new-070",
    "subject": "chemistry",
    "topic": "inorganic",
    "level": "advanced",
    "title": "Compuși de coordinație",
    "statement": "Compușii de coordinație conțin un centru metalic și liganzi care îi donează perechi de electroni.",
    "formula": "[Cu(NH₃)₄]²⁺",
    "aliases": [
      "complexi"
    ]
  },
  {
    "id": "chem-new-071",
    "subject": "chemistry",
    "topic": "inorganic",
    "level": "advanced",
    "title": "Numărul de coordinare",
    "statement": "Numărul de coordinare este numărul atomilor donori legați direct de centrul metalic.",
    "formula": "NC",
    "aliases": [
      "coordonare"
    ]
  },
  {
    "id": "chem-new-072",
    "subject": "chemistry",
    "topic": "solutions",
    "level": "beginner",
    "title": "Dizolvarea",
    "statement": "Dizolvarea este dispersia unui solut într-un solvent pentru a forma o soluție.",
    "formula": "solut+solvent → soluție",
    "aliases": [
      "solutie dizolvare"
    ]
  },
  {
    "id": "chem-new-073",
    "subject": "chemistry",
    "topic": "solutions",
    "level": "beginner",
    "title": "Solubilitatea",
    "statement": "Solubilitatea exprimă cantitatea maximă de solut care se poate dizolva la condiții specificate.",
    "formula": "S(T,p)",
    "aliases": [
      "solubilitate"
    ]
  },
  {
    "id": "chem-new-074",
    "subject": "chemistry",
    "topic": "solutions",
    "level": "beginner",
    "title": "Soluție saturată",
    "statement": "O soluție saturată este în echilibru cu solutul nedizolvat la condițiile date.",
    "formula": "—",
    "aliases": [
      "saturata"
    ]
  },
  {
    "id": "chem-new-075",
    "subject": "chemistry",
    "topic": "solutions",
    "level": "beginner",
    "title": "Concentrația procentuală masică",
    "statement": "Concentrația masică procentuală este raportul procentual dintre masa solutului și masa soluției.",
    "formula": "w%=100·m_solut/m_soluție",
    "aliases": [
      "concentratie procentuala"
    ]
  },
  {
    "id": "chem-new-076",
    "subject": "chemistry",
    "topic": "solutions",
    "level": "intermediate",
    "title": "Molul",
    "statement": "Molul este unitatea SI a cantității de substanță, corespunzătoare exact la 6,02214076×10²³ entități specificate.",
    "formula": "N=nN_A",
    "aliases": [
      "mol"
    ]
  },
  {
    "id": "chem-new-077",
    "subject": "chemistry",
    "topic": "solutions",
    "level": "intermediate",
    "title": "Masa molară",
    "statement": "Masa molară este raportul dintre masa unei substanțe și cantitatea ei de substanță.",
    "formula": "M=m/n",
    "aliases": [
      "masa molara"
    ]
  },
  {
    "id": "chem-new-078",
    "subject": "chemistry",
    "topic": "solutions",
    "level": "intermediate",
    "title": "Concentrația molară",
    "statement": "Concentrația molară este raportul dintre cantitatea de solut și volumul soluției.",
    "formula": "c=n/V",
    "aliases": [
      "molaritate"
    ]
  },
  {
    "id": "chem-new-079",
    "subject": "chemistry",
    "topic": "solutions",
    "level": "intermediate",
    "title": "Diluția soluțiilor",
    "statement": "La diluție fără pierderi de solut, cantitatea de solut rămâne constantă.",
    "formula": "c₁V₁=c₂V₂",
    "aliases": [
      "dilutie"
    ]
  },
  {
    "id": "chem-new-080",
    "subject": "chemistry",
    "topic": "solutions",
    "level": "intermediate",
    "title": "Fracția molară",
    "statement": "Fracția molară este raportul dintre cantitatea unui component și suma cantităților tuturor componentelor.",
    "formula": "xᵢ=nᵢ/Σnⱼ",
    "aliases": [
      "fractie molara"
    ]
  },
  {
    "id": "chem-new-081",
    "subject": "chemistry",
    "topic": "solutions",
    "level": "intermediate",
    "title": "Molalitatea",
    "statement": "Molalitatea este raportul dintre cantitatea solutului și masa solventului în kilograme.",
    "formula": "b=n_solut/m_solvent(kg)",
    "aliases": [
      "molalitate"
    ]
  },
  {
    "id": "chem-new-082",
    "subject": "chemistry",
    "topic": "solutions",
    "level": "intermediate",
    "title": "Volumul molar al gazului ideal",
    "statement": "Pentru gazul ideal, volumul molar depinde de temperatură și presiune.",
    "formula": "V_m=RT/p",
    "aliases": [
      "volum molar"
    ]
  },
  {
    "id": "chem-new-083",
    "subject": "chemistry",
    "topic": "solutions",
    "level": "advanced",
    "title": "Presiunea osmotică ideală",
    "statement": "Pentru o soluție diluată ideală, presiunea osmotică este proporțională cu concentrația particulelor și temperatura.",
    "formula": "Π=cRT",
    "aliases": [
      "osmoza"
    ]
  },
  {
    "id": "chem-new-084",
    "subject": "chemistry",
    "topic": "acids",
    "level": "beginner",
    "title": "Indicatorii acido-bazici",
    "statement": "Indicatorii acido-bazici prezintă schimbări de culoare în funcție de condițiile acido-bazice ale mediului.",
    "formula": "—",
    "aliases": [
      "indicatori"
    ]
  },
  {
    "id": "chem-new-085",
    "subject": "chemistry",
    "topic": "acids",
    "level": "beginner",
    "title": "Neutralizarea",
    "statement": "Într-o neutralizare acido-bazică, un acid reacționează cu o bază; în cazul H₃O⁺ și OH⁻ se formează apă.",
    "formula": "H₃O⁺+OH⁻ → 2H₂O",
    "aliases": [
      "neutralizare"
    ]
  },
  {
    "id": "chem-new-086",
    "subject": "chemistry",
    "topic": "acids",
    "level": "intermediate",
    "title": "Acidul Brønsted",
    "statement": "Acidul Brønsted este o specie capabilă să cedeze un proton.",
    "formula": "HA ⇌ H⁺+A⁻",
    "aliases": [
      "donor protoni"
    ]
  },
  {
    "id": "chem-new-087",
    "subject": "chemistry",
    "topic": "acids",
    "level": "intermediate",
    "title": "Baza Brønsted",
    "statement": "Baza Brønsted este o specie capabilă să accepte un proton.",
    "formula": "B+H⁺ ⇌ BH⁺",
    "aliases": [
      "acceptor protoni"
    ]
  },
  {
    "id": "chem-new-088",
    "subject": "chemistry",
    "topic": "acids",
    "level": "intermediate",
    "title": "Acidul Lewis",
    "statement": "Un acid Lewis este o specie capabilă să accepte o pereche de electroni.",
    "formula": "A+:B → A←B",
    "aliases": [
      "lewis acid"
    ]
  },
  {
    "id": "chem-new-089",
    "subject": "chemistry",
    "topic": "acids",
    "level": "intermediate",
    "title": "Baza Lewis",
    "statement": "O bază Lewis este o specie capabilă să doneze o pereche de electroni.",
    "formula": "B: → A",
    "aliases": [
      "lewis baza"
    ]
  },
  {
    "id": "chem-new-090",
    "subject": "chemistry",
    "topic": "acids",
    "level": "intermediate",
    "title": "Produsul ionic al apei",
    "statement": "În soluții apoase, activitățile ionilor H₃O⁺ și OH⁻ sunt legate de constanta autoprotolizei apei.",
    "formula": "K_w=a(H₃O⁺)·a(OH⁻)",
    "aliases": [
      "kw"
    ]
  },
  {
    "id": "chem-new-091",
    "subject": "chemistry",
    "topic": "acids",
    "level": "intermediate",
    "title": "Constanta de aciditate",
    "statement": "Constanta K_a exprimă echilibrul de disociere al unui acid în condiții specificate.",
    "formula": "K_a=a(H₃O⁺)a(A⁻)/a(HA)",
    "aliases": [
      "ka"
    ]
  },
  {
    "id": "chem-new-092",
    "subject": "chemistry",
    "topic": "acids",
    "level": "intermediate",
    "title": "Soluția tampon",
    "statement": "O soluție tampon limitează variația pH-ului la adaosuri moderate de acid sau bază.",
    "formula": "pH≈pK_a+log([A⁻]/[HA])",
    "aliases": [
      "tampon"
    ]
  },
  {
    "id": "chem-new-093",
    "subject": "chemistry",
    "topic": "acids",
    "level": "advanced",
    "title": "Titrarea acido-bazică",
    "statement": "Titrarea determină concentrația unei specii din cantitatea de reactiv etalon necesară la echivalență.",
    "formula": "ν_A·n_A=ν_B·n_B (raport stoechiometric)",
    "aliases": [
      "titrare"
    ]
  },
  {
    "id": "chem-new-094",
    "subject": "chemistry",
    "topic": "organic",
    "level": "intermediate",
    "title": "Hidrocarburile",
    "statement": "Hidrocarburile sunt compuși alcătuiți numai din carbon și hidrogen.",
    "formula": "CₓHᵧ",
    "aliases": [
      "hidrocarburi"
    ]
  },
  {
    "id": "chem-new-095",
    "subject": "chemistry",
    "topic": "organic",
    "level": "intermediate",
    "title": "Alcanii",
    "statement": "Alcanii aciclici saturați au numai legături simple C–C.",
    "formula": "CₙH₂ₙ₊₂",
    "aliases": [
      "alcani"
    ]
  },
  {
    "id": "chem-new-096",
    "subject": "chemistry",
    "topic": "organic",
    "level": "intermediate",
    "title": "Alchenele",
    "statement": "Alchenele sunt hidrocarburi cu una sau mai multe legături duble C=C.",
    "formula": "CₙH₂ₙ (aciclice, o dublă)",
    "aliases": [
      "alchene"
    ]
  },
  {
    "id": "chem-new-097",
    "subject": "chemistry",
    "topic": "organic",
    "level": "intermediate",
    "title": "Alchinele",
    "statement": "Alchinele au una sau mai multe legături triple C≡C.",
    "formula": "CₙH₂ₙ₋₂ (aciclice, o triplă)",
    "aliases": [
      "alchine"
    ]
  },
  {
    "id": "chem-new-098",
    "subject": "chemistry",
    "topic": "organic",
    "level": "intermediate",
    "title": "Aromaticele",
    "statement": "Compușii aromatici prezintă stabilizare electronică asociată unui sistem ciclic conjugat adecvat.",
    "formula": "C₆H₆",
    "aliases": [
      "benzen aromatic"
    ]
  },
  {
    "id": "chem-new-099",
    "subject": "chemistry",
    "topic": "organic",
    "level": "intermediate",
    "title": "Alcoolii",
    "statement": "Alcoolii au gruparea hidroxil legată de un carbon saturat.",
    "formula": "R—OH",
    "aliases": [
      "alcool"
    ]
  },
  {
    "id": "chem-new-100",
    "subject": "chemistry",
    "topic": "organic",
    "level": "intermediate",
    "title": "Fenolii",
    "statement": "Fenolii au gruparea OH legată direct de un nucleu aromatic.",
    "formula": "Ar—OH",
    "aliases": [
      "fenol"
    ]
  },
  {
    "id": "chem-new-101",
    "subject": "chemistry",
    "topic": "organic",
    "level": "intermediate",
    "title": "Aldehidele",
    "statement": "Aldehidele conțin o grupă carbonil terminală, legată de cel puțin un hidrogen.",
    "formula": "R—CHO",
    "aliases": [
      "aldehida"
    ]
  },
  {
    "id": "chem-new-102",
    "subject": "chemistry",
    "topic": "organic",
    "level": "intermediate",
    "title": "Cetonele",
    "statement": "Cetonele au o grupă carbonil legată de doi atomi de carbon.",
    "formula": "R—CO—R′",
    "aliases": [
      "cetona"
    ]
  },
  {
    "id": "chem-new-103",
    "subject": "chemistry",
    "topic": "organic",
    "level": "intermediate",
    "title": "Acizii carboxilici",
    "statement": "Acizii carboxilici conțin gruparea funcțională carboxil.",
    "formula": "R—COOH",
    "aliases": [
      "carboxilic"
    ]
  },
  {
    "id": "chem-new-104",
    "subject": "chemistry",
    "topic": "organic",
    "level": "intermediate",
    "title": "Esterii",
    "statement": "Esterii carboxilici au gruparea R—COO—R′.",
    "formula": "R—COO—R′",
    "aliases": [
      "ester"
    ]
  },
  {
    "id": "chem-new-105",
    "subject": "chemistry",
    "topic": "organic",
    "level": "intermediate",
    "title": "Aminele",
    "statement": "Aminele sunt derivați organici ai amoniacului, cu azot legat de grupări carbonice.",
    "formula": "R—NH₂",
    "aliases": [
      "amine"
    ]
  },
  {
    "id": "chem-new-106",
    "subject": "chemistry",
    "topic": "organic",
    "level": "intermediate",
    "title": "Amidele",
    "statement": "Amidele carboxilice conțin gruparea carbonil legată de un atom de azot.",
    "formula": "R—CONH₂",
    "aliases": [
      "amida"
    ]
  },
  {
    "id": "chem-new-107",
    "subject": "chemistry",
    "topic": "organic",
    "level": "intermediate",
    "title": "Izomeria structurală",
    "statement": "Izomerii structurali au aceeași formulă moleculară, dar conectivitate diferită între atomi.",
    "formula": "C₂H₆O: etanol / dimetileter",
    "aliases": [
      "izomeri"
    ]
  },
  {
    "id": "chem-new-108",
    "subject": "chemistry",
    "topic": "organic",
    "level": "advanced",
    "title": "Stereochimia",
    "statement": "Stereochimia studiază dispunerea spațială a atomilor și consecințele sale.",
    "formula": "R/S, E/Z",
    "aliases": [
      "stereoizomerie"
    ]
  },
  {
    "id": "chem-new-109",
    "subject": "chemistry",
    "topic": "organic",
    "level": "advanced",
    "title": "Chiralitatea",
    "statement": "O moleculă chirală nu este suprapunibilă pe imaginea ei în oglindă.",
    "formula": "enantiomeri",
    "aliases": [
      "chiral"
    ]
  },
  {
    "id": "chem-new-110",
    "subject": "chemistry",
    "topic": "physical",
    "level": "intermediate",
    "title": "Reacția exotermă",
    "statement": "O reacție exotermă cedează căldură mediului în condițiile specificate.",
    "formula": "ΔH<0 (la presiune constantă)",
    "aliases": [
      "exoterma"
    ]
  },
  {
    "id": "chem-new-111",
    "subject": "chemistry",
    "topic": "physical",
    "level": "intermediate",
    "title": "Reacția endotermă",
    "statement": "O reacție endotermă absoarbe căldură din mediu în condițiile specificate.",
    "formula": "ΔH>0 (la presiune constantă)",
    "aliases": [
      "endoterma"
    ]
  },
  {
    "id": "chem-new-112",
    "subject": "chemistry",
    "topic": "physical",
    "level": "intermediate",
    "title": "Entalpia",
    "statement": "Entalpia este mărimea termodinamică definită prin energia internă plus produsul presiune-volum.",
    "formula": "H=U+pV",
    "aliases": [
      "entalpie"
    ]
  },
  {
    "id": "chem-new-113",
    "subject": "chemistry",
    "topic": "physical",
    "level": "intermediate",
    "title": "Viteza de reacție",
    "statement": "Viteza de reacție este variația normalizată în timp a concentrației unei specii într-o reacție.",
    "formula": "v=−(1/ν_A)d[A]/dt",
    "aliases": [
      "viteza reactie"
    ]
  },
  {
    "id": "chem-new-114",
    "subject": "chemistry",
    "topic": "physical",
    "level": "intermediate",
    "title": "Catalizatorul",
    "statement": "Un catalizator schimbă viteza reacției printr-o cale diferită, fiind regenerat într-un ciclu ideal.",
    "formula": "—",
    "aliases": [
      "cataliza"
    ]
  },
  {
    "id": "chem-new-115",
    "subject": "chemistry",
    "topic": "physical",
    "level": "intermediate",
    "title": "Echilibrul chimic dinamic",
    "statement": "La echilibru chimic, vitezele transformărilor directe și inverse sunt egale pentru un sistem reversibil.",
    "formula": "v_direct=v_invers",
    "aliases": [
      "echilibru"
    ]
  },
  {
    "id": "chem-new-116",
    "subject": "chemistry",
    "topic": "physical",
    "level": "intermediate",
    "title": "Constanta de echilibru",
    "statement": "Constanta de echilibru exprimă raportul activităților produselor și reactanților la echilibru, cu puteri stoechiometrice.",
    "formula": "K=Π a_produși^ν / Π a_reactanți^ν",
    "aliases": [
      "constanta echilibru"
    ]
  },
  {
    "id": "chem-new-117",
    "subject": "chemistry",
    "topic": "physical",
    "level": "advanced",
    "title": "Entropia",
    "statement": "Entropia este funcția de stare care pentru o transformare reversibilă satisface dS=δQ_rev/T.",
    "formula": "dS=δQ_rev/T",
    "aliases": [
      "entropie"
    ]
  },
  {
    "id": "chem-new-118",
    "subject": "chemistry",
    "topic": "physical",
    "level": "advanced",
    "title": "Energia liberă Gibbs",
    "statement": "La temperatură și presiune constante, variația energiei Gibbs stabilește direcția spontană a procesului.",
    "formula": "G=H−TS",
    "aliases": [
      "gibbs"
    ]
  },
  {
    "id": "chem-new-119",
    "subject": "chemistry",
    "topic": "physical",
    "level": "advanced",
    "title": "Ecuația Arrhenius",
    "statement": "În multe reacții, dependența constantei de viteză de temperatură poate fi aproximată prin ecuația Arrhenius.",
    "formula": "k=A·e^(−Eₐ/RT)",
    "aliases": [
      "arrhenius"
    ]
  },
  {
    "id": "chem-new-120",
    "subject": "chemistry",
    "topic": "physical",
    "level": "advanced",
    "title": "Ecuația van't Hoff",
    "statement": "Variația constantei de echilibru cu temperatura este legată de entalpia standard a reacției.",
    "formula": "d(ln K)/dT=ΔᵣH°/(RT²)",
    "aliases": [
      "vant hoff"
    ]
  },
  {
    "id": "chem-new-121",
    "subject": "chemistry",
    "topic": "electrochem",
    "level": "intermediate",
    "title": "Numărul de oxidare",
    "statement": "Numărul de oxidare reprezintă sarcina formală atribuită atomului conform regulilor electronilor de legătură.",
    "formula": "—",
    "aliases": [
      "stare oxidare"
    ]
  },
  {
    "id": "chem-new-122",
    "subject": "chemistry",
    "topic": "electrochem",
    "level": "intermediate",
    "title": "Oxidarea",
    "statement": "Oxidarea este procesul prin care o specie pierde electroni, crescându-i numărul de oxidare.",
    "formula": "Fe²⁺ → Fe³⁺+e⁻",
    "aliases": [
      "oxidare"
    ]
  },
  {
    "id": "chem-new-123",
    "subject": "chemistry",
    "topic": "electrochem",
    "level": "intermediate",
    "title": "Reducerea",
    "statement": "Reducerea este procesul prin care o specie câștigă electroni, scăzându-i numărul de oxidare.",
    "formula": "Cu²⁺+2e⁻ → Cu",
    "aliases": [
      "reducere"
    ]
  },
  {
    "id": "chem-new-124",
    "subject": "chemistry",
    "topic": "electrochem",
    "level": "intermediate",
    "title": "Oxidantul",
    "statement": "Oxidantul este specia care acceptă electroni și se reduce.",
    "formula": "Ox+ne⁻ → Red",
    "aliases": [
      "agent oxidant"
    ]
  },
  {
    "id": "chem-new-125",
    "subject": "chemistry",
    "topic": "electrochem",
    "level": "intermediate",
    "title": "Reducătorul",
    "statement": "Reducătorul este specia care cedează electroni și se oxidează.",
    "formula": "Red → Ox+ne⁻",
    "aliases": [
      "agent reducator"
    ]
  },
  {
    "id": "chem-new-126",
    "subject": "chemistry",
    "topic": "electrochem",
    "level": "intermediate",
    "title": "Pile electrochimice",
    "statement": "O pilă galvanică transformă energia unei reacții redox spontane în energie electrică.",
    "formula": "E_celulă=E_catod−E_anod",
    "aliases": [
      "pila"
    ]
  },
  {
    "id": "chem-new-127",
    "subject": "chemistry",
    "topic": "electrochem",
    "level": "intermediate",
    "title": "Anodul",
    "statement": "Anodul este electrodul unde are loc oxidarea, în pile și în electroliză.",
    "formula": "oxidare la anod",
    "aliases": [
      "anod"
    ]
  },
  {
    "id": "chem-new-128",
    "subject": "chemistry",
    "topic": "electrochem",
    "level": "intermediate",
    "title": "Catodul",
    "statement": "Catodul este electrodul unde are loc reducerea, în pile și în electroliză.",
    "formula": "reducere la catod",
    "aliases": [
      "catod"
    ]
  },
  {
    "id": "chem-new-129",
    "subject": "chemistry",
    "topic": "electrochem",
    "level": "advanced",
    "title": "Ecuația lui Nernst",
    "statement": "Potențialul electrochimic al unei reacții redox depinde de temperatura și de activitățile speciilor participante.",
    "formula": "E=E°−(RT/nF)ln Q",
    "aliases": [
      "nernst"
    ]
  },
  {
    "id": "chem-new-130",
    "subject": "chemistry",
    "topic": "analytical",
    "level": "intermediate",
    "title": "Analiza calitativă",
    "statement": "Analiza calitativă urmărește identificarea componentelor unei probe.",
    "formula": "—",
    "aliases": [
      "identificare substante"
    ]
  },
  {
    "id": "chem-new-131",
    "subject": "chemistry",
    "topic": "analytical",
    "level": "intermediate",
    "title": "Analiza cantitativă",
    "statement": "Analiza cantitativă determină cantitățile sau concentrațiile componentelor unei probe.",
    "formula": "—",
    "aliases": [
      "determinare concentratie"
    ]
  },
  {
    "id": "chem-new-132",
    "subject": "chemistry",
    "topic": "analytical",
    "level": "intermediate",
    "title": "Eroarea analitică",
    "statement": "Eroarea absolută este diferența dintre valoarea măsurată și valoarea de referință.",
    "formula": "e=x_m−x_ref",
    "aliases": [
      "eroare laborator"
    ]
  },
  {
    "id": "chem-new-133",
    "subject": "chemistry",
    "topic": "analytical",
    "level": "intermediate",
    "title": "Precizia măsurării",
    "statement": "Precizia descrie apropierea dintre măsurători repetate, distinct de corectitudinea față de o referință.",
    "formula": "s (deviație standard)",
    "aliases": [
      "precizie"
    ]
  },
  {
    "id": "chem-new-134",
    "subject": "chemistry",
    "topic": "analytical",
    "level": "intermediate",
    "title": "Exactitatea măsurării",
    "statement": "Exactitatea descrie apropierea unei măsurători de valoarea de referință.",
    "formula": "—",
    "aliases": [
      "acuratete masurare"
    ]
  },
  {
    "id": "chem-new-135",
    "subject": "chemistry",
    "topic": "analytical",
    "level": "intermediate",
    "title": "Titrarea",
    "statement": "Titrarea utilizează un reactiv de concentrație cunoscută pentru determinarea cantitativă a unui analit.",
    "formula": "c=n/V",
    "aliases": [
      "volum echivalenta"
    ]
  },
  {
    "id": "chem-new-136",
    "subject": "chemistry",
    "topic": "analytical",
    "level": "advanced",
    "title": "Spectrofotometria UV-Vis",
    "statement": "Absorbția luminii poate fi corelată cu concentrația prin legea Beer–Lambert în domeniul ei de validitate.",
    "formula": "A=εlc",
    "aliases": [
      "uv vis"
    ]
  },
  {
    "id": "chem-new-137",
    "subject": "chemistry",
    "topic": "analytical",
    "level": "advanced",
    "title": "Cromatografia",
    "statement": "Cromatografia separă componente după repartiția lor între o fază mobilă și o fază staționară.",
    "formula": "—",
    "aliases": [
      "cromatografie"
    ]
  },
  {
    "id": "chem-new-138",
    "subject": "chemistry",
    "topic": "analytical",
    "level": "advanced",
    "title": "Spectrometria de masă",
    "statement": "Spectrometria de masă separă și detectează ioni după raportul masă-sarcină.",
    "formula": "m/z",
    "aliases": [
      "spectrometrie masa"
    ]
  },
  {
    "id": "chem-new-139",
    "subject": "chemistry",
    "topic": "biochemistry",
    "level": "intermediate",
    "title": "Proteinele",
    "statement": "Proteinele sunt polimeri biologici ai aminoacizilor legați prin legături peptidice.",
    "formula": "—",
    "aliases": [
      "proteine"
    ]
  },
  {
    "id": "chem-new-140",
    "subject": "chemistry",
    "topic": "biochemistry",
    "level": "intermediate",
    "title": "Aminoacizii",
    "statement": "Aminoacizii proteinogeni au grupări amino și carboxil și o catenă laterală distinctă.",
    "formula": "H₂N—CH(R)—COOH",
    "aliases": [
      "aminoacizi"
    ]
  },
  {
    "id": "chem-new-141",
    "subject": "chemistry",
    "topic": "biochemistry",
    "level": "intermediate",
    "title": "Glucidele",
    "statement": "Glucidele includ mono-, oligo- și polizaharide cu rol structural și energetic.",
    "formula": "C₆H₁₂O₆ (glucoză)",
    "aliases": [
      "carbohidrati"
    ]
  },
  {
    "id": "chem-new-142",
    "subject": "chemistry",
    "topic": "biochemistry",
    "level": "intermediate",
    "title": "Lipidele",
    "statement": "Lipidele cuprind un grup variat de biomolecule predominant hidrofobe sau amfifile.",
    "formula": "—",
    "aliases": [
      "grasimi"
    ]
  },
  {
    "id": "chem-new-143",
    "subject": "chemistry",
    "topic": "biochemistry",
    "level": "intermediate",
    "title": "Acizii nucleici",
    "statement": "ADN și ARN sunt polimeri de nucleotide, cu roluri în stocarea și exprimarea informației genetice.",
    "formula": "ADN / ARN",
    "aliases": [
      "nucleotide"
    ]
  },
  {
    "id": "chem-new-144",
    "subject": "chemistry",
    "topic": "biochemistry",
    "level": "intermediate",
    "title": "Enzimele",
    "statement": "Enzimele sunt catalizatori biologici care accelerează reacțiile fără a schimba echilibrul termodinamic.",
    "formula": "E+S ⇌ ES → E+P",
    "aliases": [
      "enzime"
    ]
  },
  {
    "id": "chem-new-145",
    "subject": "chemistry",
    "topic": "biochemistry",
    "level": "intermediate",
    "title": "Fotosinteza globală",
    "statement": "În fotosinteza oxigenică, energia luminoasă permite fixarea CO₂ și eliberarea oxigenului.",
    "formula": "6CO₂+6H₂O → C₆H₁₂O₆+6O₂ (schematic)",
    "aliases": [
      "fotosinteza"
    ]
  },
  {
    "id": "chem-new-146",
    "subject": "chemistry",
    "topic": "biochemistry",
    "level": "intermediate",
    "title": "Respirația aerobă globală",
    "statement": "Oxidarea aerobă a glucozei produce în ansamblu CO₂ și apă și permite conservarea energiei în celule.",
    "formula": "C₆H₁₂O₆+6O₂ → 6CO₂+6H₂O",
    "aliases": [
      "respiratie celulara"
    ]
  },
  {
    "id": "chem-new-147",
    "subject": "chemistry",
    "topic": "biochemistry",
    "level": "intermediate",
    "title": "Polimerii",
    "statement": "Polimerii sunt macromolecule alcătuite din unități structurale repetate.",
    "formula": "(—CH₂—CH₂—)ₙ",
    "aliases": [
      "polimer"
    ]
  },
  {
    "id": "chem-new-148",
    "subject": "chemistry",
    "topic": "biochemistry",
    "level": "intermediate",
    "title": "Poluarea chimică",
    "statement": "Poluanții pot afecta apa, aerul și solul; riscul depinde de substanță, doză și expunere.",
    "formula": "—",
    "aliases": [
      "poluare"
    ]
  },
  {
    "id": "chem-new-149",
    "subject": "chemistry",
    "topic": "biochemistry",
    "level": "advanced",
    "title": "Echilibrul carbonat–bicarbonat",
    "statement": "Sistemul CO₂/HCO₃⁻ contribuie la reglarea acido-bazică în apă și în sisteme biologice.",
    "formula": "CO₂+H₂O ⇌ H⁺+HCO₃⁻",
    "aliases": [
      "bicarbonat"
    ]
  },
  {
    "id": "chem-new-150",
    "subject": "chemistry",
    "topic": "advanced",
    "level": "advanced",
    "title": "Ecuația Schrödinger independentă de timp",
    "statement": "În mecanica cuantică nerelativistă, stările staționare sunt soluții ale ecuației de valori proprii a hamiltonianului.",
    "formula": "Ĥψ=Eψ",
    "aliases": [
      "schrodinger"
    ]
  },
  {
    "id": "chem-new-151",
    "subject": "chemistry",
    "topic": "advanced",
    "level": "advanced",
    "title": "Distribuția Boltzmann",
    "statement": "La echilibru termic, probabilitatea unei stări cu energie E este proporțională cu e^(−E/k_BT).",
    "formula": "pᵢ=e^(−Eᵢ/k_BT)/Z",
    "aliases": [
      "boltzmann"
    ]
  },
  {
    "id": "chem-new-152",
    "subject": "chemistry",
    "topic": "advanced",
    "level": "advanced",
    "title": "Funcția de partiție",
    "statement": "Funcția de partiție canonică însumează ponderile Boltzmann ale stărilor.",
    "formula": "Z=Σᵢe^(−Eᵢ/k_BT)",
    "aliases": [
      "partitie"
    ]
  },
  {
    "id": "chem-new-153",
    "subject": "chemistry",
    "topic": "advanced",
    "level": "advanced",
    "title": "Activitatea chimică",
    "statement": "Activitatea este o mărime adimensională care corectează comportarea neideală în potențialul chimic.",
    "formula": "μᵢ=μᵢ°+RT ln aᵢ",
    "aliases": [
      "activitate"
    ]
  },
  {
    "id": "chem-new-154",
    "subject": "chemistry",
    "topic": "advanced",
    "level": "advanced",
    "title": "Potențialul chimic",
    "statement": "Potențialul chimic este derivata energiei Gibbs în raport cu cantitatea componentului la T, p și celelalte cantități constante.",
    "formula": "μᵢ=(∂G/∂nᵢ)_(T,p,nⱼ)",
    "aliases": [
      "potential chimic"
    ]
  },
  {
    "id": "chem-new-155",
    "subject": "chemistry",
    "topic": "advanced",
    "level": "advanced",
    "title": "Fugacitatea",
    "statement": "Fugacitatea reprezintă o presiune efectivă în descrierea termodinamică a gazelor neideale.",
    "formula": "f=φp",
    "aliases": [
      "fugacitate"
    ]
  },
  {
    "id": "chem-new-156",
    "subject": "chemistry",
    "topic": "advanced",
    "level": "advanced",
    "title": "Constanta de viteză și ordinul reacției",
    "statement": "Ordinul reacției este determinat experimental din legea de viteză și nu coincide obligatoriu cu coeficienții ecuației globale.",
    "formula": "v=k[A]^α[B]^β",
    "aliases": [
      "ordin cinetica"
    ]
  },
  {
    "id": "chem-new-157",
    "subject": "chemistry",
    "topic": "advanced",
    "level": "advanced",
    "title": "Ecuația Eyring",
    "statement": "Teoria stării de tranziție aproximează constanta de viteză prin parametri de activare.",
    "formula": "k=(k_BT/h)e^(−ΔG‡/RT)",
    "aliases": [
      "eyring"
    ]
  },
  {
    "id": "chem-new-158",
    "subject": "chemistry",
    "topic": "advanced",
    "level": "advanced",
    "title": "Modelul Debye–Hückel limită",
    "statement": "Pentru electroliți diluați, coeficienții de activitate ionică depind de tăria ionică.",
    "formula": "log γᵢ≈−Azᵢ²√I",
    "aliases": [
      "debye huckel"
    ]
  },
  {
    "id": "chem-new-159",
    "subject": "chemistry",
    "topic": "advanced",
    "level": "advanced",
    "title": "Transformări de fază și regula fazelor Gibbs",
    "statement": "Numărul gradelor de libertate la echilibru pentru C componente și P faze este, fără reacții suplimentare, C−P+2.",
    "formula": "F=C−P+2",
    "aliases": [
      "regula fazelor"
    ]
  },
  {
    "id": "chem-new-160",
    "subject": "chemistry",
    "topic": "advanced",
    "level": "advanced",
    "title": "Teoria câmpului ligand",
    "statement": "Modelul câmpului ligand explică scindarea energetică a orbitalilor d în complecșii metalici.",
    "formula": "Δ_oct",
    "aliases": [
      "camp ligand"
    ]
  },
  {
    "id": "chem-new-161",
    "subject": "chemistry",
    "topic": "advanced",
    "level": "advanced",
    "title": "Cataliza eterogenă",
    "statement": "Cataliza eterogenă are loc la interfața dintre catalizator și reactanți dintr-o fază diferită.",
    "formula": "—",
    "aliases": [
      "suprafata catalizator"
    ]
  },
  {
    "id": "chem-new-162",
    "subject": "chemistry",
    "topic": "advanced",
    "level": "advanced",
    "title": "Legea vitezei integrată de ordinul întâi",
    "statement": "Pentru o reacție de ordinul întâi A→produși cu volum constant, concentrația scade exponențial.",
    "formula": "[A](t)=[A]₀e^(−kt)",
    "aliases": [
      "cinetica ordin unu"
    ]
  },
  {
    "id": "chem-new-163",
    "subject": "chemistry",
    "topic": "advanced",
    "level": "advanced",
    "title": "Timpul de înjumătățire de ordinul întâi",
    "statement": "Pentru un proces de ordinul întâi cu constantă de viteză pozitivă, timpul de înjumătățire este independent de concentrația inițială.",
    "formula": "t₁/₂=ln 2/k",
    "aliases": [
      "injumatatire"
    ]
  },
  {
    "id": "chem-new-164",
    "subject": "chemistry",
    "topic": "advanced",
    "level": "advanced",
    "title": "Echilibrul de complexare",
    "statement": "Formarea unui complex este caracterizată printr-o constantă de formare definită din activitățile speciilor.",
    "formula": "β=[ML]/([M][L]) (idealizat)",
    "aliases": [
      "complexare"
    ]
  },
  {
    "id": "chem-new-165",
    "subject": "chemistry",
    "topic": "advanced",
    "level": "advanced",
    "title": "Echilibrul de solubilitate",
    "statement": "Produsul de solubilitate exprimă echilibrul dintre o sare solidă și ionii dizolvați.",
    "formula": "K_sp=a(M⁺)a(X⁻) (MX)",
    "aliases": [
      "ksp"
    ]
  }
]);
