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
    "level": "medium"
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
    "level": "medium"
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
    "level": "medium"
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
    "level": "beginner"
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
    "level": "beginner"
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
    "level": "beginner"
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
    "level": "beginner"
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
    "level": "medium"
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
    "level": "medium"
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
    "level": "medium"
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
    "level": "beginner"
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
    "level": "medium"
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
    "level": "medium"
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
    "level": "advanced"
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
    "level": "advanced"
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
    "level": "advanced"
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
    "level": "advanced"
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
    "level": "advanced"
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
    "level": "advanced"
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
    "level": "advanced"
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
  }
]);
const normalize=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("ro").replace(/[‐‑–—]/g,"-").replace(/[^a-z0-9+]+/g," ").trim().replace(/\s+/g," ");
const LEVELS={beginner:0,medium:1,advanced:2};
export function searchTheory(query,{subject=null,level=null,limit=12}={}){
 const q=normalize(query),tokens=q.split(" ").filter(Boolean);
 const allowed=Object.hasOwn(LEVELS,level)?LEVELS[level]:2;
 const eligible=THEORY_ENTRIES.filter(e=>(!subject||e.subject===subject)&&LEVELS[e.level]<=allowed);
 if(!q)return eligible.slice(0,Math.max(0,Math.min(50,limit)));
 return eligible.map(entry=>{
  const name=normalize(entry.title),names=[name,...entry.aliases.map(normalize)];
  let score=names.some(n=>n===q)?100:names.some(n=>n.startsWith(q))?75:names.some(n=>n.includes(q))?55:0;
  const blob=normalize([entry.title,...entry.aliases,entry.statement].join(" "));
  if(tokens.every(t=>blob.includes(t)))score=Math.max(score,20+tokens.length*3);
  return {entry,score};
 }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||a.entry.title.localeCompare(b.entry.title,"ro")).slice(0,Math.max(0,Math.min(50,limit))).map(x=>x.entry);
}
export function theorySubjects(){return ["math","physics","chemistry"].map(subject=>({subject,count:THEORY_ENTRIES.filter(e=>e.subject===subject).length}));}
