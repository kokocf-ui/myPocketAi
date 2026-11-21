import {physicsUpperTeachingGuide} from './physics_upper_teaching_guides.mjs';

// Independent original upper-secondary Physics study cases. These are
// pedagogical examples based on common open educational physics concepts,
// not a copied textbook and NOT a certified year-by-year national curriculum.
// Each case has a unique scientific concept, worked example, pupil question
// and a verifiable reference answer. The grade's own curriculum framework
// decides which chapters to include; we do not invent a national syllabus.
const methodNotes={"units":"Verificăm toate conversiile prin păstrarea dimensiunilor și scriem unitatea și ordinul de mărime lângă rezultatul final.","kinematics":"Calculăm diferența dintre valorile inițiale și finale, apoi interpretăm sensul fizic al rezultatului pe axa aleasă.","dynamics":"Reprezentăm mai întâi forțele asupra unui singur corp și precizăm sensurile, ca să nu confundăm rezultanta cu o forță izolată.","energy":"Verificăm că datele au unități compatibile și că energia rezultată este exprimată în jouli, cu un reper precizat când este necesar.","fluids":"Identificăm suprafața, adâncimea sau volumul de fluid relevant și verificăm unitățile pentru presiune ori forța arhimedică.","heat":"Separăm schimbarea temperaturii de o eventuală schimbare de fază și verificăm masele și constantele în unități compatibile.","electric":"Precizăm ce mărimi sunt date și ce configurație a circuitului sau condensatorului justifică formula utilizată.","waves":"Folosim hertz pentru frecvență, secunde pentru perioadă și metri pentru lungime, verificând relația dimensională.","optics":"Desenăm o normală la suprafață sau axa optică și precizăm convenția de semn înaintea aplicării relațiilor.","electromagnetism":"Verificăm orientarea conductorului, normalei ori fluxului magnetic, apoi deducem corect direcția sau unitatea rezultatului.","thermodynamics":"Precizăm temperatura absolută și convenția semnelor pentru lucrul mecanic, apoi verificăm conservarea energiei.","circuits":"Desenăm ramurile și nodurile înaintea calculului, pentru a nu confunda conexiunea în serie cu cea în paralel.","modern":"Folosim unități SI pentru constantele fizice și verificăm ordinul de mărime al rezultatului sau al fracției rămase.","measurement":"Păstrăm citirile inițiale și verificăm scala și precizia instrumentului înainte de rotunjirea concluziei."};
const chapters={
  "units": [
    [
      "Dimensiunea fizică a unei mărimi",
      "Dimensiunile exprimă tipul unei mărimi, independent de unitatea concretă. O relație omogenă trebuie să aibă aceleași dimensiuni în ambii membri; aceasta este o verificare necesară, dar nu suficientă pentru corectitudinea formulei.",
      "Pentru viteza medie v=d/t, unitatea rezultată este m/s. Produsul d·t nu poate avea dimensiunea unei viteze.",
      "Ce unitate rezultă din raportul dintre accelerație și timp?",
      "m/s³, deoarece accelerația se măsoară în m/s²."
    ],
    [
      "Conversii de viteză",
      "Conversia dintre km/h și m/s se face ținând seama atât de kilometri, cât și de ore. Numeric, înmulțirea cu 1000/3600 transformă km/h în m/s. Nu converti doar numărul din fața unității.",
      "72 km/h × (1000 m/1 km) × (1 h/3600 s)=20 m/s.",
      "Transformă 108 km/h în m/s.",
      "30 m/s."
    ],
    [
      "Cifre semnificative",
      "Numărul de cifre raportate trebuie să reflecte precizia măsurărilor. O valoare calculată cu multe zecimale nu este automat mai precisă decât datele inițiale. În estimări, comunică ipotezele și limitele instrumentului.",
      "O valoare de 12,345 m rotunjită la trei cifre semnificative este 12,3 m.",
      "Rotunjește 0,004567 m la două cifre semnificative.",
      "0,0046 m."
    ]
  ],
  "kinematics": [
    [
      "Poziție, distanță și deplasare",
      "Deplasarea este diferența vectorială dintre poziția finală și cea inițială. Distanța parcursă reprezintă lungimea întregului traseu; nu se poate deduce din deplasare dacă drumul conține întoarceri.",
      "Un mobil parcurge 4 m spre est, apoi 4 m spre vest: distanța este 8 m, deplasarea finală este 0 m.",
      "Care este distanța pentru 3 m dus și 3 m întors?",
      "6 m, deși deplasarea este zero."
    ],
    [
      "Accelerație medie",
      "Accelerația medie este variația vectorului viteză pe interval de timp, a=(v₂−v₁)/Δt. Accelerarea nu înseamnă neapărat creșterea valorii vitezei: o schimbare de direcție reprezintă tot accelerație.",
      "O mașină își schimbă viteza de la 2 m/s la 10 m/s în 4 s, pe aceeași direcție: accelerația medie este 2 m/s².",
      "Ce accelerație medie are un corp de la 0 la 12 m/s în 3 s?",
      "4 m/s²."
    ],
    [
      "Aria de sub graficul viteză–timp",
      "Pentru o viteză cu semn, aria algebrică dintre grafic și axa timpului reprezintă deplasarea. Dacă graficul este deasupra axei, aria este pozitivă; sub axă contribuie negativ.",
      "Pentru v=6 m/s constant timp de 5 s, aria dreptunghiului de pe grafic este 30 m.",
      "Care este deplasarea la 4 m/s timp de 7 s?",
      "28 m."
    ]
  ],
  "dynamics": [
    [
      "Rezultanta forțelor",
      "Forțele se adună vectorial, astfel încât sensul și direcția contează. O rezultantă nulă înseamnă accelerație nulă într-un reper inerțial, nu neapărat viteză nulă.",
      "O forță de 12 N spre dreapta și una de 7 N spre stânga produc 5 N spre dreapta.",
      "Care este rezultanta a 8 N spre nord și 8 N spre sud?",
      "0 N."
    ],
    [
      "Legea fundamentală a dinamicii",
      "Într-un reper inerțial, pentru masă constantă F_rezultantă=m·a. Nu se aplică formula separat fiecărei forțe pentru a afla accelerația finală, fără compunerea lor.",
      "La masa de 4 kg și rezultanta de 8 N, accelerația este 2 m/s².",
      "Ce accelerație produce 15 N asupra masei de 5 kg?",
      "3 m/s²."
    ],
    [
      "Frecarea în modelul simplificat",
      "Frecarea la alunecare se poate aproxima prin Ff=μ·N într-un model școlar pentru suprafețe date. Coeficientul de frecare este fără unitate și relația nu trebuie extrapolată tuturor materialelor și vitezelor.",
      "Pentru N=50 N și μ=0,3, forța de frecare este de aproximativ 15 N.",
      "Calculează frecarea pentru μ=0,2 și N=40 N.",
      "8 N."
    ]
  ],
  "energy": [
    [
      "Energie cinetică",
      "Energia cinetică clasică se calculează din Ec=mv²/2; depinde de pătratul vitezei, nu liniar de viteză. Formula descrie energia de translație în limitele mecanicii clasice.",
      "Un obiect de 2 kg cu v=3 m/s are Ec=2×9/2=9 J.",
      "Ce energie cinetică are un corp de 4 kg la 5 m/s?",
      "50 J."
    ],
    [
      "Energia potențială și referința",
      "Aproape de suprafața Pământului, variația energiei potențiale poate fi calculată cu ΔEp=m·g·Δh. Nivelul zero este o convenție; ceea ce contează pentru multe probleme este variația.",
      "Pentru m=2 kg, g≈10 N/kg și urcare cu 3 m, ΔEp=60 J.",
      "Care este creșterea de energie pentru 3 kg ridicate cu 2 m la g=10 N/kg?",
      "60 J."
    ],
    [
      "Puterea medie",
      "Puterea exprimă transferul de energie pe unitatea de timp. Pentru o durată Δt în care se transferă ΔE, puterea medie este P=ΔE/Δt și se exprimă în wați.",
      "Un sistem transferă 150 J în 5 s: puterea medie este 30 W.",
      "Calculează puterea medie pentru 600 J în 20 s.",
      "30 W."
    ]
  ],
  "fluids": [
    [
      "Presiune și suprafață",
      "Presiunea medie este forța perpendiculară pe unitatea de suprafață, p=F/A. O forță egală poate produce presiune diferită pe suprafețe diferite, de aceea în probleme precizăm aria de contact.",
      "100 N pe 0,5 m² produc 200 Pa.",
      "Ce presiune rezultă din 80 N pe 0,4 m²?",
      "200 Pa."
    ],
    [
      "Presiunea hidrostatică",
      "Într-un lichid omogen aflat în repaus, diferența de presiune între două adâncimi este Δp=ρgΔh. Relația presupune densitate aproximativ constantă și accelerație gravitațională cunoscută.",
      "Pentru apă, ρ=1000 kg/m³, g≈10 N/kg și Δh=2 m, Δp≈20 000 Pa.",
      "Ce diferență de presiune apare pentru 1 m de apă la g=10 N/kg?",
      "10 000 Pa."
    ],
    [
      "Forța arhimedică",
      "Fluidul exercită asupra corpului scufundat o forță egală cu greutatea fluidului dezlocuit: Fa=ρfluid·g·Vdezlocuit. Nu substitui automat întreg volumul corpului dacă numai o parte este scufundată.",
      "Pentru 0,002 m³ de apă dezlocuită, ρ=1000 și g=10, Fa≈20 N.",
      "Care este Fa pentru 0,001 m³ de apă în aceleași condiții?",
      "10 N."
    ]
  ],
  "heat": [
    [
      "Căldura specifică",
      "Într-un model de încălzire fără schimbare de fază, energia transferată poate fi calculată prin Q=m·c·ΔT. Relația necesită masa, proprietatea materialului și variația temperaturii.",
      "Pentru 2 kg apă, c≈4200 J/(kg·K) și creștere cu 5 K, Q≈42 000 J.",
      "Ce energie necesită 1 kg de apă pentru creștere cu 2 K în același model?",
      "8 400 J."
    ],
    [
      "Căldura latentă",
      "La schimbarea de fază, o parte din energie modifică starea de agregare, iar temperatura poate rămâne aproximativ constantă. Pentru o fază definită, Q=m·L, cu L căldura latentă specifică.",
      "Topirea a 0,1 kg gheață la L≈334 000 J/kg necesită ≈33 400 J.",
      "Cât necesită 0,2 kg în același model?",
      "66 800 J."
    ],
    [
      "Transferul prin conducție",
      "Conducția termică transferă energie prin contact în material sau între materiale. Rata transferului depinde de conductivitate, geometrie și diferența de temperatură, astfel încât atingerea nu este un termometru.",
      "O bară metalică transferă în general energie termică mai rapid decât o bară de lemn asemănătoare.",
      "Pot două obiecte să pară diferit de reci la aceeași temperatură?",
      "Da, din cauza ratelor diferite de transfer termic."
    ]
  ],
  "electric": [
    [
      "Sarcina și intensitatea curentului",
      "Intensitatea este cantitatea de sarcină electrică ce trece printr-o secțiune pe unitatea de timp: I=ΔQ/Δt. Curentul convențional are un sens stabilit care nu trebuie confundat cu deplasarea electronilor în metal.",
      "La 2 A timp de 5 s trece o sarcină de 10 C prin secțiunea aleasă.",
      "Ce sarcină trece la 3 A în 4 s?",
      "12 C."
    ],
    [
      "Tensiune și lucru electric",
      "Diferența de potențial electric este legată de lucrul pe unitatea de sarcină: U=W/q în modelul potrivit. Tensiunea și curentul sunt mărimi distincte și se măsoară în volți și amperi.",
      "Un transfer de 12 J pentru 3 C corespunde unei diferențe de potențial de 4 V.",
      "Ce tensiune corespunde la 20 J pentru 5 C?",
      "4 V."
    ],
    [
      "Capacitatea electrică",
      "Capacitatea unui condensator este raportul dintre sarcina stocată și diferența de potențial, C=Q/U, în regim liniar. Se măsoară în farazi și depinde de geometrie și dielectric.",
      "Pentru Q=6 μC și U=3 V, capacitatea este C=2 μF.",
      "Ce capacitate avem la Q=12 μC și U=4 V?",
      "3 μF."
    ]
  ],
  "waves": [
    [
      "Perioadă și frecvență",
      "Frecvența este numărul de oscilații într-o secundă, iar perioada durata unei oscilații. Pentru o mișcare periodică, f=1/T, cu f în hertzi.",
      "La perioada T=0,25 s, frecvența este f=4 Hz.",
      "Ce frecvență corespunde perioadei de 0,5 s?",
      "2 Hz."
    ],
    [
      "Viteza de propagare a undei",
      "Pentru o undă periodică, viteza de propagare poate fi calculată v=f·λ dacă sunt cunoscute frecvența și lungimea de undă în același mediu. Viteza de propagare nu este viteza particulelor mediului.",
      "Pentru f=5 Hz și λ=2 m, v=10 m/s.",
      "Ce viteză are o undă la 8 Hz și 0,5 m?",
      "4 m/s."
    ],
    [
      "Ecoul și distanța",
      "Un ecou este reflexia sunetului la un obstacol. Timpul măsurat acoperă drumul dus-întors al undei, deci distanța până la obstacol este d=v·t/2, în condiții potrivite.",
      "La v≈340 m/s și întârziere de 0,6 s, d≈102 m.",
      "La 0,2 s în aceleași condiții, care este distanța?",
      "34 m."
    ]
  ],
  "optics": [
    [
      "Legea reflexiei",
      "În reflexia speculară pe o suprafață plană, unghiul de incidență este egal cu cel de reflexie, ambele măsurate față de normală. Dacă unghiul este dat față de suprafață, trebuie mai întâi convertit.",
      "La un unghi de incidență de 30° față de normală, unghiul de reflexie este 30°.",
      "Care este unghiul de reflexie când incidența este 25° față de normală?",
      "25°."
    ],
    [
      "Refracția în două medii",
      "Legea lui Snell este n₁sinθ₁=n₂sinθ₂ pentru situațiile în care modelul se aplică. Direcția razei poate să nu se schimbe la incidență normală, deși viteza luminii diferă între medii.",
      "La incidență perpendiculară, θ₁=0°, deci în modelul plan raza continuă în aceeași direcție.",
      "De ce nu se abate direcția razei la incidență normală?",
      "Unghiurile față de normală sunt nule în relația lui Snell."
    ],
    [
      "Ecuația lentilei subțiri",
      "În aproximația lentilei subțiri, 1/f=1/dₒ+1/dᵢ, cu o convenție de semne declarată. Imaginile reale și virtuale se deosebesc după traseul efectiv al razelor și semnele distanțelor.",
      "Pentru f=10 cm și obiect la 30 cm, dᵢ=15 cm în convenția de imagini reale pozitive.",
      "Ce distanță de imagine obții pentru f=20 cm și obiect la 40 cm?",
      "40 cm în aceeași convenție."
    ]
  ],
  "electromagnetism": [
    [
      "Forța magnetică asupra conductorului",
      "Un conductor parcurs de curent aflat într-un câmp magnetic poate suferi o forță, cu valoarea F=B·I·L·sinθ în modelul unui segment rectiliniu uniform. Direcția depinde de orientare și sensul curentului.",
      "Pentru B=0,5 T, I=2 A, L=0,3 m și θ=90°, F=0,3 N.",
      "Cât este forța pentru B=1 T, I=2 A, L=0,5 m perpendicular?",
      "1 N."
    ],
    [
      "Fluxul magnetic",
      "Fluxul printr-o suprafață plană într-un câmp uniform este Φ=B·A·cosθ, unde θ este unghiul dintre câmp și normala suprafeței. O confuzie frecventă este măsurarea unghiului față de plan.",
      "Pentru B=2 T, A=0,1 m² și normala paralelă cu câmpul, Φ=0,2 Wb.",
      "Care este Φ la B=1 T și A=0,5 m² cu normala paralelă?",
      "0,5 Wb."
    ],
    [
      "Inducția electromagnetică",
      "O schimbare a fluxului magnetic printr-un circuit poate induce tensiune electromotoare, aproximată prin |ε|=N|ΔΦ|/Δt în situații simple. Sensul efectului se interpretează folosind legea lui Lenz.",
      "Pentru N=10 spire și schimbarea fluxului cu 0,2 Wb în 2 s, |ε|=1 V.",
      "Cât este |ε| pentru 5 spire, ΔΦ=0,4 Wb și Δt=2 s?",
      "1 V."
    ]
  ],
  "thermodynamics": [
    [
      "Ecuația gazului ideal",
      "Într-un model al gazului ideal, pV=nRT; relația presupune comportare ideală și temperatură absolută. Convertirea Celsius–kelvin este obligatorie la substituție.",
      "Pentru 1 mol la 300 K într-un volum de 0,025 m³, cu R=8,31 J/(mol·K), p≈99 720 Pa.",
      "Ce presiune rezultă pentru 1 mol la 300 K în 0,05 m³?",
      "Aproximativ 49 860 Pa."
    ],
    [
      "Primul principiu al termodinamicii",
      "O convenție uzuală este ΔU=Q−W, unde W este lucrul realizat de sistem. Trebuie declarată convenția semnului, altfel rezultatul poate apărea cu semn invers.",
      "Dacă sistemul primește Q=500 J și realizează W=200 J, ΔU=300 J.",
      "Ce ΔU rezultă la Q=700 J și W=300 J în aceeași convenție?",
      "400 J."
    ],
    [
      "Transformarea izotermă",
      "Într-o transformare izotermă ideală cu aceeași cantitate de gaz, pV rămâne constant. Compresia crește presiunea dacă temperatura rămâne constantă.",
      "Dacă volumul unui gaz ideal se înjumătățește izoterm, presiunea se dublează.",
      "Ce se întâmplă cu p dacă V crește de patru ori izoterm?",
      "Presiunea scade de patru ori."
    ]
  ],
  "circuits": [
    [
      "Rezistoare în serie",
      "Într-un circuit serie, curentul are aceeași intensitate prin rezistoare. Rezistența echivalentă este suma rezistențelor, Rₑ=R₁+R₂+..., în modelul elementelor ohmice.",
      "Rezistoarele de 2 Ω și 3 Ω în serie au Rₑ=5 Ω.",
      "Cât este Rₑ pentru 4 Ω și 6 Ω în serie?",
      "10 Ω."
    ],
    [
      "Rezistoare în paralel",
      "În paralel, componentele au aceeași diferență de potențial și 1/Rₑ=1/R₁+1/R₂ pentru rezistoare ideale. Rezistența echivalentă este mai mică decât cea mai mică rezistență a ramurilor.",
      "Rezistoarele de 2 Ω și 3 Ω în paralel au Rₑ=(2×3)/(2+3)=1,2 Ω.",
      "Ce Rₑ au două rezistoare identice de 4 Ω în paralel?",
      "2 Ω."
    ],
    [
      "Legile lui Kirchhoff",
      "Într-un nod, suma curenților care intră este egală cu suma celor care ies, pentru un circuit obișnuit în regim staționar. Pe un contur, suma algebrică a variațiilor de potențial este zero.",
      "Dacă 5 A intră într-un nod și 2 A ies pe o ramură, 3 A trebuie să iasă pe cealaltă.",
      "Cât curent iese pe a doua ramură dacă intră 8 A și 3 A ies pe prima?",
      "5 A."
    ]
  ],
  "modern": [
    [
      "Energia fotonului",
      "În modelul cuantic, energia unui foton este E=h·f. Frecvența luminii determină energia fiecărui foton, nu intensitatea totală, care depinde și de numărul de fotoni.",
      "Pentru f=5×10¹⁴ Hz și h≈6,63×10⁻³⁴ J·s, E≈3,315×10⁻¹⁹ J.",
      "Ce se întâmplă cu energia fotonului dacă frecvența se dublează?",
      "Se dublează."
    ],
    [
      "Lungimea de undă a luminii",
      "În vid, frecvența și lungimea de undă sunt legate prin c=f·λ. Această relație nu înseamnă că fotonii au aceeași energie pentru toate culorile.",
      "Pentru f=6×10¹⁴ Hz și c≈3×10⁸ m/s, λ≈500 nm.",
      "Cât este λ la f=3×10¹⁴ Hz în vid?",
      "Aproximativ 1000 nm."
    ],
    [
      "Timpul de înjumătățire",
      "Într-un model de dezintegrare radioactivă, după fiecare timp de înjumătățire rămâne jumătate din numărul inițial de nuclee nedezintegrate, în medie pentru un ansamblu mare. Nu prezice momentul dezintegrației unui nucleu individual.",
      "Din 80 g de izotop radioactiv pur rămân în medie 20 g după două înjumătățiri.",
      "Cât rămâne în medie din 64 g după trei perioade?",
      "8 g."
    ]
  ],
  "measurement": [
    [
      "Erori ale instrumentelor",
      "Erorile întâmplătoare pot produce variație între măsurări, iar o eroare sistematică poate deplasa toate valorile în aceeași direcție. Repetarea nu elimină automat o calibrare greșită.",
      "Un termometru care indică permanent cu 2 °C mai mult rămâne deplasat chiar dacă faci zece citiri.",
      "Poate media citirilor elimina singură eroarea de calibrare?",
      "Nu."
    ],
    [
      "Media și variația măsurărilor",
      "Media aritmetică este suma valorilor împărțită la numărul lor, dar interpretarea cere și variația datelor. Două serii cu aceeași medie pot avea dispersii foarte diferite.",
      "Pentru 10,1 cm, 10,3 cm și 10,2 cm, media este 10,2 cm.",
      "Care este media dintre 8 s, 9 s și 10 s?",
      "9 s."
    ],
    [
      "Grafic și interpretarea pantei",
      "Panta unui grafic descrie schimbarea unei mărimi în raport cu alta, în unități definite de axe. Faptul că două date sunt corelate nu demonstrează automat o cauză fizică.",
      "Pe graficul poziție–timp, o variație de 20 m în 4 s reprezintă panta de 5 m/s.",
      "Ce unitate are panta unui grafic viteză–timp?",
      "m/s², adică accelerație."
    ]
  ]
};
export const PHYSICS_UPPER_CASES=Object.freeze(Object.fromEntries(
 Object.entries(chapters).map(([topic,items])=>[topic,Object.freeze(items.map(
 ([title,statement,workedExample,exercise,answer],i)=>Object.freeze({
  ...physicsUpperTeachingGuide(topic,i,'ro'),
  id:'upper-physics-case-'+topic+'-'+(i+1),subject:'physics',topic,
  level:'intermediate',title,statement,workedExample:workedExample+' '+methodNotes[topic],exercise,answer,
  source:'original-high-school-physics-advisory',nationallyVerified:false,
  language:'ro'
 })))])));
