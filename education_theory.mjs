// Curated, offline-first Romanian theory entries. Keep explanatory theory separate from exercise solvers.
export const THEORY_ENTRIES = Object.freeze([
  {
    "id": "math-1",
    "subject": "math",
    "title": "Pitagora",
    "statement": "Într-un triunghi dreptunghic, pătratul ipotenuzei este egal cu suma pătratelor catetelor.",
    "formula": "a² + b² = c²",
    "aliases": [
      "teorema lui pitagora",
      "triunghi dreptunghic"
    ],
    "level": "beginner",
    "topic": "geometry"
  },
  {
    "id": "math-2",
    "subject": "math",
    "title": "Reciproca teoremei lui Pitagora",
    "statement": "Dacă pătratul celei mai lungi laturi a unui triunghi este egal cu suma pătratelor celorlalte două laturi, triunghiul este dreptunghic.",
    "formula": "a² + b² = c² ⇒ unghi drept",
    "aliases": [
      "reciproca pitagora"
    ],
    "level": "beginner",
    "topic": "geometry"
  },
  {
    "id": "math-3",
    "subject": "math",
    "title": "Teorema lui Thales",
    "statement": "Paralelele care intersectează două secante determină pe acestea segmente proporționale.",
    "formula": "AB/BC = DE/EF",
    "aliases": [
      "thales",
      "teorema interceptelor"
    ],
    "level": "beginner",
    "topic": "geometry"
  },
  {
    "id": "math-4",
    "subject": "math",
    "title": "Suma unghiurilor triunghiului",
    "statement": "Suma măsurilor unghiurilor interioare ale oricărui triunghi euclidian este de 180°.",
    "formula": "A + B + C = 180°",
    "aliases": [
      "unghiuri triunghi"
    ],
    "level": "beginner",
    "topic": "geometry"
  },
  {
    "id": "math-5",
    "subject": "math",
    "title": "Aria triunghiului",
    "statement": "Aria unui triunghi este jumătate din produsul dintre lungimea bazei și înălțimea corespunzătoare.",
    "formula": "A = b·h/2",
    "aliases": [
      "arie triunghi"
    ],
    "level": "beginner",
    "topic": "geometry"
  },
  {
    "id": "math-6",
    "subject": "math",
    "title": "Aria cercului",
    "statement": "Aria discului de rază r este π înmulțit cu pătratul razei.",
    "formula": "A = πr²",
    "aliases": [
      "suprafata cercului"
    ],
    "level": "beginner",
    "topic": "geometry"
  },
  {
    "id": "math-7",
    "subject": "math",
    "title": "Lungimea cercului",
    "statement": "Lungimea circumferinței unui cerc este 2π înmulțit cu raza sa.",
    "formula": "L = 2πr",
    "aliases": [
      "perimetru cerc",
      "circumferinta"
    ],
    "level": "beginner",
    "topic": "geometry"
  },
  {
    "id": "math-8",
    "subject": "math",
    "title": "Ecuația de gradul al doilea",
    "statement": "Pentru ax²+bx+c=0, cu a diferit de zero, soluțiile reale există când discriminantul este nenegativ.",
    "formula": "Δ = b² − 4ac; x = (−b ± √Δ)/(2a)",
    "aliases": [
      "formula discriminantului",
      "delta"
    ],
    "level": "medium",
    "topic": "algebra"
  },
  {
    "id": "math-9",
    "subject": "math",
    "title": "Identitatea pătratului sumei",
    "statement": "Pătratul sumei a două numere este suma pătratelor lor plus dublul produsului.",
    "formula": "(a+b)² = a²+2ab+b²",
    "aliases": [
      "formule calcul prescurtat"
    ],
    "level": "medium",
    "topic": "algebra"
  },
  {
    "id": "math-10",
    "subject": "math",
    "title": "Identitatea diferenței de pătrate",
    "statement": "Produsul dintre suma și diferența a două numere este diferența pătratelor lor.",
    "formula": "(a+b)(a−b)=a²−b²",
    "aliases": [
      "diferenta patrate"
    ],
    "level": "medium",
    "topic": "algebra"
  },
  {
    "id": "math-11",
    "subject": "math",
    "title": "Proprietatea distributivității",
    "statement": "Înmulțirea unui număr cu o sumă este egală cu suma produselor sale cu fiecare termen.",
    "formula": "a(b+c)=ab+ac",
    "aliases": [
      "distributivitate"
    ],
    "level": "beginner",
    "topic": "arithmetic"
  },
  {
    "id": "math-12",
    "subject": "math",
    "title": "Teorema sinusurilor",
    "statement": "În orice triunghi, raportul dintre latura opusă unui unghi și sinusul acelui unghi este constant.",
    "formula": "a/sin A = b/sin B = c/sin C",
    "aliases": [
      "legea sinusurilor"
    ],
    "level": "medium",
    "topic": "trigonometry"
  },
  {
    "id": "math-13",
    "subject": "math",
    "title": "Teorema cosinusurilor",
    "statement": "Pătratul unei laturi a unui triunghi este suma pătratelor celorlalte două laturi minus dublul produsului lor cu cosinusul unghiului cuprins.",
    "formula": "c²=a²+b²−2ab cos C",
    "aliases": [
      "legea cosinusurilor"
    ],
    "level": "medium",
    "topic": "trigonometry"
  },
  {
    "id": "math-14",
    "subject": "math",
    "title": "Definiția derivatei",
    "statement": "Derivata unei funcții într-un punct este limita raportului incremental, dacă această limită există.",
    "formula": "f′(x)=lim(h→0)[f(x+h)−f(x)]/h",
    "aliases": [
      "derivata",
      "diferentiere"
    ],
    "level": "advanced",
    "topic": "analysis"
  },
  {
    "id": "math-15",
    "subject": "math",
    "title": "Teorema fundamentală a analizei",
    "statement": "Dacă f este continuă pe [a,b] și F este o primitivă a lui f, integrala definită este diferența valorilor primitivei la capete.",
    "formula": "∫ₐᵇ f(x)dx = F(b)−F(a)",
    "aliases": [
      "newton leibniz",
      "integrala definita"
    ],
    "level": "advanced",
    "topic": "analysis"
  },
  {
    "id": "math-16",
    "subject": "math",
    "title": "Regula lui L'Hôpital",
    "statement": "Pentru limite de tip 0/0 sau ∞/∞, în ipotezele teoremei, limita raportului funcțiilor este egală cu limita raportului derivatelor, dacă aceasta există.",
    "formula": "lim f/g = lim f′/g′",
    "aliases": [
      "lhopital",
      "limite nedeterminate"
    ],
    "level": "advanced",
    "topic": "analysis"
  },
  {
    "id": "math-17",
    "subject": "math",
    "title": "Teorema lui Rolle",
    "statement": "Dacă f este continuă pe [a,b], derivabilă pe (a,b) și f(a)=f(b), există c între a și b cu derivata nulă.",
    "formula": "f′(c)=0",
    "aliases": [
      "rolle"
    ],
    "level": "advanced",
    "topic": "analysis"
  },
  {
    "id": "math-18",
    "subject": "math",
    "title": "Teorema valorii medii",
    "statement": "Pentru o funcție continuă pe [a,b] și derivabilă pe (a,b), există c în interval astfel încât panta tangentei egalează panta secantei.",
    "formula": "f′(c)=[f(b)−f(a)]/(b−a)",
    "aliases": [
      "lagrange",
      "teorema cresterilor finite"
    ],
    "level": "advanced",
    "topic": "analysis"
  },
  {
    "id": "math-19",
    "subject": "math",
    "title": "Teorema lui Bayes",
    "statement": "Probabilitatea unei ipoteze după observarea unui eveniment se calculează folosind probabilitatea evenimentului sub ipoteză și probabilitatea sa inițială.",
    "formula": "P(A|B)=P(B|A)P(A)/P(B)",
    "aliases": [
      "bayes",
      "probabilitate conditionata"
    ],
    "level": "advanced",
    "topic": "statistics"
  },
  {
    "id": "math-20",
    "subject": "math",
    "title": "Teorema binomială",
    "statement": "Puterea unui binom se dezvoltă ca sumă de termeni cu coeficienți binomiali.",
    "formula": "(a+b)ⁿ=Σₖ C(n,k)aⁿ⁻ᵏbᵏ",
    "aliases": [
      "binomul lui newton"
    ],
    "level": "advanced",
    "topic": "discrete"
  },
  {
    "id": "physics-21",
    "subject": "physics",
    "title": "Prima lege a lui Newton",
    "statement": "Un corp își păstrează starea de repaus sau de mișcare rectilinie uniformă dacă rezultanta forțelor externe este nulă.",
    "formula": "ΣF = 0 ⇒ a = 0",
    "aliases": [
      "legea inertiei",
      "newton 1"
    ],
    "level": "beginner"
  },
  {
    "id": "physics-22",
    "subject": "physics",
    "title": "A doua lege a lui Newton",
    "statement": "Într-un sistem de referință inerțial, rezultanta forțelor asupra unui corp de masă constantă este produsul dintre masă și accelerație.",
    "formula": "ΣF = ma",
    "aliases": [
      "legea fundamentala a dinamicii",
      "newton 2"
    ],
    "level": "beginner"
  },
  {
    "id": "physics-23",
    "subject": "physics",
    "title": "A treia lege a lui Newton",
    "statement": "Dacă un corp exercită o forță asupra altuia, al doilea exercită asupra primului o forță egală în modul și opusă ca sens.",
    "formula": "F₁₂ = −F₂₁",
    "aliases": [
      "actiune si reactiune",
      "newton 3"
    ],
    "level": "beginner"
  },
  {
    "id": "physics-24",
    "subject": "physics",
    "title": "Legea gravitației universale",
    "statement": "Două mase punctiforme se atrag cu o forță proporțională cu produsul maselor și invers proporțională cu pătratul distanței.",
    "formula": "F=Gm₁m₂/r²",
    "aliases": [
      "newton gravitatie"
    ],
    "level": "medium"
  },
  {
    "id": "physics-25",
    "subject": "physics",
    "title": "Legea lui Ohm",
    "statement": "Pentru un conductor ohmic la temperatură constantă, tensiunea este produsul dintre intensitatea curentului și rezistență.",
    "formula": "U=RI",
    "aliases": [
      "ohm",
      "curent tensiune rezistenta"
    ],
    "level": "beginner"
  },
  {
    "id": "physics-26",
    "subject": "physics",
    "title": "Legea lui Joule–Lenz",
    "statement": "Căldura disipată de un rezistor parcurs de curent constant într-un interval de timp este proporțională cu pătratul curentului, rezistența și timpul.",
    "formula": "Q=I²Rt",
    "aliases": [
      "joule lenz"
    ],
    "level": "medium"
  },
  {
    "id": "physics-27",
    "subject": "physics",
    "title": "Legea lui Hooke",
    "statement": "În domeniul elastic liniar, forța elastică de revenire a unui resort este opusă deplasării și proporțională cu aceasta.",
    "formula": "F=−kx",
    "aliases": [
      "hooke",
      "resort"
    ],
    "level": "medium"
  },
  {
    "id": "physics-28",
    "subject": "physics",
    "title": "Legea lui Arhimede",
    "statement": "Un corp imersat într-un fluid este împins în sus cu o forță egală cu greutatea fluidului dezlocuit.",
    "formula": "F_A=ρ_fluid g V_dezlocuit",
    "aliases": [
      "arhimede",
      "flotabilitate"
    ],
    "level": "beginner"
  },
  {
    "id": "physics-29",
    "subject": "physics",
    "title": "Principiul lui Pascal",
    "statement": "O variație de presiune aplicată unui fluid incomprimabil închis se transmite nediminuată în toate direcțiile.",
    "formula": "p=F/A",
    "aliases": [
      "pascal",
      "presa hidraulica"
    ],
    "level": "medium"
  },
  {
    "id": "physics-30",
    "subject": "physics",
    "title": "Ecuația lui Bernoulli",
    "statement": "Pentru curgerea staționară ideală a unui fluid incompresibil de-a lungul aceleiași linii de curent, suma presiunii, energiei cinetice și potențiale pe unitate de volum este constantă.",
    "formula": "p+ρv²/2+ρgh=constant",
    "aliases": [
      "bernoulli"
    ],
    "level": "advanced"
  },
  {
    "id": "physics-31",
    "subject": "physics",
    "title": "Conservarea energiei",
    "statement": "Într-un sistem izolat, energia totală se conservă, deși poate trece dintr-o formă în alta.",
    "formula": "E_total=constant",
    "aliases": [
      "energia se conserva"
    ],
    "level": "beginner"
  },
  {
    "id": "physics-32",
    "subject": "physics",
    "title": "Conservarea impulsului",
    "statement": "Într-un sistem izolat, impulsul total rămâne constant.",
    "formula": "Σp_înainte=Σp_după",
    "aliases": [
      "conservarea cantitatii de miscare"
    ],
    "level": "medium"
  },
  {
    "id": "physics-33",
    "subject": "physics",
    "title": "Legea lui Coulomb",
    "statement": "Forța electrostatică dintre două sarcini punctiforme este proporțională cu produsul sarcinilor și invers proporțională cu pătratul distanței.",
    "formula": "|F|=k|q₁q₂|/r²",
    "aliases": [
      "coulomb"
    ],
    "level": "medium"
  },
  {
    "id": "physics-34",
    "subject": "physics",
    "title": "Legea inducției Faraday",
    "statement": "Tensiunea electromotoare indusă într-un circuit este opusul vitezei de variație a fluxului magnetic prin circuit.",
    "formula": "ε=−dΦ_B/dt",
    "aliases": [
      "faraday",
      "inductie electromagnetica"
    ],
    "level": "advanced"
  },
  {
    "id": "physics-35",
    "subject": "physics",
    "title": "Legea lui Snell",
    "statement": "La refracția dintre două medii, produsul dintre indicele de refracție și sinusul unghiului față de normală este același.",
    "formula": "n₁sin θ₁=n₂sin θ₂",
    "aliases": [
      "snell descartes",
      "refractie"
    ],
    "level": "medium"
  },
  {
    "id": "physics-36",
    "subject": "physics",
    "title": "Principiul incertitudinii Heisenberg",
    "statement": "Abaterile standard ale poziției și impulsului unei particule satisfac o limită inferioară nenulă.",
    "formula": "Δx Δp ≥ ℏ/2",
    "aliases": [
      "heisenberg",
      "incertitudine"
    ],
    "level": "advanced"
  },
  {
    "id": "physics-37",
    "subject": "physics",
    "title": "Echivalența masă–energie",
    "statement": "Energia de repaus a unui corp este egală cu masa sa de repaus înmulțită cu pătratul vitezei luminii în vid.",
    "formula": "E₀=mc²",
    "aliases": [
      "einstein",
      "masa energie"
    ],
    "level": "advanced"
  },
  {
    "id": "physics-38",
    "subject": "physics",
    "title": "Primul principiu al termodinamicii",
    "statement": "Variația energiei interne este căldura primită de sistem minus lucrul mecanic efectuat de sistem.",
    "formula": "ΔU=Q−W",
    "aliases": [
      "termodinamica 1"
    ],
    "level": "medium"
  },
  {
    "id": "physics-39",
    "subject": "physics",
    "title": "Al doilea principiu al termodinamicii",
    "statement": "Entropia totală a unui sistem izolat nu poate scădea.",
    "formula": "ΔS_izolat ≥ 0",
    "aliases": [
      "termodinamica 2",
      "entropie"
    ],
    "level": "advanced"
  },
  {
    "id": "chemistry-40",
    "subject": "chemistry",
    "title": "Legea conservării masei",
    "statement": "Într-o reacție chimică desfășurată într-un sistem închis, masa totală a reactanților este egală cu masa totală a produselor.",
    "formula": "m_reactanți=m_produși",
    "aliases": [
      "lavoisier",
      "conservarea masei"
    ],
    "level": "beginner"
  },
  {
    "id": "chemistry-41",
    "subject": "chemistry",
    "title": "Legea proporțiilor definite",
    "statement": "Un compus chimic pur are aceeași proporție masică între elementele sale, indiferent de origine.",
    "formula": "m_A/m_B=constant (același compus)",
    "aliases": [
      "proust",
      "compozitie constanta"
    ],
    "level": "beginner"
  },
  {
    "id": "chemistry-42",
    "subject": "chemistry",
    "title": "Legea proporțiilor multiple",
    "statement": "Dacă două elemente formează mai mulți compuși, masele unuia care se combină cu aceeași masă a celuilalt sunt în rapoarte de numere întregi mici.",
    "formula": "rapoarte de numere întregi mici",
    "aliases": [
      "dalton"
    ],
    "level": "medium"
  },
  {
    "id": "chemistry-43",
    "subject": "chemistry",
    "title": "Legea lui Avogadro",
    "statement": "Volume egale de gaze ideale, la aceeași temperatură și presiune, conțin același număr de molecule.",
    "formula": "V ∝ n (T,p constante)",
    "aliases": [
      "avogadro"
    ],
    "level": "beginner"
  },
  {
    "id": "chemistry-44",
    "subject": "chemistry",
    "title": "Ecuația gazului ideal",
    "statement": "Presiunea, volumul, cantitatea de substanță și temperatura absolută a unui gaz ideal satisfac relația de stare.",
    "formula": "pV=nRT",
    "aliases": [
      "gaz ideal",
      "clapeyron mendeleev"
    ],
    "level": "medium"
  },
  {
    "id": "chemistry-45",
    "subject": "chemistry",
    "title": "Legea lui Boyle–Mariotte",
    "statement": "Pentru o cantitate fixă de gaz ideal la temperatură constantă, produsul presiunii cu volumul este constant.",
    "formula": "pV=constant",
    "aliases": [
      "boyle",
      "mariotte"
    ],
    "level": "beginner"
  },
  {
    "id": "chemistry-46",
    "subject": "chemistry",
    "title": "Legea lui Charles",
    "statement": "La presiune constantă, volumul unei cantități fixe de gaz ideal este direct proporțional cu temperatura absolută.",
    "formula": "V/T=constant",
    "aliases": [
      "charles gaze"
    ],
    "level": "beginner"
  },
  {
    "id": "chemistry-47",
    "subject": "chemistry",
    "title": "Legea lui Gay-Lussac",
    "statement": "La volum constant, presiunea unei cantități fixe de gaz ideal este direct proporțională cu temperatura absolută.",
    "formula": "p/T=constant",
    "aliases": [
      "gay lussac gaze"
    ],
    "level": "beginner"
  },
  {
    "id": "chemistry-48",
    "subject": "chemistry",
    "title": "Principiul lui Le Châtelier",
    "statement": "Când un sistem aflat la echilibru este perturbat, echilibrul se deplasează în sensul care contracarează parțial perturbarea.",
    "formula": "—",
    "aliases": [
      "le chatelier",
      "echilibru chimic"
    ],
    "level": "medium"
  },
  {
    "id": "chemistry-49",
    "subject": "chemistry",
    "title": "Legea acțiunii maselor",
    "statement": "La echilibru, pentru reacții ideale, raportul dintre activitățile produselor și ale reactanților ridicate la coeficienții stoechiometrici este constant la temperatura dată.",
    "formula": "K=Πa_produși^ν/Πa_reactanți^ν",
    "aliases": [
      "constanta echilibru",
      "guldberg waage"
    ],
    "level": "advanced"
  },
  {
    "id": "chemistry-50",
    "subject": "chemistry",
    "title": "Definiția pH-ului",
    "statement": "pH-ul este opusul logaritmului zecimal al activității ionilor de hidrogen.",
    "formula": "pH=−log₁₀(a_H⁺)",
    "aliases": [
      "ph",
      "aciditate"
    ],
    "level": "medium"
  },
  {
    "id": "chemistry-51",
    "subject": "chemistry",
    "title": "Teoria Brønsted–Lowry",
    "statement": "Un acid este un donor de protoni, iar o bază este un acceptor de protoni.",
    "formula": "acid ⇌ bază conjugată + H⁺",
    "aliases": [
      "bronsted",
      "lowry",
      "acizi baze"
    ],
    "level": "medium"
  },
  {
    "id": "chemistry-52",
    "subject": "chemistry",
    "title": "Legea lui Hess",
    "statement": "Variația entalpiei unei reacții depinde doar de stările inițială și finală, nu de traseul reacției.",
    "formula": "ΔH_total=ΣΔH_etape",
    "aliases": [
      "hess",
      "entalpie"
    ],
    "level": "medium"
  },
  {
    "id": "chemistry-53",
    "subject": "chemistry",
    "title": "Legea lui Faraday a electrolizei",
    "statement": "Masa de substanță depusă la electrod este proporțională cu sarcina electrică transferată și cu masa molară, invers proporțională cu numărul de electroni transferați.",
    "formula": "m=MQ/(zF)",
    "aliases": [
      "faraday electroliza"
    ],
    "level": "advanced"
  },
  {
    "id": "chemistry-54",
    "subject": "chemistry",
    "title": "Legea vitezei de reacție",
    "statement": "Pentru o reacție dată, viteza poate depinde de concentrațiile reactanților printr-o ecuație determinată experimental.",
    "formula": "v=k[A]^m[B]^n",
    "aliases": [
      "cinetica chimica",
      "ordin reactie"
    ],
    "level": "advanced"
  },
  {
    "id": "chemistry-55",
    "subject": "chemistry",
    "title": "Principiul Aufbau",
    "statement": "În modelul orbitalilor, electronii ocupă mai întâi orbitalii disponibili cu energie mai mică, cu excepțiile cunoscute.",
    "formula": "—",
    "aliases": [
      "aufbau",
      "configuratie electronica"
    ],
    "level": "medium"
  },
  {
    "id": "chemistry-56",
    "subject": "chemistry",
    "title": "Principiul de excluziune Pauli",
    "statement": "Într-un atom, nu pot exista doi electroni cu aceleași patru numere cuantice.",
    "formula": "—",
    "aliases": [
      "pauli"
    ],
    "level": "medium"
  },
  {
    "id": "chemistry-57",
    "subject": "chemistry",
    "title": "Regula lui Hund",
    "statement": "Într-un set de orbitali degenerați, electronii ocupă mai întâi orbitalii separat, cu spini paraleli, înainte de împerechere.",
    "formula": "—",
    "aliases": [
      "hund"
    ],
    "level": "medium"
  },
  {
    "id": "chemistry-58",
    "subject": "chemistry",
    "title": "Legea lui Raoult",
    "statement": "Într-o soluție ideală, presiunea parțială de vapori a unui component este produsul fracției sale molare cu presiunea de vapori a componentului pur.",
    "formula": "pᵢ=xᵢpᵢ*",
    "aliases": [
      "raoult",
      "presiune vapori"
    ],
    "level": "advanced"
  },
  {
    "id": "math-21",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Numere naturale",
    "statement": "Numerele naturale sunt 0, 1, 2, 3 și așa mai departe.",
    "formula": "ℕ={0,1,2,…}",
    "aliases": [
      "numere de numarat"
    ],
    "level": "beginner"
  },
  {
    "id": "math-22",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Numere întregi",
    "statement": "Numerele întregi cuprind numerele naturale și opusele lor.",
    "formula": "ℤ={…,−2,−1,0,1,2,…}",
    "aliases": [
      "numere negative"
    ],
    "level": "beginner"
  },
  {
    "id": "math-23",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Numere raționale",
    "statement": "Un număr rațional poate fi scris ca raport dintre două numere întregi, cu numitor nenul.",
    "formula": "a/b; a,b∈ℤ, b≠0",
    "aliases": [
      "fractie numere rationale"
    ],
    "level": "beginner"
  },
  {
    "id": "math-24",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Prioritatea operațiilor",
    "statement": "În absența altor convenții, se calculează mai întâi parantezele, apoi puterile, înmulțirile și împărțirile, apoi adunările și scăderile; la același nivel, de la stânga la dreapta.",
    "formula": "( ) → puteri → ×,÷ → +,−",
    "aliases": [
      "ordinea operatiilor"
    ],
    "level": "beginner"
  },
  {
    "id": "math-25",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Comutativitatea adunării",
    "statement": "Schimbarea ordinii termenilor nu schimbă suma.",
    "formula": "a+b=b+a",
    "aliases": [
      "proprietatea comutativa a adunarii"
    ],
    "level": "beginner"
  },
  {
    "id": "math-26",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Asociativitatea adunării",
    "statement": "Gruparea termenilor nu schimbă suma.",
    "formula": "(a+b)+c=a+(b+c)",
    "aliases": [
      "proprietatea asociativa adunare"
    ],
    "level": "beginner"
  },
  {
    "id": "math-27",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Comutativitatea înmulțirii",
    "statement": "Schimbarea ordinii factorilor nu schimbă produsul.",
    "formula": "ab=ba",
    "aliases": [
      "comutativitate inmultire"
    ],
    "level": "beginner"
  },
  {
    "id": "math-28",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Asociativitatea înmulțirii",
    "statement": "Gruparea factorilor nu schimbă produsul.",
    "formula": "(ab)c=a(bc)",
    "aliases": [
      "asociativitate inmultire"
    ],
    "level": "beginner"
  },
  {
    "id": "math-29",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Fracții echivalente",
    "statement": "Înmulțind numărătorul și numitorul cu același număr nenul, valoarea fracției nu se schimbă.",
    "formula": "a/b=(ka)/(kb); k≠0",
    "aliases": [
      "amplificare fractie"
    ],
    "level": "beginner"
  },
  {
    "id": "math-30",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Adunarea fracțiilor",
    "statement": "Pentru a aduna două fracții, acestea se aduc la un numitor comun.",
    "formula": "a/b+c/d=(ad+bc)/(bd), bd≠0",
    "aliases": [
      "suma fractii"
    ],
    "level": "beginner"
  },
  {
    "id": "math-31",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Înmulțirea fracțiilor",
    "statement": "Produsul a două fracții are la numărător produsul numărătorilor și la numitor produsul numitorilor.",
    "formula": "(a/b)(c/d)=ac/bd",
    "aliases": [
      "produs fractii"
    ],
    "level": "beginner"
  },
  {
    "id": "math-32",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Împărțirea fracțiilor",
    "statement": "Împărțirea la o fracție nenulă înseamnă înmulțirea cu inversa ei.",
    "formula": "(a/b):(c/d)=ad/bc; bc≠0",
    "aliases": [
      "impartire fractii"
    ],
    "level": "beginner"
  },
  {
    "id": "math-33",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Criteriul divizibilității cu 2",
    "statement": "Un număr natural este divizibil cu 2 dacă ultima cifră este pară.",
    "formula": "ultima cifră ∈ {0,2,4,6,8}",
    "aliases": [
      "divizibilitate doi"
    ],
    "level": "beginner"
  },
  {
    "id": "math-34",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Criteriul divizibilității cu 3",
    "statement": "Un număr natural este divizibil cu 3 dacă suma cifrelor sale este divizibilă cu 3.",
    "formula": "3 | n ⇔ 3 | suma cifrelor",
    "aliases": [
      "divizibilitate trei"
    ],
    "level": "beginner"
  },
  {
    "id": "math-35",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Criteriul divizibilității cu 9",
    "statement": "Un număr natural este divizibil cu 9 dacă suma cifrelor sale este divizibilă cu 9.",
    "formula": "9 | n ⇔ 9 | suma cifrelor",
    "aliases": [
      "divizibilitate noua"
    ],
    "level": "beginner"
  },
  {
    "id": "math-36",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Procentul",
    "statement": "p la sută dintr-o cantitate este p/100 din acea cantitate.",
    "formula": "p% din N=(p/100)N",
    "aliases": [
      "procente"
    ],
    "level": "beginner"
  },
  {
    "id": "math-37",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Regula semnelor la înmulțire",
    "statement": "Produsul a două numere de același semn este pozitiv; produsul a două numere de semne diferite este negativ.",
    "formula": "(−a)(−b)=ab; (−a)b=−ab",
    "aliases": [
      "regula semnelor"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-38",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Puterile cu exponent întreg",
    "statement": "La același număr nenul, la înmulțirea puterilor se adună exponenții, iar la împărțire se scad.",
    "formula": "aᵐaⁿ=aᵐ⁺ⁿ; aᵐ/aⁿ=aᵐ⁻ⁿ",
    "aliases": [
      "reguli puteri"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-39",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Proprietățile radicalilor",
    "statement": "Pentru a și b nenegative, rădăcina pătrată a produsului este produsul rădăcinilor.",
    "formula": "√(ab)=√a√b; a,b≥0",
    "aliases": [
      "reguli radicali"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-40",
    "subject": "math",
    "topic": "arithmetic",
    "title": "Descompunerea în factori primi",
    "statement": "Orice număr întreg mai mare decât 1 este produs de numere prime, unic până la ordinea factorilor.",
    "formula": "n=p₁^α₁⋯pₖ^αₖ",
    "aliases": [
      "teorema fundamentala a aritmeticii"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-41",
    "subject": "math",
    "topic": "algebra",
    "title": "Ecuație liniară",
    "statement": "O ecuație liniară cu o necunoscută are forma ax+b=0, iar dacă a este nenul, soluția este unică.",
    "formula": "x=−b/a; a≠0",
    "aliases": [
      "gradul intai"
    ],
    "level": "beginner"
  },
  {
    "id": "math-42",
    "subject": "math",
    "topic": "algebra",
    "title": "Egalități echivalente",
    "statement": "Adăugarea aceluiași termen ambilor membri ai unei egalități păstrează egalitatea.",
    "formula": "a=b ⇒ a+c=b+c",
    "aliases": [
      "transpunerea termenilor"
    ],
    "level": "beginner"
  },
  {
    "id": "math-43",
    "subject": "math",
    "topic": "algebra",
    "title": "Inecuație liniară",
    "statement": "Când se înmulțesc ambii membri ai unei inegalități cu un număr negativ, sensul semnului se inversează.",
    "formula": "a<b ⇒ −a>−b",
    "aliases": [
      "inegalitate semn invers"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-44",
    "subject": "math",
    "topic": "algebra",
    "title": "Valoarea absolută",
    "statement": "Modulul unui număr real este distanța lui față de zero și este întotdeauna nenegativ.",
    "formula": "|x|=x dacă x≥0, altfel −x",
    "aliases": [
      "modul numar"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-45",
    "subject": "math",
    "topic": "algebra",
    "title": "Pătratul diferenței",
    "statement": "Pătratul diferenței a două numere este suma pătratelor lor minus dublul produsului.",
    "formula": "(a−b)²=a²−2ab+b²",
    "aliases": [
      "formula calcul prescurtat minus"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-46",
    "subject": "math",
    "topic": "algebra",
    "title": "Cubul sumei",
    "statement": "Cubul sumei a două numere se dezvoltă prin formula binomială de ordin trei.",
    "formula": "(a+b)³=a³+3a²b+3ab²+b³",
    "aliases": [
      "cubul binomului"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-47",
    "subject": "math",
    "topic": "algebra",
    "title": "Suma cuburilor",
    "statement": "Suma a două cuburi se factorizează prin produsul unei sume cu un trinom.",
    "formula": "a³+b³=(a+b)(a²−ab+b²)",
    "aliases": [
      "formula suma cuburi"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-48",
    "subject": "math",
    "topic": "algebra",
    "title": "Diferența cuburilor",
    "statement": "Diferența a două cuburi se factorizează prin produsul unei diferențe cu un trinom.",
    "formula": "a³−b³=(a−b)(a²+ab+b²)",
    "aliases": [
      "formula diferenta cuburi"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-49",
    "subject": "math",
    "topic": "algebra",
    "title": "Relațiile lui Viète",
    "statement": "Pentru ax²+bx+c=0 cu a nenul și rădăcini x₁,x₂, suma și produsul lor se exprimă prin coeficienți.",
    "formula": "x₁+x₂=−b/a; x₁x₂=c/a",
    "aliases": [
      "viete"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-50",
    "subject": "math",
    "topic": "algebra",
    "title": "Discriminantul ecuației pătratice",
    "statement": "Semnul discriminantului decide numărul rădăcinilor reale ale unei ecuații pătratice.",
    "formula": "Δ>0: două; Δ=0: una dublă; Δ<0: niciuna reală",
    "aliases": [
      "delta numar solutii"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-51",
    "subject": "math",
    "topic": "algebra",
    "title": "Sistem liniar 2×2",
    "statement": "Pentru două ecuații liniare cu două necunoscute, un determinant nenul al matricei coeficienților asigură o soluție unică.",
    "formula": "D=ad−bc≠0",
    "aliases": [
      "cramer sisteme"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-52",
    "subject": "math",
    "topic": "algebra",
    "title": "Matrice inversabilă",
    "statement": "O matrice pătrată este inversabilă dacă și numai dacă determinantul ei este nenul.",
    "formula": "A⁻¹ există ⇔ det(A)≠0",
    "aliases": [
      "inversa matrice"
    ],
    "level": "advanced"
  },
  {
    "id": "math-53",
    "subject": "math",
    "topic": "algebra",
    "title": "Rangul unei matrice",
    "statement": "Rangul unei matrice este numărul maxim de linii sau coloane liniar independente.",
    "formula": "rang(A)",
    "aliases": [
      "rang matrice"
    ],
    "level": "advanced"
  },
  {
    "id": "math-54",
    "subject": "math",
    "topic": "algebra",
    "title": "Teorema rang–nulitate",
    "statement": "Pentru o aplicație liniară dintr-un spațiu vectorial finit-dimensional, dimensiunea nucleului plus dimensiunea imaginii este dimensiunea domeniului.",
    "formula": "dim Ker(T)+dim Im(T)=dim V",
    "aliases": [
      "rank nullity"
    ],
    "level": "advanced"
  },
  {
    "id": "math-55",
    "subject": "math",
    "topic": "algebra",
    "title": "Teorema fundamentală a algebrei",
    "statement": "Orice polinom neconstant cu coeficienți complecși are cel puțin o rădăcină complexă.",
    "formula": "p(z)=0 pentru un z∈ℂ",
    "aliases": [
      "teorema fundamentala algebra"
    ],
    "level": "advanced"
  },
  {
    "id": "math-56",
    "subject": "math",
    "topic": "geometry",
    "title": "Perimetrul unui poligon",
    "statement": "Perimetrul este suma lungimilor tuturor laturilor poligonului.",
    "formula": "P=Σ lungimi laturi",
    "aliases": [
      "perimetru"
    ],
    "level": "beginner"
  },
  {
    "id": "math-57",
    "subject": "math",
    "topic": "geometry",
    "title": "Aria dreptunghiului",
    "statement": "Aria unui dreptunghi este produsul lungimii cu lățimea.",
    "formula": "A=L·l",
    "aliases": [
      "suprafata dreptunghi"
    ],
    "level": "beginner"
  },
  {
    "id": "math-58",
    "subject": "math",
    "topic": "geometry",
    "title": "Perimetrul dreptunghiului",
    "statement": "Perimetrul dreptunghiului este de două ori suma lungimii și lățimii.",
    "formula": "P=2(L+l)",
    "aliases": [
      "perimetru dreptunghi"
    ],
    "level": "beginner"
  },
  {
    "id": "math-59",
    "subject": "math",
    "topic": "geometry",
    "title": "Aria pătratului",
    "statement": "Aria pătratului este pătratul lungimii laturii.",
    "formula": "A=a²",
    "aliases": [
      "suprafata patrat"
    ],
    "level": "beginner"
  },
  {
    "id": "math-60",
    "subject": "math",
    "topic": "geometry",
    "title": "Perimetrul pătratului",
    "statement": "Perimetrul pătratului este de patru ori lungimea laturii.",
    "formula": "P=4a",
    "aliases": [
      "perimetru patrat"
    ],
    "level": "beginner"
  },
  {
    "id": "math-61",
    "subject": "math",
    "topic": "geometry",
    "title": "Aria paralelogramului",
    "statement": "Aria paralelogramului este produsul dintre bază și înălțimea corespunzătoare.",
    "formula": "A=b·h",
    "aliases": [
      "suprafata paralelogram"
    ],
    "level": "beginner"
  },
  {
    "id": "math-62",
    "subject": "math",
    "topic": "geometry",
    "title": "Aria trapezului",
    "statement": "Aria trapezului este semisuma bazelor înmulțită cu înălțimea.",
    "formula": "A=(B+b)h/2",
    "aliases": [
      "suprafata trapez"
    ],
    "level": "beginner"
  },
  {
    "id": "math-63",
    "subject": "math",
    "topic": "geometry",
    "title": "Unghiuri opuse la vârf",
    "statement": "Două unghiuri opuse la vârf au măsuri egale.",
    "formula": "∠1=∠3",
    "aliases": [
      "unghiuri opuse"
    ],
    "level": "beginner"
  },
  {
    "id": "math-64",
    "subject": "math",
    "topic": "geometry",
    "title": "Unghiuri suplementare",
    "statement": "Două unghiuri sunt suplementare dacă suma lor este 180°.",
    "formula": "α+β=180°",
    "aliases": [
      "suplementare"
    ],
    "level": "beginner"
  },
  {
    "id": "math-65",
    "subject": "math",
    "topic": "geometry",
    "title": "Unghiuri complementare",
    "statement": "Două unghiuri sunt complementare dacă suma lor este 90°.",
    "formula": "α+β=90°",
    "aliases": [
      "complementare"
    ],
    "level": "beginner"
  },
  {
    "id": "math-66",
    "subject": "math",
    "topic": "geometry",
    "title": "Criteriul LLL de congruență",
    "statement": "Două triunghiuri sunt congruente dacă cele trei perechi de laturi corespunzătoare sunt egale.",
    "formula": "LLL",
    "aliases": [
      "congruenta lll"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-67",
    "subject": "math",
    "topic": "geometry",
    "title": "Criteriul LUL de congruență",
    "statement": "Două triunghiuri sunt congruente dacă au câte două laturi și unghiul cuprins corespunzătoare egale.",
    "formula": "LUL",
    "aliases": [
      "congruenta lul"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-68",
    "subject": "math",
    "topic": "geometry",
    "title": "Criteriul ULU de congruență",
    "statement": "Două triunghiuri sunt congruente dacă au o latură și unghiurile ei alăturate corespunzătoare egale.",
    "formula": "ULU",
    "aliases": [
      "congruenta ulu"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-69",
    "subject": "math",
    "topic": "geometry",
    "title": "Asemănarea triunghiurilor",
    "statement": "Două triunghiuri sunt asemenea dacă unghiurile corespunzătoare sunt egale și laturile omoloage sunt proporționale.",
    "formula": "a/a′=b/b′=c/c′",
    "aliases": [
      "triunghiuri asemenea"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-70",
    "subject": "math",
    "topic": "geometry",
    "title": "Teorema medianei pe ipotenuză",
    "statement": "Într-un triunghi dreptunghic, mediana din vârful unghiului drept către ipotenuză are lungimea egală cu jumătate din ipotenuză.",
    "formula": "m=c/2",
    "aliases": [
      "mediana ipotenuza"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-71",
    "subject": "math",
    "topic": "geometry",
    "title": "Unghiul înscris în cerc",
    "statement": "Măsura unui unghi înscris într-un cerc este jumătate din măsura arcului interceptat.",
    "formula": "∠înscris=½ arc",
    "aliases": [
      "teorema unghiului inscris"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-72",
    "subject": "math",
    "topic": "geometry",
    "title": "Volumul cubului",
    "statement": "Volumul cubului este puterea a treia a lungimii muchiei.",
    "formula": "V=a³",
    "aliases": [
      "cub volum"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-73",
    "subject": "math",
    "topic": "geometry",
    "title": "Aria totală a cubului",
    "statement": "Aria totală a cubului este de șase ori aria unei fețe.",
    "formula": "A=6a²",
    "aliases": [
      "cub suprafata"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-74",
    "subject": "math",
    "topic": "geometry",
    "title": "Volumul cilindrului circular drept",
    "statement": "Volumul cilindrului este aria bazei înmulțită cu înălțimea.",
    "formula": "V=πr²h",
    "aliases": [
      "cilindru volum"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-75",
    "subject": "math",
    "topic": "geometry",
    "title": "Volumul conului circular drept",
    "statement": "Volumul conului este o treime din produsul ariei bazei cu înălțimea.",
    "formula": "V=πr²h/3",
    "aliases": [
      "con volum"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-76",
    "subject": "math",
    "topic": "geometry",
    "title": "Volumul sferei",
    "statement": "Volumul unei sfere este patru treimi din π înmulțit cu cubul razei.",
    "formula": "V=4πr³/3",
    "aliases": [
      "sfera volum"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-77",
    "subject": "math",
    "topic": "geometry",
    "title": "Aria sferei",
    "statement": "Aria suprafeței sferei este de patru ori π înmulțit cu pătratul razei.",
    "formula": "A=4πr²",
    "aliases": [
      "sfera suprafata"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-78",
    "subject": "math",
    "topic": "geometry",
    "title": "Formula lui Euler pentru poliedre",
    "statement": "Pentru un poliedru convex, numărul vârfurilor minus numărul muchiilor plus numărul fețelor este 2.",
    "formula": "V−E+F=2",
    "aliases": [
      "poliedru euler"
    ],
    "level": "advanced"
  },
  {
    "id": "math-79",
    "subject": "math",
    "topic": "trigonometry",
    "title": "Definiția sinusului",
    "statement": "Într-un triunghi dreptunghic, sinusul unui unghi ascuțit este raportul dintre cateta opusă și ipotenuză.",
    "formula": "sin α=cateta opusă/ipotenuză",
    "aliases": [
      "sinus"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-80",
    "subject": "math",
    "topic": "trigonometry",
    "title": "Definiția cosinusului",
    "statement": "Într-un triunghi dreptunghic, cosinusul unui unghi ascuțit este raportul dintre cateta alăturată și ipotenuză.",
    "formula": "cos α=cateta alăturată/ipotenuză",
    "aliases": [
      "cosinus"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-81",
    "subject": "math",
    "topic": "trigonometry",
    "title": "Definiția tangentei",
    "statement": "Tangenta unui unghi ascuțit este raportul dintre cateta opusă și cateta alăturată.",
    "formula": "tan α=sin α/cos α",
    "aliases": [
      "tangenta"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-82",
    "subject": "math",
    "topic": "trigonometry",
    "title": "Identitatea trigonometrică fundamentală",
    "statement": "Pentru orice unghi real, suma pătratelor sinusului și cosinusului este 1.",
    "formula": "sin²x+cos²x=1",
    "aliases": [
      "sin patrat plus cos patrat"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-83",
    "subject": "math",
    "topic": "trigonometry",
    "title": "Formula sinusului sumei",
    "statement": "Sinusul sumei a două unghiuri este suma produselor sinus–cosinus corespunzătoare.",
    "formula": "sin(a+b)=sin a cos b+cos a sin b",
    "aliases": [
      "sinus suma"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-84",
    "subject": "math",
    "topic": "trigonometry",
    "title": "Formula cosinusului sumei",
    "statement": "Cosinusul sumei a două unghiuri este diferența dintre produsul cosinusurilor și produsul sinusurilor.",
    "formula": "cos(a+b)=cos a cos b−sin a sin b",
    "aliases": [
      "cosinus suma"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-85",
    "subject": "math",
    "topic": "trigonometry",
    "title": "Formula sinusului dublului",
    "statement": "Sinusul dublului unui unghi este de două ori produsul sinusului și cosinusului unghiului.",
    "formula": "sin 2x=2sin x cos x",
    "aliases": [
      "sinus dublu"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-86",
    "subject": "math",
    "topic": "trigonometry",
    "title": "Formula cosinusului dublului",
    "statement": "Cosinusul dublului unui unghi poate fi exprimat ca diferență de pătrate.",
    "formula": "cos 2x=cos²x−sin²x",
    "aliases": [
      "cosinus dublu"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-87",
    "subject": "math",
    "topic": "trigonometry",
    "title": "Conversia grade în radiani",
    "statement": "O rotație completă are 360° sau 2π radiani.",
    "formula": "rad=grade·π/180",
    "aliases": [
      "grade radiani"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-88",
    "subject": "math",
    "topic": "trigonometry",
    "title": "Formula lui Euler",
    "statement": "Exponențiala complexă a unui unghi imaginar unește cosinusul și sinusul.",
    "formula": "e^(ix)=cos x+i sin x",
    "aliases": [
      "euler complex trigonometric"
    ],
    "level": "advanced"
  },
  {
    "id": "math-89",
    "subject": "math",
    "topic": "trigonometry",
    "title": "Formula lui De Moivre",
    "statement": "Puterea unui număr complex de modul unu se calculează multiplicând argumentul.",
    "formula": "(cos x+i sin x)ⁿ=cos nx+i sin nx",
    "aliases": [
      "de moivre"
    ],
    "level": "advanced"
  },
  {
    "id": "math-90",
    "subject": "math",
    "topic": "functions",
    "title": "Definiția funcției",
    "statement": "O funcție asociază fiecărui element din domeniu exact un element din codomeniu.",
    "formula": "f:A→B",
    "aliases": [
      "functie definitie"
    ],
    "level": "beginner"
  },
  {
    "id": "math-91",
    "subject": "math",
    "topic": "functions",
    "title": "Funcția liniară",
    "statement": "O funcție de forma f(x)=ax+b are graficul o dreaptă.",
    "formula": "f(x)=ax+b",
    "aliases": [
      "functie afina"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-92",
    "subject": "math",
    "topic": "functions",
    "title": "Funcția pătratică",
    "statement": "O funcție de forma f(x)=ax²+bx+c, a nenul, are grafic parabolic.",
    "formula": "f(x)=ax²+bx+c",
    "aliases": [
      "parabola"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-93",
    "subject": "math",
    "topic": "functions",
    "title": "Vârful parabolei",
    "statement": "Abscisa vârfului parabolei ax²+bx+c este −b/(2a).",
    "formula": "xᵥ=−b/(2a); yᵥ=f(xᵥ)",
    "aliases": [
      "varful parabolei"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-94",
    "subject": "math",
    "topic": "functions",
    "title": "Domeniul de definiție",
    "statement": "Domeniul de definiție este mulțimea valorilor de intrare pentru care expresia funcției este definită.",
    "formula": "D_f",
    "aliases": [
      "domeniu functie"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-95",
    "subject": "math",
    "topic": "functions",
    "title": "Funcție injectivă",
    "statement": "O funcție este injectivă dacă valori distincte din domeniu au imagini distincte.",
    "formula": "f(x₁)=f(x₂) ⇒ x₁=x₂",
    "aliases": [
      "injectivitate"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-96",
    "subject": "math",
    "topic": "functions",
    "title": "Funcție surjectivă",
    "statement": "O funcție este surjectivă dacă fiecare element al codomeniului are cel puțin o preimagine.",
    "formula": "Im(f)=codomeniu",
    "aliases": [
      "surjectivitate"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-97",
    "subject": "math",
    "topic": "functions",
    "title": "Funcție bijectivă",
    "statement": "O funcție este bijectivă dacă este atât injectivă, cât și surjectivă.",
    "formula": "bijectivă=injectivă+surjectivă",
    "aliases": [
      "bijectivitate"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-98",
    "subject": "math",
    "topic": "functions",
    "title": "Compunerea funcțiilor",
    "statement": "Compunerea aplică mai întâi g, apoi f, acolo unde ambele aplicații sunt definite.",
    "formula": "(f∘g)(x)=f(g(x))",
    "aliases": [
      "compunere functii"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-99",
    "subject": "math",
    "topic": "functions",
    "title": "Funcția inversă",
    "statement": "O funcție bijectivă admite o inversă care reface corespondența.",
    "formula": "f⁻¹(f(x))=x",
    "aliases": [
      "inversa unei functii"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-100",
    "subject": "math",
    "topic": "functions",
    "title": "Continuitatea unei funcții",
    "statement": "O funcție este continuă în x₀ dacă limita sa în x₀ este egală cu valoarea funcției acolo.",
    "formula": "lim(x→x₀)f(x)=f(x₀)",
    "aliases": [
      "continuitate"
    ],
    "level": "advanced"
  },
  {
    "id": "math-101",
    "subject": "math",
    "topic": "functions",
    "title": "Monotonia funcției",
    "statement": "O funcție este crescătoare dacă x₁<x₂ implică f(x₁)≤f(x₂) pe intervalul considerat.",
    "formula": "x₁<x₂ ⇒ f(x₁)≤f(x₂)",
    "aliases": [
      "crescatoare descrescatoare"
    ],
    "level": "advanced"
  },
  {
    "id": "math-102",
    "subject": "math",
    "topic": "functions",
    "title": "Asimptotă verticală",
    "statement": "Dreapta x=a este asimptotă verticală dacă cel puțin una dintre limitele laterale ale funcției tinde la infinit în modul.",
    "formula": "lim(x→a±) f(x)=±∞",
    "aliases": [
      "asimptota verticala"
    ],
    "level": "advanced"
  },
  {
    "id": "math-103",
    "subject": "math",
    "topic": "measurement",
    "title": "Unități de lungime",
    "statement": "În SI, unitatea fundamentală de lungime este metrul.",
    "formula": "1 km=1000 m; 1 m=100 cm",
    "aliases": [
      "conversii lungime"
    ],
    "level": "beginner"
  },
  {
    "id": "math-104",
    "subject": "math",
    "topic": "measurement",
    "title": "Unități de arie",
    "statement": "Unitatea SI de arie este metrul pătrat.",
    "formula": "1 m²=10 000 cm²",
    "aliases": [
      "conversii arie"
    ],
    "level": "beginner"
  },
  {
    "id": "math-105",
    "subject": "math",
    "topic": "measurement",
    "title": "Unități de volum",
    "statement": "Unitatea SI de volum este metrul cub.",
    "formula": "1 m³=1000 L",
    "aliases": [
      "conversii volum"
    ],
    "level": "beginner"
  },
  {
    "id": "math-106",
    "subject": "math",
    "topic": "measurement",
    "title": "Unități de masă",
    "statement": "Unitatea SI de masă este kilogramul.",
    "formula": "1 kg=1000 g",
    "aliases": [
      "conversii masa"
    ],
    "level": "beginner"
  },
  {
    "id": "math-107",
    "subject": "math",
    "topic": "measurement",
    "title": "Unități de timp",
    "statement": "Secunda este unitatea SI de timp.",
    "formula": "1 h=60 min=3600 s",
    "aliases": [
      "conversii timp"
    ],
    "level": "beginner"
  },
  {
    "id": "math-108",
    "subject": "math",
    "topic": "measurement",
    "title": "Densitatea",
    "statement": "Densitatea medie este masa împărțită la volum.",
    "formula": "ρ=m/V",
    "aliases": [
      "masa volum"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-109",
    "subject": "math",
    "topic": "measurement",
    "title": "Scara hărții",
    "statement": "La o scară 1:n, o unitate pe hartă corespunde la n unități reale, în aceeași unitate de măsură.",
    "formula": "d_real=n·d_hartă",
    "aliases": [
      "scara plan"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-110",
    "subject": "math",
    "topic": "measurement",
    "title": "Eroarea absolută",
    "statement": "Eroarea absolută este modulul diferenței dintre valoarea măsurată și valoarea de referință.",
    "formula": "Eₐ=|x_m−x_ref|",
    "aliases": [
      "eroare masurare"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-111",
    "subject": "math",
    "topic": "measurement",
    "title": "Eroarea relativă",
    "statement": "Eroarea relativă este raportul dintre eroarea absolută și modulul valorii de referință nenule.",
    "formula": "Eᵣ=Eₐ/|x_ref|",
    "aliases": [
      "eroare procentuala"
    ],
    "level": "intermediate"
  },
  {
    "id": "math-112",
    "subject": "math",
    "topic": "statistics",
    "level": "beginner",
    "title": "Media aritmetică",
    "statement": "Media aritmetică a n valori este suma valorilor împărțită la n.",
    "formula": "x̄=(x₁+⋯+xₙ)/n",
    "aliases": [
      "medie"
    ]
  },
  {
    "id": "math-113",
    "subject": "math",
    "topic": "statistics",
    "level": "beginner",
    "title": "Mediana",
    "statement": "Mediana este valoarea centrală a datelor ordonate, sau media celor două valori centrale dacă numărul lor este par.",
    "formula": "Me",
    "aliases": [
      "valoarea mediana"
    ]
  },
  {
    "id": "math-114",
    "subject": "math",
    "topic": "statistics",
    "level": "beginner",
    "title": "Modul statistic",
    "statement": "Modul este valoarea sau valorile cu frecvența cea mai mare în setul de date.",
    "formula": "Mo",
    "aliases": [
      "moda statistica"
    ]
  },
  {
    "id": "math-115",
    "subject": "math",
    "topic": "statistics",
    "level": "beginner",
    "title": "Frecvența absolută",
    "statement": "Frecvența absolută a unei valori reprezintă numărul aparițiilor ei în date.",
    "formula": "nᵢ",
    "aliases": [
      "frecventa"
    ]
  },
  {
    "id": "math-116",
    "subject": "math",
    "topic": "statistics",
    "level": "beginner",
    "title": "Frecvența relativă",
    "statement": "Frecvența relativă a unei valori este frecvența absolută împărțită la numărul total de observații.",
    "formula": "fᵢ=nᵢ/n",
    "aliases": [
      "procent frecventa"
    ]
  },
  {
    "id": "math-117",
    "subject": "math",
    "topic": "statistics",
    "level": "beginner",
    "title": "Probabilitatea clasică",
    "statement": "Pentru rezultate elementare echiprobabile, probabilitatea unui eveniment este numărul cazurilor favorabile împărțit la numărul cazurilor posibile.",
    "formula": "P(A)=N(A)/N(Ω)",
    "aliases": [
      "probabilitate clasica"
    ]
  },
  {
    "id": "math-118",
    "subject": "math",
    "topic": "statistics",
    "level": "intermediate",
    "title": "Varianța populației",
    "statement": "Varianța populației este media pătratelor abaterilor valorilor față de media aritmetică.",
    "formula": "σ²=Σ(xᵢ−μ)²/N",
    "aliases": [
      "varianta"
    ]
  },
  {
    "id": "math-119",
    "subject": "math",
    "topic": "statistics",
    "level": "intermediate",
    "title": "Varianța eșantionului",
    "statement": "Varianța eșantionului cu corecția Bessel împarte suma pătratelor abaterilor la n−1.",
    "formula": "s²=Σ(xᵢ−x̄)²/(n−1)",
    "aliases": [
      "varianta esantion"
    ]
  },
  {
    "id": "math-120",
    "subject": "math",
    "topic": "statistics",
    "level": "intermediate",
    "title": "Abaterea standard",
    "statement": "Abaterea standard este rădăcina pătrată a varianței.",
    "formula": "σ=√σ²",
    "aliases": [
      "deviatia standard"
    ]
  },
  {
    "id": "math-121",
    "subject": "math",
    "topic": "statistics",
    "level": "intermediate",
    "title": "Proprietatea probabilităților complementare",
    "statement": "Probabilitatea evenimentului contrar este unu minus probabilitatea evenimentului.",
    "formula": "P(Aᶜ)=1−P(A)",
    "aliases": [
      "complementara probabilitate"
    ]
  },
  {
    "id": "math-122",
    "subject": "math",
    "topic": "statistics",
    "level": "intermediate",
    "title": "Formula reuniunii a două evenimente",
    "statement": "Probabilitatea reuniunii este suma probabilităților minus probabilitatea intersecției.",
    "formula": "P(A∪B)=P(A)+P(B)−P(A∩B)",
    "aliases": [
      "reuniune probabilitati"
    ]
  },
  {
    "id": "math-123",
    "subject": "math",
    "topic": "statistics",
    "level": "intermediate",
    "title": "Probabilitatea condiționată",
    "statement": "Probabilitatea lui A condiționată de B este raportul dintre probabilitatea intersecției A cu B și probabilitatea lui B, dacă B are probabilitate nenulă.",
    "formula": "P(A|B)=P(A∩B)/P(B)",
    "aliases": [
      "conditional probability"
    ]
  },
  {
    "id": "math-124",
    "subject": "math",
    "topic": "statistics",
    "level": "intermediate",
    "title": "Independența evenimentelor",
    "statement": "Două evenimente sunt independente dacă probabilitatea intersecției lor este produsul probabilităților.",
    "formula": "P(A∩B)=P(A)P(B)",
    "aliases": [
      "evenimente independente"
    ]
  },
  {
    "id": "math-125",
    "subject": "math",
    "topic": "statistics",
    "level": "intermediate",
    "title": "Distribuția binomială",
    "statement": "Numărul succeselor în n încercări Bernoulli independente cu probabilitate constantă p urmează distribuția binomială.",
    "formula": "P(X=k)=C(n,k)pᵏ(1−p)ⁿ⁻ᵏ",
    "aliases": [
      "binomiala"
    ]
  },
  {
    "id": "math-126",
    "subject": "math",
    "topic": "statistics",
    "level": "advanced",
    "title": "Speranța matematică discretă",
    "statement": "Speranța unei variabile aleatoare discrete este suma valorilor înmulțite cu probabilitățile lor.",
    "formula": "E[X]=Σxᵢpᵢ",
    "aliases": [
      "valoare asteptata"
    ]
  },
  {
    "id": "math-127",
    "subject": "math",
    "topic": "statistics",
    "level": "advanced",
    "title": "Legea numerelor mari",
    "statement": "În condiții de independență și distribuție identică cu medie finită, media eșantionului converge în probabilitate la media teoretică.",
    "formula": "x̄ₙ→μ în probabilitate",
    "aliases": [
      "law of large numbers"
    ]
  },
  {
    "id": "math-128",
    "subject": "math",
    "topic": "statistics",
    "level": "advanced",
    "title": "Teorema limită centrală",
    "statement": "Pentru observații independente identic distribuite cu medie și varianță finite, suma centrată și normalizată converge în distribuție către normală standard.",
    "formula": "(ΣXᵢ−nμ)/(σ√n) ⇒ N(0,1)",
    "aliases": [
      "limita centrala"
    ]
  },
  {
    "id": "math-129",
    "subject": "math",
    "topic": "statistics",
    "level": "advanced",
    "title": "Covarianța",
    "statement": "Covarianța măsoară abaterea medie comună a două variabile aleatoare față de mediile lor.",
    "formula": "Cov(X,Y)=E[(X−E X)(Y−E Y)]",
    "aliases": [
      "covarianta"
    ]
  },
  {
    "id": "math-130",
    "subject": "math",
    "topic": "statistics",
    "level": "advanced",
    "title": "Corelația Pearson",
    "statement": "Corelația Pearson normalizează covarianța prin produsul abaterilor standard nenule.",
    "formula": "ρ=Cov(X,Y)/(σ_Xσ_Y)",
    "aliases": [
      "coeficient corelatie"
    ]
  },
  {
    "id": "math-131",
    "subject": "math",
    "topic": "statistics",
    "level": "advanced",
    "title": "Intervalul de încredere al mediei",
    "statement": "Pentru observații independente normale cu varianță necunoscută, intervalul bilateral t pentru medie este media plus sau minus cuantila t înmulțită cu eroarea standard.",
    "formula": "x̄±t_(1−α/2,n−1)s/√n",
    "aliases": [
      "interval incredere"
    ]
  },
  {
    "id": "math-132",
    "subject": "math",
    "topic": "linear-algebra",
    "level": "advanced",
    "title": "Vector în spațiul euclidian",
    "statement": "Un vector în ℝⁿ este un n-tuplu ordonat de numere reale.",
    "formula": "v=(v₁,…,vₙ)",
    "aliases": [
      "vector definitie"
    ]
  },
  {
    "id": "math-133",
    "subject": "math",
    "topic": "linear-algebra",
    "level": "advanced",
    "title": "Adunarea vectorilor",
    "statement": "Adunarea vectorilor din ℝⁿ se face pe componente.",
    "formula": "(a₁,…,aₙ)+(b₁,…,bₙ)=(a₁+b₁,…,aₙ+bₙ)",
    "aliases": [
      "suma vectori"
    ]
  },
  {
    "id": "math-134",
    "subject": "math",
    "topic": "linear-algebra",
    "level": "advanced",
    "title": "Produsul scalar euclidian",
    "statement": "Produsul scalar este suma produselor coordonatelor corespunzătoare.",
    "formula": "u·v=Σuᵢvᵢ",
    "aliases": [
      "dot product"
    ]
  },
  {
    "id": "math-135",
    "subject": "math",
    "topic": "linear-algebra",
    "level": "advanced",
    "title": "Norma euclidiană",
    "statement": "Norma euclidiană a unui vector este rădăcina sumei pătratelor coordonatelor.",
    "formula": "‖v‖=√(Σvᵢ²)",
    "aliases": [
      "lungimea vectorului"
    ]
  },
  {
    "id": "math-136",
    "subject": "math",
    "topic": "linear-algebra",
    "level": "advanced",
    "title": "Ortogonalitatea vectorilor",
    "statement": "Doi vectori sunt ortogonali dacă produsul lor scalar este zero.",
    "formula": "u·v=0",
    "aliases": [
      "perpendicular vectori"
    ]
  },
  {
    "id": "math-137",
    "subject": "math",
    "topic": "linear-algebra",
    "level": "advanced",
    "title": "Inegalitatea Cauchy–Schwarz",
    "statement": "Modulul produsului scalar a doi vectori este cel mult produsul normelor lor.",
    "formula": "|u·v|≤‖u‖‖v‖",
    "aliases": [
      "cauchy schwarz"
    ]
  },
  {
    "id": "math-138",
    "subject": "math",
    "topic": "linear-algebra",
    "level": "advanced",
    "title": "Independența liniară",
    "statement": "Vectorii v₁,…,vₙ sunt liniar independenți dacă singura combinație liniară nulă are toți coeficienții zero.",
    "formula": "Σcᵢvᵢ=0 ⇒ cᵢ=0",
    "aliases": [
      "independenta vectori"
    ]
  },
  {
    "id": "math-139",
    "subject": "math",
    "topic": "linear-algebra",
    "level": "advanced",
    "title": "Baza unui spațiu vectorial",
    "statement": "O bază este un sistem liniar independent de vectori care generează întregul spațiu.",
    "formula": "bază=independență+generare",
    "aliases": [
      "baza vectoriala"
    ]
  },
  {
    "id": "math-140",
    "subject": "math",
    "topic": "linear-algebra",
    "level": "advanced",
    "title": "Dimensiunea spațiului vectorial",
    "statement": "Dimensiunea unui spațiu vectorial finit-dimensional este numărul de vectori din orice bază a lui.",
    "formula": "dim V",
    "aliases": [
      "dimensiune vectoriala"
    ]
  },
  {
    "id": "math-141",
    "subject": "math",
    "topic": "linear-algebra",
    "level": "advanced",
    "title": "Produsul matricial",
    "statement": "Elementul de pe linia i și coloana j din AB este suma produselor elementelor liniei i din A cu coloana j din B.",
    "formula": "(AB)ᵢⱼ=Σₖaᵢₖbₖⱼ",
    "aliases": [
      "inmultire matrice"
    ]
  },
  {
    "id": "math-142",
    "subject": "math",
    "topic": "linear-algebra",
    "level": "advanced",
    "title": "Determinantul 2×2",
    "statement": "Determinantul matricei pătrate 2×2 este diferența produselor diagonalelor.",
    "formula": "det[[a,b],[c,d]]=ad−bc",
    "aliases": [
      "determinant doi"
    ]
  },
  {
    "id": "math-143",
    "subject": "math",
    "topic": "linear-algebra",
    "level": "advanced",
    "title": "Formula inversării 2×2",
    "statement": "O matrice 2×2 cu determinant nenul se inversează prin permutarea diagonalelor și schimbarea semnelor elementelor nediagonale.",
    "formula": "A⁻¹=(1/(ad−bc))[[d,−b],[−c,a]]",
    "aliases": [
      "inversa matrice 2x2"
    ]
  },
  {
    "id": "math-144",
    "subject": "math",
    "topic": "linear-algebra",
    "level": "advanced",
    "title": "Transpusa unei matrice",
    "statement": "Transpusa unei matrice se obține prin interschimbarea liniilor cu coloanele.",
    "formula": "(Aᵀ)ᵢⱼ=Aⱼᵢ",
    "aliases": [
      "transpusa"
    ]
  },
  {
    "id": "math-145",
    "subject": "math",
    "topic": "linear-algebra",
    "level": "advanced",
    "title": "Valori proprii și vectori proprii",
    "statement": "Vectorul propriu nenul v al unei matrice A corespunde unei valori proprii λ dacă Av=λv.",
    "formula": "Av=λv, v≠0",
    "aliases": [
      "eigenvalue"
    ]
  },
  {
    "id": "math-146",
    "subject": "math",
    "topic": "linear-algebra",
    "level": "advanced",
    "title": "Polinomul caracteristic",
    "statement": "Valorile proprii ale unei matrice pătrate sunt rădăcinile polinomului său caracteristic.",
    "formula": "det(A−λI)=0",
    "aliases": [
      "caracteristic matrice"
    ]
  },
  {
    "id": "math-147",
    "subject": "math",
    "topic": "linear-algebra",
    "level": "advanced",
    "title": "Teorema spectrală reală",
    "statement": "Orice matrice reală simetrică este diagonalizabilă printr-o matrice ortogonală și are valori proprii reale.",
    "formula": "A=QΛQᵀ",
    "aliases": [
      "teorema spectrala"
    ]
  },
  {
    "id": "math-148",
    "subject": "math",
    "topic": "linear-algebra",
    "level": "advanced",
    "title": "Sistemul lui Cramer",
    "statement": "Un sistem liniar pătrat cu determinant nenul are soluție unică dată de raportul determinanților.",
    "formula": "xᵢ=det(Aᵢ)/det(A)",
    "aliases": [
      "regula lui cramer"
    ]
  },
  {
    "id": "math-149",
    "subject": "math",
    "topic": "analysis",
    "level": "intermediate",
    "title": "Noțiunea de limită",
    "statement": "Limita unei funcții în x₀ este L dacă valorile funcției devin arbitrar de apropiate de L când x se apropie de x₀ prin puncte ale domeniului.",
    "formula": "lim(x→x₀)f(x)=L",
    "aliases": [
      "limita functie"
    ]
  },
  {
    "id": "math-150",
    "subject": "math",
    "topic": "analysis",
    "level": "intermediate",
    "title": "Proprietatea limitelor de sumă",
    "statement": "Dacă funcțiile au limite finite în același punct, limita sumei este suma limitelor.",
    "formula": "lim(f+g)=lim f+lim g",
    "aliases": [
      "limita sumei"
    ]
  },
  {
    "id": "math-151",
    "subject": "math",
    "topic": "analysis",
    "level": "intermediate",
    "title": "Derivata puterii",
    "statement": "Derivata funcției xⁿ pentru n întreg nenegativ este nxⁿ⁻¹ (cu derivata constantei egală cu zero).",
    "formula": "(xⁿ)′=nxⁿ⁻¹",
    "aliases": [
      "regula puterii"
    ]
  },
  {
    "id": "math-152",
    "subject": "math",
    "topic": "analysis",
    "level": "intermediate",
    "title": "Derivata sumei",
    "statement": "Derivata unei sume de funcții derivabile este suma derivatelor.",
    "formula": "(f+g)′=f′+g′",
    "aliases": [
      "regula sumei derivata"
    ]
  },
  {
    "id": "math-153",
    "subject": "math",
    "topic": "analysis",
    "level": "intermediate",
    "title": "Derivata produsului",
    "statement": "Derivata produsului a două funcții derivabile este suma produselor încrucișate.",
    "formula": "(fg)′=f′g+fg′",
    "aliases": [
      "regula produsului derivata"
    ]
  },
  {
    "id": "math-154",
    "subject": "math",
    "topic": "analysis",
    "level": "intermediate",
    "title": "Derivata raportului",
    "statement": "Pentru funcții derivabile și numitor nenul, derivata raportului se calculează prin regula câtului.",
    "formula": "(f/g)′=(f′g−fg′)/g²",
    "aliases": [
      "regula catului derivata"
    ]
  },
  {
    "id": "math-155",
    "subject": "math",
    "topic": "analysis",
    "level": "intermediate",
    "title": "Regula lanțului",
    "statement": "Derivata unei compuneri de funcții derivabile este produsul derivatelor în punctele corespunzătoare.",
    "formula": "(f∘g)′(x)=f′(g(x))g′(x)",
    "aliases": [
      "chain rule"
    ]
  },
  {
    "id": "math-156",
    "subject": "math",
    "topic": "analysis",
    "level": "intermediate",
    "title": "Derivata sinusului",
    "statement": "Derivata sinusului este cosinusul atunci când argumentul este exprimat în radiani.",
    "formula": "(sin x)′=cos x",
    "aliases": [
      "derivata sin"
    ]
  },
  {
    "id": "math-157",
    "subject": "math",
    "topic": "analysis",
    "level": "intermediate",
    "title": "Derivata cosinusului",
    "statement": "Derivata cosinusului este opusul sinusului când argumentul este în radiani.",
    "formula": "(cos x)′=−sin x",
    "aliases": [
      "derivata cos"
    ]
  },
  {
    "id": "math-158",
    "subject": "math",
    "topic": "analysis",
    "level": "intermediate",
    "title": "Derivata exponențialei",
    "statement": "Exponențiala naturală este egală cu propria sa derivată.",
    "formula": "(eˣ)′=eˣ",
    "aliases": [
      "derivata exp"
    ]
  },
  {
    "id": "math-159",
    "subject": "math",
    "topic": "analysis",
    "level": "intermediate",
    "title": "Derivata logaritmului natural",
    "statement": "Derivata logaritmului natural al lui x, pentru x pozitiv, este inversul lui x.",
    "formula": "(ln x)′=1/x, x>0",
    "aliases": [
      "derivata ln"
    ]
  },
  {
    "id": "math-160",
    "subject": "math",
    "topic": "analysis",
    "level": "intermediate",
    "title": "Primitiva",
    "statement": "O primitivă a lui f pe un interval este o funcție F derivabilă cu F′=f pe acel interval.",
    "formula": "F′(x)=f(x)",
    "aliases": [
      "antiderivata"
    ]
  },
  {
    "id": "math-161",
    "subject": "math",
    "topic": "analysis",
    "level": "intermediate",
    "title": "Integrala puterii",
    "statement": "Pentru n diferit de −1, o primitivă a lui xⁿ este xⁿ⁺¹/(n+1).",
    "formula": "∫xⁿ dx=xⁿ⁺¹/(n+1)+C",
    "aliases": [
      "integrare puteri"
    ]
  },
  {
    "id": "math-162",
    "subject": "math",
    "topic": "analysis",
    "level": "advanced",
    "title": "Teorema valorilor intermediare",
    "statement": "O funcție continuă pe un interval închis ia toate valorile dintre valorile sale la capetele intervalului.",
    "formula": "f([a,b]) conține intervalul dintre f(a) și f(b)",
    "aliases": [
      "bolzano"
    ]
  },
  {
    "id": "math-163",
    "subject": "math",
    "topic": "analysis",
    "level": "advanced",
    "title": "Teorema lui Weierstrass",
    "statement": "O funcție reală continuă pe un interval închis și mărginit își atinge minimul și maximul.",
    "formula": "∃x_min,x_max∈[a,b]",
    "aliases": [
      "extreme functii"
    ]
  },
  {
    "id": "math-164",
    "subject": "math",
    "topic": "analysis",
    "level": "advanced",
    "title": "Teorema lui Taylor",
    "statement": "O funcție suficient de derivabilă se aproximează local prin polinomul Taylor, cu un termen rest specificat.",
    "formula": "f(x)=Σₖ₌₀ⁿ f⁽ᵏ⁾(a)(x−a)ᵏ/k!+Rₙ(x)",
    "aliases": [
      "taylor dezvoltare"
    ]
  },
  {
    "id": "math-165",
    "subject": "math",
    "topic": "analysis",
    "level": "advanced",
    "title": "Seria geometrică infinită",
    "statement": "Seria geometrică cu rație de modul subunitar converge la inversul lui 1 minus rația.",
    "formula": "Σₙ₌₀∞rⁿ=1/(1−r), |r|<1",
    "aliases": [
      "suma serie geometrica"
    ]
  },
  {
    "id": "math-166",
    "subject": "math",
    "topic": "analysis",
    "level": "advanced",
    "title": "Criteriul raportului",
    "statement": "Pentru o serie de termeni nenuli, dacă limita raportului modulelor consecutive este sub 1, seria converge absolut; dacă este peste 1, diverge.",
    "formula": "L=lim|aₙ₊₁/aₙ|",
    "aliases": [
      "criteriul d alembert"
    ]
  },
  {
    "id": "math-167",
    "subject": "math",
    "topic": "analysis",
    "level": "advanced",
    "title": "Criteriul rădăcinii",
    "statement": "Dacă limita superioară a rădăcinii de ordin n din modulul termenului este sub 1, seria converge absolut; dacă este peste 1, diverge.",
    "formula": "L=limsupⁿ√|aₙ|",
    "aliases": [
      "criteriul cauchy"
    ]
  },
  {
    "id": "math-168",
    "subject": "math",
    "topic": "analysis",
    "level": "advanced",
    "title": "Integrala prin părți",
    "statement": "Pentru funcții suficient de derivabile, integrala unui produs poate fi transformată prin regula integrării prin părți.",
    "formula": "∫u dv=uv−∫v du",
    "aliases": [
      "integrare prin parti"
    ]
  },
  {
    "id": "math-169",
    "subject": "math",
    "topic": "analysis",
    "level": "advanced",
    "title": "Schimbare de variabilă în integrale",
    "statement": "Dacă u=g(x), o integrală cu factor g′(x) se poate calcula în variabila u.",
    "formula": "∫f(g(x))g′(x)dx=∫f(u)du",
    "aliases": [
      "substitutie integrala"
    ]
  },
  {
    "id": "math-170",
    "subject": "math",
    "topic": "analysis",
    "level": "advanced",
    "title": "Derivate parțiale",
    "statement": "Derivata parțială în raport cu o variabilă consideră celelalte variabile independente constante.",
    "formula": "∂f/∂x",
    "aliases": [
      "derivata partiala"
    ]
  },
  {
    "id": "math-171",
    "subject": "math",
    "topic": "analysis",
    "level": "advanced",
    "title": "Gradientul",
    "statement": "Gradientul funcției scalare diferențiabile este vectorul derivatelor parțiale.",
    "formula": "∇f=(∂f/∂x₁,…,∂f/∂xₙ)",
    "aliases": [
      "gradient definitie"
    ]
  },
  {
    "id": "math-172",
    "subject": "math",
    "topic": "analysis",
    "level": "advanced",
    "title": "Teorema lui Green",
    "statement": "Pentru un domeniu plan regulat orientat pozitiv, integrala pe frontieră a unui câmp derivabil se leagă de integrala dublă a rotației sale scalare.",
    "formula": "∮(Pdx+Qdy)=∬(∂Q/∂x−∂P/∂y)dA",
    "aliases": [
      "green integrala"
    ]
  },
  {
    "id": "math-173",
    "subject": "math",
    "topic": "analysis",
    "level": "advanced",
    "title": "Teorema divergenței",
    "statement": "Fluxul unui câmp vectorial neted prin frontiera închisă a unui volum este integrala triplei divergenței în acel volum.",
    "formula": "∯F·n dS=∭div F dV",
    "aliases": [
      "gauss ostrogradski"
    ]
  },
  {
    "id": "math-174",
    "subject": "math",
    "topic": "differential",
    "level": "advanced",
    "title": "Ecuație diferențială ordinară",
    "statement": "O ecuație diferențială ordinară este o relație între o funcție necunoscută de o variabilă și derivatele sale.",
    "formula": "F(x,y,y′,…,y⁽ⁿ⁾)=0",
    "aliases": [
      "edo definitie"
    ]
  },
  {
    "id": "math-175",
    "subject": "math",
    "topic": "differential",
    "level": "advanced",
    "title": "Ecuație separabilă",
    "statement": "Ecuația y′=g(x)h(y) se poate separa, când h(y) nu este zero, în dy/h(y)=g(x)dx.",
    "formula": "dy/h(y)=g(x)dx",
    "aliases": [
      "separarea variabilelor"
    ]
  },
  {
    "id": "math-176",
    "subject": "math",
    "topic": "differential",
    "level": "advanced",
    "title": "Ecuație liniară de ordinul întâi",
    "statement": "Ecuația y′+p(x)y=q(x) se poate rezolva cu factorul integrant exp(∫p(x)dx).",
    "formula": "μ=e^(∫p(x)dx); (μy)′=μq",
    "aliases": [
      "factor integrant"
    ]
  },
  {
    "id": "math-177",
    "subject": "math",
    "topic": "differential",
    "level": "advanced",
    "title": "Ecuație cu creștere exponențială",
    "statement": "Soluțiile ecuației y′=ky sunt multipli ai exponențialei e^(kx).",
    "formula": "y=Ce^(kx)",
    "aliases": [
      "crestere exponentiala"
    ]
  },
  {
    "id": "math-178",
    "subject": "math",
    "topic": "differential",
    "level": "advanced",
    "title": "Ecuație liniară omogenă de ordinul doi",
    "statement": "Pentru coeficienți constanți, ecuația ay″+by′+cy=0 are soluții construite din rădăcinile ecuației caracteristice.",
    "formula": "ar²+br+c=0",
    "aliases": [
      "edo ordin doi"
    ]
  },
  {
    "id": "math-179",
    "subject": "math",
    "topic": "differential",
    "level": "advanced",
    "title": "Soluție particulară",
    "statement": "O soluție particulară satisface atât ecuația diferențială, cât și condițiile inițiale sau la frontieră impuse.",
    "formula": "y(x₀)=y₀",
    "aliases": [
      "conditie initiala"
    ]
  },
  {
    "id": "math-180",
    "subject": "math",
    "topic": "differential",
    "level": "advanced",
    "title": "Teorema Picard–Lindelöf",
    "statement": "Dacă f(x,y) este continuă local și local Lipschitz în y, problema y′=f(x,y), y(x₀)=y₀ are local o soluție unică.",
    "formula": "y′=f(x,y); y(x₀)=y₀",
    "aliases": [
      "existenta unicitate edo"
    ]
  },
  {
    "id": "math-181",
    "subject": "math",
    "topic": "differential",
    "level": "advanced",
    "title": "Ecuația logistică",
    "statement": "Ecuația logistică descrie creșterea cu rată redusă de apropierea de capacitatea K.",
    "formula": "y′=ry(1−y/K)",
    "aliases": [
      "logistica populatie"
    ]
  },
  {
    "id": "math-182",
    "subject": "math",
    "topic": "differential",
    "level": "advanced",
    "title": "Transformata Laplace",
    "statement": "Transformata Laplace a unei funcții f definită pe semiaxa pozitivă integrează f(t)e^(−st) dacă integrala converge.",
    "formula": "L{f}(s)=∫₀∞e^(−st)f(t)dt",
    "aliases": [
      "laplace"
    ]
  },
  {
    "id": "math-183",
    "subject": "math",
    "topic": "differential",
    "level": "advanced",
    "title": "Transformata Laplace a derivatei",
    "statement": "Sub condiții potrivite, transformata derivatei este sF(s) minus valoarea inițială.",
    "formula": "L{f′}=sF(s)−f(0)",
    "aliases": [
      "laplace derivata"
    ]
  },
  {
    "id": "math-184",
    "subject": "math",
    "topic": "differential",
    "level": "advanced",
    "title": "Sisteme diferențiale liniare",
    "statement": "Un sistem autonom liniar cu matrice constantă se scrie x′(t)=Ax(t), cu soluții exprimate prin exponențiala matricială.",
    "formula": "x(t)=e^(At)x(0)",
    "aliases": [
      "sistem edo"
    ]
  },
  {
    "id": "math-185",
    "subject": "math",
    "topic": "differential",
    "level": "advanced",
    "title": "Ecuația undei",
    "statement": "În una sau mai multe dimensiuni, ecuația undei leagă accelerația temporală de laplacianul spațial.",
    "formula": "∂²u/∂t²=c²Δu",
    "aliases": [
      "ecuatii cu derivate partiale"
    ]
  },
  {
    "id": "math-186",
    "subject": "math",
    "topic": "differential",
    "level": "advanced",
    "title": "Ecuația căldurii",
    "statement": "Ecuația căldurii descrie difuzia și leagă variația temporală de laplacian.",
    "formula": "∂u/∂t=κΔu",
    "aliases": [
      "difuzie caldura"
    ]
  },
  {
    "id": "math-187",
    "subject": "math",
    "topic": "discrete",
    "level": "intermediate",
    "title": "Factorialul",
    "statement": "Factorialul numărului natural n este produsul numerelor întregi de la 1 la n; prin convenție, 0!=1.",
    "formula": "n!=1·2·⋯·n; 0!=1",
    "aliases": [
      "factorial"
    ]
  },
  {
    "id": "math-188",
    "subject": "math",
    "topic": "discrete",
    "level": "intermediate",
    "title": "Aranjamente fără repetiție",
    "statement": "Numărul de ordonări a k obiecte distincte extrase dintre n este n!/(n−k)!.",
    "formula": "A(n,k)=n!/(n−k)!",
    "aliases": [
      "aranjamente"
    ]
  },
  {
    "id": "math-189",
    "subject": "math",
    "topic": "discrete",
    "level": "intermediate",
    "title": "Combinări fără repetiție",
    "statement": "Numărul de submulțimi de k elemente ale unei mulțimi de n elemente este coeficientul binomial.",
    "formula": "C(n,k)=n!/(k!(n−k)!)",
    "aliases": [
      "combinari"
    ]
  },
  {
    "id": "math-190",
    "subject": "math",
    "topic": "discrete",
    "level": "intermediate",
    "title": "Principiul adunării",
    "statement": "Dacă două alegeri sunt incompatibile și au m, respectiv n posibilități, alegerea uneia sau alteia are m+n posibilități.",
    "formula": "m+n",
    "aliases": [
      "principiu numarare adunare"
    ]
  },
  {
    "id": "math-191",
    "subject": "math",
    "topic": "discrete",
    "level": "intermediate",
    "title": "Principiul înmulțirii",
    "statement": "Dacă o alegere în două etape are m posibilități în prima și n în a doua pentru fiecare prima alegere, există mn rezultate.",
    "formula": "m·n",
    "aliases": [
      "principiu numarare inmultire"
    ]
  },
  {
    "id": "math-192",
    "subject": "math",
    "topic": "discrete",
    "level": "intermediate",
    "title": "Principiul includerii–excluderii",
    "statement": "Pentru două mulțimi finite, cardinalul reuniunii este suma cardinalelor minus cardinalul intersecției.",
    "formula": "|A∪B|=|A|+|B|−|A∩B|",
    "aliases": [
      "incluziune excluziune"
    ]
  },
  {
    "id": "math-193",
    "subject": "math",
    "topic": "discrete",
    "level": "intermediate",
    "title": "Principiul cutiei lui Dirichlet",
    "statement": "Dacă n+1 obiecte sunt distribuite în n cutii, cel puțin o cutie conține cel puțin două obiecte.",
    "formula": "n+1 obiecte în n cutii ⇒ ≥2 într-o cutie",
    "aliases": [
      "principiul porumbeilor"
    ]
  },
  {
    "id": "math-194",
    "subject": "math",
    "topic": "discrete",
    "level": "advanced",
    "title": "Relație de echivalență",
    "statement": "O relație este de echivalență dacă este reflexivă, simetrică și tranzitivă.",
    "formula": "reflexivă ∧ simetrică ∧ tranzitivă",
    "aliases": [
      "echivalenta relatie"
    ]
  },
  {
    "id": "math-195",
    "subject": "math",
    "topic": "discrete",
    "level": "advanced",
    "title": "Relație de ordine parțială",
    "statement": "O relație de ordine parțială este reflexivă, antisimetrică și tranzitivă.",
    "formula": "reflexivă ∧ antisimetrică ∧ tranzitivă",
    "aliases": [
      "poset"
    ]
  },
  {
    "id": "math-196",
    "subject": "math",
    "topic": "discrete",
    "level": "advanced",
    "title": "Graf neorientat",
    "statement": "Un graf neorientat constă dintr-o mulțime de vârfuri și o mulțime de muchii între perechi de vârfuri.",
    "formula": "G=(V,E)",
    "aliases": [
      "graf definitie"
    ]
  },
  {
    "id": "math-197",
    "subject": "math",
    "topic": "discrete",
    "level": "advanced",
    "title": "Gradul unui vârf",
    "statement": "Gradul unui vârf dintr-un graf neorientat este numărul muchiilor incidente, numărând o buclă de două ori.",
    "formula": "deg(v)",
    "aliases": [
      "grad varf"
    ]
  },
  {
    "id": "math-198",
    "subject": "math",
    "topic": "discrete",
    "level": "advanced",
    "title": "Lema strângerii de mâini",
    "statement": "Într-un graf neorientat finit, suma gradelor tuturor vârfurilor este de două ori numărul muchiilor.",
    "formula": "Σdeg(v)=2|E|",
    "aliases": [
      "handshaking lemma"
    ]
  },
  {
    "id": "math-199",
    "subject": "math",
    "topic": "discrete",
    "level": "advanced",
    "title": "Arbore",
    "statement": "Un arbore este un graf neorientat conex și fără cicluri; dacă are n vârfuri, are n−1 muchii.",
    "formula": "|E|=|V|−1",
    "aliases": [
      "arbore graf"
    ]
  },
  {
    "id": "math-200",
    "subject": "math",
    "topic": "discrete",
    "level": "advanced",
    "title": "Drum eulerian",
    "statement": "Un drum eulerian parcurge fiecare muchie a grafului exact o dată.",
    "formula": "—",
    "aliases": [
      "eulerian graph"
    ]
  },
  {
    "id": "math-201",
    "subject": "math",
    "topic": "discrete",
    "level": "advanced",
    "title": "Circuit hamiltonian",
    "statement": "Un circuit hamiltonian vizitează fiecare vârf exact o dată înainte de întoarcerea în punctul de plecare.",
    "formula": "—",
    "aliases": [
      "hamiltonian graph"
    ]
  },
  {
    "id": "math-202",
    "subject": "math",
    "topic": "discrete",
    "level": "advanced",
    "title": "Algoritmul lui Euclid",
    "statement": "Cel mai mare divizor comun al două numere întregi se calculează prin înlocuirea repetată a perechii (a,b) cu (b,a mod b).",
    "formula": "cmmdc(a,b)=cmmdc(b,a mod b)",
    "aliases": [
      "cmmdc euclid"
    ]
  },
  {
    "id": "math-203",
    "subject": "math",
    "topic": "discrete",
    "level": "advanced",
    "title": "Congruența modulo n",
    "statement": "Două numere întregi sunt congruente modulo n pozitiv dacă diferența lor este divizibilă cu n.",
    "formula": "a≡b (mod n) ⇔ n|(a−b)",
    "aliases": [
      "aritmetica modulara"
    ]
  },
  {
    "id": "math-204",
    "subject": "math",
    "topic": "discrete",
    "level": "advanced",
    "title": "Teorema lui Fermat mică",
    "statement": "Dacă p este prim și a nu este divizibil cu p, atunci a la puterea p−1 este congruent cu 1 modulo p.",
    "formula": "a^(p−1)≡1 (mod p)",
    "aliases": [
      "fermat mica teorema"
    ]
  },
  {
    "id": "math-205",
    "subject": "math",
    "topic": "discrete",
    "level": "advanced",
    "title": "Teorema resturilor chinezești",
    "statement": "Pentru module pozitive prime între ele două câte două, orice sistem de congruențe are o soluție unică modulo produsul modulelor.",
    "formula": "x≡aᵢ (mod nᵢ)",
    "aliases": [
      "resturilor chinezesti"
    ]
  },
  {
    "id": "math-206",
    "subject": "math",
    "topic": "discrete",
    "level": "advanced",
    "title": "Recursivitatea matematică",
    "statement": "Un șir recurent este definit prin condiții inițiale și o relație care exprimă un termen prin termeni anteriori.",
    "formula": "aₙ=F(aₙ₋₁,…)",
    "aliases": [
      "relatie recurenta"
    ]
  },
  {
    "id": "math-207",
    "subject": "math",
    "topic": "discrete",
    "level": "advanced",
    "title": "Inducția matematică",
    "statement": "O proprietate P(n) este adevărată pentru toate numerele naturale de la un prag dacă este adevărată la prag și pasul P(n)⇒P(n+1) este valid.",
    "formula": "P(n₀) ∧ ∀n≥n₀(P(n)⇒P(n+1))",
    "aliases": [
      "demonstratie prin inductie"
    ]
  },
  {
    "id": "math-208",
    "subject": "math",
    "topic": "discrete",
    "level": "advanced",
    "title": "Legile lui De Morgan",
    "statement": "Negația unei conjuncții este disjuncția negațiilor, iar negația unei disjuncții este conjuncția negațiilor.",
    "formula": "¬(A∧B)=¬A∨¬B; ¬(A∨B)=¬A∧¬B",
    "aliases": [
      "de morgan logica"
    ]
  },
  {
    "id": "math-209",
    "subject": "math",
    "topic": "discrete",
    "level": "advanced",
    "title": "Implicația logică",
    "statement": "Implicația P⇒Q este falsă doar când P este adevărată și Q este falsă.",
    "formula": "P⇒Q ≡ ¬P∨Q",
    "aliases": [
      "implicatie"
    ]
  },
  {
    "id": "math-210",
    "subject": "math",
    "topic": "discrete",
    "level": "advanced",
    "title": "Contrapoziția",
    "statement": "Implicația P⇒Q este echivalentă logic cu ¬Q⇒¬P.",
    "formula": "P⇒Q ≡ ¬Q⇒¬P",
    "aliases": [
      "contrapozitie"
    ]
  },
  {
    "id": "math-211",
    "subject": "math",
    "topic": "discrete",
    "level": "advanced",
    "title": "Mulțimea părților",
    "statement": "Mulțimea părților lui A este colecția tuturor submulțimilor sale, iar pentru n elemente are 2ⁿ elemente.",
    "formula": "|𝒫(A)|=2ⁿ",
    "aliases": [
      "power set"
    ]
  }
]);
const normalize=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("ro").replace(/[‐‑–—]/g,"-").replace(/[^a-z0-9+]+/g," ").trim().replace(/\s+/g," ");
const LEVELS={beginner:0,intermediate:1,medium:1,advanced:2};
export function searchTheory(query,{subject=null,level=null,limit=12}={}){
 const q=normalize(query),tokens=q.split(" ").filter(Boolean);
 const allowed=Object.hasOwn(LEVELS,level)?LEVELS[level]:2;
 const eligible=THEORY_ENTRIES.filter(e=>(!subject||e.subject===subject)&&LEVELS[e.level]<=allowed);
 if(!q)return []; // No unsolicited theory cards before the user types.
 return eligible.map(entry=>{
  const name=normalize(entry.title),names=[name,...entry.aliases.map(normalize)];
  let score=names.some(n=>n===q)?100:names.some(n=>n.startsWith(q))?90:names.some(n=>n.split(' ').some(w=>w.startsWith(q)))?80:names.some(n=>n.includes(q))?55:0;
  const blob=normalize([entry.title,...entry.aliases,entry.statement].join(" "));
  if(tokens.every(t=>blob.split(' ').some(w=>w.startsWith(t))))score=Math.max(score,35+tokens.length*3);
  else if(tokens.every(t=>blob.includes(t)))score=Math.max(score,20+tokens.length*3);
  return {entry,score};
 }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.entry.title.localeCompare(b.entry.title,"ro")).slice(0,Math.max(0,Math.min(50,limit))).map(x=>x.entry);
}
export function theorySubjects(){return ["math","physics","chemistry"].map(subject=>({subject,count:THEORY_ENTRIES.filter(e=>e.subject===subject).length}));}
