// Original bilingual specialisation-specific university Physics studies.
// The cases are for introductory advanced study; they are NOT country-level
// degree accreditation, nor the full syllabus of any university programme.
// Every case has an independently checkable numerical or conceptual task.
const chapters={
  "special-quantum": [
    [
      "Lungimea de undă de Broglie",
      "În mecanica cuantică, impulsul unei particule este asociat cu lungimea de undă λ=h/p, în aproximarea potrivită. Relația nu descrie o undă mecanică clasică materială. Măsurarea impulsului are incertitudine și nu determină o orbită microscopică exactă.",
      "Pentru p=6,63×10⁻²⁴ kg·m/s, lungimea de undă este aproximativ 1,00×10⁻¹⁰ m.",
      "Ce se întâmplă cu λ dacă impulsul se dublează?",
      "Se înjumătățește, în modelul λ=h/p.",
      "De Broglie wavelength",
      "Quantum mechanics associates a particle's momentum with wavelength λ=h/p under the appropriate approximation. This is not an ordinary material wave travelling through a medium. Momentum measurement involves uncertainty and does not specify a classical microscopic orbit.",
      "For p=6.63×10⁻²⁴ kg·m/s, the wavelength is approximately 1.00×10⁻¹⁰ m.",
      "How does λ change if momentum doubles?",
      "It halves, using λ=h/p."
    ],
    [
      "Particula într-o cutie unidimensională",
      "Pentru o particulă într-un puț infinit cu lungime L, condițiile la limită impun stări staționare și energii En=n²h²/(8mL²), n=1,2,…. Energia minimă nu este zero, iar modelul depinde de condițiile potențialului ideal.",
      "Dacă L se dublează păstrând aceeași particulă și același n, nivelul energetic se reduce de patru ori.",
      "Cum se compară E2 și E1 la aceeași cutie?",
      "E2=4E1.",
      "Particle in an infinite one-dimensional well",
      "For a particle in an infinitely deep well of length L, boundary conditions allow stationary states with energies En=n²h²/(8mL²), n=1,2,…. The lowest energy is nonzero. This idealisation requires specified boundary conditions and cannot represent every real confining potential.",
      "If L doubles for the same particle and state number, its energy becomes one quarter as large.",
      "How does E2 compare with E1?",
      "E2=4E1."
    ],
    [
      "Principiul incertitudinii",
      "Pentru poziție și impuls, ΔxΔp≥ħ/2. Incertitudinile reprezintă distribuțiile măsurărilor într-o stare cuantică și nu se reduc doar la o defecțiune a instrumentului. Relația nu autorizează concluzia că toate mărimile sunt imposibil de cunoscut.",
      "Dacă Δx se micșorează de două ori, limita inferioară a incertitudinii pentru Δp se dublează.",
      "Ce limită implică un Δx de două ori mai mic?",
      "Δp trebuie să fie cel puțin de două ori mai mare decât vechea limită minimă.",
      "Position–momentum uncertainty",
      "Position and momentum uncertainties obey ΔxΔp≥ħ/2. The spreads describe possible measurement outcomes for a quantum state and are not merely flaws in measuring instruments. This relation does not mean that every physical quantity is unknowable.",
      "Reducing Δx by a factor of two doubles the minimum permitted Δp under the uncertainty inequality.",
      "What happens to the minimum permitted Δp when Δx halves?",
      "It doubles."
    ],
    [
      "Efectul fotoelectric",
      "Energia maximă a electronilor emiși dintr-un material iluminat satisface Kmax=hf−φ când hf depășește funcția de lucru φ. Intensitatea fasciculului poate modifica rata de emisie, dar nu energia maximă a unui electron în acest model.",
      "Pentru fotoni de 5 eV și φ=2 eV, energia cinetică maximă este 3 eV.",
      "Ce se întâmplă dacă hf este mai mic decât φ?",
      "Nu are loc emisie fotoelectrică simplă prin absorbția unui singur foton.",
      "Photoelectric effect",
      "The maximum kinetic energy of emitted electrons is Kmax=hf−φ when photon energy exceeds the work function φ. Increasing light intensity may change the emission rate, but not this maximum kinetic energy for the same frequency in the simple model.",
      "If photon energy is 5 eV and work function is 2 eV, the maximum electron kinetic energy is 3 eV.",
      "What if hf is below φ?",
      "Single-photon photoemission does not occur in the elementary model."
    ]
  ],
  "special-relativity": [
    [
      "Factorul Lorentz",
      "Pentru cadre inerțiale cu v<c, factorul Lorentz este γ=1/√(1−v²/c²). El se folosește în relații între măsurări ale unor observatori, nu pentru a susține că ceasurile se defectează la viteză mare.",
      "La v=0,6c, γ=1/√0,64=1,25.",
      "Care este γ pentru v=0?",
      "γ=1.",
      "Lorentz factor",
      "For relative speed v<c between inertial frames, γ=1/√(1−v²/c²). It relates measurements made by observers and does not imply that clocks physically malfunction at high velocity.",
      "At v=0.6c, γ=1/√0.64=1.25.",
      "What is γ when v=0?",
      "γ=1."
    ],
    [
      "Dilatarea timpului și timpul propriu",
      "Timpul propriu este intervalul măsurat de ceasul care însoțește cele două evenimente pe aceeași linie de univers. Pentru mișcare inerțială, un observator poate măsura Δt=γΔτ; trebuie precizat cadrul și care ceas măsoară timpul propriu.",
      "Dacă Δτ=8 s și γ=1,25, observatorul descris măsoară Δt=10 s.",
      "Ce timp corespunde la Δτ=12 s și γ=2?",
      "24 s.",
      "Proper time and time dilation",
      "Proper time is measured by a clock travelling along the same worldline between the two events. An inertial observer may measure Δt=γΔτ. Always identify the frame and specify which clock measures proper time.",
      "If Δτ=8 s and γ=1.25, the stated observer measures Δt=10 s.",
      "Find Δt for Δτ=12 s and γ=2.",
      "24 s."
    ],
    [
      "Energia de repaus",
      "E0=mc² reprezintă energia de repaus a unui sistem de masă m. Pentru un sistem complet, energia și impulsul trebuie analizate împreună; relația nu înseamnă că orice corp eliberează spontan întreaga energie de repaus.",
      "Pentru 1 g, adică 10⁻³ kg, E0≈9×10¹³ J folosind c≈3×10⁸ m/s.",
      "Care este energia de repaus pentru 2 g în aceeași aproximație?",
      "Aproximativ 1,8×10¹⁴ J.",
      "Rest energy",
      "E0=mc² is the rest energy associated with mass m. For a whole system, energy and momentum must be considered together. This relation does not mean any object spontaneously releases all its rest energy.",
      "For 1 g = 10⁻³ kg and c≈3×10⁸ m/s, E0≈9×10¹³ J.",
      "What is the corresponding rest energy for 2 g?",
      "About 1.8×10¹⁴ J."
    ],
    [
      "Deplasarea gravitațională spre roșu",
      "În aproximația câmpului gravitațional slab, între două înălțimi cu diferența h poate apărea Δf/f≈gh/c², în condiții de interpretare bine definite. Relația descrie frecvențe comparate între observatori, nu o schimbare arbitrară a constantei c.",
      "Pentru h=1000 m și g≈10 m/s², raportul este aproximativ 1,1×10⁻¹³.",
      "Ce se întâmplă cu aproximarea pentru h dublu, la celelalte date constante?",
      "Diferența fracțională se dublează.",
      "Weak-field gravitational frequency shift",
      "In a weak gravitational field, clocks or light signals at a height difference h may exhibit a fractional frequency shift Δf/f≈gh/c² under appropriate definitions. This does not involve changing the universal local value of c.",
      "For h=1000 m and g≈10 m/s², the fractional change is about 1.1×10⁻¹³.",
      "How does the approximation change when h doubles?",
      "The fractional shift doubles."
    ]
  ],
  "special-theory": [
    [
      "Analiza dimensională a modelelor",
      "Un model fizic trebuie să respecte dimensiunile termenilor. O formulă poate fi dimensional corectă și totuși falsă; de aceea trebuie confruntată cu condițiile de limită, date experimentale și simetrii.",
      "Pentru perioada unui pendul simplu, √(L/g) are dimensiune de timp; produsul Lg nu are.",
      "Are expresia L/g dimensiune de timp?",
      "Nu, de timp la pătrat.",
      "Dimensional analysis of models",
      "A physical model must be dimensionally homogeneous. A formula may pass that test and still be false, so limiting cases, empirical results and symmetries remain necessary checks.",
      "For the simple pendulum, √(L/g) has units of time, while Lg does not.",
      "Does L/g itself have the dimensions of time?",
      "No, it has dimensions of time squared."
    ],
    [
      "Ecuațiile Euler–Lagrange",
      "Pentru un sistem cu coordonată q și Lagrangian L(q,q̇,t), ecuația este d/dt(∂L/∂q̇)−∂L/∂q=0. Principiul variațional impune o clasă de traiectorii admisibile și condiții la limite, nu doar o regulă de derivare formală.",
      "Pentru particulă liberă L=m q̇²/2, rezultă m q̈=0 în coordonate carteziene inerțiale.",
      "Ce ecuație obții pentru L=mq̇²/2?",
      "q̈=0 pentru m nenul.",
      "Euler–Lagrange equations",
      "With coordinate q and Lagrangian L(q,q̇,t), the equation is d/dt(∂L/∂q̇)−∂L/∂q=0. A variational approach requires suitable paths and boundary conditions; it is not merely a formal differentiation recipe.",
      "For free motion L=m q̇²/2, the equation gives m q̈=0 in an inertial Cartesian coordinate.",
      "What does L=mq̇²/2 imply for nonzero m?",
      "q̈=0."
    ],
    [
      "Oscilatorul armonic",
      "Ecuația mẍ+kx=0 descrie un oscilator armonic ideal fără amortizare, cu pulsația ω=√(k/m). Condițiile inițiale stabilesc amplitudinea și faza; perioada nu depinde de amplitudine în modelul liniar.",
      "Dacă k=200 N/m și m=2 kg, rezultă ω=10 rad/s.",
      "Care este ω pentru k=50 N/m și m=2 kg?",
      "5 rad/s.",
      "Harmonic oscillator dynamics",
      "The equation mẍ+kx=0 models an ideal undamped harmonic oscillator with angular frequency ω=√(k/m). Initial conditions set amplitude and phase. The period is amplitude-independent only within the linear approximation.",
      "With k=200 N/m and m=2 kg, ω=10 rad/s.",
      "Find ω for k=50 N/m and m=2 kg.",
      "5 rad/s."
    ],
    [
      "Perturbații și validitatea aproximației",
      "Teoria perturbațiilor studiază sisteme apropiate de un model rezolvabil, descrise printr-un parametru mic ε. Un termen de ordin întâi nu este suficient dacă ε nu este mic sau dacă seria nu converge în domeniul analizat.",
      "Pentru E(ε)=E0+εE1+O(ε²), schimbarea aproximată la ordinul întâi este εE1.",
      "Ce termeni ignori în aproximarea de ordinul întâi?",
      "Termenii de ordinul ε² și mai mari.",
      "Perturbation theory and validity",
      "Perturbation methods treat systems near a solvable reference model, expanded in a small parameter ε. First-order terms are useful only when the approximation remains controlled; a formal series need not converge everywhere.",
      "For E(ε)=E0+εE1+O(ε²), the first-order correction is εE1.",
      "Which terms are omitted at first order?",
      "Terms of order ε² and higher."
    ]
  ],
  "special-condensed": [
    [
      "Rețeaua cristalină",
      "O rețea cristalină ideală este periodică în spațiu și permite folosirea unei celule elementare. Materialele reale prezintă defecte, suprafețe și variații termice ce influențează proprietățile macroscopice.",
      "Pentru un cristal cubic simplu cu latura a, volumul celulei elementare este a³.",
      "Ce volum are celula când latura se dublează?",
      "Volumul crește de opt ori.",
      "Crystal lattice and unit cell",
      "An ideal crystal lattice repeats periodically and can be described using a unit cell. Real materials have defects, surfaces and thermal motion that affect transport and other bulk properties.",
      "For a simple cubic unit cell of side a, its volume is a³.",
      "How does unit-cell volume change when a doubles?",
      "It increases eightfold."
    ],
    [
      "Modelul benzilor electronice",
      "În solide periodice, stările electronice formează benzi de energie. Ocuparea lor și existența unui interval interzis pot explica diferențe între metale, izolatori și semiconductori, dar interacțiunile puternice pot impune modele suplimentare.",
      "Într-un semiconductor, creșterea temperaturii poate modifica numărul purtătorilor de sarcină excitați peste banda interzisă.",
      "Înseamnă un interval interzis că orice material conduce zero la orice temperatură?",
      "Nu; temperatura, dopajul și defectele pot permite conducția.",
      "Electronic band model",
      "In a periodic solid, electron states form energy bands. Their occupation and possible gaps help distinguish metals, insulators and semiconductors, though strong correlations and disorder may require richer models.",
      "Raising the temperature in a semiconductor can increase the number of carriers thermally excited across its energy gap.",
      "Does a band gap prove zero conductivity at every temperature?",
      "No; temperature, defects and doping can allow conduction."
    ],
    [
      "Statistica Fermi–Dirac",
      "Ocuparea stărilor electronice de către fermioni poate fi descrisă prin f(E)=1/[exp((E−μ)/kBT)+1], în condiții de echilibru. La temperatură nulă modelul ideal are o treaptă la energia Fermi.",
      "Pentru E=μ și temperatură nenulă, f(E)=1/2.",
      "Care este ocupația f când E=μ?",
      "1/2.",
      "Fermi–Dirac statistics",
      "Equilibrium occupation of fermion states follows f(E)=1/[exp((E−μ)/kBT)+1]. In the ideal zero-temperature limit, the distribution becomes a step at the Fermi energy.",
      "At E=μ and nonzero temperature, f(E)=1/2.",
      "What is f at E=μ?",
      "1/2."
    ],
    [
      "Fononi și vibrații colective",
      "Vibrațiile rețelei cristaline pot fi descrise prin moduri normale cuantificate, numite fononi. Fononii contribuie la capacitatea calorică și transferul termic; nu trebuie confundați cu particule materiale independente din vid.",
      "Pentru un mod cu frecvență ν, un cuant de energie vibrațională este E=hν.",
      "Cum se schimbă energia unui fonon dacă frecvența se dublează?",
      "Se dublează.",
      "Phonons and collective modes",
      "Lattice vibrations can be expressed as normal modes whose quantised excitations are phonons. They contribute to thermal capacity and heat transport, but are not free material particles in a vacuum.",
      "For a vibrational frequency ν, a phonon carries quantum energy E=hν.",
      "What happens to its energy when ν doubles?",
      "It doubles."
    ]
  ],
  "special-nuclear": [
    [
      "Legea dezintegrării radioactive",
      "Pentru un ansamblu mare de nuclee independente, numărul mediu rămas poate fi descris prin N(t)=N0e^(−λt). Constanta λ este o rată de dezintegrare; modelul nu prezice când se dezintegrează un nucleu individual.",
      "La t=ln2/λ, rămâne în medie N0/2.",
      "Ce parte din N0 rămâne după două perioade de înjumătățire?",
      "Un sfert din N0.",
      "Radioactive decay law",
      "For a large population of independently decaying nuclei, the expected count follows N(t)=N0 exp(−λt). The constant λ is a decay rate and does not predict the exact decay time of an individual nucleus.",
      "At t=ln2/λ, on average N0/2 nuclei remain.",
      "What fraction remains after two half-lives?",
      "One quarter."
    ],
    [
      "Activitatea unui eșantion",
      "Activitatea A=λN descrie numărul mediu de dezintegrări pe secundă într-un model statistic, cu unitatea becquerel. Nu trebuie confundată cu doza absorbită sau cu periculozitatea fără context de expunere.",
      "Pentru λ=0,01 s⁻¹ și N=100000 de nuclee, A≈1000 Bq.",
      "Care este activitatea la N dublu, λ constant?",
      "De două ori mai mare.",
      "Activity of a radioactive sample",
      "Activity A=λN measures the average decay events per second in a statistical model and uses the becquerel. It is not the same physical quantity as absorbed dose or risk without exposure context.",
      "For λ=0.01 s⁻¹ and N=100,000 nuclei, A≈1000 Bq.",
      "What happens to activity if N doubles at fixed λ?",
      "It doubles."
    ],
    [
      "Energia de legătură nucleară",
      "Defectul de masă al unui nucleu corespunde energiei de legătură aproximativ prin E=Δmc². O energie de legătură mai mare pe nucleon poate indica stabilitate în context, dar nu permite singură predicția tuturor reacțiilor.",
      "Dacă Δm=10⁻³⁰ kg, E≈9×10⁻¹⁴ J cu c≈3×10⁸ m/s.",
      "Ce efect are dublarea lui Δm asupra energiei de legătură?",
      "Energia se dublează.",
      "Nuclear binding energy",
      "A mass defect Δm corresponds to binding energy E=Δmc². Binding energy per nucleon informs stability comparisons, but does not alone establish whether a particular reaction will proceed.",
      "For Δm=10⁻³⁰ kg and c≈3×10⁸ m/s, E≈9×10⁻¹⁴ J.",
      "What if the mass defect doubles?",
      "The binding energy doubles."
    ],
    [
      "Conservări într-o reacție nucleară",
      "O reacție nucleară trebuie să respecte conservarea sarcinii electrice, energiei și impulsului, precum și numărul barionic în modelele uzuale. Într-o emisie alfa, numărul de masă scade cu patru și numărul atomic cu doi.",
      "Pentru ²³⁸U→²³⁴Th+⁴He, numerele de masă și sarcină se conservă în bilanțul scris.",
      "Cum se schimbă Z la emisia alfa?",
      "Scade cu doi.",
      "Conservation in nuclear reactions",
      "Nuclear reactions must conserve electric charge, energy and momentum, as well as baryon number in ordinary models. In alpha decay, mass number decreases by four and atomic number by two.",
      "For ²³⁸U→²³⁴Th+⁴He, mass number and nuclear charge balance across the reaction.",
      "How does Z change in alpha decay?",
      "It decreases by two."
    ]
  ],
  "special-astro": [
    [
      "Paralaxa stelară",
      "Pentru obiecte suficient de apropiate, distanța în parseci poate fi estimată din paralaxa anuală în secunde de arc: d(pc)=1/p(arcsec). Relația cere ca unghiul să fie paralaxa definită corect, nu unghiul total de deplasare anuală.",
      "Pentru p=0,1'', distanța este 10 pc.",
      "Ce distanță corespunde paralaxei de 0,05''?",
      "20 pc.",
      "Stellar parallax",
      "For sufficiently nearby stars, distance in parsecs follows d(pc)=1/p(arcsec), where p is the properly defined annual parallax angle, not the full apparent angular shift over the year.",
      "A parallax of 0.1 arcsecond corresponds to 10 parsecs.",
      "What distance corresponds to 0.05 arcsecond?",
      "20 parsecs."
    ],
    [
      "Legea a treia a lui Kepler",
      "Pentru corpuri care orbitează aceeași masă centrală în aproximația kepleriană, T²∝a³. În unități de ani și unități astronomice pentru planete în jurul Soarelui, T²≈a³ în condiții potrivite.",
      "Pentru semiaxa mare a=4 UA, perioada orbitală este aproximativ 8 ani.",
      "Ce perioadă corespunde la a=9 UA în același model?",
      "27 de ani.",
      "Kepler's third law",
      "For bodies orbiting the same central mass within the Keplerian approximation, T²∝a³. In years and astronomical units for Solar-system-like orbits, T²≈a³ under the stated assumptions.",
      "At semimajor axis a=4 AU, the orbital period is about 8 years.",
      "Find orbital period for a=9 AU.",
      "27 years."
    ],
    [
      "Flux și luminozitate",
      "Pentru o sursă izotropă de luminozitate L, fluxul observat la distanța r este F=L/(4πr²), neglijând absorbția și alte pierderi. Luminozitatea intrinsecă nu este același lucru cu strălucirea aparentă.",
      "Dacă distanța până la aceeași stea se dublează, fluxul recepționat se reduce de patru ori.",
      "Cum variază fluxul când distanța se triplează?",
      "Devine de nouă ori mai mic.",
      "Flux versus luminosity",
      "For an isotropic emitter with luminosity L, observed flux is F=L/(4πr²) when absorption and other losses can be neglected. Intrinsic luminosity differs from apparent brightness.",
      "Doubling the distance to the same star reduces observed flux by a factor of four.",
      "How does flux change when distance triples?",
      "It becomes nine times smaller."
    ],
    [
      "Deplasarea maximului spectral",
      "Pentru un radiator aproximat prin corp negru, legea lui Wien este λmax T≈2,898×10⁻³ m·K. Spectrul real al stelelor are linii și particularități, iar culoarea dintr-o imagine prelucrată nu este o măsurare suficientă.",
      "Pentru T≈5800 K, lungimea de undă a maximului spectral este aproape 500 nm.",
      "Ce se întâmplă cu λmax dacă temperatura se dublează?",
      "Se înjumătățește.",
      "Wien displacement law",
      "For an approximately blackbody radiator, Wien's relation is λmax T≈2.898×10⁻³ m·K. Real stellar spectra have lines and other features, so colour in a processed photograph is not a complete temperature measurement.",
      "For T≈5800 K, the peak wavelength is near 500 nm.",
      "How does the peak wavelength change when temperature doubles?",
      "It halves."
    ]
  ],
  "special-applied": [
    [
      "Propagarea incertitudinii",
      "Pentru mărimi independente și o expresie y=x/z, incertitudinile relative mici pot fi combinate în cuadratură, în aproximația diferențială, fără a ignora corelațiile posibile. Un rezultat fără evaluarea incertitudinii poate fi înșelător.",
      "Dacă x are incertitudine relativă 3% și z 4%, atunci y are aproximativ 5% pentru erori necorelate.",
      "Ce rezultat relativ obții din 6% și 8% independente?",
      "Aproximativ 10%.",
      "Propagation of measurement uncertainty",
      "For independent quantities and y=x/z, small relative standard uncertainties can be combined in quadrature using a first-order approximation. Correlations and nonlinear effects must be considered when assumptions fail.",
      "With independent relative uncertainties of 3% and 4%, y has approximately 5% standard relative uncertainty.",
      "Combine independent 6% and 8% uncertainties.",
      "Approximately 10%."
    ],
    [
      "Răspunsul unui circuit RC",
      "Într-un circuit RC liniar ideal, constanta de timp este τ=RC. După o constantă de timp, tensiunea condensatorului la încărcare a atins aproximativ 63% din diferența finală într-un proces exponențial simplu.",
      "Pentru R=1000 Ω și C=100 μF, τ=0,1 s.",
      "Ce constantă de timp ai la R=2000 Ω și C=100 μF?",
      "0,2 s.",
      "RC circuit time constant",
      "In an ideal linear RC circuit, time constant τ=RC. After one time constant during simple charging, capacitor voltage reaches roughly 63% of its total change toward the final value.",
      "For R=1000 Ω and C=100 μF, τ=0.1 s.",
      "Find τ for R=2000 Ω and C=100 μF.",
      "0.2 s."
    ],
    [
      "Eșantionarea unui semnal",
      "Pentru a reconstrui un semnal band-limitat la frecvența maximă fmax, frecvența de eșantionare trebuie să depășească 2fmax, în condițiile teoremei Nyquist–Shannon. În practică filtrele anti-aliasing sunt importante.",
      "Pentru fmax=1 kHz, rata teoretică trebuie să depășească 2 kHz pentru o marjă sigură.",
      "Este suficientă rata de 1 kHz pentru fmax=1 kHz?",
      "Nu, este sub limita Nyquist.",
      "Sampling a signal",
      "Reconstruction of a signal limited to highest frequency fmax requires a sampling rate exceeding 2fmax under Shannon–Nyquist assumptions. Practical acquisition also needs suitable anti-alias filtering.",
      "For fmax=1 kHz, choose a sampling rate above 2 kHz for adequate margin.",
      "Can 1 kHz sampling reconstruct a 1 kHz band-limited maximum?",
      "No, it is below the Nyquist limit."
    ],
    [
      "Feedback și stabilitate",
      "Într-un control automat simplu, eroarea este diferența dintre referință și măsurare. Un feedback incorect poate amplifica oscilații, deci performanța și stabilitatea se verifică prin modele și teste sigure.",
      "Pentru temperatura dorită 22 °C și măsurată 20 °C, eroarea de reglare este +2 °C.",
      "Ce eroare apare la referință 18 °C și măsurare 21 °C?",
      "−3 °C.",
      "Feedback control and stability",
      "A basic controller defines an error as desired set point minus the measured value. Poorly tuned feedback may amplify oscillations, so stability and performance require appropriate models and safe testing.",
      "With a desired temperature of 22 °C and measured 20 °C, control error is +2 °C.",
      "What is the error for a set point of 18 °C and measurement of 21 °C?",
      "−3 °C."
    ]
  ]
};
export const PHYSICS_UNIVERSITY_STUDIES=Object.freeze(Object.fromEntries(
 Object.entries(chapters).map(([topic,entries])=>[topic,Object.freeze({
  ro:Object.freeze(entries.map((r,i)=>Object.freeze({id:topic+'-'+(i+1),title:r[0],explanation:r[1],workedExample:r[2],exercise:r[3],answer:r[4]}))),
  en:Object.freeze(entries.map((r,i)=>Object.freeze({id:topic+'-'+(i+1),title:r[5],explanation:r[6],workedExample:r[7],exercise:r[8],answer:r[9]})))
 })])));
