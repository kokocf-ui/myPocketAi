// An original, age-progressive Astronomy course. It is NOT represented as the
// official timetable of any European school, where Astronomy may be integrated
// in Physics, Geography or other sciences, or offered as an optional subject.
// Each year introduces a new, checkable task rather than recycling the same
// illustration, definition and laboratory paragraph for all school years.
export const ASTRONOMY_UPPER_YEAR_METHODS=Object.freeze([
 {nameRo:'Fundamente, măsurări și observații',nameEn:'Foundations, measurements and observations',
  goalRo:'Construiește un model explicativ și deosebește datele măsurate de reprezentările schematice.',
  goalEn:'Build an explanatory model and distinguish measurements from schematic representations.',
  assessmentRo:'Etichetează un model și notează datele, unitățile și limitele observației.'},
 {nameRo:'Relații fizice și modele',nameEn:'Physical relations and models',
  goalRo:'Folosește formule fizice numai după definirea simbolurilor, a unităților și a ipotezelor.',
  goalEn:'Apply physical formulae after defining symbols, units and assumptions.',
  assessmentRo:'Rezolvă calculul prin substituție și verifică unitățile rezultatului.'},
 {nameRo:'Spectre, populații și interpretare',nameEn:'Spectra, populations and interpretation',
  goalRo:'Compară seturi de date și analizează o explicație care ar putea fi infirmată de observații.',
  goalEn:'Compare datasets and analyse an explanation that can be tested against observations.',
  assessmentRo:'Explică pe ce date se bazează o concluzie și ce alte cauze ar putea produce același rezultat.'},
 {nameRo:'Sinteză, incertitudine și cercetare',nameEn:'Synthesis, uncertainty and research',
  goalRo:'Construiește o analiză reproductibilă și explică propagarea erorilor și limitele modelului.',
  goalEn:'Build a reproducible analysis and explain uncertainty and the model’s limitations.',
  assessmentRo:'Formulează ipoteze rivale, propune verificări și redactează concluzii limitate de dovezi.'}
]);
// Each chapter supplies genuine worked astronomical examples and scientific
// context for each of the 4 school-year tiers. Values are deliberately
// described as rounded or illustrative; no live ephemerides are claimed.
export const ASTRONOMY_UPPER_CHAPTERS=Object.freeze({
 solar:{
  title:'Geometria Sistemului Solar și mișcarea Pământului',
  theory:[
   'Ziua și noaptea apar prin rotația Pământului în aproximativ 24 de ore. Anul corespunde revoluției Pământului în jurul Soarelui. Anotimpurile sunt explicate prin înclinarea axei terestre cu aproximativ 23,4°, nu prin distanța față de Soare.',
   'Mișcarea orbitală are o perioadă și o rază caracteristică. Legea a treia a lui Kepler, pentru orbite în jurul aceluiași corp central, permite compararea perioadelor fără a confunda masa planetei cu masa stelei.',
   'Luna reflectă lumina Soarelui. Fazele sunt o consecință a geometriei Soare–Pământ–Lună; o eclipsă cere alinierea apropiată de planul orbital și nu apare lunar.',
   'Un model al Sistemului Solar trebuie să declare separat scara diametrelor, a distanțelor și a timpului. În afara unei simulări numerice, pozițiile planetelor nu reprezintă efemeride curente.'
  ],
  formulas:['T ≈ 24 h pentru rotația terestră; înclinarea axei ≈ 23,4°',
   'T²/a³ ≈ constantă (orbite în jurul aceleiași stele)',
   'Faza observată depinde de unghiul Soare–Lună–observator',
   '1 UA = 149 597 870 700 m (definiție exactă)'],
  worked:[
   'Un glob se rotește în dreptul unei lămpi fixe. Un punct marcat pe glob trece din zona luminată în cea întunecată: aceasta modelează alternanța zi–noapte. În schimb, deplasarea globului pe un cerc în jurul lămpii reprezintă o revoluție anuală. Cele două mișcări nu sunt identice.',
   'Compară două orbite schematice de 1 UA și 4 UA în jurul aceleiași stele. Din T₂/T₁=(a₂/a₁)^(3/2), rezultă 4^(3/2)=8. Dacă prima perioadă este un an, a doua este opt ani; acesta este un calcul de model, nu o predicție pentru o planetă reală.',
   'La Lună plină, Pământul este aproximativ între Soare și Lună, dar orbita lunară este înclinată cu aproximativ 5°. De aceea umbra Pământului nu cade automat pe Lună. Un desen trebuie să arate și înclinarea, nu doar trei obiecte aliniate pe hârtie.',
   'La scara 1 UA = 1 m, Neptun la circa 30 UA ar fi la 30 m de Soare. Pământul ar fi la aproximativ 1 m, dar diametrul său ar avea sub 0,1 mm la aceeași scară. Un model de cameră cu planete mari nu poate fi simultan corect pentru diametre și distanțe.'
  ],
  questions:[
   'Ce mișcare explică ziua și noaptea și care este rolul înclinării axei terestre?',
   'În aproximația kepleriană, cât este T₂/T₁ când semiaxa orbitei a doua este de patru ori mai mare?',
   'De ce nu avem eclipsă de Lună la fiecare Lună plină?',
   'De ce un model cu planete de câțiva centimetri nu poate fi în mod obișnuit la aceeași scară cu distanțele dintr-o clasă?'
  ],
  answers:[
   'Rotația Pământului produce alternanța zi–noapte; înclinarea axei contribuie la anotimpuri.',
   'Opt: raportul este 4 la puterea 3/2, adică 8.',
   'Fiindcă orbita Lunii este înclinată față de planul orbitei terestre; alinierea potrivită este rară.',
   'Diametrele sunt extrem de mici în comparație cu distanțele orbitale; cele două scări sunt de ordin foarte diferit.'
  ]
 },
 sky:{
  title:'Cerul observat, hărți și coordonate',
  theory:[
   'Orizontul, zenitul, punctele cardinale și constelațiile ne permit să descriem cerul văzut dintr-un loc. O constelație este un model aparent: stelele sale pot avea distanțe foarte diferite față de Pământ.',
   'Altitudinea exprimă înălțimea unghiulară deasupra orizontului, iar azimutul exprimă direcția orizontală; ambele se schimbă cu locul și timpul observației.',
   'Ascensia dreaptă și declinația folosesc un sistem de coordonate legat de ecuatorul ceresc. Pentru a obține poziția unui astru în sistemul orizontal avem nevoie de latitudine și de timpul sideral local.',
   'Observațiile astronomice trebuie însoțite de timpul și locul măsurării, aparatul, precizia unghiulară și corecțiile relevante. Nu transformăm o hartă simulată într-o observație reală.'
  ],
  formulas:['Altitudinea este cuprinsă între −90° și +90°; la orizont h=0°',
   'Azimutul se măsoară pe orizont; în convenția nord-estică N=0°, E=90°',
   'H=LST−α, unde H este unghiul orar, LST timpul sideral și α ascensia dreaptă',
   'sin h=sin φ sin δ+cos φ cos δ cos H'],
  worked:[
   'La o observație sigură, un obiect aflat exact pe orizont are altitudinea 0°. Un obiect direct deasupra capului este la zenit, altitudine 90°. Desenul unei hărți trebuie să păstreze aceste repere.',
   'Dacă un astru este spre est la altitudine 30°, poți nota h=30° și azimut aproximativ 90° în convenția nord-estică. Aceste valori descriu un loc și un moment, nu coordonate universale ale stelei.',
   'Pentru LST=10 h și α=8 h, unghiul orar este H=2 h, echivalent cu 30°. Unitatea „oră” este aici unitate unghiulară de 15° pe oră, nu o durată de observație.',
   'Pentru φ=0°, δ=0° și H=0°, formula dă sin h=1, deci h=90°. Steaua este la zenit în acest model. Dacă data și longitudinea nu sunt cunoscute, nu poți pretinde că ea a fost efectiv observată în acel loc.'
  ],
  questions:[
   'Ce înseamnă altitudine 0° și ce înseamnă altitudine 90°?',
   'Pot două persoane din orașe diferite să aibă coordonate orizontale diferite pentru aceeași stea?',
   'Cât este unghiul orar pentru LST 10 h și α 8 h?',
   'Ce date lipsesc dacă o hartă a cerului afirmă o altitudine precisă fără a indica locul și ora?'
  ],
  answers:[
   '0° este orizontul, 90° este zenitul.',
   'Da, sistemul orizontal depinde de poziția observatorului și de timp.',
   '2 h unghiulare, adică 30°.',
   'Lipsesc localizarea, timpul și convenția de coordonate; precizia declarată nu poate fi verificată.'
  ]
 },
 distances:{
  title:'Distanțe astronomice și propagarea luminii',
  theory:[
   'Kilometrul este practic pentru vecinătatea Pământului, unitatea astronomică (UA) pentru Sistemul Solar, iar anul-lumină și parsecul pentru distanțele stelare. Un an-lumină este o distanță, nu un interval de timp.',
   'Lumina se propagă în vid cu viteza exactă c=299 792 458 m/s. Timpul de propagare depinde de distanță și trebuie deosebit de timpul în care se deplasează sursa.',
   'Paralaxa anuală este o măsură geometrică a distanței stelare. Formula d(pc)=1/p(arcsec) folosește paralaxa anuală p în secunde de arc, nu un unghi arbitrar măsurat de pe Pământ.',
   'Măsurările foarte îndepărtate folosesc metode diferite: paralaxă, lumânări standard și redshift, fiecare cu ipoteze și incertitudini. Nu putem transforma orice unghi sau luminozitate direct într-o distanță.'
  ],
  formulas:['1 UA = 149 597 870 700 m; 1 an-lumină ≈ 9,46×10¹⁵ m',
   't=d/c; c=299 792 458 m/s',
   'd(pc)=1/p(arcsec), pentru paralaxa anuală',
   'μ=m−M=5 log₁₀(d/10 pc), neglijând extincția'],
  worked:[
   'Distanța medie Pământ–Soare este 1 UA, adică aproximativ 150 milioane km. O distanță de 2 UA este aproximativ 300 milioane km. Acesta este un calcul de conversie, nu poziția actuală a unei planete.',
   'Pentru aproximativ 150 milioane km, t≈150 000 000/300 000=500 s, adică 8 min 20 s. Valorile sunt rotunjite; lumina primită acum a părăsit Soarele cu circa opt minute în urmă.',
   'Dacă p=0,2 secunde de arc, d=1/0,2=5 pc. Pentru p=0,1 arcsec, d=10 pc. Un unghi mai mic indică o distanță mai mare numai dacă este vorba despre aceeași definiție a paralaxei.',
   'O stea cu modulul distanței μ=5 este la 100 pc în modelul fără extincție: 5=5 log₁₀(d/10), deci d/10=10. În practică extincția interstelară și precizia fotometriei pot modifica estimarea.'
  ],
  questions:[
   'Care este diferența dintre UA, anul-lumină și o secundă?',
   'Cam cât timp îi ia luminii să ajungă de la Soare la Pământ?',
   'Ce distanță corespunde paralaxei anuale de 0,2 arcsec?',
   'Ce presupunere din modelul μ=m−M poate afecta distanța determinată fotometric?'
  ],
  answers:[
   'UA și anul-lumină sunt unități de distanță; secunda este o unitate de timp.',
   'Circa 500 s, adică 8 min 20 s, pentru distanța medie.',
   '5 parseci.',
   'Ignorarea extincției și a incertitudinii privind magnitudinea absolută.'
  ]
 },
 gravity:{
  title:'Gravitație, mișcare orbitală și legile lui Kepler',
  theory:[
   'Gravitația este interacțiunea dintre mase. O orbită nu înseamnă lipsa gravitației: corpul cade continuu în jurul centrului de atracție din cauza vitezei sale tangentiale.',
   'Pentru o orbită circulară, gravitația oferă accelerația centripetă. Folosim G, M și r cu unitățile lor, nu confundăm raza corpului cu raza orbitei.',
   'Legile lui Kepler descriu orbite eliptice, ariile măturate în intervale egale și legătura dintre perioada orbitală și semiaxa mare. Ele sunt exacte pentru problema ideală cu două corpuri punctiforme.',
   'Un model orbital numeric presupune condiții inițiale, mase, pași de timp și o metodă de integrare. Perturbațiile, relativitatea și erorile numerice pot schimba predicțiile.'
  ],
  formulas:['F=Gm₁m₂/r²', 'v=√(GM/r), pentru orbită circulară',
   'T²=4π²a³/(G(M+m)), aproximație cu două corpuri',
   'ε=v²/2−GM/r, energie orbitală specifică'],
  worked:[
   'Dacă două mase sunt păstrate, dar distanța dintre centre se dublează, F scade de patru ori: noua distanță este 2r, deci (2r)²=4r². Este o comparație de forțe, nu o descriere a unui sistem solar complet.',
   'În jurul aceleiași mase centrale, dacă raza unei orbite circulare se multiplică de patru ori, viteza orbitală scade la jumătate: v₂/v₁=√(r₁/r₂)=1/2.',
   'Pentru două planete în jurul aceluiași Soare, dacă semiaxa crește de la 1 UA la 9 UA, raportul perioadelor este 9^(3/2)=27. Calculul nu afirmă că există o planetă pe orbita ipotetică.',
   'În problema cu două corpuri, ε negativ indică orbită legată, ε=0 cazul parabolic, iar ε pozitiv o traiectorie nelegată. Pentru o valoare numerică trebuie cunoscute viteza, distanța și masa centrală.'
  ],
  questions:[
   'Cum se schimbă forța gravitațională când distanța se dublează?',
   'Ce se întâmplă cu viteza circulară dacă raza orbitală crește de patru ori?',
   'Care este raportul perioadelor pentru semiaxe de 1 și 9 UA?',
   'Ce semn are energia orbitală specifică pentru o orbită legată?'
  ],
  answers:[
   'Devine de patru ori mai mică.', 'Viteza scade la jumătate.',
   'Raportul este 27.', 'Energia orbitală specifică este negativă.'
  ]
 },
 stars:{
  title:'Lumina și evoluția stelelor',
  theory:[
   'Stelele produc energie prin reacții nucleare în regiuni interne. Lumina și culoarea observate ajută la aproximarea temperaturii și a compoziției, dar sunt afectate de mediu și instrument.',
   'Luminozitatea intrinsecă L diferă de fluxul recepționat F. Pentru o sursă izotropă și fără absorbție, fluxul scade proporțional cu pătratul distanței.',
   'Diagrama Hertzsprung–Russell compară luminozitatea cu temperatura sau tipul spectral. O stea poate parcurge faze diferite în evoluție, iar durata depinde puternic de masa inițială.',
   'Spectrele, distanțele și erorile fotometrice trebuie tratate împreună. Un model de evoluție este verificat pe populații stelare, nu prin citirea unei singure imagini frumoase.'
  ],
  formulas:['Temperatura de culoare și spectrul sunt corelate, dar depind de model',
   'F=L/(4πd²), pentru emisie izotropă fără absorbție',
   'L=4πR²σT⁴, model Stefan–Boltzmann',
   'ΔL/L≈2ΔR/R+4ΔT/T, aproximație de ordinul întâi'],
  worked:[
   'Compară două stele reprezentate cu temperaturi de culoare diferite: cea albastră poate fi mai fierbinte decât cea roșie. Culoarea singură nu determină masa sau distanța și poate fi schimbată de praful interstelar.',
   'La aceeași luminozitate, o stea aflată la o distanță dublă ar avea fluxul primit de patru ori mai mic: F₂/F₁=(d₁/d₂)²=1/4. Aceasta presupune lipsa extincției.',
   'Dacă două stele au aceeași rază, dar una are temperatura efectivă dublă, luminozitatea de corp negru crește de 2⁴=16 ori. Este un calcul de model, nu o măsurare directă.',
   'Dacă raza are incertitudine relativă 2% și temperatura 1%, o estimare conservatoare liniară dă incertitudinea L de aproximativ 2×2%+4×1%=8%. Erorile independente tratate statistic pot conduce la alt rezultat.'
  ],
  questions:[
   'Este mai sigur să inferăm masa unei stele doar din culoare sau din mai multe observații?',
   'Cum se schimbă fluxul la dublarea distanței, dacă luminozitatea rămâne constantă?',
   'De câte ori crește L când T se dublează la rază constantă?',
   'De ce trebuie menționate incertitudinile lui R și T când estimăm L?'
  ],
  answers:[
   'Din mai multe observații corelate, cu ipotezele și incertitudinile precizate.',
   'Scade la un sfert.', 'Crește de 16 ori.',
   'Fiindcă L depinde de pătratul razei și de a patra putere a temperaturii.'
  ]
 },
 galaxies:{
  title:'Galaxii, populații stelare și structuri mari',
  theory:[
   'O galaxie este un sistem gravitațional de stele, gaze, praf și materie întunecată. Există morfologii diverse: spirale, eliptice și neregulate. Forma nu dovedește singură vârsta galaxiei.',
   'Într-un model simplificat, viteza pe o orbită circulară satisface v²=GM(r)/r. Curbele de rotație trebuie comparate cu distribuția masei vizibile și cu incertitudinile observațiilor.',
   'Luminozitatea totală a unei galaxii combină populații stelare, praf și emisie de gaz. Spectrul și culoarea integrate pot indica formarea stelară și extincția.',
   'Galaxiile fac parte din grupuri, roiuri și structuri cosmice. Observația la redshift diferit sondează perioade diferite din istoria Universului și cere un model cosmologic.'
  ],
  formulas:['Morfologie ≠ diagnostic unic de vârstă sau istorie',
   'v²(r)=GM(r)/r, aproximație circulară sferică',
   'F_total=Σ F_i pentru surse necorelate optic',
   '1+z=λ_observată/λ_emisă'],
  worked:[
   'În două desene, o galaxie spirală prezintă disc și brațe, iar una eliptică are contur neted. În clasificarea reală trebuie să verificăm unghiul de privire și rezoluția: un disc văzut din muchie nu arată brațe evidente.',
   'Dacă viteza orbitală rămâne aproximativ constantă când raza r se dublează, atunci M(r)≈v²r/G trebuie să crească aproximativ de două ori. Nu rezultă dintr-o singură măsurare o distribuție unică a materiei.',
   'Pentru două populații care furnizează fiecare fluxul F, fluxul total este 2F. Magnitudinile nu se adună ca fluxurile: scara lor este logaritmică.',
   'O linie spectrală cu λ_emisă=500 nm și λ_observată=550 nm are z=550/500−1=0,1. Pentru a interpreta distanța cosmică trebuie precizat modelul cosmologic și corecțiile necesare.'
  ],
  questions:[
   'Poți determina vârsta unei galaxii doar după forma ei?',
   'Ce sugerează un profil v(r) aproximativ constant asupra masei M(r)?',
   'De ce nu adunăm direct magnitudinile a două populații stelare?',
   'Ce valoare are z pentru linia de 500 nm văzută la 550 nm?'
  ],
  answers:[
   'Nu; morfologia singură nu este suficientă.',
   'Masa cuprinsă în raza r crește aproximativ proporțional cu r, în model.',
   'Magnitudinea este logaritmică; se adună mai întâi fluxurile.',
   'z=0,1.'
  ]
 },
 observations:{
  title:'Observație, spectroscopie și instrumente',
  theory:[
   'Înainte de o observație definim obiectul, aparatul, data, expunerea și variabilele. Cerul și instrumentele au limite de vizibilitate, rezoluție și sensibilitate.',
   'Rezoluția de difracție a unui telescop circular ideal poate fi estimată cu unghiul Rayleigh θ≈1,22 λ/D. O apertură mai mare separă, în principiu, obiecte mai apropiate angular.',
   'Spectroscopia descompune lumina după lungimea de undă. Liniile de absorbție și emisie sunt semnături utile, dar măsurarea cere calibrare, eliminarea zgomotului și cunoașterea instrumentului.',
   'Un proiect observațional verificabil include date brute, corecții, metoda de analiză și estimarea incertitudinii. O imagine generată sau un desen nu reprezintă o măsurare.'
  ],
  formulas:['Date minime: timp, poziție, instrument, condiții',
   'θ≈1,22 λ/D (radiani), apertură circulară ideală',
   'z=(λ_observată−λ_referință)/λ_referință',
   'SNR=semnal/zgomot, cu definiția zgomotului precizată'],
  worked:[
   'O observație se înregistrează cu data, ora, locul, condițiile cerului și instrumentul. Două desene ale Lunii fără date nu pot proba schimbarea unei faze într-un interval exact.',
   'Pentru λ=500 nm și D=0,10 m: θ≈1,22×5×10⁻⁷/0,1≈6,1×10⁻⁶ rad. Valoarea ideală nu include turbulența atmosferică ori erorile optice.',
   'O linie de laborator de 500 nm apare măsurată la 505 nm. În aproximarea simplă, z=(505−500)/500=0,01. Este necesară calibrarea spectrografului înainte de o interpretare Doppler.',
   'Dacă semnalul este 100 de unități, iar zgomotul RMS măsurat 10 unități pe aceeași scară, SNR=10. Fără modelul de zgomot nu putem transforma automat SNR într-o incertitudine completă.'
  ],
  questions:[
   'Care sunt datele minime ce însoțesc o observație?',
   'Cum variază rezoluția ideală θ la dublarea aperturii D?',
   'Cât este z pentru linia 500 nm observată la 505 nm?',
   'Ce reprezintă SNR și ce nu ne spune singur despre eroare?'
  ],
  answers:[
   'Data, ora, locul, obiectul, instrumentul și condițiile relevante.',
   'Unghiul limită θ se înjumătățește dacă λ rămâne fixă.',
   'z=0,01.',
   'Raportul semnal/zgomot; nu include automat toate erorile sistematice.'
  ]
 },
 cosmology:{
  title:'Expansiunea cosmică și modelele Universului',
  theory:[
   'La scări cosmice, observăm că lumina multor galaxii este deplasată spre roșu. Interpretarea cosmologică presupune un model al expansiunii spațiului, nu deplasarea galaxiilor printr-un spațiu rigid.',
   'Pentru distanțe relativ mici și redshift mic, legea lui Hubble–Lemaître dă v≈H₀d. Constanta H₀ are unități de viteză pe distanță; estimările observate trebuie însoțite de surse și incertitudini.',
   'Radiația cosmică de fond și abundențele elementelor ușoare sunt dovezi importante pentru istoria termică a Universului. Niciuna nu justifică extrapolarea dincolo de domeniul modelului fără rezerve.',
   'Parametrii cosmologici sunt determinați prin ajustarea simultană a mai multor seturi de date. Se compară predicții, incertitudini și posibile prejudecăți de selecție.'
  ],
  formulas:['1+z=λ_obs/λ_rest',
   'v≈H₀d, numai pentru distanțe și z suficient de mici',
   'T_CMB≈2,725 K (valoare medie observată)',
   'χ²=Σ[(date_i−model_i)/σ_i]², pentru erori independente'],
  worked:[
   'O linie care ar avea 400 nm în laborator este observată la 440 nm: z=(440−400)/400=0,1. Aceasta este o măsură a deplasării spectrale; nu reprezintă direct distanța fără un model.',
   'Folosind numai pentru exercițiu H₀=70 km/s/Mpc și d=100 Mpc, rezultă v≈7 000 km/s. Legea liniară este o aproximație locală, nu o formulă exactă pentru galaxii la redshift mare.',
   'O radiație termică de circa 2,7 K este mai rece decât radiația emisă inițial într-un Univers timpuriu mai dens și mai fierbinte. Evoluția temperaturii cere discutarea expansiunii, nu un simplu obiect care se răcește într-o cameră.',
   'Pentru două măsurări cu reziduuri de +1σ și −2σ, suma pătratelor normalizate este χ²=1+4=5. Fără grade de libertate și ipoteze statistice nu putem declara un model bun sau rău.'
  ],
  questions:[
   'Ce este redshiftul și poate fi convertit direct în distanță fără ipoteze?',
   'Ce viteză aproximativă dă H₀=70 km/s/Mpc la d=100 Mpc?',
   'De ce CMB este relevantă pentru istoria termică a Universului?',
   'De ce χ²=5 nu este suficient pentru a aprecia un model statistic?'
  ],
  answers:[
   'Este deplasarea relativă a lungimii de undă; conversia la distanță cere un model.',
   'Aproximativ 7 000 km/s, în ipoteza locală.',
   'Este o radiație relicvă cu spectru termic ce reflectă Universul timpuriu.',
   'Lipsesc gradele de libertate, modelul erorilor și criteriul de comparație.'
  ]
 },
 exoplanets:{
  title:'Exoplanete, tranzite și limitele detectării',
  theory:[
   'Exoplanetele sunt planete care orbitează alte stele. Tranzitul se observă când orbita este aliniată suficient pentru ca planeta să treacă prin fața discului stelar, reducând puțin fluxul luminos.',
   'Într-un model cu discuri uniforme și fără efecte de margine, adâncimea tranzitului este aproximativ δ≈(R_planetă/R_stea)². Alinierea și raportul de raze sunt esențiale.',
   'Durata, perioada și forma curbei de lumină ajută la inferarea geometriei orbitale. Petele stelare, erorile instrumentale și variațiile stelei pot imita sau distorsiona semnalul.',
   'Estimarea unei atmosfere prin spectroscopie este dificilă și presupune extragerea unui semnal mic. Un spectru detectat nu demonstrează singur existența vieții.'
  ],
  formulas:['δ≈(Rp/Rs)², model idealizat fără limb darkening',
   'δ=0,01 pentru Rp/Rs=0,1',
   'P este intervalul dintre tranzite repetate consecvent',
   'SNR≈adâncime/eroare RMS, pentru estimare simplificată'],
  worked:[
   'Dacă o planetă are raza de o zecime din raza stelei, fluxul scade aproximativ cu 1%, presupunând aliniere și discuri uniforme. Nu fiecare planetă va tranzita văzută de pe Pământ.',
   'Pentru Rp=0,05 Rs, δ≈0,05²=0,0025, adică 0,25%. Dacă fluxul de bază este 100%, fluxul în centrul tranzitului ideal ar scădea la aproximativ 99,75%.',
   'Două scăderi similare de flux separate prin 10 zile sugerează o perioadă de 10 zile numai dacă sunt tranzite consecutive ale aceleiași planete. Observații pierdute pot duce la perioade multipli.',
   'Dacă adâncimea nominală a semnalului este 0,5%, iar zgomotul RMS este 0,1%, estimarea SNR simplă este 5. Confirmarea necesită un model complet și eliminarea variabilității stelare.'
  ],
  questions:[
   'De ce numai unele exoplanete pot fi descoperite prin tranzit?',
   'Cât este adâncimea tranzitului pentru Rp/Rs=0,05?',
   'Poate un interval de 10 zile între două tranzite stabili singur perioada?',
   'Este justificată afirmația „am găsit viață” doar dintr-o variație slabă a unui spectru?'
  ],
  answers:[
   'Orbita trebuie să aibă o orientare potrivită față de observator.',
   '0,0025 sau 0,25%.',
   'Nu neapărat; pot exista tranzite neobservate, aliasuri sau semnale diferite.',
   'Nu; trebuie excluse explicații instrumentale, chimice și astrofizice alternative.'
  ]
 }
});

export function astronomyUpperSupplement({country='',grade='',years=[],topic=''}={}){
 const ordered=Array.isArray(years)?years:[];
 const index=ordered.findIndex(x=>String(x.id)===String(grade));
 const row=ASTRONOMY_UPPER_CHAPTERS[topic];
 if(!row||index<0)return null;
 const tier=ordered.length===1?0:Math.min(3,Math.round(index*3/(ordered.length-1)));
 const method=ASTRONOMY_UPPER_YEAR_METHODS[tier];
 const formula=row.formulas[tier],example=row.worked[tier];
 return {
  id:'astro-upper-'+String(country).toUpperCase()+'-'+String(grade)+'-'+topic+'-'+tier,
  topic,subject:'astronomy',stage:'upper',grade:String(grade),language:'ro',level:'medium',
  title:row.title+' · '+method.nameRo,
  statement:row.theory[tier]+' '+method.goalRo+' Nu interpretăm acest parcurs ca programa obligatorie a unei țări fără confirmarea profilului și a programei în vigoare.',
  formula,
  symbols:'Identifică fiecare variabilă, unitatea și condițiile în care relația fizică poate fi folosită. Nu folosi formula în afara ipotezelor ei.',
  method:method.assessmentRo,
  workedExample:example,
  exercise:row.questions[tier],answer:row.answers[tier],
  curriculumScope:'Autoriat original pentru liceu; secvență orientativă, nu programă oficială certificată.',
  laboratoryType:'documented-model-or-dataset',
  sourceId:'astro-upper-'+topic+'-'+tier
 };
}
