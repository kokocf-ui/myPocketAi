// General Astronomy & Astrophysics reference: accessible directly from the year selector.
// Independent of any national school curriculum; includes laws, observational relations and IAU constants.
export const ASTRONOMY_LAWS_GROUPS = Object.freeze([
  { id: 'celestial', ro: 'Mecanică cerească și gravitație', en: 'Celestial mechanics and gravity' },
  { id: 'radiation', ro: 'Radiație și fotometrie', en: 'Radiation and photometry' },
  { id: 'distances', ro: 'Distanțe și astrometrie', en: 'Distances and astrometry' },
  { id: 'spectroscopy', ro: 'Spectre și astrofizică stelară', en: 'Spectra and stellar astrophysics' },
  { id: 'cosmology', ro: 'Galaxii și cosmologie', en: 'Galaxies and cosmology' },
  { id: 'constants', ro: 'Constante și unități IAU', en: 'IAU constants and units' }
]);

const ROWS = [
  [
    'kepler-1', 'celestial', 'law',
    'Prima lege a lui Kepler (legea elipselor)',
    "Kepler's first law (law of ellipses)",
    'r(θ) = a(1 − e²) / (1 + e·cos θ)',
    ' Într-o problemă ideală a două corpuri legate gravitațional, orbita unei planete în jurul stelei este o elipsă, centrul de masă (aproximativ steaua, când masa ei domină) aflându-se într-unul dintre focare.',
    'In an ideal bound two-body gravitational system, a planet orbits on an ellipse with the system barycentre (approximately the star when its mass dominates) at one focus.',
    'Pentru Pământ (a ≈ 1,000 UA, e ≈ 0,0167), distanța la periheliu este a(1 − e) ≈ 0,983 UA, iar la afeliu a(1 + e) ≈ 1,017 UA.',
    'For Earth (a ≈ 1.000 AU, e ≈ 0.0167), perihelion is a(1 − e) ≈ 0.983 AU and aphelion is a(1 + e) ≈ 1.017 AU.',
    'Valabilă exact pentru două corpuri punctiforme în gravitație newtoniană; perturbațiile altor planete și efectele relativiste (ex. Mercur) produc precesia periheliului.',
    'Exact for two point masses in Newtonian gravity; planetary perturbations and relativistic effects cause perihelion precession.'
  ],
  [
    'kepler-2', 'celestial', 'law',
    'A doua lege a lui Kepler (legea ariilor)',
    "Kepler's second law (law of equal areas)",
    'dA/dt = L / (2m) = constantă',
    'Raza vectoare care unește astrul central cu planeta mătură arii egale în intervale de timp egale; consecință directă a conservării momentului cinetic în câmp de forțe centrale.',
    'The line joining the central body and the orbiting body sweeps out equal areas in equal times, expressing conservation of angular momentum under a central force.',
    'O cometă cu orbită alungită are la periheliu (r mic) o viteză mult mai mare decât la afeliu: r_p·v_p = r_a·v_a.',
    'A comet on an eccentric orbit moves much faster at perihelion than at aphelion: r_p·v_p = r_a·v_a.',
    'Presupune că asupra corpului acționează doar forța centrală (fără frânare atmosferică sau jeturi cometare negravitaționale semnificative).',
    'Requires a purely central net force without atmospheric drag or strong non-gravitational outgassing torques.'
  ],
  [
    'kepler-3', 'celestial', 'law',
    'A treia lege a lui Kepler (forma newtoniană)',
    "Kepler's third law (Newtonian form)",
    'T² = [4π² / G(M + m)] · a³',
    'Pătratul perioadei orbitale T este proporțional cu cubul semiaxei mari a și invers proporțional cu suma maselor celor două corpuri; permite cântărirea stelelor, planetelor cu sateliți și sistemelor binare.',
    'The square of the orbital period is proportional to the cube of the semi-major axis divided by the total mass, enabling mass determination for stars, planets with moons, and binaries.',
    'Pentru o planetă cu m ≪ M☉ în jurul Soarelui, în unități astronomice și ani siderali: T²(ani) ≈ a³(UA); pentru Jupiter cu a ≈ 5,20 UA rezultă T ≈ √(5,20³) ≈ 11,86 ani.',
    'Around a 1 M☉ star with m ≪ M☉, T²(yr) ≈ a³(AU); for Jupiter at a ≈ 5.20 AU, T ≈ √(5.20³) ≈ 11.86 yr.',
    'Forma simplificată T² = a³ este valabilă DOAR pentru orbite în jurul unei mase totale de 1 M☉; pentru alte stele sau sisteme planetă-satelit trebuie păstrat factorul G(M + m).',
    'The simplified T² = a³ holds ONLY when M + m = 1 M☉; for other stars or planet–moon systems include G(M + m).'
  ],
  [
    'newton-gravitation', 'celestial', 'law',
    'Legea atracției universale (Newton)',
    "Newton's law of universal gravitation",
    'F = G·M·m / r²',
    'Două corpuri cu simetrie sferică sau dimensiuni mici față de distanța r se atrag cu o forță direct proporțională cu produsul maselor și invers proporțională cu pătratul distanței dintre centrele lor.',
    'Two spherically symmetric or distant bodies attract with a force proportional to the product of their masses and inversely proportional to the square of the centre-to-centre separation.',
    'Dublarea distanței r dintre două corpuri reduce forța gravitațională de 4 ori (F ∝ 1/r²).',
    'Doubling the centre-to-centre distance r reduces gravitational attraction by a factor of four.',
    'Aproximație clasică excelentă pentru câmpuri gravitaționale slabe și viteze v ≪ c; în apropierea obiectelor compacte este necesară relativitatea generală.',
    'Accurate for weak fields and v ≪ c; near compact objects or at high precision, general relativity is required.'
  ],
  [
    'vis-viva-escape', 'celestial', 'theorem',
    'Ecuația vis-viva, viteza orbitală și viteza de evadare',
    'Vis-viva equation, circular and escape speeds',
    'v² = GM(2/r − 1/a);  v_c = √(GM/r);  v_ev = √(2GM/r)',
    'Din conservarea energiei mecanice rezultă viteza pe orice orbită kepleriană; la aceeași distanță r de un corp sferic, viteza parabolică de evadare este de √2 ori viteza pe orbita circulară.',
    'Mechanical energy conservation relates orbital speed to distance r and semi-major axis a; at any radius r, parabolic escape speed equals √2 times circular orbital speed.',
    'La suprafața Pământului (fără rezistența aerului), v_c ≈ 7,91 km/s, iar v_ev = √2 · v_c ≈ 11,19 km/s.',
    'Near Earth’s surface (neglecting air drag and rotation), v_c ≈ 7.91 km/s and v_ev ≈ 11.19 km/s.',
    'Calculul ideal neglijează atmosfera, rotația corpului central și atracția altor corpuri din sistem.',
    'Idealised values neglect atmospheric drag, planetary rotation and third-body gravity.'
  ],
  [
    'roche-limit', 'celestial', 'principle',
    'Limita Roche și forțele mareice',
    'Roche limit and tidal forces',
    'd_R ≈ 2,44 · R_M · (ρ_M / ρ_m)^(1/3)  (corp fluid)',
    'Sub o distanță critică față de corpul masiv, diferența de atracție gravitațională (forța mareică) depășește autogravitația unui satelit fără coeziune internă puternică, putând produce destrămarea lui în inele.',
    'Inside a critical distance from a primary body, differential gravitational (tidal) forces exceed a fluid satellite’s self-gravity, favouring disruption or ring formation.',
    'Inelele principale ale lui Saturn se află în interiorul sau în vecinătatea limitei Roche pentru corpuri înghețate.',
    'Saturn’s main rings lie within or near the Roche zone for icy bodies.',
    'Coeficientul numeric depinde de rigiditate (≈1,26 corp rigid sferic vs ≈2,44 fluid sincron); sateliții mici artificiali sau stâncoși rezistă prin coeziune materială.',
    'The prefactor depends on rigidity and spin; small cohesive rocks and spacecraft are held together by tensile strength, not self-gravity.'
  ],
  [
    'inverse-square-flux', 'radiation', 'law',
    'Legea inversului pătratului distanței pentru fluxul radiativ',
    'Inverse-square law for radiative flux',
    'F = L / (4π·d²)',
    'Pentru o sursă izotropă de luminozitate bolometrică L în spațiu transparent, fluxul măsurat F (puterea pe unitatea de arie perpendiculară) scade invers proporțional cu pătratul distanței d.',
    'For an isotropic source of luminosity L in transparent space, the radiative flux F crossing unit perpendicular area decreases inversely with d².',
    'La d = 1 UA de Soare (L☉ ≈ 3,828×10²⁶ W), constanta solară este F ≈ 1361 W/m²; la 2 UA fluxul scade la ≈ 340 W/m².',
    'At 1 AU from the Sun, solar irradiance is ≈ 1361 W/m²; at 2 AU it drops by four to ≈ 340 W/m².',
    'Presupune emisie izotropă, absența extincției interstelare și distanțe locale (la scară cosmologică se folosește distanța de luminozitate d_L).',
    'Assumes isotropic emission, negligible interstellar extinction, and Euclidean geometry (cosmological scales require luminosity distance d_L).'
  ],
  [
    'wien-displacement', 'radiation', 'law',
    'Legea deplasării a lui Wien',
    "Wien's displacement law",
    'λ_max · T = b,  b ≈ 2,8978 × 10⁻³ m·K',
    'Lungimea de undă la care densitatea spectrală a radiației unui corp negru atinge maximul (în reprezentarea B_λ) este invers proporțională cu temperatura absolută T.',
    'The peak wavelength of blackbody spectral radiance per unit wavelength is inversely proportional to absolute temperature T.',
    'Pentru o fotosferă stelară cu T ≈ 5800 K, λ_max ≈ 2,898×10⁻³ / 5800 ≈ 500 nm (în domeniul vizibil verde-albăstrui).',
    'For T ≈ 5800 K, λ_max ≈ 500 nm in the visible spectrum.',
    'Spectrele stelare reale sunt doar aproximativ corpuri negre (au linii de absorbție), iar maximul în frecvență ν_max nu coincide numeric cu c/λ_max.',
    'Stellar spectra only approximate blackbodies, and peaking in B_ν gives a different numerical maximum than B_λ.'
  ],
  [
    'stefan-boltzmann-stellar', 'radiation', 'law',
    'Relația Stefan–Boltzmann pentru luminozitatea stelară',
    'Stefan–Boltzmann stellar luminosity relation',
    'L = 4π·R²·σ·T_ef⁴',
    'Luminozitatea totală L a unei stele sferice de rază R este definită prin temperatura efectivă T_ef a unui corp negru de aceeași arie care radiază aceeași putere totală.',
    'Total stellar luminosity L relates radius R and effective temperature T_eff via the Stefan–Boltzmann constant σ ≈ 5.6704×10⁻⁸ W·m⁻²·K⁻⁴.',
    'O gigantă roșie cu aceași T_ef dar rază R de 10 ori mai mare are luminozitatea de 10² = 100 ori mai mare; dublarea lui T_ef la R fix crește L de 16 ori.',
    'Increasing R tenfold at fixed T_eff raises L by 100; doubling T_eff at fixed R raises L by 2⁴ = 16.',
    'Definește T_ef pentru o fotosferă sferică; stelele rapid rotitoare sau cu anvelope extinse pot necesita modele detaliate.',
    'Defines T_eff for spherical photospheres; rapid rotators and extended envelopes deviate from a sharp surface.'
  ],
  [
    'pogson-magnitude', 'radiation', 'law',
    'Relația lui Pogson pentru magnitudinile aparente',
    'Pogson apparent magnitude relation',
    'm₁ − m₂ = −2,5 · log₁₀(F₁ / F₂)',
    'Scara logaritmică a magnitudinilor astronomice definește o diferență de 5 magnitudini ca un raport de flux exact egal cu 100; magnitudinile mai mici (sau negative) corespund obiectelor mai strălucitoare.',
    'The astronomical magnitude scale is logarithmic: a difference of 5 magnitudes corresponds to an exact flux ratio of 100, with smaller numbers indicating brighter sources.',
    'Dacă m₁ − m₂ = −5, atunci F₁/F₂ = 10^(5/2,5) = 100; o diferență de 1 magnitudine corespunde unui factor 10^0,4 ≈ 2,512 în flux.',
    'A 5-magnitude brighter star delivers 100× the flux; 1 magnitude corresponds to 10^0.4 ≈ 2.512 in flux.',
    'Magnitudinea depinde de banda fotometrică (V, B, G etc.) și de sistemul de calibrare (Vega sau AB).',
    'Always specify the photometric passband (e.g. V, G) and zero-point convention (Vega vs AB).'
  ],
  [
    'trigonometric-parallax', 'distances', 'principle',
    'Paralaxa trigonometrică anuală',
    'Annual trigonometric parallax',
    'd(pc) = 1 / p(″)',
    'Unghiul p sub care s-ar vedea semiaxa mare de 1 UA perpendicular pe direcția de privire definește parsecul: o stea cu paralaxa de 1 secundă de arc se află la distanța de 1 parsec.',
    'Annual parallax angle p (for a 1 AU perpendicular baseline) defines the parsec: p = 1 arcsecond corresponds to d = 1 pc ≈ 3.2616 light-years.',
    'Pentru Proxima Centauri, p ≈ 0,768″, deci d = 1 / 0,768 ≈ 1,30 pc ≈ 4,24 ani-lumină.',
    'Proxima Centauri has p ≈ 0.768″, giving d ≈ 1.30 pc ≈ 4.24 light-years.',
    'La unghiuri foarte mici incertitudinea de măsurare crește relativ cu distanța; astrometria spațială (ex. Gaia) extinde metoda la mii de parseci.',
    'Relative distance uncertainty grows when σ_p approaches p; space astrometry greatly extends ground-based limits.'
  ],
  [
    'distance-modulus', 'distances', 'law',
    'Modulul de distanță fotometric',
    'Photometric distance modulus',
    'm − M = 5 · log₁₀(d / 10 pc) + A',
    'Compararea magnitudinii aparente m cu magnitudinea absolută M (magnitudinea pe care ar avea-o sursa la 10 pc fără extincție) permite determinarea distanței d dacă extincția interstelară A este cunoscută.',
    'Relates apparent magnitude m, absolute magnitude M (defined at 10 pc), distance d in parsecs, and interstellar extinction A in the same band.',
    'Fără extincție (A = 0), o cefeidă cu m = 15,0 și M = −5,0 are m − M = 20 ⇒ d = 10 · 10^(20/5) = 10⁵ pc = 100 kpc.',
    'With A = 0, m = 15.0 and M = −5.0 give m − M = 20, so d = 10⁵ pc = 100 kpc.',
    'Ignorarea extincției cauzate de praful interstelar (A > 0) duce la supraestimarea sistematică a distanței.',
    'Neglecting interstellar dust extinction A > 0 systematically overestimates distance.'
  ],
  [
    'small-angle-formula', 'distances', 'principle',
    'Relația unghiurilor mici (diametru liniar și unghiular)',
    'Small-angle relation (angular and linear size)',
    'θ(rad) ≈ D / d;   D ≈ d · θ(″) / 206 265',
    'Pentru obiecte a căror dimensiune liniară D este mult mai mică decât distanța d, unghiul aparent θ în radiani este raportul D/d (1 rad ≈ 206 265″).',
    'When linear diameter D is much smaller than distance d, angular size in radians satisfies θ ≈ D / d (with 1 rad ≈ 206,265 arcseconds).',
    'La d ≈ 384 400 km și D ≈ 3474 km, Luna are θ ≈ 3474 / 384 400 ≈ 0,00904 rad ≈ 0,52° (≈ 31′).',
    'At d ≈ 384,400 km, the Moon’s 3474 km diameter subtends θ ≈ 0.00904 rad ≈ 0.52°.',
    'Aproximația tan θ ≈ θ este foarte precisă pentru θ ≪ 1 rad (sub câteva grade).',
    'Accurate only for small angles (θ ≪ 1 rad); at cosmological redshifts use angular-diameter distance d_A.'
  ],
  [
    'rayleigh-resolution', 'distances', 'principle',
    'Criteriul lui Rayleigh pentru rezoluția unghiulară a telescopului',
    'Rayleigh diffraction limit for telescopes',
    'θ_min ≈ 1,22 · λ / D',
    'Limita fundamentală de difracție a unei aperturi circulare de diametru D la lungimea de undă λ stabilește cel mai mic unghi θ_min (în radiani) la care două surse punctiforme pot fi separate.',
    'Diffraction by a circular aperture of diameter D at wavelength λ sets the minimum angular separation θ_min (in radians) between two resolved point sources.',
    'În vizibil (λ = 550 nm) un telescop ideal cu D = 0,20 m are θ_min ≈ 1,22 × 5,5×10⁻⁷ / 0,20 ≈ 3,36×10⁻⁶ rad ≈ 0,69″.',
    'At λ = 550 nm, an ideal D = 0.20 m aperture has θ_min ≈ 0.69″.',
    'De pe Pământ, turbulența atmosferică („seeing”, adesea ~1″) limitează telescoapele mari fără optică adaptivă.',
    'Ground-based telescopes without adaptive optics are often limited by atmospheric seeing rather than diffraction.'
  ],
  [
    'doppler-radial-velocity', 'spectroscopy', 'law',
    'Efectul Doppler nerelativist și viteza radială',
    'Non-relativistic Doppler shift and radial velocity',
    'Δλ / λ₀ = (λ − λ₀) / λ₀ ≈ v_r / c',
    'Deplasarea relativă a unei linii spectrale față de lungimea de undă de repaus λ₀ măsoară componenta vitezei pe direcția de privire: v_r > 0 (îndepărtare, spre roșu), v_r < 0 (apropiere, spre albastru).',
    'Fractional wavelength shift of a spectral line relative to rest wavelength λ₀ gives line-of-sight velocity v_r (>0 recession/redshift, <0 approach/blueshift) when |v_r| ≪ c.',
    'Dacă linia Hα (λ₀ = 656,28 nm) este observată la 656,50 nm, Δλ = +0,22 nm ⇒ v_r ≈ (0,22 / 656,28)·3,00×10⁵ ≈ +101 km/s.',
    'Observing Hα (656.28 nm) at 656.50 nm gives v_r ≈ +101 km/s away from the observer.',
    'Măsoară numai componenta radială (nu mișcarea transversală); pentru viteze comparabile cu c se folosește formula Doppler relativistă.',
    'Measures only radial motion; relativistic Doppler or cosmological relations are required when v is not ≪ c.'
  ],
  [
    'mass-luminosity', 'spectroscopy', 'principle',
    'Relația masă–luminozitate pe secvența principală',
    'Main-sequence mass–luminosity scaling',
    'L / L☉ ≈ (M / M☉)^α,  α ≈ 3,5 (orientativ pentru stele de masă intermediară)',
    'Pentru stelele de pe secvența principală aflate în echilibru hidrostatic cu fuziunea hidrogenului în nucleu, luminozitatea crește foarte puternic cu masa, reducând durata de viață nucleară τ ∝ M / L.',
    'For hydrogen-burning main-sequence stars, luminosity rises steeply with stellar mass, making massive stars much shorter-lived (τ ∝ M / L).',
    'O stea de secvență principală cu M ≈ 3 M☉ are o luminozitate de ordinul 3^3,5 ≈ 45–50 L☉ și o viață mult mai scurtă decât Soarele.',
    'A ~3 M☉ main-sequence star shines at tens of L☉ and exhausts core hydrogen far faster than the Sun.',
    'Relație empirică/model pe intervale de masă (exponentul α variază între piticele roșii și stelele foarte masive); NU se aplică gigantelor sau piticelor albe.',
    'Piecewise scaling across mass ranges; inapplicable to red giants, white dwarfs, or pre-main-sequence stars.'
  ],
  [
    'virial-theorem', 'spectroscopy', 'theorem',
    'Teorema virialului pentru sisteme gravitaționale în echilibru',
    'Virial theorem for bound gravitational systems',
    '2⟨K⟩ + ⟨U⟩ = 0  ⇒  E = ⟨K⟩ + ⟨U⟩ = ⟨U⟩ / 2 = −⟨K⟩',
    'Pentru un sistem autogravitațional staționar (stea în echilibru hidrostatic, roi stelar sau roi de galaxii), dublul energiei cinetice medii de mișcare internă echilibrează energia potențială gravitațională negativă.',
    'In a steady, self-gravitating bound system without dominant external pressure or magnetic terms, twice the time-averaged kinetic energy balances the negative gravitational potential energy.',
    'Din dispersia vitezelor galaxiilor într-un roi și raza caracteristică R se estimează masa dinamică totală M ~ R·σ_v² / G.',
    'Measuring velocity dispersion σ_v and characteristic radius R in a galaxy cluster yields dynamical mass M ~ R·σ_v² / G.',
    'Nu se aplică sistemelor neechilibrate dinamic (coliziuni recente, expansiune liberă) fără termeni suplimentari.',
    'Invalid for unrelaxed merging systems or when external pressure, rotation, or magnetic fields dominate.'
  ],
  [
    'chandrasekhar-limit', 'spectroscopy', 'principle',
    'Limita Chandrasekhar pentru piticele albe',
    'Chandrasekhar mass limit for white dwarfs',
    'M_Ch ≈ 1,4 M☉',
    'Masa maximă a unui rest stelar nerotitor susținut împotriva colapsului gravitațional de presiunea de degenerare a electronilor relativiști este aproximativ 1,4 mase solare.',
    'The maximum mass of a non-rotating stellar remnant supported by relativistic electron degeneracy pressure is roughly 1.4 solar masses.',
    'Resturile stelelor de masă mică și medie devin pitice albe cu M < M_Ch; depășirea limitei poate declanșa colapsul sau o supernovă termonucleară Ia.',
    'Typical carbon–oxygen white dwarfs have M ≈ 0.6 M☉ < M_Ch; approaching M_Ch can trigger collapse or Type Ia thermonuclear explosion.',
    'Valoarea exactă depinde ușor de compoziția chimică (numărul de electroni pe nucleon μ_e), de rotație și de câmpurile magnetice.',
    'Exact value depends slightly on composition (electron fraction μ_e), rapid rotation, and strong magnetic fields.'
  ],
  [
    'schwarzschild-radius', 'spectroscopy', 'law',
    'Raza Schwarzschild (orizontul unei găuri negre sferice)',
    'Schwarzschild radius (non-rotating black hole horizon)',
    'R_s = 2·G·M / c²',
    'În relativitatea generală, pentru o masă M sferic simetrică, nerotitoare și neutră electric, R_s definește raza orizontului evenimentelor din interiorul căruia nici lumina nu mai poate evada spre exterior.',
    'In general relativity, R_s is the event-horizon radius of an uncharged, non-rotating (Schwarzschild) mass M.',
    'Pentru M = 1 M☉, R_s ≈ 2,95 km; pentru M = 10 M☉, R_s ≈ 29,5 km (R_s ≈ 2,95 km · M/M☉).',
    'A 1 M☉ mass has R_s ≈ 2.95 km; a 10 M☉ black hole has R_s ≈ 29.5 km.',
    'Soarele are raza reală R☉ ≈ 695 700 km ≫ 2,95 km, deci nu este o gaură neagră; găurile negre rotitoare sunt descrise de metrica Kerr.',
    'Normal stars have R ≫ R_s; rotating black holes follow the Kerr solution rather than Schwarzschild.'
  ],
  [
    'hubble-lemaitre', 'cosmology', 'law',
    'Legea Hubble–Lemaître',
    'Hubble–Lemaître law',
    'v ≈ H₀ · d   (pentru z ≪ 1)',
    'La scară cosmologică mare, dincolo de grupările legate gravitațional local, viteza aparentă de recesiune a galaxiilor este proporțională cu distanța lor față de observator, reflectând expansiunea metrică a spațiului.',
    'Beyond gravitationally bound local structures and at small redshift (z ≪ 1), galactic recession velocity is proportional to distance due to metric expansion of space.',
    'Pentru H₀ = 70 km·s⁻¹·Mpc⁻¹ (valoare orientativă de lucru) și d = 100 Mpc, v ≈ 70 × 100 = 7000 km/s.',
    'Adopting H₀ = 70 km·s⁻¹·Mpc⁻¹ at d = 100 Mpc gives v ≈ 7000 km/s.',
    'Valabilă statistic la z ≪ 1 și la distanțe mari (galaxia Andromeda este legată local și se apropie); valoarea precisă a lui H₀ prezintă o mică tensiune între metodele cosmologice.',
    'Applies at z ≪ 1 on large scales where peculiar velocities are small; precise H₀ determinations differ slightly between early- and late-universe probes.'
  ],
  [
    'cosmological-redshift', 'cosmology', 'principle',
    'Deplasarea spre roșu cosmologică și factorul de scară',
    'Cosmological redshift and cosmic scale factor',
    '1 + z = λ_obs / λ_em = a(t₀) / a(t_em)',
    'Deplasarea spre roșu cosmologică z măsoară cu ce factor s-a dilatat factorul de scară a(t) al Universului între momentul emisiei luminii t_em și momentul recepției t₀.',
    'Cosmological redshift z directly measures the ratio of the present cosmic scale factor a(t₀) to its value a(t_em) when the light was emitted.',
    'O galaxie observată la z = 3 a emis lumina când factorul de scară era a(t_em) = a(t₀) / (1 + 3) = 1/4 din cel actual.',
    'Light from a source at cosmological z = 3 was emitted when cosmic scale lengths were 1/(1 + 3) = 1/4 of today’s.',
    'Pentru z ≳ 0,1 nu se mai poate folosi formula Doppler liniară v = c·z pentru calculul distanței; conversia z → distanță depinde de parametrii cosmologici (Ω_m, Ω_Λ, H₀).',
    'At z ≳ 0.1, do not equate c·z to physical speed or Hubble distance without integrating a cosmological model.'
  ],
  [
    'critical-density', 'cosmology', 'principle',
    'Densitatea critică și parametrul de densitate Ω',
    'Critical density and cosmological density parameter Ω',
    'ρ_c = 3·H² / (8π·G);   Ω = ρ / ρ_c',
    'În modelele Friedmann–Lemaître–Robertson–Walker, densitatea critică ρ_c marchează pragul geometric al secțiunilor spațiale plate (Ω_total = 1, incluzând materia și energia întunecată).',
    'In homogeneous isotropic FLRW cosmology, ρ_c is the total energy-equivalent mass density corresponding to spatially flat geometry (Ω_total = 1).',
    'Pentru H₀ ≈ 70 km·s⁻¹·Mpc⁻¹, ρ_c,0 ≈ 9,2 × 10⁻²⁷ kg/m³ (echivalentul câtorva atomi de hidrogen pe metru cub).',
    'For H₀ ≈ 70 km·s⁻¹·Mpc⁻¹, ρ_c,0 ≈ 9.2×10⁻²⁷ kg/m³, roughly five hydrogen atoms per cubic metre.',
    'Rezultat al cosmologiei relativiste omogene la scară mare; densitatea locală în galaxii și stele este cu multe ordine de mărime mai mare decât ρ_c.',
    'Applies only to the large-scale cosmic average, not inside bound galaxies or planetary systems.'
  ],
  [
    'iau-distance-units', 'constants', 'constant',
    'Unitatea astronomică (UA), anul-lumină (ly) și parsecul (pc)',
    'Astronomical unit (AU), light-year (ly) and parsec (pc)',
    '1 UA = 149 597 870 700 m (exact, IAU 2012);  1 pc = (648 000/π) UA ≈ 3,0857×10¹⁶ m ≈ 3,2616 ly',
    'Din 2012, UAI (IAU) definește unitatea astronomică drept o lungime convențională exactă în metri; anul-lumină este distanța parcursă de lumină în vid într-un an iulian (365,25 zile × 86 400 s), iar parsecul derivă geometric din UA.',
    'Since IAU 2012 Resolution B2, 1 AU is an exact SI length; 1 Julian light-year equals c × 365.25 × 86,400 s ≈ 9.4607×10¹⁵ m, and 1 pc = (648,000/π) AU.',
    'Lumina parcurge 1 UA în 149 597 870 700 / 299 792 458 ≈ 499,0 s ≈ 8 min 19 s.',
    'Light crosses 1 AU in 499.0 s ≈ 8 min 19 s.',
    'Anul-lumină este o unitate de DISTANȚĂ, niciodată de timp; păstrează unități coerente (SI sau UA–pc) în toate formulele.',
    'A light-year measures DISTANCE, never time; convert consistently to SI metres before combining with G or c.'
  ],
  [
    'iau-solar-constants', 'constants', 'constant',
    'Parametrii solari nominali (IAU 2015 Rezoluția B3)',
    'Nominal solar conversion parameters (IAU 2015 B3)',
    'R☉ = 6,957×10⁸ m;  L☉ = 3,828×10²⁶ W;  T_ef,☉ = 5772 K;  (GM)☉ = 1,3271244×10²⁰ m³/s²',
    'Pentru reproductibilitate în calcule stelare și exoplanetare, UAI stabilește constante solare nominale fixe, separându-le de micile variații ale măsurătorilor solare și ale constantei gravitaționale G.',
    'IAU 2015 defines fixed nominal solar constants so stellar and exoplanet quantities expressed in solar units remain exact and reproducible.',
    'Cu G = 6,67430×10⁻¹¹ m³·kg⁻¹·s⁻², masa solară corespunzătoare este M☉ = (GM)☉ / G ≈ 1,9884×10³⁰ kg.',
    'Combining nominal (GM)☉ with CODATA G gives M☉ ≈ 1.9884×10³⁰ kg.',
    'În dinamica orbitală de înaltă precizie se folosește direct parametrul gravitațional (GM)☉, cunoscut cu mult mai multe cifre semnificative decât G sau M☉ separat.',
    'High-precision orbital dynamics uses (GM)☉ directly because G alone has a larger relative experimental uncertainty.'
  ]
];

export const ASTRONOMY_LAWS = Object.freeze(
  ROWS.map(([id, group, type, ro, en, formula, explainRo, explainEn, exampleRo, exampleEn, scopeRo, scopeEn]) =>
    Object.freeze({
      id,
      group,
      type,
      subject: 'astronomy',
      ro: ro.trim(),
      en: en.trim(),
      formula: formula.trim(),
      explainRo: explainRo.trim(),
      explainEn: explainEn.trim(),
      exampleRo: exampleRo.trim(),
      exampleEn: exampleEn.trim(),
      scopeRo: scopeRo.trim(),
      scopeEn: scopeEn.trim()
    })
  )
);
